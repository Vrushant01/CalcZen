import { Link } from "@tanstack/react-router";
import { ChevronRight, Share2 } from "lucide-react";
import { CalculatorExample } from "@/components/CalculatorExample";
import { CalculatorFormula } from "@/components/CalculatorFormula";
import { Button } from "@/components/ui/button";
import { CalculatorCard } from "@/components/CalculatorCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { calculators, getCategory, type CalculatorMeta } from "@/data/calculators";
import { motion } from "framer-motion";
type FAQ = { q: string; a: string };

type Props = {
  calc: CalculatorMeta;
  intro: string;
  formula?: string;
  example?: string;
  faqs: FAQ[];
  children: React.ReactNode;
};

export function CalculatorPageLayout({ calc, intro, formula, example, faqs, children }: Props) {
  const category = getCategory(calc.category);
  const related = calculators
    .filter((c) => c.category === calc.category && c.slug !== calc.slug)
    .slice(0, 4);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
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
    }
  };

  return (
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
    </PageContainer>
  );
}
