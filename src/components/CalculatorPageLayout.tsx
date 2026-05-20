import { Link } from "@tanstack/react-router";
import { ChevronRight, Share2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdSlot } from "@/components/AdSlot";
import { CalculatorCard } from "@/components/CalculatorCard";
import { calculators, getCategory, type CalculatorMeta } from "@/data/calculators";
import { motion } from "framer-motion";

type FAQ = { q: string; a: string };

type Props = {
  calc: CalculatorMeta;
  intro: string;
  formula?: string;
  example?: string;
  faqs: FAQ[];
  children: React.ReactNode; // the actual interactive calculator
};

export function CalculatorPageLayout({ calc, intro, formula, example, faqs, children }: Props) {
  const category = getCategory(calc.category);
  const related = calculators
    .filter((c) => c.category === calc.category && c.slug !== calc.slug)
    .slice(0, 4);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share({ title: calc.name, url }); } catch {}
    } else if (typeof navigator !== "undefined") {
      try { await navigator.clipboard.writeText(url); } catch {}
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:py-10">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        {category && (
          <>
            <Link to="/category/$slug" params={{ slug: category.slug }} className="hover:text-foreground">{category.name}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
          </>
        )}
        <span className="text-foreground font-medium truncate">{calc.name}</span>
      </nav>

      <motion.header
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        className="mb-6"
      >
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{calc.name}</h1>
        <p className="mt-3 text-base sm:text-lg text-muted-foreground max-w-3xl">{intro}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={share} className="gap-2"><Share2 className="h-4 w-4" /> Share</Button>
          <Button variant="outline" size="sm" onClick={() => typeof window !== "undefined" && window.print()} className="gap-2"><Printer className="h-4 w-4" /> Print</Button>
        </div>
      </motion.header>

      <AdSlot variant="leaderboard" className="mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div className="min-w-0 space-y-8">
          {/* Calculator interactive */}
          <section className="rounded-2xl border border-border bg-card shadow-soft p-5 sm:p-7">
            {children}
          </section>

          <AdSlot variant="in-content" />

          {formula && (
            <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
              <h2 className="text-xl font-semibold mb-3">Formula</h2>
              <pre className="text-sm bg-muted rounded-lg p-4 overflow-x-auto whitespace-pre-wrap">{formula}</pre>
            </section>
          )}

          {example && (
            <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
              <h2 className="text-xl font-semibold mb-3">Example</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{example}</p>
            </section>
          )}

          <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
            <h2 className="text-xl font-semibold mb-4">Frequently asked questions</h2>
            <div className="divide-y divide-border">
              {faqs.map((f) => (
                <details key={f.q} className="py-3 group">
                  <summary className="cursor-pointer font-medium flex items-center justify-between gap-4 list-none">
                    <span>{f.q}</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {related.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Related calculators</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map((c, i) => <CalculatorCard key={c.slug} calc={c} index={i} />)}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <AdSlot variant="rectangle" />
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-semibold mb-2">Why CalcVerse?</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Accurate, transparent formulas</li>
              <li>• Mobile-friendly and fast</li>
              <li>• Free, no signup required</li>
              <li>• Updated regularly</li>
            </ul>
          </div>
          <AdSlot variant="rectangle" />
        </aside>
      </div>

      {/* JSON-LD FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </div>
  );
}
