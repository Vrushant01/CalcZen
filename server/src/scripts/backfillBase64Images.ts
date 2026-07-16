import { getSupabase } from "../config/supabase.js";
import { optimizeAndStoreImage, generateOgImage } from "../utils/imageOptimizer.js";
import { triggerSitemapUpdate } from "../utils/sitemap.js";
import type { BlogRow } from "../types/database.js";

let running = false;

/**
 * Self-healing migration script that converts base64 database entries to local files
 * and generates missing branded OG images.
 */
export async function backfillBase64Images(): Promise<void> {
  if (running) return;
  running = true;

  try {
    const supabase = getSupabase();
    console.log("[SEO MIGRATION] Scanning database for base64 thumbnails and missing OG cards...");

    const { data: blogs, error } = await supabase
      .from("blogs")
      .select("*");

    if (error) {
      console.error("[SEO MIGRATION] Failed to fetch blogs:", error);
      return;
    }

    if (!blogs || blogs.length === 0) {
      console.log("[SEO MIGRATION] No blogs found in database.");
      return;
    }

    console.log(`[SEO MIGRATION] Found ${blogs.length} articles to inspect.`);
    let updateCount = 0;

    for (const blog of blogs as BlogRow[]) {
      let needsUpdate = false;
      let thumbnail = blog.thumbnail || "";
      const slug = blog.slug;
      const title = blog.title;

      // 1. If thumbnail is base64, optimize and store it locally
      if (thumbnail.startsWith("data:")) {
        console.log(`[SEO MIGRATION] Found base64 thumbnail in blog "${title}". Converting...`);
        const localPath = await optimizeAndStoreImage(thumbnail, slug);
        if (localPath && !localPath.startsWith("data:")) {
          thumbnail = localPath;
          needsUpdate = true;
        }
      }

      // 2. If thumbnail is missing, generate branded OG image
      if (!thumbnail.trim()) {
        console.log(`[SEO MIGRATION] Missing thumbnail in blog "${title}". Generating branded OG image...`);
        const localPath = await generateOgImage(title, slug);
        thumbnail = localPath;
        needsUpdate = true;
      }

      // 3. Make sure featured_image, og_image, and twitter_image match the optimized URL
      let ogImage = blog.og_image || "";
      let twitterImage = blog.twitter_image || "";
      let featuredImage = blog.featured_image || "";

      if (ogImage.startsWith("data:") || !ogImage.trim() || ogImage !== thumbnail) {
        ogImage = thumbnail;
        needsUpdate = true;
      }
      if (twitterImage.startsWith("data:") || !twitterImage.trim() || twitterImage !== thumbnail) {
        twitterImage = thumbnail;
        needsUpdate = true;
      }
      if (featuredImage.startsWith("data:") || !featuredImage.trim() || featuredImage !== thumbnail) {
        featuredImage = thumbnail;
        needsUpdate = true;
      }

      // 4. Update JSON-LD schema to use correct image URLs and logo
      let schema = blog.schema || "";
      if (needsUpdate || schema.includes("brand-logo.png")) {
        let jsonldObj = blog.jsonld;
        if (typeof jsonldObj === "string") {
          try {
            jsonldObj = JSON.parse(jsonldObj);
          } catch {
            jsonldObj = null;
          }
        }
        
        if (jsonldObj && Array.isArray(jsonldObj)) {
          // Update Logo
          jsonldObj.forEach((node: any) => {
            if (node.publisher && node.publisher.logo) {
              node.publisher.logo.url = "https://calczen.in/logo.png";
            }
            if (node["@type"] === "BlogPosting") {
              node.image = [thumbnail.startsWith("http") ? thumbnail : `https://calczen.in${thumbnail}`];
            }
          });
          schema = JSON.stringify(jsonldObj);
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        console.log(`[SEO MIGRATION] Saving updated record for blog: "${title}"`);
        const { error: updateErr } = await supabase
          .from("blogs")
          .update({
            thumbnail,
            featured_image: featuredImage,
            og_image: ogImage,
            twitter_image: twitterImage,
            schema,
            jsonld: blog.jsonld, // Preserve rich object structure
            updated_at: new Date().toISOString()
          })
          .eq("id", blog.id);

        if (updateErr) {
          console.error(`[SEO MIGRATION] Failed to update record for blog "${title}":`, updateErr);
        } else {
          updateCount++;
        }
      }
    }

    console.log(`[SEO MIGRATION] Completed. Updated ${updateCount} articles.`);
    if (updateCount > 0) {
      console.log("[SEO MIGRATION] Re-compiling sitemaps and RSS...");
      await triggerSitemapUpdate();
    }
  } catch (err) {
    console.error("[SEO MIGRATION] Critical exception occurred during migration:", err);
  } finally {
    running = false;
  }
}
