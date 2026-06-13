import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { CalculatorSelect } from "@/components/CalculatorSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalculateButton } from "@/components/CalculateButton";
import { PDF_SITE_NAME, PDF_SITE_URL } from "@/constants/pdfBrand";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Cell,
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

const ACTIVITY_LABELS: Record<string, string> = {
  "1.2": "Sedentary",
  "1.375": "Light",
  "1.55": "Moderate",
  "1.725": "Very Active",
  "1.9": "Athlete",
};

export function TDEECalculator() {
  const calc =
    getCalculator("tdee-calculator") ||
    ({
      id: "tdee-calculator",
      title: "TDEE Calculator",
      description: "Calculate your Total Daily Energy Expenditure",
      category: "health",
      icon: "Activity",
      path: "/calculator/tdee-calculator",
    } as any);
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  const [sex, setSex] = useState<"male" | "female">("male");
  const [age, setAge] = useState<number | "">(30);
  const [heightCm, setHeightCm] = useState<number | "">(175);
  const [weightKg, setWeightKg] = useState<number | "">(70);
  const [activity, setActivity] = useState(1.55);

  const [calcSex, setCalcSex] = useState<"male" | "female">("male");
  const [calcAge, setCalcAge] = useState<number>(30);
  const [calcHeightCm, setCalcHeightCm] = useState<number>(175);
  const [calcWeightKg, setCalcWeightKg] = useState<number>(70);
  const [calcActivity, setCalcActivity] = useState(1.55);

  const { bmr, tdee, loseTarget, gainTarget } = useMemo(() => {
    const bmr =
      calcSex === "male"
        ? 10 * calcWeightKg + 6.25 * calcHeightCm - 5 * calcAge + 5
        : 10 * calcWeightKg + 6.25 * calcHeightCm - 5 * calcAge - 161;
    const tdee = bmr * calcActivity;
    return { bmr, tdee, loseTarget: tdee - 500, gainTarget: tdee + 500 };
  }, [calcSex, calcAge, calcHeightCm, calcWeightKg, calcActivity]);

  const activityLabel = ACTIVITY_LABELS[String(calcActivity)] ?? "Custom";
  const bmrPct = tdee > 0 ? ((bmr / tdee) * 100).toFixed(0) : "0";

  const calorieBars = [
    { name: "Weight Loss (-500)", value: Math.round(loseTarget), fill: "#3b82f6" },
    { name: "Maintenance (TDEE)", value: Math.round(tdee), fill: "#10b981" },
    { name: "Weight Gain (+500)", value: Math.round(gainTarget), fill: "#f59e0b" },
  ];

  const comparisonRows = [
    {
      label: "Weight Loss",
      values: [
        `${Math.round(loseTarget)} kcal/day`,
        "-0.5 kg/week",
        `${Math.round(loseTarget * 30).toLocaleString()} kcal/mo`,
      ],
      highlight: false,
    },
    {
      label: "Maintenance",
      values: [
        `${Math.round(tdee)} kcal/day`,
        "0 kg/week",
        `${Math.round(tdee * 30).toLocaleString()} kcal/mo`,
      ],
      highlight: true,
    },
    {
      label: "Weight Gain",
      values: [
        `${Math.round(gainTarget)} kcal/day`,
        "+0.5 kg/week",
        `${Math.round(gainTarget * 30).toLocaleString()} kcal/mo`,
      ],
      highlight: false,
    },
  ];

  const pdfData = hasResult
    ? {
        calculatorName: "TDEE Calculator",
        calculatorSlug: "tdee-calculator",
        siteName: PDF_SITE_NAME,
        siteUrl: PDF_SITE_URL,
        inputs: [
          { label: "Sex", value: calcSex === "male" ? "Male" : "Female" },
          { label: "Age", value: `${calcAge} years` },
          { label: "Height", value: `${calcHeightCm} cm` },
          { label: "Weight", value: `${calcWeightKg} kg` },
          { label: "Activity Level", value: activityLabel },
        ],
        results: [
          { label: "TDEE (Maintenance)", value: `${Math.round(tdee)} kcal`, highlight: true },
          { label: "BMR (At Rest)", value: `${Math.round(bmr)} kcal`, highlight: false },
          {
            label: "Weight Loss Target",
            value: `${Math.round(loseTarget)} kcal`,
            highlight: false,
          },
          {
            label: "Weight Gain Target",
            value: `${Math.round(gainTarget)} kcal`,
            highlight: false,
          },
        ],
        summary: `Your Total Daily Energy Expenditure (TDEE) is estimated at ${Math.round(tdee)} kcal per day based on a ${activityLabel.toLowerCase()} activity level. To lose weight (0.5 kg/week), aim for ${Math.round(loseTarget)} kcal. To gain weight, aim for ${Math.round(gainTarget)} kcal.`,
      }
    : null;

  const isButtonDisabled =
    !age ||
    !heightCm ||
    !weightKg ||
    Number(age) <= 0 ||
    Number(heightCm) <= 0 ||
    Number(weightKg) <= 0;

  const handleCalculate = () => {
    if (isButtonDisabled) return;
    setCalcSex(sex);
    setCalcAge(Number(age));
    setCalcHeightCm(Number(heightCm));
    setCalcWeightKg(Number(weightKg));
    setCalcActivity(activity);
    markCalculated();
  };

  const handleReset = () => {
    setSex("male");
    setAge(30);
    setHeightCm(175);
    setWeightKg(70);
    setActivity(1.55);
    setCalcSex("male");
    setCalcAge(30);
    setCalcHeightCm(175);
    setCalcWeightKg(70);
    setCalcActivity(1.55);
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
      intro="Calculate your Total Daily Energy Expenditure (TDEE), an estimation of how many calories you burn each day when exercise is taken into account. Uses the highly accurate Mifflin-St Jeor equation."
      formula={`Male BMR = 10×kg + 6.25×cm − 5×age + 5\nFemale BMR = 10×kg + 6.25×cm − 5×age − 161\nTDEE = BMR × Activity Multiplier`}
      example={`30-year-old male, 175 cm, 70 kg, moderate activity (×1.55).\nBMR = 1,659 kcal/day.\nTDEE = 1,659 × 1.55 ≈ 2,571 kcal/day.`}
      faqs={[
        {
          q: "What is TDEE?",
          a: "Total Daily Energy Expenditure (TDEE) is the total number of calories your body burns in a given 24-hour period. It factors in your Basal Metabolic Rate (BMR) and your daily physical activity levels.",
        },
        {
          q: "How is TDEE calculated?",
          a: "First, your BMR is calculated using the Mifflin-St Jeor equation based on your gender, age, height, and weight. Then, your BMR is multiplied by an Activity Multiplier (ranging from 1.2 for sedentary to 1.9 for athletes) to determine your TDEE.",
        },
        {
          q: "What is BMR compared to TDEE?",
          a: "BMR (Basal Metabolic Rate) is the number of calories your body needs to maintain basic life-sustaining functions while at rest. TDEE adds the calories burned through daily movement and exercise to your BMR.",
        },
        {
          q: "Why should I know my TDEE?",
          a: "Knowing your TDEE provides a baseline for setting your caloric intake goals. If you want to maintain your current weight, you consume calories equal to your TDEE. To lose weight, you eat less than your TDEE, and to gain weight, you eat more.",
        },
        {
          q: "How accurate is the Mifflin-St Jeor equation?",
          a: "The Mifflin-St Jeor equation is considered the most reliable and accurate formula for estimating BMR in modern individuals by most dietary and nutritional organizations. However, actual TDEE may vary based on body composition and metabolism.",
        },
        {
          q: "What activity multiplier should I choose?",
          a: "If you have a desk job and do little to no exercise, choose 'Sedentary'. If you exercise 1-3 times a week, choose 'Light'. For 3-5 times a week, 'Moderate'. For 6-7 times, 'Very Active'. And for physical jobs or intense athletic training, choose 'Athlete'.",
        },
        {
          q: "How many calories should I cut to lose weight?",
          a: "A common and safe guideline is to eat 500 calories less than your TDEE per day. This creates a caloric deficit of 3,500 calories per week, which roughly equates to losing 1 pound (or 0.5 kg) of fat per week.",
        },
        {
          q: "Should my TDEE change over time?",
          a: "Yes, your TDEE will change as your weight, age, or activity level changes. It's recommended to recalculate your TDEE every time you lose or gain a significant amount of weight, or if your exercise habits change.",
        },
      ]}
    >
      <div className="flex flex-col gap-6">
        <div className="calc-input-column">
          <div className="inline-flex rounded-lg bg-muted p-1 self-start">
            {(["male", "female"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSex(s)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${sex === s ? "bg-background shadow-sm" : "text-muted-foreground"}`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <F label="Age" value={age} onChange={(v) => setAge(v)} onKeyDown={handleKeyDown} />
            <F
              label="Height (cm)"
              value={heightCm}
              onChange={(v) => setHeightCm(v)}
              onKeyDown={handleKeyDown}
            />
            <F
              label="Weight (kg)"
              value={weightKg}
              onChange={(v) => setWeightKg(v)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <CalculatorSelect
            label="Activity level"
            value={activity}
            onValueChange={(v) => setActivity(Number(v))}
            placeholder="Select activity level"
            options={[
              { value: "1.2", label: "Sedentary (desk job, little/no exercise)" },
              { value: "1.375", label: "Light (exercise 1–3 days/week)" },
              { value: "1.55", label: "Moderate (exercise 3–5 days/week)" },
              { value: "1.725", label: "Very Active (exercise 6–7 days/week)" },
              { value: "1.9", label: "Athlete (physical job or 2x training)" },
            ]}
          />
          <div className="flex flex-row gap-3 mt-4">
            <CalculateButton
              category="health"
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
              label="TDEE (Maintenance)"
              value={`${Math.round(tdee)} kcal`}
              badge={{ text: "Maintenance", color: "green" }}
              sub={`Activity: ${activityLabel} · ${calcSex === "male" ? "Male" : "Female"}, ${calcAge} yrs, ${calcWeightKg} kg`}
              glow="#10b981"
            />

            {/* Key Metrics */}
            <DashboardSection title="Energy Requirements">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard
                  index={0}
                  label="BMR (At Rest)"
                  value={`${Math.round(bmr)} kcal`}
                  accent="blue"
                  subValue={`${bmrPct}% of TDEE`}
                />
                <StatCard
                  index={1}
                  label="TDEE (Maintain)"
                  value={`${Math.round(tdee)} kcal`}
                  accent="green"
                  subValue="0 kg/week"
                />
                <StatCard
                  index={2}
                  label="Weight Loss"
                  value={`${Math.round(loseTarget)} kcal`}
                  accent="cyan"
                  subValue="-0.5 kg/week"
                />
                <StatCard
                  index={3}
                  label="Weight Gain"
                  value={`${Math.round(gainTarget)} kcal`}
                  accent="amber"
                  subValue="+0.5 kg/week"
                />
              </div>
            </DashboardSection>

            {/* Chart */}
            <DashboardSection title="Calorie Scenarios">
              <div className="rounded-xl border border-border/60 bg-card p-4 shadow-soft">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={calorieBars}
                      margin={{ top: 10, right: 10, left: 0, bottom: 24 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                        angle={0}
                      />
                      <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                      <Tooltip {...tooltipStyle} formatter={(v) => [`${v} kcal`, "Calories"]} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {calorieBars.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </DashboardSection>

            {/* Comparison */}
            <DashboardSection title="Detailed Plan Breakdown">
              <ComparisonTable
                headers={["Goal", "Daily Calories", "Weekly Change", "Monthly Calories"]}
                rows={comparisonRows}
                highlightColIndex={1}
              />
            </DashboardSection>

            {/* Insights */}
            <DashboardSection title="TDEE Insights">
              <div className="flex flex-col gap-2">
                <InsightCard
                  index={0}
                  tone="info"
                  text={`Your body naturally burns ${Math.round(bmr)} calories every day just to keep you alive (BMR). Your physical activity adds another ${Math.round(tdee - bmr)} calories to your daily burn rate.`}
                />
                <InsightCard
                  index={1}
                  tone="tip"
                  text={`To lose roughly 0.5 kg (1 lb) per week safely, maintain a daily intake of around ${Math.round(loseTarget)} calories. Pair this with adequate protein to preserve muscle.`}
                />
              </div>
            </DashboardSection>

            {/* Recommendations */}
            <DashboardSection title="Next Steps">
              <RecommendationList
                items={[
                  {
                    title: "Use TDEE as your baseline",
                    description:
                      "Your TDEE is an estimate. Try eating your calculated maintenance calories for two weeks, weight yourself daily, and see if your average weight shifts.",
                  },
                  {
                    title: "Adjust your activity multiplier",
                    description:
                      "If you feel exhausted or your weight drops too fast, you might be underestimating your physical activity level. Adjust your multiplier accordingly.",
                  },
                  {
                    title: "Don't eat below your BMR",
                    description: `Avoid dropping your calories consistently below your BMR (${Math.round(bmr)} kcal), as this can lead to muscle loss and a slower metabolism.`,
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

function F({
  label,
  value,
  onChange,
  onKeyDown,
}: {
  label: string;
  value: number | "";
  onChange: (n: number | "") => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}) {
  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val === "" ? "" : Number(val));
        }}
        onKeyDown={onKeyDown}
        className="mt-1"
      />
    </div>
  );
}
