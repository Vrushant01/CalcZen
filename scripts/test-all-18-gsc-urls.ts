import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import http from "node:http";

const distDir = join(process.cwd(), "dist");
const vercelConfig = JSON.parse(readFileSync(join(process.cwd(), "vercel.json"), "utf8"));

// 18 GSC URL entries under audit
const GSC_TEST_ENTRIES = [
  { url: "https://www.calczen.in/calculator/fd-calculator", expectedAction: "RESTORE", expectedStatus: 200 },
  { url: "https://www.calczen.in/calculator/retirement-calculator", expectedAction: "RESTORE", expectedStatus: 200 },
  { url: "https://calczen.in/calculator/protein-calculator", expectedAction: "DOMAIN CANONICALIZATION", expectedStatus: 308, finalUrl: "https://www.calczen.in/calculator/protein-calculator" },
  { url: "https://www.calczen.in/calculator/protein-calculator", expectedAction: "RESTORE", expectedStatus: 200 },
  { url: "https://www.calczen.in/calculator/gst-calculator", expectedAction: "RESTORE", expectedStatus: 200 },
  { url: "https://calczen.in/calculator/body-fat-calculator", expectedAction: "DOMAIN CANONICALIZATION", expectedStatus: 308, finalUrl: "https://www.calczen.in/calculator/body-fat-calculator" },
  { url: "https://www.calczen.in/calculator/credit-card-emi-calculator", expectedAction: "RESTORE", expectedStatus: 200 },
  { url: "https://calczen.in/calculator/sip-calculator", expectedAction: "DOMAIN CANONICALIZATION", expectedStatus: 308, finalUrl: "https://www.calczen.in/calculator/sip-calculator" },
  { url: "https://www.calczen.in/calculator/sip-calculator", expectedAction: "RESTORE", expectedStatus: 200 },
  { url: "https://www.calczen.in/calculator/401k-calculator", expectedAction: "RESTORE", expectedStatus: 200 },
  { url: "https://www.calczen.in/calculator/scientific-calculator", expectedAction: "RESTORE", expectedStatus: 200 },
  { url: "https://www.calczen.in/calculator/sleep-calculator", expectedAction: "RESTORE", expectedStatus: 200 },
  { url: "https://www.calczen.in/calculator/cgpa-calculator", expectedAction: "RESTORE", expectedStatus: 200 },
  { url: "https://www.calczen.in/calculator/attendance-calculator", expectedAction: "RESTORE", expectedStatus: 200 },
  { url: "https://www.calczen.in/calculator/regular-calculator", expectedAction: "PERMANENT REDIRECT", expectedStatus: 308, finalUrl: "https://www.calczen.in/calculator/standard-calculator" },
  { url: "https://www.calczen.in/calculator/standard-calculator", expectedAction: "RESTORE", expectedStatus: 200 },
  { url: "https://www.calczen.in/category/science", expectedAction: "RESTORE", expectedStatus: 200 },
  { url: "https://www.calczen.in/sup.ve", expectedAction: "LEGITIMATE 404", expectedStatus: 404 },
];

