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
  ChevronDown,
  ChevronUp,
  Coins,
  Gem,
  HelpCircle,
  Info,
  Layers,
  Percent,
  Receipt,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
  Tag,
  TrendingDown,
  Wallet,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  calculateFinalJewelleryBill,
  calculateBudgetBasedWeight,
  compareTwoJewellerQuotes,
  generateJewelleryInsights,
  formatINR,
  formatINRWithDecimals,
  PURITY_DEFINITIONS,
  WEIGHT_UNIT_CONVERSIONS,
  type GoldPurity,
  type WeightUnit,
  type RateBasis,
  type RateType,
  type MakingChargeType,
  type WastageType,
  type DiscountType,
  type DiscountApplyOn,
  type GstTransactionType,
  type JewelleryBillInputs,
  type CalculatedJewelleryBill,
} from "@/utils/jewelleryCalculatorUtils";

const blogContent: BlogContent = {
  primaryKeyword: "Gold Jewellery Bill Calculator India",
  category: "jewellery",
  introText:
    "Purchasing gold jewellery in India is both a cherished cultural tradition and an important financial investment. However, understanding how a retail jeweller calculates your final bill can often be confusing. Between fluctuating daily gold rates, gold purity conversions (24K vs 22K 916), making charges, wastage (value addition), gemstone weight deductions, and the mandatory 3% GST, consumers frequently struggle to determine whether they are receiving a fair quotation. CalcZen's Gold Jewellery Bill Calculator breaks down every single component of your jewellery bill with complete mathematical transparency according to official Bureau of Indian Standards (BIS) and CBIC GST guidelines.",
  sections: [
    {
      title: "Anatomy of an Indian Gold Jewellery Bill",
      paragraphs: [
        "In India, every legitimate gold jewellery tax invoice (under HSN Code 7113) must distinctly separate raw gold value from craftsmanship and taxation charges. The standard billing formula is structured as follows:",
        "- **Gold Value:** Net gold weight (in grams) multiplied by the jeweller's gold rate per gram for that specific purity (e.g. 22K, 18K).",
        "- **Making Charges:** The fee charged for the craftsmanship, design complexity, and labour required to convert gold bullion into jewellery.",
        "- **Wastage (Value Addition):** A legacy charge representing gold nominally lost during melting and polishing. Many modern branded jewellers combine wastage directly into making charges.",
        "- **Precious Stones & Diamonds:** The standalone monetary value of any embedded diamonds, rubies, emeralds, or pearls. Crucially, ethical jewellers always deduct stone weight from the gross weight so you do not pay gold rates for stones.",
        "- **BIS Hallmarking Fee:** A statutory verification fee (standardized at ₹45 + 18% GST = ~₹53.10 per jewellery piece) certifying the purity of your gold with a 6-digit Hallmark Unique Identification (HUID).",
        "- **GST (Goods and Services Tax):** A flat 3% tax levied on the total pre-tax transaction value of the jewellery.",
      ],
      callout: {
        type: "quickFact",
        title: "The Standard Indian Jewellery Billing Formula",
        text: "Final Bill = [ (Net Gold Weight × Purity Rate) + Making Charges + Wastage + Stones + Hallmarking - Eligible Discounts ] × 1.03 (3% GST).",
      },
    },
    {
      title: "Understanding Gold Purity: 24K, 22K 916 and 18K",
      paragraphs: [
        "Pure gold in its unalloyed state is 24 Karats (99.9% pure, hallmark 999). However, 24K gold is extremely malleable and soft, making it unsuitable for crafting intricate jewellery that holds its shape. To create durable ornaments, pure gold is alloyed with strengthening metals such as copper, zinc, or silver:",
        "- **22K Gold (916 Hallmarked):** Contains 22 parts gold and 2 parts alloy (91.67% pure gold). This is the undisputed industry standard for traditional Indian bridal necklaces, bangles, and chains.",
        "- **18K Gold (750 Hallmarked):** Contains 18 parts gold and 6 parts alloy (75.0% pure gold). Its higher hardness makes it the gold standard for diamond-studded jewellery, rings, and watches.",
        "- **14K Gold (585 Hallmarked):** Contains 14 parts gold and 10 parts alloy (58.5% pure gold), popular for lightweight, affordable contemporary daily-wear accessories.",
      ],
      formulaBox: {
        title: "Deriving 22K Gold Rate from 24K Benchmark Rate",
        formula: "22K Gold Rate per Gram = 24K Rate per Gram × (22 / 24)\nExample: ₹15,000 × (22 / 24) = ₹13,750 per gram",
        variables: [
          { name: "24K Benchmark Rate", desc: "Standard bullion spot rate per gram." },
          { name: "22/24 Fineness Ratio", desc: "91.67% purity factor specified by BIS standards." },
        ],
      },
    },
    {
      title: "Making Charges vs Wastage: How to Avoid Paying Twice",
      paragraphs: [
        "One of the biggest areas of confusion—and potential overcharging—in jewellery billing lies in making charges and wastage:",
        "- **Percentage vs Per-Gram Making Charges:** Handcrafted or temple jewellery can command making charges of 12% to 25%, whereas plain machine-made chains and coins often carry making charges of only 6% to 10%, or a flat rate of ₹350 to ₹600 per gram.",
        "- **The Wastage Myth:** In ancient hand-casting methods, jewellers suffered 5% to 10% gold loss during soldering and polishing. Modern induction melting and laser cutting have reduced actual loss to less than 1%. However, some traditional jewellers still add a separate 5% to 8% 'wastage' fee on top of high making charges. When negotiating, ask for an all-inclusive making charge to avoid paying for craftsmanship twice.",
      ],
    },
    {
      title: "Official CBIC GST Rules for Retail Gold Jewellery",
      paragraphs: [
        "Under official Central Board of Indirect Taxes and Customs (CBIC) sector guidelines, retail gold jewellery sales to end customers are subject to a **flat 3% GST** on the entire taxable transaction value.",
        "- **Intra-State Sales:** Split equally as **1.5% CGST** (Central GST) and **1.5% SGST** (State GST).",
        "- **Inter-State Sales:** Levied as **3% IGST** (Integrated GST).",
        "- **Debunking the Competitor Split:** Some third-party online calculators erroneously apply 3% GST on gold and 5% GST on making charges. CBIC has clarified that when a customer buys jewellery from a jeweller, it constitutes a single composite supply of goods taxed uniformly at 3%, whether making charges are displayed as a separate line item or not.",
      ],
    },
    {
      title: "Mandatory BIS Hallmarking & HUID Verification",
      paragraphs: [
        "Under Bureau of Indian Standards (BIS) regulations, hallmarking is legally mandatory across India for gold jewellery. Every genuine hallmarked jewellery piece must carry three distinct laser-engraved symbols:",
        "1. **BIS Triangular Logo:** Certifies government testing standards compliance.",
        "2. **Purity / Fineness Mark:** Explicitly stamped as 22K916, 18K750, 14K585, etc.",
        "3. **6-Digit Alphanumeric HUID:** A unique identifier traceable in the official 'BIS CARE' mobile application to verify weight, purity, testing date, and the certifying Assaying and Hallmarking Centre (AHC).",
      ],
    },
  ],
  faqs: [
    {
      q: "How does this calculator compute the final gold jewellery bill?",
      a: "The calculator determines: (1) Net gold weight (deducting any stone weight from gross weight), (2) Purity-adjusted gold rate per gram, (3) Total raw gold value, (4) Making charges based on percentage, per-gram, or flat amount, (5) Optional wastage charges, (6) Diamonds, gemstones, and hallmarking charges, (7) Eligible discounts applied before tax, and (8) Official 3% GST (1.5% CGST + 1.5% SGST) on the final pre-tax transaction value.",
    },
    {
      q: "What is the difference between Gross Weight and Net Gold Weight?",
      a: "Gross Weight is the total weight of the finished jewellery item on the weighing scale, including gold, gemstones, pearls, enamel, and threading. Net Gold Weight is the actual weight of the gold metal alone. Jewellers must weigh and bill gemstones separately, and should NEVER charge gold rates for stone weight.",
    },
    {
      q: "Why do making charges vary between different jewellers?",
      a: "Making charges vary depending on craftsmanship complexity, brand overhead, and production method. Plain machine-made gold chains generally range from 6% to 10% making charges. Intricate filigree, antique temple jewellery, and designer bridal sets can range from 15% to 25%. Making charges are almost always negotiable.",
    },
    {
      q: "Can I calculate how much gold weight I can buy within my budget?",
      a: "Yes. Use our 'Budget to Gold Weight' mode. Simply enter your budget (e.g. ₹1,00,000), and the calculator will automatically reverse-calculate the exact gold weight in grams you can purchase, factoring in the current gold rate, making charges, and 3% GST.",
    },
    {
      q: "How does Old Gold Exchange work when buying new jewellery?",
      a: "When trading in old gold, jewellers weigh your old jewellery, test its purity, and value it at the prevailing buyback rate. If your old jewellery is hallmarked, deductions are minimal (0% to 1%). If unhallmarked, jewellers typically deduct 2% to 5% for melting and refining losses. The net exchange credit is directly subtracted from your new jewellery bill.",
    },
    {
      q: "Is GST charged on making charges or only on gold?",
      a: "As per CBIC guidelines for retail jewellery sales, GST is charged at a flat 3% on the total composite transaction value (gold value + making charges + wastage + stones). You do not pay 5% on making charges for standard retail jewellery purchases.",
    },
    {
      q: "What is the standard weight of 1 Tola and 1 Pavan in grams?",
      a: "In India: 1 Tola = 11.6638 grams (traditionally 180 troy grains). 1 Pavan (also known as a Sovereign in South India) = exactly 8.00 grams.",
    },
  ],
};

