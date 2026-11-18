import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The BMI (Body Mass Index) Calculator is a standardized physiological screening tool that measures the ratio of your body weight to your height. Used globally by healthcare practitioners, the World Health Organization (WHO), and public health researchers, BMI provides an initial benchmark to classify weight into clinical ranges: underweight (below 18.5), normal weight (18.5 to 24.9), overweight (25.0 to 29.9), and obesity (class I: 30.0 to 34.9, class II: 35.0 to 39.9, and class III: 40.0 or higher). It helps identify potential metabolic health risks, including hypertension, type 2 diabetes, osteoarthritis, and cardiovascular disease.",

  howItWorks:
    "Enter your height and weight using either metric (centimeters, kilograms) or imperial units (feet, inches, pounds). The calculator converts all dimensions to standard metric units, divides your weight in kilograms by the square of your height in meters (kg/m²), identifies your WHO clinical classification, and computes your ideal healthy weight target range (BMI 18.5 to 24.9) tailored specifically to your height.",

  formula:
    "Metric Formula:\nBMI = weight (kg) ÷ [height (m)]²\n\nImperial Formula:\nBMI = [weight (lbs) × 703] ÷ [height (inches)]²\n\nHealthy Weight Range for Given Height:\n- Minimum Healthy Weight (kg) = 18.5 × [height (m)]²\n- Maximum Healthy Weight (kg) = 24.9 × [height (m)]²",

  example:
    "Suppose an adult stands 175 cm tall (1.75 meters) and weighs 72 kg:\n\n1. Square the height: 1.75 × 1.75 = 3.0625 m²\n2. Divide weight by height squared: 72 ÷ 3.0625 = 23.51 kg/m²\n\nResults Breakdown:\n- Calculated BMI: 23.5 kg/m²\n- Clinical Category: Normal / Healthy Weight (18.5 – 24.9)\n- Healthy Weight Window for 175 cm: 56.7 kg to 76.3 kg\n- Metabolic Health Risk Profile: Low / Optimal baseline risk",

  mistakes:
    "A common limitation of BMI is that it does not distinguish between muscle mass, skeletal density, and body fat. Athletes, bodybuilders, and active individuals with substantial lean muscle tissue may register in the overweight or obese category despite having exceptionally low body fat. Conversely, older adults experiencing age-related muscle loss (sarcopenia) may display a normal BMI while carrying elevated visceral adipose tissue. Pair BMI with our BMR and Body Fat tools for a complete wellness profile.",

  faqs: [
    {
      question: "What is a healthy BMI range for adults?",
      answer:
        "According to the World Health Organization (WHO), a healthy adult BMI ranges from 18.5 to 24.9 kg/m². A score below 18.5 indicates underweight status, 25.0 to 29.9 is classified as overweight, and 30.0 or greater falls into obesity categories.",
    },
    {
      question: "Why doesn't BMI differentiate between muscle and fat?",
      answer:
        'BMI is a purely weight-to-height ratio that does not measure body composition directly. Muscle tissue is denser and heavier than fat tissue, meaning highly muscular individuals can have elevated BMI scores without excess adipose tissue. To assess caloric requirements alongside BMI, use our <a href="/calculator/bmr-calculator" class="text-primary hover:underline">BMR Calculator</a> or <a href="/calculator/body-fat-calculator" class="text-primary hover:underline">Body Fat Calculator</a>.',
    },
    {
      question: "What are Asian BMI cutoffs compared to international standards?",
      answer:
        "Due to higher cardiovascular and diabetic risks at lower adiposity levels among Asian populations, WHO and Indian health authorities recommend revised thresholds: Normal weight is 18.5 to 22.9 kg/m², Overweight is 23.0 to 24.9 kg/m², and Obese is 25.0 kg/m² or above.",
    },
    {
      question: "Can BMI be used for children and adolescents?",
      answer:
        "For children and teens aged 2 to 19, BMI is calculated using the same formula but interpreted using age- and sex-specific growth percentiles (CDC/WHO growth charts) because body composition shifts rapidly throughout childhood development.",
    },
    {
      question: "How do I calculate my daily calorie needs from my BMI?",
      answer:
        'Once you know your BMI and baseline weight target, determine your Basal Metabolic Rate and active energy expenditure using our <a href="/calculator/calorie-calculator" class="text-primary hover:underline">Calorie Calculator</a> or optimize daily hydration with our <a href="/calculator/water-intake-calculator" class="text-primary hover:underline">Water Intake Calculator</a>.',
    },
  ],

  authorityLinks: [
    {
      text: "World Health Organization (WHO) Body Mass Index (BMI) Classification",
      url: "https://www.who.int/data/gho/data/themes/topics/topic-details/GHO/body-mass-index",
    },
    {
      text: "CDC About Adult BMI & Health Guidelines",
      url: "https://www.cdc.gov/bmi/adult-calculator/index.html",
    },
  ],

  relatedCalculators: [
    "bmr-calculator",
    "calorie-calculator",
    "body-fat-calculator",
    "water-intake-calculator",
  ],
};

export default content;
