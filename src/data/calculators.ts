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
    color: "from-sky-100 to-blue-50 border-sky-200/80 dark:from-sky-950/70 dark:to-blue-950/50 dark:border-sky-500/25",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
  {
    slug: "health",
    name: "Health",
    description: "BMI, calories, fitness metrics",
    icon: Heart,
    color: "from-emerald-100 to-teal-50 border-emerald-200/80 dark:from-emerald-950/70 dark:to-teal-950/50 dark:border-emerald-500/25",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    slug: "math",
    name: "Math",
    description: "Percentages, ratios, age & GPA",
    icon: Calculator,
    color: "from-violet-100 to-indigo-50 border-violet-200/80 dark:from-violet-950/70 dark:to-indigo-950/50 dark:border-violet-500/25",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    slug: "everyday",
    name: "Everyday",
    description: "Tips, dates, fuel, lifestyle",
    icon: Receipt,
    color: "from-amber-100 to-orange-50 border-amber-200/80 dark:from-amber-950/65 dark:to-orange-950/45 dark:border-amber-500/25",
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
    metaTitle: "Mortgage Calculator - Free Home Loan Calculator | CalcZen",
    metaDescription: "Calculate mortgage payments, interest costs, and affordability instantly using CalcZen's free Mortgage Calculator.",
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    category: "finance",
    description: "See how your money grows with the power of compounding over time.",
    keywords: ["compound interest", "investment", "savings"],
    icon: TrendingUp, popular: true,
    metaTitle: "Compound Interest Calculator - Grow Your Savings | CalcZen",
    metaDescription: "Calculate how your money grows over time with compounding interest. See detailed annual schedules and charts.",
  },
  {
    slug: "loan-emi-calculator",
    name: "Loan EMI Calculator",
    category: "finance",
    description: "Calculate your monthly EMI for any loan amount, rate and tenure.",
    keywords: ["emi", "loan", "payment"],
    icon: Coins, popular: true,
    metaTitle: "Loan EMI Calculator - Free Monthly Payment Estimator | CalcZen",
    metaDescription: "Calculate your monthly EMI, interest payable, and total loan payment for personal, car, or home loans.",
  },
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    category: "health",
    description: "Check your Body Mass Index and understand your healthy weight range.",
    keywords: ["bmi", "body mass index", "health"],
    icon: Scale, popular: true, trending: true,
    metaTitle: "BMI Calculator - Free Body Mass Index Calculator | CalcZen",
    metaDescription: "Check your Body Mass Index (BMI) instantly. Find your healthy weight range based on height and age.",
  },
  {
    slug: "calorie-calculator",
    name: "Calorie Calculator",
    category: "health",
    description: "Estimate your daily calorie needs based on your goals and activity.",
    keywords: ["calories", "tdee", "diet"],
    icon: Flame, popular: true,
    metaTitle: "Calorie Calculator - Free Daily Calorie Needs Estimator | CalcZen",
    metaDescription: "Estimate your daily calorie needs for weight loss, maintenance, or gain based on TDEE and activity level.",
  },
  {
    slug: "water-intake-calculator",
    name: "Water Intake Calculator",
    category: "health",
    description: "Find out how much water you should drink each day.",
    keywords: ["water", "hydration", "health"],
    icon: Droplet,
    metaTitle: "Water Intake Calculator - Daily Hydration Estimator | CalcZen",
    metaDescription: "Calculate how much water you should drink daily based on your weight, activity levels, and environment.",
  },
  {
    slug: "pregnancy-due-date-calculator",
    name: "Pregnancy Due Date",
    category: "health",
    description: "Estimate your baby's due date from your last menstrual period.",
    keywords: ["pregnancy", "due date", "baby"],
    icon: Baby,
    metaTitle: "Pregnancy Due Date Calculator - Track Due Date | CalcZen",
    metaDescription: "Calculate your baby's estimated due date, gestational age, and progress timeline instantly.",
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    category: "math",
    description: "Quickly calculate percentages, increases and decreases.",
    keywords: ["percentage", "percent"],
    icon: Percent, popular: true, trending: true,
    metaTitle: "Percentage Calculator - Free Percent Math Tool | CalcZen",
    metaDescription: "Quickly calculate percentage increases, decreases, differences, and fractional shifts instantly.",
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    category: "math",
    description: "Find your exact age in years, months, days, and total minutes.",
    keywords: ["age", "birthday"],
    icon: Cake, popular: true,
    metaTitle: "Age Calculator - Exact Age in Years, Months & Days | CalcZen",
    metaDescription: "Calculate your exact age in years, months, days, minutes, and seconds from your birthdate.",
  },
  {
    slug: "tip-calculator",
    name: "Tip Calculator",
    category: "everyday",
    description: "Calculate tips and split the bill fairly among friends.",
    keywords: ["tip", "bill", "restaurant"],
    icon: Receipt, popular: true,
    metaTitle: "Tip Calculator - Split Restaurant Bills & Tips | CalcZen",
    metaDescription: "Calculate the tip percentage and split restaurant bills evenly among friends in seconds.",
  },
  {
    slug: "bmr-calculator",
    name: "BMR Calculator",
    category: "health",
    description: "Calculate your Basal Metabolic Rate — calories burned at rest.",
    keywords: ["bmr", "metabolism"],
    icon: Activity,
    metaTitle: "BMR Calculator - Basal Metabolic Rate Estimator | CalcZen",
    metaDescription: "Calculate your Basal Metabolic Rate (BMR). Understand calories burned at rest based on height, weight, and age.",
  },
];

export const getCalculator = (slug: string) =>
  calculators.find((c) => c.slug === slug);

export const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);

export const calculatorsByCategory = (slug: string) =>
  calculators.filter((c) => c.category === slug);
