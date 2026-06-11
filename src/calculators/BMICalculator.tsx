import { useMemo, useState } from "react";
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
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { motion } from "framer-motion";
import {
  HeroMetric, StatCard, DashboardSection, InsightCard,
  ComparisonTable, RecommendationList,
} from "@/components/dashboard";

type BmiCategory = { label: string; color: string; badgeColor: "green" | "blue" | "amber" | "red" | "purple" | "default"; accent: "green" | "blue" | "amber" | "red" | "purple" | "cyan" | "default" };

function getBmiCategory(bmi: number): BmiCategory {
  if (bmi <= 0) return { label: "—", color: "text-muted-foreground", badgeColor: "default", accent: "default" };
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-600 dark:text-blue-400", badgeColor: "blue", accent: "blue" };
  if (bmi < 25) return { label: "Normal Weight", color: "text-emerald-600 dark:text-emerald-400", badgeColor: "green", accent: "green" };
  if (bmi < 30) return { label: "Overweight", color: "text-amber-600 dark:text-amber-400", badgeColor: "amber", accent: "amber" };
  return { label: "Obese", color: "text-red-600 dark:text-red-400", badgeColor: "red", accent: "red" };
}

export function BMICalculator() {
  const calc = getCalculator("bmi-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  const [heightCm, setHeightCm] = useState<number | "">(175);
  const [weightKg, setWeightKg] = useState<number | "">(72);
  const [heightIn, setHeightIn] = useState<number | "">(69);
  const [weightLb, setWeightLb] = useState<number | "">(160);

  const [calcUnit, setCalcUnit] = useState<"metric" | "imperial">("metric");
  const [calcHeightCm, setCalcHeightCm] = useState<number>(175);
  const [calcWeightKg, setCalcWeightKg] = useState<number>(72);
  const [calcHeightIn, setCalcHeightIn] = useState<number>(69);
  const [calcWeightLb, setCalcWeightLb] = useState<number>(160);

  const { bmi, heightM, category, healthyMin, healthyMax, bmiPrime, idealWeight } = useMemo(() => {
    let bmi = 0, heightM = 0;
    if (calcUnit === "metric") {
      heightM = calcHeightCm / 100;
      bmi = heightM > 0 ? calcWeightKg / (heightM * heightM) : 0;
    } else {
      heightM = calcHeightIn * 0.0254;
      bmi = calcHeightIn > 0 ? (calcWeightLb / (calcHeightIn * calcHeightIn)) * 703 : 0;
    }
    const category = getBmiCategory(bmi);
    const healthyMin = heightM > 0 ? 18.5 * heightM * heightM : 0;
    const healthyMax = heightM > 0 ? 24.9 * heightM * heightM : 0;
    const idealWeight = heightM > 0 ? 22 * heightM * heightM : 0; // midpoint of healthy BMI
    const bmiPrime = bmi > 0 ? bmi / 25 : 0;
    return { bmi, heightM, category, healthyMin, healthyMax, bmiPrime, idealWeight };
  }, [calcUnit, calcHeightCm, calcWeightKg, calcHeightIn, calcWeightLb]);

  const currentWeightKg = calcUnit === "metric" ? calcWeightKg : calcWeightLb / 2.20462;
  const diffFromIdeal = currentWeightKg - idealWeight;
  const weightRangeLabel = calcUnit === "metric"
    ? `${healthyMin.toFixed(1)}–${healthyMax.toFixed(1)} kg`
    : `${(healthyMin * 2.20462).toFixed(0)}–${(healthyMax * 2.20462).toFixed(0)} lb`;
  const idealWeightLabel = calcUnit === "metric"
    ? `${idealWeight.toFixed(1)} kg`
    : `${(idealWeight * 2.20462).toFixed(0)} lb`;
  const diffLabel = Math.abs(diffFromIdeal) < 0.5 ? "At ideal weight"
    : diffFromIdeal > 0 ? `-${Math.abs(diffFromIdeal).toFixed(1)} kg to reach ideal`
    : `+${Math.abs(diffFromIdeal).toFixed(1)} kg to reach ideal`;

  // BMI scale for visualization
  const bmiGaugeData = [
    { name: "Underweight", range: "< 18.5", value: 18.5, fill: "#60a5fa" },
    { name: "Normal", range: "18.5–25", value: 6.5, fill: "#34d399" },
    { name: "Overweight", range: "25–30", value: 5, fill: "#fbbf24" },
    { name: "Obese", range: "> 30", value: 10, fill: "#f87171" },
  ];

  // Weight scenario comparison
  const weightDeltas = [-10, -5, 0, 5, 10];
  const comparisonRows = weightDeltas.map((delta) => {
    const w = currentWeightKg + delta;
    const b = heightM > 0 ? w / (heightM * heightM) : 0;
    const cat = getBmiCategory(b);
    const isActive = delta === 0;
    const wLabel = calcUnit === "metric" ? `${w.toFixed(1)} kg` : `${(w * 2.20462).toFixed(0)} lb`;
    return {
      label: delta === 0 ? "Current weight" : `${delta > 0 ? "+" : ""}${delta} kg`,
      values: [wLabel, b.toFixed(1), cat.label],
      highlight: isActive,
    };
  });

  const pdfData = hasResult && bmi > 0
    ? {
        calculatorName: "BMI Calculator",
        calculatorSlug: "bmi-calculator",
        siteName: PDF_SITE_NAME,
        siteUrl: PDF_SITE_URL,
        inputs: [
          { label: "Unit System", value: calcUnit === "metric" ? "Metric" : "Imperial" },
          ...(calcUnit === "metric"
            ? [{ label: "Height", value: `${calcHeightCm} cm` }, { label: "Weight", value: `${calcWeightKg} kg` }]
            : [{ label: "Height", value: `${calcHeightIn} in` }, { label: "Weight", value: `${calcWeightLb} lb` }]),
        ],
        results: [
          { label: "BMI Score", value: bmi.toFixed(1), highlight: true },
          { label: "Category", value: category.label, highlight: true },
          { label: "Healthy Weight Range", value: weightRangeLabel, highlight: false },
          { label: "BMI Prime", value: bmiPrime.toFixed(2), highlight: false },
        ],
        summary: `Your BMI of ${bmi.toFixed(1)} places you in the ${category.label.toLowerCase()} range. A healthy BMI for your height is between 18.5 and 24.9, corresponding to ${weightRangeLabel}. This is a screening tool only — always consult your doctor for a full health assessment.`,
      }
    : null;

  const isButtonDisabled = unit === "metric"
    ? !heightCm || !weightKg || heightCm <= 0 || weightKg <= 0
    : !heightIn || !weightLb || heightIn <= 0 || weightLb <= 0;

  const handleCalculate = () => {
    if (isButtonDisabled) return;
    setCalcUnit(unit);
    if (unit === "metric") { setCalcHeightCm(Number(heightCm)); setCalcWeightKg(Number(weightKg)); }
    else { setCalcHeightIn(Number(heightIn)); setCalcWeightLb(Number(weightLb)); }
    markCalculated();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !isButtonDisabled) handleCalculate(); };

  const handleReset = () => {
    setHeightCm(175); setWeightKg(72); setHeightIn(69); setWeightLb(160); setUnit("metric");
    setCalcHeightCm(175); setCalcWeightKg(72); setCalcHeightIn(69); setCalcWeightLb(160); setCalcUnit("metric");
    resetCalculated();
  };

  const tooltipStyle = {
    contentStyle: { background: "var(--color-card)", borderColor: "var(--color-border)", borderRadius: "8px", fontSize: 12 },
    labelStyle: { color: "var(--color-foreground)" },
    itemStyle: { color: "var(--color-foreground)" },
  };

  // Needle position on gauge (15–40 mapped to 0–100%)
  const needlePct = Math.min(100, Math.max(0, ((bmi - 15) / 25) * 100));

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Body Mass Index (BMI) is a quick way to estimate whether your weight is in a healthy range for your height. Use the calculator below in metric or imperial units."
      formula={`Metric: BMI = weight (kg) ÷ height (m)²\nImperial: BMI = 703 × weight (lb) ÷ height (in)²`}
      example={`175 cm tall and 72 kg.\nBMI = 72 ÷ (1.75)² ≈ 23.5 (normal weight range).`}
      faqs={[
        { q: "What is a healthy BMI range?", a: "For most adults a BMI between 18.5 and 24.9 is considered healthy. Below 18.5 is underweight; 25–29.9 is overweight; 30+ is obese." },
        { q: "Does BMI work for athletes?", a: "BMI doesn't distinguish muscle from fat, so very muscular individuals can read as overweight even when healthy. Use it alongside body-fat measurements for a fuller picture." },
        { q: "Should I see a doctor about my BMI?", a: "BMI is a screening tool, not a diagnosis. Talk to a healthcare provider before changing your diet or activity level." },
        { q: "Why is BMI sometimes inaccurate for muscular individuals?", a: "BMI does not distinguish between body fat and lean muscle mass. Because muscle tissue is significantly denser than adipose fat tissue, highly muscular athletes or bodybuilders can have high BMIs that classify them as 'overweight' or 'obese' despite having extremely low body fat levels." },
        { q: "Is BMI interpreted the same way for children and teenagers?", a: "The formula is the same, but child/teen BMI is plotted on growth charts as a percentile rather than a fixed scale. This accounts for rapid developmental changes and varying growth rates across age groups." },
      ]}
      blog={<CalculatorBlog content={blogContent.bmi} />}
    >
      <div className="flex flex-col gap-6">
        <div className="calc-input-column">
          <div className="inline-flex rounded-lg bg-muted p-1 self-start">
            {(["metric", "imperial"] as const).map((u) => (
              <button key={u} type="button" onClick={() => setUnit(u)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${unit === u ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
                {u === "metric" ? "Metric" : "Imperial"}
              </button>
            ))}
          </div>

          {unit === "metric" ? (
            <div className="calc-field-grid-2">
              <Field label="Height (cm)" value={heightCm} onChange={(v) => setHeightCm(v)} onKeyDown={handleKeyDown} />
              <Field label="Weight (kg)" value={weightKg} onChange={(v) => setWeightKg(v)} onKeyDown={handleKeyDown} />
            </div>
          ) : (
            <div className="calc-field-grid-2">
              <Field label="Height (in)" value={heightIn} onChange={(v) => setHeightIn(v)} onKeyDown={handleKeyDown} />
              <Field label="Weight (lb)" value={weightLb} onChange={(v) => setWeightLb(v)} onKeyDown={handleKeyDown} />
            </div>
          )}

          <div className="flex flex-row gap-3 mt-4">
            <CalculateButton category="health" className="flex-1 min-h-11" disabled={isButtonDisabled} onClick={handleCalculate}>Calculate</CalculateButton>
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
              label="BMI Score"
              value={bmi.toFixed(1)}
              badge={{ text: category.label, color: category.badgeColor }}
              sub={`BMI Prime: ${bmiPrime.toFixed(2)} · Healthy range: 18.5 – 24.9`}
              glow="#10b981"
            />

            {/* Key Metrics */}
            <DashboardSection title="Key Metrics">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard index={0} label="Weight Category" value={category.label} accent={category.accent} />
                <StatCard index={1} label="Healthy Weight Range" value={weightRangeLabel} accent="green" />
                <StatCard index={2} label="Ideal Weight" value={idealWeightLabel} accent="cyan" subValue="BMI 22 midpoint" />
                <StatCard index={3} label="Difference from Ideal" value={diffLabel} accent={Math.abs(diffFromIdeal) < 1 ? "green" : diffFromIdeal > 0 ? "red" : "blue"} />
                <StatCard index={4} label="BMI Prime" value={bmiPrime.toFixed(2)} accent={bmiPrime > 1.2 ? "red" : bmiPrime < 0.74 ? "blue" : "green"} subValue="> 1.0 = overweight" />
                <StatCard index={5} label="Risk Assessment" value={bmi < 18.5 ? "Nutritional Risk" : bmi < 25 ? "Low Risk" : bmi < 30 ? "Moderate Risk" : "High Risk"}
                  accent={bmi < 18.5 ? "blue" : bmi < 25 ? "green" : bmi < 30 ? "amber" : "red"} />
              </div>
            </DashboardSection>

            {/* BMI Scale gauge */}
            <DashboardSection title="BMI Scale Position">
              <div className="rounded-xl border border-border/60 bg-card p-4 shadow-soft">
                {/* Color bar */}
                <div className="relative h-4 w-full rounded-full overflow-hidden flex mb-3">
                  <div className="flex-1 bg-blue-400" />
                  <div className="flex-[1.3] bg-emerald-400" />
                  <div className="flex-1 bg-amber-400" />
                  <div className="flex-[2] bg-red-400" />
                </div>
                {/* Needle */}
                <div className="relative h-2 w-full mb-1">
                  <motion.div
                    initial={{ left: "50%" }}
                    animate={{ left: `${needlePct}%` }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 120, damping: 18 }}
                    className="absolute -top-5 -ml-[3px] w-1.5 h-6 rounded-full bg-foreground shadow"
                    style={{ transform: "translateX(-50%)" }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-medium text-muted-foreground mt-1">
                  <span className="text-blue-500">15 Underweight</span>
                  <span className="text-emerald-500">18.5 Normal</span>
                  <span className="text-amber-500">25 Overweight</span>
                  <span className="text-red-500">30 Obese 40</span>
                </div>

                {/* Category breakdown bar chart */}
                <div className="mt-4 h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bmiGaugeData} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                      <Tooltip {...tooltipStyle} formatter={(v, _name, props) => [props.payload.range, "Range"]} />
                      <Bar dataKey="value" radius={4}>
                        {bmiGaugeData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} opacity={entry.name === category.label ? 1 : 0.35} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </DashboardSection>

            {/* Weight comparison */}
            <DashboardSection title="Weight Scenario Comparison">
              <ComparisonTable
                headers={["Weight Scenario", "Weight", "BMI", "Category"]}
                rows={comparisonRows}
                highlightColIndex={1}
              />
            </DashboardSection>

            {/* Insights */}
            <DashboardSection title="Smart Insights">
              <div className="flex flex-col gap-2">
                <InsightCard index={0} tone={bmi >= 18.5 && bmi < 25 ? "success" : "info"}
                  text={`Your BMI of ${bmi.toFixed(1)} places you in the ${category.label.toLowerCase()} range. ${bmi >= 18.5 && bmi < 25 ? "You're within the healthy range — great job maintaining your weight." : `To reach the healthy range, a weight change of ${Math.abs(diffFromIdeal).toFixed(1)} kg would be needed.`}`} />
                <InsightCard index={1} tone="info"
                  text={`Your BMI Prime is ${bmiPrime.toFixed(2)}. A value of exactly 1.0 means you're at the upper boundary of normal weight. Values below 0.74 indicate underweight; above 1.0 indicates overweight.`} />
                <InsightCard index={2} tone="tip"
                  text="BMI is a population-level screening tool and doesn't account for muscle mass, bone density, age, or ethnicity. Always combine BMI readings with professional medical assessment." />
              </div>
            </DashboardSection>

            {/* Recommendations */}
            <DashboardSection title="Recommendations">
              <RecommendationList items={[
                { title: "Consult a healthcare professional", description: "BMI is a starting point, not a diagnosis. A doctor or registered dietitian can provide a comprehensive health assessment including body composition." },
                { title: "Track trends, not single readings", description: "BMI fluctuates with hydration, time of day, and clothing. Track it monthly rather than daily, and look for trends over 3–6 months." },
                { title: "Combine with waist circumference", description: "Waist circumference is a stronger predictor of metabolic risk than BMI alone. For men, keep below 94 cm; for women, below 80 cm." },
              ]} />
            </DashboardSection>

            <div className="flex flex-col">
              <CalculatorPdfExport hasResult={hasResult && bmi > 0} pdfData={pdfData} />
            </div>
          </motion.div>
        )}
      </div>
    </CalculatorPageLayout>
  );
}

function Field({ label, value, onChange, onKeyDown }: {
  label: string; value: number | ""; onChange: (n: number | "") => void; onKeyDown?: (e: React.KeyboardEvent) => void;
}) {
  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Input type="number" value={value} onChange={(e) => { const val = e.target.value; onChange(val === "" ? "" : Number(val)); }}
        onKeyDown={onKeyDown} className="mt-1" />
    </div>
  );
}
