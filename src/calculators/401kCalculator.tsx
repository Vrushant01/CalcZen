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
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";
import {
  Calendar, Percent, HelpCircle, DollarSign, ArrowUpRight,
  TrendingUp, Sparkles, Sliders, Info, ShieldCheck, ChevronRight
} from "lucide-react";

export function Four01kCalculator() {
  const calc = getCalculator("401k-calculator")!;
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
  // 401(K) CALCULATOR INPUT STATES
  // ----------------------------------------------------
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(50000); // 401k Balance
  const [salary, setSalary] = useState(80000);
  const [employeeContrPct, setEmployeeContrPct] = useState(6);
  const [employerMatchPct, setEmployerMatchPct] = useState(50);
  const [employerLimitPct, setEmployerLimitPct] = useState(6);
  const [salaryGrowthPct, setSalaryGrowthPct] = useState(3);
  const [expectedReturn, setExpectedReturn] = useState(8);
  const [inflationRate, setInflationRate] = useState(2.5);

  // ----------------------------------------------------
  // ADVANCED PLANNING & SCENARIOS STATES
  // ----------------------------------------------------
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
    currentAge, retirementAge, currentSavings, salary, employeeContrPct,
    employerMatchPct, employerLimitPct, salaryGrowthPct, resolvedExpectedReturn,
    inflationRate
  ]);

  // ----------------------------------------------------
  // CALCULATION LOGIC: 401(K)
  // ----------------------------------------------------
  const results401k = useMemo(() => {
    const yearsToRetire = Math.max(0, retirementAge - currentAge);
    let balance = currentSavings;
    let balanceNoMatch = currentSavings;
    let totalEmployeeContributions = 0;
    let totalEmployerContributions = 0;
    let currentSalary = salary;
    
    const growthData: any[] = [];

    for (let year = 1; year <= yearsToRetire; year++) {
      const annualSalary = currentSalary;
      const employeeAnnualContrib = annualSalary * (employeeContrPct / 100);
      
      // Employer match matching cents on employee percentage limit
      const matchLimitPercentage = Math.min(employeeContrPct, employerLimitPct);
      const employerAnnualContrib = annualSalary * (matchLimitPercentage / 100) * (employerMatchPct / 100);

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

      const totalContributions = currentSavings + totalEmployeeContributions + totalEmployerContributions;
      const totalGrowth = balance - totalContributions;

      growthData.push({
        age: currentAge + year,
        Contributions: Math.round(totalContributions),
        Growth: Math.round(totalGrowth),
        Balance: Math.round(balance)
      });

      // Grow salary annually
      currentSalary *= (1 + salaryGrowthPct / 100);
    }

    const inflationAdjusted = balance / Math.pow(1 + inflationRate / 100, yearsToRetire);
    const investmentGrowth = balance - (currentSavings + totalEmployeeContributions + totalEmployerContributions);

    // Readiness score dynamically mapped based on balance target (standard 8x salary benchmark at retirement)
    const targetBenchmark = salary * 8;
    const readinessScore = Math.min(100, Math.round((balance / Math.max(1, targetBenchmark)) * 100));

    return {
      totalRetirementBalance: balance,
      totalBalanceNoMatch: balanceNoMatch,
      employeeContributions: totalEmployeeContributions,
      employerContributions: totalEmployerContributions,
      investmentGrowth,
      inflationAdjustedValue: inflationAdjusted,
      readinessScore,
      growthData
    };
  }, [
    currentAge, retirementAge, currentSavings, salary, employeeContrPct,
    employerMatchPct, employerLimitPct, salaryGrowthPct, resolvedExpectedReturn, inflationRate
  ]);

  // ----------------------------------------------------
  // HUMAN ACTIONABLE FINANCIAL INSIGHTS
  // ----------------------------------------------------
  const insights = useMemo(() => {
    const list: string[] = [];
    if (!results401k) return list;

    const { totalRetirementBalance, employerContributions } = results401k;

    list.push(`🚀 Your 401(k) is projected to accumulate a total balance of ${formatCurrency(totalRetirementBalance)} by retirement.`);
    
    if (employerContributions > 0) {
      list.push(`🎁 Free Money Captured: You will secure ${formatCurrency(employerContributions)} in total employer matched contributions.`);
    }

    if (employeeContrPct < employerLimitPct) {
      list.push(`💡 Contribution Tip: You are contributing ${employeeContrPct}%, but your employer matches up to ${employerLimitPct}%. Raise your savings to ${employerLimitPct}% to capture all available matched capital.`);
    } else {
      list.push(`🌟 Outstanding: You are fully maximizing your employer's matched contributions.`);
    }

    const powerOfOne = totalRetirementBalance * 0.15; // 1% extra approximation
    list.push(`📈 Compound Acceleration: Raising your employee contribution by just 1% could compound an extra ${formatCurrency(powerOfOne)} at retirement.`);

    return list;
  }, [results401k, employeeContrPct, employerLimitPct]);

  // ----------------------------------------------------
  // DYNAMIC DOUGHNUT GRAPH DATA (Breakdown)
  // ----------------------------------------------------
  const doughnutData = useMemo(() => {
    if (!results401k) return [];
    const { employeeContributions, employerContributions, investmentGrowth } = results401k;
    return [
      { name: "Initial Balance", value: currentSavings, color: "#1a1a2e" },
      { name: "Employee Contributions", value: employeeContributions, color: "#0f9e75" },
      { name: "Employer Match", value: employerContributions, color: "#3b82f6" },
      { name: "Investment Growth", value: investmentGrowth, color: "#d97706" }
    ];
  }, [results401k, currentSavings]);

  // ----------------------------------------------------
  // EMPLOYER MATCH IMPACT BAR CHART DATA
  // ----------------------------------------------------
  const matchImpactData = useMemo(() => {
    if (!results401k) return [];
    return [
      {
        name: "Without Match",
        Balance: Math.round(results401k.totalBalanceNoMatch),
        color: "#d97706"
      },
      {
        name: "With Match",
        Balance: Math.round(results401k.totalRetirementBalance),
        color: "#0f9e75"
      }
    ];
  }, [results401k]);

  // ----------------------------------------------------
  // BRANDED PDF REPORT CREATION
  // ----------------------------------------------------
  const pdfData = useMemo(() => {
    if (!hasResult || !results401k) return null;
    const { totalRetirementBalance, employeeContributions, employerContributions, investmentGrowth, inflationAdjustedValue, readinessScore } = results401k;
    return {
      calculatorName: "401(k) Calculator",
      calculatorSlug: "401k-calculator",
      siteName: PDF_SITE_NAME,
      siteUrl: PDF_SITE_URL,
      inputs: [
        { label: "Current Age", value: `${currentAge} years` },
        { label: "Retirement Age", value: `${retirementAge} years` },
        { label: "Annual Salary", value: formatCurrency(salary) },
        { label: "Employee Contribution", value: `${employeeContrPct}%` },
        { label: "Employer Match Ratio", value: `${employerMatchPct}%` },
        { label: "Employer Match Limit", value: `${employerLimitPct}%` },
        { label: "Salary Growth Rate", value: `${salaryGrowthPct}%` },
        { label: "Expected Market Return", value: `${resolvedExpectedReturn}%` },
        { label: "Inflation Rate", value: `${inflationRate}%` }
      ],
      results: [
        { label: "Total Retirement 401(k) Balance", value: formatCurrency(totalRetirementBalance), highlight: true },
        { label: "Personal Employee Contributions", value: formatCurrency(employeeContributions) },
        { label: "Employer Matched Contributions", value: formatCurrency(employerContributions) },
        { label: "Interest Investment Growth", value: formatCurrency(investmentGrowth) },
        { label: "Inflation-Adjusted Value", value: formatCurrency(inflationAdjustedValue) },
        { label: "Retirement Readiness Score", value: `${readinessScore}/100` }
      ],
      summary: `401(k) Contribution Matching & Growth report compiled on CalcZen. With an employee savings rate of ${employeeContrPct}% and employer limit of ${employerLimitPct}%, your 401(k) account balance is projected to compound to a nominal value of ${formatCurrency(totalRetirementBalance)} (Inflation-Adjusted: ${formatCurrency(inflationAdjustedValue)}) by age ${retirementAge}.`,
      tableData: results401k.growthData.length > 0 ? {
        title: "ANNUAL 401(K) GROWTH TRANSITIONS",
        headers: ["Age", "Total Contributions", "Investment Growth", "Projected Balance"],
        rows: results401k.growthData.filter((_, i) => i % 5 === 0 || i === results401k.growthData.length - 1).map((item) => [
          String(item.age),
          formatCurrency(item.Contributions),
          formatCurrency(item.Growth),
          formatCurrency(item.Balance)
        ])
      } : null
    };
  }, [
    hasResult, currentAge, retirementAge, currentSavings, salary, employeeContrPct,
    employerMatchPct, employerLimitPct, salaryGrowthPct, resolvedExpectedReturn,
    inflationRate, results401k
  ]);

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Estimate your future 401(k) growth, analyze compound market returns, and maximize your employer's matched contributions easily with standard scenario testing."
      formula={`401(k) Balance = CompoundedSavings + Contributions
Employer Match = Salary × min(EmployeePct, LimitPct) × MatchPct
Inflation Adjusted Value = NominalBalance ÷ (1 + InflationRate)ⁿ`}
      example={`Annual salary $80,000 contributing 6% employee, 50% match up to 6% employer limit over 35 years at 8% return results in over $1.52M compounded.`}
      faqs={[
        { q: "What is an employer match limit in a 401(k)?", a: "It is the cap on the percentage of your salary that your employer will match. For example, if they match 50% up to 6%, they will match contributions up to 6% of your earnings, but won't match any savings made above that 6% threshold." },
        { q: "What is the difference between Traditional 401(k) and Roth 401(k)?", a: "Traditional 401(k) contributions are made with pre-tax dollars, lowering your taxable income now, but withdrawals are taxed. Roth 401(k) contributions are made with post-tax dollars, meaning withdrawals are 100% tax-free in retirement." },
        { q: "How is the 401(k) Readiness Score calculated?", a: "It is calculated by comparing your projected 401(k) balance at retirement against standard industry benchmarks (e.g. accumulating 8x your final annual salary)." }
      ]}
      blog={<CalculatorBlog content={blogContent["401k"]} />}
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
                401(k) Growth Parameters
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

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Current 401(k) Balance</label>
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
                  <label className="text-xs font-bold text-muted-foreground">Annual Salary</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
                    <input
                      type="number" value={salary}
                      onChange={(e) => setSalary(Math.max(0, Number(e.target.value)))}
                      className="w-full h-11 pl-8 pr-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Employee Contribution (%)</label>
                  <input
                    type="number" value={employeeContrPct}
                    onChange={(e) => setEmployeeContrPct(Math.max(0, Number(e.target.value)))}
                    className="w-full h-11 px-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Employer Match Ratio (%)</label>
                  <input
                    type="number" value={employerMatchPct}
                    onChange={(e) => setEmployerMatchPct(Math.max(0, Number(e.target.value)))}
                    className="w-full h-11 px-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Employer Match Limit (%)</label>
                  <input
                    type="number" value={employerLimitPct}
                    onChange={(e) => setEmployerLimitPct(Math.max(0, Number(e.target.value)))}
                    className="w-full h-11 px-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Annual Salary Growth (%)</label>
                  <input
                    type="number" value={salaryGrowthPct}
                    onChange={(e) => setSalaryGrowthPct(Math.max(0, Number(e.target.value)))}
                    className="w-full h-11 px-4 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground font-semibold focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Expected Investment Return (%)</label>
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

            {/* 401(K) GROWTH PROJECTION CHART */}
            <div className="bg-card/25 border border-border/70 rounded-2xl p-5 shadow-card select-none">
              <h3 className="text-base font-bold text-foreground mb-4.5 flex items-center gap-2 border-b border-border/20 pb-3">
                <TrendingUp className="h-4.5 w-4.5 text-accent" />
                401(k) Growth Projection
              </h3>
              <div className="h-64 sm:h-76 w-full pr-4 text-xs font-semibold">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results401k?.growthData}>
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

            {/* EMPLOYER MATCH IMPACT CHART */}
            <div className="bg-card/25 border border-border/70 rounded-2xl p-5 shadow-card select-none">
              <h3 className="text-base font-bold text-foreground mb-4.5 flex items-center gap-2 border-b border-border/20 pb-3">
                <ArrowUpRight className="h-4.5 w-4.5 text-accent" />
                Employer Match Impact at Retirement
              </h3>
              <div className="h-64 sm:h-72 w-full pr-4 text-xs font-semibold">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={matchImpactData} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" strokeOpacity={0.3} />
                    <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                    <YAxis tickFormatter={(val) => `$${val/1000}k`} stroke="var(--color-muted-foreground)" />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ background: "var(--color-card)", borderColor: "var(--color-border)", borderRadius: "8px" }} itemStyle={{ color: "var(--color-foreground)" }} labelStyle={{ color: "var(--color-foreground)" }} />
                    <Bar dataKey="Balance" radius={[6, 6, 0, 0]}>
                      {matchImpactData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
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
                const score = results401k?.readinessScore || 0;
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
                        Simulated score based on your active contributions, matched caps, and scenario constraints.
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* 401(K) CORE METRICS */}
              {results401k && (
                <div className="space-y-3.5 border-t border-border/20 pt-4.5">
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-xs font-bold text-muted-foreground">Total Personal Contribution</span>
                    <span className="text-sm font-extrabold text-foreground">{formatCurrency(results401k.employeeContributions)}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-xs font-bold text-muted-foreground">Employer Match Contribution</span>
                    <span className="text-sm font-extrabold text-foreground">{formatCurrency(results401k.employerContributions)}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-xs font-bold text-muted-foreground">Investment Compound Growth</span>
                    <span className="text-sm font-extrabold text-foreground">{formatCurrency(results401k.investmentGrowth)}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5 border-t border-border/20 pt-3">
                    <span className="text-xs font-bold text-muted-foreground">Projected 401(k) Balance</span>
                    <span className="text-lg font-black text-accent">{formatCurrency(results401k.totalRetirementBalance)}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-xs font-bold text-muted-foreground">Inflation Adjusted Value</span>
                    <span className="text-sm font-extrabold text-accent/90">{formatCurrency(results401k.inflationAdjustedValue)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* CONTRIBUTION VS GROWTH BREAKDOWN PIE CHART */}
            <div className="bg-card/25 border border-border/70 rounded-2xl p-5 shadow-card select-none">
              <h3 className="text-base font-bold text-foreground mb-4.5 flex items-center gap-2 border-b border-border/20 pb-3">
                <Info className="h-4.5 w-4.5 text-accent" />
                Contribution vs Growth Breakdown
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
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">Balance</span>
                  <span className="text-base font-extrabold text-foreground">
                    {formatCurrency(results401k?.totalRetirementBalance || 0)}
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
                401(k) Growth Advisory & Insights
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
