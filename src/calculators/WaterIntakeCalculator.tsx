import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
<<<<<<< HEAD
import CalculatorBlog from "@/components/CalculatorBlog";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { blogContent } from "@/data/blogContent";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PDF_SITE_NAME, PDF_SITE_URL } from "@/constants/pdfBrand";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";

export function WaterIntakeCalculator() {
  const calc = getCalculator("water-intake-calculator")!;
  const { hasResult, markCalculated } = useHasCalculated();
=======
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCalculator } from "@/data/calculators";

export function WaterIntakeCalculator() {
  const calc = getCalculator("water-intake-calculator")!;
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
  const [weightKg, setWeightKg] = useState(70);
  const [activityMin, setActivityMin] = useState(30);

  const { liters, cups } = useMemo(() => {
    const baseMl = weightKg * 35;
    const extraMl = (activityMin / 30) * 350;
    const total = baseMl + extraMl;
    return { liters: total / 1000, cups: total / 240 };
  }, [weightKg, activityMin]);

<<<<<<< HEAD
  const pdfData = hasResult
    ? {
        calculatorName: "Water Intake Calculator",
        calculatorSlug: "water-intake-calculator",
        siteName: PDF_SITE_NAME,
        siteUrl: PDF_SITE_URL,
        inputs: [
          { label: "Weight", value: `${weightKg} kg` },
          { label: "Daily Exercise", value: `${activityMin} minutes` },
        ],
        results: [
          { label: "Recommended Intake", value: `${liters.toFixed(2)} L / day`, highlight: true },
          { label: "Equivalent Cups", value: `≈ ${cups.toFixed(1)} cups (240 ml)`, highlight: false },
          { label: "Base Hydration", value: `${((weightKg * 35) / 1000).toFixed(2)} L`, highlight: false },
          { label: "Exercise Bonus", value: `${(((activityMin / 30) * 350) / 1000).toFixed(2)} L`, highlight: false },
        ],
        summary: `For a ${weightKg} kg person with ${activityMin} minutes of daily exercise, aim for about ${liters.toFixed(2)} liters (${cups.toFixed(1)} cups) of water per day. Spread intake across the day and increase on hot days or during intense workouts.`,
      }
    : null;

=======
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Estimate how much water you should drink each day based on your weight and daily exercise level."
<<<<<<< HEAD
      formula={`Daily water (mL) = weight (kg) × 35 + (exercise minutes ÷ 30) × 350`}
      example={`70 kg body weight with 30 minutes of daily exercise.
Recommended intake ≈ 2.8 L (about 12 cups) per day.`}
=======
      formula={`Daily water (ml) = weight(kg) × 35 + (active minutes / 30) × 350`}
      example={`70 kg, 30 min of exercise: ≈ 2.8 L (about 12 cups) per day.`}
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
      faqs={[
        { q: "Do other drinks count?", a: "Tea, coffee and most foods contribute to hydration, but plain water is the most efficient way to meet daily needs." },
        { q: "Can I drink too much water?", a: "Very rarely — overhydration is uncommon outside of endurance events. Spread intake throughout the day." },
        { q: "Should I drink more in hot weather?", a: "Yes. Add 500–1000 ml on hot days or when sweating heavily." },
      ]}
    >
<<<<<<< HEAD
      <div className="calc-layout-grid">
        <div className="calc-input-column">
          <F label="Weight (kg)" value={weightKg} set={(v) => { setWeightKg(v); markCalculated(); }} />
          <F label="Daily exercise (minutes)" value={activityMin} set={(v) => { setActivityMin(v); markCalculated(); }} />
        </div>
        <div className="calc-result-panel select-copy flex flex-col">
          <div className="text-sm text-muted-foreground">Recommended intake</div>
          <div className="calc-result-hero text-gradient">{liters.toFixed(2)} L</div>
          <p className="text-sm text-muted-foreground mt-2">≈ {cups.toFixed(1)} cups (240 ml each)</p>
          <CalculatorPdfExport hasResult={hasResult} pdfData={pdfData} />
        </div>
      </div>
      <CalculatorBlog content={blogContent.water} />
=======
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <F label="Weight (kg)" value={weightKg} set={setWeightKg} />
          <F label="Daily exercise (minutes)" value={activityMin} set={setActivityMin} />
        </div>
        <div className="rounded-xl bg-muted/40 p-5">
          <div className="text-sm text-muted-foreground">Recommended intake</div>
          <div className="text-4xl font-bold mt-1 text-gradient">{liters.toFixed(2)} L</div>
          <p className="text-sm text-muted-foreground mt-2">≈ {cups.toFixed(1)} cups (240 ml each)</p>
        </div>
      </div>
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
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
