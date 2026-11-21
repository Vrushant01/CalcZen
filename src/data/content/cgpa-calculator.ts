import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The CGPA calculator computes Semester Grade Point Average (SGPA) and Cumulative Grade Point Average (CGPA) for undergraduate and postgraduate university students. Engineered in alignment with University Grants Commission (UGC) Choice Based Credit System (CBCS) guidelines, it weights academic course performance by assigned credit hours. Whether calculating a single semester's SGPA across theory and lab subjects or determining your aggregate multi-year CGPA and equivalent percentage for campus recruitment, scholarship eligibility, or foreign master's admissions, it delivers clear academic calculations.",

  howItWorks:
    "Calculating your GPA follows a two-part academic framework:\n\n1. Semester SGPA Calculation: Enter each course subject, its credit weighting (e.g. 1 to 5 credits), and the letter grade or grade point achieved (10-point scale: O=10, A+=9, A=8, B+=7, B=6, C=5, P=4, F=0).\n2. Cumulative CGPA Calculation (Optional): If you have completed prior semesters, enter your existing cumulative CGPA and total prior earned credits to calculate your updated overall standing.\n3. Percentage Conversion: The calculator automatically displays your equivalent percentage using standard AICTE/CBSE and university conversion formulas.\n\nClick Calculate to receive your Semester SGPA, overall Cumulative CGPA, total attempted credits, and university percentage equivalent.",

  formula:
    "The calculator adheres to the standardized UGC Choice Based Credit System (CBCS) mathematical formulations:\n\n1. Semester Grade Point Average (SGPA):\nSGPA = ∑ (C_i × G_i) / ∑ C_i\nwhere C_i is the credit value of course i, G_i is the grade point scored in course i, and the summation runs over all courses enrolled in the semester.\n\n2. Cumulative Grade Point Average (CGPA):\nCGPA = ∑ (C_j × S_j) / ∑ C_j = Total Quality Points Across All Semesters / Total Credits Earned Across All Semesters\nWhen combining prior CGPA with a new semester:\nNew CGPA = [(Prior CGPA × Prior Credits) + (Current SGPA × Current Credits)] / (Prior Credits + Current Credits)\n\n3. Equivalent Percentage Conversion:\n- Standard UGC / AICTE / CBSE Formula: Equivalent Percentage (%) = CGPA × 9.5\n- Alternative University Specific Rules (e.g. Mumbai University): Percentage = 7.1 + (CGPA × 7.25) for certain ranges, or (CGPA − 0.75) × 10.",

  example:
    "Consider an engineering student completing a semester with 4 enrolled courses:\n- Course 1 (Advanced Mathematics): 4 Credits, Grade A+ (9 Points) → Quality Points = 4 × 9 = 36\n- Course 2 (Data Structures): 3 Credits, Grade A (8 Points) → Quality Points = 3 × 8 = 24\n- Course 3 (Database Management): 3 Credits, Grade O (10 Points) → Quality Points = 3 × 10 = 30\n- Course 4 (Object-Oriented Lab): 2 Credits, Grade B+ (7 Points) → Quality Points = 2 × 7 = 14\n\nSGPA Calculation:\n- Total Semester Credits = 4 + 3 + 3 + 2 = 12 Credits\n- Total Grade Points = 36 + 24 + 30 + 14 = 104 Points\n- SGPA = 104 / 12 = 8.67\n\nCumulative Integration:\nIf the student previously had a CGPA of 8.20 across 40 completed credits:\n- Prior Quality Points = 8.20 × 40 = 328\n- New Total Quality Points = 328 + 104 = 432\n- New Total Credits = 40 + 12 = 52\n- Updated CGPA = 432 / 52 = 8.31\n- AICTE Equivalent Percentage = 8.31 × 9.5 = 78.95%",

  mistakes:
    "1. Treating all subjects equally without credit weighting: Averaging grade points directly without multiplying by credit hours produces false GPA scores, as 4-credit core subjects carry double the weight of 2-credit labs.\n2. Using the wrong percentage conversion factor: Applying a generic 10× multiplier when your university explicitly mandates the standard 9.5× formula can lead to disqualification during job verification.\n3. Counting failed (F grade) credits incorrectly: An F grade carries 0 grade points, but the credit hours are still included in attempted credits, lowering the semester SGPA.\n4. Omitting audit or pass/fail non-credit courses: Enrolling in zero-credit mandatory courses should not alter GPA formulas; ensure non-graded audit courses are not assigned artificial credits.\n5. Forgetting that re-evaluations alter prior semester denominators: If a grade is revised post-rechecking, recompute all subsequent CGPA cumulative totals.",

  faqs: [
    {
      question: "What is the official formula to convert CGPA to percentage in India?",
      answer:
        "The standard formula prescribed by AICTE and CBSE is: Percentage = CGPA × 9.5. However, state universities like VTU, Mumbai University, or Anna University have specific conversion notifications published on transcripts. Always verify with your institution's examination cell.",
    },
    {
      question: "What is the difference between SGPA and CGPA?",
      answer:
        "SGPA (Semester Grade Point Average) measures your academic performance in one specific semester. CGPA (Cumulative Grade Point Average) is the credit-weighted average of your performance across all completed semesters from the beginning of your academic degree program.",
    },
    {
      question: "How does a back-paper or backlog affect my CGPA?",
      answer:
        "When you clear a backlog in a supplementary examination, the new grade point replaces the 0 grade point earned during the failed attempt, recalculating your cumulative CGPA upwards based on the course credit weight.",
    },
    {
      question: "Why do universities use a 10-point scale instead of a 4-point scale?",
      answer:
        "The UGC 10-point grading scale provides finer differentiation across student performance tiers (O, A+, A, B+, B, C, P, F) compared to 4-point systems. Students applying abroad can easily convert their 10-point CGPA to a 4.0 scale using WES (World Education Services) credential evaluation standards.",
    },
    {
      question: "What is considered a First Class with Distinction CGPA?",
      answer:
        "In most Indian technical universities, a CGPA of 7.50 and above (equivalent to 71.25%+) achieved without backlogs is classified as First Class with Distinction. A CGPA of 6.50 to 7.49 represents First Class.",
    },
  ],

  authorityLinks: [
    { text: "University Grants Commission (UGC) - CBCS Guidelines", url: "https://www.ugc.gov.in/" },
    { text: "All India Council for Technical Education (AICTE)", url: "https://www.aicte-india.org/" },
  ],

  relatedCalculators: ["attendance-calculator", "percentage-calculator", "standard-calculator"],
  lastReviewed: "2026-11-21",
};

export default content;
