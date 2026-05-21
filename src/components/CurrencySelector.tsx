import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  CURRENCIES,
  POPULAR_CURRENCY_CODES,
  countryFlag,
  currencyLabel,
  getCurrencyByCode,
} from "@/lib/currencies";
import { useCurrency } from "@/hooks/use-currency";

type CurrencySelectorProps = {
  className?: string;
  compact?: boolean;
};

export function CurrencySelector({ className, compact }: CurrencySelectorProps) {
  const { code, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const selected = getCurrencyByCode(code);

  const popular = useMemo(
    () => POPULAR_CURRENCY_CODES.map((c) => getCurrencyByCode(c)),
    [],
  );
  const others = useMemo(
    () => CURRENCIES.filter((c) => !c.popular),
    [],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select currency"
          className={cn(
            "h-10 justify-between gap-2 rounded-lg border-input bg-[var(--input-background)] px-3 font-medium shadow-input hover:border-accent/30",
            "w-full sm:w-auto",
            compact ? "sm:min-w-[10.5rem]" : "sm:min-w-[14rem]",
            className,
          )}
        >
          <span className="flex items-center gap-2 truncate">
            <span className="text-base leading-none" aria-hidden>
              {countryFlag(selected.country)}
            </span>
            <span className="truncate text-sm">
              <span className="font-semibold text-foreground">{selected.code}</span>
              {!compact && (
                <span className="text-muted-foreground font-normal"> · {selected.symbol}</span>
              )}
            </span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[min(100vw-2rem,22rem)] p-0 rounded-xl border-border/80 shadow-card"
        align="end"
      >
        <Command>
          <CommandInput placeholder="Search currency…" className="h-11" />
          <CommandList className="max-h-[min(60vh,320px)]">
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup heading="Popular">
              {popular.map((c) => (
                <CurrencyCommandItem
                  key={c.code}
                  currency={c}
                  selected={code === c.code}
                  onSelect={() => {
                    setCurrency(c.code);
                    setOpen(false);
                  }}
                />
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="All currencies">
              {others.map((c) => (
                <CurrencyCommandItem
                  key={c.code}
                  currency={c}
                  selected={code === c.code}
                  onSelect={() => {
                    setCurrency(c.code);
                    setOpen(false);
                  }}
                />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function CurrencyCommandItem({
  currency,
  selected,
  onSelect,
}: {
  currency: ReturnType<typeof getCurrencyByCode>;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <CommandItem
      value={`${currency.code} ${currency.name} ${currency.symbol}`}
      onSelect={onSelect}
      className="gap-2 rounded-lg py-2.5"
    >
      <span className="text-lg leading-none" aria-hidden>
        {countryFlag(currency.country)}
      </span>
      <span className="flex flex-1 flex-col min-w-0">
        <span className="font-medium text-foreground">{currency.code}</span>
        <span className="text-xs text-muted-foreground truncate">
          {currency.name} ({currency.symbol})
        </span>
      </span>
      <Check className={cn("h-4 w-4 shrink-0 text-accent", selected ? "opacity-100" : "opacity-0")} />
    </CommandItem>
  );
}

/** Quick picks + searchable selector row for finance calculators */
export function CalculatorCurrencyBar({ className }: { className?: string }) {
  const { code, setCurrency } = useCurrency();

  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 pb-3 border-b border-border/60 min-w-0 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-2",
        className,
      )}
    >
      <div className="scroll-touch-x flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
        <span className="text-xs font-medium text-muted-foreground shrink-0">Currency</span>
        {POPULAR_CURRENCY_CODES.slice(0, 6).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCurrency(c)}
            className={cn(
              "shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium border min-h-[2.25rem] transition-colors duration-200 sm:px-3 sm:py-2",
              code === c
                ? "bg-accent/15 text-foreground border-accent/40"
                : "border-border/80 text-muted-foreground hover:bg-muted/80 hover:text-foreground active:bg-muted",
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <CurrencySelector compact className="w-full sm:w-auto sm:shrink-0" />
    </div>
  );
}
