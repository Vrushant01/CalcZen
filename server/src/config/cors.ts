import type { CorsOptions } from "cors";
import { env } from "./env.js";

/** Always allowed (merged with CORS_ORIGIN on Render). */
const DEFAULT_ALLOWED_ORIGINS = [
  "https://calc-zen-git-main-vrushant01s-projects.vercel.app",
  "https://www.calczen.com",
  "https://calczen.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:8080",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:8080",
] as const;

const CORS_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] as const;

const CORS_ALLOWED_HEADERS = [
  "Content-Type",
  "Authorization",
  "X-Requested-With",
  "Accept",
  "Origin",
] as const;

function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/$/, "");
}

export function getAllowedOrigins(): string[] {
  const fromEnv = env.corsOrigin
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);

  return [...new Set([...DEFAULT_ALLOWED_ORIGINS, ...fromEnv])];
}

/** Vercel preview/production deployments (*.vercel.app). */
function isVercelAppOrigin(origin: string): boolean {
  try {
    const { hostname, protocol } = new URL(origin);
    return protocol === "https:" && hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

export function createCorsOptions(): CorsOptions {
  const allowed = new Set(getAllowedOrigins());

  return {
    origin(origin, callback) {
      // Server-to-server, curl, same-origin — no Origin header
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalized = normalizeOrigin(origin);

      if (allowed.has(normalized)) {
        callback(null, true);
        return;
      }

      if (isVercelAppOrigin(normalized)) {
        callback(null, true);
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
  };
}
