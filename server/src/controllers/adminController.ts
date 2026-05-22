import type { Response } from "express";
import type { SubscriberStatus } from "../types/database.js";
import { subscribersToCsv } from "../utils/csvExport.js";
import type { AuthRequest } from "../middleware/auth.js";
import {
  deleteSubscriberById,
  getAllSubscribersForExport,
  getRecentSubscribers,
  getSubscriberStats,
  listSubscribers,
} from "../services/subscriberService.js";

export async function getStats(_req: AuthRequest, res: Response): Promise<void> {
  const data = await getSubscriberStats();
  res.json({ success: true, data });
}

export async function getRecentSubscribersHandler(
  _req: AuthRequest,
  res: Response,
): Promise<void> {
  const subscribers = await getRecentSubscribers(8);
  res.json({ success: true, data: subscribers });
}

export async function listSubscribersHandler(req: AuthRequest, res: Response): Promise<void> {
  const search = (req.query.search as string | undefined)?.trim();
  const status = req.query.status as SubscriberStatus | undefined;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

  const { subscribers, total } = await listSubscribers({
    search: search || undefined,
    status: status === "active" || status === "unsubscribed" ? status : undefined,
    page,
    limit,
  });

  res.json({
    success: true,
    data: {
      subscribers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    },
  });
}

export async function deleteSubscriber(req: AuthRequest, res: Response): Promise<void> {
  const id = String(req.params.id);
  const deleted = await deleteSubscriberById(id);

  if (!deleted) {
    res.status(404).json({ success: false, message: "Subscriber not found" });
    return;
  }

  res.json({ success: true, message: "Subscriber removed" });
}

export async function exportSubscribers(_req: AuthRequest, res: Response): Promise<void> {
  const subscribers = await getAllSubscribersForExport();
  const csv = subscribersToCsv(subscribers);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="subscribers.csv"');
  res.send(csv);
}
