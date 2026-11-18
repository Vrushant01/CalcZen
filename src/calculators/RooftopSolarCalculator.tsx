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
  calculateRooftopSolar,
  type RooftopSolarInputs,
  type RooftopSolarResult,
} from "@/lib/calc/rooftop-solar-calculator";
import { rooftopSolarCalculatorContent } from "@/data/content/rooftop-solar-calculator";
import {
  Sun,
  Zap,
  RotateCcw,
  Sparkles,
  TreePine,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Info,
  ExternalLink,
} from "lucide-react";

function formatINR(val: number): string {
  if (isNaN(val) || !isFinite(val)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

export function RooftopSolarCalculator() {
  const calc = getCalculator("rooftop-solar-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  // Primary State Declarations
  const [inputMode, setInputMode] = useState<"bill" | "units">("bill");
  const [monthlyBill, setMonthlyBill] = useState<number | "">(3000);
  const [monthlyUnits, setMonthlyUnits] = useState<number | "">(400);
  const [tariffRate, setTariffRate] = useState<number | "">(7.5);
  const [roofAreaSqFt, setRoofAreaSqFt] = useState<number | "">(500);
  const [costPerKw, setCostPerKw] = useState<number | "">(60000);
  const [includeSubsidy, setIncludeSubsidy] = useState<boolean>(true);

  // Snapshot State for Calculated Results
  const [calcInputs, setCalcInputs] = useState<RooftopSolarInputs>({
    inputMode: "bill",
    monthlyElectricityBill: 3000,
    monthlyUnitsConsumed: 400,
    tariffRatePerUnit: 7.5,
    roofAreaSqFt: 500,
    costPerKw: 60000,
    includeSubsidy: true,
  });

  // Derived Calculation Result
  const result: RooftopSolarResult = useMemo(() => {
    return calculateRooftopSolar(calcInputs);
  }, [calcInputs]);

  // Outdated change detection
  const isOutdated =
    hasResult &&
    (inputMode !== calcInputs.inputMode ||
      monthlyBill !== calcInputs.monthlyElectricityBill ||
      monthlyUnits !== calcInputs.monthlyUnitsConsumed ||
      tariffRate !== calcInputs.tariffRatePerUnit ||
      roofAreaSqFt !== calcInputs.roofAreaSqFt ||
      costPerKw !== calcInputs.costPerKw ||
      includeSubsidy !== calcInputs.includeSubsidy);

  const handleCalculate = () => {
    setCalcInputs({
      inputMode,
      monthlyElectricityBill: Number(monthlyBill) || 0,
      monthlyUnitsConsumed: Number(monthlyUnits) || 0,
      tariffRatePerUnit: Number(tariffRate) || 7.5,
      roofAreaSqFt: Number(roofAreaSqFt) || 0,
      costPerKw: Number(costPerKw) || 60000,
      includeSubsidy,
    });
    markCalculated();
  };

  const handleReset = () => {
    setInputMode("bill");
    setMonthlyBill(3000);
    setMonthlyUnits(400);
    setTariffRate(7.5);
    setRoofAreaSqFt(500);
    setCostPerKw(60000);
    setIncludeSubsidy(true);
    resetCalculated();
  };

  return (
    <CalculatorPageLayout
      calc={calc}
      intro={rooftopSolarCalculatorContent.intro}
      formula={rooftopSolarCalculatorContent.formula}
      example={
        rooftopSolarCalculatorContent.workedExample
          ? `${rooftopSolarCalculatorContent.workedExample.description}\n\n` +
            rooftopSolarCalculatorContent.workedExample.table
              .map((r) => `${r.label}: ${r.value}`)
              .join("\n")
          : undefined
      }
      faqs={rooftopSolarCalculatorContent.faqs}
      blog={
        <div className="space-y-8">
          <section className="surface-card rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-foreground">How to Use This Rooftop Solar Calculator</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm sm:text-base">
              {rooftopSolarCalculatorContent.howToUseSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="surface-card rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-foreground">{rooftopSolarCalculatorContent.quickReferenceTable.title}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border/60 text-foreground font-semibold">
                    {rooftopSolarCalculatorContent.quickReferenceTable.headers.map((h, i) => (
                      <th key={i} className="py-2.5 px-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-muted-foreground">
                  {rooftopSolarCalculatorContent.quickReferenceTable.rows.map((row, ri) => (
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
            <h2 className="text-xl font-bold text-foreground">Things to Know &amp; Common Rooftop Solar Mistakes</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm sm:text-base">
              {rooftopSolarCalculatorContent.mistakes.map((m, idx) => (
                <li key={idx}>{m}</li>
              ))}
            </ul>
          </section>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Inputs Column */}
        <div className="lg:col-span-6 space-y-6 bg-card border border-border/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-border/60">
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <Sun className="w-5 h-5 text-amber-500" />
              Power & Rooftop Details
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
          </div>

          {/* Mode Switcher */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground">
              Calculate By
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={inputMode === "bill" ? "default" : "outline"}
                size="sm"
                onClick={() => setInputMode("bill")}
                className="text-xs h-9"
              >
                Monthly Power Bill (₹)
              </Button>
              <Button
                type="button"
                variant={inputMode === "units" ? "default" : "outline"}
                size="sm"
                onClick={() => setInputMode("units")}
                className="text-xs h-9"
              >
                Monthly Units (kWh)
              </Button>
            </div>
          </div>

          {/* Primary Input */}
          {inputMode === "bill" ? (
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground">
                Average Monthly Electricity Bill (₹)
              </Label>
              <Input
                type="number"
                min="0"
                step="100"
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(e.target.value === "" ? "" : Number(e.target.value))}
                className="font-medium text-base"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground">
                Average Monthly Consumption (Units / kWh)
              </Label>
              <Input
                type="number"
                min="0"
                step="10"
                value={monthlyUnits}
                onChange={(e) => setMonthlyUnits(e.target.value === "" ? "" : Number(e.target.value))}
                className="font-medium text-base"
              />
            </div>
          )}

          {/* Electricity Tariff & Roof Area */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold text-foreground mb-1 block">
                Tariff Rate (₹/Unit)
              </Label>
              <Input
                type="number"
                step="0.1"
                min="1"
                max="30"
                value={tariffRate}
                onChange={(e) => setTariffRate(e.target.value === "" ? "" : Number(e.target.value))}
              />
              <span className="text-[10px] text-muted-foreground mt-0.5 block">Avg ₹7 to ₹9/unit in India</span>
            </div>
            <div>
              <Label className="text-xs font-semibold text-foreground mb-1 block">
                Available Roof Area (Sq Ft)
              </Label>
              <Input
                type="number"
                min="50"
                max="50000"
                value={roofAreaSqFt}
                onChange={(e) => setRoofAreaSqFt(e.target.value === "" ? "" : Number(e.target.value))}
              />
              <span className="text-[10px] text-muted-foreground mt-0.5 block">~100 sq ft per 1 kW needed</span>
            </div>
          </div>

          {/* PM Surya Ghar Subsidy Toggle */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-bold text-foreground">
                  PM Surya Ghar Subsidy
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Central financial DBT assistance (up to ₹78,000)
                </p>
              </div>
              <Button
                type="button"
                variant={includeSubsidy ? "default" : "outline"}
                size="sm"
                className="text-xs h-8"
                onClick={() => setIncludeSubsidy(!includeSubsidy)}
              >
                {includeSubsidy ? "Applied" : "Excluded"}
              </Button>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span>Official Scheme Details:</span>
              <a
                href="https://pmsuryaghar.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium inline-flex items-center gap-0.5"
              >
                pmsuryaghar.gov.in <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Turnkey Cost Benchmark */}
          <div className="space-y-2 pt-2 border-t border-border/40">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground">
                Installation Cost Benchmark (₹/kW)
              </Label>
              <span className="text-[11px] text-muted-foreground">Market avg ₹55k–₹65k</span>
            </div>
            <Input
              type="number"
              step="1000"
              min="20000"
              max="150000"
              value={costPerKw}
              onChange={(e) => setCostPerKw(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </div>

          <CalculateButton onClick={handleCalculate} />
        </div>

        {/* Right Output Results Column */}
        <div className="lg:col-span-6 space-y-6">
          {isOutdated && <OutdatedResultBanner onCalculate={handleCalculate} />}

          {!hasResult ? (
            <EmptyResultPlaceholder
              message="Solar System Size &amp; Financial Return"
              subMessage="Enter your monthly power bill and available roof space, then click Calculate to view recommended kW capacity, central subsidy, payback years, and 25-year lifetime savings."
            />
          ) : (
            <div className="space-y-6">
              {/* Roof Constraint Warning */}
              {result.roofConstraintWarning && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <strong>Roof space constraint:</strong> Based on your power bill, a {result.recommendedKw} kW system is recommended, but your {calcInputs.roofAreaSqFt} sq ft terrace fits {result.finalSystemKw} kW maximum. Calculations below reflect {result.finalSystemKw} kW.
                  </div>
                </div>
              )}

              {/* Top Highlight Card */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-foreground relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Recommended Solar System
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold">
                    {result.finalSystemKw} kW Capacity
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 my-2">
                  <div>
                    <span className="text-xs text-muted-foreground block">Net Investment</span>
                    <span className="text-3xl font-extrabold text-foreground">
                      {formatINR(result.netSystemCost)}
                    </span>
                    {result.subsidyAmount > 0 && (
                      <span className="text-[11px] text-green-600 dark:text-green-400 block mt-0.5">
                        Includes {formatINR(result.subsidyAmount)} Subsidy
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground block">Annual Bill Savings</span>
                    <span className="text-3xl font-extrabold text-foreground">
                      {formatINR(result.annualSavings)}
                    </span>
                    <span className="text-[11px] text-muted-foreground block mt-0.5">
                      {formatINR(result.monthlySavings)} / month
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-primary/15 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Estimated Financial Payback:
                  </span>
                  <span className="text-base font-bold text-foreground">
                    {result.paybackPeriodYears} Years
                  </span>
                </div>
              </div>

              {/* Generation & Space Metrics */}
              <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Generation & System Specs
                </h3>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                    <span className="text-base font-bold text-foreground block">{result.dailyGenerationUnits}</span>
                    <span className="text-[11px] text-muted-foreground">Units / Day</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                    <span className="text-base font-bold text-foreground block">{result.monthlyGenerationUnits}</span>
                    <span className="text-[11px] text-muted-foreground">Units / Month</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                    <span className="text-base font-bold text-foreground block">{result.requiredRoofAreaSqFt}</span>
                    <span className="text-[11px] text-muted-foreground">Sq Ft Roof Needed</span>
                  </div>
                </div>

                <div className="divide-y divide-border/40 text-xs pt-1">
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Gross Turnkey System Cost:</span>
                    <span className="font-semibold text-foreground">{formatINR(result.grossSystemCost)}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">PM Surya Ghar Subsidy (DBT):</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      −{formatINR(result.subsidyAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 font-bold">
                    <span className="text-foreground">Net Cost After Subsidy:</span>
                    <span className="text-primary">{formatINR(result.netSystemCost)}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">25-Year Cumulative Savings:</span>
                    <span className="font-semibold text-foreground">{formatINR(result.twentyFiveYearSavings)}</span>
                  </div>
                </div>
              </div>

              {/* Environmental Impact Card */}
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 text-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TreePine className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-foreground block">
                      Green Planet Impact
                    </span>
                    <span className="text-muted-foreground">
                      Offsets {result.co2SavedTonnesPerYear} tonnes CO₂/yr (~{result.equivalentTreesPlanted} trees planted)
                    </span>
                  </div>
                </div>
                <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold">
                  Zero Emissions
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorPageLayout>
  );
}
