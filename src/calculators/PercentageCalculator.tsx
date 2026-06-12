import { useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog from "@/components/CalculatorBlog";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { blogContent } from "@/data/blogContent";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalculateButton } from "@/components/CalculateButton";
import { PDF_SITE_NAME, PDF_SITE_URL } from "@/constants/pdfBrand";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell,
} from "recharts";
import { motion } from "framer-motion";
import {
  HeroMetric, StatCard, DashboardSection, InsightCard,
  RecommendationList,
} from "@/components/dashboard";

export function PercentageCalculator() {
  const calc = getCalculator("percentage-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  const [a, setA] = useState<number | "">(15);
  const [b, setB] = useState<number | "">(200);
  const [x, setX] = useState<number | "">(50);
  const [y, setY] = useState<number | "">(80);
  const [from, setFrom] = useState<number | "">(100);
  const [to, setTo] = useState<number | "">(125);

  const [calcA, setCalcA] = useState<number>(15);
  const [calcB, setCalcB] = useState<number>(200);
  const [calcX, setCalcX] = useState<number>(50);
  const [calcY, setCalcY] = useState<number>(80);
  const [calcFrom, setCalcFrom] = useState<number>(100);
  const [calcTo, setCalcTo] = useState<number>(125);

  const r1 = (calcA / 100) * calcB;
  const r2 = calcY === 0 ? 0 : (calcX / calcY) * 100;
  const r3 = calcFrom === 0 ? 0 : ((calcTo - calcFrom) / calcFrom) * 100;
  const r3IsPositive = r3 >= 0;

  // Chart 1: portion vs whole
  const portionData = [
    { name: `${calcA}% portion`, value: Math.abs(r1), fill: "var(--color-chart-1)" },
    { name: "Remainder", value: Math.abs(calcB - r1), fill: "var(--color-border)" },
  ];

  // Chart 2: before vs after for percent change
  const changeData = [
    { name: "Before", value: calcFrom, fill: "var(--color-chart-2)" },
    { name: "After", value: calcTo, fill: r3IsPositive ? "var(--color-chart-3)" : "var(--color-chart-5)" },
  ];

  const pdfData = hasResult
    ? {
        calculatorName: "Percentage Calculator",
        calculatorSlug: "percentage-calculator",
        siteName: PDF_SITE_NAME,
        siteUrl: PDF_SITE_URL,
        inputs: [
          { label: "X% of Y", value: `${calcA}% of ${calcB}` },
          { label: "X is what % of Y", value: `${calcX} of ${calcY}` },
          { label: "Percent change", value: `${calcFrom} → ${calcTo}` },
        ],
        results: [
          { label: "X% of Y", value: r1.toLocaleString("en-US"), highlight: true },
          { label: "X is what % of Y", value: `${r2.toFixed(2)}%`, highlight: false },
          { label: "Percent change", value: `${r3 >= 0 ? "+" : ""}${r3.toFixed(2)}%`, highlight: false },
        ],
        summary: `${calcA}% of ${calcB} is ${r1.toLocaleString("en-US")}. ${calcX} is ${r2.toFixed(2)}% of ${calcY}. The change from ${calcFrom} to ${calcTo} is a ${r3 >= 0 ? "+" : ""}${r3.toFixed(2)}% ${r3 >= 0 ? "increase" : "decrease"}.`,
      }
    : null;

  const isButtonDisabled = a === "" || b === "" || x === "" || y === "" || from === "" || to === "";

  const handleCalculate = () => {
    if (isButtonDisabled) return;
    setCalcA(Number(a)); setCalcB(Number(b)); setCalcX(Number(x));
    setCalcY(Number(y)); setCalcFrom(Number(from)); setCalcTo(Number(to));
    markCalculated();
  };

  const handleReset = () => {
    setA(15); setB(200); setX(50); setY(80); setFrom(100); setTo(125);
    setCalcA(15); setCalcB(200); setCalcX(50); setCalcY(80); setCalcFrom(100); setCalcTo(125);
    resetCalculated();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !isButtonDisabled) handleCalculate(); };

  const tooltipStyle = {
    contentStyle: { background: "var(--color-card)", borderColor: "var(--color-border)", borderRadius: "8px", fontSize: 12 },
    labelStyle: { color: "var(--color-foreground)" },
    itemStyle: { color: "var(--color-foreground)" },
  };

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Three quick percentage calculators in one: find a percent of a number, see what percent one number is of another, or measure the percent change between two values."
      formula={`Percent of: result = (a ÷ 100) × b\nIs what percent: result = (x ÷ y) × 100\nPercent change: result = ((new − old) ÷ old) × 100`}
      example={`15% of 200 = 30.\n50 is what % of 80 = 62.5%.\nChange from 100 to 125 = +25%.`}
      faqs={[
        { q: "How do I calculate percentage increase?", a: "To calculate percentage increase, subtract the original starting value from the new final value, divide the difference by the original starting value, and then multiply the final result by 100. This calculation determines the relative rate of growth between two numbers over a specific calendar period or business reporting cycle effectively." },
        { q: "How do I calculate discounts?", a: "To calculate a discount, multiply the original price of the item by the discount percentage rate, then divide by 100 to find the discount amount. Subtract this discount amount from the original price to determine the final sale price. This is extremely useful for everyday shopping, expense reduction, and household budgeting." },
        { q: "What is percentage difference?", a: "Percentage difference measures the relative difference between two separate values when there is no direction of change or starting value. It is calculated by dividing the absolute difference between the two numbers by their average, then multiplying by 100 to express the final comparison value as a percentage metric clearly for the user." },
        { q: "Can I calculate sales tax?", a: "Yes, you can calculate sales tax by multiplying the purchase price of your items by the local sales tax rate, then dividing by 100. Adding this calculated tax amount to the purchase price gives your total final cost. You can calculate gratuity offsets in dining bills using our <a href=\"/calculator/tip-calculator\" class=\"text-primary hover:underline\">Tip Calculator</a>." },
        { q: "How do markups work?", a: "A markup is the amount added to the wholesale cost of a product to determine its retail price. It is calculated by multiplying the cost by the markup percentage. Markups ensure a retail sale generates enough gross margin to cover operating expenses and business profitability, which is essential for retail growth." },
        { q: "What is the difference between percentage change and percentage points?", a: "Percentage change measures the relative difference between two numbers, while percentage points measure the absolute difference between two percentage values. For example, if an interest rate climbs from 5% to 6%, it represents a 1 percentage point increase, but a 20% relative percentage increase in the rate. Understanding this difference is critical for interpreting financial data correctly." },
        { q: "Why do consecutive discounts not add up directly?", a: "Consecutive discounts do not add up directly because the second discount applies to the already-reduced price, not to the original baseline price. Therefore, a 20% discount followed by a 10% discount equals a 28% total reduction, not a 30% reduction. Run compounding growth models with our <a href=\"/calculator/compound-interest-calculator\" class=\"text-primary hover:underline\">Compound Interest Calculator</a>." },
        { q: "How can percentage math help with personal debt management?", a: "Percentage calculations help you compare interest rates on credit cards and bank loans. Understanding the percentage rates of interest lets you allocate extra funds toward paying down the debt with the highest rate, which reduces overall borrowing costs. Check your monthly payments with our <a href=\"/calculator/loan-emi-calculator\" class=\"text-primary hover:underline\">Loan EMI Calculator</a>." }
      ]}
      blog={<CalculatorBlog content={blogContent.percentage} />}
    >
      <div className="flex flex-col gap-6">
        <div className="calc-input-column space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-muted/30 p-4 flex flex-col justify-between">
              <h3 className="text-sm font-semibold mb-3">What is X% of Y?</h3>
              <div className="grid grid-cols-2 gap-2">
                <F label="X (%)" value={a} onChange={setA} onKeyDown={handleKeyDown} />
                <F label="Y" value={b} onChange={setB} onKeyDown={handleKeyDown} />
              </div>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4 flex flex-col justify-between">
              <h3 className="text-sm font-semibold mb-3">X is what % of Y?</h3>
              <div className="grid grid-cols-2 gap-2">
                <F label="X" value={x} onChange={setX} onKeyDown={handleKeyDown} />
                <F label="Y" value={y} onChange={setY} onKeyDown={handleKeyDown} />
              </div>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4 flex flex-col justify-between">
              <h3 className="text-sm font-semibold mb-3">Percent change</h3>
              <div className="grid grid-cols-2 gap-2">
                <F label="From" value={from} onChange={setFrom} onKeyDown={handleKeyDown} />
                <F label="To" value={to} onChange={setTo} onKeyDown={handleKeyDown} />
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-3 mt-4">
            <CalculateButton category="math" className="flex-1 min-h-11" disabled={isButtonDisabled} onClick={handleCalculate}>Calculate</CalculateButton>
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
            {/* 3 Hero Results */}
            <DashboardSection title="Results">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <HeroMetric
                  label={`${calcA}% of ${calcB}`}
                  value={r1.toLocaleString()}
                  sub={`${calcA}% portion of ${calcB}`}
                  glow="#8b5cf6"
                />
                <HeroMetric
                  label={`${calcX} is what % of ${calcY}?`}
                  value={`${r2.toFixed(2)}%`}
                  sub={`${calcX} represents ${r2.toFixed(2)}% of ${calcY}`}
                  glow="#0ea5e9"
                />
                <HeroMetric
                  label={`Change: ${calcFrom} → ${calcTo}`}
                  value={`${r3 >= 0 ? "+" : ""}${r3.toFixed(2)}%`}
                  badge={{ text: r3 >= 0 ? "Increase" : "Decrease", color: r3 >= 0 ? "green" : "red" }}
                  sub={`Absolute change: ${r3IsPositive ? "+" : ""}${(calcTo - calcFrom).toLocaleString()}`}
                  glow={r3IsPositive ? "#10b981" : "#ef4444"}
                />
              </div>
            </DashboardSection>

            {/* Derived Stats */}
            <DashboardSection title="Derived Metrics">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard index={0} label={`${calcA}% portion`} value={r1.toLocaleString()} accent="purple" />
                <StatCard index={1} label={`Remainder (${100 - calcA}%)`} value={(calcB - r1).toLocaleString()} accent="default" />
                <StatCard index={2} label="Proportion ratio" value={`${calcX}:${calcY - calcX}`} accent="blue" subValue={`${r2.toFixed(1)}% : ${(100 - r2).toFixed(1)}%`} />
                <StatCard index={3} label="Percent change" value={`${r3 >= 0 ? "+" : ""}${r3.toFixed(2)}%`} accent={r3IsPositive ? "green" : "red"} />
                <StatCard index={4} label="Absolute change" value={`${r3IsPositive ? "+" : ""}${(calcTo - calcFrom).toLocaleString()}`} accent={r3IsPositive ? "green" : "red"} />
                <StatCard index={5} label="Growth factor" value={calcFrom !== 0 ? `${(calcTo / calcFrom).toFixed(3)}×` : "—"} accent="amber" />
              </div>
            </DashboardSection>

            {/* Charts */}
            <DashboardSection title="Visual Breakdown">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Portion chart */}
                <div className="rounded-xl border border-border/60 bg-card p-4 shadow-soft">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{calcA}% Portion vs Whole</div>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={portionData} layout="vertical" margin={{ top: 4, right: 40, left: 4, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
                        <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                        <Tooltip {...tooltipStyle} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {portionData.map((entry, i) => (
                            <Cell key={i} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Before/after chart */}
                <div className="rounded-xl border border-border/60 bg-card p-4 shadow-soft">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Before vs After ({r3 >= 0 ? "+" : ""}{r3.toFixed(1)}%)</div>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={changeData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                        <YAxis tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
                        <Tooltip {...tooltipStyle} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {changeData.map((entry, i) => (
                            <Cell key={i} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </DashboardSection>

            {/* Insights */}
            <DashboardSection title="Smart Insights">
              <div className="flex flex-col gap-2">
                <InsightCard index={0} tone="info"
                  text={`${calcA}% of ${calcB} equals ${r1.toLocaleString()} — leaving a remainder of ${(calcB - r1).toLocaleString()} (${(100 - calcA).toFixed(0)}%).`} />
                <InsightCard index={1} tone="info"
                  text={`${calcX} represents ${r2.toFixed(2)}% of ${calcY}. In other words, the ratio is approximately ${calcX} to ${calcY - calcX} (${r2.toFixed(1)}% to ${(100 - r2).toFixed(1)}%).`} />
                <InsightCard index={2} tone={r3IsPositive ? "success" : "warning"}
                  text={`The change from ${calcFrom} to ${calcTo} is a ${r3 >= 0 ? "+" : ""}${r3.toFixed(2)}% ${r3IsPositive ? "increase" : "decrease"} — the value ${r3IsPositive ? "grew" : "dropped"} by ${Math.abs(calcTo - calcFrom).toLocaleString()} (growth factor: ${calcFrom !== 0 ? (calcTo / calcFrom).toFixed(3) : "N/A"}×).`} />
              </div>
            </DashboardSection>

            {/* Recommendations */}
            <DashboardSection title="Use Cases & Tips">
              <RecommendationList items={[
                { title: "Calculating discounts", description: `To find 20% off a $${calcB} item: ${calcA === 20 ? `${r1.toLocaleString()} off, final price ${(calcB - r1).toLocaleString()}` : `use 'X% of Y' with X=20 and Y=price`}. Always apply discounts sequentially, not additively.` },
                { title: "Tracking growth metrics", description: `Use percent change for any metric that evolves over time — revenue, followers, weight, test scores. A ${r3 >= 0 ? "+" : ""}${r3.toFixed(1)}% change from ${calcFrom} to ${calcTo} can now be tracked consistently.` },
                { title: "Understanding percentages vs percentage points", description: "A rate going from 5% to 6% is a 1 percentage point increase, but a 20% relative increase. Always clarify which you mean in professional contexts." },
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

function F({ label, value, onChange, onKeyDown }: {
  label: string; value: number | ""; onChange: (n: number | "") => void; onKeyDown?: (e: React.KeyboardEvent) => void;
}) {
  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Input type="number" value={value}
        onChange={(e) => { const val = e.target.value; onChange(val === "" ? "" : Number(val)); }}
        onKeyDown={onKeyDown} className="mt-1" />
    </div>
  );
}
