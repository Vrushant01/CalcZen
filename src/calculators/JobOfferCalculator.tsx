import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog, { type BlogContent } from "@/components/CalculatorBlog";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalculateButton } from "@/components/CalculateButton";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { OutdatedResultBanner } from "@/components/OutdatedResultBanner";
import { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeroMetric,
  StatCard,
  DashboardSection,
  InsightCard,
} from "@/components/dashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Award,
  Briefcase,
  Building2,
  Calendar,
  Car,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Coins,
  FileSpreadsheet,
  HeartHandshake,
  HelpCircle,
  Info,
  Laptop,
  Layers,
  MapPin,
  Percent,
  Plus,
  RotateCcw,
  Scale,
  Shield,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Trophy,
  Wallet,
} from "lucide-react";
import {
  compareJobOffers,
  calculateCultureScore,
  DEFAULT_OFFER_A,
  DEFAULT_OFFER_B,
  DEFAULT_OFFER_C,
  type JobOfferInput,
  type CalculatedOfferMetrics,
  type OfferComparisonResult,
  type CultureRatings,
} from "@/utils/jobOfferCalculatorUtils";
import {
  formatINR,
  INDIAN_STATES,
  type TaxRegime,
  type CityType,
} from "@/utils/salaryCalculatorUtils";

const blogContent: BlogContent = {
  primaryKeyword: "Job Offer Comparison Calculator India",
  category: "salary-and-employment",
  introText:
    "Evaluating competing job offers in India has evolved far beyond simply comparing top-line Cost to Company (CTC) figures. With companies aggressively structuring packages using high variable components, unvested ESOPs, joining bonuses, and employer retiral reserves, a higher CTC offer often yields significantly less monthly in-hand take-home pay than a lower, fixed-heavy offer. CalcZen's Job Offer Comparison Calculator enables Indian professionals to compare multiple offers across all dimensions: monthly in-hand cash, guaranteed fixed pay, target bonuses, one-time joining bonuses, ESOP risk adjustments, employer benefits, commute time, and effective hourly wage.",
  sections: [
    {
      title: "The Indian CTC Paradox: Why Higher CTC Doesn't Equal Higher Pay",
      paragraphs: [
        "In the Indian job market, employers often highlight large annual CTC numbers that can be deceptive. A ₹24 Lakh CTC offer may look substantially better than a ₹20 Lakh CTC offer on paper, but after inspecting the compensation annexure, the real cash picture can be surprisingly different.",
        "Consider this common scenario: Company A offers ₹24 Lakh CTC with ₹6 Lakh (25%) variable pay, ₹1.5 Lakh in employer EPF & gratuity provisions, and ₹2 Lakh in medical benefits. Company B offers ₹20 Lakh CTC with 100% fixed salary and standard retiral deductions.",
        "In reality, Company B may deposit ₹1,37,000 net cash into your bank account every month, while Company A provides only ₹1,12,000 in monthly take-home pay. Unless Company A achieves a 100% bonus payout, the candidate with the 'higher' offer actually earns less recurring monthly cash.",
      ],
      callout: {
        type: "quickFact",
        title: "The Golden Rule of Offer Comparison",
        text: "Always evaluate offers on Guaranteed Cash and Monthly In-Hand Salary first. Treat variable pay, startup ESOPs, and one-time bonuses as separate upside scenarios.",
      },
    },
    {
      title: "First-Year Compensation vs Recurring Long-Term Earnings",
      paragraphs: [
        "One-time joining bonuses and relocation allowances are effective recruitment tools, but they create a financial distortion known as the 'First-Year Cliff'.",
        "- **Year 1 Total Cash:** Includes your base fixed pay, expected annual performance bonus, plus 100% of your one-time joining bonus and relocation assistance.",
        "- **Year 2+ Recurring Compensation:** Drops strictly back to your recurring fixed gross plus annual variable pay. If you received a ₹3 Lakh joining bonus in Year 1, your annual cash earnings in Year 2 will be ₹3 Lakh lower unless offset by a substantial annual appraisal.",
        "- **Clawback Periods:** Most Indian employment contracts mandate a 12-month or 24-month clawback period. If you resign before completing the clawback term, you must repay 100% of the gross joining bonus plus applicable GST.",
      ],
    },
    {
      title: "Evaluating Startup ESOPs vs Listed MNC RSUs",
      paragraphs: [
        "Equity compensation can make a massive difference to long-term wealth, but not all stock grants are created equal:",
        "- **Listed MNC RSUs:** Restricted Stock Units from publicly traded companies (e.g. Microsoft, Google, Adobe, Infosys) have immediate market liquidity upon vesting. They can be sold on public stock exchanges, making their cash value predictable.",
        "- **Unlisted Startup ESOPs:** Employee Stock Option Plans in private startups (Series A, B, or C) represent paper wealth until a liquidity event occurs (e.g. IPO, secondary buyout, or company acquisition). Because many startups take 5–8 years to reach liquidity or may fail, financial experts recommend applying a 30% to 50% risk discount when comparing startup equity to guaranteed cash.",
        "- **Vesting Schedule & 1-Year Cliff:** The industry standard in India is a 4-year vesting schedule with a 1-year cliff (25% vesting after 12 months, followed by quarterly or monthly vesting thereafter). If you leave before 12 months, you forfeit 100% of the grant.",
      ],
      formulaBox: {
        title: "Realistic Equity Valuation Formula",
        formula:
          "Annualized Equity = (Total Grant Value / Vesting Years)\nRisk-Adjusted Value = Annualized Equity × (1 - Risk Discount %)",
        variables: [
          { name: "Total Grant Value", desc: "Total rupee value of grant at current fair market valuation." },
          { name: "Vesting Years", desc: "Typically 4 years across Indian tech firms." },
          { name: "Risk Discount", desc: "0% for listed MNCs, 20-30% for late-stage unicorns, 50%+ for early startups." },
        ],
      },
    },
    {
      title: "Commute Time, Hybrid Policies and the Real Hourly Wage",
      paragraphs: [
        "When switching jobs, travel time and office attendance policies directly impact your quality of life and actual earning rate:",
        "- **The Unpaid Hours Problem:** An employee working 9 hours a day with a 90-minute daily roundtrip commute spends 10.5 hours per day on work-related commitments. Over 240 working days, that amounts to 360 hours spent in traffic—equivalent to 45 full 8-hour working days!",
        "- **Direct Commute Costs:** Fuel, cabs, metro passes, and dining out in tech hubs like Bengaluru, Mumbai, or Gurgaon can easily consume ₹4,000 to ₹8,000 monthly.",
        "- **Effective Real Hourly Rate:** By dividing your annual net take-home salary by total committed hours (office hours + commute hours), you find your true wage. A ₹20L remote job often yields a higher real hourly wage than a ₹24L job requiring 5 days in a distant office.",
      ],
    },
  ],
  faqs: [
    {
      q: "How does the calculator determine monthly in-hand salary for each offer?",
      a: "Our calculator applies the official FY 2026-27 Indian income tax provisions under the default New Tax Regime (Section 115BAC), including the enhanced ₹75,000 standard deduction, revised tax slabs, Section 87A full rebate up to ₹7.75 Lakhs, marginal relief, and state-mandated Professional Tax slabs (e.g. Karnataka, Maharashtra, Gujarat).",
    },
    {
      q: "Why shouldn't I add joining bonuses to my annual recurring salary?",
      a: "A joining bonus is a one-time payment made exclusively during your first year of employment. Adding it to your recurring salary gives a false expectation of your long-term earnings, because in Year 2 your package will drop back down unless your annual hike equals or exceeds the one-time bonus.",
    },
    {
      q: "What is the CTC vs Take-Home Paradox?",
      a: "The CTC Paradox happens when an offer with a higher quoted Cost to Company (CTC) results in lower monthly take-home pay than a lower CTC offer. This occurs when the higher offer contains large variable bonuses, heavy employer EPF contributions, annual gratuity provisions, or non-cash perks that aren't paid out in your monthly paycheck.",
    },
    {
      q: "How should I value unvested ESOPs in a startup offer?",
      a: "Unless a company is publicly listed, ESOPs cannot be liquidated immediately for cash. We recommend applying a 30% risk discount for well-funded late-stage startups and a 50% discount for early-stage companies. Always ensure the guaranteed cash portion alone meets your living requirements.",
    },
    {
      q: "Can I compare three or four job offers simultaneously?",
      a: "Yes. CalcZen allows you to compare two default offers (Offer A and Offer B), or add an Offer C to evaluate three competing opportunities side-by-side with full metric breakdowns, charts, and ranking verdicts.",
    },
    {
      q: "How is the Effective Hourly Rate calculated?",
      a: "We compute your contractual annual working hours based on your daily hours and working days minus paid leaves. We then add total annual roundtrip commute hours. Dividing your annual take-home salary by total committed hours reveals your effective hourly rate.",
    },
  ],
};

