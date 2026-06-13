import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalculateButton } from "@/components/CalculateButton";
import { PDF_SITE_NAME, PDF_SITE_URL } from "@/constants/pdfBrand";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { motion } from "framer-motion";
import {
  HeroMetric,
  StatCard,
  DashboardSection,
  InsightCard,
  RecommendationList,
} from "@/components/dashboard";
import { Switch } from "@/components/ui/switch";
import { AlertCircle } from "lucide-react";

type FatCategory = {
  label: string;
  badgeColor: "green" | "blue" | "amber" | "red" | "purple" | "default";
  accent: "green" | "blue" | "amber" | "red" | "purple" | "cyan" | "default";
};

function getFatCategory(bf: number, gender: "male" | "female"): FatCategory {
  if (bf <= 0) return { label: "—", badgeColor: "default", accent: "default" };
  if (gender === "male") {
    if (bf < 2) return { label: "Critically Low", badgeColor: "red", accent: "red" };
    if (bf <= 5) return { label: "Essential Fat", badgeColor: "blue", accent: "blue" };
    if (bf <= 13) return { label: "Athletes", badgeColor: "green", accent: "green" };
    if (bf <= 17) return { label: "Fitness", badgeColor: "green", accent: "green" };
    if (bf <= 24) return { label: "Acceptable", badgeColor: "amber", accent: "amber" };
    return { label: "Obesity", badgeColor: "red", accent: "red" };
  } else {
    if (bf < 10) return { label: "Critically Low", badgeColor: "red", accent: "red" };
    if (bf <= 13) return { label: "Essential Fat", badgeColor: "blue", accent: "blue" };
    if (bf <= 20) return { label: "Athletes", badgeColor: "green", accent: "green" };
    if (bf <= 24) return { label: "Fitness", badgeColor: "green", accent: "green" };
    if (bf <= 31) return { label: "Acceptable", badgeColor: "amber", accent: "amber" };
    return { label: "Obesity", badgeColor: "red", accent: "red" };
  }
}

