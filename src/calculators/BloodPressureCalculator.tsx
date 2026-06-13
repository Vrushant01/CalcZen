import React, { useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalculateButton } from "@/components/CalculateButton";
import { PDF_SITE_NAME, PDF_SITE_URL } from "@/constants/pdfBrand";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { Activity, Heart, AlertTriangle } from "lucide-react";
import {
  HeroMetric,
  StatCard,
  DashboardSection,
  InsightCard,
  ComparisonTable,
  RecommendationList,
} from "@/components/dashboard";
import { motion } from "framer-motion";

type BpCategory = {
  label: string;
  color: string;
  badgeColor: "green" | "blue" | "amber" | "red" | "purple" | "cyan" | "default";
  accent: "green" | "blue" | "amber" | "red" | "purple" | "cyan" | "default";
  description: string;
};

function getBpCategory(sys: number, dia: number): BpCategory {
  if (sys <= 0 || dia <= 0)
    return {
      label: "—",
      color: "text-muted-foreground",
      badgeColor: "default",
      accent: "default",
      description: "Enter valid numbers",
    };
  if (sys > 180 || dia > 120) {
    return {
      label: "Hypertensive Crisis",
      color: "text-red-600 dark:text-red-500",
      badgeColor: "red",
      accent: "red",
      description: "Consult your doctor immediately.",
    };
  }
  if (sys >= 140 || dia >= 90) {
    return {
      label: "Hypertension Stage 2",
      color: "text-orange-600 dark:text-orange-500",
      badgeColor: "amber",
      accent: "amber",
      description: "High blood pressure stage 2. Medical attention is recommended.",
    };
  }
  if (sys >= 130 || dia >= 80) {
    return {
      label: "Hypertension Stage 1",
      color: "text-yellow-600 dark:text-yellow-500",
      badgeColor: "amber",
      accent: "amber",
      description: "High blood pressure stage 1. Lifestyle changes and monitoring are advised.",
    };
  }
  if (sys >= 120 && dia < 80) {
    return {
      label: "Elevated",
      color: "text-blue-600 dark:text-blue-500",
      badgeColor: "blue",
      accent: "blue",
      description: "Elevated blood pressure. Focus on a healthy lifestyle to prevent hypertension.",
    };
  }
  return {
    label: "Normal",
    color: "text-emerald-600 dark:text-emerald-500",
    badgeColor: "green",
    accent: "green",
    description: "Your blood pressure is in the ideal range.",
  };
}

