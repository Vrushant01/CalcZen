import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
<<<<<<< HEAD
import { PageContainer } from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/input";
import { CalculatorCard } from "@/components/CalculatorCard";
import { calculators, categories } from "@/data/calculators";
import { cn } from "@/lib/utils";
=======
import { Input } from "@/components/ui/input";
import { CalculatorCard } from "@/components/CalculatorCard";
import { AdSlot } from "@/components/AdSlot";
import { calculators, categories } from "@/data/calculators";
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3

export const Route = createFileRoute("/calculators")({
  head: () => ({
    meta: [
<<<<<<< HEAD
      { title: "All Calculators — Browse Every Tool | CalcZen" },
      { name: "description", content: "Browse and search every CalcZen calculator. Finance, health, math and everyday tools — all free, all instant." },
      { property: "og:title", content: "All Calculators | CalcZen" },
      { property: "og:description", content: "Browse every CalcZen calculator." },
=======
      { title: "All Calculators — Browse Every Tool | CalcVerse" },
      { name: "description", content: "Browse and search every CalcVerse calculator. Finance, health, math and everyday tools — all free, all instant." },
      { property: "og:title", content: "All Calculators | CalcVerse" },
      { property: "og:description", content: "Browse every CalcVerse calculator." },
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
      { property: "og:url", content: "/calculators" },
    ],
    links: [{ rel: "canonical", href: "/calculators" }],
  }),
  component: AllCalculators,
});

function AllCalculators() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    return calculators.filter((c) => {
      if (cat !== "all" && c.category !== cat) return false;
      if (!s) return true;
      return c.name.toLowerCase().includes(s) || c.keywords.some((k) => k.includes(s));
    });
  }, [q, cat]);

  return (
    <PageShell>
<<<<<<< HEAD
      <PageContainer>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance">
          All calculators
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          Search by name, keyword or filter by category.
        </p>

        <div className="mt-5 sm:mt-6 flex flex-col gap-3 min-w-0">
          <div className="relative w-full min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search calculators…"
              className="pl-10 h-11 w-full"
            />
          </div>
          <div className="scroll-touch-x flex gap-2 pb-1 -mx-1 px-1">
            {[{ slug: "all", name: "All" }, ...categories].map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => setCat(c.slug)}
                className={cn(
                  "shrink-0 px-3.5 py-2.5 rounded-lg text-sm font-medium border whitespace-nowrap min-h-[2.75rem] transition-[color,background-color,border-color,box-shadow] duration-300 ease-out",
                  cat === c.slug
                    ? "bg-primary text-primary-foreground border-primary shadow-soft"
                    : "border-border/60 bg-card/50 hover:bg-muted/80 hover:border-accent/25",
                )}
              >
=======
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">All calculators</h1>
        <p className="mt-2 text-muted-foreground">Search by name, keyword or filter by category.</p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search calculators…" className="pl-10 h-11" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {[{ slug: "all", name: "All" }, ...categories].map((c) => (
              <button key={c.slug} onClick={() => setCat(c.slug)}
                className={`px-3.5 py-2 rounded-md text-sm font-medium border whitespace-nowrap transition-colors ${cat===c.slug?"bg-primary text-primary-foreground border-primary":"border-border hover:bg-muted"}`}>
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
                {c.name}
              </button>
            ))}
          </div>
        </div>

<<<<<<< HEAD
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 min-w-0">
          {filtered.map((c, i) => (
            <CalculatorCard key={c.slug} calc={c} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12 sm:py-16">No calculators match your search.</p>
        )}
      </PageContainer>
=======
        <div className="mt-6"><AdSlot variant="leaderboard" /></div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((c, i) => <CalculatorCard key={c.slug} calc={c} index={i} />)}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-16">No calculators match your search.</p>
        )}
      </div>
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
    </PageShell>
  );
}
