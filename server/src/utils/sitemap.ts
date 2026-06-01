import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSupabase } from "../config/supabase.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const siteUrl = "https://www.calczen.in";
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
  "standard-calculator",
  "scientific-calculator",
  "retirement-calculator",
  "401k-calculator",
];

/**
 * Finds all potential locations of the frontend 'public' directory in workspace
 */
function resolvePublicDirs(): string[] {
  const dirs: string[] = [];

  // Candidates relative to process.cwd()
  const cwd = process.cwd();
  dirs.push(path.resolve(cwd, "public"));
  dirs.push(path.resolve(cwd, "../public"));

  // Candidates relative to this module directory
  dirs.push(path.resolve(__dirname, "../../../public"));
  dirs.push(path.resolve(__dirname, "../../../../public"));

  // Filter only those that actually exist or are highly likely to be the public directory
  return [...new Set(dirs)].filter((dir) => {
    try {
      // If the parent directory of 'public' contains a package.json, it's a real workspace directory
      const parentDir = path.dirname(dir);
      return fs.existsSync(path.join(parentDir, "package.json"));
    } catch {
      return false;
    }
  });
}

/**
 * Generates and updates sitemap.xml and sitemap-blogs.xml dynamically
 */
export async function triggerSitemapUpdate(): Promise<void> {
  try {
    console.log("[SITEMAP] Starting dynamic sitemap auto-generation...");
    const paths = [
      ...STATIC_PATHS,
      ...CATEGORY_SLUGS.map((s) => `/category/${s}`),
      ...CALCULATOR_SLUGS.map((s) => `/calculator/${s}`),
    ];

    // Fetch all published blogs from database
    const { data: blogs, error } = await getSupabase()
      .from("blogs")
      .select("slug")
      .eq("published", true);

    const fetchedBlogs: Array<{ slug: string }> = [];

    if (error) {
      console.error("[SITEMAP] Failed to fetch blogs from Supabase for sitemap:", error);
    } else if (blogs && Array.isArray(blogs)) {
      blogs.forEach((b) => {
        if (b.slug) {
          paths.push(`/blog/${b.slug}`);
          fetchedBlogs.push({ slug: b.slug });
        }
      });
      console.log(`[SITEMAP] Successfully gathered ${fetchedBlogs.length} published blogs from database.`);
    }

    // 1. Generate main sitemap.xml
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${siteUrl}${p}</loc></url>`).join("\n")}
</urlset>
`;

    // 2. Generate separate sitemap-blogs.xml if blogs exist
    const blogPaths = ["/blog", ...fetchedBlogs.map((b) => `/blog/${b.slug}`)];
    const blogsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blogPaths.map((p) => `  <url><loc>${siteUrl}${p}</loc></url>`).join("\n")}
</urlset>
`;

    // Write to all matching public directories in the workspace
    const publicDirs = resolvePublicDirs();
    if (publicDirs.length === 0) {
      console.warn("[SITEMAP] Warning: Could not locate frontend 'public' directory to write sitemaps.");
      return;
    }

    for (const dir of publicDirs) {
      try {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(path.join(dir, "sitemap.xml"), xml, "utf8");
        fs.writeFileSync(path.join(dir, "sitemap-blogs.xml"), blogsXml, "utf8");
        console.log(`[SITEMAP] Instantly wrote sitemaps successfully to: ${dir}`);
      } catch (writeErr: any) {
        console.error(`[SITEMAP] Failed to write sitemap to ${dir}:`, writeErr.message);
      }
    }
  } catch (err: any) {
    console.error("[SITEMAP] Unexpected error during sitemap auto-generation:", err);
  }
}
