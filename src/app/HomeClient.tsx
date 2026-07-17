"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown, Mail } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalculatorCard } from "@/components/CalculatorCard";
import { BlogSection } from "@/components/BlogSection";
import { FaqAccordion } from "@/components/FaqAccordion";
import { categories } from "@/data/calculators";
import { subscribeEmail } from "@/lib/subscribe-api";
import { Link } from "@/components/ui/Link";

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

interface HomeClientProps {
  popularSlugs: string[];
}

export default function HomeClient({ popularSlugs }: HomeClientProps) {
  return (
    <PageShell>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-mesh opacity-85" />
        <div className="relative page-container flex flex-col items-center justify-center text-center py-20 sm:py-28 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="max-w-3xl min-w-0"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/45 text-xs text-indigo-400 font-semibold mb-4 shadow-soft">
              <Sparkles size={12} className="animate-pulse" />
              Smart & Accurate Calculators
            </span>
            <h1 className="text-[1.85rem] leading-[1.05] sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white text-balance">
              Simplify Your Decisions with{" "}
              <span className="text-gradient bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                Free Online Calculators
              </span>
            </h1>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-white/80 leading-relaxed max-w-xl mx-auto">
              Get instant calculations for personal finance, fitness tracking, math problems, and everyday helpers. Fast, accurate, and completely transparent.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/calculators">
                <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white min-h-11 shadow-glow font-semibold rounded-xl">
                  Explore Calculators
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => {
                  document.getElementById("faq-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1 text-sm font-semibold text-white/95 hover:text-white transition-colors py-2.5 touch-target"
              >
                Learn More
                <ChevronDown size={14} className="mt-0.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="page-container mt-4 sm:mt-12">
        <div className="mb-6 sm:mb-8 text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Browse by Category
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground mt-1">
            Choose a category to find specialized calculator sheets.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8 min-w-0">
          {categories.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.45, delay: i * 0.1, ease: "easeOut" }}
              className="min-w-0 h-full flex flex-col"
            >
              <Link
                to={`/category/${c.slug}`}
                className={`category-card group relative flex flex-1 items-center justify-between rounded-xl sm:rounded-2xl border p-5 sm:p-6 shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02] active:scale-[0.98] active:translate-y-0 min-h-[5.5rem] sm:min-h-[6.5rem] h-full ${c.color}`}
              >
                <div className="category-card-inner flex items-center gap-4 sm:gap-5 min-w-0 pr-6">
                  <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-slate-500/5 dark:bg-white/5 border border-slate-500/10 dark:border-white/5 transition-transform duration-300 group-hover:scale-105">
                    <c.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${c.iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm sm:text-lg lg:text-xl tracking-tight leading-tight text-foreground transition-colors">
                      {c.name}
                    </div>
                    <div className="category-card-description text-[11px] sm:text-xs text-muted-foreground mt-1 leading-normal font-normal">
                      {c.description}
                    </div>
                  </div>
                </div>

                <div className="category-card-arrow absolute right-4 sm:right-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out text-accent shrink-0">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Calculators Section */}
      <section className="page-container mt-8 sm:mt-28 md:mt-32">
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
          {popularSlugs.map((slug, i) => (
            <CalculatorCard key={slug} slug={slug} index={i} />
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
