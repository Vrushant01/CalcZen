import type { Request, Response } from "express";
import validator from "validator";
import { hasEmailConfig } from "../config/env.js";
import { sendWelcomeEmail } from "../services/emailService.js";
import {
  createSubscriber,
  findSubscriberByEmail,
  reactivateSubscriber,
} from "../services/subscriberService.js";
import { formatDbError } from "../utils/errors.js";

export async function subscribe(req: Request, res: Response): Promise<void> {
  const { email } = req.body as { email: string };

  if (!email || !validator.isEmail(email)) {
    res.status(400).json({ success: false, message: "Please enter a valid email address." });
    return;
  }

  const normalized = validator.normalizeEmail(email, {
    gmail_remove_dots: false,
  }) as string;

  let existing;
  try {
    existing = await findSubscriberByEmail(normalized);
  } catch (err) {
    const { status, message } = formatDbError(err);
    res.status(status).json({ success: false, message });
    return;
  }

  if (existing?.status === "active") {
    res.status(409).json({
      success: false,
      message: "This email is already subscribed.",
    });
    return;
  }

  let subscriber;

  try {
    if (existing) {
      subscriber = await reactivateSubscriber(existing.id);
    } else {
      subscriber = await createSubscriber({
        email: normalized,
        source: "website",
        status: "active",
      });
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "DUPLICATE_EMAIL") {
      res.status(409).json({
        success: false,
        message: "This email is already subscribed.",
      });
      return;
    }
    const { status, message } = formatDbError(err);
    res.status(status).json({ success: false, message });
    return;
  }

  if (hasEmailConfig()) {
    try {
      await sendWelcomeEmail(normalized);
    } catch (err) {
      console.error("Welcome email failed (subscriber kept):", err);
    }
  } else {
    console.warn("Resend not configured — subscriber saved without welcome email.");
  }

  res.status(201).json({
    success: true,
    message: "Thanks! You're subscribed.",
    data: {
      email: subscriber.email,
      subscribedAt: subscriber.subscribedAt,
      status: subscriber.status,
    },
  });
}
