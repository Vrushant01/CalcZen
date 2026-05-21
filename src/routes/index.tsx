import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Zap, TrendingUp } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalculatorCard } from "@/components/CalculatorCard";
import { categories, calculators } from "@/data/calculators";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CalcZen — Free Online Calculators for Finance, Health, Math & More" },
      { name: "description", content: "Use fast and accurate online calculators for finance, health, mathematics, and daily calculations. Simple tools designed for quick results and easy use." },
      { property: "og:title", content: "CalcZen — Free Online Calculators" },
      { property: "og:description", content: "Online calculators for finance, health, math, and everyday use. Fast, accurate, and free." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "CalcZen",
        url: "/",
        potentialAction: { "@type": "SearchAction", target: "/calculators?q={query}", "query-input": "required name=query" },
      }),
    }],
  }),
  component: Index,
});

function Index() {
  const popular = calculators.filter((c) => c.popular).slice(0, 8);
  const trending = calculators.filter((c) => c.trending);

  return (
    <PageShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-mesh opacity-90" />
        <div className="relative page-container flex flex-col justify-center py-12 sm:py-16 md:py-20 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl min-w-0"
          >
            <h1 className="text-[1.65rem] leading-[1.12] min-[400px]:text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-white text-balance">
              Online Calculators for{" "}
              <span className="text-gradient bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                Finance, Health, Math & Everyday Use
              </span>
            </h1>
            <p className="mt-3 sm:mt-5 max-w-2xl text-sm sm:text-base md:text-lg text-white/80 leading-relaxed">
              Use fast and accurate online calculators for finance, health, mathematics, and daily calculations. Simple tools designed for quick results and easy use.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="page-container -mt-6 sm:-mt-8 md:-mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 min-w-0">
          {categories.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="min-w-0"
            >
              <Link
                to="/category/$slug"
                params={{ slug: c.slug }}
                className={`group block rounded-xl sm:rounded-2xl border bg-gradient-to-br p-4 sm:p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-glow min-h-[5.5rem] ${c.color}`}
              >
                <c.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${c.iconColor}`} />
                <div className="mt-2 sm:mt-3 font-semibold text-sm sm:text-base">{c.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{c.description}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="page-container mt-10 sm:mt-16 md:mt-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-5 sm:mb-6">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Popular calculators</h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">The ones our visitors use the most.</p>
          </div>
          <Link
            to="/calculators"
            className="text-sm font-medium text-accent hover:underline inline-flex items-center gap-1 shrink-0 min-h-[2.75rem] sm:min-h-0 items-center"
          >
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-0">
          {popular.map((c, i) => (
            <CalculatorCard key={c.slug} calc={c} index={i} />
          ))}
        </div>
      </section>

      <section className="page-container mt-10 sm:mt-16 md:mt-20">
        <div className="flex items-center gap-2 mb-5 sm:mb-6">
          <TrendingUp className="h-5 w-5 text-accent shrink-0" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Trending this week</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 min-w-0">
          {trending.map((c, i) => (
            <CalculatorCard key={c.slug} calc={c} index={i} />
          ))}
        </div>
      </section>

      <section className="page-container mt-12 sm:mt-20 md:mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 min-w-0">
          {[
            { icon: Zap, title: "Instant results", text: "Every input updates the result in real time. No buttons, no waiting." },
            { icon: ShieldCheck, title: "Trusted formulas", text: "Each calculator shows its formula and an example so you can verify the math." },
            { icon: Sparkles, title: "Beautifully simple", text: "Mobile-first design that works on any device, with charts that bring numbers to life." },
          ].map((f) => (
            <div key={f.title} className="surface-card rounded-xl sm:rounded-2xl p-5 sm:p-6 min-w-0">
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-accent text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-container mt-12 sm:mt-20 md:mt-24 max-w-4xl prose prose-sm sm:prose-base text-muted-foreground min-w-0">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground text-balance">
          Free online calculators for everyday decisions
        </h2>
        <p>
          From planning a home purchase to checking your daily calorie target, CalcZen gives you a clean, modern set of online calculators that work on any device.
          Every tool explains its formula, shows worked examples, and includes answers to the most common questions — so you understand the math, not just the answer.
        </p>
        <p>
          Our finance calculators help with mortgages, loans, EMI schedules and compound interest growth. Health tools cover BMI, calories, BMR and hydration.
          Math and everyday helpers — percentage, age, and tip calculators — make quick work of the small calculations that come up daily.
        </p>
      </section>

      <section className="page-container mt-10 sm:mt-16 md:mt-20 max-w-4xl min-w-0">
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-hero p-6 sm:p-8 md:p-10 text-center text-white shadow-glow-lg">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-balance">
            Get new calculators in your inbox
          </h2>
          <p className="mt-2 text-sm sm:text-base text-white/80">One short email a month. New tools, finance tips, no spam.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thanks! You're subscribed.");
            }}
            className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto w-full"
          >
            <Input
              type="email"
              required
              placeholder="you@example.com"
              className="bg-white/95 border-0 h-11 w-full min-w-0"
            />
            <Button className="h-11 shrink-0 bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}
