import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog from "@/components/CalculatorBlog";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { blogContent } from "@/data/blogContent";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalculateButton } from "@/components/CalculateButton";
import { PDF_SITE_NAME, PDF_SITE_URL } from "@/constants/pdfBrand";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { motion } from "framer-motion";

export function PregnancyDueDateCalculator() {
  const calc = getCalculator("pregnancy-due-date-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();
  
  // Live input states
  const [lmp, setLmp] = useState("2025-01-01");

  // Calculated states
  const [calcLmp, setCalcLmp] = useState("2025-01-01");

  const r = useMemo(() => {
    const d = new Date(calcLmp);
    if (isNaN(d.getTime())) return null;
    const due = new Date(d);
    due.setDate(due.getDate() + 280);
    const today = new Date();
    const daysIn = Math.floor((today.getTime() - d.getTime()) / 86400000);
    const week = Math.max(0, Math.floor(daysIn / 7));
    const trimester = week < 13 ? 1 : week < 27 ? 2 : 3;
    return { due, week, trimester, lmpDate: d };
  }, [calcLmp]);

  const formatLong = (date: Date) =>
    date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const pdfData =
    hasResult && r
      ? {
          calculatorName: "Pregnancy Due Date Calculator",
          calculatorSlug: "pregnancy-due-date-calculator",
          siteName: PDF_SITE_NAME,
          siteUrl: PDF_SITE_URL,
          inputs: [
            { label: "First Day of Last Period", value: formatLong(r.lmpDate) },
          ],
          results: [
            { label: "Estimated Due Date", value: formatLong(r.due), highlight: true },
            { label: "Current Week", value: `Week ${r.week}`, highlight: false },
            { label: "Trimester", value: `Trimester ${r.trimester}`, highlight: false },
            { label: "Gestational Days", value: `${r.week * 7} days (approx.)`, highlight: false },
          ],
          summary: `Based on your last menstrual period on ${formatLong(r.lmpDate)}, your estimated due date is ${formatLong(r.due)} (40 weeks). You are currently around week ${r.week} in trimester ${r.trimester}. Only about 5% of babies arrive on the exact due date — plan with your healthcare provider for prenatal care.`,
        }
      : null;

  const isButtonDisabled = !lmp;

  const handleCalculate = () => {
    if (isButtonDisabled) return;
    setCalcLmp(lmp);
    markCalculated();
  };

  const handleReset = () => {
    setLmp("2025-01-01");
    setCalcLmp("2025-01-01");
    resetCalculated();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isButtonDisabled) {
      handleCalculate();
    }
  };

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Estimate your baby's due date using Naegele's rule — the standard method that adds 280 days to the first day of your last menstrual period (LMP)."
      formula={`Due date = LMP + 280 days (40 weeks)`}
      example={`Last menstrual period (LMP) on January 1, 2025.
Estimated due date: October 8, 2025.`}
      faqs={[
        { q: "How is my estimated pregnancy due date calculated?", a: "Your estimated pregnancy due date is typically calculated using Naegele's rule, which adds 280 days (40 weeks) to the first day of your last menstrual period (LMP). The calculation assumes a regular 28-day menstrual cycle, with conception occurring approximately 14 days after the start of the period. This represents a standard clinical approximation used worldwide." },
        { q: "How accurate is the estimated due date?", a: "The estimated due date is a helpful guideline, but only about 4% to 5% of babies are born on their exact due date. Most births occur within a window of two weeks before or after the target date. Your healthcare provider may revise the date based on early dating ultrasounds." },
        { q: "What if I do not remember my last menstrual period?", a: "If you do not remember your LMP, your healthcare provider will estimate your due date using an early dating ultrasound, typically performed in the first trimester. The ultrasound measures the baby's crown-rump length, which provides a highly accurate estimate of gestational age, allowing you to track development milestones with confidence." },
        { q: "Can a changing menstrual cycle affect my due date?", a: "Yes, variations in your menstrual cycle length can affect your actual due date. The standard calculation assumes a 28-day cycle. If your cycle is longer, ovulation occurs later, meaning your actual due date is likely later than standard LMP calculations estimate. Your doctor will adjust for this during prenatal care checkups." },
        { q: "What is gestational age?", a: "Gestational age is the measurement of pregnancy progress, calculated from the first day of your last menstrual period. It is measured in weeks and days. Since ovulation occurs later, the baby's biological age (conception age) is typically two weeks less than the calculated gestational age, which is standard in medical science." },
        { q: "What percentage of babies are born early or late?", a: "Approximately 90% of babies are born between weeks 37 and 42 of pregnancy, which is considered full term. Babies born before 37 weeks are premature, while those born after 42 weeks are post-term. Lenders of prenatal care monitor these milestones closely to ensure a safe delivery and support infant health." },
        { q: "Why is tracking weight and nutrition important during pregnancy?", a: "Tracking weight gain and caloric intake is essential during pregnancy to support fetal growth and maintain maternal health. Caloric needs increase, especially in the second and third trimesters. You can estimate your base resting metabolism using our <a href=\"/calculator/bmr-calculator\" class=\"text-primary hover:underline\">BMR Calculator</a>, and evaluate general fitness by checking our <a href=\"/calculator/bmi-calculator\" class=\"text-primary hover:underline\">BMI Calculator</a>." },
        { q: "How does hydration impact pregnancy?", a: "Proper hydration is critical during pregnancy because water supports the formation of amniotic fluid, aids in nutrient transport, and prevents common pregnancy discomforts like urinary tract infections or swelling. Expecting mothers should track their daily fluid targets using our personalized <a href=\"/calculator/water-intake-calculator\" class=\"text-primary hover:underline\">Water Intake Calculator</a> to ensure they stay healthy." }
      ]}
      blog={<CalculatorBlog content={blogContent.pregnancy} />}
    >
      <div className="flex flex-col gap-6">
        <div className="calc-input-column">
          <div>
            <Label className="text-xs font-medium text-muted-foreground">First day of last period</Label>
            <Input
              type="date"
              value={lmp}
              onChange={(e) => setLmp(e.target.value)}
              onKeyDown={handleKeyDown}
              className="mt-1"
            />
          </div>

          <div className="flex flex-row gap-3 mt-4">
            <CalculateButton
              category="health"
              className="flex-1 min-h-11"
              disabled={isButtonDisabled}
              onClick={handleCalculate}
            >
              Calculate
            </CalculateButton>
            <Button
              variant="outline"
              className="flex-1 min-h-11"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>

        {hasResult && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, height: "auto", scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mt-6 pt-6 border-t border-border space-y-6 overflow-hidden relative"
          >
            <div 
              className="absolute inset-0 pointer-events-none blur-3xl opacity-15 -z-10"
              style={{
                background: "radial-gradient(circle at 50% 50%, #10b981, transparent 65%)"
              }}
            />
            {r ? (
              <>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Results</h2>
                  <div className="mt-3 p-6 rounded-xl bg-card border border-border/70 shadow-soft">
                    <div className="text-sm text-muted-foreground">Estimated due date</div>
                    <div className="text-3xl font-bold mt-1 text-gradient">{formatLong(r.due)}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground mb-3">Detailed Analysis</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                      <div className="text-xs text-muted-foreground">Current week</div>
                      <div className="text-lg font-bold mt-1 text-foreground">Week {r.week}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                      <div className="text-xs text-muted-foreground">Trimester</div>
                      <div className="text-lg font-bold mt-1 text-foreground">Trimester {r.trimester}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground mb-3">Insights</h3>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-sm text-muted-foreground leading-relaxed font-normal">
                    Based on Naegele's clinical rule, your baby is estimated to arrive on {formatLong(r.due)}. You are currently at week {r.week} of your pregnancy (Trimester {r.trimester}). Standard gestation is 280 days (40 weeks) from your last period.
                  </div>
                </div>

                <div className="flex flex-col">
                  <CalculatorPdfExport hasResult={hasResult} pdfData={pdfData} />
                </div>
              </>
            ) : (
              <p className="text-destructive text-sm">Please enter a valid date.</p>
            )}
          </motion.div>
        )}
      </div>
    </CalculatorPageLayout>
  );
}
