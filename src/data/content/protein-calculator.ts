import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The protein calculator computes your recommended daily protein intake in grams based on your body weight, physical activity level, and specific fitness objective (weight maintenance, fat loss, or lean muscle hypertrophy). Grounded in peer-reviewed clinical nutrition guidelines from the Indian Council of Medical Research (ICMR-NIN) and the International Society of Sports Nutrition (ISSN), it provides realistic protein ranges (from 0.8 g/kg for sedentary baseline health up to 2.4 g/kg for athletic conditioning) and breaks down optimal per-meal protein distribution to maximize muscle protein synthesis (MPS).",

  howItWorks:
    "To calculate your daily macronutrient target, enter your personal fitness parameters:\n\n1. Unit of Measurement: Choose Metric (kilograms) or Imperial (pounds).\n2. Body Weight: Input your current scale weight (e.g. 70 kg).\n3. Primary Fitness Goal:\n   - Weight Maintenance: Maintain current muscle mass and daily bodily repair.\n   - Fat Loss: Preserve lean muscle while consuming a caloric deficit.\n   - Muscle Hypertrophy / Bulking: Provide amino acid surplus for building new muscle tissue.\n4. Physical Activity Tier:\n   - Sedentary: Little to no regular exercise\n   - Light Activity: Light exercise 1 to 3 days/week\n   - Moderate Activity: Moderate training 3 to 5 days/week\n   - Active: Hard training or sports 6 to 7 days/week\n   - Very Active: Intense athletic conditioning or heavy physical labor\n\nClick Calculate to receive your daily protein target range (grams/day), average baseline, and practical per-meal pacing suggestions across 3, 4, 5, or 6 daily meals.",

  formula:
    "The calculator applies evidence-based protein intake multipliers per kilogram of body weight:\n\n1. Daily Protein Target Range (grams/day):\nMinimum Daily Protein = Body Weight (kg) × Min Multiplier\nMaximum Daily Protein = Body Weight (kg) × Max Multiplier\nAverage Daily Target = (Minimum + Maximum) / 2\n\nScientific Multiplier Matrix (g/kg body weight):\n- Maintenance: Sedentary [0.8, 1.0], Light [1.0, 1.2], Moderate [1.2, 1.5], Active [1.5, 1.7], Very Active [1.7, 2.0]\n- Fat Loss (preserving muscle in a deficit): Sedentary [1.2, 1.4], Light [1.4, 1.6], Moderate [1.6, 1.8], Active [1.8, 2.0], Very Active [2.0, 2.4]\n- Muscle Gain (hypertrophy support): Sedentary [1.4, 1.6], Light [1.6, 1.8], Moderate [1.8, 2.0], Active [2.0, 2.2], Very Active [2.2, 2.4]\n\n2. Optimal Per-Meal Pacing (Muscle Protein Synthesis Threshold):\nPer-Meal Target = Total Daily Protein / Number of Meals (typically 25g to 40g of high-quality protein per feeding containing ~2.5g to 3g of the essential amino acid leucine).\n\nDisclaimer: General nutritional guidance only. Individuals with pre-existing renal disease or liver dysfunction should consult a physician or registered dietitian before modifying protein intake.",

  example:
    "Consider an active individual weighing 70 kg pursuing lean muscle hypertrophy, working out 6 days per week (Active tier):\n- Body Weight: 70 kg\n- Primary Goal: Muscle Gain\n- Activity Level: Active (Exercise 6–7 days/week)\n- Prescribed Scientific Range: 2.0 to 2.2 grams of protein per kilogram of body weight\n\nDaily Intake Calculation:\n- Minimum Daily Protein = 70 kg × 2.0 g/kg = 140 grams/day\n- Maximum Daily Protein = 70 kg × 2.2 g/kg = 154 grams/day\n- Average Target = (140 + 154) / 2 = 147 grams/day\n\nPer-Meal Distribution (4 Meals per day):\n- 147 g / 4 meals ≈ 37 grams of protein per meal (e.g. 3 eggs + paneer/tofu at breakfast, chicken/soya chunks at lunch, whey protein shake post-workout, and lentils/curd with dinner).",

  mistakes:
    "1. Consuming all daily protein in one massive meal: Muscle Protein Synthesis (MPS) caps out around 30 to 45 grams per feeding; spreading protein across 3 to 5 evenly spaced meals stimulates muscle growth far more effectively.\n2. Neglecting protein quality and complete amino acid profiles: Plant-based eaters must combine complementary protein sources (e.g. rice and lentils) to ensure adequate levels of all 9 essential amino acids and leucine.\n3. Cutting protein drastically during a calorie-deficit diet: When dieting for fat loss, protein requirements actually increase (up to 2.0–2.4 g/kg) to prevent the body from breaking down existing muscle tissue for fuel.\n4. Relying exclusively on protein supplements: Whey protein powders are convenient, but whole foods (eggs, chicken, fish, paneer, lentils, Greek yogurt, tofu) provide vital micronutrients, zinc, iron, and satiety.\n5. Forgetting that total daily calories govern weight gain or loss: Eating high protein without managing total caloric intake will not produce fat loss if you remain in an overall energy surplus.",

  faqs: [
    {
      question: "Is consuming high protein harmful to healthy kidneys?",
      answer:
        "Extensive scientific literature, including studies published by the International Society of Sports Nutrition (ISSN), demonstrates that high protein diets (up to 2.5–3.0 g/kg) do not cause kidney damage in healthy individuals with normal renal function. However, those with pre-existing chronic kidney disease (CKD) must strictly follow medical protein restrictions.",
    },
    {
      question: "What are the best vegetarian and vegan protein sources in an Indian diet?",
      answer:
        "Excellent vegetarian sources include paneer (18g/100g), Greek yogurt/curd (10g/100g), low-fat milk, whey protein, and eggs (for eggetarians). Outstanding vegan sources include soya chunks (52g/100g dry), tofu (15g/100g), tempeh, edamame, lentils (dal), chickpeas (chana), and plant-based pea/brown rice protein powders.",
    },
    {
      question: "What is the Recommended Dietary Allowance (RDA) for baseline protein in India?",
      answer:
        "The Indian Council of Medical Research (ICMR-NIN) prescribes an RDA of 0.83 grams of protein per kilogram of body weight per day for sedentary healthy adults to prevent nutritional deficiency. Active individuals and strength athletes require significantly higher amounts.",
    },
    {
      question: "What is the 'anabolic window' after a workout?",
      answer:
        "While early bodybuilding lore claimed you must drink protein within 30 minutes of lifting weights, modern exercise science shows the anabolic window lasts several hours. Meeting your total daily protein target and consuming protein within 2 hours before or after training is optimal for recovery.",
    },
    {
      question: "Why is the amino acid Leucine so important for muscle growth?",
      answer:
        "Leucine acts as the primary biochemical trigger for the mTOR pathway, which initiates muscle protein synthesis. Consuming approximately 2.5 to 3 grams of leucine per meal (found naturally in dairy, eggs, meat, or enriched plant proteins) optimizes the muscle-building response.",
    },
  ],

  authorityLinks: [
    { text: "ICMR - National Institute of Nutrition (NIN) Dietary Guidelines for Indians", url: "https://www.nin.res.in/" },
    { text: "International Society of Sports Nutrition (ISSN) Position Stands", url: "https://jissn.biomedcentral.com/" },
  ],

  relatedCalculators: ["calorie-calculator", "bmr-calculator", "body-fat-calculator", "water-intake-calculator"],
  lastReviewed: "2026-11-21",
};

export default content;
