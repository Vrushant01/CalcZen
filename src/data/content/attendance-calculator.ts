import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The attendance calculator helps college, university, and school students track, manage, and optimize their academic lecture attendance. In many Indian educational boards, statutory university bodies (such as the UGC and AICTE), and professional degree programs, a minimum 75% or 80% attendance is mandatory to avoid detention or debarment from semester examinations. By tracking total lectures conducted and sessions attended, this tool calculates your current standing and algebraically projects exactly how many consecutive future classes you must attend to recover your percentage, or how many upcoming classes you can safely skip without dropping below required thresholds.",

  howItWorks:
    "Using the attendance calculator requires only two or three basic academic numbers:\n\n1. Classes Conducted: Enter the cumulative total number of lectures, practicals, or tutorial periods held so far in the academic term.\n2. Classes Attended: Enter the number of periods you have physically attended and been marked present for.\n3. Target Attendance (%): Select or enter your required threshold (default presets are 75% for standard university rules and 80% for strict professional or lab programs).\n\nClick Calculate to receive your current attendance percentage, academic status indicator, and exact class projection (either classes needed to attend or classes you can safely miss).",

  formula:
    "The calculator applies standard percentage mathematics and linear projection algebra:\n\n1. Current Attendance Percentage:\nCurrent % = (Classes Attended / Classes Conducted) × 100\n\n2. When Attendance is Below Target (Current % < Target %):\nTo find the number of consecutive future classes (x) you must attend without missing any to reach Target percentage T:\n(Attended + x) / (Conducted + x) ≥ T / 100\nSolving for x:\n100 × (Attended + x) ≥ T × (Conducted + x)\n100 × Attended + 100x ≥ T × Conducted + Tx\n(100 − T)x ≥ T × Conducted − 100 × Attended\nx = ⌈ (T × Conducted − 100 × Attended) / (100 − T) ⌉\n\n3. When Attendance is Above Target (Current % ≥ Target %):\nTo find how many upcoming classes (y) you can skip consecutively without dropping below Target T:\nAttended / (Conducted + y) ≥ T / 100\nSolving for y:\n100 × Attended ≥ T × (Conducted + y)\nT × y ≤ 100 × Attended − T × Conducted\ny = ⌊ (100 × Attended − T × Conducted) / T ⌋",

  example:
    "Consider an engineering student in a semester with 45 total lectures conducted so far:\n- Classes Conducted: 45\n- Classes Attended: 30\n- Current Attendance: (30 / 45) × 100 = 66.67% (Below required 75% threshold)\n- Target Percentage: 75%\n\nRecovery Calculation:\nx = ⌈ (75 × 45 − 100 × 30) / (100 − 75) ⌉\nx = ⌈ (3375 − 3000) / 25 ⌉\nx = ⌈ 375 / 25 ⌉ = 15 classes\n\nVerification:\nIf the student attends the next 15 consecutive classes without missing any:\n- New Attended Count = 30 + 15 = 45\n- New Total Conducted Count = 45 + 15 = 60\n- New Percentage = (45 / 60) × 100 = 75.00%\n\nThe student must attend exactly 15 consecutive classes to reach the safe 75% threshold.",

  mistakes:
    "1. Assuming percentage increases 1-for-1 when attending classes: Because each attended class adds to both the numerator and denominator, recovery happens at a diminishing rate as the semester progresses.\n2. Ignoring medical leave and duty leave documentation deadlines: Waiting until final exam hall tickets are released to submit official medical certificates often results in administrative rejection.\n3. Confusing subject-wise attendance with aggregate attendance: Many universities require a minimum 75% in each individual subject or laboratory course, not just an overall semester average.\n4. Relying on unofficial student tally logs: Discrepancies between your personal diary and official university ERP portals should be resolved with department faculty immediately.\n5. Skipping multiple classes consecutively right after recovering to 75%: Dropping your guard when marginally at 75.1% means a single missed class plunges you right back into the detention zone.",

  faqs: [
    {
      question: "Why do Indian universities mandate a minimum 75% attendance?",
      answer:
        "The University Grants Commission (UGC) and bodies like AICTE, MCI, and BCI mandate 75% attendance to guarantee regular student participation in lectures, seminars, and laboratory work. A 25% allowance is provided to cover medical emergencies, cultural representation, and personal leaves.",
    },
    {
      question: "What is condonation of attendance?",
      answer:
        "Most universities allow a condonation of 5% to 10% (permitting students with 65% to 74% attendance to sit for exams) on valid medical grounds, bereavement, or participation in recognized university sports, upon submitting verified certificates and paying a prescribed administrative fee.",
    },
    {
      question: "What happens if my attendance falls below 65%?",
      answer:
        "Students falling below 65% attendance are generally detained for the semester. This means you will not receive exam admit cards and will be required to re-register for the course and attend lectures again in a subsequent academic term.",
    },
    {
      question: "Are laboratory and practical sessions weighted differently than lectures?",
      answer:
        "Yes, in many technical institutions, laboratory sessions carry strict independent attendance criteria (often 80% to 85%), and missing lab practicals may prevent you from qualifying for internal viva and practical board evaluations.",
    },
    {
      question: "How does the calculator determine classes I can afford to skip?",
      answer:
        "When your current attendance exceeds your target, the calculator calculates how many future classes can be added to the denominator without increasing the numerator before the fraction drops below your selected target percentage.",
    },
  ],

  authorityLinks: [
    { text: "University Grants Commission (UGC)", url: "https://www.ugc.gov.in/" },
    { text: "All India Council for Technical Education (AICTE)", url: "https://www.aicte-india.org/" },
  ],

  relatedCalculators: ["cgpa-calculator", "percentage-calculator", "standard-calculator"],
  lastReviewed: "2026-11-21",
};

export default content;
