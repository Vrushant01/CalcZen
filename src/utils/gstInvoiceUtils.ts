/**
 * GST Invoice Calculator Utilities
 * Official Indian GST Calculation Engine
 * Complies with Central Board of Indirect Taxes and Customs (CBIC) and CGST Act principles.
 */

export type SupplyType = "intra_state" | "inter_state";
export type PriceType = "exclusive" | "inclusive";
export type DiscountType = "none" | "percent" | "fixed";

export const STANDARD_GST_RATES = [
  { value: 0, label: "0% (Exempt / Nil Rated)" },
  { value: 0.25, label: "0.25% (Rough Diamonds / Gems)" },
  { value: 3, label: "3% (Gold, Silver, Jewellery)" },
  { value: 5, label: "5% (Essential Commodities, Footwear < ₹1000)" },
  { value: 12, label: "12% (Processed Food, Apparel > ₹1000)" },
  { value: 18, label: "18% (Standard Rate, Services, IT, Electronics)" },
  { value: 28, label: "28% (Luxury Goods, Automobiles, Aerated Drinks)" },
];

export interface SingleGstInput {
  amount: number;
  gstRate: number; // Percentage e.g. 18
  priceType: PriceType; // "exclusive" (add GST) | "inclusive" (GST inside)
  supplyType: SupplyType; // "intra_state" (CGST+SGST) | "inter_state" (IGST)
  hasDiscount?: boolean;
  discountType?: DiscountType;
  discountValue?: number;
}

export interface SingleGstResult {
  originalAmount: number;
  discountAmount: number;
  taxableValue: number;
  gstRate: number;
  supplyType: SupplyType;
  priceType: PriceType;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalGst: number;
  finalTotal: number;
  displayedTaxableValue: number;
  displayedTotalGst: number;
  displayedCgst: number;
  displayedSgst: number;
  displayedIgst: number;
  displayedFinalTotal: number;
  explanation: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  hsnSac?: string;
  quantity: number;
  unitPrice: number;
  discountType: DiscountType;
  discountValue: number;
  gstRate: number;
  priceType: PriceType;
}

export interface CalculatedLineItem {
  item: InvoiceLineItem;
  grossAmount: number;
  discountAmount: number;
  taxableValue: number;
  gstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalGst: number;
  totalAmount: number;
}

export interface GstRateSummaryGroup {
  gstRate: number;
  taxableValue: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalGst: number;
  totalAmount: number;
}

export interface InvoiceCalculationResult {
  items: CalculatedLineItem[];
  supplyType: SupplyType;
  totalGrossAmount: number;
  totalDiscountAmount: number;
  totalTaxableValue: number;
  totalCgstAmount: number;
  totalSgstAmount: number;
  totalIgstAmount: number;
  totalGstAmount: number;
  subTotalWithTax: number;
  roundingAdjustment: number;
  finalPayableAmount: number;
  rateSummary: GstRateSummaryGroup[];
}

export interface InvoiceMetaDetails {
  sellerName?: string;
  sellerAddress?: string;
  sellerGstin?: string;
  sellerState?: string;
  buyerName?: string;
  buyerAddress?: string;
  buyerGstin?: string;
  buyerState?: string;
  placeOfSupply?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  dueDate?: string;
  isReverseCharge?: boolean;
  notes?: string;
}

/**
 * Validates single GST calculation inputs
 */
export function validateSingleGstInput(
  input: SingleGstInput,
): { isValid: boolean; error?: string } {
  if (isNaN(input.amount) || input.amount < 0) {
    return { isValid: false, error: "Please enter a valid amount (cannot be negative)." };
  }
  if (isNaN(input.gstRate) || input.gstRate < 0) {
    return { isValid: false, error: "Please select or enter a valid GST rate percentage." };
  }
  if (input.hasDiscount && input.discountValue && input.discountValue > 0) {
    if (input.discountType === "percent" && input.discountValue > 100) {
      return { isValid: false, error: "Discount percentage cannot exceed 100%." };
    }
    if (input.discountType === "fixed" && input.discountValue > input.amount) {
      return { isValid: false, error: "Discount amount cannot exceed the item amount." };
    }
  }
  return { isValid: true };
}

/**
 * Single GST Calculation (Mode A)
 * Uses high precision internally and rounds to 2 decimals for display
 */
