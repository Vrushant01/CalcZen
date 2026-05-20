import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getCalculator } from "@/data/calculators";

export function BMICalculator() {
  const calc = getCalculator("bmi-calculator")!;
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(72);
  const [heightIn, setHeightIn] = useState(69);
  const [weightLb, setWeightLb] = useState(160);

  const { bmi, category, color } = useMemo(() => {
    let bmi = 0;
    if (unit === "metric") {
      const m = heightCm / 100;
      bmi = m > 0 ? weightKg / (m * m) : 0;
    } else {
      bmi = heightIn > 0 ? (weightLb / (heightIn * heightIn)) * 703 : 0;
    }
    let category = "—", color = "text-muted-foreground";
    if (bmi > 0) {
      if (bmi < 18.5) { category = "Underweight"; color = "text-secondary"; }
      else if (bmi < 25) { category = "Normal weight"; color = "text-success"; }
      else if (bmi < 30) { category = "Overweight"; color = "text-chart-4"; }
      else { category = "Obese"; color = "text-destructive"; }
    }
    return { bmi, category, color };
  }, [unit, heightCm, weightKg, heightIn, weightLb]);

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Body Mass Index (BMI) is a quick way to estimate whether your weight is in a healthy range for your height. Use the calculator below in metric or imperial units."
      formula={`Metric:    BMI = weight(kg) / height(m)²
Imperial:  BMI = 703 × weight(lb) / height(in)²`}
      example={`A person 175 cm tall weighing 72 kg:
BMI = 72 / (1.75)² ≈ 23.5 — Normal weight.`}
      faqs={[
        { q: "What is a healthy BMI range?", a: "For most adults a BMI between 18.5 and 24.9 is considered healthy. Below 18.5 is underweight; 25–29.9 is overweight; 30+ is obese." },
        { q: "Does BMI work for athletes?", a: "BMI doesn't distinguish muscle from fat, so very muscular individuals can read as overweight even when healthy. Use it alongside body-fat measurements for a fuller picture." },
        { q: "Should I see a doctor about my BMI?", a: "BMI is a screening tool, not a diagnosis. Talk to a healthcare provider before changing your diet or activity level." },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="inline-flex rounded-lg bg-muted p-1">
            {(["metric","imperial"] as const).map((u) => (
              <button key={u} onClick={() => setUnit(u)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${unit===u?"bg-background shadow-sm":"text-muted-foreground"}`}>
                {u === "metric" ? "Metric" : "Imperial"}
              </button>
            ))}
          </div>

          {unit === "metric" ? (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Height (cm)" value={heightCm} onChange={setHeightCm} />
              <Field label="Weight (kg)" value={weightKg} onChange={setWeightKg} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Height (in)" value={heightIn} onChange={setHeightIn} />
              <Field label="Weight (lb)" value={weightLb} onChange={setWeightLb} />
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => { setHeightCm(175); setWeightKg(72); setHeightIn(69); setWeightLb(160); }}>Reset</Button>
        </div>
        <div className="rounded-xl bg-muted/40 p-5">
          <div className="text-sm text-muted-foreground">Your BMI</div>
          <div className="text-5xl font-bold mt-1 text-gradient">{bmi.toFixed(1)}</div>
          <div className={`mt-2 text-lg font-semibold ${color}`}>{category}</div>
          <div className="mt-6 h-3 w-full rounded-full bg-gradient-to-r from-secondary via-success via-chart-4 to-destructive relative">
            <div className="absolute -top-1.5 -ml-2 h-6 w-1 bg-foreground rounded"
              style={{ left: `${Math.min(100, Math.max(0, ((bmi - 15) / 25) * 100))}%` }} />
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground mt-1.5">
            <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
          </div>
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void; }) {
  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Input type="number" value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} className="mt-1" />
    </div>
  );
}
