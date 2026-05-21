import { useMemo, useState } from "react";
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

export function BMICalculator() {
  const calc = getCalculator("bmi-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(72);
  const [heightIn, setHeightIn] = useState(69);
  const [weightLb, setWeightLb] = useState(160);

  const { bmi, category, color, healthyMin, healthyMax, bmiPrime } = useMemo(() => {
    let bmi = 0;
    let heightM = 0;
    if (unit === "metric") {
      heightM = heightCm / 100;
      bmi = heightM > 0 ? weightKg / (heightM * heightM) : 0;
    } else {
      bmi = heightIn > 0 ? (weightLb / (heightIn * heightIn)) * 703 : 0;
      heightM = heightIn * 0.0254;
    }
    let category = "—", color = "text-muted-foreground";
    if (bmi > 0) {
      if (bmi < 18.5) { category = "Underweight"; color = "text-secondary"; }
      else if (bmi < 25) { category = "Normal weight"; color = "text-success"; }
      else if (bmi < 30) { category = "Overweight"; color = "text-chart-4"; }
      else { category = "Obese"; color = "text-destructive"; }
    }
    const healthyMin = heightM > 0 ? 18.5 * heightM * heightM : 0;
    const healthyMax = heightM > 0 ? 24.9 * heightM * heightM : 0;
    const bmiPrime = bmi > 0 ? bmi / 25 : 0;
    return { bmi, category, color, healthyMin, healthyMax, bmiPrime };
  }, [unit, heightCm, weightKg, heightIn, weightLb]);

  const weightRangeLabel =
    unit === "metric"
      ? `${healthyMin.toFixed(1)}–${healthyMax.toFixed(1)} kg`
      : `${(healthyMin * 2.20462).toFixed(0)}–${(healthyMax * 2.20462).toFixed(0)} lb`;

  const pdfData =
    hasResult && bmi > 0
      ? {
          calculatorName: "BMI Calculator",
          calculatorSlug: "bmi-calculator",
          siteName: PDF_SITE_NAME,
          siteUrl: PDF_SITE_URL,
          inputs: [
            { label: "Unit System", value: unit === "metric" ? "Metric" : "Imperial" },
            ...(unit === "metric"
              ? [
                  { label: "Height", value: `${heightCm} cm` },
                  { label: "Weight", value: `${weightKg} kg` },
                ]
              : [
                  { label: "Height", value: `${heightIn} in` },
                  { label: "Weight", value: `${weightLb} lb` },
                ]),
          ],
          results: [
            { label: "BMI Score", value: bmi.toFixed(1), highlight: true },
            { label: "Category", value: category, highlight: true },
            { label: "Healthy Weight Range", value: weightRangeLabel, highlight: false },
            { label: "BMI Prime", value: bmiPrime.toFixed(2), highlight: false },
          ],
          summary: `Your BMI of ${bmi.toFixed(1)} places you in the ${category.toLowerCase()} range. A healthy BMI for your height is between 18.5 and 24.9, which corresponds to ${weightRangeLabel}. This is a screening tool only — always consult your doctor for a full health assessment.`,
        }
      : null;

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
      <div className="calc-layout-grid">
        <div className="calc-input-column">
          <div className="inline-flex rounded-lg bg-muted p-1">
            {(["metric", "imperial"] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => {
                  setUnit(u);
                  markCalculated();
                }}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${unit === u ? "bg-background shadow-sm" : "text-muted-foreground"}`}
              >
                {u === "metric" ? "Metric" : "Imperial"}
              </button>
            ))}
          </div>

          {unit === "metric" ? (
            <div className="calc-field-grid-2">
              <Field label="Height (cm)" value={heightCm} onChange={(v) => { setHeightCm(v); markCalculated(); }} />
              <Field label="Weight (kg)" value={weightKg} onChange={(v) => { setWeightKg(v); markCalculated(); }} />
            </div>
          ) : (
            <div className="calc-field-grid-2">
              <Field label="Height (in)" value={heightIn} onChange={(v) => { setHeightIn(v); markCalculated(); }} />
              <Field label="Weight (lb)" value={weightLb} onChange={(v) => { setWeightLb(v); markCalculated(); }} />
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setHeightCm(175);
              setWeightKg(72);
              setHeightIn(69);
              setWeightLb(160);
              resetCalculated();
            }}
          >
            Reset
          </Button>
        </div>
        <div className="calc-result-panel select-copy flex flex-col">
          <div className="text-sm text-muted-foreground">Your BMI</div>
          <div className="calc-result-hero text-gradient">{bmi.toFixed(1)}</div>
          <div className={`mt-2 text-lg font-semibold ${color}`}>{category}</div>
          <div className="mt-6 h-3 w-full rounded-full bg-gradient-to-r from-secondary via-success via-chart-4 to-destructive relative">
            <div
              className="absolute -top-1.5 -ml-2 h-6 w-1 bg-foreground rounded"
              style={{ left: `${Math.min(100, Math.max(0, ((bmi - 15) / 25) * 100))}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground mt-1.5">
            <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
          </div>
          <CalculatorPdfExport hasResult={hasResult && bmi > 0} pdfData={pdfData} />
        </div>
      </div>
      <CalculatorBlog content={blogContent.bmi} />
    </CalculatorPageLayout>
  );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Input type="number" value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} className="mt-1" />
    </div>
  );
}
