import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalculatorCard } from "@/components/CalculatorCard";
import { BlogSection } from "@/components/BlogSection";
import { FaqAccordion } from "@/components/FaqAccordion";
import { UniversalSearch } from "@/components/UniversalSearch";
import { HeroSection } from "@/components/HeroSection";
import { categories, calculators } from "@/data/calculators";
import { subscribeEmail } from "@/lib/subscribe-api";

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

function NewsletterSubscribe() {
  const emailRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const email = emailRef.current?.value?.trim();
    if (!email) return;

    setLoading(true);
    const result = await subscribeEmail(email);
    setLoading(false);

    if (result.ok) {
      toast.success(result.message);
      if (emailRef.current) emailRef.current.value = "";
    } else {
      toast.error(result.message);
    }
  }

  return (
    <>
      <Toaster />
      <form
        onSubmit={handleSubmit}
        className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto w-full"
      >
        <Input
          ref={emailRef}
          type="email"
          required
          disabled={loading}
          placeholder="you@example.com"
          className="bg-white/95 border-0 h-11 w-full px-4 min-w-0 text-slate-900 placeholder:text-slate-500"
        />
        <Button
          type="submit"
          disabled={loading}
          className="h-11 shrink-0 bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto"
        >
          {loading ? "Subscribing…" : "Subscribe"}
        </Button>
      </form>
    </>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CalcZen — Free Online Calculators for Finance, Health, Math & More" },
      {
        name: "description",
        content:
          "Use free online calculators for finance, health, math, and everyday calculations. Fast, accurate tools with instant results.",
      },
      { property: "og:title", content: "CalcZen — Free Online Calculators" },
      {
        property: "og:description",
        content:
          "Use free online calculators for finance, health, math, and everyday calculations. Fast, accurate tools with instant results.",
      },
      {
        name: "twitter:description",
        content:
          "Use free online calculators for finance, health, math, and everyday calculations. Fast, accurate tools with instant results.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://calczen.com/" },
    ],
    links: [{ rel: "canonical", href: "https://calczen.com/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "CalcZen",
          url: "https://calczen.com",
          logo: "https://calczen.com/logo.png",
          sameAs: [],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "CalcZen",
          url: "https://calczen.com",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://calczen.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Free Online Calculators",
          description:
            "Free online calculators for finance, health, math and everyday calculations.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": "https://calczen.com/#faq",
          mainEntity: [
            {
              "@type": "Question",
              name: "What calculators are available on CalcZen?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "CalcZen offers a comprehensive suite of free online tools categorized under finance, health, math, and everyday helpers. You can calculate mortgages, compound interest, personal loan EMIs, daily calorie needs, percentage changes, age countdowns, restaurant tips, and perform advanced operations using our scientific calculator. We continually add new calculators to expand our offerings.",
              },
            },
            {
              "@type": "Question",
              name: "Are these calculators free to use?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, all calculators on CalcZen are completely free and require no account registration, subscriptions, or hidden fees. You can access tools like our mortgage calculator, BMI calculator, and standard calculator instantly on any device without restrictions. We keep the platform accessible to everyone by relying on unobtrusive, privacy-friendly advertising.",
              },
            },
            {
              "@type": "Question",
              name: "How accurate are the calculator results?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Our calculators use industry-standard formulas, such as the fixed-rate amortization equation for mortgages or the Harris-Benedict formula for BMR. While these calculations provide highly accurate estimates for planning, actual financial or health metrics may vary based on individual circumstances, local taxes, lender terms, or medical factors. Always consult a professional for critical decisions.",
              },
            },
            {
              "@type": "Question",
              name: "Can I use these calculators on mobile devices?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, the entire CalcZen platform is optimized for mobile responsiveness. Whether you are using a smartphone, tablet, or desktop computer, the layouts adapt automatically to provide a premium, touch-friendly user experience. All inputs, buttons, and charts are designed to be fully functional on smaller touchscreens, allowing you to calculate on the go.",
              },
            },
            {
              "@type": "Question",
              name: "Do these calculators store my personal data?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No, we value your privacy. All inputs entered into our tools are processed locally in your browser during your session and are never stored on our servers, shared with third parties, or used for tracking. You can use our financial and health calculators with complete peace of mind, knowing your data remains entirely private.",
              },
            },
            {
              "@type": "Question",
              name: "Which calculator should I use for my needs?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "If you are looking to buy a home or evaluate debt, start with our Mortgage Calculator or Loan EMI Calculator. For fitness and weight management goals, explore our BMI Calculator and Calorie Calculator to track daily targets. If you need general calculations, our Percentage Calculator and Scientific Calculator are excellent choices for quick math.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  const popular = calculators.filter((c) => c.popular).slice(0, 8);

  return (
    <PageShell hideHeader>
      <HeroSection />

      {/* Popular Calculators Section */}
      <section className="page-container mt-6 sm:mt-14 md:mt-16">
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between gap-4 mb-1.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <Sparkles className="h-5 sm:h-5.5 w-5 sm:w-5.5 text-accent shrink-0 animate-pulse" />
              <h2 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight truncate">
                Popular Calculators
              </h2>
            </div>
            <Link
              to="/calculators"
              className="text-xs sm:text-sm font-medium text-accent hover:underline inline-flex items-center gap-1 shrink-0"
            >
              See all <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          </div>
          <p className="text-xs sm:text-base text-muted-foreground">
            The ones our visitors use the most.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-0">
          {popular.map((c, i) => (
            <CalculatorCard key={c.slug} calc={c} index={i} />
          ))}
        </div>
      </section>

      <BlogSection />

      {/* Why Use Online Calculators Section */}
      <section className="page-container mt-8 sm:mt-32 md:mt-36 max-w-4xl min-w-0 text-left">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-4 sm:mb-6">
          Why Use Online Calculators?
        </h2>
        <div className="space-y-5 text-sm sm:text-base text-muted-foreground leading-[1.8] font-normal">
          <p>
            In today's fast-paced digital world, making informed decisions often requires dealing
            with complex numbers. Whether you are navigating personal finance, tracking fitness
            goals, solving mathematical equations, or handling everyday lifestyle tasks, online
            calculators provide a fast, accurate, and reliable solution. They remove human error,
            translate complex algebraic formulas into instant results, and offer visual clarity so
            you can take control of your planning.
          </p>

          <h3 className="text-base sm:text-lg font-semibold text-foreground mt-6 mb-2">
            1. Smart Financial Planning and Borrowing
          </h3>
          <p>
            Managing money is one of the most critical aspects of daily life. Financial calculators,
            such as mortgage planners and loan EMI tools, allow you to visualize long-term debt and
            interest payments before committing to a bank. By testing different down payments, loan
            terms, and annual interest rates, you can evaluate borrowing costs and safeguard your
            household budget. Compound interest and 401(k) calculators show the power of long-term
            savings growth, helping you map out a secure path toward retirement.
          </p>

          <h3 className="text-base sm:text-lg font-semibold text-foreground mt-6 mb-2">
            2. Scientific Tracking of Health and Wellness
          </h3>
          <p>
            Health decisions should be backed by objective data. Wellness calculators, including
            Body Mass Index (BMI), Basal Metabolic Rate (BMR), and daily calorie planners, offer
            personalized physiological estimates based on height, weight, age, and activity level.
            These metrics serve as a starting point for body weight management, fat loss, or muscle
            gain. Similarly, hydration calculators determine daily water intake targets based on
            climate and exercise, ensuring you maintain physical and cognitive peak performance.
          </p>

          <h3 className="text-base sm:text-lg font-semibold text-foreground mt-6 mb-2">
            3. Instant Mathematical and Percentage Solutions
          </h3>
          <p>
            From school homework to business ratio analysis, mathematical calculators simplify
            everyday computations. Percentage calculators help you find markups, discounts, and
            percentage shifts instantly—essential for shopping smart or assessing investment
            returns. For complex technical problems, online scientific calculators provide advanced
            trigonometric, logarithmic, and exponential functions, making engineering calculations
            accessible from any web browser without standalone hardware.
          </p>

          <h3 className="text-base sm:text-lg font-semibold text-foreground mt-6 mb-2">
            4. Streamlining Everyday Lifestyle Decisions
          </h3>
          <p>
            A large part of our day involves quick math that we often guess. Tip calculators ensure
            dining bills are split fairly among friends with custom gratuity percentages factored
            in. Age calculators solve exact duration intervals for milestones, while date planners
            simplify project tracking. By replacing estimates with precise math, CalcZen helps you
            save time, make smarter choices, and understand the core formulas behind every result.
          </p>
        </div>
      </section>

      {/* Homepage FAQ Section */}
      <section
        id="faq-section"
        className="page-container mt-8 sm:mt-28 md:mt-32 max-w-4xl min-w-0 text-left"
      >
        <div className="surface-card rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 min-w-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-4 sm:mb-6">
            Frequently Asked Questions
          </h2>
          <FaqAccordion faqs={homeFaqs} />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="page-container mt-8 sm:mt-28 md:mt-32 max-w-4xl min-w-0">
        <div
          className="relative p-6 sm:p-8 md:p-10 text-center text-white overflow-hidden"
          style={{
            borderRadius: "28px",
            boxShadow: "0 20px 60px rgba(15, 23, 42, 0.18)",
            border: "none",
            background: `
              radial-gradient(circle at center, rgba(56, 189, 248, 0.08) 0%, transparent 55%),
              linear-gradient(135deg, #0f172a 0%, #12335c 35%, #155e95 100%)
            `,
          }}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-balance">
            Get new calculators in your inbox
          </h2>
          <p className="mt-2 text-sm sm:text-base text-white/80">
            One short email a month. New tools, finance tips, no spam.
          </p>
          <NewsletterSubscribe />
        </div>
      </section>
    </PageShell>
  );
}
