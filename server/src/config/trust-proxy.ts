import type { Express } from "express";
import { env } from "./env.js";

/**
 * Render (and Cloudflare in front) set X-Forwarded-For. express-rate-limit reads req.ip
 * and throws ERR_ERL_UNEXPECTED_X_FORWARDED_FOR if trust proxy is not enabled.
 */
export function configureTrustProxy(app: Express): void {
  const behindProxy =
    process.env.RENDER === "true" ||
    Boolean(process.env.RENDER_EXTERNAL_URL) ||
    env.nodeEnv === "production";

  if (behindProxy) {
    app.set("trust proxy", 1);
  }
}

export function isTrustProxyEnabled(app: Express): boolean {
  return app.get("trust proxy") === 1 || app.get("trust proxy") === true;
}
