import { useEffect, useState, useMemo } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog from "@/components/CalculatorBlog";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { blogContent } from "@/data/blogContent";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { PDF_SITE_NAME, PDF_SITE_URL } from "@/constants/pdfBrand";
import { Button } from "@/components/ui/button";
import { CalculateButton } from "@/components/CalculateButton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  Calendar,
  Percent,
  HelpCircle,
  DollarSign,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Sliders,
  Info,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

export function Four01kCalculator() {
  const calc = getCalculator("401k-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  // Unified formatting helper
  function formatCurrency(val: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  }

  // ----------------------------------------------------
  // 401(K) CALCULATOR INPUT STATES (Live)
  // ----------------------------------------------------
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState<number | "">(50000); // 401k Balance
  const [salary, setSalary] = useState<number | "">(80000);
  const [employeeContrPct, setEmployeeContrPct] = useState<number | "">(6);
  const [employerMatchPct, setEmployerMatchPct] = useState<number | "">(50);
  const [employerLimitPct, setEmployerLimitPct] = useState<number | "">(6);
  const [salaryGrowthPct, setSalaryGrowthPct] = useState<number | "">(3);
  const [expectedReturn, setExpectedReturn] = useState<number | "">(8);
  const [inflationRate, setInflationRate] = useState<number | "">(2.5);

  // Advanced Planning & Scenarios
  const [inflationScenario, setInflationScenario] = useState<
    "conservative" | "moderate" | "aggressive"
  >("moderate");
  const [marketPerformance, setMarketPerformance] = useState<"bear" | "average" | "bull">(
    "average",
  );

  // Sync inflation changes to manual settings
  useEffect(() => {
    if (inflationScenario === "conservative") {
      setInflationRate(1.5);
    } else if (inflationScenario === "moderate") {
      setInflationRate(2.5);
    } else {
      setInflationRate(4.0);
    }
  }, [inflationScenario]);

  // ----------------------------------------------------
  // 401(K) CALCULATOR INPUT STATES (Calculated)
  // ----------------------------------------------------
  const [calcCurrentAge, setCalcCurrentAge] = useState(30);
  const [calcRetirementAge, setCalcRetirementAge] = useState(65);
  const [calcCurrentSavings, setCalcCurrentSavings] = useState(50000);
  const [calcSalary, setCalcSalary] = useState(80000);
  const [calcEmployeeContrPct, setCalcEmployeeContrPct] = useState(6);
  const [calcEmployerMatchPct, setCalcEmployerMatchPct] = useState(50);
  const [calcEmployerLimitPct, setCalcEmployerLimitPct] = useState(6);
  const [calcSalaryGrowthPct, setCalcSalaryGrowthPct] = useState(3);
  const [calcExpectedReturn, setCalcExpectedReturn] = useState(8);
  const [calcInflationRate, setCalcInflationRate] = useState(2.5);
  const [calcInflationScenario, setCalcInflationScenario] = useState<
    "conservative" | "moderate" | "aggressive"
  >("moderate");
  const [calcMarketPerformance, setCalcMarketPerformance] = useState<"bear" | "average" | "bull">(
    "average",
  );

  // Adjust returns based on market performance
  const resolvedExpectedReturn = useMemo(() => {
    if (calcMarketPerformance === "bear") return Math.max(0, calcExpectedReturn - 3);
    if (calcMarketPerformance === "bull") return calcExpectedReturn + 3;
    return calcExpectedReturn;
  }, [calcMarketPerformance, calcExpectedReturn]);

  // ----------------------------------------------------
  // CALCULATION LOGIC: 401(K)
  // ----------------------------------------------------
  const results401k = useMemo(() => {
    const yearsToRetire = Math.max(0, calcRetirementAge - calcCurrentAge);
    let balance = calcCurrentSavings;
    let balanceNoMatch = calcCurrentSavings;
    let totalEmployeeContributions = 0;
    let totalEmployerContributions = 0;
    let currentSalary = calcSalary;

    const growthData: any[] = [];

    for (let year = 1; year <= yearsToRetire; year++) {
      const annualSalary = currentSalary;
      const employeeAnnualContrib = annualSalary * (calcEmployeeContrPct / 100);

      // Employer match matching cents on employee percentage limit
      const matchLimitPercentage = Math.min(calcEmployeeContrPct, calcEmployerLimitPct);
      const employerAnnualContrib =
        annualSalary * (matchLimitPercentage / 100) * (calcEmployerMatchPct / 100);

      // Monthly compounding
      const monthlyRate = resolvedExpectedReturn / 100 / 12;
      const monthlyEmployeeContrib = employeeAnnualContrib / 12;
      const monthlyEmployerContrib = employerAnnualContrib / 12;

      for (let month = 1; month <= 12; month++) {
        balance = balance * (1 + monthlyRate) + (monthlyEmployeeContrib + monthlyEmployerContrib);
        balanceNoMatch = balanceNoMatch * (1 + monthlyRate) + monthlyEmployeeContrib;
      }

      totalEmployeeContributions += employeeAnnualContrib;
      totalEmployerContributions += employerAnnualContrib;

      const totalContributions =
        calcCurrentSavings + totalEmployeeContributions + totalEmployerContributions;
      const totalGrowth = balance - totalContributions;

      growthData.push({
        age: calcCurrentAge + year,
        Contributions: Math.round(totalContributions),
        Growth: Math.round(totalGrowth),
        Balance: Math.round(balance),
      });

      // Grow salary annually
      currentSalary *= 1 + calcSalaryGrowthPct / 100;
    }

    const inflationAdjusted = balance / Math.pow(1 + calcInflationRate / 100, yearsToRetire);
    const investmentGrowth =
      balance - (calcCurrentSavings + totalEmployeeContributions + totalEmployerContributions);

    // Readiness score dynamically mapped based on balance target (standard 8x salary benchmark at retirement)
    const targetBenchmark = calcSalary * 8;
    const readinessScore = Math.min(
      100,
      Math.round((balance / Math.max(1, targetBenchmark)) * 100),
    );

    return {
      totalRetirementBalance: balance,
      totalBalanceNoMatch: balanceNoMatch,
      employeeContributions: totalEmployeeContributions,
      employerContributions: totalEmployerContributions,
      investmentGrowth,
      inflationAdjustedValue: inflationAdjusted,
      readinessScore,
      growthData,
    };
  }, [
    calcCurrentAge,
    calcRetirementAge,
    calcCurrentSavings,
    calcSalary,
    calcEmployeeContrPct,
    calcEmployerMatchPct,
    calcEmployerLimitPct,
    calcSalaryGrowthPct,
    resolvedExpectedReturn,
    calcInflationRate,
  ]);

  // ----------------------------------------------------
  // HUMAN ACTIONABLE FINANCIAL INSIGHTS
  // ----------------------------------------------------
  const insights = useMemo(() => {
    const list: string[] = [];
    if (!results401k) return list;

    const { totalRetirementBalance, employerContributions } = results401k;

    list.push(
      `🚀 Your 401(k) is projected to accumulate a total balance of ${formatCurrency(totalRetirementBalance)} by retirement.`,
    );

    if (employerContributions > 0) {
      list.push(
        `🎁 Free Money Captured: You will secure ${formatCurrency(employerContributions)} in total employer matched contributions.`,
      );
    }

    if (calcEmployeeContrPct < calcEmployerLimitPct) {
      list.push(
        `💡 Contribution Tip: You are contributing ${calcEmployeeContrPct}%, but your employer matches up to ${calcEmployerLimitPct}%. Raise your savings to ${calcEmployerLimitPct}% to capture all available matched capital.`,
      );
    } else {
      list.push(`🌟 Outstanding: You are fully maximizing your employer's matched contributions.`);
    }

    const powerOfOne = totalRetirementBalance * 0.15; // 1% extra approximation
    list.push(
      `📈 Compound Acceleration: Raising your employee contribution by just 1% could compound an extra ${formatCurrency(powerOfOne)} at retirement.`,
    );

    return list;
  }, [results401k, calcEmployeeContrPct, calcEmployerLimitPct]);

  // ----------------------------------------------------
  // DYNAMIC DOUGHNUT GRAPH DATA (Breakdown)
  // ----------------------------------------------------
  const doughnutData = useMemo(() => {
    if (!results401k) return [];
    const { employeeContributions, employerContributions, investmentGrowth } = results401k;
    return [
      { name: "Initial Balance", value: calcCurrentSavings, color: "#1a1a2e" },
      { name: "Employee Contributions", value: employeeContributions, color: "#0f9e75" },
      { name: "Employer Match", value: employerContributions, color: "#3b82f6" },
      { name: "Investment Growth", value: investmentGrowth, color: "#d97706" },
    ];
  }, [results401k, calcCurrentSavings]);

  // ----------------------------------------------------
  // EMPLOYER MATCH IMPACT BAR CHART DATA
  // ----------------------------------------------------
  const matchImpactData = useMemo(() => {
    if (!results401k) return [];
    return [
      {
        name: "Without Match",
        Balance: Math.round(results401k.totalBalanceNoMatch),
        color: "#d97706",
      },
      {
        name: "With Match",
        Balance: Math.round(results401k.totalRetirementBalance),
        color: "#0f9e75",
      },
    ];
  }, [results401k]);

  // ----------------------------------------------------
  // BRANDED PDF REPORT CREATION
  // ----------------------------------------------------
  const pdfData = useMemo(() => {
    if (!hasResult || !results401k) return null;
    const {
      totalRetirementBalance,
      employeeContributions,
      employerContributions,
      investmentGrowth,
      inflationAdjustedValue,
      readinessScore,
    } = results401k;
    return {
      calculatorName: "401(k) Calculator",
      calculatorSlug: "401k-calculator",
      siteName: PDF_SITE_NAME,
      siteUrl: PDF_SITE_URL,
      inputs: [
        { label: "Current Age", value: `${calcCurrentAge} years` },
        { label: "Retirement Age", value: `${calcRetirementAge} years` },
        { label: "Annual Salary", value: formatCurrency(calcSalary) },
        { label: "Employee Contribution", value: `${calcEmployeeContrPct}%` },
        { label: "Employer Match Ratio", value: `${calcEmployerMatchPct}%` },
        { label: "Employer Match Limit", value: `${calcEmployerLimitPct}%` },
        { label: "Salary Growth Rate", value: `${calcSalaryGrowthPct}%` },
        { label: "Expected Market Return", value: `${calcExpectedReturn}%` },
        { label: "Inflation Rate", value: `${calcInflationRate}%` },
      ],
      results: [
        {
          label: "Total Retirement 401(k) Balance",
          value: formatCurrency(totalRetirementBalance),
          highlight: true,
        },
        { label: "Personal Employee Contributions", value: formatCurrency(employeeContributions) },
        { label: "Employer Matched Contributions", value: formatCurrency(employerContributions) },
        { label: "Interest Investment Growth", value: formatCurrency(investmentGrowth) },
        { label: "Inflation-Adjusted Value", value: formatCurrency(inflationAdjustedValue) },
        { label: "Retirement Readiness Score", value: `${readinessScore}/100` },
      ],
      summary: `401(k) Contribution Matching & Growth report compiled on CalcZen. With an employee savings rate of ${calcEmployeeContrPct}% and employer limit of ${calcEmployerLimitPct}%, your 401(k) account balance is projected to compound to a nominal value of ${formatCurrency(totalRetirementBalance)} (Inflation-Adjusted: ${formatCurrency(inflationAdjustedValue)}) by age ${calcRetirementAge}.`,
      tableData:
        results401k.growthData.length > 0
          ? {
              title: "ANNUAL 401(K) GROWTH TRANSITIONS",
              headers: ["Age", "Total Contributions", "Investment Growth", "Projected Balance"],
              rows: results401k.growthData
                .filter((_, i) => i % 5 === 0 || i === results401k.growthData.length - 1)
                .map((item) => [
                  String(item.age),
                  formatCurrency(item.Contributions),
                  formatCurrency(item.Growth),
                  formatCurrency(item.Balance),
                ]),
            }
          : null,
    };
  }, [
    hasResult,
    calcCurrentAge,
    calcRetirementAge,
    calcCurrentSavings,
    calcSalary,
    calcEmployeeContrPct,
    calcEmployerMatchPct,
    calcEmployerLimitPct,
    calcSalaryGrowthPct,
    calcExpectedReturn,
    calcInflationRate,
    results401k,
  ]);

  const isButtonDisabled =
    currentAge === "" ||
    retirementAge === "" ||
    currentSavings === "" ||
    salary === "" ||
    employeeContrPct === "" ||
    employerMatchPct === "" ||
    employerLimitPct === "" ||
    salaryGrowthPct === "" ||
    expectedReturn === "" ||
    inflationRate === "" ||
    Number(currentAge) <= 0 ||
    Number(retirementAge) <= Number(currentAge) ||
    Number(currentSavings) < 0 ||
    Number(salary) <= 0 ||
    Number(employeeContrPct) < 0 ||
    Number(employerMatchPct) < 0 ||
    Number(employerLimitPct) < 0 ||
    Number(salaryGrowthPct) < 0 ||
    Number(expectedReturn) < 0 ||
    Number(inflationRate) < 0;

  const handleCalculate = () => {
    if (isButtonDisabled) return;
    setCalcCurrentAge(Number(currentAge));
    setCalcRetirementAge(Number(retirementAge));
    setCalcCurrentSavings(Number(currentSavings));
    setCalcSalary(Number(salary));
    setCalcEmployeeContrPct(Number(employeeContrPct));
    setCalcEmployerMatchPct(Number(employerMatchPct));
    setCalcEmployerLimitPct(Number(employerLimitPct));
    setCalcSalaryGrowthPct(Number(salaryGrowthPct));
    setCalcExpectedReturn(Number(expectedReturn));
    setCalcInflationRate(Number(inflationRate));
    setCalcInflationScenario(inflationScenario);
    setCalcMarketPerformance(marketPerformance);
    markCalculated();
  };

  const handleReset = () => {
    setCurrentAge(30);
    setRetirementAge(65);
    setCurrentSavings(50000);
    setSalary(80000);
    setEmployeeContrPct(6);
    setEmployerMatchPct(50);
    setEmployerLimitPct(6);
    setSalaryGrowthPct(3);
    setExpectedReturn(8);
    setInflationRate(2.5);
    setInflationScenario("moderate");
    setMarketPerformance("average");

    setCalcCurrentAge(30);
    setCalcRetirementAge(65);
    setCalcCurrentSavings(50000);
    setCalcSalary(80000);
    setCalcEmployeeContrPct(6);
    setCalcEmployerMatchPct(50);
    setCalcEmployerLimitPct(6);
    setCalcSalaryGrowthPct(3);
    setCalcExpectedReturn(8);
    setCalcInflationRate(2.5);
    setCalcInflationScenario("moderate");
    setCalcMarketPerformance("average");
    resetCalculated();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isButtonDisabled) {
      handleCalculate();
    }
  };

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Estimate your future 401(k) growth, analyze compound market returns, and maximize your employer's matched contributions easily with standard scenario testing."
      formula={`401(k) Balance = CompoundedSavings + Contributions
Employer Match = Salary × min(EmployeePct, LimitPct) × MatchPct
Inflation Adjusted Value = NominalBalance ÷ (1 + InflationRate)ⁿ`}
      example={`Annual salary $80,000 contributing 6% employee, 50% match up to 6% employer limit over 35 years at 8% return results in over $1.52M compounded.`}
      faqs={[
        {
          q: "What is a 401(k) calculator?",
          a: "A 401(k) calculator is an online retirement planning tool that projects the future value of your employer-sponsored retirement account based on your salary, personal contributions, investment returns, and employer matching rules. It helps you visualize how compounding interest, regular salary deferrals, and employer match contributions grow your retirement nest egg over many years.",
        },
        {
          q: "How does an employer match work?",
          a: "An employer match is when your employer contributes money to your 401(k) based on your own contribution rate. Typically, they match a percentage of your salary up to a certain limit (e.g., 50% of your contributions up to 6% of your salary). This represents free money and immediate returns on your savings.",
        },
        {
          q: "What are the contribution limits for a 401(k)?",
          a: "The IRS sets annual contribution limits for 401(k) accounts, which adjust periodically for inflation. For 2024, the basic employee deferral limit is $23,000, while individuals aged 50 or older can make an additional catch-up contribution of $7,500. Total employer plus employee contributions are also subject to combined annual limits set by the government.",
        },
        {
          q: "What is the difference between a traditional and Roth 401(k)?",
          a: "A traditional 401(k) uses pre-tax contributions, which lowers your taxable income today, but you pay ordinary income tax on withdrawals in retirement. A Roth 401(k) uses after-tax contributions, meaning you get no tax break now, but all qualifying withdrawals in retirement are entirely tax-free. Choose based on your current tax bracket.",
        },
        {
          q: "How does compounding interest affect my 401(k) balance?",
          a: "Compounding interest is the powerful financial process where your investment earnings generate their own earnings over time. By reinvesting dividends and capital gains back into your account, your 401(k) balance grows exponentially. Starting to invest early is critical for your retirement plan, as a few extra years of compounding can result in hundreds of thousands of dollars in additional retirement wealth.",
        },
        {
          q: "Should I maximize my 401(k) contributions?",
          a: "You should aim to contribute at least enough to receive your employer's full matching contribution, as this is equivalent to a 100% return on your investment. If your budget allows, maximizing your contributions up to the IRS limit helps secure your long-term financial independence and reduces your current income tax burden.",
        },
        {
          q: "What happens if I withdraw money early from my 401(k)?",
          a: "If you withdraw money from a traditional 401(k) before age 59&frac12;, you will generally face a 10% IRS early withdrawal penalty on top of paying standard federal and state income taxes on the distributed amount. Some exceptions apply for hardships or first-time home purchases, but early withdrawals severely disrupt compounding growth.",
        },
        {
          q: "How do salary increases affect my retirement savings?",
          a: 'When your salary increases, your 401(k) contributions grow proportionally if you save a fixed percentage of your income. To accelerate your wealth, you can implement \'contribution rate matching\' by allocating a portion of your raise directly to your retirement savings rate, as modeled in our <a href="/calculator/retirement-calculator" class="text-primary hover:underline">Retirement Calculator</a>.',
        },
      ]}
      blog={<CalculatorBlog content={blogContent["401k"]} />}
    >
      <div className="flex flex-col gap-6">
        {/* LEFT COLUMN: FINANCIAL INPUTS */}
        <div className="calc-input-column space-y-6">
          {/* Core Inputs Card */}
          <div className="bg-card/20 border border-border/70 rounded-2xl p-5 sm:p-6 shadow-card">
            <h3 className="text-base font-bold text-foreground mb-5 flex items-center gap-2 select-none border-b border-border/20 pb-3">
              <Sliders className="h-4.5 w-4.5 text-accent" />
              401(k) Growth Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6.5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground flex items-center justify-between">
                  <span>Current Age</span>
                  <span className="text-foreground">{currentAge} yrs</span>
                </label>
                <input
                  type="range"
                  min="18"
                  max="80"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-muted"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground flex items-center justify-between">
                  <span>Target Retirement Age</span>
                  <span className="text-foreground">{retirementAge} yrs</span>
                </label>
                <input
                  type="range"
                  min={Math.max(18, currentAge + 1)}
                  max="95"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-muted"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground">
                  Current 401(k) Balance
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    value={currentSavings}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCurrentSavings(val === "" ? "" : Math.max(0, Number(val)));
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full h-11 pl-8 pr-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground">Annual Salary</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSalary(val === "" ? "" : Math.max(0, Number(val)));
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full h-11 pl-8 pr-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground">
                  Employee Contribution (%)
                </label>
                <input
                  type="number"
                  value={employeeContrPct}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEmployeeContrPct(val === "" ? "" : Math.max(0, Number(val)));
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-full h-11 px-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground">
                  Employer Match Ratio (%)
                </label>
                <input
                  type="number"
                  value={employerMatchPct}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEmployerMatchPct(val === "" ? "" : Math.max(0, Number(val)));
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-full h-11 px-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground">
                  Employer Match Limit (%)
                </label>
                <input
                  type="number"
                  value={employerLimitPct}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEmployerLimitPct(val === "" ? "" : Math.max(0, Number(val)));
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-full h-11 px-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground">
                  Annual Salary Growth (%)
                </label>
                <input
                  type="number"
                  value={salaryGrowthPct}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSalaryGrowthPct(val === "" ? "" : Math.max(0, Number(val)));
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-full h-11 px-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground">
                  Expected Investment Return (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={expectedReturn}
                  onChange={(e) => {
                    const val = e.target.value;
                    setExpectedReturn(val === "" ? "" : Math.max(0, Number(val)));
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-full h-11 px-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground">
                  Inflation Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inflationRate}
                  onChange={(e) => {
                    const val = e.target.value;
                    setInflationRate(val === "" ? "" : Math.max(0, Number(val)));
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-full h-11 px-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          {/* ADVANCED PLANNING & SCENARIOS */}
          <div className="bg-card/20 border border-border/70 rounded-2xl p-5 sm:p-6 shadow-card">
            <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2 select-none border-b border-border/20 pb-3">
              <Sliders className="h-4.5 w-4.5 text-accent" />
              Advanced Strategic Scenarios
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5.5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground">
                  Inflation Plan Scenario
                </label>
                <div className="flex gap-2">
                  {["conservative", "moderate", "aggressive"].map((scen) => (
                    <button
                      key={scen}
                      onClick={() => setInflationScenario(scen as any)}
                      type="button"
                      className={`flex-1 h-9 rounded-lg text-xs font-bold border transition-all uppercase ${
                        inflationScenario === scen
                          ? "bg-accent text-accent-foreground border-accent shadow-soft"
                          : "bg-muted/10 text-muted-foreground border-border/30 hover:bg-muted/30"
                      }`}
                    >
                      {scen.slice(0, 4)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground">
                  Market Performance Scenario
                </label>
                <div className="flex gap-2">
                  {["bear", "average", "bull"].map((perf) => (
                    <button
                      key={perf}
                      onClick={() => setMarketPerformance(perf as any)}
                      type="button"
                      className={`flex-1 h-9 rounded-lg text-xs font-bold border transition-all uppercase ${
                        marketPerformance === perf
                          ? "bg-accent text-accent-foreground border-accent shadow-soft"
                          : "bg-muted/10 text-muted-foreground border-border/30 hover:bg-muted/30"
                      }`}
                    >
                      {perf}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-row gap-3 mt-4">
            <CalculateButton
              category="finance"
              className="flex-1 min-h-11"
              disabled={isButtonDisabled}
              onClick={handleCalculate}
            >
              Calculate
            </CalculateButton>
            <Button variant="outline" className="flex-1 min-h-11" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY STYLED RESULTS PANEL (Revealed after calculation) */}
        {hasResult && results401k && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, height: "auto", scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mt-6 pt-6 border-t border-border space-y-6 overflow-hidden relative"
          >
            <div
              className="absolute inset-0 pointer-events-none blur-3xl opacity-15 -z-10"
              style={{
                background: "radial-gradient(circle at 50% 50%, #0ea5e9, transparent 65%)",
              }}
            />
            <div>
              <h2 className="text-xl font-bold text-foreground">Results</h2>
              <div className="mt-3 bg-card border border-border/80 rounded-2xl p-5 sm:p-6 shadow-glow relative overflow-hidden">
                <div className="absolute right-0 top-0 h-16 w-16 bg-accent/5 rounded-bl-full flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-accent/25" />
                </div>

                <h3 className="text-xs font-extrabold tracking-widest text-muted-foreground uppercase mb-3.5 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  Retirement Readiness Score
                </h3>

                {(() => {
                  const score = results401k.readinessScore;
                  let colorClass = "text-destructive border-destructive/20 bg-destructive/10";
                  let statusText = "At Risk";
                  if (score >= 80) {
                    colorClass = "text-emerald-500 border-emerald-500/20 bg-emerald-500/10";
                    statusText = "On Track";
                  } else if (score >= 50) {
                    colorClass = "text-amber-500 border-amber-500/20 bg-amber-500/10";
                    statusText = "Needs Improvement";
                  }

                  return (
                    <div className="flex items-center gap-4 mb-5">
                      <div className="h-20 w-20 sm:h-22 sm:w-22 rounded-full border-4 border-muted flex flex-col items-center justify-center relative">
                        <span className="text-xl sm:text-2xl font-extrabold text-foreground">
                          {score}%
                        </span>
                      </div>
                      <div>
                        <div
                          className={`px-3 py-1 text-[11px] font-extrabold border rounded-lg uppercase tracking-wider tracking-tight ${colorClass}`}
                        >
                          {statusText}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 max-w-[13rem]">
                          Simulated score based on your active contributions, matched caps, and
                          scenario constraints.
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* 401(K) CORE METRICS */}
                <div className="space-y-3.5 border-t border-border/20 pt-4.5">
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-xs font-bold text-muted-foreground">
                      Total Personal Contribution
                    </span>
                    <span className="text-sm font-extrabold text-foreground">
                      {formatCurrency(results401k.employeeContributions)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-xs font-bold text-muted-foreground">
                      Employer Match Contribution
                    </span>
                    <span className="text-sm font-extrabold text-foreground">
                      {formatCurrency(results401k.employerContributions)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-xs font-bold text-muted-foreground">
                      Investment Compound Growth
                    </span>
                    <span className="text-sm font-extrabold text-foreground">
                      {formatCurrency(results401k.investmentGrowth)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-0.5 border-t border-border/20 pt-3">
                    <span className="text-xs font-bold text-muted-foreground">
                      Projected 401(k) Balance
                    </span>
                    <span className="text-lg font-black text-accent">
                      {formatCurrency(results401k.totalRetirementBalance)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-xs font-bold text-muted-foreground">
                      Inflation Adjusted Value
                    </span>
                    <span className="text-sm font-extrabold text-accent/90">
                      {formatCurrency(results401k.inflationAdjustedValue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CONTRIBUTION VS GROWTH BREAKDOWN PIE CHART */}
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">
                Contribution vs Growth Breakdown
              </h3>
              <div className="bg-card/25 border border-border/70 rounded-2xl p-5 shadow-card select-none">
                <div className="h-56 w-full flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={doughnutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {doughnutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatCurrency(Number(value))}
                        contentStyle={{
                          background: "var(--color-card)",
                          borderColor: "var(--color-border)",
                          borderRadius: "8px",
                        }}
                        itemStyle={{ color: "var(--color-foreground)" }}
                        labelStyle={{ color: "var(--color-foreground)" }}
                        wrapperStyle={{ zIndex: 50 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text Indicator */}
                  <div className="absolute flex flex-col items-center justify-center pointer-events-none select-none z-0">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">
                      Balance
                    </span>
                    <span className="text-base font-extrabold text-foreground">
                      {formatCurrency(results401k.totalRetirementBalance)}
                    </span>
                  </div>
                </div>

                {/* Legend grid */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-muted-foreground mt-3">
                  {doughnutData.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5 truncate">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 401(K) GROWTH PROJECTION CHART */}
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">
                Visualization (Growth Projection)
              </h3>
              <div className="bg-card/25 border border-border/70 rounded-2xl p-5 shadow-card select-none">
                <div className="h-64 sm:h-76 w-full pr-4 text-xs font-semibold">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={results401k.growthData}>
                      <defs>
                        <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d97706" stopOpacity={0.65} />
                          <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="colorContrib" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0f9e75" stopOpacity={0.65} />
                          <stop offset="95%" stopColor="#0f9e75" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="var(--color-border)"
                        strokeOpacity={0.3}
                      />
                      <XAxis
                        dataKey="age"
                        height={50}
                        label={{
                          value: "Age",
                          position: "insideBottom",
                          offset: 0,
                          fill: "var(--color-muted-foreground)",
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                        stroke="var(--color-muted-foreground)"
                      />
                      <YAxis
                        tickFormatter={(val) => `$${val / 1000}k`}
                        stroke="var(--color-muted-foreground)"
                      />
                      <Tooltip
                        formatter={(value) => formatCurrency(Number(value))}
                        contentStyle={{
                          background: "var(--color-card)",
                          borderColor: "var(--color-border)",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "var(--color-foreground)" }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="Growth"
                        stroke="#d97706"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorGrowth)"
                      />
                      <Area
                        type="monotone"
                        dataKey="Contributions"
                        stroke="#0f9e75"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorContrib)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* EMPLOYER MATCH IMPACT CHART */}
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">
                Visualization (Employer Match Impact)
              </h3>
              <div className="bg-card/25 border border-border/70 rounded-2xl p-5 shadow-card select-none">
                <div className="h-64 sm:h-72 w-full pr-4 text-xs font-semibold">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={matchImpactData} barSize={40}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="var(--color-border)"
                        strokeOpacity={0.3}
                      />
                      <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                      <YAxis
                        tickFormatter={(val) => `$${val / 1000}k`}
                        stroke="var(--color-muted-foreground)"
                      />
                      <Tooltip
                        formatter={(value) => formatCurrency(Number(value))}
                        contentStyle={{
                          background: "var(--color-card)",
                          borderColor: "var(--color-border)",
                          borderRadius: "8px",
                        }}
                        itemStyle={{ color: "var(--color-foreground)" }}
                        labelStyle={{ color: "var(--color-foreground)" }}
                      />
                      <Bar dataKey="Balance" radius={[6, 6, 0, 0]}>
                        {matchImpactData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* DYNAMIC READABLE INSIGHTS METRICS */}
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">Insights</h3>
              <div className="bg-card/20 border border-border/70 rounded-2xl p-5 shadow-card">
                <h3 className="text-sm font-bold text-foreground mb-4.5 flex items-center gap-2 border-b border-border/20 pb-3 select-none">
                  <Sparkles className="h-4 w-4 text-accent" />
                  401(k) Growth Advisory & Insights
                </h3>
                <ul className="space-y-3">
                  {insights.map((insight, idx) => (
                    <li
                      key={idx}
                      className="flex gap-2.5 text-xs font-semibold leading-relaxed text-muted-foreground"
                    >
                      <ChevronRight className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* PDF Report Exporters */}
            <div className="flex flex-col">
              <CalculatorPdfExport hasResult={hasResult} pdfData={pdfData} />
            </div>
          </motion.div>
        )}
      </div>
    </CalculatorPageLayout>
  );
}
