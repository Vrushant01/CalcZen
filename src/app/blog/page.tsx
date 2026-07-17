import type { Metadata } from "next";
import BlogClient from "./BlogClient";
import { fetchPublishedBlogs } from "@/lib/blog-api";
import { calculators } from "@/data/calculators";

export const revalidate = 60; // ISR revalidate every 60 seconds

export const metadata: Metadata = {
  title: "CalcZen Blog — Financial Insights, Health Tips & Math Guides",
  description:
    "Explore the CalcZen Blog for expert guides, financial tips, health calculator breakdowns, tax advice, and practical guides on online tool calculations.",
  openGraph: {
    title: "CalcZen Blog — Expert Insights",
    description:
      "Explore the CalcZen Blog for expert guides, financial tips, health calculator breakdowns, tax advice, and practical guides on online tool calculations.",
    url: "https://calczen.in/blog",
    type: "website",
  },
  twitter: {
    description:
      "Explore the CalcZen Blog for expert guides, financial tips, health calculator breakdowns, tax advice, and practical guides on online tool calculations.",
  },
  alternates: {
    canonical: "https://calczen.in/blog",
  },
};

export default async function BlogIndexPage() {
  let initialBlogs: any[] = [];
  let initialTotal = 0;

  try {
    const res = await fetchPublishedBlogs({ page: 1, limit: 9 });
    if (res.ok && res.data) {
      initialBlogs = res.data.blogs;
      initialTotal = res.data.pagination.total;
    }
  } catch (err) {
    console.warn("Failed to fetch initial blogs during prerender:", err);
  }

  const trendingCalculatorSlugs = calculators.filter((c) => c.trending).slice(0, 4).map((c) => c.slug);

  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "CalcZen Blog — Financial Insights, Health Tips & Math Guides",
    description:
      "Explore the CalcZen Blog for expert guides, financial tips, health calculator breakdowns, tax advice, and practical guides on online tool calculations.",
    url: "https://calczen.in/blog",
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
        name: "Blog",
        item: "https://calczen.in/blog",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <BlogClient
        initialBlogs={initialBlogs}
        initialTotal={initialTotal}
        trendingCalculatorSlugs={trendingCalculatorSlugs}
      />
    </>
  );
}
