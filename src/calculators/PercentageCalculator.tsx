import { useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCalculator } from "@/data/calculators";

export function PercentageCalculator() {
  const calc = getCalculator("percentage-calculator")!;
  const [a, setA] = useState(15);
  const [b, setB] = useState(200);
  const [x, setX] = useState(50);
  const [y, setY] = useState(80);
  const [from, setFrom] = useState(100);
  const [to, setTo] = useState(125);

  const r1 = (a / 100) * b;
  const r2 = y === 0 ? 0 : (x / y) * 100;
  const r3 = from === 0 ? 0 : ((to - from) / from) * 100;

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Three quick percentage calculators in one: find a percent of a number, see what percent one number is of another, or measure the percent change between two values."
      formula={`Percent of:        result = (a/100) × b
Is what percent:   result = (x/y) × 100
Percent change:    result = ((new − old) / old) × 100`}
      example={`15% of 200 = 30
50 is what % of 80 = 62.5%
From 100 to 125 = +25% change`}
      faqs={[
        { q: "How do I calculate a discount?", a: "Use 'percent of': 25% of $80 = $20 off → final price $60." },
        { q: "What does percent change mean?", a: "It measures growth or decline relative to the starting value. A jump from 100 to 125 is a 25% increase." },
        { q: "Can I use negative numbers?", a: "Yes — negative or fractional values work in all three calculators." },
      ]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 min-w-0">
        <Box title="What is X% of Y?" result={`${r1.toLocaleString()}`}>
          <div className="grid grid-cols-2 gap-2">
            <F label="X (%)" value={a} set={setA} />
            <F label="Y" value={b} set={setB} />
          </div>
        </Box>
        <Box title="X is what % of Y?" result={`${r2.toFixed(2)}%`}>
          <div className="grid grid-cols-2 gap-2">
            <F label="X" value={x} set={setX} />
            <F label="Y" value={y} set={setY} />
          </div>
        </Box>
        <Box title="Percent change" result={`${r3 >= 0 ? "+" : ""}${r3.toFixed(2)}%`}>
          <div className="grid grid-cols-2 gap-2">
            <F label="From" value={from} set={setFrom} />
            <F label="To" value={to} set={setTo} />
          </div>
        </Box>
      </div>
    </CalculatorPageLayout>
  );
}

function Box({ title, result, children }: { title: string; result: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      {children}
      <div className="select-copy mt-4 pt-3 border-t border-border">
        <div className="text-xs text-muted-foreground">Result</div>
        <div className="text-2xl font-bold text-gradient">{result}</div>
      </div>
    </div>
  );
}

function F({ label, value, set }: { label: string; value: number; set: (n: number) => void }) {
  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Input type="number" value={value} onChange={(e) => set(Number(e.target.value) || 0)} className="mt-1" />
    </div>
  );
}