export function calculateSingleGst(input: SingleGstInput): SingleGstResult {
  const amount = Math.max(0, Number(input.amount) || 0);
  const rate = Math.max(0, Number(input.gstRate) || 0);
  const supplyType = input.supplyType || "intra_state";
  const priceType = input.priceType || "exclusive";

  // 1. Discount calculation
  let discountAmount = 0;
  if (input.hasDiscount && input.discountValue && input.discountValue > 0) {
    if (input.discountType === "percent") {
      const pct = Math.min(100, Math.max(0, input.discountValue));
      discountAmount = (amount * pct) / 100;
    } else if (input.discountType === "fixed") {
      discountAmount = Math.min(amount, Math.max(0, input.discountValue));
    }
  }

  // 2. Taxable Value & GST Calculation
  let taxableValue = 0;
  let totalGst = 0;
  let finalTotal = 0;

  if (priceType === "exclusive") {
    // GST Exclusive: Amount is before tax
    taxableValue = Math.max(0, amount - discountAmount);
    totalGst = (taxableValue * rate) / 100;
    finalTotal = taxableValue + totalGst;
  } else {
    // GST Inclusive: Amount already includes GST
    const netEntered = Math.max(0, amount - discountAmount);
    if (rate > 0) {
      taxableValue = netEntered / (1 + rate / 100);
      totalGst = netEntered - taxableValue;
    } else {
      taxableValue = netEntered;
      totalGst = 0;
    }
    finalTotal = netEntered;
  }

  // 3. Tax Breakdown: Intra-state vs Inter-state
  let cgstRate = 0;
  let sgstRate = 0;
  let igstRate = 0;
  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (supplyType === "intra_state") {
    cgstRate = rate / 2;
    sgstRate = rate / 2;
    cgstAmount = totalGst / 2;
    sgstAmount = totalGst / 2;
  } else {
    igstRate = rate;
    igstAmount = totalGst;
  }

  // Rounding for display
  const displayedTaxableValue = round2(taxableValue);
  const displayedTotalGst = round2(totalGst);
  const displayedCgst = round2(cgstAmount);
  const displayedSgst = round2(sgstAmount);
  const displayedIgst = round2(igstAmount);
  const displayedFinalTotal = round2(finalTotal);

  // Explanation
  let explanation = "";
  if (priceType === "exclusive") {
    if (discountAmount > 0) {
      explanation = `Original amount is ₹${amount.toFixed(2)}. After discount of ₹${discountAmount.toFixed(2)}, taxable value is ₹${displayedTaxableValue.toFixed(2)}. At ${rate}%, GST is ₹${displayedTotalGst.toFixed(2)}. ${
        supplyType === "intra_state"
          ? `Split into CGST (${cgstRate}% = ₹${displayedCgst.toFixed(2)}) and SGST (${sgstRate}% = ₹${displayedSgst.toFixed(2)}).`
          : `Charged as IGST (${igstRate}% = ₹${displayedIgst.toFixed(2)}).`
      } Total payable is ₹${displayedFinalTotal.toFixed(2)}.`;
    } else {
      explanation = `Taxable value is ₹${displayedTaxableValue.toFixed(2)}. At ${rate}%, GST is ₹${displayedTotalGst.toFixed(2)}. ${
        supplyType === "intra_state"
          ? `Split into CGST (${cgstRate}% = ₹${displayedCgst.toFixed(2)}) and SGST (${sgstRate}% = ₹${displayedSgst.toFixed(2)}).`
          : `Charged as IGST (${igstRate}% = ₹${displayedIgst.toFixed(2)}).`
      } Final invoice total is ₹${displayedFinalTotal.toFixed(2)}.`;
    }
  } else {
    explanation = `The entered price of ₹${amount.toFixed(2)} already includes ${rate}% GST. Taxable value = ₹${amount.toFixed(2)} ÷ (1 + ${rate}/100) = ₹${displayedTaxableValue.toFixed(2)}. GST extracted is ₹${displayedTotalGst.toFixed(2)} ${
      supplyType === "intra_state"
        ? `(CGST ₹${displayedCgst.toFixed(2)} + SGST ₹${displayedSgst.toFixed(2)})`
        : `(IGST ₹${displayedIgst.toFixed(2)})`
    }. Total invoice amount remains ₹${displayedFinalTotal.toFixed(2)}.`;
  }

  return {
    originalAmount: amount,
    discountAmount,
    taxableValue,
    gstRate: rate,
    supplyType,
    priceType,
    cgstRate,
    cgstAmount,
    sgstRate,
    sgstAmount,
    igstRate,
    igstAmount,
    totalGst,
    finalTotal,
    displayedTaxableValue,
    displayedTotalGst,
    displayedCgst,
    displayedSgst,
    displayedIgst,
    displayedFinalTotal,
    explanation,
  };
}

/**
 * Calculates a single line item for full invoice mode
 */
