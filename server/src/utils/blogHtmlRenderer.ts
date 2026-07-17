import type { ApiBlog } from "../types/database.js";

// Replicated static calculators list for sidebar recommendation
interface SimpleCalc {
  name: string;
  slug: string;
  category: string;
}

const STATIC_CALCULATORS: SimpleCalc[] = [
  { name: "GST Calculator", slug: "gst-calculator", category: "finance" },
  { name: "Loan EMI Calculator", slug: "loan-emi-calculator", category: "finance" },
  { name: "Compound Interest Calculator", slug: "compound-interest-calculator", category: "finance" },
  { name: "Mortgage Calculator", slug: "mortgage-calculator", category: "finance" },
  { name: "SIP Calculator", slug: "sip-calculator", category: "finance" },
  { name: "FD Calculator", slug: "fd-calculator", category: "finance" },
  { name: "BMI Calculator", slug: "bmi-calculator", category: "health" },
  { name: "Calorie Calculator", slug: "calorie-calculator", category: "health" },
  { name: "BMR Calculator", slug: "bmr-calculator", category: "health" },
  { name: "Sleep Calculator", slug: "sleep-calculator", category: "health" },
  { name: "Water Intake Calculator", slug: "water-intake-calculator", category: "health" },
  { name: "Percentage Calculator", slug: "percentage-calculator", category: "math" },
  { name: "Scientific Calculator", slug: "scientific-calculator", category: "math" },
  { name: "Standard Calculator", slug: "standard-calculator", category: "math" },
  { name: "CGPA Calculator", slug: "cgpa-calculator", category: "math" },
  { name: "Age Calculator", slug: "age-calculator", category: "math" },
];

function getSidebarCalculators(categoryName: string): SimpleCalc[] {
  const catSlugs: Record<string, string> = {
    finance: "finance",
    mortgage: "finance",
    loans: "finance",
    taxes: "finance",
    investment: "finance",
    health: "health",
    fitness: "health",
    bmi: "health",
    math: "math",
    education: "math",
    science: "math",
  };
  const target = catSlugs[categoryName.toLowerCase()] || "finance";
  return STATIC_CALCULATORS.filter((c) => c.category === target).slice(0, 4);
}

// Common Page Header
function renderHeader() {
  return `
    <header class="sticky top-0 z-50 w-full border-b border-border/40 glass-header backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/60 transition-[background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
      <div class="page-container flex h-14 sm:h-16 items-center justify-between gap-1.5 sm:gap-3 !py-0">
        <a href="/" class="flex min-w-0 shrink items-center gap-2 group touch-target !min-w-0 !justify-start">
          <span class="inline-flex items-center gap-2.5 transition-[transform,filter] duration-300 ease-out group-hover:scale-[1.015]">
            <img src="/brand/calczen-logo.png" alt="CalcZen logo" class="h-8 w-8 sm:h-9 sm:w-9 object-contain" loading="eager" />
            <span class="truncate text-base sm:text-lg font-bold tracking-tight">
              <span class="text-foreground">Calc</span>
              <span class="bg-gradient-to-r from-[#1D56D8] via-[#177FE8] to-[#1BC8FF] bg-clip-text text-transparent">Zen</span>
            </span>
          </span>
        </a>

        <nav class="hidden md:flex items-center gap-0.5 lg:gap-1 min-w-0">
          <a href="/calculators" class="px-2.5 lg:px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 ease-out rounded-lg hover:bg-muted/70 whitespace-nowrap">All Calculators</a>
          <a href="/category/finance" class="px-2.5 lg:px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 ease-out rounded-lg hover:bg-muted/70 whitespace-nowrap">Finance</a>
          <a href="/category/health" class="px-2.5 lg:px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 ease-out rounded-lg hover:bg-muted/70 whitespace-nowrap">Health</a>
          <a href="/category/math" class="px-2.5 lg:px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 ease-out rounded-lg hover:bg-muted/70 whitespace-nowrap">Math</a>
          <a href="/blog" class="px-2.5 lg:px-3 py-2 text-sm font-semibold text-foreground rounded-lg bg-muted/90 shadow-soft whitespace-nowrap">Blog</a>
          <a href="/about" class="px-2.5 lg:px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 ease-out rounded-lg hover:bg-muted/70 whitespace-nowrap">About</a>
        </nav>

        <div class="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <!-- Theme Toggle placeholder -->
          <div class="h-9 w-9 rounded-lg flex items-center justify-center border border-border/40 bg-card/25 text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-moon"><path d="M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.3 17.7-1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/></svg>
          </div>
          <a href="/calculators" class="hidden sm:inline-flex border border-border/60 bg-card/50 rounded-lg px-3.5 py-1.5 text-xs text-muted-foreground hover:text-foreground shadow-soft hover:shadow-card font-semibold items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            Search
          </a>
        </div>
      </div>
    </header>
  `;
}

