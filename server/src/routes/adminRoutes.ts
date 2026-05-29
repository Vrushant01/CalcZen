import { Router } from "express";
import { z } from "zod";
import {
  getContactMessageHandler,
  listContactMessagesHandler,
  replyToContactMessageHandler,
} from "../controllers/contactAdminController.js";
import {
  deleteSubscriber,
  exportSubscribers,
  getRecentSubscribersHandler,
  getStats,
  listSubscribersHandler,
} from "../controllers/adminController.js";
import {
  getBlogStatsHandler,
  listBlogsAdminHandler,
  getBlogByIdAdminHandler,
  createBlogAdminHandler,
  updateBlogAdminHandler,
  deleteBlogAdminHandler,
} from "../controllers/blogAdminController.js";
import { getInfrastructureStats } from "../controllers/infrastructureController.js";
import { attachAdmin, requireAuth } from "../middleware/auth.js";
import { createRateLimiter } from "../middleware/rate-limit.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();

const replySchema = z.object({
  id: z.string().uuid("Invalid message id"),
  reply: z
    .string()
    .trim()
    .min(1, "Reply is required")
    .max(5000, "Reply is too long"),
});

const replyLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, message: "Too many replies sent. Please wait." },
});

router.use(requireAuth, attachAdmin);

router.get("/stats", getStats);
router.get("/infrastructure/stats", getInfrastructureStats);
router.get("/subscribers/recent", getRecentSubscribersHandler);
router.get("/subscribers", listSubscribersHandler);
router.delete("/subscribers/:id", deleteSubscriber);
router.get("/subscribers/export/csv", exportSubscribers);

router.get("/contact-messages", listContactMessagesHandler);
router.get("/contact-messages/:id", getContactMessageHandler);
router.post(
  "/reply-message",
  replyLimiter,
  validateBody(replySchema),
  replyToContactMessageHandler,
);

// Admin Blogs CMS routes
router.get("/blogs/stats", getBlogStatsHandler);
router.get("/blogs", listBlogsAdminHandler);
router.get("/blogs/:id", getBlogByIdAdminHandler);
router.post("/blogs", createBlogAdminHandler);
router.put("/blogs/:id", updateBlogAdminHandler);
router.delete("/blogs/:id", deleteBlogAdminHandler);

export default router;

