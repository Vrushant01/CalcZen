import {
  CURRENCIES,
  DEFAULT_CURRENCY_CODE,
  detectCurrencyCodeFromLocale,
  getCurrencyByCode,
  type CurrencyDefinition,
} from "@/lib/currencies";

export const CURRENCY_STORAGE_KEY = "calczen-currency";

const listeners = new Set<() => void>();

let currentCode = DEFAULT_CURRENCY_CODE;

if (typeof window !== "undefined") {
  currentCode = readStoredCode();
}

function readStoredCode(): string {
  if (typeof window === "undefined") return DEFAULT_CURRENCY_CODE;
  try {
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (stored && CURRENCIES.some((c) => c.code === stored)) return stored;
  } catch {
    /* blocked storage */
  }
  return detectCurrencyCodeFromLocale();
}

function notify() {
  listeners.forEach((l) => l());
}

export function subscribeCurrency(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCurrencyCode(): string {
  return currentCode;
}

export function getCurrency(): CurrencyDefinition {
  return getCurrencyByCode(currentCode);
}

export function setCurrencyCode(code: string) {
  if (!CURRENCIES.some((c) => c.code === code)) return;
  currentCode = code;
  try {
    localStorage.setItem(CURRENCY_STORAGE_KEY, code);
  } catch {
    /* private browsing */
  }
  notify();
}

export function getCurrencySnapshot(): string {
  return getCurrencyCode();
}
