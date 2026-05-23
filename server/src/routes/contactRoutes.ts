import { Router } from "express";
import { z } from "zod";
import { submitContact } from "../controllers/contactController.js";
import { createRateLimiter } from "../middleware/rate-limit.js";
import { validateBody } from "../middleware/validate.js";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email is too long"),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters")
    .max(2000, "Message is too long"),
  _gotcha: z.string().max(500).optional(),
});

const contactLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many messages sent. Please try again later.",
  },
});

const router = Router();

router.post("/", contactLimiter, validateBody(contactSchema), submitContact);

export default router;
