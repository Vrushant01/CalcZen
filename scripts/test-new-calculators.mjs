import assert from 'node:assert';
import { calculateCarLoanEMI } from '../src/lib/calc/car-loan-emi-calculator.ts';
import { calculateHomeLoan } from '../src/lib/calc/home-loan-emi-calculator.ts';

console.log('Testing 1: Car Loan EMI Calculator...');
{
  const res = calculateCarLoanEMI({
    carPrice: 1000000,
    downPayment: 0,
    annualRatePct: 9,
    tenureMonths: 60
  });

  console.log(`  EMI: ${res.emi} (expected ~20758), Total Interest: ${res.totalInterest} (expected ~245500)`);
  assert(Math.abs(res.emi - 20758) <= 2, `EMI should be 20758 +/- 2, got ${res.emi}`);
  assert(Math.abs(res.totalInterest - 245500) <= 200, `Total interest should be 245500 +/- 200, got ${res.totalInterest}`);

  // Edge cases
  const zeroRate = calculateCarLoanEMI({ carPrice: 600000, downPayment: 0, annualRatePct: 0, tenureMonths: 60 });
  assert.strictEqual(zeroRate.emi, 10000, '0% rate should divide principal equally');
  assert.strictEqual(zeroRate.totalInterest, 0, '0% rate interest must be 0');

  const zeroDown = calculateCarLoanEMI({ carPrice: 500000, downPayment: 0, annualRatePct: 8.5, tenureMonths: 36 });
  assert(zeroDown.emi > 0);

  const fullDown = calculateCarLoanEMI({ carPrice: 500000, downPayment: 500000, annualRatePct: 8.5, tenureMonths: 36 });
  assert.strictEqual(fullDown.emi, 0, '100% down payment should result in 0 EMI');
  console.log('  PASS: Car Loan EMI Calculator');
}

console.log('Testing 2: Home Loan EMI Calculator...');
{
  const res = calculateHomeLoan({
    loanAmount: 5000000,
    annualRatePct: 8.5,
    tenureYears: 20
  });

  console.log(`  EMI: ${res.regularEmi} (expected ~43391)`);
  assert(Math.abs(res.regularEmi - 43391) <= 3, `EMI should be 43391 +/- 3, got ${res.regularEmi}`);

  // Prepayment test
  const withPrepay = calculateHomeLoan({
    loanAmount: 5000000,
    annualRatePct: 8.5,
    tenureYears: 20,
    prepaymentType: 'oneTime',
    prepaymentAmount: 500000,
    prepaymentMonth: 12,
    prepaymentEffect: 'reduceTenure'
  });
  assert(withPrepay.monthsSaved > 0, 'Prepayment must reduce tenure');
  assert(withPrepay.interestSaved > 0, 'Prepayment must save interest');
  console.log(`  Prepayment: months saved = ${withPrepay.monthsSaved}, interest saved = ₹${withPrepay.interestSaved}`);
  console.log('  PASS: Home Loan EMI Calculator');
}

import { calculateGoldLoan } from '../src/lib/calc/gold-loan-interest-calculator.ts';

console.log('Testing 3: Gold Loan EMI & Interest Calculator...');
{
  // 50 grams of 22K at ₹7500/g 24K -> Gold value = 50 * 7500 * (22/24) = ₹3,43,750
  // LTV 75% -> Eligible loan = ₹2,57,813
  const emiMode = calculateGoldLoan({
    weightGrams: 50,
    karat: '22K',
    goldRate24kPerGram: 7500,
    ltvPercent: 75,
    annualRatePct: 10.5,
    tenureMonths: 12,
    repaymentType: 'emi',
    processingFeePct: 0.5
  });
  assert(emiMode.goldValue > 340000 && emiMode.goldValue < 345000);
  assert(emiMode.eligibleLoan > 255000 && emiMode.eligibleLoan < 260000);
  assert(emiMode.monthlyOutflow > 0, 'EMI must be positive');
  assert(emiMode.totalInterest > 0, 'Interest must be positive');

  const monthlyInterestMode = calculateGoldLoan({
    weightGrams: 50,
    karat: '22K',
    goldRate24kPerGram: 7500,
    ltvPercent: 75,
    annualRatePct: 10.5,
    tenureMonths: 12,
    repaymentType: 'monthlyInterest'
  });
  assert(monthlyInterestMode.monthlyOutflow > 0);
  // Monthly interest is lower than EMI because principal is not paid down monthly
  assert(monthlyInterestMode.monthlyOutflow < emiMode.monthlyOutflow);
  assert(monthlyInterestMode.totalInterest > emiMode.totalInterest);

  const bulletMode = calculateGoldLoan({
    weightGrams: 50,
    karat: '22K',
    goldRate24kPerGram: 7500,
    ltvPercent: 75,
    annualRatePct: 10.5,
    tenureMonths: 12,
    repaymentType: 'bullet'
  });
  assert.strictEqual(bulletMode.monthlyOutflow, 0, 'Bullet repayment must have 0 monthly outflow');
  assert(bulletMode.totalInterest > 0, 'Bullet total interest must be positive');

  console.log(`  EMI Mode monthly = ₹${emiMode.monthlyOutflow}, Monthly Interest = ₹${monthlyInterestMode.monthlyOutflow}, Bullet = ₹0/mo (due at end)`);
  console.log('  PASS: Gold Loan EMI & Interest Calculator');
}

