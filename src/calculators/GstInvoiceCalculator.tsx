import { useState, useMemo, useRef } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog, { type BlogContent } from "@/components/CalculatorBlog";
import SavePDFButton from "@/components/SavePDFButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated, useCalculatorState } from "@/hooks/use-has-calculated";
import { OutdatedResultBanner } from "@/components/OutdatedResultBanner";
import { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";
import {
  Receipt,
  FileText,
  Plus,
  Trash2,
  Copy,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  Sliders,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Tag,
  Calculator,
  Percent,
  Layers,
  Building,
  User,
  Calendar,
  Printer,
  Check,
} from "lucide-react";
import {
  calculateSingleGst,
  calculateFullInvoice,
  validateSingleGstInput,
  formatINR,
  formatGstRate,
  STANDARD_GST_RATES,
  type SingleGstInput,
  type SingleGstResult,
  type InvoiceLineItem,
  type SupplyType,
  type PriceType,
  type DiscountType,
  type InvoiceMetaDetails,
} from "@/utils/gstInvoiceUtils";

const GST_INVOICE_BLOG_CONTENT: BlogContent = {
  primaryKeyword: "GST Invoice Calculator",
  category: "Business",
  introText:
    "Calculating GST on invoices accurately is essential for Indian shopkeepers, freelancers, suppliers, manufacturers, and registered taxpayers. Discover how GST inclusive and exclusive pricing works, how to split CGST and SGST for local sales versus IGST for inter-state transactions, and how to correctly account for trade discounts and mixed GST rates.",
  sections: [
    {
      title: "1. GST Inclusive vs. GST Exclusive: The Fundamental Rule",
      paragraphs: [
        "In Indian commerce, prices are either quoted as 'GST Exclusive' (where tax is added on top of the taxable amount) or 'GST Inclusive' (where the quoted price already contains the GST component).",
        "Many small business owners make the critical error of calculating inclusive GST by simply applying the tax percentage directly to the total price (e.g. taking 18% of ₹1,180). This overstates your tax liability and is mathematically incorrect.",
      ],
      callout: {
        type: "expertInsight",
        title: "The Reverse GST Extraction Formula",
        text: "When a price includes 18% GST, the taxable base is: Total ÷ 1.18. For ₹1,180, the taxable value is exactly ₹1,000, and the GST is ₹180. Multiplying 18% by ₹1,180 gives ₹212.40, which is incorrect!",
      },
      formulaBox: {
        title: "Core GST Formulas",
        formula:
          "Exclusive GST = Amount × GST Rate ÷ 100\nTotal (Exclusive) = Amount + GST\n\nTaxable Value (Inclusive) = Amount ÷ (1 + GST Rate ÷ 100)\nGST Amount (Inclusive) = Amount − Taxable Value",
        variables: [
          { name: "Taxable Value", desc: "Base price of goods/services before taxes" },
          { name: "GST Rate", desc: "Applicable tariff slab (0%, 0.25%, 3%, 5%, 12%, 18%, 28%)" },
        ],
      },
    },
    {
      title: "2. Intra-State (CGST + SGST) vs. Inter-State (IGST) Supply",
      paragraphs: [
        "Under the Indian Goods and Services Tax framework, tax components are allocated based on whether the supply is within the same state or across state borders:",
        "1. Intra-State Supply (Within Same State): When the supplier's location and place of supply are in the same state or union territory, tax is split equally between Central GST (CGST) and State GST (SGST or UTGST). For an 18% GST rate, 9% is CGST and 9% is SGST.",
        "2. Inter-State Supply (Different State): When the supplier and place of supply are in different states, Integrated GST (IGST) applies at the full rate (18%). IGST is not split on the invoice.",
      ],
      table: {
        headers: ["GST Rate", "Intra-State CGST", "Intra-State SGST", "Inter-State IGST"],
        rows: [
          ["0% (Exempt)", "0%", "0%", "0%"],
          ["3% (Gold)", "1.5%", "1.5%", "3%"],
          ["5% (Essentials)", "2.5%", "2.5%", "5%"],
          ["12% (Apparel/Food)", "6%", "6%", "12%"],
          ["18% (Standard Rate)", "9%", "9%", "18%"],
          ["28% (Luxury Goods)", "14%", "14%", "28%"],
        ],
      },
    },
    {
      title: "3. Trade Discounts and Taxable Value (Section 15 CGST Act)",
      paragraphs: [
        "Section 15 of the CGST Act regulates how discounts are treated when computing taxable value. Discounts offered before or at the time of supply that are clearly recorded on the invoice are legally deducted from the price before calculating GST.",
        "For example, if an item costs ₹1,000 and you offer a 10% trade discount (₹100), GST at 18% is calculated on the net taxable amount of ₹900 (GST = ₹162). The customer pays ₹1,062.",
      ],
      callout: {
        type: "commonMistake",
        title: "Post-Supply Discounts Require Credit Notes",
        text: "Discounts granted after supply (such as annual turnover bonuses or volume rebates) cannot simply be deducted from subsequent bills. They require formal GST Credit Notes under Section 34 of the CGST Act.",
      },
    },
    {
      title: "4. Multi-Product Invoices with Mixed GST Rates",
      paragraphs: [
        "Modern retailers and distributors frequently sell items with different GST rates on the same bill (for example, grocery items at 5% and packaged consumer goods at 18%).",
        "GST must always be calculated line by line for each individual product using its specific statutory rate. You should never apply an 'average' GST rate to the entire invoice total, as this violates GST billing regulations.",
      ],
    },
  ],
  faqs: [
    {
      q: "How do I calculate GST on an amount?",
      a: "For GST exclusive prices, multiply the taxable amount by the GST rate percentage and divide by 100 (e.g. ₹1,000 × 18 ÷ 100 = ₹180 GST; total = ₹1,180). For GST inclusive prices, divide the total amount by (1 + GST Rate / 100) to find the taxable value, then subtract it from the total to find the GST amount.",
    },
    {
      q: "What is the difference between GST inclusive and exclusive?",
      a: "GST Exclusive means the price quoted does not include tax, so GST will be added on top. GST Inclusive means the quoted price already includes the GST component (common in consumer retail MRP).",
    },
    {
      q: "How do I calculate CGST and SGST?",
      a: "For sales within the same state (intra-state supply), total GST is divided equally into Central GST (CGST) and State GST (SGST). For example, on an 18% GST rate, CGST is 9% and SGST is 9%.",
    },
    {
      q: "When is IGST applicable?",
      a: "Integrated Goods and Services Tax (IGST) is applicable when goods or services are supplied across state boundaries (inter-state supply) or imported into India. IGST is charged at the full rate without splitting into central and state shares.",
    },
    {
      q: "How do I calculate GST after a discount?",
      a: "Under Section 15 of the CGST Act, trade discounts shown on the invoice before or at the time of supply must be subtracted from the original amount first. GST is then calculated on the discounted taxable value.",
    },
    {
      q: "How do I calculate GST on multiple products with different rates?",
      a: "Calculate the GST for each item independently using its specific rate (e.g. 5% on books, 18% on stationery). Then sum the taxable values and tax amounts grouped by rate slab in the invoice summary.",
    },
    {
      q: "What is taxable value?",
      a: "Taxable value is the base transaction amount on which GST is levied, after deducting eligible trade discounts and before adding CGST, SGST, or IGST.",
    },
    {
      q: "How do I extract GST from an inclusive price?",
      a: "Divide the total price by (1 + GST rate / 100). For example, if an item is ₹1,050 inclusive of 5% GST: Taxable value = ₹1,050 / 1.05 = ₹1,000. GST extracted is ₹1,050 - ₹1,000 = ₹50.",
    },
    {
      q: "Does this calculator generate a legal tax invoice?",
      a: "This calculator provides mathematical estimations and structured invoice previews. A legally valid tax invoice issued under Rule 46 of the CGST Rules requires verified GSTINs, sequential numbering, HSN/SAC codes where mandatory, and statutory compliance.",
    },
    {
      q: "How do I know which GST rate applies to my product?",
      a: "GST rates are determined by the Harmonized System of Nomenclature (HSN) code for goods or Services Accounting Code (SAC) for services as notified by the CBIC and GST Council. Always verify against official CBIC tariff schedules.",
    },
  ],
  internalLinks: [
    {
      text: "Calculate Product Profits & Profit Margins",
      calculatorName: "Product Profit Calculator",
      href: "/calculator/product-profit-calculator",
    },
    {
      text: "Calculate Take-Home Pay & CTC Deductions",
      calculatorName: "CTC to In-Hand Salary Calculator",
      href: "/calculator/ctc-to-in-hand-salary-calculator",
    },
  ],
};

export default GstInvoiceCalculator;

export function GstInvoiceCalculator() {
  const calc = getCalculator("gst-invoice-calculator")!;
  const { markCalculated, resetCalculated } = useHasCalculated();
  const resultsRef = useRef<HTMLDivElement>(null);

  // Mode Selection: "single" (Mode A - Quick GST) or "invoice" (Mode B - Full Invoice)
  const [activeMode, setActiveMode] = useState<"single" | "invoice">("single");

  // Mode A: Quick Single GST Calculator State
  const [amount, setAmount] = useState<number>(1000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [isCustomRate, setIsCustomRate] = useState<boolean>(false);
  const [customRateInput, setCustomRateInput] = useState<string>("12");
  const [priceType, setPriceType] = useState<PriceType>("exclusive");
  const [supplyType, setSupplyType] = useState<SupplyType>("intra_state");

  // Mode A Discount State
  const [hasDiscount, setHasDiscount] = useState<boolean>(false);
  const [discountType, setDiscountType] = useState<DiscountType>("percent");
  const [discountValue, setDiscountValue] = useState<number>(10);

  // Copy Feedback state
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Mode B: Full Invoice State
  const [invoiceSupplyType, setInvoiceSupplyType] = useState<SupplyType>("intra_state");
  const [applyRounding, setApplyRounding] = useState<boolean>(false);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState<boolean>(false);
  const [showRateSummary, setShowRateSummary] = useState<boolean>(false);

  // Mode B Meta Details
  const [metaDetails, setMetaDetails] = useState<InvoiceMetaDetails>({
    sellerName: "",
    sellerAddress: "",
    sellerGstin: "",
    sellerState: "",
    buyerName: "",
    buyerAddress: "",
    buyerGstin: "",
    buyerState: "",
    placeOfSupply: "",
    invoiceNumber: "INV-2026-001",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    isReverseCharge: false,
    notes: "Thank you for your business!",
  });

  // Mode B Line Items
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    {
      id: "1",
      description: "Consulting & Professional Services",
      hsnSac: "998311",
      quantity: 1,
      unitPrice: 5000,
      discountType: "none",
      discountValue: 0,
      gstRate: 18,
      priceType: "exclusive",
    },
    {
      id: "2",
      description: "Printed Marketing Material & Books",
      hsnSac: "4901",
      quantity: 2,
      unitPrice: 1000,
      discountType: "none",
      discountValue: 0,
      gstRate: 5,
      priceType: "exclusive",
    },
  ]);

  // Active Effective Rate in Mode A
  const effectiveGstRate = isCustomRate ? Math.max(0, Number(customRateInput) || 0) : gstRate;

  // Mode A Input Object
  const singleInput: SingleGstInput = useMemo(() => {
    return {
      amount,
      gstRate: effectiveGstRate,
      priceType,
      supplyType,
      hasDiscount,
      discountType: hasDiscount ? discountType : "none",
      discountValue: hasDiscount ? discountValue : 0,
    };
  }, [amount, effectiveGstRate, priceType, supplyType, hasDiscount, discountType, discountValue]);

  // Mode A Validation
  const validation = useMemo(() => {
    return validateSingleGstInput(singleInput);
  }, [singleInput]);

  // Mode A Calculation Result
  const singleResult: SingleGstResult = useMemo(() => {
    return calculateSingleGst(singleInput);
  }, [singleInput]);

  // Mode B Full Invoice Calculation Result
  const invoiceResult = useMemo(() => {
    return calculateFullInvoice(lineItems, invoiceSupplyType, applyRounding);
  }, [lineItems, invoiceSupplyType, applyRounding]);

  // Quick Preset Scenarios
  const handleApplyPreset = (scenario: "excl18" | "incl18" | "igst18" | "excl5") => {
    setActiveMode("single");
    setHasDiscount(false);
    setIsCustomRate(false);

    if (scenario === "excl18") {
      setAmount(1000);
      setGstRate(18);
      setPriceType("exclusive");
      setSupplyType("intra_state");
    } else if (scenario === "incl18") {
      setAmount(1180);
      setGstRate(18);
      setPriceType("inclusive");
      setSupplyType("intra_state");
    } else if (scenario === "igst18") {
      setAmount(1000);
      setGstRate(18);
      setPriceType("exclusive");
      setSupplyType("inter_state");
    } else if (scenario === "excl5") {
      setAmount(2000);
      setGstRate(5);
      setPriceType("exclusive");
      setSupplyType("intra_state");
    }
    markCalculated();
  };

  // Reset Function
  const handleReset = () => {
    setAmount(1000);
    setGstRate(18);
    setIsCustomRate(false);
    setCustomRateInput("12");
    setPriceType("exclusive");
    setSupplyType("intra_state");
    setHasDiscount(false);
    setDiscountType("percent");
    setDiscountValue(10);
    setInvoiceSupplyType("intra_state");
    setApplyRounding(false);
    setLineItems([
      {
        id: "1",
        description: "Standard Item / Service",
        hsnSac: "",
        quantity: 1,
        unitPrice: 1000,
        discountType: "none",
        discountValue: 0,
        gstRate: 18,
        priceType: "exclusive",
      },
    ]);
    resetCalculated();
  };

  // Copy Summary Handler
  const handleCopySummary = () => {
    let summaryText = "";
    if (activeMode === "single") {
      summaryText = [
        `GST Calculation Summary — CalcZen`,
        `--------------------------------`,
        `Price Type: ${priceType === "exclusive" ? "GST Exclusive (+ Tax)" : "GST Inclusive (Tax Included)"}`,
        `Supply Type: ${supplyType === "intra_state" ? "Intra-State (Same State)" : "Inter-State (Different State)"}`,
        `Taxable Value: ${formatINR(singleResult.taxableValue)}`,
        `GST Rate: ${formatGstRate(singleResult.gstRate)}`,
        supplyType === "intra_state"
          ? `CGST (${singleResult.cgstRate}%): ${formatINR(singleResult.cgstAmount)}\nSGST (${singleResult.sgstRate}%): ${formatINR(singleResult.sgstAmount)}`
          : `IGST (${singleResult.igstRate}%): ${formatINR(singleResult.igstAmount)}`,
        `Total GST: ${formatINR(singleResult.totalGst)}`,
        `Final Invoice Amount: ${formatINR(singleResult.finalTotal)}`,
      ].join("\n");
    } else {
      summaryText = [
        `Invoice GST Summary — CalcZen`,
        `--------------------------------`,
        `Total Items: ${lineItems.length}`,
        `Total Taxable Value: ${formatINR(invoiceResult.totalTaxableValue)}`,
        invoiceSupplyType === "intra_state"
          ? `CGST: ${formatINR(invoiceResult.totalCgstAmount)}\nSGST: ${formatINR(invoiceResult.totalSgstAmount)}`
          : `IGST: ${formatINR(invoiceResult.totalIgstAmount)}`,
        `Total GST: ${formatINR(invoiceResult.totalGstAmount)}`,
        applyRounding ? `Rounding Adjustment: ${formatINR(invoiceResult.roundingAdjustment)}` : ``,
        `Total Payable: ${formatINR(invoiceResult.finalPayableAmount)}`,
      ]
        .filter(Boolean)
        .join("\n");
    }

    navigator.clipboard.writeText(summaryText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Line item manipulation helpers (Mode B)
  const handleAddLineItem = () => {
    const newItem: InvoiceLineItem = {
      id: Date.now().toString(),
      description: `Product / Service ${lineItems.length + 1}`,
      hsnSac: "",
      quantity: 1,
      unitPrice: 500,
      discountType: "none",
      discountValue: 0,
      gstRate: 18,
      priceType: "exclusive",
    };
    setLineItems([...lineItems, newItem]);
    markCalculated();
  };

  const handleRemoveLineItem = (id: string) => {
    if (lineItems.length <= 1) return;
    setLineItems(lineItems.filter((it) => it.id !== id));
    markCalculated();
  };

  const handleUpdateLineItem = (id: string, updates: Partial<InvoiceLineItem>) => {
    setLineItems(lineItems.map((it) => (it.id === id ? { ...it, ...updates } : it)));
    markCalculated();
  };

  // PDF Export Data for SavePDFButton
  const pdfData = useMemo(() => {
    if (activeMode === "single") {
      return {
        calculatorName: "GST Invoice Calculator",
        calculatorSlug: "gst-invoice-calculator",
        siteName: "CalcZen",
        siteUrl: "https://www.calczen.in",
        inputs: [
          { label: "Price Type", value: priceType === "exclusive" ? "GST Exclusive (+ Tax)" : "GST Inclusive (Tax Inside)" },
          { label: "Entered Amount", value: formatINR(amount) },
          { label: "GST Rate", value: `${formatGstRate(effectiveGstRate)}%` },
          { label: "Supply Type", value: supplyType === "intra_state" ? "Intra-State (CGST + SGST)" : "Inter-State (IGST)" },
          ...(hasDiscount ? [{ label: "Trade Discount", value: discountType === "percent" ? `${discountValue}%` : formatINR(discountValue) }] : []),
        ],
        results: [
          { label: "Taxable Value", value: formatINR(singleResult.displayedTaxableValue) },
          ...(supplyType === "intra_state"
            ? [
                { label: `CGST (${singleResult.cgstRate}%)`, value: formatINR(singleResult.displayedCgst) },
                { label: `SGST (${singleResult.sgstRate}%)`, value: formatINR(singleResult.displayedSgst) },
              ]
            : [{ label: `IGST (${singleResult.igstRate}%)`, value: formatINR(singleResult.displayedIgst) }]),
          { label: "Total GST Amount", value: formatINR(singleResult.displayedTotalGst) },
          { label: "Final Amount Payable", value: formatINR(singleResult.displayedFinalTotal) },
        ],
      };
    } else {
      return {
        calculatorName: "GST Multi-Product Tax Invoice",
        calculatorSlug: "gst-invoice-calculator",
        siteName: "CalcZen",
        siteUrl: "https://www.calczen.in",
        inputs: [
          { label: "Total Line Items", value: `${lineItems.length}` },
          { label: "Supply Type", value: invoiceSupplyType === "intra_state" ? "Intra-State (CGST + SGST)" : "Inter-State (IGST)" },
          { label: "Whole Rupee Rounding", value: applyRounding ? "Enabled" : "Disabled" },
        ],
        results: [
          { label: "Total Taxable Value", value: formatINR(invoiceResult.totalTaxableValue) },
          ...(invoiceSupplyType === "intra_state"
            ? [
                { label: "Total CGST", value: formatINR(invoiceResult.totalCgstAmount) },
                { label: "Total SGST", value: formatINR(invoiceResult.totalSgstAmount) },
              ]
            : [{ label: "Total IGST", value: formatINR(invoiceResult.totalIgstAmount) }]),
          { label: "Total GST Amount", value: formatINR(invoiceResult.totalGstAmount) },
          ...(applyRounding ? [{ label: "Rounding Adjustment", value: formatINR(invoiceResult.roundingAdjustment) }] : []),
          { label: "Final Payable Amount", value: formatINR(invoiceResult.finalPayableAmount) },
        ],
      };
    }
  }, [
    activeMode,
    amount,
    effectiveGstRate,
    priceType,
    supplyType,
    hasDiscount,
    discountType,
    discountValue,
    singleResult,
    lineItems,
    invoiceSupplyType,
    applyRounding,
    invoiceResult,
  ]);

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Calculate GST on your products and services. Find taxable value, CGST, SGST, IGST, and the final invoice amount in seconds with inclusive, exclusive, and multi-product invoice options."
      formula={`GST Exclusive:\nGST Amount = Taxable Amount × GST Rate ÷ 100\nFinal Invoice Total = Taxable Amount + GST Amount\n\nGST Inclusive:\nTaxable Value = Total Amount ÷ (1 + GST Rate ÷ 100)\nGST Amount = Total Amount − Taxable Value\n\nTax Split:\n• Intra-State Supply: CGST = GST ÷ 2, SGST = GST ÷ 2\n• Inter-State Supply: IGST = Full GST Rate`}
      example={`1. ₹1,000 Exclusive at 18% GST (Intra-state):\nTaxable = ₹1,000.00 | CGST (9%) = ₹90.00 | SGST (9%) = ₹90.00 | Final Total = ₹1,180.00\n\n2. ₹1,180 Inclusive at 18% GST (Extract Tax):\nTaxable = ₹1,180 ÷ 1.18 = ₹1,000.00 | GST = ₹180.00 | Total = ₹1,180.00`}
      faqs={GST_INVOICE_BLOG_CONTENT.faqs!}
      blog={<CalculatorBlog content={GST_INVOICE_BLOG_CONTENT} />}
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Mode Selector & Quick Presets Bar */}
        <div className="p-4 bg-muted/30 border border-border/60 rounded-2xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-card border border-border/80 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setActiveMode("single");
                  markCalculated();
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeMode === "single"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ⚡ Quick GST Calculator
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveMode("invoice");
                  markCalculated();
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeMode === "invoice"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                📑 Full Invoice Mode (Multi-Item)
              </button>
            </div>

            {/* Quick Action Presets */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mr-1 hidden sm:inline">
                Presets:
              </span>
              <button
                type="button"
                onClick={() => handleApplyPreset("excl18")}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-background border border-border hover:border-primary/50 transition-colors"
              >
                ₹1k @ 18% Excl
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset("incl18")}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-background border border-border hover:border-primary/50 transition-colors"
              >
                ₹1,180 Incl (Extract)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset("igst18")}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-background border border-border hover:border-primary/50 transition-colors"
              >
                IGST (Inter-State)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset("excl5")}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-background border border-border hover:border-primary/50 transition-colors"
              >
                5% Rate
              </button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MODE A: QUICK SINGLE GST CALCULATOR                                       */}
        {/* ========================================================================= */}
        {activeMode === "single" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Inputs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                  <Receipt className="h-5 w-5 text-primary" />
                  <h2 className="text-base font-semibold text-foreground">
                    Enter Amount & Select GST Rate
                  </h2>
                </div>

                {/* Input 1: Amount */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="gstAmount" className="text-sm font-medium">
                      Enter product or service amount (₹)
                    </Label>
                    <span className="text-[11px] text-muted-foreground">Rupees with decimals</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                      ₹
                    </span>
                    <Input
                      id="gstAmount"
                      type="number"
                      min={0}
                      step="any"
                      value={amount === 0 ? "" : amount}
                      onChange={(e) => {
                        setAmount(e.target.value === "" ? 0 : Number(e.target.value));
                        markCalculated();
                      }}
                      placeholder="e.g. 1000"
                      className="pl-8 text-base font-semibold"
                    />
                  </div>
                </div>

                {/* Input 2: GST Rate Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Select GST Rate Percentage</Label>
                    <span className="text-[11px] text-muted-foreground">
                      Current Rate: {formatGstRate(effectiveGstRate)}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {STANDARD_GST_RATES.map((rateObj) => (
                      <button
                        key={rateObj.value}
                        type="button"
                        onClick={() => {
                          setIsCustomRate(false);
                          setGstRate(rateObj.value);
                          markCalculated();
                        }}
                        className={`h-9 rounded-xl border text-xs font-semibold transition-all ${
                          !isCustomRate && gstRate === rateObj.value
                            ? "bg-primary text-primary-foreground border-primary shadow-xs"
                            : "bg-background border-border hover:border-primary/40 text-foreground"
                        }`}
                      >
                        {rateObj.value}%
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setIsCustomRate(true)}
                      className={`h-9 rounded-xl border text-xs font-semibold transition-all ${
                        isCustomRate
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-background border-border hover:border-primary/40 text-foreground"
                      }`}
                    >
                      Custom
                    </button>
                  </div>

                  {isCustomRate && (
                    <div className="pt-2 flex items-center gap-2">
                      <Label htmlFor="customRate" className="text-xs font-medium shrink-0">
                        Custom GST Rate:
                      </Label>
                      <div className="relative w-28">
                        <Input
                          id="customRate"
                          type="number"
                          min={0}
                          max={100}
                          step="any"
                          value={customRateInput}
                          onChange={(e) => {
                            setCustomRateInput(e.target.value);
                            markCalculated();
                          }}
                          className="h-8 pr-7 text-xs font-semibold"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          %
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        Enter any official rate notified by CBIC
                      </span>
                    </div>
                  )}
                </div>

                {/* Input 3: Price Type (Exclusive vs Inclusive) */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Price Type</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setPriceType("exclusive");
                        markCalculated();
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        priceType === "exclusive"
                          ? "border-primary bg-primary/10 font-semibold shadow-xs"
                          : "border-border hover:border-primary/30 bg-card"
                      }`}
                    >
                      <div className="text-xs font-bold text-foreground">
                        GST Exclusive (+ Tax)
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1 leading-normal">
                        Amount is before tax. GST will be added on top.
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPriceType("inclusive");
                        markCalculated();
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        priceType === "inclusive"
                          ? "border-primary bg-primary/10 font-semibold shadow-xs"
                          : "border-border hover:border-primary/30 bg-card"
                      }`}
                    >
                      <div className="text-xs font-bold text-foreground">
                        GST Inclusive (Tax Inside)
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1 leading-normal">
                        Amount already includes tax. Extracts base price & GST.
                      </div>
                    </button>
                  </div>
                </div>

                {/* Input 4: Supply Type (Intra-state vs Inter-state) */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Supply Type (Tax Split)</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSupplyType("intra_state");
                        markCalculated();
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        supplyType === "intra_state"
                          ? "border-primary bg-primary/10 font-semibold shadow-xs"
                          : "border-border hover:border-primary/30 bg-card"
                      }`}
                    >
                      <div className="text-xs font-bold text-foreground">
                        Within Same State
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1 leading-normal">
                        Split into <strong>CGST (Central)</strong> + <strong>SGST (State)</strong>.
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSupplyType("inter_state");
                        markCalculated();
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        supplyType === "inter_state"
                          ? "border-primary bg-primary/10 font-semibold shadow-xs"
                          : "border-border hover:border-primary/30 bg-card"
                      }`}
                    >
                      <div className="text-xs font-bold text-foreground">
                        Another State (Inter-State)
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1 leading-normal">
                        Charged as single <strong>IGST (Integrated Tax)</strong>.
                      </div>
                    </button>
                  </div>
                </div>

                {/* Collapsible Discount Option */}
                <div className="border border-border/80 rounded-xl overflow-hidden bg-muted/15">
                  <button
                    type="button"
                    onClick={() => setHasDiscount(!hasDiscount)}
                    className="w-full flex items-center justify-between p-3.5 text-left hover:bg-muted/30 transition-colors text-xs font-semibold"
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <span>Add Trade Discount (Optional)</span>
                      {hasDiscount && discountValue > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-primary/20 text-primary font-bold">
                          {discountType === "percent" ? `${discountValue}%` : `₹${discountValue}`} Off
                        </span>
                      )}
                    </div>
                    {hasDiscount ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>

                  {hasDiscount && (
                    <div className="p-4 border-t border-border/40 space-y-3 bg-card">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                          <button
                            type="button"
                            onClick={() => setDiscountType("percent")}
                            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                              discountType === "percent"
                                ? "bg-card text-foreground shadow-xs font-semibold"
                                : "text-muted-foreground"
                            }`}
                          >
                            Percentage (%)
                          </button>
                          <button
                            type="button"
                            onClick={() => setDiscountType("fixed")}
                            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                              discountType === "fixed"
                                ? "bg-card text-foreground shadow-xs font-semibold"
                                : "text-muted-foreground"
                            }`}
                          >
                            Fixed Amount (₹)
                          </button>
                        </div>

                        <div className="relative flex-1">
                          {discountType === "fixed" && (
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                              ₹
                            </span>
                          )}
                          <Input
                            type="number"
                            min={0}
                            max={discountType === "percent" ? 100 : amount}
                            value={discountValue === 0 ? "" : discountValue}
                            onChange={(e) => {
                              setDiscountValue(Number(e.target.value));
                              markCalculated();
                            }}
                            className={`h-9 text-xs font-medium ${
                              discountType === "fixed" ? "pl-7" : "pr-7"
                            }`}
                            placeholder="0"
                          />
                          {discountType === "percent" && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                              %
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Under Section 15 of CGST Act, discounts recorded on the invoice before or at supply reduce the taxable value.
                      </p>
                    </div>
                  )}
                </div>

                {/* Primary Calculate Button */}
                <Button
                  type="button"
                  onClick={() => {
                    markCalculated();
                    resultsRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full h-11 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Calculator className="h-4 w-4" />
                  Calculate GST
                </Button>
              </div>

              {/* Validation Alert */}
              {!validation.isValid && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2.5">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{validation.error}</span>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Results Dashboard */}
            <div ref={resultsRef} className="lg:col-span-5 space-y-6">
              <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-5 lg:sticky lg:top-24">
                <div className="flex items-center justify-between border-b border-border/60 pb-3.5">
                  <div className="flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-primary" />
                    <h2 className="text-base font-semibold text-foreground">
                      GST Calculation Result
                    </h2>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                    {formatGstRate(singleResult.gstRate)} GST
                  </div>
                </div>

                {/* Big Hero Card: Final Invoice Amount */}
                <div className="p-5 sm:p-6 rounded-2xl border bg-primary/5 dark:bg-primary/10 border-primary/20 text-foreground transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Final Invoice Amount
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/15 text-primary">
                      {priceType === "exclusive" ? "Net Payable" : "Gross Total"}
                    </span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold mt-2.5 tracking-tight text-primary">
                    {formatINR(singleResult.displayedFinalTotal)}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-primary/20 text-xs text-muted-foreground">
                    <span>Taxable: <strong className="text-foreground font-semibold">{formatINR(singleResult.displayedTaxableValue)}</strong></span>
                    <span className="text-primary/40">•</span>
                    <span>GST: <strong className="text-foreground font-semibold">{formatINR(singleResult.displayedTotalGst)}</strong></span>
                  </div>
                </div>

                {/* Financial Breakdown Table */}
                <div className="rounded-2xl border border-border overflow-hidden text-xs shadow-xs">
                  <div className="bg-muted/60 px-4 py-3 font-semibold text-foreground flex items-center justify-between border-b border-border">
                    <span>Component</span>
                    <span>Amount</span>
                  </div>
                  <div className="divide-y divide-border/60">
                    <div className="px-4 py-3 flex items-center justify-between text-muted-foreground leading-normal">
                      <span>Entered Amount:</span>
                      <span className="font-semibold text-foreground">{formatINR(amount)}</span>
                    </div>

                    {singleResult.discountAmount > 0 && (
                      <div className="px-4 py-3 flex items-center justify-between text-muted-foreground leading-normal">
                        <span>Trade Discount:</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          −{formatINR(singleResult.discountAmount)}
                        </span>
                      </div>
                    )}

                    <div className="px-4 py-3 flex items-center justify-between bg-muted/20 text-foreground font-medium leading-normal">
                      <span>Taxable Value:</span>
                      <span className="font-bold">{formatINR(singleResult.displayedTaxableValue)}</span>
                    </div>

                    {supplyType === "intra_state" ? (
                      <>
                        <div className="px-4 py-3 flex items-center justify-between text-muted-foreground leading-normal">
                          <span>CGST ({singleResult.cgstRate}% Central Tax):</span>
                          <span className="font-semibold text-foreground">
                            {formatINR(singleResult.displayedCgst)}
                          </span>
                        </div>
                        <div className="px-4 py-3 flex items-center justify-between text-muted-foreground leading-normal">
                          <span>SGST ({singleResult.sgstRate}% State Tax):</span>
                          <span className="font-semibold text-foreground">
                            {formatINR(singleResult.displayedSgst)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="px-4 py-3 flex items-center justify-between text-muted-foreground leading-normal">
                        <span>IGST ({singleResult.igstRate}% Integrated Tax):</span>
                        <span className="font-semibold text-foreground">
                          {formatINR(singleResult.displayedIgst)}
                        </span>
                      </div>
                    )}

                    <div className="px-4 py-3 flex items-center justify-between text-muted-foreground leading-normal">
                      <span>Total GST Amount:</span>
                      <span className="font-bold text-foreground">
                        {formatINR(singleResult.displayedTotalGst)}
                      </span>
                    </div>

                    <div className="px-4 py-3.5 flex items-center justify-between bg-primary/10 font-bold text-foreground text-sm leading-normal">
                      <span>Total Amount Payable:</span>
                      <span className="text-primary text-base font-extrabold">{formatINR(singleResult.displayedFinalTotal)}</span>
                    </div>
                  </div>
                </div>

                {/* Calculation Method Card */}
                <div className="p-4 rounded-2xl bg-muted/30 border border-border/80 text-xs space-y-2">
                  <div className="font-semibold flex items-center gap-2 text-foreground">
                    <Info className="h-4 w-4 text-primary shrink-0" />
                    <span>Calculation Breakdown</span>
                  </div>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">
                    {singleResult.explanation}
                  </p>
                </div>

                {/* Action Buttons Toolbar */}
                <div className="pt-3 border-t border-border/60">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopySummary}
                      className="flex-1 h-9.5 text-xs font-semibold rounded-xl border-border hover:bg-muted"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 mr-1.5" />
                          Copy Summary
                        </>
                      )}
                    </Button>

                    <SavePDFButton
                      pdfData={pdfData}
                      disabled={amount <= 0}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleReset}
                      title="Reset Calculator"
                      className="h-9.5 w-9.5 rounded-xl border-border hover:bg-muted text-muted-foreground hover:text-foreground shrink-0"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE B: FULL MULTI-ITEM INVOICE CALCULATOR                                */}
        {/* ========================================================================= */}
        {activeMode === "invoice" && (
          <div className="space-y-6">
            {/* Top Toolbar: Supply Type & Rounding */}
            <div className="p-5 bg-card border border-border rounded-2xl shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4">
                <div>
                  <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Multi-Product GST Invoice Calculator
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Add multiple products or services with individual GST rates and discounts
                  </p>
                </div>

                {/* Supply Type Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">Supply Type:</span>
                  <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setInvoiceSupplyType("intra_state")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        invoiceSupplyType === "intra_state"
                          ? "bg-card text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Intra-State (CGST + SGST)
                    </button>
                    <button
                      type="button"
                      onClick={() => setInvoiceSupplyType("inter_state")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        invoiceSupplyType === "inter_state"
                          ? "bg-card text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Inter-State (IGST)
                    </button>
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <table className="w-full text-xs text-left min-w-[650px]">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground font-semibold">
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-2 w-20">HSN/SAC</th>
                      <th className="py-2.5 px-2 w-16">Qty</th>
                      <th className="py-2.5 px-2 w-24">Unit Price (₹)</th>
                      <th className="py-2.5 px-2 w-24">GST Rate</th>
                      <th className="py-2.5 px-2 w-24">Taxable</th>
                      <th className="py-2.5 px-2 w-20">GST</th>
                      <th className="py-2.5 px-2 w-28 text-right">Line Total</th>
                      <th className="py-2.5 px-2 w-10 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {lineItems.map((item, idx) => {
                      const calculated = invoiceResult.items[idx];
                      return (
                        <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                          {/* Description */}
                          <td className="py-2 px-3">
                            <Input
                              value={item.description}
                              onChange={(e) =>
                                handleUpdateLineItem(item.id, { description: e.target.value })
                              }
                              placeholder="Product or service name"
                              className="h-8 text-xs font-medium"
                            />
                          </td>

                          {/* HSN/SAC */}
                          <td className="py-2 px-2">
                            <Input
                              value={item.hsnSac || ""}
                              onChange={(e) =>
                                handleUpdateLineItem(item.id, { hsnSac: e.target.value })
                              }
                              placeholder="Opt"
                              className="h-8 text-xs"
                            />
                          </td>

                          {/* Quantity */}
                          <td className="py-2 px-2">
                            <Input
                              type="number"
                              min={1}
                              value={item.quantity === 0 ? "" : item.quantity}
                              onChange={(e) =>
                                handleUpdateLineItem(item.id, {
                                  quantity: Math.max(1, Number(e.target.value)),
                                })
                              }
                              className="h-8 text-xs font-medium"
                            />
                          </td>

                          {/* Unit Price */}
                          <td className="py-2 px-2">
                            <Input
                              type="number"
                              min={0}
                              step="any"
                              value={item.unitPrice === 0 ? "" : item.unitPrice}
                              onChange={(e) =>
                                handleUpdateLineItem(item.id, {
                                  unitPrice: Number(e.target.value),
                                })
                              }
                              className="h-8 text-xs font-medium"
                            />
                          </td>

                          {/* GST Rate */}
                          <td className="py-2 px-2">
                            <select
                              value={item.gstRate}
                              onChange={(e) =>
                                handleUpdateLineItem(item.id, {
                                  gstRate: Number(e.target.value),
                                })
                              }
                              className="h-8 w-full px-2 rounded-lg border border-border bg-card text-xs font-medium"
                            >
                              {STANDARD_GST_RATES.map((r) => (
                                <option key={r.value} value={r.value}>
                                  {r.value}%
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Taxable Value */}
                          <td className="py-2 px-2 font-medium text-foreground">
                            {formatINR(calculated ? calculated.taxableValue : 0)}
                          </td>

                          {/* GST Amount */}
                          <td className="py-2 px-2 text-muted-foreground">
                            {formatINR(calculated ? calculated.totalGst : 0)}
                          </td>

                          {/* Line Total */}
                          <td className="py-2 px-2 font-bold text-right text-foreground">
                            {formatINR(calculated ? calculated.totalAmount : 0)}
                          </td>

                          {/* Delete */}
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveLineItem(item.id)}
                              disabled={lineItems.length <= 1}
                              className="text-muted-foreground hover:text-destructive disabled:opacity-30 transition-colors"
                              title="Delete Item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Add Item Button */}
              <div className="pt-2 flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddLineItem}
                  className="h-8 text-xs font-semibold gap-1.5 rounded-xl"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Another Item
                </Button>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="roundingToggle"
                    checked={applyRounding}
                    onChange={(e) => setApplyRounding(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <Label htmlFor="roundingToggle" className="text-xs font-medium cursor-pointer">
                    Round to nearest whole rupee (₹)
                  </Label>
                </div>
              </div>
            </div>

            {/* Mixed GST Rate Summary Group */}
            <div className="p-4 bg-muted/20 border border-border/80 rounded-2xl space-y-3">
              <button
                type="button"
                onClick={() => setShowRateSummary(!showRateSummary)}
                className="w-full flex items-center justify-between text-left text-xs font-semibold"
              >
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>GST Tax Breakdown by Rate Slab</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary font-bold">
                    {invoiceResult.rateSummary.length} Rate Slabs
                  </span>
                </div>
                {showRateSummary ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {showRateSummary && (
                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-border/60 text-muted-foreground">
                        <th className="py-1.5 px-3">GST Rate</th>
                        <th className="py-1.5 px-3">Taxable Value</th>
                        {invoiceSupplyType === "intra_state" ? (
                          <>
                            <th className="py-1.5 px-3">CGST</th>
                            <th className="py-1.5 px-3">SGST</th>
                          </>
                        ) : (
                          <th className="py-1.5 px-3">IGST</th>
                        )}
                        <th className="py-1.5 px-3">Total Tax</th>
                        <th className="py-1.5 px-3 text-right">Invoice Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {invoiceResult.rateSummary.map((grp) => (
                        <tr key={grp.gstRate} className="hover:bg-muted/10">
                          <td className="py-2 px-3 font-bold text-foreground">
                            {formatGstRate(grp.gstRate)}
                          </td>
                          <td className="py-2 px-3 text-foreground font-medium">
                            {formatINR(grp.taxableValue)}
                          </td>
                          {invoiceSupplyType === "intra_state" ? (
                            <>
                              <td className="py-2 px-3 text-muted-foreground">
                                {formatINR(grp.cgstAmount)}
                              </td>
                              <td className="py-2 px-3 text-muted-foreground">
                                {formatINR(grp.sgstAmount)}
                              </td>
                            </>
                          ) : (
                            <td className="py-2 px-3 text-muted-foreground">
                              {formatINR(grp.igstAmount)}
                            </td>
                          )}
                          <td className="py-2 px-3 font-semibold text-foreground">
                            {formatINR(grp.totalGst)}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-primary">
                            {formatINR(grp.totalAmount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Optional Seller / Buyer Invoice Details Accordion */}
            <div className="border border-border rounded-2xl bg-card overflow-hidden">
              <button
                type="button"
                onClick={() => setShowInvoiceDetails(!showInvoiceDetails)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Building className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      Add Seller, Buyer & Invoice Information (Optional)
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Business name, GSTIN, invoice number, and place of supply for professional preview
                    </p>
                  </div>
                </div>
                {showInvoiceDetails ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {showInvoiceDetails && (
                <div className="p-5 border-t border-border/50 bg-muted/10 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Seller Details */}
                    <div className="space-y-3 p-4 rounded-xl border border-border bg-card">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <Building className="h-3.5 w-3.5 text-primary" />
                        Seller Details (Your Business)
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px]">Business Name</Label>
                        <Input
                          value={metaDetails.sellerName}
                          onChange={(e) =>
                            setMetaDetails({ ...metaDetails, sellerName: e.target.value })
                          }
                          placeholder="e.g. Acme Enterprises Pvt Ltd"
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px]">GSTIN</Label>
                        <Input
                          value={metaDetails.sellerGstin}
                          onChange={(e) =>
                            setMetaDetails({ ...metaDetails, sellerGstin: e.target.value })
                          }
                          placeholder="22AAAAA0000A1Z5"
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px]">Address & State</Label>
                        <Input
                          value={metaDetails.sellerAddress}
                          onChange={(e) =>
                            setMetaDetails({ ...metaDetails, sellerAddress: e.target.value })
                          }
                          placeholder="City, State, PIN"
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>

                    {/* Buyer Details */}
                    <div className="space-y-3 p-4 rounded-xl border border-border bg-card">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <User className="h-3.5 w-3.5 text-primary" />
                        Buyer / Client Details
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px]">Client Name</Label>
                        <Input
                          value={metaDetails.buyerName}
                          onChange={(e) =>
                            setMetaDetails({ ...metaDetails, buyerName: e.target.value })
                          }
                          placeholder="e.g. Sharma Trading Co."
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px]">Customer GSTIN (Optional)</Label>
                        <Input
                          value={metaDetails.buyerGstin}
                          onChange={(e) =>
                            setMetaDetails({ ...metaDetails, buyerGstin: e.target.value })
                          }
                          placeholder="24AAAAA0000A1Z5"
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px]">Address & Place of Supply</Label>
                        <Input
                          value={metaDetails.buyerAddress}
                          onChange={(e) =>
                            setMetaDetails({ ...metaDetails, buyerAddress: e.target.value })
                          }
                          placeholder="City, State"
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Invoice Meta */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl border border-border bg-card">
                    <div className="space-y-1.5">
                      <Label className="text-[11px]">Invoice Number</Label>
                      <Input
                        value={metaDetails.invoiceNumber}
                        onChange={(e) =>
                          setMetaDetails({ ...metaDetails, invoiceNumber: e.target.value })
                        }
                        placeholder="INV-001"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px]">Invoice Date</Label>
                      <Input
                        type="date"
                        value={metaDetails.invoiceDate}
                        onChange={(e) =>
                          setMetaDetails({ ...metaDetails, invoiceDate: e.target.value })
                        }
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px]">Payment Due Date</Label>
                      <Input
                        type="date"
                        value={metaDetails.dueDate}
                        onChange={(e) =>
                          setMetaDetails({ ...metaDetails, dueDate: e.target.value })
                        }
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mode B: Invoice Summary & Total Card */}
            <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border">
                  <div className="text-[11px] text-muted-foreground font-medium">Total Taxable Value</div>
                  <div className="text-xl font-bold text-foreground mt-0.5">
                    {formatINR(invoiceResult.totalTaxableValue)}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/30 border border-border">
                  <div className="text-[11px] text-muted-foreground font-medium">
                    {invoiceSupplyType === "intra_state" ? "Total CGST (Central)" : "Total IGST"}
                  </div>
                  <div className="text-xl font-bold text-foreground mt-0.5">
                    {invoiceSupplyType === "intra_state"
                      ? formatINR(invoiceResult.totalCgstAmount)
                      : formatINR(invoiceResult.totalIgstAmount)}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/30 border border-border">
                  <div className="text-[11px] text-muted-foreground font-medium">
                    {invoiceSupplyType === "intra_state" ? "Total SGST (State)" : "GST Tax Total"}
                  </div>
                  <div className="text-xl font-bold text-foreground mt-0.5">
                    {invoiceSupplyType === "intra_state"
                      ? formatINR(invoiceResult.totalSgstAmount)
                      : formatINR(invoiceResult.totalGstAmount)}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="text-[11px] text-primary font-bold uppercase tracking-wider">
                    Total Amount Payable
                  </div>
                  <div className="text-2xl font-extrabold text-primary mt-0.5">
                    {formatINR(invoiceResult.finalPayableAmount)}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border/60">
                <div className="text-xs text-muted-foreground">
                  Official invoice preview • Calculations adhere to Section 15 and 170 CGST Act
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopySummary}
                    className="h-9.5 text-xs font-semibold rounded-xl border-border hover:bg-muted"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 mr-1.5" />
                        Copy Invoice Summary
                      </>
                    )}
                  </Button>

                  <SavePDFButton
                    pdfData={pdfData}
                    disabled={invoiceResult.totalTaxableValue <= 0}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    className="h-9.5 text-xs font-semibold rounded-xl border-border hover:bg-muted gap-1.5"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Print Invoice
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorPageLayout>
  );
}

// -------------------------------------------------------------
// SEO BLOG & COMPREHENSIVE GUIDE CONTENT
// -------------------------------------------------------------
