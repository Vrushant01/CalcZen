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

export function BMRCalculator() {
  const calc = getCalculator("bmr-calculator")!;
  const { hasResult, markCalculated } = useHasCalculated();
  const [sex, setSex] = useState<"male" | "female">("male");
=======
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCalculator } from "@/data/calculators";

export function BMRCalculator() {
  const calc = getCalculator("bmr-calculator")!;
  const [sex, setSex] = useState<"male"|"female">("male");
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
  const [age, setAge] = useState(30);
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(72);

  const bmr = useMemo(() => {
    return sex === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }, [sex, age, heightCm, weightKg]);

<<<<<<< HEAD
  const pdfData = hasResult
    ? {
        calculatorName: "BMR Calculator",
        calculatorSlug: "bmr-calculator",
        siteName: PDF_SITE_NAME,
        siteUrl: PDF_SITE_URL,
        inputs: [
          { label: "Sex", value: sex === "male" ? "Male" : "Female" },
          { label: "Age", value: `${age} years` },
          { label: "Height", value: `${heightCm} cm` },
          { label: "Weight", value: `${weightKg} kg` },
        ],
        results: [
          { label: "Basal Metabolic Rate", value: `${Math.round(bmr)} kcal/day`, highlight: true },
          { label: "Sedentary TDEE (est.)", value: `${Math.round(bmr * 1.2)} kcal/day`, highlight: false },
          { label: "Moderate TDEE (est.)", value: `${Math.round(bmr * 1.55)} kcal/day`, highlight: false },
          { label: "Very Active TDEE (est.)", value: `${Math.round(bmr * 1.725)} kcal/day`, highlight: false },
        ],
        summary: `Your BMR of ${Math.round(bmr)} kcal/day is the energy your body burns at complete rest. Multiply by an activity factor for total daily needs — about ${Math.round(bmr * 1.55)} kcal/day with moderate activity. Recalculate as your weight changes.`,
      }
    : null;

=======
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Your Basal Metabolic Rate (BMR) is the energy your body burns at complete rest — just to keep your heart, lungs, and brain running."
<<<<<<< HEAD
      formula={`Male BMR: 10×kg + 6.25×cm − 5×age + 5
Female BMR: 10×kg + 6.25×cm − 5×age − 161`}
      example={`30-year-old male, 175 cm tall, 72 kg.
BMR ≈ 1,679 kcal/day at rest.`}
=======
      formula={`Mifflin-St Jeor:
  Male:   10×kg + 6.25×cm − 5×age + 5
  Female: 10×kg + 6.25×cm − 5×age − 161`}
      example={`30-year-old male, 175 cm, 72 kg → BMR ≈ 1,679 kcal/day.`}
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
      faqs={[
        { q: "What's the difference between BMR and TDEE?", a: "BMR is calories at rest; TDEE multiplies BMR by your activity level to estimate total daily calories burned." },
        { q: "Does BMR change?", a: "Yes — it shifts with age, weight, muscle mass and hormones. Recalculate every few months as your weight changes." },
      ]}
    >
<<<<<<< HEAD
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <F label="Age" value={age} set={(v) => { setAge(v); markCalculated(); }} />
            <F label="Height (cm)" value={heightCm} set={(v) => { setHeightCm(v); markCalculated(); }} />
            <F label="Weight (kg)" value={weightKg} set={(v) => { setWeightKg(v); markCalculated(); }} />
          </div>
        </div>
        <div className="calc-result-panel select-copy flex flex-col">
          <div className="text-sm text-muted-foreground">Your BMR</div>
          <div className="calc-result-hero text-gradient">{Math.round(bmr)} kcal/day</div>
          <CalculatorPdfExport hasResult={hasResult} pdfData={pdfData} />
        </div>
      </div>
      <CalculatorBlog content={blogContent.bmr} />
=======
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="inline-flex rounded-lg bg-muted p-1">
            {(["male","female"] as const).map((s) => (
              <button key={s} onClick={() => setSex(s)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize ${sex===s?"bg-background shadow-sm":"text-muted-foreground"}`}>{s}</button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <F label="Age" value={age} set={setAge} />
            <F label="Height (cm)" value={heightCm} set={setHeightCm} />
            <F label="Weight (kg)" value={weightKg} set={setWeightKg} />
          </div>
        </div>
        <div className="rounded-xl bg-muted/40 p-5">
          <div className="text-sm text-muted-foreground">Your BMR</div>
          <div className="text-4xl font-bold mt-1 text-gradient">{Math.round(bmr)} kcal/day</div>
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
