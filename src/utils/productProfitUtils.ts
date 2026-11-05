/**
 * Product Profit Calculator Utilities
 * Accurate business financial calculation engine
 * Handles gross profit, net profit, margins, markups, per-order/per-unit expenses,
 * discounts, marketplace commissions, target pricing, break-even, and GST.
 */

export interface ExtraExpenseItem {
  id: string;
  name: string;
  amount: number;
  type: "fixed_per_unit" | "fixed_per_order" | "percentage_of_price";
}

export interface ProfitCalculationInput {
  costPrice: number; // Cost / manufacturing / buying price per unit
  sellingPrice: number; // Stated selling price per unit
  quantity: number; // Units sold (default 1)
  // Optional discount
  hasDiscount?: boolean;
  discountPct?: number; // 0 to 100%
  // Optional extra expenses
  hasExtraExpenses?: boolean;
  packagingCostPerUnit?: number;
  shippingCost?: number;
  shippingType?: "per_unit" | "per_order"; // Default per_unit or per_order
  advertisingCostPerUnit?: number;
  handlingCostPerUnit?: number;
  fixedOtherPerUnit?: number;
  fixedPlatformFeePerOrder?: number;
  marketplaceCommissionPct?: number; // e.g. 5%
  paymentGatewayFeePct?: number; // e.g. 2%
  customExpenses?: ExtraExpenseItem[];
  // Optional GST
  hasGst?: boolean;
  isSellingPriceGstInclusive?: boolean;
  gstRatePct?: number; // e.g. 18%
  isCostGstExclusive?: boolean;
}

export interface ExpenseBreakdownItem {
  label: string;
  costPerUnit: number;
  totalCost: number;
  percentageOfRevenue: number;
}

export interface ProfitCalculationResult {
  // Revenue
  originalSellingPrice: number;
  discountAmountPerUnit: number;
  actualSellingPrice: number;
  revenueExcludingGstPerUnit: number;
  outputGstPerUnit: number;
  totalRevenue: number;
  // Costs
  productCostPerUnit: number;
  totalProductCost: number;
  fixedExpensesPerUnit: number;
  perOrderExpensesAllocatedPerUnit: number;
  percentageFeesPerUnit: number;
  totalCostPerUnit: number;
  totalCostOrder: number;
  // Profits
  profitPerUnit: number;
  totalProfit: number;
  isLoss: boolean;
  // Margins and Markups
  profitMarginPct: number | null; // null if selling price <= 0
  markupPct: number | null; // null if cost <= 0
  breakEvenPrice: number | null;
  // Breakdown
  expenseBreakdown: ExpenseBreakdownItem[];
  formulaExplanation: string;
}

