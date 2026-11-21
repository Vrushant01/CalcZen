import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The body fat calculator estimates your body fat percentage, absolute fat mass, and lean body mass using the scientifically established U.S. Navy Circumference Method. Unlike basic Body Mass Index (BMI), which relies solely on height and weight and frequently misclassifies muscular athletes as overweight, this calculator measures anatomical body circumferences to differentiate metabolically active skeletal muscle and bone mass from stored adipose tissue. It provides health categories ranging from essential fat and athletic conditioning to acceptable fitness and obesity.",

  howItWorks:
    "To obtain an accurate body fat estimate, take snug measurements using a non-stretchable measuring tape:\n\n1. Gender: Select Male or Female (anatomical fat distribution differs significantly between sexes).\n2. Age & Weight: Enter your chronological age and current scale weight in kilograms or pounds.\n3. Height: Input your standing barefoot height in centimeters or inches.\n4. Neck Circumference: Measure horizontally across the neck just below the laryngeal prominence (Adam's apple).\n5. Waist Circumference: For men, measure horizontally at the level of the navel (belly button). For women, measure horizontally at the narrowest point of the torso (natural waistline).\n6. Hip Circumference (Females only): Measure around the widest horizontal circumference of the buttocks.\n\nClick Calculate to receive your estimated body fat percentage, lean mass, fat mass, and fitness categorization.",

  formula:
    "The calculator implements the official U.S. Navy physical readiness formulas (metric units):\n\nFor Men:\nBody Fat % = 495 / [1.0324 − 0.19077 × log10(Waist − Neck) + 0.15456 × log10(Height)] − 450\n\nFor Women:\nBody Fat % = 495 / [1.29579 − 0.35004 × log10(Waist + Hip − Neck) + 0.22100 × log10(Height)] − 450\n\nDerived Mass Metrics:\n- Fat Mass (kg) = Body Weight (kg) × (Body Fat % / 100)\n- Lean Body Mass (kg) = Body Weight (kg) − Fat Mass (kg)\n\nStandard Classification (American Council on Exercise):\n- Men: Essential Fat (2–5%), Athletes (6–13%), Fitness (14–17%), Acceptable (18–24%), Obesity (25%+)\n- Women: Essential Fat (10–13%), Athletes (14–20%), Fitness (21–24%), Acceptable (25–31%), Obesity (32%+)\n\nDisclaimer: This tool provides health estimates for informational purposes and is not a substitute for clinical DXA scans or personalized medical evaluation.",

  example:
    "Consider an adult male undergoing a fitness evaluation with the following measurements:\n- Gender: Male\n- Height: 175 cm\n- Body Weight: 75 kg\n- Neck Circumference: 38 cm\n- Waist Circumference: 85 cm\n\nMathematical Evaluation:\n- Waist − Neck = 85 − 38 = 47 cm\n- log10(47) ≈ 1.6721\n- log10(175) ≈ 2.2430\n- Denominator = 1.0324 − (0.19077 × 1.6721) + (0.15456 × 2.2430)\n- Denominator = 1.0324 − 0.31398 + 0.34668 = 1.0651\n- Body Fat % = (495 / 1.0651) − 450 = 464.75 − 450 ≈ 16.9%\n\nBody Composition Breakdown:\n- Body Fat Percentage: 16.9% (Categorized as 'Fitness')\n- Total Fat Mass = 75 kg × 0.169 = 12.7 kg\n- Lean Body Mass = 75 kg − 12.7 kg = 62.3 kg",

  mistakes:
    "1. Pulling the measuring tape too tight: Compressing underlying skin and soft tissue falsely reduces circumference readings and produces an inaccurate body fat percentage.\n2. Measuring at inconsistent times of day: Body water fluctuations, heavy meals, and bloating throughout the day alter waist measurements by 1 to 3 cm; always measure first thing in the morning fasted.\n3. Sucking in your stomach during the waist measurement: Relax your abdominal wall and exhale normally before recording waist circumference to maintain measurement integrity.\n4. Using a stretched cloth measuring tape: Old fabric tapes stretch over time, leading to significant measurement distortion; use a steel or fiberglass body-measuring tape.\n5. Comparing results from different estimation methods: Comparing calipers, bioimpedance scales, and Navy circumference measurements is like comparing apples to oranges; stick to one method to track progress trends.",

  faqs: [
    {
      question: "How accurate is the U.S. Navy body fat formula compared to a DEXA scan?",
      answer:
        "Clinical validation studies demonstrate that the U.S. Navy circumference method has a strong correlation (within 3% to 4% margin of error) with dual-energy X-ray absorptiometry (DEXA) scans for most general adults. While DEXA is the clinical gold standard, the Navy method is non-invasive, accessible, and highly reliable for tracking body composition changes over time.",
    },
    {
      question: "Why do women require higher essential body fat percentages than men?",
      answer:
        "Women naturally possess essential body fat (10% to 13%) required for hormonal regulation, menstrual function, reproductive health, and fetal development. Dropping below essential levels can lead to amenorrhea, bone density loss, and endocrine complications.",
    },
    {
      question: "Where should the neck measurement be taken?",
      answer:
        "Measure the neck at its narrowest point, just below the larynx (Adam's apple), with your head held erect and looking straight forward. Do not flare your neck or flex your trapezius muscles during measurement.",
    },
    {
      question: "Why does the formula subtract neck circumference from waist circumference?",
      answer:
        "Neck circumference correlates positively with skeletal bone structure and lean muscular frame size. Subtracting the neck circumference helps the algorithm distinguish between broad-shouldered individuals and those carrying excess abdominal adipose tissue.",
    },
    {
      question: "Can I use this calculator if I have high muscle mass?",
      answer:
        "Yes, the Navy method performs considerably better than BMI for muscular individuals because muscular development increases neck and frame dimensions, offsetting waist circumference and avoiding false overweight classifications.",
    },
  ],

  authorityLinks: [
    { text: "World Health Organization (WHO) - Body Mass & Obesity Standards", url: "https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight" },
    { text: "ICMR - National Institute of Nutrition (NIN)", url: "https://www.nin.res.in/" },
  ],

  relatedCalculators: ["bmi-calculator", "bmr-calculator", "protein-calculator", "calorie-calculator"],
  lastReviewed: "2026-11-21",
};

export default content;
