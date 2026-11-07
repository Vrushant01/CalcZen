import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import http from "node:http";

const SLUGS = [
  "gst-invoice-calculator",
  "product-profit-calculator",
  "home-electricity-bill-calculator",
  "appliance-electricity-cost-calculator",
  "ac-electricity-cost-calculator",
  "rcc-price-calculator",
  "cement-bag-calculator",
  "gold-making-charges-calculator",
  "gold-jewellery-bill-calculator",
  "ctc-to-in-hand-salary-calculator",
  "job-offer-comparison-calculator",
  "love-calculator",
  "flames-calculator",
  "couple-age-difference-calculator",
];

const distDir = join(process.cwd(), "dist");

console.log("=== PHASE 1: STATIC FILE AUDIT ===");
let allFilesExist = true;
SLUGS.forEach((slug) => {
  const filePath = join(distDir, "calculator", slug, "index.html");
  const exists = existsSync(filePath);
  if (!exists) {
    console.error(`[FAIL] Missing file: ${filePath}`);
    allFilesExist = false;
  } else {
    const size = readFileSync(filePath, "utf8").length;
    console.log(`[PASS] dist/calculator/${slug}/index.html (${size} bytes)`);
  }
});

if (!allFilesExist) {
  console.error("Static file audit failed!");
  process.exit(1);
}

console.log("\n=== PHASE 2: SEO METADATA & CONTENT AUDIT ===");
let allMetaValid = true;
SLUGS.forEach((slug) => {
  const filePath = join(distDir, "calculator", slug, "index.html");
  const html = readFileSync(filePath, "utf8");

  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : "";

  const descMatch = html.match(/<meta name="description" content="(.*?)"/i);
  const desc = descMatch ? descMatch[1] : "";

  const canonicalMatch = html.match(/<link rel="canonical" href="(.*?)"/i);
  const canonical = canonicalMatch ? canonicalMatch[1] : "";

  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/is);
  const h1 = h1Match ? h1Match[1].replace(/<[^>]*>/g, "").trim() : "";

  const hasSchema = html.includes('"@type":"WebApplication"');
  const hasBreadcrumbs = html.includes('aria-label="Breadcrumb"');

  const expectedCanonical = `https://www.calczen.in/calculator/${slug}`;
  const canonicalOk = canonical === expectedCanonical;
  const hasGoodTitle = title.length > 10 && title.includes("CalcZen");
  const hasGoodDesc = desc.length > 20;
  const hasH1 = h1.length > 3;

  if (!canonicalOk || !hasGoodTitle || !hasGoodDesc || !hasH1 || !hasSchema || !hasBreadcrumbs) {
    console.error(`[FAIL] Audit failed for ${slug}:`, {
      canonicalOk,
      canonical,
      expectedCanonical,
      hasGoodTitle,
      title,
      hasGoodDesc,
      hasH1,
      h1,
      hasSchema,
      hasBreadcrumbs,
    });
    allMetaValid = false;
  } else {
    console.log(`[PASS] ${slug}: H1="${h1}", Canonical="${canonical}", Schema=OK`);
  }
});

if (!allMetaValid) {
  console.error("Metadata audit failed!");
  process.exit(1);
}

console.log("\n=== PHASE 3: LIVE HTTP SERVER SMOKE TEST (Browser & Googlebot) ===");

// Start a lightweight static server mimicking Vercel's edge behavior
const server = http.createServer((req, res) => {
  const urlPath = (req.url || "/").split("?")[0];
  let filePath = join(distDir, urlPath);

  if (existsSync(filePath) && !filePath.endsWith("index.html") && existsSync(join(filePath, "index.html"))) {
    filePath = join(filePath, "index.html");
  } else if (!existsSync(filePath) && existsSync(join(distDir, urlPath, "index.html"))) {
    filePath = join(distDir, urlPath, "index.html");
  } else if (!existsSync(filePath)) {
    // SPA fallback
    filePath = join(distDir, "index.html");
  }

  if (existsSync(filePath)) {
    const content = readFileSync(filePath);
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(content);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

server.listen(4567, "127.0.0.1", async () => {
  console.log("Local verification server running at http://127.0.0.1:4567");

  try {
    for (const slug of SLUGS) {
      const url = `http://127.0.0.1:4567/calculator/${slug}`;

      // 1. Regular Browser User-Agent
      const browserRes = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        },
      });

      // 2. Googlebot User-Agent
      const googlebotRes = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        },
      });

      const browserHtml = await browserRes.text();
      const googlebotHtml = await googlebotRes.text();

      if (browserRes.status !== 200 || googlebotRes.status !== 200) {
        throw new Error(
          `Status failure on ${slug}: browser=${browserRes.status}, googlebot=${googlebotRes.status}`,
        );
      }

      if (!googlebotHtml.includes("<h1") || !googlebotHtml.includes(`calculator/${slug}`)) {
        throw new Error(`Googlebot content missing for ${slug}`);
      }

      console.log(`[HTTP 200 OK] /calculator/${slug} -> Browser=200, Googlebot=200, Content verified!`);
    }

    // Test invalid slug returns fallback 200 SPA / handles properly
    const invalidRes = await fetch("http://127.0.0.1:4567/calculator/invalid-fake-slug-xyz");
    console.log(`[HTTP TEST] /calculator/invalid-fake-slug-xyz -> Status ${invalidRes.status} (SPA Fallback)`);

    console.log("\nALL 14 CALCULATOR ROUTES PASSED ALL AUTOMATED SMOKE TESTS!");
    server.close();
    process.exit(0);
  } catch (err: any) {
    console.error("[TEST FAILED]:", err.message);
    server.close();
    process.exit(1);
  }
});
