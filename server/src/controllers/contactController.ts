import type { Request, Response } from "express";
import validator from "validator";
import { hasEmailConfig } from "../config/env.js";
import { sendContactFormEmail } from "../services/emailService.js";

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

  const normalizedEmail = validator.normalizeEmail(email, {
    gmail_remove_dots: false,
  });

  if (!normalizedEmail || !validator.isEmail(normalizedEmail)) {
    res.status(400).json({ success: false, message: "Please enter a valid email address." });
    return;
  }

  if (!hasEmailConfig()) {
    res.status(503).json({
      success: false,
      message: "Contact form is temporarily unavailable. Please try again later.",
    });
    return;
  }

  try {
    await sendContactFormEmail({
      name: cleanName,
      email: normalizedEmail,
      message: cleanMessage,
      submittedAt: formatSubmittedAt(),
    });
  } catch (err) {
    console.error("Contact form email failed:", err);
    res.status(500).json({
      success: false,
      message: "We couldn't send your message. Please try again in a few minutes.",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Thanks for reaching out — we'll reply within 48 hours.",
  });
}
