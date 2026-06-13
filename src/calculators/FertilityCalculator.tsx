import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog, { BlogContent } from "@/components/CalculatorBlog";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalculateButton } from "@/components/CalculateButton";
import { PDF_SITE_NAME, PDF_SITE_URL } from "@/constants/pdfBrand";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { motion } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const fertilityBlogContent: BlogContent = {
  primaryKeyword: "fertility calculator",
  category: "Health & Pregnancy",
  introText:
    "A fertility calculator helps you predict your most fertile days and ovulation period. By tracking your menstrual cycle, you can estimate the best days to try for a baby. Understanding your body's natural rhythms is key to reproductive health.",
  sections: [
    {
      title: "Understanding Your Fertile Window",
      paragraphs: [
        "Your fertile window is the period during your menstrual cycle when pregnancy is possible. It typically spans the five days leading up to ovulation and the day of ovulation itself.",
        "Because sperm can survive in the female reproductive tract for up to five days, having intercourse during this window maximizes the chances of fertilization. The egg only survives for 12 to 24 hours after release, making the timing crucial.",
      ],
      callout: {
        type: "expertInsight",
        title: "Medical Disclaimer",
        text: "This calculator provides estimates based on standard averages. It is not a substitute for professional medical advice, diagnosis, or treatment. It should not be used as a method of birth control. Always seek the advice of your physician regarding medical conditions.",
      },
    },
    {
      title: "How to Track Your Menstrual Cycle",
      paragraphs: [
        "To use the fertility calculator effectively, you need to know the first day of your last menstrual period (LMP) and your average cycle length.",
        "Your menstrual cycle is measured from the first day of one period to the first day of the next. While a 28-day cycle is common, a normal cycle can range anywhere from 21 to 35 days.",
      ],
    },
  ],
};

