import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createApp } from "../server/dist/app.js";

let appPromise: ReturnType<typeof createApp> | null = null;

/** Vercel serverless handler — build server first: cd server && npm run build */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!appPromise) {
    appPromise = createApp();
  }
  const app = await appPromise;
  return app(req as never, res as never);
}
