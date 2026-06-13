import { useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog, { BlogContent } from "@/components/CalculatorBlog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalculateButton } from "@/components/CalculateButton";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { motion } from "framer-motion";
import { HeroMetric, StatCard, DashboardSection, InsightCard } from "@/components/dashboard";

const attendanceBlogContent: BlogContent = {
  primaryKeyword: "attendance calculator",
  category: "Math",
  introText:
    "Welcome to the ultimate resource on understanding and calculating your academic attendance. Whether you're tracking your semester progress or figuring out if you can afford to skip that 8 AM lecture, mastering the math behind attendance calculations is an essential survival skill for every student.",
  sections: [
    {
      title: "The Importance of Tracking Your Attendance",
      paragraphs: [
        "In modern education systems, attendance is often more than just a metric of participation—it is a critical requirement for academic standing. Most universities and colleges enforce a mandatory minimum attendance policy, typically hovering around the 75% or 80% mark. Falling short of this threshold can lead to severe academic consequences, including being debarred from final examinations, losing scholarship eligibility, or failing a course outright.",
        "Tracking your attendance proactively empowers you to take control of your academic schedule. Instead of relying on unreliable gut feelings or waiting for warning emails from the administration, maintaining a clear record of your attended and conducted classes allows you to plan your semester strategically. It gives you the freedom to utilize your permitted absences for emergencies, medical issues, or well-deserved mental health days without risking academic penalties.",
        "Furthermore, consistent attendance is closely correlated with academic performance. While the primary goal for many students might be simply meeting the minimum requirement, regular presence in lectures ensures you capture nuanced explanations, participate in active discussions, and stay updated on important announcements that might not make it into the official syllabus or digital portals.",
      ],
      callout: {
        type: "didYouKnow",
        title: "The 75% Rule Origin",
        text: "The widely adopted 75% mandatory attendance rule originated as an academic standard to ensure students receive a substantial majority of the prescribed instructional hours, balancing necessary discipline with a 25% buffer for illnesses, emergencies, and extracurricular activities.",
      },
    },
    {
      title: "The Core Formula: How Attendance Percentage is Calculated",
      paragraphs: [
        "Calculating your current attendance is a straightforward application of basic percentage mathematics. The core formula requires only two variables: the total number of classes that have been conducted so far, and the total number of classes you have physically (or virtually) attended.",
        "This calculation provides a snapshot of your current standing. However, the real mathematical challenge arises when you need to project future scenarios. For instance, determining how many consecutive classes you must attend to raise a deficit attendance back to the minimum threshold, or conversely, calculating how many upcoming classes you can safely skip while remaining above the mandatory limit.",
      ],
      formulaBox: {
        title: "Standard Attendance Formula",
        formula: "Percentage = (Classes Attended ÷ Classes Conducted) × 100",
        variables: [
          {
            name: "Classes Attended",
            desc: "The total number of lectures/sessions you were present for.",
          },
          {
            name: "Classes Conducted",
            desc: "The total number of lectures/sessions held by the instructor so far.",
          },
        ],
      },
    },
    {
      title: "Calculating Future Requirements: The 'Catch-Up' Math",
      paragraphs: [
        "When your attendance drops below the required threshold, you enter the 'catch-up' phase. During this time, every single class you attend increases both your 'attended' count and the 'conducted' count by one.",
        "Because both the numerator and the denominator of the percentage fraction increase simultaneously, the overall percentage grows, but at a diminishing rate. This mathematical reality means that recovering from a severe attendance deficit requires a disproportionately high number of consecutive attended classes.",
        "The formula to calculate the exact number of consecutive classes required (let's call it N) to reach a target percentage (T) is derived algebraically: N = ((Target % × Classes Conducted) - (100 × Classes Attended)) ÷ (100 - Target %). Our calculator handles this complex derivation instantly, providing you with a clear, actionable roadmap to academic safety.",
      ],
      exampleBox: {
        title: "Recovering to 75%",
        inputs: [
          { name: "Classes Conducted", val: "40" },
          { name: "Classes Attended", val: "25" },
          { name: "Target", val: "75%" },
        ],
        steps: [
          "Current Percentage = (25 ÷ 40) × 100 = 62.5%.",
          "Apply formula: N = ((75 × 40) - (100 × 25)) ÷ (100 - 75)",
          "N = (3000 - 2500) ÷ 25",
          "N = 500 ÷ 25 = 20",
        ],
        result:
          "You must attend the next 20 consecutive classes to exactly reach 75% (45 attended out of 60 total conducted).",
      },
    },
    {
      title: "The 'Safe to Skip' Scenario",
      paragraphs: [
        "Conversely, if you have been diligent and maintained an attendance percentage well above the required threshold, you accumulate an attendance 'buffer'. This buffer represents the number of future classes you can miss without your overall percentage dropping below the mandatory minimum.",
        "When you skip a class, the 'Classes Conducted' count increases by one, while your 'Classes Attended' count remains static. This causes your overall percentage to drop. Calculating exactly how many classes you can afford to miss requires setting your target percentage and solving for the number of allowable skips.",
        "The formula for allowable skips (S) is: S = ((100 × Classes Attended) - (Target % × Classes Conducted)) ÷ Target %. It is highly recommended to leave a margin of error when utilizing this calculation. Unforeseen circumstances, such as sudden illnesses or transportation strikes, can unexpectedly force an absence. Relying on a zero-margin buffer is a risky strategy that can easily result in falling below the required line.",
      ],
      callout: {
        type: "proTip",
        title: "Keep a Buffer",
        text: "Never aim for exactly 75.00%. Always maintain a buffer of at least 2-3% above the mandatory threshold to account for unexpected emergencies or errors in the official attendance registry.",
      },
    },
    {
      title: "Medical Leaves, Extracurriculars, and Exemptions",
      paragraphs: [
        "It is crucial to understand how your specific educational institution categorizes different types of absences. Not all missed classes impact your attendance percentage in the same way.",
        "Medical leaves often require formal documentation, such as a doctor's certificate, submitted within a specific timeframe. Depending on institutional policy, approved medical leaves may either be entirely excluded from the 'Classes Conducted' denominator (effectively neutralizing the absence) or credited as 'Attended'.",
        "Similarly, participation in officially sanctioned extracurricular activities—such as inter-college sports tournaments, academic conferences, or cultural festivals—usually qualifies for an 'On Duty' (OD) or 'Duty Leave' exemption. Understanding these bureaucratic nuances is just as important as the mathematical calculation itself.",
      ],
    },
    {
      title: "Strategies to Maintain Optimal Attendance",
      paragraphs: [
        "Maintaining a healthy attendance record doesn't require perfection; it requires consistency and planning. Start the semester strong. Building a substantial attendance buffer in the first few weeks of the term provides immense peace of mind later on when assignments pile up or seasonal illnesses strike.",
        "Regularly reconcile your personal attendance tracker with the official college portal. Discrepancies are common; professors might accidentally mark you absent, or technical glitches in biometric systems can miss your entry. Catching and rectifying these errors early is far easier than fighting them at the end of the semester.",
        "Finally, communicate with your instructors. If you anticipate a period of unavoidable absence, informing them in advance demonstrates responsibility and respect. While it may not mathematically alter your attendance percentage, it builds goodwill that can be invaluable if your final percentage lands on a borderline figure like 74.5%.",
      ],
    },
  ],
  faqs: [
    {
      q: "What is an attendance calculator and how does it work?",
      a: "An attendance calculator is a tool designed to compute your current academic attendance percentage. By inputting the total number of classes conducted and the number of classes you have attended, it instantly calculates your current standing. Furthermore, it utilizes algebraic formulas to project exactly how many future classes you need to attend, or can afford to skip, to maintain specific target percentages like 75% or 80%.",
    },
    {
      q: "How do I calculate my current attendance percentage manually?",
      a: "To calculate your attendance manually, divide the total number of classes you have attended by the total number of classes that have been conducted. Multiply the resulting decimal by 100 to get your percentage. For example, if you attended 30 classes out of 40 conducted: (30 ÷ 40) = 0.75. Multiplying by 100 gives you 75%.",
    },
    {
      q: "What happens if my attendance falls below the mandatory 75% rule?",
      a: "Consequences for falling below the mandatory threshold vary by institution but are generally severe. Common penalties include being debarred from sitting for final semester examinations, receiving a grade reduction, losing eligibility for scholarships or campus placements, and in extreme cases, being required to repeat the entire course or semester.",
    },
    {
      q: "How many classes can I skip without my attendance dropping below 75%?",
      a: "The number of classes you can skip depends entirely on your current 'attendance buffer'. If your current percentage is well above 75%, our calculator will use the formula: ((100 × Attended) - (75 × Conducted)) ÷ 75 to determine exactly how many consecutive upcoming classes you can miss before hitting the 75% mark.",
    },
    {
      q: "Does medical leave count toward my overall attendance percentage?",
      a: "This is heavily dependent on your institution's specific policies. In many colleges, presenting a valid medical certificate allows the administration to grant 'medical leave'. This usually means the missed classes are subtracted from the total 'Classes Conducted', effectively neutralizing the penalty. Always consult your student handbook for the exact procedure.",
    },
    {
      q: "Can this calculator help me plan my semester schedule?",
      a: "Absolutely. By projecting future requirements, you can strategically plan when you can afford to take a day off. If you know you have an upcoming family event or need extra time to complete a major project, you can use the calculator to ensure skipping classes for those reasons won't drop you below the danger zone.",
    },
    {
      q: "Is attendance percentage calculated differently for labs and theory classes?",
      a: "Usually, theory classes and practical/lab sessions are evaluated separately. You may be required to maintain a 75% minimum in both theory and practicals independently. Failing to meet the requirement in a lab session might debar you from the practical exam, even if your theory attendance is 90%. It is best to track them as separate subjects.",
    },
    {
      q: "How do colleges enforce the minimum attendance policy?",
      a: "Enforcement mechanisms range from traditional roll calls to advanced technological solutions. Many modern campuses utilize biometric scanners (fingerprint or facial recognition), RFID ID card taps, or location-based mobile app check-ins to record attendance automatically. This data is fed into a centralized portal, which automatically flags students who fall below the minimum threshold.",
    },
  ],
};

export function AttendanceCalculator() {
  const calc = getCalculator("attendance-calculator");
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  const [conducted, setConducted] = useState<number | "">("");
  const [attended, setAttended] = useState<number | "">("");

  const [calcConducted, setCalcConducted] = useState<number>(0);
  const [calcAttended, setCalcAttended] = useState<number>(0);

  const isButtonDisabled =
    conducted === "" ||
    attended === "" ||
    Number(conducted) <= 0 ||
    Number(attended) > Number(conducted) ||
    Number(attended) < 0;

  const handleCalculate = () => {
    if (isButtonDisabled) return;
    setCalcConducted(Number(conducted));
    setCalcAttended(Number(attended));
    markCalculated();
  };

  const handleReset = () => {
    setConducted("");
    setAttended("");
    setCalcConducted(0);
    setCalcAttended(0);
    resetCalculated();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isButtonDisabled) handleCalculate();
  };

  const currentPercentage = calcConducted > 0 ? (calcAttended / calcConducted) * 100 : 0;

  const calculateRequired = (target: number) => {
    if (calcConducted === 0) return 0;
    if (currentPercentage >= target) return 0;
    const req = Math.ceil((target * calcConducted - 100 * calcAttended) / (100 - target));
    return req > 0 ? req : 0;
  };

  const calculateCanSkip = (target: number) => {
    if (calcConducted === 0) return 0;
    if (currentPercentage <= target) return 0;
    const skip = Math.floor((100 * calcAttended - target * calcConducted) / target);
    return skip > 0 ? skip : 0;
  };

  const req75 = calculateRequired(75);
  const req80 = calculateRequired(80);
  const req90 = calculateRequired(90);

  const skip75 = calculateCanSkip(75);
  const skip80 = calculateCanSkip(80);

  return (
    <CalculatorPageLayout
      calc={calc!}
      intro="Calculate your current attendance percentage and find out exactly how many more classes you need to attend (or can afford to miss) to reach targets like 75%, 80%, or 90%."
      formula="Percentage = (Classes Attended ÷ Classes Conducted) × 100"
      example="If you attended 30 classes out of 40 conducted, your attendance is (30 ÷ 40) × 100 = 75%."
      faqs={attendanceBlogContent.faqs!}
      blog={<CalculatorBlog content={attendanceBlogContent} />}
    >
      <div className="flex flex-col gap-6">
        <div className="calc-input-column space-y-4">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Enter Your Attendance Data
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="conducted" className="text-sm font-medium">
                  Total Classes Conducted
                </Label>
                <Input
                  id="conducted"
                  type="number"
                  min="1"
                  placeholder="e.g., 40"
                  value={conducted}
                  onChange={(e) =>
                    setConducted(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  onKeyDown={handleKeyDown}
                  className="h-11 text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attended" className="text-sm font-medium">
                  Total Classes Attended
                </Label>
                <Input
                  id="attended"
                  type="number"
                  min="0"
                  placeholder="e.g., 30"
                  value={attended}
                  onChange={(e) => setAttended(e.target.value === "" ? "" : Number(e.target.value))}
                  onKeyDown={handleKeyDown}
                  className="h-11 text-lg"
                />
              </div>
            </div>
            {Number(attended) > Number(conducted) && (
              <p className="text-sm text-red-500 mt-2">
                Classes attended cannot exceed classes conducted.
              </p>
            )}
          </div>

          <div className="flex flex-row gap-3">
            <CalculateButton
              category="math"
              className="flex-1 min-h-11"
              disabled={isButtonDisabled}
              onClick={handleCalculate}
            >
              Calculate Attendance
            </CalculateButton>
            <Button variant="outline" className="flex-1 min-h-11" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>

        {hasResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-2 flex flex-col gap-6"
          >
            <DashboardSection title="Current Status">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <HeroMetric
                  label="Current Attendance"
                  value={`${currentPercentage.toFixed(2)}%`}
                  sub={`${calcAttended} out of ${calcConducted} classes attended`}
                  glow={currentPercentage >= 75 ? "#10b981" : "#ef4444"}
                  badge={{
                    text: currentPercentage >= 75 ? "Safe" : "Shortage",
                    color: currentPercentage >= 75 ? "green" : "red",
                  }}
                />

                {currentPercentage >= 75 ? (
                  <HeroMetric
                    label="Bunk Allowance"
                    value={`${skip75} classes`}
                    sub="Classes you can skip to stay at 75%"
                    glow="#3b82f6"
                  />
                ) : (
                  <HeroMetric
                    label="Classes Required"
                    value={`${req75} classes`}
                    sub="Consecutive classes to reach 75%"
                    glow="#ef4444"
                  />
                )}
              </div>
            </DashboardSection>

            <DashboardSection title="Target Analysis">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <StatCard
                  index={0}
                  label="To reach 75%"
                  value={currentPercentage >= 75 ? "Achieved" : `${req75} classes`}
                  accent={currentPercentage >= 75 ? "green" : "red"}
                  subValue={
                    currentPercentage >= 75 ? `Can skip ${skip75} classes` : "Need to attend"
                  }
                />
                <StatCard
                  index={1}
                  label="To reach 80%"
                  value={currentPercentage >= 80 ? "Achieved" : `${req80} classes`}
                  accent={currentPercentage >= 80 ? "green" : "amber"}
                  subValue={
                    currentPercentage >= 80 ? `Can skip ${skip80} classes` : "Need to attend"
                  }
                />
                <StatCard
                  index={2}
                  label="To reach 90%"
                  value={currentPercentage >= 90 ? "Achieved" : `${req90} classes`}
                  accent={currentPercentage >= 90 ? "green" : "blue"}
                  subValue={currentPercentage >= 90 ? "Excellent" : "Need to attend"}
                />
              </div>
            </DashboardSection>

            {/* Insights */}
            <DashboardSection title="Smart Insights">
              <div className="flex flex-col gap-2">
                <InsightCard
                  index={0}
                  tone={currentPercentage >= 75 ? "success" : "warning"}
                  text={
                    currentPercentage >= 75
                      ? `Great job! You have a ${currentPercentage.toFixed(1)}% attendance rate. Keep it up to avoid last-minute stress.`
                      : `Your attendance is currently below the typical 75% requirement. You must attend ${req75} consecutive classes to get back on track.`
                  }
                />
                <InsightCard
                  index={1}
                  tone="info"
                  text={
                    currentPercentage >= 75
                      ? `You currently have a buffer of ${skip75} classes before your attendance drops below 75%.`
                      : "Make sure not to skip any upcoming classes to quickly recover your attendance percentage."
                  }
                />
              </div>
            </DashboardSection>
          </motion.div>
        )}
      </div>
    </CalculatorPageLayout>
  );
}
