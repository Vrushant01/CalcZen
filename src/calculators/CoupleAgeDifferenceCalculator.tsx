import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalculateButton } from "@/components/CalculateButton";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { Heart, CalendarDays } from "lucide-react";
import { calculateCoupleAgeDifference } from "@/utils/coupleAgeDifferenceUtils";

export function CoupleAgeDifferenceCalculator() {
  const calc = getCalculator("couple-age-difference-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  const [name1, setName1] = useState("");
  const [dob1, setDob1] = useState("");
  const [name2, setName2] = useState("");
  const [dob2, setDob2] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [result, setResult] = useState<ReturnType<typeof calculateCoupleAgeDifference> | null>(
    null,
  );

  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const validate = () => {
    let valid = true;
    const newErrors: { [key: string]: string } = {};

    if (!dob1) {
      newErrors.dob1 = "Please enter your date of birth.";
      valid = false;
    } else if (new Date(dob1) > new Date()) {
      newErrors.dob1 = "Please enter a valid date of birth.";
      valid = false;
    }

    if (!dob2) {
      newErrors.dob2 = "Please enter partner's date of birth.";
      valid = false;
    } else if (new Date(dob2) > new Date()) {
      newErrors.dob2 = "Please enter a valid date of birth.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const r = calculateCoupleAgeDifference(dob1, dob2, getTodayString());
    setResult(r);
    markCalculated();
  };

  const handleReset = () => {
    setName1("");
    setDob1("");
    setName2("");
    setDob2("");
    setErrors({});
    setResult(null);
    resetCalculated();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCalculate();
  };

  const handleShare = () => {
    if (!result) return;
    const text = `Our exact age difference is ${result.exactDifference.years} years, ${result.exactDifference.months} months, and ${result.exactDifference.days} days.\n\nCalculated with CalcZen Couple Age Difference Calculator:\n${window.location.href}`;
    if (navigator.share) {
      navigator
        .share({ title: "CalcZen Couple Age Difference", text, url: window.location.href })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert("Result copied to clipboard!");
    }
  };

  const personAName = name1.trim() || "You";
  const personBName = name2.trim() || "Partner";

  let whoIsOlderText = "You are the same age";
  if (result?.olderPerson === "A") {
    whoIsOlderText = `${personAName} is older`;
  } else if (result?.olderPerson === "B") {
    whoIsOlderText = `${personBName} is older`;
  }

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Enter both dates of birth to calculate the exact age difference in years, months, and days. See who is older, the total number of days apart, and both current ages."
      faqs={[
        {
          q: "How to calculate exact age gap between husband and wife?",
          a: "Enter the date of birth for both you and your spouse. The calculator applies proleptic Gregorian calendar logic to find the exact gap in complete years, months, and remaining days.",
        },
        {
          q: "Does this calculator account for leap years?",
          a: "Yes. Our algorithm accurately accounts for leap years and all varying month lengths (including February 28th and 29th) so you get a perfect calendar-based age gap.",
        },
        {
          q: "What is the age gap if we are born in the same year?",
          a: "If you are born in the same year, the calculator will return an age gap of 0 years and display the exact difference in months and days.",
        },
        {
          q: "Can I use this to find the total days we've been alive?",
          a: "Yes! Along with the age difference, this tool also provides the exact current age for each individual in years, months, and days based on today's date.",
        },
        {
          q: "Does the order of the birth dates matter?",
          a: "No. You can enter the dates in either order. The calculator will automatically determine the older person and return a positive age difference.",
        },
      ]}
    >
      <div className="flex flex-col gap-8">
        {/* INPUT STATE */}
        <div className={`calc-input-column space-y-8 ${hasResult ? "hidden" : "block"}`}>
          <div className="flex flex-col md:flex-row gap-6 md:gap-4 relative items-stretch">
            {/* Person 1 */}
            <div className="flex-1 space-y-4 p-5 rounded-2xl bg-card border border-border/60 shadow-sm relative z-10">
              <h3 className="text-sm font-semibold text-foreground border-b border-border/50 pb-2 mb-3">
                Your Details
              </h3>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">
                  Your Name (Optional)
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. Alex"
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="mt-1.5 focus-visible:ring-rose-500/20 focus-visible:border-rose-500/50"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">
                  Your Date of Birth
                </Label>
                <Input
                  type="date"
                  value={dob1}
                  max={getTodayString()}
                  onChange={(e) => {
                    setDob1(e.target.value);
                    setErrors((p) => ({ ...p, dob1: "" }));
                  }}
                  onKeyDown={handleKeyDown}
                  className={`mt-1.5 focus-visible:ring-rose-500/20 focus-visible:border-rose-500/50 ${errors.dob1 ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                />
                {errors.dob1 && <p className="text-xs text-destructive mt-1.5">{errors.dob1}</p>}
              </div>
            </div>

            {/* Heart Divider */}
            <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-20 flex justify-center py-2 md:py-0">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center backdrop-blur-md shadow-sm">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
              </div>
            </div>

            {/* Person 2 */}
            <div className="flex-1 space-y-4 p-5 rounded-2xl bg-card border border-border/60 shadow-sm relative z-10">
              <h3 className="text-sm font-semibold text-foreground border-b border-border/50 pb-2 mb-3">
                Partner's Details
              </h3>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">
                  Partner's Name (Optional)
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. Sam"
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="mt-1.5 focus-visible:ring-rose-500/20 focus-visible:border-rose-500/50"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">
                  Partner's Date of Birth
                </Label>
                <Input
                  type="date"
                  value={dob2}
                  max={getTodayString()}
                  onChange={(e) => {
                    setDob2(e.target.value);
                    setErrors((p) => ({ ...p, dob2: "" }));
                  }}
                  onKeyDown={handleKeyDown}
                  className={`mt-1.5 focus-visible:ring-rose-500/20 focus-visible:border-rose-500/50 ${errors.dob2 ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                />
                {errors.dob2 && <p className="text-xs text-destructive mt-1.5">{errors.dob2}</p>}
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-3 pt-2">
            <CalculateButton
              category="love-and-relationships"
              className="flex-1 min-h-12"
              onClick={handleCalculate}
            >
              Calculate Age Difference
            </CalculateButton>
            <Button variant="outline" className="flex-1 min-h-12" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>

        {/* RESULT STATE */}
        {hasResult && result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            {/* Primary Visual Header */}
            <div className="rounded-3xl bg-[#0f172a] dark:bg-[#0b0f19] border border-rose-500/20 shadow-2xl relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-rose-500/10 to-transparent pointer-events-none" />

              <div className="p-6 sm:p-10 relative z-10 flex flex-col items-center text-center">
                {/* Visual Couple Names */}
                <div className="flex items-center justify-center gap-4 sm:gap-8 w-full mb-8">
                  <div className="flex-1 flex flex-col items-end gap-1">
                    <span className="text-lg sm:text-2xl font-bold uppercase tracking-wider text-white truncate max-w-[150px] sm:max-w-[200px]">
                      {personAName}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-400 font-medium">
                      {result.ages.personA.years} years old
                    </span>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full bg-rose-500/20 flex items-center justify-center border border-rose-500/30">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400 fill-rose-400/50" />
                  </div>
                  <div className="flex-1 flex flex-col items-start gap-1">
                    <span className="text-lg sm:text-2xl font-bold uppercase tracking-wider text-white truncate max-w-[150px] sm:max-w-[200px]">
                      {personBName}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-400 font-medium">
                      {result.ages.personB.years} years old
                    </span>
                  </div>
                </div>

                <div className="w-16 h-px bg-white/10 mb-8" />

                <div className="text-xs font-bold tracking-[0.2em] text-rose-300/70 uppercase mb-4">
                  Exact Age Gap
                </div>

                {/* Primary GAP */}
                {result.exactDifference.years === 0 &&
                result.exactDifference.months === 0 &&
                result.exactDifference.days === 0 ? (
                  <div className="text-4xl sm:text-5xl font-black bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent mb-3">
                    Same Age
                  </div>
                ) : (
                  <div className="text-3xl sm:text-5xl font-black bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent mb-3 leading-tight text-balance">
                    {result.exactDifference.years > 0 && `${result.exactDifference.years} years, `}
                    {result.exactDifference.months > 0 &&
                      `${result.exactDifference.months} months, `}
                    {result.exactDifference.days} days
                  </div>
                )}

                <div className="text-lg sm:text-xl font-medium text-rose-200/80 mb-6">
                  {result.totalDays.toLocaleString()} days apart
                </div>

                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-white">
                  {whoIsOlderText}
                </div>
              </div>
            </div>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="surface-card p-4 rounded-xl flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-foreground mb-1">
                  {result.exactDifference.years}
                </span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Years Gap
                </span>
              </div>
              <div className="surface-card p-4 rounded-xl flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-foreground mb-1">
                  {result.totalFullMonths.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Full Months
                </span>
              </div>
              <div className="surface-card p-4 rounded-xl flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-foreground mb-1">
                  {result.totalWeeks.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Weeks
                </span>
              </div>
              <div className="surface-card p-4 rounded-xl flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-foreground mb-1">
                  {result.totalDays.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Days
                </span>
              </div>
            </div>

            {/* Current Ages Detailed */}
            <div className="surface-card rounded-xl p-5 sm:p-6 border border-border/50">
              <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase mb-6 flex items-center gap-2">
                <CalendarDays className="w-4 h-4" /> Current Ages Today
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    {personAName}
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    {result.ages.personA.years} years, {result.ages.personA.months} months,{" "}
                    {result.ages.personA.days} days
                  </div>
                </div>
                <div className="space-y-1 md:border-l md:border-border/50 md:pl-10">
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    {personBName}
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    {result.ages.personB.years} years, {result.ages.personB.months} months,{" "}
                    {result.ages.personB.days} days
                  </div>
                </div>
              </div>
            </div>

            {/* Combined Age */}
            <div className="surface-card rounded-xl p-5 sm:p-6 border border-border/50 text-center">
              <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase mb-3">
                Combined Age
              </h3>
              <div className="text-3xl font-black text-foreground">
                {result.combinedAge.years} years
              </div>
              <div className="text-sm text-muted-foreground font-medium mt-1">
                {result.combinedAge.months} months, {result.combinedAge.days} days combined
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto mt-8">
              <Button
                onClick={handleReset}
                className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white min-h-12 text-base shadow-lg shadow-rose-500/25 transition-all"
              >
                Calculate Again
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex-1 min-h-12 text-base transition-all"
              >
                Share Result
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-16 prose prose-slate dark:prose-invert max-w-none select-copy">
        <section aria-labelledby="what-is-it">
          <h2 id="what-is-it">What Is the Couple Age Difference Calculator?</h2>
          <p>
            A <strong>Couple Age Difference Calculator</strong> determines the exact calendar gap between two individuals' dates of birth. Rather than relying on rough estimates, our tool computes the exact age difference in complete years, months, and days. It is frequently used by couples, friends, and family members to find out precisely how far apart they are in age.
          </p>
          <p>
            The calculator handles all calendrical edge cases, including:
          </p>
          <ul>
            <li>Leap years and February 29th babies.</li>
            <li>Varying month lengths (28, 29, 30, and 31 days).</li>
            <li>Identifying exactly who is older and who is younger.</li>
          </ul>
        </section>

        <section aria-labelledby="why-exact-math">
          <h2 id="why-exact-math">Why Exact Calendar Math Matters</h2>
          <p>
            Many basic age calculators use a simple mathematical approximation (e.g., dividing total days by 365 or 365.25) to calculate age gaps. This approach leads to incorrect month and day counts because human ages are tracked using the calendar, not fixed 365-day intervals. 
          </p>
          <p>
            Our calculator uses a standard proleptic Gregorian calendar algorithm. By adding complete years, then complete months, and then remaining days, we guarantee a 100% accurate calendar-aware age difference.
          </p>
        </section>

        <section aria-labelledby="worked-examples">
          <h2 id="worked-examples">Step-by-Step Worked Examples</h2>
          <p>
            Here are two examples demonstrating how exact age gap calculation works:
          </p>
          <table aria-label="Age Gap Calculation Examples">
            <thead>
              <tr>
                <th scope="col">Scenario</th>
                <th scope="col">Older Date of Birth</th>
                <th scope="col">Younger Date of Birth</th>
                <th scope="col">Exact Age Gap</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>1. Leap Year Difference</strong></td>
                <td>February 29, 2000</td>
                <td>March 15, 2004</td>
                <td>4 years, 0 months, 15 days</td>
              </tr>
              <tr>
                <td><strong>2. Same Year, Different Month</strong></td>
                <td>January 10, 1995</td>
                <td>November 25, 1995</td>
                <td>0 years, 10 months, 15 days</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section aria-labelledby="explore-more">
          <h2 id="explore-more">Explore More Calculators</h2>
          <p>
            If you're interested in discovering more about your timeline or your relationship, you can check your own precise life milestones using our <Link to="/calculator/$slug" params={{ slug: "age-calculator" }} className="font-semibold text-primary hover:underline">Age Calculator</Link>. 
          </p>
          <p>
            Looking for something more romantic? Try our fun <Link to="/calculator/$slug" params={{ slug: "love-calculator" }} className="font-semibold text-primary hover:underline">Love Calculator</Link> to check your compatibility score, or play the classic <Link to="/calculator/$slug" params={{ slug: "flames-calculator" }} className="font-semibold text-primary hover:underline">FLAMES Calculator</Link> game to find your relationship destiny!
          </p>
        </section>
      </div>
    </CalculatorPageLayout>
  );
}
