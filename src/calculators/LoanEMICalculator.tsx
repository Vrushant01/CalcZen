import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog from "@/components/CalculatorBlog";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { blogContent } from "@/data/blogContent";
import { CalculatorCurrencyBar } from "@/components/CurrencySelector";
import { MoneyField } from "@/components/MoneyField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalculateButton } from "@/components/CalculateButton";
import { PDF_SITE_NAME, PDF_SITE_URL } from "@/constants/pdfBrand";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { useCurrency } from "@/hooks/use-currency";
import { formatPdfUsd } from "@/utils/formatPdfUsd";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import {
  HeroMetric, StatCard, DashboardSection, InsightCard,
  ComparisonTable, RecommendationList,
} from "@/components/dashboard";

export function LoanEMICalculator() {
  const calc = getCalculator("loan-emi-calculator")!;
  const { format } = useCurrency();
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  const [amount, setAmount] = useState<number | "">(20000);
  const [rate, setRate] = useState<number | "">(9);
  const [months, setMonths] = useState<number | "">(60);

  const [calcAmount, setCalcAmount] = useState<number>(20000);
  const [calcRate, setCalcRate] = useState<number>(9);
  const [calcMonths, setCalcMonths] = useState<number>(60);

  const { emi, totalInterest, totalPay } = useMemo(() => {
    const r = calcRate / 100 / 12;
    const n = calcMonths;
    const emi = r === 0 ? calcAmount / n : (calcAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPay = emi * n;
    return { emi, totalPay, totalInterest: totalPay - calcAmount };
  }, [calcAmount, calcRate, calcMonths]);

  const interestPct = calcAmount > 0 ? ((totalInterest / calcAmount) * 100).toFixed(1) : "0";
  const interestPctNum = calcAmount > 0 ? (totalInterest / calcAmount) * 100 : 0;
  const payoffYears = (calcMonths / 12).toFixed(1);
  const extraPrincipal = emi > 0 ? emi * 0.1 : 0;

  // Amortization data (yearly breakdown)
  const amortData = useMemo(() => {
    const r = calcRate / 100 / 12;
    let balance = calcAmount;
    const rows: { year: number; principal: number; interest: number; balance: number }[] = [];
    for (let yr = 1; yr <= Math.ceil(calcMonths / 12); yr++) {
      let yearPrincipal = 0, yearInterest = 0;
      for (let m = 0; m < 12 && (yr - 1) * 12 + m < calcMonths; m++) {
        const intPmt = balance * r;
        const prinPmt = emi - intPmt;
        yearInterest += intPmt;
        yearPrincipal += prinPmt;
        balance = Math.max(0, balance - prinPmt);
      }
      rows.push({ year: yr, principal: Math.round(yearPrincipal), interest: Math.round(yearInterest), balance: Math.round(balance) });
    }
    return rows;
  }, [calcAmount, calcRate, calcMonths, emi]);

  const donutData = [
    { name: "Principal", value: Math.round(calcAmount) },
    { name: "Interest", value: Math.round(totalInterest) },
  ].filter((d) => d.value > 0);

  // Comparison: same loan at different tenures
  const tenureOptions = [24, 36, 48, 60, 84, 120];
  const comparisonRows = tenureOptions.map((n) => {
    const r = calcRate / 100 / 12;
    const e = r === 0 ? calcAmount / n : (calcAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = e * n;
    const interest = total - calcAmount;
    const isActive = n === calcMonths;
    return {
      label: `${n} months (${(n / 12).toFixed(0)}y ${n % 12 > 0 ? `${n % 12}m` : ""})`.trim(),
      values: [format(e), format(interest), format(total)],
      highlight: isActive,
    };
  });

  const pdfData = hasResult
    ? {
        calculatorName: "Loan EMI Calculator",
        calculatorSlug: "loan-emi-calculator",
        siteName: PDF_SITE_NAME,
        siteUrl: PDF_SITE_URL,
        inputs: [
          { label: "Loan Amount", value: formatPdfUsd(calcAmount) },
          { label: "Interest Rate", value: `${calcRate}%` },
          { label: "Tenure", value: `${calcMonths} months` },
        ],
        results: [
          { label: "Monthly EMI", value: formatPdfUsd(emi), highlight: true },
          { label: "Total Payment", value: formatPdfUsd(totalPay), highlight: false },
          { label: "Total Interest", value: formatPdfUsd(totalInterest), highlight: false },
          { label: "Interest % of Principal", value: `${interestPct}%`, highlight: false },
        ],
        summary: `Your monthly EMI of ${formatPdfUsd(emi)} over ${calcMonths} months means you will pay ${formatPdfUsd(totalInterest)} in interest, which is ${interestPct}% of your original loan. To reduce interest, consider paying an extra ${formatPdfUsd(extraPrincipal)} each month toward the principal.`,
        chartElementId: "emi-chart",
      }
    : null;

  const isButtonDisabled = !amount || !rate || !months || Number(amount) <= 0 || Number(rate) <= 0 || Number(months) <= 0;

  const handleCalculate = () => {
    if (isButtonDisabled) return;
    setCalcAmount(Number(amount));
    setCalcRate(Number(rate));
    setCalcMonths(Number(months));
    markCalculated();
  };

  const handleReset = () => {
    setAmount(20000); setRate(9); setMonths(60);
    setCalcAmount(20000); setCalcRate(9); setCalcMonths(60);
    resetCalculated();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isButtonDisabled) handleCalculate();
  };

  const tooltipStyle = {
    contentStyle: { background: "var(--color-card)", borderColor: "var(--color-border)", borderRadius: "8px", fontSize: 12 },
    labelStyle: { color: "var(--color-foreground)" },
    itemStyle: { color: "var(--color-foreground)" },
  };

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Calculate your Equated Monthly Installment (EMI) for any loan. See exactly how much you'll pay each month and how much you'll pay in interest over the life of the loan."
      formula={`EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)\nwhere\nP = loan principal\nr = monthly interest rate (annual rate ÷ 12)\nn = loan term in months`}
      example={`Loan of $20,000 at 9% APR for 60 months.\nMonthly EMI ≈ $415.17.\nTotal interest paid ≈ $4,910.`}
      faqs={[
        { q: "What is a loan EMI?", a: "An Equated Monthly Installment (EMI) is a scheduled payment made by a borrower to a lender at a fixed date each month. It covers both principal and interest. The monthly EMI remains constant throughout the loan term, though the proportions allocated to interest and principal change as you pay down the debt." },
        { q: "How does interest rate affect my EMI?", a: "A higher interest rate directly increases the interest component of your payment, raising your monthly EMI and the total cost of the loan. Conversely, securing a lower interest rate reduces your monthly payment. You can analyze other monthly interest-compounding scenarios using our <a href=\"/calculator/mortgage-calculator\" class=\"text-primary hover:underline\">Mortgage Calculator</a> to estimate monthly housing costs." },
        { q: "What is the difference between flat and reducing interest rates?", a: "A flat rate calculates interest on the entire original principal for the whole term, which is very expensive. A reducing balance rate calculates interest only on the outstanding principal balance each month. As you repay the principal, the monthly interest charge decreases significantly over time, saving you a substantial sum of money." },
        { q: "Can I lower my EMI by extending the loan term?", a: "Yes, extending the loan term spreads principal repayment over more months, lowering your monthly EMI. However, this dramatically increases the total interest paid over the life of the loan. You can see how compounding impacts long-term capital by visiting our <a href=\"/calculator/compound-interest-calculator\" class=\"text-primary hover:underline\">Compound Interest Calculator</a> to evaluate your options." },
        { q: "What is a loan amortization schedule?", a: "A loan amortization schedule is a complete table showing the breakdown of every monthly payment over the life of the loan. It displays the exact amount of each payment that goes toward interest, how much goes toward principal, and the remaining loan balance after each installment is successfully paid by the borrower." },
        { q: "Are prepayments beneficial for reducing loan costs?", a: "Yes, making extra prepayments directly toward your loan's principal balance is highly beneficial. It reduces the outstanding principal, which lowers the interest charged in all subsequent months. This lets you pay off the debt faster and saves thousands of dollars in lifetime interest costs over the entire duration of the loan." },
        { q: "What is the processing fee on loans?", a: "A processing fee is a one-time charge levied by lenders to cover the administrative costs of evaluating, processing, and documenting your loan application. It is typically a small percentage of the total loan amount and is either deducted from the disbursed loan amount or paid upfront by the borrower, depending on the terms." },
        { q: "How should I plan my monthly borrowing budget?", a: "You should plan your borrowing budget by keeping your total monthly debt payments (including loans, credit cards, and housing) below 36% of your gross monthly income. You can easily determine percentage allocations and verify your debt ratios with our online <a href=\"/calculator/percentage-calculator\" class=\"text-primary hover:underline\">Percentage Calculator</a> to stay on track with your financial goals." }
      ]}
      blog={<CalculatorBlog content={blogContent.loan} />}
    >
      <CalculatorCurrencyBar />
      <div className="flex flex-col gap-6">
        <div className="calc-input-column">
          <MoneyField label="Loan amount" value={amount} onChange={(v) => setAmount(v)} />
          <div className="calc-field-grid-2">
            <Field label="Interest rate" value={rate} onChange={(v) => setRate(v)} onKeyDown={handleKeyDown} suffix="%" step={0.1} />
            <Field label="Tenure (months)" value={months} onChange={(v) => setMonths(v)} onKeyDown={handleKeyDown} />
          </div>
          <div className="flex flex-row gap-3 mt-4">
            <CalculateButton category="finance" className="flex-1 min-h-11" disabled={isButtonDisabled} onClick={handleCalculate}>
              Calculate
            </CalculateButton>
            <Button variant="outline" className="flex-1 min-h-11" onClick={handleReset}>Reset</Button>
          </div>
        </div>

        {hasResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-2 flex flex-col gap-6"
          >
            {/* Hero */}
            <HeroMetric
              label="Monthly EMI"
              value={format(emi)}
              sub={`Over ${calcMonths} months · ${payoffYears} years total`}
              glow="#0ea5e9"
            />

            {/* Key Metrics */}
            <DashboardSection title="Key Metrics">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard index={0} label="Principal Amount" value={format(calcAmount)} accent="blue" />
                <StatCard index={1} label="Total Interest" value={format(totalInterest)} accent="red"
                  badge={`${interestPct}%`} />
                <StatCard index={2} label="Total Repayment" value={format(totalPay)} accent="default" />
                <StatCard index={3} label="Annual Rate" value={`${calcRate}%`} accent="amber" />
                <StatCard index={4} label="Loan Tenure" value={`${calcMonths} months`} accent="cyan" />
                <StatCard index={5} label="Interest of Principal" value={`${interestPct}%`}
                  accent={interestPctNum > 50 ? "red" : interestPctNum > 25 ? "amber" : "green"} />
              </div>
            </DashboardSection>

            {/* Charts */}
            <DashboardSection title="Visualization">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Donut */}
                <div id="emi-chart" className="rounded-xl border border-border/60 bg-card p-4 shadow-soft">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Principal vs Interest</div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={76} paddingAngle={3}>
                          <Cell fill="var(--color-chart-1)" />
                          <Cell fill="var(--color-chart-5)" />
                        </Pie>
                        <Tooltip formatter={(v: number) => format(v)} {...tooltipStyle} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Amortization bar chart */}
                <div className="rounded-xl border border-border/60 bg-card p-4 shadow-soft">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Year-wise Breakdown</div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={amortData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={10} tickFormatter={(v) => `Y${v}`} />
                        <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                        <Tooltip formatter={(v: number) => format(v)} {...tooltipStyle} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar dataKey="principal" name="Principal" stackId="a" fill="var(--color-chart-1)" radius={[0,0,0,0]} />
                        <Bar dataKey="interest" name="Interest" stackId="a" fill="var(--color-chart-5)" radius={[3,3,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </DashboardSection>

            {/* Comparison */}
            <DashboardSection title="Scenario Comparison — Tenure Options">
              <ComparisonTable
                headers={["Tenure", "Monthly EMI", "Total Interest", "Total Cost"]}
                rows={comparisonRows}
                highlightColIndex={0}
              />
            </DashboardSection>

            {/* Insights */}
            <DashboardSection title="Smart Insights">
              <div className="flex flex-col gap-2">
                <InsightCard index={0} tone="info"
                  text={`Interest represents ${interestPct}% of your total repayment — you'll pay ${format(totalInterest)} in interest on top of your ${format(calcAmount)} principal.`} />
                <InsightCard index={1} tone={interestPctNum > 40 ? "warning" : "success"}
                  text={`Paying an extra ${format(extraPrincipal)}/month (10% of EMI) toward principal could save significant interest and cut months off your loan.`} />
                <InsightCard index={2} tone="tip"
                  text={`At ${calcRate}% annual rate, the total cost of this loan is ${format(totalPay)} — ${((totalPay / calcAmount - 1) * 100).toFixed(0)}% more than the original amount borrowed.`} />
              </div>
            </DashboardSection>

            {/* Recommendations */}
            <DashboardSection title="Recommendations">
              <RecommendationList items={[
                { title: "Make EMI-to-income check", description: `Your EMI should ideally not exceed 40% of your monthly take-home income. At ${format(emi)}/month, ensure this fits your budget comfortably.` },
                { title: "Consider partial prepayment", description: "Even one extra EMI per year applied to the principal can reduce your overall tenure by 2–4 months and save meaningful interest." },
                { title: "Review refinancing if rate drops", description: `If market rates drop more than 1% below your current ${calcRate}%, refinancing your loan could reduce your EMI and total interest burden.` },
              ]} />
            </DashboardSection>

            <div className="flex flex-col">
              <CalculatorPdfExport hasResult={hasResult} pdfData={pdfData} />
            </div>
          </motion.div>
        )}
      </div>
    </CalculatorPageLayout>
  );
}

function Field({ label, value, onChange, onKeyDown, suffix, step = 1 }: {
  label: string; value: number | ""; onChange: (n: number | "") => void;
  onKeyDown?: (e: React.KeyboardEvent) => void; suffix?: string; step?: number;
}) {
  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="mt-1 relative">
        <Input type="number" step={step} value={value} onChange={(e) => {
          const val = e.target.value;
          onChange(val === "" ? "" : Number(val));
        }} onKeyDown={onKeyDown} className={suffix ? "pr-10" : ""} />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}
