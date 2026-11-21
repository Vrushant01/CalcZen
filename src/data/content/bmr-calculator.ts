import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The Basal Metabolic Rate (BMR) calculator computes the baseline number of calories your body burns every 24 hours simply staying alive at rest—supporting essential physiological functions including respiratory ventilation, cellular turnover, cardiac circulation, renal filtration, and thermoregulation. Serving fitness enthusiasts, dieters, and healthcare professionals, it establishes your resting energy baseline and applies clinical activity multipliers to determine your Total Daily Energy Expenditure (TDEE). This enables you to systematically calibrate caloric deficits for fat loss or caloric surpluses for lean muscle hypertrophy without starvation or metabolic slowdown.",

  howItWorks:
    "To determine your basal metabolism and daily calorie expenditure, complete the physiological fields:\n\n1. Biological Sex: Select Male or Female, which governs the baseline metabolic offset due to anatomical and hormonal differences in lean tissue density.\n2. Age: Enter your current age in years (basal metabolic rate naturally declines by roughly 1% to 2% per decade after age 30 due to progressive sarcopenia).\n3. Height & Weight: Input your height in centimeters (or feet/inches) and weight in kilograms (or pounds).\n4. Activity Level: Select your typical physical lifestyle:\n   - Sedentary: Little or no exercise, desk work (1.2× multiplier)\n   - Light Activity: Light exercise or walking 1 to 3 days per week (1.375× multiplier)\n   - Moderate Activity: Moderate cardio or strength training 3 to 5 days per week (1.55× multiplier)\n   - Very Active: Hard training or sports 6 to 7 days per week (1.725× multiplier)\n   - Extra Active: Demanding physical labor or twice-daily athletic training (1.9× multiplier)\n\nClick Calculate to receive your resting BMR alongside your activity-adjusted maintenance calories, weight loss deficit, and weight gain targets.",

  formula:
    "The calculator utilizes the clinically validated Mifflin-St Jeor equation, recognized by the Academy of Nutrition and Dietetics as the most reliable predictive formula for non-obese and obese adults:\n\nFor Men:\nBMR (kcal/day) = (10 × Weight in kg) + (6.25 × Height in cm) − (5 × Age in years) + 5\n\nFor Women:\nBMR (kcal/day) = (10 × Weight in kg) + (6.25 × Height in cm) − (5 × Age in years) − 161\n\nTotal Daily Energy Expenditure (TDEE):\nTDEE = BMR × Physical Activity Factor (PAL)\n\nCalorie Target Adjustments:\n- Mild Fat Loss (0.25 kg/week): TDEE − 250 kcal/day\n- Standard Fat Loss (0.5 kg/week): TDEE − 500 kcal/day\n- Lean Bulking (+0.25 kg/week): TDEE + 250 to 300 kcal/day\n\nDisclaimer: BMR formulas provide statistical estimates. Individual metabolic rates vary with lean muscle mass percentage, thyroid hormones, and prior chronic dieting.",

  example:
    "Example 1 (Adult Male):\nConsider a 30-year-old male with a height of 175 cm and body weight of 72 kg, working a desk job (Sedentary):\n- BMR = (10 × 72) + (6.25 × 175) − (5 × 30) + 5\n- BMR = 720 + 1093.75 − 150 + 5 = 1668.75 kcal/day\n- Sedentary TDEE = 1668.75 × 1.2 = 2002.5 ≈ 2003 kcal/day\n- Target for 0.5 kg/week fat loss = 2003 − 500 = 1503 kcal/day\n\nExample 2 (Adult Female):\nConsider a 28-year-old female with a height of 162 cm and body weight of 58 kg, engaging in moderate gym workouts 4 days per week (Moderate Activity):\n- BMR = (10 × 58) + (6.25 × 162) − (5 × 28) − 161\n- BMR = 580 + 1012.5 − 140 − 161 = 1291.5 kcal/day\n- Moderate Activity TDEE = 1291.5 × 1.55 = 2001.8 ≈ 2002 kcal/day\n- Maintenance calorie intake = 2002 kcal/day.",

  mistakes:
    "1. Eating below your resting BMR: Restricting calorie intake below your basal metabolic rate deprives vital organs of energy, triggering adaptive thermogenesis, hormonal dysregulation, and lean muscle catabolism.\n2. Overestimating daily physical activity: Selecting 'Very Active' for a 45-minute gym session while sitting at an office desk for 9 hours artificially inflates daily calorie burns by 400 to 600 calories.\n3. Ignoring changes in body weight over time: As you lose weight, your BMR and TDEE drop; failing to recalculate your baseline every 4 to 6 weeks causes weight-loss plateaus.\n4. Forgetting liquid calories and cooking oils: Sauces, dressings, sugary beverages, and edible cooking oils add 300 to 500 untracked calories that can completely negate a planned deficit.\n5. Confusing BMR with TDEE: BMR is purely resting metabolic cost. Consuming your BMR without factoring in walking and exercise will result in continuous unintended weight loss.",

  faqs: [
    {
      question: "What is the difference between BMR and RMR?",
      answer:
        "Basal Metabolic Rate (BMR) is measured under strict laboratory conditions immediately upon waking after 8 hours of sleep and 12 hours of fasting in a dark, thermoneutral room. Resting Metabolic Rate (RMR) measures resting energy expenditure under less stringent conditions without overnight laboratory stays. In clinical practice, RMR is typically 3% to 5% higher than BMR.",
    },
    {
      question: "Why do males typically have a higher BMR than females of the same weight?",
      answer:
        "Men generally possess greater skeletal muscle mass and lower essential body fat percentages compared to women of identical weight. Because skeletal muscle tissue has significantly higher metabolic activity than adipose tissue, male resting energy expenditure is higher.",
    },
    {
      question: "Can I increase my basal metabolic rate?",
      answer:
        "Yes, the most sustainable way to elevate your BMR is through progressive resistance strength training to build lean muscle mass. Increasing dietary protein intake also boosts the thermic effect of food (TEF), and avoiding severe crash diets prevents adaptive metabolic slowing.",
    },
    {
      question: "Is it safe to eat fewer calories than my calculated BMR?",
      answer:
        "Eating below your BMR is generally not recommended unless supervised by a physician or registered dietitian. Sustained sub-BMR caloric intake can cause fatigue, micronutrient deficiencies, hair loss, loss of menstrual cycle in women, and muscle wasting.",
    },
    {
      question: "How does aging impact basal metabolism?",
      answer:
        "BMR declines by approximately 1% to 2% per decade after young adulthood. This reduction is largely driven by age-related muscle loss (sarcopenia) and decreased cellular mitochondrial density. Regular resistance exercise and adequate dietary protein can substantially offset this age-related metabolic decline.",
    },
  ],

  authorityLinks: [
    { text: "World Health Organization (WHO) - Diet, Nutrition and Physical Activity", url: "https://www.who.int/initiatives/behealthy/healthy-diet" },
    { text: "ICMR - National Institute of Nutrition (NIN) Dietary Guidelines", url: "https://www.nin.res.in/" },
  ],

  relatedCalculators: ["calorie-calculator", "body-fat-calculator", "protein-calculator", "bmi-calculator"],
  lastReviewed: "2026-11-21",
};

export default content;