import { calculateGoldValue } from '../src/lib/calc/gold-value-calculator.ts';

console.log('Testing 4: Gold Value Calculator...');
{
  // Rate 24K = 15000/g. 22K purity = 22/24. Per gram = 15000 * 22/24 = 13750.
  // 10 grams = 137500.
  const res = calculateGoldValue({
    weight: 10,
    unit: 'grams',
    karat: '22K',
    rate24kPerGram: 15000,
    makingChargeValue: 0,
    gstPct: 0
  });

  const expected10g = Math.round(15000 * (22 / 24) * 10);
  assert.strictEqual(res.goldBaseValue, expected10g, `10g 22K at 15000/g should be ${expected10g}, got ${res.goldBaseValue}`);
  assert.strictEqual(res.goldBaseValue, 137500);

  // With 10% making charges and 3% GST:
  const withCharges = calculateGoldValue({
    weight: 10,
    unit: 'grams',
    karat: '22K',
    rate24kPerGram: 15000,
    makingChargeType: 'percent',
    makingChargeValue: 10,
    gstPct: 3
  });
  assert.strictEqual(withCharges.makingChargesAmount, 13750);
  assert.strictEqual(withCharges.subtotalWithMaking, 151250);
  assert.strictEqual(withCharges.gstAmount, Math.round(151250 * 0.03));
  console.log(`  10g 22K at ₹15,000/g = ₹${res.goldBaseValue}, with 10% making + 3% GST = ₹${withCharges.finalTotalAmount}`);
  console.log('  PASS: Gold Value Calculator');
}

import { calculateTmtSteelWeight } from '../src/lib/calc/tmt-steel-weight-calculator.ts';

console.log('Testing 5: TMT Steel Weight Calculator...');
{
  const res12 = calculateTmtSteelWeight({
    diameterMm: 12,
    length: 12,
    lengthUnit: 'meters',
    numberOfBars: 1
  });
  console.log(`  12mm: weight/m = ${res12.weightPerMeterKg} (expected 0.889), 12m bar = ${res12.weightPerBarKg} (expected 10.67)`);
  assert.strictEqual(res12.weightPerMeterKg, 0.889);
  assert.strictEqual(res12.weightPerBarKg, 10.67);

  // Check 8, 10, 16, 20, 25, 32 mm
  const checks = [
    { d: 8, expected: 0.395 },
    { d: 10, expected: 0.617 },
    { d: 16, expected: 1.580 },
    { d: 20, expected: 2.469 },
    { d: 25, expected: 3.858 },
    { d: 32, expected: 6.321 }
  ];
  for (const c of checks) {
    const r = calculateTmtSteelWeight({ diameterMm: c.d, length: 1, lengthUnit: 'meters', numberOfBars: 1 });
    assert.strictEqual(r.weightPerMeterKg, c.expected, `Diameter ${c.d}mm expected ${c.expected}, got ${r.weightPerMeterKg}`);
  }
  console.log('  All diameters (8, 10, 12, 16, 20, 25, 32 mm) match exact IS benchmarks!');
  console.log('  PASS: TMT Steel Weight Calculator');
}

import { calculateBricks } from '../src/lib/calc/brick-calculator.ts';

console.log('Testing 6: Brick Calculator...');
{
  // 1 m3 wall (1m x 1m x 1m) with modular bricks (190x90x90 + 10mm mortar)
  const res = calculateBricks({
    wallLength: 1,
    wallHeight: 1,
    wallThickness: 1,
    unit: 'meters',
    brickPreset: 'modular',
    mortarRatio: '1:5',
    wastagePct: 0
  });

  console.log(`  1 m3 modular masonry bricks = ${res.grossBricksRequired} (expected 500)`);
  assert.strictEqual(res.grossBricksRequired, 500);

  // Check with 5% wastage
  const resWithWastage = calculateBricks({
    wallLength: 1,
    wallHeight: 1,
    wallThickness: 1,
    unit: 'meters',
    brickPreset: 'modular',
    mortarRatio: '1:5',
    wastagePct: 5
  });
  assert.strictEqual(resWithWastage.bricksWithWastage, 525);
  assert(res.cementBags > 0, 'Cement bags must be calculated');
  assert(res.sandWeightTonnes > 0, 'Sand must be calculated');
  console.log(`  Mortar: ${res.cementBags} bags of cement, ${res.sandWeightTonnes} tonnes of sand`);
  console.log('  PASS: Brick Calculator');
}

import { calculateTiles } from '../src/lib/calc/tile-calculator.ts';

console.log('Testing 7: Tile Calculator...');
{
  const res = calculateTiles({
    roomLength: 12,
    roomWidth: 10,
    unit: 'feet',
    tilePreset: '2x2ft',
    wastagePct: 10,
    tilesPerBox: 4
  });

  console.log(`  12ft x 10ft with 2x2ft tiles: raw tiles = ${res.rawTilesNeeded} (expected 30), with 10% wastage = ${res.tilesWithWastage} (expected 33)`);
  assert.strictEqual(res.rawTilesNeeded, 30);
  assert.strictEqual(res.tilesWithWastage, 33);
  assert.strictEqual(res.boxesNeeded, Math.ceil(33 / 4)); // 9 boxes
  console.log(`  Boxes needed: ${res.boxesNeeded} boxes (4 tiles/box)`);
  console.log('  PASS: Tile Calculator');
}






