import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog from "@/components/CalculatorBlog";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { blogContent } from "@/data/blogContent";
import { CalculatorSelect } from "@/components/CalculatorSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalculateButton } from "@/components/CalculateButton";
import { PDF_SITE_NAME, PDF_SITE_URL } from "@/constants/pdfBrand";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell,
  PieChart, Pie, Legend,
} from "recharts";
import { motion } from "framer-motion";
import {
  HeroMetric, StatCard, DashboardSection, InsightCard,
  ComparisonTable, RecommendationList,
} from "@/components/dashboard";

const ACTIVITY_LABELS: Record<string, string> = {
  "1.2": "Sedentary",
  "1.375": "Light",
  "1.55": "Moderate",
  "1.725": "Very Active",
  "1.9": "Extra Active",
};

export function CalorieCalculator() {
  const calc = getCalculator("calorie-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  const [sex, setSex] = useState<"male" | "female">("male");
  const [age, setAge] = useState<number | "">(30);
  const [heightCm, setHeightCm] = useState<number | "">(175);
  const [weightKg, setWeightKg] = useState<number | "">(72);
  const [activity, setActivity] = useState(1.55);
  const [goal, setGoal] = useState<"maintain" | "lose" | "gain">("maintain");

  const [calcSex, setCalcSex] = useState<"male" | "female">("male");
  const [calcAge, setCalcAge] = useState<number>(30);
  const [calcHeightCm, setCalcHeightCm] = useState<number>(175);
  const [calcWeightKg, setCalcWeightKg] = useState<number>(72);
  const [calcActivity, setCalcActivity] = useState(1.55);
  const [calcGoal, setCalcGoal] = useState<"maintain" | "lose" | "gain">("maintain");

  const { bmr, tdee, target } = useMemo(() => {
    const bmr = calcSex === "male"
      ? 10 * calcWeightKg + 6.25 * calcHeightCm - 5 * calcAge + 5
      : 10 * calcWeightKg + 6.25 * calcHeightCm - 5 * calcAge - 161;
    const tdee = bmr * calcActivity;
    const target = calcGoal === "maintain" ? tdee : calcGoal === "lose" ? tdee - 500 : tdee + 300;
    return { bmr, tdee, target };
  }, [calcSex, calcAge, calcHeightCm, calcWeightKg, calcActivity, calcGoal]);

  const activityLabel = ACTIVITY_LABELS[String(calcActivity)] ?? "Custom";
  const proteinTarget = Math.round(calcWeightKg * 1.8); // 1.8g per kg
  const bmrPct = tdee > 0 ? ((bmr / tdee) * 100).toFixed(0) : "0";

  // Calorie bar chart (lose / maintain / gain comparison)
  const calorieBars = [
    { name: "Lose 0.5kg/wk", value: Math.round(tdee - 500), fill: "#60a5fa" },
    { name: "Lose 0.25kg/wk", value: Math.round(tdee - 250), fill: "#34d399" },
    { name: "Maintain", value: Math.round(tdee), fill: "#a78bfa" },
    { name: "Gain 0.25kg/wk", value: Math.round(tdee + 150), fill: "#fbbf24" },
    { name: "Gain 0.5kg/wk", value: Math.round(tdee + 300), fill: "#f87171" },
  ];

  // Macro donut (40/30/30 split)
  const carbs = Math.round((target * 0.4) / 4);
  const protein = Math.round((target * 0.3) / 4);
  const fat = Math.round((target * 0.3) / 9);
  const macroData = [
    { name: `Carbs (${carbs}g)`, value: Math.round(target * 0.4) },
    { name: `Protein (${protein}g)`, value: Math.round(target * 0.3) },
    { name: `Fat (${fat}g)`, value: Math.round(target * 0.3) },
  ];

  // Weekly goal rate comparison
  const goalOptions = [
    { label: "Lose 0.5 kg/wk", cal: Math.round(tdee - 500), weekly: "-0.5 kg" },
    { label: "Lose 0.25 kg/wk", cal: Math.round(tdee - 250), weekly: "-0.25 kg" },
    { label: "Maintain", cal: Math.round(tdee), weekly: "0 kg" },
    { label: "Gain 0.25 kg/wk", cal: Math.round(tdee + 150), weekly: "+0.25 kg" },
    { label: "Gain 0.5 kg/wk", cal: Math.round(tdee + 300), weekly: "+0.5 kg" },
  ];
  const activeTarget = calcGoal === "lose" ? Math.round(tdee - 500) : calcGoal === "gain" ? Math.round(tdee + 300) : Math.round(tdee);
  const comparisonRows = goalOptions.map((g) => ({
    label: g.label,
    values: [`${g.cal} kcal`, g.weekly, `${(g.cal * 30).toLocaleString()} kcal/mo`],
    highlight: g.cal === activeTarget,
  }));

  const pdfData = hasResult
    ? {
        calculatorName: "Calorie Calculator",
        calculatorSlug: "calorie-calculator",
        siteName: PDF_SITE_NAME,
        siteUrl: PDF_SITE_URL,
        inputs: [
          { label: "Sex", value: calcSex === "male" ? "Male" : "Female" },
          { label: "Age", value: `${calcAge} years` },
          { label: "Height", value: `${calcHeightCm} cm` },
          { label: "Weight", value: `${calcWeightKg} kg` },
          { label: "Activity Level", value: activityLabel },
          { label: "Goal", value: `${calcGoal} weight` },
        ],
        results: [
          { label: "Daily Calorie Target", value: `${Math.round(target)} kcal`, highlight: true },
          { label: "BMR (at rest)", value: `${Math.round(bmr)} kcal`, highlight: false },
          { label: "TDEE (maintenance)", value: `${Math.round(tdee)} kcal`, highlight: false },
          { label: "Weekly change (approx.)", value: calcGoal === "lose" ? "−0.5 kg/week" : calcGoal === "gain" ? "+0.3 kg/week" : "Maintain", highlight: false },
        ],
        summary: `To ${calcGoal} weight, aim for about ${Math.round(target)} kcal per day. Your BMR is ${Math.round(bmr)} kcal and maintenance (TDEE) is ${Math.round(tdee)} kcal with ${activityLabel.toLowerCase()} activity. Track for 2–3 weeks and adjust by 100–200 kcal if needed.`,
      }
    : null;

  const isButtonDisabled = !age || !heightCm || !weightKg || Number(age) <= 0 || Number(heightCm) <= 0 || Number(weightKg) <= 0;

  const handleCalculate = () => {
    if (isButtonDisabled) return;
    setCalcSex(sex); setCalcAge(Number(age)); setCalcHeightCm(Number(heightCm));
    setCalcWeightKg(Number(weightKg)); setCalcActivity(activity); setCalcGoal(goal);
    markCalculated();
  };

  const handleReset = () => {
    setSex("male"); setAge(30); setHeightCm(175); setWeightKg(72); setActivity(1.55); setGoal("maintain");
    setCalcSex("male"); setCalcAge(30); setCalcHeightCm(175); setCalcWeightKg(72); setCalcActivity(1.55); setCalcGoal("maintain");
    resetCalculated();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !isButtonDisabled) handleCalculate(); };

  const tooltipStyle = {
    contentStyle: { background: "var(--color-card)", borderColor: "var(--color-border)", borderRadius: "8px", fontSize: 12 },
    labelStyle: { color: "var(--color-foreground)" },
    itemStyle: { color: "var(--color-foreground)" },
  };

  const goalBadge = { maintain: { text: "Maintain", color: "purple" as const }, lose: { text: "Weight Loss", color: "blue" as const }, gain: { text: "Weight Gain", color: "amber" as const } };

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Estimate the calories you need each day to maintain, lose or gain weight. Uses the Mifflin-St Jeor equation, the most accurate formula recommended by dietitians."
      formula={`Male BMR: 10×kg + 6.25×cm − 5×age + 5\nFemale BMR: 10×kg + 6.25×cm − 5×age − 161\nTDEE = BMR × activity multiplier`}
      example={`30-year-old male, 175 cm, 72 kg, moderate activity (×1.55).\nBMR ≈ 1,679 kcal/day.\nTDEE ≈ 2,602 kcal/day to maintain weight.`}
      faqs={[
        { q: "What is a calorie calculator?", a: "A calorie calculator is a comprehensive nutritional tool that estimates the total number of calories your body needs to maintain, lose, or gain body weight. It uses your height, weight, age, sex, and exercise frequency to compute your total daily energy expenditure (TDEE) and outline healthy macro guidelines for your lifestyle." },
        { q: "What is TDEE and how does it work?", a: "Total Daily Energy Expenditure (TDEE) is an estimation of how many calories your body burns in a single 24-hour period, factoring in your basal metabolic rate (BMR) and physical activity levels. Eating below your TDEE triggers weight loss, while eating above it promotes weight gain. Balance hydration with our <a href=\"/calculator/water-intake-calculator\" class=\"text-primary hover:underline\">Water Intake Calculator</a>." },
        { q: "How many calories should I eat to lose weight?", a: "To lose weight safely, you should aim for a modest caloric deficit of 300 to 500 calories below your calculated TDEE. This range facilitates a sustainable fat loss rate of about 0.5 to 1 pound per week, preserving lean muscle mass and preventing hormonal disruption during your personal fitness journey." },
        { q: "How does physical activity affect my calorie needs?", a: "Physical activity raises your daily calorie requirements because muscles require significant ATP energy to contract and recover. The more active you are, the higher your activity multiplier, which directly increases your TDEE. Keeping your multiplier accurate prevents you from overestimating how much food you should consume each day for your body." },
        { q: "Should I eat differently depending on my fitness goals?", a: "Yes. For fat loss, keep a caloric deficit and eat plenty of protein to protect muscles. For muscle gain, maintain a caloric surplus and pair it with strength training. Track your metabolic base rate at rest to refine these goals by visiting our <a href=\"/calculator/bmr-calculator\" class=\"text-primary hover:underline\">BMR Calculator</a> to customize your target metrics." },
        { q: "Are all calories created equal for health?", a: "While weight change is driven by thermodynamic energy balance, food quality affects appetite, metabolic rate, and muscle growth. Getting calories from lean proteins, complex carbs, and healthy fats is much better for energy, satiety, and overall body health than consuming processed simple sugars, ensuring you receive essential nutrients every single day." },
        { q: "How accurate are calorie calculators?", a: "Calorie calculators provide a highly accurate statistical baseline, but individual metabolism can vary by 10-15% based on genetics, muscle mass, and thyroid health. Use the calculator's estimate as a starting point and adjust based on weight changes over several weeks. Monitor your general health with our <a href=\"/calculator/bmi-calculator\" class=\"text-primary hover:underline\">BMI Calculator</a>." },
        { q: "What is metabolic adaptation?", a: "Metabolic adaptation is the body's natural response to prolonged caloric restriction, where it lowers its resting energy expenditure to conserve fuel. This slowdown is why continuous dieting gets harder over time. Taking structured diet breaks and increasing resistance training helps mitigate this metabolic decline, allowing you to sustain your weight goals." }
      ]}
      blog={<CalculatorBlog content={blogContent.calorie} />}
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <F label="Age" value={age} onChange={(v) => setAge(v)} onKeyDown={handleKeyDown} />
            <F label="Height (cm)" value={heightCm} onChange={(v) => setHeightCm(v)} onKeyDown={handleKeyDown} />
            <F label="Weight (kg)" value={weightKg} onChange={(v) => setWeightKg(v)} onKeyDown={handleKeyDown} />
          </div>
          <CalculatorSelect label="Activity level" value={activity} onValueChange={(v) => setActivity(Number(v))}
            placeholder="Select activity level"
            options={[
              { value: "1.2", label: "Sedentary (little/no exercise)" },
              { value: "1.375", label: "Light (1–3 days/week)" },
              { value: "1.55", label: "Moderate (3–5 days/week)" },
              { value: "1.725", label: "Very active (6–7 days/week)" },
              { value: "1.9", label: "Extra active (athlete / physical job)" },
            ]}
          />
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Goal</Label>
            <div className="mt-1 grid grid-cols-3 gap-2">
              {(["lose", "maintain", "gain"] as const).map((g) => (
                <button key={g} type="button" onClick={() => setGoal(g)}
                  className={`px-3 py-2 rounded-md text-sm font-medium border capitalize transition-colors ${goal === g ? "bg-accent text-accent-foreground border-accent" : "border-border hover:bg-muted"}`}>
                  {g} weight
                </button>
              ))}
            </div>
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
              label="Daily Calorie Target"
              value={`${Math.round(target)} kcal`}
              badge={goalBadge[calcGoal]}
              sub={`Activity: ${activityLabel} · ${calcSex === "male" ? "Male" : "Female"}, ${calcAge} yrs, ${calcWeightKg} kg`}
              glow="#10b981"
            />

            {/* Key Metrics */}
            <DashboardSection title="Key Metrics">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard index={0} label="BMR (at rest)" value={`${Math.round(bmr)} kcal`} accent="blue" subValue={`${bmrPct}% of TDEE`} />
                <StatCard index={1} label="TDEE (maintenance)" value={`${Math.round(tdee)} kcal`} accent="purple" />
                <StatCard index={2} label="Calorie Adjustment" value={calcGoal === "lose" ? "−500 kcal" : calcGoal === "gain" ? "+300 kcal" : "0 kcal"}
                  accent={calcGoal === "lose" ? "blue" : calcGoal === "gain" ? "amber" : "green"} />
                <StatCard index={3} label="Weekly Change" value={calcGoal === "lose" ? "−0.5 kg/week" : calcGoal === "gain" ? "+0.3 kg/week" : "Maintain"}
                  accent={calcGoal === "lose" ? "blue" : calcGoal === "gain" ? "amber" : "green"} />
                <StatCard index={4} label="Protein Target" value={`${proteinTarget}g/day`} accent="cyan" subValue="1.8g per kg body weight" />
                <StatCard index={5} label="Activity Multiplier" value={`×${calcActivity}`} accent="default" subValue={activityLabel} />
              </div>
            </DashboardSection>

            {/* Charts */}
            <DashboardSection title="Calorie Visualization">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Goal comparison bar */}
                <div className="rounded-xl border border-border/60 bg-card p-4 shadow-soft">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Goal Comparison</div>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={calorieBars} margin={{ top: 4, right: 4, left: 0, bottom: 24 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis dataKey="name" tick={{ fontSize: 9, fill: "var(--color-muted-foreground)" }} angle={-30} textAnchor="end" />
                        <YAxis tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
                        <Tooltip {...tooltipStyle} formatter={(v) => [`${v} kcal`, "Target"]} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {calorieBars.map((entry, i) => (
                            <Cell key={i} fill={entry.fill} opacity={entry.value === Math.round(target) ? 1 : 0.5} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Macro donut */}
                <div className="rounded-xl border border-border/60 bg-card p-4 shadow-soft">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Macro Split (40/30/30)</div>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={macroData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={74} paddingAngle={3}>
                          <Cell fill="var(--color-chart-1)" />
                          <Cell fill="var(--color-chart-3)" />
                          <Cell fill="var(--color-chart-4)" />
                        </Pie>
                        <Tooltip {...tooltipStyle} formatter={(v) => [`${v} kcal`, ""]} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </DashboardSection>

            {/* Comparison */}
            <DashboardSection title="Scenario Comparison — Goal Rates">
              <ComparisonTable
                headers={["Goal", "Daily Calories", "Weekly Change", "Monthly Calories"]}
                rows={comparisonRows}
                highlightColIndex={0}
              />
            </DashboardSection>

            {/* Insights */}
            <DashboardSection title="Smart Insights">
              <div className="flex flex-col gap-2">
                <InsightCard index={0} tone="info"
                  text={`Your BMR of ${Math.round(bmr)} kcal represents ${bmrPct}% of your TDEE. The remaining ${100 - Number(bmrPct)}% comes from your ${activityLabel.toLowerCase()} activity level.`} />
                <InsightCard index={1} tone={calcGoal === "lose" ? "success" : "info"}
                  text={calcGoal === "lose"
                    ? `At a 500 kcal/day deficit, you should lose approximately 0.5 kg per week — a safe, sustainable rate that preserves muscle mass.`
                    : calcGoal === "gain"
                    ? `At a 300 kcal/day surplus, you'll gain approximately 0.3 kg per week — ideal for lean muscle building when combined with resistance training.`
                    : `At ${Math.round(tdee)} kcal/day, you're eating at maintenance — your weight should remain stable with consistent intake.`} />
                <InsightCard index={2} tone="tip"
                  text={`Aim for ${proteinTarget}g of protein daily (1.8g/kg body weight) to maintain muscle mass while in a ${calcGoal === "maintain" ? "maintenance" : calcGoal} phase. Distribute across 4–5 meals for optimal absorption.`} />
              </div>
            </DashboardSection>

            {/* Recommendations */}
            <DashboardSection title="Recommendations">
              <RecommendationList items={[
                { title: "Track calories for 2–3 weeks", description: "Use a food tracking app (MyFitnessPal, Cronometer) for 2–3 weeks to build awareness. After calibration, intuitive eating becomes easier." },
                { title: "Adjust by 100–200 kcal if plateauing", description: `If your weight isn't moving after 2 weeks, adjust your target by 100–200 kcal. Your true TDEE may differ slightly from the calculated ${Math.round(tdee)} kcal.` },
                { title: "Prioritize protein and fiber", description: `Hit your ${proteinTarget}g protein target and include high-fiber vegetables — both reduce hunger and support sustainable adherence to your calorie goal.` },
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