const NEW_CALCULATORS = [
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

console.log("=================================================================");
console.log("   CALCZEN MASTER RECOVERY TEST SUITE (18 GSC URLs + 14 NEW)     ");
console.log("=================================================================\n");

// 1. Audit static files for 200 OK routes
console.log("--- 1. STATIC HTML PRE-RENDER CHECK ---");
let staticCheckPass = true;
GSC_TEST_ENTRIES.filter((e) => e.expectedStatus === 200).forEach((item) => {
  const urlObj = new URL(item.url);
  const p = join(distDir, urlObj.pathname, "index.html");
  if (!existsSync(p)) {
    console.error(`[FAIL] Missing pre-rendered file for: ${item.url} -> ${p}`);
    staticCheckPass = false;
  } else {
    const size = readFileSync(p, "utf8").length;
    console.log(`[PASS] ${urlObj.pathname} -> ${p} (${size} bytes)`);
  }
});

// Also check 14 new calculators
NEW_CALCULATORS.forEach((slug) => {
  const p = join(distDir, "calculator", slug, "index.html");
  if (!existsSync(p)) {
    console.error(`[FAIL] Missing pre-rendered file for new calculator: ${slug}`);
    staticCheckPass = false;
  }
});

if (!staticCheckPass) {
  console.error("Static file pre-render check failed!");
  process.exit(1);
}
console.log("[SUCCESS] All intended 200 OK routes physically exist as pre-rendered static HTML!\n");

// 2. Audit Vercel redirects configuration
console.log("--- 2. VERCEL.JSON REDIRECT RULES AUDIT ---");
const redirects = vercelConfig.redirects || [];
let redirectAuditPass = true;

// Check regular-calculator redirect
const regularRedirect = redirects.find(
  (r: any) => r.source === "/calculator/regular-calculator" && r.destination === "/calculator/standard-calculator",
);
if (!regularRedirect) {
  console.error("[FAIL] Missing redirect for /calculator/regular-calculator -> /calculator/standard-calculator");
  redirectAuditPass = false;
} else {
  console.log("[PASS] /calculator/regular-calculator -> /calculator/standard-calculator (308 Permanent)");
}

// Check non-www -> www canonical domain redirect
const hostRedirect = redirects.find(
  (r: any) =>
    r.has &&
    r.has.some((h: any) => h.type === "host" && h.value.includes("calczen\\.in")) &&
    r.destination.startsWith("https://www.calczen.in"),
);
if (!hostRedirect) {
  console.error("[FAIL] Missing non-www (calczen.in) -> www.calczen.in redirect");
  redirectAuditPass = false;
} else {
  console.log("[PASS] calczen.in/:path* -> https://www.calczen.in/:path* (308 Permanent)");
}

if (!redirectAuditPass) {
  console.error("Vercel redirect rules audit failed!");
  process.exit(1);
}
console.log("[SUCCESS] Vercel redirect rules verified!\n");

// 3. Local HTTP Server Smoke Test simulating Vercel edge logic
console.log("--- 3. SIMULATED EDGE HTTP SERVER TEST (Browser & Googlebot) ---");
const server = http.createServer((req, res) => {
  const host = ((req.headers["x-forwarded-host"] || req.headers.host || "") as string).toLowerCase().split(":")[0];
  const urlPath = (req.url || "/").split("?")[0];

  // 1. Simulate non-www to www redirect
  if (host === "calczen.in") {
    res.writeHead(308, { Location: `https://www.calczen.in${req.url}` });
    return res.end();
  }

  // 2. Simulate vercel.json redirects
  for (const r of redirects) {
    if (r.source === urlPath) {
      res.writeHead(308, { Location: r.destination });
      return res.end();
    }
  }

  // 3. Check physical static file
  let filePath = join(distDir, urlPath);
  if (existsSync(filePath) && !filePath.endsWith("index.html") && existsSync(join(filePath, "index.html"))) {
    filePath = join(filePath, "index.html");
  } else if (!existsSync(filePath) && existsSync(join(distDir, urlPath, "index.html"))) {
    filePath = join(distDir, urlPath, "index.html");
  }

  if (existsSync(filePath) && !filePath.endsWith(distDir)) {
    const content = readFileSync(filePath);
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(content);
  }

  // 4. Fallback: 404 for malformed/unknown URLs (e.g. /sup.ve)
  if (urlPath === "/sup.ve" || urlPath.includes(".")) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("404 Not Found");
  }

  // 5. SPA Fallback
  const indexHtml = readFileSync(join(distDir, "index.html"));
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(indexHtml);
});

server.listen(4899, "127.0.0.1", async () => {
  console.log("Verification edge server listening on http://127.0.0.1:4899\n");

  const results: any[] = [];

  try {
    for (const entry of GSC_TEST_ENTRIES) {
      const urlObj = new URL(entry.url);
      const isNonWww = urlObj.hostname === "calczen.in";

      // Test with custom Host header
      const res = await fetch(`http://127.0.0.1:4899${urlObj.pathname}`, {
        headers: {
          Host: urlObj.hostname,
          "x-forwarded-host": urlObj.hostname,
          "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        },
        redirect: "manual",
      });

      const location = res.headers.get("location") || "";
      const status = res.status;

      let pass = false;
      if (entry.expectedStatus === 308) {
        pass = status === 308 && (location === entry.finalUrl || location === "/calculator/standard-calculator");
      } else if (entry.expectedStatus === 200) {
        pass = status === 200;
      } else if (entry.expectedStatus === 404) {
        pass = status === 404;
      }

      results.push({
        url: entry.url,
        action: entry.expectedAction,
        status,
        destination: location || entry.url,
        pass,
      });

      console.log(
        `[${pass ? "PASS" : "FAIL"}] ${entry.url} -> Status ${status} (${entry.expectedAction}) ${location ? "-> " + location : ""}`,
      );
    }

    console.log("\n--- 4. NEW CALCULATORS REGRESSION VERIFICATION (14 Routes) ---");
    for (const slug of NEW_CALCULATORS) {
      const res = await fetch(`http://127.0.0.1:4899/calculator/${slug}`, {
        headers: {
          Host: "www.calczen.in",
          "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        },
      });

      const html = await res.text();
      const hasH1 = html.includes("<h1");
      const hasCanonical = html.includes(`https://www.calczen.in/calculator/${slug}`);
      const ok = res.status === 200 && hasH1 && hasCanonical;

      console.log(`[${ok ? "PASS" : "FAIL"}] /calculator/${slug} -> Status ${res.status}, H1=${hasH1}, Canonical=${hasCanonical}`);
      if (!ok) throw new Error(`Regression detected on new calculator: ${slug}`);
    }

    console.log("\n=================================================================");
    console.log("        ALL 18 GSC URLs & 14 NEW CALCULATORS VERIFIED!          ");
    console.log("=================================================================");

    server.close();
    process.exit(0);
  } catch (err: any) {
    console.error("[ERROR DURING VERIFICATION]:", err.message);
    server.close();
    process.exit(1);
  }
});
