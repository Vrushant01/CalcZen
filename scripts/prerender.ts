import { writeFileSync, existsSync, readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { calculators, categories, type CalculatorMeta } from "../src/data/calculators.ts";
import { homeIntro } from "../src/data/homeContent.ts";
import { homeFaqs } from "../src/data/homeFaqs.ts";
import { getCategorySources } from "../src/data/categorySources.ts";
import { staticPagesContent } from "../src/data/staticPagesContent.ts";

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
    const bodyClose = html.indexOf("</body>");
    const closeIndex =
      bodyClose !== -1
        ? html.lastIndexOf("</div>", bodyClose)
        : html.indexOf("</div>", afterRoot);
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

  // 0. Prerender Homepage
  {
    const canonical = `${siteUrl}/`;
    const title = "Free Online Calculators for Finance, Health & Math | CalcZen";
    const description =
      "Discover free online calculators for personal finance, health tracking, mathematics, and daily helpers. Get fast, accurate results with transparent formulas.";

    const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "CalcZen",
        url: siteUrl,
        logo: `${siteUrl}/brand/calczen-logo.png`,
        sameAs: [],
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "CalcZen",
        url: siteUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/calculators?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: homeFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ];

    const popularCalcs = calculators.filter((c) => c.popular);

    const introHtml = homeIntro.paragraphs
      .map(
        (para) =>
          `<p class="leading-relaxed mb-4">${para
            .map((seg) =>
              seg.href
                ? `<a href="${seg.href}"${seg.external ? ' target="_blank" rel="noopener noreferrer"' : ''} class="text-primary hover:underline font-medium">${escapeHtml(seg.text)}</a>`
                : escapeHtml(seg.text)
            )
            .join("")}</p>`
      )
      .join("");

    const bodyHtml = `
      ${renderHeaderHtml()}
      <main class="min-h-screen bg-background text-foreground">
        <!-- Hero Section with original H1 text -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 sm:pt-16 sm:pb-12 text-center">
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
            Free Online Calculators for Finance, Health, and Math
          </h1>
          <p class="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Fast, accurate online calculators for finance, health, and daily math. Simple tools designed for speed and clarity.
          </p>
        </section>

        <!-- Popular Calculators Section -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Popular Calculators
            </h2>
            <a href="/calculators" class="text-sm font-medium text-primary hover:underline">
              View All Calculators &rarr;
            </a>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            ${popularCalcs
              .map(
                (c) => `
              <a href="/calculator/${c.slug}" class="block p-4 rounded-xl border border-border/80 bg-card hover:border-primary/50 hover:shadow-sm transition-all group">
                <span class="inline-block text-[11px] font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground mb-2">${escapeHtml(getCategoryName(c.category))}</span>
                <h3 class="font-bold text-sm text-foreground group-hover:text-primary transition-colors mb-1">${escapeHtml(c.name)}</h3>
                <p class="text-xs text-muted-foreground line-clamp-2 leading-relaxed">${escapeHtml(c.description)}</p>
              </a>
            `
              )
              .join("")}
          </div>
        </section>

        <!-- Categories Section -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-border/40">
          <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-6">
            Browse by Category
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            ${categories
              .map(
                (cat) => `
              <a href="/category/${cat.slug}" class="p-4 rounded-xl border border-border/70 bg-card hover:border-primary/50 hover:text-primary transition-all text-sm font-semibold text-foreground flex items-center justify-between">
                <span>${escapeHtml(cat.name)}</span>
                <span class="text-xs text-muted-foreground">&rarr;</span>
              </a>
            `
              )
              .join("")}
          </div>
        </section>

        <!-- Frequently Asked Questions Section -->
        <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border/40 text-left">
          <h2 class="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-6">Frequently asked questions</h2>
          <div class="space-y-6">
            ${homeFaqs
              .map(
                (faq) => `
              <div class="space-y-2">
                <h3 class="text-lg font-semibold text-foreground">${escapeHtml(faq.q)}</h3>
                <p class="text-sm sm:text-base text-muted-foreground leading-relaxed">${escapeHtml(faq.a)}</p>
              </div>
            `
              )
              .join("")}
          </div>
        </section>

        <!-- About CalcZen Calculators (from homeContent.ts) -->
        <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border/40 text-left">
          <h2 class="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-6">
            ${escapeHtml(homeIntro.title)}
          </h2>
          <div class="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            ${introHtml}
          </div>
        </section>
      </main>
      ${renderFooterHtml()}
    `;

    const finalHtml = injectMetadata(templateHtml, {
      title,
      description,
      canonical,
      jsonLd,
      bodyHtml,
    });

    writeFileSync(join(distDir, "index.html"), finalHtml, "utf8");
    count++;
  }

  // 1. Prerender all Calculators
  for (const calc of calculators) {
    const canonical = `${siteUrl}/calculator/${calc.slug}`;
    const categoryName = getCategoryName(calc.category);
    const title = calc.metaTitle || `${calc.name} - Free Online Calculator | CalcZen`;
    const description = calc.metaDescription || calc.description;
    const related = getRelatedCalculators(calc.slug, calc.category);
    const sources = getCategorySources(calc.category);

    let faqs: { question: string; answer: string }[] = [];
    const contentFile = join(process.cwd(), "src", "data", "content", `${calc.slug}.ts`);
    if (existsSync(contentFile)) {
      try {
        const mod = await import(`../src/data/content/${calc.slug}.ts`);
        if (mod.default?.faqs?.length) {
          faqs = mod.default.faqs;
        }
      } catch (e) {
        console.warn(`[PRERENDER] Could not load content for ${calc.slug}:`, e);
      }
    }

    const jsonLd: object[] = [
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
          priceCurrency: "INR",
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

    if (faqs.length > 0) {
      jsonLd.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
          },
        })),
      });
    }

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

          <!-- FAQs (when available) -->
          ${
            faqs.length
              ? `
          <section class="border-t border-border/40 pt-10 mt-12">
            <h2 class="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div class="space-y-4">
              ${faqs
                .map(
                  (f) => `
                <div>
                  <h3 class="text-base font-semibold text-foreground mb-1">${escapeHtml(f.question)}</h3>
                  <p class="text-sm text-muted-foreground leading-relaxed">${escapeHtml(f.answer)}</p>
                </div>
              `,
                )
                .join("")}
            </div>
          </section>
          `
              : ""
          }

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

          <!-- Sources & further reading -->
          ${
            sources.length
              ? `
          <aside class="border-t border-border/40 pt-10 mt-12">
            <h3 class="text-xl font-bold mb-4">Sources &amp; further reading</h3>
            <ul class="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground/90">
              ${sources
                .map(
                  (s) => `
                <li>
                  <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-medium">${escapeHtml(s.name)}</a>
                </li>
              `,
                )
                .join("")}
            </ul>
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

  // 4. Prerender Static Pages (/about, /contact, /privacy, /terms, /disclaimer, /blog)
  const staticSlugs = ["about", "contact", "privacy", "terms", "disclaimer", "blog"] as const;
  for (const slug of staticSlugs) {
    const data = staticPagesContent[slug];
    if (!data) continue;

    const canonical = `${siteUrl}/${slug}`;
    const title = data.title;
    const description = data.description;

    const pageType =
      slug === "about"
        ? "AboutPage"
        : slug === "contact"
          ? "ContactPage"
          : "WebPage";

    const jsonLd: object[] = [
      {
        "@context": "https://schema.org",
        "@type": pageType,
        name: title,
        description: description,
        url: canonical,
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
            name: data.h1,
            item: canonical,
          },
        ],
      },
    ];

    let contentHtml = "";

    if (slug === "contact") {
      contentHtml = `
        <main class="min-h-screen bg-background text-foreground py-10 sm:py-16">
          <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <header class="mb-8">
              <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
                ${escapeHtml(data.h1)}
              </h1>
              <p class="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                ${escapeHtml(data.intro || "")}
              </p>
            </header>
            <section class="space-y-4">
              <h2 class="text-lg font-semibold text-foreground">Send Us a Message</h2>
              <form class="space-y-4 mt-4">
                <div>
                  <label class="block text-sm font-medium mb-1">Name</label>
                  <input type="text" placeholder="Your name" class="w-full px-3 py-2 rounded-lg border border-border/80 bg-card text-foreground" disabled />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Email</label>
                  <input type="email" placeholder="your@email.com" class="w-full px-3 py-2 rounded-lg border border-border/80 bg-card text-foreground" disabled />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Message</label>
                  <textarea rows="5" placeholder="How can we help?" class="w-full px-3 py-2 rounded-lg border border-border/80 bg-card text-foreground" disabled></textarea>
                </div>
                <button type="button" class="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">Send message</button>
              </form>
            </section>
            <section class="mt-12 border-t border-border/40 pt-8">
              <h2 class="text-lg font-semibold text-foreground mb-3">Response Times &amp; Support</h2>
              <p class="text-sm text-muted-foreground leading-relaxed">
                We value your feedback and suggestion requests. Our team reviews every submission and typically replies within 24 to 48 business hours. For general inquiries, reporting calculator errors, or suggesting new mathematical or financial simulation tools, please fill out the form above.
              </p>
            </section>
          </div>
        </main>
      `;
    } else if (slug === "blog") {
      contentHtml = `
        <main class="min-h-screen bg-background text-foreground">
          <section class="relative overflow-hidden py-16 sm:py-20 text-center bg-gradient-hero">
            <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 mb-4">Insights &amp; Guides</span>
              <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                ${escapeHtml(data.h1)}
              </h1>
              <p class="mt-4 text-base sm:text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
                ${escapeHtml(data.intro || "")}
              </p>
            </div>
          </section>
          <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="space-y-12">
              <div>
                <h2 class="text-2xl font-bold text-foreground mb-6">Explore Calculation Topics</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  ${calculators
                    .filter((c) => c.popular)
                    .slice(0, 6)
                    .map(
                      (c) => `
                    <a href="/calculator/${c.slug}" class="block p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/50 transition-all">
                      <span class="inline-block text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground mb-2">${escapeHtml(getCategoryName(c.category))}</span>
                      <h3 class="text-base font-bold text-foreground mb-1">${escapeHtml(c.name)} Guide</h3>
                      <p class="text-xs text-muted-foreground line-clamp-2 leading-relaxed">${escapeHtml(c.description)}</p>
                    </a>
                  `,
                    )
                    .join("")}
                </div>
              </div>
              <div class="border-t border-border/40 pt-8">
                <h2 class="text-xl font-bold text-foreground mb-4">Stay Updated with CalcZen</h2>
                <p class="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                  Our articles break down complex formulas into easy step-by-step guides so you can verify the math and make informed financial and health decisions.
                </p>
              </div>
            </div>
          </section>
        </main>
      `;
    } else {
      // Legal and about pages: about, privacy, terms, disclaimer
      contentHtml = `
        <main class="min-h-screen bg-background text-foreground py-8 sm:py-12">
          <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <header class="mb-8 border-b border-border/40 pb-6">
              <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
                ${escapeHtml(data.h1)}
              </h1>
              ${
                data.lastUpdated
                  ? `<p class="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/80">Last updated &middot; ${escapeHtml(data.lastUpdated)}</p>`
                  : ""
              }
              ${
                data.intro
                  ? `<p class="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">${escapeHtml(data.intro)}</p>`
                  : ""
              }
            </header>
            <div class="space-y-8">
              ${data.sections
                .map(
                  (sec) => `
                <section class="space-y-3">
                  <h2 class="text-xl sm:text-2xl font-bold text-foreground border-b border-border/40 pb-2">
                    ${escapeHtml(sec.title)}
                  </h2>
                  ${(sec.paragraphs || [])
                    .map(
                      (p) => `<p class="text-sm sm:text-base text-muted-foreground leading-relaxed">${escapeHtml(p)}</p>`,
                    )
                    .join("")}
                  ${
                    sec.listItems && sec.listItems.length
                      ? `
                    <ul class="list-disc list-inside space-y-1.5 text-sm sm:text-base text-muted-foreground leading-relaxed pl-2">
                      ${sec.listItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                    </ul>
                  `
                      : ""
                  }
                  ${(sec.subsections || [])
                    .map(
                      (sub) => `
                    <div class="pt-2 space-y-2">
                      <h3 class="text-base font-semibold text-foreground">${escapeHtml(sub.title)}</h3>
                      ${(sub.paragraphs || [])
                        .map(
                          (sp) => `<p class="text-sm sm:text-base text-muted-foreground leading-relaxed">${escapeHtml(sp)}</p>`,
                        )
                        .join("")}
                      ${
                        sub.listItems && sub.listItems.length
                          ? `
                        <ul class="list-disc list-inside space-y-1 text-sm sm:text-base text-muted-foreground pl-2">
                          ${sub.listItems.map((sitem) => `<li>${escapeHtml(sitem)}</li>`).join("")}
                        </ul>
                      `
                          : ""
                      }
                    </div>
                  `,
                    )
                    .join("")}
                </section>
              `,
                )
                .join("")}
            </div>
            <footer class="mt-12 pt-6 border-t border-border/40 text-sm text-muted-foreground">
              <p>
                Questions? <a href="/contact" class="text-primary hover:underline font-medium">Contact us</a> &middot; <a href="/calculators" class="text-primary hover:underline font-medium">Browse calculators</a>
              </p>
            </footer>
          </div>
        </main>
      `;
    }

    const bodyHtml = `
      ${renderHeaderHtml()}
      ${contentHtml}
      ${renderFooterHtml()}
    `;

    const finalHtml = injectMetadata(templateHtml, {
      title,
      description,
      canonical,
      jsonLd,
      bodyHtml,
    });

    const targetDir = join(distDir, slug);
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