const QUICK_CTC_CHIPS = [
  { label: "₹15 Lakh", value: 1500000 },
  { label: "₹20 Lakh", value: 2000000 },
  { label: "₹25 Lakh", value: 2500000 },
  { label: "₹35 Lakh", value: 3500000 },
  { label: "₹50 Lakh", value: 5000000 },
];

export function JobOfferCalculator() {
  const calc = getCalculator("job-offer-comparison-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  // Offers state: default 2 offers (Offer A & Offer B)
  const [offers, setOffers] = useState<JobOfferInput[]>([
    { ...DEFAULT_OFFER_A },
    { ...DEFAULT_OFFER_B },
  ]);

  const [activeTab, setActiveTab] = useState<string>("offer-a");

  // Dynamic sensitivity scenario toggles
  const [bonusScenario, setBonusScenario] = useState<"worst" | "expected" | "best">("expected");
  const [equityValuation, setEquityValuation] = useState<"risk-adjusted" | "nominal" | "none">(
    "risk-adjusted"
  );
  const [deductCommute, setDeductCommute] = useState<boolean>(true);

  const [calcJobInputs, setCalcJobInputs] = useState<{
    offers: JobOfferInput[];
    bonusScenario: string;
    equityValuation: string;
    deductCommute: boolean;
  } | null>(null);

  const isOutdated =
    hasResult &&
    Boolean(
      calcJobInputs &&
        (JSON.stringify(offers) !== JSON.stringify(calcJobInputs.offers) ||
          bonusScenario !== calcJobInputs.bonusScenario ||
          equityValuation !== calcJobInputs.equityValuation ||
          deductCommute !== calcJobInputs.deductCommute)
    );

  const handleCalculate = () => {
    setCalcJobInputs({
      offers: JSON.parse(JSON.stringify(offers)),
      bonusScenario,
      equityValuation,
      deductCommute,
    });
    markCalculated();
  };

  // Collapsible accordion per offer tab
  const [openSection, setOpenSection] = useState<Record<string, Record<string, boolean>>>({
    "offer-a": { variableBonus: true, equity: false, benefits: false, commute: false, culture: false },
    "offer-b": { variableBonus: true, equity: false, benefits: false, commute: false, culture: false },
    "offer-c": { variableBonus: true, equity: false, benefits: false, commute: false, culture: false },
  });

  const toggleSection = (offerId: string, sectionKey: string) => {
    setOpenSection((prev) => ({
      ...prev,
      [offerId]: {
        ...(prev[offerId] || {}),
        [sectionKey]: !prev[offerId]?.[sectionKey],
      },
    }));
  };

  // Update specific field for an offer
  const updateOfferField = (id: string, field: keyof JobOfferInput, value: any) => {
    setOffers((prev) =>
      prev.map((off) => (off.id === id ? { ...off, [field]: value } : off))
    );
  };

  // Update nested culture rating
  const updateCultureRating = (
    id: string,
    key: keyof CultureRatings,
    value: number
  ) => {
    setOffers((prev) =>
      prev.map((off) => {
        if (off.id !== id) return off;
        const currentRatings = off.cultureRatings || {
          workLifeBalance: 3,
          remoteFlexibility: 3,
          careerGrowth: 3,
          mentorship: 3,
          jobStability: 3,
          workplaceCulture: 3,
        };
        return {
          ...off,
          cultureRatings: {
            ...currentRatings,
            [key]: value,
          },
        };
      })
    );
  };

  // Add third offer (Offer C)
  const handleAddOffer = () => {
    if (offers.length >= 3) return;
    const newOffer: JobOfferInput = {
      ...DEFAULT_OFFER_C,
    };
    setOffers((prev) => [...prev, newOffer]);
    setActiveTab("offer-c");
  };

  // Remove Offer C
  const handleRemoveOffer = (id: string) => {
    if (offers.length <= 2) return;
    setOffers((prev) => prev.filter((o) => o.id !== id));
    if (activeTab === id) {
      setActiveTab(offers[0].id);
    }
  };

  // Reset to initial
  const handleReset = () => {
    setOffers([{ ...DEFAULT_OFFER_A }, { ...DEFAULT_OFFER_B }]);
    setActiveTab("offer-a");
    setCalcJobInputs(null);
    resetCalculated();
  };

  // Load realistic preset
  const handleLoadSample = () => {
    setOffers([{ ...DEFAULT_OFFER_A }, { ...DEFAULT_OFFER_B }]);
    setActiveTab("offer-a");
  };

  // Adjusted inputs based on scenario toggles
  const scenarioAdjustedOffers = useMemo(() => {
    return offers.map((off) => {
      let bonusPct = off.expectedBonusPayoutPct;
      if (bonusScenario === "worst") bonusPct = 0;
      if (bonusScenario === "best") bonusPct = 100;

      let riskDiscount = off.equityRiskDiscountPct;
      if (equityValuation === "nominal") riskDiscount = 0;
      if (equityValuation === "none") riskDiscount = 100;

      return {
        ...off,
        expectedBonusPayoutPct: bonusPct,
        equityRiskDiscountPct: riskDiscount,
      };
    });
  }, [offers, bonusScenario, equityValuation]);

  // Main calculation result
  const comparisonResult: OfferComparisonResult = useMemo(() => {
    return compareJobOffers(scenarioAdjustedOffers);
  }, [scenarioAdjustedOffers]);

  const activeOffer = offers.find((o) => o.id === activeTab) || offers[0];

  // Chart data preparation
  const chartData = useMemo(() => {
    return comparisonResult.offers.map((off) => ({
      name: off.companyName.length > 14 ? off.companyName.slice(0, 12) + "..." : off.companyName,
      fullCompany: off.companyName,
      "Monthly In-Hand": Math.round(off.monthlyInHand),
      "Guaranteed Cash": Math.round(off.guaranteedAnnualCash / 100000 * 10) / 10,
      "First Year Total": Math.round(off.firstYearTotalValue / 100000 * 10) / 10,
      "Recurring Year 2+": Math.round(off.recurringAnnualTotalValue / 100000 * 10) / 10,
    }));
  }, [comparisonResult]);

  // Breakdown chart data
  const breakdownData = useMemo(() => {
    return comparisonResult.offers.map((off) => ({
      name: off.companyName.length > 14 ? off.companyName.slice(0, 12) + "..." : off.companyName,
      "Fixed Gross": Math.round(off.annualFixedGross),
      "Variable Bonus": Math.round(off.expectedVariablePay),
      "Annualized Equity": Math.round(off.annualizedRiskAdjustedEquity),
      "Benefits & Perks": Math.round(off.totalAnnualValuedBenefits),
    }));
  }, [comparisonResult]);

  // PDF Export data preparation
  const pdfSections = useMemo(() => {
    if (!hasResult) return [];

    const offerRows = comparisonResult.offers.map((off) => [
      off.companyName,
      formatINR(off.monthlyInHand),
      formatINR(off.guaranteedAnnualCash),
      formatINR(off.firstYearTotalValue),
      formatINR(off.recurringAnnualTotalValue),
      `${off.annualCommuteHours} hrs`,
      `₹${Math.round(off.effectiveHourlyRateInHand)}/hr`,
    ]);

    return [
      {
        title: "Executive Compensation Comparison Summary",
        headers: [
          "Company",
          "Monthly In-Hand",
          "Guaranteed Cash",
          "Year 1 Package",
          "Recurring Year 2+",
          "Commute/Yr",
          "Real Hourly Rate",
        ],
        rows: offerRows,
      },
      {
        title: "Key Insights & Verdict",
        headers: ["Category", "Verdict"],
        rows: [
          ["Monthly In-Hand Leader", `${comparisonResult.verdict.highestMonthlyInHand.company} (${formatINR(comparisonResult.verdict.highestMonthlyInHand.value)}/mo)`],
          ["Guaranteed Cash Leader", `${comparisonResult.verdict.highestGuaranteedCash.company} (${formatINR(comparisonResult.verdict.highestGuaranteedCash.value)}/yr)`],
          ["First-Year Value Leader", `${comparisonResult.verdict.highestFirstYearValue.company} (${formatINR(comparisonResult.verdict.highestFirstYearValue.value)})`],
          ["Recurring Long-Term Leader", `${comparisonResult.verdict.highestRecurringValue.company} (${formatINR(comparisonResult.verdict.highestRecurringValue.value)})`],
          ["Effective Hourly Wage Leader", `${comparisonResult.verdict.highestEffectiveHourlyRate.company} (₹${Math.round(comparisonResult.verdict.highestEffectiveHourlyRate.value)}/hr)`],
        ],
      },
    ];
  }, [hasResult, comparisonResult]);

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Compare two or three job offers in India side-by-side. Analyze true monthly in-hand take-home pay, guaranteed fixed salary, target bonuses, one-time signing bonuses, ESOP equity risk, employer benefits, commute time, and effective hourly wage for FY 2026-27."
      formula={`Monthly In-Hand = Monthly Fixed Gross - Employee PF - Professional Tax - Income Tax (TDS)\nFirst-Year Total = Expected Annual Cash + Joining/Relocation Bonus + Vested Equity + Perks\nRecurring Total = Fixed Gross + Expected Bonus + Annualized Equity + Valued Retirals\nReal Hourly Wage = Annual In-Hand / (Annual Contract Hours + Annual Commute Hours)`}
      example={`Comparing ₹20L CTC Startup vs ₹20L CTC Remote MNC in Bengaluru:\nStartup: ₹4L variable pay, ₹2L joining bonus, 90m commute -> In-Hand: ₹1,04,788/mo, Year 1: ₹24.05L, Hourly: ₹458/hr.\nMNC: 100% fixed cash, 0m commute -> In-Hand: ₹1,37,583/mo (+₹32,795/mo), Year 1: ₹20.73L, Hourly: ₹721/hr (+57%).`}
      faqs={blogContent.faqs!}
      blog={<CalculatorBlog content={blogContent} />}
    >
      <div className="flex flex-col gap-6">
        {/* Top Control Bar: Offer Switcher Tabs + Actions */}
        <div className="bg-card border border-border/70 rounded-2xl p-3 sm:p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Offer Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto py-1 scroll-touch-x">
              {offers.map((off, idx) => (
                <div key={off.id} className="relative flex items-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab(off.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      activeTab === off.id
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                        : "bg-muted/40 hover:bg-muted text-foreground border border-border/60"
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>
                      {off.companyName ? off.companyName : `Offer ${String.fromCharCode(65 + idx)}`}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        activeTab === off.id
                          ? "bg-emerald-700/60 text-emerald-100"
                          : "bg-background text-muted-foreground"
                      }`}
                    >
                      {off.annualCTC ? formatINR(off.annualCTC) : "₹0"}
                    </span>
                  </button>
                  {offers.length > 2 && idx === offers.length - 1 && (
                    <button
                      type="button"
                      title="Remove this offer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveOffer(off.id);
                      }}
                      className="ml-1 p-1.5 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-red-500/10 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}

              {offers.length < 3 && (
                <button
                  type="button"
                  onClick={handleAddOffer}
                  className="px-3 py-2 rounded-xl text-xs font-semibold border border-dashed border-emerald-500/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Offer C</span>
                </button>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadSample}
                className="text-xs font-semibold gap-1.5 rounded-xl cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Load Sample Offers</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-xs text-muted-foreground hover:text-foreground gap-1 rounded-xl cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Active Offer Input Form Column */}
        <div className="bg-card border border-border/70 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-border/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-foreground">
                  Configuring: {activeOffer.companyName || activeOffer.label}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Provide compensation details, bonus structures, equity grants, and commute parameters.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {/* 1. Core Profile Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Company / Employer Name
                </Label>
                <Input
                  type="text"
                  value={activeOffer.companyName}
                  onChange={(e) => updateOfferField(activeOffer.id, "companyName", e.target.value)}
                  placeholder="e.g. Acme Tech, Google, Infosys"
                  className="h-10 text-sm font-medium rounded-xl"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Job Title / Designation
                </Label>
                <Input
                  type="text"
                  value={activeOffer.designation}
                  onChange={(e) => updateOfferField(activeOffer.id, "designation", e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="h-10 text-sm font-medium rounded-xl"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Work Mode
                </Label>
                <select
                  value={activeOffer.workMode}
                  onChange={(e) => updateOfferField(activeOffer.id, "workMode", e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border/70 bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="remote">Remote (Work from Home)</option>
                  <option value="hybrid">Hybrid (Office + Home)</option>
                  <option value="on-site">On-Site (Full-time Office)</option>
                </select>
              </div>
            </div>

            {/* 2. Annual CTC & Slabs */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-sm font-semibold text-foreground">
                  Annual Cost to Company (CTC)
                </Label>
                <span className="text-xs text-muted-foreground font-mono font-medium">
                  {formatINR(activeOffer.annualCTC || 0)}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                  ₹
                </span>
                <Input
                  type="number"
                  min="0"
                  step="50000"
                  value={activeOffer.annualCTC || ""}
                  onChange={(e) =>
                    updateOfferField(
                      activeOffer.id,
                      "annualCTC",
                      e.target.value === "" ? 0 : Number(e.target.value)
                    )
                  }
                  placeholder="e.g. 20,00,000"
                  className="pl-8 h-12 text-base font-medium rounded-xl border-border/70 focus:border-emerald-500"
                />
              </div>

              {/* Quick Select Chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {QUICK_CTC_CHIPS.map((chip) => (
                  <button
                    key={chip.value}
                    type="button"
                    onClick={() => updateOfferField(activeOffer.id, "annualCTC", chip.value)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg border border-border/60 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. State & Tax Regime */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  State (for Professional Tax)
                </Label>
                <select
                  value={activeOffer.state}
                  onChange={(e) => updateOfferField(activeOffer.id, "state", e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border/70 bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Tax Regime
                </Label>
                <select
                  value={activeOffer.taxRegime}
                  onChange={(e) =>
                    updateOfferField(activeOffer.id, "taxRegime", e.target.value as TaxRegime)
                  }
                  className="w-full h-10 px-3 rounded-xl border border-border/70 bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="new">New Tax Regime (FY 2026–27 Default, ₹75k Std Ded)</option>
                  <option value="old">Old Tax Regime (With HRA & 80C Deductions)</option>
                </select>
              </div>
            </div>

            {/* Accordion 1: Variable Pay, Bonuses & Signing Incentive */}
            <div className="border border-border/60 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection(activeOffer.id, "variableBonus")}
                className="w-full px-4 py-3 bg-muted/30 hover:bg-muted/50 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs sm:text-sm font-semibold text-foreground">
                    Variable Bonus & One-Time Joining Bonus
                  </span>
                </div>
                {openSection[activeOffer.id]?.variableBonus ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {openSection[activeOffer.id]?.variableBonus && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 border-t border-border/60 flex flex-col gap-3.5 bg-background"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Target Annual Variable Pay (₹)
                          </Label>
                          <span className="text-[11px] font-mono text-muted-foreground">
                            {formatINR(activeOffer.annualVariablePay || 0)}
                          </span>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          step="10000"
                          value={activeOffer.annualVariablePay || ""}
                          onChange={(e) =>
                            updateOfferField(
                              activeOffer.id,
                              "annualVariablePay",
                              e.target.value === "" ? 0 : Number(e.target.value)
                            )
                          }
                          placeholder="0 if 100% fixed salary"
                          className="h-9 text-xs"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Expected Bonus Payout (%)
                          </Label>
                          <span className="text-[11px] font-mono text-muted-foreground">
                            {activeOffer.expectedBonusPayoutPct}%
                          </span>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          max="150"
                          value={activeOffer.expectedBonusPayoutPct}
                          onChange={(e) =>
                            updateOfferField(
                              activeOffer.id,
                              "expectedBonusPayoutPct",
                              Number(e.target.value)
                            )
                          }
                          placeholder="e.g. 80% or 100%"
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-border/40">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <Label className="text-xs font-medium text-muted-foreground">
                            One-Time Joining / Sign-on Bonus (₹)
                          </Label>
                          <span className="text-[11px] font-mono text-muted-foreground">
                            {formatINR(activeOffer.joiningBonus || 0)}
                          </span>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          step="25000"
                          value={activeOffer.joiningBonus || ""}
                          onChange={(e) =>
                            updateOfferField(
                              activeOffer.id,
                              "joiningBonus",
                              e.target.value === "" ? 0 : Number(e.target.value)
                            )
                          }
                          placeholder="Year 1 only cash bonus"
                          className="h-9 text-xs"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Relocation Allowance (₹)
                          </Label>
                          <span className="text-[11px] font-mono text-muted-foreground">
                            {formatINR(activeOffer.relocationBonus || 0)}
                          </span>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          step="10000"
                          value={activeOffer.relocationBonus || ""}
                          onChange={(e) =>
                            updateOfferField(
                              activeOffer.id,
                              "relocationBonus",
                              e.target.value === "" ? 0 : Number(e.target.value)
                            )
                          }
                          placeholder="Flight, moving assistance"
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 2: Equity, ESOPs & RSUs */}
            <div className="border border-border/60 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection(activeOffer.id, "equity")}
                className="w-full px-4 py-3 bg-muted/30 hover:bg-muted/50 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs sm:text-sm font-semibold text-foreground">
                    Equity, ESOPs & RSUs (Optional)
                  </span>
                </div>
                {openSection[activeOffer.id]?.equity ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {openSection[activeOffer.id]?.equity && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 border-t border-border/60 flex flex-col gap-3.5 bg-background"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                          Total 4-Year Grant Value (₹)
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          step="50000"
                          value={activeOffer.equityTotalGrantValue || ""}
                          onChange={(e) =>
                            updateOfferField(
                              activeOffer.id,
                              "equityTotalGrantValue",
                              e.target.value === "" ? 0 : Number(e.target.value)
                            )
                          }
                          placeholder="e.g. 10,00,000"
                          className="h-9 text-xs"
                        />
                      </div>

                      <div>
                        <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                          Vesting Period (Years)
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          value={activeOffer.equityVestingYears}
                          onChange={(e) =>
                            updateOfferField(
                              activeOffer.id,
                              "equityVestingYears",
                              Number(e.target.value) || 4
                            )
                          }
                          className="h-9 text-xs"
                        />
                      </div>

                      <div>
                        <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                          Risk Discount (%)
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={activeOffer.equityRiskDiscountPct}
                          onChange={(e) =>
                            updateOfferField(
                              activeOffer.id,
                              "equityRiskDiscountPct",
                              Number(e.target.value)
                            )
                          }
                          placeholder="0% MNC, 30% Startup"
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 3: Commute, Travel Time & Working Hours */}
            <div className="border border-border/60 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection(activeOffer.id, "commute")}
                className="w-full px-4 py-3 bg-muted/30 hover:bg-muted/50 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs sm:text-sm font-semibold text-foreground">
                    Commute, Travel Time & Effective Working Hours
                  </span>
                </div>
                {openSection[activeOffer.id]?.commute ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {openSection[activeOffer.id]?.commute && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 border-t border-border/60 flex flex-col gap-3.5 bg-background"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                          Office Days / Week
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          max="6"
                          value={activeOffer.officeDaysPerWeek}
                          onChange={(e) =>
                            updateOfferField(
                              activeOffer.id,
                              "officeDaysPerWeek",
                              Number(e.target.value)
                            )
                          }
                          placeholder="0 for Remote, 2-3 Hybrid"
                          className="h-9 text-xs"
                        />
                      </div>

                      <div>
                        <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                          Daily Roundtrip Commute (Mins)
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          step="10"
                          value={activeOffer.dailyCommuteMinutesRoundTrip}
                          onChange={(e) =>
                            updateOfferField(
                              activeOffer.id,
                              "dailyCommuteMinutesRoundTrip",
                              Number(e.target.value)
                            )
                          }
                          placeholder="e.g. 60 or 90 mins"
                          className="h-9 text-xs"
                        />
                      </div>

                      <div>
                        <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                          Monthly Travel Cost (₹)
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          step="500"
                          value={activeOffer.monthlyCommuteCost || ""}
                          onChange={(e) =>
                            updateOfferField(
                              activeOffer.id,
                              "monthlyCommuteCost",
                              e.target.value === "" ? 0 : Number(e.target.value)
                            )
                          }
                          placeholder="Fuel, metro, cabs"
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-border/40">
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                          Daily Contractual Working Hours
                        </Label>
                        <Input
                          type="number"
                          min="6"
                          max="14"
                          value={activeOffer.dailyWorkingHours}
                          onChange={(e) =>
                            updateOfferField(
                              activeOffer.id,
                              "dailyWorkingHours",
                              Number(e.target.value)
                            )
                          }
                          placeholder="Typically 8 or 9"
                          className="h-9 text-xs"
                        />
                      </div>

                      <div>
                        <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                          Annual Paid Leaves
                        </Label>
                        <Input
                          type="number"
                          min="10"
                          max="45"
                          value={activeOffer.paidLeavesPerYear}
                          onChange={(e) =>
                            updateOfferField(
                              activeOffer.id,
                              "paidLeavesPerYear",
                              Number(e.target.value)
                            )
                          }
                          placeholder="Typically 24 to 28"
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 4: Subjective Culture & Career Ratings (1 to 5 Stars) */}
            <div className="border border-border/60 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection(activeOffer.id, "culture")}
                className="w-full px-4 py-3 bg-muted/30 hover:bg-muted/50 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs sm:text-sm font-semibold text-foreground">
                    Workplace Culture & Lifestyle Ratings (1–5 Scale)
                  </span>
                </div>
                {openSection[activeOffer.id]?.culture ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {openSection[activeOffer.id]?.culture && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 border-t border-border/60 flex flex-col gap-3.5 bg-background"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { key: "workLifeBalance", label: "Work-Life Balance" },
                        { key: "remoteFlexibility", label: "Remote Flexibility" },
                        { key: "careerGrowth", label: "Career Growth" },
                        { key: "mentorship", label: "Leadership & Mentorship" },
                        { key: "jobStability", label: "Job & Brand Stability" },
                        { key: "workplaceCulture", label: "Culture & Team Vibe" },
                      ].map((item) => {
                        const val =
                          activeOffer.cultureRatings?.[item.key as keyof CultureRatings] ?? 3;
                        return (
                          <div key={item.key} className="p-2.5 rounded-xl border border-border/60 bg-muted/20">
                            <Label className="text-[11px] font-medium text-muted-foreground block mb-1">
                              {item.label}
                            </Label>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() =>
                                    updateCultureRating(
                                      activeOffer.id,
                                      item.key as keyof CultureRatings,
                                      star
                                    )
                                  }
                                  className={`p-1 rounded transition-colors cursor-pointer ${
                                    star <= val
                                      ? "text-amber-500 fill-amber-500"
                                      : "text-muted-foreground/30"
                                  }`}
                                >
                                  ★
                                </button>
                              ))}
                              <span className="text-xs font-mono font-bold ml-1">{val}/5</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row gap-3 mt-2">
              <CalculateButton
                category="salary-and-employment"
                className="flex-1 min-h-12 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md cursor-pointer"
                disabled={offers.some((o) => !o.annualCTC || o.annualCTC <= 0)}
                onClick={handleCalculate}
              >
                <span>Compare Job Offers</span>
              </CalculateButton>

              <Button
                variant="outline"
                className="min-h-12 px-5 text-sm font-semibold rounded-xl cursor-pointer"
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Results Presentation Dashboard */}
        {hasResult ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            {isOutdated && (
              <OutdatedResultBanner onCalculate={handleCalculate} />
            )}
            {/* Sensitivity & Scenario Modeling Bar */}
            <div className="bg-card border border-border/70 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs sm:text-sm font-bold text-foreground">
                  Real-Time Scenario Modeling:
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Bonus Scenario Switcher */}
                <div className="flex items-center rounded-xl border border-border/70 p-0.5 bg-muted/40 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setBonusScenario("worst")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      bonusScenario === "worst"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    0% Bonus
                  </button>
                  <button
                    type="button"
                    onClick={() => setBonusScenario("expected")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      bonusScenario === "expected"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Expected (75-80%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBonusScenario("best")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      bonusScenario === "best"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    100% Target
                  </button>
                </div>

                {/* Equity Switcher */}
                <div className="flex items-center rounded-xl border border-border/70 p-0.5 bg-muted/40 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setEquityValuation("risk-adjusted")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      equityValuation === "risk-adjusted"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Risk-Adjusted
                  </button>
                  <button
                    type="button"
                    onClick={() => setEquityValuation("nominal")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      equityValuation === "nominal"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    100% Equity
                  </button>
                  <button
                    type="button"
                    onClick={() => setEquityValuation("none")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      equityValuation === "none"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Cash Only
                  </button>
                </div>
              </div>
            </div>

            {/* Verdict Winner HeroMetric Banner */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-card to-background border-2 border-emerald-500/30 shadow-md">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                <Trophy className="w-4 h-4" />
                <span>Executive Comparison Verdict</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-foreground">
                    {comparisonResult.verdict.highestMonthlyInHand.company} leads in Monthly In-Hand Cash
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Delivers{" "}
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {formatINR(comparisonResult.verdict.highestMonthlyInHand.value)}/month
                    </span>{" "}
                    net take-home pay
                    {comparisonResult.verdict.highestMonthlyInHand.diffVsSecond
                      ? ` (+${formatINR(comparisonResult.verdict.highestMonthlyInHand.diffVsSecond)}/mo more than second place)`
                      : ""}
                    .
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <div className="px-3 py-2 rounded-xl bg-card border border-border/80 flex-1 min-w-[130px]">
                    <span className="text-muted-foreground block text-[11px]">Guaranteed Cash</span>
                    <span className="font-bold text-foreground">
                      {comparisonResult.verdict.highestGuaranteedCash.company}
                    </span>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-card border border-border/80 flex-1 min-w-[130px]">
                    <span className="text-muted-foreground block text-[11px]">Year 1 Package</span>
                    <span className="font-bold text-foreground">
                      {comparisonResult.verdict.highestFirstYearValue.company}
                    </span>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-card border border-border/80 flex-1 min-w-[130px]">
                    <span className="text-muted-foreground block text-[11px]">Real Hourly Wage</span>
                    <span className="font-bold text-foreground">
                      {comparisonResult.verdict.highestEffectiveHourlyRate.company}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Head-to-Head Key StatCards */}
            <DashboardSection title="Core Financial Metrics Comparison">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard
                  index={0}
                  label="Monthly In-Hand"
                  value={formatINR(comparisonResult.offers[0].monthlyInHand)}
                  sub={`${comparisonResult.offers[0].companyName}: ${formatINR(comparisonResult.offers[0].monthlyInHand)} vs ${comparisonResult.offers[1]?.companyName}: ${formatINR(comparisonResult.offers[1]?.monthlyInHand || 0)}`}
                  accent="green"
                  badge={
                    comparisonResult.verdict.highestMonthlyInHand.id === comparisonResult.offers[0].id
                      ? `${comparisonResult.offers[0].companyName} Wins`
                      : `${comparisonResult.offers[1]?.companyName} Wins`
                  }
                />
                <StatCard
                  index={1}
                  label="Guaranteed Annual"
                  value={formatINR(comparisonResult.verdict.highestGuaranteedCash.value)}
                  sub={`Zero bonus / risk-free baseline`}
                  accent="blue"
                  badge={`${comparisonResult.verdict.highestGuaranteedCash.company}`}
                />
                <StatCard
                  index={2}
                  label="Year 1 Total Package"
                  value={formatINR(comparisonResult.verdict.highestFirstYearValue.value)}
                  sub={`Includes sign-on & relocation`}
                  accent="purple"
                  badge={`${comparisonResult.verdict.highestFirstYearValue.company}`}
                />
                <StatCard
                  index={3}
                  label="Effective Hourly"
                  value={`₹${Math.round(comparisonResult.verdict.highestEffectiveHourlyRate.value)}/hr`}
                  sub={`Factoring office & travel hours`}
                  accent="amber"
                  badge={`${comparisonResult.verdict.highestEffectiveHourlyRate.company}`}
                />
              </div>
            </DashboardSection>

            {/* Visual Comparison Charts */}
            <DashboardSection title="Visual Compensation Benchmarks">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Chart 1: Key Dimensions Bar Chart */}
                <div className="p-4 rounded-xl border border-border/70 bg-card">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                    Monthly Take-Home Pay (₹/Month)
                  </h4>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="name" stroke="currentColor" fontSize={11} />
                        <YAxis stroke="currentColor" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                        <Tooltip
                          formatter={(value: any) => [formatINR(Number(value)), "Monthly Take-Home"]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "12px",
                            fontSize: "12px",
                          }}
                        />
                        <Bar dataKey="Monthly In-Hand" fill="#10b981" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Annual Compensation Heads Breakdown */}
                <div className="p-4 rounded-xl border border-border/70 bg-card">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                    Annual Compensation Makeup (₹)
                  </h4>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={breakdownData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="name" stroke="currentColor" fontSize={11} />
                        <YAxis stroke="currentColor" fontSize={11} tickFormatter={(v) => `₹${v / 100000}L`} />
                        <Tooltip
                          formatter={(value: any) => [formatINR(Number(value))]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "12px",
                            fontSize: "12px",
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                        <Bar dataKey="Fixed Gross" stackId="a" fill="#3b82f6" />
                        <Bar dataKey="Variable Bonus" stackId="a" fill="#f59e0b" />
                        <Bar dataKey="Annualized Equity" stackId="a" fill="#8b5cf6" />
                        <Bar dataKey="Benefits & Perks" stackId="a" fill="#10b981" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </DashboardSection>

            {/* Detailed Side-by-Side Comparison Matrix Table */}
            <DashboardSection title="Detailed Line-by-Line Comparison Matrix">
              <div className="overflow-x-auto rounded-xl border border-border/70 scroll-touch-x">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border/70">
                      <th className="p-3 font-bold text-foreground min-w-[180px]">Metric / Compensation Head</th>
                      {comparisonResult.offers.map((off) => (
                        <th key={off.id} className="p-3 font-bold text-foreground min-w-[150px]">
                          {off.companyName}
                          <span className="block text-[10px] text-muted-foreground font-normal">
                            {off.workMode.toUpperCase()}
                          </span>
                        </th>
                      ))}
                      {comparisonResult.pairwiseComparison && (
                        <th className="p-3 font-bold text-emerald-600 dark:text-emerald-400 min-w-[120px]">
                          Difference (Δ)
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 bg-card">
                    {/* Quoted CTC */}
                    <tr>
                      <td className="p-3 font-medium text-foreground">Annual CTC Quoted</td>
                      {comparisonResult.offers.map((off, idx) => (
                        <td key={off.id} className="p-3 font-mono font-semibold">
                          {formatINR(offers[idx]?.annualCTC || 0)}
                        </td>
                      ))}
                      {comparisonResult.pairwiseComparison && (
                        <td className="p-3 font-mono font-semibold text-muted-foreground">
                          {formatINR(comparisonResult.pairwiseComparison.diffCTC)} (
                          {comparisonResult.pairwiseComparison.diffPctCTC > 0 ? "+" : ""}
                          {comparisonResult.pairwiseComparison.diffPctCTC}%)
                        </td>
                      )}
                    </tr>

                    {/* Fixed Annual Gross */}
                    <tr>
                      <td className="p-3 font-medium text-muted-foreground">Fixed Annual Gross</td>
                      {comparisonResult.offers.map((off) => (
                        <td key={off.id} className="p-3 font-mono">
                          {formatINR(off.annualFixedGross)}
                        </td>
                      ))}
                      {comparisonResult.pairwiseComparison && <td className="p-3 font-mono text-muted-foreground">-</td>}
                    </tr>

                    {/* Expected Variable Pay */}
                    <tr>
                      <td className="p-3 font-medium text-muted-foreground">Expected Variable Bonus</td>
                      {comparisonResult.offers.map((off) => (
                        <td key={off.id} className="p-3 font-mono">
                          {formatINR(off.expectedVariablePay)}
                        </td>
                      ))}
                      {comparisonResult.pairwiseComparison && <td className="p-3 font-mono text-muted-foreground">-</td>}
                    </tr>

                    {/* Monthly In-Hand (Highlighted) */}
                    <tr className="bg-emerald-500/10 font-bold">
                      <td className="p-3 text-emerald-700 dark:text-emerald-300">
                        Monthly In-Hand Take-Home
                      </td>
                      {comparisonResult.offers.map((off) => (
                        <td
                          key={off.id}
                          className={`p-3 font-mono text-sm ${
                            comparisonResult.verdict.highestMonthlyInHand.id === off.id
                              ? "text-emerald-600 dark:text-emerald-400 font-extrabold"
                              : "text-foreground"
                          }`}
                        >
                          {formatINR(off.monthlyInHand)}/mo
                        </td>
                      ))}
                      {comparisonResult.pairwiseComparison && (
                        <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {formatINR(comparisonResult.pairwiseComparison.diffInHandMonthly)}/mo
                        </td>
                      )}
                    </tr>

                    {/* Annual In-Hand */}
                    <tr>
                      <td className="p-3 font-medium text-foreground">Annual In-Hand (Post-Tax)</td>
                      {comparisonResult.offers.map((off) => (
                        <td key={off.id} className="p-3 font-mono">
                          {formatINR(off.annualInHand)}
                        </td>
                      ))}
                      {comparisonResult.pairwiseComparison && (
                        <td className="p-3 font-mono text-muted-foreground">
                          {formatINR(comparisonResult.pairwiseComparison.diffInHandAnnual)}
                        </td>
                      )}
                    </tr>

                    {/* Guaranteed Annual Cash */}
                    <tr>
                      <td className="p-3 font-medium text-foreground">Guaranteed Annual Cash</td>
                      {comparisonResult.offers.map((off) => (
                        <td key={off.id} className="p-3 font-mono">
                          {formatINR(off.guaranteedAnnualCash)}
                        </td>
                      ))}
                      {comparisonResult.pairwiseComparison && (
                        <td className="p-3 font-mono text-muted-foreground">
                          {formatINR(comparisonResult.pairwiseComparison.diffGuaranteedAnnual)}
                        </td>
                      )}
                    </tr>

                    {/* One-Time Bonuses */}
                    <tr>
                      <td className="p-3 font-medium text-muted-foreground">One-Time Bonuses (Sign-on + Relocation)</td>
                      {comparisonResult.offers.map((off) => (
                        <td key={off.id} className="p-3 font-mono">
                          {formatINR(off.totalOneTimePayments)}
                        </td>
                      ))}
                      {comparisonResult.pairwiseComparison && <td className="p-3 font-mono text-muted-foreground">-</td>}
                    </tr>

                    {/* First-Year Total Value */}
                    <tr className="font-semibold bg-muted/20">
                      <td className="p-3 text-foreground">First-Year Total Value (Year 1)</td>
                      {comparisonResult.offers.map((off) => (
                        <td key={off.id} className="p-3 font-mono">
                          {formatINR(off.firstYearTotalValue)}
                        </td>
                      ))}
                      {comparisonResult.pairwiseComparison && (
                        <td className="p-3 font-mono text-muted-foreground">
                          {formatINR(comparisonResult.pairwiseComparison.diffFirstYearTotal)}
                        </td>
                      )}
                    </tr>

                    {/* Recurring Year 2+ Total Value */}
                    <tr className="font-semibold bg-muted/20">
                      <td className="p-3 text-foreground">Recurring Annual Value (Year 2+)</td>
                      {comparisonResult.offers.map((off) => (
                        <td key={off.id} className="p-3 font-mono">
                          {formatINR(off.recurringAnnualTotalValue)}
                        </td>
                      ))}
                      {comparisonResult.pairwiseComparison && (
                        <td className="p-3 font-mono text-muted-foreground">
                          {formatINR(comparisonResult.pairwiseComparison.diffRecurringTotal)}
                        </td>
                      )}
                    </tr>

                    {/* Annualized Equity */}
                    <tr>
                      <td className="p-3 font-medium text-muted-foreground">Annualized Equity (Risk-Adjusted)</td>
                      {comparisonResult.offers.map((off) => (
                        <td key={off.id} className="p-3 font-mono">
                          {formatINR(off.annualizedRiskAdjustedEquity)}
                          <span className="block text-[10px] text-muted-foreground">
                            Nominal: {formatINR(off.annualizedNominalEquity)}
                          </span>
                        </td>
                      ))}
                      {comparisonResult.pairwiseComparison && <td className="p-3 font-mono text-muted-foreground">-</td>}
                    </tr>

                    {/* Annual Commute Hours & Cost */}
                    <tr>
                      <td className="p-3 font-medium text-muted-foreground">Annual Commute Time & Cost</td>
                      {comparisonResult.offers.map((off) => (
                        <td key={off.id} className="p-3 font-mono">
                          {off.annualCommuteHours} hrs / yr
                          <span className="block text-[10px] text-muted-foreground">
                            {formatINR(off.annualCommuteCost)} travel expense
                          </span>
                        </td>
                      ))}
                      {comparisonResult.pairwiseComparison && (
                        <td className="p-3 font-mono text-muted-foreground">
                          {comparisonResult.pairwiseComparison.diffCommuteHoursAnnual} hrs
                        </td>
                      )}
                    </tr>

                    {/* Real Hourly Wage */}
                    <tr className="font-bold">
                      <td className="p-3 text-foreground">Effective Real Hourly Wage</td>
                      {comparisonResult.offers.map((off) => (
                        <td
                          key={off.id}
                          className={`p-3 font-mono text-sm ${
                            comparisonResult.verdict.highestEffectiveHourlyRate.id === off.id
                              ? "text-emerald-600 dark:text-emerald-400 font-extrabold"
                              : "text-foreground"
                          }`}
                        >
                          ₹{Math.round(off.effectiveHourlyRateInHand)}/hr
                        </td>
                      ))}
                      {comparisonResult.pairwiseComparison && (
                        <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{Math.round(comparisonResult.pairwiseComparison.diffEffectiveHourly)}/hr
                        </td>
                      )}
                    </tr>

                    {/* Culture & WLB Index */}
                    <tr>
                      <td className="p-3 font-medium text-foreground">Culture & Lifestyle Index</td>
                      {comparisonResult.offers.map((off) => (
                        <td key={off.id} className="p-3 font-mono font-bold">
                          {off.cultureScore}/100
                        </td>
                      ))}
                      {comparisonResult.pairwiseComparison && <td className="p-3 font-mono text-muted-foreground">-</td>}
                    </tr>
                  </tbody>
                </table>
              </div>
            </DashboardSection>

            {/* Smart Rule-Based Comparison Insights */}
            <DashboardSection title="Personalized Decision Insights">
              <div className="flex flex-col gap-3">
                {comparisonResult.insights.map((insight, idx) => (
                  <InsightCard
                    key={idx}
                    index={idx}
                    tone={insight.tone}
                    title={
                      insight.type === "take-home"
                        ? "Take-Home Cash Analysis"
                        : insight.type === "first-year"
                        ? "First-Year Cliff Warning"
                        : insight.type === "lifestyle"
                        ? "Commute & Hourly Value Impact"
                        : insight.type === "equity"
                        ? "Equity & Liquidity Risk"
                        : "Workplace & Culture Fit"
                    }
                    text={insight.text}
                  />
                ))}
              </div>
            </DashboardSection>

            {/* PDF Export Action */}
            <div className="flex justify-end pt-2">
              <CalculatorPdfExport
                calculatorName="Job Offer Comparison Report"
                sections={pdfSections}
              />
            </div>
          </motion.div>
        ) : (
          <EmptyResultPlaceholder
            onCalculate={handleCalculate}
            category="salary-and-employment"
          />
        )}
      </div>
    </CalculatorPageLayout>
  );
}

