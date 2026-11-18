import fs from 'fs';

// 1. Read sitemap.xml to get all sitemap URLs
let sitemapUrls = [];
const sitemapPath = fs.existsSync('public/sitemap.xml') ? 'public/sitemap.xml' : 'dist/sitemap.xml';
if (fs.existsSync(sitemapPath)) {
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  const locMatches = [...xml.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)];
  sitemapUrls = locMatches.map(m => m[1].trim());
}

// 2. Read alias slugs from vercel.json
const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const aliasRedirects = (vercelConfig.redirects || []).filter(
  r => r.source.startsWith('/calculator/') && !r.has
);
const aliasUrls = aliasRedirects.map(r => `https://www.calczen.in${r.source}`);

// 3. Blog samples
const blogSamples = [
  'https://www.calczen.in/blog',
  'https://www.calczen.in/blog/',
  'https://www.calczen.in/blog/top-financial-calculators',
  'https://www.calczen.in/blog/finance/how-to-calculate-emi',
];

// 4. Apex and HTTP variants
const apexHttpVariants = [
  'http://www.calczen.in/',
  'http://calczen.in/',
  'https://calczen.in/',
  'http://www.calczen.in/calculator/bmi-calculator',
  'https://calczen.in/calculator/bmi-calculator',
  'http://calczen.in/calculator/bmi-calculator',
  'http://www.calczen.in/blog',
  'http://calczen.in/blog',
  'https://calczen.in/blog',
  'http://www.calczen.in/calculator/regular-calculator',
  'https://calczen.in/calculator/regular-calculator',
  'http://calczen.in/calculator/regular-calculator',
  'https://www.calczen.in/tools',
];

// Helper to trace URL redirects
async function traceUrl(initialUrl, maxHops = 10) {
  let currentUrl = initialUrl;
  const hops = [];
  const visited = new Set();

  while (hops.length < maxHops) {
    if (visited.has(currentUrl)) {
      return {
        initialUrl,
        finalUrl: currentUrl,
        finalStatus: 'LOOP',
        hops,
        isLoop: true,
        error: 'Redirect loop detected',
      };
    }
    visited.add(currentUrl);

    try {
      const res = await fetch(currentUrl, {
        method: 'GET',
        redirect: 'manual',
        headers: {
          'User-Agent': 'CalcZen-Status-Audit/1.0',
        },
      });

      const status = res.status;
      if (status >= 300 && status < 400) {
        const location = res.headers.get('location');
        if (!location) {
          return {
            initialUrl,
            finalUrl: currentUrl,
            finalStatus: status,
            hops,
            isLoop: false,
            error: 'Redirect header missing',
          };
        }
        const nextUrl = new URL(location, currentUrl).href;
        hops.push({ from: currentUrl, to: nextUrl, status });
        currentUrl = nextUrl;
      } else {
        return {
          initialUrl,
          finalUrl: currentUrl,
          finalStatus: status,
          hops,
          isLoop: false,
        };
      }
    } catch (err) {
      return {
        initialUrl,
        finalUrl: currentUrl,
        finalStatus: 'ERR',
        hops,
        isLoop: false,
        error: err.message,
      };
    }
  }

  return {
    initialUrl,
    finalUrl: currentUrl,
    finalStatus: 'MAX_HOPS',
    hops,
    isLoop: true,
    error: 'Exceeded maximum redirect hops',
  };
}

// Main audit runner
async function runAudit() {
  console.log(`Starting status audit...`);
  console.log(`- Sitemap URLs: ${sitemapUrls.length}`);
  console.log(`- Alias URLs: ${aliasUrls.length}`);
  console.log(`- Blog sample URLs: ${blogSamples.length}`);
  console.log(`- Apex/HTTP variants: ${apexHttpVariants.length}`);

  const allUrls = [
    ...sitemapUrls.map(u => ({ url: u, group: 'sitemap' })),
    ...aliasUrls.map(u => ({ url: u, group: 'alias' })),
    ...blogSamples.map(u => ({ url: u, group: 'blog' })),
    ...apexHttpVariants.map(u => ({ url: u, group: 'variant' })),
  ];

  const results = [];
  const flagged = [];

  // Run with concurrency limit of 5
  const concurrency = 5;
  for (let i = 0; i < allUrls.length; i += concurrency) {
    const chunk = allUrls.slice(i, i + concurrency);
    const chunkResults = await Promise.all(
      chunk.map(async item => {
        const trace = await traceUrl(item.url);
        return { ...item, ...trace };
      })
    );
    results.push(...chunkResults);
    process.stdout.write(`Audited ${results.length}/${allUrls.length} URLs...\r`);
  }
  console.log(`\nAudit completed. Total audited: ${results.length}\n`);

  for (const r of results) {
    const hopCount = r.hops.length;
    let issues = [];

    if (r.isLoop) {
      issues.push('REDIRECT_LOOP');
    }
    if (hopCount > 1) {
      issues.push(`LONG_CHAIN (${hopCount} hops)`);
    }
    if (typeof r.finalStatus === 'number') {
      if (r.finalStatus >= 400) {
        issues.push(`HTTP_${r.finalStatus}`);
      }
    } else {
      issues.push(String(r.finalStatus));
    }

    // Check for temporary redirects (302/307)
    for (const hop of r.hops) {
      if (hop.status === 302 || hop.status === 307) {
        issues.push(`TEMP_REDIRECT (${hop.status} at ${hop.from} -> ${hop.to})`);
      }
    }

    if (issues.length > 0) {
      flagged.push({ ...r, issues });
    }
  }

  // Summary Table
  console.log(`========================================`);
  console.log(`AUDIT SUMMARY:`);
  console.log(`Total URLs Audited: ${results.length}`);
  console.log(`Clean (1 hop or 200 OK): ${results.length - flagged.length}`);
  console.log(`Flagged Issues: ${flagged.length}`);
  console.log(`========================================\n`);

  if (flagged.length > 0) {
    console.log(`FLAGGED ITEMS:`);
    for (const f of flagged) {
      console.log(`URL: ${f.url}`);
      console.log(`  Group: ${f.group}`);
      console.log(`  Issues: ${f.issues.join(', ')}`);
      console.log(`  Hops (${f.hops.length}):`);
      f.hops.forEach(h => console.log(`    [${h.status}] ${h.from} -> ${h.to}`));
      console.log(`  Final: ${f.finalStatus} at ${f.finalUrl}`);
      if (f.error) console.log(`  Error: ${f.error}`);
      console.log();
    }
  } else {
    console.log(`All URLs resolved cleanly with no chains, loops, or 4xx/5xx!`);
  }

  // Save report to JSON
  fs.writeFileSync('scripts/status-audit-report.json', JSON.stringify({ summary: { total: results.length, clean: results.length - flagged.length, flaggedCount: flagged.length }, flagged, sampleResults: results.slice(0, 15) }, null, 2));
}

runAudit().catch(err => {
  console.error('Audit fatal error:', err);
  process.exit(1);
});
