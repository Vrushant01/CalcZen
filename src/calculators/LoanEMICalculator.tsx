import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import { CalculatorCurrencyBar } from "@/components/CurrencySelector";
import { MoneyField } from "@/components/MoneyField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getCalculator } from "@/data/calculators";
import { useCurrency } from "@/hooks/use-currency";

export function LoanEMICalculator() {
  const calc = getCalculator("loan-emi-calculator")!;
  const { format } = useCurrency();
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

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Calculate your Equated Monthly Installment (EMI) for any loan. See exactly how much you'll pay each month and how much you'll pay in interest over the life of the loan."
      formula={`EMI = P × r × (1+r)^n / ((1+r)^n − 1)
P = principal, r = monthly rate, n = months`}
      example={`Loan of 20,000 at 9% for 60 months.
EMI ≈ 415.17. Total interest ≈ 4,910.`}
      faqs={[
        { q: "What is EMI?", a: "EMI stands for Equated Monthly Installment — a fixed payment that includes both principal and interest, paid every month until the loan is repaid." },
        { q: "Does prepayment reduce EMI?", a: "Prepayments typically reduce the loan tenure or principal. Many lenders let you choose; reducing tenure usually saves more interest." },
        { q: "Are EMI calculations exact?", a: "EMI is exact for the inputs given. Real loans may include processing fees, insurance, or variable rates that change the actual payment." },
      ]}
    >
      <CalculatorCurrencyBar />
      <div className="calc-layout-grid">
        <div className="calc-input-column">
          <MoneyField label="Loan amount" value={amount} onChange={setAmount} />
          <div className="calc-field-grid-2">
            <Field label="Interest rate" value={rate} onChange={setRate} suffix="%" step={0.1} />
            <Field label="Tenure (months)" value={months} onChange={setMonths} />
          </div>
          <Button variant="ghost" size="sm" onClick={() => { setAmount(20000); setRate(9); setMonths(60); }}>Reset</Button>
        </div>
        <div className="calc-result-panel select-copy">
          <div className="text-sm text-muted-foreground">Monthly EMI</div>
          <div className="calc-result-hero text-gradient">{format(emi)}</div>
          <dl className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2.5 text-sm">
            <div><dt className="text-muted-foreground">Total interest</dt><dd className="font-semibold">{format(totalInterest)}</dd></div>
            <div><dt className="text-muted-foreground">Total payment</dt><dd className="font-semibold">{format(totalPay)}</dd></div>
          </dl>
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
