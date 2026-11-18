import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalculateButton } from "@/components/CalculateButton";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { OutdatedResultBanner } from "@/components/OutdatedResultBanner";
import { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";
import {
  calculateGoldValue,
  type GoldValueResult,
  type GoldValuationKarat,
  type GoldWeightUnit,
  type MakingChargeType,
} from "@/lib/calc/gold-value-calculator";
import { goldValueCalculatorContent } from "@/data/content/gold-value-calculator";
import { useLiveRates } from "@/hooks/use-live-rates";
import { LiveRatePanel } from "@/components/LiveRatePanel";
import {
  Coins,
  Gem,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Scale,
  Receipt,
  Info,
} from "lucide-react";

function formatINR(val: number): string {
  if (isNaN(val) || !isFinite(val)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

export function GoldValueCalculator() {
  const calc = getCalculator("gold-value-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();
  const { data: liveRates } = useLiveRates();

  // Primary State Declarations
  const [weight, setWeight] = useState<number | "">(10);
  const [unit, setUnit] = useState<GoldWeightUnit>("grams");
  const [karat, setKarat] = useState<GoldValuationKarat>("22K");
  const [rate24k, setRate24k] = useState<number | "">(liveRates?.gold24kPerGram || 7500);
  const [makingType, setMakingType] = useState<MakingChargeType>("percent");
  const [makingValue, setMakingValue] = useState<number | "">(10);
  const [gstPct, setGstPct] = useState<number | "">(3.0);

  // Snapshot State for Calculated Results
  const [calcWeight, setCalcWeight] = useState<number>(10);
  const [calcUnit, setCalcUnit] = useState<GoldWeightUnit>("grams");
  const [calcKarat, setCalcKarat] = useState<GoldValuationKarat>("22K");
  const [calcRate24k, setCalcRate24k] = useState<number>(liveRates?.gold24kPerGram || 7500);
  const [calcMakingType, setCalcMakingType] = useState<MakingChargeType>("percent");
  const [calcMakingValue, setCalcMakingValue] = useState<number>(10);
  const [calcGstPct, setCalcGstPct] = useState<number>(3.0);

  // Derived Calculation Result
  const result: GoldValueResult = useMemo(() => {
    return calculateGoldValue({
      weight: Number(calcWeight) || 0,
      unit: calcUnit,
      karat: calcKarat,
      rate24kPerGram: Number(calcRate24k) || 0,
      makingChargeType: calcMakingType,
      makingChargeValue: Number(calcMakingValue) || 0,
      gstPct: Number(calcGstPct) || 3.0,
    });
  }, [calcWeight, calcUnit, calcKarat, calcRate24k, calcMakingType, calcMakingValue, calcGstPct]);

  const isOutdated =
    hasResult &&
    (Number(weight) !== calcWeight ||
      unit !== calcUnit ||
      karat !== calcKarat ||
      Number(rate24k) !== calcRate24k ||
      makingType !== calcMakingType ||
      Number(makingValue) !== calcMakingValue ||
      Number(gstPct) !== calcGstPct);

  const isButtonDisabled = !weight || Number(weight) <= 0 || !rate24k || Number(rate24k) <= 0;

  const handleCalculate = () => {
    setCalcWeight(Number(weight) || 0);
    setCalcUnit(unit);
    setCalcKarat(karat);
    setCalcRate24k(Number(rate24k) || 0);
    setCalcMakingType(makingType);
    setCalcMakingValue(Number(makingValue) || 0);
    setCalcGstPct(Number(gstPct) || 3.0);
    markCalculated();
  };

  const handleReset = () => {
    setWeight(10);
    setUnit("grams");
    setKarat("22K");
    setRate24k(liveRates?.gold24kPerGram || 7500);
    setMakingType("percent");
    setMakingValue(10);
    setGstPct(3.0);
    resetCalculated();
  };

  return (
    <CalculatorPageLayout
      calc={calc}
      intro={goldValueCalculatorContent.intro}
      formula={goldValueCalculatorContent.formula}
      example={
        goldValueCalculatorContent.workedExample
          ? `${goldValueCalculatorContent.workedExample.description}\n\n` +
            goldValueCalculatorContent.workedExample.table
              .map((r) => `${r.label}: ${r.value}`)
              .join("\n")
          : undefined
      }
      faqs={goldValueCalculatorContent.faqs}
      blog={
        <div className="space-y-8">
          <section className="surface-card rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-foreground">How to Use This Gold Value Calculator</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm sm:text-base">
              {goldValueCalculatorContent.howToUseSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="surface-card rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-foreground">{goldValueCalculatorContent.quickReferenceTable.title}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border/60 text-foreground font-semibold">
                    {goldValueCalculatorContent.quickReferenceTable.headers.map((h, i) => (
                      <th key={i} className="py-2.5 px-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-muted-foreground">
                  {goldValueCalculatorContent.quickReferenceTable.rows.map((row, ri) => (
                    <tr key={ri} className="hover:bg-muted/40 transition-colors">
                      {row.map((cell, ci) => (
                        <td key={ci} className={`py-2.5 px-3 ${ci === 0 ? "font-medium text-foreground" : ""}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Things to Know &amp; Common Bullion Mistakes</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm sm:text-base">
              {goldValueCalculatorContent.mistakes.map((m, idx) => (
                <li key={idx}>{m}</li>
              ))}
            </ul>
          </section>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Live Gold Rate Panel */}
        <LiveRatePanel
          metal="gold"
          rateInUse={rate24k}
          rateBasis="per_gram"
          purityLabel="24K Benchmark"
          isUserEdited={Number(rate24k) !== (liveRates?.gold24kPerGram || 7500)}
          onUseLiveRate={() => setRate24k(liveRates?.gold24kPerGram || 7500)}
        />

        {/* Input Form Card */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-border/50 pb-3">
            <Coins className="h-5 w-5 text-amber-500" />
            <h2 className="text-base font-semibold text-foreground">Gold Weight &amp; Karat Options</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="weight" className="text-sm font-medium">
                Quantity / Weight
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                min={0.1}
                max={10000}
                value={weight}
                onChange={(e) => setWeight(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 10"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Weight Unit</Label>
              <div className="grid grid-cols-4 gap-1 mt-1.5">
                {[
                  { id: "grams", label: "Grams" },
                  { id: "tenGrams", label: "10g" },
                  { id: "tola", label: "Tola" },
                  { id: "oz", label: "Oz" },
                ].map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setUnit(u.id as GoldWeightUnit)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${
                      unit === u.id
                        ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                        : "bg-card border-border hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">1 tola = 11.66g, 1 oz = 31.10g</p>
            </div>

            <div>
              <Label className="text-sm font-medium">Gold Karat Purity</Label>
              <div className="grid grid-cols-4 gap-1 mt-1.5">
                {(["24K", "22K", "18K", "14K"] as GoldValuationKarat[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKarat(k)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${
                      karat === k
                        ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                        : "bg-card border-border hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">22K is 91.6% pure jewellery</p>
            </div>

            <div>
              <Label htmlFor="rate24k" className="text-sm font-medium">
                24K Pure Rate / Gram (₹)
              </Label>
              <Input
                id="rate24k"
                type="number"
                min={1000}
                max={200000}
                value={rate24k}
                onChange={(e) => setRate24k(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 7500"
              />
              <p className="text-xs text-muted-foreground mt-1">Benchmark 999 purity bullion rate</p>
            </div>

            <div>
              <Label htmlFor="makingValue" className="text-sm font-medium">
                Making Charges ({makingType === "percent" ? "%" : "₹/g"})
              </Label>
              <div className="flex gap-2 mt-1.5">
                <Input
                  id="makingValue"
                  type="number"
                  min={0}
                  step={makingType === "percent" ? "0.5" : "10"}
                  value={makingValue}
                  onChange={(e) => setMakingValue(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 10"
                />
                <button
                  type="button"
                  onClick={() => setMakingType(makingType === "percent" ? "perGram" : "percent")}
                  className="px-3 py-2 rounded-lg border border-border text-xs font-medium hover:bg-muted/50 whitespace-nowrap"
                >
                  {makingType === "percent" ? "%" : "₹/g"}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Craftsmanship &amp; wastage fee</p>
            </div>

            <div>
              <Label htmlFor="gstPct" className="text-sm font-medium">
                GST Rate (%)
              </Label>
              <Input
                id="gstPct"
                type="number"
                step="0.5"
                min={0}
                max={28}
                value={gstPct}
                onChange={(e) => setGstPct(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 3.0"
              />
              <p className="text-xs text-muted-foreground mt-1">Standard jewellery GST is 3% in India</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <CalculateButton
              disabled={isButtonDisabled}
              onClick={handleCalculate}
            />
            <Button variant="outline" onClick={handleReset} className="gap-1.5 text-xs sm:text-sm">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Outdated Result Notification */}
        {isOutdated && <OutdatedResultBanner onCalculate={handleCalculate} />}

        {/* Results Section */}
        {!hasResult ? (
          <EmptyResultPlaceholder
            message="Convert Gold Weight to Live Rupees"
            subMessage="Enter your gold weight, karat purity, and current rate above, then click Calculate to view total bullion worth, making charges, and GST details."
          />
        ) : (
          <div className="space-y-6">
            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Total Final Amount
                </span>
                <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground">{formatINR(result.finalTotalAmount)}</p>
                <p className="mt-1 text-xs text-muted-foreground">Incl. making &amp; {calcGstPct}% GST</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pure Gold Bullion Value</span>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">{formatINR(result.goldBaseValue)}</p>
                <p className="mt-1 text-xs text-muted-foreground">{result.weightInGrams}g of {calcKarat} purity</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Making Charges</span>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">{formatINR(result.makingChargesAmount)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {calcMakingType === "percent" ? `${calcMakingValue}% of gold value` : `₹${calcMakingValue}/gram`}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">GST (3%)</span>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">{formatINR(result.gstAmount)}</p>
                <p className="mt-1 text-xs text-muted-foreground">On gold + making total</p>
              </div>
            </div>

            {/* Price Per Gram Reference Across All Karats */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-3">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Scale className="h-4 w-4 text-amber-500" />
                Live Benchmark Gold Rates Across All Karats (Based on 24K @ {formatINR(Number(calcRate24k))}/g)
              </h3>
              <div className="overflow-x-auto pt-1">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground">
                      <th className="py-2.5 px-3">Karat Purity</th>
                      <th className="py-2.5 px-3">Gold Content</th>
                      <th className="py-2.5 px-3">Rate Per Gram</th>
                      <th className="py-2.5 px-3">Rate Per 10 Grams</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-foreground">
                    {result.priceSummaryTable.map((row) => {
                      const isSelected = row.karat === calcKarat;
                      return (
                        <tr
                          key={row.karat}
                          className={`transition-colors ${isSelected ? "bg-amber-500/10 font-semibold" : "hover:bg-muted/30"}`}
                        >
                          <td className="py-2.5 px-3">
                            {row.karat}
                            {isSelected && <span className="ml-2 text-xs text-amber-600 font-normal">(Selected)</span>}
                          </td>
                          <td className="py-2.5 px-3">{row.purityPercent}</td>
                          <td className="py-2.5 px-3">{formatINR(row.pricePerGram)}</td>
                          <td className="py-2.5 px-3">{formatINR(row.pricePer10g)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorPageLayout>
  );
}

export default GoldValueCalculator;

