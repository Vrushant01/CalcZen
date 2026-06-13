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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export function OvulationCalculator() {
  const calc = getCalculator("ovulation-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  const [lmp, setLmp] = useState("2025-01-01");
  const [cycleLength, setCycleLength] = useState("28");

  const [calcLmp, setCalcLmp] = useState("2025-01-01");
  const [calcCycleLength, setCalcCycleLength] = useState("28");

  const r = useMemo(() => {
    const d = new Date(calcLmp);
    const cycle = parseInt(calcCycleLength);
    if (isNaN(d.getTime()) || isNaN(cycle) || cycle < 20 || cycle > 45) return null;

    const ovulationDate = new Date(d);
    ovulationDate.setDate(d.getDate() + (cycle - 14));

    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(ovulationDate.getDate() - 5);

    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(ovulationDate.getDate() + 1);

    const nextPeriod = new Date(d);
    nextPeriod.setDate(d.getDate() + cycle);

    return { lmpDate: d, ovulationDate, fertileStart, fertileEnd, nextPeriod, cycle };
  }, [calcLmp, calcCycleLength]);

  const formatLong = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatShort = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "long", day: "numeric" });

  const pdfData =
    hasResult && r
      ? {
          calculatorName: "Ovulation Calculator",
          calculatorSlug: "ovulation-calculator",
          siteName: PDF_SITE_NAME,
          siteUrl: PDF_SITE_URL,
          inputs: [
            { label: "First Day of Last Period", value: formatLong(r.lmpDate) },
            { label: "Cycle Length", value: `${r.cycle} days` },
          ],
          results: [
            {
              label: "Estimated Ovulation Date",
              value: formatLong(r.ovulationDate),
              highlight: true,
            },
            {
              label: "Fertile Window",
              value: `${formatShort(r.fertileStart)} - ${formatShort(r.fertileEnd)}`,
              highlight: false,
            },
            { label: "Next Period", value: formatLong(r.nextPeriod), highlight: false },
          ],
          summary: `Based on a ${r.cycle}-day cycle, your estimated ovulation date is ${formatLong(r.ovulationDate)}. Your most fertile window is from ${formatShort(r.fertileStart)} to ${formatShort(r.fertileEnd)}.`,
        }
      : null;

  const isButtonDisabled =
    !lmp || !cycleLength || parseInt(cycleLength) < 20 || parseInt(cycleLength) > 45;

  const handleCalculate = () => {
    if (isButtonDisabled) return;
    setCalcLmp(lmp);
    setCalcCycleLength(cycleLength);
    markCalculated();
  };

  const handleReset = () => {
    setLmp("2025-01-01");
    setCycleLength("28");
    setCalcLmp("2025-01-01");
    setCalcCycleLength("28");
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
      intro="Estimate your most fertile days and predict your next period to help you optimize your chances of conceiving. Enter your cycle details below."
      formula={`Ovulation Date = Next Period Date - 14 Days\nFertile Window = Ovulation Date - 5 Days to Ovulation Date + 1 Day`}
      example={`First day of last period: January 1\nCycle Length: 28 Days\nOvulation Date: January 15\nFertile Window: January 10 - January 16`}
      faqs={[
        {
          q: "How does the ovulation calculator work?",
          a: "This calculator estimates your ovulation date by subtracting 14 days from your expected next period. For a typical 28-day cycle, ovulation occurs around day 14. Your fertile window is then calculated as the 5 days before ovulation and the day of ovulation itself, plus one day.",
        },
        {
          q: "What is a fertile window?",
          a: "The fertile window refers to the days in a woman's menstrual cycle when pregnancy is possible. Sperm can survive in the female reproductive tract for up to 5 days, and an egg can survive for about 24 hours after release. Thus, the fertile window spans about 6 days.",
        },
        {
          q: "Is ovulation always exactly 14 days before my period?",
          a: "While 14 days is the average luteal phase length, it can vary between women, usually ranging from 11 to 16 days. However, the 14-day rule provides a reliable estimate for most women with regular cycles.",
        },
        {
          q: "Can I get pregnant outside of my fertile window?",
          a: "Pregnancy is highly unlikely outside of your fertile window because an egg must be present for fertilization. However, variations in cycle length and unpredictable ovulation can sometimes shift your fertile window.",
        },
        {
          q: "How accurate is this ovulation calculator?",
          a: "The calculator provides an estimate based on averages and regular cycles. For more precise tracking, consider combining this method with basal body temperature tracking, ovulation predictor kits (OPKs), or monitoring cervical mucus.",
        },
        {
          q: "What if my cycles are irregular?",
          a: "If your cycles vary significantly in length from month to month, calendar-based methods become less reliable. You may want to use other signs of fertility, like ovulation tests or cervical mucus monitoring, and consult your healthcare provider.",
        },
        {
          q: "How often should we have intercourse during the fertile window?",
          a: "Having intercourse every 1 to 2 days during your fertile window maximizes your chances of conception. Daily intercourse offers a slight advantage, but every other day is also highly effective and often less stressful.",
        },
        {
          q: "Can stress affect ovulation?",
          a: "Yes, significant stress can delay or prevent ovulation by disrupting the hormones that regulate your menstrual cycle. Managing stress through relaxation, exercise, and adequate sleep can help maintain regular cycles.",
        },
      ]}
    >
      <div className="flex flex-col gap-6">
        <Alert
          variant="default"
          className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800"
        >
          <InfoIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-300">Medical Disclaimer</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-400">
            This calculator provides estimates and is not a substitute for professional medical
            advice. It should not be used as a method of birth control. Consult your healthcare
            provider for personalized guidance.
          </AlertDescription>
        </Alert>

        <div className="calc-input-column">
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

          <div className="mt-4">
            <Label className="text-xs font-medium text-muted-foreground">
              Average cycle length (days)
            </Label>
            <Input
              type="number"
              min={20}
              max={45}
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
              onKeyDown={handleKeyDown}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Typical cycle length is between 21 and 35 days.
            </p>
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
            <Button variant="outline" className="flex-1 min-h-11" onClick={handleReset}>
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
                background: "radial-gradient(circle at 50% 50%, #10b981, transparent 65%)",
              }}
            />
            {r ? (
              <>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Results</h2>
                  <div className="mt-3 p-6 rounded-xl bg-card border border-border/70 shadow-soft">
                    <div className="text-sm text-muted-foreground">Estimated Ovulation Date</div>
                    <div className="text-3xl font-bold mt-1 text-gradient">
                      {formatLong(r.ovulationDate)}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground mb-3">
                    Detailed Timeline
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                      <div className="text-xs text-muted-foreground">Fertile Window</div>
                      <div className="text-lg font-bold mt-1 text-foreground">
                        {formatShort(r.fertileStart)} - {formatShort(r.fertileEnd)}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                      <div className="text-xs text-muted-foreground">Next Expected Period</div>
                      <div className="text-lg font-bold mt-1 text-foreground">
                        {formatLong(r.nextPeriod)}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground mb-3">Insights</h3>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-sm text-muted-foreground leading-relaxed font-normal">
                    Based on your cycle length of {r.cycle} days, your most fertile days are between{" "}
                    {formatShort(r.fertileStart)} and {formatShort(r.fertileEnd)}. Ovulation is
                    estimated to occur on {formatShort(r.ovulationDate)}.
                  </div>
                </div>

                <div className="flex flex-col">
                  <CalculatorPdfExport pdfData={pdfData} />
                </div>
              </>
            ) : (
              <p className="text-destructive text-sm">
                Please enter a valid date and cycle length.
              </p>
            )}
          </motion.div>
        )}
      </div>
    </CalculatorPageLayout>
  );
}
