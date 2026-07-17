import { getCalculator } from "@/data/calculators";

export function parseBlogContent(content: string, toc: any[]) {
  // Fix spacing in legacy h2/h3 tags
  let html = content.replace(/<(h[23])id=/gi, "<$1 id=");

  // 1. Add IDs to headings matching TOC indexes
  let headingCount = 0;
  html = html.replace(/<(h[23])([^>]*)>/gi, (match, tag, attrs) => {
    if (attrs.includes("id=")) {
      return match;
    }
    const dbTocItem = toc?.[headingCount];
    const targetId = dbTocItem?.id || `heading-${headingCount}`;
    headingCount++;
    return `<${tag}${attrs} id="${targetId}">`;
  });

  // 2. Replace visual editor CTA placeholder blocks with interactive premium cards
  html = html.replace(
    /<div[^>]*class=["']calc-cta-block["'][^>]*data-slug=["']([^"']+)["'][^>]*>([\s\S]*?)<\/div>/gi,
    (match, slug) => {
      const calc = getCalculator(slug);
      if (!calc) return match;

      return `<div class="calc-cta-block rounded-xl border border-indigo-500/25 bg-gradient-hero p-5 my-6 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
      <div class="flex items-center gap-3">
        <div class="p-2.5 rounded-lg bg-gradient-accent text-primary-foreground shadow-glow shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calculator"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
        </div>
        <div class="min-w-0">
          <div class="font-bold text-white text-base leading-tight">Try Our ${calc.name} →</div>
          <p class="text-xs text-slate-400 mt-1 line-clamp-1">${calc.description}</p>
        </div>
      </div>
      <a href="/calculator/${calc.slug}" class="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 hover:scale-[1.015] active:scale-[0.985] transition-all shrink-0 text-center w-full sm:w-auto" style="text-decoration: none !important;">Calculate Free</a>
    </div>`;
    }
  );

  // 3. Inject keyword CTAs after matching paragraphs
  const KEYWORD_MAP = [
    { term: "mortgage", slug: "mortgage-calculator", text: "Mortgage Calculator" },
    { term: "emi", slug: "loan-emi-calculator", text: "EMI Calculator" },
    { term: "bmi", slug: "bmi-calculator", text: "BMI Calculator" },
    { term: "sleep", slug: "sleep-calculator", text: "Sleep Calculator" },
    { term: "calories", slug: "calorie-calculator", text: "Calorie Calculator" },
    { term: "calorie", slug: "calorie-calculator", text: "Calorie Calculator" },
    { term: "percentage", slug: "percentage-calculator", text: "Percentage Calculator" },
    { term: "loan", slug: "loan-emi-calculator", text: "Loan Calculator" },
    { term: "interest", slug: "compound-interest-calculator", text: "Compound Interest Calculator" },
    { term: "age", slug: "age-calculator", text: "Age Calculator" },
    { term: "tip", slug: "tip-calculator", text: "Tip Calculator" },
    { term: "sip", slug: "sip-calculator", text: "SIP Calculator" },
    { term: "retirement", slug: "retirement-calculator", text: "Retirement Calculator" },
    { term: "investment", slug: "compound-interest-calculator", text: "Investment Calculator" },
  ];

  const matchedSlugs = new Set<string>();

  // Split the HTML by </p> and insert CTAs after relevant paragraph segments
  const parts = html.split("</p>");
  for (let i = 0; i < parts.length; i++) {
    if (matchedSlugs.size >= 2) break;
    const part = parts[i].trim();
    if (!part) continue;

    const plainText = part.replace(/<[^>]*>/g, "").toLowerCase();

    for (const mapping of KEYWORD_MAP) {
      if (matchedSlugs.has(mapping.slug)) continue;

      const regex = new RegExp(`\\b${mapping.term}\\b`, "i");
      if (regex.test(plainText)) {
        const calc = getCalculator(mapping.slug);
        if (calc) {
          matchedSlugs.add(mapping.slug);

          const ctaMarkup = `
<div class="calc-keyword-cta rounded-xl border border-border/80 bg-card/65 p-4.5 my-5 flex items-center justify-between gap-4 select-none border-l-4 border-l-indigo-500">
  <div class="flex items-center gap-3 min-w-0">
    <div class="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
    </div>
    <div class="min-w-0">
      <div class="font-semibold text-xs sm:text-sm text-foreground leading-tight">Featured Calculator: ${calc.name}</div>
      <p class="text-[10px] sm:text-xs text-muted-foreground mt-0.5 truncate">${calc.description}</p>
    </div>
  </div>
  <a href="/calculator/${calc.slug}" class="rounded-lg bg-indigo-600/15 hover:bg-indigo-600/35 border border-indigo-500/35 text-indigo-300 font-semibold text-[11px] px-3.5 py-1.5 hover:scale-[1.01] active:scale-[0.99] transition-all shrink-0" style="text-decoration: none !important;">Open Tool →</a>
</div>`;

          parts[i] = part + "</p>" + ctaMarkup;
          break;
        }
      }
    }

    if (!parts[i].includes("calc-keyword-cta")) {
      parts[i] = part + "</p>";
    }
  }

  return parts.join("");
}

export function getActiveToc(content: string, dbToc?: any[]) {
  if (dbToc && dbToc.length > 0) {
    return dbToc;
  }

  const items: Array<{ id: string; text: string; level: number }> = [];
  const headingRegex = /<(h[23])([^>]*)>([\s\S]*?)<\/h[23]>/gi;
  let match;
  let idx = 0;

  const parsedContent = content.replace(/<(h[23])id=/gi, "<$1 id=");

  while ((match = headingRegex.exec(parsedContent)) !== null) {
    const tag = match[1];
    const attrs = match[2];
    const text = match[3].replace(/<[^>]*>/g, "");

    const idMatch = /id=["']([^"']+)["']/i.exec(attrs);
    const id = idMatch ? idMatch[1] : `heading-${idx}`;

    items.push({
      id,
      text,
      level: tag.toLowerCase() === "h2" ? 2 : 3,
    });
    idx++;
  }

  return items;
}
