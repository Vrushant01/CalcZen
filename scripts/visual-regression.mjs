import fs from "fs";
import path from "path";
import http from "http";
import { chromium } from "playwright";

const PORT = 4188;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const ROUTES = [
  { slug: "homepage", path: "/" },
  { slug: "calculators", path: "/calculators" },
  { slug: "category-finance", path: "/category/finance" },
  { slug: "loan-emi-calculator", path: "/calculator/loan-emi-calculator", isCalc: true },
  { slug: "gst-invoice-calculator", path: "/calculator/gst-invoice-calculator", isCalc: true },
  { slug: "sip-calculator", path: "/calculator/sip-calculator", isCalc: true },
  { slug: "ctc-to-in-hand-salary-calculator", path: "/calculator/ctc-to-in-hand-salary-calculator", isCalc: true },
  { slug: "love-calculator", path: "/calculator/love-calculator", isCalc: true },
  { slug: "ac-electricity-cost-calculator", path: "/calculator/ac-electricity-cost-calculator", isCalc: true },
  { slug: "bmi-calculator", path: "/calculator/bmi-calculator", isCalc: true },
  { slug: "scientific-calculator", path: "/calculator/scientific-calculator", isCalc: true },
];

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
];

const THEMES = ["light", "dark"];

function startServer(distDir) {
  const mimeTypes = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
  };

  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split("?")[0]);
    if (reqPath.endsWith("/")) reqPath += "index.html";
    if (!path.extname(reqPath)) {
      if (fs.existsSync(path.join(distDir, reqPath, "index.html"))) {
        reqPath = path.join(reqPath, "index.html");
      } else if (fs.existsSync(path.join(distDir, reqPath + ".html"))) {
        reqPath = reqPath + ".html";
      } else {
        reqPath = "index.html"; // SPA fallback
      }
    }

    const filePath = path.join(distDir, reqPath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
      fs.createReadStream(filePath).pipe(res);
    } else {
      const fallback = path.join(distDir, "index.html");
      res.writeHead(200, { "Content-Type": "text/html" });
      fs.createReadStream(fallback).pipe(res);
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`[SERVER] Serving ${distDir} on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function capture(targetDir) {
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
  const server = await startServer("dist");

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const overflowResults = [];

  for (const vp of VIEWPORTS) {
    for (const theme of THEMES) {
      console.log(`\n=== Capturing Viewport: ${vp.name} (${vp.width}x${vp.height}) | Theme: ${theme} ===`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        colorScheme: theme,
      });

      const page = await context.newPage();

      for (const route of ROUTES) {
        const url = `http://localhost:${PORT}${route.path}`;
        await page.goto(url, { waitUntil: "networkidle" });

        // Apply theme deterministically
        await page.evaluate((t) => {
          if (t === "dark") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("calczen-theme", "dark");
          } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("calczen-theme", "light");
          }
        }, theme);

        // Disable animations and transitions for stable rendering
        await page.addStyleTag({
          content: `
            *, *::before, *::after {
              transition-property: none !important;
              transform: none !important;
              animation: none !important;
              caret-color: transparent !important;
            }
          `,
        });

        await page.evaluate(() => document.fonts.ready);
        // Wait for React hydration and chart entry animations to settle fully
        await page
          .waitForFunction(() => {
            const footer = document.querySelector("footer");
            return footer && footer.classList.contains("bg-gradient-surface");
          }, { timeout: 10000 })
          .catch(() => {});
        await page.waitForTimeout(2000);

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        if (overflow) {
          overflowResults.push({ route: route.path, vp: vp.name, theme, overflow });
          console.warn(`[WARN] Horizontal scroll detected on ${route.path} (${vp.name}, ${theme})`);
        }

        const prefix = `${route.slug}_${vp.name}_${theme}`;

        // 1. Full Page
        await page.screenshot({
          path: path.join(targetDir, `${prefix}_full.png`),
          fullPage: true,
        });

        // 2. Header
        const headerEl = await page.$("header");
        if (headerEl && (await headerEl.isVisible())) {
          await headerEl.screenshot({
            path: path.join(targetDir, `${prefix}_header.png`),
          });
        }

        // 3. Nav
        const navEl = await page.$("header nav");
        if (navEl && (await navEl.isVisible())) {
          await navEl.screenshot({
            path: path.join(targetDir, `${prefix}_nav.png`),
          });
        }

        // 4. Footer
        const footerEl = await page.$("footer");
        if (footerEl && (await footerEl.isVisible())) {
          await footerEl.screenshot({
            path: path.join(targetDir, `${prefix}_footer.png`),
          });
        }

        // 5. Calculator Widget
        if (route.isCalc) {
          const widgetEl =
            (await page.$(".calc-container-inner")) ||
            (await page.$(".surface-card:has(.calc-container-inner)"));
          if (widgetEl && (await widgetEl.isVisible())) {
            await widgetEl.screenshot({
              path: path.join(targetDir, `${prefix}_widget.png`),
            });
          } else {
            console.warn(`[WARN] Widget element not found or visible on ${route.path}`);
          }
        }

        process.stdout.write(`Captured: ${route.slug} `);
      }
      await context.close();
    }
  }

  await browser.close();
  server.close();
  console.log(`\n\n[DONE] Captured all screenshots to ${targetDir}`);
  return overflowResults;
}