// Common Page Footer
function renderFooter() {
  const year = new Date().getFullYear();
  return `
    <footer class="border-t border-border/50 bg-gradient-surface mt-12 sm:mt-16 md:mt-20">
      <div class="page-container">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-y-6 sm:gap-x-10 lg:gap-x-14 py-6 sm:py-8">
          <div class="sm:col-span-2 lg:col-span-4 min-w-0">
            <a href="/" class="inline-flex items-center gap-2.5 group touch-target !min-w-0 !justify-start">
              <span class="inline-flex items-center gap-2.5">
                <img src="/brand/calczen-logo.png" alt="CalcZen logo" class="h-8 w-8 object-contain" />
                <span class="truncate text-base font-semibold tracking-tight text-foreground">CalcZen</span>
              </span>
            </a>
            <p class="mt-2.5 text-sm text-muted-foreground/90 leading-relaxed max-w-sm">
              Fast, reliable calculators for finance, health, math, and everyday use.
            </p>
          </div>

          <div class="flex flex-col gap-0 sm:contents">
            <div class="lg:col-span-2 lg:col-start-7">
              <div class="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground mb-2.5">Categories</div>
              <ul class="flex flex-col gap-1 sm:gap-2">
                <li><a href="/category/finance" class="inline-flex min-h-[2.25rem] items-center text-sm text-muted-foreground/90 hover:text-foreground transition-colors duration-200">Finance</a></li>
                <li><a href="/category/health" class="inline-flex min-h-[2.25rem] items-center text-sm text-muted-foreground/90 hover:text-foreground transition-colors duration-200">Health</a></li>
                <li><a href="/category/math" class="inline-flex min-h-[2.25rem] items-center text-sm text-muted-foreground/90 hover:text-foreground transition-colors duration-200">Math</a></li>
              </ul>
            </div>

            <div class="lg:col-span-2">
              <div class="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground mb-2.5">Company</div>
              <ul class="flex flex-col gap-1 sm:gap-2">
                <li><a href="/about" class="inline-flex min-h-[2.25rem] items-center text-sm text-muted-foreground/90 hover:text-foreground transition-colors duration-200">About</a></li>
                <li><a href="/blog" class="inline-flex min-h-[2.25rem] items-center text-sm text-muted-foreground/90 hover:text-foreground transition-colors duration-200">Blog</a></li>
                <li><a href="/contact" class="inline-flex min-h-[2.25rem] items-center text-sm text-muted-foreground/90 hover:text-foreground transition-colors duration-200">Contact</a></li>
                <li><a href="/calculators" class="inline-flex min-h-[2.25rem] items-center text-sm text-muted-foreground/90 hover:text-foreground transition-colors duration-200">All calculators</a></li>
              </ul>
            </div>

            <div class="col-span-2 sm:col-span-1 lg:col-span-2">
              <div class="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground mb-2.5">Legal</div>
              <ul class="flex flex-col gap-1 sm:gap-2 sm:flex-row sm:flex-wrap lg:flex-col">
                <li><a href="/privacy" class="inline-flex min-h-[2.25rem] items-center text-sm text-muted-foreground/90 hover:text-foreground transition-colors duration-200">Privacy</a></li>
                <li><a href="/terms" class="inline-flex min-h-[2.25rem] items-center text-sm text-muted-foreground/90 hover:text-foreground transition-colors duration-200">Terms</a></li>
                <li><a href="/disclaimer" class="inline-flex min-h-[2.25rem] items-center text-sm text-muted-foreground/90 hover:text-foreground transition-colors duration-200">Disclaimer</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-border/50">
        <div class="page-container py-4 sm:py-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-xs text-muted-foreground/75 tabular-nums">© ${year} CalcZen</p>
          <p class="text-xs text-muted-foreground/75 leading-relaxed sm:text-right max-w-md">
            For informational use only—not professional advice.
          </p>
        </div>
      </div>
    </footer>
  `;
}

