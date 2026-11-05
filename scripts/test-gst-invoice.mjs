import {
  calculateSingleGst,
  calculateFullInvoice,
  validateSingleGstInput,
  round2,
} from "../src/utils/gstInvoiceUtils.ts";

function approx(val, target, tolerance = 0.01) {
  if (val === null && target === null) return true;
  if (val === null || target === null) return false;
  return Math.abs(val - target) <= tolerance;
}

let passed = 0;
let failed = 0;

function runTest(name, condition, detail) {
  if (condition) {
    console.log(`✅ [PASS] ${name}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${name} -> ${detail}`);
    failed++;
  }
}

console.log("=== RUNNING GST INVOICE CALCULATOR TEST SUITE ===\n");

// TEST 1 — Exclusive GST, 18%
{
  const res = calculateSingleGst({
    amount: 1000,
    gstRate: 18,
    priceType: "exclusive",
    supplyType: "intra_state",
  });
  runTest(
    "Test 1: Exclusive GST, 18% Intra-state",
    approx(res.taxableValue, 1000) &&
      approx(res.totalGst, 180) &&
      approx(res.cgstAmount, 90) &&
      approx(res.sgstAmount, 90) &&
      approx(res.finalTotal, 1180),
    `taxable=${res.taxableValue}, gst=${res.totalGst}, cgst=${res.cgstAmount}, sgst=${res.sgstAmount}, total=${res.finalTotal}`
  );
}

// TEST 2 — Inclusive GST, 18%
{
  const res = calculateSingleGst({
    amount: 1180,
    gstRate: 18,
    priceType: "inclusive",
    supplyType: "intra_state",
  });
  runTest(
    "Test 2: Inclusive GST, 18% Intra-state",
    approx(res.taxableValue, 1000) &&
      approx(res.totalGst, 180) &&
      approx(res.cgstAmount, 90) &&
      approx(res.sgstAmount, 90) &&
      approx(res.finalTotal, 1180),
    `taxable=${res.taxableValue}, gst=${res.totalGst}, cgst=${res.cgstAmount}, sgst=${res.sgstAmount}, total=${res.finalTotal}`
  );
}

// TEST 3 — Inter-state GST, 18%
{
  const res = calculateSingleGst({
    amount: 1000,
    gstRate: 18,
    priceType: "exclusive",
    supplyType: "inter_state",
  });
  runTest(
    "Test 3: Inter-state GST, 18% (IGST)",
    approx(res.igstAmount, 180) &&
      approx(res.finalTotal, 1180) &&
      approx(res.cgstAmount, 0) &&
      approx(res.sgstAmount, 0),
    `igst=${res.igstAmount}, total=${res.finalTotal}, cgst=${res.cgstAmount}, sgst=${res.sgstAmount}`
  );
}

// TEST 4 — GST at 5%
{
  const res = calculateSingleGst({
    amount: 2000,
    gstRate: 5,
    priceType: "exclusive",
    supplyType: "intra_state",
  });
  runTest(
    "Test 4: GST at 5% Intra-state",
    approx(res.totalGst, 100) &&
      approx(res.cgstAmount, 50) &&
      approx(res.sgstAmount, 50) &&
      approx(res.finalTotal, 2100),
    `gst=${res.totalGst}, cgst=${res.cgstAmount}, sgst=${res.sgstAmount}, total=${res.finalTotal}`
  );
}

// TEST 5 — Discount before GST
{
  const res = calculateSingleGst({
    amount: 1000,
    gstRate: 18,
    priceType: "exclusive",
    supplyType: "intra_state",
    hasDiscount: true,
    discountType: "percent",
    discountValue: 10,
  });
  runTest(
    "Test 5: Discount 10% before GST 18%",
    approx(res.discountAmount, 100) &&
      approx(res.taxableValue, 900) &&
      approx(res.totalGst, 162) &&
      approx(res.finalTotal, 1062),
    `discount=${res.discountAmount}, taxable=${res.taxableValue}, gst=${res.totalGst}, total=${res.finalTotal}`
  );
}

