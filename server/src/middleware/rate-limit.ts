import rateLimit, { type Options } from "express-rate-limit";

/** Shared defaults — OPTIONS skipped; requires trust proxy on Render (see configureTrustProxy). */
export function createRateLimiter(options: Partial<Options> = {}) {
  return rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === "OPTIONS",
    ...options,
  });
}

export const globalApiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
});
