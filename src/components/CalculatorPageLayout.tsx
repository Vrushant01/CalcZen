import { Link } from "@tanstack/react-router";
<<<<<<< HEAD
import { ChevronRight, Share2 } from "lucide-react";
import { CalculatorExample } from "@/components/CalculatorExample";
import { CalculatorFormula } from "@/components/CalculatorFormula";
import { Button } from "@/components/ui/button";
import { CalculatorCard } from "@/components/CalculatorCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { calculators, getCategory, type CalculatorMeta } from "@/data/calculators";
import { motion } from "framer-motion";
=======
import { ChevronRight, Share2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdSlot } from "@/components/AdSlot";
import { CalculatorCard } from "@/components/CalculatorCard";
import { calculators, getCategory, type CalculatorMeta } from "@/data/calculators";
import { motion } from "framer-motion";

>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
type FAQ = { q: string; a: string };

type Props = {
  calc: CalculatorMeta;
  intro: string;
  formula?: string;
  example?: string;
  faqs: FAQ[];
<<<<<<< HEAD
  children: React.ReactNode;
=======
  children: React.ReactNode; // the actual interactive calculator
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
};

export function CalculatorPageLayout({ calc, intro, formula, example, faqs, children }: Props) {
  const category = getCategory(calc.category);
  const related = calculators
    .filter((c) => c.category === calc.category && c.slug !== calc.slug)
    .slice(0, 4);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
<<<<<<< HEAD
      try {
        await navigator.share({ title: calc.name, url });
      } catch {
        /* cancelled */
      }
    } else if (typeof navigator !== "undefined") {
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        /* unavailable */
      }
=======
      try { await navigator.share({ title: calc.name, url }); } catch {}
    } else if (typeof navigator !== "undefined") {
      try { await navigator.clipboard.writeText(url); } catch {}
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
    }
  };

  return (
<<<<<<< HEAD
    <PageContainer spacing="tight" className="lg:py-10">
      <nav
        aria-label="Breadcrumb"
        className="scroll-touch-x flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 -mx-1 px-1"
      >
        <Link to="/" className="shrink-0 hover:text-foreground py-1">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {category && (
          <>
            <Link
              to="/category/$slug"
              params={{ slug: category.slug }}
              className="shrink-0 hover:text-foreground py-1 max-w-[5rem] sm:max-w-none truncate"
            >
              {category.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
          </>
        )}
        <span className="text-foreground font-medium truncate min-w-0 py-1">{calc.name}</span>
      </nav>

      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-5 sm:mb-6"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance leading-tight">
          {calc.name}
        </h1>
        <p className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg text-muted-foreground max-w-4xl leading-relaxed">
          {intro}
        </p>
        <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={share}
            className="gap-2 min-h-10 sm:min-h-9"
          >
            <Share2 className="h-4 w-4" /> Share
          </Button>
        </div>
      </motion.header>

      <div className="w-full min-w-0 space-y-5 sm:space-y-8">
        <section className="surface-card rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 min-w-0 overflow-hidden">
          <div className="calc-container-inner">{children}</div>
        </section>

        {formula && (
          <div className="surface-card rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 min-w-0">
            <CalculatorFormula formula={formula} />
          </div>
        )}

        {example && (
          <div className="surface-card rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 min-w-0">
            <CalculatorExample example={example} />
          </div>
        )}

        <section className="surface-card rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Frequently asked questions</h2>
          <div className="divide-y divide-border">
            {faqs.map((f) => (
              <details key={f.q} className="py-3 sm:py-3.5 group">
                <summary className="cursor-pointer font-medium text-sm sm:text-base flex items-start justify-between gap-3 list-none min-h-[2.75rem] py-0.5">
                  <span className="text-balance pr-1">{f.q}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 mt-0.5 transition-transform group-open:rotate-90" />
                </summary>
                <p className="select-copy mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Related calculators</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {related.map((c, i) => (
                <CalculatorCard key={c.slug} calc={c} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

=======
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
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
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
<<<<<<< HEAD
    </PageContainer>
=======
    </div>
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
  );
}
