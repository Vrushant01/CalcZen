import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";
import {
  listBlogsAdmin,
  getBlogByIdAdmin,
  createBlogAdmin,
  updateBlogAdmin,
  deleteBlogByIdAdmin,
  getBlogStatsAdmin,
} from "../services/blogService.js";
import { triggerSitemapUpdate } from "../utils/sitemap.js";

/** GET /api/admin/blogs/stats */
export async function getBlogStatsHandler(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const stats = await getBlogStatsAdmin();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error("Error getting blog stats:", error);
    res.status(500).json({ success: false, message: "Failed to fetch blog statistics" });
  }
}

/** GET /api/admin/blogs */
export async function listBlogsAdminHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const search = (req.query.search as string | undefined)?.trim();
    const category = req.query.category as string | undefined;
    const status = req.query.status as "published" | "draft" | undefined;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

    const { blogs, total } = await listBlogsAdmin({
      search: search || undefined,
      category,
      status: status === "published" || status === "draft" ? status : undefined,
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
    console.error("Error admin listing blogs:", error);
    res.status(500).json({ success: false, message: "Failed to list articles" });
  }
}

/** GET /api/admin/blogs/:id */
export async function getBlogByIdAdminHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const blog = await getBlogByIdAdmin(id);

    if (!blog) {
      res.status(404).json({ success: false, message: "Article not found" });
      return;
    }

    res.json({ success: true, data: blog });
  } catch (error) {
    console.error("Error admin fetching blog by ID:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve article" });
  }
}

/** POST /api/admin/blogs */
export async function createBlogAdminHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      thumbnail,
      category,
      tags,
      metaTitle,
      metaDescription,
      keywords,
      author,
      calculatorLinks,
      featured,
      published,
      readingTime,
    } = req.body;

    if (!title || !slug || !excerpt || !content || !category) {
      res.status(400).json({
        success: false,
        message: "Title, slug, excerpt, content, and category are required",
      });
      return;
    }

    const blog = await createBlogAdmin({
      title,
      slug,
      excerpt,
      content,
      thumbnail,
      category,
      tags,
      metaTitle,
      metaDescription,
      keywords,
      author,
      calculatorLinks,
      featured,
      published,
      readingTime,
    });

    // Automatically trigger sitemap.xml update in the background
    void triggerSitemapUpdate();

    res.status(201).json({
      success: true,
      message: "Article created successfully",
      data: blog,
    });
  } catch (error: any) {
    console.error("Error creating blog:", error);
    if (error.code === "DUPLICATE_SLUG") {
      res.status(409).json({
        success: false,
        message: "An article with this URL slug already exists",
      });
      return;
    }
    res.status(500).json({ success: false, message: "Failed to create article" });
  }
}

/** PUT /api/admin/blogs/:id */
export async function updateBlogAdminHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const {
      title,
      slug,
      excerpt,
      content,
      thumbnail,
      category,
      tags,
      metaTitle,
      metaDescription,
      keywords,
      author,
      calculatorLinks,
      featured,
      published,
      readingTime,
    } = req.body;

    const blog = await updateBlogAdmin(id, {
      title,
      slug,
      excerpt,
      content,
      thumbnail,
      category,
      tags,
      metaTitle,
      metaDescription,
      keywords,
      author,
      calculatorLinks,
      featured,
      published,
      readingTime,
    });

    // Automatically trigger sitemap.xml update in the background
    void triggerSitemapUpdate();

    res.json({
      success: true,
      message: "Article updated successfully",
      data: blog,
    });
  } catch (error: any) {
    console.error("Error updating blog:", error);
    if (error.message === "BLOG_NOT_FOUND") {
      res.status(404).json({ success: false, message: "Article not found" });
      return;
    }
    if (error.code === "DUPLICATE_SLUG") {
      res.status(409).json({
        success: false,
        message: "An article with this URL slug already exists",
      });
      return;
    }
    res.status(500).json({ success: false, message: "Failed to update article" });
  }
}

/** DELETE /api/admin/blogs/:id */
export async function deleteBlogAdminHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const deleted = await deleteBlogByIdAdmin(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: "Article not found" });
      return;
    }

    // Automatically trigger sitemap.xml update in the background
    void triggerSitemapUpdate();

    res.json({ success: true, message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ success: false, message: "Failed to delete article" });
  }
}
