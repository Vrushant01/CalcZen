import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
<<<<<<< HEAD
import CalculatorBlog from "@/components/CalculatorBlog";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { blogContent } from "@/data/blogContent";
import { CalculatorCurrencyBar } from "@/components/CurrencySelector";
import { MoneyField } from "@/components/MoneyField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PDF_SITE_NAME, PDF_SITE_URL } from "@/constants/pdfBrand";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { useCurrency } from "@/hooks/use-currency";
import { formatPdfUsd } from "@/utils/formatPdfUsd";

function tipLabel(pct: number): string {
  if (pct >= 20) return "generous";
  if (pct >= 15) return "standard";
  return "below standard";
}

export function TipCalculator() {
  const calc = getCalculator("tip-calculator")!;
  const { format } = useCurrency();
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();
=======
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCalculator } from "@/data/calculators";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

export function TipCalculator() {
  const calc = getCalculator("tip-calculator")!;
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
  const [bill, setBill] = useState(60);
  const [tip, setTip] = useState(18);
  const [people, setPeople] = useState(2);

  const r = useMemo(() => {
    const tipAmt = (bill * tip) / 100;
    const total = bill + tipAmt;
    const per = people > 0 ? total / people : total;
<<<<<<< HEAD
    const tipPer = people > 0 ? tipAmt / people : tipAmt;
    return { tipAmt, total, per, tipPer };
  }, [bill, tip, people]);

  const pdfData =
    hasResult && bill > 0
      ? {
          calculatorName: "Tip Calculator",
          calculatorSlug: "tip-calculator",
          siteName: PDF_SITE_NAME,
          siteUrl: PDF_SITE_URL,
          inputs: [
            { label: "Bill Amount", value: formatPdfUsd(bill) },
            { label: "Tip Percentage", value: `${tip}%` },
            { label: "Number of People", value: String(people) },
          ],
          results: [
            { label: "Total Per Person", value: formatPdfUsd(r.per), highlight: true },
            { label: "Tip Amount", value: formatPdfUsd(r.tipAmt), highlight: false },
            { label: "Total Bill", value: formatPdfUsd(r.total), highlight: false },
            { label: "Each Person's Tip", value: formatPdfUsd(r.tipPer), highlight: false },
          ],
          summary: `A ${tip}% tip on a ${formatPdfUsd(bill)} bill is ${formatPdfUsd(r.tipAmt)}, bringing the total to ${formatPdfUsd(r.total)}. Split ${people} ways, each person pays ${formatPdfUsd(r.per)}. This is considered a ${tipLabel(tip)} tip for restaurant service in the USA.`,
        }
      : null;

=======
    return { tipAmt, total, per };
  }, [bill, tip, people]);

>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Quickly figure out how much to tip and how to split the bill evenly. Pick a tip percentage or enter your own."
<<<<<<< HEAD
      formula={`Tip amount = bill × tip% ÷ 100
Total bill = bill + tip
Per person = total ÷ people`}
      example={`$60 bill with 18% tip split between 2 people.
Tip = $10.80, total = $70.80, $35.40 per person.`}
=======
      formula={`Tip = bill × tip% / 100
Total = bill + tip
Per person = total / people`}
      example={`$60 bill, 18% tip, 2 people:
Tip $10.80, total $70.80, $35.40 each.`}
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
      faqs={[
        { q: "What's a standard tip in the US?", a: "15–20% is typical for sit-down service. 18% is the most common default." },
        { q: "Should I tip on tax?", a: "It's customary to tip on the pre-tax amount, but tipping on the total is also common and appreciated." },
        { q: "How do I split a bill unevenly?", a: "Add up each person's items first, apply the tip percentage, then split the tax proportionally." },
      ]}
    >
<<<<<<< HEAD
      <CalculatorCurrencyBar />
      <div className="calc-layout-grid">
        <div className="calc-input-column">
          <MoneyField label="Bill amount" value={bill} onChange={(v) => { setBill(v); markCalculated(); }} />
=======
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <F label="Bill amount" value={bill} set={setBill} prefix="$" />
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Tip %</Label>
            <div className="mt-1 flex flex-wrap gap-2">
              {[10, 15, 18, 20, 25].map((t) => (
<<<<<<< HEAD
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTip(t);
                    markCalculated();
                  }}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium border ${tip === t ? "bg-accent text-accent-foreground border-accent" : "border-border hover:bg-muted"}`}
                >
                  {t}%
                </button>
              ))}
              <Input
                type="number"
                value={tip}
                onChange={(e) => {
                  setTip(Number(e.target.value) || 0);
                  markCalculated();
                }}
                className="w-24"
              />
            </div>
          </div>
          <F label="Number of people" value={people} set={(v) => { setPeople(v); markCalculated(); }} />
        </div>
        <div className="calc-result-panel select-copy flex flex-col">
          <div className="text-sm text-muted-foreground">Per person</div>
          <div className="calc-result-hero text-gradient">{format(r.per)}</div>
          <dl className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2.5 text-sm">
            <div><dt className="text-muted-foreground">Tip</dt><dd className="font-semibold">{format(r.tipAmt)}</dd></div>
            <div><dt className="text-muted-foreground">Total</dt><dd className="font-semibold">{format(r.total)}</dd></div>
          </dl>
          <CalculatorPdfExport hasResult={hasResult && bill > 0} pdfData={pdfData} />
        </div>
      </div>
      <CalculatorBlog content={blogContent.tip} />
=======
                <button key={t} onClick={() => setTip(t)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium border ${tip===t?"bg-accent text-accent-foreground border-accent":"border-border hover:bg-muted"}`}>
                  {t}%
                </button>
              ))}
              <Input type="number" value={tip} onChange={(e) => setTip(Number(e.target.value) || 0)} className="w-24" />
            </div>
          </div>
          <F label="Number of people" value={people} set={setPeople} />
        </div>
        <div className="rounded-xl bg-muted/40 p-5">
          <div className="text-sm text-muted-foreground">Per person</div>
          <div className="text-4xl font-bold mt-1 text-gradient">{fmt(r.per)}</div>
          <dl className="grid grid-cols-2 gap-3 mt-4 text-sm">
            <div><dt className="text-muted-foreground">Tip</dt><dd className="font-semibold">{fmt(r.tipAmt)}</dd></div>
            <div><dt className="text-muted-foreground">Total</dt><dd className="font-semibold">{fmt(r.total)}</dd></div>
          </dl>
        </div>
      </div>
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
    </CalculatorPageLayout>
  );
}

<<<<<<< HEAD
function F({ label, value, set }: { label: string; value: number; set: (n: number) => void }) {
  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Input type="number" className="mt-1" value={value} onChange={(e) => set(Number(e.target.value) || 0)} />
=======
function F({ label, value, set, prefix }: { label: string; value: number; set: (n: number) => void; prefix?: string }) {
  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="mt-1 relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{prefix}</span>}
        <Input type="number" value={value} onChange={(e) => set(Number(e.target.value) || 0)} className={prefix ? "pl-7" : ""} />
      </div>
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
    </div>
  );
}
