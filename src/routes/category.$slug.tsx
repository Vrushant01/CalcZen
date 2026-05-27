import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { CalculatorCard } from "@/components/CalculatorCard";
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
    const title = `${cat.name} Calculators | CalcZen`;
    const desc = `${cat.description}. Free online ${cat.name.toLowerCase()} calculators with formulas, examples and instant results.`;
    return {
      meta: [
        { title }, { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: `https://calczen.in/category/${cat.slug}` },
      ],
      links: [{ rel: "canonical", href: `https://calczen.in/category/${cat.slug}` }],
    };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <PageShell>
      <PageContainer className="py-16 sm:py-24 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Category not found</h1>
        <Link to="/calculators" className="mt-6 inline-flex min-h-[2.75rem] items-center text-accent">
          Browse all calculators
        </Link>
      </PageContainer>
    </PageShell>
  ),
});

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  const list = calculatorsByCategory(cat.slug);

  return (
    <PageShell>
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
    </PageShell>
  );
}
