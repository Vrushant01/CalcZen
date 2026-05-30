import {
  Calculator, Home, Heart, Percent, Coins, TrendingUp,
  Activity, Baby, Flame, Droplet, Scale, Cake, Receipt,
  type LucideIcon,
} from "lucide-react";

export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  /** Homepage tile background + border */
  color: string;
  /** Homepage tile icon tint */
  iconColor: string;
};

export const categories: Category[] = [
  {
    slug: "finance",
    name: "Finance",
    description: "Loans, investments, savings & more",
    icon: Coins,
    color: "category-card-finance",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
  {
    slug: "health",
    name: "Health",
    description: "BMI, calories, fitness metrics",
    icon: Heart,
    color: "category-card-health",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    slug: "math",
    name: "Math",
    description: "Percentages, ratios, age & GPA",
    icon: Calculator,
    color: "category-card-math",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    slug: "everyday",
    name: "Everyday",
    description: "Tips, dates, fuel, lifestyle",
    icon: Receipt,
    color: "category-card-everyday",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
];

export type CalculatorMeta = {
  slug: string;
  name: string;
  category: Category["slug"];
  description: string;
  keywords: string[];
  icon: LucideIcon;
  popular?: boolean;
  trending?: boolean;
  metaTitle?: string;
  metaDescription?: string;
};

export const calculators: CalculatorMeta[] = [
  {
    slug: "mortgage-calculator",
    name: "Mortgage Calculator",
    category: "finance",
    description: "Estimate your monthly mortgage payment with taxes, insurance and HOA included.",
    keywords: ["mortgage", "home loan", "monthly payment"],
    icon: Home, popular: true, trending: true,
    metaTitle: "Mortgage Calculator - Estimate Monthly Home Loan Payments | CalcZen",
    metaDescription: "Calculate monthly mortgage payments, interest rates, taxes, and HOA fees instantly. Estimate your home loan costs and budget with our free calculator.",
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    category: "finance",
    description: "See how your money grows with the power of compounding over time.",
    keywords: ["compound interest", "investment", "savings"],
    icon: TrendingUp, popular: true,
    metaTitle: "Compound Interest Calculator - Calculate Savings Growth Online | CalcZen",
    metaDescription: "Calculate compound interest growth for your savings and investments. See detailed annual compound schedules and charts to visualize your future wealth.",
  },
  {
    slug: "loan-emi-calculator",
    name: "Loan EMI Calculator",
    category: "finance",
    description: "Calculate your monthly EMI for any loan amount, rate and tenure.",
    keywords: ["emi", "loan", "payment"],
    icon: Coins, popular: true,
    metaTitle: "Loan EMI Calculator - Calculate Monthly Loan Payments Online | CalcZen",
    metaDescription: "Calculate your monthly loan EMI payouts, interest payable, and total loan payment instantly. Plan home, car, or personal loan budgets with our tool.",
  },
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    category: "health",
    description: "Check your Body Mass Index and understand your healthy weight range.",
    keywords: ["bmi", "body mass index", "health"],
    icon: Scale, popular: true, trending: true,
    metaTitle: "BMI Calculator - Calculate Body Mass Index Online | CalcZen",
    metaDescription: "Calculate your Body Mass Index (BMI) instantly. Understand your healthy weight category and track your health fitness metrics online with our tool.",
  },
  {
    slug: "calorie-calculator",
    name: "Calorie Calculator",
    category: "health",
    description: "Estimate your daily calorie needs based on your goals and activity.",
    keywords: ["calories", "tdee", "diet"],
    icon: Flame, popular: true,
    metaTitle: "Calorie Calculator - Calculate Daily Calorie Needs Online | CalcZen",
    metaDescription: "Estimate daily calorie needs for weight loss, gain, or maintenance. Calculate your TDEE based on height, weight, activity, and fitness goals easily.",
  },
  {
    slug: "water-intake-calculator",
    name: "Water Intake Calculator",
    category: "health",
    description: "Find out how much water you should drink each day.",
    keywords: ["water", "hydration", "health"],
    icon: Droplet,
    metaTitle: "Water Intake Calculator - Calculate Daily Hydration Needs | CalcZen",
    metaDescription: "Calculate your daily water intake needs based on weight, exercise time, and climate. Keep hydrated and track your daily hydration goals with ease.",
  },
  {
    slug: "pregnancy-due-date-calculator",
    name: "Pregnancy Due Date",
    category: "health",
    description: "Estimate your baby's due date from your last menstrual period.",
    keywords: ["pregnancy", "due date", "baby"],
    icon: Baby,
    metaTitle: "Pregnancy Due Date Calculator - Calculate Baby Due Date | CalcZen",
    metaDescription: "Estimate your baby's due date, gestational age, and pregnancy progress timeline instantly. Track your pregnancy milestones online using clinical metrics.",
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    category: "math",
    description: "Quickly calculate percentages, increases and decreases.",
    keywords: ["percentage", "percent"],
    icon: Percent, popular: true, trending: true,
    metaTitle: "Percentage Calculator - Calculate Percent Shifts and Ratios | CalcZen",
    metaDescription: "Calculate percentage increases, decreases, differences, and fractional shifts instantly. Solve school or business percent math equations in seconds.",
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    category: "math",
    description: "Find your exact age in years, months, days, and total minutes.",
    keywords: ["age", "birthday"],
    icon: Cake, popular: true,
    metaTitle: "Age Calculator - Calculate Exact Age from Date of Birth | CalcZen",
    metaDescription: "Calculate your exact age in years, months, days, minutes, and seconds from your birthdate. Find the time remaining until your next birthday instantly.",
  },
  {
    slug: "tip-calculator",
    name: "Tip Calculator",
    category: "everyday",
    description: "Calculate tips and split the bill fairly among friends.",
    keywords: ["tip", "bill", "restaurant"],
    icon: Receipt, popular: true,
    metaTitle: "Tip Calculator - Calculate Restaurant Tips & Split Bills | CalcZen",
    metaDescription: "Calculate tip percentages and split restaurant bills evenly among friends in seconds. Manage tipping amounts and group payment transactions fairly.",
  },
  {
    slug: "bmr-calculator",
    name: "BMR Calculator",
    category: "health",
    description: "Calculate your Basal Metabolic Rate — calories burned at rest.",
    keywords: ["bmr", "metabolism"],
    icon: Activity,
    metaTitle: "BMR Calculator - Calculate Basal Metabolic Rate Online | CalcZen",
    metaDescription: "Calculate your Basal Metabolic Rate (BMR) instantly. Estimate calories burned at rest based on height, weight, gender, and age for fitness planning.",
  },
];

export const getCalculator = (slug: string) =>
  calculators.find((c) => c.slug === slug);

export const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);

export const calculatorsByCategory = (slug: string) =>
  calculators.filter((c) => c.category === slug);
