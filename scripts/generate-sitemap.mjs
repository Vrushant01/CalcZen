import { writeFileSync, existsSync, readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

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
        const value = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, "");
        if (key && value && !process.env[key]) {
          process.env[key] = value;
        }
      }
    });
    console.log("[SITEMAP BUILD] Successfully loaded environment variables from server/.env");
  } catch (err) {
    console.warn("[SITEMAP BUILD] Warning: Could not read server/.env file:", err.message);
  }
}

const siteUrl = "https://www.calczen.in";
const STATIC_PATHS = ["/", "/calculators", "/about", "/contact", "/terms", "/privacy", "/disclaimer", "/blog"];
const CATEGORY_SLUGS = ["finance", "health", "math", "everyday", "education", "science"];
const CALCULATOR_SLUGS = [
  "mortgage-calculator",
  "compound-interest-calculator",
  "loan-emi-calculator",
  "bmi-calculator",
  "calorie-calculator",
  "water-intake-calculator",
  "sleep-calculator",
  "pregnancy-due-date-calculator",
  "percentage-calculator",
  "age-calculator",
  "tip-calculator",
  "bmr-calculator",
  "regular-calculator",
  "scientific-calculator",
  "retirement-calculator",
  "401k-calculator",
  "sip-calculator",
  "fd-calculator",
  "gst-calculator",
  "attendance-calculator",
  "cgpa-calculator",
  "body-fat-calculator",
  "protein-calculator",
  "inflation-calculator",
  "loan-eligibility-calculator",
  "credit-card-emi-calculator",
];

function escapeXml(unsafe) {
  if (!unsafe) return "";
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case "\"": return "&quot;";
      default: return c;
    }
  });
}

async function generateSitemap() {
  const todayStr = new Date().toISOString();
  let fetchedBlogs = [];

  // Try to load blogs from Supabase REST API dynamically at build time
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const url = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/blogs?select=title,slug,excerpt,category,thumbnail,publish_date,updated_at,author&published=eq.true`;
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
          console.log(`Successfully fetched ${fetchedBlogs.length} dynamic blogs for sitemap compilation.`);
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

  // 1. Compile Sitemap URL list
  const staticUrls = STATIC_PATHS.map((p) => {
    let changefreq = "weekly";
    let priority = "0.7";
    if (p === "/") {
      changefreq = "daily";
      priority = "1.0";
    } else if (p === "/blog" || p === "/calculators") {
      changefreq = "daily";
      priority = "0.8";
    } else if (["/terms", "/privacy", "/disclaimer"].includes(p)) {
      changefreq = "monthly";
      priority = "0.3";
    }
    return `  <url>
    <loc>${siteUrl}${p}</loc>
    <lastmod>${todayStr}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  const categoryUrls = CATEGORY_SLUGS.map((s) => {
    return `  <url>
    <loc>${siteUrl}/category/${s}</loc>
    <lastmod>${todayStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  const calculatorUrls = CALCULATOR_SLUGS.map((s) => {
    return `  <url>
    <loc>${siteUrl}/calculator/${s}</loc>
    <lastmod>${todayStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  // Blog URLs with images
  const blogUrls = fetchedBlogs.map((b) => {
    const blogUrl = `${siteUrl}/blog/${b.category.toLowerCase()}/${b.slug}`;
    const lastmod = b.updated_at || b.publish_date || todayStr;
    let imgTag = "";
    if (b.thumbnail) {
      imgTag = `\n    <image:image>
      <image:loc>${escapeXml(b.thumbnail)}</image:loc>
      <image:title>${escapeXml(b.title)}</image:title>
    </image:image>`;
    }
    return `  <url>
    <loc>${blogUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>${imgTag}
  </url>`;
  });

  // 2. Generate sitemap.xml
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${[...staticUrls, ...categoryUrls, ...calculatorUrls, ...blogUrls].join("\n")}
</urlset>`;

  // 3. Generate sitemap-blogs.xml
  const blogPathsList = [
    `  <url>
    <loc>${siteUrl}/blog</loc>
    <lastmod>${todayStr}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`,
    ...blogUrls
  ];
  const sitemapBlogsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${blogPathsList.join("\n")}
</urlset>`;

  // 4. Generate sitemap-news.xml (Google News)
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const recentBlogs = fetchedBlogs.filter((b) => {
    if (!b.publish_date) return false;
    return new Date(b.publish_date) >= fortyEightHoursAgo;
  });

  const newsUrls = recentBlogs.map((b) => {
    const blogUrl = `${siteUrl}/blog/${b.category.toLowerCase()}/${b.slug}`;
    const pubDate = b.publish_date || todayStr;
    return `  <url>
    <loc>${blogUrl}</loc>
    <news:news>
      <news:publication>
        <news:name>CalcZen Articles</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(b.title)}</news:title>
    </news:news>
  </url>`;
  });

  const sitemapNewsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsUrls.length > 0 ? newsUrls.join("\n") : `  <!-- No articles published in the last 48 hours -->`}
</urlset>`;

  // 5. Generate rss.xml
  const rssItems = fetchedBlogs
    .sort((a, b) => new Date(b.publish_date || 0).getTime() - new Date(a.publish_date || 0).getTime())
    .slice(0, 30)
    .map((b) => {
      const blogUrl = `${siteUrl}/blog/${b.category.toLowerCase()}/${b.slug}`;
      const pubDate = new Date(b.publish_date || b.updated_at || todayStr).toUTCString();
      const mediaTag = b.thumbnail
        ? `\n    <media:content url="${escapeXml(b.thumbnail)}" medium="image" type="image/jpeg" />`
        : "";
      return `    <item>
      <title>${escapeXml(b.title)}</title>
      <link>${blogUrl}</link>
      <guid isPermaLink="true">${blogUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(b.excerpt)}</description>
      <author>hello@calczen.in (${escapeXml(b.author || "CalcZen Team")})</author>
      <category>${escapeXml(b.category)}</category>${mediaTag}
    </item>`;
    });

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>CalcZen Blog — Financial Insights, Health Tips &amp; Math Guides</title>
    <link>${siteUrl}/blog</link>
    <description>Explore the CalcZen Blog for expert guides, financial tips, health calculator breakdowns, tax advice, and practical guides on online tool calculations.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
${rssItems.join("\n")}
  </channel>
</rss>`;

  const publicDir = join(process.cwd(), "public");
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true });
  }

  writeFileSync(join(publicDir, "sitemap.xml"), sitemapXml, "utf8");
  console.log("Generated public/sitemap.xml");

  writeFileSync(join(publicDir, "sitemap-blogs.xml"), sitemapBlogsXml, "utf8");
  console.log("Generated public/sitemap-blogs.xml");

  writeFileSync(join(publicDir, "sitemap-news.xml"), sitemapNewsXml, "utf8");
  console.log("Generated public/sitemap-news.xml");

  writeFileSync(join(publicDir, "rss.xml"), rssXml, "utf8");
  console.log("Generated public/rss.xml");
}

generateSitemap();
