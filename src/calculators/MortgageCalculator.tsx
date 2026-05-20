import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import { CalculatorCurrencyBar } from "@/components/CurrencySelector";
import { MoneyField } from "@/components/MoneyField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getCalculator } from "@/data/calculators";
import { useCurrency } from "@/hooks/use-currency";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export function MortgageCalculator() {
  const calc = getCalculator("mortgage-calculator")!;
  const { format } = useCurrency();
  const [price, setPrice] = useState(400000);
  const [down, setDown] = useState(80000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const [tax, setTax] = useState(3000);
  const [ins, setIns] = useState(1200);
  const [hoa, setHoa] = useState(0);

  const result = useMemo(() => {
    const principal = Math.max(0, price - down);
    const r = rate / 100 / 12;
    const n = years * 12;
    const pi = r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const monthlyTax = tax / 12;
    const monthlyIns = ins / 12;
    const monthly = pi + monthlyTax + monthlyIns + hoa;
    const totalPaid = pi * n;
    const totalInterest = totalPaid - principal;
    return { pi, monthly, monthlyTax, monthlyIns, hoa, principal, totalPaid, totalInterest };
  }, [price, down, rate, years, tax, ins, hoa]);

  const data = [
    { name: "Principal & Interest", value: Math.round(result.pi) },
    { name: "Property Tax", value: Math.round(result.monthlyTax) },
    { name: "Insurance", value: Math.round(result.monthlyIns) },
    { name: "HOA", value: Math.round(result.hoa) },
  ].filter((d) => d.value > 0);
  const colors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)"];

  const reset = () => { setPrice(400000); setDown(80000); setRate(6.5); setYears(30); setTax(3000); setIns(1200); setHoa(0); };

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Estimate your monthly mortgage payment including principal, interest, property tax, insurance and HOA fees. Adjust the inputs to see how different loan terms affect your total cost."
      formula={`Monthly P&I = P × r × (1 + r)^n / ((1 + r)^n − 1)
where:
  P = loan principal (home price − down payment)
  r = monthly interest rate (annual rate ÷ 12)
  n = total number of payments (years × 12)`}
      example={`Home price 400,000, down payment 80,000, 6.5% APR, 30 years.
Loan principal ≈ 320,000.
Monthly P&I ≈ 2,022.
With 3,000/yr tax and 1,200/yr insurance, total monthly ≈ 2,372.`}
      faqs={[
        { q: "What is included in a mortgage payment?", a: "A typical monthly mortgage payment (PITI) includes principal, interest, property tax and homeowners insurance. HOA dues may apply for condos or planned communities." },
        { q: "How does the down payment affect my mortgage?", a: "A larger down payment reduces the loan principal, lowers your monthly payment, and may help you avoid private mortgage insurance (PMI)." },
        { q: "Is a 15-year or 30-year loan better?", a: "A 15-year loan has higher monthly payments but far less total interest. A 30-year loan has lower payments and more flexibility, but you pay more over time." },
        { q: "Are the results from this calculator final?", a: "Results are estimates for planning. Your actual payment depends on your lender, credit, taxes, insurance quotes and other fees." },
      ]}
    >
      <CalculatorCurrencyBar />
      <div className="calc-layout-grid">
        <div className="calc-input-column">
          <MoneyField label="Home price" value={price} onChange={setPrice} />
          <MoneyField label="Down payment" value={down} onChange={setDown} />
          <div className="calc-field-grid-2">
            <PctField label="Interest rate" value={rate} onChange={setRate} step={0.05} />
            <PctField label="Loan term" value={years} onChange={setYears} suffix="yr" step={1} />
          </div>
          <MoneyField label="Property tax (annual)" value={tax} onChange={setTax} />
          <MoneyField label="Insurance (annual)" value={ins} onChange={setIns} />
          <MoneyField label="HOA (monthly)" value={hoa} onChange={setHoa} />
          <Button variant="ghost" onClick={reset} size="sm">Reset</Button>
        </div>

        <div className="calc-result-panel select-copy flex flex-col">
          <div className="text-sm text-muted-foreground">Estimated monthly payment</div>
          <div className="calc-result-hero text-gradient">{format(result.monthly)}</div>
          <dl className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2.5 text-sm">
            <div><dt className="text-muted-foreground">Loan amount</dt><dd className="font-semibold">{format(result.principal)}</dd></div>
            <div><dt className="text-muted-foreground">Total interest</dt><dd className="font-semibold">{format(result.totalInterest)}</dd></div>
            <div><dt className="text-muted-foreground">Total paid</dt><dd className="font-semibold">{format(result.totalPaid)}</dd></div>
            <div><dt className="text-muted-foreground">P&I / month</dt><dd className="font-semibold">{format(result.pi)}</dd></div>
          </dl>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => format(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

function PctField({ label, value, onChange, suffix = "%", step = 1 }: {
  label: string; value: number; onChange: (n: number) => void; suffix?: string; step?: number;
}) {
  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="mt-1 relative">
        <Input
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="pr-10"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{suffix}</span>
      </div>
    </div>
  );
}
