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
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell, LabelList } from "recharts";
import { motion } from "framer-motion";
import {
  HeroMetric, StatCard, DashboardSection, InsightCard,
  ComparisonTable, RecommendationList,
} from "@/components/dashboard";

const ACTIVITY_LEVELS = [
  { key: "1.2",   label: "Sedentary",    shortLabel: "Sed.",    color: "#60a5fa" },
  { key: "1.375", label: "Light",        shortLabel: "Light",   color: "#34d399" },
  { key: "1.55",  label: "Moderate",     shortLabel: "Mod.",    color: "#a78bfa" },
  { key: "1.725", label: "Very Active",  shortLabel: "V.Act.",  color: "#fbbf24" },
  { key: "1.9",   label: "Extra Active", shortLabel: "Extra",   color: "#f87171" },
];

export function BMRCalculator() {
  const calc = getCalculator("bmr-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  const [sex, setSex] = useState<"male" | "female">("male");
  const [age, setAge] = useState<number | "">(30);
  const [heightCm, setHeightCm] = useState<number | "">(175);
  const [weightKg, setWeightKg] = useState<number | "">(72);

  const [calcSex, setCalcSex] = useState<"male" | "female">("male");
  const [calcAge, setCalcAge] = useState<number>(30);
  const [calcHeightCm, setCalcHeightCm] = useState<number>(175);
  const [calcWeightKg, setCalcWeightKg] = useState<number>(72);

  const bmr = useMemo(() => {
    return calcSex === "male"
      ? 10 * calcWeightKg + 6.25 * calcHeightCm - 5 * calcAge + 5
      : 10 * calcWeightKg + 6.25 * calcHeightCm - 5 * calcAge - 161;
  }, [calcSex, calcAge, calcHeightCm, calcWeightKg]);

  const tdeeValues = ACTIVITY_LEVELS.map((a) => ({
    ...a,
    tdee: Math.round(bmr * Number(a.key)),
  }));

  const moderateTdee = Math.round(bmr * 1.55);
  const sedentaryTdee = Math.round(bmr * 1.2);
  const extraActiveTdee = Math.round(bmr * 1.9);
  const activityBoost = extraActiveTdee - sedentaryTdee;

  const comparisonRows = tdeeValues.map((a) => ({
    label: a.label,
    values: [`${a.tdee} kcal/day`, `×${a.key}`, `${Math.round(a.tdee * 7).toLocaleString()} kcal/wk`],
    highlight: a.key === "1.55",
  }));

  const pdfData = hasResult
    ? {
        calculatorName: "BMR Calculator",
        calculatorSlug: "bmr-calculator",
        siteName: PDF_SITE_NAME,
        siteUrl: PDF_SITE_URL,
        inputs: [
          { label: "Sex", value: calcSex === "male" ? "Male" : "Female" },
          { label: "Age", value: `${calcAge} years` },
          { label: "Height", value: `${calcHeightCm} cm` },
          { label: "Weight", value: `${calcWeightKg} kg` },
        ],
        results: [
          { label: "Basal Metabolic Rate", value: `${Math.round(bmr)} kcal/day`, highlight: true },
          { label: "Sedentary TDEE (est.)", value: `${sedentaryTdee} kcal/day`, highlight: false },
          { label: "Moderate TDEE (est.)", value: `${moderateTdee} kcal/day`, highlight: false },
          { label: "Very Active TDEE (est.)", value: `${Math.round(bmr * 1.725)} kcal/day`, highlight: false },
        ],
        summary: `Your BMR of ${Math.round(bmr)} kcal/day is the energy your body burns at complete rest. Multiply by an activity factor for total daily needs — about ${moderateTdee} kcal/day with moderate activity. Recalculate as your weight changes.`,
      }
    : null;

  const isButtonDisabled = !age || !heightCm || !weightKg || Number(age) <= 0 || Number(heightCm) <= 0 || Number(weightKg) <= 0;

  const handleCalculate = () => {
    if (isButtonDisabled) return;
    setCalcSex(sex); setCalcAge(Number(age)); setCalcHeightCm(Number(heightCm)); setCalcWeightKg(Number(weightKg));
    markCalculated();
  };

  const handleReset = () => {
    setSex("male"); setAge(30); setHeightCm(175); setWeightKg(72);
    setCalcSex("male"); setCalcAge(30); setCalcHeightCm(175); setCalcWeightKg(72);
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
      intro="Your Basal Metabolic Rate (BMR) is the energy your body burns at complete rest — just to keep your heart, lungs, and brain running."
      formula={`Male BMR: 10×kg + 6.25×cm − 5×age + 5\nFemale BMR: 10×kg + 6.25×cm − 5×age − 161`}
      example={`30-year-old male, 175 cm tall, 72 kg.\nBMR ≈ 1,679 kcal/day at rest.`}
      faqs={[
        { q: "What is Basal Metabolic Rate (BMR)?", a: "Basal Metabolic Rate (BMR) represents the minimum number of calories your body requires to perform basic, life-sustaining metabolic functions (like breathing, circulation, and cell production) at complete rest. It serves as the primary baseline for calculating your total daily energy usage and structuring your personal diet plans and fitness goals." },
        { q: "How is BMR calculated?", a: "BMR is calculated using standardized clinical formulas like the Mifflin-St Jeor or Harris-Benedict equations. These calculations take into account variables such as age, biological sex, height, and weight. Lenders of energy metabolism rely on these parameters because physical dimensions dictate resting cellular energy consumption, which is essential for accurate calculations." },
        { q: "Why does sex affect BMR?", a: "Biological sex affects BMR because men typically have a higher percentage of lean muscle mass, while women tend to possess more fat tissue. Muscle is metabolically active and burns more calories at rest than fat, which leads to higher baseline BMR scores in men of similar size and age. This metabolic disparity is normal." },
        { q: "How does BMR differ from TDEE?", a: "BMR represents calories burned at complete rest, while Total Daily Energy Expenditure (TDEE) includes your BMR plus the calories burned through physical activities and food digestion. To manage body weight, you must structure your food intake relative to your TDEE rather than your BMR. Explore daily caloric needs with our <a href=\"/calculator/calorie-calculator\" class=\"text-primary hover:underline\">Calorie Calculator</a>." },
        { q: "Can I increase my BMR?", a: "You can increase your BMR by building lean muscle mass through resistance training. Since muscle tissue is denser and metabolically more active than adipose fat tissue, having more muscle raises your resting calorie expenditure. Staying well-hydrated is also key, which you can track using our <a href=\"/calculator/water-intake-calculator\" class=\"text-primary hover:underline\">Water Intake Calculator</a>." },
        { q: "Why does BMR decrease with age?", a: "BMR decreases with age due to sarcopenia, which is the natural loss of lean muscle tissue and the accumulation of fat that occurs as we grow older. Physical activity levels, cellular efficiency, and hormone production also drop over time, causing a gradual decline in the body's resting metabolic rate and daily energy requirements." },
        { q: "Does losing weight lower my BMR?", a: "Yes, losing weight lowers your BMR because a smaller body mass requires less overall energy to sustain itself at rest. This metabolic adaptation is why weight loss can plateau over time, requiring you to periodically recalculate your baseline resting metabolism and adjust physical activity or daily caloric intake targets accordingly." },
        { q: "How should I use BMR for weight loss planning?", a: "To plan weight loss, first calculate your BMR, then multiply it by your activity multiplier to find your TDEE. Eating fewer calories than your TDEE creates a caloric deficit, prompting weight loss. You can check your general body weight categories online using our <a href=\"/calculator/bmi-calculator\" class=\"text-primary hover:underline\">BMI Calculator</a> to track physical categories." }
      ]}
      blog={<CalculatorBlog content={blogContent.bmr} />}
    >
      <div className="flex flex-col gap-6">
        <div className="calc-input-column">
          <div className="inline-flex rounded-lg bg-muted p-1 self-start">
            {(["male", "female"] as const).map((s) => (
              <button key={s} type="button" onClick={() => setSex(s)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${sex === s ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <F label="Age" value={age} onChange={(v) => setAge(v)} onKeyDown={handleKeyDown} />
            <F label="Height (cm)" value={heightCm} onChange={(v) => setHeightCm(v)} onKeyDown={handleKeyDown} />
            <F label="Weight (kg)" value={weightKg} onChange={(v) => setWeightKg(v)} onKeyDown={handleKeyDown} />
          </div>
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
              label="Basal Metabolic Rate"
              value={`${Math.round(bmr)} kcal/day`}
              sub={`Calories burned at complete rest · ${calcSex === "male" ? "Male" : "Female"}, ${calcAge} yrs, ${calcWeightKg} kg, ${calcHeightCm} cm`}
              glow="#10b981"
            />

            {/* Key Metrics */}
            <DashboardSection title="TDEE by Activity Level">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {tdeeValues.map((a, i) => (
                  <StatCard key={a.key} index={i} label={a.label}
                    value={`${a.tdee} kcal/day`}
                    accent={a.key === "1.2" ? "blue" : a.key === "1.375" ? "green" : a.key === "1.55" ? "purple" : a.key === "1.725" ? "amber" : "red"}
                    subValue={`×${a.key} multiplier`} />
                ))}
              </div>
            </DashboardSection>

            {/* Chart */}
            <DashboardSection title="TDEE Across Activity Levels">
              <div className="rounded-xl border border-border/60 bg-card p-4 shadow-soft">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tdeeValues} layout="vertical" margin={{ top: 4, right: 60, left: 0, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                        domain={[Math.round(sedentaryTdee * 0.9), Math.round(extraActiveTdee * 1.02)]} />
                      <YAxis type="category" dataKey="label" width={80} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                      <Tooltip {...tooltipStyle} formatter={(v) => [`${v} kcal/day`, "TDEE"]} />
                      <Bar dataKey="tdee" radius={[0, 4, 4, 0]}>
                        <LabelList dataKey="tdee" position="right" style={{ fontSize: 11, fill: "var(--color-foreground)" }} />
                        {tdeeValues.map((entry, i) => (
                          <Cell key={i} fill={entry.color} opacity={entry.key === "1.55" ? 1 : 0.6} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </DashboardSection>

            {/* Comparison table */}
            <DashboardSection title="Activity Level Comparison">
              <ComparisonTable
                headers={["Activity Level", "Daily TDEE", "Multiplier", "Weekly TDEE"]}
                rows={comparisonRows}
                highlightColIndex={0}
              />
            </DashboardSection>

            {/* Insights */}
            <DashboardSection title="Smart Insights">
              <div className="flex flex-col gap-2">
                <InsightCard index={0} tone="info"
                  text={`Your BMR of ${Math.round(bmr)} kcal/day is the minimum energy your body needs just to survive at rest. Every activity you do adds on top of this baseline.`} />
                <InsightCard index={1} tone="success"
                  text={`Moving from sedentary to extra active increases your daily calorie burn by approximately ${activityBoost} kcal/day — that's ${(activityBoost * 365 / 1000).toFixed(0)}k extra kcal burned per year.`} />
                <InsightCard index={2} tone="tip"
                  text={`For moderate activity, your maintenance calories are ${moderateTdee} kcal/day. To lose 0.5 kg/week, target ${moderateTdee - 500} kcal; to gain 0.3 kg/week, target ${moderateTdee + 300} kcal.`} />
              </div>
            </DashboardSection>

            {/* Recommendations */}
            <DashboardSection title="Recommendations">
              <RecommendationList items={[
                { title: "Build muscle to raise your BMR", description: "Each kg of muscle burns ~13 kcal/day at rest. Adding 5 kg of lean muscle through resistance training could increase your BMR by ~65 kcal/day permanently." },
                { title: "Recalculate every 4–6 weeks", description: `Your BMR changes as your weight, age, and body composition change. Recalculate when your weight shifts by more than 3–4 kg.` },
                { title: "Leverage NEAT for easy calorie burn", description: "Non-Exercise Activity Thermogenesis (NEAT) — walking, fidgeting, standing — can burn 200–400 extra kcal/day without formal exercise. Take stairs, walk during calls." },
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
      <Input type="number" value={value} onChange={(e) => { const val = e.target.value; onChange(val === "" ? "" : Number(val)); }}
        onKeyDown={onKeyDown} className="mt-1" />
    </div>
  );
}
