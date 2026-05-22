import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
<<<<<<< HEAD
import { PageContainer } from "@/components/layout/PageContainer";
import { CalculatorCard } from "@/components/CalculatorCard";
=======
import { CalculatorCard } from "@/components/CalculatorCard";
import { AdSlot } from "@/components/AdSlot";
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
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
<<<<<<< HEAD
    const title = `${cat.name} Calculators | CalcZen`;
=======
    const title = `${cat.name} Calculators | CalcVerse`;
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
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
<<<<<<< HEAD
      <PageContainer className="py-16 sm:py-24 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Category not found</h1>
        <Link to="/calculators" className="mt-6 inline-flex min-h-[2.75rem] items-center text-accent">
          Browse all calculators
        </Link>
      </PageContainer>
=======
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Category not found</h1>
        <Link to="/calculators" className="mt-6 inline-block text-accent">Browse all calculators</Link>
      </div>
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
    </PageShell>
  ),
});

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  const list = calculatorsByCategory(cat.slug);

  return (
    <PageShell>
<<<<<<< HEAD
      <PageContainer>
        <nav
          aria-label="Breadcrumb"
          className="scroll-touch-x flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4"
        >
          <Link to="/" className="shrink-0 hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="text-foreground font-medium truncate">{cat.name}</span>
        </nav>

        <header className="mb-6 sm:mb-8 min-w-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance">
            {cat.name} calculators
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">{cat.description}.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 min-w-0">
          {list.map((c, i) => (
            <CalculatorCard key={c.slug} calc={c} index={i} />
          ))}
        </div>
      </PageContainer>
=======
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
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
    </PageShell>
  );
}
