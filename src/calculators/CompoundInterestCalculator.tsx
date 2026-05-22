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
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export function CompoundInterestCalculator() {
  const calc = getCalculator("compound-interest-calculator")!;
  const { format, formatAxis } = useCurrency();
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();
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

  const multiplier = contributed > 0 ? (total / contributed).toFixed(2) : "0";
  const fiveYearsEarlier = useMemo(() => {
    if (years <= 5) return 0;
    const r = rate / 100 / 12;
    const n = (years - 5) * 12;
    let bal = principal;
    let contrib = principal;
    for (let m = 1; m <= n; m++) {
      bal = bal * (1 + r) + monthly;
      contrib += monthly;
    }
    return Math.max(0, total - bal);
  }, [principal, monthly, rate, years, total]);

  const pdfData = hasResult
    ? {
        calculatorName: "Compound Interest Calculator",
        calculatorSlug: "compound-interest-calculator",
        siteName: PDF_SITE_NAME,
        siteUrl: PDF_SITE_URL,
        inputs: [
          { label: "Initial Principal", value: formatPdfUsd(principal) },
          { label: "Monthly Contribution", value: formatPdfUsd(monthly) },
          { label: "Annual Return", value: `${rate}%` },
          { label: "Time Horizon", value: `${years} years` },
          { label: "Compounding", value: "Monthly" },
        ],
        results: [
          { label: "Final Balance", value: formatPdfUsd(total), highlight: true },
          { label: "Total Contributed", value: formatPdfUsd(contributed), highlight: false },
          { label: "Total Interest Earned", value: formatPdfUsd(earned), highlight: false },
          { label: "Growth Multiplier", value: `${multiplier}x`, highlight: false },
        ],
        summary: `Your ${formatPdfUsd(principal)} investment grows to ${formatPdfUsd(total)} over ${years} years — a gain of ${formatPdfUsd(earned)} from compound interest alone. Your money is effectively multiplying ${multiplier}x. Starting just 5 years earlier would result in approximately ${formatPdfUsd(fiveYearsEarlier)} more at the same rate.`,
        chartElementId: "compound-chart",
      }
    : null;

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Watch your savings grow with compound interest. Set an initial amount, monthly contribution, expected annual return and time horizon to see your future balance."
      formula={`Future Value = P(1 + r)^n + PMT × [((1 + r)^n − 1) / r]
where
P = initial principal
PMT = monthly contribution
r = monthly rate (annual rate ÷ 12)
n = number of months`}
      example={`Start with $10,000, add $500/month, earn 8%/yr for 20 years.
Final balance ≈ $355,000.
You contributed $130,000; ~$225,000 came from compounding.`}
      faqs={[
        { q: "What is compound interest?", a: "Interest earned on both your original money and the interest already added — your balance grows exponentially over time." },
        { q: "How often should returns compound?", a: "We assume monthly compounding, which closely matches most investment and savings accounts." },
        { q: "Is the rate guaranteed?", a: "No. Investment returns vary year to year. Use a conservative long-term average and rebalance regularly." },
      ]}
    >
      <CalculatorCurrencyBar />
      <div className="calc-layout-grid">
        <div className="calc-input-column">
          <MoneyField label="Initial amount" value={principal} onChange={(v) => { setPrincipal(v); markCalculated(); }} />
          <MoneyField label="Monthly contribution" value={monthly} onChange={(v) => { setMonthly(v); markCalculated(); }} />
          <div className="calc-field-grid-2">
            <NumField label="Annual return" value={rate} onChange={(v) => { setRate(v); markCalculated(); }} suffix="%" step={0.1} />
            <NumField label="Years" value={years} onChange={(v) => { setYears(v); markCalculated(); }} suffix="yr" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPrincipal(10000);
              setMonthly(500);
              setRate(8);
              setYears(20);
              resetCalculated();
            }}
          >
            Reset
          </Button>
        </div>
        <div className="calc-result-panel select-copy flex flex-col">
          <div className="text-sm text-muted-foreground">Future balance</div>
          <div className="calc-result-hero text-gradient">{format(total)}</div>
          <dl className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2.5 text-sm">
            <div><dt className="text-muted-foreground">Contributed</dt><dd className="font-semibold">{format(contributed)}</dd></div>
            <div><dt className="text-muted-foreground">Interest earned</dt><dd className="font-semibold">{format(earned)}</dd></div>
          </dl>
          <div id="compound-chart" className="h-56">
            <ResponsiveContainer>
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={formatAxis} />
                <Tooltip formatter={(v: number) => format(v)} />
                <Line type="monotone" dataKey="balance" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="contributed" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <CalculatorPdfExport hasResult={hasResult} pdfData={pdfData} />
        </div>
      </div>
      <CalculatorBlog content={blogContent.compound} />
    </CalculatorPageLayout>
  );
}

function NumField({ label, value, onChange, suffix, step = 1 }: {
  label: string; value: number; onChange: (n: number) => void;
  suffix?: string; step?: number;
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
