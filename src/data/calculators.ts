import {
  Calculator,
  Home,
  Heart,
  Percent,
  Coins,
  TrendingUp,
  Activity,
  Baby,
  Flame,
  Droplet,
  Scale,
  Cake,
  Receipt,
  Moon,
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
    description: "Loans, investments & savings",
    icon: Coins,
    color: "category-card-finance",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
  {
    slug: "health",
    name: "Health",
    description: "BMI, calories & fitness",
    icon: Heart,
    color: "category-card-health",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    slug: "math",
    name: "Math",
    description: "Percentages, GPA & ratios",
    icon: Calculator,
    color: "category-card-math",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    slug: "everyday",
    name: "Everyday",
    description: "Dates, fuel & lifestyle",
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
  calculatorType?: string;
  useCases?: string[];
  h1: string;
};

export const calculators: CalculatorMeta[] = [
  {
    slug: "mortgage-calculator",
    name: "Mortgage Calculator",
    category: "finance",
    description:
      "Calculate monthly mortgage payments using home price, down payment, interest rate, loan term, taxes, insurance, and HOA fees. Compare different loan scenarios before buying a home.",
    keywords: [
      "mortgage",
      "home loan",
      "monthly payment",
      "home buying",
      "interest rates",
      "amortization",
    ],
    icon: Home,
    popular: true,
    trending: true,
    metaTitle: "Mortgage Calculator - Estimate Monthly Home Loan Payments | CalcZen",
    metaDescription:
      "Calculate monthly mortgage payments, interest rates, taxes, and HOA fees instantly. Estimate your home loan costs and budget with our free calculator.",
    calculatorType: "financial",
    useCases: [
      "home buying planning",
      "mortgage loan comparison",
      "monthly property budget estimation",
    ],
    h1: "Mortgage Calculator for Monthly Home Loan Payments",
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    category: "finance",
    description:
      "Project future investment growth using principal, monthly contributions, interest rate, and compound frequency. Ideal for retirement planners and savers mapping long-term wealth accumulation.",
    keywords: [
      "compound interest",
      "investment",
      "savings",
      "wealth growth",
      "interest rate",
      "compound frequency",
    ],
    icon: TrendingUp,
    popular: true,
    metaTitle: "Compound Interest Calculator - Calculate Savings Growth Online | CalcZen",
    metaDescription:
      "Calculate compound interest growth for your savings and investments. See detailed annual compound schedules and charts to visualize your future wealth.",
    calculatorType: "investment",
    useCases: [
      "retirement savings planning",
      "investment growth forecasting",
      "compound wealth calculations",
    ],
    h1: "Compound Interest Calculator for Investment Growth",
  },
  {
    slug: "loan-emi-calculator",
    name: "Loan EMI Calculator",
    category: "finance",
    description:
      "Determine monthly equated installments for personal, car, or student loans using principal, interest rate, and tenure. Analyze total interest payable to plan your borrowing costs.",
    keywords: ["emi", "loan", "payment", "personal loan emi", "car loan emi", "borrowing costs"],
    icon: Coins,
    popular: true,
    metaTitle: "Loan EMI Calculator - Calculate Monthly Loan Payments Online | CalcZen",
    metaDescription:
      "Calculate your monthly loan EMI payouts, interest payable, and total loan payment instantly. Plan home, car, or personal loan budgets with our tool.",
    calculatorType: "borrowing",
    useCases: ["personal loan estimation", "car financing comparison", "student debt planning"],
    h1: "EMI Calculator for Monthly Loan Repayment Estimates",
  },
  {
    slug: "retirement-calculator",
    name: "Retirement Calculator",
    category: "finance",
    description:
      "Plan your nest egg by estimating retirement corpus requirements, inflation effects, and projected withdrawals. Determine necessary monthly savings to secure your financial independence goals.",
    keywords: [
      "retirement calculator",
      "retirement savings planner",
      "retirement corpus",
      "nest egg",
      "pension planner",
    ],
    icon: Coins,
    popular: true,
    trending: true,
    metaTitle: "Retirement Calculator – Plan Your Future Retirement Savings | CalcZen",
    metaDescription:
      "Estimate retirement savings goals, corpus growth, and projected withdrawals. Simulate inflation and taxes to plan your long-term financial independence.",
    calculatorType: "financial planning",
    useCases: ["nest egg estimation", "retirement savings targets", "withdrawal timeline mapping"],
    h1: "Retirement Calculator for Long-Term Financial Planning",
  },
  {
    slug: "401k-calculator",
    name: "401(k) Calculator",
    category: "finance",
    description:
      "Optimize your employer match and retirement savings growth by modeling pre-tax contributions and salary increases. Project your future 401(k) balance to ensure financial security.",
    keywords: [
      "401k calculator",
      "401k match calculator",
      "estimate 401k growth",
      "retirement match planner",
      "pre-tax contribution",
    ],
    icon: TrendingUp,
    popular: true,
    trending: true,
    metaTitle: "401(k) Calculator – Estimate Retirement Growth & Employer Match | CalcZen",
    metaDescription:
      "Estimate 401(k) balance growth, compound investment returns, and employer match limits. Plan your retirement with advanced growth and inflation options.",
    calculatorType: "retirement",
    useCases: ["employer match optimization", "salary deferral planning", "401k growth estimation"],
    h1: "401(k) Calculator for Retirement Savings and Match",
  },
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    category: "health",
    description:
      "Calculate your BMI using height and weight measurements. Instantly determine whether you fall within underweight, healthy, overweight, or obesity ranges.",
    keywords: ["bmi", "body mass index", "health", "healthy weight category", "body weight index"],
    icon: Scale,
    popular: true,
    trending: true,
    metaTitle: "BMI Calculator - Calculate Body Mass Index Online | CalcZen",
    metaDescription:
      "Calculate your Body Mass Index (BMI) instantly. Understand your healthy weight category and track your health fitness metrics online with our tool.",
    calculatorType: "anthropometric",
    useCases: [
      "body mass index tracking",
      "weight category assessment",
      "general fitness monitoring",
    ],
    h1: "BMI Calculator for Body Mass Index Calculation",
  },
  {
    slug: "calorie-calculator",
    name: "Calorie Calculator",
    category: "health",
    description:
      "Estimate daily calorie needs based on age, gender, activity level, and weight goals. Perfect for athletes and individuals tracking fitness, fat loss, or muscle gain targets.",
    keywords: [
      "calories",
      "tdee",
      "diet",
      "calorie intake",
      "daily energy expenditure",
      "metabolism",
    ],
    icon: Flame,
    popular: true,
    metaTitle: "Calorie Calculator - Calculate Daily Calorie Needs Online | CalcZen",
    metaDescription:
      "Estimate daily calorie needs for weight loss, gain, or maintenance. Calculate your TDEE based on height, weight, activity, and fitness goals easily.",
    calculatorType: "nutritional",
    useCases: [
      "daily calorie target estimation",
      "weight management planning",
      "total daily energy expenditure calculation",
    ],
    h1: "Calorie Calculator for Daily Caloric Intake Targets",
  },
  {
    slug: "water-intake-calculator",
    name: "Water Intake Calculator",
    category: "health",
    description:
      "Find your ideal daily hydration target based on body weight, exercise duration, and climate. Ensure optimal health, cognitive function, and athletic performance by drinking enough water.",
    keywords: [
      "water intake",
      "daily hydration",
      "water calculator",
      "hydration target",
      "dehydration prevention",
    ],
    icon: Droplet,
    metaTitle: "Water Intake Calculator - Calculate Daily Hydration Needs | CalcZen",
    metaDescription:
      "Calculate your daily water intake needs based on weight, exercise time, and climate. Keep hydrated and track your daily hydration goals with ease.",
    calculatorType: "hydration",
    useCases: [
      "daily water intake tracking",
      "exercise hydration planning",
      "healthy lifestyle habits",
    ],
    h1: "Water Intake Calculator for Daily Hydration Needs",
  },
  {
    slug: "sleep-calculator",
    name: "Sleep Calculator",
    category: "health",
    description:
      "Determine your optimal bedtime, perfect wake-up time, and complete sleep cycles based on the scientifically accepted 90-minute sleep cycle. Improve rest and wake up refreshed.",
    keywords: [
      "sleep calculator",
      "sleep cycles",
      "bedtime calculator",
      "wake up time",
      "optimal sleep",
      "rem sleep",
      "deep sleep",
      "avoid grogginess",
    ],
    icon: Moon,
    popular: true,
    trending: true,
    metaTitle: "Sleep Calculator – Calculate Perfect Bedtime & Wake-Up Time",
    metaDescription:
      "Find the best bedtime and wake-up time based on 90-minute sleep cycles. Improve sleep quality with our free Sleep Calculator.",
    calculatorType: "health",
    useCases: [
      "optimal bedtime calculation",
      "sleep cycle optimization",
      "wake-up time planning",
      "preventing morning grogginess",
    ],
    h1: "Sleep Calculator for Optimal Sleep Cycles",
  },
  {
    slug: "pregnancy-due-date-calculator",
    name: "Pregnancy Due Date",
    category: "health",
    description:
      "Calculate your estimated baby due date and track pregnancy milestones based on your last period date or conception date. Essential tool for expecting mothers planning ahead.",
    keywords: [
      "pregnancy due date",
      "conception date",
      "baby milestones",
      "pregnancy tracker",
      "due date planner",
    ],
    icon: Baby,
    metaTitle: "Pregnancy Due Date Calculator - Calculate Baby Due Date | CalcZen",
    metaDescription:
      "Estimate your baby's due date, gestational age, and pregnancy progress timeline instantly. Track your pregnancy milestones online using clinical metrics.",
    calculatorType: "obstetric",
    useCases: [
      "gestational age estimation",
      "baby due date calculation",
      "pregnancy milestone planning",
    ],
    h1: "Pregnancy Due Date Calculator and Timeline Estimator",
  },
  {
    slug: "scientific-calculator",
    name: "Scientific Calculator",
    category: "math",
    description:
      "Solve advanced mathematical expressions including trigonometry, logarithms, exponents, roots, factorials, and scientific notation. Ideal for students, engineers, and technical calculations.",
    keywords: [
      "scientific calculator",
      "advanced calculator",
      "scientific math calculator",
      "trigonometry",
      "logarithms",
      "exponents",
    ],
    icon: Calculator,
    popular: true,
    trending: true,
    metaTitle: "Free Online Scientific Calculator | Advanced Math Solver | CalcZen",
    metaDescription:
      "Perform advanced calculations including trigonometry, logarithms, exponents, roots, and scientific functions using our free online calculator.",
    calculatorType: "mathematical",
    useCases: [
      "trigonometric problem solving",
      "logarithmic calculations",
      "academic homework assistance",
    ],
    h1: "Scientific Calculator for Advanced Mathematical Operations",
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    category: "math",
    description:
      "Find percentage increases, decreases, discounts, markups, ratios, and percentage differences. Useful for shopping, finance, business, and academic calculations.",
    keywords: [
      "percentage increase",
      "percentage decrease",
      "discount",
      "markup",
      "percentage calculator",
    ],
    icon: Percent,
    popular: true,
    trending: true,
    metaTitle: "Percentage Calculator - Calculate Percent Shifts and Ratios | CalcZen",
    metaDescription:
      "Calculate percentage increases, decreases, differences, and fractional shifts instantly. Solve school or business percent math equations in seconds.",
    calculatorType: "arithmetic",
    useCases: [
      "shopping discount calculation",
      "finance ratio analysis",
      "percentage shift analysis",
    ],
    h1: "Percentage Calculator for Increases, Decreases, and Discounts",
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    category: "math",
    description:
      "Calculate exact age down to years, months, days, minutes, and seconds from birth date. Easily discover upcoming birthday countdowns and historical interval duration milestones.",
    keywords: [
      "age calculator",
      "exact age",
      "birth date",
      "birthday countdown",
      "time duration solver",
    ],
    icon: Cake,
    popular: true,
    metaTitle: "Age Calculator - Calculate Exact Age from Date of Birth | CalcZen",
    metaDescription:
      "Calculate your exact age in years, months, days, minutes, and seconds from your birthdate. Find the time remaining until your next birthday instantly.",
    calculatorType: "chronological",
    useCases: ["exact age calculation", "birthday countdown tracking", "time interval measurement"],
    h1: "Age Calculator for Birthdays and Exact Time Elapsed",
  },
  {
    slug: "regular-calculator",
    name: "Regular Calculator",
    category: "everyday",
    description:
      "Perform basic arithmetic operations including addition, subtraction, multiplication, and division with a clear digital tape. Perfect for quick everyday math problems and receipts.",
    keywords: [
      "regular calculator",
      "basic calculator",
      "arithmetic calculator",
      "simple math solver",
      "digital tape calculator",
    ],
    icon: Calculator,
    popular: true,
    metaTitle: "Regular Calculator - Free Online Basic Math Calculator | CalcZen",
    metaDescription:
      "Use our free online regular calculator for fast addition, subtraction, multiplication, division, fractions, and percentage operations with session history.",
    calculatorType: "arithmetic",
    useCases: ["basic math computations", "receipt verification", "daily math helpers"],
    h1: "Regular Calculator for Everyday Arithmetic",
  },
  {
    slug: "tip-calculator",
    name: "Tip Calculator",
    category: "everyday",
    description:
      "Quickly determine tipping amounts and split bills evenly among friends or group diners. Avoid math confusion at restaurants by factoring tax and tip percentages instantly.",
    keywords: [
      "tip calculator",
      "split bills",
      "restaurant dining tip",
      "tax and tip",
      "gratuity calculations",
    ],
    icon: Receipt,
    popular: true,
    metaTitle: "Tip Calculator - Calculate Restaurant Tips & Split Bills | CalcZen",
    metaDescription:
      "Calculate tip percentages and split restaurant bills evenly among friends in seconds. Manage tipping amounts and group payment transactions fairly.",
    calculatorType: "lifestyle billing",
    useCases: ["restaurant tip splitting", "group bill division", "gratuity calculations"],
    h1: "Tip Calculator for Bill Splitting and Gratuity Math",
  },
  {
    slug: "bmr-calculator",
    name: "BMR Calculator",
    category: "health",
    description:
      "Find your Basal Metabolic Rate to understand calories burned at complete rest. Useful for designing custom dietary plans and managing daily energy balance requirements.",
    keywords: [
      "bmr calculator",
      "basal metabolic rate",
      "resting calories",
      "metabolism tracker",
      "resting energy expenditure",
    ],
    icon: Activity,
    metaTitle: "BMR Calculator - Calculate Basal Metabolic Rate Online | CalcZen",
    metaDescription:
      "Calculate your Basal Metabolic Rate (BMR) instantly. Estimate calories burned at rest based on height, weight, gender, and age for fitness planning.",
    calculatorType: "metabolic",
    useCases: [
      "basal metabolic rate estimation",
      "resting energy expenditure tracking",
      "diet and nutrition planning",
    ],
    h1: "BMR Calculator for Basal Metabolic Rate Estimation",
  },
  {
    slug: "sip-calculator",
    name: "SIP Calculator",
    category: "finance",
    description:
      "Calculate the future value of your Systematic Investment Plan (SIP) based on your monthly investment and expected rate of return.",
    keywords: [
      "sip",
      "systematic investment plan",
      "mutual fund",
      "investment returns",
      "compound interest",
    ],
    icon: TrendingUp,
    metaTitle: "SIP Calculator - Mutual Fund Return Calculator Online | CalcZen",
    metaDescription:
      "Calculate your Systematic Investment Plan (SIP) returns online. Estimate your mutual fund wealth growth and compound interest gains easily.",
    calculatorType: "investment",
    useCases: [
      "mutual fund investment planning",
      "wealth accumulation",
      "compound interest calculation",
    ],
    h1: "SIP Calculator for Mutual Fund Returns",
  },
  {
    slug: "fd-calculator",
    name: "FD Calculator",
    category: "finance",
    description:
      "Calculate Fixed Deposit (FD) maturity amount and interest earned using principal, interest rate, and duration.",
    keywords: ["fd", "fixed deposit", "term deposit", "interest calculator", "banking"],
    icon: Coins,
    metaTitle: "FD Calculator - Fixed Deposit Return & Interest Estimator | CalcZen",
    metaDescription:
      "Use our free FD Calculator to estimate your Fixed Deposit returns, maturity value, and interest earned based on compounding frequency.",
    calculatorType: "financial",
    useCases: ["bank deposit planning", "safe investment forecasting", "interest calculation"],
    h1: "FD Calculator for Fixed Deposit Returns",
  },
  {
    slug: "gst-calculator",
    name: "GST Calculator",
    category: "finance",
    description:
      "Easily add or remove GST from a product's price. Supports standard tax slabs (5%, 12%, 18%, 28%) for accurate billing and accounting.",
    keywords: [
      "gst",
      "goods and services tax",
      "tax calculator",
      "billing",
      "add gst",
      "remove gst",
    ],
    icon: Receipt,
    metaTitle: "GST Calculator - Add or Remove GST from Price Online | CalcZen",
    metaDescription:
      "Calculate Goods and Services Tax (GST) easily. Add GST to net prices or remove GST from gross prices using standard 5%, 12%, 18%, and 28% slabs.",
    calculatorType: "financial",
    useCases: ["business invoicing", "tax calculation", "price estimation"],
    h1: "GST Calculator for Quick Tax Calculation",
  },
  {
    slug: "attendance-calculator",
    name: "Attendance Calculator",
    category: "math",
    description:
      "Calculate your current attendance percentage and find out exactly how many more classes you need to attend to reach your target (75%, 80%, etc.).",
    keywords: [
      "attendance",
      "college attendance",
      "school attendance",
      "bunk calculator",
      "target attendance",
    ],
    icon: Calculator,
    metaTitle: "Attendance Calculator - Find Classes Needed for 75% | CalcZen",
    metaDescription:
      "Calculate your current college or school attendance percentage. Find out exactly how many classes you must attend to reach your 75% or 80% target.",
    calculatorType: "educational",
    useCases: ["student attendance tracking", "semester planning", "bunking safety calculation"],
    h1: "Attendance Calculator for Students",
  },
  {
    slug: "cgpa-calculator",
    name: "CGPA Calculator",
    category: "math",
    description:
      "Calculate your Semester Grade Point Average (SGPA) and Cumulative Grade Point Average (CGPA) accurately by entering your subject grades and credit hours.",
    keywords: ["cgpa", "sgpa", "gpa", "grade calculator", "college grades", "university gpa"],
    icon: TrendingUp,
    metaTitle: "CGPA Calculator - Calculate SGPA & CGPA from Grades | CalcZen",
    metaDescription:
      "Easily calculate your university SGPA and CGPA. Enter your subject grades and credit hours to determine your cumulative academic performance.",
    calculatorType: "educational",
    useCases: [
      "academic performance tracking",
      "semester grade calculation",
      "degree requirement checking",
    ],
    h1: "CGPA & SGPA Grade Calculator",
  },
  {
    slug: "body-fat-calculator",
    name: "Body Fat Calculator",
    category: "health",
    description:
      "Estimate your body fat percentage and fat category using the U.S. Navy Method based on your gender, waist, neck, and hip measurements.",
    keywords: ["body fat", "fat percentage", "us navy method", "fitness", "body composition"],
    icon: Scale,
    metaTitle: "Body Fat Calculator - Estimate Body Fat Percentage | CalcZen",
    metaDescription:
      "Calculate your body fat percentage accurately using the U.S. Navy Method. Enter your waist, neck, and hip measurements to determine your fitness category.",
    calculatorType: "health",
    useCases: ["fitness tracking", "body composition analysis", "weight loss monitoring"],
    h1: "Body Fat Percentage Calculator",
  },
  {
    slug: "protein-calculator",
    name: "Protein Calculator",
    category: "health",
    description:
      "Determine your optimal daily protein intake requirement based on your weight, activity level, and fitness goal (maintenance, muscle gain, or fat loss).",
    keywords: ["protein", "daily protein", "macronutrients", "muscle gain", "diet", "fitness"],
    icon: Flame,
    metaTitle: "Protein Calculator - Daily Protein Intake for Muscle & Diet | CalcZen",
    metaDescription:
      "Calculate your optimal daily protein requirement. Tailored recommendations for muscle gain, fat loss, and maintenance based on your weight and activity level.",
    calculatorType: "health",
    useCases: ["diet planning", "muscle building nutrition", "weight loss macronutrients"],
    h1: "Daily Protein Intake Calculator",
  },
  {
    slug: "inflation-calculator",
    name: "Inflation Calculator",
    category: "finance",
    description:
      "Calculate the future cost of goods and understand the loss of purchasing power over time due to historical or projected inflation rates.",
    keywords: ["inflation", "purchasing power", "future cost", "value of money", "inflation rate"],
    icon: TrendingUp,
    metaTitle: "Inflation Calculator - Future Purchasing Power Estimator | CalcZen",
    metaDescription:
      "Calculate the impact of inflation on your money over time. Estimate future costs of goods and measure the decline in purchasing power.",
    calculatorType: "financial",
    useCases: [
      "long-term financial planning",
      "cost of living projection",
      "historical price comparison",
    ],
    h1: "Inflation & Purchasing Power Calculator",
  },
  {
    slug: "loan-eligibility-calculator",
    name: "Loan Eligibility Calculator",
    category: "finance",
    description:
      "Estimate your maximum loan eligibility and recommended EMI based on your monthly income, existing EMIs, interest rate, and loan tenure.",
    keywords: [
      "loan eligibility",
      "home loan limit",
      "personal loan limit",
      "emi capacity",
      "borrowing power",
    ],
    icon: Home,
    metaTitle: "Loan Eligibility Calculator - Check Your Borrowing Limit | CalcZen",
    metaDescription:
      "Check how much loan you can comfortably afford. Calculate your maximum loan eligibility and safe monthly EMI based on your net income and existing debts.",
    calculatorType: "financial",
    useCases: ["home loan pre-planning", "borrowing capacity check", "debt-to-income analysis"],
    h1: "Loan Eligibility & Borrowing Power Calculator",
  },
  {
    slug: "credit-card-emi-calculator",
    name: "Credit Card EMI Calculator",
    category: "finance",
    description:
      "Calculate monthly payments, total interest, and the final payment amount for credit card purchases converted into EMI.",
    keywords: [
      "credit card emi",
      "credit card interest",
      "emi conversion",
      "credit debt",
      "credit card loan",
    ],
    icon: Receipt,
    metaTitle: "Credit Card EMI Calculator - Estimate Payment & Interest | CalcZen",
    metaDescription:
      "Calculate your credit card EMI payments. Find out the total interest charged and final repayment amount when converting credit card purchases into EMIs.",
    calculatorType: "financial",
    useCases: [
      "credit card debt planning",
      "purchase conversion analysis",
      "interest cost estimation",
    ],
    h1: "Credit Card EMI Payment Calculator",
  },
];

export const getCalculator = (slug: string) => calculators.find((c) => c.slug === slug);

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

export const calculatorsByCategory = (slug: string) =>
  calculators.filter((c) => c.category === slug);
