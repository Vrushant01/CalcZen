import { convertRateToBasis } from "../src/hooks/use-live-rates";
import { getPurityFineness as getMakingPurity } from "../src/utils/makingChargesCalculatorUtils";
import { getPurityFineness as getJewelleryPurity } from "../src/utils/jewelleryCalculatorUtils";
import { OLD_GOLD_PURITY_OPTIONS } from "../src/utils/oldGoldCalculatorUtils";
import { GOLD_PURITY_MAP } from "../src/utils/goldLoanCalculatorUtils";
import { GOLD_PURITIES, SILVER_PURITIES } from "../src/utils/jewelleryBudgetUtils";
import { BIS_SILVER_PURITY_OPTIONS } from "../src/utils/silverJewelleryUtils";

console.log("=== RUNNING FRONTEND LIVE RATE MATH & LOGIC VERIFICATION ===\n");

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${msg}`);
    failed++;
  }
}

// -------------------------------------------------------------
// CHECK E4: Math check with mocked 24K rate of ₹15,000 / gram
// -------------------------------------------------------------
const MOCK_24K_PER_GRAM = 15000;
const MOCK_SILVER_PER_GRAM = 120;

// 1. "Per 10 Grams" on 24K benchmark
const rate10g = convertRateToBasis(MOCK_24K_PER_GRAM, "per_10g", 1.0);
assert(rate10g === 150000, `24K Per 10 Grams is 150000 (got ${rate10g})`);

// 2. "Per Gram" on 24K benchmark
const ratePerGram = convertRateToBasis(MOCK_24K_PER_GRAM, "per_gram", 1.0);
assert(ratePerGram === 15000, `24K Per Gram is 15000 (got ${ratePerGram})`);

// 3. 22K direct mode
const purity22kMaking = getMakingPurity("22k-916");
const rate22kDirect = convertRateToBasis(MOCK_24K_PER_GRAM, "per_gram", purity22kMaking);
assert(rate22kDirect === 13750, `22K Direct Per Gram is 13750 (got ${rate22kDirect})`);

// 4. 18K direct mode
const purity18kMaking = getMakingPurity("18k-750");
const rate18kDirect = convertRateToBasis(MOCK_24K_PER_GRAM, "per_gram", purity18kMaking);
assert(rate18kDirect === 11250, `18K Direct Per Gram is 11250 (got ${rate18kDirect})`);

// 5. Per Tola (11.6638038g)
const rateTola = convertRateToBasis(MOCK_24K_PER_GRAM, "per_tola", 1.0);
assert(rateTola === Math.round(15000 * 11.6638038), `Per Tola converted and rounded correctly (${rateTola})`);

// 6. Per Pavan (8g)
const ratePavan = convertRateToBasis(MOCK_24K_PER_GRAM, "per_pavan", 1.0);
assert(ratePavan === 15000 * 8, `Per Pavan converted correctly (${ratePavan})`);

// -------------------------------------------------------------
// CHECK E3: All 6 calculators' basis & purity factor mappings
// -------------------------------------------------------------
console.log("\n--- Checking Calculator 1: GoldMakingChargesCalculator ---");
assert(getMakingPurity("22k-916") === 22 / 24, "GoldMakingChargesCalculator uses 22/24 for 22K");
assert(getMakingPurity("18k-750") === 18 / 24, "GoldMakingChargesCalculator uses 18/24 for 18K");

console.log("\n--- Checking Calculator 2: GoldJewelleryBillCalculator ---");
assert(getJewelleryPurity("22k-916") === 22 / 24, "GoldJewelleryBillCalculator uses 22/24 for 22K");
assert(getJewelleryPurity("18k-750") === 18 / 24, "GoldJewelleryBillCalculator uses 18/24 for 18K");

console.log("\n--- Checking Calculator 3: OldGoldExchangeValueCalculator ---");
const oldGold22kFactor = OLD_GOLD_PURITY_OPTIONS["22k-916"].finenessFraction;
const oldGold10g = convertRateToBasis(MOCK_24K_PER_GRAM, "per_10g", oldGold22kFactor);
assert(oldGold22kFactor === 0.916, "OldGoldExchangeValueCalculator uses 0.916 for 22K");
assert(oldGold10g === Math.round(15000 * 0.916 * 10), "OldGold 10g basis converts correctly");

console.log("\n--- Checking Calculator 4: GoldLoanAgainstJewelleryCalculator ---");
const loan22kFactor = GOLD_PURITY_MAP["22k-916"].finenessFraction;
const loanRate = convertRateToBasis(MOCK_24K_PER_GRAM, "per_gram", loan22kFactor);
assert(loan22kFactor === 0.916, "GoldLoanAgainstJewelleryCalculator uses 0.916 for 22K");
assert(loanRate === 13740, `GoldLoan rate converts correctly to 13740 (got ${loanRate})`);

console.log("\n--- Checking Calculator 5: JewelleryBudgetToWeightCalculator ---");
const budgetGoldFactor = GOLD_PURITIES["22k-916"].fraction;
const budgetSilverFactor = SILVER_PURITIES["925"].fraction;
const budgetGoldRate = convertRateToBasis(MOCK_24K_PER_GRAM, "per_gram", budgetGoldFactor);
const budgetSilverRate = convertRateToBasis(MOCK_SILVER_PER_GRAM, "per_gram", budgetSilverFactor);
assert(budgetGoldFactor === 0.916, "JewelleryBudget uses 0.916 for 22K gold");
assert(budgetSilverFactor === 0.925, "JewelleryBudget uses 0.925 for 925 silver");
assert(budgetGoldRate === 13740, `JewelleryBudget gold converts correctly (${budgetGoldRate})`);
assert(budgetSilverRate === 111, `JewelleryBudget silver converts correctly (${budgetSilverRate})`);

console.log("\n--- Checking Calculator 6: SilverJewelleryBillCalculator ---");
const silver925Factor = (BIS_SILVER_PURITY_OPTIONS["925"].fineness) / 999;
const silverRate = convertRateToBasis(MOCK_SILVER_PER_GRAM, "per_gram", silver925Factor);
assert(Math.abs(silver925Factor - 925 / 999) < 0.0001, "SilverJewelleryBillCalculator uses 925/999");
assert(silverRate === Math.round(120 * (925 / 999) * 100) / 100, `Silver 925 converts correctly (${silverRate})`);

// Zero or negative sanity
assert(convertRateToBasis(0, "per_gram") === 0, "Zero rate safely returns 0");
assert(convertRateToBasis(-100, "per_gram") === 0, "Negative rate safely returns 0");

console.log(`\n=================================================`);
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log(`=================================================`);

if (failed > 0) {
  process.exit(1);
}
