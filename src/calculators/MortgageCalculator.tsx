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
import { buildYearlyAmortizationRows } from "@/utils/mortgageAmortization";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import {
  HeroMetric, StatCard, DashboardSection, InsightCard,
  ComparisonTable, RecommendationList,
} from "@/components/dashboard";

export function MortgageCalculator() {
  const calc = getCalculator("mortgage-calculator")!;
  const { format, formatAxis } = useCurrency();
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  const [price, setPrice] = useState<number | "">(400000);
  const [down, setDown] = useState<number | "">(80000);
  const [rate, setRate] = useState<number | "">(6.5);
  const [years, setYears] = useState<number | "">(30);
  const [tax, setTax] = useState<number | "">(3000);
  const [ins, setIns] = useState<number | "">(1200);
  const [hoa, setHoa] = useState<number | "">(0);

  const [calcPrice, setCalcPrice] = useState<number>(400000);
  const [calcDown, setCalcDown] = useState<number>(80000);
  const [calcRate, setCalcRate] = useState<number>(6.5);
  const [calcYears, setCalcYears] = useState<number>(30);
  const [calcTax, setCalcTax] = useState<number>(3000);
  const [calcIns, setCalcIns] = useState<number>(1200);
  const [calcHoa, setCalcHoa] = useState<number>(0);

  const result = useMemo(() => {
    const principal = Math.max(0, calcPrice - calcDown);
    const r = calcRate / 100 / 12;
    const n = calcYears * 12;
    const pi = r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const monthlyTax = calcTax / 12;
    const monthlyIns = calcIns / 12;
    const monthly = pi + monthlyTax + monthlyIns + calcHoa;
    const totalPaid = pi * n;
    const totalInterest = totalPaid - principal;
    const totalCost = totalPaid + calcDown;
    return { pi, monthly, monthlyTax, monthlyIns, hoa: calcHoa, principal, totalPaid, totalInterest, totalCost };
  }, [calcPrice, calcDown, calcRate, calcYears, calcTax, calcIns, calcHoa]);

  // Balance over time for area chart
  const balanceSeries = useMemo(() => {
    const r = calcRate / 100 / 12;
    const n = calcYears * 12;
    let bal = result.principal;
    const rows: { year: number; balance: number }[] = [{ year: 0, balance: Math.round(bal) }];
    for (let m = 1; m <= n; m++) {
      const intPmt = bal * r;
      bal = Math.max(0, bal - (result.pi - intPmt));
      if (m % 12 === 0) rows.push({ year: m / 12, balance: Math.round(bal) });
    }
    return rows;
  }, [result.principal, result.pi, calcRate, calcYears]);

  const downPct = calcPrice > 0 ? ((calcDown / calcPrice) * 100).toFixed(0) : "0";
  const ltv = calcPrice > 0 ? (((calcPrice - calcDown) / calcPrice) * 100).toFixed(0) : "0";
  const minIncome = result.monthly > 0 ? Math.round(result.monthly / 0.3) : 0;
  const interestPct = result.principal > 0 ? ((result.totalInterest / result.principal) * 100).toFixed(0) : "0";
  const totalCostRatio = calcPrice > 0 ? ((result.totalCost / calcPrice - 1) * 100).toFixed(0) : "0";

  const donutData = [
    { name: "Principal & Interest", value: Math.round(result.pi) },
    { name: "Property Tax", value: Math.round(result.monthlyTax) },
    { name: "Insurance", value: Math.round(result.monthlyIns) },
    { name: "HOA", value: Math.round(result.hoa) },
  ].filter((d) => d.value > 0);

  // Comparison: same loan at different terms
  const termOptions = [10, 15, 20, 25, 30];
  const comparisonRows = termOptions.map((yr) => {
    const r = calcRate / 100 / 12;
    const n = yr * 12;
    const pi = r === 0 ? result.principal / n : (result.principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalInterest = pi * n - result.principal;
    const isActive = yr === calcYears;
    return {
      label: `${yr}-year term`,
      values: [format(pi), format(totalInterest), format(pi * n + calcDown)],
      highlight: isActive,
    };
  });

  const pdfData = hasResult
    ? {
        calculatorName: "Mortgage Calculator",
        calculatorSlug: "mortgage-calculator",
        siteName: PDF_SITE_NAME,
        siteUrl: PDF_SITE_URL,
        inputs: [
          { label: "Home Price", value: formatPdfUsd(calcPrice) },
          { label: "Down Payment", value: `${formatPdfUsd(calcDown)} (${downPct}%)` },
          { label: "Interest Rate", value: `${calcRate}%` },
          { label: "Loan Term", value: `${calcYears} years` },
          { label: "Property Tax (annual)", value: formatPdfUsd(calcTax) },
          { label: "Insurance (annual)", value: formatPdfUsd(calcIns) },
        ],
        results: [
          { label: "Monthly Payment", value: formatPdfUsd(result.monthly), highlight: true },
          { label: "Principal & Interest / month", value: formatPdfUsd(result.pi), highlight: false },
          { label: "Total Interest Paid", value: formatPdfUsd(result.totalInterest), highlight: false },
          { label: "Total Loan Cost", value: formatPdfUsd(result.totalCost), highlight: false },
          { label: "Loan Amount", value: formatPdfUsd(result.principal), highlight: false },
        ],
        summary: `Your monthly mortgage payment of ${formatPdfUsd(result.monthly)} means you need a minimum take-home income of about ${formatPdfUsd(minIncome)}/month to keep housing costs within the recommended 30% of income. Over ${calcYears} years, you will pay ${formatPdfUsd(result.totalInterest)} in interest — nearly ${interestPct}% of your original loan amount.`,
        tableData: {
          title: "AMORTIZATION SCHEDULE (FIRST 20 YEARS)",
          headers: ["Year", "Principal", "Interest", "Balance"],
          rows: buildYearlyAmortizationRows(result.principal, calcRate, calcYears),
        },
        chartElementId: "mortgage-chart",
      }
    : null;

  const isButtonDisabled = !price || !down || !rate || !years || Number(price) <= 0 || Number(down) < 0 || Number(rate) <= 0 || Number(years) <= 0 || tax === "" || ins === "" || hoa === "";

  const handleCalculate = () => {
    if (isButtonDisabled) return;
    setCalcPrice(Number(price)); setCalcDown(Number(down)); setCalcRate(Number(rate));
    setCalcYears(Number(years)); setCalcTax(Number(tax)); setCalcIns(Number(ins)); setCalcHoa(Number(hoa));
    markCalculated();
  };

  const handleReset = () => {
    setPrice(400000); setDown(80000); setRate(6.5); setYears(30); setTax(3000); setIns(1200); setHoa(0);
    setCalcPrice(400000); setCalcDown(80000); setCalcRate(6.5); setCalcYears(30); setCalcTax(3000); setCalcIns(1200); setCalcHoa(0);
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

  const chartColors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)"];

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Estimate your monthly mortgage payment including principal, interest, property tax, insurance and HOA fees. Adjust the inputs to see how different loan terms affect your total cost."
      formula={`Monthly P&I = P × r × (1 + r)^n / ((1 + r)^n − 1)\nwhere\nP = loan principal (home price − down payment)\nr = monthly interest rate (annual rate ÷ 12)\nn = total payments (years × 12)`}
      example={`Home price $400,000 with $80,000 down, 6.5% APR, 30-year term.\nLoan principal ≈ $320,000.\nMonthly P&I ≈ $2,022. With $3,000/yr tax and $1,200/yr insurance, total monthly ≈ $2,372.`}
      faqs={[
        { q: "What is included in a mortgage payment?", a: "A typical monthly mortgage payment (PITI) includes principal, interest, property tax and homeowners insurance. HOA dues may apply for condos or planned communities." },
        { q: "How does the down payment affect my mortgage?", a: "A larger down payment reduces the loan principal, lowers your monthly payment, and may help you avoid private mortgage insurance (PMI)." },
        { q: "Is a 15-year or 30-year loan better?", a: "A 15-year loan has higher monthly payments but far less total interest. A 30-year loan has lower payments and more flexibility, but you pay more over time." },
        { q: "Are the results from this calculator final?", a: "Results are estimates for planning. Your actual payment depends on your lender, credit, taxes, insurance quotes and other fees." },
        { q: "What is the difference between a fixed-rate and an adjustable-rate mortgage (ARM)?", a: "A fixed-rate mortgage maintains the exact same interest rate and monthly principal/interest payment for the entire life of the loan. Adjustable-rate mortgages (ARMs) have rates that fluctuate over time based on market indexes." },
        { q: "How can I avoid paying Private Mortgage Insurance (PMI)?", a: "To avoid paying PMI, you must make a down payment of at least 20% of the home's purchase price. Lenders require PMI on down payments below 20% to protect themselves against borrower default." },
        { q: "Does prepaying my mortgage principal really save money?", a: "Yes, substantially. By making extra payments directly toward your loan's principal balance, you reduce the base on which interest compounds, saving thousands in lifetime interest and shortening your repayment timeline." },
      ]}
      blog={<CalculatorBlog content={blogContent.mortgage} />}
    >
      <CalculatorCurrencyBar />
      <div className="flex flex-col gap-6">
        <div className="calc-input-column">
          <MoneyField label="Home price" value={price} onChange={(v) => setPrice(v)} />
          <MoneyField label="Down payment" value={down} onChange={(v) => setDown(v)} />
          <div className="calc-field-grid-2">
            <PctField label="Interest rate" value={rate} onChange={(v) => setRate(v)} onKeyDown={handleKeyDown} step={0.05} />
            <PctField label="Loan term" value={years} onChange={(v) => setYears(v)} onKeyDown={handleKeyDown} suffix="yr" step={1} />
          </div>
          <MoneyField label="Property tax (annual)" value={tax} onChange={(v) => setTax(v)} />
          <MoneyField label="Insurance (annual)" value={ins} onChange={(v) => setIns(v)} />
          <MoneyField label="HOA (monthly)" value={hoa} onChange={(v) => setHoa(v)} />

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
              label="Estimated Monthly Payment"
              value={format(result.monthly)}
              sub={`P&I ${format(result.pi)} + Tax ${format(result.monthlyTax)} + Insurance ${format(result.monthlyIns)}${result.hoa > 0 ? ` + HOA ${format(result.hoa)}` : ""}`}
              glow="#0ea5e9"
            />

            {/* Key Metrics */}
            <DashboardSection title="Key Metrics">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard index={0} label="Loan Amount" value={format(result.principal)} accent="blue" />
                <StatCard index={1} label="Down Payment" value={format(calcDown)} accent="green" badge={`${downPct}%`} />
                <StatCard index={2} label="Loan-to-Value (LTV)" value={`${ltv}%`} accent={Number(ltv) > 80 ? "red" : "green"} />
                <StatCard index={3} label="Total Interest Paid" value={format(result.totalInterest)} accent="red" badge={`${interestPct}%`} />
                <StatCard index={4} label="Total Loan Cost" value={format(result.totalCost)} accent="amber" />
                <StatCard index={5} label="Min Monthly Income" value={format(minIncome)} accent="purple" subValue="30% rule" />
              </div>
            </DashboardSection>

            {/* Charts */}
            <DashboardSection title="Visualization">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div id="mortgage-chart" className="rounded-xl border border-border/60 bg-card p-4 shadow-soft">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Monthly Payment Breakdown</div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={74} paddingAngle={3}>
                          {donutData.map((_, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
                        </Pie>
                        <Tooltip formatter={(v: number) => format(v)} {...tooltipStyle} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 bg-card p-4 shadow-soft">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Remaining Balance Over Time</div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={balanceSeries} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.03} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={10} tickFormatter={(v) => `Y${v}`} />
                        <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickFormatter={formatAxis} />
                        <Tooltip formatter={(v: number) => format(v)} {...tooltipStyle} />
                        <Area type="monotone" dataKey="balance" name="Balance" stroke="var(--color-chart-1)" strokeWidth={2.5} fill="url(#balGrad)" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </DashboardSection>

            {/* Comparison */}
            <DashboardSection title="Scenario Comparison — Loan Terms">
              <ComparisonTable
                headers={["Term", "Monthly P&I", "Total Interest", "Total Cost"]}
                rows={comparisonRows}
                highlightColIndex={0}
              />
            </DashboardSection>

            {/* Insights */}
            <DashboardSection title="Smart Insights">
              <div className="flex flex-col gap-2">
                <InsightCard index={0} tone="info"
                  text={`Over ${calcYears} years, you'll pay ${format(result.totalInterest)} in interest — ${interestPct}% of your original loan amount. Your home will effectively cost ${format(result.totalCost)} in total.`} />
                <InsightCard index={1} tone={Number(ltv) > 80 ? "warning" : "success"}
                  text={Number(ltv) > 80
                    ? `Your LTV of ${ltv}% is above 80%, which typically triggers Private Mortgage Insurance (PMI). Consider a larger down payment to avoid this extra cost.`
                    : `Your down payment of ${downPct}% (LTV ${ltv}%) is above 20%, so you avoid PMI — great financial discipline.`} />
                <InsightCard index={2} tone="tip"
                  text={`To keep housing costs within the recommended 30% of income, you need a monthly take-home of at least ${format(minIncome)}. Your total home cost is ${totalCostRatio}% more than the purchase price.`} />
              </div>
            </DashboardSection>

            {/* Recommendations */}
            <DashboardSection title="Recommendations">
              <RecommendationList items={[
                { title: "Make one extra payment per year", description: "Paying one additional EMI annually reduces a 30-year mortgage by 4–5 years and saves tens of thousands in interest." },
                { title: "Review refinancing when rates drop 1%+", description: `If market rates drop below ${(calcRate - 1).toFixed(1)}%, refinancing your ${format(result.principal)} mortgage could meaningfully reduce your monthly payment and total cost.` },
                { title: "Build an emergency fund first", description: "Keep 3–6 months of mortgage payments (≈ " + format(result.monthly * 4) + ") in liquid savings before making extra principal payments, to protect against income disruption." },
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

function PctField({ label, value, onChange, onKeyDown, suffix = "%", step = 1 }: {
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
        }} onKeyDown={onKeyDown} className="pr-10" />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{suffix}</span>
      </div>
    </div>
  );
}
