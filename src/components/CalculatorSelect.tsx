import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type CalculatorSelectOption = {
  value: string;
  label: string;
};

type CalculatorSelectProps = {
  label: string;
  value: string | number;
  onValueChange: (value: string) => void;
  options: CalculatorSelectOption[];
  className?: string;
  triggerClassName?: string;
  placeholder?: string;
  id?: string;
};

/** Labeled select for calculator forms — matches Input field spacing */
export function CalculatorSelect({
  label,
  value,
  onValueChange,
  options,
  className,
  triggerClassName,
  placeholder = "Choose an option",
  id,
}: CalculatorSelectProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={className}>
      <Label htmlFor={fieldId} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <Select value={String(value)} onValueChange={onValueChange}>
        <SelectTrigger id={fieldId} className={cn("mt-1", triggerClassName)} aria-label={label}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
