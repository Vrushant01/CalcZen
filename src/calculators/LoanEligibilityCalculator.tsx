import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { MoneyField } from "@/components/MoneyField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalculateButton } from "@/components/CalculateButton";
import { PDF_SITE_NAME, PDF_SITE_URL } from "@/constants/pdfBrand";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { useCurrency } from "@/hooks/use-currency";
import { formatPdfUsd } from "@/utils/formatPdfUsd";
import { motion } from "framer-motion";
import { HeroMetric, StatCard, DashboardSection, InsightCard } from "@/components/dashboard";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export function LoanEligibilityCalculator() {
  const calc = getCalculator("loan-eligibility-calculator")!;
  const { format } = useCurrency();
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  const [income, setIncome] = useState<number | "">(5000);
  const [existingEmi, setExistingEmi] = useState<number | "">(500);
  const [rate, setRate] = useState<number | "">(10.5);
  const [years, setYears] = useState<number | "">(5);

  const [calcIncome, setCalcIncome] = useState<number>(5000);
  const [calcExistingEmi, setCalcExistingEmi] = useState<number>(500);
  const [calcRate, setCalcRate] = useState<number>(10.5);
  const [calcYears, setCalcYears] = useState<number>(5);

  // Constants
  const FOIR_PERCENTAGE = 0.5; // 50% max EMI to income ratio

  const result = useMemo(() => {
    const maxTotalEmi = calcIncome * FOIR_PERCENTAGE;
    const availableEmi = Math.max(0, maxTotalEmi - calcExistingEmi);

    let eligibility = 0;
    if (availableEmi > 0 && calcRate > 0 && calcYears > 0) {
      const r = calcRate / 100 / 12;
      const n = calcYears * 12;
      eligibility = availableEmi * ((1 - Math.pow(1 + r, -n)) / r);
    } else if (availableEmi > 0 && calcRate === 0) {
      eligibility = availableEmi * (calcYears * 12);
    }

    const totalRepayment = availableEmi * (calcYears * 12);
    const totalInterest = Math.max(0, totalRepayment - eligibility);

    return {
      maxTotalEmi,
      availableEmi,
      eligibility,
      totalInterest,
      totalRepayment,
    };
  }, [calcIncome, calcExistingEmi, calcRate, calcYears]);

  const pdfData = hasResult
    ? {
        calculatorName: "Loan Eligibility Calculator",
        calculatorSlug: "loan-eligibility-calculator",
        siteName: PDF_SITE_NAME,
        siteUrl: PDF_SITE_URL,
        inputs: [
          { label: "Monthly Income", value: formatPdfUsd(calcIncome) },
          { label: "Existing EMI", value: formatPdfUsd(calcExistingEmi) },
          { label: "Interest Rate", value: `${calcRate}%` },
          { label: "Loan Term", value: `${calcYears} years` },
        ],
        results: [
          {
            label: "Estimated Loan Eligibility",
            value: formatPdfUsd(result.eligibility),
            highlight: true,
          },
          {
            label: "Recommended Max EMI",
            value: formatPdfUsd(result.availableEmi),
            highlight: false,
          },
          {
            label: "Total Interest Payable",
            value: formatPdfUsd(result.totalInterest),
            highlight: false,
          },
        ],
        summary: `Based on your monthly income of ${formatPdfUsd(calcIncome)} and an assumed maximum Debt-to-Income ratio of 50%, your maximum total EMI capacity is ${formatPdfUsd(result.maxTotalEmi)}. After deducting your existing EMI of ${formatPdfUsd(calcExistingEmi)}, you have an available EMI of ${formatPdfUsd(result.availableEmi)}. Over ${calcYears} years at ${calcRate}%, you are eligible for an estimated loan amount of ${formatPdfUsd(result.eligibility)}.`,
      }
    : null;

  const isButtonDisabled =
    income === "" ||
    rate === "" ||
    years === "" ||
    existingEmi === "" ||
    Number(income) <= 0 ||
    Number(rate) < 0 ||
    Number(years) <= 0;

  const handleCalculate = () => {
    if (isButtonDisabled) return;
    setCalcIncome(Number(income));
    setCalcExistingEmi(Number(existingEmi));
    setCalcRate(Number(rate));
    setCalcYears(Number(years));
    markCalculated();
  };

  const handleReset = () => {
    setIncome(5000);
    setExistingEmi(500);
    setRate(10.5);
    setYears(5);
    setCalcIncome(5000);
    setCalcExistingEmi(500);
    setCalcRate(10.5);
    setCalcYears(5);
    resetCalculated();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isButtonDisabled) handleCalculate();
  };

  const donutData = [
    { name: "Principal Amount", value: Math.round(result.eligibility) },
    { name: "Total Interest", value: Math.round(result.totalInterest) },
  ].filter((d) => d.value > 0);

  const tooltipStyle = {
    contentStyle: {
      background: "var(--color-card)",
      borderColor: "var(--color-border)",
      borderRadius: "8px",
      fontSize: 12,
    },
    labelStyle: { color: "var(--color-foreground)" },
    itemStyle: { color: "var(--color-foreground)" },
  };

  const chartColors = ["var(--color-chart-1)", "var(--color-chart-2)"];

  const blogContent = (
    <div className="prose prose-slate dark:prose-invert max-w-none mt-12">
      <h2>Understanding Loan Eligibility</h2>
      <p>
        Before applying for a personal loan, home loan, or car loan, the most critical question
        borrowers face is: "How much can I borrow?" Lenders use various metrics to evaluate loan
        eligibility, with the most prominent being the Fixed Obligation to Income Ratio (FOIR) or
        Debt-to-Income (DTI) ratio. This calculator estimates your borrowing power based on standard
        banking formulas.
      </p>

      <h3>The FOIR (Fixed Obligation to Income Ratio)</h3>
      <p>
        Banks and financial institutions need to ensure that you have enough disposable income to
        comfortably cover your monthly living expenses, emergency needs, and loan repayments.
        Generally, lenders assume that you should spend no more than 40% to 50% of your net monthly
        income on EMIs (Equated Monthly Installments).
      </p>
      <p>
        If your monthly take-home salary is $5,000, and the bank uses a 50% FOIR, they believe you
        can safely allocate up to $2,500 toward all debt repayments. If you already have existing
        loans or credit card EMIs taking up $500, your available capacity for a new loan is reduced
        to $2,000.
      </p>

      <h3>How Loan Eligibility is Calculated</h3>
      <p>
        Once your available EMI capacity is determined, the lender calculates the maximum loan
        amount you can afford at a specific interest rate over a chosen tenure. This is
        mathematically equivalent to finding the present value of an annuity.
      </p>
      <p>
        <strong>The Formula:</strong>
        <br />
        <code className="text-sm bg-muted p-1 rounded font-mono">
          E = P × [ (1 - (1 + r)^-n) / r ]
        </code>
      </p>
      <ul>
        <li>
          <strong>E:</strong> Eligible Loan Amount
        </li>
        <li>
          <strong>P:</strong> Available Monthly EMI
        </li>
        <li>
          <strong>r:</strong> Monthly Interest Rate (Annual Rate ÷ 12 ÷ 100)
        </li>
        <li>
          <strong>n:</strong> Loan Tenure in Months
        </li>
      </ul>

      <h3>Key Factors Affecting Your Loan Eligibility</h3>
      <ol>
        <li>
          <strong>Monthly Income:</strong> Higher income leads to a higher EMI capacity, thereby
          increasing eligibility. Lenders focus on net take-home pay after taxes and standard
          deductions.
        </li>
        <li>
          <strong>Existing Debts:</strong> Any active loans or credit card dues reduce your
          available EMI capacity dollar-for-dollar.
        </li>
        <li>
          <strong>Interest Rate:</strong> A lower interest rate means more of your EMI goes toward
          principal repayment, boosting your eligible loan amount. For example, a 7% mortgage allows
          you to borrow significantly more than an 8% mortgage for the same monthly payment.
        </li>
        <li>
          <strong>Loan Tenure:</strong> Opting for a longer tenure reduces the monthly EMI
          requirement for a given loan amount, effectively allowing you to borrow more. However,
          this also significantly increases the total interest you pay over the life of the loan.
        </li>
      </ol>

      <h3>Pro Tips to Increase Your Borrowing Capacity</h3>
      <ul>
        <li>
          <strong>Pay off existing small debts:</strong> Closing out smaller personal loans or
          credit card balances frees up your monthly EMI capacity and reduces your DTI ratio.
        </li>
        <li>
          <strong>Apply jointly:</strong> Adding a co-applicant with a stable income (like a spouse)
          combines your incomes and boosts the FOIR limit, unlocking much higher eligibility.
        </li>
        <li>
          <strong>Extend the tenure:</strong> While not ideal for overall cost, a longer term
          increases the maximum amount you can borrow immediately.
        </li>
        <li>
          <strong>Improve your credit score:</strong> A higher credit score often qualifies you for
          lower interest rates, indirectly increasing your loan eligibility. A score above 740 is
          usually considered excellent by most lenders.
        </li>
        <li>
          <strong>Declare all income:</strong> Be sure to include regular bonuses, rental income, or
          reliable side-hustle earnings if you can provide a paper trail, as lenders may consider
          these to boost your gross income.
        </li>
      </ul>

      <p>
        <em>
          Note: This calculator uses a standard 50% FOIR assumption. Actual eligibility may vary
          based on your specific lender's internal policies, your credit score, employer category,
          and other demographic factors. Always consult your bank or financial advisor for an exact
          quote.
        </em>
      </p>
    </div>
  );

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Estimate your maximum loan eligibility based on your net income, existing EMIs, interest rate, and loan term. Find out how much you can borrow before applying."
      formula={"Eligible Loan = Available EMI × [1 − (1 + r)^−n] / r"}
      example="If you earn $5,000/month, assume 50% ($2,500) max EMI. Minus $500 existing EMI = $2,000 available. At 10.5% for 5 years, you can borrow ~ $93,000."
      faqs={[
        {
          q: "What is loan eligibility?",
          a: "Loan eligibility is the maximum amount of money a bank or financial institution is willing to lend you. It is primarily determined by your income, existing debt obligations, age, credit score, and the lender's risk policies.",
        },
        {
          q: "What does FOIR or DTI mean?",
          a: "FOIR stands for Fixed Obligation to Income Ratio, and DTI stands for Debt-to-Income ratio. It is the percentage of your monthly income that goes toward paying debts. Lenders generally prefer a FOIR of 40% to 50%.",
        },
        {
          q: "How do existing EMIs affect my new loan?",
          a: "Existing EMIs reduce the portion of your income that is considered available for new loan repayments. The more existing debt you have, the lower your eligibility for a new loan.",
        },
        {
          q: "Does a longer tenure increase my loan eligibility?",
          a: "Yes. Spreading the repayment over a longer period reduces the monthly EMI amount, which means you can afford to borrow a larger principal amount within the same monthly budget. However, you will pay more total interest.",
        },
        {
          q: "Can I include my spouse's income to get a bigger loan?",
          a: "Yes. Most banks allow you to add a co-applicant (such as a spouse). By combining your incomes, your total repayment capacity increases, significantly boosting your loan eligibility.",
        },
        {
          q: "Is my credit score important for loan eligibility?",
          a: "Absolutely. While income and EMI capacity dictate the mathematical maximum you can borrow, a good credit score (typically 700+) is required to qualify for the loan in the first place and to secure the best interest rates.",
        },
        {
          q: "Why did the bank offer me a lower amount than the calculator?",
          a: "This calculator assumes a standard 50% FOIR. Your bank may use a stricter ratio (e.g., 40%) based on your income bracket, employer profile, credit history, or current market regulations, leading to a lower approved amount.",
        },
        {
          q: "Does age affect loan eligibility?",
          a: "Yes, especially for long-term loans like mortgages. Banks require the loan tenure to be completed before your retirement age (usually 60 or 65). If you are closer to retirement, you may be restricted to a shorter tenure, which reduces your maximum loan amount.",
        },
      ]}
      blog={blogContent}
    >
      <div className="flex flex-col gap-6">
        <div className="calc-input-column">
          <MoneyField label="Net Monthly Income" value={income} onChange={(v) => setIncome(v)} />
          <MoneyField
            label="Existing Total EMIs"
            value={existingEmi}
            onChange={(v) => setExistingEmi(v)}
          />
          <div className="calc-field-grid-2">
            <PctField
              label="Interest Rate"
              value={rate}
              onChange={(v) => setRate(v)}
              onKeyDown={handleKeyDown}
              step={0.1}
            />
            <PctField
              label="Loan Tenure"
              value={years}
              onChange={(v) => setYears(v)}
              onKeyDown={handleKeyDown}
              suffix="yr"
              step={1}
            />
          </div>

          <div className="flex flex-row gap-3 mt-4">
            <CalculateButton
              category="finance"
              className="flex-1 min-h-11"
              disabled={isButtonDisabled}
              onClick={handleCalculate}
            >
              Check Eligibility
            </CalculateButton>
            <Button variant="outline" className="flex-1 min-h-11" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>

        {hasResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-2 flex flex-col gap-6"
          >
            {/* Hero */}
            <HeroMetric
              label="Estimated Loan Eligibility"
              value={format(result.eligibility)}
              sub={`Recommended EMI: ${format(result.availableEmi)}/mo`}
              glow="#10b981"
            />

            {/* Key Metrics */}
            <DashboardSection title="Eligibility Breakdown">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard
                  index={0}
                  label="Max Total EMI (50% FOIR)"
                  value={format(result.maxTotalEmi)}
                  accent="blue"
                />
                <StatCard
                  index={1}
                  label="Available EMI"
                  value={format(result.availableEmi)}
                  accent="green"
                />
                <StatCard
                  index={2}
                  label="Total Interest Payable"
                  value={format(result.totalInterest)}
                  accent="red"
                />
              </div>
            </DashboardSection>

            {/* Charts */}
            <DashboardSection title="Loan Cost Visualization">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  id="loan-eligibility-chart"
                  className="rounded-xl border border-border/60 bg-card p-4 shadow-soft"
                >
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Principal vs Interest
                  </div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donutData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={50}
                          outerRadius={74}
                          paddingAngle={3}
                        >
                          {donutData.map((_, i) => (
                            <Cell key={i} fill={chartColors[i % chartColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number) => format(v)} {...tooltipStyle} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 bg-card p-4 shadow-soft flex flex-col justify-center">
                  <h4 className="font-medium text-sm mb-2">How to increase your eligibility?</h4>
                  <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
                    <li>Clear existing loans to free up your EMI capacity.</li>
                    <li>
                      Opt for a longer loan tenure (e.g., 6 or 7 years) to lower the monthly burden.
                    </li>
                    <li>Add an earning co-applicant to combine your incomes.</li>
                    <li>Negotiate a lower interest rate based on a high credit score.</li>
                  </ul>
                </div>
              </div>
            </DashboardSection>

            {/* Insights */}
            <DashboardSection title="Smart Insights">
              <div className="flex flex-col gap-2">
                <InsightCard
                  index={0}
                  tone="info"
                  text={`Your max EMI capacity is considered to be 50% of your income (${format(result.maxTotalEmi)}). Since you pay ${format(calcExistingEmi)} in existing EMIs, you have ${format(result.availableEmi)} left for a new loan.`}
                />
                <InsightCard
                  index={1}
                  tone="warning"
                  text={`Borrowing the maximum eligible amount of ${format(result.eligibility)} means you will pay ${format(result.totalInterest)} in interest over ${calcYears} years.`}
                />
                {calcExistingEmi > result.maxTotalEmi && (
                  <InsightCard
                    index={2}
                    tone="warning"
                    text={`Your existing EMIs exceed 50% of your income. It is highly unlikely a bank will approve a new loan unless you clear existing debts or add a co-applicant.`}
                  />
                )}
              </div>
            </DashboardSection>

            <div className="flex flex-col">
              <CalculatorPdfExport pdfData={pdfData} />
            </div>
          </motion.div>
        )}
      </div>
    </CalculatorPageLayout>
  );
}

function PctField({
  label,
  value,
  onChange,
  onKeyDown,
  suffix = "%",
  step = 1,
}: {
  label: string;
  value: number | "";
  onChange: (n: number | "") => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  suffix?: string;
  step?: number;
}) {
  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="mt-1 relative">
        <Input
          type="number"
          step={step}
          value={value}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val === "" ? "" : Number(val));
          }}
          onKeyDown={onKeyDown}
          className="pr-10"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          {suffix}
        </span>
      </div>
    </div>
  );
}
