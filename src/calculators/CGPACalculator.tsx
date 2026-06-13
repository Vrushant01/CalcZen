import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog, { type BlogContent } from "@/components/CalculatorBlog";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalculateButton } from "@/components/CalculateButton";
import { PDF_SITE_NAME, PDF_SITE_URL } from "@/constants/pdfBrand";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { motion } from "framer-motion";
import { HeroMetric, StatCard, DashboardSection, InsightCard } from "@/components/dashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, PlusCircle } from "lucide-react";

type Subject = {
  id: string;
  name: string;
  grade: string;
  credits: number | "";
};

const cgpaBlogContent: BlogContent = {
  primaryKeyword: "CGPA calculator",
  category: "Education & Academic Performance",
  introText:
    "A <strong>CGPA calculator</strong> (Cumulative Grade Point Average calculator) is an essential academic tool for students in high school, college, and university. It allows you to track your overall academic performance across multiple semesters by converting your letter grades into a standardized numerical average. Understanding your CGPA is critical because it directly impacts your eligibility for scholarships, financial aid, honors programs, and even future employment opportunities or graduate school admissions. This tool removes the manual, error-prone process of multiplying individual grade points by credit hours and dividing by total credits. Whether you are aiming for Dean's List, trying to avoid academic probation, or just planning your upcoming semester to reach a specific target GPA, this calculator provides instant clarity. By inputting your current semester subjects, grades, and credits alongside your previous academic history, you can mathematically forecast exactly what it will take to achieve your educational goals.",
  sections: [
    {
      title: "How It Works: SGPA vs. CGPA",
      paragraphs: [
        "To properly use this calculator, you must understand the distinction between SGPA (Semester Grade Point Average) and CGPA (Cumulative Grade Point Average). While both measure academic performance, they do so over different timeframes.",
        "**SGPA** measures your performance for a single, specific semester or academic term. It is calculated by dividing the total grade points earned in that semester by the total number of credit hours attempted in that same semester.",
        "**CGPA**, on the other hand, is the overarching average of your entire academic career. It takes into account all courses you have ever taken, across all semesters. Your CGPA is calculated by dividing the grand total of all grade points earned by the grand total of all credit hours attempted.",
      ],
      table: {
        headers: ["Metric", "Scope", "Impact"],
        rows: [
          ["SGPA", "A single semester", "Determines semester honors (e.g., Dean's List)"],
          [
            "CGPA",
            "Entire academic history",
            "Determines graduation honors, scholarship eligibility, and grad school admission",
          ],
        ],
      },
    },
    {
      title: "The Mathematical Formula for CGPA",
      paragraphs: [
        "The mathematics behind CGPA calculation rely on a weighted average, not a simple average. This means a 4-credit course has a significantly larger impact on your final GPA than a 1-credit course.",
        "First, each letter grade is assigned a numerical value (e.g., A = 4.0, B = 3.0). Then, for each subject, you multiply the numerical grade value by the course's credit hours to get the 'Grade Points' for that specific course. You sum up all the Grade Points and divide by the total Credits.",
      ],
      formulaBox: {
        title: "Standard CGPA Formula",
        formula:
          "GPA = Total Grade Points / Total Credit Hours \n(Where Total Grade Points = Sum of (Subject Grade Value * Subject Credits))",
        variables: [
          {
            name: "Grade Value",
            desc: "The numerical equivalent of your letter grade (e.g., A = 4.0)",
          },
          { name: "Credits", desc: "The weight or credit hours assigned to the course" },
          { name: "Total Grade Points", desc: "The sum of all individual course grade points" },
        ],
      },
    },
    {
      title: "Step-by-Step Calculation Example",
      paragraphs: [
        "Let us calculate the SGPA for a hypothetical semester containing three courses.",
      ],
      exampleBox: {
        title: "Semester GPA Calculation",
        inputs: [
          { name: "Calculus", val: "4 Credits, Grade: A (4.0)" },
          { name: "Physics", val: "3 Credits, Grade: B (3.0)" },
          { name: "Lab", val: "1 Credit, Grade: C (2.0)" },
        ],
        steps: [
          "Calculate Calculus points: 4 credits * 4.0 = 16.0",
          "Calculate Physics points: 3 credits * 3.0 = 9.0",
          "Calculate Lab points: 1 credit * 2.0 = 2.0",
          "Sum Grade Points: 16.0 + 9.0 + 2.0 = 27.0",
          "Sum Total Credits: 4 + 3 + 1 = 8",
          "Calculate SGPA: 27.0 / 8 = 3.375",
        ],
        result: "Your Semester GPA (SGPA) for this term is exactly <strong>3.375</strong>.",
      },
    },
    {
      title: "When To Use This Calculator",
      paragraphs: [
        "This calculator should be used frequently throughout the academic year. At the beginning of a semester, you can use it to set target grades by playing with different scenarios. During midterms, you can input your projected grades to see if you are on track.",
        "It is particularly crucial when deciding whether to drop a class or take it Pass/Fail. By simulating how a potential 'C' or 'D' in a heavy-credit course will affect your overall CGPA, you can make an informed, strategic decision before your university's drop deadline.",
      ],
    },
  ],
  faqs: [
    {
      q: "What is the difference between GPA and CGPA?",
      a: "GPA (Grade Point Average) is often used interchangeably with SGPA to denote the average for a specific semester or academic term. CGPA (Cumulative Grade Point Average) is the combined average of all your grades across all semesters you have completed so far.",
    },
    {
      q: "Does a 1-credit lab affect my CGPA as much as a 4-credit lecture?",
      a: "No. CGPA is a weighted average based on credit hours. A 4-credit lecture has four times the mathematical impact on your final CGPA as a 1-credit lab. Therefore, it is mathematically more important to secure high grades in heavy-credit courses.",
    },
    {
      q: "How do Pass/Fail classes affect my CGPA?",
      a: "Generally, if you pass a Pass/Fail (or Satisfactory/Unsatisfactory) class, you earn the credits, but it does not affect your CGPA at all—no grade points are added. However, if you fail, some universities calculate the 'Fail' as a 0.0, which severely drags down your CGPA. Always check your specific university's policy.",
    },
    {
      q: "What is considered a 'Good' CGPA?",
      a: "This varies heavily by institution and major. Generally, a CGPA above 3.0 is considered 'good', a 3.5 or above is considered 'excellent' (often qualifying for Dean's List or Cum Laude honors), and a 3.8+ is highly competitive for top-tier graduate programs.",
    },
    {
      q: "Can I raise my CGPA significantly in my final senior year?",
      a: "It is mathematically very difficult. Because CGPA is an average of all credits, by your senior year, you have already accumulated so many credits that a single new semester's grades will only shift your overall average slightly. This is why building a strong CGPA in your freshman and sophomore years is crucial.",
    },
    {
      q: "How do repeated courses affect my CGPA?",
      a: "Policies vary by school. Many universities have a 'grade forgiveness' policy where if you retake a course, the new grade replaces the old grade in your CGPA calculation (though both may stay on your transcript). Others average the two grades together.",
    },
    {
      q: "Is a 4.0 the highest possible CGPA?",
      a: "In a standard unweighted system, yes, 4.0 is the maximum. However, many high schools use a 'weighted' GPA system where Advanced Placement (AP) or Honors classes are scored out of 5.0, allowing students to achieve GPAs higher than 4.0.",
    },
    {
      q: "Why did my CGPA drop even though my SGPA was high?",
      a: "This is mathematically impossible. If your SGPA for a given semester is strictly higher than your existing CGPA, your new overall CGPA must go up. If your CGPA dropped, there was likely an error in credit calculation or a previously incomplete grade resolved into a lower grade.",
    },
  ],
};

