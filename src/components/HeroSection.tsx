import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, Menu, X, ArrowUpRight, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HeroCalculatorVisual } from "@/components/HeroCalculatorVisual";
import { calculators } from "@/data/calculators";
import { useTheme } from "@/hooks/use-theme";

// Comprehensive synonym mapping for intuitive calculator discovery
const SYNONYMS: Record<string, string[]> = {
  // Finance
  loan: [
    "loan-emi-calculator",
    "loan-eligibility-calculator",
    "mortgage-calculator",
    "credit-card-emi-calculator",
  ],
  emi: [
    "loan-emi-calculator",
    "credit-card-emi-calculator",
    "loan-eligibility-calculator",
    "mortgage-calculator",
  ],
  mortgage: ["mortgage-calculator", "loan-emi-calculator"],
  home: ["mortgage-calculator", "loan-emi-calculator"],
  car: ["loan-emi-calculator", "loan-eligibility-calculator"],
  bank: ["loan-emi-calculator", "fd-calculator", "compound-interest-calculator", "sip-calculator"],
  interest: [
    "compound-interest-calculator",
    "loan-emi-calculator",
    "fd-calculator",
    "sip-calculator",
  ],
  compound: ["compound-interest-calculator", "sip-calculator"],
  sip: ["sip-calculator", "compound-interest-calculator", "fd-calculator"],
  fd: ["fd-calculator", "compound-interest-calculator"],
  invest: [
    "sip-calculator",
    "compound-interest-calculator",
    "fd-calculator",
    "retirement-calculator",
  ],
  investment: [
    "sip-calculator",
    "compound-interest-calculator",
    "fd-calculator",
    "retirement-calculator",
  ],
  savings: [
    "compound-interest-calculator",
    "sip-calculator",
    "retirement-calculator",
    "401k-calculator",
  ],
  retire: ["retirement-calculator", "401k-calculator"],
  retirement: ["retirement-calculator", "401k-calculator"],
  "401k": ["401k-calculator", "retirement-calculator"],
  pension: ["retirement-calculator", "401k-calculator"],
  credit: ["credit-card-emi-calculator", "loan-emi-calculator"],
  card: ["credit-card-emi-calculator"],
  debt: ["loan-emi-calculator", "credit-card-emi-calculator"],
  tax: ["gst-invoice-calculator", "gst-calculator", "inflation-calculator"],
  gst: ["gst-invoice-calculator", "gst-calculator"],
  invoice: ["gst-invoice-calculator"],
  "gst invoice": ["gst-invoice-calculator"],
  "tax invoice": ["gst-invoice-calculator"],
  "gst bill": ["gst-invoice-calculator"],
  cgst: ["gst-invoice-calculator", "gst-calculator"],
  sgst: ["gst-invoice-calculator", "gst-calculator"],
  igst: ["gst-invoice-calculator", "gst-calculator"],
  inflation: ["inflation-calculator"],

  // Salary & Employment
  salary: ["ctc-to-in-hand-salary-calculator", "job-offer-comparison-calculator"],
  ctc: ["ctc-to-in-hand-salary-calculator", "job-offer-comparison-calculator"],
  "in hand": ["ctc-to-in-hand-salary-calculator", "job-offer-comparison-calculator"],
  inhand: ["ctc-to-in-hand-salary-calculator", "job-offer-comparison-calculator"],
  pay: ["ctc-to-in-hand-salary-calculator", "job-offer-comparison-calculator"],
  job: ["job-offer-comparison-calculator", "ctc-to-in-hand-salary-calculator"],
  offer: ["job-offer-comparison-calculator", "ctc-to-in-hand-salary-calculator"],
  bonus: ["job-offer-comparison-calculator", "ctc-to-in-hand-salary-calculator"],
  esop: ["job-offer-comparison-calculator"],
  compensation: ["job-offer-comparison-calculator", "ctc-to-in-hand-salary-calculator"],

  // Home Construction
  rcc: ["rcc-price-calculator"],
  concrete: ["rcc-price-calculator"],
  cement: ["rcc-price-calculator"],
  sand: ["rcc-price-calculator"],
  aggregate: ["rcc-price-calculator"],
  steel: ["rcc-price-calculator"],
  rebar: ["rcc-price-calculator"],
  slab: ["rcc-price-calculator"],
  beam: ["rcc-price-calculator"],
  column: ["rcc-price-calculator"],
  footing: ["rcc-price-calculator"],
  shuttering: ["rcc-price-calculator"],
  formwork: ["rcc-price-calculator"],
  construction: ["rcc-price-calculator"],
  "home construction": ["rcc-price-calculator"],
  rmc: ["rcc-price-calculator"],

  // Jewellery
  gold: ["gold-making-charges-calculator", "gold-jewellery-bill-calculator"],
  jewellery: ["gold-making-charges-calculator", "gold-jewellery-bill-calculator"],
  jewelry: ["gold-making-charges-calculator", "gold-jewellery-bill-calculator"],
  making: ["gold-making-charges-calculator", "gold-jewellery-bill-calculator"],
  "making charge": ["gold-making-charges-calculator"],
  "making charges": ["gold-making-charges-calculator"],
  wastage: ["gold-making-charges-calculator", "gold-jewellery-bill-calculator"],
  tola: ["gold-making-charges-calculator", "gold-jewellery-bill-calculator"],
  pavan: ["gold-making-charges-calculator", "gold-jewellery-bill-calculator"],
  hallmark: ["gold-jewellery-bill-calculator", "gold-making-charges-calculator"],
  "22k": ["gold-making-charges-calculator", "gold-jewellery-bill-calculator"],
  "24k": ["gold-making-charges-calculator", "gold-jewellery-bill-calculator"],

  // Health
  bmi: ["bmi-calculator", "body-fat-calculator", "calorie-calculator"],
  weight: ["bmi-calculator", "body-fat-calculator", "calorie-calculator"],
  fat: ["body-fat-calculator", "bmi-calculator", "calorie-calculator"],
  calorie: ["calorie-calculator", "bmr-calculator", "protein-calculator"],
  calories: ["calorie-calculator", "bmr-calculator", "protein-calculator"],
  diet: ["calorie-calculator", "protein-calculator", "water-intake-calculator"],
  food: ["calorie-calculator", "protein-calculator"],
  protein: ["protein-calculator", "calorie-calculator"],
  gym: ["protein-calculator", "calorie-calculator", "bmi-calculator", "body-fat-calculator"],
  bmr: ["bmr-calculator", "calorie-calculator"],
  water: ["water-intake-calculator"],
  drink: ["water-intake-calculator"],
  hydration: ["water-intake-calculator"],
  sleep: ["sleep-calculator"],
  bed: ["sleep-calculator"],
  wake: ["sleep-calculator"],
  pregnancy: ["pregnancy-due-date-calculator"],
  pregnant: ["pregnancy-due-date-calculator"],
  baby: ["pregnancy-due-date-calculator"],
  due: ["pregnancy-due-date-calculator"],

  // Math
  percent: ["percentage-calculator", "gst-calculator"],
  percentage: ["percentage-calculator", "gst-calculator"],
  discount: ["percentage-calculator", "gst-calculator"],
  off: ["percentage-calculator"],
  math: ["scientific-calculator", "standard-calculator", "percentage-calculator"],
  maths: ["scientific-calculator", "standard-calculator", "percentage-calculator"],
  scientific: ["scientific-calculator", "standard-calculator"],
  algebra: ["scientific-calculator", "standard-calculator"],
  calc: ["standard-calculator", "scientific-calculator", "percentage-calculator"],

  // Everyday
  age: ["age-calculator", "couple-age-difference-calculator", "pregnancy-due-date-calculator"],
  birthday: ["age-calculator", "couple-age-difference-calculator"],
  dob: ["age-calculator", "couple-age-difference-calculator"],
  birth: ["age-calculator", "pregnancy-due-date-calculator"],
  date: ["age-calculator", "pregnancy-due-date-calculator", "couple-age-difference-calculator"],
  cgpa: ["cgpa-calculator"],
  gpa: ["cgpa-calculator"],
  grade: ["cgpa-calculator"],
  grades: ["cgpa-calculator"],
  attendance: ["attendance-calculator"],
  bunk: ["attendance-calculator"],
  college: ["attendance-calculator", "cgpa-calculator"],
  tip: ["tip-calculator"],
  bill: ["tip-calculator"],
  restaurant: ["tip-calculator"],
  split: ["tip-calculator"],
  love: ["love-calculator", "flames-calculator", "couple-age-difference-calculator"],
  flames: ["flames-calculator", "love-calculator"],
  crush: ["love-calculator", "flames-calculator"],
  couple: ["couple-age-difference-calculator", "love-calculator"],

  // Business & Commerce
  profit: ["product-profit-calculator", "gst-calculator", "percentage-calculator"],
  margin: ["product-profit-calculator", "percentage-calculator"],
  markup: ["product-profit-calculator", "percentage-calculator"],
  product: ["product-profit-calculator"],
  selling: ["product-profit-calculator"],
  "selling price": ["product-profit-calculator"],
  business: ["gst-invoice-calculator", "product-profit-calculator", "gst-calculator"],
  retail: ["product-profit-calculator"],
  ecommerce: ["product-profit-calculator"],
  amazon: ["product-profit-calculator"],
  flipkart: ["product-profit-calculator"],
  meesho: ["product-profit-calculator"],
  shopify: ["product-profit-calculator"],
};