/** Pre-renders a single blog article page */
export function renderBlogDetailHtml(blog: ApiBlog, relatedBlogs: ApiBlog[]): string {
  const cleanBody = blog.content.replace(/<(h[23])id=/gi, "<$1 id=");
  const showDate = blog.publishDate ? new Date(blog.publishDate).toLocaleDateString() : "";
  const sideCalcs = getSidebarCalculators(blog.category);

  // Generate Table of Contents
  const tocItems: Array<{ id: string; text: string; level: number }> = [];
  if (blog.toc && blog.toc.length > 0) {
    tocItems.push(...blog.toc);
  }

  const tocHtml = tocItems.length > 0
    ? `
      <div class="rounded-2xl border border-border/60 bg-card/25 p-5 min-w-0">
        <h2 class="font-bold text-sm tracking-tight text-foreground mb-3 border-b border-border/40 pb-2 flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open text-indigo-400"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          Table of Contents
        </h2>
        <nav class="space-y-2.5">
          ${tocItems.map(item => `
            <a href="#${item.id}" class="block text-xs font-semibold text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all truncate leading-relaxed ${item.level === 3 ? "pl-3 text-[11px] font-medium" : ""}">
              ${item.level === 3 ? "└ " : "• "}${item.text}
            </a>
          `).join("")}
        </nav>
      </div>
    `
    : "";

  const relatedCalcsHtml = sideCalcs.length > 0
    ? `
      <div class="rounded-2xl border border-border/60 bg-card/25 p-5 min-w-0">
        <h2 class="font-bold text-sm tracking-tight text-foreground mb-3 border-b border-border/40 pb-2 flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles text-accent"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          Related Calculators
        </h2>
        <div class="space-y-3">
          ${sideCalcs.map(c => `
            <a href="/calculator/${c.slug}" class="group flex items-center justify-between p-2.5 rounded-xl border border-border/50 bg-card/45 hover:bg-white/5 hover:border-accent/30 transition-all duration-300">
              <div class="flex items-center gap-2.5 min-w-0">
                <div class="h-8 w-8 rounded-lg bg-gradient-accent text-primary-foreground flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calculator"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
                </div>
                <span class="font-semibold text-xs text-foreground group-hover:text-accent transition-colors truncate">${c.name}</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          `).join("")}
        </div>
      </div>
    `
    : "";

  const relatedBlogsHtml = relatedBlogs.length > 0
    ? `
      <footer class="mt-16 border-t border-border/40 pt-10 pb-6 min-w-0">
        <h2 class="font-bold text-xl sm:text-2xl tracking-tight text-foreground mb-6">Similar Reading You Might Enjoy</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
          ${relatedBlogs.map(r => `
            <div class="group border border-border/80 bg-card/25 rounded-2xl overflow-hidden hover:-translate-y-0.5 hover:border-accent/40 shadow-soft transition-all duration-300">
              <a href="/blog/${r.category.toLowerCase()}/${r.slug}" class="flex flex-col h-full">
                <div class="h-40 bg-black overflow-hidden relative">
                  <img src="${r.thumbnail || ""}" alt="${r.title}" class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
                </div>
                <div class="p-4 sm:p-5 min-w-0">
                  <span class="text-[10px] text-accent font-bold uppercase tracking-wider">${r.category}</span>
                  <h3 class="font-bold text-sm sm:text-base text-foreground mt-1 group-hover:text-accent transition-colors truncate">${r.title}</h3>
                  <p class="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">${r.excerpt}</p>
                  <div class="mt-4 flex items-center gap-3 text-[10px] text-muted-foreground border-t border-border/40 pt-3">
                    <span class="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                      ${r.publishDate ? new Date(r.publishDate).toLocaleDateString() : "-"}
                    </span>
                    <span class="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                      ${r.readingTime} min
                    </span>
                  </div>
                </div>
              </a>
            </div>
          `).join("")}
        </div>
      </footer>
    `
    : "";

  const faqsHtml = blog.faqs && blog.faqs.length > 0
    ? `
      <div class="mt-12 border-t border-border/40 pt-10">
        <div class="surface-card rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 min-w-0">
          <h2 class="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Frequently Asked Questions</h2>
          <div class="space-y-3">
            ${blog.faqs.map((f, i) => `
              <div class="border-b border-border/30 pb-3.5 last:border-b-0 last:pb-0">
                <button class="flex w-full items-center justify-between text-left font-semibold text-sm sm:text-base text-foreground py-2 hover:text-accent transition-colors">
                  <span>${f.question}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down text-muted-foreground/60 transition-transform"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <div class="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1.5 pl-0.5">
                  ${f.answer}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `
    : "";

  return `
    <div class="min-h-dvh flex flex-col select-none w-full">
      ${renderHeader()}

      <main class="flex-1 min-w-0 w-full">
        <article class="page-container py-8 sm:py-10 max-w-5xl px-4 min-w-0 select-text">
          <div class="flex flex-wrap items-center justify-between gap-3 mb-6 select-none">
            <a href="/blog" class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
              Back to Articles
            </a>
            <div class="flex items-center gap-1 text-[11px] sm:text-xs text-muted-foreground font-medium select-none">
              <a href="/" class="hover:text-foreground transition-colors">Home</a>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
              <a href="/blog" class="hover:text-foreground transition-colors">Blog</a>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
              <a href="/blog?category=${blog.category}" class="hover:text-foreground transition-colors">${blog.category}</a>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
              <span class="text-foreground truncate max-w-[200px]">${blog.title}</span>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <main class="lg:col-span-8 min-w-0 bg-card/15 border border-border/40 rounded-2xl p-5 sm:p-7 md:p-9 shadow-card">
              <span class="inline-block rounded-full bg-indigo-500/10 px-3 py-0.5 text-xs font-semibold text-indigo-400">${blog.category}</span>
              <h1 class="text-2xl sm:text-4xl md:text-5xl font-bold mt-4 leading-tight text-foreground tracking-tight">${blog.title}</h1>
              <p class="mt-3.5 text-sm sm:text-base text-muted-foreground font-normal leading-relaxed italic border-l-2 border-indigo-500 pl-3">${blog.excerpt}</p>

              <div class="flex flex-wrap items-center justify-between gap-4 mt-6 border-y border-border/40 py-4">
                <div class="flex items-center gap-4 text-xs text-muted-foreground">
                  <span class="flex items-center gap-1 text-foreground font-medium">By ${blog.author}</span>
                  <span class="h-3 w-px bg-border/60"></span>
                  <span class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                    ${showDate}
                  </span>
                  <span class="h-3 w-px bg-border/60"></span>
                  <span class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    ${blog.readingTime} min read
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-2">
                    <div class="p-1.5 rounded-lg border border-border bg-card/60 text-muted-foreground hover:text-foreground cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    </div>
                    <div class="p-1.5 rounded-lg border border-border bg-card/60 text-muted-foreground hover:text-foreground cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share-2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
                    </div>
                  </div>
                </div>
              </div>

              ${blog.thumbnail ? `
                <div class="rounded-xl overflow-hidden mt-6 h-60 sm:h-90 border border-border/40 bg-black relative">
                  <img src="${blog.thumbnail}" alt="${blog.title}" class="w-full h-full object-cover" />
                </div>
              ` : ""}

              <div class="mt-8 prose prose-invert max-w-none select-text font-normal leading-[1.8] text-sm sm:text-base prose-table:block prose-table:overflow-x-auto prose-table:border prose-table:border-border prose-img:max-w-full prose-img:h-auto">
                ${cleanBody}
              </div>

              <div class="mt-12 rounded-xl border border-border/50 bg-card/35 p-5 flex items-start gap-4 shadow-soft">
                <div class="h-10 w-10 rounded-full bg-gradient-accent text-primary-foreground flex items-center justify-center shrink-0 font-bold text-sm">CZ</div>
                <div class="min-w-0">
                  <div class="font-semibold text-sm text-foreground">${blog.author}</div>
                  <p class="text-xs text-muted-foreground mt-1 leading-relaxed">
                    CalcZen content team provides premium, mathematical, and simulation models tutorials that simplify complex computations for everyday finance, taxes, fitness, and calculations.
                  </p>
                </div>
              </div>

              ${faqsHtml}
            </main>

            <aside class="lg:col-span-4 space-y-6 shrink-0 min-w-0 lg:sticky lg:top-20">
              ${tocHtml}
              ${relatedCalcsHtml}
            </aside>
          </div>

          ${relatedBlogsHtml}
        </article>
      </main>

      ${renderFooter()}
    </div>
  `;
}

/** Pre-renders the blog list page */
export function renderBlogListHtml(blogs: ApiBlog[], total: number, selectedCategory: string): string {
  const CATEGORIES = [
    "All", "Finance", "Health", "Mortgage", "Taxes", "Loans",
    "BMI", "Fitness", "Investment", "Business", "Education", "Math", "Everyday"
  ];

  return `
    <div class="min-h-dvh flex flex-col select-none w-full">
      ${renderHeader()}

      <main class="flex-1 min-w-0 w-full">
        <div class="page-container py-8 sm:py-12 px-4 min-w-0">
          <div class="max-w-3xl mb-8 sm:mb-12">
            <h1 class="text-3xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">The CalcZen Blog</h1>
            <p class="text-base sm:text-lg text-muted-foreground leading-relaxed font-normal">
              Expert guides, calculator tutorials, and practical articles on managing personal finance, tracking fitness goals, and solving math problems.
            </p>
          </div>

          <!-- Category Filter Bar -->
          <div class="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none border-b border-border/40 mb-8 sm:mb-10 select-none">
            ${CATEGORIES.map(cat => {
              const active = cat.toLowerCase() === selectedCategory.toLowerCase() || (cat === "All" && selectedCategory === "");
              const activeClass = active 
                ? "bg-indigo-600 border-indigo-500 text-white font-semibold shadow-sm" 
                : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground hover:bg-muted/70";
              return `
                <a href="/blog${cat === "All" ? "" : `?category=${cat}`}" class="rounded-full border px-4.5 py-1.5 text-xs whitespace-nowrap transition-all duration-300 font-medium ${activeClass}">
                  ${cat}
                </a>
              `;
            }).join("")}
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <!-- Articles Grid -->
            <div class="lg:col-span-8 space-y-8 min-w-0 select-text">
              ${blogs.length > 0 ? `
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  ${blogs.map(b => `
                    <div class="group border border-border/80 bg-card/25 rounded-2xl overflow-hidden hover:-translate-y-0.5 hover:border-accent/40 shadow-soft transition-all duration-300">
                      <a href="/blog/${b.category.toLowerCase()}/${b.slug}" class="flex flex-col h-full">
                        <div class="h-44 bg-black overflow-hidden relative">
                          <img src="${b.thumbnail || ""}" alt="${b.title}" class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
                        </div>
                        <div class="p-5 min-w-0">
                          <span class="text-[10px] text-accent font-bold uppercase tracking-wider">${b.category}</span>
                          <h2 class="font-bold text-base sm:text-lg text-foreground mt-1 group-hover:text-accent transition-colors truncate">${b.title}</h2>
                          <p class="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">${b.excerpt}</p>
                          <div class="mt-4 flex items-center gap-3 text-[10px] text-muted-foreground border-t border-border/40 pt-3.5">
                            <span class="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                              ${b.publishDate ? new Date(b.publishDate).toLocaleDateString() : "-"}
                            </span>
                            <span class="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                              ${b.readingTime} min read
                            </span>
                          </div>
                        </div>
                      </a>
                    </div>
                  `).join("")}
                </div>
              ` : `
                <div class="rounded-xl border border-dashed border-border p-12 text-center select-none bg-card/10">
                  <p class="text-sm text-muted-foreground">No articles found in this category.</p>
                </div>
              `}
            </div>

            <!-- Sidebar -->
            <aside class="lg:col-span-4 space-y-6 shrink-0 min-w-0">
              <!-- Static Newsletter Form -->
              <div class="rounded-2xl border border-indigo-500/25 bg-gradient-hero p-5 text-white shadow-glow relative overflow-hidden">
                <div class="font-semibold text-base flex items-center gap-1.5 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles text-indigo-400 shrink-0"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                  Get Updates
                </div>
                <p class="mt-1.5 text-xs text-white/80 leading-relaxed">
                  Stay updated with our latest calculators, financial updates, and helpful articles. No spam.
                </p>
                <div class="mt-4 flex flex-col gap-2 relative z-10">
                  <input type="email" placeholder="your@email.com" class="bg-white/95 border-0 h-10 w-full text-slate-900 placeholder:text-slate-500 text-xs rounded-lg px-3 outline-none" />
                  <button class="h-10 bg-indigo-600 hover:bg-indigo-500 text-white w-full text-xs font-semibold rounded-lg">Subscribe</button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      ${renderFooter()}
    </div>
  `;
}
