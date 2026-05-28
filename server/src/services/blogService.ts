import { getSupabase } from "../config/supabase.js";
import type { ApiBlog, BlogRow } from "../types/database.js";
import { toApiBlog } from "../utils/serializers.js";

function isUniqueViolation(error: { code?: string }): boolean {
  return error.code === "23505";
}

/** Public: List published blogs with optional category, search query, page, limit */
export async function listPublishedBlogs(options: {
  category?: string;
  search?: string;
  page: number;
  limit: number;
}): Promise<{ blogs: ApiBlog[]; total: number }> {
  const { category, search, page, limit } = options;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = getSupabase()
    .from("blogs")
    .select("*", { count: "exact" })
    .eq("published", true)
    .order("publish_date", { ascending: false });

  if (category && category.toLowerCase() !== "all") {
    query = query.eq("category", category);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
  }

  const { data, error, count } = await query.range(from, to);
  if (error) throw error;

  return {
    blogs: (data as BlogRow[]).map(toApiBlog),
    total: count ?? 0,
  };
}

/** Public: Find a published blog by its unique slug */
export async function findPublishedBlogBySlug(slug: string): Promise<ApiBlog | null> {
  const { data, error } = await getSupabase()
    .from("blogs")
    .select("*")
    .eq("slug", slug.toLowerCase().trim())
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  return data ? toApiBlog(data as BlogRow) : null;
}

/** Increment a blog's view count in the database */
export async function incrementBlogViews(id: string): Promise<void> {
  // Safe raw query counter increment inside Supabase
  const supabase = getSupabase();
  const { error } = await supabase.rpc("increment_blog_views", { blog_id: id });
  
  if (error) {
    // If the RPC is not installed yet (e.g. migration has not been run or it's not present),
    // fallback to a standard fetch-update to increment.
    const { data: current } = await supabase.from("blogs").select("views").eq("id", id).maybeSingle();
    if (current) {
      await supabase
        .from("blogs")
        .update({ views: (current.views || 0) + 1 })
        .eq("id", id);
    }
  }
}

/** Admin: List all blogs (drafts + published) with pagination, search, status filters */
export async function listBlogsAdmin(options: {
  search?: string;
  category?: string;
  status?: "published" | "draft";
  page: number;
  limit: number;
}): Promise<{ blogs: ApiBlog[]; total: number }> {
  const { search, category, status, page, limit } = options;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = getSupabase()
    .from("blogs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("published", status === "published");
  }

  if (category && category.toLowerCase() !== "all") {
    query = query.eq("category", category);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
  }

  const { data, error, count } = await query.range(from, to);
  if (error) throw error;

  return {
    blogs: (data as BlogRow[]).map(toApiBlog),
    total: count ?? 0,
  };
}

/** Admin: Get blog by ID */
export async function getBlogByIdAdmin(id: string): Promise<ApiBlog | null> {
  const { data, error } = await getSupabase()
    .from("blogs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? toApiBlog(data as BlogRow) : null;
}

/** Admin: Create a new blog */
export async function createBlogAdmin(input: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail?: string | null;
  category: string;
  tags?: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string[];
  author?: string;
  calculatorLinks?: any;
  featured?: boolean;
  published?: boolean;
  readingTime?: number;
}): Promise<ApiBlog> {
  const publishDate = input.published ? new Date().toISOString() : null;

  const { data, error } = await getSupabase()
    .from("blogs")
    .insert({
      title: input.title.trim(),
      slug: input.slug.toLowerCase().trim(),
      excerpt: input.excerpt.trim(),
      content: input.content,
      thumbnail: input.thumbnail || null,
      category: input.category,
      tags: input.tags || [],
      meta_title: input.metaTitle || null,
      meta_description: input.metaDescription || null,
      keywords: input.keywords || [],
      author: input.author || "CalcZen Team",
      calculator_links: input.calculatorLinks || [],
      featured: input.featured ?? false,
      published: input.published ?? false,
      views: 0,
      reading_time: input.readingTime || 0,
      publish_date: publishDate,
    })
    .select("*")
    .single();

  if (error) {
    if (isUniqueViolation(error)) {
      const err = new Error("DUPLICATE_SLUG") as Error & { code: string };
      err.code = "DUPLICATE_SLUG";
      throw err;
    }
    throw error;
  }

  return toApiBlog(data as BlogRow);
}

