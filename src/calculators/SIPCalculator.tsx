import React, { useMemo, useState } from "react";
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

export function SIPCalculator() {
  const calc = getCalculator("sip-calculator");
  const { format, formatAxis } = useCurrency();
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  const [monthly, setMonthly] = useState<number | "">(500);
  const [rate, setRate] = useState<number | "">(12);
  const [years, setYears] = useState<number | "">(10);

  const [calcMonthly, setCalcMonthly] = useState<number>(500);
  const [calcRate, setCalcRate] = useState<number>(12);
  const [calcYears, setCalcYears] = useState<number>(10);

  const { series, total, invested, earned } = useMemo(() => {
    const r = calcRate / 100 / 12;
    const n = calcYears * 12;
    let bal = 0;
    let contrib = 0;
    const series: { year: number; balance: number; invested: number; earned: number }[] = [
      { year: 0, balance: 0, invested: 0, earned: 0 },
    ];
    for (let m = 1; m <= n; m++) {
      bal = (bal + calcMonthly) * (1 + r);
      contrib += calcMonthly;
      if (m % 12 === 0) {
        series.push({
          year: m / 12,
          balance: Math.round(bal),
          invested: Math.round(contrib),
          earned: Math.round(bal - contrib),
        });
      }
    }
    return { series, total: bal, invested: contrib, earned: bal - contrib };
  }, [calcMonthly, calcRate, calcYears]);

  const multiplier = invested > 0 ? (total / invested).toFixed(2) : "0";

  // Comparison at different rates
  const rateOptions = [
    Math.max(1, calcRate - 4),
    Math.max(2, calcRate - 2),
    calcRate,
    calcRate + 2,
    calcRate + 4,
  ];
  // Remove duplicates just in case
  const uniqueRates = Array.from(new Set(rateOptions)).sort((a, b) => a - b);

  const comparisonRows = uniqueRates.map((r) => {
    const mr = r / 100 / 12;
    const n = calcYears * 12;
    let bal = 0;
    let c = 0;
    for (let m = 1; m <= n; m++) {
      bal = (bal + calcMonthly) * (1 + mr);
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
        calculatorName: "SIP Calculator",
        calculatorSlug: "sip-calculator",
        siteName: PDF_SITE_NAME,
        siteUrl: PDF_SITE_URL,
        inputs: [
          { label: "Monthly Investment", value: formatPdfUsd(calcMonthly) },
          { label: "Expected Annual Return", value: `${calcRate}%` },
          { label: "Investment Duration", value: `${calcYears} years` },
        ],
        results: [
          { label: "Total Value", value: formatPdfUsd(total), highlight: true },
          { label: "Total Invested Amount", value: formatPdfUsd(invested), highlight: false },
          {
            label: "Estimated Returns (Wealth Gained)",
            value: formatPdfUsd(earned),
            highlight: false,
          },
          { label: "Wealth Multiplier", value: `${multiplier}x`, highlight: false },
        ],
        summary: `By investing ${formatPdfUsd(calcMonthly)} monthly over ${calcYears} years at an expected return of ${calcRate}%, your total invested amount of ${formatPdfUsd(invested)} will grow to an estimated ${formatPdfUsd(total)}. You will earn approximately ${formatPdfUsd(earned)} in returns, multiplying your wealth by ${multiplier} times.`,
        chartElementId: "sip-chart",
      }
    : null;

  const isButtonDisabled =
    monthly === "" ||
    rate === "" ||
    years === "" ||
    Number(monthly) <= 0 ||
    Number(rate) <= 0 ||
    Number(years) <= 0;

  const handleCalculate = () => {
    if (isButtonDisabled) return;
    setCalcMonthly(Number(monthly));
    setCalcRate(Number(rate));
    setCalcYears(Number(years));
    markCalculated();
  };

  const handleReset = () => {
    setMonthly(500);
    setRate(12);
    setYears(10);
    setCalcMonthly(500);
    setCalcRate(12);
    setCalcYears(10);
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

  if (!calc) {
    return (
      <div>
        Calculator configuration missing. Ensure 'sip-calculator' exists in data/calculators.ts
      </div>
    );
  }

  const blogContent = (
    <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
      <h2>The Ultimate Guide to Systematic Investment Plans (SIP)</h2>
      <p>
        A <strong>Systematic Investment Plan (SIP)</strong> is one of the most powerful
        wealth-creation tools available to modern investors. By allowing you to invest a fixed
        amount of money at regular intervals—typically monthly—SIPs instill financial discipline and
        help you harness the magic of compound interest without having to time the market.
      </p>
      <p>
        Whether you're saving for a down payment on a house, planning for a child's education, or
        building a robust nest egg for the future, understanding how an SIP works is fundamental to
        achieving your financial goals.
      </p>

      <h3>How Does an SIP Work?</h3>
      <p>
        When you set up an SIP, a predetermined amount is automatically deducted from your bank
        account and invested into a mutual fund, ETF, or stock portfolio of your choice. This
        automated approach ensures that you consistently buy into the market regardless of its daily
        fluctuations.
      </p>
      <p>
        Over time, this strategy allows you to benefit from <strong>Rupee-Cost Averaging</strong>{" "}
        (or Dollar-Cost Averaging). When the market is high, your fixed investment buys fewer units.
        Conversely, when the market is low, the same fixed amount buys more units. Over the long
        run, this averages out the cost of your investments and mitigates the impact of short-term
        market volatility.
      </p>

      <h3>The SIP Formula: Unveiling the Math</h3>
      <p>
        The projected future value of an SIP is based on the formula for the future value of an
        annuity due. Since investments are typically made at the beginning of each period, the
        formula is:
      </p>
      <div className="bg-muted p-4 rounded-lg overflow-x-auto">
        <p className="font-mono text-sm whitespace-pre">
          FV = P × [((1 + r)<sup>n</sup> - 1) / r] × (1 + r)
        </p>
      </div>
      <p>Where:</p>
      <ul>
        <li>
          <strong>FV</strong> = Future Value (Total maturity amount)
        </li>
        <li>
          <strong>P</strong> = Periodic investment amount (Monthly SIP amount)
        </li>
        <li>
          <strong>r</strong> = Periodic interest rate (Annual expected return ÷ 12)
        </li>
        <li>
          <strong>n</strong> = Total number of installments (Years × 12)
        </li>
      </ul>

      <h3>The Power of Compounding</h3>
      <p>
        Albert Einstein famously called compound interest the "eighth wonder of the world." In an
        SIP, your returns start earning their own returns. The longer you stay invested, the more
        pronounced this compounding effect becomes.
      </p>
      <p>
        In the initial years, the wealth generated might seem modest. However, as decades pass, the
        compounding curve steepens dramatically. This is why starting early—even with a small
        amount—is far more effective than waiting to invest larger amounts later in life.
      </p>

      <h3>SIP vs. Lump Sum vs. Fixed Deposits</h3>
      <p>
        A common dilemma for investors is choosing between an SIP, a lump sum investment, or a
        traditional{" "}
        <a href="/calculator/compound-interest-calculator" className="text-primary hover:underline">
          Fixed Deposit (FD)
        </a>
        .
      </p>
      <p>
        While an FD provides guaranteed returns, the interest rates often struggle to outpace{" "}
        <a href="/calculator/percentage-calculator" className="text-primary hover:underline">
          inflation
        </a>
        , leading to a loss of purchasing power over time. An SIP in equity mutual funds carries
        market risk but historically offers significantly higher inflation-adjusted returns.
      </p>
      <p>
        Lump sum investments require you to have a large amount of capital upfront and expose you to
        the risk of investing exactly at a market peak. SIPs spread this risk out, making them ideal
        for salaried individuals with steady monthly cash flows.
      </p>

      <h3>Real-World Example Projection</h3>
      <p>
        Let's say you invest <strong>$500 per month</strong> for <strong>20 years</strong> in an
        index fund that yields an expected annual return of <strong>10%</strong>.
      </p>
      <ul>
        <li>
          <strong>Total Invested:</strong> $500 × 12 months × 20 years = <strong>$120,000</strong>
        </li>
        <li>
          <strong>Wealth Gained (Interest):</strong> ~$262,848
        </li>
        <li>
          <strong>Final Total Value:</strong> ~$382,848
        </li>
      </ul>
      <p>
        In this scenario, your earnings from compound interest are more than double the amount you
        actually invested out of pocket! This is a prime example of how SIPs are instrumental for
        robust{" "}
        <a href="/calculator/retirement-calculator" className="text-primary hover:underline">
          Retirement
        </a>{" "}
        planning.
      </p>

      <h3>Tips for a Successful SIP Journey</h3>
      <ul>
        <li>
          <strong>Start Now:</strong> Time is your greatest asset. Delaying your SIP by even a few
          years can drastically reduce your final corpus.
        </li>
        <li>
          <strong>Step-Up Your SIP:</strong> As your income grows, increase your monthly
          contribution by a small percentage (e.g., 5% to 10% annually). A "Step-Up SIP" combats
          inflation and accelerates wealth building.
        </li>
        <li>
          <strong>Stay Disciplined:</strong> Do not pause or stop your SIP during market downturns.
          Bear markets are when your fixed investment buys the most units, setting you up for
          massive gains when the market recovers.
        </li>
        <li>
          <strong>Review Annually:</strong> Check your portfolio once a year to ensure your funds
          are performing in line with expectations, but avoid making impulsive changes based on
          short-term news.
        </li>
      </ul>

      <h3>Conclusion</h3>
      <p>
        A Systematic Investment Plan is not just a financial product; it is a habit of discipline.
        By consistently channeling a portion of your income into growth-oriented assets, you build a
        sturdy financial foundation that can weather economic storms and ultimately secure your
        financial freedom. Use our SIP Calculator above to experiment with different monthly
        contributions and time horizons, and take the first step towards realizing your financial
        dreams today.
      </p>
    </div>
  );

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Calculate the future value of your systematic investment plan. See how consistent monthly investments and the power of compounding can grow your wealth over time."
      formula={`Future Value = P × [((1 + r)^n - 1) / r] × (1 + r)\nwhere\nP = Monthly Investment\nr = Monthly Return Rate (Annual Rate ÷ 12)\nn = Total Number of Months`}
      example={`Invest $500/month at 12% annual return for 10 years.\nTotal Invested: $60,000\nEstimated Returns: $56,170\nTotal Value: $116,170`}
      faqs={[
        {
          q: "What is an SIP?",
          a: "A Systematic Investment Plan (SIP) is a method of investing a fixed sum regularly in a mutual fund scheme. SIPs allow you to buy units on a given date each month, helping you implement a steady saving habit.",
        },
        {
          q: "How is an SIP different from a lump sum investment?",
          a: "An SIP involves investing smaller amounts at regular intervals, which averages out the purchase cost and reduces market timing risk. A lump sum involves investing a large amount all at once, which can be riskier if the market happens to be at a peak.",
        },
        {
          q: "What is the minimum amount required to start an SIP?",
          a: "Most mutual fund houses allow you to start an SIP with an amount as low as $10 or $50 per month, making it highly accessible for beginners and students.",
        },
        {
          q: "Can I pause or stop my SIP anytime?",
          a: "Yes, SIPs are highly flexible. You can pause, modify the amount, or cancel your SIP entirely at any time without any penalties. You can also withdraw your accumulated funds subject to exit loads and tax rules.",
        },
        {
          q: "How does inflation impact my SIP returns?",
          a: 'Inflation decreases the purchasing power of money over time. To get a true picture of your wealth creation, you must consider the \'real rate of return\' which is the expected SIP return minus the inflation rate. Read more about inflation impacts on our <a href="/calculator/compound-interest-calculator" class="text-primary hover:underline">Compound Interest Calculator</a> page.',
        },
        {
          q: "What happens if I miss an SIP installment?",
          a: "If you miss an installment due to insufficient funds, the mutual fund company simply skips that month's investment. However, your bank may charge you a penalty for auto-debit failure. Your existing investments will continue to grow undisturbed.",
        },
        {
          q: "How does SIP compare to an FD (Fixed Deposit)?",
          a: "FDs offer guaranteed returns but generally lower interest rates. Equity SIPs do not guarantee returns and are subject to market risks, but historically they have provided significantly higher, inflation-beating returns over long periods (7-10+ years).",
        },
        {
          q: "Can an SIP help with my retirement planning?",
          a: 'Absolutely. Due to the power of compounding over decades, SIPs are one of the most effective ways to build a massive retirement corpus. You can use our <a href="/calculator/retirement-calculator" class="text-primary hover:underline">Retirement Calculator</a> to figure out exactly how much you need to SIP today for a comfortable tomorrow.',
        },
      ]}
      blog={blogContent}
    >
      <CalculatorCurrencyBar />
      <div className="flex flex-col gap-6">
        <div className="calc-input-column">
          <MoneyField label="Monthly Investment" value={monthly} onChange={(v) => setMonthly(v)} />
          <div className="calc-field-grid-2">
            <NumField
              label="Expected Return"
              value={rate}
              onChange={(v) => setRate(v)}
              onKeyDown={handleKeyDown}
              suffix="%"
              step={0.1}
            />
            <NumField
              label="Investment Duration"
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
              label="Total Value"
              value={format(total)}
              sub={`After ${calcYears} years of monthly investments at ${calcRate}% expected return`}
              glow="#10b981"
            />

            {/* Key Metrics */}
            <DashboardSection title="Investment Summary">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <StatCard
                  index={0}
                  label="Total Invested Amount"
                  value={format(invested)}
                  accent="blue"
                />
                <StatCard
                  index={1}
                  label="Estimated Returns"
                  value={format(earned)}
                  accent="green"
                  subValue={`${((earned / total) * 100).toFixed(0)}% of total value`}
                />
                <StatCard
                  index={2}
                  label="Wealth Multiplier"
                  value={`${multiplier}×`}
                  accent="purple"
                />
              </div>
            </DashboardSection>

            {/* Chart */}
            <DashboardSection title="Wealth Accumulation Over Time">
              <div
                id="sip-chart"
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
                        name="Total Value"
                        stroke="var(--color-chart-1)"
                        strokeWidth={2.5}
                        fill="url(#balGrad)"
                        dot={false}
                      />
                      <Area
                        type="monotone"
                        dataKey="invested"
                        name="Invested Amount"
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
            <DashboardSection title="Expected Returns Scenarios">
              <ComparisonTable
                headers={["Annual Return", "Total Value", "Wealth Gained", "Multiplier"]}
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
                  text={`Over ${calcYears} years, your disciplined investment of ${format(invested)} is projected to multiply by ${multiplier} times.`}
                />
                <InsightCard
                  index={1}
                  tone="info"
                  text={`Your estimated returns of ${format(earned)} represent ${((earned / total) * 100).toFixed(0)}% of the final corpus, demonstrating the heavy lifting done by compound interest.`}
                />
              </div>
            </DashboardSection>

            {/* Recommendations */}
            <DashboardSection title="Recommendations">
              <RecommendationList
                items={[
                  {
                    title: "Increase your SIP annually",
                    description:
                      "Consider stepping up your monthly contribution by 5-10% every year as your income grows to combat inflation and build a larger corpus.",
                  },
                  {
                    title: "Don't pause during market dips",
                    description:
                      "When markets are down, your fixed SIP amount buys more units at a cheaper price (Rupee Cost Averaging). Keep it running!",
                  },
                  {
                    title: "Link SIP to a goal",
                    description:
                      "Align this SIP with a specific life goal, such as a child's education or your retirement, to maintain the discipline to stay invested.",
                  },
                ]}
              />
            </DashboardSection>

            <div className="flex flex-col">
              <CalculatorPdfExport pdfData={pdfData} />
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
