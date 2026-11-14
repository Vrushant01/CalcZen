import { chromium } from "playwright";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { calculators, getCategory } from "../src/data/calculators.ts";

const KEEP_SLUGS = new Set([
  "bmi-calculator",
  "scientific-calculator",
  "homepage-og",
]);

const CATEGORY_STYLES = {
  jewellery: {
    name: "Jewellery",
    color: "#fbbf24",
    bg: "rgba(245, 158, 11, 0.12)",
    border: "rgba(245, 158, 11, 0.35)",
    glow: "rgba(245, 158, 11, 0.20)",
  },
  finance: {
    name: "Finance",
    color: "#38bdf8",
    bg: "rgba(14, 165, 233, 0.12)",
    border: "rgba(14, 165, 233, 0.35)",
    glow: "rgba(14, 165, 233, 0.22)",
  },
  health: {
    name: "Health",
    color: "#34d399",
    bg: "rgba(16, 185, 129, 0.12)",
    border: "rgba(16, 185, 129, 0.35)",
    glow: "rgba(16, 185, 129, 0.20)",
  },
  math: {
    name: "Math",
    color: "#a78bfa",
    bg: "rgba(139, 92, 246, 0.12)",
    border: "rgba(139, 92, 246, 0.35)",
    glow: "rgba(139, 92, 246, 0.20)",
  },
  "salary-and-employment": {
    name: "Salary & Career",
    color: "#34d399",
    bg: "rgba(16, 185, 129, 0.12)",
    border: "rgba(16, 185, 129, 0.35)",
    glow: "rgba(16, 185, 129, 0.20)",
  },
  "home-construction": {
    name: "Construction",
    color: "#fb923c",
    bg: "rgba(249, 115, 22, 0.12)",
    border: "rgba(249, 115, 22, 0.35)",
    glow: "rgba(249, 115, 22, 0.20)",
  },
  electricity: {
    name: "Electricity",
    color: "#facc15",
    bg: "rgba(234, 179, 8, 0.12)",
    border: "rgba(234, 179, 8, 0.35)",
    glow: "rgba(234, 179, 8, 0.20)",
  },
  business: {
    name: "Business",
    color: "#60a5fa",
    bg: "rgba(59, 130, 246, 0.12)",
    border: "rgba(59, 130, 246, 0.35)",
    glow: "rgba(59, 130, 246, 0.22)",
  },
  "love-and-relationships": {
    name: "Relationships",
    color: "#f472b6",
    bg: "rgba(244, 63, 94, 0.12)",
    border: "rgba(244, 63, 94, 0.35)",
    glow: "rgba(244, 63, 94, 0.20)",
  },
  everyday: {
    name: "Everyday Tools",
    color: "#fbbf24",
    bg: "rgba(245, 158, 11, 0.12)",
    border: "rgba(245, 158, 11, 0.35)",
    glow: "rgba(245, 158, 11, 0.20)",
  },
  science: {
    name: "Science",
    color: "#818cf8",
    bg: "rgba(99, 102, 241, 0.12)",
    border: "rgba(99, 102, 241, 0.35)",
    glow: "rgba(99, 102, 241, 0.20)",
  },
};

