import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { calculators, categories } from "../src/data/calculators.ts";

const siteUrl = (process.env.SITE_URL || "https://www.calczen.in").replace(/\/$/, "");

const STATIC_PATHS = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/calculators", priority: "0.9", changefreq: "daily" },
  { path: "/tools", priority: "0.5", changefreq: "weekly" },
  { path: "/about", priority: "0.5", changefreq: "monthly" },
  { path: "/contact", priority: "0.5", changefreq: "monthly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/disclaimer", priority: "0.3", changefreq: "yearly" },
];

async function generateSitemap() {
  const today = new Date().toISOString().split("T")[0];

  const sitemapEntries: Array<{ url: string; lastmod: string; changefreq: string; priority: string }> = [];

  // 1. Static Pages
  STATIC_PATHS.forEach((sp) => {
    sitemapEntries.push({
      url: `${siteUrl}${sp.path}`,
      lastmod: today,
      changefreq: sp.changefreq,
      priority: sp.priority,
    });
  });

  // 2. Category Pages (derived dynamically from src/data/calculators.ts)
  categories.forEach((cat) => {
    sitemapEntries.push({
      url: `${siteUrl}/category/${cat.slug}`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.8",
    });
  });

  // 3. Calculator Pages (derived dynamically from src/data/calculators.ts)
  calculators.forEach((calc) => {
    sitemapEntries.push({
      url: `${siteUrl}/calculator/${calc.slug}`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.9",
    });
  });

  // XML construction
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
  .map(
    (e) => `  <url>
    <loc>${e.url}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

  const publicDir = join(process.cwd(), "public");
  if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });
  writeFileSync(join(publicDir, "sitemap.xml"), xml, "utf8");
  console.log(`[SITEMAP BUILD] Generated public/sitemap.xml with ${sitemapEntries.length} total URLs.`);

  // Also write to dist/ if dist exists
  const distDir = join(process.cwd(), "dist");
  if (existsSync(distDir)) {
    writeFileSync(join(distDir, "sitemap.xml"), xml, "utf8");
    console.log(`[SITEMAP BUILD] Updated dist/sitemap.xml.`);
  }
}

generateSitemap().catch((err) => {
  console.error("[SITEMAP BUILD] Fatal Error:", err);
  process.exit(1);
});
