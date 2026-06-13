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

export function AgeCalculator() {
  const calc = getCalculator("age-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();
  const today = new Date().toISOString().slice(0, 10);

  // Live states
  const [dob, setDob] = useState("1995-06-15");
  const [on, setOn] = useState(today);

  // Calculated states
  const [calcDob, setCalcDob] = useState("1995-06-15");
  const [calcOn, setCalcOn] = useState(today);

  const r = useMemo(() => {
    const a = new Date(calcDob),
      b = new Date(calcOn);
    if (isNaN(a.getTime()) || isNaN(b.getTime()) || a > b) return null;
    let years = b.getFullYear() - a.getFullYear();
    let months = b.getMonth() - a.getMonth();
    let days = b.getDate() - a.getDate();
    if (days < 0) {
      months--;
      days += new Date(b.getFullYear(), b.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    const totalDays = Math.floor((b.getTime() - a.getTime()) / 86400000);
    return {
      years,
      months,
      days,
      totalDays,
      totalHours: totalDays * 24,
      totalMinutes: totalDays * 24 * 60,
    };
  }, [calcDob, calcOn]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const pdfData =
    hasResult && r
      ? {
          calculatorName: "Age Calculator",
          calculatorSlug: "age-calculator",
          siteName: PDF_SITE_NAME,
          siteUrl: PDF_SITE_URL,
          inputs: [
            { label: "Date of Birth", value: formatDate(calcDob) },
            { label: "As of Date", value: formatDate(calcOn) },
          ],
          results: [
            {
              label: "Age",
              value: `${r.years} years, ${r.months} months, ${r.days} days`,
              highlight: true,
            },
            {
              label: "Total Days Lived",
              value: r.totalDays.toLocaleString("en-US"),
              highlight: false,
            },
            { label: "Total Hours", value: r.totalHours.toLocaleString("en-US"), highlight: false },
            {
              label: "Total Minutes",
              value: r.totalMinutes.toLocaleString("en-US"),
              highlight: false,
            },
          ],
          summary: `From ${formatDate(calcDob)} to ${formatDate(calcOn)}, you are ${r.years} years, ${r.months} months, and ${r.days} days old — ${r.totalDays.toLocaleString("en-US")} days in total. Use this for forms, milestones, or planning events on a specific date.`,
        }
      : null;

  const isButtonDisabled = !dob || !on || new Date(dob) > new Date(on);

  const handleCalculate = () => {
    if (isButtonDisabled) return;
    setCalcDob(dob);
    setCalcOn(on);
    markCalculated();
  };

  const handleReset = () => {
    setDob("1995-06-15");
    setOn(today);
    setCalcDob("1995-06-15");
    setCalcOn(today);
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
      intro="Find your exact age in years, months and days, plus total days, hours and minutes you've been alive — calculated as of any date you choose."
      formula={`Age = target date − date of birth
Years, months, and days are adjusted using calendar borrowing`}
      example={`Born June 15, 1995 — calculated as of January 10, 2025.
Age = 29 years, 6 months, 26 days.`}
      faqs={[
        {
          q: "What is an age calculator?",
          a: "An age calculator is an online chronological tool that determines the exact time interval between a person's birth date and a specific target date. It displays age in years, months, weeks, days, hours, and minutes. It helps users track important milestones, calculate time elapsed, or see the countdown to their next birthday.",
        },
        {
          q: "How is my exact age calculated?",
          a: "Your exact age is calculated by comparing the calendar dates of your birth date and the current date. The calculation accounts for leap years (which contain 366 days), the varying number of days in different calendar months, and time zones to ensure precise hour and minute details are rendered correctly for the user.",
        },
        {
          q: "What is a leap year and how does it affect age calculations?",
          a: "A leap year occurs every four years and adds an extra day (February 29) to the calendar to keep it aligned with the Earth's orbit. Our chronological age calculator accounts for these extra days when calculating your age in total days, weeks, or minutes, preventing minor drift errors over decades.",
        },
        {
          q: "Can I use this tool to calculate age on a future date?",
          a: "Yes, you can use this tool to calculate your age on any past or future target date. This is useful for planning retirement dates, verifying age requirements for upcoming travel or events, or seeing exactly how old you will be when you reach specific financial milestones, like buying a home.",
        },
        {
          q: "How does the next birthday countdown work?",
          a: "The next birthday countdown calculates the difference between the current date and the date of your upcoming birthday. It displays the remaining months, days, hours, and minutes. This helps you plan birthday celebrations, prepare gifts, or count down the days until a major age milestone or adult age requirement is met.",
        },
        {
          q: "Why does my age in days seem higher than expected?",
          a: 'Your age in days seems high because it counts every single 24-hour period you have lived since birth, including leap years. Over decades, these extra leap days add up significantly. For example, a 30-year-old has lived over 10,950 days. Track other everyday metrics like tipping using our <a href="/calculator/tip-calculator" class="text-primary hover:underline">Tip Calculator</a>.',
        },
        {
          q: "What does chronological age mean?",
          a: "Chronological age is the amount of time that has passed from your birth date to the present date. It is measured in calendar units like years, months, and days. It is the standard legal measurement of chronological age used for government documents, educational registration, retirement eligibility, and general everyday social milestones.",
        },
        {
          q: "How does time calculation relate to other calculators?",
          a: 'Time calculation is a basic component of many calculators. For example, tracking interest growth over a specific period is essential in financial tools. You can apply your current age or remaining working years to plan long-term retirement goals and project nest egg savings with our advanced <a href="/calculator/retirement-calculator" class="text-primary hover:underline">Retirement Calculator</a>.',
        },
      ]}
      blog={<CalculatorBlog content={blogContent.age} />}
    >
      <div className="flex flex-col gap-6">
        <div className="calc-input-column space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Date of birth</Label>
              <Input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                onKeyDown={handleKeyDown}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">As of</Label>
              <Input
                type="date"
                value={on}
                onChange={(e) => setOn(e.target.value)}
                onKeyDown={handleKeyDown}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex flex-row gap-3 mt-4">
            <CalculateButton
              category="math"
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
                background: "radial-gradient(circle at 50% 50%, #8b5cf6, transparent 65%)",
              }}
            />
            {r ? (
              <>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Results</h2>
                  <div className="mt-3 p-6 rounded-xl bg-card border border-border/70 shadow-soft">
                    <div className="text-sm text-muted-foreground">Your age</div>
                    <div className="text-3xl font-bold mt-1 text-gradient">
                      {r.years} years, {r.months} months, {r.days} days
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground mb-3">
                    Detailed Analysis
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                      <div className="text-xs text-muted-foreground">Total Days Lived</div>
                      <div className="text-lg font-bold mt-1 text-foreground">
                        {r.totalDays.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                      <div className="text-xs text-muted-foreground">Total Hours Lived</div>
                      <div className="text-lg font-bold mt-1 text-foreground">
                        {r.totalHours.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                      <div className="text-xs text-muted-foreground">Total Minutes Lived</div>
                      <div className="text-lg font-bold mt-1 text-foreground">
                        {r.totalMinutes.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground mb-3">Insights</h3>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-sm text-muted-foreground leading-relaxed font-normal">
                    From {formatDate(calcDob)} to {formatDate(calcOn)}, you are {r.years} years,{" "}
                    {r.months} months, and {r.days} days old — {r.totalDays.toLocaleString("en-US")}{" "}
                    days in total. Use this for forms, milestones, or planning events on a specific
                    date.
                  </div>
                </div>

                <div className="flex flex-col">
                  {pdfData && <CalculatorPdfExport pdfData={pdfData} />}
                </div>
              </>
            ) : (
              <p className="text-sm text-destructive">
                Please enter a valid birth date before the target date.
              </p>
            )}
          </motion.div>
        )}
      </div>
    </CalculatorPageLayout>
  );
}
