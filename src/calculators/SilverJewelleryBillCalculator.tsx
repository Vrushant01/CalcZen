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
  Coins,
  RotateCcw,
  Copy,
  Check,
  Info,
  AlertCircle,
  Calculator,
  ChevronDown,
  ChevronUp,
  Sliders,
  Scale,
  Tag,
  Receipt,
  Sparkles,
} from "lucide-react";
import {
  calculateSilverJewelleryBill,
  validateSilverJewelleryInputs,
  formatINR,
  roundTo,
  BIS_SILVER_PURITY_OPTIONS,
  SILVER_PURITY_ORDER,
  type SilverPurity,
  type RateBasis,
  type MakingChargeMethod,
  type DiscountType,
  type SilverBillInputs,
} from "@/utils/silverJewelleryUtils";

// RICH EDUCATIONAL BLOG CONTENT & FAQS
export const SILVER_JEWELLERY_BLOG_CONTENT: any = {
  title: "Silver Jewellery Bill Calculator India: Complete Price Breakdown Guide",
  description:
    "Learn how Indian jewellers calculate silver jewellery prices, making charges, purity fineness, and 3% GST. Calculate transparent silver bills before buying.",
  author: "CalcZen Jewellery Domain Specialists",
  publishDate: "November 2026",
  readTime: "6 min read",
  sections: [
    {
      title: "1. How Silver Jewellery Prices Are Calculated in India",
      paragraphs: [
        "Buying silver jewellery in India involves three primary cost components: the silver metal value, the craftsman's making charges, and statutory GST.",
        "The standard retail billing formula followed across Indian showrooms is:",
        "**Final Bill Amount = (Net Silver Weight × Silver Rate per Gram) + Making Charges + Other Charges − Discounts + GST (3%)**",
        "Unlike gold, where bullion rates are widely quoted in 10-gram units, silver is predominantly priced per gram or per kilogram. Always ensure that the rate quoted reflects your ornament's specific purity grade.",
      ],
    },
    {
      title: "2. Bureau of Indian Standards (BIS) IS 2112:2025 Silver Hallmarking",
      paragraphs: [
        "Under Bureau of Indian Standards (BIS) standard IS 2112:2025, genuine silver jewellery and articles in India carry standardized hallmarking marks certifying elemental purity.",
        "The primary recognized fineness grades include:",
        "• **925 (Sterling Silver)**: 92.5% pure silver alloyed with 7.5% copper or zinc for mechanical strength. This is the universal standard for fine jewellery, earrings, rings, chains, and studded pendants.",
        "• **999 (Fine Silver)**: 99.9% pure silver, used strictly in minted silver coins, bullion bars, and devotional pooja idols.",
        "• **990 & 970**: High-purity grades popular in handcrafted pooja vessels, filigree (Cuttack tarakasi) art, and traditional articles.",
        "• **900 & 800**: Traditional coin silver and utensil silver, frequently used for heavy traditional anklets (payal), silverware, and household utensils.",
      ],
    },
    {
      title: "3. Understanding Making Charges on Silver Jewellery",
      paragraphs: [
        "Making charges compensate artisans and manufacturers for casting, soldering, stone-setting, and polishing. Jewellers in India calculate making charges using three different methods:",
        "• **Percentage Basis (%)**: Common in branded designer showrooms (typically 8% to 20% of the silver metal value).",
        "• **Per Gram Basis (₹/g)**: Highly popular for traditional silverware, heavy chains, and payal (typically ₹10 to ₹35 per gram).",
        "• **Fixed Lump Sum (₹)**: Common for lightweight, machine-made minimalist silver rings, studs, and nose pins.",
      ],
      callout: {
        type: "tip",
        title: "Deduct Stone Weight Before Silver Valuation",
        text: "Always check whether studded silver jewellery is weighed net or gross. Cubic zirconia, gemstones, enamel work, and threads carry zero silver value and must be excluded from metal weight calculations.",
      },
    },
    {
      title: "4. GST on Silver Jewellery: Finished Goods vs. Job Work",
      paragraphs: [
        "Under CBIC GST regulations (HSN 7113), the retail sale of finished silver jewellery to an end customer attracts **3% GST** on the entire transaction value, even when making charges are billed on a separate line.",
        "The 5% GST rate applies only to standalone B2B job-work services rendered by artisans to registered manufacturers, not to retail customer purchases in jewellery showrooms.",
      ],
    },
  ],
  faqs: [
    {
      q: "How do jewellers calculate silver jewellery prices in India?",
      a: "Jewellers calculate the final bill by multiplying the net silver weight by the silver rate per gram for that purity, adding making charges and other fees, subtracting any discounts, and adding 3% GST.",
    },
    {
      q: "What is 925 silver?",
      a: "925 silver (Sterling Silver) contains 92.5% pure silver and 7.5% other metals (usually copper). Pure silver (99.9%) is too soft for everyday wear, so 925 alloy provides the durability needed for intricate jewellery.",
    },
    {
      q: "What is the GST rate on silver jewellery in India?",
      a: "Under CBIC rules, the retail sale of finished silver jewellery carries a statutory GST rate of 3% on the total invoice amount (metal value plus making charges).",
    },
    {
      q: "How are silver making charges calculated?",
      a: "Making charges are calculated as either a percentage of the silver value (e.g. 10%), a fixed rate per gram (e.g. ₹15/g), or a fixed flat fee per article.",
    },
    {
      q: "Can I convert the 999 silver rate to 925 silver?",
      a: "Yes. Multiply the 999 silver rate by (925 / 999). For example, if pure 999 silver is ₹120/g, the equivalent 925 silver rate is ₹120 × (925 / 999) = ₹111.11 per gram.",
    },
    {
      q: "Are stones weighed along with silver?",
      a: "No. Reputed jewellers weigh silver jewellery net of stones, beads, and enamel. You should never pay silver metal rates for non-silver materials.",
    },
    {
      q: "Is silver hallmarking mandatory in India?",
      a: "Silver hallmarking under BIS IS 2112 is voluntary but widely practiced by reputed jewellers to assure consumers of genuine elemental purity and hallmark verification.",
    },
    {
      q: "What is the difference between 925 silver and 800 silver?",
      a: "925 silver has 92.5% purity and is used for fine jewellery. 800 silver has 80% purity and is typically used for heavy traditional utensils, decorative artifacts, and payal.",
    },
    {
      q: "Does silver jewellery tarnish over time?",
      a: "Yes. Sterling silver naturally tarnishes when exposed to sulfur and moisture in the air. Regular wear, anti-tarnish storage, and rhodium plating help maintain its shine.",
    },
    {
      q: "Does this calculator generate an official commercial invoice?",
      a: "No. This tool provides retail cost estimations and pricing breakdowns for consumers. A legally valid commercial tax invoice is issued directly by the licensed jeweller upon purchase.",
    },
  ],
  internalLinks: [
    {
      text: "Calculate Gold Jewellery Bills with Making Charges & GST",
      calculatorName: "Gold Jewellery Bill Calculator",
      href: "/calculator/gold-jewellery-bill-calculator",
    },
    {
      text: "Estimate Old Gold Jewellery Resale & Exchange Value",
      calculatorName: "Old Gold Exchange Value Calculator",
      href: "/calculator/old-gold-exchange-value-calculator",
    },
    {
      text: "Compare and Negotiate Making Charges on Precious Jewellery",
      calculatorName: "Gold Making Charges Calculator",
      href: "/calculator/gold-making-charges-calculator",
    },
  ],
};

