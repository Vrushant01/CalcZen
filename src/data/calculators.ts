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
};

export const calculators: CalculatorMeta[] = [
  {
    slug: "mortgage-calculator",
    name: "Mortgage Calculator",
    category: "finance",
    description: "Calculate monthly mortgage payments using home price, down payment, interest rate, loan term, taxes, insurance, and HOA fees. Compare different loan scenarios before buying a home.",
    keywords: ["mortgage", "home loan", "monthly payment", "home buying", "interest rates", "amortization"],
    icon: Home, popular: true, trending: true,
    metaTitle: "Mortgage Calculator - Estimate Monthly Home Loan Payments | CalcZen",
    metaDescription: "Calculate monthly mortgage payments, interest rates, taxes, and HOA fees instantly. Estimate your home loan costs and budget with our free calculator.",
    calculatorType: "financial",
    useCases: ["home buying planning", "mortgage loan comparison", "monthly property budget estimation"],
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    category: "finance",
    description: "Project future investment growth using principal, monthly contributions, interest rate, and compound frequency. Ideal for retirement planners and savers mapping long-term wealth accumulation.",
    keywords: ["compound interest", "investment", "savings", "wealth growth", "interest rate", "compound frequency"],
    icon: TrendingUp, popular: true,
    metaTitle: "Compound Interest Calculator - Calculate Savings Growth Online | CalcZen",
    metaDescription: "Calculate compound interest growth for your savings and investments. See detailed annual compound schedules and charts to visualize your future wealth.",
    calculatorType: "investment",
    useCases: ["retirement savings planning", "investment growth forecasting", "compound wealth calculations"],
  },
  {
    slug: "loan-emi-calculator",
    name: "Loan EMI Calculator",
    category: "finance",
    description: "Determine monthly equated installments for personal, car, or student loans using principal, interest rate, and tenure. Analyze total interest payable to plan your borrowing costs.",
    keywords: ["emi", "loan", "payment", "personal loan emi", "car loan emi", "borrowing costs"],
    icon: Coins, popular: true,
    metaTitle: "Loan EMI Calculator - Calculate Monthly Loan Payments Online | CalcZen",
    metaDescription: "Calculate your monthly loan EMI payouts, interest payable, and total loan payment instantly. Plan home, car, or personal loan budgets with our tool.",
    calculatorType: "borrowing",
    useCases: ["personal loan estimation", "car financing comparison", "student debt planning"],
  },
  {
    slug: "retirement-calculator",
    name: "Retirement Calculator",
    category: "finance",
    description: "Plan your nest egg by estimating retirement corpus requirements, inflation effects, and projected withdrawals. Determine necessary monthly savings to secure your financial independence goals.",
    keywords: ["retirement calculator", "retirement savings planner", "retirement corpus", "nest egg", "pension planner"],
    icon: Coins, popular: true, trending: true,
    metaTitle: "Retirement Calculator – Plan Your Future Retirement Savings | CalcZen",
    metaDescription: "Estimate your retirement corpus requirements, projected growth, and withdrawal timelines. Simulate inflation, taxes, and market scenarios to secure your future.",
    calculatorType: "financial planning",
    useCases: ["nest egg estimation", "retirement savings targets", "withdrawal timeline mapping"],
  },
  {
    slug: "401k-calculator",
    name: "401(k) Calculator",
    category: "finance",
    description: "Optimize your employer match and retirement savings growth by modeling pre-tax contributions and salary increases. Project your future 401(k) balance to ensure financial security.",
    keywords: ["401k calculator", "401k match calculator", "estimate 401k growth", "retirement match planner", "pre-tax contribution"],
    icon: TrendingUp, popular: true, trending: true,
    metaTitle: "401(k) Calculator – Estimate Retirement Growth & Employer Match | CalcZen",
    metaDescription: "Estimate 401(k) balance growth, compound investment returns, and employer match limits. Plan your retirement with advanced growth and inflation options.",
    calculatorType: "retirement",
    useCases: ["employer match optimization", "salary deferral planning", "401k growth estimation"],
  },
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    category: "health",
    description: "Calculate your BMI using height and weight measurements. Instantly determine whether you fall within underweight, healthy, overweight, or obesity ranges.",
    keywords: ["bmi", "body mass index", "health", "healthy weight category", "body weight index"],
    icon: Scale, popular: true, trending: true,
    metaTitle: "BMI Calculator - Calculate Body Mass Index Online | CalcZen",
    metaDescription: "Calculate your Body Mass Index (BMI) instantly. Understand your healthy weight category and track your health fitness metrics online with our tool.",
    calculatorType: "anthropometric",
    useCases: ["body mass index tracking", "weight category assessment", "general fitness monitoring"],
  },
  {
    slug: "calorie-calculator",
    name: "Calorie Calculator",
    category: "health",
    description: "Estimate daily calorie needs based on age, gender, activity level, and weight goals. Perfect for athletes and individuals tracking fitness, fat loss, or muscle gain targets.",
    keywords: ["calories", "tdee", "diet", "calorie intake", "daily energy expenditure", "metabolism"],
    icon: Flame, popular: true,
    metaTitle: "Calorie Calculator - Calculate Daily Calorie Needs Online | CalcZen",
    metaDescription: "Estimate daily calorie needs for weight loss, gain, or maintenance. Calculate your TDEE based on height, weight, activity, and fitness goals easily.",
    calculatorType: "nutritional",
    useCases: ["daily calorie target estimation", "weight management planning", "total daily energy expenditure calculation"],
  },
  {
    slug: "water-intake-calculator",
    name: "Water Intake Calculator",
    category: "health",
    description: "Find your ideal daily hydration target based on body weight, exercise duration, and climate. Ensure optimal health, cognitive function, and athletic performance by drinking enough water.",
    keywords: ["water intake", "daily hydration", "water calculator", "hydration target", "dehydration prevention"],
    icon: Droplet,
    metaTitle: "Water Intake Calculator - Calculate Daily Hydration Needs | CalcZen",
    metaDescription: "Calculate your daily water intake needs based on weight, exercise time, and climate. Keep hydrated and track your daily hydration goals with ease.",
    calculatorType: "hydration",
    useCases: ["daily water intake tracking", "exercise hydration planning", "healthy lifestyle habits"],
  },
  {
    slug: "pregnancy-due-date-calculator",
    name: "Pregnancy Due Date",
    category: "health",
    description: "Calculate your estimated baby due date and track pregnancy milestones based on your last period date or conception date. Essential tool for expecting mothers planning ahead.",
    keywords: ["pregnancy due date", "conception date", "baby milestones", "pregnancy tracker", "due date planner"],
    icon: Baby,
    metaTitle: "Pregnancy Due Date Calculator - Calculate Baby Due Date | CalcZen",
    metaDescription: "Estimate your baby's due date, gestational age, and pregnancy progress timeline instantly. Track your pregnancy milestones online using clinical metrics.",
    calculatorType: "obstetric",
    useCases: ["gestational age estimation", "baby due date calculation", "pregnancy milestone planning"],
  },
  {
    slug: "scientific-calculator",
    name: "Scientific Calculator",
    category: "math",
    description: "Solve advanced mathematical expressions including trigonometry, logarithms, exponents, roots, factorials, and scientific notation. Ideal for students, engineers, and technical calculations.",
    keywords: ["scientific calculator", "advanced calculator", "scientific math calculator", "trigonometry", "logarithms", "exponents"],
    icon: Calculator,
    popular: true,
    trending: true,
    metaTitle: "Free Online Scientific Calculator | Advanced Math Solver | CalcZen",
    metaDescription: "Solve complex algebraic, trigonometric, logarithmic, and exponential equations with our free, high-performance online scientific calculator. Instant session history, radian/degree support, and PDF exports.",
    calculatorType: "mathematical",
    useCases: ["trigonometric problem solving", "logarithmic calculations", "academic homework assistance"],
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    category: "math",
    description: "Find percentage increases, decreases, discounts, markups, ratios, and percentage differences. Useful for shopping, finance, business, and academic calculations.",
    keywords: ["percentage increase", "percentage decrease", "discount", "markup", "percentage calculator"],
    icon: Percent, popular: true, trending: true,
    metaTitle: "Percentage Calculator - Calculate Percent Shifts and Ratios | CalcZen",
    metaDescription: "Calculate percentage increases, decreases, differences, and fractional shifts instantly. Solve school or business percent math equations in seconds.",
    calculatorType: "arithmetic",
    useCases: ["shopping discount calculation", "finance ratio analysis", "percentage shift analysis"],
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    category: "math",
    description: "Calculate exact age down to years, months, days, minutes, and seconds from birth date. Easily discover upcoming birthday countdowns and historical interval duration milestones.",
    keywords: ["age calculator", "exact age", "birth date", "birthday countdown", "time duration solver"],
    icon: Cake, popular: true,
    metaTitle: "Age Calculator - Calculate Exact Age from Date of Birth | CalcZen",
    metaDescription: "Calculate your exact age in years, months, days, minutes, and seconds from your birthdate. Find the time remaining until your next birthday instantly.",
    calculatorType: "chronological",
    useCases: ["exact age calculation", "birthday countdown tracking", "time interval measurement"],
  },
  {
    slug: "standard-calculator",
    name: "Standard Calculator",
    category: "everyday",
    description: "Perform basic arithmetic operations including addition, subtraction, multiplication, and division with a clear digital tape. Perfect for quick everyday math problems and receipts.",
    keywords: ["standard calculator", "basic calculator", "arithmetic calculator", "simple math solver", "digital tape calculator"],
    icon: Calculator,
    popular: true,
    metaTitle: "Standard Calculator - Standard Basic Online Math Calculator | CalcZen",
    metaDescription: "Use our free online standard calculator for fast addition, subtraction, multiplication, division, fractions, and percentage operations with session history.",
    calculatorType: "arithmetic",
    useCases: ["basic math computations", "receipt verification", "daily math helpers"],
  },
  {
    slug: "tip-calculator",
    name: "Tip Calculator",
    category: "everyday",
    description: "Quickly determine tipping amounts and split bills evenly among friends or group diners. Avoid math confusion at restaurants by factoring tax and tip percentages instantly.",
    keywords: ["tip calculator", "split bills", "restaurant dining tip", "tax and tip", "gratuity calculations"],
    icon: Receipt, popular: true,
    metaTitle: "Tip Calculator - Calculate Restaurant Tips & Split Bills | CalcZen",
    metaDescription: "Calculate tip percentages and split restaurant bills evenly among friends in seconds. Manage tipping amounts and group payment transactions fairly.",
    calculatorType: "lifestyle billing",
    useCases: ["restaurant tip splitting", "group bill division", "gratuity calculations"],
  },
  {
    slug: "bmr-calculator",
    name: "BMR Calculator",
    category: "health",
    description: "Find your Basal Metabolic Rate to understand calories burned at complete rest. Useful for designing custom dietary plans and managing daily energy balance requirements.",
    keywords: ["bmr calculator", "basal metabolic rate", "resting calories", "metabolism tracker", "resting energy expenditure"],
    icon: Activity,
    metaTitle: "BMR Calculator - Calculate Basal Metabolic Rate Online | CalcZen",
    metaDescription: "Calculate your Basal Metabolic Rate (BMR) instantly. Estimate calories burned at rest based on height, weight, gender, and age for fitness planning.",
    calculatorType: "metabolic",
    useCases: ["basal metabolic rate estimation", "resting energy expenditure tracking", "diet and nutrition planning"],
  },
];

export const getCalculator = (slug: string) =>
  calculators.find((c) => c.slug === slug);

export const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);

export const calculatorsByCategory = (slug: string) =>
  calculators.filter((c) => c.category === slug);
