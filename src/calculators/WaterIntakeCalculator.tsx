import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCalculator } from "@/data/calculators";

export function WaterIntakeCalculator() {
  const calc = getCalculator("water-intake-calculator")!;
  const [weightKg, setWeightKg] = useState(70);
  const [activityMin, setActivityMin] = useState(30);

  const { liters, cups } = useMemo(() => {
    const baseMl = weightKg * 35;
    const extraMl = (activityMin / 30) * 350;
    const total = baseMl + extraMl;
    return { liters: total / 1000, cups: total / 240 };
  }, [weightKg, activityMin]);

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Estimate how much water you should drink each day based on your weight and daily exercise level."
      formula={`Daily water (ml) = weight(kg) × 35 + (active minutes / 30) × 350`}
      example={`70 kg, 30 min of exercise: ≈ 2.8 L (about 12 cups) per day.`}
      faqs={[
        { q: "Do other drinks count?", a: "Tea, coffee and most foods contribute to hydration, but plain water is the most efficient way to meet daily needs." },
        { q: "Can I drink too much water?", a: "Very rarely — overhydration is uncommon outside of endurance events. Spread intake throughout the day." },
        { q: "Should I drink more in hot weather?", a: "Yes. Add 500–1000 ml on hot days or when sweating heavily." },
      ]}
    >
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
