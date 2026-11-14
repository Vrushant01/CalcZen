import { useState, useMemo, useRef } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog, { type BlogContent } from "@/components/CalculatorBlog";
import SavePDFButton from "@/components/SavePDFButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCalculator } from "@/data/calculators";
import { useCalculatorState } from "@/hooks/use-has-calculated";
import { OutdatedResultBanner } from "@/components/OutdatedResultBanner";
import { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";
import {
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  AlertCircle,
  Calculator,
  Scale,
  Coins,
  ChevronDown,
  ChevronUp,
  Percent,
  Tag,
  ArrowRight,
  ShieldCheck,
  Gem,
  Layers,
} from "lucide-react";
import {
  calculateBudgetToWeight,
  calculatePriceForWeight,
  validateBudgetInputs,
  formatINR,
  formatWeight,
  GOLD_PURITIES,
  SILVER_PURITIES,
  type MetalType,
  type GoldPurityKey,
  type SilverPurityKey,
  type RateBasis,
  type MakingChargeMethod,
  type WastageMethod,
  type DiscountMethod,
  type JewelleryBudgetInputs,
  type BudgetToWeightResult,
} from "@/utils/jewelleryBudgetUtils";

export const JEWELLERY_BUDGET_FAQS: { q: string; a: string }[] = [
  {
    q: "How many grams of gold jewellery can I buy for ₹50,000?",
    a: "If 22K gold is ₹10,000 per gram, with 10% making charges and 3% GST, the total cost per gram is ₹11,330. With a ₹50,000 budget, you can purchase approximately 4.41 grams of gold jewellery.",
  },
  {
    q: "Why can't I just divide my budget by the gold rate?",
    a: "Dividing budget by the gold rate ignores making charges (typically 8% to 25%) and mandatory 3% GST. If gold is ₹10,000/g and you have ₹50,000, simple division suggests 5.0 grams, but after making charges and tax, a 5g ornament would cost over ₹56,600.",
  },
  {
    q: "What is the difference between 22K and 18K gold for budget purchases?",
    a: "22K gold contains 91.6% pure gold and is the standard for bridal and traditional jewellery. 18K contains 75% pure gold, making it approximately 18% less expensive per gram. With the same budget, you can purchase a heavier, sturdier piece in 18K gold, which is also commonly used for diamond settings.",
  },
  {
    q: "How do making charges affect the amount of jewellery I can buy?",
    a: "Making charges are craftsmanship fees added to the raw metal value. Machine-made plain gold chains typically have lower making charges (8% to 12%), allowing you to buy more gold by weight. Intricate handmade or temple jewellery can carry making charges of 18% to 25%, which reduces the affordable gold weight for the same budget.",
  },
  {
    q: "Is GST charged on making charges as well?",
    a: "Yes. When purchasing finished retail jewellery in India under CBIC HSN 7113, GST is charged at 3% on the composite taxable subtotal (metal value + making charges + wastage charges).",
  },
  {
    q: "How many grams of silver jewellery can I buy for ₹10,000?",
    a: "If 925 sterling silver is ₹100 per gram, with 10% making charges and 3% GST, the effective cost is ₹113.30 per gram. For ₹10,000, you can buy approximately 88.2 grams of silver jewellery.",
  },
  {
    q: "Does this calculator guarantee that my final bill won't exceed my budget?",
    a: "Yes. CalcZen's reverse calculation engine applies a strict Budget Safety Guarantee. It rounds the affordable weight downward so that the final bill (including all charges and taxes) never exceeds your entered budget.",
  },
  {
    q: "What is the reverse budget feature?",
    a: "Below the main result, the reverse budget feature allows you to enter a specific target weight (such as a 5-gram ring or 15-gram bangle) to instantly see the exact total budget you need at current rates.",
  },
  {
    q: "What is wastage (value addition) in jewellery pricing?",
    a: "Wastage is an additional percentage (often 2% to 10%) charged by some traditional jewellers for gold lost during cutting, soldering, and polishing. Modern hallmark jewellers often combine wastage into a transparent making charge percentage.",
  },
  {
    q: "Can I reserve part of my budget for stones or other expenses?",
    a: "Yes. Expand 'More options' and enter a reserved amount. The calculator will deduct the reserve before computing your affordable metal weight, ensuring you have cash left for gemstone charges, gift boxes, or other expenses.",
  },
];

export function JewelleryBudgetToWeightCalculator() {
  const calc = getCalculator("jewellery-budget-to-weight-calculator")!;
  const resultsRef = useRef<HTMLDivElement>(null);

  // -------------------------------------------------------------
  // STATE: 5 ESSENTIAL MAIN INPUTS
  // -------------------------------------------------------------
  const [totalBudget, setTotalBudget] = useState<number>(50000);
  const [metalType, setMetalType] = useState<MetalType>("gold");
  const [goldPurity, setGoldPurity] = useState<GoldPurityKey>("22k-916");
  const [silverPurity, setSilverPurity] = useState<SilverPurityKey>("925");
  const [rateBasis, setRateBasis] = useState<RateBasis>("selected_purity");
  const [metalRate, setMetalRate] = useState<number>(10000);

  // Making charges
  const [makingMethod, setMakingMethod] = useState<MakingChargeMethod>("percentage");
  const [makingValue, setMakingValue] = useState<number>(10);
  const [showMakingTypeSelector, setShowMakingTypeSelector] = useState<boolean>(false);

  // -------------------------------------------------------------
  // STATE: ADVANCED COLLAPSIBLE OPTIONS
  // -------------------------------------------------------------
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [wastageMethod, setWastageMethod] = useState<WastageMethod>("none");
  const [wastageValue, setWastageValue] = useState<number>(0);
  const [gstRate, setGstRate] = useState<number>(3);
  const [discountMethod, setDiscountMethod] = useState<DiscountMethod>("none");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [otherCharges, setOtherCharges] = useState<number>(0);
  const [reservedAmount, setReservedAmount] = useState<number>(0);

  // Secondary Reverse Budget feature
  const [desiredWeight, setDesiredWeight] = useState<number>(5);
  const [showFullBreakdown, setShowFullBreakdown] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Quick budget suggestions
  const budgetPresets = [10000, 25000, 50000, 75000, 100000];

  // -------------------------------------------------------------
  // CALCULATION ENGINE
  // -------------------------------------------------------------
  const inputs: JewelleryBudgetInputs = useMemo(
    () => ({
      totalBudget: Number(totalBudget) || 0,
      reservedAmount: showAdvanced ? Number(reservedAmount) || 0 : 0,
      metalType,
      goldPurity,
      silverPurity,
      rateBasis,
      metalRate: Number(metalRate) || 0,
      makingMethod,
      makingValue: Number(makingValue) || 0,
      wastageMethod: showAdvanced ? wastageMethod : "none",
      wastageValue: showAdvanced ? Number(wastageValue) || 0 : 0,
      gstRate: showAdvanced ? Number(gstRate) || 3 : 3,
      discountMethod: showAdvanced ? discountMethod : "none",
      discountValue: showAdvanced ? Number(discountValue) || 0 : 0,
      otherCharges: showAdvanced ? Number(otherCharges) || 0 : 0,
    }),
    [
      totalBudget,
      reservedAmount,
      showAdvanced,
      metalType,
      goldPurity,
      silverPurity,
      rateBasis,
      metalRate,
      makingMethod,
      makingValue,
      wastageMethod,
      wastageValue,
      gstRate,
      discountMethod,
      discountValue,
      otherCharges,
    ]
  );

  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } =
    useCalculatorState(inputs);
  const activeInputs = calculatedInputs || inputs;
  const validation = useMemo(() => validateBudgetInputs(inputs), [inputs]);
  const result: BudgetToWeightResult = useMemo(
    () => calculateBudgetToWeight(activeInputs, 3),
    [activeInputs]
  );

  // Secondary Reverse Budget Calculation (Desired Weight -> Budget Needed)
  const reversePrice = useMemo(() => {
    return calculatePriceForWeight(Math.max(0, Number(desiredWeight) || 0), activeInputs);
  }, [desiredWeight, activeInputs]);

  // -------------------------------------------------------------
  // ACTIONS: RESET, COPY & PDF
  // -------------------------------------------------------------
  const handleReset = () => {
    setTotalBudget(50000);
    setMetalType("gold");
    setGoldPurity("22k-916");
    setSilverPurity("925");
    setRateBasis("selected_purity");
    setMetalRate(10000);
    setMakingMethod("percentage");
    setMakingValue(10);
    setShowMakingTypeSelector(false);
    setShowAdvanced(false);
    setWastageMethod("none");
    setWastageValue(0);
    setGstRate(3);
    setDiscountMethod("none");
    setDiscountValue(0);
    setOtherCharges(0);
    setReservedAmount(0);
    setDesiredWeight(5);
    setShowFullBreakdown(false);
    resetCalculated();
  };

  const handleCalculateClick = () => {
    markCalculated();
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCopySummary = async () => {
    const summary = [
      `=== CalcZen: Jewellery Budget to Weight Estimate ===`,
      `Total Budget: ${result.formattedTotalBudget}`,
      ...(result.reservedAmount > 0 ? [`Reserved Budget: ${formatINR(result.reservedAmount)}`] : []),
      `Available Jewellery Budget: ${result.formattedAvailableBudget}`,
      `Jewellery Type: ${result.metalType === "gold" ? "Gold" : "Silver"} (${result.purityLabel})`,
      `Rate per Gram: ${result.formattedRate} / g`,
      `Making Charges: ${inputs.makingValue}${inputs.makingMethod === "percentage" ? "%" : inputs.makingMethod === "per_gram" ? " /g" : " fixed"}`,
      `GST: ${inputs.gstRate}%`,
      `----------------------------------------------------`,
      `YOU CAN BUY APPROXIMATELY: ${result.formattedWeight}`,
      `Estimated Final Price: ${result.formattedFinalPrice}`,
      `Remaining Budget: ${result.formattedRemainingBudget}`,
      `----------------------------------------------------`,
      `Calculated at: https://www.calczen.in/calculator/jewellery-budget-to-weight-calculator`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summary);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const pdfData = useMemo(() => {
    return {
      title: "Jewellery Budget to Weight Estimate",
      subtitle: `Reverse Purchasing Power Breakdown with 3% GST`,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      inputs: [
        { label: "Total Budget", value: result.formattedTotalBudget },
        ...(result.reservedAmount > 0
          ? [{ label: "Reserved Amount", value: formatINR(result.reservedAmount) }]
          : []),
        { label: "Available Jewellery Budget", value: result.formattedAvailableBudget },
        { label: "Metal Type & Purity", value: `${result.metalType === "gold" ? "Gold" : "Silver"} - ${result.purityLabel}` },
        { label: "Metal Rate Used", value: `${result.formattedRate} / gram` },
        {
          label: "Making Charges",
          value:
            inputs.makingMethod === "percentage"
              ? `${inputs.makingValue}% of metal value`
              : inputs.makingMethod === "per_gram"
              ? `₹${inputs.makingValue} per gram`
              : formatINR(inputs.makingValue),
        },
        ...(inputs.wastageValue > 0 ? [{ label: "Wastage Charges", value: `${inputs.wastageValue}%` }] : []),
        { label: "GST Rate", value: `${inputs.gstRate}%` },
      ],
      results: [
        { label: "Maximum Affordable Weight", value: result.formattedWeight },
        { label: "Estimated Metal Value", value: result.formattedMetalValue },
        { label: "Estimated Making Charges", value: result.formattedMakingCharges },
        { label: "Estimated GST (3%)", value: result.formattedGst },
        { label: "Estimated Total Price", value: result.formattedFinalPrice },
        { label: "Remaining Budget (Savings)", value: result.formattedRemainingBudget },
      ],
      notes: [
        "Weight calculation is 100% budget-safe. Estimated final price will never exceed your available budget.",
        "Actual retail weight may differ depending on jeweller design, hallmark charges, wastage policies, and live market rates.",
      ],
    };
  }, [result, inputs]);

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Find out exactly how many grams of gold or silver jewellery you can buy within your available budget. Our reverse calculator accounts for gold rate, purity, making charges, wastage, and statutory 3% GST."
      formula={`Available Budget = Total Budget − Reserved Amount\n\nPre-Tax Budget = Available Budget ÷ (1 + GST% ÷ 100)\n\nFor Percentage Making Charges:\nAffordable Weight = Pre-Tax Budget ÷ [ Rate × (1 + Making% ÷ 100 + Wastage% ÷ 100) ]\n\nFor Per-Gram or Fixed Charges:\nSolved numerically to guarantee Final Price(Weight) ≤ Available Budget.`}
      example={`₹50,000 Budget for 22K Gold @ ₹10,000/g with 10% Making Charges & 3% GST:\n• Rate per gram = ₹10,000\n• Making charges (10%) = ₹1,000/g\n• Pre-tax cost per gram = ₹11,000/g\n• Cost per gram with 3% GST = ₹11,000 × 1.03 = ₹11,330/g\n• Maximum Affordable Weight = ₹50,000 ÷ ₹11,330 = 4.413 grams\n• Final Estimated Price = ₹49,999 (within your ₹50,000 budget)`}
      faqs={JEWELLERY_BUDGET_FAQS}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN: 5 ESSENTIAL INPUTS (Theme-Reactive Mode)     */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-7 bg-card border border-border rounded-2xl shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Jewellery Budget Calculator
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Enter your spending budget to calculate affordable gold or silver weight
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                Budget Safe
              </span>
            </div>

            {/* ---------------------------------------------------- */}
            {/* INPUT 1: YOUR BUDGET                                */}
            {/* ---------------------------------------------------- */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="totalBudget" className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                  <Coins className="h-4 w-4 text-amber-500" />
                  How much do you want to spend?
                </Label>
                <span className="text-xs font-semibold text-primary">
                  {formatINR(totalBudget)}
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground pointer-events-none">
                  ₹
                </span>
                <Input
                  id="totalBudget"
                  type="number"
                  min="1000"
                  step="1000"
                  value={totalBudget === 0 ? "" : totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value === "" ? 0 : Number(e.target.value))}
                  placeholder="e.g. 50000"
                  className="h-12 pl-8 text-base font-semibold rounded-xl bg-background border-border text-foreground focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Quick Budget Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-muted-foreground font-medium mr-1">Quick select:</span>
                {budgetPresets.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setTotalBudget(amount)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      totalBudget === amount
                        ? "bg-primary text-primary-foreground border-primary shadow-2xs font-bold"
                        : "bg-background hover:bg-muted text-foreground border-border hover:border-primary/40 font-semibold"
                    }`}
                  >
                    {formatINR(amount)}
                  </button>
                ))}
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* INPUT 2: JEWELLERY TYPE (Gold vs Silver)            */}
            {/* ---------------------------------------------------- */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                <Gem className="h-4 w-4 text-amber-500" />
                What type of jewellery do you want?
              </Label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-muted/60 rounded-xl border border-border">
                <button
                  type="button"
                  onClick={() => {
                    setMetalType("gold");
                    setMetalRate(10000);
                  }}
                  className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    metalType === "gold"
                      ? "bg-card text-foreground font-bold shadow-xs border border-border"
                      : "text-muted-foreground hover:text-foreground font-medium"
                  }`}
                >
                  <Coins className="h-4 w-4 text-amber-500" />
                  <span>Gold Jewellery</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMetalType("silver");
                    setMetalRate(100);
                  }}
                  className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    metalType === "silver"
                      ? "bg-card text-foreground font-bold shadow-xs border border-border"
                      : "text-muted-foreground hover:text-foreground font-medium"
                  }`}
                >
                  <Coins className="h-4 w-4 text-slate-400" />
                  <span>Silver Jewellery</span>
                </button>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* INPUT 3: PURITY SELECTION                           */}
            {/* ---------------------------------------------------- */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="purity" className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Select jewellery purity
                </Label>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                  {metalType === "gold" ? GOLD_PURITIES[goldPurity].shortLabel : SILVER_PURITIES[silverPurity].shortLabel}
                </span>
              </div>

              {metalType === "gold" ? (
                <select
                  id="goldPurity"
                  value={goldPurity}
                  onChange={(e) => setGoldPurity(e.target.value as GoldPurityKey)}
                  aria-label="Select Gold Purity"
                  className="w-full h-12 px-3.5 rounded-xl border border-border bg-background text-foreground text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                >
                  {Object.values(GOLD_PURITIES).map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  id="silverPurity"
                  value={silverPurity}
                  onChange={(e) => setSilverPurity(e.target.value as SilverPurityKey)}
                  aria-label="Select Silver Purity"
                  className="w-full h-12 px-3.5 rounded-xl border border-border bg-background text-foreground text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                >
                  {Object.values(SILVER_PURITIES).map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              <p className="text-[11px] text-muted-foreground">
                {metalType === "gold"
                  ? GOLD_PURITIES[goldPurity].description
                  : SILVER_PURITIES[silverPurity].description}
              </p>
            </div>

            {/* ---------------------------------------------------- */}
            {/* INPUT 4: METAL RATE PER GRAM                        */}
            {/* ---------------------------------------------------- */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="metalRate" className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                  <Coins className="h-4 w-4 text-amber-500" />
                  Today's {metalType === "gold" ? "gold" : "silver"} rate per gram
                </Label>
                <span className="text-xs text-muted-foreground">₹ / gram</span>
              </div>

              {/* Rate Basis Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-muted/60 rounded-xl border border-border">
                <button
                  type="button"
                  onClick={() => setRateBasis("selected_purity")}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                    rateBasis === "selected_purity"
                      ? "bg-card text-foreground font-bold shadow-xs border border-border"
                      : "text-muted-foreground hover:text-foreground font-medium"
                  }`}
                >
                  Rate for {metalType === "gold" ? GOLD_PURITIES[goldPurity].shortLabel : SILVER_PURITIES[silverPurity].shortLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setRateBasis("24k_or_999")}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                    rateBasis === "24k_or_999"
                      ? "bg-card text-foreground font-bold shadow-xs border border-border"
                      : "text-muted-foreground hover:text-foreground font-medium"
                  }`}
                >
                  Rate for {metalType === "gold" ? "24K (Pure)" : "999 (Pure)"}
                </button>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground pointer-events-none">
                  ₹
                </span>
                <Input
                  id="metalRate"
                  type="number"
                  min="1"
                  step="10"
                  value={metalRate === 0 ? "" : metalRate}
                  onChange={(e) => setMetalRate(e.target.value === "" ? 0 : Number(e.target.value))}
                  placeholder={metalType === "gold" ? "e.g. 10000" : "e.g. 100"}
                  className="h-12 pl-8 pr-16 text-base font-semibold rounded-xl bg-background border-border text-foreground focus:ring-2 focus:ring-primary/20"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground pointer-events-none">
                  / gram
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {rateBasis === "24k_or_999"
                  ? `Your entered 24K rate will automatically convert to ₹${Math.round(
                      result.applicableRatePerGram
                    ).toLocaleString("en-IN")}/g for ${result.purityLabel}.`
                  : `Enter the direct retail rate for ${result.purityLabel}.`}
              </p>
            </div>

            {/* ---------------------------------------------------- */}
            {/* INPUT 5: MAKING CHARGES                             */}
            {/* ---------------------------------------------------- */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="makingValue" className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                  <Percent className="h-4 w-4 text-primary" />
                  Making charges
                </Label>
                <button
                  type="button"
                  onClick={() => setShowMakingTypeSelector(!showMakingTypeSelector)}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Change charge type</span>
                  {showMakingTypeSelector ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              </div>

              {/* Expandable charge type selector */}
              {showMakingTypeSelector && (
                <div className="grid grid-cols-3 gap-2 p-1 bg-muted/60 rounded-xl border border-border">
                  <button
                    type="button"
                    onClick={() => {
                      setMakingMethod("percentage");
                      setMakingValue(10);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                      makingMethod === "percentage"
                        ? "bg-card text-foreground font-bold shadow-xs border border-border"
                        : "text-muted-foreground hover:text-foreground font-medium"
                    }`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMakingMethod("per_gram");
                      setMakingValue(500);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                      makingMethod === "per_gram"
                        ? "bg-card text-foreground font-bold shadow-xs border border-border"
                        : "text-muted-foreground hover:text-foreground font-medium"
                    }`}
                  >
                    Per Gram (₹/g)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMakingMethod("fixed");
                      setMakingValue(2000);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                      makingMethod === "fixed"
                        ? "bg-card text-foreground font-bold shadow-xs border border-border"
                        : "text-muted-foreground hover:text-foreground font-medium"
                    }`}
                  >
                    Fixed Lump-Sum
                  </button>
                </div>
              )}

              <div className="relative">
                {makingMethod === "fixed" && (
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground pointer-events-none">
                    ₹
                  </span>
                )}
                <Input
                  id="makingValue"
                  type="number"
                  min="0"
                  step={makingMethod === "percentage" ? "0.5" : "10"}
                  value={makingValue === 0 ? "" : makingValue}
                  onChange={(e) => setMakingValue(e.target.value === "" ? 0 : Number(e.target.value))}
                  placeholder="10"
                  className={`h-12 font-semibold text-base rounded-xl bg-background border-border text-foreground focus:ring-2 focus:ring-primary/20 ${
                    makingMethod === "fixed" ? "pl-8" : "pr-12"
                  }`}
                />
                {makingMethod === "percentage" && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground pointer-events-none">
                    %
                  </span>
                )}
                {makingMethod === "per_gram" && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground pointer-events-none">
                    ₹ / g
                  </span>
                )}
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* COLLAPSIBLE: MORE OPTIONS (Wastage, GST, Discount)  */}
            {/* ---------------------------------------------------- */}
            <div className="border border-border/80 rounded-xl overflow-hidden bg-muted/15">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between p-3.5 text-left hover:bg-muted/30 transition-colors text-xs font-semibold text-foreground"
              >
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <span>More options (Wastage, GST, Discounts & Budget Reserve)</span>
                  {(wastageValue > 0 || discountMethod !== "none" || otherCharges > 0 || reservedAmount > 0 || gstRate !== 3) && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-primary/20 text-primary font-bold">
                      Customized
                    </span>
                  )}
                </div>
                {showAdvanced ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {showAdvanced && (
                <div className="p-4 border-t border-border/40 space-y-4 bg-card text-xs">
                  {/* Wastage charges */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="wastageValue" className="text-xs font-semibold text-foreground">
                        Wastage charges (Value addition)
                      </Label>
                      <span className="text-[11px] text-muted-foreground">% of metal</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={wastageMethod}
                        onChange={(e) => setWastageMethod(e.target.value as WastageMethod)}
                        aria-label="Wastage Charge Method"
                        className="h-10 px-3 rounded-xl border border-border bg-background text-xs font-semibold text-foreground"
                      >
                        <option value="none">No Wastage (0%)</option>
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (₹)</option>
                      </select>
                      {wastageMethod !== "none" && (
                        <Input
                          id="wastageValue"
                          type="number"
                          min="0"
                          step="0.5"
                          value={wastageValue === 0 ? "" : wastageValue}
                          onChange={(e) => setWastageValue(e.target.value === "" ? 0 : Number(e.target.value))}
                          placeholder={wastageMethod === "percentage" ? "e.g. 5%" : "e.g. 1000"}
                          className="h-10 text-xs font-semibold rounded-xl bg-background border-border text-foreground"
                        />
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Some jewellers charge wastage separately from making charges. Leave as 0% if included in making charges.
                    </p>
                  </div>

                  {/* GST Rate */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="gstRate" className="text-xs font-semibold text-foreground">
                        Statutory GST Rate
                      </Label>
                      <span className="text-[11px] text-primary font-bold">Standard 3% CBIC HSN 7113</span>
                    </div>
                    <Input
                      id="gstRate"
                      type="number"
                      min="0"
                      max="28"
                      step="0.5"
                      value={gstRate}
                      onChange={(e) => setGstRate(Number(e.target.value))}
                      className="h-10 text-xs font-semibold rounded-xl bg-background border-border text-foreground"
                    />
                  </div>

                  {/* Discount */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Promotional Discount from Jeweller
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={discountMethod}
                        onChange={(e) => setDiscountMethod(e.target.value as DiscountMethod)}
                        aria-label="Promotional Discount Method"
                        className="h-10 px-3 rounded-xl border border-border bg-background text-xs font-semibold text-foreground"
                      >
                        <option value="none">No Discount</option>
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Cash (₹)</option>
                      </select>
                      {discountMethod !== "none" && (
                        <Input
                          type="number"
                          min="0"
                          step={discountMethod === "percentage" ? "0.5" : "100"}
                          value={discountValue === 0 ? "" : discountValue}
                          onChange={(e) => setDiscountValue(e.target.value === "" ? 0 : Number(e.target.value))}
                          placeholder={discountMethod === "percentage" ? "5%" : "1000"}
                          className="h-10 text-xs font-semibold rounded-xl bg-background border-border text-foreground"
                        />
                      )}
                    </div>
                  </div>

                  {/* Other charges & Reserved Budget */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="otherCharges" className="text-xs font-semibold text-foreground">
                        Other Charges (₹ Stones / Labour)
                      </Label>
                      <Input
                        id="otherCharges"
                        type="number"
                        min="0"
                        step="50"
                        value={otherCharges === 0 ? "" : otherCharges}
                        onChange={(e) => setOtherCharges(e.target.value === "" ? 0 : Number(e.target.value))}
                        placeholder="0"
                        className="h-10 text-xs font-semibold rounded-xl bg-background border-border text-foreground"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="reservedAmount" className="text-xs font-semibold text-foreground">
                        Reserve Amount from Budget (₹)
                      </Label>
                      <Input
                        id="reservedAmount"
                        type="number"
                        min="0"
                        step="500"
                        value={reservedAmount === 0 ? "" : reservedAmount}
                        onChange={(e) => setReservedAmount(e.target.value === "" ? 0 : Number(e.target.value))}
                        placeholder="e.g. 2000"
                        className="h-10 text-xs font-semibold rounded-xl bg-background border-border text-foreground"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Calculate Button */}
            <div className="pt-2">
              <Button
                type="button"
                onClick={handleCalculateClick}
                className="w-full h-12 text-base font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-all active:scale-[0.99]"
              >
                <Calculator className="h-5 w-5" />
                <span>Calculate My Jewellery Weight</span>
              </Button>
            </div>

            {/* Validation Alerts */}
            {!validation.isValid && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{Object.values(validation.errors)[0]}</span>
              </div>
            )}
          </div>

          {/* ---------------------------------------------------- */}
          {/* SECONDARY FEATURE: REVERSE BUDGET BY DESIRED WEIGHT  */}
          {/* ---------------------------------------------------- */}
          <div className="p-5 bg-card border border-border rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">
                How much budget do I need for a specific weight?
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter the exact jewellery weight you want to buy (e.g. for a ring or bangle) to see the estimated required budget with your current rates:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-5 relative">
                <Input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={desiredWeight === 0 ? "" : desiredWeight}
                  onChange={(e) => setDesiredWeight(e.target.value === "" ? 0 : Number(e.target.value))}
                  placeholder="5"
                  className="h-12 pr-16 font-bold text-base rounded-xl bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-700 dark:text-slate-300 pointer-events-none">
                  grams
                </span>
              </div>
              <div className="sm:col-span-7 p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-emerald-600/30 dark:border-emerald-500/40 flex items-center justify-between gap-3 shadow-2xs">
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <Coins className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Estimated Budget Needed:</span>
                </span>
                <strong className="text-lg sm:text-xl font-black text-emerald-700 dark:text-emerald-400 shrink-0">
                  {formatINR(reversePrice.finalPrice)}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: HEROS RESULTS & BREAKDOWN TABLE             */}
        {/* ========================================================= */}
        <div ref={resultsRef} className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-5 lg:sticky lg:top-24">
            {/* Hero Result Box: Solid Background (No Gradient) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-emerald-600/30 dark:border-emerald-500/40 space-y-3 shadow-xs">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>You Can Buy Approximately</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 shadow-2xs">
                  Budget Verified
                </span>
              </div>

              {/* Big Hero Result: Solid High Contrast */}
              <div className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950 dark:text-white">
                {result.formattedWeight}
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                of <strong className="text-slate-900 dark:text-white font-bold">{result.purityLabel} {result.metalType}</strong> jewellery within your <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{result.formattedAvailableBudget}</strong> available budget.
              </p>
            </div>

            {/* Price Breakdown Table (Standard CalcZen Palette) */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-sm shadow-2xs divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-950">
              {/* 1. Metal Value: Blue */}
              <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{result.metalType === "gold" ? "Gold" : "Silver"} metal value:</span>
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400 text-sm sm:text-base">
                  {result.formattedMetalValue}
                </span>
              </div>

              {/* 2. Making Charges: Amber */}
              <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Making charges
                    {inputs.makingMethod === "percentage" ? ` (${inputs.makingValue}%)` : ""}:
                  </span>
                </span>
                <span className="font-bold text-amber-500 dark:text-amber-400 text-sm sm:text-base">
                  +{result.formattedMakingCharges}
                </span>
              </div>

              {/* Optional Wastage */}
              {result.breakdown.wastageValue > 0 && (
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Wastage charges:</span>
                  </span>
                  <span className="font-bold text-orange-600 dark:text-orange-400 text-sm sm:text-base">
                    +{result.formattedWastage}
                  </span>
                </div>
              )}

              {/* Optional Discount */}
              {result.breakdown.discountAmount > 0 && (
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Discount:</span>
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm sm:text-base">
                    −{result.formattedDiscount}
                  </span>
                </div>
              )}

              {/* 3. GST (3%): Purple */}
              <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">GST ({inputs.gstRate}%):</span>
                </span>
                <span className="font-bold text-purple-600 dark:text-purple-400 text-sm sm:text-base">
                  +{result.formattedGst}
                </span>
              </div>

              {/* 4. Total Amount: Crisp Solid Black / White on Neutral Background */}
              <div className="px-4 py-3.5 flex items-center justify-between bg-slate-100/90 dark:bg-slate-800/80 border-t-2 border-slate-300 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-white shrink-0" />
                  <span>Estimated final price:</span>
                </span>
                <span className="text-lg sm:text-xl font-black text-black dark:text-white">
                  {result.formattedFinalPrice}
                </span>
              </div>

              {/* 5. Remaining Budget: Emerald */}
              <div className="px-4 py-2.5 flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 text-xs border-t border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" />
                  <span>Unspent budget remaining:</span>
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {result.formattedRemainingBudget}
                </span>
              </div>
            </div>

            {/* Expandable Link: Full Price Breakdown */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowFullBreakdown(!showFullBreakdown)}
                className="w-full flex items-center justify-between py-2 text-xs font-semibold text-primary hover:underline"
              >
                <span>{showFullBreakdown ? "Hide full calculation details" : "View full calculation details"}</span>
                {showFullBreakdown ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>

              {showFullBreakdown && (
                <div className="mt-2.5 p-4 rounded-xl border border-border/80 bg-muted/30 text-xs space-y-2.5 shadow-2xs">
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Total budget entered:</span>
                    <strong className="text-slate-900 dark:text-white font-semibold">{result.formattedTotalBudget}</strong>
                  </div>
                  {result.reservedAmount > 0 && (
                    <div className="flex justify-between text-slate-700 dark:text-slate-300">
                      <span>Reserved amount:</span>
                      <strong className="text-amber-600 dark:text-amber-400 font-semibold">−{formatINR(result.reservedAmount)}</strong>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{result.formattedAvailableBudget}</strong>
                    <span>Available jewellery budget:</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Selected purity:</span>
                    <strong className="text-slate-900 dark:text-white font-semibold">{result.purityLabel}</strong>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Rate used per gram:</span>
                    <strong className="text-blue-600 dark:text-blue-400 font-bold">{result.formattedRate} / g</strong>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Affordable weight solved:</span>
                    <strong className="text-slate-950 dark:text-white font-black">{result.formattedWeight}</strong>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Pre-tax taxable value:</span>
                    <strong className="text-slate-900 dark:text-white font-bold">{result.formattedTaxableSubtotal}</strong>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Statutory GST ({inputs.gstRate}%):</span>
                    <strong className="text-purple-600 dark:text-purple-400 font-bold">+{result.formattedGst}</strong>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-2 border-t border-border/60">
                    <span>Estimated final bill:</span>
                    <strong className="text-black dark:text-white font-black text-sm">{result.formattedFinalPrice}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* User Note */}
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Actual jewellery weight may differ depending on the jeweller's daily rate, hallmark charges, workmanship complexity, and applicable taxes.
            </p>

            {/* Action Buttons Toolbar */}
            <div className="pt-3 border-t border-border/60 space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopySummary}
                  className="h-10 text-xs font-semibold rounded-xl border-border hover:bg-muted text-foreground"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1.5" />
                      Copy Summary
                    </>
                  )}
                </Button>

                <SavePDFButton
                  pdfData={pdfData}
                  disabled={!validation.isValid || result.maxAffordableWeight <= 0}
                  className="h-10 w-full text-xs font-semibold rounded-xl"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset to defaults
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

// -------------------------------------------------------------
// FAQS FOR ACCORDION
// -------------------------------------------------------------
