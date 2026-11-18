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
import { calculateCarLoanEMI, type CarLoanResult } from "@/lib/calc/car-loan-emi-calculator";
import { carLoanEmiCalculatorContent } from "@/data/content/car-loan-emi-calculator";
import {
  Car,
  ChevronDown,
  ChevronUp,
  Percent,
  RotateCcw,
  ShieldCheck,
  Calendar,
  Sparkles,
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

export function CarLoanEMICalculator() {
  const calc = getCalculator("car-loan-emi-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  // Primary State Declarations (must precede derived/memoised variables)
  const [carPrice, setCarPrice] = useState<number | "">(1000000);
  const [downPayment, setDownPayment] = useState<number | "">(200000);
  const [rate, setRate] = useState<number | "">(9.0);
  const [tenureYears, setTenureYears] = useState<number | "">(5);
  const [processingFeePct, setProcessingFeePct] = useState<number | "">(1.0);
  const [showAmortization, setShowAmortization] = useState<boolean>(false);

  // Snapshot State for Calculated Results
  const [calcCarPrice, setCalcCarPrice] = useState<number>(1000000);
  const [calcDownPayment, setCalcDownPayment] = useState<number>(200000);
  const [calcRate, setCalcRate] = useState<number>(9.0);
  const [calcTenureYears, setCalcTenureYears] = useState<number>(5);
  const [calcFeePct, setCalcFeePct] = useState<number>(1.0);

  // Derived Values
  const result: CarLoanResult = useMemo(() => {
    return calculateCarLoanEMI({
      carPrice: Number(calcCarPrice) || 0,
      downPayment: Number(calcDownPayment) || 0,
      annualRatePct: Number(calcRate) || 0,
      tenureMonths: Math.round((Number(calcTenureYears) || 1) * 12),
      processingFeePct: Number(calcFeePct) || 0,
    });
  }, [calcCarPrice, calcDownPayment, calcRate, calcTenureYears, calcFeePct]);

  const isOutdated =
    hasResult &&
    (Number(carPrice) !== calcCarPrice ||
      Number(downPayment) !== calcDownPayment ||
      Number(rate) !== calcRate ||
      Number(tenureYears) !== calcTenureYears ||
      Number(processingFeePct) !== calcFeePct);

  const isButtonDisabled =
    !carPrice ||
    Number(carPrice) <= 0 ||
    !rate ||
    Number(rate) <= 0 ||
    !tenureYears ||
    Number(tenureYears) <= 0;

  const handleCalculate = () => {
    setCalcCarPrice(Number(carPrice) || 0);
    setCalcDownPayment(Number(downPayment) || 0);
    setCalcRate(Number(rate) || 0);
    setCalcTenureYears(Number(tenureYears) || 1);
    setCalcFeePct(Number(processingFeePct) || 0);
    markCalculated();
  };

  const handleReset = () => {
    setCarPrice(1000000);
    setDownPayment(200000);
    setRate(9.0);
    setTenureYears(5);
    setProcessingFeePct(1.0);
    resetCalculated();
  };

  return (
    <CalculatorPageLayout
      calc={calc}
      intro={carLoanEmiCalculatorContent.intro}
      formula={carLoanEmiCalculatorContent.formula}
      example={
        carLoanEmiCalculatorContent.workedExample
          ? `${carLoanEmiCalculatorContent.workedExample.description}\n\n` +
            carLoanEmiCalculatorContent.workedExample.table
              .map((r) => `${r.label}: ${r.value}`)
              .join("\n")
          : undefined
      }
      faqs={carLoanEmiCalculatorContent.faqs}
      blog={
        <div className="space-y-8">
          <section className="surface-card rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-foreground">How to Use This Car Loan EMI Calculator</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm sm:text-base">
              {carLoanEmiCalculatorContent.howToUseSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="surface-card rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-foreground">{carLoanEmiCalculatorContent.quickReferenceTable.title}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border/60 text-foreground font-semibold">
                    {carLoanEmiCalculatorContent.quickReferenceTable.headers.map((h, i) => (
                      <th key={i} className="py-2.5 px-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-muted-foreground">
                  {carLoanEmiCalculatorContent.quickReferenceTable.rows.map((row, ri) => (
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
            <h2 className="text-xl font-bold text-foreground">Things to Know &amp; Common Car Financing Mistakes</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm sm:text-base">
              {carLoanEmiCalculatorContent.mistakes.map((m, idx) => (
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
            <Car className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Car Loan Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="carPrice" className="text-sm font-medium">
                On-Road Car Price (₹)
              </Label>
              <Input
                id="carPrice"
                type="number"
                min={50000}
                max={50000000}
                value={carPrice}
                onChange={(e) => setCarPrice(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 1000000"
              />
              <p className="text-xs text-muted-foreground mt-1">Total invoice including RTO &amp; insurance</p>
            </div>

            <div>
              <Label htmlFor="downPayment" className="text-sm font-medium">
                Down Payment (₹)
              </Label>
              <Input
                id="downPayment"
                type="number"
                min={0}
                max={Number(carPrice) || 50000000}
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 200000"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {carPrice && downPayment
                  ? `${Math.round(((Number(downPayment) || 0) / (Number(carPrice) || 1)) * 100)}% of on-road price`
                  : "Upfront savings payment"}
              </p>
            </div>

            <div>
              <Label htmlFor="rate" className="text-sm font-medium">
                Interest Rate (% p.a. reducing)
              </Label>
              <Input
                id="rate"
                type="number"
                step="0.05"
                min={0}
                max={30}
                value={rate}
                onChange={(e) => setRate(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 9.0"
              />
              <p className="text-xs text-muted-foreground mt-1">Typical public/private bank rates: 8.5% - 10.5%</p>
            </div>

            <div>
              <Label htmlFor="tenureYears" className="text-sm font-medium">
                Repayment Tenure (Years)
              </Label>
              <Input
                id="tenureYears"
                type="number"
                min={1}
                max={8}
                value={tenureYears}
                onChange={(e) => setTenureYears(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {tenureYears ? `${Number(tenureYears) * 12} monthly instalments` : "1 to 8 years"}
              </p>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="feePct" className="text-sm font-medium">
                Bank Processing Fee (% optional)
              </Label>
              <Input
                id="feePct"
                type="number"
                step="0.1"
                min={0}
                max={5}
                value={processingFeePct}
                onChange={(e) => setProcessingFeePct(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 1.0"
              />
              <p className="text-xs text-muted-foreground mt-1">One-time processing fee (usually 0.5% to 1.5%)</p>
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
            message="Calculate Your Auto Loan EMI"
            subMessage="Enter your vehicle cost, down payment, interest rate and tenure above, then click Calculate to view your monthly instalments, total financing cost, and tenure comparison."
          />
        ) : (
          <div className="space-y-6">
            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-primary/30 bg-primary/5 dark:bg-primary/10 p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">Monthly EMI</span>
                <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground">{formatINR(result.emi)}</p>
                <p className="mt-1 text-xs text-muted-foreground">For {Number(calcTenureYears) * 12} months</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Loan Principal</span>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">{formatINR(result.principal)}</p>
                <p className="mt-1 text-xs text-muted-foreground">{result.loanToPricePct}% of vehicle price</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Interest</span>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {formatINR(result.totalInterest)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{result.interestToPrincipalPct}% of principal</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Payment</span>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">{formatINR(result.totalPayment)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  + {formatINR(result.processingFeeAmount)} fee = {formatINR(result.totalCostWithFee)}
                </p>
              </div>
            </div>

            {/* Tenure Comparison Grid */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Tenure Comparison (Same Loan Amount: {formatINR(result.principal)})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground">
                      <th className="py-2.5 px-3">Tenure</th>
                      <th className="py-2.5 px-3">Monthly EMI</th>
                      <th className="py-2.5 px-3">Total Interest</th>
                      <th className="py-2.5 px-3">Total Repayment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-foreground">
                    {result.tenureComparison.map((tc) => {
                      const isActive = tc.years === Number(calcTenureYears);
                      return (
                        <tr
                          key={tc.years}
                          className={`transition-colors ${isActive ? "bg-primary/10 font-semibold" : "hover:bg-muted/30"}`}
                        >
                          <td className="py-2.5 px-3">
                            {tc.years} Years ({tc.months} mos)
                            {isActive && <span className="ml-2 text-xs text-primary font-normal">(Selected)</span>}
                          </td>
                          <td className="py-2.5 px-3">{formatINR(tc.emi)}</td>
                          <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400">{formatINR(tc.totalInterest)}</td>
                          <td className="py-2.5 px-3">{formatINR(tc.totalPayment)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Collapsible Amortization Schedule */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <button
                type="button"
                onClick={() => setShowAmortization(!showAmortization)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-foreground hover:bg-muted/30 transition-colors"
              >
                <span>Year-by-Year &amp; Month-by-Month Amortization Schedule</span>
                {showAmortization ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
              </button>

              {showAmortization && (
                <div className="p-5 border-t border-border/60 space-y-5">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">Yearly Amortization Summary</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-border/60 text-muted-foreground">
                            <th className="py-2 px-3">Year</th>
                            <th className="py-2 px-3">Principal Paid</th>
                            <th className="py-2 px-3">Interest Paid</th>
                            <th className="py-2 px-3">Ending Balance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40 text-foreground">
                          {result.yearlySummary.map((yr) => (
                            <tr key={yr.year} className="hover:bg-muted/20">
                              <td className="py-2 px-3 font-medium">Year {yr.year}</td>
                              <td className="py-2 px-3">{formatINR(yr.principal)}</td>
                              <td className="py-2 px-3 text-amber-600 dark:text-amber-400">{formatINR(yr.interest)}</td>
                              <td className="py-2 px-3 font-medium">{formatINR(yr.endingBalance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">Complete Month-by-Month Schedule</h4>
                    <div className="max-h-80 overflow-y-auto rounded-lg border border-border/40">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="sticky top-0 bg-muted/80 backdrop-blur-xs">
                          <tr className="border-b border-border/60 text-muted-foreground">
                            <th className="py-2 px-2.5">Month</th>
                            <th className="py-2 px-2.5">EMI</th>
                            <th className="py-2 px-2.5">Interest</th>
                            <th className="py-2 px-2.5">Principal</th>
                            <th className="py-2 px-2.5">Balance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30 text-foreground">
                          {result.schedule.map((m) => (
                            <tr key={m.month} className="hover:bg-muted/20">
                              <td className="py-1.5 px-2.5 font-medium">M{m.month}</td>
                              <td className="py-1.5 px-2.5">{formatINR(m.emi)}</td>
                              <td className="py-1.5 px-2.5 text-amber-600 dark:text-amber-400">{formatINR(m.interest)}</td>
                              <td className="py-1.5 px-2.5">{formatINR(m.principal)}</td>
                              <td className="py-1.5 px-2.5 font-medium">{formatINR(m.balance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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

export default CarLoanEMICalculator;

