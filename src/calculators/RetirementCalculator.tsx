import { useEffect, useState, useMemo } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog from "@/components/CalculatorBlog";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { blogContent } from "@/data/blogContent";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { PDF_SITE_NAME, PDF_SITE_URL } from "@/constants/pdfBrand";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import {
  Calendar, Percent, HelpCircle, DollarSign, ArrowUpRight,
  TrendingUp, Sparkles, Sliders, Info, ShieldCheck, ChevronRight
} from "lucide-react";

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
  // RETIREMENT CALCULATOR INPUT STATES
  // ----------------------------------------------------
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [inflationRate, setInflationRate] = useState(2.5);
  const [desiredIncome, setDesiredIncome] = useState(60000);

  // Additional Incomes
  const [pension, setPension] = useState(0);
  const [socialSecurity, setSocialSecurity] = useState(20000);
  const [rentalIncome, setRentalIncome] = useState(0);
  const [otherIncome, setOtherIncome] = useState(0);

  // ----------------------------------------------------
  // ADVANCED PLANNING & SCENARIOS STATES
  // ----------------------------------------------------
  const [federalTax, setFederalTax] = useState(12);
  const [stateTax, setStateTax] = useState(5);
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

  // Adjust returns based on market performance
  const resolvedExpectedReturn = useMemo(() => {
    if (marketPerformance === "bear") return Math.max(0, expectedReturn - 3);
    if (marketPerformance === "bull") return expectedReturn + 3;
    return expectedReturn;
  }, [marketPerformance, expectedReturn]);

  // Mark calculated on changes
  useEffect(() => {
    markCalculated();
  }, [
    currentAge, retirementAge, lifeExpectancy, currentSavings, monthlyContribution,
    resolvedExpectedReturn, inflationRate, desiredIncome, pension, socialSecurity,
    rentalIncome, otherIncome, federalTax, stateTax
  ]);

  // ----------------------------------------------------
  // CALCULATION LOGIC: RETIREMENT
  // ----------------------------------------------------
  const retirementResults = useMemo(() => {
    const yearsToRetire = Math.max(0, retirementAge - currentAge);
    const yearsInRetirement = Math.max(0, lifeExpectancy - retirementAge);
    
    let savings = currentSavings;
    let totalPersonalContributions = 0;
    const growthData: any[] = [];

    // 1. Accumulation Phase loop (yearly projection)
    for (let year = 1; year <= yearsToRetire; year++) {
      const startBalance = savings;
      const annualContrib = monthlyContribution * 12;
      
      // Monthly compound interest
      const monthlyRate = resolvedExpectedReturn / 100 / 12;
      let compoundedSavings = startBalance;

      for (let month = 1; month <= 12; month++) {
        compoundedSavings = compoundedSavings * (1 + monthlyRate) + (monthlyContribution);
      }
      
      savings = compoundedSavings;
      totalPersonalContributions += annualContrib;
      const totalGrowth = savings - (currentSavings + totalPersonalContributions);

      growthData.push({
        age: currentAge + year,
        Contributions: Math.round(currentSavings + totalPersonalContributions),
        Growth: Math.round(totalGrowth),
        Balance: Math.round(savings)
      });
    }

    const projectedSavingsAtRetirement = savings;

    // 2. Decumulation Phase loop (Income Gap & Years Money Lasts)
    let decumBalance = savings;
    const totalAdditionalIncome = pension + socialSecurity + rentalIncome + otherIncome;
    const taxRate = (federalTax + stateTax) / 100;
    
    // Desired withdrawals adjusted for tax rate
    const grossIncomeNeeded = desiredIncome / (1 - taxRate);
    const netWithdrawalGap = Math.max(0, grossIncomeNeeded - totalAdditionalIncome);
    
    let yearsMoneyLasts = 0;
    const decumulationChartData: any[] = [];

    for (let year = 1; year <= 60; year++) {
      const inflationFactor = Math.pow(1 + inflationRate / 100, year);
      const realWithdrawal = netWithdrawalGap * inflationFactor;

      if (decumBalance >= realWithdrawal) {
        decumBalance = (decumBalance - realWithdrawal) * (1 + resolvedExpectedReturn / 100);
        yearsMoneyLasts++;
        decumulationChartData.push({
          age: retirementAge + year,
          Withdrawals: Math.round(realWithdrawal),
          RemainingCorpus: Math.round(decumBalance)
        });
      } else {
        if (decumBalance > 0) {
          decumulationChartData.push({
            age: retirementAge + year,
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
      const inflationFactor = Math.pow(1 + inflationRate / 100, year);
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
      totalGrowthEarned: projectedSavingsAtRetirement - (currentSavings + totalPersonalContributions)
    };
  }, [
    currentAge, retirementAge, lifeExpectancy, currentSavings,
    monthlyContribution, resolvedExpectedReturn, inflationRate, desiredIncome,
    pension, socialSecurity, rentalIncome, otherIncome, federalTax, stateTax
  ]);

  // ----------------------------------------------------
  // HUMAN ACTIONABLE FINANCIAL INSIGHTS
  // ----------------------------------------------------
  const insights = useMemo(() => {
    const list: string[] = [];
    if (!retirementResults) return list;

    const { safeCorpusNeeded, projectedSavingsAtRetirement, yearsMoneyLasts } = retirementResults;
    const gap = safeCorpusNeeded - projectedSavingsAtRetirement;
    const yearsInRetire = lifeExpectancy - retirementAge;

    if (gap <= 0) {
      list.push(`🎉 Fantastic! Your projected retirement savings exceed your secure corpus target by ${formatCurrency(Math.abs(gap))}.`);
    } else {
      list.push(`⚠️ Shortfall Alert: You have a savings gap of ${formatCurrency(gap)} to cover your desired retirement lifestyle.`);
      const extraMonthly = gap / (Math.max(1, retirementAge - currentAge) * 12 * 1.5); // Simplified compound factor
      list.push(`💡 Boosting your monthly contributions by just ${formatCurrency(extraMonthly)} could fully close your retirement savings gap.`);
    }

    if (yearsMoneyLasts >= yearsInRetire) {
      list.push(`🛡️ Safety Margin: Your corpus is projected to outlast your life expectancy by ${yearsMoneyLasts - yearsInRetire} years.`);
    } else {
      list.push(`⚠️ Depletion warning: Your savings are projected to run out at age ${retirementAge + yearsMoneyLasts}, leaving you ${yearsInRetire - yearsMoneyLasts} years short.`);
    }

    const purchasingPower = 100 / Math.pow(1 + inflationRate / 100, retirementAge - currentAge);
    list.push(`📈 Inflation Impact: Future inflation is projected to reduce the purchasing power of your money by ${Math.round(100 - purchasingPower)}% at retirement.`);

    return list;
  }, [retirementResults, currentAge, retirementAge, lifeExpectancy, inflationRate]);

  // ----------------------------------------------------
  // DYNAMIC DOUGHNUT GRAPH DATA (Breakdown)
  // ----------------------------------------------------
  const doughnutData = useMemo(() => {
    if (!retirementResults) return [];
    const { totalPersonalContributions, totalGrowthEarned } = retirementResults;
    return [
      { name: "Initial Savings", value: currentSavings, color: "#1a1a2e" },
      { name: "Personal Contributions", value: totalPersonalContributions, color: "#0f9e75" },
      { name: "Investment Growth", value: totalGrowthEarned, color: "#d97706" }
    ];
  }, [retirementResults, currentSavings]);

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
        { label: "Current Age", value: `${currentAge} years` },
        { label: "Retirement Age", value: `${retirementAge} years` },
        { label: "Life Expectancy", value: `${lifeExpectancy} years` },
        { label: "Current Savings", value: formatCurrency(currentSavings) },
        { label: "Monthly Contribution", value: formatCurrency(monthlyContribution) },
        { label: "Expected Annual Return", value: `${resolvedExpectedReturn}%` },
        { label: "Inflation Rate", value: `${inflationRate}%` },
        { label: "Desired Retirement Income", value: `${formatCurrency(desiredIncome)}/year` },
        { label: "Social Security Benefits", value: `${formatCurrency(socialSecurity)}/year` },
        { label: "Tax Settings (Fed + State)", value: `${federalTax + stateTax}%` }
      ],
      results: [
        { label: "Projected Savings at Retirement", value: formatCurrency(projectedSavingsAtRetirement) },
        { label: "Retirement Corpus Needed", value: formatCurrency(safeCorpusNeeded), highlight: true },
        { label: "Savings Shortfall / Income Gap", value: formatCurrency(incomeGap) },
        { label: "Retirement Readiness Score", value: `${readinessScore}/100` },
        { label: "Years Money Will Last", value: `${yearsMoneyLasts} years` }
      ],
      summary: `Retirement Wealth Planning report generated on CalcZen. Based on a target retirement age of ${retirementAge}, you are projected to accumulate ${formatCurrency(projectedSavingsAtRetirement)} against a desired corpus target of ${formatCurrency(safeCorpusNeeded)}. This leaves a financial coverage of ${yearsMoneyLasts} years during your retirement, resulting in a Readiness Score of ${readinessScore}%.`,
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
    hasResult, currentAge, retirementAge, lifeExpectancy, currentSavings,
    monthlyContribution, resolvedExpectedReturn, inflationRate, desiredIncome,
    socialSecurity, federalTax, stateTax, retirementResults
  ]);

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
      <div className="space-y-6">

        {/* MAIN SUITE DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: FINANCIAL INPUTS */}
          <div className="lg:col-span-7 space-y-6">
            
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
                      onChange={(e) => setCurrentSavings(Math.max(0, Number(e.target.value)))}
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
                      onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
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
                      onChange={(e) => setDesiredIncome(Math.max(0, Number(e.target.value)))}
                      className="w-full h-11 pl-8 pr-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Expected Annual Return (%)</label>
                  <input
                    type="number" step="0.1" value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Math.max(0, Number(e.target.value)))}
                    className="w-full h-11 px-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Inflation Rate (%)</label>
                  <input
                    type="number" step="0.1" value={inflationRate}
                    onChange={(e) => setInflationRate(Math.max(0, Number(e.target.value)))}
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
                      onChange={(e) => setSocialSecurity(Math.max(0, Number(e.target.value)))}
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
                      onChange={(e) => setPension(Math.max(0, Number(e.target.value)))}
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
                      onChange={(e) => setRentalIncome(Math.max(0, Number(e.target.value)))}
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
                      onChange={(e) => setOtherIncome(Math.max(0, Number(e.target.value)))}
                      className="w-full h-11 pl-8 pr-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RETIREMENT SAVINGS ACCUMULATION CHART */}
            <div className="bg-card/25 border border-border/70 rounded-2xl p-5 shadow-card select-none">
              <h3 className="text-base font-bold text-foreground mb-4.5 flex items-center gap-2 border-b border-border/20 pb-3">
                <TrendingUp className="h-4.5 w-4.5 text-accent" />
                Retirement Growth Chart (Accumulation Phase)
              </h3>
              <div className="h-64 sm:h-76 w-full pr-4 text-xs font-semibold">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={retirementResults?.growthData}>
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

            {/* RETIREMENT DECUMULATION TIMELINE CHART */}
            <div className="bg-card/25 border border-border/70 rounded-2xl p-5 shadow-card select-none">
              <h3 className="text-base font-bold text-foreground mb-4.5 flex items-center gap-2 border-b border-border/20 pb-3">
                <Calendar className="h-4.5 w-4.5 text-accent" />
                Retirement Timeline & Withdrawals (Decumulation Phase)
              </h3>
              <div className="h-64 sm:h-76 w-full pr-4 text-xs font-semibold">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={retirementResults?.decumulationChartData}>
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
                    onChange={(e) => setFederalTax(Math.max(0, Number(e.target.value)))}
                    className="w-full h-11 px-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Estimated State Tax Payout (%)</label>
                  <input
                    type="number" value={stateTax}
                    onChange={(e) => setStateTax(Math.max(0, Number(e.target.value)))}
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

          </div>

          {/* RIGHT COLUMN: STICKY STYLED RESULTS PANEL */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            {/* Visual Readiness Score Index & Core Payout Metric */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 sm:p-6 shadow-glow relative overflow-hidden">
              <div className="absolute right-0 top-0 h-16 w-16 bg-accent/5 rounded-bl-full flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-accent/25" />
              </div>
              
              <h3 className="text-xs font-extrabold tracking-widest text-muted-foreground uppercase mb-3.5 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-accent" />
                Retirement Readiness Score
              </h3>

              {(() => {
                const score = retirementResults?.readinessScore || 0;
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
              {retirementResults && (
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
              )}
            </div>

            {/* RETIREMENT INCOME BREAKDOWN PIE CHART */}
            <div className="bg-card/25 border border-border/70 rounded-2xl p-5 shadow-card select-none">
              <h3 className="text-base font-bold text-foreground mb-4.5 flex items-center gap-2 border-b border-border/20 pb-3">
                <Info className="h-4.5 w-4.5 text-accent" />
                Retirement Income Breakdown
              </h3>
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
                    {formatCurrency(retirementResults?.projectedSavingsAtRetirement || 0)}
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

            {/* DYNAMIC READABLE INSIGHTS METRICS */}
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

            {/* PDF Report Exporters */}
            <div className="bg-card/20 border border-border/70 rounded-2xl p-5 shadow-card">
              <CalculatorPdfExport hasResult={hasResult} pdfData={pdfData} />
            </div>

          </div>

        </div>

      </div>
    </CalculatorPageLayout>
  );
}
