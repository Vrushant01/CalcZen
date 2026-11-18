export interface HomeLoanInputs {
  loanAmount: number; // e.g. 5000000
  annualRatePct: number; // e.g. 8.5
  tenureYears: number; // e.g. 20
  prepaymentType?: "none" | "oneTime" | "recurringYearly";
  prepaymentAmount?: number; // e.g. 100000
  prepaymentMonth?: number; // month at which one-time prepayment occurs (e.g. 12)
  prepaymentEffect?: "reduceTenure" | "reduceEmi";
}

export interface HomeLoanAmortMonth {
  month: number;
  emi: number;
  prepayment: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface HomeLoanAmortYear {
  year: number;
  principalPaid: number;
  interestPaid: number;
  prepaymentPaid: number;
  endingBalance: number;
}

export interface HomeLoanResult {
  regularEmi: number;
  regularTotalInterest: number;
  regularTotalPayment: number;
  regularTenureMonths: number;

  hasPrepayment: boolean;
  effectiveEmi: number;
  effectiveTotalInterest: number;
  effectiveTotalPayment: number;
  effectiveTenureMonths: number;
  monthsSaved: number;
  interestSaved: number;
  totalSaved: number;

  schedule: HomeLoanAmortMonth[];
  yearlySummary: HomeLoanAmortYear[];
}

export function calculateHomeLoan(inputs: HomeLoanInputs): HomeLoanResult {
  const P = Math.max(0, Number(inputs.loanAmount) || 0);
  const annualRate = Math.max(0, Number(inputs.annualRatePct) || 0);
  const totalMonths = Math.max(1, Math.round((Number(inputs.tenureYears) || 1) * 12));
  const prepayType = inputs.prepaymentType || "none";
  const prepayAmt = Math.max(0, Number(inputs.prepaymentAmount) || 0);
  const prepayMonth = Math.max(1, Math.round(Number(inputs.prepaymentMonth) || 12));
  const prepayEffect = inputs.prepaymentEffect || "reduceTenure";

  const r = annualRate / 100 / 12;

  // 1. Regular baseline without prepayment
  let regularEmi = 0;
  if (P <= 0) {
    regularEmi = 0;
  } else if (r === 0) {
    regularEmi = P / totalMonths;
  } else {
    const f = Math.pow(1 + r, totalMonths);
    regularEmi = (P * r * f) / (f - 1);
  }

  const roundedRegularEmi = Math.round(regularEmi);
  let regBalance = P;
  let regularTotalInterest = 0;
  for (let m = 1; m <= totalMonths; m++) {
    const interest = regBalance * r;
    const prin = Math.min(regBalance, regularEmi - interest);
    regularTotalInterest += interest;
    regBalance = Math.max(0, regBalance - prin);
    if (regBalance <= 0) break;
  }
  const roundedRegularInterest = Math.round(regularTotalInterest);
  const regularTotalPayment = P + roundedRegularInterest;

  // 2. Prepayment simulation
  const hasPrepayment = prepayType !== "none" && prepayAmt > 0;
  let currentBalance = P;
  let currentEmi = regularEmi;
  let effectiveTotalInterest = 0;
  let effectiveTotalPrepayment = 0;

  const schedule: HomeLoanAmortMonth[] = [];
  let month = 1;
  const maxSimulationMonths = totalMonths + 12;

  while (currentBalance > 0.01 && month <= maxSimulationMonths) {
    const interest = currentBalance * r;
    let basePrin = currentEmi - interest;

    let extraPmt = 0;
    if (hasPrepayment) {
      if (prepayType === "oneTime" && month === prepayMonth) {
        extraPmt = prepayAmt;
      } else if (prepayType === "recurringYearly" && month % 12 === 0) {
        extraPmt = prepayAmt;
      }
    }

    // Limit extra payment so balance doesn't become negative
    if (basePrin + extraPmt > currentBalance) {
      if (basePrin > currentBalance) {
        basePrin = currentBalance;
        extraPmt = 0;
      } else {
        extraPmt = currentBalance - basePrin;
      }
    }

    const totalPrincipalThisMonth = basePrin + extraPmt;
    effectiveTotalInterest += interest;
    effectiveTotalPrepayment += extraPmt;
    currentBalance = Math.max(0, currentBalance - totalPrincipalThisMonth);

    schedule.push({
      month,
      emi: Math.round(basePrin + interest),
      prepayment: Math.round(extraPmt),
      interest: Math.round(interest),
      principal: Math.round(basePrin),
      balance: Math.round(currentBalance),
    });

    if (currentBalance <= 0.01) {
      break;
    }

    // If prepayment effect is reduce EMI, recalculate EMI for the remaining duration
    if (hasPrepayment && extraPmt > 0 && prepayEffect === "reduceEmi") {
      const remainingMonths = Math.max(1, totalMonths - month);
      if (r === 0) {
        currentEmi = currentBalance / remainingMonths;
      } else {
        const factor = Math.pow(1 + r, remainingMonths);
        currentEmi = (currentBalance * r * factor) / (factor - 1);
      }
    }

    month++;
  }

  const effectiveTenureMonths = schedule.length;
  const roundedEffectiveInterest = Math.round(effectiveTotalInterest);
  const roundedEffectivePrepayment = Math.round(effectiveTotalPrepayment);
  const effectiveTotalPayment = P + roundedEffectiveInterest + roundedEffectivePrepayment;

  const interestSaved = hasPrepayment ? Math.max(0, roundedRegularInterest - roundedEffectiveInterest) : 0;
  const monthsSaved = hasPrepayment ? Math.max(0, totalMonths - effectiveTenureMonths) : 0;
  const totalSaved = interestSaved;

  // Yearly summary
  const yearlySummary: HomeLoanAmortYear[] = [];
  const yearsCount = Math.ceil(schedule.length / 12);
  for (let y = 1; y <= yearsCount; y++) {
    const sIdx = (y - 1) * 12;
    const eIdx = Math.min(schedule.length, y * 12);
    const slice = schedule.slice(sIdx, eIdx);

    const prinPaid = slice.reduce((sum, item) => sum + item.principal, 0);
    const intPaid = slice.reduce((sum, item) => sum + item.interest, 0);
    const prepPaid = slice.reduce((sum, item) => sum + item.prepayment, 0);
    const endBal = slice.length > 0 ? slice[slice.length - 1].balance : 0;

    yearlySummary.push({
      year: y,
      principalPaid: prinPaid,
      interestPaid: intPaid,
      prepaymentPaid: prepPaid,
      endingBalance: endBal,
    });
  }

  return {
    regularEmi: roundedRegularEmi,
    regularTotalInterest: roundedRegularInterest,
    regularTotalPayment,
    regularTenureMonths: totalMonths,

    hasPrepayment,
    effectiveEmi: Math.round(currentEmi),
    effectiveTotalInterest: roundedEffectiveInterest,
    effectiveTotalPayment,
    effectiveTenureMonths,
    monthsSaved,
    interestSaved,
    totalSaved,

    schedule,
    yearlySummary,
  };
}
