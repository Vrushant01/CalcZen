export type GoldPurityKarat = "24K" | "22K" | "18K" | "14K";
export type GoldRepaymentType = "emi" | "monthlyInterest" | "bullet";

export interface GoldLoanInputs {
  weightGrams: number;
  karat: GoldPurityKarat;
  goldRate24kPerGram: number; // e.g. 7500
  ltvPercent?: number; // default 75
  annualRatePct: number; // e.g. 10.5
  tenureMonths: number; // e.g. 12
  repaymentType: GoldRepaymentType;
  processingFeePct?: number; // e.g. 0.5
}

export interface GoldLoanResult {
  purityFactor: number;
  goldValue: number;
  eligibleLoan: number;
  monthlyOutflow: number; // monthly EMI or monthly interest, or 0 for bullet
  totalInterest: number;
  processingFeeAmount: number;
  totalRepayment: number;
  effectiveCostPct: number;
  repaymentType: GoldRepaymentType;
}

const PURITY_FACTORS: Record<GoldPurityKarat, number> = {
  "24K": 1.0,
  "22K": 22 / 24, // 0.9166667
  "18K": 18 / 24, // 0.75
  "14K": 14 / 24, // 0.5833333
};

export function getGoldPurityFactor(karat: GoldPurityKarat): number {
  return PURITY_FACTORS[karat] || PURITY_FACTORS["22K"];
}

export function calculateGoldLoan(inputs: GoldLoanInputs): GoldLoanResult {
  const weight = Math.max(0, Number(inputs.weightGrams) || 0);
  const purityFactor = getGoldPurityFactor(inputs.karat);
  const rate24k = Math.max(0, Number(inputs.goldRate24kPerGram) || 0);
  const ltv = Math.max(0, Math.min(100, inputs.ltvPercent !== undefined ? Number(inputs.ltvPercent) : 75));
  const annualRate = Math.max(0, Number(inputs.annualRatePct) || 0);
  const n = Math.max(1, Math.round(Number(inputs.tenureMonths) || 12));
  const feePct = Math.max(0, Number(inputs.processingFeePct) || 0);
  const type = inputs.repaymentType || "emi";

  // Gold value = weight * per-gram rate for that purity
  const goldValue = Math.round(weight * rate24k * purityFactor);
  // Eligible loan = Gold value * LTV%
  const eligibleLoan = Math.round((goldValue * ltv) / 100);

  const r = annualRate / 100 / 12;
  let monthlyOutflow = 0;
  let totalInterest = 0;

  if (eligibleLoan <= 0) {
    monthlyOutflow = 0;
    totalInterest = 0;
  } else if (type === "emi") {
    // Standard reducing balance EMI
    if (r === 0) {
      monthlyOutflow = eligibleLoan / n;
      totalInterest = 0;
    } else {
      const f = Math.pow(1 + r, n);
      monthlyOutflow = (eligibleLoan * r * f) / (f - 1);
      totalInterest = monthlyOutflow * n - eligibleLoan;
    }
  } else if (type === "monthlyInterest") {
    // Pay monthly simple interest; principal repaid in lump sum at end
    const monthlyInt = eligibleLoan * r;
    monthlyOutflow = monthlyInt;
    totalInterest = monthlyInt * n;
  } else if (type === "bullet") {
    // Bullet repayment: interest compounds or accumulates and is paid alongside principal at end
    // Most Indian gold loan bullet schemes use monthly compounding or simple interest for tenure <= 12m
    // As per RBI guidelines, bullet loans (up to 12m) charge interest compounded monthly or simple interest
    const f = Math.pow(1 + r, n);
    const totalDueAtEnd = eligibleLoan * f;
    totalInterest = totalDueAtEnd - eligibleLoan;
    monthlyOutflow = 0; // zero monthly payment
  }

  const roundedMonthlyOutflow = Math.round(monthlyOutflow);
  const roundedTotalInterest = Math.round(totalInterest);
  const processingFeeAmount = Math.round((eligibleLoan * feePct) / 100);
  const totalRepayment = eligibleLoan + roundedTotalInterest + processingFeeAmount;
  const effectiveCostPct =
    eligibleLoan > 0 ? Number((((roundedTotalInterest + processingFeeAmount) / eligibleLoan) * 100).toFixed(2)) : 0;

  return {
    purityFactor: Number(purityFactor.toFixed(4)),
    goldValue,
    eligibleLoan,
    monthlyOutflow: roundedMonthlyOutflow,
    totalInterest: roundedTotalInterest,
    processingFeeAmount,
    totalRepayment,
    effectiveCostPct,
    repaymentType: type,
  };
}
