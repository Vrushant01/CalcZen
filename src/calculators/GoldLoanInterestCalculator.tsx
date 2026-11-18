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
  calculateGoldLoan,
  type GoldLoanResult,
  type GoldPurityKarat,
  type GoldRepaymentType,
} from "@/lib/calc/gold-loan-interest-calculator";
import { goldLoanInterestCalculatorContent } from "@/data/content/gold-loan-interest-calculator";
import { useLiveRates } from "@/hooks/use-live-rates";
import { LiveRatePanel } from "@/components/LiveRatePanel";
import {
  Coins,
  Gem,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  TrendingDown,
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

export function GoldLoanInterestCalculator() {
  const calc = getCalculator("gold-loan-interest-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();
  const { data: liveRates } = useLiveRates();

  // Primary State Declarations
  const [weight, setWeight] = useState<number | "">(50);
  const [karat, setKarat] = useState<GoldPurityKarat>("22K");
  const [rate24k, setRate24k] = useState<number | "">(liveRates?.gold24kPerGram || 7500);
  const [ltv, setLtv] = useState<number | "">(75);
  const [annualRate, setAnnualRate] = useState<number | "">(10.5);
  const [tenureMonths, setTenureMonths] = useState<number | "">(12);
  const [repaymentType, setRepaymentType] = useState<GoldRepaymentType>("emi");
  const [feePct, setFeePct] = useState<number | "">(0.5);

  // Snapshot State for Calculated Results
  const [calcWeight, setCalcWeight] = useState<number>(50);
  const [calcKarat, setCalcKarat] = useState<GoldPurityKarat>("22K");
  const [calcRate24k, setCalcRate24k] = useState<number>(liveRates?.gold24kPerGram || 7500);
  const [calcLtv, setCalcLtv] = useState<number>(75);
  const [calcAnnualRate, setCalcAnnualRate] = useState<number>(10.5);
  const [calcTenureMonths, setCalcTenureMonths] = useState<number>(12);
  const [calcRepaymentType, setCalcRepaymentType] = useState<GoldRepaymentType>("emi");
  const [calcFeePct, setCalcFeePct] = useState<number>(0.5);

  // Derived Calculation Result
  const result: GoldLoanResult = useMemo(() => {
    return calculateGoldLoan({
      weightGrams: Number(calcWeight) || 0,
      karat: calcKarat,
      goldRate24kPerGram: Number(calcRate24k) || 0,
      ltvPercent: Number(calcLtv) || 75,
      annualRatePct: Number(calcAnnualRate) || 0,
      tenureMonths: Number(calcTenureMonths) || 12,
      repaymentType: calcRepaymentType,
      processingFeePct: Number(calcFeePct) || 0,
    });
  }, [
    calcWeight,
    calcKarat,
    calcRate24k,
    calcLtv,
    calcAnnualRate,
    calcTenureMonths,
    calcRepaymentType,
    calcFeePct,
  ]);

  const isOutdated =
    hasResult &&
    (Number(weight) !== calcWeight ||
      karat !== calcKarat ||
      Number(rate24k) !== calcRate24k ||
      Number(ltv) !== calcLtv ||
      Number(annualRate) !== calcAnnualRate ||
      Number(tenureMonths) !== calcTenureMonths ||
      repaymentType !== calcRepaymentType ||
      Number(feePct) !== calcFeePct);

  const isButtonDisabled =
    !weight ||
    Number(weight) <= 0 ||
    !rate24k ||
    Number(rate24k) <= 0 ||
    !annualRate ||
    Number(annualRate) <= 0 ||
    !tenureMonths ||
    Number(tenureMonths) <= 0;

  const handleCalculate = () => {
    setCalcWeight(Number(weight) || 0);
    setCalcKarat(karat);
    setCalcRate24k(Number(rate24k) || 0);
    setCalcLtv(Number(ltv) || 75);
    setCalcAnnualRate(Number(annualRate) || 0);
    setCalcTenureMonths(Number(tenureMonths) || 12);
    setCalcRepaymentType(repaymentType);
    setCalcFeePct(Number(feePct) || 0);
    markCalculated();
  };

  const handleReset = () => {
    setWeight(50);
    setKarat("22K");
    setRate24k(liveRates?.gold24kPerGram || 7500);
    setLtv(75);
    setAnnualRate(10.5);
    setTenureMonths(12);
    setRepaymentType("emi");
    setFeePct(0.5);
    resetCalculated();
  };

  return (
    <CalculatorPageLayout
      calc={calc}
      intro={goldLoanInterestCalculatorContent.intro}
      formula={goldLoanInterestCalculatorContent.formula}
      example={
        goldLoanInterestCalculatorContent.workedExample
          ? `${goldLoanInterestCalculatorContent.workedExample.description}\n\n` +
            goldLoanInterestCalculatorContent.workedExample.table
              .map((r) => `${r.label}: ${r.value}`)
              .join("\n")
          : undefined
      }
      faqs={goldLoanInterestCalculatorContent.faqs}
      blog={
        <div className="space-y-8">
          <section className="surface-card rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-foreground">How to Use This Gold Loan EMI Calculator</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm sm:text-base">
              {goldLoanInterestCalculatorContent.howToUseSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="surface-card rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-foreground">{goldLoanInterestCalculatorContent.quickReferenceTable.title}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border/60 text-foreground font-semibold">
                    {goldLoanInterestCalculatorContent.quickReferenceTable.headers.map((h, i) => (
                      <th key={i} className="py-2.5 px-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-muted-foreground">
                  {goldLoanInterestCalculatorContent.quickReferenceTable.rows.map((row, ri) => (
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
            <h2 className="text-xl font-bold text-foreground">Things to Know &amp; Common Gold Loan Mistakes</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm sm:text-base">
              {goldLoanInterestCalculatorContent.mistakes.map((m, idx) => (
                <li key={idx}>{m}</li>
              ))}
            </ul>
          </section>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Optional Live Gold Rate Info Panel */}
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
            <h2 className="text-base font-semibold text-foreground">Gold Ornament &amp; Loan Parameters</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="weight" className="text-sm font-medium">
                Net Gold Weight (grams)
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                min={1}
                max={5000}
                value={weight}
                onChange={(e) => setWeight(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 50"
              />
              <p className="text-xs text-muted-foreground mt-1">Excludes stones and wax</p>
            </div>

            <div>
              <Label className="text-sm font-medium">Purity (Karat)</Label>
              <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                {(["24K", "22K", "18K"] as GoldPurityKarat[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKarat(k)}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-colors ${
                      karat === k
                        ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                        : "bg-card border-border hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">22K is standard Indian jewellery</p>
            </div>

            <div>
              <Label htmlFor="rate24k" className="text-sm font-medium">
                24K Rate / Gram (₹)
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
              <p className="text-xs text-muted-foreground mt-1">Benchmark pure gold price</p>
            </div>

            <div>
              <Label htmlFor="ltv" className="text-sm font-medium">
                Loan-to-Value (LTV %)
              </Label>
              <Input
                id="ltv"
                type="number"
                min={10}
                max={75}
                value={ltv}
                onChange={(e) => setLtv(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 75"
              />
              <p className="text-xs text-muted-foreground mt-1">RBI statutory maximum cap is 75%</p>
            </div>

            <div>
              <Label htmlFor="annualRate" className="text-sm font-medium">
                Interest Rate (% p.a.)
              </Label>
              <Input
                id="annualRate"
                type="number"
                step="0.1"
                min={1}
                max={30}
                value={annualRate}
                onChange={(e) => setAnnualRate(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 10.5"
              />
              <p className="text-xs text-muted-foreground mt-1">Typical rates: 9.5% to 15%</p>
            </div>

            <div>
              <Label htmlFor="tenureMonths" className="text-sm font-medium">
                Tenure (Months)
              </Label>
              <Input
                id="tenureMonths"
                type="number"
                min={1}
                max={36}
                value={tenureMonths}
                onChange={(e) => setTenureMonths(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 12"
              />
              <p className="text-xs text-muted-foreground mt-1">Usually 3 to 12 or 24 months</p>
            </div>
          </div>

          {/* Repayment Scheme Selector */}
          <div className="space-y-2 pt-1 border-t border-border/50">
            <Label className="text-sm font-medium">Repayment Scheme</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRepaymentType("emi")}
                className={`p-3 text-left rounded-xl border transition-colors ${
                  repaymentType === "emi"
                    ? "bg-amber-500/10 border-amber-500 font-medium"
                    : "bg-card border-border hover:bg-muted/30"
                }`}
              >
                <div className="text-xs font-semibold text-foreground">Monthly EMI</div>
                <div className="text-xs text-muted-foreground mt-0.5">Reducing balance; lowest total interest</div>
              </button>

              <button
                type="button"
                onClick={() => setRepaymentType("monthlyInterest")}
                className={`p-3 text-left rounded-xl border transition-colors ${
                  repaymentType === "monthlyInterest"
                    ? "bg-amber-500/10 border-amber-500 font-medium"
                    : "bg-card border-border hover:bg-muted/30"
                }`}
              >
                <div className="text-xs font-semibold text-foreground">Monthly Interest Only</div>
                <div className="text-xs text-muted-foreground mt-0.5">Pay interest monthly, principal at end</div>
              </button>

              <button
                type="button"
                onClick={() => setRepaymentType("bullet")}
                className={`p-3 text-left rounded-xl border transition-colors ${
                  repaymentType === "bullet"
                    ? "bg-amber-500/10 border-amber-500 font-medium"
                    : "bg-card border-border hover:bg-muted/30"
                }`}
              >
                <div className="text-xs font-semibold text-foreground">Bullet Repayment</div>
                <div className="text-xs text-muted-foreground mt-0.5">₹0 monthly; interest + principal at end</div>
              </button>
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
            message="Calculate Your Eligible Gold Loan & EMI"
            subMessage="Enter your gold weight, karat purity, rate, and preferred repayment scheme above, then click Calculate to view your sanctioned loan amount and monthly charges."
          />
        ) : (
          <div className="space-y-6">
            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  {result.repaymentType === "emi"
                    ? "Monthly EMI"
                    : result.repaymentType === "monthlyInterest"
                      ? "Monthly Interest"
                      : "Monthly Outflow"}
                </span>
                <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground">
                  {result.repaymentType === "bullet" ? "₹0 / month" : formatINR(result.monthlyOutflow)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {result.repaymentType === "bullet" ? "Paid at tenure end" : `For ${calcTenureMonths} months`}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Eligible Loan Amount</span>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">{formatINR(result.eligibleLoan)}</p>
                <p className="mt-1 text-xs text-muted-foreground">{calcLtv}% LTV on {formatINR(result.goldValue)} value</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Interest</span>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {formatINR(result.totalInterest)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{result.effectiveCostPct}% effective interest cost</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Repayment</span>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">{formatINR(result.totalRepayment)}</p>
                <p className="mt-1 text-xs text-muted-foreground">+ {formatINR(result.processingFeeAmount)} processing fee</p>
              </div>
            </div>

            {/* Scheme Comparison Card */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-3">
              <h3 className="text-base font-semibold text-foreground">All Repayment Modes Compared For Your Loan</h3>
              <p className="text-xs text-muted-foreground">
                Comparing the three repayment schemes for an eligible loan of {formatINR(result.eligibleLoan)} over {calcTenureMonths} months at {calcAnnualRate}% p.a.:
              </p>
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground">
                      <th className="py-2.5 px-3">Repayment Scheme</th>
                      <th className="py-2.5 px-3">Monthly Outflow</th>
                      <th className="py-2.5 px-3">Principal Payment</th>
                      <th className="py-2.5 px-3">Total Interest</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-foreground">
                    <tr className={result.repaymentType === "emi" ? "bg-amber-500/10 font-medium" : ""}>
                      <td className="py-2.5 px-3">
                        Monthly Reducing EMI
                        {result.repaymentType === "emi" && <span className="ml-2 text-xs text-amber-600 font-normal">(Selected)</span>}
                      </td>
                      <td className="py-2.5 px-3">Regular EMI</td>
                      <td className="py-2.5 px-3">Monthly reducing</td>
                      <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-medium">Lowest Interest</td>
                    </tr>
                    <tr className={result.repaymentType === "monthlyInterest" ? "bg-amber-500/10 font-medium" : ""}>
                      <td className="py-2.5 px-3">
                        Monthly Interest Only
                        {result.repaymentType === "monthlyInterest" && <span className="ml-2 text-xs text-amber-600 font-normal">(Selected)</span>}
                      </td>
                      <td className="py-2.5 px-3">Low monthly interest</td>
                      <td className="py-2.5 px-3">Full principal at end</td>
                      <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400">Moderate Interest</td>
                    </tr>
                    <tr className={result.repaymentType === "bullet" ? "bg-amber-500/10 font-medium" : ""}>
                      <td className="py-2.5 px-3">
                        Bullet Repayment
                        {result.repaymentType === "bullet" && <span className="ml-2 text-xs text-amber-600 font-normal">(Selected)</span>}
                      </td>
                      <td className="py-2.5 px-3">₹0 / month</td>
                      <td className="py-2.5 px-3">Full principal at end</td>
                      <td className="py-2.5 px-3 text-red-600 dark:text-red-400">Highest Cumulative Interest</td>
                    </tr>
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

export default GoldLoanInterestCalculator;

