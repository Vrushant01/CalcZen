import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrency } from "@/hooks/use-currency";
import { cn } from "@/lib/utils";

type MoneyFieldProps = {
  label: string;
  value: number | "";
  onChange: (value: number | "") => void;
  step?: number;
  className?: string;
  id?: string;
};

/** Currency-aware money input with dynamic symbol prefix */
export function MoneyField({ label, value, onChange, step = 1, className, id }: MoneyFieldProps) {
  const { symbol } = useCurrency();
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  const prefixLen =
    symbol.length > 3 ? "pl-14 sm:pl-12" : symbol.length > 1 ? "pl-10 sm:pl-8" : "pl-8";

  return (
    <div className={className}>
      <Label htmlFor={fieldId} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="mt-1 relative">
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none max-w-[2.5rem] truncate"
          aria-hidden
        >
          {symbol}
        </span>
        <Input
          id={fieldId}
          type="number"
          step={step}
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === "" ? "" : Number(v));
          }}
          className={cn(prefixLen)}
        />
      </div>
    </div>
  );
}
