import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCalculator } from "@/data/calculators";

export function BMRCalculator() {
  const calc = getCalculator("bmr-calculator")!;
  const [sex, setSex] = useState<"male"|"female">("male");
  const [age, setAge] = useState(30);
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(72);

  const bmr = useMemo(() => {
    return sex === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }, [sex, age, heightCm, weightKg]);

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Your Basal Metabolic Rate (BMR) is the energy your body burns at complete rest — just to keep your heart, lungs, and brain running."
      formula={`Mifflin-St Jeor:
  Male:   10×kg + 6.25×cm − 5×age + 5
  Female: 10×kg + 6.25×cm − 5×age − 161`}
      example={`30-year-old male, 175 cm, 72 kg → BMR ≈ 1,679 kcal/day.`}
      faqs={[
        { q: "What's the difference between BMR and TDEE?", a: "BMR is calories at rest; TDEE multiplies BMR by your activity level to estimate total daily calories burned." },
        { q: "Does BMR change?", a: "Yes — it shifts with age, weight, muscle mass and hormones. Recalculate every few months as your weight changes." },
      ]}
    >
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
