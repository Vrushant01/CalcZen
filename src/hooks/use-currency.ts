import { useCallback, useSyncExternalStore } from "react";
import type { CurrencyDefinition } from "@/lib/currencies";
import {
  formatCurrencyAmount,
  formatCurrencyAxisTick,
  type FormatCurrencyOptions,
} from "@/lib/format-currency";
import {
  getCurrency,
  getCurrencyCode,
  setCurrencyCode,
  subscribeCurrency,
} from "@/lib/currency-store";

export function useCurrency() {
  const code = useSyncExternalStore(subscribeCurrency, getCurrencyCode, () => getCurrencyCode());
  const currency = useSyncExternalStore(
    subscribeCurrency,
    getCurrency,
    () => getCurrency(),
  );

  const setCurrency = useCallback((next: string) => {
    setCurrencyCode(next);
  }, []);

  const format = useCallback(
    (amount: number, options?: FormatCurrencyOptions) =>
      formatCurrencyAmount(amount, currency, options),
    [currency],
  );

  const formatAxis = useCallback(
    (value: number) => formatCurrencyAxisTick(value, currency),
    [currency],
  );

  return {
    code,
    currency,
    setCurrency,
    format,
    formatAxis,
    symbol: currency.symbol,
  };
}

export type UseCurrencyReturn = ReturnType<typeof useCurrency>;
