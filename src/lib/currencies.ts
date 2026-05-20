/** ISO 4217 currency definitions for finance calculators */
export type CurrencyDefinition = {
  code: string;
  name: string;
  symbol: string;
  /** BCP 47 locale for Intl.NumberFormat */
  locale: string;
  /** ISO 3166-1 alpha-2 for flag emoji */
  country: string;
  fractionDigits: number;
  popular?: boolean;
};

export const CURRENCIES: CurrencyDefinition[] = [
  { code: "USD", name: "US Dollar", symbol: "$", locale: "en-US", country: "US", fractionDigits: 2, popular: true },
  { code: "EUR", name: "Euro", symbol: "€", locale: "de-DE", country: "EU", fractionDigits: 2, popular: true },
  { code: "GBP", name: "British Pound", symbol: "£", locale: "en-GB", country: "GB", fractionDigits: 2, popular: true },
  { code: "INR", name: "Indian Rupee", symbol: "₹", locale: "en-IN", country: "IN", fractionDigits: 2, popular: true },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", locale: "en-AU", country: "AU", fractionDigits: 2, popular: true },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", locale: "en-CA", country: "CA", fractionDigits: 2, popular: true },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", locale: "ja-JP", country: "JP", fractionDigits: 0, popular: true },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", locale: "zh-CN", country: "CN", fractionDigits: 2, popular: true },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", locale: "de-CH", country: "CH", fractionDigits: 2, popular: true },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", locale: "en-SG", country: "SG", fractionDigits: 2, popular: true },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", locale: "ar-AE", country: "AE", fractionDigits: 2, popular: true },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", locale: "en-HK", country: "HK", fractionDigits: 2 },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", locale: "en-NZ", country: "NZ", fractionDigits: 2 },
  { code: "ZAR", name: "South African Rand", symbol: "R", locale: "en-ZA", country: "ZA", fractionDigits: 2 },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", locale: "ar-SA", country: "SA", fractionDigits: 2 },
  { code: "KRW", name: "South Korean Won", symbol: "₩", locale: "ko-KR", country: "KR", fractionDigits: 0 },
  { code: "MXN", name: "Mexican Peso", symbol: "$", locale: "es-MX", country: "MX", fractionDigits: 2 },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", locale: "pt-BR", country: "BR", fractionDigits: 2 },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", locale: "ru-RU", country: "RU", fractionDigits: 2 },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", locale: "tr-TR", country: "TR", fractionDigits: 2 },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", locale: "sv-SE", country: "SE", fractionDigits: 2 },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", locale: "nb-NO", country: "NO", fractionDigits: 2 },
  { code: "DKK", name: "Danish Krone", symbol: "kr", locale: "da-DK", country: "DK", fractionDigits: 2 },
  { code: "PLN", name: "Polish Złoty", symbol: "zł", locale: "pl-PL", country: "PL", fractionDigits: 2 },
  { code: "THB", name: "Thai Baht", symbol: "฿", locale: "th-TH", country: "TH", fractionDigits: 2 },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", locale: "ms-MY", country: "MY", fractionDigits: 2 },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", locale: "en-PH", country: "PH", fractionDigits: 2 },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", locale: "id-ID", country: "ID", fractionDigits: 0 },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", locale: "vi-VN", country: "VN", fractionDigits: 0 },
  { code: "ILS", name: "Israeli Shekel", symbol: "₪", locale: "he-IL", country: "IL", fractionDigits: 2 },
  { code: "ARS", name: "Argentine Peso", symbol: "$", locale: "es-AR", country: "AR", fractionDigits: 2 },
  { code: "CLP", name: "Chilean Peso", symbol: "$", locale: "es-CL", country: "CL", fractionDigits: 0 },
  { code: "COP", name: "Colombian Peso", symbol: "$", locale: "es-CO", country: "CO", fractionDigits: 0 },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£", locale: "ar-EG", country: "EG", fractionDigits: 2 },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", locale: "en-NG", country: "NG", fractionDigits: 2 },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", locale: "en-PK", country: "PK", fractionDigits: 2 },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", locale: "bn-BD", country: "BD", fractionDigits: 2 },
  { code: "TWD", name: "Taiwan Dollar", symbol: "NT$", locale: "zh-TW", country: "TW", fractionDigits: 2 },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴", locale: "uk-UA", country: "UA", fractionDigits: 2 },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", locale: "cs-CZ", country: "CZ", fractionDigits: 2 },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", locale: "hu-HU", country: "HU", fractionDigits: 0 },
  { code: "RON", name: "Romanian Leu", symbol: "lei", locale: "ro-RO", country: "RO", fractionDigits: 2 },
  { code: "ISK", name: "Icelandic Króna", symbol: "kr", locale: "is-IS", country: "IS", fractionDigits: 0 },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", locale: "en-KE", country: "KE", fractionDigits: 2 },
  { code: "QAR", name: "Qatari Riyal", symbol: "﷼", locale: "ar-QA", country: "QA", fractionDigits: 2 },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", locale: "ar-KW", country: "KW", fractionDigits: 3 },
  { code: "BHD", name: "Bahraini Dinar", symbol: ".د.ب", locale: "ar-BH", country: "BH", fractionDigits: 3 },
  { code: "OMR", name: "Omani Rial", symbol: "﷼", locale: "ar-OM", country: "OM", fractionDigits: 3 },
];