export function HeroSection() {
  const { isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(-1);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Close search suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const desktopContains = searchContainerRef.current?.contains(event.target as Node);
      const mobileContains = mobileSearchContainerRef.current?.contains(event.target as Node);
      if (!desktopContains && !mobileContains) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global keyboard shortcut '/' to focus search input
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        const isDesktop = window.innerWidth >= 1024;
        const targetInput = isDesktop
          ? searchInputRef.current
          : (mobileSearchInputRef.current || searchInputRef.current);
        targetInput?.focus();
        setIsSearchFocused(true);
      } else if (e.key === "Escape") {
        setIsSearchFocused(false);
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Comprehensive calculator search scoring engine
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];

    const cleanQuery = q.replace(/[^a-zA-Z0-9\s]/g, "");
    const words = cleanQuery.split(/\s+/).filter((w) => w.length >= 2);

    // Look up any matching synonym slugs
    const synonymSlugs = new Set<string>();
    words.forEach((word) => {
      if (SYNONYMS[word]) {
        SYNONYMS[word].forEach((slug) => synonymSlugs.add(slug));
      }
    });
    // Check clean query directly
    if (SYNONYMS[cleanQuery]) {
      SYNONYMS[cleanQuery].forEach((slug) => synonymSlugs.add(slug));
    }

    const scored = calculators.map((c) => {
      let score = 0;
      const cName = c.name.toLowerCase();
      const cSlug = c.slug.toLowerCase();
      const cDesc = c.description ? c.description.toLowerCase() : "";
      const cCat = c.category ? c.category.toLowerCase() : "";
      const cKeywords =
        c.keywords && Array.isArray(c.keywords) ? c.keywords.join(" ").toLowerCase() : "";
      const cUseCases =
        c.useCases && Array.isArray(c.useCases) ? c.useCases.join(" ").toLowerCase() : "";

      const targetText = `${cName} ${cSlug} ${cDesc} ${cKeywords} ${cUseCases}`;

      // 1. Exact match on full name or slug
      if (cName === q || cSlug === q) score += 200;
      else if (cName.startsWith(q)) score += 100;
      else if (cName.includes(q)) score += 70;
      else if (cSlug.includes(q)) score += 60;

      // 2. Synonym match bonus
      if (synonymSlugs.has(c.slug)) score += 80;

      // 3. Category match
      if (cCat === q || cCat.includes(q)) score += 35;

      // 4. Word matches
      words.forEach((w) => {
        if (cName.includes(w)) score += 35;
        if (targetText.includes(w)) score += 15;
      });

      return { calc: c, score };
    });

    return scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((item) => item.calc);
  }, [searchQuery]);

  // Direct navigation to calculator page
  const navigateToCalculator = (slug: string) => {
    navigate({
      to: "/calculator/$slug",
      params: { slug },
    });
    setIsSearchFocused(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSearchIndex((prev) => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSearchIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedSearchIndex >= 0 && selectedSearchIndex < searchResults.length) {
        navigateToCalculator(searchResults[selectedSearchIndex].slug);
      } else if (searchResults.length > 0) {
        navigateToCalculator(searchResults[0].slug);
      } else {
        navigate({ to: "/calculators" });
      }
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      const targetSlug =
        selectedSearchIndex >= 0 && selectedSearchIndex < searchResults.length
          ? searchResults[selectedSearchIndex].slug
          : searchResults[0].slug;
      navigateToCalculator(targetSlug);
    } else {
      navigate({ to: "/calculators" });
    }
  };

  const navLinks = [
    { to: "/calculators", label: "Calculators" },
    { to: "/category/finance", label: "Finance" },
    { to: "/category/health", label: "Health" },
    { to: "/category/math", label: "Math" },
    { to: "/blog", label: "Blog" },
    { to: "/about", label: "About" },
  ];

  const popularChips = [
    { name: "EMI Calculator", slug: "loan-emi-calculator" },
    { name: "BMI Calculator", slug: "bmi-calculator" },
    { name: "Age Calculator", slug: "age-calculator" },
    { name: "Percentage Calculator", slug: "percentage-calculator" },
  ];

  return (
    <section className="cz-hero w-full min-h-0 lg:min-h-[100svh] relative flex flex-col justify-between overflow-x-hidden border-b transition-colors duration-200">
      {/* ─── Full-Bleed Atmospheric Background Gradients ─── */}
      <div
        className={`absolute right-0 top-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none -z-10 transition-all duration-300 ${
          isDark
            ? "bg-[radial-gradient(ellipse_at_center,rgba(79,131,255,0.18)_0%,rgba(34,184,216,0.1)_40%,transparent_70%)]"
            : "bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.08)_0%,rgba(34,184,216,0.05)_40%,transparent_70%)]"
        }`}
      />
      <div
        className={`absolute left-1/4 top-1/3 w-[500px] h-[500px] pointer-events-none -z-10 transition-all duration-300 ${
          isDark
            ? "bg-[radial-gradient(ellipse_at_center,rgba(136,120,232,0.08)_0%,transparent_70%)]"
            : "bg-[radial-gradient(ellipse_at_center,rgba(136,120,232,0.04)_0%,transparent_70%)]"
        }`}
      />
      <div
        className={`absolute inset-0 [background-size:32px_32px] pointer-events-none -z-10 transition-opacity duration-300 ${
          isDark
            ? "bg-[radial-gradient(#334155_1px,transparent_1px)] opacity-30"
            : "bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] opacity-40"
        }`}
      />

      {/* ─── Full-Width Edge-to-Edge Navigation Bar ─── */}
      <header className="cz-hero-header w-full py-3.5 sm:py-4 border-b backdrop-blur-md sticky top-0 z-40 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          {/* CalcZen Brand Logo (Always High Contrast in Light & Dark Mode) */}
          <Link
            to="/"
            className="flex items-center gap-2 group transition-transform duration-200 hover:scale-[1.01]"
            onClick={() => setMobileMenuOpen(false)}
          >
            <BrandLogo imgClassName="h-8 w-8 sm:h-9 sm:w-9" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="cz-hero-nav-link px-3.5 py-1.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                activeProps={{
                  className:
                    "cz-hero-nav-link px-3.5 py-1.5 text-sm font-semibold rounded-lg shadow-xs whitespace-nowrap font-bold",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Quick Search Shortcut Button */}
            <button
              type="button"
              onClick={() => {
                const isDesktop = window.innerWidth >= 1024;
                const targetInput = isDesktop
                  ? searchInputRef.current
                  : (mobileSearchInputRef.current || searchInputRef.current);
                targetInput?.focus();
                setIsSearchFocused(true);
              }}
              className="cz-hero-quick-search flex items-center gap-2 h-9 px-3 text-xs sm:text-sm font-medium rounded-xl transition-all shadow-xs cursor-pointer border"
              aria-label="Focus Calculator Search"
            >
              <Search className="cz-hero-quick-search-icon h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="cz-hero-quick-search-kbd hidden lg:inline text-[10px] font-mono px-1.5 py-0.5 rounded border">
                /
              </kbd>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle className="scale-90 sm:scale-95" />

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-xl border border-[#DCE4EF] dark:border-[#283750] text-[#111827] dark:text-[#E2E8F0] hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="md:hidden border-t border-[#E4E9F2] dark:border-slate-800 px-4 py-3 bg-[#F5F7FC]/98 dark:bg-slate-900/98 backdrop-blur-2xl overflow-hidden"
            >
              <div className="flex flex-col gap-1 max-w-7xl mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    const isDesktop = window.innerWidth >= 1024;
                    const targetInput = isDesktop
                      ? searchInputRef.current
                      : (mobileSearchInputRef.current || searchInputRef.current);
                    targetInput?.focus();
                    setIsSearchFocused(true);
                  }}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-[#2563EB] bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 mb-1 cursor-pointer"
                >
                  <Search className="h-4 w-4 shrink-0" />
                  <span>Search All Calculators</span>
                </button>
                {navLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-[#111A30] dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* DESKTOP HERO VIEW (lg:flex hidden) — 100% PRESERVED APPROVED BASELINE */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex w-full min-h-[calc(100svh-65px)] flex-1 flex-col justify-between py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex items-center">
          <div className="grid grid-cols-12 items-center gap-12 xl:gap-16 w-full">
            {/* Desktop Left Column: 48% Width */}
            <div className="col-span-6 flex flex-col items-start text-left z-10 w-full">
              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
                className="cz-hero-headline font-[Outfit] font-extrabold sm:font-black tracking-[-0.035em] leading-[1.08] text-[64px] xl:text-[72px] text-balance transition-colors duration-200"
              >
                Every calculation. <br />
                <span className="cz-hero-headline-accent transition-colors duration-200">
                  One simple place.
                </span>
              </motion.h1>

              {/* Supporting Description */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                className="cz-hero-text mt-5 text-[19px] font-normal leading-relaxed max-w-[520px] transition-colors duration-200"
              >
                From money and maths to health, dates and everyday decisions, find the right
                calculator and get clear answers in seconds.
              </motion.p>

              {/* Desktop Search Experience */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
                className="mt-8 w-full max-w-[540px] relative z-30"
                ref={searchContainerRef}
              >
                <form onSubmit={handleSearchSubmit} className="relative group w-full">
                  <div className="cz-hero-search-card relative flex items-center rounded-2xl border transition-all duration-200 p-2">
                    <Search className="cz-hero-quick-search-icon w-5 h-5 ml-4 shrink-0 transition-colors" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSelectedSearchIndex(-1);
                      }}
                      onFocus={() => setIsSearchFocused(true)}
                      onKeyDown={handleSearchKeyDown}
                      placeholder="What do you need to calculate?"
                      className="w-full bg-transparent border-none outline-none text-[17px] px-3.5 h-12 font-medium transition-colors text-inherit placeholder:opacity-60"
                    />
                    <button
                      type="submit"
                      className="h-11 px-5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white font-semibold text-sm flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <span>Search</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                {/* Real-Time Live Search Suggestions Dropdown with Direct Navigation */}
                <AnimatePresence>
                  {isSearchFocused && searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="cz-hero-search-card absolute top-full left-0 right-0 mt-2 rounded-2xl border overflow-hidden z-50 p-2 transition-all"
                    >
                      <div
                        className={`flex items-center justify-between px-3 py-1.5 border-b mb-1 text-[11px] font-bold uppercase tracking-wider ${
                          isDark
                            ? "border-slate-800/80 text-slate-400"
                            : "border-[#DCE4EF]/80 text-[#536177]"
                        }`}
                      >
                        <span>Matching Calculators</span>
                        <span className="text-[10px] text-[#2563EB] dark:text-[#4F83FF] normal-case font-medium">
                          Click to open directly ↵
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5 max-h-[320px] overflow-y-auto">
                        {searchResults.map((calc, idx) => (
                          <div
                            key={calc.slug}
                            role="button"
                            tabIndex={0}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              navigateToCalculator(calc.slug);
                            }}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer select-none ${
                              idx === selectedSearchIndex
                                ? isDark
                                  ? "bg-blue-950/70 text-[#4F83FF] border-l-4 border-l-[#4F83FF]"
                                  : "bg-blue-50 text-[#2563EB] border-l-4 border-l-[#2563EB]"
                                : isDark
                                  ? "hover:bg-slate-800/90 text-[#F3F6FC]"
                                  : "hover:bg-[#F1F4F9] text-[#18243A]"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border ${
                                  isDark
                                    ? "bg-blue-500/20 text-[#67A5FF] border-blue-500/30"
                                    : "bg-blue-50 text-[#2563EB] border-blue-200"
                                }`}
                              >
                                <calc.icon className="h-4 w-4" />
                              </div>
                              <div className="truncate">
                                <div
                                  className={`text-sm font-bold truncate ${
                                    isDark ? "text-[#F5F7FF]" : "text-[#111827]"
                                  }`}
                                >
                                  {calc.name}
                                </div>
                                <div
                                  className={`text-xs truncate ${
                                    isDark ? "text-[#AAB6CC]" : "text-[#536177]"
                                  }`}
                                >
                                  {calc.description}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-3">
                              <span
                                className={`hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                                  isDark
                                    ? "bg-blue-500/15 text-[#4F83FF] border-blue-500/20"
                                    : "bg-blue-50 text-[#2563EB] border-blue-200"
                                }`}
                              >
                                {calc.category}
                              </span>
                              <ArrowRight className="h-4 w-4 text-[#2563EB] dark:text-[#4F83FF]" />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div
                        className={`px-3 py-1.5 border-t mt-1 text-[11px] flex items-center justify-between ${
                          isDark
                            ? "border-slate-800/80 text-slate-500"
                            : "border-[#DCE4EF]/80 text-[#536177]"
                        }`}
                      >
                        <span>Press Enter ↵ to open top match</span>
                        <span>Use ↑ ↓ to navigate</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Popular Searches Quick Chips */}
                <div className="mt-3.5 flex flex-wrap items-center gap-2 text-[13px]">
                  <span className="cz-hero-text font-medium transition-colors">
                    Popular searches:
                  </span>
                  {popularChips.map((chip) => (
                    <Link
                      key={chip.slug}
                      to="/calculator/$slug"
                      params={{ slug: chip.slug }}
                      className="cz-hero-popular-chip px-2.5 py-1 rounded-lg border font-medium shadow-xs transition-all duration-200"
                    >
                      {chip.name}
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Desktop CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
                className="mt-8 flex items-center gap-4 w-auto"
              >
                <Link
                  to="/calculators"
                  className="h-13 px-7 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white font-semibold text-base inline-flex items-center justify-center gap-2.5 shadow-[0_4px_14px_rgba(37,99,235,0.32)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.42)] transition-all duration-200 group w-auto cursor-pointer"
                >
                  <span>Explore Calculators</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>

                <Link
                  to="/calculators"
                  className="cz-hero-btn-secondary h-13 px-6 rounded-xl border font-semibold text-base inline-flex items-center justify-center gap-2 transition-all duration-200 w-auto cursor-pointer"
                >
                  <span>Explore Categories</span>
                </Link>
              </motion.div>

              {/* Desktop Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
                className="cz-hero-text mt-7 pt-5 border-t flex items-center gap-x-6 text-sm transition-colors duration-200"
              >
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>100% Free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB] shrink-0" />
                  <span>No registration needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#8878E8] shrink-0" />
                  <span>Instant, private math</span>
                </div>
              </motion.div>
            </div>

            {/* Desktop Right Column: 52% Width 3D Calculator */}
            <div className="col-span-6 relative flex items-center justify-center w-full">
              <HeroCalculatorVisual layout="desktop" />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* MOBILE SCREEN 1: EDITORIAL PRODUCT LANDING (Mobile ONLY, < lg) */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden w-full min-h-[calc(100svh-58px)] flex flex-col justify-between px-4 sm:px-6 pt-5 pb-3 transition-colors select-none">
        <div className="w-full flex-1 flex flex-col justify-between max-w-[430px] mx-auto py-1 gap-4 xs:gap-5">
          {/* Block 1: Big Editorial Headline & Description */}
          <div className="w-full flex flex-col pt-1">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="cz-hero-headline font-[Outfit] font-black tracking-[-0.04em] text-[42px] xs:text-[46px] sm:text-[50px] leading-[0.96] text-left"
            >
              <span className="cz-hero-headline block">
                Every calculation.
              </span>
              <span className="block mt-1 bg-gradient-to-r from-[#1D56D8] via-[#2563EB] to-[#0EA5E9] dark:from-[#3B82F6] dark:via-[#60A5FA] dark:to-[#38BDF8] bg-clip-text text-transparent">
                One simple place.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
              className="cz-hero-text mt-3.5 xs:mt-4 text-[15px] xs:text-[15.5px] font-normal leading-[1.5] text-left max-w-[360px]"
            >
              From money and maths to health, dates and everyday decisions, find the right
              calculator and get clear answers in seconds.
            </motion.p>
          </div>

          {/* Block 2: Editorial Search Experience & Popular Searches */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: "easeOut" }}
            className="w-full relative z-30 flex flex-col"
            ref={mobileSearchContainerRef}
          >
            <form onSubmit={handleSearchSubmit} className="relative group w-full">
              <div className="cz-hero-search-card relative flex items-center rounded-2xl border transition-all duration-200 p-1.5 shadow-sm focus-within:shadow-md h-[54px] xs:h-[56px]">
                <Search className="cz-hero-quick-search-icon w-5 h-5 ml-2.5 shrink-0 transition-colors" />
                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedSearchIndex(-1);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="What do you need to calculate?"
                  className="w-full bg-transparent border-none outline-none text-sm xs:text-[15px] px-2.5 h-full font-medium transition-colors text-inherit placeholder:opacity-60"
                />
                <button
                  type="submit"
                  className="h-10 xs:h-11 px-4 xs:px-4.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white font-semibold text-xs xs:text-sm flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Mobile Autocomplete Search Dropdown */}
            <AnimatePresence>
              {isSearchFocused && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="cz-hero-search-card absolute top-full left-0 right-0 mt-2 rounded-2xl border overflow-hidden z-50 p-2 transition-all shadow-xl"
                >
                  <div
                    className={`flex items-center justify-between px-3 py-1.5 border-b mb-1 text-[11px] font-bold uppercase tracking-wider ${
                      isDark
                        ? "border-slate-800/80 text-slate-400"
                        : "border-[#DCE4EF]/80 text-[#536177]"
                    }`}
                  >
                    <span>Matching Calculators</span>
                    <span className="text-[10px] text-[#2563EB] dark:text-[#4F83FF] normal-case font-medium">
                      Click to open directly ↵
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 max-h-[260px] overflow-y-auto">
                    {searchResults.map((calc, idx) => (
                      <div
                        key={calc.slug}
                        role="button"
                        tabIndex={0}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          navigateToCalculator(calc.slug);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer select-none ${
                          idx === selectedSearchIndex
                            ? isDark
                              ? "bg-blue-950/70 text-[#4F83FF] border-l-4 border-l-[#4F83FF]"
                              : "bg-blue-50 text-[#2563EB] border-l-4 border-l-[#2563EB]"
                            : isDark
                              ? "hover:bg-slate-800/90 text-[#F3F6FC]"
                              : "hover:bg-[#F1F4F9] text-[#18243A]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border ${
                              isDark
                                ? "bg-blue-500/20 text-[#67A5FF] border-blue-500/30"
                                : "bg-blue-50 text-[#2563EB] border-blue-200"
                            }`}
                          >
                            <calc.icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="truncate">
                            <div
                              className={`text-xs font-bold truncate ${
                                isDark ? "text-[#F5F7FF]" : "text-[#111827]"
                              }`}
                            >
                              {calc.name}
                            </div>
                            <div
                              className={`text-[11px] truncate ${
                                isDark ? "text-[#AAB6CC]" : "text-[#536177]"
                              }`}
                            >
                              {calc.description}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-[#2563EB] dark:text-[#4F83FF] shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Popular Searches */}
            <div className="mt-3.5 xs:mt-4 flex flex-wrap items-center gap-1.5 xs:gap-2 text-xs">
              <span className="cz-hero-text font-bold text-[11px] xs:text-[11.5px] uppercase tracking-wider opacity-85 mr-0.5">
                Popular searches:
              </span>
              {popularChips.map((chip) => (
                <Link
                  key={chip.slug}
                  to="/calculator/$slug"
                  params={{ slug: chip.slug }}
                  className="cz-hero-popular-chip px-3 xs:px-3.5 py-1.5 rounded-xl border text-[11.5px] xs:text-[12px] font-semibold shadow-xs transition-all duration-150 active:scale-95"
                >
                  {chip.name}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Block 3: Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: "easeOut" }}
            className="flex flex-col gap-2.5 xs:gap-3 w-full"
          >
            {/* Primary CTA */}
            <Link
              to="/calculators"
              className="h-12 xs:h-13 px-5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white font-bold text-[15px] xs:text-[16px] inline-flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(37,99,235,0.32)] active:scale-[0.98] transition-all duration-150 group cursor-pointer w-full"
            >
              <span>Explore Calculators</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>

            {/* Secondary CTA */}
            <Link
              to="/calculators"
              className="cz-hero-btn-secondary h-12 xs:h-13 px-5 rounded-2xl border font-bold text-[15px] xs:text-[16px] inline-flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] cursor-pointer w-full"
            >
              <span>Explore Categories</span>
            </Link>
          </motion.div>

          {/* Block 4: Trust Micro-Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.32, ease: "easeOut" }}
            className="cz-hero-badge p-3.5 xs:p-4 rounded-2xl border flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11.5px] xs:text-[12px] font-semibold w-full shadow-xs"
          >
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="cz-hero-text">100% Free to use</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="h-2 w-2 rounded-full bg-[#2563EB] shrink-0 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
              <span className="cz-hero-text">No registration needed</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="h-2 w-2 rounded-full bg-[#8878E8] shrink-0 shadow-[0_0_8px_rgba(136,120,232,0.5)]" />
              <span className="cz-hero-text">Instant, private math</span>
            </div>
          </motion.div>

          {/* Block 5: Clean Scroll Cue Anchor */}
          <div className="w-full pt-2 pb-1 flex flex-col items-center shrink-0">
            <button
              type="button"
              onClick={() => {
                document.getElementById("calculator-showcase")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex flex-col items-center gap-1 text-[11px] xs:text-[11.5px] font-bold text-[#2563EB] dark:text-[#4F83FF] hover:opacity-80 transition-opacity cursor-pointer group py-1"
              aria-label="Scroll to Calculator Showcase"
            >
              <span className="tracking-wider uppercase text-[10.5px] xs:text-[11px] font-extrabold">Discover the calculator</span>
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-xs leading-none"
              >
                ↓
              </motion.span>
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* SCREEN 2: DEDICATED CALCULATOR PRODUCT SHOWCASE (Mobile ONLY) */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div
        id="calculator-showcase"
        className="lg:hidden w-full border-t border-[#DCE4EF]/80 dark:border-slate-800/80 pt-10 pb-12 px-4 flex flex-col items-center bg-gradient-to-b from-transparent via-[#F5F8FC]/60 to-[#F0F4FA]/80 dark:via-[#0A1024]/50 dark:to-[#080D1B]/80 transition-colors"
      >
        {/* Screen 2 Top Heading & Copy */}
        <div className="text-center max-w-[340px] xs:max-w-[360px] mx-auto mb-6">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#2563EB] dark:text-[#4F83FF] mb-1.5 inline-block">
            Interactive Tool
          </span>
          <h2 className="cz-hero-headline font-[Outfit] text-2xl xs:text-[28px] font-extrabold tracking-tight">
            Ready to calculate?
          </h2>
          <p className="cz-hero-text text-xs xs:text-sm mt-1.5 leading-relaxed max-w-[300px] mx-auto">
            Try the CalcZen calculator or explore tools for your everyday needs.
          </p>
        </div>

        {/* Screen 2 Centered Calculator + 4 Category Badges Below */}
        <div className="w-full flex justify-center">
          <HeroCalculatorVisual layout="mobile" />
        </div>
      </div>

      {/* Hero Bottom Padding / Micro-Spacer on Desktop */}
      <div className="hidden lg:block h-6 sm:h-8" />
    </section>
  );
}
