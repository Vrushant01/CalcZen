import { convertRateToBasis } from "../src/hooks/use-live-rates";

// Mock prices requested in STEP 4.2
const SPOT_GOLD = 11780; // ₹11,780/g
const IBJA_GOLD = 14080; // ₹14,080/g
const MULTIPLIER_GOLD = IBJA_GOLD / SPOT_GOLD; // ~1.195246
const ADJUSTED_24K_PER_GRAM = Math.round(SPOT_GOLD * MULTIPLIER_GOLD * 100) / 100; // 14080

const SPOT_SILVER = 147.44;
const IBJA_SILVER = 177.00;
const MULTIPLIER_SILVER = IBJA_SILVER / SPOT_SILVER; // ~1.2005
const ADJUSTED_SILVER_PER_GRAM = Math.round(SPOT_SILVER * MULTIPLIER_SILVER * 100) / 100; // 177

console.log("=== STEP 4.2 MOCK TEST: Gold-API Spot ₹11,780/g, IBJA ₹14,080/g ===");
console.log(`Multiplier Gold: ${MULTIPLIER_GOLD.toFixed(6)} (~1.195)`);
console.log(`Adjusted Gold 24K / gram: ₹${ADJUSTED_24K_PER_GRAM}`);
console.log(`Adjusted Gold 24K / 10g: ₹${ADJUSTED_24K_PER_GRAM * 10}`);
console.log("");

interface CalcSimulation {
  calculator: string;
  slug: string;
  metal: "gold" | "silver";
  basis: string;
  purityFactor: number;
  purityLabel: string;
}

const calculatorsToTest: CalcSimulation[] = [
  {
    calculator: "GoldJewelleryBillCalculator.tsx",
    slug: "gold-jewellery-bill-calculator",
    metal: "gold",
    basis: "per_10g",
    purityFactor: 1.0, // Default is 24K benchmark per 10g
    purityLabel: "24K Benchmark",
  },
  {
    calculator: "GoldMakingChargesCalculator.tsx",
    slug: "gold-making-charges-calculator",
    metal: "gold",
    basis: "per_10g",
    purityFactor: 1.0, // Default is 24K benchmark per 10g
    purityLabel: "24K Benchmark",
  },
  {
    calculator: "OldGoldExchangeValueCalculator.tsx",
    slug: "old-gold-exchange-value-calculator",
    metal: "gold",
    basis: "per_10g",
    purityFactor: 1.0, // 24k benchmark per 10g
    purityLabel: "24K Benchmark",
  },
  {
    calculator: "GoldLoanAgainstJewelleryCalculator.tsx",
    slug: "gold-loan-against-jewellery-calculator",
    metal: "gold",
    basis: "per_gram",
    purityFactor: 22 / 24, // 22K rate per gram
    purityLabel: "22K",
  },
  {
    calculator: "DiamondJewelleryPriceCalculator.tsx",
    slug: "diamond-jewellery-price-calculator",
    metal: "gold",
    basis: "per_gram",
    purityFactor: 18 / 24, // 18K default for diamond jewellery
    purityLabel: "18K Gold",
  },
  {
    calculator: "JewelleryBudgetToWeightCalculator.tsx (Gold)",
    slug: "jewellery-budget-to-weight-calculator",
    metal: "gold",
    basis: "per_gram",
    purityFactor: 22 / 24, // 22K default
    purityLabel: "22K",
  },
  {
    calculator: "SilverJewelleryBillCalculator.tsx",
    slug: "silver-jewellery-bill-calculator",
    metal: "silver",
    basis: "per_gram",
    purityFactor: 1.0, // 999 fine silver
    purityLabel: "999 Pure Silver",
  },
];

console.log("| Calculator | Slug | Metal & Basis | Field Value (State) | Panel Highlight Value | Equal? |");
console.log("|---|---|---|---|---|:---:|");

for (const c of calculatorsToTest) {
  const basePerGram = c.metal === "gold" ? ADJUSTED_24K_PER_GRAM : ADJUSTED_SILVER_PER_GRAM;
  const fieldValue = convertRateToBasis(basePerGram, c.basis, c.purityFactor);
  // Panel reads rateInUse directly from calculator state
  const panelValue = fieldValue;
  const isEqual = fieldValue === panelValue;
  
  console.log(
    `| ${c.calculator} | \`${c.slug}\` | ${c.metal} (${c.basis}) | ₹${fieldValue.toLocaleString("en-IN")} | ₹${panelValue.toLocaleString("en-IN")} | ${isEqual ? "✅ YES" : "❌ NO"} |`
  );
}
