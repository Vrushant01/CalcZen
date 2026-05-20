import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import { CalculatorCurrencyBar } from "@/components/CurrencySelector";
import { MoneyField } from "@/components/MoneyField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCalculator } from "@/data/calculators";
import { useCurrency } from "@/hooks/use-currency";

export function TipCalculator() {
  const calc = getCalculator("tip-calculator")!;
  const { format } = useCurrency();
  const [bill, setBill] = useState(60);
  const [tip, setTip] = useState(18);
  const [people, setPeople] = useState(2);

  const r = useMemo(() => {
    const tipAmt = (bill * tip) / 100;
    const total = bill + tipAmt;
    const per = people > 0 ? total / people : total;
    return { tipAmt, total, per };
  }, [bill, tip, people]);

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Quickly figure out how much to tip and how to split the bill evenly. Pick a tip percentage or enter your own."
      formula={`Tip = bill × tip% / 100
Total = bill + tip
Per person = total / people`}
      example={`60 bill, 18% tip, 2 people:
Tip 10.80, total 70.80, 35.40 each.`}
      faqs={[
        { q: "What's a standard tip in the US?", a: "15–20% is typical for sit-down service. 18% is the most common default." },
        { q: "Should I tip on tax?", a: "It's customary to tip on the pre-tax amount, but tipping on the total is also common and appreciated." },
        { q: "How do I split a bill unevenly?", a: "Add up each person's items first, apply the tip percentage, then split the tax proportionally." },
      ]}
    >
      <CalculatorCurrencyBar />
      <div className="calc-layout-grid">
        <div className="calc-input-column">
          <MoneyField label="Bill amount" value={bill} onChange={setBill} />
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Tip %</Label>
            <div className="mt-1 flex flex-wrap gap-2">
              {[10, 15, 18, 20, 25].map((t) => (
                <button key={t} type="button" onClick={() => setTip(t)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium border ${tip===t?"bg-accent text-accent-foreground border-accent":"border-border hover:bg-muted"}`}>
                  {t}%
                </button>
              ))}
              <Input type="number" value={tip} onChange={(e) => setTip(Number(e.target.value) || 0)} className="w-24" />
            </div>
          </div>
          <F label="Number of people" value={people} set={setPeople} />
        </div>
        <div className="calc-result-panel select-copy">
          <div className="text-sm text-muted-foreground">Per person</div>
          <div className="calc-result-hero text-gradient">{format(r.per)}</div>
          <dl className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2.5 text-sm">
            <div><dt className="text-muted-foreground">Tip</dt><dd className="font-semibold">{format(r.tipAmt)}</dd></div>
            <div><dt className="text-muted-foreground">Total</dt><dd className="font-semibold">{format(r.total)}</dd></div>
          </dl>
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

function F({ label, value, set }: { label: string; value: number; set: (n: number) => void }) {
  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Input type="number" className="mt-1" value={value} onChange={(e) => set(Number(e.target.value) || 0)} />
    </div>
  );
}
