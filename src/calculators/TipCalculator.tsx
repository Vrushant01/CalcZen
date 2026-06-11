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
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell, LabelList,
} from "recharts";
import { motion } from "framer-motion";
import {
  HeroMetric, StatCard, DashboardSection, InsightCard,
  ComparisonTable, RecommendationList,
} from "@/components/dashboard";

function tipLabel(pct: number): string {
  if (pct >= 25) return "exceptional";
  if (pct >= 20) return "generous";
  if (pct >= 15) return "standard";
  return "below standard";
}

function tipBadgeColor(pct: number): "green" | "blue" | "amber" | "red" {
  if (pct >= 25) return "green";
  if (pct >= 20) return "green";
  if (pct >= 15) return "blue";
  return "red";
}

export function TipCalculator() {
  const calc = getCalculator("tip-calculator")!;
  const { format } = useCurrency();
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  const [bill, setBill] = useState<number | "">(60);
  const [tip, setTip] = useState<number | "">(18);
  const [people, setPeople] = useState<number | "">(2);

  const [calcBill, setCalcBill] = useState<number>(60);
  const [calcTip, setCalcTip] = useState<number>(18);
  const [calcPeople, setCalcPeople] = useState<number>(2);

  const r = useMemo(() => {
    const tipAmt = (calcBill * calcTip) / 100;
    const total = calcBill + tipAmt;
    const per = calcPeople > 0 ? total / calcPeople : total;
    const tipPer = calcPeople > 0 ? tipAmt / calcPeople : tipAmt;
    const billPer = calcPeople > 0 ? calcBill / calcPeople : calcBill;
    return { tipAmt, total, per, tipPer, billPer };
  }, [calcBill, calcTip, calcPeople]);

  const tipQuality = tipLabel(calcTip);
  const tipBadge = tipBadgeColor(calcTip);

  // Bar chart: bill+tip at preset percentages
  const tipBarData = [10, 15, 18, 20, 25].map((pct) => {
    const tipAmt = (calcBill * pct) / 100;
    return { name: `${pct}%`, bill: Math.round(calcBill), tip: Math.round(tipAmt), total: Math.round(calcBill + tipAmt) };
  });
  const activeTotal = Math.round(r.total);

  // Comparison: split across different number of people
  const peopleOptions = [1, 2, 3, 4, 5, 6];
  const comparisonRows = peopleOptions.map((n) => ({
    label: `${n} ${n === 1 ? "person" : "people"}`,
    values: [format(r.total / n), format(r.tipAmt / n), format(calcBill / n)],
    highlight: n === calcPeople,
  }));

  const pdfData = hasResult && calcBill > 0
    ? {
        calculatorName: "Tip Calculator",
        calculatorSlug: "tip-calculator",
        siteName: PDF_SITE_NAME,
        siteUrl: PDF_SITE_URL,
        inputs: [
          { label: "Bill Amount", value: formatPdfUsd(calcBill) },
          { label: "Tip Percentage", value: `${calcTip}%` },
          { label: "Number of People", value: String(calcPeople) },
        ],
        results: [
          { label: "Total Per Person", value: formatPdfUsd(r.per), highlight: true },
          { label: "Tip Amount", value: formatPdfUsd(r.tipAmt), highlight: false },
          { label: "Total Bill", value: formatPdfUsd(r.total), highlight: false },
          { label: "Each Person's Tip", value: formatPdfUsd(r.tipPer), highlight: false },
        ],
        summary: `A ${calcTip}% tip on a ${formatPdfUsd(calcBill)} bill is ${formatPdfUsd(r.tipAmt)}, bringing the total to ${formatPdfUsd(r.total)}. Split ${calcPeople} ways, each person pays ${formatPdfUsd(r.per)}. This is considered a ${tipQuality} tip for restaurant service in the USA.`,
      }
    : null;

  const isButtonDisabled = bill === "" || tip === "" || people === "" || Number(bill) <= 0 || Number(tip) < 0 || Number(people) <= 0;

  const handleCalculate = () => {
    if (isButtonDisabled) return;
    setCalcBill(Number(bill)); setCalcTip(Number(tip)); setCalcPeople(Number(people));
    markCalculated();
  };

  const handleReset = () => {
    setBill(60); setTip(18); setPeople(2);
    setCalcBill(60); setCalcTip(18); setCalcPeople(2);
    resetCalculated();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !isButtonDisabled) handleCalculate(); };

  const tooltipStyle = {
    contentStyle: { background: "var(--color-card)", borderColor: "var(--color-border)", borderRadius: "8px", fontSize: 12 },
    labelStyle: { color: "var(--color-foreground)" },
    itemStyle: { color: "var(--color-foreground)" },
  };

  const barColors = ["#94a3b8", "#60a5fa", "#a78bfa", "#34d399", "#fbbf24"];

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Quickly figure out how much to tip and how to split the bill evenly. Pick a tip percentage or enter your own."
      formula={`Tip amount = bill × tip% ÷ 100\nTotal bill = bill + tip\nPer person = total ÷ people`}
      example={`$60 bill with 18% tip split between 2 people.\nTip = $10.80, total = $70.80, $35.40 per person.`}
      faqs={[
        { q: "What's a standard tip in the US?", a: "15–20% is typical for sit-down service. 18% is the most common default." },
        { q: "Should I tip on tax?", a: "It's customary to tip on the pre-tax amount, but tipping on the total is also common and appreciated." },
        { q: "How do I split a bill unevenly?", a: "Add up each person's items first, apply the tip percentage, then split the tax proportionally." },
        { q: "Should I calculate tips before or after sales tax?", a: "Standard tipping etiquette dictates that tips should be calculated on the pre-tax subtotal of the bill, rather than the total including local sales taxes." },
        { q: "What should I do if a service charge is already included?", a: "If a 'service charge' or 'gratuity' is already added to the bill (often for groups of 6 or more), you do not need to add an additional tip, though you may do so if the service was exceptional." },
      ]}
      blog={<CalculatorBlog content={blogContent.tip} />}
    >
      <CalculatorCurrencyBar />
      <div className="flex flex-col gap-6">
        <div className="calc-input-column space-y-4">
          <MoneyField label="Bill amount" value={bill} onChange={(v) => setBill(v)} />
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Tip %</Label>
            <div className="mt-1 flex flex-wrap gap-2">
              {[10, 15, 18, 20, 25].map((t) => (
                <button key={t} type="button" onClick={() => setTip(t)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium border ${tip === t ? "bg-accent text-accent-foreground border-accent" : "border-border hover:bg-muted"}`}>
                  {t}%
                </button>
              ))}
              <Input type="number" value={tip} onChange={(e) => { const val = e.target.value; setTip(val === "" ? "" : Number(val)); }}
                onKeyDown={handleKeyDown} className="w-24" />
            </div>
          </div>
          <F label="Number of people" value={people} onChange={setPeople} onKeyDown={handleKeyDown} />
          <div className="flex flex-row gap-3 mt-4">
            <CalculateButton category="everyday" className="flex-1 min-h-11" disabled={isButtonDisabled} onClick={handleCalculate}>Calculate</CalculateButton>
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
              label="Amount Per Person"
              value={format(r.per)}
              badge={{ text: tipQuality, color: tipBadge }}
              sub={`${calcPeople} people · ${calcTip}% tip · Total bill ${format(r.total)}`}
              glow="#f59e0b"
            />

            {/* Key Metrics */}
            <DashboardSection title="Key Metrics">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard index={0} label="Tip Amount (total)" value={format(r.tipAmt)} accent="amber" subValue={`${calcTip}% of bill`} />
                <StatCard index={1} label="Total Bill" value={format(r.total)} accent="default" />
                <StatCard index={2} label="Bill per Person" value={format(r.billPer)} accent="blue" />
                <StatCard index={3} label="Tip per Person" value={format(r.tipPer)} accent="amber" />
                <StatCard index={4} label="Tip Quality" value={tipQuality.charAt(0).toUpperCase() + tipQuality.slice(1)} accent={tipBadge} />
                <StatCard index={5} label="Number of People" value={String(calcPeople)} accent="cyan" subValue={`${format(r.per)} each`} />
              </div>
            </DashboardSection>

            {/* Chart */}
            <DashboardSection title="Tip Percentage Comparison">
              <div className="rounded-xl border border-border/60 bg-card p-4 shadow-soft">
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tipBarData} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                      <YAxis tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
                      <Tooltip {...tooltipStyle} formatter={(v: number) => [format(v), ""]} />
                      <Bar dataKey="total" name="Total (Bill+Tip)" radius={[4, 4, 0, 0]}>
                        <LabelList dataKey="total" position="top" style={{ fontSize: 10, fill: "var(--color-foreground)" }} formatter={(v: number) => format(v)} />
                        {tipBarData.map((entry, i) => (
                          <Cell key={i} fill={barColors[i]} opacity={entry.total === activeTotal ? 1 : 0.5} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </DashboardSection>

            {/* Comparison */}
            <DashboardSection title="Scenario Comparison — Split Options">
              <ComparisonTable
                headers={["Split", "Per Person Total", "Per Person Tip", "Per Person Bill"]}
                rows={comparisonRows}
                highlightColIndex={0}
              />
            </DashboardSection>

            {/* Insights */}
            <DashboardSection title="Smart Insights">
              <div className="flex flex-col gap-2">
                <InsightCard index={0} tone={calcTip >= 18 ? "success" : calcTip >= 15 ? "info" : "warning"}
                  text={`A ${calcTip}% tip on your ${format(calcBill)} bill is ${format(r.tipAmt)} — this is considered ${tipQuality} for restaurant service in the USA.`} />
                <InsightCard index={1} tone="info"
                  text={`Split ${calcPeople} ways, each person owes ${format(r.billPer)} for food and ${format(r.tipPer)} as their tip share — ${format(r.per)} total.`} />
                <InsightCard index={2} tone="tip"
                  text="Check your bill before tipping — many restaurants add an automatic 18–20% gratuity for groups of 6 or more. Tipping on top is optional for exceptional service only." />
              </div>
            </DashboardSection>

            {/* Recommendations */}
            <DashboardSection title="Recommendations">
              <RecommendationList items={[
                { title: "Tip on the pre-tax amount", description: "Standard etiquette is to tip on the pre-tax food/drink subtotal, not the full after-tax total. This saves 5–10% on your tip amount." },
                { title: "Increase tip for exceptional service", description: "If service was outstanding, 20–25% shows appreciation. For mediocre service, 10–12% is acceptable — withholding entirely sends a stronger signal to management." },
                { title: "Tip in cash when possible", description: "Cash tips go directly to the server immediately. Card tips may be pooled or delayed by a pay cycle depending on the restaurant's policy." },
              ]} />
            </DashboardSection>

            <div className="flex flex-col">
              <CalculatorPdfExport hasResult={hasResult && calcBill > 0} pdfData={pdfData} />
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
      <Input type="number" className="mt-1" value={value}
        onChange={(e) => { const val = e.target.value; onChange(val === "" ? "" : Number(val)); }}
        onKeyDown={onKeyDown} />
    </div>
  );
}