export interface TargetPriceResult {
  requiredSellingPrice: number | null;
  expectedProfitPerUnit: number;
  expectedMarginPct: number;
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Validates profit calculator inputs
 */
export function validateProfitInput(
  input: ProfitCalculationInput,
): { isValid: boolean; error?: string } {
  if (isNaN(input.costPrice) || input.costPrice < 0) {
    return { isValid: false, error: "Product cost cannot be negative." };
  }
  if (isNaN(input.sellingPrice) || input.sellingPrice < 0) {
    return { isValid: false, error: "Selling price cannot be negative." };
  }
  if (isNaN(input.quantity) || input.quantity < 1) {
    return { isValid: false, error: "Quantity must be at least 1." };
  }
  if (
    input.hasDiscount &&
    (isNaN(input.discountPct || 0) || (input.discountPct || 0) < 0 || (input.discountPct || 0) > 100)
  ) {
    return { isValid: false, error: "Discount percentage must be between 0% and 100%." };
  }
  if (input.hasExtraExpenses) {
    if (
      (input.marketplaceCommissionPct || 0) < 0 ||
      (input.marketplaceCommissionPct || 0) > 100 ||
      (input.paymentGatewayFeePct || 0) < 0 ||
      (input.paymentGatewayFeePct || 0) > 100
    ) {
      return { isValid: false, error: "Percentage fees must be between 0% and 100%." };
    }
    const totalPct = (input.marketplaceCommissionPct || 0) + (input.paymentGatewayFeePct || 0);
    if (totalPct >= 100) {
      return { isValid: false, error: "Total percentage fees cannot exceed 100%." };
    }
  }
  if (input.hasGst && ((input.gstRatePct || 0) < 0 || (input.gstRatePct || 0) > 100)) {
    return { isValid: false, error: "GST rate must be between 0% and 100%." };
  }
  return { isValid: true };
}

/**
 * Core Product Profit Calculation
 * Maintains full precision internally
 */
export function calculateProductProfit(input: ProfitCalculationInput): ProfitCalculationResult {
  const qty = Math.max(1, input.quantity || 1);
  const cost = Math.max(0, input.costPrice || 0);
  const origPrice = Math.max(0, input.sellingPrice || 0);

  // 1. Discount calculation
  let discountAmountPerUnit = 0;
  if (input.hasDiscount && input.discountPct && input.discountPct > 0) {
    const discPct = Math.min(100, Math.max(0, input.discountPct));
    discountAmountPerUnit = (origPrice * discPct) / 100;
  }
  const actualSellingPrice = Math.max(0, origPrice - discountAmountPerUnit);

  // 2. GST Treatment
  let revenueExcludingGstPerUnit = actualSellingPrice;
  let outputGstPerUnit = 0;
  if (input.hasGst && input.isSellingPriceGstInclusive && input.gstRatePct && input.gstRatePct > 0) {
    const g = input.gstRatePct / 100;
    revenueExcludingGstPerUnit = actualSellingPrice / (1 + g);
    outputGstPerUnit = actualSellingPrice - revenueExcludingGstPerUnit;
  }
  const effectiveRevenuePerUnit = revenueExcludingGstPerUnit;
  const totalRevenue = effectiveRevenuePerUnit * qty;

  // 3. Extra expenses
  let fixedExpensesPerUnit = 0;
  let fixedExpensesPerOrder = 0;
  let percentageFeeRate = 0; // fraction e.g. 0.05
  const breakdown: ExpenseBreakdownItem[] = [];

  // Base product cost
  const totalProductCost = cost * qty;
  breakdown.push({
    label: "Product Cost",
    costPerUnit: cost,
    totalCost: totalProductCost,
    percentageOfRevenue: totalRevenue > 0 ? (totalProductCost / totalRevenue) * 100 : 0,
  });

  if (input.hasExtraExpenses) {
    // Packaging
    if (input.packagingCostPerUnit && input.packagingCostPerUnit > 0) {
      fixedExpensesPerUnit += input.packagingCostPerUnit;
      breakdown.push({
        label: "Packaging",
        costPerUnit: input.packagingCostPerUnit,
        totalCost: input.packagingCostPerUnit * qty,
        percentageOfRevenue:
          totalRevenue > 0 ? ((input.packagingCostPerUnit * qty) / totalRevenue) * 100 : 0,
      });
    }

    // Shipping
    if (input.shippingCost && input.shippingCost > 0) {
      if (input.shippingType === "per_order") {
        fixedExpensesPerOrder += input.shippingCost;
        const allocated = input.shippingCost / qty;
        breakdown.push({
          label: "Shipping (Per Order)",
          costPerUnit: allocated,
          totalCost: input.shippingCost,
          percentageOfRevenue: totalRevenue > 0 ? (input.shippingCost / totalRevenue) * 100 : 0,
        });
      } else {
        fixedExpensesPerUnit += input.shippingCost;
        breakdown.push({
          label: "Shipping (Per Item)",
          costPerUnit: input.shippingCost,
          totalCost: input.shippingCost * qty,
          percentageOfRevenue:
            totalRevenue > 0 ? ((input.shippingCost * qty) / totalRevenue) * 100 : 0,
        });
      }
    }

    // Advertising
    if (input.advertisingCostPerUnit && input.advertisingCostPerUnit > 0) {
      fixedExpensesPerUnit += input.advertisingCostPerUnit;
      breakdown.push({
        label: "Advertising",
        costPerUnit: input.advertisingCostPerUnit,
        totalCost: input.advertisingCostPerUnit * qty,
        percentageOfRevenue:
          totalRevenue > 0 ? ((input.advertisingCostPerUnit * qty) / totalRevenue) * 100 : 0,
      });
    }

    // Handling & other fixed
    const otherFixed = (input.handlingCostPerUnit || 0) + (input.fixedOtherPerUnit || 0);
    if (otherFixed > 0) {
      fixedExpensesPerUnit += otherFixed;
      breakdown.push({
        label: "Handling & Other Fixed",
        costPerUnit: otherFixed,
        totalCost: otherFixed * qty,
        percentageOfRevenue: totalRevenue > 0 ? ((otherFixed * qty) / totalRevenue) * 100 : 0,
      });
    }

    // Fixed platform fee per order
    if (input.fixedPlatformFeePerOrder && input.fixedPlatformFeePerOrder > 0) {
      fixedExpensesPerOrder += input.fixedPlatformFeePerOrder;
      const allocated = input.fixedPlatformFeePerOrder / qty;
      breakdown.push({
        label: "Platform Fixed Fee (Per Order)",
        costPerUnit: allocated,
        totalCost: input.fixedPlatformFeePerOrder,
        percentageOfRevenue:
          totalRevenue > 0 ? (input.fixedPlatformFeePerOrder / totalRevenue) * 100 : 0,
      });
    }

    // Percentage fees (Commission + Payment Gateway)
    const commPct = Math.max(0, input.marketplaceCommissionPct || 0);
    const pgPct = Math.max(0, input.paymentGatewayFeePct || 0);
    percentageFeeRate = (commPct + pgPct) / 100;

    if (percentageFeeRate > 0) {
      const feePerUnit = actualSellingPrice * percentageFeeRate;
      const totalFees = feePerUnit * qty;
      breakdown.push({
        label: `Platform & Payment Fees (${(percentageFeeRate * 100).toFixed(1)}%)`,
        costPerUnit: feePerUnit,
        totalCost: totalFees,
        percentageOfRevenue: totalRevenue > 0 ? (totalFees / totalRevenue) * 100 : 0,
      });
    }

    // Custom items if any
    if (input.customExpenses && input.customExpenses.length > 0) {
      for (const item of input.customExpenses) {
        if (item.amount > 0) {
          if (item.type === "fixed_per_order") {
            fixedExpensesPerOrder += item.amount;
            breakdown.push({
              label: item.name,
              costPerUnit: item.amount / qty,
              totalCost: item.amount,
              percentageOfRevenue: totalRevenue > 0 ? (item.amount / totalRevenue) * 100 : 0,
            });
          } else if (item.type === "percentage_of_price") {
            const fRate = item.amount / 100;
            percentageFeeRate += fRate;
            const feeVal = actualSellingPrice * fRate;
            breakdown.push({
              label: `${item.name} (${item.amount}%)`,
              costPerUnit: feeVal,
              totalCost: feeVal * qty,
              percentageOfRevenue: totalRevenue > 0 ? ((feeVal * qty) / totalRevenue) * 100 : 0,
            });
          } else {
            fixedExpensesPerUnit += item.amount;
            breakdown.push({
              label: item.name,
              costPerUnit: item.amount,
              totalCost: item.amount * qty,
              percentageOfRevenue:
                totalRevenue > 0 ? ((item.amount * qty) / totalRevenue) * 100 : 0,
            });
          }
        }
      }
    }
  }

  const perOrderExpensesAllocatedPerUnit = fixedExpensesPerOrder / qty;
  const percentageFeesPerUnit = actualSellingPrice * percentageFeeRate;

  const totalCostPerUnit =
    cost + fixedExpensesPerUnit + perOrderExpensesAllocatedPerUnit + percentageFeesPerUnit;
  const totalCostOrder = totalCostPerUnit * qty;

  // 4. Profit & Margins
  const profitPerUnit = effectiveRevenuePerUnit - totalCostPerUnit;
  const totalProfit = profitPerUnit * qty;
  const isLoss = profitPerUnit < 0;

  // Profit Margin (%) = (Profit / Revenue) * 100
  let profitMarginPct: number | null = null;
  if (effectiveRevenuePerUnit > 0) {
    profitMarginPct = (profitPerUnit / effectiveRevenuePerUnit) * 100;
  }

  // Markup (%) = (Profit / Base Cost) * 100
  // Base cost is total fixed cost (or buying price if no extra fees)
  const baseCostPerUnit = cost + fixedExpensesPerUnit + perOrderExpensesAllocatedPerUnit;
  let markupPct: number | null = null;
  if (baseCostPerUnit > 0) {
    markupPct = (profitPerUnit / baseCostPerUnit) * 100;
  }

  // 5. Break-Even Selling Price
  const breakEvenPrice = calculateBreakEvenPrice(baseCostPerUnit, percentageFeeRate);

  // 6. Explanation text
  let formulaExplanation = "";
  if (!input.hasExtraExpenses && !input.hasDiscount && !input.hasGst) {
    formulaExplanation = `Selling price per unit is ₹${actualSellingPrice.toFixed(2)} and cost is ₹${cost.toFixed(2)}. Profit per product = ₹${actualSellingPrice.toFixed(2)} − ₹${cost.toFixed(2)} = ₹${profitPerUnit.toFixed(2)}. For ${qty} ${qty > 1 ? "units" : "unit"}, total profit = ₹${totalProfit.toFixed(2)}. Profit Margin is ${profitMarginPct !== null ? `${profitMarginPct.toFixed(2)}%` : "N/A"} and Markup is ${markupPct !== null ? `${markupPct.toFixed(2)}%` : "N/A"}.`;
  } else {
    formulaExplanation = `Revenue per product (after discount & GST) is ₹${effectiveRevenuePerUnit.toFixed(2)}. Total costs per product = product cost (₹${cost.toFixed(2)}) + fixed expenses (₹${(fixedExpensesPerUnit + perOrderExpensesAllocatedPerUnit).toFixed(2)}) + percentage fees (₹${percentageFeesPerUnit.toFixed(2)}) = ₹${totalCostPerUnit.toFixed(2)}. Net profit per product = ₹${profitPerUnit.toFixed(2)} (${profitMarginPct !== null ? `${profitMarginPct.toFixed(2)}% net margin` : "N/A"}).`;
  }

  return {
    originalSellingPrice: origPrice,
    discountAmountPerUnit,
    actualSellingPrice,
    revenueExcludingGstPerUnit,
    outputGstPerUnit,
    totalRevenue,
    productCostPerUnit: cost,
    totalProductCost,
    fixedExpensesPerUnit,
    perOrderExpensesAllocatedPerUnit,
    percentageFeesPerUnit,
    totalCostPerUnit,
    totalCostOrder,
    profitPerUnit,
    totalProfit,
    isLoss,
    profitMarginPct,
    markupPct,
    breakEvenPrice,
    expenseBreakdown: breakdown,
    formulaExplanation,
  };
}

/**
 * Calculates break-even selling price
 * Break-even price = Fixed costs per unit / (1 - percentageFeeRate)
 */
export function calculateBreakEvenPrice(
  fixedCostPerUnit: number,
  percentageFeeRate: number,
): number | null {
  const denom = 1 - percentageFeeRate;
  if (denom <= 0 || fixedCostPerUnit < 0) {
    return null;
  }
  return fixedCostPerUnit / denom;
}

/**
 * Target Selling Price Calculator (Phase 8)
 * Find selling price required to reach target profit amount or margin %
 */
export function calculateTargetSellingPrice(
  fixedCostPerUnit: number,
  percentageFeeRate: number,
  target: { amount?: number; marginPct?: number },
): TargetPriceResult {
  if (fixedCostPerUnit < 0) {
    return {
      requiredSellingPrice: null,
      expectedProfitPerUnit: 0,
      expectedMarginPct: 0,
      isValid: false,
      errorMessage: "Costs cannot be negative.",
    };
  }

  if (target.marginPct !== undefined) {
    const marginFrac = target.marginPct / 100;
    const denom = 1 - percentageFeeRate - marginFrac;
    if (denom <= 0) {
      return {
        requiredSellingPrice: null,
        expectedProfitPerUnit: 0,
        expectedMarginPct: 0,
        isValid: false,
        errorMessage:
          "Your target margin and percentage fees leave no room for a valid selling price. Please adjust your inputs.",
      };
    }
    const reqPrice = fixedCostPerUnit / denom;
    const profit = reqPrice * marginFrac;
    return {
      requiredSellingPrice: reqPrice,
      expectedProfitPerUnit: profit,
      expectedMarginPct: target.marginPct,
      isValid: true,
    };
  } else if (target.amount !== undefined) {
    const denom = 1 - percentageFeeRate;
    if (denom <= 0) {
      return {
        requiredSellingPrice: null,
        expectedProfitPerUnit: 0,
        expectedMarginPct: 0,
        isValid: false,
        errorMessage: "Percentage fees exceed 100%.",
      };
    }
    const reqPrice = (fixedCostPerUnit + target.amount) / denom;
    const marginPct = reqPrice > 0 ? (target.amount / reqPrice) * 100 : 0;
    return {
      requiredSellingPrice: reqPrice,
      expectedProfitPerUnit: target.amount,
      expectedMarginPct: marginPct,
      isValid: true,
    };
  }

  return {
    requiredSellingPrice: null,
    expectedProfitPerUnit: 0,
    expectedMarginPct: 0,
    isValid: false,
    errorMessage: "Please specify a target profit amount or margin percentage.",
  };
}

/**
 * Common Marketplace Presets for Indian E-Commerce Sellers
 */
export interface MarketplacePreset {
  id: string;
  name: string;
  description: string;
  defaultCommissionPct: number;
  defaultClosingFee: number;
  defaultShippingFee: number;
  officialSource: string;
}

export const MARKETPLACE_PRESETS: MarketplacePreset[] = [
  {
    id: "amazon_in",
    name: "Amazon India (FBA / Easy Ship)",
    description: "Typical apparel, electronics, and home decor selling fee structure",
    defaultCommissionPct: 12.0, // Benchmark average referral fee
    defaultClosingFee: 20.0, // Fixed closing fee tier
    defaultShippingFee: 45.0, // Easy Ship standard national rate
    officialSource: "Amazon.in Seller Fee Schedule (Verified 2026)",
  },
  {
    id: "flipkart",
    name: "Flipkart Seller Hub",
    description: "Standard marketplace commission + fixed fee structure",
    defaultCommissionPct: 10.0,
    defaultClosingFee: 15.0,
    defaultShippingFee: 40.0,
    officialSource: "Flipkart Seller Commission Rate Card",
  },
  {
    id: "meesho",
    name: "Meesho (0% Commission Model)",
    description: "0% commission with direct shipping & packaging costs",
    defaultCommissionPct: 0.0,
    defaultClosingFee: 0.0,
    defaultShippingFee: 55.0,
    officialSource: "Meesho Supplier Zero-Commission Policy",
  },
  {
    id: "own_website",
    name: "Own Website / Shopify / WooCommerce",
    description: "Direct-to-consumer store with payment gateway and courier charges",
    defaultCommissionPct: 2.0, // Payment gateway fee (Razorpay / Cashfree)
    defaultClosingFee: 0.0,
    defaultShippingFee: 50.0, // Direct courier aggregator rate (Shiprocket)
    officialSource: "Industry standard D2C benchmarks",
  },
];

/**
 * Currency and percentage formatting helpers
 */
export function formatINR(val: number): string {
  if (isNaN(val) || !isFinite(val)) return "₹0";
  const isNeg = val < 0;
  const absVal = Math.abs(val);
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: absVal % 1 === 0 ? 0 : 2,
  }).format(absVal);
  return isNeg ? `−${formatted}` : formatted;
}

export function formatPercent(val: number | null, decimals = 2): string {
  if (val === null || isNaN(val) || !isFinite(val)) return "Unavailable";
  return `${val.toFixed(decimals)}%`;
}

