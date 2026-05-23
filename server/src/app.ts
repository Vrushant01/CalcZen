import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express, { type Express, type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import { configureTrustProxy } from "./config/trust-proxy.js";
import { applyCorsHeaders } from "./config/cors.js";
import { env, hasDbConfig } from "./config/env.js";
import { verifySupabaseConnection } from "./config/supabase.js";
import {
  corsHeadersMiddleware,
  corsMiddleware,
  corsPreflightMiddleware,
} from "./middleware/cors.js";
import { globalApiLimiter } from "./middleware/rate-limit.js";
import { mongoSanitize } from "./middleware/sanitize.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import subscribeRoutes from "./routes/subscribeRoutes.js";
import { formatDbError } from "./utils/errors.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function resolveAdminDist(): string {
  const candidates = [
    path.resolve(process.cwd(), "admin/dist"),
    path.resolve(__dirname, "../../admin/dist"),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, "index.html"))) {
      return dir;
    }
  }
  return candidates[0];
}

let dbVerified = false;

async function ensureDb(): Promise<void> {
  if (!dbVerified && hasDbConfig()) {
    const ok = await verifySupabaseConnection();
    if (!ok) {
      console.warn("Supabase connection check failed — ensure tables exist (run supabase/schema.sql).");
    }
    dbVerified = true;
  }
}

/**
 * Express app — production order:
 * 1. trust proxy (Render / rate-limit)
 * 2. CORS preflight + cors + header backup
 * 3. security (helmet)
 * 4. rate limit (after trust proxy)
 * 5. body parser
 * 6. routes
 * 7. 404 + error handler (with CORS on errors)
 */
export async function createApp(): Promise<Express> {
  const app = express();

  // MUST be first: Render sets X-Forwarded-For; rate-limit throws without this.
  configureTrustProxy(app);

  app.use(corsPreflightMiddleware);
  app.use(corsMiddleware);
  app.use(corsHeadersMiddleware);

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
    }),
  );

  app.use(globalApiLimiter);

  app.use(express.json({ limit: "1mb" }));
  app.use(mongoSanitize);

  void ensureDb();

  app.get("/", (_req, res) => {
    res.json({
      success: true,
      message: "CalcZen API is running",
      database: "Supabase PostgreSQL",
      links: {
        health: "/api/health",
        subscribe: "POST /api/subscribe",
        contact: "POST /api/contact",
        adminLogin: "POST /api/auth/login",
        adminPanel: "/admin",
      },
    });
  });

  app.get("/api", (_req, res) => {
    res.json({
      success: true,
      endpoints: {
        health: "GET /api/health",
        subscribe: "POST /api/subscribe",
        authLogin: "POST /api/auth/login",
        adminStats: "GET /api/admin/stats",
        subscribers: "GET /api/admin/subscribers",
        newsletterSend: "POST /api/newsletters/send",
      },
    });
  });

  app.get("/api/health", async (_req, res) => {
    const dbOk = hasDbConfig() ? await verifySupabaseConnection() : false;
    res.json({
      success: true,
      message: "CalcZen API is running",
      database: dbOk ? "connected" : "not configured",
    });
  });

  app.use("/api/subscribe", subscribeRoutes);
  app.use("/api/contact", contactRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/newsletters", newsletterRoutes);

  const adminDist = resolveAdminDist();
  app.use("/admin", express.static(adminDist, { index: "index.html" }));
  app.get(["/admin", "/admin/*path"], (req, res, next) => {
    if (req.path.match(/\.[a-zA-Z0-9]+$/)) {
      return next();
    }
    res.sendFile(path.join(adminDist, "index.html"), (err) => {
      if (err) {
        res.status(503).json({
          success: false,
          message: "Admin panel not built. Run: npm run build:admin",
        });
      }
    });
  });

  app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Not found" });
  });

  app.use(
    (err: unknown, req: Request, res: Response, _next: NextFunction) => {
      console.error(err);
      applyCorsHeaders(req, res);
      const { status, message } = formatDbError(err);
      res.status(status).json({ success: false, message });
    },
  );

  return app;
}
