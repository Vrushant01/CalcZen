import type { Request, Response } from "express";
import {
  listPublishedBlogs,
  findPublishedBlogBySlug,
  incrementBlogViews,
} from "../services/blogService.js";

/** GET /api/blogs */
export async function listPublishedBlogsHandler(req: Request, res: Response): Promise<void> {
  try {
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 12));

    const { blogs, total } = await listPublishedBlogs({
      category,
      search: search?.trim() || undefined,
      page,
      limit,
    });

    res.json({
      success: true,
      data: {
        blogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) || 1,
        },
      },
    });
  } catch (error) {
    console.error("Error listing blogs:", error);
    res.status(500).json({ success: false, message: "Failed to load blogs" });
  }
}

/** GET /api/blogs/:slug */
export async function getPublishedBlogBySlugHandler(req: Request, res: Response): Promise<void> {
  try {
    const slug = String(req.params.slug);
    const blog = await findPublishedBlogBySlug(slug);

    if (!blog) {
      res.status(404).json({ success: false, message: "Article not found" });
      return;
    }

    // Increment view count in background asynchronously
    incrementBlogViews(blog._id).catch((err) =>
      console.error(`Failed to increment views for ${blog._id}:`, err)
    );

    res.json({ success: true, data: blog });
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    res.status(500).json({ success: false, message: "Failed to load article" });
  }
}

/** POST /api/blogs/:id/view */
export async function incrementBlogViewsHandler(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    await incrementBlogViews(id);
    res.json({ success: true, message: "View tracked" });
  } catch (error) {
    console.error("Error incrementing views:", error);
    res.status(500).json({ success: false, message: "Failed to track view" });
  }
}
