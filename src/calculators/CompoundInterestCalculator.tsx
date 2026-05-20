import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getCalculator } from "@/data/calculators";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function CompoundInterestCalculator() {
  const calc = getCalculator("compound-interest-calculator")!;
  const [principal, setPrincipal] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(20);

  const { series, total, contributed, earned } = useMemo(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    let bal = principal;
    let contrib = principal;
    const series: { year: number; balance: number; contributed: number }[] = [{ year: 0, balance: bal, contributed: contrib }];
    for (let m = 1; m <= n; m++) {
      bal = bal * (1 + r) + monthly;
      contrib += monthly;
      if (m % 12 === 0) series.push({ year: m / 12, balance: Math.round(bal), contributed: Math.round(contrib) });
    }
    return { series, total: bal, contributed: contrib, earned: bal - contrib };
  }, [principal, monthly, rate, years]);

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Watch your savings grow with compound interest. Set an initial amount, monthly contribution, expected annual return and time horizon to see your future balance."
      formula={`Future value = P(1+r)^n + PMT × [((1+r)^n − 1) / r]
where P = initial principal, PMT = periodic contribution,
r = period rate, n = number of periods.`}
      example={`Start with $10,000, add $500/month, earn 8%/yr for 20 years.
Final balance ≈ $355,000. You contributed $130,000; ~$225,000 came from compounding.`}
      faqs={[
        { q: "What is compound interest?", a: "Interest earned on both your original money and the interest already added — your balance grows exponentially over time." },
        { q: "How often should returns compound?", a: "We assume monthly compounding, which closely matches most investment and savings accounts." },
        { q: "Is the rate guaranteed?", a: "No. Investment returns vary year to year. Use a conservative long-term average and rebalance regularly." },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <NumField label="Initial amount" value={principal} onChange={setPrincipal} prefix="$" />
          <NumField label="Monthly contribution" value={monthly} onChange={setMonthly} prefix="$" />
          <div className="grid grid-cols-2 gap-4">
            <NumField label="Annual return" value={rate} onChange={setRate} suffix="%" step={0.1} />
            <NumField label="Years" value={years} onChange={setYears} suffix="yr" />
          </div>
          <Button variant="ghost" size="sm" onClick={() => { setPrincipal(10000); setMonthly(500); setRate(8); setYears(20); }}>Reset</Button>
        </div>
        <div className="rounded-xl bg-muted/40 p-5">
          <div className="text-sm text-muted-foreground">Future balance</div>
          <div className="text-4xl font-bold mt-1 text-gradient">{fmt(total)}</div>
          <dl className="grid grid-cols-2 gap-3 mt-4 text-sm">
            <div><dt className="text-muted-foreground">Contributed</dt><dd className="font-semibold">{fmt(contributed)}</dd></div>
            <div><dt className="text-muted-foreground">Interest earned</dt><dd className="font-semibold">{fmt(earned)}</dd></div>
          </dl>
          <div className="h-56 mt-4">
            <ResponsiveContainer>
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Line type="monotone" dataKey="balance" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="contributed" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

function NumField({ label, value, onChange, prefix, suffix, step = 1 }: {
  label: string; value: number; onChange: (n: number) => void;
  prefix?: string; suffix?: string; step?: number;
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
