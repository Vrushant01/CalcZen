import {
  calculateSalaryBreakdown,
  calculateNewRegimeTax,
  calculateOldRegimeTax,
  calculateHRAExemption,
  calculateProfessionalTax,
  formatINR,
  type SalaryCalculatorInputs,
} from "../src/utils/salaryCalculatorUtils";

function runTests() {
  console.log("=================================================");
  console.log("CALCZEN CTC TO IN-HAND SALARY CALCULATOR TEST SUITE");
  console.log("FY 2026-27 (Assessment Year 2027-28)");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string, details?: any) {
    if (condition) {
      console.log(`[PASS] ${desc}`);
      passed++;
    } else {
      console.error(`[FAIL] ${desc}`);
      if (details) console.error("Details:", details);
      failed++;
    }
  }

  // ------------------------------------------------------------------
  // 1. Core CTC Scenarios (Standard Structure, Gujarat, New Tax Regime)
  // ------------------------------------------------------------------
  const ctcValues = [
    300000, 500000, 800000, 1200000, 1500000, 2000000, 3000000, 5000000,
  ];

  for (const ctc of ctcValues) {
    const inputs: SalaryCalculatorInputs = {
      annualCTC: ctc,
      financialYear: "FY 2026-27",
      state: "Gujarat",
      regime: "new",
      structureType: "standard",
      basicPercentage: 50,
      hraPercentage: 40,
      cityType: "non-metro",
      monthlyRentPaid: 0,
      annualVariablePay: 0,
      includeEmployeePF: true,
      includeEmployerPFInCTC: true,
      pfCappedAtStatutoryCeiling: true,
      vpfPercentage: 0,
      includeGratuityInCTC: true,
      gratuityOverride: 0,
      employerNPSPercentage: 0,
      otherEmployerBenefits: 0,
      section80C: 0,
      section80D: 0,
      section80CCD1B: 0,
      homeLoanInterest80EEA: 0,
      otherTaxDeductions: 0,
      monthlyEmployeeInsurance: 0,
      otherMonthlyDeductions: 0,
    };

    const res = calculateSalaryBreakdown(inputs);

    // Test CTC Reconciliation
    const totalAccounted =
      res.annualFixedGross +
      res.totalAnnualEmployerContributions +
      res.annualVariablePay;
    const diff = Math.abs(res.annualCTC - totalAccounted);

    assert(
      diff <= 2,
      `CTC Reconciliation for ${formatINR(ctc)}: Accounted = ${formatINR(totalAccounted)}, diff = ${diff}`,
    );

    // Monthly in-hand sanity check
    assert(
      res.monthlyInHand > 0,
      `Monthly In-Hand for ${formatINR(ctc)} is positive: ${formatINR(res.monthlyInHand)}/mo`,
    );

    // Monthly * 12 <= Annual Fixed Gross
    assert(
      res.annualInHand <= res.annualFixedGross,
      `Annual In-Hand (${formatINR(res.annualInHand)}) <= Fixed Gross (${formatINR(res.annualFixedGross)})`,
    );

    console.log(
      `   > ${formatINR(ctc)} CTC: Monthly Gross=${formatINR(res.monthlyFixedGross)}, Monthly In-Hand=${formatINR(res.monthlyInHand)}, Annual Tax=${formatINR(res.taxBreakdown.totalAnnualTax)}`,
    );
  }

  // ------------------------------------------------------------------
  // 2. Section 87A Rebate & Standard Deduction Verification (New Regime)
  // ------------------------------------------------------------------
  console.log("\n--- Testing Section 87A Rebate & Standard Deduction ---");

  // Gross of ₹7,75,000 under New Regime:
  // Standard Deduction: ₹75,000 -> Taxable Income: ₹7,00,000.
  // Tax on ₹7,00,000: (0 to 3L: 0) + (3L to 7L @ 5%: ₹20,000) = ₹20,000? Wait, 3L to 7L is 4L * 5% = 20,000.
  // Wait, rebate under 87A: up to ₹25,000! Tax payable is ₹0!
  const tax775k = calculateNewRegimeTax(775000);
  assert(
    tax775k.taxableIncome === 700000,
    `Taxable income for ₹7,75,000 gross with ₹75k std deduction is ₹7,00,000`,
    tax775k,
  );
  assert(
    tax775k.totalAnnualTax === 0,
    `Total tax for ₹7,75,000 gross is ₹0 due to Section 87A rebate`,
    tax775k,
  );

  // ------------------------------------------------------------------
  // 3. Marginal Relief under Section 87A (New Regime)
  // ------------------------------------------------------------------
  console.log("\n--- Testing Marginal Relief under Section 87A ---");
  // Gross of ₹7,85,000 -> Taxable Income: ₹7,10,000 (exceeds ₹7,00,000 by ₹10,000)
  // Normal slab tax: 3L-7L (₹20,000) + 7L-7.1L (₹10,000 @ 10% = ₹1,000) = ₹21,000.
  // Marginal relief: Tax payable cannot exceed excess income over ₹7,00,000 = ₹10,000!
  // Tax before cess = ₹10,000. Plus 4% cess = ₹10,400.
  const tax785k = calculateNewRegimeTax(785000);
  assert(
    tax785k.taxAfterRebate === 10000,
    `Marginal relief caps tax before cess at ₹10,000 for ₹7,10,000 taxable income`,
    tax785k,
  );
  assert(
    tax785k.totalAnnualTax === 10400,
    `Total tax with 4% cess is ₹10,400 for ₹7,85,000 gross`,
    tax785k,
  );

  // ------------------------------------------------------------------
  // 4. Old Tax Regime with HRA, 80C, 80D, and Home Loan
  // ------------------------------------------------------------------
  console.log("\n--- Testing Old Tax Regime Deductions ---");
  const oldTaxTest = calculateOldRegimeTax(1200000, {
    professionalTax: 2400,
    hraExemption: 150000,
    section80C: 150000,
    section80D: 25000,
    section80CCD1B: 50000,
    section80CCD2: 0,
    homeLoanInterest: 200000,
    otherDeductions: 0,
  });

  // Standard deduction: 50,000
  // Total deductions: 50,000 + 2,400 + 1,50,000 + 1,50,000 + 25,000 + 50,000 + 2,00,000 = 6,27,400
  // Taxable: 12,00,000 - 6,27,400 = 5,72,600
  // Slabs: 0-2.5L: 0, 2.5-5L: 12,500, 5L-5.726L: 72,600 * 20% = 14,520. Total slab tax = 27,020.
  // Cess @ 4%: 27,020 * 0.04 = 1,080.8 -> 1,081. Total = 28,101.
  assert(
    oldTaxTest.taxableIncome === 572600,
    `Old regime taxable income is ₹5,72,600`,
    oldTaxTest,
  );
  assert(
    oldTaxTest.slabTax === 27020,
    `Old regime slab tax is ₹27,020`,
    oldTaxTest,
  );

  // ------------------------------------------------------------------
  // 5. HRA Exemption Calculation
  // ------------------------------------------------------------------
  console.log("\n--- Testing HRA Exemption Logic ---");
  // Basic: 6,00,000/yr, HRA: 2,40,000/yr, Rent: 25,000/mo = 3,00,000/yr. Metro: Mumbai
  // 1. Actual HRA: 2,40,000
  // 2. Rent - 10% Basic: 3,00,000 - 60,000 = 2,40,000
  // 3. 50% Basic (Metro): 3,00,000
  // Exemption = Min(2.4L, 2.4L, 3.0L) = 2,40,000
  const hraExempt = calculateHRAExemption(600000, 240000, 300000, "metro");
  assert(hraExempt === 240000, `HRA Exemption calculated correctly as ₹2,40,000`);

  // ------------------------------------------------------------------
  // 6. Professional Tax by State
  // ------------------------------------------------------------------
  console.log("\n--- Testing Professional Tax by State ---");
  const ptGujarat = calculateProfessionalTax("Gujarat", 50000);
  const ptMaharashtra = calculateProfessionalTax("Maharashtra", 50000);
  const ptKarnataka = calculateProfessionalTax("Karnataka", 50000);
  const ptDelhi = calculateProfessionalTax("Delhi", 50000);

  assert(ptGujarat === 200, `Gujarat PT for ₹50,000/mo is ₹200`);
  assert(ptMaharashtra === 208.33, `Maharashtra PT for ₹50,000/mo is ₹208.33`);
  assert(ptKarnataka === 200, `Karnataka PT for ₹50,000/mo is ₹200`);
  assert(ptDelhi === 0, `Delhi PT is ₹0 (No professional tax)`);

  // ------------------------------------------------------------------
  // 7. Edge Cases: Zero, Negative, and Capped vs Uncapped PF
  // ------------------------------------------------------------------
  console.log("\n--- Testing Edge Cases ---");
  const zeroInputs: SalaryCalculatorInputs = {
    annualCTC: 0,
    financialYear: "FY 2026-27",
    state: "Gujarat",
    regime: "new",
    structureType: "standard",
    basicPercentage: 50,
    hraPercentage: 40,
    cityType: "non-metro",
    monthlyRentPaid: 0,
    annualVariablePay: 0,
    includeEmployeePF: true,
    includeEmployerPFInCTC: true,
    pfCappedAtStatutoryCeiling: true,
    vpfPercentage: 0,
    includeGratuityInCTC: true,
    gratuityOverride: 0,
    employerNPSPercentage: 0,
    otherEmployerBenefits: 0,
    section80C: 0,
    section80D: 0,
    section80CCD1B: 0,
    homeLoanInterest80EEA: 0,
    otherTaxDeductions: 0,
    monthlyEmployeeInsurance: 0,
    otherMonthlyDeductions: 0,
  };
  const zeroRes = calculateSalaryBreakdown(zeroInputs);
  assert(zeroRes.monthlyInHand === 0, `Zero CTC yields ₹0 in-hand`);
  assert(zeroRes.warnings.length > 0, `Zero CTC triggers warning`);

  // Uncapped PF on ₹12L CTC (Basic ₹50,000/mo -> PF is 12% = ₹6,000/mo)
  const uncappedInputs: SalaryCalculatorInputs = {
    ...zeroInputs,
    annualCTC: 1200000,
    pfCappedAtStatutoryCeiling: false,
  };
  const uncappedRes = calculateSalaryBreakdown(uncappedInputs);
  assert(
    uncappedRes.monthlyEmployeePF > 1800,
    `Uncapped PF produces higher employee PF (${formatINR(uncappedRes.monthlyEmployeePF)}/mo > ₹1,800/mo)`,
  );

  console.log("\n=================================================");
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================");

  if (failed > 0) process.exit(1);
}

runTests();

