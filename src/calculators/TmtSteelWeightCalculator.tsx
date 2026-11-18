import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog, { type BlogContent } from "@/components/CalculatorBlog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalculateButton } from "@/components/CalculateButton";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { OutdatedResultBanner } from "@/components/OutdatedResultBanner";
import { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";
import {
  calculateTmtSteelWeight,
  STANDARD_DIAMETERS,
  type SteelWeightResult,
  type SteelLengthUnit,
} from "@/lib/calc/tmt-steel-weight-calculator";
import { tmtSteelWeightCalculatorContent } from "@/data/content/tmt-steel-weight-calculator";
import {
  Building2,
  Layers,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Scale,
  Hammer,
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

export function TmtSteelWeightCalculator() {
  const calc = getCalculator("tmt-steel-weight-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  // Primary State Declarations
  const [diameter, setDiameter] = useState<number | "">(12);
  const [length, setLength] = useState<number | "">(12);
  const [lengthUnit, setLengthUnit] = useState<SteelLengthUnit>("meters");
  const [numberOfBars, setNumberOfBars] = useState<number | "">(50);
  const [ratePerKg, setRatePerKg] = useState<number | "">(65);

  // Snapshot State for Calculated Results
  const [calcDiameter, setCalcDiameter] = useState<number>(12);
  const [calcLength, setCalcLength] = useState<number>(12);
  const [calcLengthUnit, setCalcLengthUnit] = useState<SteelLengthUnit>("meters");
  const [calcNumberOfBars, setCalcNumberOfBars] = useState<number>(50);
  const [calcRatePerKg, setCalcRatePerKg] = useState<number>(65);

  // Derived Calculation Result
  const result: SteelWeightResult = useMemo(() => {
    return calculateTmtSteelWeight({
      diameterMm: Number(calcDiameter) || 12,
      length: Number(calcLength) || 12,
      lengthUnit: calcLengthUnit,
      numberOfBars: Number(calcNumberOfBars) || 1,
      ratePerKg: Number(calcRatePerKg) || 0,
    });
  }, [calcDiameter, calcLength, calcLengthUnit, calcNumberOfBars, calcRatePerKg]);

  const isOutdated =
    hasResult &&
    (Number(diameter) !== calcDiameter ||
      Number(length) !== calcLength ||
      lengthUnit !== calcLengthUnit ||
      Number(numberOfBars) !== calcNumberOfBars ||
      Number(ratePerKg) !== calcRatePerKg);

  const isButtonDisabled =
    !diameter ||
    Number(diameter) <= 0 ||
    !length ||
    Number(length) <= 0 ||
    !numberOfBars ||
    Number(numberOfBars) <= 0;

  const handleCalculate = () => {
    setCalcDiameter(Number(diameter) || 12);
    setCalcLength(Number(length) || 12);
    setCalcLengthUnit(lengthUnit);
    setCalcNumberOfBars(Number(numberOfBars) || 1);
    setCalcRatePerKg(Number(ratePerKg) || 0);
    markCalculated();
  };

  const handleReset = () => {
    setDiameter(12);
    setLength(12);
    setLengthUnit("meters");
    setNumberOfBars(50);
    setRatePerKg(65);
    resetCalculated();
  };

  const blogData: BlogContent = {
    title: tmtSteelWeightCalculatorContent.h1,
    description: tmtSteelWeightCalculatorContent.intro,
    articleHtml: `
      <section class="space-y-4">
        <h2 class="text-xl font-bold text-foreground">How to Use This TMT Steel Weight Calculator</h2>
        <ol class="list-decimal list-inside space-y-2 text-muted-foreground text-sm sm:text-base">
          ${tmtSteelWeightCalculatorContent.howToUseSteps.map((step) => `<li>${step}</li>`).join("")}
        </ol>
      </section>

      <section class="space-y-4 mt-8">
        <h2 class="text-xl font-bold text-foreground">The d²/162 Steel Formula Explained</h2>
        <p class="text-muted-foreground text-sm sm:text-base leading-relaxed">${tmtSteelWeightCalculatorContent.formula}</p>
        <div class="mt-4 rounded-xl border border-border bg-card p-4 sm:p-6 space-y-3">
          <h3 class="font-semibold text-foreground text-base">Worked Real-World Example</h3>
          <p class="text-sm text-muted-foreground">${tmtSteelWeightCalculatorContent.workedExample.description}</p>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm border-collapse">
              <thead>
                <tr class="border-b border-border/60">
                  <th class="py-2 font-medium text-foreground">Parameter</th>
                  <th class="py-2 font-medium text-foreground">Value</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border/40 text-muted-foreground">
                ${tmtSteelWeightCalculatorContent.workedExample.table
                  .map(
                    (row) => `
                  <tr>
                    <td class="py-2">${row.label}</td>
                    <td class="py-2 font-medium text-foreground">${row.value}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="space-y-4 mt-8">
        <h2 class="text-xl font-bold text-foreground">${tmtSteelWeightCalculatorContent.quickReferenceTable.title}</h2>
        <div class="overflow-x-auto rounded-xl border border-border bg-card p-2 sm:p-4">
          <table class="w-full text-left text-sm border-collapse">
            <thead>
              <tr class="border-b border-border/60 text-foreground font-medium">
                ${tmtSteelWeightCalculatorContent.quickReferenceTable.headers
                  .map((h) => `<th class="py-2.5 px-3">${h}</th>`)
                  .join("")}
              </tr>
            </thead>
            <tbody class="divide-y divide-border/40 text-muted-foreground">
              ${tmtSteelWeightCalculatorContent.quickReferenceTable.rows
                .map(
                  (r) => `
                <tr class="hover:bg-muted/40 transition-colors">
                  ${r.map((c, i) => `<td class="py-2.5 px-3 ${i === 0 ? "font-medium text-foreground" : ""}">${c}</td>`).join("")}
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </section>

      <section class="space-y-4 mt-8">
        <h2 class="text-xl font-bold text-foreground">Site Precautions &amp; Common Steel Mistakes</h2>
        <ul class="list-disc list-inside space-y-2 text-muted-foreground text-sm sm:text-base">
          ${tmtSteelWeightCalculatorContent.mistakes.map((m) => `<li>${m}</li>`).join("")}
        </ul>
      </section>
    `,
    faqs: tmtSteelWeightCalculatorContent.faqs,
  };

  return (
    <CalculatorPageLayout calc={calc}>
      <div className="space-y-6">
        {/* Input Form Card */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-border/50 pb-3">
            <Building2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-base font-semibold text-foreground">TMT Bar Dimensions &amp; Quantity</h2>
          </div>

          <div>
            <Label className="text-sm font-medium">Standard Bar Diameter (mm)</Label>
            <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5 mt-1.5">
              {STANDARD_DIAMETERS.map((dia) => (
                <button
                  key={dia}
                  type="button"
                  onClick={() => setDiameter(dia)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${
                    diameter === dia
                      ? "bg-amber-600 dark:bg-amber-500 text-white border-amber-600 shadow-xs"
                      : "bg-card border-border hover:bg-muted/50 text-foreground"
                  }`}
                >
                  {dia} mm
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="customDia" className="text-sm font-medium">
                Custom Diameter (mm)
              </Label>
              <Input
                id="customDia"
                type="number"
                min={4}
                max={50}
                value={diameter}
                onChange={(e) => setDiameter(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 12"
              />
              <p className="text-xs text-muted-foreground mt-1">Or pick preset above</p>
            </div>

            <div>
              <Label htmlFor="length" className="text-sm font-medium">
                Bar Length
              </Label>
              <div className="flex gap-2 mt-1.5">
                <Input
                  id="length"
                  type="number"
                  step="0.5"
                  min={0.5}
                  value={length}
                  onChange={(e) => setLength(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 12"
                />
                <button
                  type="button"
                  onClick={() => setLengthUnit(lengthUnit === "meters" ? "feet" : "meters")}
                  className="px-3 py-2 rounded-lg border border-border text-xs font-medium hover:bg-muted/50 whitespace-nowrap"
                >
                  {lengthUnit === "meters" ? "Metres" : "Feet"}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Standard factory commercial bar is 12m (~40 ft)</p>
            </div>

            <div>
              <Label htmlFor="numberOfBars" className="text-sm font-medium">
                Number of Bars
              </Label>
              <Input
                id="numberOfBars"
                type="number"
                min={1}
                max={100000}
                value={numberOfBars}
                onChange={(e) => setNumberOfBars(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 50"
              />
              <p className="text-xs text-muted-foreground mt-1">Total pieces needed</p>
            </div>

            <div className="sm:col-span-3">
              <Label htmlFor="ratePerKg" className="text-sm font-medium">
                Retail Steel Rate per Kg (₹ optional)
              </Label>
              <Input
                id="ratePerKg"
                type="number"
                min={0}
                max={300}
                value={ratePerKg}
                onChange={(e) => setRatePerKg(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 65"
              />
              <p className="text-xs text-muted-foreground mt-1">Typical secondary/primary rebar rates: ₹60 - ₹75/kg</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <CalculateButton
              isOutdated={isOutdated}
              isDisabled={isButtonDisabled}
              onClick={handleCalculate}
            />
            <Button variant="outline" onClick={handleReset} className="gap-1.5 text-xs sm:text-sm">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Outdated Result Notification */}
        <OutdatedResultBanner isOutdated={isOutdated} onCalculate={handleCalculate} />

        {/* Results Section */}
        {!hasResult ? (
          <EmptyResultPlaceholder
            title="Calculate Reinforcement Steel Weight &amp; Cost"
            description="Select bar diameter, enter length and quantity above, then click Calculate to compute total weight in kilograms, metric tonnes, and estimated material cost."
          />
        ) : (
          <div className="space-y-6">
            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-amber-600/30 bg-amber-600/5 dark:bg-amber-600/10 p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Total Weight
                </span>
                <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground">{result.totalWeightKg} kg</p>
                <p className="mt-1 text-xs text-muted-foreground">{result.totalWeightTonne} Metric Tonnes</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Unit Weight (d²/162)</span>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">{result.weightPerMeterKg} kg/m</p>
                <p className="mt-1 text-xs text-muted-foreground">For {result.diameterMm}mm bar</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Weight per Single Bar</span>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">{result.weightPerBarKg} kg</p>
                <p className="mt-1 text-xs text-muted-foreground">Length: {result.barLengthMeters}m</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estimated Cost</span>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">{formatINR(result.totalCost)}</p>
                <p className="mt-1 text-xs text-muted-foreground">At ₹{calcRatePerKg}/kg</p>
              </div>
            </div>

            {/* IS 1786 Standard Benchmark Reference Table */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-3">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Scale className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                IS 1786 Standard TMT Diameter &amp; Weight Reference Table
              </h3>
              <div className="overflow-x-auto pt-1">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground">
                      <th className="py-2.5 px-3">Diameter</th>
                      <th className="py-2.5 px-3">Unit Weight (kg/m)</th>
                      <th className="py-2.5 px-3">Standard 12m Bar (kg)</th>
                      <th className="py-2.5 px-3">Bars / Tonne</th>
                      <th className="py-2.5 px-3">Permitted IS Tolerance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-foreground">
                    {result.standardReferenceTable.map((row) => {
                      const isSelected = row.diameterMm === calcDiameter;
                      return (
                        <tr
                          key={row.diameterMm}
                          className={`transition-colors ${isSelected ? "bg-amber-600/10 font-semibold" : "hover:bg-muted/30"}`}
                        >
                          <td className="py-2.5 px-3">
                            {row.diameterMm} mm
                            {isSelected && <span className="ml-2 text-xs text-amber-600 font-normal">(Selected)</span>}
                          </td>
                          <td className="py-2.5 px-3">{row.weightPerMeterKg} kg</td>
                          <td className="py-2.5 px-3">{row.weightPer12mBarKg} kg</td>
                          <td className="py-2.5 px-3">{row.barsPerTonne} bars</td>
                          <td className="py-2.5 px-3 text-muted-foreground">{row.tolerancePct}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Rich SEO Content & FAQs Section */}
        <CalculatorBlog content={blogData} />
      </div>
    </CalculatorPageLayout>
  );
}

export default TmtSteelWeightCalculator;

