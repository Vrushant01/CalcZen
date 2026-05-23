import { writeFileSync } from "node:fs";
import { join } from "node:path";

const siteUrl = (process.env.SITE_URL || "https://www.calczen.in").replace(/\/$/, "");

const STATIC_PATHS = ["/", "/calculators", "/about", "/contact", "/terms", "/privacy", "/disclaimer"];
const CATEGORY_SLUGS = ["finance", "health", "math", "everyday"];
const CALCULATOR_SLUGS = [
  "mortgage-calculator",
  "compound-interest-calculator",
  "loan-emi-calculator",
  "bmi-calculator",
  "calorie-calculator",
  "water-intake-calculator",
  "pregnancy-due-date-calculator",
  "percentage-calculator",
  "age-calculator",
  "tip-calculator",
  "bmr-calculator",
];

const paths = [
  ...STATIC_PATHS,
  ...CATEGORY_SLUGS.map((s) => `/category/${s}`),
  ...CALCULATOR_SLUGS.map((s) => `/calculator/${s}`),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${siteUrl}${p}</loc></url>`).join("\n")}
</urlset>
`;

writeFileSync(join(process.cwd(), "public", "sitemap.xml"), xml, "utf8");
console.log("Generated public/sitemap.xml");