const QUICK_RATE_CHIPS = [
  { label: "₹75,000 / 10g", value: 75000 },
  { label: "₹80,000 / 10g", value: 80000 },
  { label: "₹85,000 / 10g", value: 85000 },
  { label: "₹90,000 / 10g", value: 90000 },
  { label: "₹1,50,000 / 10g", value: 150000 },
];

const QUICK_BUDGET_CHIPS = [
  { label: "₹50,000", value: 50000 },
  { label: "₹1,00,000", value: 100000 },
  { label: "₹1,50,000", value: 150000 },
  { label: "₹2,50,000", value: 250000 },
  { label: "₹5,00,000", value: 500000 },
];

export function GoldJewelleryBillCalculator() {
  const calc = getCalculator("gold-jewellery-bill-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  // Mode Selection: Standard Bill | Budget to Weight | Compare Two Quotations
  const [calculatorMode, setCalculatorMode] = useState<"standard" | "budget" | "compare">(
    "standard"
  );

  // SECTION A: Core Gold Inputs
  const [itemName, setItemName] = useState<string>("22K Gold Chain");
  const [purity, setPurity] = useState<GoldPurity>("22k-916");
  const [customKarat, setCustomKarat] = useState<number>(22);
  const [customFinenessPct, setCustomFinenessPct] = useState<number>(91.67);

  // Weight State
  const [weightInputMode, setWeightInputMode] = useState<"net_weight" | "gross_weight">(
    "net_weight"
  );
  const [netWeight, setNetWeight] = useState<number | "">(10);
  const [netWeightUnit, setNetWeightUnit] = useState<WeightUnit>("grams");
  const [grossWeight, setGrossWeight] = useState<number | "">(12);
  const [grossWeightUnit, setGrossWeightUnit] = useState<WeightUnit>("grams");
  const [nonGoldWeight, setNonGoldWeight] = useState<number | "">(2);
  const [nonGoldWeightUnit, setNonGoldWeightUnit] = useState<WeightUnit>("grams");

  // Gold Rate State
  const [goldRate, setGoldRate] = useState<number | "">(150000);
  const [goldRateBasis, setGoldRateBasis] = useState<RateBasis>("per_10g");
  const [goldRateType, setGoldRateType] = useState<RateType>("derived_from_24k");

  // SECTION B: Making Charges & Wastage
  const [makingChargeType, setMakingChargeType] = useState<MakingChargeType>("percentage");
  const [makingChargeValue, setMakingChargeValue] = useState<number | "">(8);
  const [wastageType, setWastageType] = useState<WastageType>("none");
  const [wastageValue, setWastageValue] = useState<number | "">(0);

  // SECTION C: Stones & Extras (Collapsible)
  const [diamondValue, setDiamondValue] = useState<number | "">(0);
  const [gemstoneValue, setGemstoneValue] = useState<number | "">(0);
  const [otherStonesValue, setOtherStonesValue] = useState<number | "">(0);
  const [hallmarkingCharge, setHallmarkingCharge] = useState<number | "">(45);
  const [certificationCharge, setCertificationCharge] = useState<number | "">(0);
  const [packagingCharge, setPackagingCharge] = useState<number | "">(0);

  // SECTION D: Discounts & GST (Collapsible)
  const [discountType, setDiscountType] = useState<DiscountType>("none");
  const [discountValue, setDiscountValue] = useState<number | "">(0);
  const [discountApplyOn, setDiscountApplyOn] = useState<DiscountApplyOn>("making_charges");
  const [gstRatePct, setGstRatePct] = useState<number>(3);
  const [gstTransactionType, setGstTransactionType] = useState<GstTransactionType>("intra_state");

  // SECTION E: Old Gold Exchange & Advance (Collapsible)
  const [enableOldGoldExchange, setEnableOldGoldExchange] = useState<boolean>(false);
  const [oldGoldNetWeight, setOldGoldNetWeight] = useState<number | "">(0);
  const [oldGoldWeightUnit, setOldGoldWeightUnit] = useState<WeightUnit>("grams");
  const [oldGoldBuybackRate, setOldGoldBuybackRate] = useState<number | "">(0);
  const [oldGoldDeductionPct, setOldGoldDeductionPct] = useState<number>(2);
  const [advancePaymentPaid, setAdvancePaymentPaid] = useState<number | "">(0);

  // Accordion Toggles
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    stones: false,
    discounts: false,
    exchange: false,
  });

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  // Budget to Weight Mode State
  const [budgetAmount, setBudgetAmount] = useState<number | "">(150000);

  // Compare Mode State (Jeweller A vs Jeweller B)
  const [jewellerBRate, setJewellerBRate] = useState<number | "">(148000);
  const [jewellerBMakingType, setJewellerBMakingType] = useState<MakingChargeType>("percentage");
  const [jewellerBMakingValue, setJewellerBMakingValue] = useState<number | "">(12);
  const [jewellerBWastageType, setJewellerBWastageType] = useState<WastageType>("percentage");
  const [jewellerBWastageValue, setJewellerBWastageValue] = useState<number | "">(2);

  // Compile standard inputs
  const currentInputs: JewelleryBillInputs = useMemo(() => {
    return {
      itemName,
      purity,
      customKarat: Number(customKarat) || 22,
      customFinenessPct: Number(customFinenessPct) || 91.67,
      weightInputMode,
      grossWeight: Number(grossWeight) || 0,
      grossWeightUnit,
      nonGoldWeight: Number(nonGoldWeight) || 0,
      nonGoldWeightUnit,
      netWeight: Number(netWeight) || 0,
      netWeightUnit,
      goldRate: Number(goldRate) || 0,
      goldRateBasis,
      goldRateType,
      makingChargeType,
      makingChargeValue: Number(makingChargeValue) || 0,
      wastageType,
      wastageValue: Number(wastageValue) || 0,
      diamondValue: Number(diamondValue) || 0,
      gemstoneValue: Number(gemstoneValue) || 0,
      otherStonesValue: Number(otherStonesValue) || 0,
      pearlsValue: 0,
      hallmarkingCharge: Number(hallmarkingCharge) || 0,
      certificationCharge: Number(certificationCharge) || 0,
      packagingCharge: Number(packagingCharge) || 0,
      otherServiceCharge: 0,
      discountType,
      discountValue: Number(discountValue) || 0,
      discountApplyOn,
      gstRatePct: Number(gstRatePct) || 3,
      gstTransactionType,
      enableOldGoldExchange,
      oldGoldNetWeight: Number(oldGoldNetWeight) || 0,
      oldGoldWeightUnit,
      oldGoldBuybackRatePerGram: Number(oldGoldBuybackRate) || 0,
      oldGoldDeductionPct: Number(oldGoldDeductionPct) || 0,
      advancePaymentPaid: Number(advancePaymentPaid) || 0,
    };
  }, [
    itemName,
    purity,
    customKarat,
    customFinenessPct,
    weightInputMode,
    grossWeight,
    grossWeightUnit,
    nonGoldWeight,
    nonGoldWeightUnit,
    netWeight,
    netWeightUnit,
    goldRate,
    goldRateBasis,
    goldRateType,
    makingChargeType,
    makingChargeValue,
    wastageType,
    wastageValue,
    diamondValue,
    gemstoneValue,
    otherStonesValue,
    hallmarkingCharge,
    certificationCharge,
    packagingCharge,
    discountType,
    discountValue,
    discountApplyOn,
    gstRatePct,
    gstTransactionType,
    enableOldGoldExchange,
    oldGoldNetWeight,
    oldGoldWeightUnit,
    oldGoldBuybackRate,
    oldGoldDeductionPct,
    advancePaymentPaid,
  ]);

  // Main Calculation Result
  const result: CalculatedJewelleryBill = useMemo(() => {
    return calculateFinalJewelleryBill(currentInputs);
  }, [currentInputs]);

  // Quotation Comparison Result (Mode 3)
  const quoteComparison = useMemo(() => {
    const inputsB: JewelleryBillInputs = {
      ...currentInputs,
      goldRate: Number(jewellerBRate) || 0,
      makingChargeType: jewellerBMakingType,
      makingChargeValue: Number(jewellerBMakingValue) || 0,
      wastageType: jewellerBWastageType,
      wastageValue: Number(jewellerBWastageValue) || 0,
    };
    return compareTwoJewellerQuotes(currentInputs, inputsB);
  }, [
    currentInputs,
    jewellerBRate,
    jewellerBMakingType,
    jewellerBMakingValue,
    jewellerBWastageType,
    jewellerBWastageValue,
  ]);

  // Budget to Weight Result (Mode 2)
  const budgetWeightGrams = useMemo(() => {
    const b = Number(budgetAmount) || 0;
    const mcPct =
      makingChargeType === "percentage"
        ? Number(makingChargeValue) || 0
        : (Number(makingChargeValue) / (result.effectiveGoldRatePerGram || 1)) * 100;
    const wPct = wastageType === "percentage" ? Number(wastageValue) || 0 : 0;
    return calculateBudgetBasedWeight(
      b,
      result.effectiveGoldRatePerGram,
      mcPct,
      wPct,
      gstRatePct,
      Number(hallmarkingCharge) || 0
    );
  }, [
    budgetAmount,
    result.effectiveGoldRatePerGram,
    makingChargeType,
    makingChargeValue,
    wastageType,
    wastageValue,
    gstRatePct,
    hallmarkingCharge,
  ]);

  // Rule-based insights
  const insights = useMemo(() => {
    return generateJewelleryInsights(result);
  }, [result]);

  // Chart Data: Composition Pie
  const compositionData = useMemo(() => {
    return [
      { name: "Gold Value", value: Math.round(result.rawGoldValue), color: "#f59e0b" },
      { name: "Making Charges", value: Math.round(result.makingCharges), color: "#3b82f6" },
      { name: "Wastage", value: Math.round(result.wastageCharges), color: "#f97316" },
      { name: "Stones & Extras", value: Math.round(result.totalStoneValue + result.totalExtraCharges), color: "#8b5cf6" },
      { name: "GST (3%)", value: Math.round(result.totalGstAmount), color: "#10b981" },
    ].filter((item) => item.value > 0);
  }, [result]);

  // Chart Data: Gold vs Surcharges Bar
  const comparisonBarData = useMemo(() => {
    return [
      {
        name: "Bill Components",
        "Raw Gold Value": Math.round(result.rawGoldValue),
        "Making & Wastage": Math.round(result.totalMakingAndWastage),
        "Taxes & Extras": Math.round(result.totalGstAmount + result.totalStoneValue + result.totalExtraCharges),
      },
    ];
  }, [result]);

  // Handle Reset
  const handleReset = () => {
    setNetWeight(10);
    setGrossWeight(12);
    setNonGoldWeight(2);
    setGoldRate(150000);
    setGoldRateBasis("per_10g");
    setGoldRateType("derived_from_24k");
    setPurity("22k-916");
    setMakingChargeType("percentage");
    setMakingChargeValue(8);
    setWastageType("none");
    setWastageValue(0);
    setDiamondValue(0);
    setGemstoneValue(0);
    setDiscountValue(0);
    setEnableOldGoldExchange(false);
    setAdvancePaymentPaid(0);
    resetCalculated();
  };

  // Handle Load Sample
  const handleLoadSample = () => {
    setNetWeight(15);
    setPurity("22k-916");
    setGoldRate(150000);
    setGoldRateBasis("per_10g");
    setGoldRateType("derived_from_24k");
    setMakingChargeType("percentage");
    setMakingChargeValue(10);
    setWastageType("none");
    setWastageValue(0);
    setHallmarkingCharge(45);
    markCalculated();
  };

  // PDF Export Sections
  const pdfSections = useMemo(() => {
    return [
      {
        title: "Gold Jewellery Price Estimate (Tax Invoice Format)",
        headers: ["Description / Component", "Specification / Rate", "Amount (INR)"],
        rows: [
          ["Jewellery Item", itemName || "Gold Jewellery", "-"],
          ["Gold Purity", result.purityLabel, `Fineness: ${Math.round(result.effectiveFinenessRatio * 1000)}/1000`],
          ["Net Gold Weight", `${result.netGoldWeightGrams.toFixed(3)} grams`, "-"],
          ["Gold Rate Applied", `₹${Math.round(result.effectiveGoldRatePerGram).toLocaleString("en-IN")}/g`, "-"],
          ["Raw Gold Value", `${result.netGoldWeightGrams.toFixed(3)}g × ₹${Math.round(result.effectiveGoldRatePerGram)}/g`, formatINR(result.rawGoldValue)],
          ["Making Charges", `${result.makingChargeEquivalentPct.toFixed(1)}% of gold value`, formatINR(result.makingCharges)],
          ["Wastage (Value Addition)", `${result.wastageEquivalentPct.toFixed(1)}%`, formatINR(result.wastageCharges)],
          ["Diamond & Gemstone Charges", "Certified Stones", formatINR(result.totalStoneValue)],
          ["BIS Hallmarking & Other Fees", "Statutory HUID Fee", formatINR(result.totalExtraCharges)],
          ["Total Taxable Value", "Pre-Tax Subtotal", formatINR(result.taxableTransactionValue)],
          ["GST (3%)", `${result.cgstAmount > 0 ? "CGST 1.5% + SGST 1.5%" : "IGST 3%"}`, formatINR(result.totalGstAmount)],
          ["Total Payable Amount", "Net Invoice Total", formatINR(result.finalPayableAmount)],
          ["Effective Price per Gram", "All Charges Included", `₹${Math.round(result.effectiveFinalPricePerGram).toLocaleString("en-IN")}/g`],
        ],
      },
    ];
  }, [itemName, result]);

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Accurately estimate the complete price of gold jewellery in India. Calculate gold value by purity (24K, 22K 916, 18K), net weight, making charges, wastage (value addition), gemstone charges, and official 3% GST. Compare jeweller quotations, verify billing transparency, and calculate maximum gold weight from your budget."
      formula={`Gold Value = Net Gold Weight (g) × Gold Rate per Gram (₹/g)\nTaxable Value = Gold Value + Making Charges + Wastage + Stones + Hallmarking - Discounts\nGST (3%) = Taxable Value × 3%\nFinal Payable Amount = Taxable Value + GST`}
      example={`For 10g of 22K gold jewellery with 24K gold rate at ₹1,50,000 / 10g:\n22K Gold Rate = ₹15,000 × (22/24) = ₹13,750/g\nGold Value = 10g × ₹13,750/g = ₹1,37,500\nMaking Charges (8%) = ₹11,000\nTaxable Subtotal = ₹1,48,500\nGST (3%) = ₹4,455\nFinal Payable Amount = ₹1,52,955`}
      faqs={blogContent.faqs!}
      blog={<CalculatorBlog content={blogContent} />}
    >
      <div className="flex flex-col gap-6">
        {/* Top Mode Navigation Tabs */}
        <div className="bg-card border border-border/70 rounded-2xl p-2 sm:p-3 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            {/* Mode Tabs: Native 3-column segmented grid on mobile, inline flex row on desktop */}
            <div className="grid grid-cols-3 gap-1 sm:flex sm:items-center sm:gap-1.5 w-full sm:w-auto p-1 sm:p-0 bg-muted/30 sm:bg-transparent rounded-xl">
              <button
                type="button"
                onClick={() => setCalculatorMode("standard")}
                className={`py-2 px-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                  calculatorMode === "standard"
                    ? "bg-amber-500 text-white shadow-sm sm:shadow-md shadow-amber-500/20"
                    : "hover:bg-muted/70 text-foreground sm:bg-muted/40 sm:border sm:border-border/60"
                }`}
              >
                <Receipt className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="sm:hidden truncate">Bill Calc</span>
                <span className="hidden sm:inline whitespace-nowrap">Jewellery Bill Calculator</span>
              </button>

              <button
                type="button"
                onClick={() => setCalculatorMode("budget")}
                className={`py-2 px-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                  calculatorMode === "budget"
                    ? "bg-amber-500 text-white shadow-sm sm:shadow-md shadow-amber-500/20"
                    : "hover:bg-muted/70 text-foreground sm:bg-muted/40 sm:border sm:border-border/60"
                }`}
              >
                <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="sm:hidden truncate">By Budget</span>
                <span className="hidden sm:inline whitespace-nowrap">Budget to Gold Weight</span>
              </button>

              <button
                type="button"
                onClick={() => setCalculatorMode("compare")}
                className={`py-2 px-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                  calculatorMode === "compare"
                    ? "bg-amber-500 text-white shadow-sm sm:shadow-md shadow-amber-500/20"
                    : "hover:bg-muted/70 text-foreground sm:bg-muted/40 sm:border sm:border-border/60"
                }`}
              >
                <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="sm:hidden truncate">Compare</span>
                <span className="hidden sm:inline whitespace-nowrap">Compare Two Quotes</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 border-t border-border/40 sm:border-0 sm:pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadSample}
                className="h-8 text-xs font-semibold gap-1.5 rounded-xl cursor-pointer flex-1 sm:flex-initial"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="sm:hidden">Sample Bill</span>
                <span className="hidden sm:inline">Load Sample Bill</span>
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

        {/* MODE 2: BUDGET TO GOLD WEIGHT FEATURE */}
        {calculatorMode === "budget" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-card to-background border-2 border-amber-500/30 shadow-md"
          >
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Wallet className="w-4 h-4" />
              <span>Reverse Gold Calculator — Plan By Budget</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
              <div>
                <Label className="text-sm font-semibold text-foreground mb-1 block">
                  Your Total Jewellery Budget (₹)
                </Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    type="number"
                    min="1000"
                    step="5000"
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
                  Estimated Net Gold Weight You Can Purchase:
                </span>
                <span className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400 mt-1">
                  {budgetWeightGrams.toFixed(3)} <span className="text-lg font-bold text-foreground">Grams</span>
                </span>
                <span className="text-xs text-muted-foreground mt-2">
                  At ₹{Math.round(result.effectiveGoldRatePerGram).toLocaleString("en-IN")}/g ({result.purityLabel}) with {makingChargeValue}% making charges + 3% GST.
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* MODE 3: QUOTE COMPARISON (JEWELLER A VS JEWELLER B) */}
        {calculatorMode === "compare" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-card to-background border-2 border-amber-500/30 shadow-md"
          >
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Scale className="w-4 h-4" />
              <span>Side-by-Side Quotation Comparison</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Jeweller A Summary */}
              <div className="p-4 rounded-xl bg-card border border-border/80">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-foreground">Jeweller A (Current Inputs)</h4>
                  {quoteComparison.cheaperQuote === "A" && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Cheaper by {formatINR(quoteComparison.differenceInTotalPayable)} ({quoteComparison.differenceInPercentage}%)
                    </span>
                  )}
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>Gold Rate: ₹{Math.round(result.effectiveGoldRatePerGram).toLocaleString("en-IN")}/g</div>
                  <div>Making Charges: {formatINR(result.makingCharges)} ({result.makingChargeEquivalentPct.toFixed(1)}%)</div>
                  <div>Wastage: {formatINR(result.wastageCharges)}</div>
                  <div className="text-sm font-bold text-foreground pt-1 border-t border-border/50">
                    Total Payable: {formatINR(result.finalPayableAmount)}
                  </div>
                </div>
              </div>

              {/* Jeweller B Custom Inputs */}
              <div className="p-4 rounded-xl bg-card border border-border/80">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-foreground">Jeweller B (Competitor Quote)</h4>
                  {quoteComparison.cheaperQuote === "B" && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Cheaper by {formatINR(quoteComparison.differenceInTotalPayable)} ({quoteComparison.differenceInPercentage}%)
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <Label className="text-[11px] text-muted-foreground block mb-0.5">Rate (₹ / 10g)</Label>
                    <Input
                      type="number"
                      value={jewellerBRate}
                      onChange={(e) => setJewellerBRate(e.target.value === "" ? "" : Number(e.target.value))}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] text-muted-foreground block mb-0.5">Making %</Label>
                    <Input
                      type="number"
                      value={jewellerBMakingValue}
                      onChange={(e) => setJewellerBMakingValue(e.target.value === "" ? "" : Number(e.target.value))}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
                <div className="text-sm font-bold text-foreground pt-2 mt-2 border-t border-border/50">
                  Total Payable: {formatINR(quoteComparison.quoteB.finalPayableAmount)}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* MAIN INPUT COLUMN */}
        <div className="calc-input-column bg-card border border-border/70 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border/50">
            <Coins className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              Gold Jewellery Billing Details (India)
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {/* 1. Item Name & Purity Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Jewellery Item Name (Optional)
                </Label>
                <Input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. 22K Gold Chain, Bridal Necklace"
                  className="h-11 text-sm font-medium rounded-xl"
                />
              </div>

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
            </div>

            {/* Custom Purity Inputs if Custom is Selected */}
            {purity === "custom" && (
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/30 border border-border/60">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Karat Equivalent</Label>
                  <Input
                    type="number"
                    min="1"
                    max="24"
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

            {/* 2. Weight Inputs & Deduction Mode */}
            <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <Label className="text-xs font-semibold text-foreground">Weight Breakdown Mode</Label>
                <div className="grid grid-cols-2 sm:flex sm:items-center rounded-lg border border-border/70 p-0.5 bg-background text-xs">
                  <button
                    type="button"
                    onClick={() => setWeightInputMode("net_weight")}
                    className={`px-2 sm:px-2.5 py-1 rounded-md text-center transition-all cursor-pointer ${
                      weightInputMode === "net_weight"
                        ? "bg-amber-500 text-white shadow-sm font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="sm:hidden">Net Weight</span>
                    <span className="hidden sm:inline">Net Gold Weight</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeightInputMode("gross_weight")}
                    className={`px-2 sm:px-2.5 py-1 rounded-md text-center transition-all cursor-pointer ${
                      weightInputMode === "gross_weight"
                        ? "bg-amber-500 text-white shadow-sm font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="sm:hidden">Gross - Stones</span>
                    <span className="hidden sm:inline">Gross Weight - Stones</span>
                  </button>
                </div>
              </div>

              {weightInputMode === "net_weight" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Net Gold Weight</Label>
                    <Input
                      type="number"
                      min="0.001"
                      step="0.1"
                      value={netWeight}
                      onChange={(e) => setNetWeight(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="e.g. 10.5"
                      className="h-10 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Weight Unit</Label>
                    <select
                      value={netWeightUnit}
                      onChange={(e) => setNetWeightUnit(e.target.value as WeightUnit)}
                      className="w-full h-10 px-3 rounded-xl border border-border/70 bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="grams">Grams (g)</option>
                      <option value="milligrams">Milligrams (mg)</option>
                      <option value="tola">Tola (11.6638g)</option>
                      <option value="pavan">Pavan / Sovereign (8g)</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Gross Jewellery Weight</Label>
                    <Input
                      type="number"
                      min="0.001"
                      step="0.1"
                      value={grossWeight}
                      onChange={(e) => setGrossWeight(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="e.g. 12"
                      className="h-10 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Non-Gold / Stone Weight</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={nonGoldWeight}
                      onChange={(e) => setNonGoldWeight(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="e.g. 2"
                      className="h-10 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Weight Unit</Label>
                    <select
                      value={grossWeightUnit}
                      onChange={(e) => {
                        setGrossWeightUnit(e.target.value as WeightUnit);
                        setNonGoldWeightUnit(e.target.value as WeightUnit);
                      }}
                      className="w-full h-10 px-2 rounded-xl border border-border/70 bg-background text-xs font-medium"
                    >
                      <option value="grams">Grams (g)</option>
                      <option value="milligrams">Milligrams (mg)</option>
                      <option value="tola">Tola</option>
                      <option value="pavan">Pavan</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Gold Rate Inputs */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-sm font-semibold text-foreground">
                  Gold Rate & Rate Basis
                </Label>
                <span className="text-xs text-muted-foreground font-mono">
                  Effective: ₹{Math.round(result.effectiveGoldRatePerGram).toLocaleString("en-IN")}/g
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    type="number"
                    min="1"
                    step="500"
                    value={goldRate}
                    onChange={(e) => setGoldRate(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 1,50,000"
                    className="pl-8 h-11 text-base font-semibold rounded-xl"
                  />
                </div>

                <div>
                  <select
                    value={goldRateBasis}
                    onChange={(e) => setGoldRateBasis(e.target.value as RateBasis)}
                    className="w-full h-11 px-3 rounded-xl border border-border/70 bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="per_10g">Per 10 Grams</option>
                    <option value="per_gram">Per Gram</option>
                    <option value="per_tola">Per Tola (11.66g)</option>
                    <option value="per_pavan">Per Pavan (8g)</option>
                  </select>
                </div>
              </div>

              {/* Rate Mode Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="rateType"
                    checked={goldRateType === "derived_from_24k"}
                    onChange={() => setGoldRateType("derived_from_24k")}
                    className="accent-amber-500 cursor-pointer"
                  />
                  <span>Derived from 24K benchmark rate</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="rateType"
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

            {/* 4. Making Charges & Wastage Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-border/50">
              {/* Making Charges */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20">
                <div className="flex items-center justify-between mb-1.5">
                  <Label className="text-xs font-semibold text-foreground">Making Charges</Label>
                  <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">
                    {formatINR(result.makingCharges)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={makingChargeType}
                    onChange={(e) => setMakingChargeType(e.target.value as MakingChargeType)}
                    className="w-full h-9 px-2 rounded-lg border border-border/70 bg-background text-xs font-medium"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="per_gram">Rupees / Gram (₹/g)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    value={makingChargeValue}
                    onChange={(e) => setMakingChargeValue(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 8"
                    className="h-9 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Wastage / Value Addition */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1">
                    <Label className="text-xs font-semibold text-foreground">Wastage / Value Addition</Label>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">
                    {formatINR(result.wastageCharges)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={wastageType}
                    onChange={(e) => setWastageType(e.target.value as WastageType)}
                    className="w-full h-9 px-2 rounded-lg border border-border/70 bg-background text-xs font-medium"
                  >
                    <option value="none">None (0%)</option>
                    <option value="percentage">Percentage (%)</option>
                    <option value="weight_grams">Added Grams (g)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    disabled={wastageType === "none"}
                    value={wastageType === "none" ? 0 : wastageValue}
                    onChange={(e) => setWastageValue(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="0"
                    className="h-9 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Accordion 1: Diamonds, Gemstones & Other Charges */}
            <div className="border border-border/60 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("stones")}
                className="w-full px-4 py-3 bg-muted/30 hover:bg-muted/50 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Gem className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <span className="text-xs sm:text-sm font-semibold text-foreground">
                    Diamonds, Stones & BIS Hallmarking
                  </span>
                </div>
                {openSections.stones ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {openSections.stones && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 border-t border-border/60 flex flex-col gap-3 bg-background"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Diamond Value (₹)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={diamondValue}
                          onChange={(e) => setDiamondValue(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="0"
                          className="h-9 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Gemstone Value (₹)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={gemstoneValue}
                          onChange={(e) => setGemstoneValue(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="0"
                          className="h-9 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Other Stones / Pearls (₹)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={otherStonesValue}
                          onChange={(e) => setOtherStonesValue(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="0"
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border/40">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">BIS Hallmarking Fee (₹)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={hallmarkingCharge}
                          onChange={(e) => setHallmarkingCharge(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="45"
                          className="h-9 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Certification Charge (₹)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={certificationCharge}
                          onChange={(e) => setCertificationCharge(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="0"
                          className="h-9 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Packaging & Others (₹)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={packagingCharge}
                          onChange={(e) => setPackagingCharge(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="0"
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 2: Discounts & GST Settings */}
            <div className="border border-border/60 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("discounts")}
                className="w-full px-4 py-3 bg-muted/30 hover:bg-muted/50 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <span className="text-xs sm:text-sm font-semibold text-foreground">
                    Discounts & GST Configuration (3% Default)
                  </span>
                </div>
                {openSections.discounts ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {openSections.discounts && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 border-t border-border/60 flex flex-col gap-3 bg-background"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Discount Type</Label>
                        <select
                          value={discountType}
                          onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                          className="w-full h-9 px-2.5 rounded-lg border border-border/70 bg-background text-xs"
                        >
                          <option value="none">No Discount</option>
                          <option value="percentage">Percentage (%)</option>
                          <option value="flat">Flat Amount (₹)</option>
                        </select>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Discount Value</Label>
                        <Input
                          type="number"
                          min="0"
                          disabled={discountType === "none"}
                          value={discountType === "none" ? 0 : discountValue}
                          onChange={(e) => setDiscountValue(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="0"
                          className="h-9 text-xs"
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Apply Discount On</Label>
                        <select
                          value={discountApplyOn}
                          disabled={discountType === "none"}
                          onChange={(e) => setDiscountApplyOn(e.target.value as DiscountApplyOn)}
                          className="w-full h-9 px-2.5 rounded-lg border border-border/70 bg-background text-xs"
                        >
                          <option value="making_charges">Making Charges Only</option>
                          <option value="total_jewellery_value">Total Jewellery Value</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/40">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">GST Rate (CBIC Standard)</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="28"
                            step="0.5"
                            value={gstRatePct}
                            onChange={(e) => setGstRatePct(Number(e.target.value))}
                            className="h-9 text-xs font-semibold"
                          />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">% (3% default)</span>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Transaction Type</Label>
                        <select
                          value={gstTransactionType}
                          onChange={(e) => setGstTransactionType(e.target.value as GstTransactionType)}
                          className="w-full h-9 px-2.5 rounded-lg border border-border/70 bg-background text-xs"
                        >
                          <option value="intra_state">Intra-State (CGST 1.5% + SGST 1.5%)</option>
                          <option value="inter_state">Inter-State (IGST 3.0%)</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 3: Old Gold Exchange & Advance Payment */}
            <div className="border border-border/60 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("exchange")}
                className="w-full px-4 py-3 bg-muted/30 hover:bg-muted/50 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <span className="text-xs sm:text-sm font-semibold text-foreground">
                    Old Gold Exchange & Advance Payment (Optional)
                  </span>
                </div>
                {openSections.exchange ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {openSections.exchange && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 border-t border-border/60 flex flex-col gap-3 bg-background"
                  >
                    <div className="flex items-center justify-between py-1">
                      <div>
                        <span className="text-xs sm:text-sm font-medium text-foreground block">
                          Exchange Old Gold
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          Deduct value of old gold from your new purchase.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={enableOldGoldExchange}
                        onChange={(e) => setEnableOldGoldExchange(e.target.checked)}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </div>

                    {enableOldGoldExchange && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border/40">
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Old Gold Net Weight (g)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.1"
                            value={oldGoldNetWeight}
                            onChange={(e) => setOldGoldNetWeight(e.target.value === "" ? "" : Number(e.target.value))}
                            placeholder="e.g. 5.0"
                            className="h-9 text-xs"
                          />
                        </div>

                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Buyback Rate (₹/g)</Label>
                          <Input
                            type="number"
                            min="0"
                            value={oldGoldBuybackRate}
                            onChange={(e) => setOldGoldBuybackRate(e.target.value === "" ? "" : Number(e.target.value))}
                            placeholder={`e.g. ${Math.round(result.effectiveGoldRatePerGram)}`}
                            className="h-9 text-xs"
                          />
                        </div>

                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Deduction / Melting Loss (%)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            value={oldGoldDeductionPct}
                            onChange={(e) => setOldGoldDeductionPct(Number(e.target.value))}
                            placeholder="2"
                            className="h-9 text-xs"
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-border/40">
                      <Label className="text-xs text-muted-foreground mb-1 block">Advance Payment Already Made (₹)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={advancePaymentPaid}
                        onChange={(e) => setAdvancePaymentPaid(e.target.value === "" ? "" : Number(e.target.value))}
                        placeholder="0"
                        className="h-9 text-xs max-w-sm"
                      />
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
                disabled={!goldRate || result.netGoldWeightGrams <= 0}
                onClick={markCalculated}
              >
                <span className="sm:hidden">Calculate Bill</span>
                <span className="hidden sm:inline">Calculate Jewellery Bill</span>
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
        {hasResult ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            {/* Prominent HeroMetric */}
            <HeroMetric
              label="Estimated Total Payable Amount"
              value={formatINR(result.remainingBalanceDue > 0 && (enableOldGoldExchange || result.advancePaymentPaid > 0) ? result.remainingBalanceDue : result.finalPayableAmount)}
              sub={`Net Gold Weight: ${result.netGoldWeightGrams.toFixed(3)}g • Purity: ${result.purityLabel} • Rate: ₹${Math.round(result.effectiveGoldRatePerGram).toLocaleString("en-IN")}/g • GST (3%) Included`}
              glow="#f59e0b"
            />

            {/* Quick Metrics Grid */}
            <DashboardSection title="Jewellery Bill Overview">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard
                  index={0}
                  label="Pure Gold Value"
                  value={formatINR(result.rawGoldValue)}
                  accent="amber"
                  badge={`${result.purityLabel.slice(0, 3)}`}
                />
                <StatCard
                  index={1}
                  label="Making & Wastage"
                  value={formatINR(result.totalMakingAndWastage)}
                  accent="blue"
                  badge={`${result.makingChargeEquivalentPct.toFixed(1)}% Making`}
                />
                <StatCard
                  index={2}
                  label="GST Amount"
                  value={formatINR(result.totalGstAmount)}
                  accent="green"
                  badge={`${result.gstRatePct}% CBIC Rate`}
                />
                <StatCard
                  index={3}
                  label="Effective Price/Gram"
                  value={`₹${Math.round(result.effectiveFinalPricePerGram).toLocaleString("en-IN")}`}
                  accent="purple"
                  badge="All Charges"
                />
              </div>
            </DashboardSection>

            {/* Itemized Tax Invoice Breakdown Table */}
            <DashboardSection title="Itemized Jewellery Tax Invoice (HSN 7113)">
              <div className="overflow-x-auto rounded-xl border border-border/70 scroll-touch-x">
                <table className="w-full text-xs sm:text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border/70">
                      <th className="p-3 font-bold text-foreground">Billing Line Item</th>
                      <th className="p-3 font-bold text-foreground text-center">Specification / Units</th>
                      <th className="p-3 font-bold text-foreground text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 bg-card">
                    <tr>
                      <td className="p-3 font-medium text-foreground">
                        Raw Gold Value ({result.purityLabel})
                      </td>
                      <td className="p-3 text-center font-mono text-muted-foreground">
                        {result.netGoldWeightGrams.toFixed(3)}g @ ₹{Math.round(result.effectiveGoldRatePerGram).toLocaleString("en-IN")}/g
                      </td>
                      <td className="p-3 text-right font-mono font-semibold">
                        {formatINR(result.rawGoldValue)}
                      </td>
                    </tr>

                    <tr>
                      <td className="p-3 font-medium text-foreground">
                        Making Charges ({makingChargeType === "percentage" ? `${makingChargeValue}%` : makingChargeType === "per_gram" ? `₹${makingChargeValue}/g` : "Flat"})
                      </td>
                      <td className="p-3 text-center font-mono text-muted-foreground">
                        {result.makingChargeEquivalentPct.toFixed(1)}% of gold value
                      </td>
                      <td className="p-3 text-right font-mono">
                        {formatINR(result.makingCharges)}
                      </td>
                    </tr>

                    {result.wastageCharges > 0 && (
                      <tr>
                        <td className="p-3 font-medium text-foreground">Wastage / Value Addition</td>
                        <td className="p-3 text-center font-mono text-muted-foreground">
                          {result.wastageEquivalentPct.toFixed(1)}%
                        </td>
                        <td className="p-3 text-right font-mono">
                          {formatINR(result.wastageCharges)}
                        </td>
                      </tr>
                    )}

                    {result.totalStoneValue > 0 && (
                      <tr>
                        <td className="p-3 font-medium text-foreground">Diamonds & Gemstones</td>
                        <td className="p-3 text-center font-mono text-muted-foreground">
                          Non-Gold Certified
                        </td>
                        <td className="p-3 text-right font-mono">
                          {formatINR(result.totalStoneValue)}
                        </td>
                      </tr>
                    )}

                    {result.totalExtraCharges > 0 && (
                      <tr>
                        <td className="p-3 font-medium text-foreground">BIS Hallmarking & Extra Fees</td>
                        <td className="p-3 text-center font-mono text-muted-foreground">
                          Statutory HUID
                        </td>
                        <td className="p-3 text-right font-mono">
                          {formatINR(result.totalExtraCharges)}
                        </td>
                      </tr>
                    )}

                    {result.eligibleDiscountAmount > 0 && (
                      <tr className="text-emerald-600 dark:text-emerald-400">
                        <td className="p-3 font-medium">Eligible Discount</td>
                        <td className="p-3 text-center font-mono">
                          {discountApplyOn === "making_charges" ? "On Making Charges" : "On Total Value"}
                        </td>
                        <td className="p-3 text-right font-mono font-semibold">
                          - {formatINR(result.eligibleDiscountAmount)}
                        </td>
                      </tr>
                    )}

                    <tr className="bg-muted/20 font-semibold">
                      <td className="p-3 text-foreground">Total Taxable Value (Pre-Tax)</td>
                      <td className="p-3 text-center font-mono text-muted-foreground">Subtotal</td>
                      <td className="p-3 text-right font-mono font-bold">
                        {formatINR(result.taxableTransactionValue)}
                      </td>
                    </tr>

                    <tr>
                      <td className="p-3 font-medium text-muted-foreground">
                        {result.cgstAmount > 0 ? "CGST (1.5%)" : "IGST (3.0%)"}
                      </td>
                      <td className="p-3 text-center font-mono text-muted-foreground">
                        {result.cgstAmount > 0 ? "1.5%" : "3.0%"}
                      </td>
                      <td className="p-3 text-right font-mono">
                        {formatINR(result.cgstAmount > 0 ? result.cgstAmount : result.igstAmount)}
                      </td>
                    </tr>

                    {result.sgstAmount > 0 && (
                      <tr>
                        <td className="p-3 font-medium text-muted-foreground">SGST (1.5%)</td>
                        <td className="p-3 text-center font-mono text-muted-foreground">1.5%</td>
                        <td className="p-3 text-right font-mono">
                          {formatINR(result.sgstAmount)}
                        </td>
                      </tr>
                    )}

                    <tr className="bg-amber-500/10 font-bold text-foreground">
                      <td className="p-3 text-amber-700 dark:text-amber-300">
                        Total Invoice Payable
                      </td>
                      <td className="p-3 text-center font-mono text-xs">GST (3%) Included</td>
                      <td className="p-3 text-right font-mono text-base font-extrabold text-amber-600 dark:text-amber-400">
                        {formatINR(result.finalPayableAmount)}
                      </td>
                    </tr>

                    {/* Old Gold Credit if present */}
                    {enableOldGoldExchange && result.netOldGoldExchangeCredit > 0 && (
                      <>
                        <tr className="text-emerald-600 dark:text-emerald-400">
                          <td className="p-3 font-medium">Old Gold Exchange Credit</td>
                          <td className="p-3 text-center font-mono">
                            {oldGoldNetWeight}g (-{oldGoldDeductionPct}% loss)
                          </td>
                          <td className="p-3 text-right font-mono font-bold">
                            - {formatINR(result.netOldGoldExchangeCredit)}
                          </td>
                        </tr>
                        <tr className="font-bold bg-muted/30">
                          <td className="p-3 text-foreground">Net Payable After Exchange</td>
                          <td className="p-3 text-center font-mono">-</td>
                          <td className="p-3 text-right font-mono font-bold text-foreground">
                            {formatINR(result.netPayableAfterExchange)}
                          </td>
                        </tr>
                      </>
                    )}

                    {/* Advance Payment if present */}
                    {result.advancePaymentPaid > 0 && (
                      <>
                        <tr className="text-blue-600 dark:text-blue-400">
                          <td className="p-3 font-medium">Advance Payment Already Made</td>
                          <td className="p-3 text-center font-mono">Paid</td>
                          <td className="p-3 text-right font-mono font-bold">
                            - {formatINR(result.advancePaymentPaid)}
                          </td>
                        </tr>
                        <tr className="font-extrabold bg-amber-500/15">
                          <td className="p-3 text-foreground">Remaining Balance Due</td>
                          <td className="p-3 text-center font-mono">Final Balance</td>
                          <td className="p-3 text-right font-mono text-base font-black text-amber-600 dark:text-amber-400">
                            {formatINR(result.remainingBalanceDue)}
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </DashboardSection>

            {/* Visual Charts */}
            <DashboardSection title="Visual Cost Breakdown">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Chart 1: Donut Composition */}
                <div className="p-4 rounded-xl border border-border/70 bg-card">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Jewellery Bill Composition (₹)
                  </h4>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={compositionData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                        >
                          {compositionData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.color} />
                          ))}
                        </Pie>
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
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Stacked Components */}
                <div className="p-4 rounded-xl border border-border/70 bg-card">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Gold Metal Value vs Surcharges (₹)
                  </h4>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonBarData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="name" stroke="currentColor" fontSize={11} />
                        <YAxis stroke="currentColor" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
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
                        <Bar dataKey="Raw Gold Value" stackId="a" fill="#f59e0b" />
                        <Bar dataKey="Making & Wastage" stackId="a" fill="#3b82f6" />
                        <Bar dataKey="Taxes & Extras" stackId="a" fill="#10b981" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </DashboardSection>

            {/* Negotiation & Savings Guidance Cards */}
            <DashboardSection title="Personalized Jewellery Insights & Negotiation Tips">
              <div className="flex flex-col gap-3">
                {insights.map((insight, idx) => (
                  <InsightCard
                    key={idx}
                    index={idx}
                    tone={insight.tone}
                    title={insight.title}
                    text={insight.text}
                  />
                ))}
              </div>
            </DashboardSection>

            {/* PDF Export Section */}
            <div className="flex justify-end pt-2">
              <CalculatorPdfExport
                calculatorName="Gold Jewellery Bill Estimate"
                sections={pdfSections}
              />
            </div>
          </motion.div>
        ) : (
          <EmptyResultPlaceholder
            message="Ready to calculate gold jewellery bill"
            subMessage="Enter gold weight, purity, and rate, then press Calculate Jewellery Bill to see full tax invoice breakdown."
          />
        )}
      </div>
    </CalculatorPageLayout>
  );
}

