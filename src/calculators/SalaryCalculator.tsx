import { OutdatedResultBanner } from "@/components/OutdatedResultBanner";
import { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";
import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog, { type BlogContent } from "@/components/CalculatorBlog";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalculateButton } from "@/components/CalculateButton";
import { PDF_SITE_NAME, PDF_SITE_URL } from "@/constants/pdfBrand";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { formatPdfUsd } from "@/utils/formatPdfUsd";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeroMetric,
  StatCard,
  DashboardSection,
  InsightCard,
} from "@/components/dashboard";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import {
  Briefcase,
  Building2,
  ChevronDown,
  ChevronUp,
  Coins,
  FileText,
  HelpCircle,
  Info,
  Layers,
  Percent,
  Receipt,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  calculateSalaryBreakdown,
  formatINR,
  INDIAN_STATES,
  type SalaryCalculatorInputs,
  type TaxRegime,
  type CityType,
} from "@/utils/salaryCalculatorUtils";

const blogContent: BlogContent = {
  primaryKeyword: "CTC to In-Hand Salary Calculator India",
  category: "salary-and-employment",
  introText:
    "Understanding the exact gap between your on-paper Cost to Company (CTC) and the actual net amount credited to your bank account every month is one of the most vital financial insights for any Indian salaried professional. CTC encompasses non-cash employer contributions like Employee Provident Fund (EPF), annual gratuity reserves, and variable performance bonuses. Our comprehensive CTC to In-Hand Salary Calculator for FY 2026–27 demystifies your salary breakup, accurately computes state-specific professional taxes, factors in revised New Tax Regime standard deductions and slabs, and compares the New versus Old tax regimes to maximize your monthly take-home pay.",
  sections: [
    {
      title: "What is CTC, Gross Salary, and In-Hand Salary?",
      paragraphs: [
        "In the Indian corporate ecosystem, salary offers are universally quoted in terms of Annual Cost to Company (CTC). However, CTC is not what an employee takes home. CTC represents the total financial cost incurred by an employer to maintain your employment for twelve months.",
        "Gross Salary is the total cash compensation paid directly to the employee prior to any personal tax or statutory payroll deductions. It comprises Basic Salary, House Rent Allowance (HRA), Special Allowance, and other fixed cash stipends.",
        "In-Hand (or Net Take-Home) Salary is the actual cash deposited into your bank account each month. It is derived by deducting Employee EPF (12% of basic), Professional Tax (state-mandated up to ₹2,500/yr), Employee State Insurance (ESI, if applicable), and estimated monthly Tax Deducted at Source (TDS) from your Gross Cash Salary.",
      ],
      callout: {
        type: "quickFact",
        title: "The Golden CTC Formula",
        text: "Annual CTC = Fixed Gross Salary + Employer EPF (12%) + Gratuity Provision (~4.81% of Basic) + Annual Variable Pay/Bonus + Other Employer Insurance Benefits.",
      },
    },
    {
      title: "Salary Structure Breakdown: Anatomy of an Indian Pay Slip",
      paragraphs: [
        "Most Indian employers structure compensation packages into distinct tax-efficient heads to comply with labour laws while optimizing personal tax liability:",
        "- **Basic Salary:** The foundational core of your compensation (typically 40% to 50% of Fixed Gross). Both EPF contributions and statutory gratuity are pegged directly to Basic Salary.",
        "- **House Rent Allowance (HRA):** Designed to offset housing rental expenses. Under the Old Tax Regime, eligible employees can claim partial or complete exemption under Section 10(13A).",
        "- **Special Allowance / Balance Allowance:** A fully taxable balancing component that absorbs the remainder of your fixed gross package.",
        "- **Employer Provident Fund (EPF):** Under the Employees' Provident Funds and Miscellaneous Provisions Act, 1952, employers contribute 12% of basic wages. When companies include this in CTC, it reduces your available monthly cash gross.",
        "- **Gratuity Provision:** Governed by the Payment of Gratuity Act, 1972, this amounts to 15 days of basic wages per completed year of service (approx. 4.81% of annual basic). Many employers deduct this provision in advance inside the CTC offer letter.",
      ],
    },
    {
      title: "Income Tax Slabs for FY 2026–27 (AY 2027–28)",
      paragraphs: [
        "For FY 2026–27, the New Tax Regime under Section 115BAC continues as the default taxation regime in India. Budgetary revisions have introduced significant taxpayer benefits:",
        "- **Standard Deduction:** Increased to **₹75,000** for salaried employees under the New Tax Regime (compared to ₹50,000 in the Old Tax Regime).",
        "- **Zero Tax up to ₹7.75 Lakhs:** With the enhanced standard deduction of ₹75,000 and the Section 87A rebate for taxable income up to ₹7,00,000, individuals earning an annual gross salary of up to ₹7,75,000 pay **₹0 income tax** under the New Tax Regime.",
        "- **Marginal Relief:** If taxable income marginally exceeds ₹7,00,000 (e.g., ₹7,10,000), statutory marginal relief caps total tax payable to the excess income earned over ₹7,00,000.",
        "- **Old Tax Regime:** Retains the traditional slab structure with ₹50,000 standard deduction, allowing deductions under Section 80C (up to ₹1.5L), Section 80D (health insurance), Section 24(b) (home loan interest up to ₹2L), and actual HRA exemption under Section 10(13A).",
      ],
      formulaBox: {
        title: "New Tax Regime Slabs (FY 2026-27)",
        formula:
          "Up to ₹3,00,000: Nil (0%)\n₹3,00,001 to ₹7,00,000: 5%\n₹7,00,001 to ₹10,00,000: 10%\n₹10,00,001 to ₹12,00,000: 15%\n₹12,00,001 to ₹15,00,000: 20%\nAbove ₹15,00,000: 30%",
        variables: [
          { name: "Standard Deduction", desc: "Flat ₹75,000 deducted directly from gross salary." },
          { name: "Sec 87A Rebate", desc: "Up to ₹25,000 rebate if taxable income is ₹7,00,000 or less." },
          { name: "Cess", desc: "4% Health and Education Cess applied on total tax + surcharge." },
        ],
      },
    },
    {
      title: "State-Wise Professional Tax Explained",
      paragraphs: [
        "Professional Tax (PT) is an indirect state tax deducted by employers from salaried individuals and remitted to state governments. Under Article 276(2) of the Constitution of India, the maximum professional tax any state can charge is capped at ₹2,500 per year.",
        "States like Delhi, Haryana, Uttar Pradesh, and Rajasthan charge ₹0 Professional Tax. In contrast, states like Maharashtra, Gujarat, Karnataka, Tamil Nadu, and Telangana charge tiered monthly slabs typically amounting to ₹2,400 to ₹2,500 annually. Under the Old Tax Regime, Professional Tax paid is 100% tax-deductible under Section 16(iii).",
      ],
    },
  ],
  faqs: [
    {
      q: "Why is my in-hand salary significantly lower than my annual CTC?",
      a: "CTC includes several non-cash and future benefits that are not paid out in your monthly paycheck. These include employer EPF contributions (12%), annual gratuity reserves (4.81% of basic), annual variable performance bonuses, group medical insurance premiums, and employee deductions like EPF, Professional Tax, and monthly income tax (TDS).",
    },
    {
      q: "Which tax regime is better: New or Old for FY 2026-27?",
      a: "For most employees earning up to ₹15–20 Lakhs without substantial tax deductions (like heavy home loan interest or high metro house rent), the New Tax Regime is more beneficial due to lower slab rates, higher standard deduction (₹75,000), and full tax rebate on gross salaries up to ₹7.75 Lakhs. If you claim over ₹3.75 to ₹4 Lakhs in combined exemptions (HRA, 80C, 80D, home loan interest), the Old Tax Regime may yield lower tax.",
    },
    {
      q: "Can I opt for the statutory PF ceiling of ₹1,800 per month?",
      a: "Yes. As per EPFO regulations, the mandatory statutory ceiling for Provident Fund contribution is 12% of ₹15,000 (which equals ₹1,800/month for both employee and employer). If your employer's policy permits, you can cap PF at ₹1,800/month rather than contributing 12% of your actual basic salary, thereby increasing your monthly cash in-hand pay.",
    },
    {
      q: "Is gratuity deducted every month from my take-home salary?",
      a: "No. Gratuity is an employer-paid benefit mandated by the Payment of Gratuity Act, 1972 after 5 years of continuous service. It is not deducted from your monthly paycheck; however, many companies include an annual gratuity reserve (approx. 4.81% of basic) in the CTC breakdown, which reduces the fixed gross cash offered.",
    },
    {
      q: "How does variable pay affect my monthly take-home salary?",
      a: "Variable pay and performance bonuses are rarely paid on a monthly basis. They are usually disbursed quarterly, half-yearly, or annually based on individual and company performance. Our calculator displays your regular monthly in-hand cash salary excluding irregular bonus, while also calculating your annualized total earnings.",
    },
    {
      q: "What is ESI and am I eligible for it?",
      a: "Employee State Insurance (ESI) provides social security and healthcare benefits to formal sector employees. Under current ESIC guidelines, ESI is only applicable if your monthly gross salary is ₹21,000 or less. The employee contributes 0.75% of gross wages and the employer contributes 3.25%. If your monthly gross exceeds ₹21,000, zero ESI is deducted.",
    },
    {
      q: "How is HRA exemption calculated under the Old Tax Regime?",
      a: "HRA exemption under Section 10(13A) is the lowest of three amounts: (1) Actual HRA received, (2) Rent paid minus 10% of basic salary, or (3) 50% of basic salary for metro cities (Delhi, Mumbai, Kolkata, Chennai) or 40% for non-metro cities.",
    },
    {
      q: "Are the calculations updated for FY 2026-27?",
      a: "Yes. CalcZen's CTC to In-Hand Salary Calculator is strictly updated with the latest statutory rates, the revised ₹75,000 standard deduction under the New Tax Regime, Section 87A rebate thresholds, marginal relief rules, and current state-wise professional tax regulations.",
    },
  ],
};