export function BodyFatCalculator() {
  const calc = getCalculator("body-fat-calculator") || {
    id: "body-fat-calculator",
    slug: "body-fat-calculator",
    name: "Body Fat Calculator",
    description: "Estimate your body fat percentage using the U.S. Navy Method.",
    category: "Health & Fitness",
  };

  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();
  const [unit, setUnit] = useState<"metric" | "imperial">("imperial");
  const [gender, setGender] = useState<"male" | "female">("male");

  // Inputs
  const [heightCm, setHeightCm] = useState<number | "">(178);
  const [weightKg, setWeightKg] = useState<number | "">(80);
  const [neckCm, setNeckCm] = useState<number | "">(38);
  const [waistCm, setWaistCm] = useState<number | "">(90);
  const [hipCm, setHipCm] = useState<number | "">(100);

  const [heightIn, setHeightIn] = useState<number | "">(70);
  const [weightLb, setWeightLb] = useState<number | "">(176);
  const [neckIn, setNeckIn] = useState<number | "">(15);
  const [waistIn, setWaistIn] = useState<number | "">(35);
  const [hipIn, setHipIn] = useState<number | "">(39);

  // Computed state
  const [calcState, setCalcState] = useState<{
    unit: "metric" | "imperial";
    gender: "male" | "female";
    heightCm: number;
    weightKg: number;
    neckCm: number;
    waistCm: number;
    hipCm: number;
  } | null>(null);

  const { bodyFatPct, category, fatMass, leanMass, fatMassLabel, leanMassLabel } = useMemo(() => {
    if (!calcState)
      return {
        bodyFatPct: 0,
        category: getFatCategory(0, "male"),
        fatMass: 0,
        leanMass: 0,
        fatMassLabel: "",
        leanMassLabel: "",
      };

    const { gender, heightCm, neckCm, waistCm, hipCm, weightKg, unit } = calcState;
    let bf = 0;

    if (gender === "male") {
      // Metric formula: 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
      const wMinusN = waistCm - neckCm;
      if (wMinusN > 0 && heightCm > 0) {
        bf = 495 / (1.0324 - 0.19077 * Math.log10(wMinusN) + 0.15456 * Math.log10(heightCm)) - 450;
      }
    } else {
      // Metric formula: 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
      const wPlusHMinusN = waistCm + hipCm - neckCm;
      if (wPlusHMinusN > 0 && heightCm > 0) {
        bf =
          495 / (1.29579 - 0.35004 * Math.log10(wPlusHMinusN) + 0.221 * Math.log10(heightCm)) - 450;
      }
    }

    if (bf < 0) bf = 0;
    if (bf > 80) bf = 80;

    const cat = getFatCategory(bf, gender);
    const fatM = weightKg * (bf / 100);
    const leanM = weightKg - fatM;

    const fatMassLabel =
      unit === "metric" ? `${fatM.toFixed(1)} kg` : `${(fatM * 2.20462).toFixed(1)} lbs`;
    const leanMassLabel =
      unit === "metric" ? `${leanM.toFixed(1)} kg` : `${(leanM * 2.20462).toFixed(1)} lbs`;

    return {
      bodyFatPct: bf,
      category: cat,
      fatMass: fatM,
      leanMass: leanM,
      fatMassLabel,
      leanMassLabel,
    };
  }, [calcState]);

  const isButtonDisabled =
    unit === "metric"
      ? !heightCm || !weightKg || !neckCm || !waistCm || (gender === "female" && !hipCm)
      : !heightIn || !weightLb || !neckIn || !waistIn || (gender === "female" && !hipIn);

  const handleCalculate = () => {
    if (isButtonDisabled) return;

    let hCm = 0,
      wKg = 0,
      nCm = 0,
      waCm = 0,
      hPCm = 0;

    if (unit === "metric") {
      hCm = Number(heightCm);
      wKg = Number(weightKg);
      nCm = Number(neckCm);
      waCm = Number(waistCm);
      hPCm = gender === "female" ? Number(hipCm) : 0;
    } else {
      hCm = Number(heightIn) * 2.54;
      wKg = Number(weightLb) * 0.453592;
      nCm = Number(neckIn) * 2.54;
      waCm = Number(waistIn) * 2.54;
      hPCm = gender === "female" ? Number(hipIn) * 2.54 : 0;
    }

    setCalcState({
      unit,
      gender,
      heightCm: hCm,
      weightKg: wKg,
      neckCm: nCm,
      waistCm: waCm,
      hipCm: hPCm,
    });

    markCalculated();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isButtonDisabled) handleCalculate();
  };

  const handleReset = () => {
    setHeightCm(178);
    setWeightKg(80);
    setNeckCm(38);
    setWaistCm(90);
    setHipCm(100);
    setHeightIn(70);
    setWeightLb(176);
    setNeckIn(15);
    setWaistIn(35);
    setHipIn(39);
    setUnit("imperial");
    setGender("male");
    resetCalculated();
    setCalcState(null);
  };

  const pdfData =
    hasResult && calcState
      ? {
          calculatorName: "Body Fat Calculator",
          calculatorSlug: "body-fat-calculator",
          siteName: PDF_SITE_NAME,
          siteUrl: PDF_SITE_URL,
          inputs: [
            { label: "Gender", value: calcState.gender === "male" ? "Male" : "Female" },
            { label: "System", value: calcState.unit === "metric" ? "Metric" : "Imperial" },
            {
              label: "Height",
              value:
                calcState.unit === "metric"
                  ? `${calcState.heightCm.toFixed(1)} cm`
                  : `${(calcState.heightCm / 2.54).toFixed(1)} in`,
            },
            {
              label: "Weight",
              value:
                calcState.unit === "metric"
                  ? `${calcState.weightKg.toFixed(1)} kg`
                  : `${(calcState.weightKg * 2.20462).toFixed(1)} lbs`,
            },
            {
              label: "Neck",
              value:
                calcState.unit === "metric"
                  ? `${calcState.neckCm.toFixed(1)} cm`
                  : `${(calcState.neckCm / 2.54).toFixed(1)} in`,
            },
            {
              label: "Waist",
              value:
                calcState.unit === "metric"
                  ? `${calcState.waistCm.toFixed(1)} cm`
                  : `${(calcState.waistCm / 2.54).toFixed(1)} in`,
            },
            ...(calcState.gender === "female"
              ? [
                  {
                    label: "Hip",
                    value:
                      calcState.unit === "metric"
                        ? `${calcState.hipCm.toFixed(1)} cm`
                        : `${(calcState.hipCm / 2.54).toFixed(1)} in`,
                  },
                ]
              : []),
          ],
          results: [
            { label: "Body Fat Percentage", value: `${bodyFatPct.toFixed(1)}%`, highlight: true },
            { label: "Category", value: category.label, highlight: true },
            { label: "Fat Mass", value: fatMassLabel, highlight: false },
            { label: "Lean Body Mass", value: leanMassLabel, highlight: false },
          ],
          summary: `Your estimated body fat percentage is ${bodyFatPct.toFixed(1)}%, which falls into the '${category.label}' category. This means you carry approximately ${fatMassLabel} of fat mass and ${leanMassLabel} of lean body mass.`,
        }
      : null;

  return (
    <CalculatorPageLayout
      calc={calc as any}
      intro="Estimate your body fat percentage, lean mass, and fat mass using the widely trusted U.S. Navy Method. This calculator requires just a measuring tape and your height and weight."
      formula={`Male: 495 / (1.0324 - 0.19077 * log10(Waist - Neck) + 0.15456 * log10(Height)) - 450\nFemale: 495 / (1.29579 - 0.35004 * log10(Waist + Hip - Neck) + 0.22100 * log10(Height)) - 450`}
      example={`A male with a waist of 35", neck of 15", and height of 70" has a Body Fat % of ~16.5%.`}
      faqs={[
        {
          q: "What is the U.S. Navy Method?",
          a: "The U.S. Navy Method is an established formula developed by the military to estimate body fat percentage using simple circumference measurements (neck, waist, and hip for women) along with height. It offers a practical alternative to expensive medical scans like DEXA.",
        },
        {
          q: "Why is neck measurement needed?",
          a: "The neck measurement is subtracted from your waist (and hip) measurements in the formula because neck circumference generally correlates with lean body mass and bone structure rather than fat storage. This helps offset the overall body circumference to provide a more accurate fat estimate.",
        },
        {
          q: "How accurate is this calculator?",
          a: "The U.S. Navy Method is generally accurate within 3-4% for most of the population. While it is not as precise as a DEXA scan or hydrostatic weighing, it is highly reliable for tracking progress over time since it relies on consistent bodily measurements.",
        },
        {
          q: "Where exactly should I measure my waist?",
          a: "For men, measure horizontally around the navel (belly button). For women, measure the narrowest point of the waist, usually halfway between the bottom of the ribs and the top of the hip bones.",
        },
        {
          q: "Where exactly should I measure my hips?",
          a: "If you are a female, measure the hips around the widest part of the buttocks and hips. Make sure the tape is horizontal and snug but not compressing the skin.",
        },
        {
          q: "How tight should the measuring tape be?",
          a: "The measuring tape should be snug against the skin but not pulled so tight that it creates an indentation or compresses the underlying tissue.",
        },
        {
          q: "What is considered a healthy body fat percentage?",
          a: "For men, a healthy range is typically 10-20%, with athletes being closer to 6-13%. For women, healthy ranges are generally 20-30%, with athletes ranging from 14-20%. Percentages vary widely based on age and fitness goals.",
        },
        {
          q: "Why do women naturally have more body fat?",
          a: "Women naturally carry more essential body fat (about 10-13% compared to 2-5% for men) due to hormonal differences and the biological demands of childbearing. This 'essential fat' is necessary for proper hormonal function and overall health.",
        },
      ]}
      blog={
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">Understanding Body Fat Percentage</h2>
            <p>
              Your <strong>body fat percentage</strong> is the total mass of your fat divided by
              your total body mass, multiplied by 100. It consists of essential body fat and storage
              body fat. Unlike Body Mass Index (BMI), which only considers height and weight, body
              fat percentage provides a much more accurate picture of your body composition and
              overall health.
            </p>
            <p>
              By distinguishing between fat mass and lean body mass (muscle, bone, water, organs),
              you can better evaluate the effectiveness of your fitness and nutrition regimen. If
              you are losing weight, measuring body fat ensures you are losing fat rather than
              valuable muscle tissue.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-3 mt-8">The U.S. Navy Measurement Method</h3>
            <p>
              Developed by researchers at the Naval Health Research Center in 1984, the U.S. Navy
              Method provides a highly accessible way to estimate body fat. It was designed to
              assess the physical readiness of military personnel without requiring costly or
              immobile equipment.
            </p>
            <p>To ensure the most accurate results, follow these strict measurement protocols:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Neck:</strong> Measure just below the larynx (Adam's apple), keeping the
                tape perfectly horizontal. Do not flare your neck or shrug your shoulders.
              </li>
              <li>
                <strong>Waist (Men):</strong> Measure directly at the level of the navel (belly
                button). Do not suck in your stomach; breathe normally and measure after a normal
                exhalation.
              </li>
              <li>
                <strong>Waist (Women):</strong> Measure at the narrowest point of the torso, usually
                located just above the belly button and below the rib cage.
              </li>
              <li>
                <strong>Hips (Women only):</strong> Measure around the widest protrusion of the hips
                and buttocks. Ensure the tape is parallel to the floor.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-3 mt-8">Body Fat Categories Explained</h3>
            <p>
              According to the American Council on Exercise (ACE), body fat falls into several
              distinct categories. Note that men and women have different thresholds due to
              biological variations.
            </p>
            <div className="overflow-x-auto my-6">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 dark:border-slate-700">
                    <th className="py-2 px-4 font-semibold">Description</th>
                    <th className="py-2 px-4 font-semibold">Women</th>
                    <th className="py-2 px-4 font-semibold">Men</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-2 px-4">Essential Fat</td>
                    <td className="py-2 px-4">10 - 13%</td>
                    <td className="py-2 px-4">2 - 5%</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-2 px-4">Athletes</td>
                    <td className="py-2 px-4">14 - 20%</td>
                    <td className="py-2 px-4">6 - 13%</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-2 px-4">Fitness</td>
                    <td className="py-2 px-4">21 - 24%</td>
                    <td className="py-2 px-4">14 - 17%</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-2 px-4">Acceptable</td>
                    <td className="py-2 px-4">25 - 31%</td>
                    <td className="py-2 px-4">18 - 24%</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-2 px-4">Obesity</td>
                    <td className="py-2 px-4">&gt; 32%</td>
                    <td className="py-2 px-4">&gt; 25%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              <strong>Essential Fat:</strong> This is the absolute minimum amount of fat necessary
              for basic physical and physiological health. Dipping below this level can disrupt
              hormonal balances, impair temperature regulation, and compromise internal organ
              protection.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-3 mt-8">Limitations of the Tape Measure Method</h3>
            <p>
              While incredibly convenient, the Navy Method is an empirical estimation, not a direct
              measurement. It assumes standard fat distribution based on vast population averages.
              Individuals who naturally store more fat in their extremities (arms and legs) rather
              than their torso might receive an underestimation.
            </p>
            <p>
              Similarly, highly muscular individuals with dense, thick abdominal muscles might see
              slight overestimations, though the neck measurement typically helps buffer this
              discrepancy.
            </p>
            <p>
              For clinical accuracy, methods like Dual-Energy X-Ray Absorptiometry (DEXA) scans,
              hydrostatic (underwater) weighing, or air displacement plethysmography (Bod Pod)
              remain the gold standard, offering precision typically within 1-2%.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-3 mt-8">Tracking Your Progress</h3>
            <p>
              Consistency is key when using tape measurements to track your body fat percentage:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Measure yourself at the same time of day under the same conditions (e.g., in the
                morning, before breakfast, after using the restroom).
              </li>
              <li>
                Use a non-stretching fiberglass or specialized body-measuring tape. Cloth tapes can
                stretch over time, skewing results.
              </li>
              <li>
                Take the average of three consecutive measurements per site to minimize human error.
              </li>
            </ul>
            <p>
              Rather than obsessing over the exact percentage output, use the metric to monitor{" "}
              <em>trends</em>. A steady downward trend in your calculated body fat over several
              months proves your fat-loss regimen is working, regardless of whether your true
              absolute fat percentage is slightly higher or lower than the estimate.
            </p>
          </section>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Medical Disclaimer Banner */}
        <div className="medical-alert border rounded-lg p-4 flex gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 medical-alert-icon" />
          <div className="medical-alert-text">
            <strong className="medical-alert-title mr-1">Medical Disclaimer:</strong> This calculator provides an estimate of your body
            fat percentage for informational and fitness tracking purposes only. It is not intended
            to diagnose, treat, or prevent any medical condition. Always consult with a qualified
            healthcare provider or registered dietitian before beginning any new diet or exercise
            program.
          </div>
        </div>

        <div className="calc-input-column">
          <div className="flex justify-between items-center w-full mb-2">
            <div className="inline-flex rounded-lg bg-muted p-1">
              {(["metric", "imperial"] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${unit === u ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                >
                  {u === "metric" ? "Metric" : "Imperial"}
                </button>
              ))}
            </div>

            <div className="inline-flex rounded-lg bg-muted p-1">
              {(["male", "female"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${gender === g ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                >
                  {g === "male" ? "Male" : "Female"}
                </button>
              ))}
            </div>
          </div>

          <div className="calc-field-grid-2">
            <Field
              label={unit === "metric" ? "Height (cm)" : "Height (inches)"}
              value={unit === "metric" ? heightCm : heightIn}
              onChange={(v) => (unit === "metric" ? setHeightCm(v) : setHeightIn(v))}
              onKeyDown={handleKeyDown}
            />
            <Field
              label={unit === "metric" ? "Weight (kg)" : "Weight (lbs)"}
              value={unit === "metric" ? weightKg : weightLb}
              onChange={(v) => (unit === "metric" ? setWeightKg(v) : setWeightLb(v))}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="calc-field-grid-2">
            <Field
              label={unit === "metric" ? "Neck (cm)" : "Neck (inches)"}
              value={unit === "metric" ? neckCm : neckIn}
              onChange={(v) => (unit === "metric" ? setNeckCm(v) : setNeckIn(v))}
              onKeyDown={handleKeyDown}
            />
            <Field
              label={unit === "metric" ? "Waist (cm)" : "Waist (inches)"}
              value={unit === "metric" ? waistCm : waistIn}
              onChange={(v) => (unit === "metric" ? setWaistCm(v) : setWaistIn(v))}
              onKeyDown={handleKeyDown}
            />
          </div>

          {gender === "female" && (
            <div className="calc-field-grid-1 mt-3">
              <Field
                label={unit === "metric" ? "Hip (cm)" : "Hip (inches)"}
                value={unit === "metric" ? hipCm : hipIn}
                onChange={(v) => (unit === "metric" ? setHipCm(v) : setHipIn(v))}
                onKeyDown={handleKeyDown}
              />
            </div>
          )}

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

        {hasResult && calcState && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-2 flex flex-col gap-6"
          >
            {/* Hero Metric */}
            <HeroMetric
              label="Body Fat Percentage"
              value={`${bodyFatPct.toFixed(1)}%`}
              badge={{ text: category.label, color: category.badgeColor }}
              sub={`Estimated Fat Mass: ${fatMassLabel} · Lean Mass: ${leanMassLabel}`}
              glow="#10b981"
            />

            {/* Key Metrics */}
            <DashboardSection title="Body Composition Breakdown">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard
                  index={0}
                  label="Body Fat %"
                  value={`${bodyFatPct.toFixed(1)}%`}
                  accent={category.accent}
                  subValue={`Category: ${category.label}`}
                />
                <StatCard
                  index={1}
                  label="Fat Mass"
                  value={fatMassLabel}
                  accent="amber"
                  subValue="Total stored fat"
                />
                <StatCard
                  index={2}
                  label="Lean Body Mass"
                  value={leanMassLabel}
                  accent="blue"
                  subValue="Muscle, bones, organs, water"
                />
                <StatCard
                  index={3}
                  label="Total Mass"
                  value={
                    calcState.unit === "metric"
                      ? `${calcState.weightKg.toFixed(1)} kg`
                      : `${(calcState.weightKg * 2.20462).toFixed(1)} lbs`
                  }
                  accent="default"
                />
              </div>
            </DashboardSection>

            {/* Insights */}
            <DashboardSection title="Smart Insights">
              <div className="flex flex-col gap-2">
                <InsightCard
                  index={0}
                  tone={
                    category.badgeColor === "green" || category.badgeColor === "blue"
                      ? "success"
                      : "info"
                  }
                  text={`Your body fat percentage of ${bodyFatPct.toFixed(1)}% places you in the '${category.label}' category for ${calcState.gender}s.`}
                />
                <InsightCard
                  index={1}
                  tone="tip"
                  text="Remember that body fat naturally fluctuates. To get the most accurate trend line, take your measurements at the same time of day under consistent conditions over several weeks."
                />
              </div>
            </DashboardSection>

            {/* Recommendations */}
            <DashboardSection title="Recommendations">
              <RecommendationList
                items={[
                  {
                    title: "Maintain a balanced approach",
                    description:
                      "Use this metric alongside other indicators like how your clothes fit, energy levels, and strength progress in the gym.",
                  },
                  {
                    title: "Focus on nutrition and strength",
                    description:
                      "To improve your body composition, prioritize sufficient protein intake and progressive resistance training to preserve lean mass while losing fat.",
                  },
                  {
                    title: "Consult a professional",
                    description:
                      "If you have specific athletic goals or health concerns, consider consulting a sports nutritionist or taking a DEXA scan for an exact baseline.",
                  },
                ]}
              />
            </DashboardSection>

            <div className="flex flex-col">
              {pdfData && <CalculatorPdfExport pdfData={pdfData} />}
            </div>
          </motion.div>
        )}
      </div>
    </CalculatorPageLayout>
  );
}

function Field({
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
        step="0.1"
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
