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
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Max 3.5 degrees rotation
    const degX = -(y / (rect.height / 2)) * 3.5;
    const degY = (x / (rect.width / 2)) * 3.5;

    setRotateX(degX);
    setRotateY(degY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <PageShell>
      {/* Redesigned Premium SaaS Hero Section */}
      <section className="hero-section relative flex flex-col justify-center items-center overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-gradient-mesh opacity-90" />

        {/* Ambient floating glow effects - breathing life */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              x: [0, 40, -20, 0],
              y: [0, -30, 20, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-[10%] left-[5%] w-[350px] h-[350px] rounded-full bg-[#0ea5e9]/10 blur-[110px] dark:bg-[#0ea5e9]/8 dark:blur-[130px]"
          />
          <motion.div
            animate={{
              x: [0, -30, 40, 0],
              y: [0, 20, -30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-[#8b5cf6]/10 blur-[120px] dark:bg-[#8b5cf6]/8 dark:blur-[140px]"
          />
        </div>

        <div className="relative page-container hero-container w-full z-10 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 lg:gap-8 items-center">
            {/* LEFT SIDE: Content Area */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
              {/* Headline */}
              <h1 className="hero-headline text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
                Free Online Calculators
                <br className="hidden sm:inline" />
                <span className="text-gradient bg-gradient-to-r from-accent via-[#38bdf8] to-[#a78bfa] bg-clip-text text-transparent">
                  for Finance, Health, and Math
                </span>
              </h1>

              {/* Description */}
              <p className="hero-description mt-5 text-base sm:text-lg text-white/80 dark:text-slate-300 leading-relaxed font-normal max-w-xl">
                Fast, accurate online calculators for finance, health, and daily math. Simple tools
                designed for speed and clarity.
              </p>

              {/* CTA Section */}
              <div className="hero-button-container mt-8 items-center">
                <Link to="/calculators" className="hero-button-link">
                  <Button
                    size="lg"
                    className="hero-button h-11 px-6 bg-accent text-accent-foreground hover:bg-accent/90 shadow-[0_4px_16px_rgba(14,165,233,0.25)] font-semibold text-sm rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Explore Calculators
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    document
                      .getElementById("category-section")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="hero-button h-11 px-6 border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-sm shadow-soft"
                >
                  Browse Categories
                </Button>
              </div>
            </div>

            {/* RIGHT SIDE: Floating Product Showcase */}
            <div className="hero-mockup-section lg:col-span-5 w-full flex justify-center lg:justify-end">
              <div
                className="hero-mockup relative w-full aspect-square flex items-center justify-center select-none"
                style={{ perspective: 1000 }}
              >
                {/* Slow breathing ambient glow behind the showcase */}
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.6, 0.8, 0.6],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 bg-gradient-to-tr from-[#0ea5e9]/25 via-transparent to-[#8b5cf6]/20 blur-[60px] rounded-full pointer-events-none"
                />

                {/* Main Dashboard Card Mockup */}
                <motion.div
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                  }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    y: {
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    default: {
                      type: "spring",
                      stiffness: 150,
                      damping: 25,
                    },
                  }}
                  className="relative z-10 w-full bg-gradient-to-br from-slate-900/50 to-slate-950/80 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-4 sm:p-5 md:p-6 shadow-[0_4px_12px_rgba(0,0,0,0.4),0_16px_40px_rgba(0,0,0,0.3),0_0_50px_rgba(14,165,233,0.12)] cursor-default"
                >
                  {/* Mock Header */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
                      <span className="text-[10px] font-bold text-white/80 tracking-widest uppercase">
                        Loan EMI Calculator
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    </div>
                  </div>

                  {/* Mock Inputs */}
                  <div className="space-y-4 mb-5">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] font-medium tracking-wide">
                        <span className="text-white/60">Loan Amount</span>
                        <span className="font-bold text-white">$250,000</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "70%" }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-accent to-[#38bdf8] rounded-full shadow-[0_0_8px_rgba(14,165,233,0.6)]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] font-medium tracking-wide">
                        <span className="text-white/60">Interest Rate</span>
                        <span className="font-bold text-white">5.8%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "45%" }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                          className="h-full bg-gradient-to-r from-[#38bdf8] to-[#a78bfa] rounded-full shadow-[0_0_8px_rgba(56,189,248,0.6)]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Monthly Payment Focal Box */}
                  <div className="flex items-center justify-between gap-3 sm:gap-4 bg-slate-900/50 backdrop-blur-md border border-white/[0.08] rounded-xl p-3.5 sm:p-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_8px_24px_rgba(0,0,0,0.3)]">
                    <div className="flex-1">
                      <div className="text-[10px] text-white/50 tracking-wider uppercase font-semibold">
                        Monthly Payment
                      </div>
                      <div className="text-2xl font-black text-white tracking-tight mt-0.5">
                        $1,466
                      </div>
                      <div className="text-[10px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Est. Interest: $122,860</span>
                      </div>
                    </div>
                    <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="28"
                          cy="28"
                          r="22"
                          stroke="currentColor"
                          className="text-white/5"
                          strokeWidth="4.5"
                          fill="transparent"
                        />
                        <motion.circle
                          cx="28"
                          cy="28"
                          r="22"
                          stroke="currentColor"
                          className="text-accent"
                          strokeWidth="4.5"
                          fill="transparent"
                          strokeDasharray="138"
                          initial={{ strokeDashoffset: 138 }}
                          animate={{ strokeDashoffset: 41 }}
                          transition={{ duration: 1.8, ease: "easeOut", delay: 0.4 }}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-[10px] font-black text-white">70%</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Bouncing chevron scroll indicator (Unified) */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="hero-scroll-indicator select-none pointer-events-none"
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm hover:border-accent hover:bg-white/10 transition-all duration-300 shadow-md cursor-pointer group pointer-events-auto"
            onClick={() => {
              document
                .getElementById("category-section")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <ChevronDown className="h-5 w-5 text-white/60 group-hover:text-accent transition-colors duration-300" />
          </div>
        </motion.div>

        {/* Subtle curved transition at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden line-height-0 pointer-events-none">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-[calc(100%+1.3px)] h-[52px] sm:h-[72px] text-[var(--background)] fill-current transition-colors duration-500"
          >
            <path
              d="M0,0 C350,105 550,105 600,105 C650,105 850,105 1200,0 L1200,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* Category Section - Revealed on Scroll */}
      <section
        id="category-section"
        className="page-container mt-0 pt-8 sm:pt-28 md:pt-32 relative z-10 scroll-mt-20"
      >
        <div className="text-center mb-6 sm:mb-14 max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Calculator Categories
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground mt-1.5">
            Choose the area you want to calculate in.
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
                to="/category/$slug"
                params={{ slug: c.slug }}
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

                {/* Subtle arrow appearing only on hover */}
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
