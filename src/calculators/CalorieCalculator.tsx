import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog from "@/components/CalculatorBlog";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { blogContent } from "@/data/blogContent";
import { CalculatorSelect } from "@/components/CalculatorSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PDF_SITE_NAME, PDF_SITE_URL } from "@/constants/pdfBrand";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";

const ACTIVITY_LABELS: Record<string, string> = {
  "1.2": "Sedentary",
  "1.375": "Light",
  "1.55": "Moderate",
  "1.725": "Very active",
  "1.9": "Extra active",
};

export function CalorieCalculator() {
  const calc = getCalculator("calorie-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();
  const [sex, setSex] = useState<"male" | "female">("male");
  const [age, setAge] = useState(30);
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(72);
  const [activity, setActivity] = useState(1.55);
  const [goal, setGoal] = useState<"maintain" | "lose" | "gain">("maintain");

  const { bmr, tdee, target } = useMemo(() => {
    const bmr =
      sex === "male"
        ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    const tdee = bmr * activity;
    const target = goal === "maintain" ? tdee : goal === "lose" ? tdee - 500 : tdee + 300;
    return { bmr, tdee, target };
  }, [sex, age, heightCm, weightKg, activity, goal]);

  const activityLabel = ACTIVITY_LABELS[String(activity)] ?? "Custom";

  const pdfData = hasResult
    ? {
        calculatorName: "Calorie Calculator",
        calculatorSlug: "calorie-calculator",
        siteName: PDF_SITE_NAME,
        siteUrl: PDF_SITE_URL,
        inputs: [
          { label: "Sex", value: sex === "male" ? "Male" : "Female" },
          { label: "Age", value: `${age} years` },
          { label: "Height", value: `${heightCm} cm` },
          { label: "Weight", value: `${weightKg} kg` },
          { label: "Activity Level", value: activityLabel },
          { label: "Goal", value: `${goal} weight` },
        ],
        results: [
          { label: "Daily Calorie Target", value: `${Math.round(target)} kcal`, highlight: true },
          { label: "BMR (at rest)", value: `${Math.round(bmr)} kcal`, highlight: false },
          { label: "TDEE (maintenance)", value: `${Math.round(tdee)} kcal`, highlight: false },
          {
            label: "Weekly change (approx.)",
            value: goal === "lose" ? "−0.5 kg/week" : goal === "gain" ? "+0.3 kg/week" : "Maintain",
            highlight: false,
          },
        ],
        summary: `To ${goal} weight, aim for about ${Math.round(target)} kcal per day. Your BMR is ${Math.round(bmr)} kcal and maintenance (TDEE) is ${Math.round(tdee)} kcal with ${activityLabel.toLowerCase()} activity. Track for 2–3 weeks and adjust by 100–200 kcal if needed.`,
      }
    : null;

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Estimate the calories you need each day to maintain, lose or gain weight. Uses the Mifflin-St Jeor equation, the most accurate formula recommended by dietitians."
      formula={`BMR (Mifflin-St Jeor):
  Male:   10×kg + 6.25×cm − 5×age + 5
  Female: 10×kg + 6.25×cm − 5×age − 161
TDEE = BMR × activity multiplier`}
      example={`30-year-old male, 175 cm, 72 kg, moderate activity (1.55):
BMR ≈ 1,679 kcal · TDEE ≈ 2,602 kcal/day to maintain.`}
      faqs={[
        { q: "Why a 500-calorie deficit for weight loss?", a: "A daily 500-calorie deficit creates roughly a 0.5 kg (≈1 lb) loss per week, a sustainable rate recommended by most health authorities." },
        { q: "Are these numbers exact?", a: "They're a strong starting point. Track your weight for two to three weeks and adjust by 100–200 calories if results are too fast or too slow." },
        { q: "What activity level should I pick?", a: "Sedentary = desk job, no exercise. Moderate = workouts 3–5 days/week. Very active = physical job or daily intense training." },
      ]}
    >
      <div className="calc-layout-grid">
        <div className="calc-input-column">
          <div className="inline-flex rounded-lg bg-muted p-1">
            {(["male", "female"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSex(s);
                  markCalculated();
                }}
                className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize ${sex === s ? "bg-background shadow-sm" : "text-muted-foreground"}`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <F label="Age" value={age} set={(v) => { setAge(v); markCalculated(); }} />
            <F label="Height (cm)" value={heightCm} set={(v) => { setHeightCm(v); markCalculated(); }} />
            <F label="Weight (kg)" value={weightKg} set={(v) => { setWeightKg(v); markCalculated(); }} />
          </div>
          <CalculatorSelect
            label="Activity level"
            value={activity}
            onValueChange={(v) => {
              setActivity(Number(v));
              markCalculated();
            }}
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
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    setGoal(g);
                    markCalculated();
                  }}
                  className={`px-3 py-2 rounded-md text-sm font-medium border capitalize ${goal === g ? "bg-accent text-accent-foreground border-accent" : "border-border hover:bg-muted"}`}
                >
                  {g} weight
                </button>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSex("male");
              setAge(30);
              setHeightCm(175);
              setWeightKg(72);
              setActivity(1.55);
              setGoal("maintain");
              resetCalculated();
            }}
          >
            Reset
          </Button>
        </div>
        <div className="calc-result-panel select-copy flex flex-col">
          <div className="text-sm text-muted-foreground">Daily calorie target</div>
          <div className="calc-result-hero text-gradient">{Math.round(target)} kcal</div>
          <dl className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2.5 text-sm">
            <div><dt className="text-muted-foreground">BMR</dt><dd className="font-semibold">{Math.round(bmr)} kcal</dd></div>
            <div><dt className="text-muted-foreground">TDEE</dt><dd className="font-semibold">{Math.round(tdee)} kcal</dd></div>
          </dl>
          <CalculatorPdfExport hasResult={hasResult} pdfData={pdfData} />
        </div>
      </div>
      <CalculatorBlog content={blogContent.calorie} />
    </CalculatorPageLayout>
  );
}

function F({ label, value, set }: { label: string; value: number; set: (n: number) => void }) {
  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Input type="number" value={value} onChange={(e) => set(Number(e.target.value) || 0)} className="mt-1" />
    </div>
  );
}
