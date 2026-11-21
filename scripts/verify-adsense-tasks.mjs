import fs from 'node:fs';
import path from 'node:path';

console.log('=== RUNNING ADSENSE PREPARATION AUDIT ===\n');

// 1. Check banned strings in dist/
console.log('--- CHECK 3: Banned Strings in dist/ ---');
const bannedStrings = [
  'Variable Factor',
  'Constant Divider',
  '100 units',
  'comprehensive and highly accurate',
  'Coming Soon',
  'href="/tools"',
];

function scanDirForStrings(dir, patterns) {
  const matches = {};
  for (const p of patterns) matches[p] = [];

  function walk(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(current, ent.name);
      if (ent.isDirectory()) {
        walk(full);
      } else if (ent.isFile() && (ent.name.endsWith('.html') || ent.name.endsWith('.js') || ent.name.endsWith('.txt') || ent.name.endsWith('.xml'))) {
        const text = fs.readFileSync(full, 'utf8');
        for (const p of patterns) {
          if (text.includes(p)) {
            matches[p].push(path.relative('dist', full));
          }
        }
      }
    }
  }

  walk(dir);
  return matches;
}

const bannedResults = scanDirForStrings('dist', bannedStrings);
let bannedPassed = true;
for (const [pattern, files] of Object.entries(bannedResults)) {
  if (files.length === 0) {
    console.log(`PASS: "${pattern}" -> 0 occurrences`);
  } else {
    console.error(`FAIL: "${pattern}" -> found in:`, files);
    bannedPassed = false;
  }
}

// 2. Check dist/ads.txt
console.log('\n--- CHECK 5: dist/ads.txt verification ---');
const adsTxtPath = path.join('dist', 'ads.txt');
if (!fs.existsSync(adsTxtPath)) {
  console.error('FAIL: dist/ads.txt does not exist!');
} else {
  const buf = fs.readFileSync(adsTxtPath);
  const hasBOM = buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf;
  const content = buf.toString('utf8').trim();
  const expectedLine = 'google.com, pub-5194883113076568, DIRECT, f08c47fec0942fa0';
  console.log('BOM present:', hasBOM ? 'YES (FAIL)' : 'NO (PASS)');
  console.log('Exact content matches expected:', content === expectedLine ? 'YES (PASS)' : `NO (FAIL: "${content}")`);
}

// 3. Check pub- occurrences
console.log('\n--- CHECK 6: Publisher ID occurrences ---');
function findPubIds(targets) {
  const found = new Set();
  function checkFile(filePath) {
    const text = fs.readFileSync(filePath, 'utf8');
    const matches = text.match(/pub-\d+/g);
    if (matches) {
      for (const m of matches) found.add(m);
    }
  }
  function walk(d) {
    if (!fs.existsSync(d)) return;
    const stat = fs.statSync(d);
    if (stat.isFile()) {
      checkFile(d);
      return;
    }
    const entries = fs.readdirSync(d, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(d, ent.name);
      if (ent.isDirectory()) {
        walk(full);
      } else if (ent.isFile()) {
        checkFile(full);
      }
    }
  }
  for (const t of targets) walk(t);
  return [...found];
}

const pubIds = findPubIds(['index.html', 'public', 'dist']);
console.log('Distinct pub- IDs found in index.html, public, dist:', pubIds);
const onlyOurPub = pubIds.length === 1 && pubIds[0] === 'pub-5194883113076568';
console.log('Only target pub-5194883113076568 found:', onlyOurPub ? 'YES (PASS)' : 'NO (FAIL)');

