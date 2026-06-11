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
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import {
  Calendar, Percent, HelpCircle, DollarSign, ArrowUpRight,
  TrendingUp, Sparkles, Sliders, Info, ShieldCheck, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

export function RetirementCalculator() {
  const calc = getCalculator("retirement-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  // Unified formatting helper
  function formatCurrency(val: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(val);
  }

  // ----------------------------------------------------
  // RETIREMENT CALCULATOR INPUT STATES (Live)
  // ----------------------------------------------------
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [currentSavings, setCurrentSavings] = useState<number | "">(50000);
  const [monthlyContribution, setMonthlyContribution] = useState<number | "">(500);
  const [expectedReturn, setExpectedReturn] = useState<number | "">(7);
  const [inflationRate, setInflationRate] = useState<number | "">(2.5);
  const [desiredIncome, setDesiredIncome] = useState<number | "">(60000);

  // Additional Incomes
  const [pension, setPension] = useState<number | "">(0);
  const [socialSecurity, setSocialSecurity] = useState<number | "">(20000);
  const [rentalIncome, setRentalIncome] = useState<number | "">(0);
  const [otherIncome, setOtherIncome] = useState<number | "">(0);

  // Advanced Planning & Scenarios
  const [federalTax, setFederalTax] = useState<number | "">(12);
  const [stateTax, setStateTax] = useState<number | "">(5);
  const [inflationScenario, setInflationScenario] = useState<"conservative" | "moderate" | "aggressive">("moderate");
  const [marketPerformance, setMarketPerformance] = useState<"bear" | "average" | "bull">("average");

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
  // RETIREMENT CALCULATOR INPUT STATES (Calculated)
  // ----------------------------------------------------
  const [calcCurrentAge, setCalcCurrentAge] = useState(30);
  const [calcRetirementAge, setCalcRetirementAge] = useState(65);
  const [calcLifeExpectancy, setCalcLifeExpectancy] = useState(85);
  const [calcCurrentSavings, setCalcCurrentSavings] = useState(50000);
  const [calcMonthlyContribution, setCalcMonthlyContribution] = useState(500);
  const [calcExpectedReturn, setCalcExpectedReturn] = useState(7);
  const [calcInflationRate, setCalcInflationRate] = useState(2.5);
  const [calcDesiredIncome, setCalcDesiredIncome] = useState(60000);
  const [calcPension, setCalcPension] = useState(0);
  const [calcSocialSecurity, setCalcSocialSecurity] = useState(20000);
  const [calcRentalIncome, setCalcRentalIncome] = useState(0);
  const [calcOtherIncome, setCalcOtherIncome] = useState(0);
  const [calcFederalTax, setCalcFederalTax] = useState(12);
  const [calcStateTax, setCalcStateTax] = useState(5);
  const [calcInflationScenario, setCalcInflationScenario] = useState<"conservative" | "moderate" | "aggressive">("moderate");
  const [calcMarketPerformance, setCalcMarketPerformance] = useState<"bear" | "average" | "bull">("average");

  // Adjust returns based on market performance
  const resolvedExpectedReturn = useMemo(() => {
    if (calcMarketPerformance === "bear") return Math.max(0, calcExpectedReturn - 3);
    if (calcMarketPerformance === "bull") return calcExpectedReturn + 3;
    return calcExpectedReturn;
  }, [calcMarketPerformance, calcExpectedReturn]);

  // ----------------------------------------------------
  // CALCULATION LOGIC: RETIREMENT
  // ----------------------------------------------------
  const retirementResults = useMemo(() => {
    const yearsToRetire = Math.max(0, calcRetirementAge - calcCurrentAge);
    const yearsInRetirement = Math.max(0, calcLifeExpectancy - calcRetirementAge);
    
    let savings = calcCurrentSavings;
    let totalPersonalContributions = 0;
    const growthData: any[] = [];

    // 1. Accumulation Phase loop (yearly projection)
    for (let year = 1; year <= yearsToRetire; year++) {
      const startBalance = savings;
      const annualContrib = calcMonthlyContribution * 12;
      
      // Monthly compound interest
      const monthlyRate = resolvedExpectedReturn / 100 / 12;
      let compoundedSavings = startBalance;

      for (let month = 1; month <= 12; month++) {
        compoundedSavings = compoundedSavings * (1 + monthlyRate) + (calcMonthlyContribution);
      }
      
      savings = compoundedSavings;
      totalPersonalContributions += annualContrib;
      const totalGrowth = savings - (calcCurrentSavings + totalPersonalContributions);

      growthData.push({
        age: calcCurrentAge + year,
        Contributions: Math.round(calcCurrentSavings + totalPersonalContributions),
        Growth: Math.round(totalGrowth),
        Balance: Math.round(savings)
      });
    }

    const projectedSavingsAtRetirement = savings;

    // 2. Decumulation Phase loop (Income Gap & Years Money Lasts)
    let decumBalance = savings;
    const totalAdditionalIncome = calcPension + calcSocialSecurity + calcRentalIncome + calcOtherIncome;
    const taxRate = (calcFederalTax + calcStateTax) / 100;
    
    // Desired withdrawals adjusted for tax rate
    const grossIncomeNeeded = calcDesiredIncome / (1 - taxRate);
    const netWithdrawalGap = Math.max(0, grossIncomeNeeded - totalAdditionalIncome);
    
    let yearsMoneyLasts = 0;
    const decumulationChartData: any[] = [];

    for (let year = 1; year <= 60; year++) {
      const inflationFactor = Math.pow(1 + calcInflationRate / 100, year);
      const realWithdrawal = netWithdrawalGap * inflationFactor;

      if (decumBalance >= realWithdrawal) {
        decumBalance = (decumBalance - realWithdrawal) * (1 + resolvedExpectedReturn / 100);
        yearsMoneyLasts++;
        decumulationChartData.push({
          age: calcRetirementAge + year,
          Withdrawals: Math.round(realWithdrawal),
          RemainingCorpus: Math.round(decumBalance)
        });
      } else {
        if (decumBalance > 0) {
          decumulationChartData.push({
            age: calcRetirementAge + year,
            Withdrawals: Math.round(decumBalance),
            RemainingCorpus: 0
          });
          decumBalance = 0;
        }
        break;
      }
    }

    // Corpus needed to safely outlast life expectancy
    let safeCorpusNeeded = 0;
    for (let year = 1; year <= yearsInRetirement; year++) {
      const inflationFactor = Math.pow(1 + calcInflationRate / 100, year);
      safeCorpusNeeded += (netWithdrawalGap * inflationFactor) / Math.pow(1 + resolvedExpectedReturn / 100, year);
    }

    const incomeGap = Math.max(0, safeCorpusNeeded - projectedSavingsAtRetirement);
    const monthlyIncomeGenerated = (projectedSavingsAtRetirement * (resolvedExpectedReturn / 100)) / 12;

    // Readiness score index (0-100)
    let readinessScore = 0;
    if (yearsInRetirement > 0) {
      readinessScore = Math.min(100, Math.round((yearsMoneyLasts / yearsInRetirement) * 100));
    } else {
      readinessScore = 100;
    }

    return {
      projectedSavingsAtRetirement,
      safeCorpusNeeded,
      incomeGap,
      yearsMoneyLasts,
      monthlyIncomeGenerated,
      readinessScore,
      growthData,
      decumulationChartData,
      totalPersonalContributions,
      totalGrowthEarned: projectedSavingsAtRetirement - (calcCurrentSavings + totalPersonalContributions)
    };
  }, [
    calcCurrentAge, calcRetirementAge, calcLifeExpectancy, calcCurrentSavings,
    calcMonthlyContribution, resolvedExpectedReturn, calcInflationRate, calcDesiredIncome,
    calcPension, calcSocialSecurity, calcRentalIncome, calcOtherIncome, calcFederalTax, calcStateTax
  ]);

  // ----------------------------------------------------
  // HUMAN ACTIONABLE FINANCIAL INSIGHTS
  // ----------------------------------------------------
  const insights = useMemo(() => {
    const list: string[] = [];
    if (!retirementResults) return list;

    const { safeCorpusNeeded, projectedSavingsAtRetirement, yearsMoneyLasts } = retirementResults;
    const gap = safeCorpusNeeded - projectedSavingsAtRetirement;
    const yearsInRetire = calcLifeExpectancy - calcRetirementAge;

    if (gap <= 0) {
      list.push(`🎉 Fantastic! Your projected retirement savings exceed your secure corpus target by ${formatCurrency(Math.abs(gap))}.`);
    } else {
      list.push(`⚠️ Shortfall Alert: You have a savings gap of ${formatCurrency(gap)} to cover your desired retirement lifestyle.`);
      const extraMonthly = gap / (Math.max(1, calcRetirementAge - calcCurrentAge) * 12 * 1.5); // Simplified compound factor
      list.push(`💡 Boosting your monthly contributions by just ${formatCurrency(extraMonthly)} could fully close your retirement savings gap.`);
    }

    if (yearsMoneyLasts >= yearsInRetire) {
      list.push(`🛡️ Safety Margin: Your corpus is projected to outlast your life expectancy by ${yearsMoneyLasts - yearsInRetire} years.`);
    } else {
      list.push(`⚠️ Depletion warning: Your savings are projected to run out at age ${calcRetirementAge + yearsMoneyLasts}, leaving you ${yearsInRetire - yearsMoneyLasts} years short.`);
    }

    const purchasingPower = 100 / Math.pow(1 + calcInflationRate / 100, calcRetirementAge - calcCurrentAge);
    list.push(`📈 Inflation Impact: Future inflation is projected to reduce the purchasing power of your money by ${Math.round(100 - purchasingPower)}% at retirement.`);

    return list;
  }, [retirementResults, calcCurrentAge, calcRetirementAge, calcLifeExpectancy, calcInflationRate]);

  // ----------------------------------------------------
  // DYNAMIC DOUGHNUT GRAPH DATA (Breakdown)
  // ----------------------------------------------------
  const doughnutData = useMemo(() => {
    if (!retirementResults) return [];
    const { totalPersonalContributions, totalGrowthEarned } = retirementResults;
    return [
      { name: "Initial Savings", value: calcCurrentSavings, color: "#1a1a2e" },
      { name: "Personal Contributions", value: totalPersonalContributions, color: "#0f9e75" },
      { name: "Investment Growth", value: totalGrowthEarned, color: "#d97706" }
    ];
  }, [retirementResults, calcCurrentSavings]);

  // ----------------------------------------------------
  // BRANDED PDF REPORT CREATION
  // ----------------------------------------------------
  const pdfData = useMemo(() => {
    if (!hasResult || !retirementResults) return null;
    const { projectedSavingsAtRetirement, safeCorpusNeeded, incomeGap, yearsMoneyLasts, readinessScore } = retirementResults;
    return {
      calculatorName: "Retirement Calculator",
      calculatorSlug: "retirement-calculator",
      siteName: PDF_SITE_NAME,
      siteUrl: PDF_SITE_URL,
      inputs: [
        { label: "Current Age", value: `${calcCurrentAge} years` },
        { label: "Retirement Age", value: `${calcRetirementAge} years` },
        { label: "Life Expectancy", value: `${calcLifeExpectancy} years` },
        { label: "Current Savings", value: formatCurrency(calcCurrentSavings) },
        { label: "Monthly Contribution", value: formatCurrency(calcMonthlyContribution) },
        { label: "Expected Annual Return", value: `${calcExpectedReturn}%` },
        { label: "Inflation Rate", value: `${calcInflationRate}%` },
        { label: "Desired Retirement Income", value: `${formatCurrency(calcDesiredIncome)}/year` },
        { label: "Social Security Benefits", value: `${formatCurrency(calcSocialSecurity)}/year` },
        { label: "Tax Settings (Fed + State)", value: `${calcFederalTax + calcStateTax}%` }
      ],
      results: [
        { label: "Projected Savings at Retirement", value: formatCurrency(projectedSavingsAtRetirement) },
        { label: "Retirement Corpus Needed", value: formatCurrency(safeCorpusNeeded), highlight: true },
        { label: "Savings Shortfall / Income Gap", value: formatCurrency(incomeGap) },
        { label: "Retirement Readiness Score", value: `${readinessScore}/100` },
        { label: "Years Money Will Last", value: `${yearsMoneyLasts} years` }
      ],
      summary: `Retirement Wealth Planning report generated on CalcZen. Based on a target retirement age of ${calcRetirementAge}, you are projected to accumulate ${formatCurrency(projectedSavingsAtRetirement)} against a desired corpus target of ${formatCurrency(safeCorpusNeeded)}. This leaves a financial coverage of ${yearsMoneyLasts} years during your retirement, resulting in a Readiness Score of ${readinessScore}%.`,
      tableData: retirementResults.growthData.length > 0 ? {
        title: "ANNUAL SAVINGS ACCUMULATION TIMELINE",
        headers: ["Age", "Personal Contributions", "Investment Growth", "Projected Balance"],
        rows: retirementResults.growthData.filter((_, i) => i % 5 === 0 || i === retirementResults.growthData.length - 1).map((item) => [
          String(item.age),
          formatCurrency(item.Contributions),
          formatCurrency(item.Growth),
          formatCurrency(item.Balance)
        ])
      } : null
    };
  }, [
    hasResult, calcCurrentAge, calcRetirementAge, calcLifeExpectancy, calcCurrentSavings,
    calcMonthlyContribution, calcExpectedReturn, calcInflationRate, calcDesiredIncome,
    calcSocialSecurity, calcFederalTax, calcStateTax, retirementResults
  ]);

  const isButtonDisabled = 
    currentAge === "" || retirementAge === "" || lifeExpectancy === "" ||
    currentSavings === "" || monthlyContribution === "" || expectedReturn === "" ||
    inflationRate === "" || desiredIncome === "" || pension === "" ||
    socialSecurity === "" || rentalIncome === "" || otherIncome === "" ||
    federalTax === "" || stateTax === "" ||
    Number(currentAge) <= 0 || Number(retirementAge) <= Number(currentAge) ||
    Number(lifeExpectancy) <= Number(retirementAge) ||
    Number(currentSavings) < 0 || Number(monthlyContribution) < 0 ||
    Number(expectedReturn) < 0 || Number(inflationRate) < 0 ||
    Number(desiredIncome) < 0 || Number(pension) < 0 ||
    Number(socialSecurity) < 0 || Number(rentalIncome) < 0 ||
    Number(otherIncome) < 0 || Number(federalTax) < 0 ||
    Number(stateTax) < 0;

  const handleCalculate = () => {
    if (isButtonDisabled) return;
    setCalcCurrentAge(Number(currentAge));
    setCalcRetirementAge(Number(retirementAge));
    setCalcLifeExpectancy(Number(lifeExpectancy));
    setCalcCurrentSavings(Number(currentSavings));
    setCalcMonthlyContribution(Number(monthlyContribution));
    setCalcExpectedReturn(Number(expectedReturn));
    setCalcInflationRate(Number(inflationRate));
    setCalcDesiredIncome(Number(desiredIncome));
    setCalcPension(Number(pension));
    setCalcSocialSecurity(Number(socialSecurity));
    setCalcRentalIncome(Number(rentalIncome));
    setCalcOtherIncome(Number(otherIncome));
    setCalcFederalTax(Number(federalTax));
    setCalcStateTax(Number(stateTax));
    setCalcInflationScenario(inflationScenario);
    setCalcMarketPerformance(marketPerformance);
    markCalculated();
  };

  const handleReset = () => {
    setCurrentAge(30);
    setRetirementAge(65);
    setLifeExpectancy(85);
    setCurrentSavings(50000);
    setMonthlyContribution(500);
    setExpectedReturn(7);
    setInflationRate(2.5);
    setDesiredIncome(60000);
    setPension(0);
    setSocialSecurity(20000);
    setRentalIncome(0);
    setOtherIncome(0);
    setFederalTax(12);
    setStateTax(5);
    setInflationScenario("moderate");
    setMarketPerformance("average");

    setCalcCurrentAge(30);
    setCalcRetirementAge(65);
    setCalcLifeExpectancy(85);
    setCalcCurrentSavings(50000);
    setCalcMonthlyContribution(500);
    setCalcExpectedReturn(7);
    setCalcInflationRate(2.5);
    setCalcDesiredIncome(60000);
    setCalcPension(0);
    setCalcSocialSecurity(20000);
    setCalcRentalIncome(0);
    setCalcOtherIncome(0);
    setCalcFederalTax(12);
    setCalcStateTax(5);
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
      intro="Determine if your savings will comfortably outlast your retirement. Plan corpus targets, calculate income gaps, and run advanced tax and inflation scenarios."
      formula={`Retirement Balance = CompoundedSavings + Contributions
Income Gap = SafeCorpusNeeded − ProjectedSavingsAtRetirement
Safe Corpus Needed = Σ [WithdrawalGap × (1+InflationRate)ⁿ / (1+ReturnRate)ⁿ]`}
      example={`Starting with $50,000 savings and compounding $500/month at 7% return over 35 years compiles over $1.04M at retirement.`}
      faqs={[
        { q: "How is the Retirement Readiness Score computed?", a: "The score assesses your projected savings at retirement against the total safe corpus required to sustain your desired lifestyle. A score of 100% means your portfolio will outlast your life expectancy." },
        { q: "How does tax selection impact my retirement payouts?", a: "Taxes are the single largest hidden cost in retirement. By inputting estimated federal and state tax rates, the calculator automatically computes the 'grossed up' income you must withdraw to support your 'net' desired spending." },
        { q: "What is a 'Retirement Income Gap'?", a: "The gap is the shortfall between your target annual retirement spending and passive income sources like Social Security or pensions. Your investment portfolio must compound enough capital to bridge this exact difference." }
      ]}
      blog={<CalculatorBlog content={blogContent.retirement} />}
    >
      <div className="flex flex-col gap-6">
        {/* LEFT COLUMN: FINANCIAL INPUTS */}
        <div className="calc-input-column space-y-6">
          
          {/* Core Inputs Card */}
          <div className="bg-card/20 border border-border/70 rounded-2xl p-5 sm:p-6 shadow-card">
            <h3 className="text-base font-bold text-foreground mb-5 flex items-center gap-2 select-none border-b border-border/20 pb-3">
              <Sliders className="h-4.5 w-4.5 text-accent" />
              Retirement Planning Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6.5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground flex items-center justify-between">
                  <span>Current Age</span>
                  <span className="text-foreground">{currentAge} yrs</span>
                </label>
                <input
                  type="range" min="18" max="80" value={currentAge}
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
                  type="range" min={Math.max(18, currentAge + 1)} max="95" value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-muted"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground flex items-center justify-between">
                  <span>Life Expectancy</span>
                  <span className="text-foreground">{lifeExpectancy} yrs</span>
                </label>
                <input
                  type="range" min={Math.max(18, retirementAge + 1)} max="110" value={lifeExpectancy}
                  onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-muted"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground">Current Savings</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
                  <input
                    type="number" value={currentSavings}
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
                <label className="text-xs font-bold text-muted-foreground">Monthly Savings Contribution</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
                  <input
                    type="number" value={monthlyContribution}
                    onChange={(e) => {
                      const val = e.target.value;
                      setMonthlyContribution(val === "" ? "" : Math.max(0, Number(val)));
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full h-11 pl-8 pr-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground">Desired Annual Retirement Income</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
                  <input
                    type="number" value={desiredIncome}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDesiredIncome(val === "" ? "" : Math.max(0, Number(val)));
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full h-11 pl-8 pr-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground">Expected Annual Return (%)</label>
                <input
                  type="number" step="0.1" value={expectedReturn}
                  onChange={(e) => {
                    const val = e.target.value;
                    setExpectedReturn(val === "" ? "" : Math.max(0, Number(val)));
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-full h-11 px-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground">Inflation Rate (%)</label>
                <input
                  type="number" step="0.1" value={inflationRate}
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

          {/* ADDITIONAL INCOME SOURCES */}
          <div className="bg-card/20 border border-border/70 rounded-2xl p-5 sm:p-6 shadow-card">
            <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2 select-none border-b border-border/20 pb-3">
              <ArrowUpRight className="h-4.5 w-4.5 text-accent" />
              Additional Payouts & Income (Annual)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground">Social Security benefits</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
                  <input
                    type="number" value={socialSecurity}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSocialSecurity(val === "" ? "" : Math.max(0, Number(val)));
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full h-11 pl-8 pr-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground">Pension payouts</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
                  <input
                    type="number" value={pension}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPension(val === "" ? "" : Math.max(0, Number(val)));
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full h-11 pl-8 pr-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground">Rental Properties income</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
                  <input
                    type="number" value={rentalIncome}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRentalIncome(val === "" ? "" : Math.max(0, Number(val)));
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full h-11 pl-8 pr-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground">Other supplementary income</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
                  <input
                    type="number" value={otherIncome}
                    onChange={(e) => {
                      const val = e.target.value;
                      setOtherIncome(val === "" ? "" : Math.max(0, Number(val)));
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full h-11 pl-8 pr-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ADVANCED PLANNING SCENARIOS */}
          <div className="bg-card/20 border border-border/70 rounded-2xl p-5 sm:p-6 shadow-card">
            <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2 select-none border-b border-border/20 pb-3">
              <Sliders className="h-4.5 w-4.5 text-accent" />
              Advanced Strategic Scenarios
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground">Estimated Federal Tax Payout (%)</label>
                <input
                  type="number" value={federalTax}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFederalTax(val === "" ? "" : Math.max(0, Number(val)));
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-full h-11 px-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground">Estimated State Tax Payout (%)</label>
                <input
                  type="number" value={stateTax}
                  onChange={(e) => {
                    const val = e.target.value;
                    setStateTax(val === "" ? "" : Math.max(0, Number(val)));
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-full h-11 px-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground">Inflation Plan Scenario</label>
                <div className="flex gap-2">
                  {["conservative", "moderate", "aggressive"].map((scen) => (
                    <button
                      key={scen} onClick={() => setInflationScenario(scen as any)}
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
                <label className="text-xs font-bold text-muted-foreground">Market Performance Scenario</label>
                <div className="flex gap-2">
                  {["bear", "average", "bull"].map((perf) => (
                    <button
                      key={perf} onClick={() => setMarketPerformance(perf as any)}
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
            <Button
              variant="outline"
              className="flex-1 min-h-11"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY STYLED RESULTS PANEL (Revealed after calculation) */}
        {hasResult && retirementResults && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, height: "auto", scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mt-6 pt-6 border-t border-border space-y-6 overflow-hidden relative"
          >
            <div 
              className="absolute inset-0 pointer-events-none blur-3xl opacity-15 -z-10"
              style={{
                background: "radial-gradient(circle at 50% 50%, #0ea5e9, transparent 65%)"
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
                  const score = retirementResults.readinessScore;
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
                        <span className="text-xl sm:text-2xl font-extrabold text-foreground">{score}%</span>
                      </div>
                      <div>
                        <div className={`px-3 py-1 text-[11px] font-extrabold border rounded-lg uppercase tracking-wider tracking-tight ${colorClass}`}>
                          {statusText}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 max-w-[13rem]">
                          Simulated score based on your active contributions, retirement payouts, and scenario constraints.
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* RETIREMENT CORE METRICS */}
                <div className="space-y-3.5 border-t border-border/20 pt-4.5">
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-xs font-bold text-muted-foreground">Retirement Corpus Needed</span>
                    <span className="text-sm font-extrabold text-foreground">{formatCurrency(retirementResults.safeCorpusNeeded)}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-xs font-bold text-muted-foreground">Projected Savings at Retirement</span>
                    <span className="text-sm font-extrabold text-foreground">{formatCurrency(retirementResults.projectedSavingsAtRetirement)}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-xs font-bold text-muted-foreground">Income Shortfall / Gap</span>
                    <span className="text-sm font-extrabold text-destructive">{formatCurrency(retirementResults.incomeGap)}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5 border-t border-border/20 pt-3">
                    <span className="text-xs font-bold text-muted-foreground">Monthly Retirement Income</span>
                    <span className="text-base font-extrabold text-accent">{formatCurrency(retirementResults.monthlyIncomeGenerated)}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-xs font-bold text-muted-foreground">Years Savings Will Last</span>
                    <span className="text-base font-extrabold text-accent">{retirementResults.yearsMoneyLasts} years</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RETIREMENT INCOME BREAKDOWN PIE CHART */}
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">Retirement Income Breakdown</h3>
              <div className="bg-card/25 border border-border/70 rounded-2xl p-5 shadow-card select-none">
                <div className="h-56 w-full flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={doughnutData}
                        cx="50%" cy="50%"
                        innerRadius={55} outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {doughnutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ background: "var(--color-card)", borderColor: "var(--color-border)", borderRadius: "8px" }} itemStyle={{ color: "var(--color-foreground)" }} labelStyle={{ color: "var(--color-foreground)" }} wrapperStyle={{ zIndex: 50 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text Indicator */}
                  <div className="absolute flex flex-col items-center justify-center pointer-events-none select-none z-0">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">Corpus</span>
                    <span className="text-base font-extrabold text-foreground">
                      {formatCurrency(retirementResults.projectedSavingsAtRetirement)}
                    </span>
                  </div>
                </div>
                
                {/* Legend grid */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-muted-foreground mt-3">
                  {doughnutData.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5 truncate">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RETIREMENT SAVINGS ACCUMULATION CHART */}
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">Visualization (Accumulation Phase)</h3>
              <div className="bg-card/25 border border-border/70 rounded-2xl p-5 shadow-card select-none">
                <div className="h-64 sm:h-76 w-full pr-4 text-xs font-semibold">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={retirementResults.growthData}>
                      <defs>
                        <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d97706" stopOpacity={0.65}/>
                          <stop offset="95%" stopColor="#d97706" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="colorContrib" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0f9e75" stopOpacity={0.65}/>
                          <stop offset="95%" stopColor="#0f9e75" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" strokeOpacity={0.3} />
                      <XAxis dataKey="age" height={50} label={{ value: "Age", position: "insideBottom", offset: 0, fill: "var(--color-muted-foreground)", fontSize: 11, fontWeight: 600 }} stroke="var(--color-muted-foreground)" />
                      <YAxis tickFormatter={(val) => `$${val/1000}k`} stroke="var(--color-muted-foreground)" />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ background: "var(--color-card)", borderColor: "var(--color-border)", borderRadius: "8px" }} labelStyle={{ color: "var(--color-foreground)" }} />
                      <Legend />
                      <Area type="monotone" dataKey="Growth" stroke="#d97706" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGrowth)" />
                      <Area type="monotone" dataKey="Contributions" stroke="#0f9e75" strokeWidth={2.5} fillOpacity={1} fill="url(#colorContrib)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* RETIREMENT DECUMULATION TIMELINE CHART */}
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">Visualization (Decumulation Phase)</h3>
              <div className="bg-card/25 border border-border/70 rounded-2xl p-5 shadow-card select-none">
                <div className="h-64 sm:h-76 w-full pr-4 text-xs font-semibold">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={retirementResults.decumulationChartData}>
                      <defs>
                        <linearGradient id="colorRemaining" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.65}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="colorWithdrawal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.65}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" strokeOpacity={0.3} />
                      <XAxis dataKey="age" height={50} label={{ value: "Age", position: "insideBottom", offset: 0, fill: "var(--color-muted-foreground)", fontSize: 11, fontWeight: 600 }} stroke="var(--color-muted-foreground)" />
                      <YAxis tickFormatter={(val) => `$${val/1000}k`} stroke="var(--color-muted-foreground)" />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ background: "var(--color-card)", borderColor: "var(--color-border)", borderRadius: "8px" }} labelStyle={{ color: "var(--color-foreground)" }} />
                      <Legend />
                      <Area type="monotone" dataKey="RemainingCorpus" name="Remaining Corpus" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRemaining)" />
                      <Area type="monotone" dataKey="Withdrawals" name="Annual Withdrawal" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWithdrawal)" />
                    </AreaChart>
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
                  Retirement Advisory & Insights
                </h3>
                <ul className="space-y-3">
                  {insights.map((insight, idx) => (
                    <li key={idx} className="flex gap-2.5 text-xs font-semibold leading-relaxed text-muted-foreground">
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