function getCategoryTheme(catSlug) {
  return (
    CATEGORY_STYLES[catSlug] || {
      name: "Calculator",
      color: "#38bdf8",
      bg: "rgba(56, 189, 248, 0.12)",
      border: "rgba(56, 189, 248, 0.35)",
      glow: "rgba(56, 189, 248, 0.20)",
    }
  );
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderHtml({ title, categoryName, categoryTheme, tagline, logoDataUri }) {
  const titleLength = title.length;
  let titleFontSize = "56px";
  if (titleLength > 38) {
    titleFontSize = "44px";
  } else if (titleLength > 28) {
    titleFontSize = "50px";
  }

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    width: 1200px;
    height: 630px;
    background: #070a12;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    color: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px;
    overflow: hidden;
  }

  .canvas {
    width: 1140px;
    height: 570px;
    border-radius: 28px;
    background: radial-gradient(circle at 85% 15%, ${categoryTheme.glow} 0%, transparent 55%),
                linear-gradient(145deg, rgba(15, 23, 42, 0.98) 0%, rgba(9, 13, 22, 0.99) 100%);
    border: 1.5px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.12);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 50px 60px;
    position: relative;
    overflow: hidden;
  }

  /* Decorative subtle bottom glow */
  .canvas::after {
    content: '';
    position: absolute;
    bottom: -100px;
    left: -80px;
    width: 360px;
    height: 360px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 65%);
    pointer-events: none;
  }

  /* Header */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 10;
  }

  .brand-group {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .brand-logo {
    width: 48px;
    height: 48px;
    object-fit: contain;
    filter: drop-shadow(0 4px 10px rgba(56, 189, 248, 0.35));
  }

  .brand-name {
    font-family: 'Outfit', sans-serif;
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #ffffff;
    display: flex;
    align-items: baseline;
  }

  .brand-dot {
    color: #38bdf8;
    font-size: 26px;
    margin-left: 2px;
  }

  .category-pill {
    padding: 8px 18px;
    border-radius: 9999px;
    background: ${categoryTheme.bg};
    border: 1px solid ${categoryTheme.border};
    color: ${categoryTheme.color};
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .category-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${categoryTheme.color};
    box-shadow: 0 0 8px ${categoryTheme.color};
  }

  /* Content */
  .content {
    display: flex;
    flex-direction: column;
    gap: 14px;
    position: relative;
    z-index: 10;
    max-width: 980px;
  }

  .title {
    font-family: 'Outfit', sans-serif;
    font-size: ${titleFontSize};
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.025em;
    color: #ffffff;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .tagline {
    font-size: 21px;
    font-weight: 500;
    color: #94a3b8;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Footer */
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 10;
    padding-top: 22px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .features {
    display: flex;
    gap: 12px;
  }

  .feature-pill {
    padding: 6px 14px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    font-size: 13px;
    font-weight: 600;
    color: #cbd5e1;
  }

  .domain {
    font-family: 'Outfit', sans-serif;
    font-size: 19px;
    font-weight: 700;
    color: #38bdf8;
    letter-spacing: -0.01em;
    display: flex;
    align-items: center;
    gap: 6px;
  }
</style>
</head>
<body>
  <div class="canvas">
    <div class="header">
      <div class="brand-group">
        <img src="${logoDataUri}" class="brand-logo" alt="CalcZen" />
        <span class="brand-name">CalcZen<span class="brand-dot">.in</span></span>
      </div>
      <div class="category-pill">
        <span class="category-dot"></span>
        ${escapeHtml(categoryName)}
      </div>
    </div>

    <div class="content">
      <h1 class="title">${escapeHtml(title)}</h1>
      <p class="tagline">${escapeHtml(tagline)}</p>
    </div>

    <div class="footer">
      <div class="features">
        <div class="feature-pill">⚡ Fast &amp; Accurate</div>
        <div class="feature-pill">🔒 Free &amp; Private</div>
        <div class="feature-pill">✓ Instant Results</div>
      </div>
      <div class="domain">
        <span>www.calczen.in</span>
        <span>→</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function main() {
  console.log("Starting OpenGraph image generation...\n");

  const logoBase64 = fs.readFileSync("public/brand/calczen-logo.png").toString("base64");
  const logoDataUri = `data:image/png;base64,${logoBase64}`;

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

  const tasks = [];

  // 1. Add all calculators from calculators.ts (skipping KEEP_SLUGS)
  for (const calc of calculators) {
    if (KEEP_SLUGS.has(calc.slug)) {
      console.log(`[KEEP] Preserving unique artwork for ${calc.slug}.png`);
      continue;
    }
    const cat = getCategory(calc.category);
    const catTheme = getCategoryTheme(calc.category);
    tasks.push({
      slug: calc.slug,
      title: calc.name,
      categoryName: cat ? cat.name : catTheme.name,
      categoryTheme: catTheme,
      tagline: calc.description || "Free, accurate and easy-to-use online calculator.",
    });
  }

  // 2. Add default-og.png
  tasks.push({
    slug: "default-og",
    title: "Free, Fast & Accurate Online Calculators",
    categoryName: "Utility Platform",
    categoryTheme: getCategoryTheme("finance"),
    tagline: "Free online calculators for finance, health, jewellery, construction, salary, math and everyday life.",
  });

  console.log(`Generating ${tasks.length} OG images at 1200x630...\n`);

  const results = [];

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const html = renderHtml({
      title: task.title,
      categoryName: task.categoryName,
      categoryTheme: task.categoryTheme,
      tagline: task.tagline,
      logoDataUri,
    });

    await page.setContent(html, { waitUntil: "networkidle" });
    const rawBuffer = await page.screenshot({ type: "png" });

    // Optimize with Sharp: compression level 9, effort 7
    const optimizedBuffer = await sharp(rawBuffer)
      .png({ compressionLevel: 9, effort: 7 })
      .toBuffer();

    const outputPath = path.join("public", "og", `${task.slug}.png`);
    fs.writeFileSync(outputPath, optimizedBuffer);

    const sizeKb = Math.round(optimizedBuffer.length / 1024);
    results.push({
      slug: task.slug,
      width: 1200,
      height: 630,
      format: "PNG",
      sizeKb,
    });

    console.log(`[${i + 1}/${tasks.length}] Generated public/og/${task.slug}.png (${sizeKb} KB)`);
  }

  await browser.close();

  console.log("\nAll OpenGraph images generated successfully!\n");
}

main().catch((err) => {
  console.error("OG generation failed:", err);
  process.exit(1);
});
