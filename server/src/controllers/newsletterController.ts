import type { Response } from "express";
import { hasEmailConfig } from "../config/env.js";
import { sendBulkEmails } from "../services/emailService.js";
import { createNewsletterRecord, listNewsletterHistory } from "../services/newsletterService.js";
import { getActiveSubscriberEmails } from "../services/subscriberService.js";
import type { AuthRequest } from "../middleware/auth.js";

export async function sendNewsletter(req: AuthRequest, res: Response): Promise<void> {
  const { subject, htmlContent } = req.body as { subject: string; htmlContent: string };

  if (!hasEmailConfig()) {
    res.status(503).json({
      success: false,
      message: "Email service is not configured. Set RESEND_API_KEY and EMAIL_FROM.",
    });
    return;
  }

  const emails = await getActiveSubscriberEmails();
  if (emails.length === 0) {
    res.status(400).json({ success: false, message: "No active subscribers to send to." });
    return;
  }

  const { sent, failed } = await sendBulkEmails(emails, subject, htmlContent);

  await createNewsletterRecord({
    subject,
    htmlContent,
    recipientCount: sent,
    sentBy: req.admin!._id,
  });

  res.json({
    success: true,
    message: `Newsletter sent to ${sent} of ${emails.length} active subscribers.`,
    data: {
      sent,
      total: emails.length,
      failures: failed.length > 0 ? failed : undefined,
    },
  });
}

export async function listNewsletters(_req: AuthRequest, res: Response): Promise<void> {
  const newsletters = await listNewsletterHistory(50);
  res.json({ success: true, data: newsletters });
}
