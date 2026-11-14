import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const siteUrl = (process.env.SITE_URL || "https://www.calczen.in").replace(/\/$/, "");

const STATIC_PATHS = [
  "/",
  "/calculators",
  "/tools",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/disclaimer",
];
const CATEGORY_SLUGS = [
  "finance",
  "health",
  "math",
  "everyday",
  "salary-and-employment",
  "jewellery",
  "home-construction",
  "electricity",
  "business",
];
const CALCULATOR_SLUGS = [
  "gst-invoice-calculator",
  "product-profit-calculator",
  "home-electricity-bill-calculator",
  "appliance-electricity-cost-calculator",
  "ac-electricity-cost-calculator",
  "rcc-price-calculator",
  "cement-bag-calculator",
  "gold-making-charges-calculator",
  "gold-jewellery-bill-calculator",
  "job-offer-comparison-calculator",
  "ctc-to-in-hand-salary-calculator",
  "mortgage-calculator",
  "compound-interest-calculator",
  "loan-emi-calculator",
  "bmi-calculator",
  "calorie-calculator",
  "water-intake-calculator",
  "sleep-calculator",
  "pregnancy-due-date-calculator",
  "percentage-calculator",
  "age-calculator",
  "tip-calculator",
  "bmr-calculator",
  "standard-calculator",
  "scientific-calculator",
  "retirement-calculator",
  "401k-calculator",
  "sip-calculator",
  "fd-calculator",
  "gst-calculator",
  "attendance-calculator",
  "cgpa-calculator",
  "body-fat-calculator",
  "protein-calculator",
  "inflation-calculator",
  "loan-eligibility-calculator",
  "credit-card-emi-calculator",
];

async function generateSitemap() {
  const paths = [
    ...STATIC_PATHS,
    ...CATEGORY_SLUGS.map((s) => `/category/${s}`),
    ...CALCULATOR_SLUGS.map((s) => `/calculator/${s}`),
  ];

  // 1. Generate main sitemap.xml
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${siteUrl}${p}</loc></url>`).join("\n")}
</urlset>
`;

  writeFileSync(join(process.cwd(), "public", "sitemap.xml"), xml, "utf8");
  console.log("Generated public/sitemap.xml");
}

generateSitemap();
