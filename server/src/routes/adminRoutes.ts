import { Router } from "express";
import {
  deleteSubscriber,
  exportSubscribers,
  getRecentSubscribersHandler,
  getStats,
  listSubscribersHandler,
} from "../controllers/adminController.js";
import { attachAdmin, requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth, attachAdmin);

router.get("/stats", getStats);
router.get("/subscribers/recent", getRecentSubscribersHandler);
router.get("/subscribers", listSubscribersHandler);
router.delete("/subscribers/:id", deleteSubscriber);
router.get("/subscribers/export/csv", exportSubscribers);

export default router;