// 4. Check Sitemap against dist
console.log('\n--- CHECK 7: Sitemap vs dist/ static HTML ---');
const sitemapXml = fs.readFileSync(path.join('public', 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
console.log(`Total sitemap URLs: ${sitemapUrls.length}`);
let sitemapErrors = 0;

for (const url of sitemapUrls) {
  if (url.includes('/tools') || url.includes('/blog')) {
    console.error(`FAIL: Sitemap contains forbidden route: ${url}`);
    sitemapErrors++;
  }
  const u = new URL(url);
  const route = u.pathname.replace(/^\/|\/$/g, '');
  const htmlPath = route === '' ? path.join('dist', 'index.html') : path.join('dist', route, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    console.error(`FAIL: Sitemap URL ${url} has no file at ${htmlPath}`);
    sitemapErrors++;
  } else {
    const html = fs.readFileSync(htmlPath, 'utf8');
    if (html.includes('noindex')) {
      console.error(`FAIL: Sitemap URL ${url} is marked noindex in HTML`);
      sitemapErrors++;
    }
  }
}
if (sitemapErrors === 0) {
  console.log('PASS: All sitemap URLs exist in dist/, have 200 static HTML, no noindex, 0 /tools or /blog URLs.');
}

// 5. Word count check for dist/calculator/*/index.html
console.log('\n--- CHECK 4: Calculator Word Counts & Duplicate Check ---');
const calcDirs = fs.readdirSync(path.join('dist', 'calculator'), { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

console.log(`Total calculators prerendered in dist/calculator: ${calcDirs.length}`);

function extractVisibleText(html) {
  let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
  cleaned = cleaned.replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, ' ');
  cleaned = cleaned.replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ');
  cleaned = cleaned.replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, ' ');
  cleaned = cleaned.replace(/<[^>]+>/g, ' ');
  cleaned = cleaned.replace(/&[a-z#0-9]+;/gi, ' ');
  return cleaned.trim();
}

function extractParagraphs(html) {
  const articleMatch = html.match(/<article[\s\S]*?<\/article>/i);
  if (!articleMatch) return [];
  let articleHtml = articleMatch[0];
  // Exclude aside (related calculators nav), nav, and footer sections from duplicate paragraph analysis
  articleHtml = articleHtml.replace(/<aside\b[^<]*(?:(?!<\/aside>)<[^<]*)*<\/aside>/gi, ' ');
  articleHtml = articleHtml.replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, ' ');
  const paras = [];
  const pMatches = articleHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi);
  for (const p of pMatches) {
    const text = p[1].replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').trim();
    if (text.length > 50) paras.push(text);
  }
  return paras;
}

const wordCounts = [];
const paragraphOccurrences = new Map();

for (const slug of calcDirs) {
  const htmlPath = path.join('dist', 'calculator', slug, 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  const visible = extractVisibleText(html);
  const words = visible.split(/\s+/).filter(Boolean);
  wordCounts.push({ slug, count: words.length });

  const paras = extractParagraphs(html);
  for (const para of paras) {
    if (!paragraphOccurrences.has(para)) paragraphOccurrences.set(para, []);
    paragraphOccurrences.get(para).push(slug);
  }
}

wordCounts.sort((a, b) => a.count - b.count);
console.log(`Word Count Range: Min = ${wordCounts[0].count} (${wordCounts[0].slug}), Max = ${wordCounts[wordCounts.length - 1].count} (${wordCounts[wordCounts.length - 1].slug})`);

const below500 = wordCounts.filter(w => w.count < 500);
if (below500.length > 0) {
  console.error('FAIL: Calculators below 500 words:', below500);
} else {
  console.log(`PASS: All ${wordCounts.length} calculators have >= 500 words!`);
}

// Check duplicates
const duplicates = [];
for (const [para, slugs] of paragraphOccurrences.entries()) {
  if (slugs.length > 1) {
    // ignore disclaimers or shared footer/header snippets
    duplicates.push({ slugs, sample: para.slice(0, 80) + '...' });
  }
}
console.log(`Duplicate paragraphs found across multiple calculators: ${duplicates.length}`);
if (duplicates.length > 0) {
  console.log('Duplicate samples:', duplicates.slice(0, 5));
}

// 6. Check 404.html
console.log('\n--- CHECK 404: dist/404.html verification ---');
const notFoundPath = path.join('dist', '404.html');
if (fs.existsSync(notFoundPath)) {
  const nf = fs.readFileSync(notFoundPath, 'utf8');
  console.log('dist/404.html exists:', true);
  console.log('Contains noindex:', nf.includes('noindex'));
  console.log('Contains link to /calculators:', nf.includes('href="/calculators"'));
  console.log('Contains link to /:', nf.includes('href="/"'));
} else {
  console.error('FAIL: dist/404.html does not exist!');
}