export function FertilityCalculator() {
  const calc = getCalculator("fertility-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  const [lmp, setLmp] = useState("2025-01-01");
  const [cycleLength, setCycleLength] = useState("28");

  const [calcLmp, setCalcLmp] = useState("2025-01-01");
  const [calcCycle, setCalcCycle] = useState(28);

  const r = useMemo(() => {
    const d = new Date(calcLmp);
    if (isNaN(d.getTime())) return null;

    const cycle = Math.max(20, Math.min(45, calcCycle || 28));

    const nextPeriod = new Date(d);
    nextPeriod.setDate(d.getDate() + cycle);

    const ovulationDate = new Date(d);
    ovulationDate.setDate(d.getDate() + cycle - 14);

    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(ovulationDate.getDate() - 5);

    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(ovulationDate.getDate() + 1);

    const fertileDays = [];
    for (let i = -5; i <= 1; i++) {
      const current = new Date(ovulationDate);
      current.setDate(ovulationDate.getDate() + i);
      fertileDays.push(current);
    }

    return { lmpDate: d, nextPeriod, ovulationDate, fertileStart, fertileEnd, fertileDays, cycle };
  }, [calcLmp, calcCycle]);

  const formatLong = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatShort = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const pdfData =
    hasResult && r
      ? {
          calculatorName: "Fertility Calculator",
          calculatorSlug: "fertility-calculator",
          siteName: PDF_SITE_NAME,
          siteUrl: PDF_SITE_URL,
          inputs: [
            { label: "Last Period", value: formatLong(r.lmpDate) },
            { label: "Cycle Length", value: `${r.cycle} days` },
          ],
          results: [
            { label: "Estimated Ovulation", value: formatLong(r.ovulationDate), highlight: true },
            {
              label: "Fertile Window",
              value: `${formatLong(r.fertileStart)} - ${formatLong(r.fertileEnd)}`,
              highlight: false,
            },
            { label: "Next Period", value: formatLong(r.nextPeriod), highlight: false },
          ],
          summary: `Based on your last menstrual period on ${formatLong(r.lmpDate)} and a ${r.cycle}-day cycle, your estimated fertile window is from ${formatLong(r.fertileStart)} to ${formatLong(r.fertileEnd)}. Your most fertile day (ovulation) is expected to be ${formatLong(r.ovulationDate)}. Note: This is an estimate and not intended for birth control.`,
        }
      : null;

  const isButtonDisabled = !lmp || !cycleLength;

  const handleCalculate = () => {
    if (isButtonDisabled) return;
    setCalcLmp(lmp);
    setCalcCycle(parseInt(cycleLength, 10));
    markCalculated();
  };

  const handleReset = () => {
    setLmp("2025-01-01");
    setCycleLength("28");
    setCalcLmp("2025-01-01");
    setCalcCycle(28);
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
      intro="Calculate your most fertile days and estimated ovulation date based on your menstrual cycle length and last period date."
      formula="Ovulation Date = Next Period Date - 14 Days"
      example="If your last period started on January 1 and your cycle is 28 days, your next period is January 29. Your expected ovulation date is January 15 (29 - 14)."
      faqs={[
        {
          q: "How does the fertility calculator work?",
          a: "It estimates your ovulation date by subtracting 14 days from your expected next period date. The fertile window is then calculated as the 5 days before ovulation plus the day of ovulation.",
        },
        {
          q: "What is a normal menstrual cycle length?",
          a: "A typical menstrual cycle lasts 28 days, but it can range from 21 to 35 days in healthy adults.",
        },
        {
          q: "Can I use this calculator for birth control?",
          a: "No. This calculator is for educational purposes and estimating conception chances. It should never be used as a reliable method of birth control or contraception.",
        },
        {
          q: "How long does ovulation last?",
          a: "An egg lives for only 12 to 24 hours after it is released. However, your fertile window is longer because sperm can survive inside the female body for up to 5 days.",
        },
        {
          q: "What are the signs of ovulation?",
          a: "Common signs include changes in basal body temperature, changes in cervical mucus (becoming clear and slippery like raw egg whites), mild pelvic pain, and increased sexual desire.",
        },
        {
          q: "Does a positive ovulation test guarantee pregnancy?",
          a: "No. An ovulation test detects a surge in luteinizing hormone (LH), which triggers ovulation, but conception depends on many factors including sperm health, timing, and reproductive health.",
        },
        {
          q: "When should I take a pregnancy test?",
          a: "For the most accurate results, wait until the first day of your missed period. Some early-detection tests can be used a few days sooner, but testing too early may result in a false negative.",
        },
        {
          q: "When should I seek medical advice about fertility?",
          a: "If you are under 35 and have been trying to conceive for a year without success, or over 35 and trying for 6 months, it is recommended to consult a fertility specialist or healthcare provider.",
        },
      ]}
      blog={<CalculatorBlog content={fertilityBlogContent} />}
    >
      <div className="flex flex-col gap-6">
        <Alert className="bg-blue-50/50 border-blue-200 text-blue-800">
          <Info className="h-4 w-4" color="#1e40af" />
          <AlertTitle className="text-blue-900 font-semibold">Medical Disclaimer</AlertTitle>
          <AlertDescription className="text-blue-800/90 text-xs">
            This tool provides estimates based on averages and should not be used for medical
            diagnosis, treatment, or birth control. Always consult a healthcare professional.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium text-muted-foreground">
              First day of last period
            </Label>
            <Input
              type="date"
              value={lmp}
              onChange={(e) => setLmp(e.target.value)}
              onKeyDown={handleKeyDown}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Cycle length (days)</Label>
            <Input
              type="number"
              min={20}
              max={45}
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
              onKeyDown={handleKeyDown}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex flex-row gap-3 mt-2">
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
                background: "radial-gradient(circle at 50% 50%, #ec4899, transparent 65%)",
              }}
            />
            {r ? (
              <>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Fertility Forecast</h2>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-xl bg-card border border-border/70 shadow-soft">
                      <div className="text-sm text-muted-foreground">Fertile Window</div>
                      <div className="text-2xl font-bold mt-1 text-gradient bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                        {formatShort(r.fertileStart)} - {formatShort(r.fertileEnd)}
                      </div>
                    </div>
                    <div className="p-6 rounded-xl bg-card border border-border/70 shadow-soft">
                      <div className="text-sm text-muted-foreground">Expected Ovulation</div>
                      <div className="text-2xl font-bold mt-1 text-foreground">
                        {formatLong(r.ovulationDate)}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground mb-3">
                    Fertility Calendar View
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {r.fertileDays.map((day, idx) => {
                      const isOvulation = day.getTime() === r.ovulationDate.getTime();
                      return (
                        <div
                          key={idx}
                          className={`flex flex-col items-center justify-center p-3 rounded-lg border ${isOvulation ? "bg-pink-100 border-pink-300 text-pink-900 shadow-sm" : "bg-muted/30 border-border/50 text-foreground"}`}
                        >
                          <span className="text-xs opacity-70">
                            {day.toLocaleDateString("en-US", { weekday: "short" })}
                          </span>
                          <span className="text-lg font-bold">{day.getDate()}</span>
                          <span className="text-[10px] mt-1 text-center leading-tight">
                            {isOvulation ? "Ovulation" : "Fertile"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col">
                  <CalculatorPdfExport pdfData={pdfData} />
                </div>
              </>
            ) : (
              <p className="text-destructive text-sm">Please enter valid inputs.</p>
            )}
          </motion.div>
        )}
      </div>
    </CalculatorPageLayout>
  );
}
