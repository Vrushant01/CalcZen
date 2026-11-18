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
import { calculateHomeLoan, type HomeLoanResult } from "@/lib/calc/home-loan-emi-calculator";
import { homeLoanEmiCalculatorContent } from "@/data/content/home-loan-emi-calculator";
import {
  Home,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  TrendingDown,
  Clock,
  ShieldAlert,
} from "lucide-react";

function formatINR(val: number): string {
  if (isNaN(val) || !isFinite(val)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

export function HomeLoanEMICalculator() {
  const calc = getCalculator("home-loan-emi-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  // Primary State Declarations (must precede derived/memoised variables)
  const [loanAmount, setLoanAmount] = useState<number | "">(5000000);
  const [rate, setRate] = useState<number | "">(8.5);
  const [tenureYears, setTenureYears] = useState<number | "">(20);
  const [prepayType, setPrepayType] = useState<"none" | "oneTime" | "recurringYearly">("none");
  const [prepayAmount, setPrepayAmount] = useState<number | "">(500000);
  const [prepayMonth, setPrepayMonth] = useState<number | "">(12);
  const [prepayEffect, setPrepayEffect] = useState<"reduceTenure" | "reduceEmi">("reduceTenure");
  const [showAmortization, setShowAmortization] = useState<boolean>(false);

  // Snapshot State for Calculated Results
  const [calcLoanAmount, setCalcLoanAmount] = useState<number>(5000000);
  const [calcRate, setCalcRate] = useState<number>(8.5);
  const [calcTenureYears, setCalcTenureYears] = useState<number>(20);
  const [calcPrepayType, setCalcPrepayType] = useState<"none" | "oneTime" | "recurringYearly">("none");
  const [calcPrepayAmount, setCalcPrepayAmount] = useState<number>(500000);
  const [calcPrepayMonth, setCalcPrepayMonth] = useState<number>(12);
  const [calcPrepayEffect, setCalcPrepayEffect] = useState<"reduceTenure" | "reduceEmi">("reduceTenure");

  // Derived Calculation Result
  const result: HomeLoanResult = useMemo(() => {
    return calculateHomeLoan({
      loanAmount: Number(calcLoanAmount) || 0,
      annualRatePct: Number(calcRate) || 0,
      tenureYears: Number(calcTenureYears) || 1,
      prepaymentType: calcPrepayType,
      prepaymentAmount: Number(calcPrepayAmount) || 0,
      prepaymentMonth: Number(calcPrepayMonth) || 12,
      prepaymentEffect: calcPrepayEffect,
    });
  }, [
    calcLoanAmount,
    calcRate,
    calcTenureYears,
    calcPrepayType,
    calcPrepayAmount,
    calcPrepayMonth,
    calcPrepayEffect,
  ]);

  const isOutdated =
    hasResult &&
    (Number(loanAmount) !== calcLoanAmount ||
      Number(rate) !== calcRate ||
      Number(tenureYears) !== calcTenureYears ||
      prepayType !== calcPrepayType ||
      Number(prepayAmount) !== calcPrepayAmount ||
      Number(prepayMonth) !== calcPrepayMonth ||
      prepayEffect !== calcPrepayEffect);

  const isButtonDisabled =
    !loanAmount ||
    Number(loanAmount) <= 0 ||
    !rate ||
    Number(rate) <= 0 ||
    !tenureYears ||
    Number(tenureYears) <= 0;

  const handleCalculate = () => {
    setCalcLoanAmount(Number(loanAmount) || 0);
    setCalcRate(Number(rate) || 0);
    setCalcTenureYears(Number(tenureYears) || 1);
    setCalcPrepayType(prepayType);
    setCalcPrepayAmount(Number(prepayAmount) || 0);
    setCalcPrepayMonth(Number(prepayMonth) || 12);
    setCalcPrepayEffect(prepayEffect);
    markCalculated();
  };

  const handleReset = () => {
    setLoanAmount(5000000);
    setRate(8.5);
    setTenureYears(20);
    setPrepayType("none");
    setPrepayAmount(500000);
    setPrepayMonth(12);
    setPrepayEffect("reduceTenure");
    resetCalculated();
  };

  return (
    <CalculatorPageLayout
      calc={calc}
      intro={homeLoanEmiCalculatorContent.intro}
      formula={homeLoanEmiCalculatorContent.formula}
      example={
        homeLoanEmiCalculatorContent.workedExample
          ? `${homeLoanEmiCalculatorContent.workedExample.description}\n\n` +
            homeLoanEmiCalculatorContent.workedExample.table
              .map((r) => `${r.label}: ${r.value}`)
              .join("\n")
          : undefined
      }
      faqs={homeLoanEmiCalculatorContent.faqs}
      blog={
        <div className="space-y-8">
          <section className="surface-card rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-foreground">How to Use This Home Loan EMI Calculator</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm sm:text-base">
              {homeLoanEmiCalculatorContent.howToUseSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="surface-card rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-foreground">{homeLoanEmiCalculatorContent.quickReferenceTable.title}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border/60 text-foreground font-semibold">
                    {homeLoanEmiCalculatorContent.quickReferenceTable.headers.map((h, i) => (
                      <th key={i} className="py-2.5 px-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-muted-foreground">
                  {homeLoanEmiCalculatorContent.quickReferenceTable.rows.map((row, ri) => (
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
            <h2 className="text-xl font-bold text-foreground">Things to Know &amp; Common Home Loan Mistakes</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm sm:text-base">
              {homeLoanEmiCalculatorContent.mistakes.map((m, idx) => (
                <li key={idx}>{m}</li>
              ))}
            </ul>
          </section>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Input Form Card */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-border/50 pb-3">
            <Home className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Loan &amp; Prepayment Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="loanAmount" className="text-sm font-medium">
                Loan Amount (₹)
              </Label>
              <Input
                id="loanAmount"
                type="number"
                min={100000}
                max={500000000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 5000000"
              />
              <p className="text-xs text-muted-foreground mt-1">Principal amount borrowed</p>
            </div>

            <div>
              <Label htmlFor="rate" className="text-sm font-medium">
                Interest Rate (% p.a.)
              </Label>
              <Input
                id="rate"
                type="number"
                step="0.05"
                min={1}
                max={25}
                value={rate}
                onChange={(e) => setRate(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 8.5"
              />
              <p className="text-xs text-muted-foreground mt-1">Prevailing home loan rates: 8.35% - 9.5%</p>
            </div>

            <div>
              <Label htmlFor="tenureYears" className="text-sm font-medium">
                Tenure (Years)
              </Label>
              <Input
                id="tenureYears"
                type="number"
                min={1}
                max={35}
                value={tenureYears}
                onChange={(e) => setTenureYears(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 20"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {tenureYears ? `${Number(tenureYears) * 12} months` : "Commonly 15 to 30 years"}
              </p>
            </div>
          </div>

          {/* Optional Prepayment Section */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Prepayment Strategy (Optional)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs font-medium">Prepayment Type</Label>
                <div className="flex gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setPrepayType("none")}
                    className={`flex-1 py-1.5 px-2 text-xs rounded-md border text-center transition-colors ${
                      prepayType === "none"
                        ? "bg-primary text-primary-foreground border-primary font-medium"
                        : "bg-card border-border hover:bg-muted/50"
                    }`}
                  >
                    None
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrepayType("oneTime")}
                    className={`flex-1 py-1.5 px-2 text-xs rounded-md border text-center transition-colors ${
                      prepayType === "oneTime"
                        ? "bg-primary text-primary-foreground border-primary font-medium"
                        : "bg-card border-border hover:bg-muted/50"
                    }`}
                  >
                    One-Time
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrepayType("recurringYearly")}
                    className={`flex-1 py-1.5 px-2 text-xs rounded-md border text-center transition-colors ${
                      prepayType === "recurringYearly"
                        ? "bg-primary text-primary-foreground border-primary font-medium"
                        : "bg-card border-border hover:bg-muted/50"
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>

              {prepayType !== "none" && (
                <>
                  <div>
                    <Label htmlFor="prepayAmount" className="text-xs font-medium">
                      Prepayment Amount (₹)
                    </Label>
                    <Input
                      id="prepayAmount"
                      type="number"
                      min={1000}
                      value={prepayAmount}
                      onChange={(e) => setPrepayAmount(e.target.value === "" ? "" : Number(e.target.value))}
                      className="mt-1 h-9 text-xs"
                      placeholder="e.g. 500000"
                    />
                  </div>

                  {prepayType === "oneTime" ? (
                    <div>
                      <Label htmlFor="prepayMonth" className="text-xs font-medium">
                        At Month #
                      </Label>
                      <Input
                        id="prepayMonth"
                        type="number"
                        min={1}
                        max={Number(tenureYears || 20) * 12}
                        value={prepayMonth}
                        onChange={(e) => setPrepayMonth(e.target.value === "" ? "" : Number(e.target.value))}
                        className="mt-1 h-9 text-xs"
                        placeholder="e.g. 12"
                      />
                    </div>
                  ) : (
                    <div>
                      <Label className="text-xs font-medium">Prepayment Impact</Label>
                      <div className="flex gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => setPrepayEffect("reduceTenure")}
                          className={`flex-1 py-1.5 px-2 text-xs rounded-md border transition-colors ${
                            prepayEffect === "reduceTenure"
                              ? "bg-primary text-primary-foreground border-primary font-medium"
                              : "bg-card border-border hover:bg-muted/50"
                          }`}
                        >
                          Cut Tenure
                        </button>
                        <button
                          type="button"
                          onClick={() => setPrepayEffect("reduceEmi")}
                          className={`flex-1 py-1.5 px-2 text-xs rounded-md border transition-colors ${
                            prepayEffect === "reduceEmi"
                              ? "bg-primary text-primary-foreground border-primary font-medium"
                              : "bg-card border-border hover:bg-muted/50"
                          }`}
                        >
                          Lower EMI
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
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
            message="Calculate Your Home Loan EMI & Savings"
            subMessage="Enter your loan amount, interest rate and tenure above, then click Calculate to view your monthly instalments, interest burden, and how prepayments can save lakhs in interest."
          />
        ) : (
          <div className="space-y-6">
            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-primary/30 bg-primary/5 dark:bg-primary/10 p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">Monthly EMI</span>
                <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground">{formatINR(result.regularEmi)}</p>
                <p className="mt-1 text-xs text-muted-foreground">For {Number(calcTenureYears) * 12} months</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Interest</span>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {formatINR(result.regularTotalInterest)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {((result.regularTotalInterest / (Number(calcLoanAmount) || 1)) * 100).toFixed(0)}% of principal
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Payment</span>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">{formatINR(result.regularTotalPayment)}</p>
                <p className="mt-1 text-xs text-muted-foreground">Principal + cumulative interest</p>
              </div>

              {result.hasPrepayment ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Interest Saved
                  </span>
                  <p className="mt-2 text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatINR(result.interestSaved)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {result.monthsSaved > 0
                      ? `${result.monthsSaved} months saved (~${(result.monthsSaved / 12).toFixed(1)} yrs)`
                      : "EMI reduced"}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Loan Tenure</span>
                  <p className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">{calcTenureYears} Years</p>
                  <p className="mt-1 text-xs text-muted-foreground">Without part-prepayment</p>
                </div>
              )}
            </div>

            {/* Prepayment Summary Card if Prepayment configured */}
            {result.hasPrepayment && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 sm:p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-base font-semibold text-foreground">Prepayment Impact Summary</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm pt-1">
                  <div>
                    <span className="text-xs text-muted-foreground">New Tenure:</span>
                    <p className="font-semibold text-foreground">
                      {Math.floor(result.effectiveTenureMonths / 12)}y {result.effectiveTenureMonths % 12}m
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Time Reduced:</span>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {result.monthsSaved} Months (~{(result.monthsSaved / 12).toFixed(1)} Years)
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Effective Total Cost:</span>
                    <p className="font-semibold text-foreground">{formatINR(result.effectiveTotalPayment)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Collapsible Amortization Schedule */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <button
                type="button"
                onClick={() => setShowAmortization(!showAmortization)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-foreground hover:bg-muted/30 transition-colors"
              >
                <span>Year-by-Year Amortization Schedule</span>
                {showAmortization ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
              </button>

              {showAmortization && (
                <div className="p-5 border-t border-border/60 space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-border/60 text-muted-foreground">
                          <th className="py-2.5 px-3">Year</th>
                          <th className="py-2.5 px-3">Principal Repaid</th>
                          <th className="py-2.5 px-3">Interest Charged</th>
                          {result.hasPrepayment && <th className="py-2.5 px-3">Prepayment</th>}
                          <th className="py-2.5 px-3">Ending Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40 text-foreground">
                        {result.yearlySummary.map((yr) => (
                          <tr key={yr.year} className="hover:bg-muted/20">
                            <td className="py-2.5 px-3 font-medium">Year {yr.year}</td>
                            <td className="py-2.5 px-3">{formatINR(yr.principalPaid)}</td>
                            <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400">{formatINR(yr.interestPaid)}</td>
                            {result.hasPrepayment && (
                              <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-medium">
                                {yr.prepaymentPaid > 0 ? formatINR(yr.prepaymentPaid) : "—"}
                              </td>
                            )}
                            <td className="py-2.5 px-3 font-medium">{formatINR(yr.endingBalance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </CalculatorPageLayout>
  );
}

export default HomeLoanEMICalculator;

