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
import blogRoutes from "./routes/blogRoutes.js";
import { findPublishedBlogBySlug } from "./services/blogService.js";

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
  const candidates = [
    path.resolve(process.cwd(), "dist"),
    path.resolve(__dirname, "../../dist"),
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

const calculatorMeta: Record<string, { title: string; description: string }> = {
  "mortgage-calculator": {
    title: "Mortgage Calculator - Estimate Monthly Home Loan Payments | CalcZen",
    description: "Calculate monthly mortgage payments, interest rates, taxes, and HOA fees instantly. Estimate your home loan costs and budget with our free calculator."
  },
  "compound-interest-calculator": {
    title: "Compound Interest Calculator - Calculate Savings Growth Online | CalcZen",
    description: "Calculate compound interest growth for your savings and investments. See detailed annual compound schedules and charts to visualize your future wealth."
  },
  "loan-emi-calculator": {
    title: "Loan EMI Calculator - Calculate Monthly Loan Payments Online | CalcZen",
    description: "Calculate your monthly loan EMI payouts, interest payable, and total loan payment instantly. Plan home, car, or personal loan budgets with our tool."
  },
  "bmi-calculator": {
    title: "BMI Calculator - Calculate Body Mass Index Online | CalcZen",
    description: "Calculate your Body Mass Index (BMI) instantly. Understand your healthy weight category and track your health fitness metrics online with our tool."
  },
  "calorie-calculator": {
    title: "Calorie Calculator - Calculate Daily Calorie Needs Online | CalcZen",
    description: "Estimate daily calorie needs for weight loss, gain, or maintenance. Calculate your TDEE based on height, weight, activity, and fitness goals easily."
  },
  "water-intake-calculator": {
    title: "Water Intake Calculator - Calculate Daily Hydration Needs | CalcZen",
    description: "Calculate your daily water intake needs based on weight, exercise time, and climate. Keep hydrated and track your daily hydration goals with ease."
  },
  "pregnancy-due-date-calculator": {
    title: "Pregnancy Due Date Calculator - Calculate Baby Due Date | CalcZen",
    description: "Estimate your baby's due date, gestational age, and pregnancy progress timeline instantly. Track your pregnancy milestones online using clinical metrics."
  },
  "percentage-calculator": {
    title: "Percentage Calculator - Calculate Percent Shifts and Ratios | CalcZen",
    description: "Calculate percentage increases, decreases, differences, and fractional shifts instantly. Solve school or business percent math equations in seconds."
  },
  "age-calculator": {
    title: "Age Calculator - Calculate Exact Age from Date of Birth | CalcZen",
    description: "Calculate your exact age in years, months, days, minutes, and seconds from your birthdate. Find the time remaining until your next birthday instantly."
  },
  "tip-calculator": {
    title: "Tip Calculator - Calculate Restaurant Tips & Split Bills | CalcZen",
    description: "Calculate tip percentages and split restaurant bills evenly among friends in seconds. Manage tipping amounts and group payment transactions fairly."
  },
  "bmr-calculator": {
    title: "BMR Calculator - Calculate Basal Metabolic Rate Online | CalcZen",
    description: "Calculate your Basal Metabolic Rate (BMR) instantly. Estimate calories burned at rest based on height, weight, gender, and age for fitness planning."
  }
};

const categoryMeta: Record<string, { title: string; description: string }> = {
  finance: {
    title: "Finance Calculators - Loans, investments, savings & more | CalcZen",
    description: "Explore our free online finance calculators for mortgages, loan EMIs, compound interest growth, and daily financial planning."
  },
  health: {
    title: "Health & Fitness Calculators - BMI, calories, BMR & more | CalcZen",
    description: "Track your fitness goals with our free health calculators. Estimate BMI, daily calorie targets, BMR, water intake, and pregnancy milestones."
  },
  math: {
    title: "Math & Percentage Calculators - Ratios, age & GPA | CalcZen",
    description: "Solve math equations and daily figures easily. Free percentage calculators, age estimators, ratio solvers, and academic GPA helpers."
  },
  everyday: {
    title: "Everyday Calculators - Tips, dates, fuel & lifestyle | CalcZen",
    description: "Simple online tools for daily tasks. Split restaurant bills, calculate tips, analyze fuel costs, and organize your lifestyle with ease."
  }
};

function getCanonicalUrl(urlPath: string): string {
  const pathPart = urlPath.endsWith("/") && urlPath !== "/" ? urlPath.slice(0, -1) : urlPath;
  return `https://calczen.in${pathPart}`;
}

interface DynamicMetadata {
  title: string;
  description: string;
  canonical: string;
  h1: string;
  jsonld?: any;
  featured_image?: string | null;
}

async function getDynamicMetadata(urlPath: string): Promise<DynamicMetadata> {
  const canonical = getCanonicalUrl(urlPath);
  
  let title = "Free Online Calculators for Finance, Health & Math | CalcZen";
  let description = "Free online calculators for finance, health, math and everyday life.";
  let h1 = "Free Online Calculators";
  let jsonld: any = null;
  let featured_image: string | null = null;

  try {
    const pathPart = urlPath.endsWith("/") && urlPath !== "/" ? urlPath.slice(0, -1) : urlPath;
    const lowercasePath = pathPart.toLowerCase();

    if (lowercasePath === "" || lowercasePath === "/") {
      title = "Free Online Calculators for Finance, Health & Math | CalcZen";
      description = "Free online calculators for finance, health, math and everyday life.";
      h1 = "Free Online Calculators";
      jsonld = [
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": "https://calczen.in/#website",
          "url": "https://calczen.in",
          "name": "CalcZen",
          "description": description
        },
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://calczen.in/#organization",
          "url": "https://calczen.in",
          "name": "CalcZen",
          "logo": "https://calczen.in/icons/android-chrome-512x512.png"
        }
      ];
    } else if (lowercasePath.startsWith("/calculator/")) {
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
      h1 = title.split(" - ")[0];
      jsonld = [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://calczen.in"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Calculators",
              "item": "https://calczen.in/calculators"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": h1,
              "item": canonical
            }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "@id": `${canonical}#webapp`,
          "url": canonical,
          "name": h1,
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "All",
          "browserRequirements": "Requires HTML5/JavaScript",
          "description": description
        }
      ];
    } else if (lowercasePath.startsWith("/category/")) {
      const slug = lowercasePath.replace("/category/", "");
      const meta = categoryMeta[slug];
      const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
      if (meta) {
        title = meta.title;
        description = meta.description;
      } else {
        title = `${categoryName} Calculators | CalcZen`;
        description = `Explore our list of free online ${categoryName} calculators.`;
      }
      h1 = `${categoryName} Calculators`;
      jsonld = [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://calczen.in"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": h1,
              "item": canonical
            }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "url": canonical,
          "name": title,
          "description": description
        }
      ];
    } else if (lowercasePath.startsWith("/blog/")) {
      const parts = lowercasePath.split("/").filter(Boolean);
      const slug = parts[parts.length - 1];
      try {
        const blog = await findPublishedBlogBySlug(slug);
        if (blog) {
          title = blog.metaTitle || `${blog.title} | CalcZen`;
          description = blog.metaDescription || blog.excerpt || (blog.content.replace(/<[^>]*>/g, "").substring(0, 155) + "...");
          h1 = blog.title;
          jsonld = blog.jsonld;
          featured_image = blog.featuredImage || blog.thumbnail || null;
          if (featured_image && !featured_image.startsWith("http") && !featured_image.startsWith("/")) {
            featured_image = "/" + featured_image;
          }
          if (featured_image && featured_image.startsWith("/")) {
            featured_image = `https://calczen.in${featured_image}`;
          }
        }
      } catch (err: any) {
        console.error(`[METADATA BLOG FETCH ERROR] Failed to fetch blog database entry for slug: ${slug}`, err.message, err.stack);
      }
    } else if (lowercasePath === "/about") {
      title = "About Us - CalcZen";
      description = "Learn more about CalcZen, our mission to build beautiful online tools, and our standards for mathematical accuracy.";
      h1 = "About CalcZen";
    } else if (lowercasePath === "/contact") {
      title = "Contact Us - CalcZen";
      description = "Have feedback or a request for a new calculator? Reach out to the CalcZen team directly.";
      h1 = "Contact CalcZen";
    } else if (lowercasePath === "/privacy") {
      title = "Privacy Policy - CalcZen";
      description = "Read the CalcZen privacy policy to understand how we secure your data and maintain privacy.";
      h1 = "Privacy Policy";
    } else if (lowercasePath === "/terms") {
      title = "Terms of Service - CalcZen";
      description = "View the terms and conditions for using CalcZen calculators and resources.";
      h1 = "Terms of Service";
    } else if (lowercasePath === "/disclaimer") {
      title = "Disclaimer - CalcZen";
      description = "Read our site disclaimer regarding the informational nature of our calculation results.";
      h1 = "Disclaimer";
    } else if (lowercasePath === "/calculators") {
      title = "All Calculators - CalcZen";
      description = "Browse our complete directory of free online calculators for finance, health, math, and everyday tasks.";
      h1 = "All Online Calculators";
    } else if (lowercasePath === "/blog") {
      title = "CalcZen Blog - Financial Tips, Health Insights & Math Guides";
      description = "Expert guides, calculator tutorials, and practical articles on managing personal finance, tracking fitness goals, and solving math problems.";
      h1 = "CalcZen Blog";
    }
  } catch (globalMetaErr: any) {
    console.error("[METADATA ENGINE CRITICAL ERROR] Failed during metadata generation for path:", urlPath, globalMetaErr.message, globalMetaErr.stack);
  }

  return { title, description, canonical, h1, jsonld, featured_image };
}

