import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCalculator, calculators } from "@/data/calculators";
import CalculatorClient from "./CalculatorClient";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return calculators.map((calc) => ({
    slug: calc.slug,
  }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const calc = getCalculator(slug);
  if (!calc) return {};

  const title = calc.metaTitle || `${calc.name} - Free Online Calculator | CalcZen`;
  const desc = calc.metaDescription || calc.description;
  const url = `https://www.calczen.in/calculator/${calc.slug}`;

  return {
    title,
    description: desc,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: desc,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
    },
    keywords: calc.keywords.join(", "),
  };
}

export default async function CalculatorPage({ params }: RouteParams) {
  const { slug } = await params;
  const calc = getCalculator(slug);
  if (!calc) {
    notFound();
  }

  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `https://calczen.in/calculator/${calc.slug}#webpage`,
        name: calc.metaTitle || `${calc.name} | CalcZen`,
        description: calc.metaDescription || calc.description,
        url: `https://calczen.in/calculator/${calc.slug}`,
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": `https://calczen.in/calculator/${calc.slug}#breadcrumb`,
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
            name: calc.category.charAt(0).toUpperCase() + calc.category.slice(1),
            item: `https://calczen.in/category/${calc.category.toLowerCase()}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: calc.name,
            item: `https://calczen.in/calculator/${calc.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <CalculatorClient
        calc={{
          name: calc.name,
          slug: calc.slug,
          description: calc.description,
        }}
      />
    </>
  );
}
