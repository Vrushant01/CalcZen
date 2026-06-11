export interface FieldConfig {
  id: string;
  label: string;
  type: "number" | "select" | "date" | "text";
  placeholder?: string;
  defaultValue?: any;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: any }[];
  suffix?: string;
}

export interface CalculatorConfig {
  slug: string;
  name: string;
  category: "finance" | "health" | "math" | "everyday";
  description: string;
  fields: FieldConfig[];
  calculate: (inputs: Record<string, any>) => {
    mainResult: { label: string; value: string; highlight?: boolean };
    secondaryMetrics: { label: string; value: string; highlight?: boolean }[];
    insights: string[];
    graphData: any[];
    graphType: "gauge" | "pie" | "line" | "bar" | "area" | "timeline" | "placeholder";
  };
  tips: { q: string; a: string }[];
}

export const dynamicCalculators: CalculatorConfig[] = [
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    category: "health",
    description: "Check your Body Mass Index (BMI) and understand your healthy weight category.",
    fields: [
      { id: "height", label: "Height (cm)", type: "number", defaultValue: 175, min: 50, max: 250, suffix: "cm" },
      { id: "weight", label: "Weight (kg)", type: "number", defaultValue: 72, min: 10, max: 300, suffix: "kg" },
    ],
    calculate: (inputs) => {
      const height = Number(inputs.height) || 175;
      const weight = Number(inputs.weight) || 72;
      const heightM = height / 100;
      const bmi = heightM > 0 ? weight / (heightM * heightM) : 0;

      let category = "—";
      let colorClass = "text-muted-foreground";
      let tips: string[] = [];

      if (bmi > 0) {
        if (bmi < 18.5) {
          category = "Underweight";
          colorClass = "text-secondary";
          tips = [
            "Your weight is below the normal range for your height. Focus on nutrient-dense foods.",
            "Consult a healthcare professional to identify if dietary modifications are needed.",
          ];
        } else if (bmi < 25) {
          category = "Normal weight";
          colorClass = "text-success";
          tips = [
            "You are in a healthy weight range! Maintain your current balanced diet and regular physical activities.",
            "Stay hydrated and sleep well to keep your metabolic health optimal.",
          ];
        } else if (bmi < 30) {
          category = "Overweight";
          colorClass = "text-chart-4";
          tips = [
            "Your weight is slightly high for your height. Try incorporating more aerobic exercises.",
            "Reducing intake of processed sugars and fats can help steady your weight goals.",
          ];
        } else {
          category = "Obese";
          colorClass = "text-destructive";
          tips = [
            "Obesity is associated with increased risk of cardiovascular diseases and diabetes. Please seek medical guidance.",
            "Start with small, sustainable exercise habits (e.g. 15-minute walks daily).",
          ];
        }
      }

      const healthyMin = heightM > 0 ? 18.5 * heightM * heightM : 0;
      const healthyMax = heightM > 0 ? 24.9 * heightM * heightM : 0;

      return {
        mainResult: { label: "BMI Score", value: bmi.toFixed(1), highlight: true },
        secondaryMetrics: [
          { label: "Category", value: category, highlight: true },
          { label: "Healthy Weight Range", value: `${healthyMin.toFixed(1)}–${healthyMax.toFixed(1)} kg` },
          { label: "BMI Prime", value: (bmi / 25).toFixed(2) },
        ],
        insights: tips,
        graphData: [
          { name: "BMI", value: Number(bmi.toFixed(1)) }
        ],
        graphType: "gauge",
      };
    },
    tips: [
      { q: "What is a healthy BMI range?", a: "For most adults, a BMI between 18.5 and 24.9 is considered healthy. Below 18.5 is underweight, 25-29.9 is overweight, and 30+ is obese." },
      { q: "Does BMI work for athletes?", a: "BMI does not distinguish muscle from fat, so very muscular individuals can read as overweight even when healthy. Use it alongside body-fat measurements for a fuller picture." },
    ],
  },
  {
    slug: "calorie-calculator",
    name: "Calorie Calculator",
    category: "health",
    description: "Estimate your daily calorie needs based on goals and physical activity level.",
    fields: [
      { id: "age", label: "Age (years)", type: "number", defaultValue: 30, min: 1, max: 120 },
      { id: "sex", label: "Sex", type: "select", defaultValue: "male", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }] },
      { id: "height", label: "Height (cm)", type: "number", defaultValue: 175, min: 50, max: 250, suffix: "cm" },
      { id: "weight", label: "Weight (kg)", type: "number", defaultValue: 72, min: 10, max: 300, suffix: "kg" },
      {
        id: "activity",
        label: "Activity Level",
        type: "select",
        defaultValue: 1.55,
        options: [
          { label: "Sedentary (little or no exercise)", value: 1.2 },
          { label: "Lightly Active (exercise 1-3 days/week)", value: 1.375 },
          { label: "Moderately Active (exercise 3-5 days/week)", value: 1.55 },
          { label: "Very Active (hard exercise 6-7 days/week)", value: 1.725 },
          { label: "Extra Active (athlete or physical job)", value: 1.9 },
        ],
      },
      {
        id: "goal",
        label: "Goal",
        type: "select",
        defaultValue: "maintain",
        options: [
          { label: "Lose Weight (-500 kcal deficit)", value: "lose" },
          { label: "Maintain Weight", value: "maintain" },
          { label: "Gain Weight (+300 kcal surplus)", value: "gain" },
        ],
      },
    ],
    calculate: (inputs) => {
      const age = Number(inputs.age) || 30;
      const sex = inputs.sex || "male";
      const height = Number(inputs.height) || 175;
      const weight = Number(inputs.weight) || 72;
      const activity = Number(inputs.activity) || 1.55;
      const goal = inputs.goal || "maintain";

      const bmr =
        sex === "male"
          ? 10 * weight + 6.25 * height - 5 * age + 5
          : 10 * weight + 6.25 * height - 5 * age - 161;

      const tdee = bmr * activity;
      const target = goal === "maintain" ? tdee : goal === "lose" ? tdee - 500 : tdee + 300;

      const insights = [
        `To ${goal} weight, aim for about ${Math.round(target)} calories per day.`,
        `Your Basal Metabolic Rate (BMR) is ${Math.round(bmr)} calories, which is what you burn at complete rest.`,
        `Total Daily Energy Expenditure (TDEE) is estimated at ${Math.round(tdee)} calories based on your activity multiplier.`,
      ];

      return {
        mainResult: { label: "Daily Calorie Target", value: `${Math.round(target)} kcal`, highlight: true },
        secondaryMetrics: [
          { label: "BMR (at rest)", value: `${Math.round(bmr)} kcal` },
          { label: "TDEE (maintenance)", value: `${Math.round(tdee)} kcal` },
          { label: "Goal Action", value: goal === "lose" ? "Calorie Deficit" : goal === "gain" ? "Calorie Surplus" : "Maintenance" },
        ],
        insights,
        graphData: [
          { name: "BMR (Rest)", kcal: Math.round(bmr) },
          { name: "TDEE (Maintain)", kcal: Math.round(tdee) },
          { name: "Daily Target", kcal: Math.round(target) },
        ],
        graphType: "bar",
      };
    },
    tips: [
      { q: "Why a 500-calorie deficit for weight loss?", a: "A daily 500-calorie deficit creates roughly a 0.5 kg (≈1 lb) loss per week, which is a safe, sustainable rate recommended by most health authorities." },
      { q: "What activity level should I pick?", a: "Sedentary = desk job, no exercise. Moderate = workouts 3–5 days/week. Very active = intense daily training or physical labor." },
    ],
  },
  {
    slug: "loan-emi-calculator",
    name: "Loan EMI Calculator",
    category: "finance",
    description: "Calculate your Equated Monthly Installment (EMI) for any personal, car, or home loan.",
    fields: [
      { id: "amount", label: "Loan Amount ($)", type: "number", defaultValue: 20000, suffix: "$" },
      { id: "rate", label: "Interest Rate (% per year)", type: "number", defaultValue: 9, step: 0.1, suffix: "%" },
      { id: "months", label: "Tenure (months)", type: "number", defaultValue: 60, suffix: "months" },
    ],
    calculate: (inputs) => {
      const amount = Number(inputs.amount) || 20000;
      const rate = Number(inputs.rate) || 9;
      const months = Number(inputs.months) || 60;

      const r = rate / 100 / 12;
      const emi = r === 0 ? amount / months : (amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      const totalPay = emi * months;
      const totalInterest = totalPay - amount;
      const interestPct = amount > 0 ? (totalInterest / amount) * 100 : 0;

      const formatCurrency = (val: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

      const insights = [
        `Your monthly EMI is ${formatCurrency(emi)}.`,
        `Over the life of the loan, you will pay ${formatCurrency(totalInterest)} in total interest.`,
        `Interest payable constitutes ${interestPct.toFixed(1)}% of your principal amount.`,
      ];

      return {
        mainResult: { label: "Monthly EMI", value: formatCurrency(emi), highlight: true },
        secondaryMetrics: [
          { label: "Total Payment", value: formatCurrency(totalPay) },
          { label: "Total Interest", value: formatCurrency(totalInterest) },
          { label: "Interest Burden", value: `${interestPct.toFixed(1)}%` },
        ],
        insights,
        graphData: [
          { name: "Principal", value: amount },
          { name: "Interest", value: Math.round(totalInterest) },
        ],
        graphType: "pie",
      };
    },
    tips: [
      { q: "What does EMI stand for?", a: "EMI stands for Equated Monthly Installment — a fixed payment amount made by a borrower to a lender at a specified date each calendar month." },
      { q: "How can I reduce the interest payable on my loan?", a: "You can reduce interest by choosing a shorter loan tenure, negotiating a lower interest rate, or making prepayment principal payments whenever possible." },
    ],
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    category: "finance",
    description: "Project how your savings or investments grow with compounding interest and recurring contributions.",
    fields: [
      { id: "principal", label: "Initial Investment ($)", type: "number", defaultValue: 5000, suffix: "$" },
      { id: "rate", label: "Annual Interest Rate (%)", type: "number", defaultValue: 8, step: 0.1, suffix: "%" },
      { id: "years", label: "Time Period (years)", type: "number", defaultValue: 10, suffix: "years" },
      { id: "contribution", label: "Monthly Contribution ($)", type: "number", defaultValue: 200, suffix: "$" },
    ],
    calculate: (inputs) => {
      const principal = Number(inputs.principal) || 5000;
      const rate = Number(inputs.rate) || 8;
      const years = Number(inputs.years) || 10;
      const contribution = Number(inputs.contribution) || 200;

      const rateMonthly = rate / 12 / 100;
      let balance = principal;
      let invested = principal;
      const graphData = [{ year: 0, balance: Math.round(principal), invested: Math.round(principal) }];

      for (let y = 1; y <= years; y++) {
        for (let m = 0; m < 12; m++) {
          balance = balance * (1 + rateMonthly) + contribution;
          invested += contribution;
        }
        graphData.push({
          year: y,
          balance: Math.round(balance),
          invested: Math.round(invested),
        });
      }

      const totalProfit = balance - invested;
      const growthPercent = invested > 0 ? (totalProfit / invested) * 100 : 0;

      const formatCurrency = (val: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

      const insights = [
        `In ${years} years, your portfolio will grow to ${formatCurrency(balance)}.`,
        `You will have invested a total of ${formatCurrency(invested)}, earning ${formatCurrency(totalProfit)} in profit.`,
        `This represents a total growth return of ${growthPercent.toFixed(1)}% on your principal and monthly contributions.`,
      ];

      return {
        mainResult: { label: "Final Balance", value: formatCurrency(balance), highlight: true },
        secondaryMetrics: [
          { label: "Total Invested", value: formatCurrency(invested) },
          { label: "Total Profit", value: formatCurrency(totalProfit) },
          { label: "Total Return %", value: `${growthPercent.toFixed(1)}%` },
        ],
        insights,
        graphData,
        graphType: "line",
      };
    },
    tips: [
      { q: "What is compound interest?", a: "Compound interest is the interest on a loan or deposit calculated based on both the initial principal and the accumulated interest from previous periods." },
      { q: "How does the frequency of compounding impact returns?", a: "The more frequently interest is compounded (e.g. daily vs. annually), the faster your money grows. Our model assumes monthly interest compounding." },
    ],
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    category: "math",
    description: "Determine your exact age in years, months, days, and discover your birth timeline.",
    fields: [
      { id: "birthDate", label: "Date of Birth", type: "date", defaultValue: "1995-06-15" },
    ],
    calculate: (inputs) => {
      const birthStr = inputs.birthDate || "1995-06-15";
      const birth = new Date(birthStr);
      const now = new Date();

      let years = now.getFullYear() - birth.getFullYear();
      let months = now.getMonth() - birth.getMonth();
      let days = now.getDate() - birth.getDate();

      if (days < 0) {
        months -= 1;
        // Get days in previous month
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const diffMs = now.getTime() - birth.getTime();
      const totalMinutes = Math.floor(diffMs / 1000 / 60);
      const totalDays = Math.floor(totalMinutes / 60 / 24);

      // Countdown to next birthday
      const nextBirthday = new Date(birth);
      nextBirthday.setFullYear(now.getFullYear());
      if (nextBirthday < now) {
        nextBirthday.setFullYear(now.getFullYear() + 1);
      }
      const daysToBirthday = Math.ceil((nextBirthday.getTime() - now.getTime()) / 1000 / 60 / 60 / 24);

      const insights = [
        `You have lived for over ${totalDays.toLocaleString()} total days!`,
        `There are ${daysToBirthday} days remaining until your next birthday celebration.`,
        `You have accumulated approximately ${totalMinutes.toLocaleString()} minutes of life experiences.`,
      ];

      // Create dummy timeline data of life stages (25%, 50%, 75%, 100%)
      const graphData = [
        { stage: "Infancy", pct: 5, age: 3 },
        { stage: "Youth", pct: 20, age: 18 },
        { stage: "Adulthood", pct: 60, age: 50 },
        { stage: "Retirement", pct: 90, age: 75 },
        { stage: "Current Age", pct: Math.min(100, Math.round((years / 80) * 100)), age: years },
      ];

      return {
        mainResult: { label: "Exact Age", value: `${years} yrs, ${months} mos, ${days} days`, highlight: true },
        secondaryMetrics: [
          { label: "Countdown to Birthday", value: `${daysToBirthday} Days` },
          { label: "Total Days Lived", value: `${totalDays.toLocaleString()} Days` },
          { label: "Minutes Lived", value: `${totalMinutes.toLocaleString()} mins` },
        ],
        insights,
        graphData,
        graphType: "timeline",
      };
    },
    tips: [
      { q: "Is this age calculator timezone aware?", a: "The calculator runs on your local system time, comparing your input birthdate with the current clock date in your web browser." },
      { q: "What is a birth milestone?", a: "Timelines help map human lifespan stages. Most demographics divide these into infancy (0-3), childhood/youth (4-18), adulthood (19-65), and senior years (65+)." },
    ],
  },
  {
    slug: "investment-return-calculator",
    name: "Investment Return Calculator",
    category: "finance",
    description: "Calculate potential portfolio return, capital invested, and growth gains over time.",
    fields: [
      { id: "initial", label: "Initial Principal ($)", type: "number", defaultValue: 10000, suffix: "$" },
      { id: "returnRate", label: "Annual Rate of Return (%)", type: "number", defaultValue: 10, step: 0.1, suffix: "%" },
      { id: "years", label: "Duration (years)", type: "number", defaultValue: 10, suffix: "years" },
    ],
    calculate: (inputs) => {
      const initial = Number(inputs.initial) || 10000;
      const rate = Number(inputs.returnRate) || 10;
      const years = Number(inputs.years) || 10;

      const graphData = [];
      let balance = initial;

      for (let y = 1; y <= years; y++) {
        balance = balance * (1 + rate / 100);
        graphData.push({
          year: y,
          balance: Math.round(balance),
          invested: initial,
          profit: Math.round(balance - initial),
        });
      }

      const totalProfit = balance - initial;
      const growthPercent = initial > 0 ? (totalProfit / initial) * 100 : 0;

      const formatCurrency = (val: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

      const insights = [
        `With an annual return rate of ${rate}%, your portfolio grows from ${formatCurrency(initial)} to ${formatCurrency(balance)}.`,
        `This represents a pure profit of ${formatCurrency(totalProfit)} over ${years} years.`,
        `Your investment grows by a cumulative factor of ${growthPercent.toFixed(1)}%.`,
      ];

      return {
        mainResult: { label: "Estimated Portfolio Value", value: formatCurrency(balance), highlight: true },
        secondaryMetrics: [
          { label: "Capital Invested", value: formatCurrency(initial) },
          { label: "Capital Gains (Profit)", value: formatCurrency(totalProfit) },
          { label: "Return Percentage", value: `+${growthPercent.toFixed(1)}%` },
        ],
        insights,
        graphData,
        graphType: "area",
      };
    },
    tips: [
      { q: "What is capital appreciation?", a: "Capital appreciation refers to an increase in the market price of an asset, which is the primary source of portfolio gains alongside dividends." },
      { q: "Does this account for inflation or taxes?", a: "This is a gross return projection calculator. Taxes, capital gains fees, and inflation will eat into real purchasing power over time." },
    ],
  },
  {
    slug: "placeholder-calculator",
    name: "[CALCULATOR_TYPE_NAME]",
    category: "everyday",
    description: "Placeholder demonstrating the system's modular scalability. Easily add new modules via configuration.",
    fields: [
      { id: "input_a", label: "[INPUT_FIELD_NAME] A", type: "number", defaultValue: 100 },
      { id: "input_b", label: "[INPUT_FIELD_NAME] B", type: "number", defaultValue: 50 },
    ],
    calculate: (inputs) => {
      const a = Number(inputs.input_a) || 100;
      const b = Number(inputs.input_b) || 50;
      const sum = a + b;

      return {
        mainResult: { label: "Calculation Output", value: `${sum.toFixed(0)} units`, highlight: true },
        secondaryMetrics: [
          { label: "Difference", value: `${Math.abs(a - b).toFixed(0)} units` },
          { label: "Product", value: `${(a * b).toLocaleString()} units` },
        ],
        insights: [
          "This is a demonstration calculator configured entirely via schema.",
          "Dynamic form fields and Recharts graphs auto-adapt to schemas added to the modular registry.",
        ],
        graphData: [
          { name: "Field A", value: a },
          { name: "Field B", value: b },
          { name: "Sum Output", value: sum },
        ],
        graphType: "placeholder",
      };
    },
    tips: [
      { q: "How do you add new calculators?", a: "Simply add a new config object to the `dynamicCalculators` list. The system dynamically generates inputs, logic, and visual graphics automatically." },
    ],
  },
];
