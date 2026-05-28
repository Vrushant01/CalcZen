import { writeFileSync } from "node:fs";
import { join } from "node:path";

const siteUrl = (process.env.SITE_URL || "https://www.calczen.in").replace(/\/$/, "");

const STATIC_PATHS = ["/", "/calculators", "/about", "/contact", "/terms", "/privacy", "/disclaimer", "/blog"];
const CATEGORY_SLUGS = ["finance", "health", "math", "everyday"];
const CALCULATOR_SLUGS = [
  "mortgage-calculator",
  "compound-interest-calculator",
  "loan-emi-calculator",
  "bmi-calculator",
  "calorie-calculator",
  "water-intake-calculator",
  "pregnancy-due-date-calculator",
  "percentage-calculator",
  "age-calculator",
  "tip-calculator",
  "bmr-calculator",
];

async function generateSitemap() {
  const paths = [
    ...STATIC_PATHS,
    ...CATEGORY_SLUGS.map((s) => `/category/${s}`),
    ...CALCULATOR_SLUGS.map((s) => `/calculator/${s}`),
  ];

  // Try to load blogs from Supabase REST API dynamically at build time
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  let fetchedBlogs = [];

  if (supabaseUrl && supabaseKey) {
    try {
      const url = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/blogs?select=slug&published=eq.true`;
      const res = await fetch(url, {
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        fetchedBlogs = await res.json();
        if (Array.isArray(fetchedBlogs)) {
          fetchedBlogs.forEach((b) => {
            if (b.slug) paths.push(`/blog/${b.slug}`);
          });
          console.log(`Successfully added ${fetchedBlogs.length} dynamic blog paths to sitemap.xml.`);
        }
      } else {
        console.warn(`Supabase sitemap fetch returned status ${res.status}`);
      }
    } catch (err) {
      console.warn("Failed to fetch dynamic blog slugs for sitemap, falling back to static paths:", err.message);
    }
  } else {
    console.log("Supabase credentials not available during sitemap compilation. Compiling static paths.");
  }

  // 1. Generate main sitemap.xml
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${siteUrl}${p}</loc></url>`).join("\n")}
</urlset>
`;

  writeFileSync(join(process.cwd(), "public", "sitemap.xml"), xml, "utf8");
  console.log("Generated public/sitemap.xml");

  // 2. Generate separate sitemap-blogs.xml if blogs exist
  const blogPaths = ["/blog", ...fetchedBlogs.map((b) => `/blog/${b.slug}`)];
  const blogsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blogPaths.map((p) => `  <url><loc>${siteUrl}${p}</loc></url>`).join("\n")}
</urlset>
`;

  writeFileSync(join(process.cwd(), "public", "sitemap-blogs.xml"), blogsXml, "utf8");
  console.log("Generated public/sitemap-blogs.xml");
}

generateSitemap();

