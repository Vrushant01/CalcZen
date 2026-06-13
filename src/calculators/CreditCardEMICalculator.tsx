import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import {
  HeroMetric,
  StatCard,
  DashboardSection,
  InsightCard,
  ComparisonTable,
} from "@/components/dashboard";

export function CreditCardEMICalculator() {
  const calc = getCalculator("credit-card-emi-calculator")!;
  const { format, formatAxis } = useCurrency();
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  const [principal, setPrincipal] = useState<number | "">(50000);
  const [rate, setRate] = useState<number | "">(18);
  const [months, setMonths] = useState<number | "">(12);

  const [calcPrincipal, setCalcPrincipal] = useState<number>(50000);
  const [calcRate, setCalcRate] = useState<number>(18);
  const [calcMonths, setCalcMonths] = useState<number>(12);

  const result = useMemo(() => {
    const p = calcPrincipal;
    const r = calcRate / 100 / 12;
    const n = calcMonths;
    const emi = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;
    return { p, emi, totalPayment, totalInterest };
  }, [calcPrincipal, calcRate, calcMonths]);

  // Balance over time for area chart
  const balanceSeries = useMemo(() => {
    const r = calcRate / 100 / 12;
    const n = calcMonths;
    let bal = result.p;
    const rows: { month: number; balance: number }[] = [{ month: 0, balance: Math.round(bal) }];
    for (let m = 1; m <= n; m++) {
      const intPmt = bal * r;
      bal = Math.max(0, bal - (result.emi - intPmt));
      rows.push({ month: m, balance: Math.round(bal) });
    }
    return rows;
  }, [result.p, result.emi, calcRate, calcMonths]);

  const interestPct = result.p > 0 ? ((result.totalInterest / result.p) * 100).toFixed(1) : "0";

  const donutData = [
    { name: "Principal", value: Math.round(result.p) },
    { name: "Total Interest", value: Math.round(result.totalInterest) },
  ].filter((d) => d.value > 0);

  // Comparison: same loan at different terms
  const termOptions = [3, 6, 9, 12, 18, 24];
  const comparisonRows = termOptions.map((m) => {
    const r = calcRate / 100 / 12;
    const emi =
      r === 0 ? result.p / m : (result.p * r * Math.pow(1 + r, m)) / (Math.pow(1 + r, m) - 1);
    const totalInterest = emi * m - result.p;
    const isActive = m === calcMonths;
    return {
      label: `${m} months`,
      values: [format(emi), format(totalInterest), format(emi * m)],
      highlight: isActive,
    };
  });

  const amortizationTableRows = balanceSeries.map((row, index) => {
    if (index === 0) return [row.month.toString(), "-", "-", formatPdfUsd(row.balance)];
    // calc interest for this month
    const prevBalance = balanceSeries[index - 1].balance;
    const interest = prevBalance * (calcRate / 100 / 12);
    const principalPaid = result.emi - interest;
    return [
      row.month.toString(),
      formatPdfUsd(principalPaid),
      formatPdfUsd(interest),
      formatPdfUsd(row.balance),
    ];
  });

  const pdfData = hasResult
    ? {
        calculatorName: "Credit Card EMI Calculator",
        calculatorSlug: "credit-card-emi-calculator",
        siteName: PDF_SITE_NAME,
        siteUrl: PDF_SITE_URL,
        inputs: [
          { label: "Purchase Amount", value: formatPdfUsd(calcPrincipal) },
          { label: "Interest Rate", value: `${calcRate}% p.a.` },
          { label: "Tenure", value: `${calcMonths} months` },
        ],
        results: [
          { label: "Monthly EMI", value: formatPdfUsd(result.emi), highlight: true },
          { label: "Total Interest", value: formatPdfUsd(result.totalInterest), highlight: false },
          { label: "Total Payment", value: formatPdfUsd(result.totalPayment), highlight: false },
        ],
        summary: `Your monthly EMI for a ${formatPdfUsd(calcPrincipal)} purchase at ${calcRate}% interest over ${calcMonths} months is ${formatPdfUsd(result.emi)}. In total, you will pay ${formatPdfUsd(result.totalInterest)} in interest.`,
        tableData: {
          title: "AMORTIZATION SCHEDULE (MONTHLY)",
          headers: ["Month", "Principal", "Interest", "Balance"],
          rows: amortizationTableRows,
        },
        chartElementId: "emi-chart",
      }
    : null;

  const isButtonDisabled =
    !principal ||
    !rate ||
    !months ||
    Number(principal) <= 0 ||
    Number(rate) <= 0 ||
    Number(months) <= 0;

  const handleCalculate = () => {
    if (isButtonDisabled) return;
    setCalcPrincipal(Number(principal));
    setCalcRate(Number(rate));
    setCalcMonths(Number(months));
    markCalculated();
  };

  const handleReset = () => {
    setPrincipal(50000);
    setRate(18);
    setMonths(12);
    setCalcPrincipal(50000);
    setCalcRate(18);
    setCalcMonths(12);
    resetCalculated();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isButtonDisabled) handleCalculate();
  };

  const tooltipStyle = {
    contentStyle: {
      background: "var(--color-card)",
      borderColor: "var(--color-border)",
      borderRadius: "8px",
      fontSize: 12,
    },
    labelStyle: { color: "var(--color-foreground)" },
    itemStyle: { color: "var(--color-foreground)" },
  };

  const chartColors = ["var(--color-chart-1)", "var(--color-chart-2)"];

  const blogContent = (
    <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
      <h2>Understanding Credit Card EMIs</h2>
      <p>
        Credit cards offer incredible convenience, but high-interest debt can quickly accumulate if
        balances aren't paid in full each month. To help manage large purchases, many banks allow
        you to convert transactions into <strong>Equated Monthly Installments (EMIs)</strong>.
      </p>
      <p>
        While an EMI structure makes repayment more predictable, it is vital to understand the true
        cost. Unlike no-cost EMIs offered by some merchants, standard credit card EMIs involve
        interest rates that typically range from 12% to 24% per annum.
      </p>

      <h3>How the EMI is Calculated</h3>
      <p>
        The mathematical formula used to calculate a credit card EMI is the standard amortization
        formula:
      </p>
      <blockquote>
        <p>
          <strong>EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)</strong>
        </p>
      </blockquote>
      <p>Where:</p>
      <ul>
        <li>
          <strong>P</strong> = Principal (The purchase amount)
        </li>
        <li>
          <strong>r</strong> = Monthly Interest Rate (Annual Rate / 12 / 100)
        </li>
        <li>
          <strong>n</strong> = Tenure in Months
        </li>
      </ul>
      <p>
        Because interest is calculated on a reducing balance basis, the interest component of your
        EMI decreases each month while the principal component increases. Our calculator visualizes
        this transition over your selected tenure.
      </p>

      <h3>Hidden Costs and Warnings</h3>
      <p>When you opt for a credit card EMI, be aware of additional charges that banks may levy:</p>
      <ul>
        <li>
          <strong>Processing Fees:</strong> Most banks charge a one-time processing fee (often 1% to
          2% of the transaction amount). This increases your effective cost.
        </li>
        <li>
          <strong>Pre-closure Penalties:</strong> If you decide to pay off the balance early, banks
          might charge a foreclosure fee, usually around 2% to 3% of the outstanding principal.
        </li>
        <li>
          <strong>GST on Interest:</strong> In many jurisdictions, Goods and Services Tax (GST) is
          applied to the interest component of the EMI.
        </li>
      </ul>

      <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20 my-6">
        <h4 className="text-destructive font-semibold mt-0">⚠️ Credit Card Debt Warning</h4>
        <p className="mb-0 text-sm">
          Credit card debt is one of the most expensive forms of borrowing. Missing an EMI payment
          can attract hefty late fees and severely impact your credit score. Always ensure you have
          a clear repayment plan before converting purchases to EMIs or carrying a balance.
        </p>
      </div>

      <h3>Example Scenario</h3>
      <p>
        Suppose you purchase a new laptop for <strong>$1,200</strong>. You decide to convert this
        into a 12-month EMI with an interest rate of <strong>18% p.a.</strong>
      </p>
      <ul>
        <li>
          <strong>Principal:</strong> $1,200
        </li>
        <li>
          <strong>Rate:</strong> 18% per annum (1.5% per month)
        </li>
        <li>
          <strong>Tenure:</strong> 12 Months
        </li>
        <li>
          <strong>Monthly EMI:</strong> ~$110.02
        </li>
        <li>
          <strong>Total Interest Paid:</strong> ~$120.24
        </li>
        <li>
          <strong>Total Repayment:</strong> ~$1,320.24
        </li>
      </ul>
      <p>
        By breaking the cost down, you make it more manageable, but you are effectively paying $120
        more for the laptop.
      </p>

      <h3>Tips for Managing Credit Card EMIs</h3>
      <ol>
        <li>
          <strong>Choose the Shortest Tenure:</strong> A longer tenure reduces your monthly EMI but
          significantly increases the total interest paid. Opt for the shortest tenure you can
          comfortably afford.
        </li>
        <li>
          <strong>Compare Options:</strong> Before converting a purchase to an EMI, compare the
          interest rate with personal loan rates. Sometimes a personal loan is cheaper.
        </li>
        <li>
          <strong>Watch Your Credit Limit:</strong> When you convert a purchase to an EMI, your
          available credit limit is reduced by the total outstanding principal. As you pay your
          EMIs, the limit is gradually restored.
        </li>
        <li>
          <strong>Avoid Defaults:</strong> Set up auto-debit for your credit card bills to ensure
          you never miss an EMI payment.
        </li>
      </ol>
      <p>
        By using this calculator, you can effectively plan your finances, ensuring you don't fall
        into a debt trap while enjoying the flexibility that credit cards offer.
      </p>
    </div>
  );

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Estimate your monthly payments, total interest, and the final cost when converting a credit card purchase into EMIs."
      formula={`EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)\nwhere\nP = Purchase Amount\nr = Monthly Interest Rate (Annual Rate ÷ 12)\nn = Tenure in Months`}
      example={`Amount: $1,200, Rate: 18%, Tenure: 12 months.\nMonthly EMI ≈ $110.02\nTotal Interest ≈ $120.24\nTotal Payment ≈ $1,320.24`}
      faqs={[
        {
          q: "What is a credit card EMI?",
          a: "EMI stands for Equated Monthly Installment. It allows you to pay for a large credit card purchase over a set period of months rather than all at once, making it easier to budget.",
        },
        {
          q: "How is credit card EMI interest calculated?",
          a: "Banks use the reducing balance method. The interest for any given month is calculated only on the outstanding principal balance, not the original purchase amount.",
        },
        {
          q: "Are there any hidden charges?",
          a: "Yes, besides the interest rate, banks often charge a one-time processing fee and may apply taxes (like GST) on the interest portion of each EMI.",
        },
        {
          q: "Can I pre-close or pay off my EMI early?",
          a: "Yes, most banks allow pre-closure of EMIs. However, they usually charge a pre-closure or foreclosure fee, which is a percentage of the outstanding principal.",
        },
        {
          q: "Does converting to EMI affect my credit limit?",
          a: "Yes. When you convert a purchase to an EMI, your available credit limit is reduced by the total principal amount. It is gradually restored as you pay off each monthly installment.",
        },
        {
          q: "What happens if I miss an EMI payment?",
          a: "Missing an EMI payment will result in late payment fees, penalty interest, and a negative impact on your credit score.",
        },
        {
          q: "Is it better to choose a shorter or longer tenure?",
          a: "A shorter tenure means higher monthly payments but less total interest paid. A longer tenure lowers your monthly payment but increases the overall cost. Choose the shortest tenure you can comfortably afford.",
        },
        {
          q: "What is a 'No-Cost EMI'?",
          a: "A 'No-Cost EMI' is a promotional offer where the interest charged by the bank is offered as an upfront discount by the merchant, effectively making your total repayment equal to the original purchase price.",
        },
      ]}
      blog={blogContent}
    >
      <CalculatorCurrencyBar />
      <div className="flex flex-col gap-6">
        <div className="calc-input-column">
          <MoneyField
            label="Purchase Amount"
            value={principal as number}
            onChange={(v) => setPrincipal(v)}
          />
          <div className="calc-field-grid-2">
            <NumField
              label="Interest Rate"
              value={rate}
              onChange={(v) => setRate(v)}
              onKeyDown={handleKeyDown}
              suffix="% p.a."
              step={0.5}
            />
            <NumField
              label="Tenure"
              value={months}
              onChange={(v) => setMonths(v)}
              onKeyDown={handleKeyDown}
              suffix="months"
              step={1}
            />
          </div>

          <div className="flex flex-row gap-3 mt-4">
            <CalculateButton
              category="finance"
              className="flex-1 min-h-11"
              disabled={isButtonDisabled}
              onClick={handleCalculate}
            >
              Calculate
            </CalculateButton>
            <Button variant="outline" className="flex-1 min-h-11" onClick={handleReset}>
              Reset
            </Button>
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
              value={format(result.emi)}
              sub={`Total Interest: ${format(result.totalInterest)}`}
              glow="#0ea5e9"
            />

            {/* Key Metrics */}
            <DashboardSection title="Key Metrics">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard index={0} label="Principal" value={format(result.p)} accent="blue" />
                <StatCard
                  index={1}
                  label="Total Interest"
                  value={format(result.totalInterest)}
                  accent="red"
                  badge={`${interestPct}%`}
                />
                <StatCard
                  index={2}
                  label="Total Payment"
                  value={format(result.totalPayment)}
                  accent="amber"
                />
                <StatCard index={3} label="Tenure" value={`${calcMonths} Months`} accent="purple" />
              </div>
            </DashboardSection>

            {/* Charts */}
            <DashboardSection title="Visualization">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  id="emi-chart"
                  className="rounded-xl border border-border/60 bg-card p-4 shadow-soft"
                >
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Cost Breakdown
                  </div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donutData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={50}
                          outerRadius={74}
                          paddingAngle={3}
                        >
                          {donutData.map((_, i) => (
                            <Cell key={i} fill={chartColors[i % chartColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number) => format(v)} {...tooltipStyle} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 bg-card p-4 shadow-soft">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Remaining Balance
                  </div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={balanceSeries}
                        margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                            <stop
                              offset="95%"
                              stopColor="var(--color-chart-1)"
                              stopOpacity={0.03}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis
                          dataKey="month"
                          stroke="var(--color-muted-foreground)"
                          fontSize={10}
                          tickFormatter={(v) => `M${v}`}
                        />
                        <YAxis
                          stroke="var(--color-muted-foreground)"
                          fontSize={10}
                          tickFormatter={formatAxis}
                        />
                        <Tooltip formatter={(v: number) => format(v)} {...tooltipStyle} />
                        <Area
                          type="monotone"
                          dataKey="balance"
                          name="Balance"
                          stroke="var(--color-chart-1)"
                          strokeWidth={2.5}
                          fill="url(#balGrad)"
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </DashboardSection>

            {/* Comparison */}
            <DashboardSection title="Scenario Comparison — Alternative Tenures">
              <ComparisonTable
                headers={["Tenure", "Monthly EMI", "Total Interest", "Total Cost"]}
                rows={comparisonRows}
                highlightColIndex={0}
              />
            </DashboardSection>

            {/* Insights */}
            <DashboardSection title="Smart Insights">
              <div className="flex flex-col gap-2">
                <InsightCard
                  index={0}
                  tone="info"
                  text={`Over ${calcMonths} months, you'll pay ${format(result.totalInterest)} in interest, making your effective total cost ${format(result.totalPayment)}.`}
                />
                <InsightCard
                  index={1}
                  tone="warning"
                  text={`Credit card debt can be expensive. If possible, consider shorter tenures to reduce the total interest paid.`}
                />
              </div>
            </DashboardSection>

            <div className="flex flex-col">
            {pdfData && <CalculatorPdfExport pdfData={pdfData} />}
            </div>
          </motion.div>
        )}
      </div>
    </CalculatorPageLayout>
  );
}

function NumField({
  label,
  value,
  onChange,
  onKeyDown,
  suffix = "",
  step = 1,
}: {
  label: string;
  value: number | "";
  onChange: (n: number | "") => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  suffix?: string;
  step?: number;
}) {
  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="mt-1 relative">
        <Input
          type="number"
          step={step}
          value={value}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val === "" ? "" : Number(val));
          }}
          onKeyDown={onKeyDown}
          className="pr-16"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
