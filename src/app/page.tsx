import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { calculators } from "@/data/calculators";

export const metadata: Metadata = {
  title: "CalcZen — Free Online Calculators for Finance, Health, Math & More",
  description:
    "Access free online calculators for personal finance, health tracking, mathematical equations, and everyday tasks. Get fast, accurate results instantly.",
  openGraph: {
    title: "CalcZen — Free Online Calculators",
    description:
      "Access free online calculators for personal finance, health tracking, mathematical equations, and everyday tasks. Get fast, accurate results instantly.",
    url: "https://calczen.in/",
    type: "website",
  },
  twitter: {
    description:
      "Access free online calculators for personal finance, health tracking, mathematical equations, and everyday tasks. Get fast, accurate results instantly.",
  },
  alternates: {
    canonical: "https://calczen.in/",
  },
};

const homeFaqs = [
  {
    q: "What calculators are available on CalcZen?",
    a: "CalcZen offers a comprehensive suite of free online tools categorized under finance, health, math, and everyday helpers. You can calculate mortgages, compound interest, personal loan EMIs, daily calorie needs, percentage changes, age countdowns, restaurant tips, and perform advanced operations using our scientific calculator. We continually add new calculators to expand our offerings.",
  },
  {
    q: "Are these calculators free to use?",
    a: "Yes, all calculators on CalcZen are completely free and require no account registration, subscriptions, or hidden fees. You can access tools like our mortgage calculator, BMI calculator, and standard calculator instantly on any device without restrictions. We keep the platform accessible to everyone by relying on unobtrusive, privacy-friendly advertising.",
  },
  {
    q: "How accurate are the calculator results?",
    a: "Our calculators use industry-standard formulas, such as the fixed-rate amortization equation for mortgages or the Harris-Benedict formula for BMR. While these calculations provide highly accurate estimates for planning, actual financial or health metrics may vary based on individual circumstances, local taxes, lender terms, or medical factors. Always consult a professional for critical decisions.",
  },
  {
    q: "Can I use these calculators on mobile devices?",
    a: "Yes, the entire CalcZen platform is optimized for mobile responsiveness. Whether you are using a smartphone, tablet, or desktop computer, the layouts adapt automatically to provide a premium, touch-friendly user experience. All inputs, buttons, and charts are designed to be fully functional on smaller touchscreens, allowing you to calculate on the go.",
  },
  {
    q: "Do these calculators store my personal data?",
    a: "No, we value your privacy. All inputs entered into our tools are processed locally in your browser during your session and are never stored on our servers, shared with third parties, or used for tracking. You can use our financial and health calculators with complete peace of mind, knowing your data remains entirely private.",
  },
  {
    q: "Which calculator should I use for my needs?",
    a: "If you are looking to buy a home or evaluate debt, start with our Mortgage Calculator or Loan EMI Calculator. For fitness and weight management goals, explore our BMI Calculator and Calorie Calculator to track daily targets. If you need general calculations, our Percentage Calculator and Scientific Calculator are excellent choices for quick math.",
  },
];

export default function HomePage() {
  const popularSlugs = calculators.filter((c) => c.popular).slice(0, 8).map((c) => c.slug);

  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CalcZen",
    url: "https://calczen.in",
    logo: "https://calczen.in/logo.png",
    sameAs: [],
  };

  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CalcZen",
    url: "https://calczen.in",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://calczen.in/calculators?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Free Online Calculators",
    description: "Free online calculators for finance, health, math and everyday calculations.",
  };

  const jsonLdFaqs = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homeFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaqs) }}
      />
      <HomeClient popularSlugs={popularSlugs} />
    </>
  );
}
