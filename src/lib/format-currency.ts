import type { CurrencyDefinition } from "@/lib/currencies";

export type FormatCurrencyOptions = {
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
};

export function formatCurrencyAmount(
  amount: number,
  currency: CurrencyDefinition,
  options?: FormatCurrencyOptions,
): string {
  const maxDigits = options?.maximumFractionDigits ?? currency.fractionDigits;
  const minDigits =
    options?.minimumFractionDigits ??
    (currency.fractionDigits === 0 ? 0 : Math.min(2, maxDigits));

  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    maximumFractionDigits: maxDigits,
    minimumFractionDigits: minDigits,
  }).format(amount);
}

/** Compact formatter for chart axis ticks */
export function formatCurrencyAxisTick(value: number, currency: CurrencyDefinition): string {
  const sym = currency.symbol;
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${sym}${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sym}${(value / 1_000).toFixed(0)}k`;
  return `${sym}${value}`;
}
