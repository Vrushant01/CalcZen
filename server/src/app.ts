import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express, { type Express } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env, hasDbConfig } from "./config/env.js";
import { verifySupabaseConnection } from "./config/supabase.js";
import { mongoSanitize } from "./middleware/sanitize.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
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

/** Create Express app (Vercel serverless + local dev) */
export async function createApp(): Promise<Express> {
  await ensureDb();

  const app = express();

  if (env.nodeEnv === "production") {
    app.set("trust proxy", 1);
  }

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(
    cors({
      origin: env.corsOrigin.split(",").map((o) => o.trim()),
      credentials: true,
    }),
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(mongoSanitize);

  app.get("/", (_req, res) => {
    res.json({
      success: true,
      message: "CalcZen API is running",
      database: "Supabase PostgreSQL",
      links: {
        health: "/api/health",
        subscribe: "POST /api/subscribe",
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
    (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error(err);
      const { status, message } = formatDbError(err);
      res.status(status).json({ success: false, message });
    },
  );

  return app;
}