const QUICK_CTC_CHIPS = [
  { label: "₹5 Lakh", value: 500000 },
  { label: "₹8 Lakh", value: 800000 },
  { label: "₹12 Lakh", value: 1200000 },
  { label: "₹15 Lakh", value: 1500000 },
  { label: "₹20 Lakh", value: 2000000 },
  { label: "₹30 Lakh", value: 3000000 },
];

export function SalaryCalculator() {
  const calc = getCalculator("ctc-to-in-hand-salary-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  // Basic Details State
  const [ctcInput, setCtcInput] = useState<number | "">(1200000);
  const [financialYear, setFinancialYear] = useState<string>("FY 2026-27");
  const [state, setState] = useState<string>("Gujarat");
  const [regime, setRegime] = useState<TaxRegime>("new");

  // Salary Structure State
  const [structureType, setStructureType] = useState<"standard" | "custom">("standard");
  const [basicPct, setBasicPct] = useState<number>(50);
  const [hraPct, setHraPct] = useState<number>(40);
  const [cityType, setCityType] = useState<CityType>("non-metro");
  const [monthlyRent, setMonthlyRent] = useState<number | "">(0);
  const [variablePay, setVariablePay] = useState<number | "">(0);

  // Statutory & Benefits State
  const [includeEmployeePF, setIncludeEmployeePF] = useState<boolean>(true);
  const [includeEmployerPFInCTC, setIncludeEmployerPFInCTC] = useState<boolean>(true);
  const [pfCapped, setPfCapped] = useState<boolean>(true);
  const [vpfPct, setVpfPct] = useState<number>(0);
  const [includeGratuityInCTC, setIncludeGratuityInCTC] = useState<boolean>(true);
  const [gratuityOverride, setGratuityOverride] = useState<number | "">(0);
  const [employerNPSPct, setEmployerNPSPct] = useState<number>(0);
  const [otherEmployerBenefits, setOtherEmployerBenefits] = useState<number | "">(0);

  // Deductions State (Old Regime)
  const [sec80C, setSec80C] = useState<number | "">(0);
  const [sec80D, setSec80D] = useState<number | "">(0);
  const [sec80CCD1B, setSec80CCD1B] = useState<number | "">(0);
  const [homeLoanInt, setHomeLoanInt] = useState<number | "">(0);
  const [otherTaxDeductions, setOtherTaxDeductions] = useState<number | "">(0);

  // Additional payroll deductions
  const [monthlyInsurance, setMonthlyInsurance] = useState<number | "">(0);
  const [otherMonthlyDeductions, setOtherMonthlyDeductions] = useState<number | "">(0);

  // Collapsible Accordions State
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    structure: false,
    pfGratuity: false,
    deductions: false,
  });

  const toggleAccordion = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  // Calculation Execution State
  const [calcParams, setCalcParams] = useState<SalaryCalculatorInputs>({
    annualCTC: 1200000,
    financialYear: "FY 2026-27",
    state: "Gujarat",
    regime: "new",
    structureType: "standard",
    basicPercentage: 50,
    hraPercentage: 40,
    cityType: "non-metro",
    monthlyRentPaid: 0,
    annualVariablePay: 0,
    includeEmployeePF: true,
    includeEmployerPFInCTC: true,
    pfCappedAtStatutoryCeiling: true,
    vpfPercentage: 0,
    includeGratuityInCTC: true,
    gratuityOverride: 0,
    employerNPSPercentage: 0,
    otherEmployerBenefits: 0,
    section80C: 0,
    section80D: 0,
    section80CCD1B: 0,
    homeLoanInterest80EEA: 0,
    otherTaxDeductions: 0,
    monthlyEmployeeInsurance: 0,
    otherMonthlyDeductions: 0,
  });

  const result = useMemo(() => {
    return calculateSalaryBreakdown(calcParams);
  }, [calcParams]);

  const params: SalaryCalculatorInputs = {
    annualCTC: Number(ctcInput),
    financialYear,
    state,
    regime,
    structureType,
    basicPercentage: basicPct,
    hraPercentage: hraPct,
    cityType,
    monthlyRentPaid: Number(monthlyRent) || 0,
    annualVariablePay: Number(variablePay) || 0,
    includeEmployeePF,
    includeEmployerPFInCTC,
    pfCappedAtStatutoryCeiling: pfCapped,
    vpfPercentage: vpfPct,
    includeGratuityInCTC,
    gratuityOverride: Number(gratuityOverride) || 0,
    employerNPSPercentage: employerNPSPct,
    otherEmployerBenefits: Number(otherEmployerBenefits) || 0,
    section80C: Number(sec80C) || 0,
    section80D: Number(sec80D) || 0,
    section80CCD1B: Number(sec80CCD1B) || 0,
    homeLoanInterest80EEA: Number(homeLoanInt) || 0,
    otherTaxDeductions: Number(otherTaxDeductions) || 0,
    monthlyEmployeeInsurance: Number(monthlyInsurance) || 0,
    otherMonthlyDeductions: Number(otherMonthlyDeductions) || 0,
  };
  const isOutdated = hasResult && Boolean(calcParams && JSON.stringify(params) !== JSON.stringify(calcParams));
  const isButtonDisabled = !ctcInput || Number(ctcInput) <= 0;

  const handleCalculate = () => {
    if (isButtonDisabled) return;
    setCalcParams({
      annualCTC: Number(ctcInput),
      financialYear,
      state,
      regime,
      structureType,
      basicPercentage: basicPct,
      hraPercentage: hraPct,
      cityType,
      monthlyRentPaid: Number(monthlyRent) || 0,
      annualVariablePay: Number(variablePay) || 0,
      includeEmployeePF,
      includeEmployerPFInCTC,
      pfCappedAtStatutoryCeiling: pfCapped,
      vpfPercentage: vpfPct,
      includeGratuityInCTC,
      gratuityOverride: Number(gratuityOverride) || 0,
      employerNPSPercentage: employerNPSPct,
      otherEmployerBenefits: Number(otherEmployerBenefits) || 0,
      section80C: Number(sec80C) || 0,
      section80D: Number(sec80D) || 0,
      section80CCD1B: Number(sec80CCD1B) || 0,
      homeLoanInterest80EEA: Number(homeLoanInt) || 0,
      otherTaxDeductions: Number(otherTaxDeductions) || 0,
      monthlyEmployeeInsurance: Number(monthlyInsurance) || 0,
      otherMonthlyDeductions: Number(otherMonthlyDeductions) || 0,
    });
    markCalculated();
  };

  const handleReset = () => {
    setCtcInput(1200000);
    setFinancialYear("FY 2026-27");
    setState("Gujarat");
    setRegime("new");
    setStructureType("standard");
    setBasicPct(50);
    setHraPct(40);
    setCityType("non-metro");
    setMonthlyRent(0);
    setVariablePay(0);
    setIncludeEmployeePF(true);
    setIncludeEmployerPFInCTC(true);
    setPfCapped(true);
    setVpfPct(0);
    setIncludeGratuityInCTC(true);
    setGratuityOverride(0);
    setEmployerNPSPct(0);
    setOtherEmployerBenefits(0);
    setSec80C(0);
    setSec80D(0);
    setSec80CCD1B(0);
    setHomeLoanInt(0);
    setOtherTaxDeductions(0);
    setMonthlyInsurance(0);
    setOtherMonthlyDeductions(0);
    resetCalculated();
  };

  // Visual Distribution Chart Data
  const chartData = [
    { name: "Take-Home Pay", value: result.annualInHand, color: "#10b981" },
    { name: "Income Tax (TDS)", value: result.taxBreakdown.totalAnnualTax, color: "#ef4444" },
    {
      name: "Employee Deductions (PF/PT/ESI)",
      value: result.totalAnnualEmployeeStatutoryDeductions,
      color: "#f59e0b",
    },
    {
      name: "Employer Contributions (PF/Gratuity)",
      value: result.totalAnnualEmployerContributions,
      color: "#3b82f6",
    },
  ].filter((d) => d.value > 0);

  const tooltipStyle = {
    contentStyle: {
      background: "var(--color-card)",
      borderColor: "var(--color-border)",
      borderRadius: "12px",
      fontSize: 12,
      fontWeight: 500,
    },
    labelStyle: { color: "var(--color-foreground)" },
    itemStyle: { color: "var(--color-foreground)" },
  };

  const pdfData = hasResult
    ? {
        calculatorName: "CTC to In-Hand Salary Calculator",
        calculatorSlug: "ctc-to-in-hand-salary-calculator",
        siteName: PDF_SITE_NAME,
        siteUrl: PDF_SITE_URL,
        inputs: [
          { label: "Annual CTC", value: formatINR(result.annualCTC) },
          { label: "Financial Year", value: calcParams.financialYear },
          { label: "State", value: calcParams.state },
          { label: "Tax Regime", value: calcParams.regime === "new" ? "New Regime (Sec 115BAC)" : "Old Regime" },
          { label: "Annual Fixed Gross", value: formatINR(result.annualFixedGross) },
        ],
        results: [
          { label: "Estimated Monthly In-Hand", value: formatINR(result.monthlyInHand), highlight: true },
          { label: "Annual In-Hand Salary", value: formatINR(result.annualInHand), highlight: true },
          { label: "Monthly Fixed Gross", value: formatINR(result.monthlyFixedGross) },
          { label: "Monthly Employee PF", value: formatINR(result.monthlyEmployeePF) },
          { label: "Monthly Professional Tax", value: formatINR(result.monthlyProfessionalTax) },
          { label: "Estimated Monthly TDS", value: formatINR(result.taxBreakdown.monthlyTDS) },
          { label: "Total Annual Income Tax", value: formatINR(result.taxBreakdown.totalAnnualTax) },
        ],
        summary: `For an Annual CTC of ${formatINR(result.annualCTC)} in ${calcParams.state} under the ${calcParams.regime === "new" ? "New" : "Old"} Tax Regime, your estimated monthly in-hand take-home salary is ${formatINR(result.monthlyInHand)} (approx. ${formatINR(result.annualInHand)} annually). Total annual income tax is estimated at ${formatINR(result.taxBreakdown.totalAnnualTax)}.`,
      }
    : null;

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Calculate your realistic monthly and annual take-home salary from your CTC in India for FY 2026-27. Compare New and Old tax regimes with transparent breakdowns of Basic, HRA, Provident Fund (EPF), Gratuity, ESI, Professional Tax, and Income Tax."
      formula={`Annual CTC = Fixed Gross Salary + Employer PF + Gratuity + Employer ESI + Variable Pay\nMonthly In-Hand = Monthly Fixed Gross - Employee PF - Professional Tax - ESI - Monthly TDS`}
      example={`For ₹12,00,000 CTC in Gujarat:\nFixed Gross ≈ ₹11,50,738 (₹95,895/mo)\nEmployee PF = ₹1,800/mo (statutory cap)\nProfessional Tax = ₹200/mo\nNew Regime TDS = ₹5,318/mo (₹63,815/yr after ₹75k standard deduction)\nMonthly In-Hand ≈ ₹88,577/month`}
      faqs={blogContent.faqs!}
      blog={<CalculatorBlog content={blogContent} />}
    >
      <div className="flex flex-col gap-6">
        {/* Input Column */}
        <div className="calc-input-column bg-card border border-border/70 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
            <Coins className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              Salary & Tax Configuration (India FY 2026–27)
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {/* Annual CTC Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="annual-ctc" className="text-sm font-semibold text-foreground">
                  Annual Cost to Company (CTC)
                </Label>
                <span className="text-xs text-muted-foreground font-mono">
                  {ctcInput ? formatINR(Number(ctcInput)) : "₹0"}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                  ₹
                </span>
                <Input
                  id="annual-ctc"
                  type="number"
                  min="0"
                  step="10000"
                  value={ctcInput}
                  onChange={(e) => setCtcInput(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 12,00,000"
                  className="pl-8 h-12 text-base font-medium rounded-xl border-border/70 focus:border-emerald-500"
                />
              </div>

              {/* Quick Select CTC Chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {QUICK_CTC_CHIPS.map((chip) => (
                  <button
                    key={chip.value}
                    type="button"
                    onClick={() => setCtcInput(chip.value)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg border border-border/60 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Financial Year & State Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Financial Year
                </Label>
                <select
                  value={financialYear}
                  onChange={(e) => setFinancialYear(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-border/70 bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="FY 2026-27">FY 2026–27 (AY 2027–28)</option>
                  <option value="FY 2025-26">FY 2025–26 (AY 2026–27)</option>
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  State (for Professional Tax)
                </Label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-border/70 bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tax Regime Selector */}
            <div>
              <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                Income Tax Regime
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegime("new")}
                  className={`h-11 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    regime === "new"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "border-border/70 bg-background hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>New Tax Regime (Default)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRegime("old")}
                  className={`h-11 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    regime === "old"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "border-border/70 bg-background hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Old Tax Regime (Exemptions)</span>
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                {regime === "new"
                  ? "Standard deduction of ₹75,000. Zero tax on gross salary up to ₹7,75,000 under Section 87A."
                  : "Allows deductions for HRA, Section 80C (up to ₹1.5L), Section 80D, and Home Loan Interest."}
              </p>
            </div>

            {/* Collapsible Section 1: Salary Structure Customization */}
            <div className="border border-border/60 rounded-xl overflow-hidden mt-1">
              <button
                type="button"
                onClick={() => toggleAccordion("structure")}
                className="w-full px-4 py-3 bg-muted/30 hover:bg-muted/50 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs sm:text-sm font-semibold text-foreground">
                    Salary Structure & Allowances
                  </span>
                </div>
                {openSections.structure ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {openSections.structure && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 border-t border-border/60 flex flex-col gap-3.5 bg-background"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                          Basic Salary (% of Fixed Gross)
                        </Label>
                        <div className="relative">
                          <Input
                            type="number"
                            min="20"
                            max="70"
                            value={basicPct}
                            onChange={(e) => setBasicPct(Number(e.target.value))}
                            className="h-10 text-sm"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                            %
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          Standard industry benchmark is 50%.
                        </span>
                      </div>

                      <div>
                        <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                          HRA (% of Basic Salary)
                        </Label>
                        <div className="relative">
                          <Input
                            type="number"
                            min="0"
                            max="50"
                            value={hraPct}
                            onChange={(e) => setHraPct(Number(e.target.value))}
                            className="h-10 text-sm"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                            %
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          Usually 40% (non-metro) or 50% (metro).
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                          Annual Variable Pay / Bonus (₹)
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          step="5000"
                          value={variablePay}
                          onChange={(e) =>
                            setVariablePay(e.target.value === "" ? "" : Number(e.target.value))
                          }
                          placeholder="e.g. 50,000"
                          className="h-10 text-sm"
                        />
                        <span className="text-[10px] text-muted-foreground">
                          Paid annually/quarterly, excluded from regular monthly in-hand cash.
                        </span>
                      </div>

                      <div>
                        <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                          Other Annual Employer Benefits (₹)
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          value={otherEmployerBenefits}
                          onChange={(e) =>
                            setOtherEmployerBenefits(
                              e.target.value === "" ? "" : Number(e.target.value),
                            )
                          }
                          placeholder="e.g. Group Insurance, Gym"
                          className="h-10 text-sm"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Collapsible Section 2: Provident Fund & Gratuity Rules */}
            <div className="border border-border/60 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleAccordion("pfGratuity")}
                className="w-full px-4 py-3 bg-muted/30 hover:bg-muted/50 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs sm:text-sm font-semibold text-foreground">
                    EPF & Gratuity Settings
                  </span>
                </div>
                {openSections.pfGratuity ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {openSections.pfGratuity && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 border-t border-border/60 flex flex-col gap-3 bg-background"
                  >
                    <div className="flex items-center justify-between py-1">
                      <div>
                        <span className="text-xs sm:text-sm font-medium text-foreground block">
                          Restrict PF to Statutory Ceiling (₹1,800/mo)
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          Caps 12% contribution on ₹15,000 monthly basic ceiling.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={pfCapped}
                        onChange={(e) => setPfCapped(e.target.checked)}
                        className="w-4 h-4 accent-emerald-600 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between py-1 border-t border-border/40">
                      <div>
                        <span className="text-xs sm:text-sm font-medium text-foreground block">
                          Include Gratuity in CTC (15/26 Formula)
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          Provision of ~4.81% of basic salary factored inside CTC envelope.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={includeGratuityInCTC}
                        onChange={(e) => setIncludeGratuityInCTC(e.target.checked)}
                        className="w-4 h-4 accent-emerald-600 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between py-1 border-t border-border/40">
                      <div>
                        <span className="text-xs sm:text-sm font-medium text-foreground block">
                          Voluntary Provident Fund (VPF %)
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          Additional employee deduction above statutory 12%.
                        </span>
                      </div>
                      <Input
                        type="number"
                        min="0"
                        max="88"
                        value={vpfPct}
                        onChange={(e) => setVpfPct(Number(e.target.value))}
                        className="w-20 h-8 text-xs text-right"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Collapsible Section 3: Tax Deductions for Old Regime */}
            {regime === "old" && (
              <div className="border border-border/60 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion("deductions")}
                  className="w-full px-4 py-3 bg-muted/30 hover:bg-muted/50 flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs sm:text-sm font-semibold text-foreground">
                      Old Tax Regime Deductions (HRA, 80C, 80D)
                    </span>
                  </div>
                  {openSections.deductions ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                <AnimatePresence>
                  {openSections.deductions && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 border-t border-border/60 flex flex-col gap-3 bg-background"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                            Monthly Rent Paid (₹) for HRA
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            value={monthlyRent}
                            onChange={(e) =>
                              setMonthlyRent(e.target.value === "" ? "" : Number(e.target.value))
                            }
                            placeholder="e.g. 20,000"
                            className="h-9 text-xs"
                          />
                        </div>

                        <div>
                          <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                            City Type (for HRA Exemption)
                          </Label>
                          <select
                            value={cityType}
                            onChange={(e) => setCityType(e.target.value as CityType)}
                            className="w-full h-9 px-2.5 rounded-lg border border-border/70 bg-background text-xs"
                          >
                            <option value="non-metro">Non-Metro (40% of Basic)</option>
                            <option value="metro">Metro: Delhi, Mumbai, Kolkata, Chennai (50%)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                            Section 80C (PPF, ELSS, LIC)
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            max="150000"
                            value={sec80C}
                            onChange={(e) =>
                              setSec80C(e.target.value === "" ? "" : Number(e.target.value))
                            }
                            placeholder="Max ₹1,50,000 (EPF auto-included)"
                            className="h-9 text-xs"
                          />
                        </div>

                        <div>
                          <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                            Section 80D (Health Insurance)
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            max="100000"
                            value={sec80D}
                            onChange={(e) =>
                              setSec80D(e.target.value === "" ? "" : Number(e.target.value))
                            }
                            placeholder="e.g. 25,000"
                            className="h-9 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                            Section 80CCD(1B) (NPS Self)
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            max="50000"
                            value={sec80CCD1B}
                            onChange={(e) =>
                              setSec80CCD1B(e.target.value === "" ? "" : Number(e.target.value))
                            }
                            placeholder="Max ₹50,000"
                            className="h-9 text-xs"
                          />
                        </div>

                        <div>
                          <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                            Home Loan Interest Sec 24(b)
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            max="200000"
                            value={homeLoanInt}
                            onChange={(e) =>
                              setHomeLoanInt(e.target.value === "" ? "" : Number(e.target.value))
                            }
                            placeholder="Max ₹2,00,000"
                            className="h-9 text-xs"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-row gap-3 mt-2">
              <CalculateButton
                category="salary-and-employment"
                className="flex-1 min-h-12 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md cursor-pointer"
                disabled={isButtonDisabled}
                onClick={handleCalculate}
              >
                <span>Calculate Take-Home Pay</span>
              </CalculateButton>
              <Button
                variant="outline"
                className="min-h-12 px-5 text-sm font-semibold rounded-xl cursor-pointer"
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Results Presentation Section */}
        {hasResult ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            {isOutdated && (
              <OutdatedResultBanner onCalculate={handleCalculate} />
            )}
            {/* Prominent HeroMetric: Estimated Monthly In-Hand Salary */}
            <HeroMetric
              label="Estimated Monthly In-Hand Salary"
              value={formatINR(result.monthlyInHand)}
              sub={`Annual Take-Home: ${formatINR(result.annualInHand)} • Fixed Gross: ${formatINR(result.monthlyFixedGross)}/mo`}
              glow="#10b981"
            />

            {/* Quick Metrics Grid */}
            <DashboardSection title="Salary Overview">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard
                  index={0}
                  label="Annual In-Hand"
                  value={formatINR(result.annualInHand)}
                  accent="green"
                  badge="Net Cash"
                />
                <StatCard
                  index={1}
                  label="Monthly Gross"
                  value={formatINR(result.monthlyFixedGross)}
                  accent="blue"
                />
                <StatCard
                  index={2}
                  label="Monthly Deductions"
                  value={formatINR(result.totalMonthlyEmployeeStatutoryDeductions)}
                  accent="amber"
                  badge="PF + PT + ESI"
                />
                <StatCard
                  index={3}
                  label="Monthly TDS"
                  value={formatINR(result.taxBreakdown.monthlyTDS)}
                  accent="purple"
                  badge={`${result.taxBreakdown.effectiveTaxRate}% Tax`}
                />
              </div>
            </DashboardSection>

            {/* Side-by-Side Regime Comparison */}
            <DashboardSection title="Tax Regime Comparison (FY 2026–27)">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* New Regime Card */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    result.recommendedRegime === "new"
                      ? "border-emerald-500/80 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs"
                      : "border-border/60 bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      New Tax Regime
                    </span>
                    {result.recommendedRegime === "new" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-black text-foreground mb-1">
                    {formatINR(result.newRegimeComparison.totalAnnualTax)}
                    <span className="text-xs font-normal text-muted-foreground ml-1.5">/year</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Standard deduction: ₹75,000. Monthly TDS:{" "}
                    <strong>{formatINR(result.newRegimeComparison.monthlyTDS)}</strong>.
                  </p>
                </div>

                {/* Old Regime Card */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    result.recommendedRegime === "old"
                      ? "border-emerald-500/80 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs"
                      : "border-border/60 bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-violet-600" />
                      Old Tax Regime
                    </span>
                    {result.recommendedRegime === "old" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-black text-foreground mb-1">
                    {formatINR(result.oldRegimeComparison.totalAnnualTax)}
                    <span className="text-xs font-normal text-muted-foreground ml-1.5">/year</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Standard deduction: ₹50,000. Monthly TDS:{" "}
                    <strong>{formatINR(result.oldRegimeComparison.monthlyTDS)}</strong>.
                  </p>
                </div>
              </div>

              {/* Recommendation insight banner */}
              <div className="mt-3 p-3 rounded-xl bg-muted/50 border border-border/50 text-xs text-muted-foreground flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {result.taxDifferenceAnnual > 0
                    ? `The New Tax Regime saves you approximately ${formatINR(Math.abs(result.taxDifferenceAnnual))} per year (${formatINR(Math.abs(result.inHandDifferenceMonthly))}/month more take-home pay).`
                    : result.taxDifferenceAnnual < 0
                      ? `The Old Tax Regime saves you approximately ${formatINR(Math.abs(result.taxDifferenceAnnual))} per year with your entered deductions.`
                      : "Both tax regimes yield identical tax liability for your current income level."}
                </span>
              </div>
            </DashboardSection>

            {/* Visual Distribution Chart */}
            <DashboardSection title="Compensation Distribution Chart">
              <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  CTC Breakdown by Category
                </div>
                <div className="h-64 sm:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={3}
                      >
                        {chartData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: any) => [formatINR(Number(v) || 0), ""]} {...tooltipStyle} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </DashboardSection>

            {/* Detailed Itemized Salary Breakdown Table */}
            <DashboardSection title="Detailed Salary Slip & CTC Reconciliation">
              <div className="overflow-x-auto rounded-xl border border-border/60 bg-card shadow-sm">
                <table className="w-full text-xs sm:text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground text-[11px] uppercase tracking-wider border-b border-border/60">
                    <tr>
                      <th className="px-4 py-3 font-bold">Component</th>
                      <th className="px-4 py-3 font-bold text-right">Monthly (₹)</th>
                      <th className="px-4 py-3 font-bold text-right">Annual (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-medium">
                    {/* Part A: Fixed Gross Earnings */}
                    <tr className="bg-muted/20">
                      <td colSpan={3} className="px-4 py-2 font-bold text-foreground">
                        A. Fixed Cash Earnings (Gross Pay)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-muted-foreground">Basic Salary (50%)</td>
                      <td className="px-4 py-2.5 text-right font-mono">{formatINR(result.monthlyBasic)}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{formatINR(result.annualBasic)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-muted-foreground">House Rent Allowance (HRA)</td>
                      <td className="px-4 py-2.5 text-right font-mono">{formatINR(result.monthlyHRA)}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{formatINR(result.annualHRA)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-muted-foreground">Special Allowance</td>
                      <td className="px-4 py-2.5 text-right font-mono">{formatINR(result.monthlySpecialAllowance)}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{formatINR(result.annualSpecialAllowance)}</td>
                    </tr>
                    <tr className="bg-emerald-500/10 font-bold text-foreground">
                      <td className="px-4 py-2.5">Total Fixed Gross Salary</td>
                      <td className="px-4 py-2.5 text-right font-mono">{formatINR(result.monthlyFixedGross)}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{formatINR(result.annualFixedGross)}</td>
                    </tr>

                    {/* Part B: Employee Deductions */}
                    <tr className="bg-muted/20">
                      <td colSpan={3} className="px-4 py-2 font-bold text-foreground">
                        B. Employee Deductions (from Gross)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-muted-foreground">Employee EPF (12%)</td>
                      <td className="px-4 py-2.5 text-right font-mono text-amber-600 dark:text-amber-400">
                        -{formatINR(result.monthlyEmployeePF)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-amber-600 dark:text-amber-400">
                        -{formatINR(result.annualEmployeePF)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-muted-foreground">Professional Tax ({calcParams.state})</td>
                      <td className="px-4 py-2.5 text-right font-mono text-amber-600 dark:text-amber-400">
                        -{formatINR(result.monthlyProfessionalTax)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-amber-600 dark:text-amber-400">
                        -{formatINR(result.annualProfessionalTax)}
                      </td>
                    </tr>
                    {result.annualEmployeeESI > 0 && (
                      <tr>
                        <td className="px-4 py-2.5 text-muted-foreground">Employee ESI (0.75%)</td>
                        <td className="px-4 py-2.5 text-right font-mono text-amber-600 dark:text-amber-400">
                          -{formatINR(result.monthlyEmployeeESI)}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-amber-600 dark:text-amber-400">
                          -{formatINR(result.annualEmployeeESI)}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td className="px-4 py-2.5 text-muted-foreground">Income Tax (TDS Estimate)</td>
                      <td className="px-4 py-2.5 text-right font-mono text-rose-600 dark:text-rose-400">
                        -{formatINR(result.taxBreakdown.monthlyTDS)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-rose-600 dark:text-rose-400">
                        -{formatINR(result.taxBreakdown.totalAnnualTax)}
                      </td>
                    </tr>

                    {/* Part C: Net In-Hand Take-Home Pay */}
                    <tr className="bg-emerald-600/15 text-emerald-950 dark:text-emerald-100 font-black text-sm">
                      <td className="px-4 py-3">Net Take-Home (In-Hand Pay)</td>
                      <td className="px-4 py-3 text-right font-mono">{formatINR(result.monthlyInHand)}</td>
                      <td className="px-4 py-3 text-right font-mono">{formatINR(result.annualInHand)}</td>
                    </tr>

                    {/* Part D: Employer Benefits & CTC Reconciliation */}
                    <tr className="bg-muted/20">
                      <td colSpan={3} className="px-4 py-2 font-bold text-foreground">
                        C. Employer Contributions & Benefits (Part of CTC)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-muted-foreground">Employer EPF (12%)</td>
                      <td className="px-4 py-2.5 text-right font-mono text-blue-600 dark:text-blue-400">
                        {formatINR(result.monthlyEmployerPF)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-blue-600 dark:text-blue-400">
                        {formatINR(result.annualEmployerPF)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-muted-foreground">Gratuity Provision (~4.81%)</td>
                      <td className="px-4 py-2.5 text-right font-mono text-blue-600 dark:text-blue-400">
                        {formatINR(result.monthlyGratuityProvision)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-blue-600 dark:text-blue-400">
                        {formatINR(result.annualGratuityProvision)}
                      </td>
                    </tr>
                    {result.annualVariablePay > 0 && (
                      <tr>
                        <td className="px-4 py-2.5 text-muted-foreground">Annual Variable Bonus</td>
                        <td className="px-4 py-2.5 text-right font-mono text-purple-600 dark:text-purple-400">—</td>
                        <td className="px-4 py-2.5 text-right font-mono text-purple-600 dark:text-purple-400">
                          {formatINR(result.annualVariablePay)}
                        </td>
                      </tr>
                    )}
                    <tr className="bg-muted/40 font-bold text-foreground">
                      <td className="px-4 py-2.5">Total Cost to Company (CTC)</td>
                      <td className="px-4 py-2.5 text-right font-mono">—</td>
                      <td className="px-4 py-2.5 text-right font-mono text-emerald-600 dark:text-emerald-400">
                        {formatINR(result.annualCTC)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </DashboardSection>

            {/* Smart Insights */}
            <DashboardSection title="Smart Payroll Insights">
              <div className="flex flex-col gap-2.5">
                <InsightCard
                  index={0}
                  tone="info"
                  text={`Your monthly fixed take-home pay of ${formatINR(result.monthlyInHand)} represents ${result.annualCTC > 0 ? ((result.annualInHand / result.annualCTC) * 100).toFixed(1) : "0"}% of your total CTC package.`}
                />
                <InsightCard
                  index={1}
                  tone="tip"
                  text={
                    result.taxBreakdown.totalAnnualTax === 0
                      ? "You owe ₹0 income tax under the New Tax Regime due to the ₹75,000 standard deduction and Section 87A rebate."
                      : `Your effective income tax rate is ${result.taxBreakdown.effectiveTaxRate}%. Opting for voluntary tax-saving instruments or corporate NPS under Section 80CCD(2) can further reduce your tax liability.`
                  }
                />
                <InsightCard
                  index={2}
                  tone="info"
                  text="Your actual in-hand salary depends on your employer's salary structure, payroll policies, applicable deductions and tax declarations. This calculator provides an estimate based on the information entered."
                />
              </div>
            </DashboardSection>

            {/* PDF Export Section */}
            <div className="flex flex-col">
              <CalculatorPdfExport pdfData={pdfData} />
            </div>
          </motion.div>
        ) : (
          <EmptyResultPlaceholder />
        )}
      </div>
    </CalculatorPageLayout>
  );
}

