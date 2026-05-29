import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog from "@/components/CalculatorBlog";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { blogContent } from "@/data/blogContent";
import { CalculatorCurrencyBar } from "@/components/CurrencySelector";
import { MoneyField } from "@/components/MoneyField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PDF_SITE_NAME, PDF_SITE_URL } from "@/constants/pdfBrand";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { useCurrency } from "@/hooks/use-currency";
import { formatPdfUsd } from "@/utils/formatPdfUsd";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export function LoanEMICalculator() {
  const calc = getCalculator("loan-emi-calculator")!;
  const { format } = useCurrency();
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();
  const [amount, setAmount] = useState(20000);
  const [rate, setRate] = useState(9);
  const [months, setMonths] = useState(60);

  const { emi, totalInterest, totalPay } = useMemo(() => {
    const r = rate / 100 / 12;
    const n = months;
    const emi = r === 0 ? amount / n : (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPay = emi * n;
    return { emi, totalPay, totalInterest: totalPay - amount };
  }, [amount, rate, months]);

  const interestPct = amount > 0 ? ((totalInterest / amount) * 100).toFixed(1) : "0";
  const extraPrincipal = emi > 0 ? formatPdfUsd(emi * 0.1) : formatPdfUsd(0);

  const pdfData = hasResult
    ? {
        calculatorName: "Loan EMI Calculator",
        calculatorSlug: "loan-emi-calculator",
        siteName: PDF_SITE_NAME,
        siteUrl: PDF_SITE_URL,
        inputs: [
          { label: "Loan Amount", value: formatPdfUsd(amount) },
          { label: "Interest Rate", value: `${rate}%` },
          { label: "Tenure", value: `${months} months` },
        ],
        results: [
          { label: "Monthly EMI", value: formatPdfUsd(emi), highlight: true },
          { label: "Total Payment", value: formatPdfUsd(totalPay), highlight: false },
          { label: "Total Interest", value: formatPdfUsd(totalInterest), highlight: false },
          { label: "Interest % of Principal", value: `${interestPct}%`, highlight: false },
        ],
        summary: `Your monthly EMI of ${formatPdfUsd(emi)} over ${months} months means you will pay ${formatPdfUsd(totalInterest)} in interest, which is ${interestPct}% of your original loan. To reduce interest, consider paying an extra ${extraPrincipal} each month toward the principal.`,
        chartElementId: "emi-chart",
      }
    : null;

  const chartData = [
    { name: "Principal", value: Math.round(amount) },
    { name: "Interest", value: Math.round(totalInterest) },
  ].filter((d) => d.value > 0);

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Calculate your Equated Monthly Installment (EMI) for any loan. See exactly how much you'll pay each month and how much you'll pay in interest over the life of the loan."
      formula={`EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)
where
P = loan principal
r = monthly interest rate (annual rate ÷ 12)
n = loan term in months`}
      example={`Loan of $20,000 at 9% APR for 60 months.
Monthly EMI ≈ $415.17.
Total interest paid ≈ $4,910.`}
      faqs={[
        { q: "What is EMI?", a: "EMI stands for Equated Monthly Installment — a fixed payment that includes both principal and interest, paid every month until the loan is repaid." },
        { q: "Does prepayment reduce EMI?", a: "Prepayments typically reduce the loan tenure or principal. Many lenders let you choose; reducing tenure usually saves more interest." },
        { q: "Are EMI calculations exact?", a: "EMI is exact for the inputs given. Real loans may include processing fees, insurance, or variable rates that change the actual payment." },
        { q: "What is the difference between flat interest rate and reducing interest rate?", a: "In a flat interest rate scheme, interest is calculated on the initial principal loan amount for the entire duration, making it much more expensive. In a reducing balance rate scheme, interest is calculated only on the outstanding principal balance each month, meaning your interest charges drop as you repay the loan." },
        { q: "Are there pre-payment penalties on personal loans?", a: "Many lenders charge pre-payment penalties if you pay off your loan early, as it deprives them of anticipated interest earnings. Always review the loan contract to verify if prepayment penalties apply before making extra payments." },
      ]}
      blog={<CalculatorBlog content={blogContent.loan} />}
    >
      <CalculatorCurrencyBar />
      <div className="calc-layout-grid">
        <div className="calc-input-column">
          <MoneyField label="Loan amount" value={amount} onChange={(v) => { setAmount(v); markCalculated(); }} />
          <div className="calc-field-grid-2">
            <Field label="Interest rate" value={rate} onChange={(v) => { setRate(v); markCalculated(); }} suffix="%" step={0.1} />
            <Field label="Tenure (months)" value={months} onChange={(v) => { setMonths(v); markCalculated(); }} />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setAmount(20000);
              setRate(9);
              setMonths(60);
              resetCalculated();
            }}
          >
            Reset
          </Button>
        </div>
        <div className="calc-result-panel select-copy flex flex-col">
          <div className="text-sm text-muted-foreground">Monthly EMI</div>
          <div className="calc-result-hero text-gradient">{format(emi)}</div>
          <dl className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2.5 text-sm">
            <div><dt className="text-muted-foreground">Total interest</dt><dd className="font-semibold">{format(totalInterest)}</dd></div>
            <div><dt className="text-muted-foreground">Total payment</dt><dd className="font-semibold">{format(totalPay)}</dd></div>
          </dl>
          {chartData.length > 0 && (
            <div id="emi-chart" className="h-48 mt-2">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={2}>
                    <Cell fill="var(--color-chart-1)" />
                    <Cell fill="var(--color-chart-2)" />
                  </Pie>
                  <Tooltip formatter={(v: number) => format(v)} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <CalculatorPdfExport hasResult={hasResult} pdfData={pdfData} />
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

function Field({ label, value, onChange, suffix, step = 1 }: {
  label: string; value: number; onChange: (n: number) => void; suffix?: string; step?: number;
}) {
  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="mt-1 relative">
        <Input type="number" step={step} value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} className={suffix ? "pr-10" : ""} />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}
