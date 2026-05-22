import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { subscribe } from "../controllers/subscribeController.js";
import { validateBody } from "../middleware/validate.js";

const subscribeSchema = z.object({
  email: z.string().min(1, "Email is required").max(254),
});

const subscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many subscription attempts. Please try again later." },
});

const router = Router();

router.post("/", subscribeLimiter, validateBody(subscribeSchema), subscribe);

export default router;
