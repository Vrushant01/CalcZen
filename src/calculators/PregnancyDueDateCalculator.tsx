import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCalculator } from "@/data/calculators";

export function PregnancyDueDateCalculator() {
  const calc = getCalculator("pregnancy-due-date-calculator")!;
  const [lmp, setLmp] = useState("2025-01-01");

  const r = useMemo(() => {
    const d = new Date(lmp);
    if (isNaN(d.getTime())) return null;
    const due = new Date(d); due.setDate(due.getDate() + 280);
    const today = new Date();
    const daysIn = Math.floor((today.getTime() - d.getTime()) / 86400000);
    const week = Math.max(0, Math.floor(daysIn / 7));
    const trimester = week < 13 ? 1 : week < 27 ? 2 : 3;
    return { due, week, trimester };
  }, [lmp]);

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Estimate your baby's due date using Naegele's rule — the standard method that adds 280 days to the first day of your last menstrual period (LMP)."
      formula={`Due date = LMP + 280 days (40 weeks)`}
      example={`LMP on 2025-01-01 → estimated due date 2025-10-08.`}
      faqs={[
        { q: "How accurate is the due date?", a: "Only about 5% of babies arrive exactly on the due date — a normal range is 37 to 42 weeks. Ultrasound dating in the first trimester is more precise." },
        { q: "What if I don't remember my LMP?", a: "An early ultrasound can date the pregnancy by measuring the baby's size. Talk to your healthcare provider." },
        { q: "Can I plan based on this date?", a: "Use it as a guideline. Your provider may revise the due date during prenatal visits." },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-medium text-muted-foreground">First day of last period</Label>
            <Input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} className="mt-1" />
          </div>
        </div>
        <div className="rounded-xl bg-muted/40 p-5">
          {r ? (
            <>
              <div className="text-sm text-muted-foreground">Estimated due date</div>
              <div className="text-3xl font-bold mt-1 text-gradient">
                {r.due.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </div>
              <dl className="grid grid-cols-2 gap-3 mt-4 text-sm">
                <div><dt className="text-muted-foreground">Current week</dt><dd className="font-semibold">{r.week}</dd></div>
                <div><dt className="text-muted-foreground">Trimester</dt><dd className="font-semibold">{r.trimester}</dd></div>
              </dl>
            </>
          ) : <p className="text-destructive text-sm">Please enter a valid date.</p>}
        </div>
      </div>
    </CalculatorPageLayout>
  );
}
