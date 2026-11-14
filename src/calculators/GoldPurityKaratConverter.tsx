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
  Scale,
  Info,
  Layers,
  ArrowRight,
} from "lucide-react";
import {
  convertGoldPurity,
  validateGoldPurityInput,
  BIS_IS1417_GRADES,
  type GoldInputMode,
  type GoldConversionResult,
} from "@/utils/goldPurityConverterUtils";

export function GoldPurityKaratConverter() {
  const calc = getCalculator("gold-purity-karat-converter")!;
  const resultsRef = useRef<HTMLDivElement>(null);

  // Core user state
  const [inputMode, setInputMode] = useState<GoldInputMode>("karat");
  const [inputValue, setInputValue] = useState<number>(22);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const inputs = useMemo(() => ({ inputMode, inputValue: Number(inputValue) || 0 }), [inputMode, inputValue]);
  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } = useCalculatorState(inputs);
  const activeInputs = calculatedInputs || inputs;

  // Validation
  const validation = useMemo(
    () => validateGoldPurityInput(inputMode, inputValue),
    [inputMode, inputValue]
  );

  // Conversion calculations
  const result: GoldConversionResult = useMemo(() => {
    if (!validation.isValid || activeInputs.inputValue <= 0) {
      return convertGoldPurity(activeInputs.inputMode, 22);
    }
    return convertGoldPurity(activeInputs.inputMode, Number(activeInputs.inputValue));
  }, [activeInputs, validation.isValid]);

  // Mode-specific presets
  const presets = useMemo(() => {
    if (inputMode === "karat") {
      return [
        { label: "24K (Pure)", val: 24 },
        { label: "22K (Standard)", val: 22 },
        { label: "18K (Diamond)", val: 18 },
        { label: "14K (Durable)", val: 14 },
        { label: "9K (Budget)", val: 9 },
      ];
    }
    if (inputMode === "percentage") {
      return [
        { label: "99.9%", val: 99.9 },
        { label: "91.6% (22K)", val: 91.6 },
        { label: "75.0% (18K)", val: 75 },
        { label: "58.5% (14K)", val: 58.5 },
        { label: "37.5% (9K)", val: 37.5 },
      ];
    }
    return [
      { label: "999 (Pure)", val: 999 },
      { label: "916 (22K)", val: 916 },
      { label: "750 (18K)", val: 750 },
      { label: "585 (14K)", val: 585 },
      { label: "375 (9K)", val: 375 },
    ];
  }, [inputMode]);

  // Handle mode change
  const handleModeChange = (newMode: GoldInputMode) => {
    setInputMode(newMode);
    if (newMode === "karat") setInputValue(22);
    else if (newMode === "percentage") setInputValue(91.6);
    else setInputValue(916);
  };

  // Handle loading a reference row from the table
  const handleLoadReference = (karatNum: number, finenessNum: number, pctNum: number) => {
    if (inputMode === "karat") {
      setInputValue(karatNum);
    } else if (inputMode === "percentage") {
      setInputValue(pctNum);
    } else {
      setInputValue(finenessNum);
    }
    markCalculated();
    resultsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Reset to defaults
  const handleReset = () => {
    setInputMode("karat");
    setInputValue(22);
    markCalculated();
  };

  // Copy Summary to clipboard
  const handleCopySummary = async () => {
    const summary = [
      `=== CalcZen: Gold Purity & Karat Conversion ===`,
      `Input Mode: ${inputMode.toUpperCase()}`,
      `Entered Value: ${result.inputDisplay}`,
      `------------------------------------------`,
      `Gold Karat: ${result.karatDisplay}`,
      `Purity Percentage: ${result.percentageDisplay}`,
      `Fineness (Parts per 1000): ${result.finenessDisplay}`,
      `Alloy Content: ${result.alloyPercentageDisplay}`,
      `Common Hallmark Grade: ${result.hallmarkGradeReference}`,
      `------------------------------------------`,
      `${result.consumerExplanation}`,
      `\nCalculate online: https://www.calczen.in/calculator/gold-purity-karat-converter`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summary);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      /* ignore clipboard copy failure */
    }
  };

  // PDF Data
  const pdfData = useMemo(() => {
    return {
      title: "Gold Purity & Karat Conversion Certificate",
      subtitle: `Conversion for ${result.inputDisplay} Gold`,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      inputs: [
        { label: "Conversion Mode", value: inputMode.toUpperCase() },
        { label: "Entered Value", value: result.inputDisplay },
      ],
      results: [
        { label: "Gold Karat", value: result.karatDisplay },
        { label: "Purity Percentage", value: result.percentageDisplay },
        { label: "Fineness (Parts per 1,000)", value: result.finenessDisplay },
        { label: "Alloy Content", value: result.alloyPercentageDisplay },
        { label: "Indian Hallmark Reference", value: result.hallmarkGradeReference },
      ],
    };
  }, [result, inputMode]);

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Easily convert gold karat into purity percentage and fineness. Understand 22K, 18K, 14K and 24K gold with transparent mathematical formulas and BIS hallmark references."
      formula={`Purity Percentage (%) = (Karat / 24) × 100\n\nFineness (Parts per 1,000) = (Karat / 24) × 1,000\n\nKarat (K) = (Purity Percentage / 100) × 24\n\nKarat (K) = (Fineness / 1,000) × 24`}
      example={`Convert 22K Gold to Percentage and Fineness:\n• Purity Percentage = (22 / 24) × 100 = 91.67%\n• Fineness = (22 / 24) × 1,000 = 916.67\n• Common Indian Hallmark Reference: 22K916 (minimum 91.6% pure gold)`}
      faqs={GOLD_PURITY_BLOG_CONTENT.faqs!}
      blog={<CalculatorBlog content={GOLD_PURITY_BLOG_CONTENT} />}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================= */}
          {/* LEFT: 3 SIMPLE INPUT SECTIONS                             */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-7 bg-card border border-border rounded-2xl shadow-xs space-y-6">
              {/* SECTION 1: CONVERSION TYPE SELECTOR */}
              <div className="space-y-2">
                <Label className="text-base font-semibold text-foreground">
                  What do you know about your gold?
                </Label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-muted rounded-xl text-xs sm:text-sm">
                  <button
                    type="button"
                    onClick={() => handleModeChange("karat")}
                    className={`py-2 px-1 rounded-lg font-semibold transition-all text-center ${
                      inputMode === "karat"
                        ? "bg-card text-foreground shadow-xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Karat (K)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange("percentage")}
                    className={`py-2 px-1 rounded-lg font-semibold transition-all text-center ${
                      inputMode === "percentage"
                        ? "bg-card text-foreground shadow-xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Purity (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange("fineness")}
                    className={`py-2 px-1 rounded-lg font-semibold transition-all text-center ${
                      inputMode === "fineness"
                        ? "bg-card text-foreground shadow-xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Fineness (916)
                  </button>
                </div>
              </div>

              {/* SECTION 2: VALUE INPUT */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="goldValueInput" className="text-sm font-semibold text-foreground">
                    {inputMode === "karat" && "Enter gold karat"}
                    {inputMode === "percentage" && "Enter gold purity percentage"}
                    {inputMode === "fineness" && "Enter fineness number"}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {inputMode === "karat" && "Scale: 1 to 24K"}
                    {inputMode === "percentage" && "Scale: 1 to 100%"}
                    {inputMode === "fineness" && "Scale: 1 to 1,000"}
                  </span>
                </div>

                <div className="relative">
                  <Input
                    id="goldValueInput"
                    type="number"
                    min={0}
                    max={inputMode === "karat" ? 24 : inputMode === "percentage" ? 100 : 1000}
                    step="any"
                    value={inputValue === 0 ? "" : inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value === "" ? 0 : Number(e.target.value));
                      markCalculated();
                    }}
                    className="h-12 text-lg font-semibold pr-16 rounded-xl"
                    placeholder={inputMode === "karat" ? "22" : inputMode === "percentage" ? "91.6" : "916"}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                    {inputMode === "karat" && "K"}
                    {inputMode === "percentage" && "%"}
                    {inputMode === "fineness" && "parts"}
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-muted-foreground font-medium mr-1">Quick pick:</span>
                  {presets.map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => {
                        setInputValue(preset.val);
                        markCalculated();
                      }}
                      className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                        Number(inputValue) === preset.val
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
                          : "border-border hover:border-primary/40 bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 3: CONVERT BUTTON */}
              <Button
                type="button"
                onClick={() => {
                  markCalculated();
                  resultsRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full h-12 text-base font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-950 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Calculator className="h-4 w-4" />
                Convert Gold Purity
              </Button>
            </div>

            {/* Validation Alert */}
            {!validation.isValid && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{validation.error}</span>
              </div>
            )}

            {/* Quick Conversion Reference Table */}
            <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-amber-500" />
                    Common Gold Purity Values (BIS IS 1417)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Tap any row below to quickly load into the converter.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground font-semibold">
                      <th className="py-2.5 px-3">Gold Type</th>
                      <th className="py-2.5 px-3 text-right">Purity (%)</th>
                      <th className="py-2.5 px-3 text-right">Fineness</th>
                      <th className="py-2.5 px-3 text-center">Hallmark Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {BIS_IS1417_GRADES.map((grade) => (
                      <tr
                        key={grade.gradeCode}
                        onClick={() => {
                          const karatNum = parseFloat(grade.karat.replace(/[^\d.]/g, ""));
                          handleLoadReference(karatNum, grade.fineness, grade.percentage);
                        }}
                        className="hover:bg-muted/40 cursor-pointer transition-colors group"
                      >
                        <td className="py-2.5 px-3 font-semibold text-foreground flex items-center gap-1.5">
                          <span>{grade.karat}</span>
                          <span className="text-[10px] px-1.5 py-0.2 bg-muted rounded text-muted-foreground font-normal">
                            {grade.karat.startsWith("24K") ? "Bullion" : "Jewellery"}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-medium text-slate-700 dark:text-slate-300">
                          {grade.percentage}%
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-blue-600 dark:text-blue-400">
                          {grade.fineness}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                            {grade.gradeCode}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed pt-1 border-t border-border/40">
                24K is commonly used to describe pure gold, but Indian hallmark standards distinguish <strong>24KS (995 fineness)</strong> and <strong>24KF (999 fineness)</strong> grades.
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: CLEAN HIGH-CONTRAST RESULTS DASHBOARD              */}
          {/* ========================================================= */}
          <div ref={resultsRef} className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-5 lg:sticky lg:top-24">
              {/* Result Header Hero Box (Crisp solid black price on neutral background) */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
                    Your Gold Purity
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700">
                    {result.karatDisplay} Gold
                  </span>
                </div>
                {/* Hero Primary Value: Crisp Black */}
                <div className="text-3xl sm:text-4xl font-black tracking-tight text-black dark:text-white">
                  {result.percentageDisplay}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <span>Fineness:</span>
                  <strong className="text-blue-600 dark:text-blue-400 font-bold">{result.finenessDisplay}</strong>
                  <span>•</span>
                  <span>Hallmark:</span>
                  <strong className="text-amber-600 dark:text-amber-400 font-bold">{result.hallmarkGradeReference}</strong>
                </div>
              </div>

              {/* Conversion Breakdown Table */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-sm shadow-2xs divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-950">
                {/* 1. Entered Value */}
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">Entered value:</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                    {result.inputDisplay}
                  </span>
                </div>

                {/* 2. Gold Karat: Black */}
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">Gold Karat (K):</span>
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 text-sm sm:text-base">
                    {result.karatDisplay}
                  </span>
                </div>

                {/* 3. Purity Percentage: Bold */}
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">Pure Gold Content:</span>
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm sm:text-base">
                    {result.percentageDisplay}
                  </span>
                </div>

                {/* 4. Fineness: Blue */}
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">Fineness (Parts / 1000):</span>
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-sm sm:text-base">
                    {result.finenessDisplay}
                  </span>
                </div>

                {/* 5. Alloy Content */}
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">Alloy Metals Content:</span>
                  </span>
                  <span className="font-bold text-purple-600 dark:text-purple-400 text-sm sm:text-base">
                    {result.alloyPercentageDisplay}
                  </span>
                </div>

                {/* 6. Indian Hallmark Reference: Elevated Neutral Row */}
                <div className="px-4 py-3.5 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 border-t-2 border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-black dark:text-white text-sm sm:text-base flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span>Indian Hallmark Grade:</span>
                  </span>
                  <span className="text-base sm:text-lg font-black text-black dark:text-white">
                    {result.hallmarkGradeReference}
                  </span>
                </div>
              </div>

              {/* Plain-Language Explanation */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 text-xs space-y-2">
                <div className="font-semibold flex items-center gap-2 text-foreground">
                  <Info className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Consumer Purity Summary</span>
                </div>
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  {result.consumerExplanation}
                </p>
                {result.hallmarkNote && (
                  <p className="text-[11px] text-muted-foreground/80 pt-1.5 border-t border-border/40 leading-relaxed italic">
                    Note: {result.hallmarkNote}
                  </p>
                )}
              </div>

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
          </div>
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

// RICH EDUCATIONAL BLOG CONTENT & FAQS
export const GOLD_PURITY_BLOG_CONTENT: any = {
  title: "Gold Purity & Karat Converter: Complete Guide to Karat, Fineness & BIS Hallmarks",
  description:
    "Learn how gold karat converts into purity percentage and parts-per-thousand fineness under Indian BIS IS 1417 standards. Convert 22K, 18K, 14K and 24K gold easily.",
  author: "CalcZen Jewellery Domain Specialists",
  publishDate: "November 2026",
  readTime: "6 min read",
  sections: [
    {
      title: "1. The Mathematics of Gold Karat and Pure Gold",
      paragraphs: [
        "In precious metals terminology, **24 Karat (24K)** is universally defined as pure elemental gold containing 100% gold with zero added alloys.",
        "Because pure gold is extremely soft and malleable, crafting durable rings, chains, bangles, and stone-studded jewellery requires blending pure gold with stronger alloy metals such as copper, silver, zinc, and nickel.",
        "The karat rating indicates how many parts out of 24 consist of pure gold:",
        "**Purity Percentage (%) = (Karat / 24) × 100**",
        "For example, 22K gold means 22 parts out of 24 are pure gold: (22 / 24) × 100 = 91.67% pure gold.",
      ],
    },
    {
      title: "2. Understanding Gold Fineness (Parts per 1,000)",
      paragraphs: [
        "While consumers in India frequently refer to gold by its Karat rating, international mints, refiners, and hallmarking laboratories measure purity using **fineness**, which counts the number of pure gold parts per 1,000 total parts.",
        "The mathematical conversion is straightforward: **Fineness = (Karat / 24) × 1,000** or **Purity Percentage × 10**.",
        "For instance, 75% pure gold corresponds to exactly 750 fineness (18K gold).",
      ],
    },
    {
      title: "3. Bureau of Indian Standards (BIS) IS 1417 Hallmark Grades",
      paragraphs: [
        "Under Bureau of Indian Standards standard IS 1417, hallmarking in India standardizes gold articles into specific recognized grade designations.",
        "It is important to understand that hallmark grades designate minimum legally required fineness thresholds rather than exact theoretical divisions:",
        "• **22K916**: Requires a minimum fineness of 916.0 (91.6% pure gold). Note that exact mathematical division of 22/24 is 916.67.",
        "• **18K750**: Exactly matches both mathematical division (18/24) and the BIS hallmark threshold of 750 fineness (75% pure gold).",
        "• **14K585**: Requires a minimum fineness of 585.0 (58.5% pure gold). Exact mathematical division of 14/24 is 583.33, so hallmarked jewellery contains slightly higher gold to guarantee meeting the 585 mark.",
        "• **20K833 & 23K958**: Traditional high-purity regional standards recognized by BIS.",
        "• **24KS (995) & 24KF (999)**: Commercial pure gold coins and investment bullion bars.",
      ],
      callout: {
        type: "tip",
        title: "Karat (K) vs Carat (ct): Don't Confuse Purity with Weight",
        text: "Karat (with a 'K') measures gold purity on a 24-part scale. Carat (with a 'C', abbreviated ct) is a unit of mass used for diamonds and gemstones, where 1 carat equals exactly 200 milligrams (0.2 grams).",
      },
    },
    {
      title: "4. How to Verify Genuine BIS Hallmarking on Jewellery",
      paragraphs: [
        "Under Government of India hallmarking regulations, mandatory hallmarked gold jewellery in India carries three clear laser-engraved hallmarks:",
        "1. **The BIS Logo**: The iconic triangular hallmark symbol of the Bureau of Indian Standards.",
        "2. **Purity / Fineness Mark**: For example, 22K916, 18K750, or 14K585.",
        "3. **6-Digit Alphanumeric HUID**: A unique Hallmark Unique Identification code assigned to each individual jewellery piece.",
        "Consumers can verify any 6-digit HUID code using the free official **BIS CARE** mobile app published by the Government of India to check the jeweller's registration, hallmarking center details, and registered article type.",
      ],
      callout: {
        type: "warning",
        title: "Mathematical Calculator vs Physical Verification",
        text: "This calculator provides mathematical conversions and standard reference grades. It cannot verify whether an actual piece of jewellery is authentic gold or genuine hallmarked stock. For physical testing, consult an authorized BIS Assaying & Hallmarking Centre (AHC) or reputed jeweller.",
      },
    },
  ],
  faqs: [
    {
      q: "What does 22K gold mean?",
      a: "22K gold contains 22 parts of pure gold and 2 parts of alloy metals out of 24 parts. This equals approximately 91.67% pure gold, providing the ideal balance of rich golden color and physical durability for Indian jewellery.",
    },
    {
      q: "What does 916 mean on gold jewellery?",
      a: "916 denotes the fineness of 22K gold under Indian BIS hallmarking standards. It means that the ornament contains at least 916 parts of pure gold per 1,000 parts (91.6% pure gold).",
    },
    {
      q: "What is the difference between karat and carat?",
      a: "Karat (K) measures the purity of gold on a scale of 24. Carat (ct) is a unit of weight used for diamonds and gemstones, where 1 carat equals 200 milligrams (0.2 grams).",
    },
    {
      q: "Is 24K gold 100% pure?",
      a: "Mathematically, 24K represents 100% pure gold. However, in practical refining, 100.00% absolute purity is impossible to achieve. Commercial 24K gold is categorized as 24KS (99.5% minimum purity) or 24KF (99.9% fine bullion).",
    },
    {
      q: "What is 18K gold?",
      a: "18K gold contains 18 parts pure gold and 6 parts alloy metals (75.0% purity, marked 18K750). It is harder than 22K gold and is the preferred standard for diamond, gemstone, and everyday lifestyle jewellery.",
    },
    {
      q: "Why is 14K marked 585 instead of 583?",
      a: "Mathematically, 14/24 equals 58.33% (583.33 fineness). To ensure ornaments comfortably exceed legal minimum standards, the Bureau of Indian Standards and international hallmark conventions mandate a minimum fineness of 585 (58.5%).",
    },
    {
      q: "How do I check gold purity at home?",
      a: "Look for the three mandatory hallmarks: the BIS triangle logo, the purity mark (such as 22K916), and the 6-digit alphanumeric HUID. You can verify the HUID code directly on the Government of India's BIS CARE app.",
    },
    {
      q: "Does this calculator verify whether my gold is genuine?",
      a: "No. This tool performs mathematical conversions between karat, percentage, and fineness. Only certified chemical assaying (fire assay or XRF spectrometry) at an authorized BIS hallmarking center can determine physical authenticity.",
    },
    {
      q: "Can I convert decimal karats like 21.5K?",
      a: "Yes. Simply enter 21.5 in the Karat input. The calculator uses exact formulas: 21.5 / 24 × 100 = 89.58% purity and 895.83 fineness.",
    },
    {
      q: "What metals are mixed with pure gold in jewellery?",
      a: "Jewellers commonly blend copper, silver, zinc, and nickel. Yellow gold typically uses equal parts silver and copper, rose gold uses higher copper content, and white gold is alloyed with nickel, palladium, or silver and plated with rhodium.",
    },
  ],
  internalLinks: [
    {
      text: "Estimate Old Gold Jewellery Resale & Exchange Value",
      calculatorName: "Old Gold Exchange Value Calculator",
      href: "/calculator/old-gold-exchange-value-calculator",
    },
    {
      text: "Calculate Complete Gold Jewellery Bills with Making Charges & GST",
      calculatorName: "Gold Jewellery Bill Calculator",
      href: "/calculator/gold-jewellery-bill-calculator",
    },
    {
      text: "Calculate Silver Jewellery Prices with Purity & Making Charges",
      calculatorName: "Silver Jewellery Bill Calculator",
      href: "/calculator/silver-jewellery-bill-calculator",
    },
  ],
};

