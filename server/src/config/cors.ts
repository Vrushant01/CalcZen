import type { CorsOptions } from "cors";
import type { Request, Response } from "express";
import { env } from "./env.js";

export const CORS_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] as const;

export const CORS_ALLOWED_HEADERS = [
  "Content-Type",
  "Authorization",
  "X-Requested-With",
  "Accept",
  "Origin",
] as const;

/** Required production + dev origins (always allowed). */
export const EXPLICIT_ALLOWED_ORIGINS = [
  "https://calczen.in",
  "https://www.calczen.in",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
] as const;

const CORS_METHODS_HEADER = CORS_METHODS.join(",");
const CORS_HEADERS_HEADER = CORS_ALLOWED_HEADERS.join(",");
const CORS_MAX_AGE = "86400";

const explicitSet = new Set<string>(EXPLICIT_ALLOWED_ORIGINS);

function getEnvOrigins(): Set<string> {
  const set = new Set<string>();
  for (const part of env.corsOrigin.split(",")) {
    const o = part.trim().replace(/\/$/, "");
    if (o) set.add(o);
  }
  return set;
}

function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/$/, "");
}

/**
 * Production origin policy:
 * - Explicit: calczen.in, www.calczen.in, localhost:5173
 * - Any https://*.vercel.app
 * - http://localhost:* and http://127.0.0.1:*
 * - https://calczen.in and https://*.calczen.in (subdomains)
 * - CORS_ORIGIN env extras
 */
export function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) {
    return true;
  }

  const normalized = normalizeOrigin(origin);

  if (explicitSet.has(normalized) || getEnvOrigins().has(normalized)) {
    return true;
  }

  let url: URL;
  try {
    url = new URL(normalized);
  } catch {
    return false;
  }

  const { protocol, hostname } = url;

  if (protocol === "https:" && hostname.endsWith(".vercel.app")) {
    return true;
  }

  if (
    protocol === "http:" &&
    (hostname === "localhost" || hostname === "127.0.0.1")
  ) {
    return true;
  }

  if (
    protocol === "https:" &&
    (hostname === "calczen.in" || hostname.endsWith(".calczen.in"))
  ) {
    return true;
  }

  return false;
}

export function applyCorsHeaders(req: Request, res: Response): void {
  const origin = req.headers.origin;

  if (!origin || !isOriginAllowed(origin)) {
    return;
  }

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Vary", "Origin");
}

export function createCorsOptions(): CorsOptions {
  return {
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (isOriginAllowed(origin)) {
        callback(null, origin);
        return;
      }

      console.warn(`[CORS] Blocked origin: ${origin}`);
      callback(null, false);
    },
    methods: [...CORS_METHODS],
    allowedHeaders: [...CORS_ALLOWED_HEADERS],
    exposedHeaders: ["Content-Disposition"],
    credentials: true,
    optionsSuccessStatus: 204,
    maxAge: 86400,
    preflightContinue: false,
  };
}

export function getCorsPolicySummary(): string {
  return [
    ...EXPLICIT_ALLOWED_ORIGINS,
    "https://*.vercel.app",
    "http://localhost:*",
    "http://127.0.0.1:*",
    "https://*.calczen.in",
    ...getEnvOrigins(),
  ].join(", ");
}