export function calculateLineItem(
  item: InvoiceLineItem,
  supplyType: SupplyType,
): CalculatedLineItem {
  const qty = Math.max(0, item.quantity || 0);
  const price = Math.max(0, item.unitPrice || 0);
  const rate = Math.max(0, item.gstRate || 0);
  const grossAmount = qty * price;

  // Discount
  let discountAmount = 0;
  if (item.discountType === "percent" && item.discountValue > 0) {
    const pct = Math.min(100, Math.max(0, item.discountValue));
    discountAmount = (grossAmount * pct) / 100;
  } else if (item.discountType === "fixed" && item.discountValue > 0) {
    discountAmount = Math.min(grossAmount, Math.max(0, item.discountValue));
  }

  const netAmount = Math.max(0, grossAmount - discountAmount);

  let taxableValue = 0;
  let totalGst = 0;
  let totalAmount = 0;

  if (item.priceType === "inclusive") {
    if (rate > 0) {
      taxableValue = netAmount / (1 + rate / 100);
      totalGst = netAmount - taxableValue;
    } else {
      taxableValue = netAmount;
      totalGst = 0;
    }
    totalAmount = netAmount;
  } else {
    taxableValue = netAmount;
    totalGst = (taxableValue * rate) / 100;
    totalAmount = taxableValue + totalGst;
  }

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (supplyType === "intra_state") {
    cgstAmount = totalGst / 2;
    sgstAmount = totalGst / 2;
  } else {
    igstAmount = totalGst;
  }

  return {
    item,
    grossAmount,
    discountAmount,
    taxableValue,
    gstRate: rate,
    cgstAmount,
    sgstAmount,
    igstAmount,
    totalGst,
    totalAmount,
  };
}

/**
 * Full Multi-Product Invoice Calculation (Mode B)
 */
export function calculateFullInvoice(
  items: InvoiceLineItem[],
  supplyType: SupplyType,
  applyWholeRupeeRounding = false,
): InvoiceCalculationResult {
  const calculatedItems = items.map((it) => calculateLineItem(it, supplyType));

  let totalGrossAmount = 0;
  let totalDiscountAmount = 0;
  let totalTaxableValue = 0;
  let totalCgstAmount = 0;
  let totalSgstAmount = 0;
  let totalIgstAmount = 0;
  let totalGstAmount = 0;
  let subTotalWithTax = 0;

  const rateGroupMap = new Map<number, GstRateSummaryGroup>();

  for (const cItem of calculatedItems) {
    totalGrossAmount += cItem.grossAmount;
    totalDiscountAmount += cItem.discountAmount;
    totalTaxableValue += cItem.taxableValue;
    totalCgstAmount += cItem.cgstAmount;
    totalSgstAmount += cItem.sgstAmount;
    totalIgstAmount += cItem.igstAmount;
    totalGstAmount += cItem.totalGst;
    subTotalWithTax += cItem.totalAmount;

    // Rate summary aggregation
    const rate = cItem.gstRate;
    const existing = rateGroupMap.get(rate) || {
      gstRate: rate,
      taxableValue: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 0,
      totalGst: 0,
      totalAmount: 0,
    };

    existing.taxableValue += cItem.taxableValue;
    existing.cgstAmount += cItem.cgstAmount;
    existing.sgstAmount += cItem.sgstAmount;
    existing.igstAmount += cItem.igstAmount;
    existing.totalGst += cItem.totalGst;
    existing.totalAmount += cItem.totalAmount;

    rateGroupMap.set(rate, existing);
  }

  const rateSummary = Array.from(rateGroupMap.values()).sort((a, b) => a.gstRate - b.gstRate);

  let roundingAdjustment = 0;
  let finalPayableAmount = subTotalWithTax;

  if (applyWholeRupeeRounding) {
    const rounded = Math.round(subTotalWithTax);
    roundingAdjustment = rounded - subTotalWithTax;
    finalPayableAmount = rounded;
  }

  return {
    items: calculatedItems,
    supplyType,
    totalGrossAmount,
    totalDiscountAmount,
    totalTaxableValue,
    totalCgstAmount,
    totalSgstAmount,
    totalIgstAmount,
    totalGstAmount,
    subTotalWithTax,
    roundingAdjustment,
    finalPayableAmount,
    rateSummary,
  };
}

/**
 * Currency and Rounding Helpers
 */
export function round2(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

export function formatINR(val: number): string {
  if (isNaN(val) || !isFinite(val)) return "₹0.00";
  const isNeg = val < 0;
  const absVal = Math.abs(val);
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(absVal);
  return isNeg ? `−${formatted}` : formatted;
}

export function formatGstRate(rate: number): string {
  if (isNaN(rate) || !isFinite(rate)) return "0%";
  return `${rate % 1 === 0 ? rate : rate.toFixed(2)}%`;
}

