import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { getCalculator } from "@/data/calculators";
import { calculatorComponents } from "@/calculators/registry";

export const Route = createFileRoute("/calculator/$slug")({
  loader: ({ params }) => {
    const calc = getCalculator(params.slug);
    if (!calc) throw notFound();
    return { calc };
  },
  head: ({ loaderData }) => {
    const calc = loaderData?.calc;
    if (!calc) return {};
    const title = `${calc.name} — Free Online Tool | CalcVerse`;
    const desc = calc.description;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/calculator/${calc.slug}` },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "keywords", content: calc.keywords.join(", ") },
      ],
      links: [{ rel: "canonical", href: `/calculator/${calc.slug}` }],
    };
  },
  component: CalcPage,
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Calculator not found</h1>
        <p className="mt-3 text-muted-foreground">We couldn't find that calculator. Browse all of them instead.</p>
        <Link to="/calculators" className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">All calculators</Link>
      </div>
    </PageShell>
  ),
});

function CalcPage() {
  const { calc } = Route.useLoaderData();
  const Component = calculatorComponents[calc.slug];

  return (
    <PageShell>
      {Component ? (
        <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-20"><div className="h-96 rounded-2xl bg-muted/40 animate-pulse" /></div>}>
          <Component />
        </Suspense>
      ) : (
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="text-2xl font-bold">{calc.name}</h1>
          <p className="mt-3 text-muted-foreground">This calculator is coming soon.</p>
        </div>
      )}
    </PageShell>
  );
}
