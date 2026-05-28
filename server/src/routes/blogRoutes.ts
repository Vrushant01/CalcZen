import { Router } from "express";
import {
  listPublishedBlogsHandler,
  getPublishedBlogBySlugHandler,
  incrementBlogViewsHandler,
} from "../controllers/blogController.js";

const router = Router();

// Public routes for blog listings and read views
router.get("/", listPublishedBlogsHandler);
router.get("/:slug", getPublishedBlogBySlugHandler);
router.post("/:id/view", incrementBlogViewsHandler);

export default router;
