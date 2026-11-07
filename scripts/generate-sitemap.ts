import { writeFileSync, existsSync, readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { calculators, categories } from "../src/data/calculators.ts";

// Dynamically load server/.env to pull Supabase credentials during build or manual runs
const serverEnvPath = join(process.cwd(), "server", ".env");
if (existsSync(serverEnvPath)) {
  try {
    const envContent = readFileSync(serverEnvPath, "utf8");
    envContent.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const index = trimmed.indexOf("=");
        const key = trimmed.substring(0, index).trim();
        const value = trimmed
          .substring(index + 1)
          .trim()
          .replace(/^['"]|['"]$/g, "");
        if (key && value && !process.env[key]) {
          process.env[key] = value;
        }
      }
    });
    console.log("[SITEMAP BUILD] Successfully loaded environment variables from server/.env");
  } catch (err: any) {
    console.warn("[SITEMAP BUILD] Warning: Could not read server/.env file:", err.message);
  }
}

const siteUrl = (process.env.SITE_URL || "https://www.calczen.in").replace(/\/$/, "");

const STATIC_PATHS = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/calculators", priority: "0.9", changefreq: "daily" },
  { path: "/blog", priority: "0.8", changefreq: "weekly" },
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

  // 4. Try to load published blogs from Supabase REST API dynamically at build time
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  let fetchedBlogs: any[] = [];

  if (supabaseUrl && supabaseKey) {
    try {
      const url = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/blogs?select=slug,updated_at,created_at&published=eq.true`;
      const res = await fetch(url, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        fetchedBlogs = await res.json();
        if (Array.isArray(fetchedBlogs)) {
          fetchedBlogs.forEach((b) => {
            if (b.slug) {
              const lastmod = (b.updated_at || b.created_at || today).split("T")[0];
              sitemapEntries.push({
                url: `${siteUrl}/blog/${b.slug}`,
                lastmod,
                changefreq: "monthly",
                priority: "0.7",
              });
            }
          });
          console.log(`[SITEMAP BUILD] Added ${fetchedBlogs.length} dynamic blog paths to sitemap.xml.`);
        }
      } else {
        console.warn(`[SITEMAP BUILD] Supabase sitemap fetch returned status ${res.status}`);
      }
    } catch (err: any) {
      console.warn("[SITEMAP BUILD] Failed to fetch dynamic blog slugs for sitemap:", err.message);
    }
  } else {
    console.log("[SITEMAP BUILD] Supabase credentials not available. Compiling static paths.");
  }

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

  // Generate separate sitemap-blogs.xml
  const blogEntries = [
    { url: `${siteUrl}/blog`, lastmod: today, changefreq: "weekly", priority: "0.8" },
    ...fetchedBlogs.map((b) => ({
      url: `${siteUrl}/blog/${b.slug}`,
      lastmod: (b.updated_at || b.created_at || today).split("T")[0],
      changefreq: "monthly",
      priority: "0.7",
    })),
  ];

  const blogsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blogEntries
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

  writeFileSync(join(publicDir, "sitemap-blogs.xml"), blogsXml, "utf8");
  if (existsSync(distDir)) {
    writeFileSync(join(distDir, "sitemap-blogs.xml"), blogsXml, "utf8");
  }
  console.log("[SITEMAP BUILD] Generated public/sitemap-blogs.xml.");
}

generateSitemap().catch((err) => {
  console.error("[SITEMAP BUILD] Fatal Error:", err);
  process.exit(1);
});

