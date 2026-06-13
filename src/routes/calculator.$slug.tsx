import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { getCalculator, calculators } from "@/data/calculators";
import { calculatorComponents } from "@/calculators/registry";
import type { CalculatorEducationalContent } from "@/data/content-types";
import { Info, HelpCircle, BookOpen, Calculator, AlertTriangle, ShieldCheck } from "lucide-react";

// Dynamically import all content files
const contentModules = import.meta.glob('@/data/content/*.ts');

export const Route = createFileRoute("/calculator/$slug")({
  loader: async ({ params }) => {
    const calc = getCalculator(params.slug);
    if (!calc) throw notFound();
    
    let content: CalculatorEducationalContent | null = null;
    const contentPath = `/src/data/content/${params.slug}.ts`;
    if (contentModules[contentPath]) {
      const mod = await contentModules[contentPath]() as { default: CalculatorEducationalContent };
      content = mod.default;
    }
    
    return { calc, content };
  },
  head: ({ loaderData }) => {
    const { calc, content } = loaderData || {};
    if (!calc) return {};
    
    const title = calc.metaTitle || `${calc.name} - Free Online Calculator | CalcZen`;
    const desc = calc.metaDescription || calc.description;
    const url = `https://calczen.in/calculator/${calc.slug}`;
    const siteUrl = "https://calczen.in";
    
    const scripts: any[] = [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": calc.name,
          "description": desc,
          "applicationCategory": "CalculatorApplication",
          "operatingSystem": "All",
          "url": url,
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
            { "@type": "ListItem", "position": 2, "name": "Calculators", "item": `${siteUrl}/calculators` },
            { "@type": "ListItem", "position": 3, "name": calc.name, "item": url }
          ]
        }),
      }
    ];

    if (content?.faqs && content.faqs.length > 0) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": content.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        })
      });
    }
    
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "robots", content: "index,follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "keywords", content: calc.keywords.join(", ") },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts
    };
  },
  component: CalcPage,
  notFoundComponent: () => (
    <PageShell>
      <div className="page-container max-w-3xl py-16 sm:py-24 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Calculator not found</h1>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground">We couldn't find that calculator. Browse all of them instead.</p>
        <Link to="/calculators" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">All calculators</Link>
      </div>
    </PageShell>
  ),
});

function CalcPage() {
  const { calc, content } = Route.useLoaderData();
  const Component = calculatorComponents[calc.slug];
  
  // Format related calculators
  const relatedCalcs = content?.relatedCalculators 
    ? calculators.filter(c => content.relatedCalculators.includes(c.slug)) 
    : [];

  return (
    <PageShell>
      <div className="page-container max-w-4xl pt-8 pb-16 min-w-0">
        <div className="mb-8 border-b border-border/40 pb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">{calc.h1 || calc.name}</h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">{calc.description}</p>
        </div>

        {Component ? (
          <Suspense fallback={<div className="h-64 sm:h-96 rounded-xl sm:rounded-2xl bg-muted/25 animate-pulse w-full" />}>
            <Component />
          </Suspense>
        ) : (
          <div className="py-16 sm:py-24 text-center border rounded-xl border-dashed bg-card/25">
            <p className="text-sm sm:text-base text-muted-foreground">This interactive calculator is currently being built.</p>
          </div>
        )}

        {content && (
          <article className="mt-16 sm:mt-24 max-w-3xl prose prose-invert prose-p:leading-[1.8] prose-p:text-muted-foreground prose-h2:text-foreground prose-h2:font-bold prose-h2:border-b prose-h2:border-border/40 prose-h2:pb-2">
            <h2 id="what-it-does" className="flex items-center gap-2">
              <Info className="h-5 w-5 text-accent" />
              What This Calculator Does
            </h2>
            <p>{content.whatItDoes}</p>

            <h2 id="how-it-works" className="flex items-center gap-2 mt-12">
              <ShieldCheck className="h-5 w-5 text-accent" />
              How It Works
            </h2>
            <p>{content.howItWorks}</p>

            <h2 id="formula" className="flex items-center gap-2 mt-12">
              <Calculator className="h-5 w-5 text-accent" />
              Formula Used
            </h2>
            <p className="whitespace-pre-wrap">{content.formula}</p>

            <h2 id="example" className="flex items-center gap-2 mt-12">
              <BookOpen className="h-5 w-5 text-accent" />
              Worked Example
            </h2>
            <p className="whitespace-pre-wrap">{content.example}</p>

            <h2 id="common-mistakes" className="flex items-center gap-2 mt-12">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Common Mistakes
            </h2>
            <p>{content.mistakes}</p>

            <h2 id="faqs" className="flex items-center gap-2 mt-12">
              <HelpCircle className="h-5 w-5 text-accent" />
              Frequently Asked Questions
            </h2>
            <div className="not-prose space-y-4 mt-6">
              {content.faqs.map((faq, i) => (
                <div key={i} className="rounded-xl border border-border/60 bg-card/25 p-5 shadow-sm">
                  <h3 className="font-bold text-foreground text-base">{faq.question}</h3>
                  <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            {content.authorityLinks && content.authorityLinks.length > 0 && (
              <>
                <h2 id="references" className="mt-12">Authority References</h2>
                <ul className="not-prose space-y-2 mt-4 text-sm">
                  {content.authorityLinks.map((link, i) => (
                    <li key={i}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                        {link.text} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {relatedCalcs.length > 0 && (
              <>
                <h2 id="related" className="mt-12">Related Calculators</h2>
                <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {relatedCalcs.map(rc => (
                    <Link 
                      key={rc.slug}
                      to="/calculator/$slug"
                      params={{ slug: rc.slug }}
                      className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-card/25 hover:border-accent/40 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-accent/10 text-accent">
                        <rc.icon className="h-5 w-5" />
                      </div>
                      <span className="font-semibold text-sm">{rc.name}</span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </article>
        )}
      </div>
    </PageShell>
  );
}
