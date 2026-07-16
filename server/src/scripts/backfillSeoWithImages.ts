import { getSupabase } from "../config/supabase.js";
import { generateSeoData } from "../utils/seo.js";
import { triggerSitemapUpdate } from "../utils/sitemap.js";
import { optimizeAndStoreImage } from "../utils/imageOptimizer.js";

async function backfill() {
  console.log("[MIGRATION] Starting full SEO and Image Optimization migration...");
  const supabase = getSupabase();

  // Fetch ALL blogs from Supabase
  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("*");

  if (error) {
    console.error("[MIGRATION] Error fetching blogs from database:", error);
    process.exit(1);
  }

  if (!blogs || blogs.length === 0) {
    console.log("[MIGRATION] No blogs found to migrate.");
    process.exit(0);
  }

  console.log(`[MIGRATION] Found ${blogs.length} articles to process. downloading and optimizing external images...`);

  let successCount = 0;

  for (const blog of blogs) {
    try {
      console.log(`\n------------------------------------------------------------`);
      console.log(`[MIGRATION] Processing: "${blog.title}"`);

      // 1. Resolve slug and optimize image first
      const cleanSlug = blog.slug.toLowerCase().trim();
      let thumbnail = blog.thumbnail || blog.featured_image || "";
      
      if (thumbnail) {
        // This will download external images, convert to WebP, and save locally
        thumbnail = await optimizeAndStoreImage(thumbnail, cleanSlug);
      }

      // 2. Generate SEO structures with the local optimized image path
      const seo = generateSeoData({
        title: blog.title,
        slug: cleanSlug,
        excerpt: blog.excerpt,
        content: blog.content,
        thumbnail: thumbnail,
        category: blog.category,
        tags: blog.tags || [],
        metaTitle: blog.meta_title,
        metaDescription: blog.meta_description,
        keywords: blog.keywords || [],
        author: blog.author || "CalcZen Team",
        faqs: blog.faqs || blog.faq_json || [],
        publishDate: blog.publish_date,
      });

      // Make sure the absolute image URL is set correctly in og/twitter tags
      if (thumbnail) {
        seo.ogImage = thumbnail;
        seo.twitterImage = thumbnail;
        if (seo.jsonld) {
          const graph = Array.isArray(seo.jsonld) ? seo.jsonld : [seo.jsonld];
          if (graph[0] && graph[0]["@type"] === "BlogPosting") {
            const absoluteImageUrl = thumbnail.startsWith("/") ? `https://calczen.in${thumbnail}` : thumbnail;
            graph[0].image = [absoluteImageUrl];
          }
          seo.schema = JSON.stringify(graph);
        }
      }

      // 3. Update Supabase record
      const updates = {
        slug: seo.slug,
        content: seo.content,
        meta_title: seo.metaTitle,
        meta_description: seo.metaDescription,
        keywords: seo.keywords,
        reading_time: seo.readingTime,
        discover_ready: seo.discoverReady,
        schema: seo.schema,
        jsonld: seo.jsonld,
        canonical: seo.canonical,
        og_image: seo.ogImage,
        twitter_image: seo.twitterImage,
        toc: seo.toc,
        faq_json: blog.faqs || [],
        thumbnail: thumbnail || null,
        featured_image: thumbnail || null,
        status: blog.published ? "published" : "draft",
      };

      const { error: updateErr } = await supabase
        .from("blogs")
        .update(updates)
        .eq("id", blog.id);

      if (updateErr) {
        console.error(`[MIGRATION] Failed to update blog "${blog.title}":`, updateErr);
      } else {
        console.log(`[MIGRATION] Successfully backfilled & optimized: "${blog.title}"`);
        successCount++;
      }
    } catch (err: any) {
      console.error(`[MIGRATION] Exception occurred while processing "${blog.title}":`, err.message);
    }
  }

  console.log(`\n[MIGRATION] Completed. Successfully migrated ${successCount}/${blogs.length} articles.`);
  console.log("[MIGRATION] Re-compiling XML sitemaps and RSS feed...");
  await triggerSitemapUpdate();
  console.log("[MIGRATION] Sitemaps updated. Done!");
  process.exit(0);
}

backfill();