export function BloodPressureCalculator() {
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  const [systolic, setSystolic] = useState<number | "">(120);
  const [diastolic, setDiastolic] = useState<number | "">(80);

  const [calcSystolic, setCalcSystolic] = useState<number>(120);
  const [calcDiastolic, setCalcDiastolic] = useState<number>(80);

  const category = getBpCategory(calcSystolic, calcDiastolic);
  const isButtonDisabled = !systolic || !diastolic || systolic <= 0 || diastolic <= 0;

  const handleCalculate = () => {
    if (isButtonDisabled) return;
    setCalcSystolic(Number(systolic));
    setCalcDiastolic(Number(diastolic));
    markCalculated();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isButtonDisabled) handleCalculate();
  };

  const handleReset = () => {
    setSystolic(120);
    setDiastolic(80);
    setCalcSystolic(120);
    setCalcDiastolic(80);
    resetCalculated();
  };

  const pdfData = hasResult
    ? {
        calculatorName: "Blood Pressure Calculator",
        calculatorSlug: "blood-pressure-calculator",
        siteName: PDF_SITE_NAME,
        siteUrl: PDF_SITE_URL,
        inputs: [
          { label: "Systolic", value: `${calcSystolic} mmHg` },
          { label: "Diastolic", value: `${calcDiastolic} mmHg` },
        ],
        results: [
          { label: "Category", value: category.label, highlight: true },
          { label: "Reading", value: `${calcSystolic}/${calcDiastolic} mmHg`, highlight: false },
        ],
        summary: `Your blood pressure reading of ${calcSystolic}/${calcDiastolic} falls into the "${category.label}" category. ${category.description} Note: This is an educational tool and does not replace professional medical advice.`,
      }
    : null;

  const categoryData = [
    { label: "Normal", values: ["< 120", "and", "< 80"], highlight: category.label === "Normal" },
    {
      label: "Elevated",
      values: ["120 - 129", "and", "< 80"],
      highlight: category.label === "Elevated",
    },
    {
      label: "Stage 1",
      values: ["130 - 139", "or", "80 - 89"],
      highlight: category.label === "Hypertension Stage 1",
    },
    {
      label: "Stage 2",
      values: ["≥ 140", "or", "≥ 90"],
      highlight: category.label === "Hypertension Stage 2",
    },
    {
      label: "Crisis",
      values: ["> 180", "and/or", "> 120"],
      highlight: category.label === "Hypertensive Crisis",
    },
  ];

  return (
    <CalculatorPageLayout
      title="Blood Pressure Calculator"
      description="Understand your blood pressure readings according to AHA guidelines."
      icon={<Heart className="h-6 w-6 text-red-500" />}
      isCalculated={hasResult}
      calculatorId="blood-pressure"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card border shadow-sm rounded-xl p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="systolic">Systolic (Top number)</Label>
                <div className="relative">
                  <Input
                    id="systolic"
                    type="number"
                    value={systolic}
                    onChange={(e) =>
                      setSystolic(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. 120"
                    min="50"
                    max="300"
                    className="pl-3 pr-16"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground text-sm">
                    mmHg
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diastolic">Diastolic (Bottom number)</Label>
                <div className="relative">
                  <Input
                    id="diastolic"
                    type="number"
                    value={diastolic}
                    onChange={(e) =>
                      setDiastolic(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. 80"
                    min="30"
                    max="200"
                    className="pl-3 pr-16"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground text-sm">
                    mmHg
                  </div>
                </div>
              </div>
            </div>

            <CalculateButton
              onClick={handleCalculate}
              isCalculated={hasResult}
              onReset={handleReset}
              disabled={isButtonDisabled}
            />
          </div>
        </div>

        <div className="lg:col-span-8">
          {hasResult ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-yellow-500 p-4 rounded-r-xl">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong className="font-semibold">Medical Disclaimer:</strong> This calculator
                    is for informational purposes only and is not a substitute for professional
                    medical advice, diagnosis, or treatment. Always seek the advice of your
                    physician or other qualified health provider with any questions regarding a
                    medical condition.
                  </p>
                </div>
              </div>

              <HeroMetric
                label="Your Blood Pressure Category"
                value={`${calcSystolic}/${calcDiastolic}`}
                subLabel={category.label}
                accent={category.accent}
                icon={<Activity className="h-5 w-5" />}
              />

              <DashboardSection title="Analysis & Guidelines">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InsightCard
                    title="What this means"
                    value={category.label}
                    description={category.description}
                    accent={category.accent}
                  />
                  <InsightCard
                    title="Next Steps"
                    value="Recommendations"
                    description={
                      category.label === "Hypertensive Crisis"
                        ? "Call 911 or your doctor immediately."
                        : category.label === "Normal"
                          ? "Keep up the good work! Maintain healthy habits."
                          : "Consider discussing these results with a healthcare provider and monitoring regularly."
                    }
                    accent={category.accent === "red" ? "red" : "blue"}
                  />
                </div>
              </DashboardSection>

              <DashboardSection title="AHA Blood Pressure Categories">
                <ComparisonTable
                  headers={["Category", "Systolic (mmHg)", "And/Or", "Diastolic (mmHg)"]}
                  rows={categoryData}
                  accent="blue"
                />
              </DashboardSection>

              {pdfData && (
                <div className="pt-4 border-t border-border">
                  <CalculatorPdfExport {...pdfData} />
                </div>
              )}
            </motion.div>
          ) : (
            <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-border rounded-xl bg-card/50 text-muted-foreground p-8 text-center">
              <div>
                <Heart className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium text-foreground mb-1">Enter Your Readings</h3>
                <p className="max-w-sm mx-auto">
                  Input your systolic and diastolic pressure to see how it aligns with American
                  Heart Association (AHA) guidelines.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16 prose prose-slate dark:prose-invert max-w-none">
        <h2>Understanding Blood Pressure</h2>
        <p>
          Blood pressure is a measure of the force that your heart uses to pump blood around your
          body. It is given as two numbers: <strong>Systolic pressure</strong> (the top number)
          measures the pressure in your arteries when your heart beats, while{" "}
          <strong>Diastolic pressure</strong> (the bottom number) measures the pressure between
          beats when your heart rests.
        </p>

        <h3>American Heart Association (AHA) Guidelines</h3>
        <p>
          The AHA has established guidelines to help individuals understand their blood pressure
          readings and take necessary actions to maintain heart health.
        </p>
        <ul>
          <li>
            <strong>Normal:</strong> Less than 120/80 mmHg. Maintain healthy habits like a balanced
            diet and regular exercise.
          </li>
          <li>
            <strong>Elevated:</strong> Readings consistently ranging from 120-129 systolic and less
            than 80 mm Hg diastolic. Steps should be taken to control the condition.
          </li>
          <li>
            <strong>Hypertension Stage 1:</strong> Readings ranging from 130-139 systolic or 80-89
            mm Hg diastolic. Lifestyle changes and possible medication.
          </li>
          <li>
            <strong>Hypertension Stage 2:</strong> Readings consistently at 140/90 mm Hg or higher.
            Medication and lifestyle changes are typically required.
          </li>
          <li>
            <strong>Hypertensive Crisis:</strong> Higher than 180/120 mm Hg. This requires immediate
            medical attention.
          </li>
        </ul>

        <h2>Frequently Asked Questions</h2>
        <div className="space-y-4 mt-6">
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <h4 className="m-0 font-semibold text-lg">1. What is blood pressure?</h4>
            <p className="mt-2 text-muted-foreground">
              Blood pressure is the force of your blood pushing against the walls of your arteries.
              Every time your heart beats, it pumps blood into the arteries.
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <h4 className="m-0 font-semibold text-lg">2. What do systolic and diastolic mean?</h4>
            <p className="mt-2 text-muted-foreground">
              Systolic pressure (top number) is the force when your heart beats and pumps blood.
              Diastolic pressure (bottom number) is the force when your heart is at rest between
              beats.
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <h4 className="m-0 font-semibold text-lg">
              3. What is a normal blood pressure reading?
            </h4>
            <p className="mt-2 text-muted-foreground">
              A normal reading is typically less than 120/80 mmHg according to the American Heart
              Association.
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <h4 className="m-0 font-semibold text-lg">4. What is hypertension?</h4>
            <p className="mt-2 text-muted-foreground">
              Hypertension is the medical term for high blood pressure. It means the pressure in
              your arteries is consistently higher than it should be.
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <h4 className="m-0 font-semibold text-lg">
              5. How often should I check my blood pressure?
            </h4>
            <p className="mt-2 text-muted-foreground">
              If you have normal blood pressure, a check every year is usually sufficient. If you
              have elevated or high blood pressure, your doctor will advise you to check it more
              frequently.
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <h4 className="m-0 font-semibold text-lg">
              6. Can I lower my blood pressure naturally?
            </h4>
            <p className="mt-2 text-muted-foreground">
              Yes, lifestyle changes such as exercising regularly, eating a heart-healthy diet low
              in sodium, reducing alcohol intake, quitting smoking, and managing stress can help
              lower blood pressure.
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <h4 className="m-0 font-semibold text-lg">7. What is white coat syndrome?</h4>
            <p className="mt-2 text-muted-foreground">
              White coat syndrome happens when a person's blood pressure readings are higher when
              taken at a doctor's office than when taken in other settings, usually due to anxiety.
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <h4 className="m-0 font-semibold text-lg">8. Does stress affect blood pressure?</h4>
            <p className="mt-2 text-muted-foreground">
              Yes, acute stress can cause a temporary spike in blood pressure. Chronic stress may
              also contribute to long-term high blood pressure, especially if managed with unhealthy
              coping habits.
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <h4 className="m-0 font-semibold text-lg">
              9. When is blood pressure considered a medical emergency?
            </h4>
            <p className="mt-2 text-muted-foreground">
              A blood pressure reading higher than 180/120 mmHg is considered a hypertensive crisis.
              If you get this reading, wait five minutes and test again. If it is still high, seek
              immediate medical attention.
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <h4 className="m-0 font-semibold text-lg">10. Is high blood pressure curable?</h4>
            <p className="mt-2 text-muted-foreground">
              Primary hypertension usually cannot be cured, but it can be effectively managed with
              lifestyle changes and medication. Secondary hypertension caused by an underlying
              condition may be cured if the condition is treated.
            </p>
          </div>
        </div>
      </div>
    </CalculatorPageLayout>
  );
}
