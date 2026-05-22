import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import {
  applyCorsHeaders,
  CORS_HEADERS_HEADER,
  CORS_MAX_AGE,
  CORS_METHODS_HEADER,
  createCorsOptions,
  isOriginAllowed,
} from "../config/cors.js";

/**
 * Handles OPTIONS preflight before any other middleware that might block or omit CORS headers.
 * Must be registered first (after trust proxy).
 */
export function corsPreflightMiddleware(req: Request, res: Response, next: NextFunction): void {
  const origin = req.headers.origin;

  if (req.method === "OPTIONS") {
    if (!origin || isOriginAllowed(origin)) {
      if (origin) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Vary", "Origin");
      }
      res.setHeader("Access-Control-Allow-Methods", CORS_METHODS_HEADER);
      res.setHeader("Access-Control-Allow-Headers", CORS_HEADERS_HEADER);
      res.setHeader("Access-Control-Max-Age", CORS_MAX_AGE);
      res.status(204).end();
      return;
    }

    res.status(403).json({ success: false, message: "CORS preflight denied" });
    return;
  }

  next();
}

/** Ensures allowed origins get headers even if a downstream handler omits them. */
export function corsHeadersMiddleware(req: Request, res: Response, next: NextFunction): void {
  applyCorsHeaders(req, res);
  next();
}

export const corsMiddleware = cors(createCorsOptions());
