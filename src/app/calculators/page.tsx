import type { Metadata } from "next";
import { Suspense } from "react";
import CalculatorsClient from "./CalculatorsClient";

export const metadata: Metadata = {
  title: "All Calculators — Browse Every Tool | CalcZen",
  description:
    "Browse and search our full directory of free online calculators. Access accurate tools for personal finance, health tracking, math, and daily helpers.",
  openGraph: {
    title: "All Calculators | CalcZen",
    description:
      "Browse and search our full directory of free online calculators. Access accurate tools for personal finance, health tracking, math, and daily helpers.",
    url: "https://calczen.in/calculators",
  },
  twitter: {
    description:
      "Browse and search our full directory of free online calculators. Access accurate tools for personal finance, health tracking, math, and daily helpers.",
  },
  alternates: {
    canonical: "https://calczen.in/calculators",
  },
};

export default function CalculatorsPage() {
  const jsonLdCalculators = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "All Calculators — Browse Every Tool | CalcZen",
    description:
      "Browse and search every CalcZen calculator. Access free financial, health, mathematical, and everyday tools for instant, accurate results.",
    url: "https://calczen.in/calculators",
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://calczen.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Calculators",
        item: "https://calczen.in/calculators",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCalculators) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <Suspense fallback={<div className="min-h-screen animate-pulse bg-slate-950/20"></div>}>
        <CalculatorsClient />
      </Suspense>
    </>
  );
}
