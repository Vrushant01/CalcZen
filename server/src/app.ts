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

function resolvePublicDist(): string {
  const candidates = [path.resolve(process.cwd(), "dist"), path.resolve(__dirname, "../../dist")];
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
      console.warn(
        "Supabase connection check failed — ensure tables exist (run supabase/schema.sql).",
      );
    }
    dbVerified = true;
  }
}

import { calculatorMeta, categoryMeta } from "./config/metaData.js";

function getCanonicalUrl(urlPath: string): string {
  const pathPart = urlPath.endsWith("/") && urlPath !== "/" ? urlPath.slice(0, -1) : urlPath;
  return `https://www.calczen.in${pathPart}`;
}

async function getDynamicMetadata(
  urlPath: string,
): Promise<{ title: string; description: string; canonical: string }> {
  const canonical = getCanonicalUrl(urlPath);

  let title = "CalcZen — Smart Online Calculators";
  let description = "Free online calculators for finance, health, math and everyday life.";

  const pathPart = urlPath.endsWith("/") && urlPath !== "/" ? urlPath.slice(0, -1) : urlPath;
  const lowercasePath = pathPart.toLowerCase();

  if (lowercasePath.startsWith("/calculator/")) {
    const slug = lowercasePath.replace("/calculator/", "");
    const meta = calculatorMeta[slug];
    if (meta) {
      title = meta.title;
      description = meta.description;
    } else {
      const name = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      title = `${name} - Free Online Calculator | CalcZen`;
      description = `Use our free online ${name} for instant calculations, explanations, formulas, and worked examples.`;
    }
  } else if (lowercasePath.startsWith("/category/")) {
    const slug = lowercasePath.replace("/category/", "");
    const meta = categoryMeta[slug];
    if (meta) {
      title = meta.title;
      description = meta.description;
    }
  } else if (lowercasePath === "/tools") {
    title = "Tools - Coming Soon | CalcZen";
    description = "We're building a set of free tools. Coming soon.";
  }

  return { title, description, canonical };
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

  // Temporary Route Audit Debug Logging Middleware
  app.use((req, res, next) => {
    console.log(`[ROUTE AUDIT] Incoming Request: ${req.method} ${req.originalUrl || req.url}`);
    res.on("finish", () => {
      if (res.statusCode >= 400) {
        console.warn(
          `[ROUTE AUDIT] Request FAILED: ${req.method} ${req.originalUrl || req.url} -> Status ${res.statusCode}`,
        );
      } else {
        console.log(
          `[ROUTE AUDIT] Request SUCCEEDED: ${req.method} ${req.originalUrl || req.url} -> Status ${res.statusCode}`,
        );
      }
    });
    next();
  });

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
        adminContactMessages: "GET /api/admin/contact-messages",
        adminReplyMessage: "POST /api/admin/reply-message",
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

  // Serve public frontend static assets (robots.txt, ads.txt, assets/, sitemaps, etc.)
  const publicDist = resolvePublicDist();
  app.use(express.static(publicDist));

  // Serve public frontend index.html with dynamic metadata for crawlers/SEO
  app.get("*path", async (req, res, next) => {
    // Skip API, Admin, or files with extensions
    if (
      req.path.startsWith("/api") ||
      req.path.startsWith("/admin") ||
      req.path.match(/\.[a-zA-Z0-9]+$/)
    ) {
      return next();
    }

    const publicDist = resolvePublicDist();
    const indexPath = path.join(publicDist, "index.html");

    if (!fs.existsSync(indexPath)) {
      console.warn("Public index.html not found at:", indexPath);
      return next(); // Fallback to 404
    }

    fs.readFile(indexPath, "utf8", async (err, html) => {
      if (err) {
        console.error("Failed to read public index.html:", err);
        return res.status(500).send("Internal server error");
      }
      try {
        const metadata = await getDynamicMetadata(req.path);

        // 1. Remove all old SEO tags to prevent duplicates and handle minification attribute re-ordering
        let modifiedHtml = html;
        modifiedHtml = modifiedHtml.replace(/<title[^>]*>[^<]*<\/title>/gi, "");
        modifiedHtml = modifiedHtml.replace(/<meta\s+[^>]*name=["']?description["']?[^>]*>/gi, "");
        modifiedHtml = modifiedHtml.replace(/<link\s+[^>]*rel=["']?canonical["']?[^>]*>/gi, "");
        modifiedHtml = modifiedHtml.replace(
          /<meta\s+[^>]*property=["']?og:(title|description|url)["']?[^>]*>/gi,
          "",
        );
        modifiedHtml = modifiedHtml.replace(
          /<meta\s+[^>]*name=["']?twitter:(title|description)["']?[^>]*>/gi,
          "",
        );

        // 2. Inject fresh, verified dynamic metadata inside the head
        const seoMetaTags = `
    <title>${metadata.title}</title>
    <meta name="description" content="${metadata.description}" />
    <link rel="canonical" href="${metadata.canonical}" />
    <meta property="og:title" content="${metadata.title}" />
    <meta property="og:description" content="${metadata.description}" />
    <meta property="og:url" content="${metadata.canonical}" />
    <meta name="twitter:title" content="${metadata.title}" />
    <meta name="twitter:description" content="${metadata.description}" />
        `;
        modifiedHtml = modifiedHtml.replace("</head>", `${seoMetaTags}\n</head>`);

        // 3. Prevent any browser disk-level or CDN caching of the HTML file
        res.setHeader(
          "Cache-Control",
          "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        );
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");

        res.setHeader("Content-Type", "text/html");
        res.send(modifiedHtml);
      } catch (seoErr) {
        console.error("SEO Metadata Injector Error:", seoErr);
        // Fallback to sending raw unmodified HTML with no-cache
        res.setHeader(
          "Cache-Control",
          "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        );
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
        res.setHeader("Content-Type", "text/html");
        res.send(html);
      }
    });
  });

  app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Not found" });
  });

  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    applyCorsHeaders(req, res);
    const { status, message } = formatDbError(err);
    res.status(status).json({ success: false, message });
  });

  return app;
}
