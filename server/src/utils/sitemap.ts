import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSupabase } from "../config/supabase.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

function escapeXml(unsafe: string): string {
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

/**
 * Finds all potential locations of the frontend 'public' directory in workspace
 */
function resolvePublicDirs(): string[] {
  const dirs: string[] = [];

  const cwd = process.cwd();
  dirs.push(path.resolve(cwd, "public"));
  dirs.push(path.resolve(cwd, "../public"));

  dirs.push(path.resolve(__dirname, "../../../public"));
  dirs.push(path.resolve(__dirname, "../../../../public"));

  return [...new Set(dirs)].filter((dir) => {
    try {
      const parentDir = path.dirname(dir);
      return fs.existsSync(path.join(parentDir, "package.json"));
    } catch {
      return false;
    }
  });
}

/**
 * Generates and updates sitemap.xml, sitemap-blogs.xml, sitemap-news.xml and rss.xml dynamically
 */
export async function triggerSitemapUpdate(): Promise<void> {
  try {
    console.log("[SEO UTILS] Starting dynamic sitemap and RSS auto-generation...");

    // Fetch all published blogs from database with tags, updated_at, featured_image, category, title, excerpt
    const { data: blogs, error } = await getSupabase()
      .from("blogs")
      .select("title, slug, excerpt, category, thumbnail, publish_date, updated_at, author")
      .eq("published", true);

    const fetchedBlogs: Array<{
      title: string;
      slug: string;
      excerpt: string;
      category: string;
      thumbnail: string | null;
      publish_date: string | null;
      updated_at: string;
      author: string;
    }> = [];

    if (error) {
      console.error("[SEO UTILS] Failed to fetch blogs from Supabase for sitemaps/RSS:", error);
    } else if (blogs && Array.isArray(blogs)) {
      fetchedBlogs.push(...(blogs as any[]));
      console.log(`[SEO UTILS] Successfully gathered ${fetchedBlogs.length} published blogs from database.`);
    }

    const todayStr = new Date().toISOString();

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

    // 4. Generate Google News sitemap-news.xml (only articles published in the last 48 hours / 2 days)
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

    // 5. Generate RSS feed rss.xml
    const rssItems = fetchedBlogs
      .sort((a, b) => new Date(b.publish_date || 0).getTime() - new Date(a.publish_date || 0).getTime())
      .slice(0, 30) // Limit to latest 30 articles in RSS
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

    // 6. Write files to all resolved public folders
    const publicDirs = resolvePublicDirs();
    if (publicDirs.length === 0) {
      console.warn("[SEO UTILS] Warning: Could not locate frontend 'public' directory to write files.");
      return;
    }

    for (const dir of publicDirs) {
      try {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(path.join(dir, "sitemap.xml"), sitemapXml, "utf8");
        fs.writeFileSync(path.join(dir, "sitemap-blogs.xml"), sitemapBlogsXml, "utf8");
        fs.writeFileSync(path.join(dir, "sitemap-news.xml"), sitemapNewsXml, "utf8");
        fs.writeFileSync(path.join(dir, "rss.xml"), rssXml, "utf8");
        console.log(`[SEO UTILS] Instantly wrote sitemaps and RSS feed successfully to: ${dir}`);
      } catch (writeErr: any) {
        console.error(`[SEO UTILS] Failed to write sitemaps/RSS to ${dir}:`, writeErr.message);
      }
    }
  } catch (err: any) {
    console.error("[SEO UTILS] Unexpected error during sitemap and RSS generation:", err);
  }
}
