import { Router } from "express";
import { z } from "zod";
import { listNewsletters, sendNewsletter } from "../controllers/newsletterController.js";
import { attachAdmin, requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";

const newsletterSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200),
  htmlContent: z.string().min(1, "Message content is required").max(50000),
});

const router = Router();

router.use(requireAuth, attachAdmin);

router.post("/send", validateBody(newsletterSchema), sendNewsletter);
router.get("/history", listNewsletters);

export default router;