const currencyByCode = new Map(CURRENCIES.map((c) => [c.code, c]));

export const DEFAULT_CURRENCY_CODE = "USD";

export const POPULAR_CURRENCY_CODES = CURRENCIES.filter((c) => c.popular).map((c) => c.code);

export function getCurrencyByCode(code: string): CurrencyDefinition {
  return currencyByCode.get(code) ?? currencyByCode.get(DEFAULT_CURRENCY_CODE)!;
}

/** Region (ISO 3166-1) → default currency for locale auto-detect */
const REGION_CURRENCY: Record<string, string> = {
  US: "USD", CA: "CAD", GB: "GBP", AU: "AUD", NZ: "NZD",
  IN: "INR", JP: "JPY", CN: "CNY", HK: "HKD", TW: "TWD",
  KR: "KRW", SG: "SGD", MY: "MYR", TH: "THB", ID: "IDR", VN: "VND", PH: "PHP",
  AE: "AED", SA: "SAR", QA: "QAR", KW: "KWD", BH: "BHD", OM: "OMR", IL: "ILS",
  CH: "CHF", SE: "SEK", NO: "NOK", DK: "DKK", PL: "PLN", CZ: "CZK", HU: "HUF",
  RO: "RON", IS: "ISK", UA: "UAH", RU: "RUB", TR: "TRY",
  BR: "BRL", MX: "MXN", AR: "ARS", CL: "CLP", CO: "COP",
  ZA: "ZAR", EG: "EGP", NG: "NGN", KE: "KES",
  PK: "PKR", BD: "BDT",
  AT: "EUR", BE: "EUR", DE: "EUR", ES: "EUR", FR: "EUR", IT: "EUR", NL: "EUR", PT: "EUR", IE: "EUR", FI: "EUR", GR: "EUR",
};

export function detectCurrencyCodeFromLocale(): string {
  if (typeof navigator === "undefined") return DEFAULT_CURRENCY_CODE;
  try {
    const locale = navigator.language || "en-US";
    const region = new Intl.Locale(locale).maximize().region;
    if (region && REGION_CURRENCY[region]) return REGION_CURRENCY[region];
  } catch {
    /* Intl.Locale unsupported */
  }
  return DEFAULT_CURRENCY_CODE;
}

/** Unicode regional indicator flag from ISO country code */
export function countryFlag(country: string): string {
  if (country === "EU") return "🇪🇺";
  const code = country.toUpperCase();
  if (code.length !== 2) return "🌐";
  return String.fromCodePoint(
    ...[...code].map((c) => 0x1f1e6 - 65 + c.charCodeAt(0)),
  );
}

export function currencyLabel(c: CurrencyDefinition): string {
  return `${c.code} — ${c.name} (${c.symbol})`;
}

/** Calculator slugs that display monetary values */
export const CURRENCY_CALCULATOR_SLUGS = new Set([
  "mortgage-calculator",
  "compound-interest-calculator",
  "loan-emi-calculator",
  "tip-calculator",
]);

export function calculatorUsesCurrency(slug: string): boolean {
  return CURRENCY_CALCULATOR_SLUGS.has(slug);
}