export default SilverJewelleryBillCalculator;

export function SilverJewelleryBillCalculator() {
  const calc = getCalculator("silver-jewellery-bill-calculator")!;
  const resultsRef = useRef<HTMLDivElement>(null);

  // ==========================================
  // 1. FOUR PRIMARY INPUTS (SIMPLIFIED DEFAULT)
  // ==========================================
  // Section 1: Silver Weight
  const [netWeight, setNetWeight] = useState<number>(20);

  // Section 2: Silver Purity
  const [purity, setPurity] = useState<SilverPurity>("925");
  const [customFineness, setCustomFineness] = useState<number>(925);

  // Section 3: Silver Rate
  const [rate, setRate] = useState<number>(100);

  // Section 4: Making Charges
  const [makingChargeMethod, setMakingChargeMethod] = useState<MakingChargeMethod>("percentage");
  const [makingChargePercentage, setMakingChargePercentage] = useState<number>(10);
  const [makingChargePerGram, setMakingChargePerGram] = useState<number>(15);
  const [fixedMakingCharge, setFixedMakingCharge] = useState<number>(300);
  const [showMakingChargeType, setShowMakingChargeType] = useState<boolean>(false);

  // ==========================================
  // 2. ADVANCED / MORE OPTIONS (COLLAPSED BY DEFAULT)
  // ==========================================
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [rateBasis, setRateBasis] = useState<RateBasis>("selected_purity");
  const [weightMode, setWeightMode] = useState<"net" | "gross_stone">("net");
  const [grossWeight, setGrossWeight] = useState<number>(25);
  const [nonSilverWeight, setNonSilverWeight] = useState<number>(5);
  const [discountType, setDiscountType] = useState<DiscountType>("none");
  const [discountValue, setDiscountValue] = useState<number>(5);
  const [otherCharges, setOtherCharges] = useState<number>(0);
  const [gstEnabled, setGstEnabled] = useState<boolean>(true);
  const [customGstRate, setCustomGstRate] = useState<number>(3);

  // ==========================================
  // 3. UI TOGGLES & FEEDBACK
  // ==========================================
  const [showFullBreakdown, setShowFullBreakdown] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // ASSEMBLE COMPLETE INPUT OBJECT
  const inputs: SilverBillInputs = useMemo(() => {
    return {
      weightMode,
      netWeight: Number(netWeight) || 0,
      grossWeight: Number(grossWeight) || 0,
      nonSilverWeight: Number(nonSilverWeight) || 0,
      purity,
      customFineness: Number(customFineness) || 925,
      rate: Number(rate) || 0,
      rateBasis,
      makingChargeMethod,
      makingChargePercentage: Number(makingChargePercentage) || 0,
      makingChargePerGram: Number(makingChargePerGram) || 0,
      fixedMakingCharge: Number(fixedMakingCharge) || 0,
      discountType,
      discountValue: Number(discountValue) || 0,
      otherCharges: Number(otherCharges) || 0,
      gstEnabled,
      gstRate: Number(customGstRate) || 0,
    };
  }, [
    weightMode,
    netWeight,
    grossWeight,
    nonSilverWeight,
    purity,
    customFineness,
    rate,
    rateBasis,
    makingChargeMethod,
    makingChargePercentage,
    makingChargePerGram,
    fixedMakingCharge,
    discountType,
    discountValue,
    otherCharges,
    gstEnabled,
    customGstRate,
  ]);

  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } =
    useCalculatorState(inputs);
  const activeInputs = calculatedInputs || inputs;

  // VALIDATION & CALCULATION ENGINE
  const validation = useMemo(() => validateSilverJewelleryInputs(inputs), [inputs]);
  const result = useMemo(() => calculateSilverJewelleryBill(activeInputs), [activeInputs]);

  // RESET FUNCTION
  const handleReset = () => {
    setNetWeight(20);
    setPurity("925");
    setCustomFineness(925);
    setRate(100);
    setMakingChargeMethod("percentage");
    setMakingChargePercentage(10);
    setMakingChargePerGram(15);
    setFixedMakingCharge(300);
    setShowMakingChargeType(false);

    setRateBasis("selected_purity");
    setWeightMode("net");
    setGrossWeight(25);
    setNonSilverWeight(5);
    setDiscountType("none");
    setDiscountValue(5);
    setOtherCharges(0);
    setGstEnabled(true);
    setCustomGstRate(3);
    setShowAdvanced(false);
    setShowFullBreakdown(false);
    resetCalculated();
  };

  // COPY SUMMARY
  const handleCopySummary = async () => {
    const summary = `--- Silver Jewellery Bill Estimate (CalcZen) ---
Silver Weight: ${result.formattedNetWeight}
Purity: ${result.purityDisplay}
Silver Price: ${result.formattedSilverValue}
Making Charges: ${result.formattedMakingCharges}
${result.otherCharges > 0 ? `Other Charges: ${result.formattedOtherCharges}\n` : ""}${result.discountAmount > 0 ? `Discount: -${result.formattedDiscount}\n` : ""}GST (${inputs.gstEnabled ? `${inputs.gstRate}%` : "0%"}): ${result.formattedGstAmount}
------------------------------------------------
TOTAL ESTIMATED PRICE: ${result.formattedFinalBill}
Generated at: https://www.calczen.in/calculator/silver-jewellery-bill-calculator`;

    try {
      await navigator.clipboard.writeText(summary);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // PDF EXPORT DATA
  const pdfData = useMemo(() => {
    return {
      calculatorName: "Silver Jewellery Bill Calculator",
      calculatorSlug: "silver-jewellery-bill-calculator",
      siteName: "CalcZen",
      siteUrl: "https://www.calczen.in",
      inputs: [
        { label: "Silver Weight", value: result.formattedNetWeight },
        { label: "Silver Purity", value: result.purityDisplay },
        { label: "Silver Rate", value: `${result.formattedEffectiveRate} / gram` },
        {
          label: "Making Charges",
          value:
            inputs.makingChargeMethod === "percentage"
              ? `${inputs.makingChargePercentage}%`
              : inputs.makingChargeMethod === "per_gram"
              ? `${formatINR(inputs.makingChargePerGram)} / gram`
              : formatINR(inputs.fixedMakingCharge),
        },
        { label: "GST Rate", value: inputs.gstEnabled ? `${inputs.gstRate}%` : "Excluded (0%)" },
      ],
      results: [
        { label: "Silver Price", value: result.formattedSilverValue },
        { label: "Making Charges", value: result.formattedMakingCharges },
        ...(result.otherCharges > 0
          ? [{ label: "Other Charges", value: result.formattedOtherCharges }]
          : []),
        ...(result.discountAmount > 0
          ? [{ label: "Discount", value: `-${result.formattedDiscount}` }]
          : []),
        { label: "Taxable Amount", value: result.formattedTaxableValue },
        { label: "GST", value: result.formattedGstAmount },
        { label: "Total Estimated Price", value: result.formattedFinalBill },
      ],
    };
  }, [result, inputs]);

  // Selected purity helper explanation
  const purityNote = useMemo(() => {
    if (purity === "custom") return "Enter custom fineness parts per 1,000.";
    const pConfig = BIS_SILVER_PURITY_OPTIONS[purity];
    return pConfig ? pConfig.description : "925 silver contains approximately 92.5% silver.";
  }, [purity]);

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Find out how much money you need to pay for your silver jewellery in seconds. Enter your weight, purity, rate, and making charges to get a clean price breakdown with 3% GST."
      formula={`Silver Price = Silver Weight (g) × Silver Rate per Gram\n\nMaking Charges = Percentage, Per-gram, or Fixed Amount\n\nGST (3%) = (Silver Price + Making Charges − Discount + Other Charges) × 3%\n\nTotal Payable Amount = Taxable Amount + GST`}
      example={`20 grams of 925 Silver at ₹100/g with 10% Making Charges:\n• Silver Price = 20g × ₹100 = ₹2,000\n• Making Charges (10%) = ₹200\n• GST (3%) = ₹66\n• Total Estimated Price = ₹2,266`}
      faqs={SILVER_JEWELLERY_BLOG_CONTENT.faqs!}
      blog={<CalculatorBlog content={SILVER_JEWELLERY_BLOG_CONTENT} />}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================= */}
          {/* LEFT: 4 SIMPLE INPUT SECTIONS + MORE OPTIONS              */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-7 bg-card border border-border rounded-2xl shadow-xs space-y-6">
              {/* SECTION 1: SILVER WEIGHT */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="silverWeight" className="text-base font-semibold text-foreground">
                    How much silver jewellery?
                  </Label>
                  <span className="text-xs font-medium text-muted-foreground">in grams</span>
                </div>
                <div className="relative">
                  <Input
                    id="silverWeight"
                    type="number"
                    min={0}
                    step="any"
                    value={netWeight === 0 ? "" : netWeight}
                    onChange={(e) => {
                      setNetWeight(e.target.value === "" ? 0 : Number(e.target.value));
                    }}
                    className="h-12 text-lg font-semibold pr-16 rounded-xl border-border focus:ring-2 focus:ring-primary/20"
                    placeholder="20"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                    grams
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter the weight of your jewellery.
                </p>
              </div>

              {/* SECTION 2: SILVER PURITY */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="silverPurity" className="text-base font-semibold text-foreground">
                    What type of silver?
                  </Label>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Standard Purity
                  </span>
                </div>

                <select
                  id="silverPurity"
                  value={purity}
                  onChange={(e) => {
                    setPurity(e.target.value as SilverPurity);
                  }}
                  className="w-full h-12 px-4 bg-background border border-border rounded-xl text-base font-medium text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                >
                  {SILVER_PURITY_ORDER.map((key) => {
                    const opt = BIS_SILVER_PURITY_OPTIONS[key];
                    return (
                      <option key={opt.key} value={opt.key}>
                        {opt.label}
                      </option>
                    );
                  })}
                </select>

                <p className="text-xs text-muted-foreground">
                  {purityNote}
                </p>

                {purity === "custom" && (
                  <div className="p-3.5 rounded-xl border border-border/80 bg-muted/20 space-y-1.5">
                    <Label htmlFor="customFineness" className="text-xs font-medium">
                      Enter Fineness (parts per 1,000, e.g. 925 for 92.5%)
                    </Label>
                    <div className="relative">
                      <Input
                        id="customFineness"
                        type="number"
                        min={1}
                        max={1000}
                        value={customFineness}
                        onChange={(e) => {
                          setCustomFineness(Number(e.target.value));
                        }}
                        className="h-10 text-sm font-medium pr-16"
                        placeholder="925"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-semibold">
                        / 1000
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: SILVER RATE */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="silverRate" className="text-base font-semibold text-foreground">
                    Silver price per gram
                  </Label>
                  <span className="text-xs text-muted-foreground">Rupees (₹)</span>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    id="silverRate"
                    type="number"
                    min={0}
                    step="any"
                    value={rate === 0 ? "" : rate}
                    onChange={(e) => {
                      setRate(e.target.value === "" ? 0 : Number(e.target.value));
                    }}
                    className="h-12 text-lg font-semibold pl-9 pr-24 rounded-xl border-border focus:ring-2 focus:ring-primary/20"
                    placeholder="100"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                    per gram
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter the silver rate given by your jeweller.
                </p>
              </div>

              {/* SECTION 4: MAKING CHARGES */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold text-foreground">
                    Making charges
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowMakingChargeType(!showMakingChargeType)}
                    className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1"
                  >
                    <span>Change making charge type</span>
                    {showMakingChargeType ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                {/* Optional Expanded Making Charge Type Selector */}
                {showMakingChargeType && (
                  <div className="flex items-center gap-1.5 p-1 bg-muted rounded-xl text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setMakingChargeMethod("percentage");
                      }}
                      className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                        makingChargeMethod === "percentage"
                          ? "bg-card text-foreground shadow-xs font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Percentage (%)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMakingChargeMethod("per_gram");
                      }}
                      className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                        makingChargeMethod === "per_gram"
                          ? "bg-card text-foreground shadow-xs font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Per gram (₹/g)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMakingChargeMethod("fixed");
                      }}
                      className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                        makingChargeMethod === "fixed"
                          ? "bg-card text-foreground shadow-xs font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Fixed amount (₹)
                    </button>
                  </div>
                )}

                {/* Making Charge Input Field */}
                {makingChargeMethod === "percentage" && (
                  <div className="relative">
                    <Input
                      id="makingChargePercentage"
                      type="number"
                      min={0}
                      step="any"
                      value={makingChargePercentage === 0 ? "" : makingChargePercentage}
                      onChange={(e) => {
                        setMakingChargePercentage(
                          e.target.value === "" ? 0 : Number(e.target.value)
                        );
                      }}
                      className="h-12 text-lg font-semibold pr-12 rounded-xl"
                      placeholder="10"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                      %
                    </span>
                  </div>
                )}

                {makingChargeMethod === "per_gram" && (
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-muted-foreground">
                      ₹
                    </span>
                    <Input
                      id="makingChargePerGram"
                      type="number"
                      min={0}
                      step="any"
                      value={makingChargePerGram === 0 ? "" : makingChargePerGram}
                      onChange={(e) => {
                        setMakingChargePerGram(e.target.value === "" ? 0 : Number(e.target.value));
                      }}
                      className="h-12 text-lg font-semibold pl-9 pr-24 rounded-xl"
                      placeholder="15"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                      per gram
                    </span>
                  </div>
                )}

                {makingChargeMethod === "fixed" && (
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-muted-foreground">
                      ₹
                    </span>
                    <Input
                      id="fixedMakingCharge"
                      type="number"
                      min={0}
                      step="any"
                      value={fixedMakingCharge === 0 ? "" : fixedMakingCharge}
                      onChange={(e) => {
                        setFixedMakingCharge(e.target.value === "" ? 0 : Number(e.target.value));
                      }}
                      className="h-12 text-lg font-semibold pl-9 rounded-xl"
                      placeholder="300"
                    />
                  </div>
                )}
              </div>

              {/* COLLAPSIBLE MORE OPTIONS (PRESERVES ADVANCED FEATURES) */}
              <div className="border border-border/80 rounded-xl overflow-hidden bg-muted/15">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between p-3.5 text-left hover:bg-muted/30 transition-colors text-xs font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-primary" />
                    <span>More options (Stones, 999 Rate, Discounts, Other Charges & GST)</span>
                    {(discountType !== "none" ||
                      otherCharges > 0 ||
                      !gstEnabled ||
                      rateBasis === "999" ||
                      weightMode === "gross_stone") && (
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
                    {/* A. Rate Basis Selection */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-foreground">
                        Rate Basis:
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setRateBasis("selected_purity");
                          }}
                          className={`p-2.5 rounded-lg border text-left transition-all ${
                            rateBasis === "selected_purity"
                              ? "border-primary bg-primary/10 font-semibold"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          <div className="text-xs font-medium text-foreground">
                            Rate is for {result.purityDisplay}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Direct rate for this jewellery's purity.
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRateBasis("999");
                          }}
                          className={`p-2.5 rounded-lg border text-left transition-all ${
                            rateBasis === "999"
                              ? "border-primary bg-primary/10 font-semibold"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          <div className="text-xs font-medium text-foreground">
                            Rate is for 999 Pure Silver
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Converts automatically using fineness.
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* B. Weight Details (Gross vs Stones) */}
                    <div className="space-y-2 pt-2 border-t border-border/40">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Scale className="h-3.5 w-3.5 text-primary" />
                          Gross Weight & Stones
                        </Label>
                        <button
                          type="button"
                          onClick={() => {
                            setWeightMode(weightMode === "net" ? "gross_stone" : "net");
                          }}
                          className="text-[11px] text-primary hover:underline font-medium"
                        >
                          {weightMode === "net"
                            ? "+ Deduct stones from gross"
                            : "Switch to direct net weight"}
                        </button>
                      </div>

                      {weightMode === "gross_stone" && (
                        <div className="p-3 rounded-xl border border-border/60 bg-muted/10 space-y-2.5">
                          <div className="grid grid-cols-2 gap-2.5">
                            <div className="space-y-1">
                              <span className="text-[11px] text-muted-foreground">Gross Weight (g)</span>
                              <Input
                                type="number"
                                min={0}
                                step="any"
                                value={grossWeight === 0 ? "" : grossWeight}
                                onChange={(e) => {
                                  setGrossWeight(e.target.value === "" ? 0 : Number(e.target.value));
                                }}
                                className="h-9 text-xs"
                                placeholder="25"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[11px] text-muted-foreground">Stones / Non-Silver (g)</span>
                              <Input
                                type="number"
                                min={0}
                                step="any"
                                value={nonSilverWeight === 0 ? "" : nonSilverWeight}
                                onChange={(e) => {
                                  setNonSilverWeight(
                                    e.target.value === "" ? 0 : Number(e.target.value)
                                  );
                                }}
                                className="h-9 text-xs"
                                placeholder="5"
                              />
                            </div>
                          </div>
                          <div className="text-[11px] text-muted-foreground flex justify-between pt-1 border-t border-border/40">
                            <span>Calculated Net Silver:</span>
                            <strong className="text-foreground">
                              {roundTo(Math.max(0, grossWeight - nonSilverWeight), 3)} grams
                            </strong>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* C. Discounts */}
                    <div className="space-y-2 pt-2 border-t border-border/40">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Tag className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          Jeweller Discount
                        </Label>
                        <div className="flex items-center gap-1 bg-muted p-1 rounded-md text-[11px]">
                          <button
                            type="button"
                            onClick={() => {
                              setDiscountType("none");
                            }}
                            className={`px-2 py-0.5 rounded transition-all ${
                              discountType === "none" ? "bg-card font-semibold shadow-xs" : "text-muted-foreground"
                            }`}
                          >
                            None
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDiscountType("percentage");
                            }}
                            className={`px-2 py-0.5 rounded transition-all ${
                              discountType === "percentage" ? "bg-card font-semibold shadow-xs" : "text-muted-foreground"
                            }`}
                          >
                            %
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDiscountType("fixed");
                            }}
                            className={`px-2 py-0.5 rounded transition-all ${
                              discountType === "fixed" ? "bg-card font-semibold shadow-xs" : "text-muted-foreground"
                            }`}
                          >
                            ₹ Fixed
                          </button>
                        </div>
                      </div>

                      {discountType !== "none" && (
                        <div className="relative">
                          {discountType === "fixed" && (
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                              ₹
                            </span>
                          )}
                          <Input
                            type="number"
                            min={0}
                            step="any"
                            value={discountValue === 0 ? "" : discountValue}
                            onChange={(e) => {
                              setDiscountValue(e.target.value === "" ? 0 : Number(e.target.value));
                            }}
                            className={`h-9 text-xs font-medium ${discountType === "fixed" ? "pl-7" : "pr-8"}`}
                            placeholder="0"
                          />
                          {discountType === "percentage" && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                              %
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* D. Other Charges */}
                    <div className="space-y-1.5 pt-2 border-t border-border/40">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="otherCharges" className="text-xs font-semibold text-foreground">
                          Other charges (Packaging, certification, etc.)
                        </Label>
                        <span className="text-[11px] text-muted-foreground">Optional</span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          ₹
                        </span>
                        <Input
                          id="otherCharges"
                          type="number"
                          min={0}
                          value={otherCharges === 0 ? "" : otherCharges}
                          onChange={(e) => {
                            setOtherCharges(e.target.value === "" ? 0 : Number(e.target.value));
                          }}
                          className="h-9 text-xs pl-7"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* E. GST Settings */}
                    <div className="space-y-2 pt-2 border-t border-border/40">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Receipt className="h-3.5 w-3.5 text-primary" />
                          GST Calculation
                        </Label>
                        <div className="flex items-center gap-1 bg-muted p-1 rounded-md text-[11px]">
                          <button
                            type="button"
                            onClick={() => {
                              setGstEnabled(true);
                              setCustomGstRate(3);
                            }}
                            className={`px-2 py-0.5 rounded transition-all ${
                              gstEnabled ? "bg-card font-semibold shadow-xs" : "text-muted-foreground"
                            }`}
                          >
                            Include 3% GST
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setGstEnabled(false);
                            }}
                            className={`px-2 py-0.5 rounded transition-all ${
                              !gstEnabled ? "bg-card font-semibold shadow-xs" : "text-muted-foreground"
                            }`}
                          >
                            Exclude GST
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* PRIMARY CALCULATE BUTTON */}
              <Button
                type="button"
                onClick={() => {
                  resultsRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full h-12 text-base font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-950 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Calculator className="h-4 w-4" />
                Calculate Price
              </Button>
            </div>

            {/* Validation Alert */}
            {!validation.isValid && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>
                  {Object.values(validation.errors)[0] || "Please check your input values."}
                </span>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* RIGHT: SIMPLIFIED RESULTS & BILL BREAKDOWN                */}
          {/* ========================================================= */}
          <div ref={resultsRef} className="lg:col-span-5 space-y-6">
            {hasResult ? (
              <>
                {isOutdated && (
                  <OutdatedResultBanner
                    onCalculate={() => {
                      markCalculated();
                      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
                    }}
                  />
                )}
                <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-5 lg:sticky lg:top-24">
              {/* Result Header Hero Box (Crisp, premium, black price text on neutral card) */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
                    Estimated Jewellery Price
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700">
                    Net Payable
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-black tracking-tight text-black dark:text-white">
                  {result.formattedFinalBill}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Approximate amount you may pay for this silver jewellery.
                </p>
              </div>

              {/* Simple 4-Line Price Breakdown (Clean Calculator Palette) */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-sm shadow-2xs divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-950">
                {/* 1. Silver Metal Value: Blue */}
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">Silver price:</span>
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-sm sm:text-base">
                    {result.formattedSilverValue}
                  </span>
                </div>

                {/* 2. Making Charges: Vibrant Amber/Orange */}
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Making charges
                      {inputs.makingChargeMethod === "percentage"
                        ? ` (${inputs.makingChargePercentage}%)`
                        : ""}:
                    </span>
                  </span>
                  <span className="font-bold text-amber-500 dark:text-amber-400 text-sm sm:text-base">
                    +{result.formattedMakingCharges}
                  </span>
                </div>

                {/* Optional Discount: Emerald Green */}
                {result.discountAmount > 0 && (
                  <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">Discount:</span>
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm sm:text-base">
                      −{result.formattedDiscount}
                    </span>
                  </div>
                )}

                {/* Optional Other Charges */}
                {result.otherCharges > 0 && (
                  <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">Other charges:</span>
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-sm sm:text-base">
                      +{result.formattedOtherCharges}
                    </span>
                  </div>
                )}

                {/* 3. GST (3%): Purple / Indigo */}
                {inputs.gstEnabled ? (
                  <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">GST ({inputs.gstRate}%):</span>
                    </span>
                    <span className="font-bold text-purple-600 dark:text-purple-400 text-sm sm:text-base">
                      +{result.formattedGstAmount}
                    </span>
                  </div>
                ) : (
                  <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">GST:</span>
                    </span>
                    <span className="font-semibold text-muted-foreground">Excluded (₹0)</span>
                  </div>
                )}

                {/* 4. Total Amount: Crisp Black Price on Neutral Background */}
                <div className="px-4 py-3.5 flex items-center justify-between bg-slate-100/70 dark:bg-slate-900/60 border-t-2 border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-white shrink-0" />
                    <span>Total amount:</span>
                  </span>
                  <span className="text-lg sm:text-xl font-black text-black dark:text-white">
                    {result.formattedFinalBill}
                  </span>
                </div>
              </div>

              {/* Expandable Link: View Full Price Breakdown */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowFullBreakdown(!showFullBreakdown)}
                  className="w-full flex items-center justify-between py-2 text-xs font-semibold text-primary hover:underline"
                >
                  <span>{showFullBreakdown ? "Hide full price breakdown" : "View full price breakdown"}</span>
                  {showFullBreakdown ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>

                {showFullBreakdown && (
                  <div className="mt-2.5 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-xs space-y-2.5 shadow-2xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Silver weight used:</span>
                      <strong className="text-slate-900 dark:text-slate-100 font-semibold">{result.formattedNetWeight}</strong>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Selected purity:</span>
                      <strong className="text-slate-900 dark:text-slate-100 font-semibold">{result.purityDisplay}</strong>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Rate used:</span>
                      <strong className="text-blue-600 dark:text-blue-400 font-bold">{result.formattedEffectiveRate} / g</strong>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Metal value:</span>
                      <strong className="text-blue-600 dark:text-blue-400 font-bold">{result.formattedSilverValue}</strong>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Making-charge method:</span>
                      <strong className="text-amber-500 dark:text-amber-400 font-semibold capitalize">
                        {inputs.makingChargeMethod === "per_gram"
                          ? `₹${inputs.makingChargePerGram} per gram`
                          : inputs.makingChargeMethod}
                      </strong>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Total making charges:</span>
                      <strong className="text-amber-500 dark:text-amber-400 font-bold">+{result.formattedMakingCharges}</strong>
                    </div>

                    {result.otherCharges > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Other charges:</span>
                        <strong className="text-slate-700 dark:text-slate-300 font-bold">+{result.formattedOtherCharges}</strong>
                      </div>
                    )}

                    {result.discountAmount > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Discount applied:</span>
                        <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                          −{result.formattedDiscount}
                        </strong>
                      </div>
                    )}

                    <div className="flex justify-between text-muted-foreground pt-2 border-t border-border/40">
                      <span>Taxable amount:</span>
                      <strong className="text-slate-900 dark:text-slate-100 font-bold">{result.formattedTaxableValue}</strong>
                    </div>

                    {inputs.gstEnabled && (
                      <>
                        <div className="flex justify-between text-muted-foreground pl-2 text-[11px]">
                          <span>• CGST (1.5%):</span>
                          <strong className="text-purple-600 dark:text-purple-400 font-semibold">{formatINR(result.cgstAmount)}</strong>
                        </div>
                        <div className="flex justify-between text-muted-foreground pl-2 text-[11px]">
                          <span>• SGST (1.5%):</span>
                          <strong className="text-purple-600 dark:text-purple-400 font-semibold">{formatINR(result.sgstAmount)}</strong>
                        </div>
                      </>
                    )}

                    <div className="flex justify-between text-muted-foreground">
                      <span>GST ({inputs.gstEnabled ? `${inputs.gstRate}%` : "0%"}):</span>
                      <strong className="text-purple-600 dark:text-purple-400 font-bold">
                        {inputs.gstEnabled ? `+${result.formattedGstAmount}` : "Excluded (₹0)"}
                      </strong>
                    </div>
                    <div className="flex justify-between font-bold text-foreground pt-2 border-t border-border/40 text-sm">
                      <span>Final total amount:</span>
                      <strong className="text-black dark:text-white font-black">{result.formattedFinalBill}</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Short User-Friendly Note */}
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Actual jewellery prices may differ depending on the jeweller's rate, workmanship, additional charges and applicable taxes.
              </p>

              {/* Action Buttons Toolbar */}
              <div className="pt-3 border-t border-border/60 space-y-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopySummary}
                    className="h-10 text-xs font-semibold rounded-xl border-border hover:bg-muted"
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
                    disabled={result.netWeight <= 0}
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
              </>
            ) : (
              <EmptyResultPlaceholder
                message="Ready to calculate silver jewellery bill"
                subMessage="Enter your weight, purity, and rate, then press Calculate Price to see your itemized bill estimate."
               />
            )}
          </div>
        </div>
      </div>
    </CalculatorPageLayout>
  );
}
