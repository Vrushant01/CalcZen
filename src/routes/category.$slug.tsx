import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { CalculatorCard } from "@/components/CalculatorCard";
import { AdSlot } from "@/components/AdSlot";
import { calculatorsByCategory, getCategory } from "@/data/calculators";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const cat = getCategory(params.slug);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData }) => {
    const cat = loaderData?.cat;
    if (!cat) return {};
    const title = `${cat.name} Calculators | CalcVerse`;
    const desc = `${cat.description}. Free online ${cat.name.toLowerCase()} calculators with formulas, examples and instant results.`;
    return {
      meta: [
        { title }, { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: `/category/${cat.slug}` },
      ],
      links: [{ rel: "canonical", href: `/category/${cat.slug}` }],
    };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Category not found</h1>
        <Link to="/calculators" className="mt-6 inline-block text-accent">Browse all calculators</Link>
      </div>
    </PageShell>
  ),
});

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  const list = calculatorsByCategory(cat.slug);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{cat.name}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{cat.name} calculators</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">{cat.description}.</p>
        </header>

        <AdSlot variant="leaderboard" className="mb-8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((c, i) => <CalculatorCard key={c.slug} calc={c} index={i} />)}
        </div>
      </div>
    </PageShell>
  );
}
