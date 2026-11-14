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
  ShieldCheck,
  Gem,
  Info,
  ChevronDown,
  ChevronUp,
  Sliders,
  Scale,
  Tag,
  Receipt,
  Coins,
} from "lucide-react";
import {
  calculateDiamondJewelleryPrice,
  validateDiamondJewelleryInputs,
  formatINR,
  roundTo,
  caratToGrams,
  type DiamondCalculationMode,
  type DiamondPricingBasis,
  type DiamondOrigin,
  type DiamondCut,
  type DiamondColor,
  type DiamondClarity,
  type DiamondShape,
  type DiamondCertification,
  type MakingChargeMethod,
  type DiscountType,
  type DiamondJewelleryInputs,
  type DiamondJewelleryResult,
} from "@/utils/diamondJewelleryUtils";

export function DiamondJewelleryPriceCalculator() {
  const calc = getCalculator("diamond-jewellery-price-calculator")!;
  const resultsRef = useRef<HTMLDivElement>(null);

  // Mode Selection
  const [mode, setMode] = useState<DiamondCalculationMode>("simple");

  // Simple Mode Inputs
  const [directDiamondPrice, setDirectDiamondPrice] = useState<number>(40000);
  const [directMetalPrice, setDirectMetalPrice] = useState<number>(50000);

  // Advanced Mode Diamond Inputs
  const [diamondCaratWeight, setDiamondCaratWeight] = useState<number>(0.5);
  const [pricingBasis, setPricingBasis] = useState<DiamondPricingBasis>("per_carat");
  const [pricePerCarat, setPricePerCarat] = useState<number>(80000);
  const [totalDiamondPrice, setTotalDiamondPrice] = useState<number>(40000);
  const [origin, setOrigin] = useState<DiamondOrigin>("natural");
  const [cut, setCut] = useState<DiamondCut>("excellent");
  const [color, setColor] = useState<DiamondColor>("D-F");
  const [clarity, setClarity] = useState<DiamondClarity>("VS1-VS2");
  const [shape, setShape] = useState<DiamondShape>("round");
  const [certification, setCertification] = useState<DiamondCertification>("IGI");

  // Advanced Metal Inputs
  const [metalCalculationMode, setMetalCalculationMode] = useState<"direct" | "breakdown">("direct");
  const [metalWeightGrams, setMetalWeightGrams] = useState<number>(8.0);
  const [metalPurityKarat, setMetalPurityKarat] = useState<string>("18K Gold");
  const [metalRatePerGram, setMetalRatePerGram] = useState<number>(6250);

  // Making charges
  const [makingChargeMethod, setMakingChargeMethod] = useState<MakingChargeMethod>("percentage");
  const [makingChargePercentage, setMakingChargePercentage] = useState<number>(10);
  const [makingChargePerGram, setMakingChargePerGram] = useState<number>(500);
  const [fixedMakingCharge, setFixedMakingCharge] = useState<number>(3000);

  // Discounts, other fees & GST
  const [discountType, setDiscountType] = useState<DiscountType>("none");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [otherCharges, setOtherCharges] = useState<number>(0);
  const [gstEnabled, setGstEnabled] = useState<boolean>(true);

  // UI state
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);
  const [showFullBreakdown, setShowFullBreakdown] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Aggregate Inputs
  const inputs: DiamondJewelleryInputs = useMemo(() => {
    return {
      mode,
      directDiamondPrice: Number(directDiamondPrice) || 0,
      directMetalPrice: Number(directMetalPrice) || 0,

      diamonds: [
        {
          id: "d1",
          caratWeight: Number(diamondCaratWeight) || 0,
          pricingBasis,
          pricePerCarat: Number(pricePerCarat) || 0,
          totalDiamondPrice: Number(totalDiamondPrice) || 0,
          cut,
          color,
          clarity,
          shape,
          certification,
          origin,
        },
      ],

      metalWeightGrams: Number(metalWeightGrams) || 0,
      metalPurityKarat,
      metalRatePerGram: Number(metalRatePerGram) || 0,
      metalCalculationMode,

      makingChargeMethod,
      makingChargePercentage: Number(makingChargePercentage) || 0,
      makingChargePerGram: Number(makingChargePerGram) || 0,
      fixedMakingCharge: Number(fixedMakingCharge) || 0,

      discountType,
      discountValue: Number(discountValue) || 0,
      otherCharges: Number(otherCharges) || 0,

      gstEnabled,
      gstRate: 3, // Statutory CBIC Finished Jewellery retail GST
    };
  }, [
    mode,
    directDiamondPrice,
    directMetalPrice,
    diamondCaratWeight,
    pricingBasis,
    pricePerCarat,
    totalDiamondPrice,
    cut,
    color,
    clarity,
    shape,
    certification,
    origin,
    metalWeightGrams,
    metalPurityKarat,
    metalRatePerGram,
    metalCalculationMode,
    makingChargeMethod,
    makingChargePercentage,
    makingChargePerGram,
    fixedMakingCharge,
    discountType,
    discountValue,
    otherCharges,
    gstEnabled,
  ]);

  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } =
    useCalculatorState(inputs);
  const activeInputs = calculatedInputs || inputs;

  // Validation
  const validation = useMemo(() => validateDiamondJewelleryInputs(inputs), [inputs]);

  // Calculation Results
  const result: DiamondJewelleryResult = useMemo(() => {
    return calculateDiamondJewelleryPrice(activeInputs);
  }, [activeInputs]);

  // Reset to defaults
  const handleReset = () => {
    setMode("simple");
    setDirectDiamondPrice(40000);
    setDirectMetalPrice(50000);
    setDiamondCaratWeight(0.5);
    setPricingBasis("per_carat");
    setPricePerCarat(80000);
    setTotalDiamondPrice(40000);
    setMakingChargeMethod("percentage");
    setMakingChargePercentage(10);
    setDiscountType("none");
    setDiscountValue(0);
    setOtherCharges(0);
    setGstEnabled(true);
    setShowAdvancedOptions(false);
    setShowFullBreakdown(false);
    markCalculated();
  };

  // Copy Summary to Clipboard
  const handleCopySummary = async () => {
    const summary = [
      `=== CalcZen: Diamond Jewellery Price Estimate ===`,
      `Diamond Price: ${result.formattedDiamondValue}`,
      `Metal Price: ${result.formattedMetalValue}`,
      `Making Charges: ${result.formattedMakingCharges} (${result.makingChargeMethodLabel})`,
      ...(result.otherCharges > 0 ? [`Other Charges: ${result.formattedOtherCharges}`] : []),
      ...(result.discountAmount > 0 ? [`Discount: −${result.formattedDiscount}`] : []),
      `Taxable Value: ${result.formattedTaxableValue}`,
      `GST (3%): ${result.formattedGstAmount}`,
      `------------------------------------------`,
      `Total Estimated Price: ${result.formattedFinalBill}`,
      `------------------------------------------`,
      mode === "advanced"
        ? `Diamond Specs: ${diamondCaratWeight} ct • ${origin.toUpperCase()} • ${cut.toUpperCase()} cut • ${color} colour • ${clarity} clarity • ${certification}`
        : `Estimate based on quotation inputs.`,
      `\nCalculate online: https://www.calczen.in/calculator/diamond-jewellery-price-calculator`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summary);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      /* ignore */
    }
  };

  // PDF Data
  const pdfData = useMemo(() => {
    return {
      title: "Diamond Jewellery Price Estimate",
      subtitle: `Retail Price Breakdown with 3% GST`,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      inputs: [
        { label: "Calculation Mode", value: mode === "simple" ? "Simple (Quotation)" : "Advanced (Quality)" },
        ...(mode === "advanced"
          ? [
              { label: "Diamond Weight", value: `${diamondCaratWeight} ct (${caratToGrams(diamondCaratWeight)}g)` },
              { label: "Diamond Origin", value: origin === "lab_grown" ? "Lab-Grown" : "Natural" },
              { label: "Quality Grade", value: `${color} / ${clarity} / ${cut.toUpperCase()} Cut` },
              { label: "Certification", value: certification },
            ]
          : []),
        { label: "Making Charges Method", value: result.makingChargeMethodLabel },
        { label: "GST Status", value: gstEnabled ? "3% Included" : "Excluded" },
      ],
      results: [
        { label: "Diamond Value", value: result.formattedDiamondValue },
        { label: "Gold / Metal Value", value: result.formattedMetalValue },
        { label: "Making Charges", value: result.formattedMakingCharges },
        ...(result.otherCharges > 0 ? [{ label: "Other Charges", value: result.formattedOtherCharges }] : []),
        ...(result.discountAmount > 0 ? [{ label: "Discount", value: `-${result.formattedDiscount}` }] : []),
        { label: "Taxable Value", value: result.formattedTaxableValue },
        { label: "GST (3%)", value: result.formattedGstAmount },
        { label: "Total Estimated Price", value: result.formattedFinalBill },
      ],
    };
  }, [result, mode, diamondCaratWeight, origin, color, clarity, cut, certification, gstEnabled]);

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Estimate your diamond jewellery price accurately. Calculate diamond cost, gold value, making charges, and 3% GST to compare jeweller quotations before buying."
      formula={`Diamond Value = Diamond Price (or Carat Weight × Price per Carat)\n\nTaxable Subtotal = Diamond Value + Metal Value + Making Charges + Other Charges − Discount\n\nGST (3%) = Taxable Subtotal × 3%\n\nFinal Jewellery Price = Taxable Subtotal + GST`}
      example={`Diamond Ring with ₹40,000 Diamond and ₹50,000 Gold:\n• Diamond Value = ₹40,000\n• Gold Metal Value = ₹50,000\n• Making Charges (10% on Gold) = ₹5,000\n• Taxable Subtotal = ₹95,000\n• GST (3%) = ₹2,850\n• Estimated Total Price = ₹97,850`}
      faqs={DIAMOND_JEWELLERY_BLOG_CONTENT.faqs!}
      blog={<CalculatorBlog content={DIAMOND_JEWELLERY_BLOG_CONTENT} />}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================= */}
          {/* LEFT: CALCULATION INPUTS                                  */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-7 bg-card border border-border rounded-2xl shadow-xs space-y-6">
              {/* MODE SELECTOR */}
              <div className="space-y-2">
                <Label className="text-base font-semibold text-foreground">
                  Choose Calculation Mode
                </Label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-muted rounded-xl text-xs sm:text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("simple");
                      markCalculated();
                    }}
                    className={`py-2 px-2 rounded-lg font-semibold transition-all text-center ${
                      mode === "simple"
                        ? "bg-card text-foreground shadow-xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Calculate from Quotation (Simple)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("advanced");
                      markCalculated();
                    }}
                    className={`py-2 px-2 rounded-lg font-semibold transition-all text-center ${
                      mode === "advanced"
                        ? "bg-card text-foreground shadow-xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Estimate by Diamond Quality
                  </button>
                </div>
              </div>

              {/* MODE A: SIMPLE MODE INPUTS */}
              {mode === "simple" && (
                <div className="space-y-5">
                  {/* 1. Diamond Price */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="directDiamondPrice" className="text-sm font-semibold text-foreground">
                        Diamond price
                      </Label>
                      <span className="text-xs text-muted-foreground">Total quoted ₹</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-muted-foreground">
                        ₹
                      </span>
                      <Input
                        id="directDiamondPrice"
                        type="number"
                        min={0}
                        step="any"
                        value={directDiamondPrice === 0 ? "" : directDiamondPrice}
                        onChange={(e) => {
                          setDirectDiamondPrice(e.target.value === "" ? 0 : Number(e.target.value));
                          markCalculated();
                        }}
                        className="h-12 text-lg font-semibold pl-9 rounded-xl"
                        placeholder="40000"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Enter the total price of the diamond or diamonds quoted by your jeweller.
                    </p>
                  </div>

                  {/* 2. Gold / Metal Price */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="directMetalPrice" className="text-sm font-semibold text-foreground">
                        Gold / metal price
                      </Label>
                      <span className="text-xs text-muted-foreground">Total metal ₹</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-muted-foreground">
                        ₹
                      </span>
                      <Input
                        id="directMetalPrice"
                        type="number"
                        min={0}
                        step="any"
                        value={directMetalPrice === 0 ? "" : directMetalPrice}
                        onChange={(e) => {
                          setDirectMetalPrice(e.target.value === "" ? 0 : Number(e.target.value));
                          markCalculated();
                        }}
                        className="h-12 text-lg font-semibold pl-9 rounded-xl"
                        placeholder="50000"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Enter the metal value. Enter 0 if already included or if jewellery has no separate metal charge.
                    </p>
                  </div>
                </div>
              )}

              {/* MODE B: ADVANCED DIAMOND ESTIMATION INPUTS */}
              {mode === "advanced" && (
                <div className="space-y-5 p-4 rounded-xl border border-border/80 bg-muted/10">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <Gem className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                      Diamond Specifications (GIA 4Cs)
                    </span>
                  </div>

                  {/* Diamond Origin */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Diamond Origin</Label>
                    <div className="grid grid-cols-3 gap-1.5 bg-muted p-1 rounded-lg text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setOrigin("natural");
                          markCalculated();
                        }}
                        className={`py-1.5 rounded-md font-medium transition-all ${
                          origin === "natural" ? "bg-card text-foreground font-semibold shadow-2xs" : "text-muted-foreground"
                        }`}
                      >
                        Natural Diamond
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOrigin("lab_grown");
                          markCalculated();
                        }}
                        className={`py-1.5 rounded-md font-medium transition-all ${
                          origin === "lab_grown" ? "bg-card text-foreground font-semibold shadow-2xs" : "text-muted-foreground"
                        }`}
                      >
                        Lab-Grown
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOrigin("not_sure");
                          markCalculated();
                        }}
                        className={`py-1.5 rounded-md font-medium transition-all ${
                          origin === "not_sure" ? "bg-card text-foreground font-semibold shadow-2xs" : "text-muted-foreground"
                        }`}
                      >
                        Not Sure
                      </button>
                    </div>
                  </div>

                  {/* Diamond Weight & Pricing Basis */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <Label htmlFor="diamondCarat" className="text-xs font-semibold text-foreground">
                          Total Diamond Weight
                        </Label>
                        <span className="text-[11px] text-muted-foreground">{caratToGrams(diamondCaratWeight)} g</span>
                      </div>
                      <div className="relative">
                        <Input
                          id="diamondCarat"
                          type="number"
                          min={0}
                          step="0.01"
                          value={diamondCaratWeight === 0 ? "" : diamondCaratWeight}
                          onChange={(e) => {
                            setDiamondCaratWeight(e.target.value === "" ? 0 : Number(e.target.value));
                            markCalculated();
                          }}
                          className="h-10 text-sm font-semibold pr-12 rounded-lg"
                          placeholder="0.50"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                          carat (ct)
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">1 carat = 0.20 grams (200 mg)</p>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Pricing Basis</Label>
                      <div className="grid grid-cols-2 gap-1 bg-muted p-1 rounded-lg text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setPricingBasis("per_carat");
                            markCalculated();
                          }}
                          className={`py-1.5 rounded-md font-medium transition-all ${
                            pricingBasis === "per_carat" ? "bg-card text-foreground font-semibold shadow-2xs" : "text-muted-foreground"
                          }`}
                        >
                          Price / Carat
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPricingBasis("total");
                            markCalculated();
                          }}
                          className={`py-1.5 rounded-md font-medium transition-all ${
                            pricingBasis === "total" ? "bg-card text-foreground font-semibold shadow-2xs" : "text-muted-foreground"
                          }`}
                        >
                          Total Price
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quoted Diamond Rate Input */}
                  <div className="space-y-1.5">
                    <Label htmlFor="diamondRateInput" className="text-xs font-semibold text-foreground">
                      {pricingBasis === "per_carat" ? "Price per Carat quoted by jeweller (₹/ct)" : "Total Diamond Price quoted (₹)"}
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                        ₹
                      </span>
                      {pricingBasis === "per_carat" ? (
                        <Input
                          id="diamondRateInput"
                          type="number"
                          min={0}
                          step="any"
                          value={pricePerCarat === 0 ? "" : pricePerCarat}
                          onChange={(e) => {
                            setPricePerCarat(e.target.value === "" ? 0 : Number(e.target.value));
                            markCalculated();
                          }}
                          className="h-10 text-sm font-semibold pl-8 rounded-lg"
                          placeholder="80000"
                        />
                      ) : (
                        <Input
                          id="diamondRateInput"
                          type="number"
                          min={0}
                          step="any"
                          value={totalDiamondPrice === 0 ? "" : totalDiamondPrice}
                          onChange={(e) => {
                            setTotalDiamondPrice(e.target.value === "" ? 0 : Number(e.target.value));
                            markCalculated();
                          }}
                          className="h-10 text-sm font-semibold pl-8 rounded-lg"
                          placeholder="40000"
                        />
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground italic">
                      Transparent pricing rule: CalcZen never fabricates market prices from 4Cs alone. Please enter the rate quoted by your jeweller.
                    </p>
                  </div>

                  {/* Optional 4C Quality Attributes (Informational & Quotation verification) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-border/50 text-xs">
                    <div>
                      <span className="text-[11px] text-muted-foreground block mb-1">Colour</span>
                      <select
                        value={color}
                        onChange={(e) => {
                          setColor(e.target.value as DiamondColor);
                          markCalculated();
                        }}
                        className="w-full h-8 px-2 rounded-md border border-border bg-card text-xs font-medium"
                      >
                        <option value="D-F">D–F (Colourless)</option>
                        <option value="G-J">G–J (Near Colourless)</option>
                        <option value="K-M">K–M (Faint)</option>
                        <option value="N-R">N–R (Very Light)</option>
                        <option value="S-Z">S–Z (Light)</option>
                        <option value="not_sure">Not Sure</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[11px] text-muted-foreground block mb-1">Clarity</span>
                      <select
                        value={clarity}
                        onChange={(e) => {
                          setClarity(e.target.value as DiamondClarity);
                          markCalculated();
                        }}
                        className="w-full h-8 px-2 rounded-md border border-border bg-card text-xs font-medium"
                      >
                        <option value="FL-IF">FL / IF (Flawless)</option>
                        <option value="VVS1-VVS2">VVS1 / VVS2</option>
                        <option value="VS1-VS2">VS1 / VS2</option>
                        <option value="SI1-SI2">SI1 / SI2</option>
                        <option value="I1-I3">I1 / I2 / I3</option>
                        <option value="not_sure">Not Sure</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[11px] text-muted-foreground block mb-1">Cut Grade</span>
                      <select
                        value={cut}
                        onChange={(e) => {
                          setCut(e.target.value as DiamondCut);
                          markCalculated();
                        }}
                        className="w-full h-8 px-2 rounded-md border border-border bg-card text-xs font-medium"
                      >
                        <option value="excellent">Excellent</option>
                        <option value="very_good">Very Good</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                        <option value="not_sure">Not Sure</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[11px] text-muted-foreground block mb-1">Certification</span>
                      <select
                        value={certification}
                        onChange={(e) => {
                          setCertification(e.target.value as DiamondCertification);
                          markCalculated();
                        }}
                        className="w-full h-8 px-2 rounded-md border border-border bg-card text-xs font-medium"
                      >
                        <option value="GIA">GIA Certified</option>
                        <option value="IGI">IGI Certified</option>
                        <option value="SGL">SGL Certified</option>
                        <option value="other">Other Lab</option>
                        <option value="none">Not Certified</option>
                        <option value="not_sure">Not Sure</option>
                      </select>
                    </div>
                  </div>

                  {/* Metal Calculation Section in Advanced Mode */}
                  <div className="pt-2 border-t border-border/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Coins className="h-3.5 w-3.5 text-amber-500" />
                        Gold / Metal Valuation Method
                      </Label>
                      <button
                        type="button"
                        onClick={() => {
                          setMetalCalculationMode(metalCalculationMode === "direct" ? "breakdown" : "direct");
                          markCalculated();
                        }}
                        className="text-[11px] text-primary hover:underline font-medium"
                      >
                        {metalCalculationMode === "direct" ? "+ Calculate from weight & rate" : "Switch to direct metal ₹"}
                      </button>
                    </div>

                    {metalCalculationMode === "direct" ? (
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                          ₹
                        </span>
                        <Input
                          type="number"
                          min={0}
                          value={directMetalPrice === 0 ? "" : directMetalPrice}
                          onChange={(e) => {
                            setDirectMetalPrice(e.target.value === "" ? 0 : Number(e.target.value));
                            markCalculated();
                          }}
                          className="h-10 text-xs pl-7 rounded-lg"
                          placeholder="50000"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <span className="text-[10px] text-muted-foreground block mb-1">Purity</span>
                          <select
                            value={metalPurityKarat}
                            onChange={(e) => {
                              setMetalPurityKarat(e.target.value);
                              markCalculated();
                            }}
                            className="w-full h-8 px-1.5 rounded-md border border-border bg-card text-xs"
                          >
                            <option value="18K Gold">18K Gold (750)</option>
                            <option value="14K Gold">14K Gold (585)</option>
                            <option value="22K Gold">22K Gold (916)</option>
                            <option value="Platinum 950">Platinum 950</option>
                          </select>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-foreground block mb-1">Weight (g)</span>
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            value={metalWeightGrams === 0 ? "" : metalWeightGrams}
                            onChange={(e) => {
                              setMetalWeightGrams(e.target.value === "" ? 0 : Number(e.target.value));
                              markCalculated();
                            }}
                            className="h-8 text-xs rounded-md"
                            placeholder="8"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-foreground block mb-1">Rate (₹/g)</span>
                          <Input
                            type="number"
                            min={0}
                            value={metalRatePerGram === 0 ? "" : metalRatePerGram}
                            onChange={(e) => {
                              setMetalRatePerGram(e.target.value === "" ? 0 : Number(e.target.value));
                              markCalculated();
                            }}
                            className="h-8 text-xs rounded-md"
                            placeholder="6250"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. Making Charges */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="makingChargeInput" className="text-sm font-semibold text-foreground">
                    Making charges
                  </Label>
                  <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setMakingChargeMethod("percentage");
                        markCalculated();
                      }}
                      className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                        makingChargeMethod === "percentage" ? "bg-card text-foreground font-semibold shadow-2xs" : "text-muted-foreground"
                      }`}
                    >
                      % of Metal
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMakingChargeMethod("fixed");
                        markCalculated();
                      }}
                      className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                        makingChargeMethod === "fixed" ? "bg-card text-foreground font-semibold shadow-2xs" : "text-muted-foreground"
                      }`}
                    >
                      Fixed (₹)
                    </button>
                    {mode === "advanced" && metalCalculationMode === "breakdown" && (
                      <button
                        type="button"
                        onClick={() => {
                          setMakingChargeMethod("per_gram");
                          markCalculated();
                        }}
                        className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                          makingChargeMethod === "per_gram" ? "bg-card text-foreground font-semibold shadow-2xs" : "text-muted-foreground"
                        }`}
                      >
                        ₹ / gram
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative">
                  {makingChargeMethod === "percentage" && (
                    <>
                      <Input
                        id="makingChargeInput"
                        type="number"
                        min={0}
                        step="any"
                        value={makingChargePercentage === 0 ? "" : makingChargePercentage}
                        onChange={(e) => {
                          setMakingChargePercentage(e.target.value === "" ? 0 : Number(e.target.value));
                          markCalculated();
                        }}
                        className="h-11 text-base font-semibold pr-10 rounded-xl"
                        placeholder="10"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                        %
                      </span>
                    </>
                  )}

                  {makingChargeMethod === "fixed" && (
                    <>
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                        ₹
                      </span>
                      <Input
                        id="makingChargeInput"
                        type="number"
                        min={0}
                        step="any"
                        value={fixedMakingCharge === 0 ? "" : fixedMakingCharge}
                        onChange={(e) => {
                          setFixedMakingCharge(e.target.value === "" ? 0 : Number(e.target.value));
                          markCalculated();
                        }}
                        className="h-11 text-base font-semibold pl-8 rounded-xl"
                        placeholder="3000"
                      />
                    </>
                  )}

                  {makingChargeMethod === "per_gram" && (
                    <>
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                        ₹
                      </span>
                      <Input
                        id="makingChargeInput"
                        type="number"
                        min={0}
                        step="any"
                        value={makingChargePerGram === 0 ? "" : makingChargePerGram}
                        onChange={(e) => {
                          setMakingChargePerGram(e.target.value === "" ? 0 : Number(e.target.value));
                          markCalculated();
                        }}
                        className="h-11 text-base font-semibold pl-8 pr-16 rounded-xl"
                        placeholder="500"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                        / gram
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* COLLAPSIBLE MORE OPTIONS (Discounts, Other Fees, GST Toggle) */}
              <div className="border border-border/80 rounded-xl overflow-hidden bg-muted/15">
                <button
                  type="button"
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-foreground hover:bg-muted/30 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-primary" />
                    More options (Discounts, Certification Fee, GST)
                  </span>
                  {showAdvancedOptions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {showAdvancedOptions && (
                  <div className="p-4 pt-1 border-t border-border/60 space-y-4">
                    {/* Discounts */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Tag className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          Jeweller Discount
                        </Label>
                        <div className="flex items-center gap-1 bg-muted p-0.5 rounded text-[11px]">
                          <button
                            type="button"
                            onClick={() => {
                              setDiscountType("none");
                              markCalculated();
                            }}
                            className={`px-2 py-0.5 rounded ${discountType === "none" ? "bg-card font-semibold shadow-2xs" : "text-muted-foreground"}`}
                          >
                            None
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDiscountType("percentage");
                              markCalculated();
                            }}
                            className={`px-2 py-0.5 rounded ${discountType === "percentage" ? "bg-card font-semibold shadow-2xs" : "text-muted-foreground"}`}
                          >
                            %
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDiscountType("fixed");
                              markCalculated();
                            }}
                            className={`px-2 py-0.5 rounded ${discountType === "fixed" ? "bg-card font-semibold shadow-2xs" : "text-muted-foreground"}`}
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
                              markCalculated();
                            }}
                            className={`h-9 text-xs ${discountType === "fixed" ? "pl-7" : "pr-7"}`}
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

                    {/* Other Charges */}
                    <div className="space-y-1.5 pt-2 border-t border-border/40">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="otherFees" className="text-xs font-semibold text-foreground">
                          Other charges (Certification, packaging, etc.)
                        </Label>
                        <span className="text-[11px] text-muted-foreground">Optional</span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          ₹
                        </span>
                        <Input
                          id="otherFees"
                          type="number"
                          min={0}
                          value={otherCharges === 0 ? "" : otherCharges}
                          onChange={(e) => {
                            setOtherCharges(e.target.value === "" ? 0 : Number(e.target.value));
                            markCalculated();
                          }}
                          className="h-9 text-xs pl-7"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* GST Control */}
                    <div className="space-y-1.5 pt-2 border-t border-border/40">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Receipt className="h-3.5 w-3.5 text-primary" />
                          GST (3% Retail Finished Jewellery)
                        </Label>
                        <div className="flex items-center gap-1 bg-muted p-0.5 rounded text-[11px]">
                          <button
                            type="button"
                            onClick={() => {
                              setGstEnabled(true);
                              markCalculated();
                            }}
                            className={`px-2 py-0.5 rounded ${gstEnabled ? "bg-card font-semibold shadow-2xs" : "text-muted-foreground"}`}
                          >
                            Include 3%
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setGstEnabled(false);
                              markCalculated();
                            }}
                            className={`px-2 py-0.5 rounded ${!gstEnabled ? "bg-card font-semibold shadow-2xs" : "text-muted-foreground"}`}
                          >
                            Exclude
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
                  markCalculated();
                  resultsRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full h-12 text-base font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-950 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Calculator className="h-4 w-4" />
                Calculate Jewellery Price
              </Button>
            </div>

            {/* Validation Alert */}
            {!validation.isValid && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{Object.values(validation.errors)[0] || "Please check your input values."}</span>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* RIGHT: CLEAN HIGH-CONTRAST RESULTS DASHBOARD              */}
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
              {/* Result Header Hero Box (Crisp solid black price on neutral card) */}
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
                {/* Hero Price: Solid Black Text */}
                <div className="text-3xl sm:text-4xl font-black tracking-tight text-black dark:text-white">
                  {result.formattedFinalBill}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Approximate amount you may pay for this diamond jewellery.
                </p>
              </div>

              {/* Simple Price Breakdown Table */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-sm shadow-2xs divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-950">
                {/* 1. Diamond Price: Blue */}
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">Diamond price:</span>
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-sm sm:text-base">
                    {result.formattedDiamondValue}
                  </span>
                </div>

                {/* 2. Gold / Metal Price: Amber */}
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">Gold / metal price:</span>
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 text-sm sm:text-base">
                    {result.formattedMetalValue}
                  </span>
                </div>

                {/* 3. Making Charges: Amber */}
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">Making charges:</span>
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 text-sm sm:text-base">
                    +{result.formattedMakingCharges}
                  </span>
                </div>

                {/* Optional Discount */}
                {result.discountAmount > 0 && (
                  <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
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
                      <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">Other charges:</span>
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-sm sm:text-base">
                      +{result.formattedOtherCharges}
                    </span>
                  </div>
                )}

                {/* 4. GST (3%): Purple */}
                {inputs.gstEnabled ? (
                  <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">GST (3%):</span>
                    </span>
                    <span className="font-bold text-purple-600 dark:text-purple-400 text-sm sm:text-base">
                      +{result.formattedGstAmount}
                    </span>
                  </div>
                ) : (
                  <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">GST:</span>
                    </span>
                    <span className="font-semibold text-muted-foreground">Excluded (₹0)</span>
                  </div>
                )}

                {/* 5. Total Amount: Crisp Black Price on Neutral Background */}
                <div className="px-4 py-3.5 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 border-t-2 border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-black dark:text-white text-sm sm:text-base flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-black dark:bg-white shrink-0" />
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
                  {showFullBreakdown ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>

                {showFullBreakdown && (
                  <div className="mt-2.5 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-xs space-y-2.5 shadow-2xs">
                    {mode === "advanced" && (
                      <>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Diamond weight:</span>
                          <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                            {diamondCaratWeight} ct ({caratToGrams(diamondCaratWeight)} g)
                          </strong>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Diamond origin:</span>
                          <strong className="text-slate-900 dark:text-slate-100 font-semibold capitalize">{origin.replace("_", " ")}</strong>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Cut / Colour / Clarity:</span>
                          <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                            {cut.toUpperCase()} / {color} / {clarity}
                          </strong>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Certification:</span>
                          <strong className="text-slate-900 dark:text-slate-100 font-semibold">{certification}</strong>
                        </div>
                      </>
                    )}

                    <div className="flex justify-between text-muted-foreground">
                      <span>Diamond value:</span>
                      <strong className="text-blue-600 dark:text-blue-400 font-bold">{result.formattedDiamondValue}</strong>
                    </div>

                    <div className="flex justify-between text-muted-foreground">
                      <span>Gold / metal value:</span>
                      <strong className="text-amber-600 dark:text-amber-400 font-bold">{result.formattedMetalValue}</strong>
                    </div>

                    <div className="flex justify-between text-muted-foreground">
                      <span>Making charges method:</span>
                      <strong className="text-slate-900 dark:text-slate-100 font-semibold">{result.makingChargeMethodLabel}</strong>
                    </div>

                    <div className="flex justify-between text-muted-foreground">
                      <span>Total making charges:</span>
                      <strong className="text-amber-600 dark:text-amber-400 font-bold">+{result.formattedMakingCharges}</strong>
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
                        <strong className="text-emerald-600 dark:text-emerald-400 font-bold">−{result.formattedDiscount}</strong>
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
                      <span>GST (3%):</span>
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

              {/* Note */}
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Actual jewellery prices may differ depending on diamond quality, certification, jeweller pricing, metal rates, workmanship, discounts and applicable taxes.
              </p>

              {/* Action Buttons Toolbar */}
              <div className="pt-2 border-t border-border/60 space-y-2.5">
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
                    disabled={!validation.isValid}
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
            message="Ready to calculate diamond jewellery price"
            subMessage="Enter diamond details, metal weight, and making charges, then press Calculate Jewellery Price."
           />
        )}
        </div>
      </div>
        </div>
    </CalculatorPageLayout>
  );
}

// RICH EDUCATIONAL BLOG CONTENT & FAQS
export const DIAMOND_JEWELLERY_BLOG_CONTENT: any = {
  title: "Diamond Jewellery Price Calculator India: Complete Guide to 4Cs, Making Charges & GST",
  description:
    "Learn how diamond rings and jewellery are priced in India. Understand diamond carat weight, 4Cs quality factors, gold value, making charges, and statutory 3% GST.",
  author: "CalcZen Jewellery Domain Specialists",
  publishDate: "November 2026",
  readTime: "7 min read",
  sections: [
    {
      title: "1. How Diamond Jewellery is Priced in India",
      paragraphs: [
        "Unlike plain gold or silver jewellery which is priced strictly by weight and daily metal rates, diamond jewellery pricing involves multiple distinct components:",
        "**Final Diamond Jewellery Price = Diamond Cost + Metal Value + Making Charges + Other Charges − Discounts + GST (3%)**",
        "Because diamonds are individual gemstones with unique optical and physical traits, two rings of the same total weight can have radically different prices based on diamond quality, cut craftsmanship, and certification.",
      ],
    },
    {
      title: "2. The GIA 4Cs of Diamond Quality",
      paragraphs: [
        "The Gemological Institute of America (GIA) established the universal standard for diamond grading, known as the 4Cs:",
        "• **Carat Weight (ct)**: The physical weight of the diamond, where 1 carat equals exactly 0.20 grams (200 milligrams). As carat weight increases, diamond rarity and price per carat rise exponentially.",
        "• **Cut**: Evaluates how effectively the diamond's facets interact with light to create sparkle, fire, and brilliance. GIA grades round diamonds from Excellent to Poor.",
        "• **Colour**: Evaluated on an alphabetical scale from D (completely colourless) to Z (light yellow or brown). D–F diamonds command the highest rarity premium.",
        "• **Clarity**: Measures internal marks (inclusions) and surface blemishes under 10× magnification, ranging from Flawless (FL) to Included (I1–I3).",
      ],
      callout: {
        type: "tip",
        title: "Carat Weight vs Gold Karat",
        text: "Never confuse diamond carat (ct) with gold karat (K). Carat with a 'C' measures gemstone weight (0.20g). Karat with a 'K' measures gold purity out of 24 parts (e.g. 18K is 75% pure gold).",
      },
    },
    {
      title: "3. Natural vs. Lab-Grown Diamonds",
      paragraphs: [
        "In modern jewellery showrooms, diamonds are available in two forms with identical chemical, physical, and optical properties:",
        "• **Natural Diamonds**: Formed over billions of years deep within the Earth under extreme heat and pressure. Valued for natural rarity and long-term resale retention.",
        "• **Lab-Grown Diamonds (CVD / HPHT)**: Created in high-tech laboratories replicating natural crystallization conditions. They are real diamonds with identical carbon lattice structures, but are priced significantly lower (often 50% to 80% less per carat) due to controlled supply.",
        "Reputable jewellers and certificates always explicitly disclose whether a stone is Natural or Lab-Grown.",
      ],
    },
    {
      title: "4. Understanding Making Charges and GST on Diamond Jewellery",
      paragraphs: [
        "Making charges on diamond jewellery compensate skilled gem-setters (prongs, pave, bezel, or channel setting) and polishers. In Indian showrooms, making charges are predominantly calculated as a percentage of the gold metal value (typically 10% to 25%), or as a flat design fee.",
        "Under Central Board of Indirect Taxes and Customs (CBIC) rules (HSN 7113), the retail purchase of finished diamond jewellery carries a statutory composite **GST rate of 3%** on the entire taxable invoice total.",
      ],
      callout: {
        type: "warning",
        title: "Estimation Tool vs. Official Gemological Appraisal",
        text: "This calculator is designed to help consumers understand price components and audit jeweller quotations. It cannot establish standalone market values for unpriced diamonds without a certified jeweller's price-per-carat rate.",
      },
    },
  ],
  faqs: [
    {
      q: "How do jewellers calculate diamond jewellery prices in India?",
      a: "Jewellers add the diamond cost (carat weight × price per carat) to the gold metal value, plus making charges and certification fees, subtract any promotional discounts, and apply 3% GST to calculate the final bill.",
    },
    {
      q: "What is 1 carat of diamond in grams?",
      a: "1 carat (ct) equals exactly 0.20 grams (200 milligrams). For example, a 0.50-carat diamond weighs 0.10 grams.",
    },
    {
      q: "What is the GST rate on diamond jewellery in India?",
      a: "The retail sale of finished diamond jewellery attracts 3% GST on the total composite invoice amount under CBIC HSN code 7113.",
    },
    {
      q: "Why does diamond price per carat increase with larger stones?",
      a: "Large, gem-quality diamond crystals are exponentially rarer in nature than small diamonds. Therefore, a single 1.00-carat diamond costs significantly more than two 0.50-carat diamonds of identical quality.",
    },
    {
      q: "What is the best gold purity for diamond jewellery?",
      a: "18K gold (75% pure gold) and 14K gold (58.5% pure gold) are the global and Indian industry standards for diamond jewellery because they are significantly stronger and harder than 22K gold, securely holding diamond prongs.",
    },
    {
      q: "What diamond certifications are trusted in India?",
      a: "The most respected independent gemological certification laboratories are GIA (Gemological Institute of America), IGI (International Gemological Institute), and SGL (Solitaire Gemological Laboratories).",
    },
    {
      q: "How do I check if my diamond jewellery quotation is fair?",
      a: "Ask for an itemized quotation separating the diamond price per carat, the gold weight and purity rate, making charges, and GST. Use this calculator to verify the math.",
    },
    {
      q: "Are lab-grown diamonds real diamonds?",
      a: "Yes. Lab-grown diamonds have the exact same chemical composition (pure crystallized carbon), hardness (10 on Mohs scale), refractive index, and brilliance as natural diamonds, but trade at lower market prices.",
    },
    {
      q: "Are making charges calculated on diamond value or gold value?",
      a: "In most Indian retail showrooms, percentage making charges are calculated on the gold metal value, or charged as a flat design fee per ornament.",
    },
    {
      q: "Can this calculator verify if a diamond is real?",
      a: "No. This tool calculates estimated pricing based on user-entered values. Authentic gem verification requires examination by certified gemologists using thermal probes, microscopic magnification, and laboratory spectrometry.",
    },
  ],
  internalLinks: [
    {
      text: "Calculate Gold Jewellery Bills with Making Charges & 3% GST",
      calculatorName: "Gold Jewellery Bill Calculator",
      href: "/calculator/gold-jewellery-bill-calculator",
    },
    {
      text: "Convert Gold Karat, Purity Percentage & Fineness (BIS IS 1417)",
      calculatorName: "Gold Purity & Karat Converter",
      href: "/calculator/gold-purity-karat-converter",
    },
    {
      text: "Estimate Old Gold Jewellery Resale & Exchange Value",
      calculatorName: "Old Gold Exchange Value Calculator",
      href: "/calculator/old-gold-exchange-value-calculator",
    },
    {
      text: "Calculate Silver Jewellery Prices with Purity & Making Charges",
      calculatorName: "Silver Jewellery Bill Calculator",
      href: "/calculator/silver-jewellery-bill-calculator",
    },
  ],
};

