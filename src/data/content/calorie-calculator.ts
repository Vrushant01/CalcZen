import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The Calorie Calculator estimates your Total Daily Energy Expenditure (TDEE) and determines your daily caloric needs for weight loss, weight maintenance, or muscle gain. By combining your age, biological sex, height, weight, and weekly physical activity frequency with clinical metabolic formulas, this tool provides precise caloric benchmarks and macronutrient guidance to help you reach your body composition goals sustainably.",

  howItWorks:
    "Enter your gender, age, height, current body weight, and weekly physical activity routine (ranging from sedentary desk work to intense daily training). The calculator first calculates your Basal Metabolic Rate (BMR) using the clinically validated Mifflin-St Jeor formula. It then applies the appropriate physical activity multiplier to determine your TDEE (maintenance calories) and provides tailored caloric targets for gentle fat loss (−300 to −500 kcal/day), aggressive cutting, or lean bulking (+250 to +500 kcal/day).",

  formula:
    "Clinically Validated Mifflin-St Jeor Energy Equations:\n\nFor Men:\nBMR (kcal/day) = 10 × weight (kg) + 6.25 × height (cm) − 5 × age (years) + 5\n\nFor Women:\nBMR (kcal/day) = 10 × weight (kg) + 6.25 × height (cm) − 5 × age (years) − 161\n\nTotal Daily Energy Expenditure (TDEE):\nTDEE = BMR × Activity Factor\n- Sedentary (desk job, minimal exercise): 1.2\n- Light Exercise (1 to 3 days/week): 1.375\n- Moderate Exercise (3 to 5 days/week): 1.55\n- Heavy Exercise (6 to 7 days/week): 1.725\n- Very Heavy / Athlete (twice daily training): 1.9",

  example:
    "Consider a 30-year-old male weighing 75 kg with a height of 175 cm who exercises moderately 3 days per week:\n\n1. Calculate BMR: (10 × 75) + (6.25 × 175) − (5 × 30) + 5 = 750 + 1,093.75 − 150 + 5 = 1,698.75 kcal\n2. Moderate Activity Multiplier: 1.55\n3. Calculate TDEE: 1,698.75 × 1.55 ≈ 2,633 kcal/day\n\nTakeaway Goals:\n- Weight Maintenance: ~2,630 kcal/day\n- Healthy Weight Loss (0.5 kg/week deficit): ~2,130 kcal/day (−500 kcal)\n- Mild Fat Loss (0.25 kg/week deficit): ~2,380 kcal/day (−250 kcal)\n- Muscle Gain / Bulking: ~2,880 kcal/day (+250 kcal)",

  mistakes:
    "The most widespread dieting error is adopting an extreme, unsustainable calorie deficit (such as eating under 1,000 calories per day), which triggers adaptive thermogenesis, muscle catabolism, and severe fatigue. Another common mistake is overestimating workout calories while underestimating calorie-dense cooking oils and snacks. Additionally, many individuals fail to adjust their calorie targets downward as they lose weight. Pair your nutrition plan with our Water Intake Calculator to ensure adequate cellular hydration.",

  faqs: [
    {
      question: "How do I calculate my daily calorie needs for weight loss?",
      answer:
        'To lose weight in a healthy, sustainable manner, subtract 300 to 500 calories from your Total Daily Energy Expenditure (TDEE). A daily deficit of 500 kcal creates a cumulative weekly deficit of 3,500 kcal, which equates to roughly 0.5 kg (1 lb) of fat loss per week without sacrificing lean muscle. You can assess your baseline metabolic burn with our <a href="/calculator/bmr-calculator" class="text-primary hover:underline">BMR Calculator</a>.',
    },
    {
      question: "What is the difference between BMR and TDEE in calorie calculations?",
      answer:
        'Basal Metabolic Rate (BMR) represents the bare minimum calories your body burns at complete rest just to sustain vital life functions like breathing and heartbeat. Total Daily Energy Expenditure (TDEE) accounts for your BMR plus the thermic effect of food and all physical activity performed throughout the day. To measure your general body proportions relative to height, explore our <a href="/calculator/bmi-calculator" class="text-primary hover:underline">BMI Calculator</a>.',
    },
    {
      question: "How many calories should I eat each day to maintain my weight?",
      answer:
        "To maintain your current body weight, your daily caloric intake should match your TDEE. At this maintenance level, the energy supplied by food equals the total energy your body expends on metabolic upkeep and daily physical activity, keeping your scale weight stable.",
    },
    {
      question: "How should I divide my daily calories into macronutrients?",
      answer:
        "A balanced split is 40% carbohydrates, 30% protein, and 30% healthy fats. For active individuals or those in a calorie deficit, prioritize 1.6 to 2.2 grams of protein per kilogram of body weight to preserve muscle mass and stay satiated.",
    },
    {
      question: "Why does weight loss plateau after a few months on a diet?",
      answer:
        "As you lose body weight, your body burns fewer calories simply because it takes less energy to move a lighter body, reducing your BMR. Additionally, non-exercise movement often drops subconsciously. Periodically recalculate your numbers as your weight decreases to keep progressing.",
    },
  ],

  authorityLinks: [
    {
      text: "National Institutes of Health (NIH) Body Weight Planner",
      url: "https://www.niddk.nih.gov/bwp",
    },
    {
      text: "World Health Organization (WHO) Healthy Diet Recommendations",
      url: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
    },
  ],

  relatedCalculators: [
    "bmr-calculator",
    "bmi-calculator",
    "water-intake-calculator",
    "sleep-calculator",
  ],
};

export default content;
