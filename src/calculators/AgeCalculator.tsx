import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCalculator } from "@/data/calculators";

export function AgeCalculator() {
  const calc = getCalculator("age-calculator")!;
  const today = new Date().toISOString().slice(0, 10);
  const [dob, setDob] = useState("1995-06-15");
  const [on, setOn] = useState(today);

  const r = useMemo(() => {
    const a = new Date(dob), b = new Date(on);
    if (isNaN(a.getTime()) || isNaN(b.getTime()) || a > b) return null;
    let years = b.getFullYear() - a.getFullYear();
    let months = b.getMonth() - a.getMonth();
    let days = b.getDate() - a.getDate();
    if (days < 0) { months--; days += new Date(b.getFullYear(), b.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    const totalDays = Math.floor((b.getTime() - a.getTime()) / 86400000);
    return { years, months, days, totalDays, totalHours: totalDays * 24, totalMinutes: totalDays * 24 * 60 };
  }, [dob, on]);

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Find your exact age in years, months and days, plus total days, hours and minutes you've been alive — calculated as of any date you choose."
      formula={`Age = (target date) − (date of birth)
Borrow days from the previous month and months from the previous year as needed.`}
      example={`Born 1995-06-15, today 2025-01-10:
29 years, 6 months, 26 days lived.`}
      faqs={[
        { q: "Does it count leap years?", a: "Yes — calculations use real calendar dates so leap years are handled automatically." },
        { q: "Can I check age on a future date?", a: "Yes. Set the 'as of' date to any date in the future to find someone's age then." },
        { q: "Why does the day count look off by one sometimes?", a: "We use the date difference. Time zones and the same calendar day can shift the count by one — switch the 'as of' date to verify." },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Date of birth</Label>
            <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground">As of</Label>
            <Input type="date" value={on} onChange={(e) => setOn(e.target.value)} className="mt-1" />
          </div>
        </div>
        <div className="rounded-xl bg-muted/40 p-5">
          {r ? (
            <>
              <div className="text-sm text-muted-foreground">Your age</div>
              <div className="text-3xl font-bold mt-1 text-gradient">{r.years} years, {r.months} months, {r.days} days</div>
              <dl className="grid grid-cols-3 gap-3 mt-5 text-sm">
                <div><dt className="text-muted-foreground">Days</dt><dd className="font-semibold">{r.totalDays.toLocaleString()}</dd></div>
                <div><dt className="text-muted-foreground">Hours</dt><dd className="font-semibold">{r.totalHours.toLocaleString()}</dd></div>
                <div><dt className="text-muted-foreground">Minutes</dt><dd className="font-semibold">{r.totalMinutes.toLocaleString()}</dd></div>
              </dl>
            </>
          ) : (
            <p className="text-sm text-destructive">Please enter a valid birth date before the target date.</p>
          )}
        </div>
      </div>
    </CalculatorPageLayout>
  );
}