const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  F: 0.0,
};

export function CGPACalculator() {
  const calc = getCalculator("cgpa-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  const [prevCGPA, setPrevCGPA] = useState<number | "">("");
  const [prevCredits, setPrevCredits] = useState<number | "">("");

  const [subjects, setSubjects] = useState<Subject[]>([
    { id: "1", name: "Course 1", grade: "A", credits: 3 },
    { id: "2", name: "Course 2", grade: "B+", credits: 3 },
    { id: "3", name: "Course 3", grade: "A-", credits: 4 },
  ]);

  const [result, setResult] = useState<{
    sgpa: number;
    cgpa: number | null;
    termCredits: number;
    totalCredits: number;
    totalPoints: number;
  } | null>(null);

  const handleAddSubject = () => {
    setSubjects([
      ...subjects,
      {
        id: Math.random().toString(36).substring(7),
        name: `Course ${subjects.length + 1}`,
        grade: "A",
        credits: 3,
      },
    ]);
  };

  const handleRemoveSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((s) => s.id !== id));
    }
  };

  const updateSubject = (id: string, field: keyof Subject, value: any) => {
    setSubjects(subjects.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const isButtonDisabled =
    subjects.some((s) => s.credits === "" || Number(s.credits) < 0) ||
    (prevCGPA !== "" && prevCredits === "") ||
    (prevCredits !== "" && prevCGPA === "");

  const handleCalculate = () => {
    if (isButtonDisabled) return;

    let termPoints = 0;
    let termCredits = 0;

    subjects.forEach((s) => {
      const creds = Number(s.credits) || 0;
      const pts = GRADE_POINTS[s.grade] || 0;
      termPoints += creds * pts;
      termCredits += creds;
    });

    const sgpa = termCredits > 0 ? termPoints / termCredits : 0;
    let cgpa: number | null = null;
    let totalCredits = termCredits;
    let totalPoints = termPoints;

    if (prevCGPA !== "" && prevCredits !== "") {
      const pCGPA = Number(prevCGPA);
      const pCreds = Number(prevCredits);
      totalCredits += pCreds;
      totalPoints += pCGPA * pCreds;
      cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    }

    setResult({
      sgpa,
      cgpa,
      termCredits,
      totalCredits,
      totalPoints,
    });

    markCalculated();
  };

  const handleReset = () => {
    setPrevCGPA("");
    setPrevCredits("");
    setSubjects([
      { id: "1", name: "Course 1", grade: "A", credits: 3 },
      { id: "2", name: "Course 2", grade: "B+", credits: 3 },
      { id: "3", name: "Course 3", grade: "A-", credits: 4 },
    ]);
    setResult(null);
    resetCalculated();
  };

  const pdfData =
    hasResult && result
      ? {
          calculatorName: "CGPA Calculator",
          calculatorSlug: "cgpa-calculator",
          siteName: PDF_SITE_NAME,
          siteUrl: PDF_SITE_URL,
          inputs: [
            ...(prevCGPA !== "" ? [{ label: "Previous CGPA", value: prevCGPA.toString() }] : []),
            ...(prevCredits !== ""
              ? [{ label: "Previous Credits", value: prevCredits.toString() }]
              : []),
          ],
          results: [
            { label: "Semester GPA (SGPA)", value: result.sgpa.toFixed(2), highlight: true },
            ...(result.cgpa !== null
              ? [{ label: "Cumulative GPA (CGPA)", value: result.cgpa.toFixed(2), highlight: true }]
              : []),
            { label: "Term Credits", value: result.termCredits.toString(), highlight: false },
            {
              label: "Total Accumulated Credits",
              value: result.totalCredits.toString(),
              highlight: false,
            },
          ],
          summary: `You attempted ${result.termCredits} credits this semester, earning a Semester GPA of ${result.sgpa.toFixed(2)}.${result.cgpa !== null ? ` With your previous academic history included, your new Cumulative GPA is ${result.cgpa.toFixed(2)} over ${result.totalCredits} total credits.` : ""}`,
          tableData: {
            title: "SEMESTER COURSE BREAKDOWN",
            headers: ["Course", "Credits", "Grade", "Points"],
            rows: subjects.map((s) => [
              s.name,
              s.credits.toString(),
              s.grade,
              ((Number(s.credits) || 0) * (GRADE_POINTS[s.grade] || 0)).toFixed(2),
            ]),
          },
        }
      : null;

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Calculate your Semester Grade Point Average (SGPA) and Cumulative Grade Point Average (CGPA). Enter your course grades and credit hours below to track your academic performance."
      formula={`SGPA = Total Grade Points / Total Credits\nGrade Points = Subject Grade Value × Subject Credits\nCGPA = (Previous CGPA × Previous Credits + Current SGPA × Current Credits) / Total Credits`}
      example={`You take 3 courses: 4 credits (Grade A = 4.0), 3 credits (Grade B = 3.0), and 3 credits (Grade C = 2.0). Total Credits = 10. Total Points = (4×4) + (3×3) + (3×2) = 16 + 9 + 6 = 31. SGPA = 31 / 10 = 3.10.`}
      faqs={cgpaBlogContent.faqs}
      blog={<CalculatorBlog content={cgpaBlogContent} />}
    >
      <div className="flex flex-col gap-6">
        <div className="calc-input-column">
          <div className="rounded-lg border border-border/60 bg-card p-4 space-y-4">
            <h3 className="text-sm font-semibold">Previous Academic History (Optional)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Previous CGPA</Label>
                <Input
                  type="number"
                  step={0.01}
                  min={0}
                  max={4}
                  value={prevCGPA}
                  onChange={(e) => setPrevCGPA(e.target.value === "" ? "" : Number(e.target.value))}
                  className="mt-1"
                  placeholder="e.g. 3.5"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">
                  Previous Total Credits
                </Label>
                <Input
                  type="number"
                  step={1}
                  min={0}
                  value={prevCredits}
                  onChange={(e) =>
                    setPrevCredits(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="mt-1"
                  placeholder="e.g. 60"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Current Semester Courses</h3>
            </div>

            <div className="space-y-3">
              {subjects.map((subject, index) => (
                <div
                  key={subject.id}
                  className="flex flex-col sm:flex-row gap-3 items-end p-3 border border-border/50 rounded-lg bg-card/50"
                >
                  <div className="w-full sm:flex-1">
                    <Label className="text-xs text-muted-foreground mb-1 block">Course Name</Label>
                    <Input
                      value={subject.name}
                      onChange={(e) => updateSubject(subject.id, "name", e.target.value)}
                      placeholder="e.g. Calculus I"
                    />
                  </div>
                  <div className="w-full sm:w-32">
                    <Label className="text-xs text-muted-foreground mb-1 block">Credits</Label>
                    <Input
                      type="number"
                      min={0}
                      step={0.5}
                      value={subject.credits}
                      onChange={(e) =>
                        updateSubject(
                          subject.id,
                          "credits",
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      placeholder="Credits"
                    />
                  </div>
                  <div className="w-full sm:w-32">
                    <Label className="text-xs text-muted-foreground mb-1 block">Grade</Label>
                    <Select
                      value={subject.grade}
                      onValueChange={(val) => updateSubject(subject.id, "grade", val)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(GRADE_POINTS).map((g) => (
                          <SelectItem key={g} value={g}>
                            {g} ({GRADE_POINTS[g].toFixed(1)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {subjects.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => handleRemoveSubject(subject.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full" onClick={handleAddSubject}>
              <PlusCircle className="w-4 h-4 mr-2" /> Add Course
            </Button>
          </div>

          <div className="flex flex-row gap-3 mt-4">
            <CalculateButton
              category="math"
              className="flex-1 min-h-11"
              disabled={isButtonDisabled}
              onClick={handleCalculate}
            >
              Calculate GPA
            </CalculateButton>
            <Button variant="outline" className="flex-1 min-h-11" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>

        {hasResult && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-2 flex flex-col gap-6"
          >
            <HeroMetric
              label={result.cgpa !== null ? "Cumulative GPA (CGPA)" : "Semester GPA (SGPA)"}
              value={result.cgpa !== null ? result.cgpa.toFixed(2) : result.sgpa.toFixed(2)}
              sub={`Based on ${result.totalCredits} total credits attempted.`}
              glow="#8b5cf6"
            />

            <DashboardSection title="Academic Metrics">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard
                  index={0}
                  label="Semester SGPA"
                  value={result.sgpa.toFixed(2)}
                  accent="purple"
                />
                {result.cgpa !== null && (
                  <StatCard
                    index={1}
                    label="Cumulative CGPA"
                    value={result.cgpa.toFixed(2)}
                    accent="blue"
                  />
                )}
                <StatCard
                  index={2}
                  label="Term Credits"
                  value={result.termCredits.toString()}
                  accent="green"
                />
                <StatCard
                  index={3}
                  label="Total Credits"
                  value={result.totalCredits.toString()}
                  accent="amber"
                />
              </div>
            </DashboardSection>

            <DashboardSection title="Smart Insights">
              <div className="flex flex-col gap-2">
                <InsightCard
                  index={0}
                  tone={result.sgpa >= 3.0 ? "success" : "info"}
                  text={`Your semester GPA is ${result.sgpa.toFixed(2)}. You earned ${result.termCredits} credits out of your current term courses.`}
                />
                {result.cgpa !== null && (
                  <InsightCard
                    index={1}
                    tone="tip"
                    text={`With your previous academic history of ${prevCredits} credits, your overall CGPA is now ${result.cgpa.toFixed(2)}.`}
                  />
                )}
                {result.sgpa < 2.0 && (
                  <InsightCard
                    index={2}
                    tone="warning"
                    text={`Your semester GPA is below 2.0. Academic probation thresholds vary by institution, but it is highly recommended to consult with your academic advisor.`}
                  />
                )}
              </div>
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
