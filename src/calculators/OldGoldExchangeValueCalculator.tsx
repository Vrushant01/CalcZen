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
  Gem,
  Scale,
  Coins,
  RotateCcw,
  Copy,
  Check,
  Info,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Calculator,
  ChevronDown,
  ChevronUp,
  FileText,
  Sliders,
  Percent,
  Tag,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
} from "lucide-react";
import {
  calculateOldGoldExchangeValue,
  validateOldGoldInputs,
  formatINR,
  roundTo,
  OLD_GOLD_PURITY_OPTIONS,
  WEIGHT_CONVERSIONS_TO_GRAMS,
  type GoldPurity,
  type WeightUnit,
  type RateBasis,
  type RateUnit,
  type OldGoldInputs,
} from "@/utils/oldGoldCalculatorUtils";

const QUICK_DEDUCTION_CHIPS = [
  { label: "0% (Hallmarked Exchange)", value: 0 },
  { label: "1% (Standard)", value: 1 },
  { label: "2% (Melting Loss)", value: 2 },
  { label: "3% (Non-Hallmark)", value: 3 },
  { label: "5% (Cash Resale)", value: 5 },
];

export function OldGoldExchangeValueCalculator() {
  const calc = getCalculator("old-gold-exchange-value-calculator")!;
  const resultsRef = useRef<HTMLDivElement>(null);

  // SECTION 1: WEIGHT INPUTS
  const [weightMode, setWeightMode] = useState<"net" | "gross_stone">("net");
  const [netWeight, setNetWeight] = useState<number>(10);
  const [grossWeight, setGrossWeight] = useState<number>(12);
  const [stoneWeight, setStoneWeight] = useState<number>(2);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("grams");

  // SECTION 2: PURITY
  const [purity, setPurity] = useState<GoldPurity>("22k-916");
  const [customFineness, setCustomFineness] = useState<number>(916);

  // SECTION 3: GOLD RATE
  const [rate, setRate] = useState<number>(9160);
  const [rateBasis, setRateBasis] = useState<RateBasis>("selected_purity");
  const [rateUnit, setRateUnit] = useState<RateUnit>("per_gram");

  // SECTION 4: DEDUCTIONS (COLLAPSIBLE / ADVANCED)
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [deductionPct, setDeductionPct] = useState<number>(0);
  const [fixedCharges, setFixedCharges] = useState<number>(0);

  // FEEDBACK
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // COMPUTE INPUT OBJECT
  const inputs: OldGoldInputs = useMemo(() => {
    return {
      weightMode,
      netWeight: Number(netWeight) || 0,
      grossWeight: Number(grossWeight) || 0,
      stoneWeight: Number(stoneWeight) || 0,
      weightUnit,
      purity,
      customFinenessPerThousand: Number(customFineness) || 916,
      rate: Number(rate) || 0,
      rateBasis,
      rateUnit,
      deductionPct: Number(deductionPct) || 0,
      fixedCharges: Number(fixedCharges) || 0,
    };
  }, [
    weightMode,
    netWeight,
    grossWeight,
    stoneWeight,
    weightUnit,
    purity,
    customFineness,
    rate,
    rateBasis,
    rateUnit,
    deductionPct,
    fixedCharges,
  ]);

  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } =
    useCalculatorState(inputs);
  const activeInputs = calculatedInputs || inputs;

  // VALIDATION & RESULT
  const validation = useMemo(() => validateOldGoldInputs(inputs), [inputs]);
  const result = useMemo(() => calculateOldGoldExchangeValue(activeInputs), [activeInputs]);

  // HANDLE PRESETS
  const handleApplyPreset = (presetKey: string) => {
    switch (presetKey) {
      case "std_22k":
        setWeightMode("net");
        setNetWeight(10);
        setWeightUnit("grams");
        setPurity("22k-916");
        setRate(9160);
        setRateBasis("selected_purity");
        setRateUnit("per_gram");
        setDeductionPct(0);
        setFixedCharges(0);
        break;
      case "ring_stone":
        setWeightMode("gross_stone");
        setGrossWeight(6);
        setStoneWeight(1.2);
        setWeightUnit("grams");
        setPurity("22k-916");
        setRate(9160);
        setRateBasis("selected_purity");
        setRateUnit("per_gram");
        setDeductionPct(1);
        setFixedCharges(0);
        break;
      case "diamond_18k":
        setWeightMode("gross_stone");
        setGrossWeight(15);
        setStoneWeight(3);
        setWeightUnit("grams");
        setPurity("18k-750");
        setRate(7500);
        setRateBasis("selected_purity");
        setRateUnit("per_gram");
        setDeductionPct(2);
        setFixedCharges(0);
        break;
      case "vintage_tola":
        setWeightMode("net");
        setNetWeight(1);
        setWeightUnit("tola");
        setPurity("20k-833");
        setRate(100000);
        setRateBasis("24k");
        setRateUnit("per_10g");
        setDeductionPct(3);
        setFixedCharges(150);
        break;
      default:
        break;
    }
    markCalculated();
  };

  // RESET
  const handleReset = () => {
    setWeightMode("net");
    setNetWeight(10);
    setGrossWeight(12);
    setStoneWeight(2);
    setWeightUnit("grams");
    setPurity("22k-916");
    setCustomFineness(916);
    setRate(9160);
    setRateBasis("selected_purity");
    setRateUnit("per_gram");
    setDeductionPct(0);
    setFixedCharges(0);
    setShowAdvanced(false);
    resetCalculated();
  };

  // COPY SUMMARY
  const handleCopySummary = async () => {
    const summary = `--- Old Gold Valuation Summary (CalcZen) ---
Net Gold Weight: ${result.formattedNetWeight}
Purity: ${result.karatDisplay} (${result.hallmarkCode} Fineness)
Pure 24K Gold Content: ${result.formattedFineGold}
Effective Rate: ${result.formattedEffectiveRate}/g
Base Gold Value: ${result.formattedBaseGoldValue}
Total Deductions: ${result.formattedTotalDeductions}
---------------------------------------------
ESTIMATED EXCHANGE VALUE: ${result.formattedFinalExchangeValue}
Generated at: https://www.calczen.in/calculator/old-gold-exchange-value-calculator`;

    try {
      await navigator.clipboard.writeText(summary);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // PDF DATA EXPORT
  const pdfData = useMemo(() => {
    return {
      calculatorName: "Old Gold Exchange Value Calculator",
      calculatorSlug: "old-gold-exchange-value-calculator",
      siteName: "CalcZen",
      siteUrl: "https://www.calczen.in",
      inputs: [
        { label: "Gold Net Weight", value: result.formattedNetWeight },
        { label: "Purity & Karat", value: `${result.karatDisplay} (${result.hallmarkCode})` },
        { label: "Pure 24K Equivalent", value: result.formattedFineGold },
        { label: "Applied Rate", value: `${result.formattedEffectiveRate} / gram` },
        { label: "Jeweller Deduction %", value: `${inputs.deductionPct}%` },
        { label: "Fixed Charges", value: formatINR(inputs.fixedCharges) },
      ],
      results: [
        { label: "Base Gold Value", value: result.formattedBaseGoldValue },
        { label: "Total Deductions", value: result.formattedTotalDeductions },
        { label: "Estimated Exchange Value", value: result.formattedFinalExchangeValue },
      ],
    };
  }, [result, inputs]);

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Calculate the accurate exchange or resale value of your old gold jewellery in India. Based on official BIS hallmarking standards, pure gold weight, live market rates, and transparent jeweller deductions."
      formula={`Base Gold Value = Net Gold Weight (g) × Effective Rate per Gram\n\nPure Gold (24K Equivalent) = Net Weight × (Fineness ÷ 1,000)\n\nEffective Rate from 24K = 24K Rate × (Fineness ÷ 1,000)\n\nTotal Deductions = (Base Gold Value × Deduction %) + Fixed Charges\n\nFinal Exchange Value = Base Gold Value − Total Deductions`}
      example={`10 grams of 22K (916) Gold at ₹9,160/g:\n• Pure 24K Gold Content = 10g × 0.916 = 9.16g\n• Base Gold Value = 10g × ₹9,160 = ₹91,600\n• Deduction at 0% (Hallmark Exchange) = ₹0\n• Final Estimated Value = ₹91,600`}
      faqs={OLD_GOLD_BLOG_CONTENT.faqs!}
      blog={<CalculatorBlog content={OLD_GOLD_BLOG_CONTENT} />}
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Preset & Reset Bar */}
        <div className="p-4 bg-muted/30 border border-border/60 rounded-2xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">Quick Presets:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleApplyPreset("std_22k")}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-background border border-border hover:border-primary/50 transition-colors"
              >
                10g 22K (Standard)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset("ring_stone")}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-background border border-border hover:border-primary/50 transition-colors"
              >
                Studded Ring (Stone Deducted)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset("diamond_18k")}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-background border border-border hover:border-primary/50 transition-colors"
              >
                18K Diamond Item (750)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset("vintage_tola")}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-background border border-border hover:border-primary/50 transition-colors"
              >
                1 Tola Vintage (20K)
              </button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* 2-Column Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Input Configuration */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-6">
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <Coins className="h-5 w-5 text-amber-500" />
                <h2 className="text-base font-semibold text-foreground">
                  Enter Your Old Gold Jewellery Details
                </h2>
              </div>

              {/* Input 1: Weight Mode & Gold Weight */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-foreground">Gold Weight Calculation</Label>
                  <div className="flex items-center gap-1 bg-muted p-1 rounded-lg text-xs">
                    <button
                      type="button"
                      onClick={() => setWeightMode("net")}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        weightMode === "net"
                          ? "bg-card text-foreground shadow-xs font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Net Gold Weight
                    </button>
                    <button
                      type="button"
                      onClick={() => setWeightMode("gross_stone")}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        weightMode === "gross_stone"
                          ? "bg-card text-foreground shadow-xs font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Gross - Stones
                    </button>
                  </div>
                </div>

                {weightMode === "net" ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="netWeight"
                          type="number"
                          min={0}
                          step="any"
                          value={netWeight === 0 ? "" : netWeight}
                          onChange={(e) => {
                            setNetWeight(e.target.value === "" ? 0 : Number(e.target.value));
                            markCalculated();
                          }}
                          className="h-11 text-base font-medium pr-14"
                          placeholder="10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                          {weightUnit}
                        </span>
                      </div>
                      <select
                        aria-label="Weight Unit"
                        value={weightUnit}
                        onChange={(e) => {
                          setWeightUnit(e.target.value as WeightUnit);
                          markCalculated();
                        }}
                        className="h-11 px-3 bg-muted/60 border border-border rounded-xl text-xs font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="grams">Grams (g)</option>
                        <option value="tola">Tola (11.66g)</option>
                        <option value="pavan">Pavan (8g)</option>
                      </select>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Enter the pure gold weight after excluding stones, enamel (meena), beads, and threads.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-border/80 bg-muted/15 space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="grossWeight" className="text-xs font-medium">
                          Gross Weight ({weightUnit})
                        </Label>
                        <Input
                          id="grossWeight"
                          type="number"
                          min={0}
                          step="any"
                          value={grossWeight === 0 ? "" : grossWeight}
                          onChange={(e) => {
                            setGrossWeight(e.target.value === "" ? 0 : Number(e.target.value));
                            markCalculated();
                          }}
                          className="h-10 text-sm font-medium"
                          placeholder="12.0"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="stoneWeight" className="text-xs font-medium">
                          Stones / Non-Gold ({weightUnit})
                        </Label>
                        <Input
                          id="stoneWeight"
                          type="number"
                          min={0}
                          step="any"
                          value={stoneWeight === 0 ? "" : stoneWeight}
                          onChange={(e) => {
                            setStoneWeight(e.target.value === "" ? 0 : Number(e.target.value));
                            markCalculated();
                          }}
                          className="h-10 text-sm font-medium"
                          placeholder="2.0"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-border/40 text-muted-foreground">
                      <span>Calculated Net Gold:</span>
                      <strong className="text-foreground font-semibold">
                        {roundTo(Math.max(0, grossWeight - stoneWeight), 3)} {weightUnit}
                      </strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Input 2: Gold Purity Dropdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="goldPurity" className="text-sm font-medium text-foreground">
                    Gold Purity & Karat
                  </Label>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    BIS Hallmark Standard
                  </span>
                </div>

                <select
                  id="goldPurity"
                  value={purity}
                  onChange={(e) => {
                    setPurity(e.target.value as GoldPurity);
                    markCalculated();
                  }}
                  className="w-full h-11 px-3.5 bg-background border border-border rounded-xl text-sm font-medium text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                >
                  {Object.values(OLD_GOLD_PURITY_OPTIONS).map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <p className="text-[11px] text-muted-foreground">
                  {OLD_GOLD_PURITY_OPTIONS[purity]?.description}
                </p>

                {purity === "custom" && (
                  <div className="p-3.5 rounded-xl border border-border/80 bg-muted/20 space-y-2">
                    <Label htmlFor="customFineness" className="text-xs font-medium">
                      Custom Fineness (parts per 1,000, e.g. 916 for 22K)
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
                          markCalculated();
                        }}
                        className="h-10 text-sm font-medium pr-16"
                        placeholder="916"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-semibold">
                        / 1000
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input 3: Gold Rate & Basis */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="goldRate" className="text-sm font-medium text-foreground">
                    Prevailing Gold Rate (₹)
                  </Label>
                  <div className="flex items-center gap-1 bg-muted p-1 rounded-lg text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setRateUnit("per_gram");
                        markCalculated();
                      }}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        rateUnit === "per_gram"
                          ? "bg-card text-foreground shadow-xs font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Per Gram (₹/g)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRateUnit("per_10g");
                        markCalculated();
                      }}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        rateUnit === "per_10g"
                          ? "bg-card text-foreground shadow-xs font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Per 10 Grams (₹/10g)
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                    ₹
                  </span>
                  <Input
                    id="goldRate"
                    type="number"
                    min={0}
                    step="any"
                    value={rate === 0 ? "" : rate}
                    onChange={(e) => {
                      setRate(e.target.value === "" ? 0 : Number(e.target.value));
                      markCalculated();
                    }}
                    className="h-11 text-base font-semibold pl-8 pr-16"
                    placeholder="9160"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    {rateUnit === "per_gram" ? "/ gram" : "/ 10g"}
                  </span>
                </div>

                {/* Rate Basis Toggle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setRateBasis("selected_purity");
                      markCalculated();
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      rateBasis === "selected_purity"
                        ? "border-primary bg-primary/10 font-semibold shadow-xs"
                        : "border-border hover:border-primary/30 bg-card"
                    }`}
                  >
                    <div className="text-xs font-bold text-foreground">
                      Rate is for {result.karatDisplay} ({result.hallmarkCode})
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Direct rate for this specific purity.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRateBasis("24k");
                      markCalculated();
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      rateBasis === "24k"
                        ? "border-primary bg-primary/10 font-semibold shadow-xs"
                        : "border-border hover:border-primary/30 bg-card"
                    }`}
                  >
                    <div className="text-xs font-bold text-foreground">
                      Rate is for 24K Pure Gold
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Auto-converts to {result.karatDisplay} using fineness.
                    </div>
                  </button>
                </div>
              </div>

              {/* Advanced Options Collapsible: Jeweller Deductions & Charges */}
              <div className="border border-border/80 rounded-xl overflow-hidden bg-muted/15">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between p-3.5 text-left hover:bg-muted/30 transition-colors text-xs font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-primary" />
                    <span>Jeweller Deductions & Melting Loss (Optional)</span>
                    {deductionPct > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                        {deductionPct}% deduction
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
                  <div className="p-4 border-t border-border/40 space-y-4 bg-card">
                    {/* Deduction Percentage */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="deductionPct" className="text-xs font-medium">
                          Melting / Exchange Deduction (%)
                        </Label>
                        <span className="text-[11px] text-muted-foreground">
                          0% for hallmark exchange, 1-3% melting
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 pb-1">
                        {QUICK_DEDUCTION_CHIPS.map((chip) => (
                          <button
                            key={chip.value}
                            type="button"
                            onClick={() => {
                              setDeductionPct(chip.value);
                              markCalculated();
                            }}
                            className={`px-2 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                              deductionPct === chip.value
                                ? "bg-primary text-primary-foreground border-primary font-bold"
                                : "bg-muted border-border hover:border-primary/40 text-muted-foreground"
                            }`}
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>

                      <div className="relative">
                        <Input
                          id="deductionPct"
                          type="number"
                          min={0}
                          max={100}
                          step="0.1"
                          value={deductionPct === 0 ? "" : deductionPct}
                          onChange={(e) => {
                            setDeductionPct(e.target.value === "" ? 0 : Number(e.target.value));
                            markCalculated();
                          }}
                          className="h-10 text-sm font-medium pr-8"
                          placeholder="0"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-semibold">
                          %
                        </span>
                      </div>
                    </div>

                    {/* Fixed Refining or Testing Charges */}
                    <div className="space-y-1.5 pt-2 border-t border-border/40">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="fixedCharges" className="text-xs font-medium">
                          Refining / XRF Karatometer Testing Fee (₹)
                        </Label>
                        <span className="text-[11px] text-muted-foreground">Optional (usually ₹0 to ₹200)</span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                          ₹
                        </span>
                        <Input
                          id="fixedCharges"
                          type="number"
                          min={0}
                          value={fixedCharges === 0 ? "" : fixedCharges}
                          onChange={(e) => {
                            setFixedCharges(e.target.value === "" ? 0 : Number(e.target.value));
                            markCalculated();
                          }}
                          className="h-10 text-sm font-medium pl-7"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Calculate Button */}
              <Button
                type="button"
                onClick={() => {
                  markCalculated();
                  resultsRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full h-11 text-sm font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Calculator className="h-4 w-4" />
                Calculate Old Gold Value
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

          {/* RIGHT COLUMN: Results Dashboard */}
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
            <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-5 lg:sticky lg:top-24">
              <div className="flex items-center justify-between border-b border-border/60 pb-3.5">
                <div className="flex items-center gap-2">
                  <Gem className="h-5 w-5 text-amber-500" />
                  <h2 className="text-base font-semibold text-foreground">
                    Estimated Exchange Value
                  </h2>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  {result.karatDisplay} ({result.hallmarkCode})
                </div>
              </div>

              {/* Big Hero Card */}
              <div className="p-5 sm:p-6 rounded-2xl border bg-amber-500/10 border-amber-500/20 text-foreground transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Final Estimated Value
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                    Net Payable
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold mt-2.5 tracking-tight text-amber-600 dark:text-amber-400">
                  {result.formattedFinalExchangeValue}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-amber-500/20 text-xs text-muted-foreground">
                  <span>
                    Net: <strong className="text-foreground font-semibold">{result.formattedNetWeight}</strong>
                  </span>
                  <span className="text-amber-500/40">•</span>
                  <span>
                    Pure Gold: <strong className="text-foreground font-semibold">{result.formattedFineGold}</strong>
                  </span>
                  <span className="text-amber-500/40">•</span>
                  <span>
                    Rate: <strong className="text-foreground font-semibold">{result.formattedEffectiveRate}/g</strong>
                  </span>
                </div>
              </div>

              {/* Detailed Financial Breakdown Table */}
              <div className="rounded-2xl border border-border overflow-hidden text-xs shadow-xs">
                <div className="bg-muted/60 px-4 py-3 font-semibold text-foreground flex items-center justify-between border-b border-border">
                  <span>Valuation Parameter</span>
                  <span>Value</span>
                </div>
                <div className="divide-y divide-border/60">
                  {inputs.weightMode === "gross_stone" && (
                    <>
                      <div className="px-4 py-3 flex items-center justify-between text-muted-foreground leading-normal">
                        <span>Gross Weight:</span>
                        <span className="font-semibold text-foreground">
                          {roundTo(result.grossWeightGrams, 3)} g
                        </span>
                      </div>
                      <div className="px-4 py-3 flex items-center justify-between text-muted-foreground leading-normal">
                        <span>Stone / Non-Gold Deduction:</span>
                        <span className="font-semibold text-rose-600 dark:text-rose-400">
                          −{roundTo(result.stoneWeightGrams, 3)} g
                        </span>
                      </div>
                    </>
                  )}

                  <div className="px-4 py-3 flex items-center justify-between text-muted-foreground leading-normal">
                    <span>Net Gold Weight:</span>
                    <span className="font-semibold text-foreground">{result.formattedNetWeight}</span>
                  </div>

                  <div className="px-4 py-3 flex items-center justify-between text-muted-foreground leading-normal">
                    <span>Gold Purity & Fineness:</span>
                    <span className="font-semibold text-foreground">
                      {result.karatDisplay} ({result.finenessPerThousand}/1000)
                    </span>
                  </div>

                  <div className="px-4 py-3 flex items-center justify-between text-muted-foreground leading-normal bg-amber-500/5">
                    <span>Pure 24K Gold Equivalent:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {result.formattedFineGold}
                    </span>
                  </div>

                  <div className="px-4 py-3 flex items-center justify-between text-muted-foreground leading-normal">
                    <span>Effective Rate Applied:</span>
                    <span className="font-semibold text-foreground">
                      {result.formattedEffectiveRate} / gram
                    </span>
                  </div>

                  <div className="px-4 py-3 flex items-center justify-between bg-muted/20 text-foreground font-medium leading-normal">
                    <span>Base Gold Value (100%):</span>
                    <span className="font-bold">{result.formattedBaseGoldValue}</span>
                  </div>

                  {result.percentageDeductionAmount > 0 && (
                    <div className="px-4 py-3 flex items-center justify-between text-muted-foreground leading-normal">
                      <span>Jeweller Deduction ({inputs.deductionPct}%):</span>
                      <span className="font-semibold text-rose-600 dark:text-rose-400">
                        −{formatINR(result.percentageDeductionAmount)}
                      </span>
                    </div>
                  )}

                  {result.fixedChargesAmount > 0 && (
                    <div className="px-4 py-3 flex items-center justify-between text-muted-foreground leading-normal">
                      <span>Fixed Testing / Refining Fee:</span>
                      <span className="font-semibold text-rose-600 dark:text-rose-400">
                        −{formatINR(result.fixedChargesAmount)}
                      </span>
                    </div>
                  )}

                  <div className="px-4 py-3.5 flex items-center justify-between bg-amber-500/10 font-bold text-foreground text-sm leading-normal">
                    <span>Net Estimated Exchange Value:</span>
                    <span className="text-amber-600 dark:text-amber-400 text-base font-extrabold">
                      {result.formattedFinalExchangeValue}
                    </span>
                  </div>
                </div>
              </div>

              {/* Explanation Note */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/80 text-xs space-y-2">
                <div className="font-semibold flex items-center gap-2 text-foreground">
                  <Info className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Calculation Breakdown</span>
                </div>
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  {result.explanation}
                </p>
              </div>

              {/* Smart Insights Cards */}
              {result.insights.map((insight, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                    insight.type === "success"
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-950 dark:text-emerald-200"
                      : insight.type === "warning"
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-950 dark:text-amber-200"
                      : "bg-muted/40 border-border text-foreground"
                  }`}
                >
                  <div className="font-semibold flex items-center gap-1.5">
                    {insight.type === "success" ? (
                      <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <Info className="h-4 w-4 text-amber-500 shrink-0" />
                    )}
                    <span>{insight.title}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    {insight.description}
                  </p>
                </div>
              ))}

              {/* Clean Action Buttons Toolbar */}
              <div className="pt-4 border-t border-border/60 space-y-2.5">
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
                    disabled={result.netWeightGrams <= 0}
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
            message="Ready to calculate old gold exchange value"
            subMessage="Enter your old gold weight, purity, and jeweller rate, then press Calculate Old Gold Value."
           />
        )}
        </div>
      </div>
        </div>
    </CalculatorPageLayout>
  );
}

// SEO BLOG & EDUCATIONAL CONTENT
export const OLD_GOLD_BLOG_CONTENT: any = {
  title: "Old Gold Exchange Value Calculator (India): Complete Valuation Guide",
  description:
    "Learn how Indian jewellers calculate the exchange and resale value of old gold jewellery. Understand BIS hallmark fineness, pure gold extraction, melting loss, and how to avoid unfair deductions.",
  author: "CalcZen Financial Engineering Team",
  publishDate: "November 2026",
  readTime: "7 min read",
  sections: [
    {
      title: "1. How Indian Jewellers Calculate Old Gold Exchange Value",
      paragraphs: [
        "When you exchange or sell old gold jewellery in India, jewellers evaluate your ornaments based on pure gold content rather than the original purchase price or decorative making charges.",
        "The standard industry formula used by reputed jewellers is:",
        "**Base Gold Value = Net Gold Weight (grams) × Applied Gold Rate per Gram**",
        "If you provide the 24K gold rate, the effective rate for your gold's specific karat is calculated as: **24K Rate × (Fineness ÷ 1,000)**. For standard 22K (916 hallmark) gold, 91.6% of the 24K rate is applied.",
      ],
    },
    {
      title: "2. Bureau of Indian Standards (BIS) Hallmarks & Fineness Slabs",
      paragraphs: [
        "Under mandatory BIS hallmarking regulations, genuine gold jewellery features three distinct marks: the BIS logo, the purity mark in karat and fineness, and a unique 6-digit alphanumeric HUID (Hallmark Unique Identification) code.",
        "The standard BIS fineness categories recognized across India are:",
        "• **22K (916 Fineness)**: 91.6% pure gold. The most popular choice for Indian bridal, wedding, and traditional jewellery.",
        "• **18K (750 Fineness)**: 75.0% pure gold. The standard for diamond jewellery, engagement rings, and studded ornaments requiring greater structural rigidity.",
        "• **14K (585 Fineness)**: 58.5% pure gold. Used in modern lightweight, minimalist, and affordable daily wear.",
        "• **24K (999 or 995 Fineness)**: 99.9% or 99.5% pure gold. Found strictly in minted gold coins, minted bars, and investment bullion.",
      ],
    },
    {
      title: "3. Net Weight vs. Gross Weight: The Stone Weight Trap",
      paragraphs: [
        "One of the most common mistakes consumers make is letting jewellers weigh studded jewellery together without deducting non-gold elements. Cubic zirconia (CZ), synthetic stones, enamel (meena work), lac filling, pearls, and thread tassels carry zero gold value.",
        "Always ensure your jewellery's stones are either carefully unmounted or deducted using original purchase certificates or hydrostatic specific gravity testing before calculating your exchange payout.",
      ],
      callout: {
        type: "tip",
        title: "Insist on Non-Destructive XRF Karatometer Testing",
        text: "Never let jewellers scratch or melt your jewellery in a back room. Reputed showrooms provide state-of-the-art X-Ray Fluorescence (XRF) testing in front of you within two minutes, preserving ornament integrity and accurately measuring elemental purity.",
      },
    },
    {
      title: "4. Exchange Value vs. Cash Buyback: The Resale Spread",
      paragraphs: [
        "Major national retail chains (including Tanishq, Malabar Gold, Kalyan Jewellers, and Joyalukkas) offer 100% exchange value for BIS-hallmarked gold when you use the proceeds to purchase new jewellery from their store.",
        "However, if you want direct cash into your bank account, jewellers typically deduct between 2% and 4% as a melting, refining, and assaying margin. In addition, transactions exceeding ₹2,00,000 in cash require PAN verification and statutory tax compliance under Indian income tax laws.",
      ],
    },
  ],
  faqs: [
    {
      q: "How is old gold exchange value calculated in India?",
      a: "Old gold exchange value is calculated by multiplying the net pure gold weight (in grams) by the current gold rate for that specific purity (e.g. 22K or 18K), minus any agreed jeweller melting or exchange deductions.",
    },
    {
      q: "Do jewellers give 100% value for hallmarked gold in exchange?",
      a: "Yes. Most reputed Indian jewellery brands offer 100% gold value on BIS-hallmarked 916 jewellery when exchanged for new gold or diamond jewellery. However, they do not reimburse past making charges, wastage, or GST paid on the old piece.",
    },
    {
      q: "What is the difference between 22K (916) and 24K (999) gold?",
      a: "24K gold is 99.9% pure gold, which is very soft and suitable only for coins and bars. 22K gold contains 91.6% pure gold alloyed with 8.4% metals like copper and silver to give it strength for intricate jewellery.",
    },
    {
      q: "Why do jewellers deduct melting charges on old gold?",
      a: "Non-hallmarked or vintage gold often contains soldering alloys (kadam) or minor impurities that reduce purity during refining. For BIS-hallmarked gold with a valid HUID, melting deductions should be 0% when exchanging at top jewellers.",
    },
    {
      q: "How do I know the net gold weight of studded jewellery?",
      a: "Check your original purchase invoice, which specifies the gross weight and stone weight separately. Reputed jewellers use digital specific gravity balances and XRF spectrometers to determine net gold weight without damaging gemstones.",
    },
    {
      q: "Can I sell old gold for cash instead of exchanging it?",
      a: "Yes, you can sell old gold for cash or immediate bank transfer. However, jewellers usually charge a 2% to 4% discount margin for cash buybacks compared to in-store exchanges, and payments exceeding ₹2 Lakh must be processed via RTGS/NEFT with PAN submission.",
    },
    {
      q: "What is a BIS HUID and why is it important?",
      a: "HUID (Hallmark Unique Identification) is a 6-digit alphanumeric code laser-engraved on hallmarked gold jewellery in India. It links the ornament to the BIS database, certifying exact purity and protecting you from unfair valuation cuts.",
    },
    {
      q: "Is GST charged when exchanging old gold?",
      a: "Under Indian GST regulations, when you exchange old gold for new jewellery, GST at 3% is charged only on the net bill amount (the new jewellery value minus your old gold exchange credit) or on the gross transaction depending on billing structure.",
    },
    {
      q: "What documents do I need to sell or exchange old gold?",
      a: "To exchange or sell old gold in India, carry a government-issued photo ID (Aadhaar Card or PAN Card) and your original purchase invoice if available. Invoices are helpful but not mandatory for hallmarked items.",
    },
    {
      q: "What is 1 tola in grams for gold in India?",
      a: "In traditional Indian gold trade, 1 tola is standardized as 11.6638 grams (often rounded to 11.66g). In South India, gold is also commonly measured in pavan (sovereign), where 1 pavan equals exactly 8 grams.",
    },
  ],
  internalLinks: [
    {
      text: "Calculate Complete Gold Jewellery Bill with GST & Making Charges",
      calculatorName: "Gold Jewellery Bill Calculator",
      href: "/calculator/gold-jewellery-bill-calculator",
    },
    {
      text: "Compare and Negotiate Jeweller Making Charges & Wastage",
      calculatorName: "Gold Making Charges Calculator",
      href: "/calculator/gold-making-charges-calculator",
    },
    {
      text: "Calculate GST and Tax Split for Business & Purchases",
      calculatorName: "GST Invoice Calculator",
      href: "/calculator/gst-invoice-calculator",
    },
  ],
};

export default OldGoldExchangeValueCalculator;

