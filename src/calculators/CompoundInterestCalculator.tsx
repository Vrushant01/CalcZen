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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import {
  HeroMetric,
  StatCard,
  DashboardSection,
  InsightCard,
  ComparisonTable,
  RecommendationList,
} from "@/components/dashboard";

export function CompoundInterestCalculator() {
  const calc = getCalculator("compound-interest-calculator")!;
  const { format, formatAxis } = useCurrency();
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  const [principal, setPrincipal] = useState<number | "">(10000);
  const [monthly, setMonthly] = useState<number | "">(500);
  const [rate, setRate] = useState<number | "">(8);
  const [years, setYears] = useState<number | "">(20);

  const [calcPrincipal, setCalcPrincipal] = useState<number>(10000);
  const [calcMonthly, setCalcMonthly] = useState<number>(500);
  const [calcRate, setCalcRate] = useState<number>(8);
  const [calcYears, setCalcYears] = useState<number>(20);

  const { series, total, contributed, earned } = useMemo(() => {
    const r = calcRate / 100 / 12;
    const n = calcYears * 12;
    let bal = calcPrincipal;
    let contrib = calcPrincipal;
    const series: { year: number; balance: number; contributed: number; earned: number }[] = [
      { year: 0, balance: bal, contributed: contrib, earned: 0 },
    ];
    for (let m = 1; m <= n; m++) {
      bal = bal * (1 + r) + calcMonthly;
      contrib += calcMonthly;
      if (m % 12 === 0)
        series.push({
          year: m / 12,
          balance: Math.round(bal),
          contributed: Math.round(contrib),
          earned: Math.round(bal - contrib),
        });
    }
    return { series, total: bal, contributed: contrib, earned: bal - contrib };
  }, [calcPrincipal, calcMonthly, calcRate, calcYears]);

  const multiplier = contributed > 0 ? (total / contributed).toFixed(2) : "0";
  const cagr =
    calcYears > 0
      ? ((Math.pow(total / Math.max(contributed, 1), 1 / calcYears) - 1) * 100).toFixed(2)
      : "0";
  const rule72 = calcRate > 0 ? (72 / calcRate).toFixed(1) : "—";

  const fiveYearsEarlier = useMemo(() => {
    if (calcYears <= 5) return 0;
    const r = calcRate / 100 / 12;
    const n = (calcYears - 5) * 12;
    let bal = calcPrincipal;
    for (let m = 1; m <= n; m++) bal = bal * (1 + r) + calcMonthly;
    return Math.max(0, total - bal);
  }, [calcPrincipal, calcMonthly, calcRate, calcYears, total]);

  // Comparison at different rates
  const rateOptions = [4, 6, 8, 10, 12];
  const comparisonRows = rateOptions.map((r) => {
    const mr = r / 100 / 12;
    const n = calcYears * 12;
    let bal = calcPrincipal;
    let c = calcPrincipal;
    for (let m = 1; m <= n; m++) {
      bal = bal * (1 + mr) + calcMonthly;
      c += calcMonthly;
    }
    const isActive = r === calcRate;
    return {
      label: `${r}% annual return`,
      values: [format(bal), format(bal - c), `${(bal / c).toFixed(2)}x`],
      highlight: isActive,
    };
  });

  const pdfData = hasResult
    ? {
        calculatorName: "Compound Interest Calculator",
        calculatorSlug: "compound-interest-calculator",
        siteName: PDF_SITE_NAME,
        siteUrl: PDF_SITE_URL,
        inputs: [
          { label: "Initial Principal", value: formatPdfUsd(calcPrincipal) },
          { label: "Monthly Contribution", value: formatPdfUsd(calcMonthly) },
          { label: "Annual Return", value: `${calcRate}%` },
          { label: "Time Horizon", value: `${calcYears} years` },
          { label: "Compounding", value: "Monthly" },
        ],
        results: [
          { label: "Final Balance", value: formatPdfUsd(total), highlight: true },
          { label: "Total Contributed", value: formatPdfUsd(contributed), highlight: false },
          { label: "Total Interest Earned", value: formatPdfUsd(earned), highlight: false },
          { label: "Growth Multiplier", value: `${multiplier}x`, highlight: false },
        ],
        summary: `Your ${formatPdfUsd(calcPrincipal)} investment grows to ${formatPdfUsd(total)} over ${calcYears} years — a gain of ${formatPdfUsd(earned)} from compound interest alone. Your money is effectively multiplying ${multiplier}x. Starting just 5 years earlier would result in approximately ${formatPdfUsd(fiveYearsEarlier)} more at the same rate.`,
        chartElementId: "compound-chart",
      }
    : null;

  const isButtonDisabled =
    principal === "" ||
    monthly === "" ||
    rate === "" ||
    years === "" ||
    Number(principal) < 0 ||
    Number(monthly) < 0 ||
    Number(rate) <= 0 ||
    Number(years) <= 0;

  const handleCalculate = () => {
    if (isButtonDisabled) return;
    setCalcPrincipal(Number(principal));
    setCalcMonthly(Number(monthly));
    setCalcRate(Number(rate));
    setCalcYears(Number(years));
    markCalculated();
  };

  const handleReset = () => {
    setPrincipal(10000);
    setMonthly(500);
    setRate(8);
    setYears(20);
    setCalcPrincipal(10000);
    setCalcMonthly(500);
    setCalcRate(8);
    setCalcYears(20);
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

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Watch your savings grow with compound interest. Set an initial amount, monthly contribution, expected annual return and time horizon to see your future balance."
      formula={`Future Value = P(1 + r)^n + PMT × [((1 + r)^n − 1) / r]\nwhere\nP = initial principal\nPMT = monthly contribution\nr = monthly rate (annual rate ÷ 12)\nn = number of months`}
      example={`Start with $10,000, add $500/month, earn 8%/yr for 20 years.\nFinal balance ≈ $355,000.\nYou contributed $130,000; ~$225,000 came from compounding.`}
      faqs={[
        {
          q: "What is compound interest?",
          a: "Compound interest is the addition of interest to the principal sum of a deposit or loan, where interest earns interest on itself. This compounding effect causes your investments to grow exponentially over time, especially when compared to simple interest. It is a vital cornerstone of long-term financial planning and wealth creation.",
        },
        {
          q: "How does compound frequency affect investment growth?",
          a: 'Compound frequency refers to how often accumulated interest is calculated and added to the principal balance. The more frequently interest compounds (e.g., daily or monthly instead of annually), the faster your wealth accumulates. You can calculate other borrowing scenarios with our <a href="/calculator/loan-emi-calculator" class="text-primary hover:underline">Loan EMI Calculator</a> to compare debt amortization schedules.',
        },
        {
          q: "What is the difference between simple and compound interest?",
          a: "Simple interest is calculated solely on the initial principal amount invested. Compound interest is calculated on the initial principal plus all interest accumulated from previous periods. Over long horizons, this compounding difference creates a massive divergence in total savings growth, making compounding far superior for your long-term wealth building and retirement security.",
        },
        {
          q: "How does inflation affect my compound returns?",
          a: "Inflation erodes the purchasing power of your money over time, meaning a dollar today buys less in the future. When evaluating long-term investment projections, you must subtract the inflation rate from your nominal yield to find the real rate of return and avoid overestimating the future purchasing power of your accumulated savings.",
        },
        {
          q: "Can I calculate future value with monthly contributions?",
          a: 'Yes, our calculator lets you model monthly or annual contributions alongside your initial principal. Regular contributions accelerate the compounding process, as interest is immediately earned on the new deposits. You can check percentage-based budget allocations with our <a href="/calculator/percentage-calculator" class="text-primary hover:underline">Percentage Calculator</a> to optimize your monthly savings goals and track regular investment growth.',
        },
        {
          q: "What is the Rule of 72?",
          a: "The Rule of 72 is a quick, handy mental formula used to estimate how many years it will take for an investment to double at a fixed annual rate of interest. Simply divide 72 by your annual interest rate. For example, at a 6% return, your money doubles in about 12 years.",
        },
        {
          q: "Why is starting early so important for compound growth?",
          a: "Starting early is critical because compounding interest relies heavily on time. In the initial years, growth is slow, but in later decades, the exponential curve bends sharply upward. A delay of just five years early in life can cut your final retirement nest egg in half, showing how costly procrastination is.",
        },
        {
          q: "How does compound interest relate to retirement planning?",
          a: 'Retirement planning relies on compounding interest to build a nest egg large enough to support you without working. By consistently saving over your career, your contributions build a self-sustaining asset. Estimate your retirement targets and contribution matches with our dedicated <a href="/calculator/retirement-calculator" class="text-primary hover:underline">Retirement Calculator</a> to secure your long-term future.',
        },
      ]}
      blog={<CalculatorBlog content={blogContent.compound} />}
    >
      <CalculatorCurrencyBar />
      <div className="flex flex-col gap-6">
        <div className="calc-input-column">
          <MoneyField label="Initial amount" value={principal} onChange={(v) => setPrincipal(v)} />
          <MoneyField
            label="Monthly contribution"
            value={monthly}
            onChange={(v) => setMonthly(v)}
          />
          <div className="calc-field-grid-2">
            <NumField
              label="Annual return"
              value={rate}
              onChange={(v) => setRate(v)}
              onKeyDown={handleKeyDown}
              suffix="%"
              step={0.1}
            />
            <NumField
              label="Years"
              value={years}
              onChange={(v) => setYears(v)}
              onKeyDown={handleKeyDown}
              suffix="yr"
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
              label="Final Balance"
              value={format(total)}
              sub={`After ${calcYears} years of compounding monthly at ${calcRate}% annual return`}
              glow="#0ea5e9"
            />

            {/* Key Metrics */}
            <DashboardSection title="Key Metrics">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard
                  index={0}
                  label="Total Contributed"
                  value={format(contributed)}
                  accent="blue"
                />
                <StatCard
                  index={1}
                  label="Interest Earned"
                  value={format(earned)}
                  accent="green"
                  subValue={`${((earned / total) * 100).toFixed(0)}% of final balance`}
                />
                <StatCard
                  index={2}
                  label="Growth Multiplier"
                  value={`${multiplier}×`}
                  accent="purple"
                />
                <StatCard index={3} label="Effective CAGR" value={`${cagr}%`} accent="cyan" />
                <StatCard
                  index={4}
                  label="Money Doubles Every"
                  value={`${rule72} yrs`}
                  accent="amber"
                  subValue="Rule of 72"
                />
                <StatCard
                  index={5}
                  label="5 Yrs Earlier = +"
                  value={fiveYearsEarlier > 0 ? format(fiveYearsEarlier) : "N/A"}
                  accent="green"
                />
              </div>
            </DashboardSection>

            {/* Chart */}
            <DashboardSection title="Growth Projection">
              <div
                id="compound-chart"
                className="rounded-xl border border-border/60 bg-card p-4 shadow-soft"
              >
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={series} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.04} />
                        </linearGradient>
                        <linearGradient id="contribGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0.04} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis
                        dataKey="year"
                        stroke="var(--color-muted-foreground)"
                        fontSize={11}
                        tickFormatter={(v) => `${v}y`}
                      />
                      <YAxis
                        stroke="var(--color-muted-foreground)"
                        fontSize={11}
                        tickFormatter={formatAxis}
                      />
                      <Tooltip formatter={(v: number) => format(v)} {...tooltipStyle} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Area
                        type="monotone"
                        dataKey="balance"
                        name="Balance"
                        stroke="var(--color-chart-1)"
                        strokeWidth={2.5}
                        fill="url(#balGrad)"
                        dot={false}
                      />
                      <Area
                        type="monotone"
                        dataKey="contributed"
                        name="Contributed"
                        stroke="var(--color-chart-2)"
                        strokeWidth={2}
                        fill="url(#contribGrad)"
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </DashboardSection>

            {/* Comparison */}
            <DashboardSection title="Scenario Comparison — Annual Return Rates">
              <ComparisonTable
                headers={["Rate", "Final Balance", "Interest Earned", "Multiplier"]}
                rows={comparisonRows}
                highlightColIndex={0}
              />
            </DashboardSection>

            {/* Insights */}
            <DashboardSection title="Smart Insights">
              <div className="flex flex-col gap-2">
                <InsightCard
                  index={0}
                  tone="success"
                  text={`At ${calcRate}% return, your money doubles approximately every ${rule72} years (Rule of 72). Over ${calcYears} years, it has multiplied ${multiplier}×.`}
                />
                <InsightCard
                  index={1}
                  tone="info"
                  text={`Interest makes up ${((earned / total) * 100).toFixed(0)}% of your final balance — compound growth contributed ${format(earned)} with no additional effort.`}
                />
                {fiveYearsEarlier > 0 && (
                  <InsightCard
                    index={2}
                    tone="tip"
                    text={`Starting just 5 years earlier with the same contributions would add approximately ${format(fiveYearsEarlier)} to your final balance — the power of time in compounding.`}
                  />
                )}
              </div>
            </DashboardSection>

            {/* Recommendations */}
            <DashboardSection title="Recommendations">
              <RecommendationList
                items={[
                  {
                    title: "Automate monthly contributions",
                    description: `Your ${format(calcMonthly)}/month contribution is the engine of your wealth. Automate it so you never miss a month — consistency beats timing every time.`,
                  },
                  {
                    title: "Consider tax-advantaged accounts",
                    description:
                      "Placing investments in 401(k), IRA, or similar tax-sheltered accounts lets compounding work on money that would otherwise go to taxes.",
                  },
                  {
                    title: "Increase contribution with income",
                    description:
                      "A 1% salary increase put into investments adds significantly over decades. Revisit your contribution rate every year or when your income rises.",
                  },
                ]}
              />
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
  suffix,
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
          className={suffix ? "pr-10" : ""}
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