// Fallback HTML template in case index.html is missing on production server filesystem
const fallbackHtmlTemplate = (metadata: DynamicMetadata) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${metadata.title}</title>
  <meta name="description" content="${metadata.description}" />
  <link rel="canonical" href="${metadata.canonical}" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta property="og:title" content="${metadata.title}" />
  <meta property="og:description" content="${metadata.description}" />
  <meta property="og:url" content="${metadata.canonical}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="CalcZen" />
  <meta property="og:image" content="${metadata.featured_image || 'https://calczen.in/icons/android-chrome-512x512.png'}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${metadata.title}" />
  <meta name="twitter:description" content="${metadata.description}" />
  <meta name="twitter:image" content="${metadata.featured_image || 'https://calczen.in/icons/android-chrome-512x512.png'}" />
  <link rel="icon" type="image/png" href="/icons/favicon-32x32.png" />
  ${metadata.jsonld ? (Array.isArray(metadata.jsonld) ? metadata.jsonld : [metadata.jsonld]).map(node => `<script type="application/ld+json">${JSON.stringify(node)}</script>`).join("\n") : ""}
</head>
<body style="background:#0f172a;color:#cbd5e1;font-family:system-ui,sans-serif;margin:0;padding:2rem;display:flex;justify-content:center;">
  <div style="max-width:800px;width:100%;">
    <header style="margin-bottom:2rem;"><a href="/" style="color:#6366f1;font-weight:bold;text-decoration:none;font-size:1.5rem;">CalcZen</a></header>
    <main>
      <h1 style="color:#f8fafc;font-size:2.25rem;margin-bottom:1rem;">${metadata.h1}</h1>
      <p style="font-size:1.125rem;line-height:1.75;margin-bottom:2rem;">${metadata.description}</p>
      <div style="background:#1e293b;padding:1.5rem;border-radius:0.75rem;border:1px solid #334155;">
        <p style="margin:0;font-size:0.875rem;color:#94a3b8;">Please enable JavaScript to access all interactive tools, calculators, and sliders on this page.</p>
      </div>
    </main>
  </div>
