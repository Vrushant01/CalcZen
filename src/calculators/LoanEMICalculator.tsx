import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getCalculator } from "@/data/calculators";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

export function LoanEMICalculator() {
  const calc = getCalculator("loan-emi-calculator")!;
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
      example={`Loan of $20,000 at 9% for 60 months.
EMI ≈ $415.17. Total interest ≈ $4,910.`}
      faqs={[
        { q: "What is EMI?", a: "EMI stands for Equated Monthly Installment — a fixed payment that includes both principal and interest, paid every month until the loan is repaid." },
        { q: "Does prepayment reduce EMI?", a: "Prepayments typically reduce the loan tenure or principal. Many lenders let you choose; reducing tenure usually saves more interest." },
        { q: "Are EMI calculations exact?", a: "EMI is exact for the inputs given. Real loans may include processing fees, insurance, or variable rates that change the actual payment." },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Field label="Loan amount" value={amount} onChange={setAmount} prefix="$" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Interest rate" value={rate} onChange={setRate} suffix="%" step={0.1} />
            <Field label="Tenure (months)" value={months} onChange={setMonths} />
          </div>
          <Button variant="ghost" size="sm" onClick={() => { setAmount(20000); setRate(9); setMonths(60); }}>Reset</Button>
        </div>
        <div className="rounded-xl bg-muted/40 p-5">
          <div className="text-sm text-muted-foreground">Monthly EMI</div>
          <div className="text-4xl font-bold mt-1 text-gradient">{fmt(emi)}</div>
          <dl className="grid grid-cols-2 gap-3 mt-4 text-sm">
            <div><dt className="text-muted-foreground">Total interest</dt><dd className="font-semibold">{fmt(totalInterest)}</dd></div>
            <div><dt className="text-muted-foreground">Total payment</dt><dd className="font-semibold">{fmt(totalPay)}</dd></div>
          </dl>
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

function Field({ label, value, onChange, prefix, suffix, step = 1 }: {
  label: string; value: number; onChange: (n: number) => void; prefix?: string; suffix?: string; step?: number;
}) {
  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="mt-1 relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{prefix}</span>}
        <Input type="number" step={step} value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} className={prefix ? "pl-7" : suffix ? "pr-10" : ""} />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}