/** Admin: Update an existing blog */
export async function updateBlogAdmin(
  id: string,
  input: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    thumbnail?: string | null;
    category?: string;
    tags?: string[];
    metaTitle?: string | null;
    metaDescription?: string | null;
    keywords?: string[];
    author?: string;
    calculatorLinks?: any;
    featured?: boolean;
    published?: boolean;
    readingTime?: number;
  },
): Promise<ApiBlog> {
  // Fetch existing blog to determine publish date logic
  const supabase = getSupabase();
  const { data: existing, error: fetchErr } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (fetchErr) throw fetchErr;
  if (!existing) {
    throw new Error("BLOG_NOT_FOUND");
  }

  const updates: Record<string, any> = {};
  if (input.title !== undefined) updates.title = input.title.trim();
  if (input.slug !== undefined) updates.slug = input.slug.toLowerCase().trim();
  if (input.excerpt !== undefined) updates.excerpt = input.excerpt.trim();
  if (input.content !== undefined) updates.content = input.content;
  if (input.thumbnail !== undefined) updates.thumbnail = input.thumbnail;
  if (input.category !== undefined) updates.category = input.category;
  if (input.tags !== undefined) updates.tags = input.tags;
  if (input.metaTitle !== undefined) updates.meta_title = input.metaTitle;
  if (input.metaDescription !== undefined) updates.meta_description = input.metaDescription;
  if (input.keywords !== undefined) updates.keywords = input.keywords;
  if (input.author !== undefined) updates.author = input.author;
  if (input.calculatorLinks !== undefined) updates.calculator_links = input.calculatorLinks;
  if (input.featured !== undefined) updates.featured = input.featured;
  
  if (input.published !== undefined) {
    updates.published = input.published;
    if (input.published && !existing.published) {
      updates.publish_date = new Date().toISOString();
    } else if (!input.published) {
      updates.publish_date = null;
    }
  }
  if (input.readingTime !== undefined) updates.reading_time = input.readingTime;

  const { data, error } = await supabase
    .from("blogs")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    if (isUniqueViolation(error)) {
      const err = new Error("DUPLICATE_SLUG") as Error & { code: string };
      err.code = "DUPLICATE_SLUG";
      throw err;
    }
    throw error;
  }

  return toApiBlog(data as BlogRow);
}

/** Admin: Delete blog by ID */
export async function deleteBlogByIdAdmin(id: string): Promise<boolean> {
  const { error, count } = await getSupabase()
    .from("blogs")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) throw error;
  return (count ?? 0) > 0;
}

/** Admin: Fetch blogs statistics for dashboard cards */
export async function getBlogStatsAdmin(): Promise<{
  total: number;
  published: number;
  drafts: number;
  views: number;
}> {
  const supabase = getSupabase();

  const [totalRes, publishedRes, draftsRes, viewsRes] = await Promise.all([
    supabase.from("blogs").select("*", { count: "exact", head: true }),
    supabase.from("blogs").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("blogs").select("*", { count: "exact", head: true }).eq("published", false),
    supabase.from("blogs").select("views"),
  ]);

  if (totalRes.error) throw totalRes.error;
  if (publishedRes.error) throw publishedRes.error;
  if (draftsRes.error) throw draftsRes.error;
  if (viewsRes.error) throw viewsRes.error;

  const totalViews = (viewsRes.data as { views: number }[]).reduce((sum, row) => sum + (row.views || 0), 0);

  return {
    total: totalRes.count ?? 0,
    published: publishedRes.count ?? 0,
    drafts: draftsRes.count ?? 0,
    views: totalViews,
  };
}
