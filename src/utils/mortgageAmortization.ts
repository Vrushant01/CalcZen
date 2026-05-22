import { formatPdfUsd } from "@/utils/formatPdfUsd";

export function buildYearlyAmortizationRows(
  principal: number,
  annualRate: number,
  years: number,
  maxYears = 20,
): string[][] {
  if (principal <= 0 || years <= 0) return [];

  const r = annualRate / 100 / 12;
  const n = years * 12;
  const monthlyPi =
    r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  let balance = principal;
  const rows: string[][] = [];
  const yearsToShow = Math.min(years, maxYears);

  for (let year = 1; year <= yearsToShow; year++) {
    let yearPrincipal = 0;
    let yearInterest = 0;
    for (let m = 0; m < 12; m++) {
      const interest = balance * r;
      const principalPaid = monthlyPi - interest;
      yearPrincipal += principalPaid;
      yearInterest += interest;
      balance = Math.max(0, balance - principalPaid);
    }
    rows.push([
      String(year),
      formatPdfUsd(yearPrincipal),
      formatPdfUsd(yearInterest),
      formatPdfUsd(balance),
    ]);
  }

  return rows;
}
