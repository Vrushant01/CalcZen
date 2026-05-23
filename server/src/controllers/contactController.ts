import type { Request, Response } from "express";
import validator from "validator";
import { hasDbConfig, hasEmailConfig } from "../config/env.js";
import { sendContactFormEmail } from "../services/emailService.js";
import { createContactMessage } from "../services/contactMessageService.js";
import { formatDbError } from "../utils/errors.js";

export type ContactBody = {
  name: string;
  email: string;
  message: string;
  _gotcha?: string;
};

function collapseWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function formatSubmittedAt(): string {
  return new Date().toLocaleString("en-IN", {
    dateStyle: "full",
    timeStyle: "long",
    timeZone: "Asia/Kolkata",
  });
}

export async function submitContact(req: Request, res: Response): Promise<void> {
  const { name, email, message, _gotcha } = req.body as ContactBody;

  if (_gotcha && String(_gotcha).trim().length > 0) {
    res.status(200).json({
      success: true,
      message: "Thanks for reaching out — we'll reply within 48 hours.",
    });
    return;
  }

  const cleanName = collapseWhitespace(name);
  const cleanMessage = message.trim();
  const subject = `Contact from ${cleanName}`;

  const normalizedEmail = validator.normalizeEmail(email, {
    gmail_remove_dots: false,
  });

  if (!normalizedEmail || !validator.isEmail(normalizedEmail)) {
    res.status(400).json({ success: false, message: "Please enter a valid email address." });
    return;
  }

  if (!hasDbConfig()) {
    res.status(503).json({
      success: false,
      message: "Contact form is temporarily unavailable. Please try again later.",
    });
    return;
  }

  let saved;
  try {
    saved = await createContactMessage({
      name: cleanName,
      email: normalizedEmail,
      subject,
      message: cleanMessage,
    });
  } catch (err) {
    const { status, message: msg } = formatDbError(err);
    res.status(status).json({ success: false, message: msg });
    return;
  }

  if (hasEmailConfig()) {
    try {
      await sendContactFormEmail({
        name: cleanName,
        email: normalizedEmail,
        subject,
        message: cleanMessage,
        submittedAt: formatSubmittedAt(),
      });
    } catch (err) {
      console.error("Contact notification email failed (message saved):", err);
    }
  } else {
    console.warn("Resend not configured — contact message saved without notification email.");
  }

  res.status(200).json({
    success: true,
    message: "Thanks for reaching out — we'll reply within 48 hours.",
    data: { id: saved._id },
  });
}
