import type { Response } from "express";
import { z } from "zod";
import { hasEmailConfig } from "../config/env.js";
import type { AuthRequest } from "../middleware/auth.js";
import { sendSupportReplyEmail } from "../services/emailService.js";
import {
  getContactMessageById,
  listContactMessages,
  markContactMessageRead,
  saveContactReply,
} from "../services/contactMessageService.js";
import type { ContactMessageStatus } from "../types/database.js";
import { formatDbError } from "../utils/errors.js";

const statusSchema = z.enum(["unread", "read", "replied"]);

export async function listContactMessagesHandler(req: AuthRequest, res: Response): Promise<void> {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  const statusRaw = typeof req.query.status === "string" ? req.query.status : undefined;

  let status: ContactMessageStatus | undefined;
  if (statusRaw) {
    const parsed = statusSchema.safeParse(statusRaw);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: "Invalid status filter." });
      return;
    }
    status = parsed.data;
  }

  try {
    const result = await listContactMessages({ search, status, page, limit });
    res.json({ success: true, data: result });
  } catch (err) {
    const { status: code, message } = formatDbError(err);
    res.status(code).json({ success: false, message });
  }
}

function paramId(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0] ?? "";
  return "";
}

export async function getContactMessageHandler(req: AuthRequest, res: Response): Promise<void> {
  const id = paramId(req.params.id);
  if (!id) {
    res.status(400).json({ success: false, message: "Message id is required." });
    return;
  }

  try {
    let message = await getContactMessageById(id);
    if (!message) {
      res.status(404).json({ success: false, message: "Message not found." });
      return;
    }

    if (message.status === "unread") {
      message = (await markContactMessageRead(id)) ?? message;
    }

    res.json({ success: true, data: message });
  } catch (err) {
    const { status, message } = formatDbError(err);
    res.status(status).json({ success: false, message });
  }
}

export async function replyToContactMessageHandler(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const { id, reply } = req.body as { id: string; reply: string };

  try {
    const existing = await getContactMessageById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: "Message not found." });
      return;
    }

    if (!hasEmailConfig()) {
      res.status(503).json({
        success: false,
        message: "Email is not configured. Cannot send reply.",
      });
      return;
    }

    const cleanReply = reply.trim();

    await sendSupportReplyEmail(existing.email, {
      recipientName: existing.name,
      originalSubject: existing.subject,
      originalMessage: existing.message,
      replyBody: cleanReply,
    });

    const updated = await saveContactReply(id, cleanReply);
    if (!updated) {
      res.status(404).json({ success: false, message: "Message not found." });
      return;
    }

    res.json({
      success: true,
      message: "Reply sent successfully.",
      data: updated,
    });
  } catch (err) {
    console.error("Reply to contact message failed:", err);
    const { status, message } = formatDbError(err);
    res.status(status >= 400 ? status : 500).json({
      success: false,
      message: err instanceof Error && status === 500 ? "Failed to send reply. Please try again." : message,
    });
  }
}
