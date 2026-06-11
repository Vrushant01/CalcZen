import { useMemo, useState } from "react";
import { CalculateButton } from "@/components/CalculateButton";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog from "@/components/CalculatorBlog";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { blogContent } from "@/data/blogContent";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PDF_SITE_NAME, PDF_SITE_URL } from "@/constants/pdfBrand";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell, LabelList } from "recharts";
import { motion } from "framer-motion";
import {
  HeroMetric, StatCard, DashboardSection, InsightCard,
  ComparisonTable, RecommendationList,
} from "@/components/dashboard";

export function WaterIntakeCalculator() {
  const calc = getCalculator("water-intake-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  const [weightKg, setWeightKg] = useState<number | "">(70);
  const [activityMin, setActivityMin] = useState<number | "">(30);

  const [calcWeightKg, setCalcWeightKg] = useState<number>(70);
  const [calcActivityMin, setCalcActivityMin] = useState<number>(30);

  const { liters, cups, baseLiters, exerciseLiters } = useMemo(() => {
    const baseMl = calcWeightKg * 35;
    const extraMl = (calcActivityMin / 30) * 350;
    const total = baseMl + extraMl;
    return {
      liters: total / 1000,
      cups: total / 240,
      baseLiters: baseMl / 1000,
      exerciseLiters: extraMl / 1000,
    };
  }, [calcWeightKg, calcActivityMin]);

  const glasses = Math.ceil(liters / 0.25); // 250ml glasses
  const hourlyGoal = (liters / 12).toFixed(2); // spread over 12 waking hours
  const mlPerKg = 35 + (calcActivityMin / 30) * 5;

  // Hourly schedule bars (simplified 8am-8pm)
  const hourlyData = Array.from({ length: 8 }, (_, i) => ({
    time: `${8 + i * 1.5}:00`.replace(/\.5/, ":30"),
    ml: 200 + (i === 0 ? 100 : 0) + (i === 3 ? 50 : 0),
  }));

  // Comparison: water at different activity levels
  const exerciseOptions = [0, 15, 30, 45, 60, 90];
  const comparisonRows = exerciseOptions.map((min) => {
    const baseMl = calcWeightKg * 35;
    const extraMl = (min / 30) * 350;
    const totalL = (baseMl + extraMl) / 1000;
    const isActive = min === calcActivityMin;
    return {
      label: min === 0 ? "No exercise" : `${min} min/day`,
      values: [`${totalL.toFixed(2)} L`, `${(totalL / 0.24).toFixed(1)} cups`, `${((baseMl + extraMl) / 1000 / 12).toFixed(2)} L/hr`],
      highlight: isActive,
    };
  });

  const pdfData = hasResult
    ? {
        calculatorName: "Water Intake Calculator",
        calculatorSlug: "water-intake-calculator",
        siteName: PDF_SITE_NAME,
        siteUrl: PDF_SITE_URL,
        inputs: [
          { label: "Weight", value: `${calcWeightKg} kg` },
          { label: "Daily Exercise", value: `${calcActivityMin} minutes` },
        ],
        results: [
          { label: "Recommended Intake", value: `${liters.toFixed(2)} L / day`, highlight: true },
          { label: "Equivalent Cups", value: `≈ ${cups.toFixed(1)} cups (240 ml)`, highlight: false },
          { label: "Base Hydration", value: `${baseLiters.toFixed(2)} L`, highlight: false },
          { label: "Exercise Bonus", value: `${exerciseLiters.toFixed(2)} L`, highlight: false },
        ],
        summary: `For a ${calcWeightKg} kg person with ${calcActivityMin} minutes of daily exercise, aim for about ${liters.toFixed(2)} liters (${cups.toFixed(1)} cups) of water per day. Spread intake across the day and increase on hot days or during intense workouts.`,
      }
    : null;

  const isButtonDisabled = !weightKg || weightKg <= 0 || activityMin === "" || Number(activityMin) < 0;

  const handleCalculate = () => {
    if (isButtonDisabled) return;
    setCalcWeightKg(Number(weightKg));
    setCalcActivityMin(Number(activityMin));
    markCalculated();
  };

  const handleReset = () => {
    setWeightKg(70); setActivityMin(30);
    setCalcWeightKg(70); setCalcActivityMin(30);
    resetCalculated();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !isButtonDisabled) handleCalculate(); };

  const tooltipStyle = {
    contentStyle: { background: "var(--color-card)", borderColor: "var(--color-border)", borderRadius: "8px", fontSize: 12 },
    labelStyle: { color: "var(--color-foreground)" },
    itemStyle: { color: "var(--color-foreground)" },
  };

  // Gauge bar data  
  const gaugeData = [
    { name: "Low", range: "< 1.5L", threshold: 1.5, fill: "#f87171" },
    { name: "Adequate", range: "1.5–2L", threshold: 2.0, fill: "#fbbf24" },
    { name: "Good", range: "2–2.5L", threshold: 2.5, fill: "#34d399" },
    { name: "Optimal", range: "2.5–3.5L", threshold: 3.5, fill: "#60a5fa" },
    { name: "High", range: "> 3.5L", threshold: 5, fill: "#a78bfa" },
  ];
  const activeGauge = gaugeData.find((g) => liters <= g.threshold) ?? gaugeData[gaugeData.length - 1];

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Estimate how much water you should drink each day based on your weight and daily exercise level."
      formula={`Daily water (mL) = weight (kg) × 35 + (exercise minutes ÷ 30) × 350`}
      example={`70 kg body weight with 30 minutes of daily exercise.\nRecommended intake ≈ 2.8 L (about 12 cups) per day.`}
      faqs={[
        { q: "Do other drinks count?", a: "Tea, coffee and most foods contribute to hydration, but plain water is the most efficient way to meet daily needs." },
        { q: "Can I drink too much water?", a: "Very rarely — overhydration is uncommon outside of endurance events. Spread intake throughout the day." },
        { q: "Should I drink more in hot weather?", a: "Yes. Add 500–1000 ml on hot days or when sweating heavily." },
        { q: "Does coffee or tea count toward my daily hydration target?", a: "Yes, caffeinated drinks like coffee and tea contribute to your total daily fluid intake. Although caffeine has a mild diuretic effect, studies show it does not cause dehydration in habitual drinkers." },
        { q: "What are the early signs of mild dehydration?", a: "The earliest symptoms of mild dehydration include thirst, dry mouth, reduced urine output, dark urine color, fatigue, and persistent afternoon headaches." },
      ]}
      blog={<CalculatorBlog content={blogContent.water} />}
    >
      <div className="flex flex-col gap-6">
        <div className="calc-input-column">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <F label="Weight (kg)" value={weightKg} onChange={(v) => setWeightKg(v)} onKeyDown={handleKeyDown} />
            <F label="Daily exercise (minutes)" value={activityMin} onChange={(v) => setActivityMin(v)} onKeyDown={handleKeyDown} />
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
              label="Recommended Daily Intake"
              value={`${liters.toFixed(2)} L`}
              badge={{ text: activeGauge.name, color: activeGauge.name === "Good" || activeGauge.name === "Optimal" ? "green" : activeGauge.name === "Adequate" ? "amber" : "red" }}
              sub={`≈ ${cups.toFixed(1)} cups (240 ml) · ${glasses} glasses (250 ml) · ${hourlyGoal} L/hr spread over 12 hrs`}
              glow="#10b981"
            />

            {/* Key Metrics */}
            <DashboardSection title="Key Metrics">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard index={0} label="Base Hydration" value={`${baseLiters.toFixed(2)} L`} accent="blue" subValue={`${calcWeightKg} kg × 35 ml`} />
                <StatCard index={1} label="Exercise Bonus" value={`${exerciseLiters.toFixed(2)} L`} accent="green" subValue={`${calcActivityMin} min exercise`} />
                <StatCard index={2} label="Cups per Day" value={`${cups.toFixed(1)} cups`} accent="cyan" subValue="240 ml per cup" />
                <StatCard index={3} label="Glasses per Day" value={`${glasses} glasses`} accent="purple" subValue="~250 ml per glass" />
                <StatCard index={4} label="Per Hour (12 hrs)" value={`${hourlyGoal} L/hr`} accent="amber" subValue="Spread evenly" />
                <StatCard index={5} label="ml per kg body" value={`${mlPerKg.toFixed(0)} ml/kg`} accent="default" />
              </div>
            </DashboardSection>

            {/* Charts */}
            <DashboardSection title="Hydration Gauge">
              <div className="rounded-xl border border-border/60 bg-card p-4 shadow-soft">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Your intake vs hydration levels</div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gaugeData} layout="vertical" margin={{ top: 4, right: 60, left: 0, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                        domain={[0, 5]} tickFormatter={(v) => `${v}L`} />
                      <YAxis type="category" dataKey="name" width={68} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                      <Tooltip {...tooltipStyle} formatter={(v, _name, props) => [props.payload.range, "Range"]} />
                      <Bar dataKey="threshold" radius={[0, 4, 4, 0]}>
                        <LabelList dataKey="range" position="right" style={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
                        {gaugeData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} opacity={entry.name === activeGauge.name ? 1 : 0.3} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </DashboardSection>

            {/* Comparison */}
            <DashboardSection title="Scenario Comparison — Exercise Levels">
              <ComparisonTable
                headers={["Exercise Level", "Daily Water", "Cups", "Per Hour"]}
                rows={comparisonRows}
                highlightColIndex={0}
              />
            </DashboardSection>

            {/* Insights */}
            <DashboardSection title="Smart Insights">
              <div className="flex flex-col gap-2">
                <InsightCard index={0} tone="info"
                  text={`Your base hydration of ${baseLiters.toFixed(2)} L comes from your ${calcWeightKg} kg body weight (35 ml/kg). Your ${calcActivityMin} min of exercise adds ${exerciseLiters.toFixed(2)} L to compensate for sweat losses.`} />
                <InsightCard index={1} tone="success"
                  text={`To hit your ${liters.toFixed(2)} L target spread across 12 waking hours, drink approximately ${hourlyGoal} L (${(Number(hourlyGoal) * 1000 / 240).toFixed(1)} cups) every hour.`} />
                <InsightCard index={2} tone="tip"
                  text="Drink a large glass (500 ml) first thing in the morning before coffee. Your body loses water overnight through breathing, and morning hydration boosts metabolism and alertness." />
              </div>
            </DashboardSection>

            {/* Recommendations */}
            <DashboardSection title="Recommendations">
              <RecommendationList items={[
                { title: "Use urine color as your guide", description: "Pale straw yellow = well hydrated. Dark yellow = drink more immediately. Clear = possibly overhydrated. Check first thing in the morning for an accurate reading." },
                { title: "Drink before, during, and after exercise", description: `With ${calcActivityMin} min of exercise, drink 300–500 ml before, 150–250 ml every 20 min during, and 500 ml after to fully replace sweat losses.` },
                { title: "Add 500ml on hot days", description: "Heat and humidity increase sweat rate significantly. On days above 30°C, add at least 500 ml to your daily target and consider electrolyte replacement for sessions over 60 min." },
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
