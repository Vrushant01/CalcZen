import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { login, me } from "../controllers/authController.js";
import { attachAdmin, requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Please try again later." },
});

const router = Router();

router.post("/login", loginLimiter, validateBody(loginSchema), login);
router.get("/me", requireAuth, attachAdmin, me);

export default router;
