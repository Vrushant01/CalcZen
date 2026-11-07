import { writeFileSync, existsSync, readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { calculators, categories, type CalculatorMeta } from "../src/data/calculators.ts";

const siteUrl = "https://www.calczen.in";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getCategoryName(categorySlug: string): string {
  const cat = categories.find((c) => c.slug === categorySlug);
  return cat ? cat.name : "Calculators";
}

function getRelatedCalculators(currentSlug: string, categorySlug: string, count = 4): CalculatorMeta[] {
  return calculators
    .filter((c) => c.slug !== currentSlug && c.category === categorySlug)
    .slice(0, count);
}

function injectMetadata(
  templateHtml: string,
  params: {
    title: string;
    description: string;
    canonical: string;
    keywords?: string[];
    jsonLd?: object[];
    bodyHtml: string;
  },
): string {
  let html = templateHtml;

  // Remove existing title, description, canonical, og, twitter
  html = html.replace(/<title[^>]*>.*?<\/title>/gis, "");
  html = html.replace(/<meta\s+[^>]*name=["']description["'][^>]*>/gi, "");
  html = html.replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>/gi, "");
  html = html.replace(/<meta\s+[^>]*property=["']og:[^"']+["'][^>]*>/gi, "");
  html = html.replace(/<meta\s+[^>]*name=["']twitter:[^"']+["'][^>]*>/gi, "");

  const safeTitle = escapeHtml(params.title);
  const safeDesc = escapeHtml(params.description);
  const safeCanonical = escapeHtml(params.canonical);
  const keywordsTag = params.keywords?.length
    ? `<meta name="keywords" content="${escapeHtml(params.keywords.join(", "))}" />`
    : "";

  const jsonLdScripts = (params.jsonLd || [])
    .map((ld) => `<script type="application/ld+json">${JSON.stringify(ld)}</script>`)
    .join("\n    ");

  const metaTags = `
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDesc}" />
    <link rel="canonical" href="${safeCanonical}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDesc}" />
    <meta property="og:url" content="${safeCanonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="CalcZen" />
    <meta property="og:image" content="${siteUrl}/icons/android-chrome-512x512.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDesc}" />
    <meta name="twitter:image" content="${siteUrl}/icons/android-chrome-512x512.png" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    ${keywordsTag}
    ${jsonLdScripts}
  `;

  html = html.replace("</head>", `${metaTags}\n</head>`);

  // Inject body HTML into <div id="root">
  const rootOpen = '<div id="root">';
  const rootIndex = html.indexOf(rootOpen);
  if (rootIndex !== -1) {
    const afterRoot = rootIndex + rootOpen.length;
    // Check if there is an existing closing tag or content
    const closeIndex = html.indexOf("</div>", afterRoot);
    if (closeIndex !== -1) {
      html = html.slice(0, afterRoot) + params.bodyHtml + html.slice(closeIndex);
    }
  }

  return html;
}

function renderHeaderHtml(): string {
  return `
    <header class="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="/" class="flex items-center gap-2.5 font-bold text-lg tracking-tight text-foreground" aria-label="CalcZen Home">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-black text-sm">C</span>
          <span>Calc<span class="text-primary font-black">Zen</span></span>
        </a>
        <nav class="flex items-center gap-4 sm:gap-6 text-sm font-medium text-muted-foreground">
          <a href="/calculators" class="hover:text-foreground transition-colors">All Calculators</a>
          <a href="/category/finance" class="hidden sm:inline hover:text-foreground transition-colors">Finance</a>
          <a href="/category/business" class="hidden sm:inline hover:text-foreground transition-colors">Business</a>
          <a href="/category/electricity" class="hidden sm:inline hover:text-foreground transition-colors">Electricity</a>
          <a href="/blog" class="hover:text-foreground transition-colors">Blog</a>
          <a href="/about" class="hidden md:inline hover:text-foreground transition-colors">About</a>
        </nav>
      </div>
    </header>
  `;
}

function renderFooterHtml(): string {
  return `
    <footer class="border-t border-border/40 bg-muted/20 mt-16 sm:mt-24 py-12 text-sm text-muted-foreground">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-2">
          <span class="font-bold text-foreground">CalcZen</span>
          <span>&copy; ${new Date().getFullYear()} CalcZen. Accurate calculations for smarter decisions.</span>
        </div>
        <div class="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm">
          <a href="/about" class="hover:text-foreground">About</a>
          <a href="/contact" class="hover:text-foreground">Contact</a>
          <a href="/privacy" class="hover:text-foreground">Privacy Policy</a>
          <a href="/terms" class="hover:text-foreground">Terms of Service</a>
          <a href="/disclaimer" class="hover:text-foreground">Disclaimer</a>
          <a href="/sitemap.xml" class="hover:text-foreground">Sitemap</a>
        </div>
      </div>
    </footer>
  `;
}

async function prerender() {
  const distDir = join(process.cwd(), "dist");
  const templatePath = join(distDir, "index.html");

  if (!existsSync(templatePath)) {
    console.error("[PRERENDER] dist/index.html not found! Run vite build first.");
    process.exit(1);
  }

  const templateHtml = readFileSync(templatePath, "utf8");
  console.log(`[PRERENDER] Loaded dist/index.html (${templateHtml.length} bytes).`);

  let count = 0;

  // 1. Prerender all Calculators
  for (const calc of calculators) {
    const canonical = `${siteUrl}/calculator/${calc.slug}`;
    const categoryName = getCategoryName(calc.category);
    const title = calc.metaTitle || `${calc.name} - Free Online Calculator | CalcZen`;
    const description = calc.metaDescription || calc.description;
    const related = getRelatedCalculators(calc.slug, calc.category);

    const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: calc.name,
        url: canonical,
        description: calc.description,
        applicationCategory: "UtilityApplication",
        operatingSystem: "All",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Calculators",
            item: `${siteUrl}/calculators`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: categoryName,
            item: `${siteUrl}/category/${calc.category}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: calc.name,
            item: canonical,
          },
        ],
      },
    ];

    const bodyHtml = `
      ${renderHeaderHtml()}
      <main class="min-h-screen bg-background text-foreground">
        <!-- Breadcrumbs -->
        <div class="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-2">
          <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground flex-wrap">
            <a href="/" class="hover:text-foreground">Home</a>
            <span>/</span>
            <a href="/calculators" class="hover:text-foreground">Calculators</a>
            <span>/</span>
            <a href="/category/${calc.category}" class="hover:text-foreground">${escapeHtml(categoryName)}</a>
            <span>/</span>
            <span class="text-foreground font-medium" aria-current="page">${escapeHtml(calc.name)}</span>
          </nav>
        </div>

        <!-- Calculator Hero / Content Header -->
        <article class="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <header class="mb-8">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
              <span>${escapeHtml(categoryName)}</span>
              <span>&bull;</span>
              <span>Free Tool</span>
            </div>
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
              ${escapeHtml(calc.h1 || calc.name)}
            </h1>
            <p class="mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
              ${escapeHtml(calc.description)}
            </p>
          </header>

          <!-- Interactive Calculator App Mount Point -->
          <section id="calculator-app" aria-label="Interactive ${escapeHtml(calc.name)} Tool" class="mb-12">
            <div class="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm">
              <div class="animate-pulse space-y-4">
                <div class="h-8 bg-muted/40 rounded w-1/3"></div>
                <div class="h-12 bg-muted/30 rounded"></div>
                <div class="h-12 bg-muted/30 rounded"></div>
                <div class="h-11 bg-primary/20 rounded w-1/4"></div>
              </div>
            </div>
          </section>

          <!-- Key Features & Instructions -->
          <section class="prose dark:prose-invert max-w-none mb-12">
            <h2 class="text-2xl font-bold tracking-tight mb-4">How to Use the ${escapeHtml(calc.name)}</h2>
            <p class="text-muted-foreground leading-relaxed">
              Use our verified online ${escapeHtml(calc.name)} for instant results, clear formulas, and actionable step-by-step breakdowns. Enter your numbers into the calculator fields above to receive immediate, transparent calculations without any technical complexity.
            </p>
            ${
              calc.useCases?.length
                ? `<div class="mt-6 not-prose">
                    <h3 class="text-lg font-semibold mb-3">Common Use Cases:</h3>
                    <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      ${calc.useCases.map((u) => `<li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span><span>${escapeHtml(u)}</span></li>`).join("")}
                    </ul>
                  </div>`
                : ""
            }
          </section>

          <!-- Related Calculators -->
          ${
            related.length
              ? `
          <aside class="border-t border-border/40 pt-10 mt-12">
            <h3 class="text-xl font-bold mb-4">Related ${escapeHtml(categoryName)} Calculators</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              ${related
                .map(
                  (r) => `
                <a href="/calculator/${r.slug}" class="block p-4 rounded-xl border border-border/60 bg-card hover:border-primary/50 hover:shadow-sm transition-all">
                  <h4 class="font-semibold text-sm text-foreground mb-1">${escapeHtml(r.name)}</h4>
                  <p class="text-xs text-muted-foreground line-clamp-2">${escapeHtml(r.description)}</p>
                </a>
              `,
                )
                .join("")}
            </div>
          </aside>
          `
              : ""
          }
        </article>
      </main>
      ${renderFooterHtml()}
    `;

    const finalHtml = injectMetadata(templateHtml, {
      title,
      description,
      canonical,
      keywords: calc.keywords,
      jsonLd,
      bodyHtml,
    });

    const targetDir = join(distDir, "calculator", calc.slug);
    if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });
    writeFileSync(join(targetDir, "index.html"), finalHtml, "utf8");
    count++;
  }

  // 2. Prerender all Category Pages
  for (const cat of categories) {
    const canonical = `${siteUrl}/category/${cat.slug}`;
    const title = `${cat.name} Calculators - Free Online Tools | CalcZen`;
    const description = `Explore free online ${cat.name.toLowerCase()} calculators on CalcZen. Fast, accurate, and easy-to-use tools for ${cat.description.toLowerCase()}.`;
    const catCalcs = calculators.filter(
      (c) =>
        c.category === cat.slug ||
        (cat.slug === "science" &&
          (c.slug === "scientific-calculator" || c.slug === "standard-calculator")),
    );

    const bodyHtml = `
      ${renderHeaderHtml()}
      <main class="min-h-screen bg-background text-foreground max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mb-6">
          <a href="/" class="hover:text-foreground">Home</a>
          <span>/</span>
          <a href="/calculators" class="hover:text-foreground">Calculators</a>
          <span>/</span>
          <span class="text-foreground font-medium" aria-current="page">${escapeHtml(cat.name)}</span>
        </nav>
        <header class="mb-10">
          <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-foreground">${escapeHtml(cat.name)} Calculators</h1>
          <p class="mt-3 text-base sm:text-lg text-muted-foreground max-w-2xl">${escapeHtml(cat.description)}</p>
        </header>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${catCalcs
            .map(
              (c) => `
            <a href="/calculator/${c.slug}" class="block p-6 rounded-2xl border border-border/80 bg-card hover:border-primary/50 hover:shadow-md transition-all group">
              <h2 class="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">${escapeHtml(c.name)}</h2>
              <p class="text-sm text-muted-foreground line-clamp-3 leading-relaxed">${escapeHtml(c.description)}</p>
            </a>
          `,
            )
            .join("")}
        </div>
      </main>
      ${renderFooterHtml()}
    `;

    const finalHtml = injectMetadata(templateHtml, {
      title,
      description,
      canonical,
      bodyHtml,
    });

    const targetDir = join(distDir, "category", cat.slug);
    if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });
    writeFileSync(join(targetDir, "index.html"), finalHtml, "utf8");
    count++;
  }

  // 3. Prerender /calculators (All Calculators page)
  {
    const canonical = `${siteUrl}/calculators`;
    const title = "All Calculators - Browse Free Online Tools | CalcZen";
    const description = "Browse our comprehensive directory of 40+ free online calculators covering finance, health, math, construction, electricity, and everyday life.";

    const bodyHtml = `
      ${renderHeaderHtml()}
      <main class="min-h-screen bg-background text-foreground max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header class="mb-10 text-center max-w-3xl mx-auto">
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">All Free Online Calculators</h1>
          <p class="mt-4 text-base sm:text-lg text-muted-foreground">Browse all 40+ free calculators. Simple, fast, and mathematically verified.</p>
        </header>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${calculators
            .map(
              (c) => `
            <a href="/calculator/${c.slug}" class="block p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/50 hover:shadow-md transition-all group">
              <span class="inline-block text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground mb-2">${escapeHtml(getCategoryName(c.category))}</span>
              <h2 class="text-base font-bold text-foreground group-hover:text-primary transition-colors mb-1">${escapeHtml(c.name)}</h2>
              <p class="text-xs text-muted-foreground line-clamp-2 leading-relaxed">${escapeHtml(c.description)}</p>
            </a>
          `,
            )
            .join("")}
        </div>
      </main>
      ${renderFooterHtml()}
    `;

    const finalHtml = injectMetadata(templateHtml, {
      title,
      description,
      canonical,
      bodyHtml,
    });

    const targetDir = join(distDir, "calculators");
    if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });
    writeFileSync(join(targetDir, "index.html"), finalHtml, "utf8");
    count++;
  }

  console.log(`[PRERENDER] Successfully pre-rendered ${count} pages into dist/ as static HTML!`);
}

prerender().catch((err) => {
  console.error("[PRERENDER] Fatal Error:", err);
  process.exit(1);
});