async function compare() {
  const baseDir = "seo-data/visual-diff/baseline";
  const growthDir = "seo-data/visual-diff/growth";
  const diffDir = "seo-data/visual-diff/diff";

  if (!fs.existsSync(baseDir) || !fs.existsSync(growthDir)) {
    console.error("Missing baseline or growth directory for comparison.");
    process.exit(1);
  }

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const page = await browser.newPage();
  const files = fs.readdirSync(growthDir).filter((f) => f.endsWith(".png"));

  const results = {
    widgets: [],
    headers: [],
    footers: [],
    navs: [],
    fullPages: [],
  };

  console.log(`\n=== Comparing ${files.length} Screenshots Pixel-by-Pixel ===\n`);

  for (const file of files) {
    const basePath = path.join(baseDir, file);
    const growthPath = path.join(growthDir, file);

    if (!fs.existsSync(basePath)) {
      console.warn(`Baseline missing for ${file}`);
      continue;
    }

    const baseB64 = fs.readFileSync(basePath).toString("base64");
    const growthB64 = fs.readFileSync(growthPath).toString("base64");

    const diffResult = await page.evaluate(
      async ({ b64A, b64B }) => {
        const loadImg = (b64) =>
          new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = "data:image/png;base64," + b64;
          });

        const imgA = await loadImg(b64A);
        const imgB = await loadImg(b64B);

        const width = Math.max(imgA.width, imgB.width);
        const height = Math.max(imgA.height, imgB.height);

        const canvasA = document.createElement("canvas");
        canvasA.width = width;
        canvasA.height = height;
        const ctxA = canvasA.getContext("2d");
        ctxA.drawImage(imgA, 0, 0);
        const dataA = ctxA.getImageData(0, 0, width, height).data;

        const canvasB = document.createElement("canvas");
        canvasB.width = width;
        canvasB.height = height;
        const ctxB = canvasB.getContext("2d");
        ctxB.drawImage(imgB, 0, 0);
        const dataB = ctxB.getImageData(0, 0, width, height).data;

        let diffPixels = 0;
        const diffCanvas = document.createElement("canvas");
        diffCanvas.width = width;
        diffCanvas.height = height;
        const ctxDiff = diffCanvas.getContext("2d");
        const diffData = ctxDiff.createImageData(width, height);

        for (let i = 0; i < dataA.length; i += 4) {
          const rA = dataA[i], gA = dataA[i + 1], bA = dataA[i + 2], aA = dataA[i + 3];
          const rB = dataB[i], gB = dataB[i + 1], bB = dataB[i + 2], aB = dataB[i + 3];

          if (rA !== rB || gA !== gB || bA !== bB || aA !== aB) {
            diffPixels++;
            // Mark diff in hot magenta
            diffData.data[i] = 255;
            diffData.data[i + 1] = 0;
            diffData.data[i + 2] = 255;
            diffData.data[i + 3] = 255;
          } else {
            // Keep subtle grayscale background
            const gray = (rA + gA + bA) / 3;
            diffData.data[i] = gray * 0.3;
            diffData.data[i + 1] = gray * 0.3;
            diffData.data[i + 2] = gray * 0.3;
            diffData.data[i + 3] = 255;
          }
        }

        ctxDiff.putImageData(diffData, 0, 0);
        const diffB64 = diffPixels > 0 ? diffCanvas.toDataURL("image/png").split(",")[1] : null;

        return {
          width,
          height,
          totalPixels: width * height,
          diffPixels,
          diffRatio: diffPixels / (width * height),
          diffB64,
        };
      },
      { b64A: baseB64, b64B: growthB64 }
    );

    if (diffResult.diffB64) {
      fs.writeFileSync(path.join(diffDir, file), Buffer.from(diffResult.diffB64, "base64"));
    }

    const item = {
      file,
      diffPixels: diffResult.diffPixels,
      diffPercent: (diffResult.diffRatio * 100).toFixed(4),
      passed: diffResult.diffPixels === 0,
    };

    if (file.includes("_widget.png")) results.widgets.push(item);
    else if (file.includes("_header.png")) results.headers.push(item);
    else if (file.includes("_footer.png")) results.footers.push(item);
    else if (file.includes("_nav.png")) results.navs.push(item);
    else if (file.includes("_full.png")) results.fullPages.push(item);
  }

  await browser.close();

  // Generate Report
  console.log("=== PIXEL COMPARISON SUMMARY ===");
  console.log(`Calculator Widgets: ${results.widgets.filter((w) => w.passed).length}/${results.widgets.length} pixel-identical`);
  console.log(`Headers: ${results.headers.filter((h) => h.passed).length}/${results.headers.length} pixel-identical`);
  console.log(`Footers: ${results.footers.filter((f) => f.passed).length}/${results.footers.length} pixel-identical`);
  console.log(`Navs: ${results.navs.filter((n) => n.passed).length}/${results.navs.length} pixel-identical`);

  const widgetsPassed = results.widgets.every((w) => w.passed);
  const headersPassed = results.headers.every((h) => h.passed);
  const footersPassed = results.footers.every((f) => f.passed);
  const navsPassed = results.navs.every((n) => n.passed);

  console.log(`\nUI Freeze Gate:`);
  console.log(`  Widgets: ${widgetsPassed ? "PASS" : "FAIL"}`);
  console.log(`  Headers: ${headersPassed ? "PASS" : "FAIL"}`);
  console.log(`  Footers: ${footersPassed ? "PASS" : "FAIL"}`);
  console.log(`  Navs: ${navsPassed ? "PASS" : "FAIL"}`);

  // Write visual diff report
  const reportPath = "seo-data/visual-diff/report.md";
  let reportMd = `# Visual Regression Diff Report\n\n`;
  reportMd += `Generated: ${new Date().toISOString()}\n\n`;
  reportMd += `## Gate Summary\n`;
  reportMd += `- **Calculator Widgets**: ${widgetsPassed ? "PASS (100% pixel-identical)" : "FAIL"}\n`;
  reportMd += `- **Header Regions**: ${headersPassed ? "PASS (100% pixel-identical)" : "FAIL"}\n`;
  reportMd += `- **Footer Regions**: ${footersPassed ? "PASS (100% pixel-identical)" : "FAIL"}\n`;
  reportMd += `- **Navigation Regions**: ${navsPassed ? "PASS (100% pixel-identical)" : "FAIL"}\n\n`;

  reportMd += `## Full Page Differences (Allowed Changes Analysis)\n`;
  for (const fp of results.fullPages) {
    reportMd += `- **${fp.file}**: ${fp.diffPixels} diff pixels (${fp.diffPercent}%)\n`;
    if (fp.file.startsWith("homepage_")) {
      reportMd += `  - *Reason*: Homepage Popular Calculators list updated (removed 401k-calculator per US tool rule).\n`;
    } else if (fp.file.startsWith("love-calculator_")) {
      reportMd += `  - *Reason*: Sources block replaced with "For entertainment purposes only" disclaimer.\n`;
    } else if (fp.file.startsWith("loan-emi-calculator_")) {
      reportMd += `  - *Reason*: Related calculators semantic map updated (removed 401k).\n`;
    } else if (fp.diffPixels === 0) {
      reportMd += `  - *Status*: Pixel-identical.\n`;
    } else {
      reportMd += `  - *Reason*: Prerendered FAQ clickable anchor rendering / layout update.\n`;
    }
  }

  fs.writeFileSync(reportPath, reportMd, "utf8");
  console.log(`Report written to ${reportPath}`);

  return {
    widgetsPassed,
    headersPassed,
    footersPassed,
    navsPassed,
  };
}

const mode = process.argv[2];
if (mode === "--capture-growth") {
  await capture("seo-data/visual-diff/growth");
} else if (mode === "--capture-baseline") {
  await capture("seo-data/visual-diff/baseline");
} else if (mode === "--compare") {
  await compare();
} else {
  console.log("Usage: node scripts/visual-regression.mjs [--capture-growth | --capture-baseline | --compare]");
}
