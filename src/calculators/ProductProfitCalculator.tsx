import { useState, useMemo, useRef } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog, { type BlogContent } from "@/components/CalculatorBlog";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import {
  TrendingUp,
  Percent,
  ShoppingCart,
  Package,
  Truck,
  RotateCcw,
  CheckCircle2,
  Copy,
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
  Target,
  FileSpreadsheet,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Store,
  Calculator,
} from "lucide-react";
import {
  calculateProductProfit,
  calculateBreakEvenPrice,
  calculateTargetSellingPrice,
  formatINR,
  formatPercent,
  validateProfitInput,
  MARKETPLACE_PRESETS,
  type ProfitCalculationInput,
  type ProfitCalculationResult,
} from "@/utils/productProfitUtils";

export function ProductProfitCalculator() {
  const calc = getCalculator("product-profit-calculator")!;
  const { markCalculated, resetCalculated } = useHasCalculated();
  const resultsRef = useRef<HTMLDivElement>(null);

  // 1. Basic 3 visible inputs
  const [costPrice, setCostPrice] = useState<number>(500);
  const [sellingPrice, setSellingPrice] = useState<number>(800);
  const [quantity, setQuantity] = useState<number>(1);

  // 2. Collapsible Panels state
  const [showExtraExpenses, setShowExtraExpenses] = useState<boolean>(false);
  const [showDiscounts, setShowDiscounts] = useState<boolean>(false);
  const [showTargetPricing, setShowTargetPricing] = useState<boolean>(false);
  const [showGst, setShowGst] = useState<boolean>(false);
  const [showCostBreakdown, setShowCostBreakdown] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Extra expenses state
  const [packagingCost, setPackagingCost] = useState<number>(0);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [shippingType, setShippingType] = useState<"per_unit" | "per_order">("per_unit");
  const [advertisingCost, setAdvertisingCost] = useState<number>(0);
  const [marketplaceCommissionPct, setMarketplaceCommissionPct] = useState<number>(0);
  const [paymentGatewayFeePct, setPaymentGatewayFeePct] = useState<number>(0);
  const [fixedPlatformFeePerOrder, setFixedPlatformFeePerOrder] = useState<number>(0);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  // Discount state
  const [hasDiscount, setHasDiscount] = useState<boolean>(false);
  const [discountPct, setDiscountPct] = useState<number>(10);

  // GST state
  const [hasGst, setHasGst] = useState<boolean>(false);
  const [isSellingPriceGstInclusive, setIsSellingPriceGstInclusive] = useState<boolean>(true);
  const [gstRatePct, setGstRatePct] = useState<number>(18);

  // Target Pricing state
  const [targetType, setTargetType] = useState<"amount" | "margin">("amount");
  const [targetProfitAmount, setTargetProfitAmount] = useState<number>(250);
  const [targetMarginPct, setTargetMarginPct] = useState<number>(25);

  // Master calculation input
  const calculationInput: ProfitCalculationInput = useMemo(() => {
    const hasAnyExtra =
      showExtraExpenses &&
      (packagingCost > 0 ||
        shippingCost > 0 ||
        advertisingCost > 0 ||
        marketplaceCommissionPct > 0 ||
        paymentGatewayFeePct > 0 ||
        fixedPlatformFeePerOrder > 0);

    return {
      costPrice,
      sellingPrice,
      quantity,
      hasDiscount: showDiscounts && hasDiscount,
      discountPct: showDiscounts && hasDiscount ? discountPct : 0,
      hasExtraExpenses: hasAnyExtra,
      packagingCostPerUnit: packagingCost,
      shippingCost,
      shippingType,
      advertisingCostPerUnit: advertisingCost,
      marketplaceCommissionPct,
      paymentGatewayFeePct,
      fixedPlatformFeePerOrder,
      hasGst: showGst && hasGst,
      isSellingPriceGstInclusive,
      gstRatePct,
    };
  }, [
    costPrice,
    sellingPrice,
    quantity,
    showDiscounts,
    hasDiscount,
    discountPct,
    showExtraExpenses,
    packagingCost,
    shippingCost,
    shippingType,
    advertisingCost,
    marketplaceCommissionPct,
    paymentGatewayFeePct,
    fixedPlatformFeePerOrder,
    showGst,
    hasGst,
    isSellingPriceGstInclusive,
    gstRatePct,
  ]);

  // Validation
  const validation = useMemo(() => {
    return validateProfitInput(calculationInput);
  }, [calculationInput]);

  // Calculation results
  const result: ProfitCalculationResult = useMemo(() => {
    return calculateProductProfit(calculationInput);
  }, [calculationInput]);

  // Target price calculation
  const targetPriceResult = useMemo(() => {
    if (!showTargetPricing) return null;
    const baseFixedCost =
      costPrice +
      packagingCost +
      (shippingType === "per_order" ? shippingCost / Math.max(1, quantity) : shippingCost) +
      advertisingCost +
      fixedPlatformFeePerOrder / Math.max(1, quantity);
    const percentageRate = (marketplaceCommissionPct + paymentGatewayFeePct) / 100;

    return calculateTargetSellingPrice(
      baseFixedCost,
      percentageRate,
      targetType === "amount" ? { amount: targetProfitAmount } : { marginPct: targetMarginPct }
    );
  }, [
    showTargetPricing,
    costPrice,
    packagingCost,
    shippingCost,
    shippingType,
    advertisingCost,
    fixedPlatformFeePerOrder,
    quantity,
    marketplaceCommissionPct,
    paymentGatewayFeePct,
    targetType,
    targetProfitAmount,
    targetMarginPct,
  ]);

  // Quick Scenarios
  const handleApplyPresetScenario = (scenario: "retail" | "wholesale" | "amazon" | "d2c") => {
    if (scenario === "retail") {
      setCostPrice(500);
      setSellingPrice(800);
      setQuantity(1);
      setShowExtraExpenses(false);
      setShowDiscounts(false);
      setShowGst(false);
      setActivePresetId(null);
    } else if (scenario === "wholesale") {
      setCostPrice(120);
      setSellingPrice(180);
      setQuantity(50);
      setShowExtraExpenses(true);
      setPackagingCost(5);
      setShippingCost(300);
      setShippingType("per_order");
      setAdvertisingCost(0);
      setMarketplaceCommissionPct(0);
      setPaymentGatewayFeePct(0);
      setFixedPlatformFeePerOrder(0);
      setShowDiscounts(false);
      setShowGst(false);
      setActivePresetId(null);
    } else if (scenario === "amazon") {
      setCostPrice(350);
      setSellingPrice(999);
      setQuantity(1);
      setShowExtraExpenses(true);
      setPackagingCost(20);
      setShippingCost(45);
      setShippingType("per_unit");
      setAdvertisingCost(50);
      setMarketplaceCommissionPct(12);
      setPaymentGatewayFeePct(0);
      setFixedPlatformFeePerOrder(20);
      setShowDiscounts(true);
      setHasDiscount(true);
      setDiscountPct(10);
      setShowGst(true);
      setHasGst(true);
      setIsSellingPriceGstInclusive(true);
      setGstRatePct(18);
      setActivePresetId("amazon_in");
    } else if (scenario === "d2c") {
      setCostPrice(400);
      setSellingPrice(999);
      setQuantity(1);
      setShowExtraExpenses(true);
      setPackagingCost(25);
      setShippingCost(60);
      setShippingType("per_unit");
      setAdvertisingCost(150);
      setMarketplaceCommissionPct(0);
      setPaymentGatewayFeePct(2);
      setFixedPlatformFeePerOrder(0);
      setShowDiscounts(false);
      setShowGst(false);
      setActivePresetId("own_website");
    }
    markCalculated();
  };

  // Reset all
  const handleReset = () => {
    setCostPrice(500);
    setSellingPrice(800);
    setQuantity(1);
    setShowExtraExpenses(false);
    setPackagingCost(0);
    setShippingCost(0);
    setShippingType("per_unit");
    setAdvertisingCost(0);
    setMarketplaceCommissionPct(0);
    setPaymentGatewayFeePct(0);
    setFixedPlatformFeePerOrder(0);
    setActivePresetId(null);
    setShowDiscounts(false);
    setHasDiscount(false);
    setDiscountPct(10);
    setShowGst(false);
    setHasGst(false);
    setIsSellingPriceGstInclusive(true);
    setGstRatePct(18);
    setShowTargetPricing(false);
    resetCalculated();
  };

  // Copy Summary
  const handleCopySummary = () => {
    const summary = [
      `Product Profit Summary — CalcZen`,
      `--------------------------------`,
      `Cost Price: ${formatINR(result.productCostPerUnit)} / unit`,
      `Selling Price: ${formatINR(result.actualSellingPrice)} / unit`,
      `Quantity: ${quantity} units`,
      `Total Revenue: ${formatINR(result.totalRevenue)}`,
      `Net Profit Per Unit: ${formatINR(result.profitPerUnit)}`,
      `Total Net Profit: ${formatINR(result.totalProfit)}`,
      `Profit Margin: ${formatPercent(result.profitMarginPct)}`,
      `Markup: ${formatPercent(result.markupPct)}`,
      result.breakEvenPrice !== null
        ? `Break-Even Price: ${formatINR(result.breakEvenPrice)}`
        : ``,
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(summary);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // PDF Export data
  const pdfSections = useMemo(() => {
    return [
      {
        title: "Product Profit & Pricing Breakdown",
        items: [
          { label: "Product Cost Price", value: formatINR(result.productCostPerUnit) },
          { label: "Stated Selling Price", value: formatINR(result.originalSellingPrice) },
          { label: "Quantity", value: `${quantity} units` },
          {
            label: "Discount",
            value:
              result.discountAmountPerUnit > 0
                ? `${formatINR(result.discountAmountPerUnit)} (${calculationInput.discountPct}%)`
                : "None",
          },
          { label: "Actual Selling Price", value: formatINR(result.actualSellingPrice) },
          { label: "Total Revenue", value: formatINR(result.totalRevenue) },
          { label: "Total Cost of Goods & Fees", value: formatINR(result.totalCostOrder) },
          { label: "Net Profit Per Unit", value: formatINR(result.profitPerUnit) },
          { label: "Total Net Profit", value: formatINR(result.totalProfit) },
          { label: "Profit Margin", value: formatPercent(result.profitMarginPct) },
          { label: "Markup Percentage", value: formatPercent(result.markupPct) },
          {
            label: "Break-Even Price",
            value:
              result.breakEvenPrice !== null
                ? formatINR(result.breakEvenPrice)
                : "N/A",
          },
        ],
      },
    ];
  }, [result, quantity, calculationInput]);

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Calculate your product profit, net margin, markup percentage, and break-even selling price. Perfect for shopkeepers, manufacturers, resellers, and online marketplace sellers."
      formula={`Gross Profit = Selling Price − Product Cost Price\nNet Profit = Revenue − Total Costs (Packaging + Shipping + Platform Fees + Ads)\nProfit Margin (%) = (Net Profit / Actual Revenue) × 100\nMarkup (%) = (Net Profit / Base Cost Price) × 100\nBreak-Even Price = Fixed Costs per Unit / (1 − Percentage Fees Rate)`}
      example={`For a product bought at ₹500 and sold at ₹800 with 1 unit sold:\n• Net Profit = ₹800 − ₹500 = ₹300 per unit\n• Profit Margin = (₹300 / ₹800) × 100 = 37.50%\n• Markup = (₹300 / ₹500) × 100 = 60.00%\n• Break-Even Price = ₹500 (minimum price with 0 extra fees)`}
      faqs={PRODUCT_PROFIT_BLOG_CONTENT.faqs!}
      blog={<CalculatorBlog content={PRODUCT_PROFIT_BLOG_CONTENT} />}
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Quick Presets Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-muted/30 border border-border/60 rounded-2xl">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Quick Scenarios:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleApplyPresetScenario("retail")}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-background border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              🛍️ Retail Shop
            </button>
            <button
              type="button"
              onClick={() => handleApplyPresetScenario("wholesale")}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-background border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              📦 Wholesale / Bulk (50 pcs)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPresetScenario("amazon")}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-background border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              🛒 Amazon / Flipkart
            </button>
            <button
              type="button"
              onClick={() => handleApplyPresetScenario("d2c")}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-background border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              🌐 Own Website / D2C
            </button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset
            </Button>
          </div>
        </div>

        {/* Main Grid: Inputs (Left) and Results (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN: FORM INPUTS                                  */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: 3 Visible Initial Inputs */}
            <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-5">
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <Store className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold text-foreground">
                  Step 1: Product Pricing & Quantity
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cost Price */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="costPrice" className="text-sm font-medium">
                      Product Cost Price (₹)
                    </Label>
                    <span className="text-[11px] text-muted-foreground">What you paid</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                      ₹
                    </span>
                    <Input
                      id="costPrice"
                      type="number"
                      min={0}
                      step="any"
                      value={costPrice === 0 ? "" : costPrice}
                      onChange={(e) => {
                        setCostPrice(e.target.value === "" ? 0 : Number(e.target.value));
                        markCalculated();
                      }}
                      placeholder="e.g. 500"
                      className="pl-8 text-base font-medium"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Buying cost or manufacturing cost per unit
                  </p>
                </div>

                {/* Selling Price */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sellingPrice" className="text-sm font-medium">
                      Selling Price (₹)
                    </Label>
                    <span className="text-[11px] text-muted-foreground">Customer price</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                      ₹
                    </span>
                    <Input
                      id="sellingPrice"
                      type="number"
                      min={0}
                      step="any"
                      value={sellingPrice === 0 ? "" : sellingPrice}
                      onChange={(e) => {
                        setSellingPrice(e.target.value === "" ? 0 : Number(e.target.value));
                        markCalculated();
                      }}
                      placeholder="e.g. 800"
                      className="pl-8 text-base font-medium"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Price at which you sell to the customer
                  </p>
                </div>

                {/* Quantity */}
                <div className="sm:col-span-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="quantity" className="text-sm font-medium">
                      Quantity Sold (Units)
                    </Label>
                    <span className="text-[11px] text-muted-foreground">Default: 1 unit</span>
                  </div>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    step={1}
                    value={quantity === 0 ? "" : quantity}
                    onChange={(e) => {
                      setQuantity(Math.max(1, Number(e.target.value)));
                      markCalculated();
                    }}
                    placeholder="1"
                    className="text-base font-medium"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Enter multiple units to view bulk order revenue and total profits
                  </p>
                </div>
              </div>

              {/* Primary Action Button */}
              <Button
                type="button"
                onClick={() => {
                  markCalculated();
                  resultsRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full h-11 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Calculator className="h-4 w-4" />
                Calculate Profit
              </Button>
            </div>

            {/* Validation Alert */}
            {!validation.isValid && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{validation.error}</span>
              </div>
            )}

            {/* Step 2: Advanced Collapsible Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Optional Advanced Settings
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Tap any card below to expand
                </span>
              </div>

              {/* Accordion 1: Extra Expenses */}
              <div className="border border-border rounded-2xl bg-card overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() => setShowExtraExpenses(!showExtraExpenses)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                      <Package className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                        Extra Expenses & Shipping
                        {(packagingCost > 0 ||
                          shippingCost > 0 ||
                          advertisingCost > 0 ||
                          marketplaceCommissionPct > 0 ||
                          paymentGatewayFeePct > 0) && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Packaging, shipping, courier, marketing & platform commissions
                      </p>
                    </div>
                  </div>
                  {showExtraExpenses ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {showExtraExpenses && (
                  <div className="p-5 border-t border-border/50 bg-muted/10 space-y-5">
                    {/* Marketplace Presets */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Marketplace Fee Presets:
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {MARKETPLACE_PRESETS.map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => {
                              setActivePresetId(preset.id);
                              setMarketplaceCommissionPct(preset.defaultCommissionPct);
                              setFixedPlatformFeePerOrder(preset.defaultClosingFee);
                              setShippingCost(preset.defaultShippingFee);
                              setShippingType("per_unit");
                            }}
                            className={`p-2.5 rounded-xl border text-left transition-all text-xs ${
                              activePresetId === preset.id
                                ? "border-primary bg-primary/10 font-medium"
                                : "border-border hover:border-primary/40 bg-card"
                            }`}
                          >
                            <div className="font-semibold text-foreground line-clamp-1">
                              {preset.name.split(" ")[0]}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {preset.defaultCommissionPct}% comm + ₹{preset.defaultClosingFee} fee
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Packaging Cost */}
                      <div className="space-y-1.5">
                        <Label htmlFor="packaging" className="text-xs font-medium">
                          Packaging Cost (₹ / unit)
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            ₹
                          </span>
                          <Input
                            id="packaging"
                            type="number"
                            min={0}
                            value={packagingCost === 0 ? "" : packagingCost}
                            onChange={(e) => setPackagingCost(Number(e.target.value))}
                            placeholder="0"
                            className="pl-7 h-9 text-sm"
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground">Box, bubble wrap, tape</p>
                      </div>

                      {/* Shipping Cost */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="shipping" className="text-xs font-medium">
                            Shipping / Courier (₹)
                          </Label>
                          <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg">
                            <button
                              type="button"
                              onClick={() => setShippingType("per_unit")}
                              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                                shippingType === "per_unit"
                                  ? "bg-card text-foreground shadow-xs font-semibold"
                                  : "text-muted-foreground"
                              }`}
                            >
                              Per Unit
                            </button>
                            <button
                              type="button"
                              onClick={() => setShippingType("per_order")}
                              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                                shippingType === "per_order"
                                  ? "bg-card text-foreground shadow-xs font-semibold"
                                  : "text-muted-foreground"
                              }`}
                            >
                              Per Order
                            </button>
                          </div>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            ₹
                          </span>
                          <Input
                            id="shipping"
                            type="number"
                            min={0}
                            value={shippingCost === 0 ? "" : shippingCost}
                            onChange={(e) => setShippingCost(Number(e.target.value))}
                            placeholder="0"
                            className="pl-7 h-9 text-sm"
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          {shippingType === "per_order"
                            ? "Split evenly across all units in this order"
                            : "Charged on every single unit sold"}
                        </p>
                      </div>

                      {/* Advertising / Marketing */}
                      <div className="space-y-1.5">
                        <Label htmlFor="advertising" className="text-xs font-medium">
                          Ad Spend / CAC (₹ / unit)
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            ₹
                          </span>
                          <Input
                            id="advertising"
                            type="number"
                            min={0}
                            value={advertisingCost === 0 ? "" : advertisingCost}
                            onChange={(e) => setAdvertisingCost(Number(e.target.value))}
                            placeholder="0"
                            className="pl-7 h-9 text-sm"
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Estimated ad cost per customer acquired
                        </p>
                      </div>

                      {/* Platform Commission % */}
                      <div className="space-y-1.5">
                        <Label htmlFor="commission" className="text-xs font-medium">
                          Marketplace Commission (%)
                        </Label>
                        <div className="relative">
                          <Input
                            id="commission"
                            type="number"
                            min={0}
                            max={100}
                            value={marketplaceCommissionPct === 0 ? "" : marketplaceCommissionPct}
                            onChange={(e) => setMarketplaceCommissionPct(Number(e.target.value))}
                            placeholder="e.g. 10"
                            className="pr-7 h-9 text-sm"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            %
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          e.g. Amazon, Flipkart referral fee %
                        </p>
                      </div>

                      {/* Payment Gateway Fee % */}
                      <div className="space-y-1.5">
                        <Label htmlFor="pgFee" className="text-xs font-medium">
                          Payment Gateway Fee (%)
                        </Label>
                        <div className="relative">
                          <Input
                            id="pgFee"
                            type="number"
                            min={0}
                            max={10}
                            value={paymentGatewayFeePct === 0 ? "" : paymentGatewayFeePct}
                            onChange={(e) => setPaymentGatewayFeePct(Number(e.target.value))}
                            placeholder="e.g. 2"
                            className="pr-7 h-9 text-sm"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            %
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Razorpay, Cashfree, Stripe (typical ~2%)
                        </p>
                      </div>

                      {/* Fixed Platform Fee per order */}
                      <div className="space-y-1.5">
                        <Label htmlFor="fixedPlatform" className="text-xs font-medium">
                          Fixed Closing Fee (₹ / order)
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            ₹
                          </span>
                          <Input
                            id="fixedPlatform"
                            type="number"
                            min={0}
                            value={fixedPlatformFeePerOrder === 0 ? "" : fixedPlatformFeePerOrder}
                            onChange={(e) => setFixedPlatformFeePerOrder(Number(e.target.value))}
                            placeholder="0"
                            className="pl-7 h-9 text-sm"
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Fixed charge per transaction / invoice
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Discounts & Offers */}
              <div className="border border-border rounded-2xl bg-card overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() => setShowDiscounts(!showDiscounts)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <Tag className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                        Customer Discount & Sale Offers
                        {hasDiscount && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                            {discountPct}% Off
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Account for festive discounts, coupons, and markdown sales
                      </p>
                    </div>
                  </div>
                  {showDiscounts ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {showDiscounts && (
                  <div className="p-5 border-t border-border/50 bg-muted/10 space-y-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="enableDiscount"
                        checked={hasDiscount}
                        onChange={(e) => setHasDiscount(e.target.checked)}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <Label htmlFor="enableDiscount" className="text-sm font-medium cursor-pointer">
                        Apply discount percentage to stated selling price
                      </Label>
                    </div>

                    {hasDiscount && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="discountInput" className="text-xs font-medium">
                            Discount Offered (%)
                          </Label>
                          <div className="relative">
                            <Input
                              id="discountInput"
                              type="number"
                              min={0}
                              max={100}
                              value={discountPct}
                              onChange={(e) => setDiscountPct(Number(e.target.value))}
                              className="pr-7 h-9 text-sm"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                              %
                            </span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-card border border-border text-xs space-y-1">
                          <div className="text-muted-foreground">Discount Amount:</div>
                          <div className="font-semibold text-foreground">
                            {formatINR((sellingPrice * discountPct) / 100)} per unit
                          </div>
                          <div className="text-muted-foreground">Effective Price to Buyer:</div>
                          <div className="font-bold text-primary">
                            {formatINR(sellingPrice * (1 - discountPct / 100))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 3: Target Pricing (Find My Selling Price) */}
              <div className="border border-border rounded-2xl bg-card overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() => setShowTargetPricing(!showTargetPricing)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Target className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        Find My Selling Price (Target Pricing Tool)
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Calculate what price to charge to earn a desired profit or margin %
                      </p>
                    </div>
                  </div>
                  {showTargetPricing ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {showTargetPricing && (
                  <div className="p-5 border-t border-border/50 bg-muted/10 space-y-4">
                    <div className="flex items-center gap-2 p-1 bg-muted rounded-xl w-fit">
                      <button
                        type="button"
                        onClick={() => setTargetType("amount")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          targetType === "amount"
                            ? "bg-card text-foreground shadow-xs font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        By Target Profit Amount (₹)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTargetType("margin")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          targetType === "margin"
                            ? "bg-card text-foreground shadow-xs font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        By Target Profit Margin (%)
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {targetType === "amount" ? (
                        <div className="space-y-1.5">
                          <Label htmlFor="targetAmt" className="text-xs font-medium">
                            Desired Net Profit Per Unit (₹)
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                              ₹
                            </span>
                            <Input
                              id="targetAmt"
                              type="number"
                              min={0}
                              value={targetProfitAmount}
                              onChange={(e) => setTargetProfitAmount(Number(e.target.value))}
                              className="pl-7 h-9 text-sm"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <Label htmlFor="targetMargin" className="text-xs font-medium">
                            Desired Profit Margin (%)
                          </Label>
                          <div className="relative">
                            <Input
                              id="targetMargin"
                              type="number"
                              min={1}
                              max={90}
                              value={targetMarginPct}
                              onChange={(e) => setTargetMarginPct(Number(e.target.value))}
                              className="pr-7 h-9 text-sm"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                              %
                            </span>
                          </div>
                        </div>
                      )}

                      {targetPriceResult?.isValid && targetPriceResult.requiredSellingPrice !== null ? (
                        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 dark:text-emerald-200">
                          <div className="text-[11px] font-medium opacity-80">
                            Required Selling Price:
                          </div>
                          <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                            {formatINR(targetPriceResult.requiredSellingPrice)}
                          </div>
                          <div className="text-[11px] opacity-80 mt-1 flex items-center justify-between">
                            <span>
                              Covers ₹
                              {(
                                costPrice +
                                packagingCost +
                                (shippingType === "per_order" ? shippingCost / quantity : shippingCost) +
                                advertisingCost
                              ).toFixed(0)}{" "}
                              fixed costs + platform fees
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setSellingPrice(Math.round(targetPriceResult.requiredSellingPrice!));
                                markCalculated();
                              }}
                              className="text-xs font-semibold underline hover:no-underline ml-2"
                            >
                              Apply Price
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                          {targetPriceResult?.errorMessage || "Unable to solve with current fee rates."}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 4: Taxes & GST Mode */}
              <div className="border border-border rounded-2xl bg-card overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() => setShowGst(!showGst)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                        GST Treatment (Indian Tax Mode)
                        {hasGst && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-700 dark:text-blue-300">
                            {gstRatePct}% GST
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Exclude GST collected from actual profit (GST is not revenue)
                      </p>
                    </div>
                  </div>
                  {showGst ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {showGst && (
                  <div className="p-5 border-t border-border/50 bg-muted/10 space-y-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="enableGst"
                        checked={hasGst}
                        onChange={(e) => setHasGst(e.target.checked)}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <Label htmlFor="enableGst" className="text-sm font-medium cursor-pointer">
                        Selling price is GST-inclusive (Standard MRP)
                      </Label>
                    </div>

                    {hasGst && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        <div className="space-y-1.5">
                          <Label htmlFor="gstRate" className="text-xs font-medium">
                            Applicable GST Rate (%)
                          </Label>
                          <select
                            id="gstRate"
                            value={gstRatePct}
                            onChange={(e) => setGstRatePct(Number(e.target.value))}
                            className="w-full h-9 px-3 rounded-lg border border-border bg-card text-foreground text-sm font-medium focus:ring-primary"
                          >
                            <option value={0}>0% (Exempt items, grains)</option>
                            <option value={5}>5% (Apparel &lt;₹1000, packaged food)</option>
                            <option value={12}>12% (Apparel &gt;₹1000, processed goods)</option>
                            <option value={18}>18% (Standard rate, electronics, software)</option>
                            <option value={28}>28% (Luxury goods, automotive)</option>
                          </select>
                        </div>

                        <div className="p-3 rounded-xl bg-card border border-border text-xs space-y-1">
                          <div className="flex justify-between text-muted-foreground">
                            <span>Output GST Collected:</span>
                            <span className="font-semibold text-foreground">
                              {formatINR(result.outputGstPerUnit)}
                            </span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Net Business Revenue:</span>
                            <span className="font-bold text-primary">
                              {formatINR(result.revenueExcludingGstPerUnit)}
                            </span>
                          </div>
                          <div className="text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                            GST collected is paid to government and not counted in net profit.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: HERO RESULTS DASHBOARD                      */}
          {/* ========================================================= */}
          <div ref={resultsRef} className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-6 lg:sticky lg:top-24">
              {/* Header Title */}
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h2 className="text-base font-semibold text-foreground">
                    Profit & Margin Summary
                  </h2>
                </div>
                <div
                  className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    result.isLoss
                      ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                      : (result.profitMarginPct || 0) >= 20
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                      : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                  }`}
                >
                  {result.isLoss
                    ? "Operating at Loss"
                    : (result.profitMarginPct || 0) >= 20
                    ? "Healthy Margin"
                    : "Low Margin"}
                </div>
              </div>

              {/* Big Hero Stat: Profit Per Unit */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  result.isLoss
                    ? "bg-rose-500/10 border-rose-500/20 text-rose-950 dark:text-rose-200"
                    : "bg-primary/10 border-primary/20 text-foreground"
                }`}
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Net Profit Per Unit</span>
                  {result.isLoss ? (
                    <span className="flex items-center gap-1 text-rose-600 font-bold text-xs">
                      <ArrowDownRight className="h-4 w-4" /> Loss
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                      <ArrowUpRight className="h-4 w-4" /> Profit
                    </span>
                  )}
                </div>
                <div
                  className={`text-3xl sm:text-4xl font-extrabold mt-1 tracking-tight ${
                    result.isLoss ? "text-rose-600 dark:text-rose-400" : "text-primary"
                  }`}
                >
                  {formatINR(result.profitPerUnit)}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {quantity > 1 ? (
                    <span>
                      Total Profit for {quantity} units ={" "}
                      <strong className="text-foreground">{formatINR(result.totalProfit)}</strong>
                    </span>
                  ) : (
                    <span>Earned on each unit sold at {formatINR(result.actualSellingPrice)}</span>
                  )}
                </div>
              </div>

              {/* Key Metrics Grid: Margin vs Markup */}
              <div className="grid grid-cols-2 gap-3">
                {/* Profit Margin */}
                <div className="p-4 rounded-xl bg-muted/40 border border-border/70 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Profit Margin
                    </span>
                    <Percent className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">
                    {formatPercent(result.profitMarginPct)}
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    Share of revenue retained as profit
                  </p>
                </div>

                {/* Markup Percentage */}
                <div className="p-4 rounded-xl bg-muted/40 border border-border/70 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Markup</span>
                    <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">
                    {formatPercent(result.markupPct)}
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    Profit added on top of your cost
                  </p>
                </div>
              </div>

              {/* Financial Snapshot Table */}
              <div className="rounded-xl border border-border overflow-hidden text-xs">
                <div className="bg-muted/50 p-2.5 font-semibold text-foreground flex items-center justify-between">
                  <span>Order Financial Snapshot ({quantity} units)</span>
                  <span>Amount</span>
                </div>
                <div className="divide-y divide-border/60">
                  <div className="p-2.5 flex justify-between text-muted-foreground">
                    <span>Gross Revenue:</span>
                    <span className="font-semibold text-foreground">
                      {formatINR(result.totalRevenue)}
                    </span>
                  </div>
                  <div className="p-2.5 flex justify-between text-muted-foreground">
                    <span>Base Product Cost:</span>
                    <span className="font-semibold text-foreground">
                      {formatINR(result.totalProductCost)}
                    </span>
                  </div>
                  {result.totalCostOrder - result.totalProductCost > 0 && (
                    <div className="p-2.5 flex justify-between text-muted-foreground">
                      <span>Extra Fees & Expenses:</span>
                      <span className="font-semibold text-foreground">
                        {formatINR(result.totalCostOrder - result.totalProductCost)}
                      </span>
                    </div>
                  )}
                  <div className="p-2.5 flex justify-between bg-muted/20 font-bold text-foreground">
                    <span>Total Net Profit:</span>
                    <span
                      className={
                        result.isLoss
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }
                    >
                      {formatINR(result.totalProfit)}
                    </span>
                  </div>
                  {result.breakEvenPrice !== null && (
                    <div className="p-2.5 flex justify-between text-muted-foreground">
                      <span>Break-Even Selling Price:</span>
                      <span className="font-semibold text-foreground">
                        {formatINR(result.breakEvenPrice)} / unit
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Educational Margin vs Markup callout */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5 text-amber-950 dark:text-amber-200">
                <div className="font-semibold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                  <Info className="h-4 w-4 shrink-0" />
                  Margin vs. Markup Explained:
                </div>
                <p className="leading-relaxed opacity-90 text-[11px]">
                  Your <strong>Profit Margin ({formatPercent(result.profitMarginPct)})</strong>{" "}
                  is your profit divided by what the customer pays. Your{" "}
                  <strong>Markup ({formatPercent(result.markupPct)})</strong> is your profit
                  divided by what you spent to produce it. Markup is always higher than margin!
                </p>
              </div>

              {/* Action Buttons: Copy, PDF, Reset */}
              <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopySummary}
                  className="flex-1 h-9 text-xs font-semibold rounded-xl"
                >
                  {isCopied ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1.5" />
                      Copy Summary
                    </>
                  )}
                </Button>

                <CalculatorPdfExport
                  calculatorTitle="Product Profit Estimate"
                  calculatorCategory="Business"
                  sections={pdfSections}
                  accentColor="#059669"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  title="Reset Calculator"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

// -------------------------------------------------------------
// SEO BLOG & COMPREHENSIVE GUIDE CONTENT
// -------------------------------------------------------------

const PRODUCT_PROFIT_BLOG_CONTENT: BlogContent = {
  primaryKeyword: "Product Profit Calculator",
  category: "Business",
  introText:
    "Calculating exact product profit is the foundation of every successful business, retail shop, e-commerce brand, and manufacturing enterprise. Learn the differences between profit margin and markup, how to factor in packaging, shipping, and marketplace commissions, and how to price your products for long-term sustainable profit.",
  sections: [
    {
      title: "1. The Fundamental Difference: Profit Margin vs. Markup",
      paragraphs: [
        "One of the most frequent accounting mistakes made by shopkeepers, online sellers, and new entrepreneurs is confusing Profit Margin with Markup. While both metrics measure profitability, they use completely different reference points.",
        "Profit Margin measures profit as a percentage of your selling price (revenue). In contrast, Markup measures profit as a percentage of your cost price. Because selling price is always higher than cost price in a profitable sale, Markup percentage will always be higher than Profit Margin percentage.",
      ],
      callout: {
        type: "expertInsight",
        title: "Golden Rule of Retail Pricing",
        text: "Profit Margin can never exceed 100% because you cannot earn more than 100% of your revenue. However, Markup can easily be 200%, 500%, or even 1,000% when selling high-margin luxury or digital products.",
      },
      formulaBox: {
        title: "Key Formulas",
        formula:
          "Profit Margin (%) = (Net Profit / Selling Price) × 100\nMarkup (%) = (Net Profit / Product Cost Price) × 100",
        variables: [
          { name: "Net Profit", desc: "Selling Price − Total Costs & Platform Fees" },
          { name: "Selling Price", desc: "Final amount charged to buyer (excl. GST)" },
          { name: "Cost Price", desc: "Direct manufacturing or wholesale buying price" },
        ],
      },
    },
    {
      title: "2. The Margin vs. Markup Comparison Table",
      paragraphs: [
        "To quickly convert between target margins and the markup percentage you need to quote on your product, refer to this standard pricing benchmark table:",
      ],
      table: {
        headers: ["Desired Margin (%)", "Required Markup (%)", "Cost ₹100 Selling Price"],
        rows: [
          ["10%", "11.1%", "₹111.11"],
          ["20%", "25.0%", "₹125.00"],
          ["25%", "33.3%", "₹133.33"],
          ["30%", "42.9%", "₹142.86"],
          ["33.3% (1/3rd)", "50.0%", "₹150.00"],
          ["40%", "66.7%", "₹166.67"],
          ["50% (Double)", "100.0%", "₹200.00"],
          ["60%", "150.0%", "₹250.00"],
          ["75%", "300.0%", "₹400.00"],
        ],
      },
    },
    {
      title: "3. Hidden Expenses Every Online Seller Must Account For",
      paragraphs: [
        "Many first-time sellers on platforms like Amazon India, Flipkart, Meesho, or Shopify calculate gross profit (Selling Price − Buying Cost) and wonder why their bank account does not reflect those numbers. In practice, per-order selling involves several layers of deductions:",
        "1. Packaging Costs: Corrugated cardboard boxes, bubble wrap, poly mailers, branded stickers, and security sealing tape typically add ₹15 to ₹40 per unit.",
        "2. Shipping & Courier Charges: Courier aggregator services (e.g., Shiprocket, Delhivery) or marketplace logistics (Amazon Easy Ship) charge by volumetric weight. Weight slab discrepancies can quickly erode thin margins.",
        "3. Marketplace Referral & Closing Fees: Amazon and Flipkart charge category referral commissions (typically 5% to 18%) plus a fixed closing fee per item based on the price tier.",
        "4. Payment Gateway Fees: Direct-to-consumer websites charge 2% + 18% GST on each transaction via Razorpay, PayU, or Cashfree.",
        "5. Customer Returns & RTO (Return to Origin): In Indian e-commerce, Cash on Delivery (COD) orders frequently have a 15% to 25% RTO rate. The seller must bear forward and reverse shipping costs even when no sale is completed.",
      ],
      callout: {
        type: "commonMistake",
        title: "The Dangerous Trap of Ignoring RTO",
        text: "If your forward courier cost is ₹60 and reverse courier is ₹50, every returned order costs you ₹110 in dead loss. High-volume sellers build a 5% to 8% return-allowance reserve directly into their product cost price.",
      },
    },
    {
      title: "4. Understanding GST: Why GST Collected is NOT Profit",
      paragraphs: [
        "In India, consumer retail prices are normally quoted inclusive of Goods and Services Tax (GST). For example, if you sell an item for ₹1,180 at an 18% GST slab, your actual business revenue is only ₹1,000.",
        "The remaining ₹180 is Output GST collected from the customer on behalf of the government. This ₹180 must be remitted via monthly GSTR-3B filings after adjusting for Input Tax Credit (ITC) on your raw materials and purchases. It should never be treated as business profit or operating cash flow.",
      ],
      formulaBox: {
        title: "GST Inclusive Revenue Formula",
        formula:
          "Revenue (Excl. GST) = Selling Price / (1 + GST Rate / 100)\nOutput GST = Selling Price − Revenue (Excl. GST)",
        variables: [
          { name: "Selling Price", desc: "Total amount collected from consumer (e.g. ₹1,180)" },
          { name: "GST Rate", desc: "Applicable tax slab (5%, 12%, 18%, or 28%)" },
        ],
      },
    },
  ],
  faqs: [
    {
      q: "What is the key difference between profit margin and markup?",
      a: "Profit margin is your net profit divided by your selling price (revenue), showing how much of every rupee collected you keep. Markup is your profit divided by your cost price, showing how much you added on top of what you paid. Markup is always numerically higher than margin for the same transaction.",
    },
    {
      q: "Why is profit margin always less than 100%?",
      a: "Profit margin represents the fraction of total revenue that remains as profit. Since total costs cannot be less than zero in normal trading, profit cannot exceed total revenue, making 100% the mathematical upper limit (only achievable when product cost is zero). Markup, however, can be 200%, 500%, or more.",
    },
    {
      q: "How do I calculate break-even selling price?",
      a: "Break-even selling price is the minimum price you must charge so that total revenue exactly equals total costs (profit = ₹0). It is calculated as: Break-Even Price = Total Fixed Costs Per Unit / (1 − Total Percentage Fee Rate). For example, if fixed costs are ₹450 and marketplace commission is 10%, break-even price is ₹450 / 0.90 = ₹500.",
    },
    {
      q: "Should shipping cost be calculated per unit or per order?",
      a: "If a customer orders 5 shirts in a single parcel, you pay the courier company once for that package (per order). However, if items are shipped individually, shipping applies per unit. In bulk orders, fixed per-order expenses like shipping and invoice fees are divided across all units, significantly boosting per-unit profit.",
    },
    {
      q: "What is considered a healthy profit margin for a small business?",
      a: "Profit margins vary by industry. For grocery and FMCG retail, 5% to 12% net margin is standard due to rapid inventory turnover. For apparel and lifestyle goods, 20% to 35% is healthy. For proprietary manufacturing, specialized electronics, or digital products, net margins often exceed 40% to 60%.",
    },
    {
      q: "How does offering a 20% discount impact my net profit?",
      a: "Discounts erode net profit much faster than revenue. If a product costs ₹400 and sells for ₹500, profit is ₹100 (20% margin). If you offer a 10% discount, the price drops to ₹450, but your profit drops by 50% to ₹50! Never offer discounts without calculating their direct hit on bottom-line profit.",
    },
    {
      q: "How do marketplace commissions work on Amazon and Flipkart?",
      a: "Marketplaces charge: 1) Referral Commission (% of product price, usually 5% to 18%), 2) Closing Fee (fixed ₹5 to ₹35 based on price tier), 3) Weight handling / shipping fees, and 4) 18% GST on all marketplace service charges. Always use a dedicated calculator like CalcZen to verify net payout before pricing.",
    },
    {
      q: "Why does selling price include GST reduce my actual profit?",
      a: "GST collected from customers is a tax liability owed to the Government of India, not business income. If your selling price includes 18% GST, you only retain ₹100 for every ₹118 collected. Failing to subtract GST before calculating profit leads to an artificial overestimation of earnings.",
    },
    {
      q: "What is customer acquisition cost (CAC) and how should I include it?",
      a: "Customer Acquisition Cost is the total advertising and marketing spend required to generate one sale. If you spend ₹5,000 on Meta or Google Ads and generate 50 orders, your CAC is ₹100 per unit. This should be entered in the Advertising Cost field to find true net profit.",
    },
    {
      q: "How do I find what price to charge to make ₹200 profit on every item?",
      a: "Use the built-in 'Find My Selling Price' target pricing tool. Enter your target profit of ₹200. The calculator sums your product cost, packaging, shipping, and adjusts for marketplace percentage fees to give you the exact required selling price.",
    },
  ],
  internalLinks: [
    {
      text: "Compare Job Offers & In-Hand Pay",
      calculatorName: "CTC to In-Hand Salary Calculator",
      href: "/calculator/ctc-to-in-hand-salary-calculator",
    },
    {
      text: "Calculate Gold Jewellery & Making Charges",
      calculatorName: "Gold Jewellery Bill Calculator",
      href: "/calculator/gold-jewellery-bill-calculator",
    },
  ],
};
export default ProductProfitCalculator;

