import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { getCalculator } from "@/data/calculators";
import { calculatorComponents } from "@/calculators/registry";

const OG_IMAGE_SLUGS = new Set([
  "401k-calculator",
  "ac-electricity-cost-calculator",
  "age-calculator",
  "appliance-electricity-cost-calculator",
  "attendance-calculator",
  "bmi-calculator",
  "bmr-calculator",
  "body-fat-calculator",
  "calorie-calculator",
  "cement-bag-calculator",
  "cgpa-calculator",
  "compound-interest-calculator",
  "couple-age-difference-calculator",
  "credit-card-emi-calculator",
  "ctc-to-in-hand-salary-calculator",
  "diamond-jewellery-price-calculator",
  "fd-calculator",
  "flames-calculator",
  "gold-jewellery-bill-calculator",
  "gold-loan-against-jewellery-calculator",
  "gold-making-charges-calculator",
  "gold-purity-karat-converter",
  "gst-calculator",
  "gst-invoice-calculator",
  "home-electricity-bill-calculator",
  "inflation-calculator",
  "jewellery-budget-to-weight-calculator",
  "job-offer-comparison-calculator",
  "loan-eligibility-calculator",
  "loan-emi-calculator",
  "love-calculator",
  "mortgage-calculator",
  "old-gold-exchange-value-calculator",
  "percentage-calculator",
  "pregnancy-due-date-calculator",
  "product-profit-calculator",
  "protein-calculator",
  "rcc-price-calculator",
  "retirement-calculator",
  "scientific-calculator",
  "silver-jewellery-bill-calculator",
  "sip-calculator",
  "sleep-calculator",
  "standard-calculator",
  "tip-calculator",
  "water-intake-calculator",
]);

export const Route = createFileRoute("/calculator/$slug")({
  loader: ({ params }) => {
    const calc = getCalculator(params.slug);
    if (!calc) throw notFound();
    return { calc };
  },
  head: ({ loaderData }) => {
    const calc = loaderData?.calc;
    if (!calc) return {};

    const title = calc.metaTitle || `${calc.name} - Free Online Calculator | CalcZen`;
    const desc = calc.metaDescription || calc.description;
    const url = `https://www.calczen.in/calculator/${calc.slug}`;
    const ogImage = OG_IMAGE_SLUGS.has(calc.slug)
      ? `https://www.calczen.in/og/${calc.slug}.png`
      : "https://www.calczen.in/og/default-og.png";
    const is1200x630 =
      ogImage.endsWith("/default-og.png") ||
      (calc.slug !== "bmi-calculator" && calc.slug !== "scientific-calculator");

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "robots", content: "index,follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:image", content: ogImage },
        ...(is1200x630
          ? [
              { property: "og:image:width", content: "1200" },
              { property: "og:image:height", content: "630" },
              { property: "og:image:type", content: "image/png" },
            ]
          : []),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: ogImage },
        { name: "keywords", content: calc.keywords.join(", ") },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: CalcPage,
  notFoundComponent: () => (
    <PageShell>
      <div className="page-container max-w-3xl py-16 sm:py-24 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Calculator not found</h1>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground">
          We couldn't find that calculator. Browse all of them instead.
        </p>
        <Link
          to="/calculators"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          All calculators
        </Link>
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
        <Suspense
          fallback={
            <div className="page-container py-12 sm:py-20">
              <div className="h-64 sm:h-96 rounded-xl sm:rounded-2xl bg-muted/25 animate-pulse" />
            </div>
          }
        >
          <Component />
        </Suspense>
      ) : (
        <div className="page-container max-w-3xl py-16 sm:py-24 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">{calc.name}</h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            This calculator is coming soon.
          </p>
        </div>
      )}
    </PageShell>
  );
}
