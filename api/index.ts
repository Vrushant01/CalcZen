import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createApp } from "../server/dist/app.js";

let appPromise: ReturnType<typeof createApp> | null = null;

/** Vercel serverless handler for /api/* and /admin (see vercel.json rewrites). */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!appPromise) {
      appPromise = createApp();
    }
    const app = await appPromise;
    return app(req as never, res as never);
  } catch (err) {
    console.error("API handler error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
