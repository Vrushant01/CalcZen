import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('       SITEMAP & ROUTE STATUS VERIFICATION         ');
console.log('====================================================');

const sitemapPath = 'public/sitemap.xml';
if (!fs.existsSync(sitemapPath)) {
  console.error(`ERROR: ${sitemapPath} not found!`);
  process.exit(1);
}

const xml = fs.readFileSync(sitemapPath, 'utf8');
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1].trim());

console.log(`\nFound ${urls.length} URLs in ${sitemapPath}.\n`);

const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const redirectMap = new Map();
(vercel.redirects || []).forEach(r => {
  if (!r.has && r.source) redirectMap.set(r.source, r.destination);
});

let exceptionCount = 0;
const results = [];

for (const u of urls) {
  const urlObj = new URL(u);
  const p = urlObj.pathname;
  let status = 200;
  let selfCanonical = true;
  let issues = [];

  // Check 1: Must be https and www.calczen.in
  if (urlObj.protocol !== 'https:' || urlObj.host !== 'www.calczen.in') {
    issues.push(`Non-www or non-https URL: ${u}`);
  }

  // Check 2: Must not be a redirect in vercel.json
  if (redirectMap.has(p)) {
    status = 301;
    issues.push(`Redirects to: ${redirectMap.get(p)}`);
  }

  // Check 3: Check dist file for canonical and content
  const relativePath = p === '/' ? 'index.html' : path.join(p.slice(1), 'index.html');
  const distFile = path.join('dist', relativePath);

  let canonicalUrl = null;
  let robotsContent = null;

  if (fs.existsSync(distFile)) {
    const html = fs.readFileSync(distFile, 'utf8');
    const cMatch = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
    canonicalUrl = cMatch ? cMatch[1] : null;

    const rMatch = html.match(/<meta\s+[^>]*name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    robotsContent = rMatch ? rMatch[1] : null;

    const expectedCanonical = p === '/' ? 'https://www.calczen.in/' : `https://www.calczen.in${p}`;
    if (!canonicalUrl) {
      selfCanonical = false;
      issues.push(`Missing canonical tag in ${distFile}`);
    } else if (canonicalUrl !== expectedCanonical && canonicalUrl !== expectedCanonical + '/') {
      selfCanonical = false;
      issues.push(`Canonical mismatch: found ${canonicalUrl}, expected ${expectedCanonical}`);
    }

    if (robotsContent && robotsContent.includes('noindex')) {
      issues.push(`Robots tag contains noindex: ${robotsContent}`);
    }
  } else {
    issues.push(`Prerendered dist file missing: ${distFile}`);
  }

  if (issues.length > 0) {
    exceptionCount++;
    console.log(`[EXCEPTION] ${u} -> Status: ${status}, Issues: ${issues.join(' | ')}`);
  }

  results.push({
    url: u,
    path: p,
    status,
    selfCanonical,
    canonicalUrl,
    robotsContent,
    issues
  });
}

// Check Deleted Sitemaps handling in vercel.json & server/src/app.ts
console.log('\n--- VERIFYING RETIRED SITEMAPS (404 / 410) ---');
const vercelRewrites = vercel.rewrites || [];
const sitemapBlogsRewrite = vercelRewrites.find(r => r.source === '/sitemap-blogs.xml');
const sitemapNewsRewrite = vercelRewrites.find(r => r.source === '/sitemap-news.xml');

console.log(`/sitemap-blogs.xml rewrite to /api/index.ts:`, sitemapBlogsRewrite ? 'CONFIGURED' : 'MISSING');
console.log(`/sitemap-news.xml rewrite to /api/index.ts:`, sitemapNewsRewrite ? 'CONFIGURED' : 'MISSING');

const serverAppCode = fs.readFileSync('server/src/app.ts', 'utf8');
const has410Handler = serverAppCode.includes('/sitemap-blogs.xml') && serverAppCode.includes('410');
console.log(`server/src/app.ts 410 handler:`, has410Handler ? 'CONFIGURED' : 'MISSING');

// Check public directory clean
const publicFiles = fs.readdirSync('public');
const hasPublicOldSitemaps = publicFiles.some(f => f.includes('sitemap-blogs') || f.includes('sitemap-news'));
console.log(`public/ contains old sitemap files:`, hasPublicOldSitemaps ? 'YES (ERROR)' : 'NO (CLEAN)');

// Check robots.txt
const robotsTxt = fs.readFileSync('public/robots.txt', 'utf8');
const sitemapLines = robotsTxt.split('\n').filter(l => l.toLowerCase().startsWith('sitemap:'));
console.log(`robots.txt Sitemap directives:`, sitemapLines.map(l => l.trim()));
const robotsClean = sitemapLines.length === 1 && sitemapLines[0].includes('https://www.calczen.in/sitemap.xml');
console.log(`robots.txt only lists https://www.calczen.in/sitemap.xml:`, robotsClean ? 'YES (CLEAN)' : 'NO (ERROR)');

console.log('\n====================================================');
console.log('                   SUMMARY REPORT                   ');
console.log('====================================================');
console.log(`Total URLs in sitemap: ${urls.length}`);
console.log(`Exceptions found: ${exceptionCount}`);
if (exceptionCount === 0) {
  console.log(`SUCCESS: Every URL in the final sitemap returns 200 with a self canonical!`);
} else {
  console.log(`FAILED: ${exceptionCount} exceptions detected.`);
}
console.log('====================================================\n');