// TEST 6 — Multiple products with different GST rates
{
  const items = [
    {
      id: "1",
      description: "Product A",
      quantity: 2,
      unitPrice: 500,
      discountType: "none",
      discountValue: 0,
      gstRate: 18,
      priceType: "exclusive",
    },
    {
      id: "2",
      description: "Product B",
      quantity: 1,
      unitPrice: 1000,
      discountType: "none",
      discountValue: 0,
      gstRate: 5,
      priceType: "exclusive",
    },
  ];
  const invoice = calculateFullInvoice(items, "intra_state");
  const prodA = invoice.items[0];
  const prodB = invoice.items[1];

  runTest(
    "Test 6: Multiple products with mixed GST rates (18% and 5%)",
    approx(prodA.taxableValue, 1000) &&
      approx(prodA.totalGst, 180) &&
      approx(prodB.taxableValue, 1000) &&
      approx(prodB.totalGst, 50) &&
      approx(invoice.totalTaxableValue, 2000) &&
      approx(invoice.totalCgstAmount, 115) &&
      approx(invoice.totalSgstAmount, 115) &&
      approx(invoice.totalGstAmount, 230) &&
      approx(invoice.finalPayableAmount, 2230),
    `taxable=${invoice.totalTaxableValue}, cgst=${invoice.totalCgstAmount}, sgst=${invoice.totalSgstAmount}, gst=${invoice.totalGstAmount}, total=${invoice.finalPayableAmount}`
  );
}

// TEST 7 — Zero GST
{
  const res = calculateSingleGst({
    amount: 1000,
    gstRate: 0,
    priceType: "exclusive",
    supplyType: "intra_state",
  });
  runTest(
    "Test 7: Zero GST (0%)",
    approx(res.totalGst, 0) && approx(res.finalTotal, 1000),
    `gst=${res.totalGst}, total=${res.finalTotal}`
  );
}

// TEST 8 — Custom GST rate (12%)
{
  const res = calculateSingleGst({
    amount: 1000,
    gstRate: 12,
    priceType: "exclusive",
    supplyType: "intra_state",
  });
  runTest(
    "Test 8: Custom GST rate (12%)",
    approx(res.totalGst, 120) &&
      approx(res.cgstAmount, 60) &&
      approx(res.sgstAmount, 60) &&
      approx(res.finalTotal, 1120),
    `gst=${res.totalGst}, cgst=${res.cgstAmount}, sgst=${res.sgstAmount}, total=${res.finalTotal}`
  );
}

// TEST 9 — Inclusive GST at 5%
{
  const res = calculateSingleGst({
    amount: 1050,
    gstRate: 5,
    priceType: "inclusive",
    supplyType: "intra_state",
  });
  runTest(
    "Test 9: Inclusive GST at 5%",
    approx(res.taxableValue, 1000) &&
      approx(res.totalGst, 50) &&
      approx(res.finalTotal, 1050),
    `taxable=${res.taxableValue}, gst=${res.totalGst}, total=${res.finalTotal}`
  );
}

// TEST 10 — Invalid discount
{
  const val = validateSingleGstInput({
    amount: 1000,
    gstRate: 18,
    priceType: "exclusive",
    supplyType: "intra_state",
    hasDiscount: true,
    discountType: "fixed",
    discountValue: 1200,
  });
  runTest(
    "Test 10: Invalid discount (discount ₹1,200 on amount ₹1,000)",
    val.isValid === false,
    `isValid=${val.isValid}, error=${val.error}`
  );
}

// TEST 11 — Zero amount
{
  const res = calculateSingleGst({
    amount: 0,
    gstRate: 18,
    priceType: "exclusive",
    supplyType: "intra_state",
  });
  runTest(
    "Test 11: Zero amount (₹0)",
    res.totalGst === 0 &&
      res.finalTotal === 0 &&
      !isNaN(res.finalTotal) &&
      isFinite(res.finalTotal),
    `gst=${res.totalGst}, total=${res.finalTotal}`
  );
}

// TEST 12 — Decimal amount
{
  const res = calculateSingleGst({
    amount: 999.99,
    gstRate: 18,
    priceType: "exclusive",
    supplyType: "intra_state",
  });
  runTest(
    "Test 12: Decimal amount (₹999.99 @ 18%)",
    approx(res.totalGst, 179.9982, 0.0001) &&
      res.displayedTotalGst === 180.0 &&
      approx(res.finalTotal, 1179.9882, 0.0001) &&
      res.displayedFinalTotal === 1179.99,
    `rawGst=${res.totalGst}, dispGst=${res.displayedTotalGst}, rawTotal=${res.finalTotal}, dispTotal=${res.displayedFinalTotal}`
  );
}

console.log(`\nTest Results: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("ALL 12 GST INVOICE TESTS PASSED PERFECTLY!");
}