</body>
</html>`;

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
        console.warn(`[ROUTE AUDIT] Request FAILED: ${req.method} ${req.originalUrl || req.url} -> Status ${res.statusCode}`);
      } else {
        console.log(`[ROUTE AUDIT] Request SUCCEEDED: ${req.method} ${req.originalUrl || req.url} -> Status ${res.statusCode}`);
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
  app.use("/api/blogs", blogRoutes);

  // Serve static uploaded images
  const uploadsDir = path.resolve(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use("/uploads", express.static(uploadsDir));

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
    if (req.path.startsWith("/api") || req.path.startsWith("/admin") || req.path.match(/\.[a-zA-Z0-9]+$/)) {
      return next();
    }

    let metadata: DynamicMetadata | null = null;
    try {
      metadata = await getDynamicMetadata(req.path);
    } catch (metaErr: any) {
      console.error("[CRITICAL META FAILURE] getDynamicMetadata crashed completely for path:", req.path, metaErr.message, metaErr.stack);
      metadata = {
        title: "Free Online Calculators for Finance, Health & Math | CalcZen",
        description: "Free online calculators for finance, health, math and everyday life.",
        canonical: `https://calczen.in${req.path}`,
        h1: "Free Online Calculators",
      };
    }

    const publicDist = resolvePublicDist();
    const indexPath = path.join(publicDist, "index.html");

    // Fallback to dynamic template if index.html is missing
    if (!fs.existsSync(indexPath)) {
      console.warn(`[PRERENDER WARNING] index.html not found at: ${indexPath}. Rendering page via fallback HTML template.`);
      res.setHeader("Content-Type", "text/html");
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
      res.send(fallbackHtmlTemplate(metadata));
      return;
    }

    fs.readFile(indexPath, "utf8", async (err, html) => {
      if (err) {
        console.error(`[PRERENDER FILE READ ERROR] Failed to read public index.html from path: ${indexPath}. rendering fallback HTML template.`, err.message, err.stack);
        res.setHeader("Content-Type", "text/html");
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
        res.send(fallbackHtmlTemplate(metadata!));
        return;
      }

      try {
        // 1. Remove all old SEO tags to prevent duplicates and handle minification attribute re-ordering
        let modifiedHtml = html;
        modifiedHtml = modifiedHtml.replace(/<title[^>]*>[^<]*<\/title>/gi, "");
        modifiedHtml = modifiedHtml.replace(/<meta\s+[^>]*name=["']?description["']?[^>]*>/gi, "");
        modifiedHtml = modifiedHtml.replace(/<link\s+[^>]*rel=["']?canonical["']?[^>]*>/gi, "");
        modifiedHtml = modifiedHtml.replace(/<meta\s+[^>]*property=["']?og:(title|description|url|image|type|site_name)["']?[^>]*>/gi, "");
        modifiedHtml = modifiedHtml.replace(/<meta\s+[^>]*name=["']?twitter:(title|description|card|image)["']?[^>]*>/gi, "");
        modifiedHtml = modifiedHtml.replace(/<meta\s+[^>]*name=["']?robots["']?[^>]*>/gi, "");

        // 2. Inject fresh, verified dynamic metadata inside the head
        const ogImage = metadata!.featured_image || "https://calczen.in/icons/android-chrome-512x512.png";
        let seoMetaTags = `
    <title>${metadata!.title}</title>
    <meta name="description" content="${metadata!.description}" />
    <link rel="canonical" href="${metadata!.canonical}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta property="og:title" content="${metadata!.title}" />
    <meta property="og:description" content="${metadata!.description}" />
    <meta property="og:url" content="${metadata!.canonical}" />
    <meta property="og:type" content="${req.path.startsWith("/blog/") ? "article" : "website"}" />
    <meta property="og:site_name" content="CalcZen" />
    <meta property="og:image" content="${ogImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${metadata!.title}" />
    <meta name="twitter:description" content="${metadata!.description}" />
    <meta name="twitter:image" content="${ogImage}" />
        `;

        if (metadata!.jsonld) {
          const graphs = Array.isArray(metadata!.jsonld) ? metadata!.jsonld : [metadata!.jsonld];
          graphs.forEach(node => {
            seoMetaTags += `
    <script type="application/ld+json">${JSON.stringify(node)}</script>`;
          });
        }

        modifiedHtml = modifiedHtml.replace("</head>", `${seoMetaTags}\n</head>`);

        // 3. Inject dynamic body/H1 fallback inside #root
        const dynamicSeoContent = `
    <div style="display: none;">
      <h1>${metadata!.h1}</h1>
      <p>${metadata!.description}</p>
    </div>
        `;
        modifiedHtml = modifiedHtml.replace(
          /<!--seo-content-->[\s\S]*?<!--\/seo-content-->/gi,
          `<!--seo-content-->${dynamicSeoContent}<!--/seo-content-->`
        );

        // 4. Prevent any browser disk-level or CDN caching of the HTML file
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");

        res.setHeader("Content-Type", "text/html");
        res.send(modifiedHtml);
      } catch (seoErr: any) {
        console.error("[PRERENDER ENGINE EXCEPTION] Failed to compile rewrites inside index.html templates.", seoErr.message, seoErr.stack);
        // Fallback to sending dynamic fallback template
        res.setHeader("Content-Type", "text/html");
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
        res.send(fallbackHtmlTemplate(metadata!));
      }
    });
  });

  // Global Page-aware 404 Handler
  app.use((req, res) => {
    const isPageRequest = !req.path.startsWith("/api") && !req.path.startsWith("/admin") && !req.path.match(/\.[a-zA-Z0-9]+$/);
    if (isPageRequest) {
      res.status(404).setHeader("Content-Type", "text/html");
      res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Page Not Found | CalcZen</title>
  <meta name="description" content="The page you are looking for does not exist." />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { background: #0F172A; color: #F8FAFC; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .container { text-align: center; max-width: 500px; padding: 2rem; }
    h1 { color: #F59E0B; font-size: 2.5rem; margin-bottom: 1rem; }
    p { color: #94A3B8; font-size: 1.1rem; line-height: 1.6; }
    a { color: #6366F1; text-decoration: none; font-weight: bold; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Page Not Found</h1>
    <p>The page you are looking for does not exist. Check the URL or return to the <a href="/">Homepage</a>.</p>
  </div>
</body>
</html>`);
      return;
    }
    res.status(404).json({ success: false, message: "Not found" });
  });

  // Global Error Handler
  app.use(
    (err: unknown, req: Request, res: Response, _next: NextFunction) => {
      console.error("[GLOBAL ERROR INTERCEPTOR] Express unhandled exception caught:", err);
      applyCorsHeaders(req, res);
      const { status, message } = formatDbError(err);
      
      const isPageRequest = !req.path.startsWith("/api") && !req.path.startsWith("/admin") && !req.path.match(/\.[a-zA-Z0-9]+$/);
      if (isPageRequest) {
        res.status(status).setHeader("Content-Type", "text/html");
        res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Internal Server Error | CalcZen</title>
  <meta name="description" content="An internal server error occurred. Please try again." />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { background: #0F172A; color: #F8FAFC; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .container { text-align: center; max-width: 500px; padding: 2rem; }
    h1 { color: #EF4444; font-size: 2.5rem; margin-bottom: 1rem; }
    p { color: #94A3B8; font-size: 1.1rem; line-height: 1.6; }
    a { color: #6366F1; text-decoration: none; font-weight: bold; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Internal Server Error</h1>
    <p>We encountered an error while processing your request. Please go back to the <a href="/">Homepage</a> or try again later.</p>
  </div>
</body>
</html>`);
        return;
      }

      res.status(status).json({ success: false, message });
    },
  );

  return app;
}
