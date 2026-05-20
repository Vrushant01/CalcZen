import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Search, Sparkles, ShieldCheck, Zap, TrendingUp } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalculatorCard } from "@/components/CalculatorCard";
import { AdSlot } from "@/components/AdSlot";
import { categories, calculators } from "@/data/calculators";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CalcVerse — 500+ Free Online Calculators for Finance, Health & More" },
      { name: "description", content: "Smart, accurate online calculators for finance, health, math and everyday life. Free, fast and mobile-friendly. Trusted by thousands daily." },
      { property: "og:title", content: "CalcVerse — Free Online Calculators" },
      { property: "og:description", content: "Smart calculators for finance, health, taxes and everyday life." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "CalcVerse",
        url: "/",
        potentialAction: { "@type": "SearchAction", target: "/calculators?q={query}", "query-input": "required name=query" },
      }),
    }],
  }),
  component: Index,
});

function Index() {
  const [q, setQ] = useState("");
  const popular = calculators.filter((c) => c.popular).slice(0, 8);
  const trending = calculators.filter((c) => c.trending);
  const results = useMemo(() => {
    if (!q.trim()) return [];
    const s = q.toLowerCase();
    return calculators.filter((c) => c.name.toLowerCase().includes(s) || c.keywords.some((k) => k.includes(s))).slice(0, 6);
  }, [q]);

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-95" />
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_20%_20%,oklch(0.72_0.13_185_/_0.25),transparent_50%),radial-gradient(circle_at_80%_60%,oklch(0.62_0.18_255_/_0.25),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> 500+ tools, all free, no signup
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              Smart calculators for <span className="text-gradient bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">finance, health & life</span>
            </h1>
            <p className="mt-5 text-lg text-white/80 max-w-2xl">
              Accurate, beautifully designed calculators that update in real time. Plan a mortgage, check your BMI, grow your savings — instantly.
            </p>

            <div className="mt-8 relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Try mortgage, BMI, percentage, tip…"
                className="h-14 pl-12 pr-32 text-base bg-white/95 backdrop-blur border-0 shadow-glow"
              />
              <Link to="/calculators" className="absolute right-2 top-2">
                <Button size="default" className="h-10 bg-gradient-accent text-primary-foreground hover:opacity-95">
                  Browse all
                </Button>
              </Link>
              {results.length > 0 && (
                <div className="absolute z-10 mt-2 w-full rounded-xl border border-border bg-card shadow-soft overflow-hidden">
                  {results.map((c) => (
                    <Link key={c.slug} to="/calculator/$slug" params={{ slug: c.slug }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted text-sm">
                      <c.icon className="h-4 w-4 text-accent" />
                      <span className="font-medium">{c.name}</span>
                      <span className="text-muted-foreground line-clamp-1 text-xs ml-auto">{c.description}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 max-w-xl text-white">
              {[
                { n: "500+", l: "Calculators" },
                { n: "2M+", l: "Monthly users" },
                { n: "4.9★", l: "User rating" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl sm:text-3xl font-bold">{s.n}</div>
                  <div className="text-xs sm:text-sm text-white/70">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((c, i) => (
            <motion.div key={c.slug}
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.05 }}>
              <Link to="/category/$slug" params={{ slug: c.slug }}
                className={`group block rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all bg-gradient-to-br ${c.color}`}>
                <c.icon className="h-6 w-6 text-accent" />
                <div className="mt-3 font-semibold">{c.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.description}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Popular calculators</h2>
            <p className="text-muted-foreground mt-1">The ones our visitors use the most.</p>
          </div>
          <Link to="/calculators" className="text-sm font-medium text-accent hover:underline inline-flex items-center gap-1">
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popular.map((c, i) => <CalculatorCard key={c.slug} calc={c} index={i} />)}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-12">
        <AdSlot variant="leaderboard" />
      </div>

      {/* Trending */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-20">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-accent" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Trending this week</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trending.map((c, i) => <CalculatorCard key={c.slug} calc={c} index={i} />)}
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: "Instant results", text: "Every input updates the result in real time. No buttons, no waiting." },
            { icon: ShieldCheck, title: "Trusted formulas", text: "Each calculator shows its formula and an example so you can verify the math." },
            { icon: Sparkles, title: "Beautifully simple", text: "Mobile-first design that works on any device, with charts that bring numbers to life." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-accent text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SEO content */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 mt-24 prose prose-sm sm:prose-base text-muted-foreground">
        <h2 className="text-2xl font-bold text-foreground">Free online calculators for everyday decisions</h2>
        <p>
          From planning a home purchase to checking your daily calorie target, CalcVerse gives you a clean, modern set of online calculators that work on any device.
          Every tool explains its formula, shows worked examples, and includes answers to the most common questions — so you understand the math, not just the answer.
        </p>
        <p>
          Our finance calculators help with mortgages, loans, EMI schedules and compound interest growth. Health tools cover BMI, calories, BMR and hydration.
          Math and everyday helpers — percentage, age, and tip calculators — make quick work of the small calculations that come up daily.
        </p>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 mt-20">
        <div className="rounded-3xl bg-gradient-hero p-8 sm:p-10 text-center text-white shadow-glow">
          <h2 className="text-2xl sm:text-3xl font-bold">Get new calculators in your inbox</h2>
          <p className="mt-2 text-white/80">One short email a month. New tools, finance tips, no spam.</p>
          <form onSubmit={(e) => { e.preventDefault(); alert("Thanks! You're subscribed."); }}
            className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input type="email" required placeholder="you@example.com" className="bg-white/95 border-0 h-11" />
            <Button className="h-11 bg-accent text-accent-foreground hover:bg-accent/90">Subscribe</Button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}
