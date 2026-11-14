import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The Water Intake Calculator estimates your optimal daily hydration target based on your body weight, daily exercise duration, and climate. Proper hydration supports metabolic health, kidney function, cognitive focus, physical stamina, and joint lubrication. This tool converts clinical fluid intake recommendations into simple, actionable daily guidelines in litres and millilitres, accounting for increased sweat loss in hot climates or during intense physical training.",

  howItWorks:
    "Enter your body weight in kilograms, your daily exercise or physical workout time in minutes, and your typical climate condition (temperate, hot, or humid). The calculator uses evidence-based baseline fluid calculations (approximately 30 to 35 ml of water per kilogram of body weight) and adds hydration buffers (typically 350 to 500 ml for every 30 minutes of moderate to high-intensity exercise, plus climate multipliers) to determine your complete daily water target.",

  formula:
    "Baseline and Adjusted Daily Hydration Equations:\n\nBaseline Fluid Need (L) = Body Weight (kg) × 0.033 L/kg\n\nExercise Adjustment (L) = (Workout Duration in Minutes ÷ 30) × 0.35 L\n\nClimate Multiplier:\n- Temperate: 1.0\n- Hot / Dry: 1.15 (+15% fluid intake)\n- Tropical / Humid: 1.20 (+20% fluid intake)\n\nTotal Daily Water Target (L) = (Baseline + Exercise Adjustment) × Climate Multiplier",

  example:
    "Consider an individual weighing 70 kg living in a warm Indian climate who exercises for 45 minutes daily:\n\n1. Baseline Water Need: 70 kg × 0.033 L = 2.31 Litres\n2. Exercise Surcharge: (45 min ÷ 30) × 0.35 L = 0.525 Litres\n3. Pre-climate Subtotal: 2.31 + 0.525 = 2.835 Litres\n4. Climate Adjustment (Hot +15%): 2.835 × 1.15 ≈ 3.26 Litres\n\nTakeaway Result:\n- Recommended Daily Hydration: ~3.3 Litres (approx. 13 to 14 standard 250ml glasses)\n- Regular interval target: ~250 ml every 60 to 90 minutes throughout active daylight hours.",

  mistakes:
    "A frequent hydration error is relying purely on thirst as an indicator; by the time you feel thirsty, your body is already 1% to 2% dehydrated. Another mistake is drinking excessive quantities in a single sitting rather than pacing fluid consumption across the day. Additionally, many people fail to increase water intake during summer months or dry air-conditioned office environments, or mistake dehydration headaches for hunger. Check your general energy expenditure alongside water needs with our Calorie Calculator.",

  faqs: [
    {
      question: "How much water should I drink a day by weight?",
      answer:
        'A standard clinical guideline is to drink 30 to 35 ml of water per kilogram of body weight daily. For example, a person weighing 60 kg needs roughly 1.8 to 2.1 litres of water, while someone weighing 80 kg requires 2.4 to 2.8 litres. In tropical Indian climates or during workouts, add 500 to 1,000 ml to compensate for sweat loss. You can check your body mass index with our <a href="/calculator/bmi-calculator" class="text-primary hover:underline">BMI Calculator</a> to assess overall health metrics.',
    },
    {
      question: "Do tea, coffee, and fruits count toward daily water intake?",
      answer:
        'Yes, about 20% to 30% of your daily water intake comes from solid food, especially hydrating fruits and vegetables like watermelon, oranges, and cucumbers. Mildly caffeinated beverages like tea and coffee do contribute to net hydration despite mild diuretic effects, though pure water remains best. You can track your overall nutritional targets using our <a href="/calculator/calorie-calculator" class="text-primary hover:underline">Calorie Calculator</a>.',
    },
    {
      question: "How does climate and physical activity affect daily hydration needs?",
      answer:
        'High ambient temperatures and humidity in Indian summers significantly accelerate fluid loss through perspiration, raising daily hydration needs by 15% to 25%. Similarly, every 30 minutes of vigorous workout requires an extra 350 to 500 ml of fluid. Balancing your daily water intake with restful recovery is also vital, which you can plan with our <a href="/calculator/sleep-calculator" class="text-primary hover:underline">Sleep Calculator</a>.',
    },
    {
      question: "What are the common signs of dehydration?",
      answer:
        "The most reliable indicator of hydration is urine colour: pale or light straw-coloured urine signals healthy hydration, whereas dark amber or brown urine indicates dehydration. Other common symptoms include dry mouth, persistent thirst, fatigue, headaches, dizziness, and reduced urination frequency.",
    },
    {
      question: "Can drinking too much water be harmful?",
      answer:
        "Yes, drinking extreme volumes of water in a very short timeframe can dilute sodium levels in your bloodstream, a potentially dangerous condition known as hyponatremia. Healthy kidneys can filter about 0.8 to 1.0 litre of water per hour, so it is best to sip fluids evenly throughout the day rather than chugging multiple litres at once.",
    },
  ],

  authorityLinks: [
    {
      text: "National Academies of Sciences, Engineering, and Medicine (NASEM) Dietary Reference Intakes for Water",
      url: "https://www.nationalacademies.org/",
    },
    {
      text: "World Health Organization (WHO) Guidelines on Drinking-water Quality",
      url: "https://www.who.int/publications/i/item/9789240045064",
    },
  ],

  relatedCalculators: [
    "calorie-calculator",
    "bmi-calculator",
    "bmr-calculator",
    "sleep-calculator",
  ],
};

export default content;
