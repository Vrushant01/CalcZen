import React, { useState, useMemo } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { CalculatorCurrencyBar } from "@/components/CurrencySelector";
import { MoneyField } from "@/components/MoneyField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CalculateButton } from "@/components/CalculateButton";
import { Button } from "@/components/ui/button";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { useCurrency } from "@/hooks/use-currency";
import { formatPdfUsd } from "@/utils/formatPdfUsd";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import CalculatorBlog, { type BlogContent } from "@/components/CalculatorBlog";
import { motion } from "framer-motion";
import {
  HeroMetric,
  StatCard,
  DashboardSection,
  InsightCard,
} from "@/components/dashboard";

export function InflationCalculator() {
  const calc = getCalculator("inflation-calculator")!;
  const { format, formatAxis } = useCurrency();
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  const [amount, setAmount] = useState<number | "">(10000);
  const [rate, setRate] = useState<number | "">(3.5);
  const [years, setYears] = useState<number | "">(10);

  const [calcAmount, setCalcAmount] = useState<number>(10000);
  const [calcRate, setCalcRate] = useState<number>(3.5);
  const [calcYears, setCalcYears] = useState<number>(10);

  const result = useMemo(() => {
    const a = calcAmount;
    const r = calcRate / 100;
    const y = calcYears;

    const futureCost = a * Math.pow(1 + r, y);
    const purchasingPower = a / Math.pow(1 + r, y);
    const loss = a - purchasingPower;

    const chartData = [];
    for (let i = 0; i <= y; i++) {
      chartData.push({
        year: i,
        futureCost: Math.round(a * Math.pow(1 + r, i)),
        purchasingPower: Math.round(a / Math.pow(1 + r, i)),
      });
    }

    return { futureCost, purchasingPower, loss, chartData };
  }, [calcAmount, calcRate, calcYears]);

  const handleCalculate = () => {
    setCalcAmount(Number(amount) || 0);
    setCalcRate(Number(rate) || 0);
    setCalcYears(Number(years) || 0);
    markCalculated();
  };

  const handleReset = () => {
    setAmount(10000);
    setRate(3.5);
    setYears(10);
    setCalcAmount(10000);
    setCalcRate(3.5);
    setCalcYears(10);
    resetCalculated();
  };

  const isButtonDisabled = !amount || !rate || !years || Number(amount) <= 0 || Number(years) <= 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isButtonDisabled) handleCalculate();
  };

  const pdfData = hasResult ? {
    calculatorName: "Inflation Calculator",
    calculatorSlug: "inflation-calculator",
    siteName: "CalcZen",
    siteUrl: "https://calczen.com",
    inputs: [
      { label: "Current Amount", value: formatPdfUsd(calcAmount) },
      { label: "Inflation Rate", value: `${calcRate}%` },
      { label: "Time Period", value: `${calcYears} years` },
    ],
    results: [
      { label: "Future Cost", value: formatPdfUsd(result.futureCost), highlight: true },
      { label: "Purchasing Power", value: formatPdfUsd(result.purchasingPower), highlight: false },
      { label: "Purchasing Power Loss", value: formatPdfUsd(result.loss), highlight: false },
    ],
    summary: `At a ${calcRate}% inflation rate over ${calcYears} years, your ${formatPdfUsd(calcAmount)} will require ${formatPdfUsd(result.futureCost)} to have the same purchasing power. Meanwhile, ${formatPdfUsd(calcAmount)} kept in cash will lose ${formatPdfUsd(result.loss)} in value.`,
    chartElementId: "inflation-chart",
  } : null;

  const faqs = [
    {
      q: "What is inflation?",
      a: "Inflation is the rate at which the general level of prices for goods and services is rising, and, subsequently, purchasing power is falling. Central banks attempt to limit inflation, and avoid deflation, in order to keep the economy running smoothly.",
    },
    {
      q: "How does inflation affect my savings?",
      a: "Inflation decreases the purchasing power of money over time. If your savings account earns a 1% interest rate but inflation is at 3%, the real value of your savings is decreasing by roughly 2% per year.",
    },
    {
      q: "What is the difference between Future Cost and Purchasing Power?",
      a: "Future Cost tells you how much money you will need in the future to buy something that costs a certain amount today. Purchasing Power tells you how much a specific amount of money today will be worth in the future, measured in today's goods.",
    },
    {
      q: "What is considered a 'normal' inflation rate?",
      a: "Historically, central banks like the U.S. Federal Reserve have targeted an inflation rate of about 2% per year. This is considered a healthy rate for economic growth without eroding purchasing power too quickly.",
    },
    {
      q: "How can I protect my money from inflation?",
      a: "Investing in assets that traditionally outpace inflation, such as stocks, real estate, or Treasury Inflation-Protected Securities (TIPS), can help preserve and grow your purchasing power over time.",
    },
    {
      q: "Does inflation affect all goods equally?",
      a: "No, inflation rates can vary widely between different sectors. For example, healthcare and education costs have historically risen much faster than the general inflation rate, while the cost of electronics has often decreased.",
    },
    {
      q: "What causes inflation?",
      a: "Inflation can be caused by demand-pull (when demand exceeds supply), cost-push (when production costs increase), and built-in inflation (wage-price spirals). Increases in the money supply can also drive inflation.",
    },
    {
      q: "Can inflation be negative?",
      a: "Yes, negative inflation is called deflation. While it sounds good for consumers initially because prices drop, prolonged deflation can lead to severe economic problems, such as reduced spending, lower wages, and higher unemployment.",
    },
  ];

  const tooltipStyle = {
    contentStyle: { background: "var(--color-card)", borderColor: "var(--color-border)", borderRadius: "8px", fontSize: 12 },
    labelStyle: { color: "var(--color-foreground)" },
    itemStyle: { color: "var(--color-foreground)" },
  };

  const inflationBlogContent: BlogContent = {
    primaryKeyword: "inflation",
    category: "Economics & Finance",
    introText: "Inflation is the gradual decline of purchasing power of a given currency over time. A quantitative estimate of the rate at which the decline in purchasing power occurs can be reflected in the increase of an average price level of a basket of selected goods and services in an economy over some period of time. Our Inflation Calculator helps you visualize exactly how this economic phenomenon impacts your hard-earned money.",
    sections: [
      {
        title: "How Inflation Affects Purchasing Power",
        paragraphs: [
          "This tool uses standard compound interest formulas in reverse to calculate the future value and the erosion of purchasing power. There are two primary perspectives when dealing with inflation:",
          "<strong>Future Cost:</strong> This answers the question: \"If an item costs $10,000 today, how much will the exact same item cost in 10 years?\" If inflation averages 3.5% per year, you will need more dollars to buy that same item.",
          "<strong>Purchasing Power:</strong> This answers the question: \"If I hide $10,000 under my mattress today, what will it be worth in 10 years?\" Because prices rise, your static $10,000 buys fewer goods and services in the future."
        ]
      },
      {
        title: "The Inflation Formula",
        paragraphs: [
          "To calculate the Future Cost of an item currently priced at P, with an annual inflation rate of r over t years, we use a simple compounding formula.",
          "Similarly, to calculate the future Purchasing Power of an amount P held today, we use the inverse formula."
        ],
        formulaBox: {
          title: "Inflation Formulas",
          formula: "Future Cost = P × (1 + r)^t\nPurchasing Power = P / (1 + r)^t",
          variables: [
            { name: "P", desc: "Current amount" },
            { name: "r", desc: "Annual inflation rate (expressed as a decimal, e.g. 0.035 for 3.5%)" },
            { name: "t", desc: "Time period in years" }
          ]
        }
      },
      {
        title: "Real World Example",
        paragraphs: [
          "Let's look at a realistic scenario where you are considering keeping your money in cash versus investing it. Imagine you place $50,000 in a safe in your home, intending to use it for a down payment on a house in 15 years."
        ],
        exampleBox: {
          title: "Purchasing Power Loss Calculation",
          inputs: [
            { name: "Current Amount", val: "$50,000" },
            { name: "Annual Inflation Rate", val: "4%" },
            { name: "Time Period", val: "15 Years" }
          ],
          steps: [
            "Convert the annual inflation rate to a decimal: r = 0.04.",
            "Calculate the denominator: (1 + 0.04)^15 ≈ 1.8009.",
            "Apply the formula: Purchasing Power = $50,000 / 1.8009."
          ],
          result: "The purchasing power of your $50,000 drops to just <strong>$27,763</strong>. You have essentially lost <strong>$22,237</strong> of value simply by not investing the money to pace with or beat inflation."
        }
      }
    ]
  };

  return (
    <CalculatorPageLayout 
      calc={calc} 
      faqs={faqs}
      intro="Understand how inflation erodes your purchasing power over time. Use this calculator to project the future cost of goods or determine the future value of your current cash."
      formula={`Future Cost = P × (1 + r)^n\nPurchasing Power = P / (1 + r)^n\nwhere:\nP = Current amount\nr = Annual inflation rate\nn = Time period in years`}
      example={`Suppose an item costs $10,000 today. If inflation averages 3.5% per year for 10 years:\nFuture Cost = $10,000 × (1 + 0.035)^10 = $14,105.99\nThis means you will need $14,106 in 10 years to buy what $10,000 buys today.`}
      blog={<CalculatorBlog content={inflationBlogContent} />}
    >
      <CalculatorCurrencyBar />
      <div className="flex flex-col gap-6">
        <div className="calc-input-column">
          <MoneyField label="Current Amount" value={amount} onChange={(v) => setAmount(v)} />
          <div className="calc-field-grid-2">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Inflation Rate (%)</Label>
              </div>
              <Input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value === "" ? "" : Number(e.target.value))}
                onKeyDown={handleKeyDown}
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Years</Label>
              </div>
              <Input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value === "" ? "" : Number(e.target.value))}
                onKeyDown={handleKeyDown}
              />
            </div>
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
              label={`Future Cost in ${calcYears} Years`}
              value={format(result.futureCost)}
              sub={`Purchasing Power of Today's Money: ${format(result.purchasingPower)}`}
              glow="#ef4444"
            />

            <DashboardSection title="Inflation Impact">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard
                  index={0}
                  label={`Future Cost in ${calcYears} Years`}
                  value={format(result.futureCost)}
                  accent="red"
                />
                <StatCard
                  index={1}
                  label="Purchasing Power"
                  value={format(result.purchasingPower)}
                  accent="green"
                />
                <StatCard
                  index={2}
                  label="Value Lost"
                  value={format(result.loss)}
                  accent="amber"
                />
                <StatCard
                  index={3}
                  label="Inflation Impact %"
                  value={`${((result.loss / calcAmount) * 100).toFixed(2)}%`}
                  accent="purple"
                />
              </div>
            </DashboardSection>

            <DashboardSection title="Value Trajectory Over Time">
              <div id="inflation-chart" className="rounded-xl border border-border/60 bg-card p-4 shadow-soft">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorFuture" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
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
                        dataKey="futureCost"
                        name="Future Cost"
                        stroke="#ef4444"
                        fillOpacity={1}
                        fill="url(#colorFuture)"
                      />
                      <Area
                        type="monotone"
                        dataKey="purchasingPower"
                        name="Purchasing Power"
                        stroke="#22c55e"
                        fillOpacity={1}
                        fill="url(#colorPower)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </DashboardSection>

            {/* Insights */}
            <DashboardSection title="Smart Insights">
              <div className="flex flex-col gap-2">
                <InsightCard
                  index={0}
                  tone="warning"
                  text={`Over ${calcYears} years at ${calcRate}%, your money loses ${result.impactPct}% of its value. To preserve purchasing power, your investments must yield an after-tax return higher than ${calcRate}%.`}
                />
                <InsightCard
                  index={1}
                  tone="info"
                  text={`What costs ${format(calcAmount)} today will cost ${format(result.futureCost)} in ${calcYears} years due to compounding inflation.`}
                />
                <InsightCard
                  index={2}
                  tone="tip"
                  text="Consider investing in inflation-beating assets like equities, real estate, or inflation-indexed bonds to protect your wealth's true value over time."
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

export default InflationCalculator;
