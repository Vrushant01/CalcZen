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
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ChevronDown,
  ChevronUp,
  Coins,
  Gem,
  HelpCircle,
  Info,
  Percent,
  Receipt,
  RotateCcw,
  Scale,
  Tag,
  TrendingDown,
  Wallet,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import {
  calculateGoldMakingCharges,
  compareMakingChargeOffers,
  calculateMakingChargeNegotiationSavings,
  calculateAffordableWeightFromBudget,
  generateMakingChargeInsights,
  formatINR,
  formatINRWithDecimals,
  PURITY_DEFINITIONS,
  type GoldPurity,
  type WeightUnit,
  type RateBasis,
  type RateType,
  type MakingChargeType,
  type WastageType,
  type DiscountType,
  type GstTransactionType,
  type MakingChargesInputs,
  type JewellerOfferInput,
} from "@/utils/makingChargesCalculatorUtils";

type CalculatorMode = "standard" | "compare" | "negotiate" | "budget";

const QUICK_RATE_CHIPS = [
  { label: "₹1,40,000 / 10g", value: 140000 },
  { label: "₹1,45,000 / 10g", value: 145000 },
  { label: "₹1,50,000 / 10g", value: 150000 },
  { label: "₹1,55,000 / 10g", value: 155000 },
  { label: "₹1,60,000 / 10g", value: 160000 },
];

const QUICK_PERCENT_CHIPS = [6, 8, 10, 12, 15, 18];
const QUICK_PER_GRAM_CHIPS = [350, 500, 650, 800, 1000];
const QUICK_FLAT_CHIPS = [3000, 5000, 8000, 12000];
const QUICK_BUDGET_CHIPS = [
  { label: "₹50,000", value: 50000 },
  { label: "₹1 Lakh", value: 100000 },
  { label: "₹1.5 Lakh", value: 150000 },
  { label: "₹2 Lakh", value: 200000 },
  { label: "₹3 Lakh", value: 300000 },
];

