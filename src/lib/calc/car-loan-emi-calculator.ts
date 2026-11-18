export interface CarLoanInputs {
  carPrice: number;
  downPayment: number; // in ₹
  loanAmount?: number; // override if entered
  annualRatePct: number; // e.g. 9 for 9%
  tenureMonths: number; // e.g. 60 for 5 years
  processingFeePct?: number; // e.g. 1 for 1%
}

export interface AmortizationMonth {
  month: number;
  emi: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface AmortizationYear {
  year: number;
  principal: number;
  interest: number;
  endingBalance: number;
}

export interface TenureComparisonRow {
  years: number;
  months: number;
  emi: number;
  totalInterest: number;
  totalPayment: number;
}

export interface CarLoanResult {
  principal: number;
  emi: number;
  totalInterest: number;
  totalPayment: number;
  processingFeeAmount: number;
  totalCostWithFee: number;
  loanToPricePct: number;
  interestToPrincipalPct: number;
  schedule: AmortizationMonth[];
  yearlySummary: AmortizationYear[];
  tenureComparison: TenureComparisonRow[];
}

export function calculateCarLoanEMI(inputs: CarLoanInputs): CarLoanResult {
  const carPrice = Math.max(0, Number(inputs.carPrice) || 0);
  const downPayment = Math.max(0, Math.min(carPrice, Number(inputs.downPayment) || 0));
  const principal =
    inputs.loanAmount !== undefined && Number(inputs.loanAmount) > 0
      ? Number(inputs.loanAmount)
      : Math.max(0, carPrice - downPayment);

  const annualRate = Math.max(0, Number(inputs.annualRatePct) || 0);
  const n = Math.max(1, Math.round(Number(inputs.tenureMonths) || 1));
  const feePct = Math.max(0, Number(inputs.processingFeePct) || 0);

  const r = annualRate / 100 / 12;

  let emi = 0;
  if (principal <= 0) {
    emi = 0;
  } else if (r === 0) {
    emi = principal / n;
  } else {
    const factor = Math.pow(1 + r, n);
    emi = (principal * r * factor) / (factor - 1);
  }

  // Monthly schedule
  let balance = principal;
  const schedule: AmortizationMonth[] = [];
  let totalInterest = 0;

  for (let m = 1; m <= n; m++) {
    const interest = balance * r;
    let prin = emi - interest;

    if (m === n || prin > balance) {
      prin = balance;
      balance = 0;
    } else {
      balance = Math.max(0, balance - prin);
    }

    totalInterest += interest;

    schedule.push({
      month: m,
      emi: Math.round(prin + interest),
      interest: Math.round(interest),
      principal: Math.round(prin),
      balance: Math.round(balance),
    });
  }

  const roundedEmi = Math.round(emi);
  const roundedTotalInterest = Math.round(totalInterest);
  const totalPayment = principal + roundedTotalInterest;
  const processingFeeAmount = Math.round((principal * feePct) / 100);
  const totalCostWithFee = totalPayment + processingFeeAmount;

  const loanToPricePct = carPrice > 0 ? (principal / carPrice) * 100 : 0;
  const interestToPrincipalPct = principal > 0 ? (roundedTotalInterest / principal) * 100 : 0;

  // Yearly summary
  const yearlySummary: AmortizationYear[] = [];
  const totalYears = Math.ceil(n / 12);
  for (let y = 1; y <= totalYears; y++) {
    const startIdx = (y - 1) * 12;
    const endIdx = Math.min(n, y * 12);
    const monthsSlice = schedule.slice(startIdx, endIdx);
    const yPrin = monthsSlice.reduce((sum, item) => sum + item.principal, 0);
    const yInt = monthsSlice.reduce((sum, item) => sum + item.interest, 0);
    const endBal = monthsSlice.length > 0 ? monthsSlice[monthsSlice.length - 1].balance : 0;

    yearlySummary.push({
      year: y,
      principal: yPrin,
      interest: yInt,
      endingBalance: endBal,
    });
  }

  // Tenure comparisons for 3, 4, 5, 7 years
  const compTenures = [3, 4, 5, 7];
  const tenureComparison: TenureComparisonRow[] = compTenures.map((yr) => {
    const mCount = yr * 12;
    let tEmi = 0;
    if (principal <= 0) {
      tEmi = 0;
    } else if (r === 0) {
      tEmi = principal / mCount;
    } else {
      const f = Math.pow(1 + r, mCount);
      tEmi = (principal * r * f) / (f - 1);
    }
    const tPay = Math.round(tEmi * mCount);
    const tInt = tPay - principal;
    return {
      years: yr,
      months: mCount,
      emi: Math.round(tEmi),
      totalInterest: Math.max(0, tInt),
      totalPayment: tPay,
    };
  });

  return {
    principal,
    emi: roundedEmi,
    totalInterest: roundedTotalInterest,
    totalPayment,
    processingFeeAmount,
    totalCostWithFee,
    loanToPricePct: Number(loanToPricePct.toFixed(1)),
    interestToPrincipalPct: Number(interestToPrincipalPct.toFixed(1)),
    schedule,
    yearlySummary,
    tenureComparison,
  };
}
