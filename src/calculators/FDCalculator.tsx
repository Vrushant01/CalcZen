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
import { HeroMetric, StatCard, DashboardSection, InsightCard } from "@/components/dashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

export function FDCalculator() {
  const calc = getCalculator("fd-calculator") || {
    name: "Fixed Deposit Calculator",
    description: "Calculate your FD maturity amount and interest earned.",
  };
  const { format, formatAxis } = useCurrency();
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  const [principal, setPrincipal] = useState<number | "">(10000);
  const [rate, setRate] = useState<number | "">(6.5);
  const [years, setYears] = useState<number | "">(5);
  const [months, setMonths] = useState<number | "">(0);
  const [frequency, setFrequency] = useState<string>("4"); // 12=monthly, 4=quarterly, 2=half-yearly, 1=yearly

  const [calcPrincipal, setCalcPrincipal] = useState<number>(10000);
  const [calcRate, setCalcRate] = useState<number>(6.5);
  const [calcYears, setCalcYears] = useState<number>(5);
  const [calcMonths, setCalcMonths] = useState<number>(0);
  const [calcFrequency, setCalcFrequency] = useState<number>(4);

  const result = useMemo(() => {
    const P = calcPrincipal;
    const r = calcRate / 100;
    const t = calcYears + calcMonths / 12;
    const n = calcFrequency;

    if (P <= 0 || t <= 0) {
      return { maturityValue: P, interestEarned: 0, totalInvested: P, totalYears: t };
    }

    const maturityValue = P * Math.pow(1 + r / n, n * t);
    const interestEarned = maturityValue - P;

    return {
      maturityValue,
      interestEarned,
      totalInvested: P,
      totalYears: t,
    };
  }, [calcPrincipal, calcRate, calcYears, calcMonths, calcFrequency]);

  const chartData = [
    { name: "Total Invested", value: Math.round(result.totalInvested) },
    { name: "Interest Earned", value: Math.round(result.interestEarned) },
  ].filter((d) => d.value > 0);

  const COLORS = ["#3b82f6", "#22c55e"];

  // Generate growth chart data
  const growthSeries = useMemo(() => {
    const data = [];
    const P = calcPrincipal;
    const r = calcRate / 100;
    const n = calcFrequency;
    const totalT = result.totalYears;

    const maxYears = Math.ceil(totalT);

    for (let y = 0; y <= maxYears; y++) {
      const currentT = Math.min(y, totalT);
      const balance = P * Math.pow(1 + r / n, n * currentT);
      data.push({
        year: y,
        balance: Math.round(balance),
        invested: P,
      });
      if (currentT === totalT && y !== totalT) {
        break; // we hit the fractional end
      }
    }
    return data;
  }, [calcPrincipal, calcRate, calcFrequency, result.totalYears]);

  const isButtonDisabled =
    !principal ||
    principal <= 0 ||
    !rate ||
    rate <= 0 ||
    (Number(years) === 0 && Number(months) === 0);

  const handleCalculate = () => {
    if (isButtonDisabled) return;
    setCalcPrincipal(Number(principal));
    setCalcRate(Number(rate));
    setCalcYears(Number(years || 0));
    setCalcMonths(Number(months || 0));
    setCalcFrequency(Number(frequency));
    markCalculated();
  };

  const handleReset = () => {
    setPrincipal(10000);
    setRate(6.5);
    setYears(5);
    setMonths(0);
    setFrequency("4");

    setCalcPrincipal(10000);
    setCalcRate(6.5);
    setCalcYears(5);
    setCalcMonths(0);
    setCalcFrequency(4);
    resetCalculated();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isButtonDisabled) handleCalculate();
  };

  const faqs = [
    {
      q: "What is a Fixed Deposit (FD)?",
      a: "A Fixed Deposit (FD) is a financial instrument provided by banks or NBFCs which gives investors a higher rate of interest than a regular savings account, locked until the given maturity date.",
    },
    {
      q: "How is FD interest calculated?",
      a: "FD interest is typically calculated using compound interest formulas. For a cumulative FD, the formula is A = P * (1 + r/n)^(n*t), where A is the maturity amount, P is the principal, r is the annual interest rate, n is the compounding frequency, and t is the time in years.",
    },
    {
      q: "Can I withdraw my FD before maturity?",
      a: "Yes, most banks allow premature withdrawal of FDs, but they usually charge a penalty (typically 0.5% to 1%) and you will earn interest at a lower rate than originally agreed upon when you opened the account.",
    },
    {
      q: "Are FD returns taxable?",
      a: "Yes, the interest earned on Fixed Deposits is fully taxable as per your applicable income tax slab. Financial institutions also deduct TDS (Tax Deducted at Source) if your interest exceeds a specific threshold in a financial year.",
    },
    {
      q: "What is the difference between cumulative and non-cumulative FDs?",
      a: "In a cumulative FD, the interest is reinvested and paid at maturity, offering you the benefit of compounding. In a non-cumulative FD, interest is paid out regularly (e.g., monthly or quarterly) to provide a steady income stream.",
    },
    {
      q: "Is my money safe in a Fixed Deposit?",
      a: "Yes, FDs are considered one of the safest investment options available. In many regions, a deposit insurance scheme guarantees your principal and interest up to a certain limit per bank in case of bank failure.",
    },
    {
      q: "Does compounding frequency matter?",
      a: "Absolutely. The more frequently interest is compounded (e.g., monthly versus yearly), the higher your effective yield will be because you earn interest on previously earned interest more often.",
    },
    {
      q: "How can I maximize my FD returns?",
      a: "To maximize returns, look for banks offering the highest rates, use a 'laddering' strategy by dividing your capital across multiple FDs with different maturities, and opt for cumulative FDs to leverage the power of compounding.",
    },
  ];

  const freqLabels: Record<number, string> = {
    12: "Monthly",
    4: "Quarterly",
    2: "Half-Yearly",
    1: "Yearly",
  };

  const pdfData = hasResult
    ? {
        calculatorName: "Fixed Deposit Calculator",
        calculatorSlug: "fd-calculator",
        siteName: PDF_SITE_NAME,
        siteUrl: PDF_SITE_URL,
        inputs: [
          { label: "Principal Amount", value: formatPdfUsd(calcPrincipal) },
          { label: "Interest Rate", value: `${calcRate}% p.a.` },
          { label: "Duration", value: `${calcYears} Years, ${calcMonths} Months` },
          { label: "Compounding Frequency", value: freqLabels[calcFrequency] },
        ],
        results: [
          { label: "Maturity Value", value: formatPdfUsd(result.maturityValue), highlight: true },
          { label: "Total Invested", value: formatPdfUsd(result.totalInvested), highlight: false },
          {
            label: "Total Interest Earned",
            value: formatPdfUsd(result.interestEarned),
            highlight: false,
          },
        ],
        summary: `By investing ${formatPdfUsd(calcPrincipal)} at an interest rate of ${calcRate}% p.a. compounded ${freqLabels[calcFrequency].toLowerCase()} for ${calcYears} years and ${calcMonths} months, you will earn ${formatPdfUsd(result.interestEarned)} in interest. Your total maturity value will be ${formatPdfUsd(result.maturityValue)}.`,
        chartElementId: "fd-growth-chart",
      }
    : null;

  const blogContent = (
    <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
      <h2>Understanding Fixed Deposits (FDs)</h2>
      <p>
        A <strong>Fixed Deposit (FD)</strong> is one of the most reliable, secure, and popular
        financial instruments available to investors today. Offered by banks, non-banking
        financial companies (NBFCs), and post offices, an FD allows you to deposit a lump sum
        amount for a predefined period, ranging from a few days to several years. In return,
        the financial institution guarantees a fixed rate of interest, which is typically
        higher than what you would earn in a regular savings account.
      </p>
      <p>
        Because the interest rate is locked in at the time of opening the FD, your investment
        is shielded from market fluctuations. This makes Fixed Deposits an excellent choice
        for risk-averse individuals who prioritize the safety of their capital while seeking a
        steady, predictable return over time.
      </p>

      <h3>How Does the FD Calculator Work?</h3>
      <p>
        Our FD Calculator is designed to instantly compute the maturity amount and the total
        interest you will earn on your deposit. It eliminates complex manual math and provides
        you with an accurate projection of your financial growth. The calculator takes into
        account the following key inputs:
      </p>
      <ul>
        <li>
          <strong>Principal Amount:</strong> The initial lump sum you wish to invest.
        </li>
        <li>
          <strong>Interest Rate:</strong> The annual percentage rate offered by the bank or
          financial institution.
        </li>
        <li>
          <strong>Duration (Tenure):</strong> The length of time your money will remain
          invested, which you can input in years and months.
        </li>
        <li>
          <strong>Compounding Frequency:</strong> How often the interest is added to your
          principal (e.g., monthly, quarterly, half-yearly, or yearly). The more frequently it
          compounds, the higher your overall returns.
        </li>
      </ul>

      <h3>The Formula Behind FD Calculations</h3>
      <p>
        When dealing with cumulative Fixed Deposits (where the interest is reinvested), the
        maturity amount is calculated using the compound interest formula:
      </p>
      <div className="bg-muted p-4 rounded-lg overflow-x-auto text-center font-mono text-lg my-4">
        A = P × (1 + r/n)<sup>n×t</sup>
      </div>
      <p>Where:</p>
      <ul>
        <li>
          <strong>A</strong> = Maturity Amount (Total value at the end of the term)
        </li>
        <li>
          <strong>P</strong> = Principal Amount (Initial investment)
        </li>
        <li>
          <strong>r</strong> = Annual Interest Rate (expressed as a decimal, e.g., 6.5% =
          0.065)
        </li>
        <li>
          <strong>n</strong> = Number of times the interest is compounded per year
        </li>
        <li>
          <strong>t</strong> = Total tenure in years
        </li>
      </ul>
      <p>
        <strong>Example:</strong> Suppose you invest $10,000 for 5 years at an interest rate
        of 6.5% p.a., compounded quarterly (n = 4).
      </p>
      <ul>
        <li>A = 10,000 × (1 + 0.065 / 4)<sup>4 × 5</sup></li>
        <li>A = 10,000 × (1 + 0.01625)<sup>20</sup></li>
        <li>A = 10,000 × (1.3804)</li>
        <li>A ≈ $13,804.20</li>
      </ul>
      <p>
        In this scenario, your interest earned over the 5 years would be $3,804.20.
      </p>

      <h3>Key Benefits of Investing in FDs</h3>
      <p>
        Fixed deposits hold a prominent place in many investment portfolios for several
        reasons:
      </p>
      <ol>
        <li>
          <strong>Guaranteed Returns:</strong> Unlike equity investments, the returns on an FD
          are fixed and unaffected by market volatility. You know exactly how much you will
          receive at maturity.
        </li>
        <li>
          <strong>Capital Protection:</strong> FDs are highly secure, especially when opened
          with reputable banks. Many countries also provide deposit insurance (e.g., up to
          $250,000 via FDIC in the US or ₹5 lakh via DICGC in India) which further protects
          your principal.
        </li>
        <li>
          <strong>Flexible Tenures:</strong> You can choose a tenure that aligns with your
          financial goals, whether it’s a short-term 6-month deposit for an upcoming vacation
          or a 10-year deposit for long-term wealth preservation.
        </li>
        <li>
          <strong>Loan Against FD:</strong> In times of financial emergencies, you can quickly
          secure a loan or an overdraft facility against your FD, typically up to 90% of the
          deposit amount, at a marginally higher interest rate than the FD itself.
        </li>
      </ol>

      <h3>Tax Implications on FD Returns</h3>
      <p>
        It is crucial to understand that the interest earned on Fixed Deposits is not
        tax-free. It is categorized as "Income from Other Sources" and is fully taxable
        according to your applicable income tax slab. Additionally, banks are mandated to
        deduct Tax Deducted at Source (TDS) if your interest income exceeds a certain
        threshold in a financial year. However, if your total income is below the taxable
        limit, you can submit specific declarations (like Form 15G or 15H in India) to prevent
        the bank from deducting TDS.
      </p>

      <h3>Strategies for Maximizing FD Returns</h3>
      <p>
        While FDs are straightforward, implementing the right strategies can optimize your
        yields:
      </p>
      <ul>
        <li>
          <strong>Laddering Strategy:</strong> Instead of locking all your funds into a single
          FD, split your capital across multiple FDs with varying maturities (e.g., 1 year, 2
          years, 3 years). This ensures regular liquidity and allows you to reinvest at higher
          rates if interest rates rise in the future.
        </li>
        <li>
          <strong>Opt for Cumulative FDs:</strong> If you do not need a regular income stream,
          choose the cumulative option. The interest generated is continually added back to
          the principal, allowing you to benefit immensely from the power of compounding.
        </li>
        <li>
          <strong>Compare Rates:</strong> Interest rates can vary significantly between large
          commercial banks, smaller community banks, and NBFCs. Always compare rates before
          investing. Note that higher rates from lesser-known entities might carry slightly
          more risk.
        </li>
        <li>
          <strong>Senior Citizen Benefits:</strong> In many countries, banks offer a premium
          of 0.50% to 0.75% over regular FD rates to senior citizens. Ensure you avail of
          these benefits if applicable.
        </li>
      </ul>
      <p>
        By leveraging our FD Calculator, you can strategically plan your investments, evaluate
        different scenarios, and build a robust, low-risk foundation for your financial
        future.
      </p>
    </div>
  );

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Calculate your FD maturity amount and interest earned. Compare compounding frequencies and see how your fixed deposits grow over time."
      faqs={faqs}
      blog={blogContent}
    >
      <CalculatorCurrencyBar />
      
      <div className="flex flex-col gap-6">
        <div className="calc-input-column">
          <MoneyField
            id="principal"
            label="Principal Amount"
            value={principal}
            onChange={setPrincipal}
          />

          <div className="calc-field-grid-2">
            <NumField
              label="Interest Rate"
              value={rate}
              onChange={(v) => setRate(v)}
              onKeyDown={handleKeyDown}
              suffix="%"
              step={0.1}
            />

            <div className="grid grid-cols-2 gap-2">
              <NumField
                label="Years"
                value={years}
                onChange={(v) => setYears(v)}
                onKeyDown={handleKeyDown}
              />
              <NumField
                label="Months"
                value={months}
                onChange={(v) => setMonths(v)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="frequency" className="text-xs font-medium text-muted-foreground">
              Compounding Frequency
            </Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger id="frequency" className="mt-1">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">Monthly</SelectItem>
                <SelectItem value="4">Quarterly</SelectItem>
                <SelectItem value="2">Half-Yearly</SelectItem>
                <SelectItem value="1">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-row gap-3 mt-4">
            <CalculateButton
              category="finance"
              className="flex-1 min-h-11"
              onClick={handleCalculate}
              disabled={isButtonDisabled}
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
              label="Maturity Value"
              value={format(result.maturityValue)}
              sub={`Invested: ${format(result.totalInvested)} · Interest: ${format(result.interestEarned)}`}
              glow="#10b981"
            />

            {/* Key Metrics */}
            <DashboardSection title="Maturity Summary">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <StatCard
                  index={0}
                  label="Total Invested"
                  value={format(result.totalInvested)}
                  accent="blue"
                />
                <StatCard
                  index={1}
                  label="Interest Earned"
                  value={format(result.interestEarned)}
                  accent="green"
                  subValue={`${((result.interestEarned / result.maturityValue) * 100).toFixed(0)}% of maturity value`}
                />
                <StatCard
                  index={2}
                  label="Absolute Return"
                  value={`${((result.interestEarned / result.totalInvested) * 100).toFixed(1)}%`}
                  accent="purple"
                />
              </div>
            </DashboardSection>

            {/* Breakup & Growth Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DashboardSection title="Investment Breakup">
                <div className="rounded-xl border border-border/60 bg-card p-4 shadow-soft">
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(val: number) => format(val)}
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid var(--color-border)",
                            background: "var(--color-card)",
                            color: "var(--color-foreground)",
                          }}
                        />
                        <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </DashboardSection>

              <DashboardSection title="Growth Over Time">
                <div id="fd-growth-chart" className="rounded-xl border border-border/60 bg-card p-4 shadow-soft">
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={growthSeries}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="var(--color-border)"
                        />
                        <XAxis
                          dataKey="year"
                          stroke="var(--color-muted-foreground)"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(val) => `Year ${val}`}
                        />
                        <YAxis
                          stroke="var(--color-muted-foreground)"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={formatAxis}
                        />
                        <Tooltip
                          formatter={(val: number) => format(val)}
                          labelFormatter={(label) => `Year ${label}`}
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid var(--color-border)",
                            background: "var(--color-card)",
                            color: "var(--color-foreground)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="balance"
                          name="Balance"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorBalance)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </DashboardSection>
            </div>

            {/* Smart Insights */}
            <DashboardSection title="Smart Insights">
              <div className="flex flex-col gap-2">
                <InsightCard
                  index={0}
                  tone="info"
                  text={`Your initial investment of ${format(calcPrincipal)} will grow to ${format(result.maturityValue)} over ${calcYears} years and ${calcMonths} months.`}
                />
                <InsightCard
                  index={1}
                  tone="success"
                  text={`You are earning a total interest of ${format(result.interestEarned)}, which is an absolute return of ${((result.interestEarned / calcPrincipal) * 100).toFixed(1)}% on your principal.`}
                />
                <InsightCard
                  index={2}
                  tone="tip"
                  text="Locking in your FD when interest rates are peaking ensures higher returns over the long term, regardless of future rate cuts."
                />
              </div>
            </DashboardSection>

            {/* PDF Export */}
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
