import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type PercentFieldProps = {
  label: string;
  value: number | "";
  onChange: (value: number | "") => void;
  step?: number;
  min?: number;
  max?: number;
  className?: string;
  id?: string;
};

/** Standard percent input with '%' suffix */
export function PercentField({
  label,
  value,
  onChange,
  step = 1,
  min,
  max,
  className,
  id,
}: PercentFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={className}>
      <Label htmlFor={fieldId} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="mt-1 relative">
        <Input
          id={fieldId}
          type="number"
          step={step}
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === "" ? "" : Number(v));
          }}
          className="pr-8"
        />
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none"
          aria-hidden
        >
          %
        </span>
      </div>
    </div>
  );
}