export function GoldMakingChargesCalculator() {
  const calcMeta = getCalculator("gold-making-charges-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  // Mode Selection
  const [calculatorMode, setCalculatorMode] = useState<CalculatorMode>("standard");

  // SECTION A: GOLD DETAILS
  const [purity, setPurity] = useState<GoldPurity>("22k-916");
  const [customKarat, setCustomKarat] = useState<number>(22);
  const [customFinenessPct, setCustomFinenessPct] = useState<number>(91.6);

  const [goldWeight, setGoldWeight] = useState<number | "">(10);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("grams");

  const [goldRate, setGoldRate] = useState<number | "">(150000);
  const [goldRateBasis, setGoldRateBasis] = useState<RateBasis>("per_10g");
  const [goldRateType, setGoldRateType] = useState<RateType>("derived_from_24k");

  // SECTION B: MAKING CHARGE METHOD (CORE SELECTION)
  const [makingChargeMethod, setMakingChargeMethod] = useState<MakingChargeType>("percentage");
  const [makingChargePercentage, setMakingChargePercentage] = useState<number | "">(8);
  const [makingChargePerGram, setMakingChargePerGram] = useState<number | "">(500);
  const [flatMakingCharge, setFlatMakingCharge] = useState<number | "">(8000);

  // SECTION C: OPTIONAL WASTAGE
  const [wastageType, setWastageType] = useState<WastageType>("none");
  const [wastageValue, setWastageValue] = useState<number | "">(0);

  // SECTION D: OPTIONAL DISCOUNT
  const [discountType, setDiscountType] = useState<DiscountType>("none");
  const [discountValue, setDiscountValue] = useState<number | "">(0);

  // SECTION E: GST SETTINGS
  const [enableGst, setEnableGst] = useState<boolean>(true);
  const [gstRatePct, setGstRatePct] = useState<number>(3);
  const [gstTransactionType, setGstTransactionType] = useState<GstTransactionType>("intra_state");

  // Collapsible Accordion States
  const [openSections, setOpenSections] = useState({
    wastage: false,
    discount: false,
    gst: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // SUB-TOOL 1: COMPARE MODE STATE
  const [compareOffers, setCompareOffers] = useState<JewellerOfferInput[]>([
    { jewellerName: "Jeweller A (e.g. Tanishq/Malabar)", method: "percentage", value: 12, discountPct: 0 },
    { jewellerName: "Jeweller B (e.g. Local Hallmarked Store)", method: "per_gram", value: 650, discountPct: 0 },
    { jewellerName: "Jeweller C (e.g. Wholesale Artisan)", method: "flat", value: 5000, discountPct: 0 },
  ]);

  // SUB-TOOL 2: NEGOTIATION STATE
  const [negotiateCurrentValue, setNegotiateCurrentValue] = useState<number | "">(10);
  const [negotiateCurrentMethod, setNegotiateCurrentMethod] = useState<MakingChargeType>("percentage");
  const [negotiateDesiredValue, setNegotiateDesiredValue] = useState<number | "">(8);
  const [negotiateDesiredMethod, setNegotiateDesiredMethod] = useState<MakingChargeType>("percentage");

  // SUB-TOOL 3: BUDGET MODE STATE
  const [budgetAmount, setBudgetAmount] = useState<number | "">(150000);

  // Standard inputs bundle
  const standardInputs: MakingChargesInputs = useMemo(() => {
    return {
      purity,
      customKarat: Number(customKarat) || 22,
      customFinenessPct: Number(customFinenessPct) || 91.6,
      goldWeight: Number(goldWeight) || 0,
      weightUnit,
      goldRate: Number(goldRate) || 0,
      goldRateBasis,
      goldRateType,
      makingChargeMethod,
      makingChargePercentage: Number(makingChargePercentage) || 0,
      makingChargePerGram: Number(makingChargePerGram) || 0,
      flatMakingCharge: Number(flatMakingCharge) || 0,
      wastageType,
      wastageValue: Number(wastageValue) || 0,
      discountType,
      discountValue: Number(discountValue) || 0,
      gstRatePct: enableGst ? (Number(gstRatePct) || 3) : 0,
      gstTransactionType,
    };
  }, [
    purity,
    customKarat,
    customFinenessPct,
    goldWeight,
    weightUnit,
    goldRate,
    goldRateBasis,
    goldRateType,
    makingChargeMethod,
    makingChargePercentage,
    makingChargePerGram,
    flatMakingCharge,
    wastageType,
    wastageValue,
    discountType,
    discountValue,
    enableGst,
    gstRatePct,
    gstTransactionType,
  ]);

  // Calculation Results
  const result = useMemo(() => {
    return calculateGoldMakingCharges(standardInputs);
  }, [standardInputs]);

  // Comparison Results
  const comparisonResult = useMemo(() => {
    return compareMakingChargeOffers(standardInputs, compareOffers);
  }, [standardInputs, compareOffers]);

  // Negotiation Results
  const negotiationResult = useMemo(() => {
    return calculateMakingChargeNegotiationSavings(
      standardInputs,
      Number(negotiateCurrentValue) || 0,
      negotiateCurrentMethod,
      Number(negotiateDesiredValue) || 0,
      negotiateDesiredMethod
    );
  }, [
    standardInputs,
    negotiateCurrentValue,
    negotiateCurrentMethod,
    negotiateDesiredValue,
    negotiateDesiredMethod,
  ]);

  // Budget Results
  const budgetResult = useMemo(() => {
    return calculateAffordableWeightFromBudget(Number(budgetAmount) || 0, standardInputs);
  }, [budgetAmount, standardInputs]);

  // Dynamic Insights
  const dynamicInsights = useMemo(() => {
    return generateMakingChargeInsights(result);
  }, [result]);

  // Chart Data: Bill Composition Breakdown
  const chartData = useMemo(() => {
    const data = [
      { name: "Pure Gold Value", value: Math.round(result.rawGoldValue), color: "#f59e0b" },
      { name: "Net Making Charges", value: Math.round(result.netMakingCharges), color: "#3b82f6" },
    ];
    if (result.wastageValue > 0) {
      data.push({ name: "Wastage / Value Addition", value: Math.round(result.wastageValue), color: "#8b5cf6" });
    }
    if (result.totalGstAmount > 0) {
      data.push({ name: "3% GST", value: Math.round(result.totalGstAmount), color: "#10b981" });
    }
    return data;
  }, [result]);

  const handleReset = () => {
    setPurity("22k-916");
    setGoldWeight(10);
    setWeightUnit("grams");
    setGoldRate(150000);
    setGoldRateBasis("per_10g");
    setGoldRateType("derived_from_24k");
    setMakingChargeMethod("percentage");
    setMakingChargePercentage(8);
    setMakingChargePerGram(500);
    setFlatMakingCharge(8000);
    setWastageType("none");
    setWastageValue(0);
    setDiscountType("none");
    setDiscountValue(0);
    setEnableGst(true);
    setGstRatePct(3);
    setGstTransactionType("intra_state");
    resetCalculated();
  };

  const handleLoadSample = () => {
    setPurity("22k-916");
    setGoldWeight(15);
    setWeightUnit("grams");
    setGoldRate(150000);
    setGoldRateBasis("per_10g");
    setGoldRateType("derived_from_24k");
    setMakingChargeMethod("percentage");
    setMakingChargePercentage(9.5);
    setWastageType("none");
    setDiscountType("percentage");
    setDiscountValue(10); // 10% promotional discount on making charges
    markCalculated();
  };

  // Educational Blog Content for SEO
  const blogContent: any = {
    title: "Gold Making Charges in India: The Complete Buyer's Guide & Pricing Formula",
    description:
      "Understand how Indian jewellers calculate making charges using percentage, per-gram, and flat pricing. Learn how to convert between methods, compare quotations, negotiate discounts, and verify 3% GST.",
    publishedDate: "2026-11-04",
    readTime: "9 min read",
    author: "CalcZen Financial & Jewellery Research Team",
    tableOfContents: [
      { id: "what-are-making-charges", title: "1. What Are Gold Jewellery Making Charges?" },
      { id: "three-pricing-methods", title: "2. The Three Making Charge Pricing Methods" },
      { id: "converting-between-methods", title: "3. How to Convert Making Charges into Equivalent Values" },
      { id: "making-vs-wastage", title: "4. Making Charges vs Wastage: Avoiding Double Charges" },
      { id: "cbic-gst-rules", title: "5. Official CBIC GST Rules for Gold Jewellery" },
      { id: "negotiation-strategies", title: "6. How to Negotiate Making Charges with Jewellers" },
      { id: "comparing-quotes", title: "7. Comparing Two or More Jeweller Quotations" },
      { id: "faqs", title: "8. Frequently Asked Questions" },
    ],
    sections: [
      {
        id: "what-are-making-charges",
        title: "1. What Are Gold Jewellery Making Charges?",
        paragraphs: [
          "When you purchase gold jewellery in India, the price you pay consists of two primary elements: the raw intrinsic cost of the pure gold itself, and the **making charge (also known as 'Ghadai' or craftsmanship cost)**. The making charge compensates the goldsmith, artisan, and manufacturing house for melting, shaping, casting, polishing, hallmarking, and detailing the ornament.",
          "Unlike standard bullion coins or bars—which carry minimal fabrication premiums of 1% to 3%—intricate jewellery pieces require skilled craftsmanship, laser soldering, and precision stone setting. Because there is no statutory government price cap on making charges in India, rates vary dramatically across jewellers, ranging from as low as **6% for plain machine-crafted chains to over 25% for antique bridal temple jewellery**.",
        ],
        callout: {
          type: "quickFact",
          title: "The Standard Indian Jewellery Billing Formula",
          text: "Total Jewellery Cost = [ (Net Gold Weight × Purity Rate) + Net Making Charges + Applicable Wastage - Discounts ] × 1.03 (3% GST).",
        },
      },
      {
        id: "three-pricing-methods",
        title: "2. The Three Making Charge Pricing Methods",
        paragraphs: [
          "Indian jewellers commonly quote making charges in one of three formats. Understanding how each method operates is vital to avoid overpaying:",
          "1. **Percentage of Gold Value (%):** The making fee is calculated as a fixed percentage of the raw gold value. For example, if a 22K necklace has a gold value of ₹1,37,500 and the making charge is 8%, the making fee is ₹11,000. **Crucial insight:** With percentage pricing, if market gold rates surge, your rupee making charges automatically rise even though the labor required to make the piece did not change.",
          "2. **Fixed Charge Per Gram (₹/gram):** The jeweller charges a flat rupee amount for every gram of net gold weight. For instance, ₹500 per gram on a 10-gram ring equals ₹5,000 in making charges. This model is transparent and isolates labor costs from gold price volatility.",
          "3. **Flat Charge Per Item (₹):** The jeweller quotes a single lump-sum making fee for the entire finished ornament (e.g. ₹8,000 for a pair of bangles), regardless of fluctuations in weight or spot rates. Flat fees are common for standardized, branded collection pieces.",
        ],
      },
      {
        id: "converting-between-methods",
        title: "3. How to Convert Making Charges into Equivalent Values",
        paragraphs: [
          "The biggest challenge buyers face is comparing different jewellers who quote using conflicting formats. CalcZen solves this by normalizing all pricing into equivalent metrics:",
          "- **Making Charge Per Gram:** `Total Making Charges ÷ Net Gold Weight (g)`",
          "- **Equivalent Making Percentage:** `(Total Making Charges ÷ Raw Gold Value) × 100`",
          "- **Making Charge Per 10 Grams:** `Making Charge Per Gram × 10`",
        ],
        formulaBox: {
          title: "Conversion Example",
          formula:
            "A jeweller quotes a flat ₹8,000 making fee on a 10g 22K chain (gold value ₹1,37,500):\n• Making per gram = ₹8,000 / 10g = ₹800 / gram\n• Equivalent Percentage = (₹8,000 / ₹1,37,500) × 100 = 5.82%\nNow you can instantly compare this against a competitor offering 8% making charges (₹1,100/g).",
          variables: [
            { name: "Flat Fee", desc: "Entered lump-sum charge (₹8,000)." },
            { name: "Equivalent %", desc: "Standardized percentage allowing fair comparison (5.82%)." },
          ],
        },
      },
      {
        id: "making-vs-wastage",
        title: "4. Making Charges vs Wastage: Avoiding Double Charges",
        paragraphs: [
          "Historically, traditional goldsmiths added a separate **wastage fee (also known as 'Kada' or value addition, typically 5% to 8%)** to cover gold lost during filing, melting, and polishing. In modern computerized CAD and induction casting factories, actual gold loss is strictly recovered and rarely exceeds 0.5% to 1%.",
          "Today, reputable national chain brands include all fabrication losses inside their published making charges. However, some traditional local jewellers still bill both: a 10% making charge *plus* an additional 6% wastage. **Always ask whether the quote is inclusive of wastage.** Never pay both high making charges and high wastage on standard ornaments.",
        ],
      },
      {
        id: "cbic-gst-rules",
        title: "5. Official CBIC GST Rules for Gold Jewellery",
        paragraphs: [
          "Under official Central Board of Indirect Taxes and Customs (CBIC) sector regulations, **a uniform 3% GST** applies to retail jewellery sales in India:",
          "- **Intra-State Transactions:** Split equally into **1.5% CGST** (Central GST) and **1.5% SGST** (State GST).",
          "- **Inter-State Transactions:** Levied as **3% IGST** (Integrated GST).",
          "- **No Separate 5% GST on Making:** Some competitor online tools erroneously apply 3% GST on gold and 5% GST on making charges. CBIC has clarified that retail jewellery purchases represent a single composite supply of goods taxed uniformly at 3%, whether making charges are itemized separately on the invoice or combined into a composite price.",
        ],
      },
      {
        id: "negotiation-strategies",
        title: "6. How to Negotiate Making Charges with Jewellers",
        paragraphs: [
          "Because making charges represent a jeweller's retail margin, they are almost always negotiable. Here are proven strategies for Indian buyers:",
          "1. **Negotiate during festive seasons:** During Diwali, Dhanteras, and Akshaya Tritiya, most jewellers offer 20% to 50% discounts on making charges.",
          "2. **Calculate the per-gram equivalent:** If a jeweller quotes 14% making on 22K gold, point out that it translates to over ₹1,900 per gram in labor, and ask to cap it at ₹800 to ₹1,000/g.",
          "3. **Ask for an unbundled invoice:** Require the jeweller to clearly separate net gold weight, purity rate, making charges, and hallmarking charges before computing 3% GST.",
          "4. **Leverage competitor quotations:** Use CalcZen's quote comparison tool to demonstrate that another certified hallmarked showroom is offering lower making charges for identical design complexity.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is a reasonable making charge for 22K gold jewellery in India?",
        a: "For simple machine-made ornaments (chains, plain bangles, coins), reasonable making charges typically range between 6% and 10% (or ₹350 to ₹650 per gram). For casted and die-pressed designer jewellery, 10% to 15% is standard. Intricate handcrafted temple jewellery, bridal chokers, or antique Kundan work can legitimately range from 16% to 25% due to extensive artisan hours.",
      },
      {
        q: "How does this calculator convert flat making charges into a percentage?",
        a: "The calculator divides the flat making charge by the total raw gold value and multiplies by 100: Equivalent % = (Flat Making Charge / Raw Gold Value) × 100. It also divides the flat fee by the net gold weight in grams to show the exact charge per gram, allowing direct comparisons.",
      },
      {
        q: "Does GST apply separately to making charges?",
        a: "In an ordinary retail jewellery purchase, 3% GST applies to the entire taxable transaction value (raw gold + making charges + wastage - discounts). You do NOT pay a separate 5% service tax or 18% GST on retail making charges. If your invoice breaks down making charges, the GST on that line item is still strictly 3%.",
      },
      {
        q: "What is the difference between making charges and wastage?",
        a: "Making charges cover the labor and craftsmanship required to design and fabricate the jewellery. Wastage represents the gold lost during melting and cutting. Today, modern manufacturing minimizes loss, so many jewellers bundle wastage into making charges. Be cautious if a jeweller charges both high making charges (e.g. 12%) and separate high wastage (e.g. 6%).",
      },
      {
        q: "How do I calculate how much gold weight I can buy for my budget?",
        a: "Switch to 'Budget Mode' in our calculator. Enter your total budget (e.g. ₹1,50,000), gold rate, purity, and making charge method. The calculator uses reverse algebraic equations to deduce the exact maximum gold weight in grams you can purchase, with 3% GST already accounted for.",
      },
      {
        q: "Can making charges be waived completely?",
        a: "While some jewellers advertise 'Zero Making Charges' during promotional campaigns, they often compensate by charging higher wastage percentages, applying wider buyback spreads, or quoting inflated gold rates. Always verify the final effective price per gram using CalcZen.",
      },
      {
        q: "How does gold purity affect making charges?",
        a: "22K gold is the most common purity for traditional jewellery. 18K gold is harder and more durable, making it standard for diamond-studded jewellery. Because diamonds require microscope setting, 18K diamond jewellery frequently carries higher making charges per gram than plain 22K gold ornaments.",
      },
      {
        q: "Is hallmarking mandatory when paying making charges?",
        a: "Yes. Under Bureau of Indian Standards (BIS) regulations, every gold jewellery piece sold in India must be hallmarked with the BIS logo, purity stamp (e.g. 22K916), and a 6-digit HUID. The government-mandated hallmarking fee is ₹45 + 18% GST (approx ₹53.10) per jewellery article.",
      },
    ],
  };

  return (
    <CalculatorPageLayout
      calc={calcMeta}
      intro="Calculate, convert, and negotiate gold jewellery making charges in India. Compare percentage, per-gram, and flat pricing across jewellers and see the exact 3% GST impact."
      formula={`Percentage Method: Making Charges = Gold Value × (Making % / 100)\nPer-Gram Method: Making Charges = Net Weight (g) × (₹ / gram)\nFlat Fee Method: Making Charges = Flat INR\nEquivalent % = (Net Making Charges / Gold Value) × 100\nMaking / Gram = Net Making Charges / Net Gold Weight`}
      example={`For 10g of 22K gold with 24K rate at ₹1,50,000 / 10g (22K rate = ₹13,750/g):\nGold Value = 10g × ₹13,750 = ₹1,37,500\nMaking Charge (8%) = ₹1,37,500 × 8% = ₹11,000\nMaking Charge Per Gram = ₹11,000 / 10g = ₹1,100/g\nGST on Making (3%) = ₹330\nFinal Bill with 3% GST = (₹1,37,500 + ₹11,000) × 1.03 = ₹1,52,955`}
      faqs={blogContent.faqs!}
      blog={<CalculatorBlog content={blogContent} />}
    >
      <div className="flex flex-col gap-6">
        {/* Top Mode Navigation Tabs */}
        <div className="bg-card border border-border/70 rounded-2xl p-2 sm:p-3 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            {/* 4-Tab Segmented Grid */}
            <div className="grid grid-cols-4 gap-1 sm:flex sm:items-center sm:gap-1.5 w-full sm:w-auto p-1 sm:p-0 bg-muted/30 sm:bg-transparent rounded-xl">
              <button
                type="button"
                onClick={() => setCalculatorMode("standard")}
                className={`py-2 px-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  calculatorMode === "standard"
                    ? "bg-amber-500 text-white shadow-sm sm:shadow-md shadow-amber-500/20"
                    : "hover:bg-muted/70 text-foreground sm:bg-muted/40 sm:border sm:border-border/60"
                }`}
              >
                <Receipt className="w-3.5 h-3.5 shrink-0" />
                <span className="sm:hidden truncate">Calculate</span>
                <span className="hidden sm:inline whitespace-nowrap">Making Charges Calc</span>
              </button>

              <button
                type="button"
                onClick={() => setCalculatorMode("compare")}
                className={`py-2 px-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  calculatorMode === "compare"
                    ? "bg-amber-500 text-white shadow-sm sm:shadow-md shadow-amber-500/20"
                    : "hover:bg-muted/70 text-foreground sm:bg-muted/40 sm:border sm:border-border/60"
                }`}
              >
                <Scale className="w-3.5 h-3.5 shrink-0" />
                <span className="sm:hidden truncate">Compare</span>
                <span className="hidden sm:inline whitespace-nowrap">Compare Jewellers</span>
              </button>

              <button
                type="button"
                onClick={() => setCalculatorMode("negotiate")}
                className={`py-2 px-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  calculatorMode === "negotiate"
                    ? "bg-amber-500 text-white shadow-sm sm:shadow-md shadow-amber-500/20"
                    : "hover:bg-muted/70 text-foreground sm:bg-muted/40 sm:border sm:border-border/60"
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5 shrink-0" />
                <span className="sm:hidden truncate">Savings</span>
                <span className="hidden sm:inline whitespace-nowrap">Negotiate & Save</span>
              </button>

              <button
                type="button"
                onClick={() => setCalculatorMode("budget")}
                className={`py-2 px-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  calculatorMode === "budget"
                    ? "bg-amber-500 text-white shadow-sm sm:shadow-md shadow-amber-500/20"
                    : "hover:bg-muted/70 text-foreground sm:bg-muted/40 sm:border sm:border-border/60"
                }`}
              >
                <Wallet className="w-3.5 h-3.5 shrink-0" />
                <span className="sm:hidden truncate">Budget</span>
                <span className="hidden sm:inline whitespace-nowrap">Budget Mode</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 border-t border-border/40 sm:border-0 sm:pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadSample}
                className="h-8 text-xs font-semibold rounded-xl cursor-pointer flex-1 sm:flex-initial"
              >
                <span className="sm:hidden">Sample</span>
                <span className="hidden sm:inline">Load Sample</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1 rounded-xl cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span>Reset</span>
              </Button>
            </div>
          </div>
        </div>

        {/* MODE 2: COMPARE JEWELLERS TOOL */}
        {calculatorMode === "compare" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-card to-background border-2 border-amber-500/30 shadow-md flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Scale className="w-4 h-4" />
                <span>Side-by-Side Jeweller Making Charge Comparison</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Base: {standardInputs.goldWeight}g • {result.purityLabel} • ₹{Math.round(result.effectiveGoldRatePerGram).toLocaleString("en-IN")}/g
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {compareOffers.map((offer, idx) => {
                const calcOffer = comparisonResult.offers[idx];
                const isCheapest = comparisonResult.cheapestIndex === idx;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border flex flex-col gap-2.5 transition-all ${
                      isCheapest
                        ? "bg-card border-emerald-500/80 shadow-md ring-2 ring-emerald-500/20"
                        : "bg-card/70 border-border/80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Input
                        type="text"
                        value={offer.jewellerName}
                        onChange={(e) => {
                          const updated = [...compareOffers];
                          updated[idx].jewellerName = e.target.value;
                          setCompareOffers(updated);
                        }}
                        className="h-8 text-xs font-bold w-full"
                      />
                      {isCheapest && (
                        <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                          Lowest Cost
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <Label className="text-[10px] text-muted-foreground block mb-1">Pricing Method</Label>
                        <select
                          value={offer.method}
                          onChange={(e) => {
                            const updated = [...compareOffers];
                            updated[idx].method = e.target.value as MakingChargeType;
                            setCompareOffers(updated);
                          }}
                          className="w-full h-8 px-2 rounded-lg border border-border/70 bg-background text-xs font-medium"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="per_gram">Rupees / Gram (₹/g)</option>
                          <option value="flat">Flat Amount (₹)</option>
                        </select>
                      </div>

                      <div>
                        <Label className="text-[10px] text-muted-foreground block mb-1">
                          {offer.method === "percentage"
                            ? "Percentage (%)"
                            : offer.method === "per_gram"
                            ? "Charge (₹/g)"
                            : "Flat Fee (₹)"}
                        </Label>
                        <Input
                          type="number"
                          value={offer.value}
                          onChange={(e) => {
                            const updated = [...compareOffers];
                            updated[idx].value = Number(e.target.value) || 0;
                            setCompareOffers(updated);
                          }}
                          className="h-8 text-xs font-bold"
                        />
                      </div>
                    </div>

                    {/* Calculated Offer Breakdown */}
                    {calcOffer && (
                      <div className="pt-2 border-t border-border/60 space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Total Making:</span>
                          <span className="font-bold text-foreground">{formatINR(calcOffer.netMakingCharges)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rate Per Gram:</span>
                          <span className="font-mono font-semibold">{formatINR(calcOffer.makingChargePerGram)}/g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Equivalent %:</span>
                          <span className="font-semibold text-amber-600 dark:text-amber-400">{calcOffer.equivalentPercentage.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-border/40 font-bold text-foreground">
                          <span>Est. Bill (3% GST):</span>
                          <span>{formatINR(calcOffer.finalTotalBill)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Comparison Verdict */}
            <div className="p-3.5 rounded-xl bg-card border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  <strong>{comparisonResult.cheapestOfferName}</strong> offers the lowest making charges. You save{" "}
                  <strong className="text-emerald-600 dark:text-emerald-400">
                    {formatINR(comparisonResult.differenceInMakingCharges)}
                  </strong>{" "}
                  ({comparisonResult.differenceInPercentage.toFixed(1)}% less) or{" "}
                  <strong>{formatINR(comparisonResult.differencePerGram)}/gram</strong> compared to the highest quote.
                </span>
              </div>
              <span className="text-muted-foreground text-[11px] shrink-0">
                Total savings with 3% GST: <strong>{formatINR(comparisonResult.differenceInTotalBillWithGst)}</strong>
              </span>
            </div>
          </motion.div>
        )}

        {/* MODE 3: NEGOTIATION & SAVINGS TOOL */}
        {calculatorMode === "negotiate" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-card to-background border-2 border-amber-500/30 shadow-md flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
              <TrendingDown className="w-4 h-4" />
              <span>Making Charge Negotiation & Rupee Savings Calculator</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current Quote Input */}
              <div className="p-4 rounded-xl bg-card border border-border/80 flex flex-col gap-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  1. Current Jeweller Quote
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <Label className="text-[10px] text-muted-foreground block mb-1">Pricing Format</Label>
                    <select
                      value={negotiateCurrentMethod}
                      onChange={(e) => setNegotiateCurrentMethod(e.target.value as MakingChargeType)}
                      className="w-full h-8 px-2 rounded-lg border border-border/70 bg-background text-xs"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="per_gram">Rupees / Gram (₹/g)</option>
                      <option value="flat">Flat Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground block mb-1">Current Value</Label>
                    <Input
                      type="number"
                      value={negotiateCurrentValue}
                      onChange={(e) => setNegotiateCurrentValue(e.target.value === "" ? "" : Number(e.target.value))}
                      className="h-8 text-xs font-bold"
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-border/50 text-xs flex justify-between font-semibold">
                  <span className="text-muted-foreground">Current Making Fee:</span>
                  <span className="font-bold text-foreground">{formatINR(negotiationResult.currentMakingCharges)}</span>
                </div>
              </div>

              {/* Target / Desired Quote Input */}
              <div className="p-4 rounded-xl bg-card border border-border/80 flex flex-col gap-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  2. Your Target Negotiated Quote
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <Label className="text-[10px] text-muted-foreground block mb-1">Pricing Format</Label>
                    <select
                      value={negotiateDesiredMethod}
                      onChange={(e) => setNegotiateDesiredMethod(e.target.value as MakingChargeType)}
                      className="w-full h-8 px-2 rounded-lg border border-border/70 bg-background text-xs"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="per_gram">Rupees / Gram (₹/g)</option>
                      <option value="flat">Flat Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground block mb-1">Target Value</Label>
                    <Input
                      type="number"
                      value={negotiateDesiredValue}
                      onChange={(e) => setNegotiateDesiredValue(e.target.value === "" ? "" : Number(e.target.value))}
                      className="h-8 text-xs font-bold text-emerald-600 dark:text-emerald-400"
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-border/50 text-xs flex justify-between font-semibold">
                  <span className="text-muted-foreground">Target Making Fee:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatINR(negotiationResult.desiredMakingCharges)}
                  </span>
                </div>
              </div>
            </div>

            {/* Negotiation Savings Summary Box */}
            <div className="p-4 rounded-xl bg-card border border-emerald-500/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-muted-foreground block font-medium">Estimated Total Savings (With 3% GST):</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {formatINR(negotiationResult.totalSavingsWithGst)}
                </span>
                <span className="text-xs text-muted-foreground block mt-0.5">
                  Pre-tax savings: {formatINR(negotiationResult.preTaxSavings)} ({negotiationResult.savingsPercentage.toFixed(1)}%) • Direct tax savings: {formatINR(negotiationResult.gstSavings)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground block font-medium">Savings Per Gram of Gold:</span>
                <span className="text-lg sm:text-xl font-bold text-foreground">
                  {formatINR(negotiationResult.savingsPerGram)} / gram
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* MODE 4: BUDGET MODE */}
        {calculatorMode === "budget" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-card to-background border-2 border-amber-500/30 shadow-md flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Wallet className="w-4 h-4" />
              <span>Budget Mode — Calculate Affordable Gold Weight</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Total Budget for Jewellery (₹)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">
                    ₹
                  </span>
                  <Input
                    type="number"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 1,50,000"
                    className="pl-8 h-12 text-base font-medium rounded-xl border-border/70 focus:border-amber-500"
                  />
                </div>

                {/* Quick Budget Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {QUICK_BUDGET_CHIPS.map((chip) => (
                    <button
                      key={chip.value}
                      type="button"
                      onClick={() => setBudgetAmount(chip.value)}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg border border-border/60 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculated Result Box */}
              <div className="p-4 rounded-xl bg-card border border-border/80 flex flex-col justify-center">
                <span className="text-xs text-muted-foreground font-medium">
                  Maximum Net Gold Weight You Can Purchase:
                </span>
                <span className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400 mt-1">
                  {budgetResult.affordableWeightGrams.toFixed(3)} <span className="text-lg font-bold text-foreground">Grams</span>
                </span>
                <span className="text-xs text-muted-foreground mt-2">
                  At ₹{Math.round(result.effectiveGoldRatePerGram).toLocaleString("en-IN")}/g ({result.purityLabel}) with {makingChargeMethod === "percentage" ? `${makingChargePercentage}%` : makingChargeMethod === "per_gram" ? `₹${makingChargePerGram}/g` : `₹${flatMakingCharge} flat`} making charges + 3% GST.
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* MAIN INPUT COLUMN */}
        <div className="calc-input-column bg-card border border-border/70 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border/50">
            <Coins className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              Gold & Making Charges Specifications (India)
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {/* 1. Gold Purity & Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Gold Purity
                </Label>
                <select
                  value={purity}
                  onChange={(e) => setPurity(e.target.value as GoldPurity)}
                  className="w-full h-11 px-3 rounded-xl border border-border/70 bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {Object.entries(PURITY_DEFINITIONS).map(([key, def]) => (
                    <option key={key} value={key}>
                      {def.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Net Gold Weight & Unit
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    min="0.001"
                    step="0.1"
                    value={goldWeight}
                    onChange={(e) => setGoldWeight(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 10"
                    className="h-11 text-sm font-semibold rounded-xl"
                  />
                  <select
                    value={weightUnit}
                    onChange={(e) => setWeightUnit(e.target.value as WeightUnit)}
                    className="h-11 px-2.5 rounded-xl border border-border/70 bg-background text-xs font-medium"
                  >
                    <option value="grams">Grams (g)</option>
                    <option value="milligrams">Milligrams (mg)</option>
                    <option value="tola">Tola (11.66g)</option>
                    <option value="pavan">Pavan / Sov. (8g)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Custom Karat Inputs if custom selected */}
            {purity === "custom" && (
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/30 border border-border/60">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Custom Karat (e.g. 21.6K)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="24"
                    step="0.1"
                    value={customKarat}
                    onChange={(e) => setCustomKarat(Number(e.target.value))}
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Fineness (%)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    step="0.01"
                    value={customFinenessPct}
                    onChange={(e) => setCustomFinenessPct(Number(e.target.value))}
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            )}

            {/* 2. Gold Rate Inputs */}
            <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-semibold text-foreground">
                  Gold Rate & Benchmark Basis
                </Label>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-mono font-bold">
                  Effective: ₹{Math.round(result.effectiveGoldRatePerGram).toLocaleString("en-IN")}/g ({result.purityLabel})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    {goldRateType === "derived_from_24k" ? "24K Benchmark Gold Rate (₹)" : "Purity-Specific Gold Rate (₹)"}
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    value={goldRate}
                    onChange={(e) => setGoldRate(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 150000"
                    className="h-10 text-sm font-semibold"
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Rate Basis</Label>
                  <select
                    value={goldRateBasis}
                    onChange={(e) => setGoldRateBasis(e.target.value as RateBasis)}
                    className="w-full h-10 px-3 rounded-lg border border-border/70 bg-background text-xs font-medium"
                  >
                    <option value="per_10g">Per 10 Grams</option>
                    <option value="per_gram">Per Gram</option>
                    <option value="per_tola">Per Tola (11.66g)</option>
                    <option value="per_pavan">Per Pavan (8g)</option>
                  </select>
                </div>
              </div>

              {/* Rate Mode Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2.5 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="goldRateType"
                    checked={goldRateType === "derived_from_24k"}
                    onChange={() => setGoldRateType("derived_from_24k")}
                    className="accent-amber-500 cursor-pointer"
                  />
                  <span>Derived from 24K benchmark bullion rate</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="goldRateType"
                    checked={goldRateType === "direct"}
                    onChange={() => setGoldRateType("direct")}
                    className="accent-amber-500 cursor-pointer"
                  />
                  <span>Direct rate for selected purity</span>
                </label>
              </div>

              {/* Quick Rate Select Chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {QUICK_RATE_CHIPS.map((chip) => (
                  <button
                    key={chip.value}
                    type="button"
                    onClick={() => {
                      setGoldRate(chip.value);
                      setGoldRateBasis("per_10g");
                    }}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg border border-border/60 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. CORE MAKING CHARGE PRICING METHOD (PRIMARY CONTROL) */}
            <div className="p-4 rounded-xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/5 to-transparent flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="text-xs sm:text-sm font-bold text-foreground">
                    Making Charge Pricing Method
                  </Label>
                </div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  Total: {formatINR(result.netMakingCharges)}
                </span>
              </div>

              {/* 3-Way Segmented Control */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-muted/40 rounded-xl">
                <button
                  type="button"
                  onClick={() => setMakingChargeMethod("percentage")}
                  className={`py-2 px-1 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer text-center ${
                    makingChargeMethod === "percentage"
                      ? "bg-amber-500 text-white shadow-sm font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <span className="block sm:inline">Percentage</span>
                  <span className="text-[11px] block sm:inline sm:ml-1 opacity-80">(% of Gold)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMakingChargeMethod("per_gram")}
                  className={`py-2 px-1 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer text-center ${
                    makingChargeMethod === "per_gram"
                      ? "bg-amber-500 text-white shadow-sm font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <span className="block sm:inline">Per Gram</span>
                  <span className="text-[11px] block sm:inline sm:ml-1 opacity-80">(₹ / g)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMakingChargeMethod("flat")}
                  className={`py-2 px-1 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer text-center ${
                    makingChargeMethod === "flat"
                      ? "bg-amber-500 text-white shadow-sm font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <span className="block sm:inline">Flat Charge</span>
                  <span className="text-[11px] block sm:inline sm:ml-1 opacity-80">(₹ Fixed)</span>
                </button>
              </div>

              {/* METHOD 1: PERCENTAGE INPUT */}
              {makingChargeMethod === "percentage" && (
                <div className="pt-2 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Making Charge Percentage (%)</Label>
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                      = ₹{Math.round(result.makingChargePerGram).toLocaleString("en-IN")}/g
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={makingChargePercentage}
                      onChange={(e) => setMakingChargePercentage(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="e.g. 8"
                      className="h-10 text-sm font-bold pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">
                      %
                    </span>
                  </div>

                  {/* Quick Percentage Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {QUICK_PERCENT_CHIPS.map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setMakingChargePercentage(pct)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-lg border cursor-pointer transition-all ${
                          makingChargePercentage === pct
                            ? "border-amber-500 bg-amber-500/10 text-amber-600 font-bold"
                            : "border-border/60 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* METHOD 2: PER-GRAM INPUT */}
              {makingChargeMethod === "per_gram" && (
                <div className="pt-2 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Making Charge Per Gram (₹/g)</Label>
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                      = {result.makingChargePercentageEquivalent.toFixed(2)}% of Gold
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">
                      ₹
                    </span>
                    <Input
                      type="number"
                      min="0"
                      step="10"
                      value={makingChargePerGram}
                      onChange={(e) => setMakingChargePerGram(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="e.g. 500"
                      className="h-10 text-sm font-bold pl-8"
                    />
                  </div>

                  {/* Quick Per-Gram Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {QUICK_PER_GRAM_CHIPS.map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setMakingChargePerGram(rate)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-lg border cursor-pointer transition-all ${
                          makingChargePerGram === rate
                            ? "border-amber-500 bg-amber-500/10 text-amber-600 font-bold"
                            : "border-border/60 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        ₹{rate}/g
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* METHOD 3: FLAT CHARGE INPUT */}
              {makingChargeMethod === "flat" && (
                <div className="pt-2 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Flat Making Charge Amount (₹)</Label>
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                      = ₹{Math.round(result.makingChargePerGram).toLocaleString("en-IN")}/g ({result.makingChargePercentageEquivalent.toFixed(2)}%)
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">
                      ₹
                    </span>
                    <Input
                      type="number"
                      min="0"
                      step="100"
                      value={flatMakingCharge}
                      onChange={(e) => setFlatMakingCharge(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="e.g. 8000"
                      className="h-10 text-sm font-bold pl-8"
                    />
                  </div>

                  {/* Quick Flat Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {QUICK_FLAT_CHIPS.map((flat) => (
                      <button
                        key={flat}
                        type="button"
                        onClick={() => setFlatMakingCharge(flat)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-lg border cursor-pointer transition-all ${
                          flatMakingCharge === flat
                            ? "border-amber-500 bg-amber-500/10 text-amber-600 font-bold"
                            : "border-border/60 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        ₹{flat.toLocaleString("en-IN")}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 1: Optional Wastage / Value Addition */}
            <div className="border border-border/60 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("wastage")}
                className="w-full px-4 py-3 bg-muted/30 hover:bg-muted/50 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-500" />
                  <span className="text-xs sm:text-sm font-semibold text-foreground">
                    Optional Wastage / Value Addition Fee
                  </span>
                  {result.wastageValue > 0 && (
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      +{formatINR(result.wastageValue)}
                    </span>
                  )}
                </div>
                {openSections.wastage ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {openSections.wastage && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 border-t border-border/60 flex flex-col gap-3 bg-background"
                  >
                    <div className="text-xs text-muted-foreground">
                      Most branded jewellers include wastage inside making charges. If your jeweller adds a separate wastage charge, enter it here.
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Wastage Calculation Method</Label>
                        <select
                          value={wastageType}
                          onChange={(e) => setWastageType(e.target.value as WastageType)}
                          className="w-full h-9 px-2 rounded-lg border border-border/70 bg-background text-xs font-medium"
                        >
                          <option value="none">No Wastage (Included in Making)</option>
                          <option value="percentage">Percentage of Gold (%)</option>
                          <option value="weight_grams">Additional Weight (Grams)</option>
                          <option value="flat">Fixed Rupee Amount (₹)</option>
                        </select>
                      </div>

                      {wastageType !== "none" && (
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">
                            {wastageType === "percentage"
                              ? "Wastage Percentage (%)"
                              : wastageType === "weight_grams"
                              ? "Wastage Weight (Grams)"
                              : "Flat Wastage (₹)"}
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.1"
                            value={wastageValue}
                            onChange={(e) => setWastageValue(e.target.value === "" ? "" : Number(e.target.value))}
                            className="h-9 text-xs font-bold"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 2: Optional Discounts on Making Charges */}
            <div className="border border-border/60 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("discount")}
                className="w-full px-4 py-3 bg-muted/30 hover:bg-muted/50 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs sm:text-sm font-semibold text-foreground">
                    Optional Making Charge Discount / Offer
                  </span>
                  {result.makingChargeDiscount > 0 && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      -{formatINR(result.makingChargeDiscount)}
                    </span>
                  )}
                </div>
                {openSections.discount ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {openSections.discount && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 border-t border-border/60 flex flex-col gap-3 bg-background"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Discount Type</Label>
                        <select
                          value={discountType}
                          onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                          className="w-full h-9 px-2 rounded-lg border border-border/70 bg-background text-xs font-medium"
                        >
                          <option value="none">No Discount</option>
                          <option value="percentage">Percentage Discount on Making (%)</option>
                          <option value="flat">Flat Rupee Discount on Making (₹)</option>
                        </select>
                      </div>

                      {discountType !== "none" && (
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">
                            {discountType === "percentage" ? "Discount Percentage (%)" : "Discount Amount (₹)"}
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            value={discountValue}
                            onChange={(e) => setDiscountValue(e.target.value === "" ? "" : Number(e.target.value))}
                            className="h-9 text-xs font-bold text-emerald-600 dark:text-emerald-400"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 3: GST Settings */}
            <div className="border border-border/60 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("gst")}
                className="w-full px-4 py-3 bg-muted/30 hover:bg-muted/50 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-blue-500" />
                  <span className="text-xs sm:text-sm font-semibold text-foreground">
                    GST Settings (Official CBIC 3% Retail Rule)
                  </span>
                </div>
                {openSections.gst ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {openSections.gst && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 border-t border-border/60 flex flex-col gap-3 bg-background"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">GST Rate (%)</Label>
                        <Input
                          type="number"
                          value={gstRatePct}
                          disabled
                          className="h-9 text-xs font-bold bg-muted/50"
                        />
                        <span className="text-[10px] text-muted-foreground mt-0.5 block">
                          Official statutory retail rate is 3% uniformly across India.
                        </span>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Transaction Jurisdiction</Label>
                        <select
                          value={gstTransactionType}
                          onChange={(e) => setGstTransactionType(e.target.value as GstTransactionType)}
                          className="w-full h-9 px-2 rounded-lg border border-border/70 bg-background text-xs font-medium"
                        >
                          <option value="intra_state">Intra-State (1.5% CGST + 1.5% SGST)</option>
                          <option value="inter_state">Inter-State (3% IGST)</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row gap-3 mt-2">
              <CalculateButton
                category="jewellery"
                className="flex-1 min-h-12 text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-md cursor-pointer"
                disabled={!goldRate || Number(goldWeight) <= 0}
                onClick={markCalculated}
              >
                <span className="sm:hidden">Calculate Making Fee</span>
                <span className="hidden sm:inline">Calculate Gold Making Charges</span>
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

        {/* RESULTS PRESENTATION DASHBOARD */}
        {hasResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            {/* Prominent HeroMetric */}
            <HeroMetric
              label="Estimated Total Making Charges"
              value={formatINR(result.netMakingCharges)}
              sub={`Equivalent to ₹${Math.round(result.makingChargePerGram).toLocaleString("en-IN")}/gram (${result.makingChargePercentageEquivalent.toFixed(2)}% of gold value) • GST on Making: ${formatINR(result.gstOnMakingCharges)}`}
              glow="#f59e0b"
            />

            {/* 4 StatCards */}
            <DashboardSection title="Making Charges & Jewellery Overview">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard
                  index={0}
                  label="Pure Gold Value"
                  value={formatINR(result.rawGoldValue)}
                  accent="amber"
                  badge={`${result.purityLabel}`}
                />
                <StatCard
                  index={1}
                  label="Total Making Charges"
                  value={formatINR(result.netMakingCharges)}
                  accent="blue"
                  badge={`₹${Math.round(result.makingChargePerGram)}/g`}
                />
                <StatCard
                  index={2}
                  label="Equivalent Rate (10g)"
                  value={formatINR(result.makingChargePer10g)}
                  accent="purple"
                  badge={`${result.makingChargePercentageEquivalent.toFixed(1)}% Eqv`}
                />
                <StatCard
                  index={3}
                  label="Total Bill (3% GST)"
                  value={formatINR(result.finalTotalJewelleryAmount)}
                  accent="green"
                  badge="All-Inclusive"
                />
              </div>
            </DashboardSection>

            {/* EQUIVALENT PRICING CONVERSION MATRIX (CalcZen Unique Feature) */}
            <DashboardSection
              title="Normalized Equivalent Pricing Matrix"
              description="Compare any quotation directly by viewing your making charge across all 3 Indian retail formats."
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl border border-border/80 bg-card flex flex-col justify-between">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Total Rupee Fee
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                    {formatINR(result.netMakingCharges)}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    {result.originalMakingCharges > result.netMakingCharges
                      ? `After ₹${Math.round(result.makingChargeDiscount).toLocaleString("en-IN")} discount`
                      : "Net payable making fee"}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-border/80 bg-card flex flex-col justify-between">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Making Per Gram
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-foreground mt-1">
                    ₹{result.makingChargePerGram.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    Divided across {result.goldWeightGrams.toFixed(2)}g gold
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-border/80 bg-card flex flex-col justify-between">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Equivalent Percentage
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                    {result.makingChargePercentageEquivalent.toFixed(2)}%
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    Of raw gold value ({formatINR(result.rawGoldValue)})
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-border/80 bg-card flex flex-col justify-between">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Rate Per 10 Grams
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
                    {formatINR(result.makingChargePer10g)}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    Standard Indian bullion unit
                  </span>
                </div>
              </div>
            </DashboardSection>

            {/* ITEMISED COST BREAKDOWN & CHART GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Cost Breakdown Table */}
              <DashboardSection title="Complete Bill Cost Impact">
                <div className="rounded-xl border border-border/70 overflow-hidden bg-card text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground">
                      <tr>
                        <th className="p-3 font-semibold">Billing Component</th>
                        <th className="p-3 font-semibold text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      <tr>
                        <td className="p-3 font-medium text-foreground">
                          Pure Gold Value ({result.goldWeightGrams.toFixed(3)}g @ ₹{Math.round(result.effectiveGoldRatePerGram).toLocaleString("en-IN")}/g)
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-foreground">
                          {formatINR(result.rawGoldValue)}
                        </td>
                      </tr>

                      <tr>
                        <td className="p-3 font-medium text-foreground">
                          Making Charges ({result.selectedMethod === "percentage" ? `${makingChargePercentage}%` : result.selectedMethod === "per_gram" ? `₹${makingChargePerGram}/g` : "Flat Fee"})
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                          {formatINR(result.originalMakingCharges)}
                        </td>
                      </tr>

                      {result.makingChargeDiscount > 0 && (
                        <tr className="text-emerald-600 dark:text-emerald-400">
                          <td className="p-3 font-medium">
                            Discount on Making Charges ({discountType === "percentage" ? `${discountValue}%` : "Flat"})
                          </td>
                          <td className="p-3 text-right font-mono font-bold">
                            -{formatINR(result.makingChargeDiscount)}
                          </td>
                        </tr>
                      )}

                      {result.wastageValue > 0 && (
                        <tr>
                          <td className="p-3 font-medium text-foreground">
                            Wastage / Value Addition Fee ({result.wastageEquivalentPct.toFixed(1)}%)
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-foreground">
                            +{formatINR(result.wastageValue)}
                          </td>
                        </tr>
                      )}

                      <tr className="bg-muted/20 font-semibold text-foreground">
                        <td className="p-3">Taxable Transaction Subtotal</td>
                        <td className="p-3 text-right font-mono font-bold">
                          {formatINR(result.taxableTransactionValue)}
                        </td>
                      </tr>

                      {gstTransactionType === "intra_state" ? (
                        <>
                          <tr className="text-muted-foreground">
                            <td className="p-3">CGST (1.5%)</td>
                            <td className="p-3 text-right font-mono">
                              {formatINRWithDecimals(result.cgstAmount)}
                            </td>
                          </tr>
                          <tr className="text-muted-foreground">
                            <td className="p-3">SGST (1.5%)</td>
                            <td className="p-3 text-right font-mono">
                              {formatINRWithDecimals(result.sgstAmount)}
                            </td>
                          </tr>
                        </>
                      ) : (
                        <tr className="text-muted-foreground">
                          <td className="p-3">IGST (3.0%)</td>
                          <td className="p-3 text-right font-mono">
                            {formatINRWithDecimals(result.igstAmount)}
                          </td>
                        </tr>
                      )}

                      <tr className="bg-amber-500/10 border-t-2 border-amber-500/40">
                        <td className="p-3 font-extrabold text-foreground text-sm">
                          Estimated Final Jewellery Total
                        </td>
                        <td className="p-3 text-right font-mono text-base font-extrabold text-amber-600 dark:text-amber-400">
                          {formatINR(result.finalTotalJewelleryAmount)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </DashboardSection>

              {/* Chart: Bill Composition Donut */}
              <DashboardSection title="Bill Share Breakdown">
                <div className="bg-card border border-border/70 rounded-xl p-4 flex flex-col items-center justify-center min-h-[260px]">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={3}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val: number) => formatINR(val)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <span className="text-[11px] text-muted-foreground mt-2 text-center">
                    Making charges account for <strong>{result.makingChargesShareOfPreTaxPct.toFixed(1)}%</strong> of your pre-tax bill.
                  </span>
                </div>
              </DashboardSection>
            </div>

            {/* Dynamic Data-Driven Insights */}
            <DashboardSection title="Data-Driven Making Charge Insights">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dynamicInsights.map((insight, idx) => (
                  <InsightCard
                    key={idx}
                    title={insight.title}
                    text={insight.text}
                    type={insight.type === "tip" ? "tip" : insight.type === "tax" ? "info" : "success"}
                  />
                ))}
              </div>
            </DashboardSection>

            {/* Export & Share Bar */}
            <div className="p-4 rounded-xl bg-card border border-border/70 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Computed per official CBIC GST guidance & BIS hallmarking standards.</span>
              </div>
              <div className="flex items-center gap-2">
                <CalculatorPdfExport
                  calculatorTitle="Gold Making Charges Calculator"
                  category="Jewellery"
                  inputs={[
                    { label: "Purity", value: result.purityLabel },
                    { label: "Net Gold Weight", value: `${result.goldWeightGrams} g` },
                    { label: "Gold Rate", value: `₹${Math.round(result.effectiveGoldRatePerGram).toLocaleString("en-IN")}/g` },
                    { label: "Making Pricing Method", value: result.selectedMethod },
                  ]}
                  results={[
                    { label: "Net Making Charges", value: formatINR(result.netMakingCharges) },
                    { label: "Making Charge Per Gram", value: `₹${result.makingChargePerGram.toFixed(2)}/g` },
                    { label: "Equivalent Percentage", value: `${result.makingChargePercentageEquivalent.toFixed(2)}%` },
                    { label: "Taxable Value", value: formatINR(result.taxableTransactionValue) },
                    { label: "GST (3%)", value: formatINR(result.totalGstAmount) },
                    { label: "Estimated Final Total", value: formatINR(result.finalTotalJewelleryAmount) },
                  ]}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </CalculatorPageLayout>
  );
}

