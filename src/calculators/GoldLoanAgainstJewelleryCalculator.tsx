import { useState, useMemo, useRef } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog, { type BlogContent } from "@/components/CalculatorBlog";
import SavePDFButton from "@/components/SavePDFButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCalculator } from "@/data/calculators";
import { useCalculatorState } from "@/hooks/use-has-calculated";
import { OutdatedResultBanner } from "@/components/OutdatedResultBanner";
import { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";
import {
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  AlertCircle,
  Calculator,
  ShieldCheck,
  Scale,
  Landmark,
  ChevronDown,
  ChevronUp,
  Percent,
  Coins,
  Receipt,
  HelpCircle,
  FileText,
  Calendar,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import {
  calculateGoldLoan,
  validateGoldLoanInputs,
  formatINR,
  GOLD_PURITY_MAP,
  type GoldPurityKey,
  type RateBasis,
  type LoanCalculationMode,
  type LoanPurposeCategory,
  type RepaymentMethod,
  type ProcessingFeeType,
  type GoldLoanInputs,
  type GoldLoanCalculationResult,
} from "@/utils/goldLoanCalculatorUtils";

export const GOLD_LOAN_FAQS: { q: string; a: string }[] = [
  {
    q: "How much loan can I get for 10 grams of 22K gold?",
    a: "If 22K gold is valued at ₹7,200 per gram, 10 grams of net gold is worth ₹72,000. Under RBI's 85% LTV limit for loans up to ₹2.5 Lakh, the maximum indicative loan you can receive is approximately ₹61,200 (₹72,000 × 0.85), subject to lender appraisal and deductions.",
  },
  {
    q: "Why did the bank value my jewellery lower than my purchase bill?",
    a: "Retail jewellery bills include making charges (10% to 25%), wastage margins, 3% GST, and gemstone costs. Gold loans are sanctioned purely on the intrinsic value of the net pure gold weight. Making charges and taxes have zero collateral value.",
  },
  {
    q: "Are diamonds and precious stones valued in a gold loan?",
    a: "No. Under RBI collateral lending directions, lenders deduct the weight of all embedded diamonds, gemstones, pearls, and wax before calculating the loan amount. Only the net gold weight is valued.",
  },
  {
    q: "What is the difference between 22K and 24K gold valuation?",
    a: "24K gold is 99.9% pure bullion, while 22K gold contains 91.6% pure gold (916 fineness) alloyed with other metals for strength. When lenders quote a 24K benchmark rate, they multiply it by 0.916 to determine the eligible value of 22K jewellery.",
  },
  {
    q: "Can I get a 90% or 100% gold loan in India?",
    a: "No. The Reserve Bank of India strictly regulates gold loan LTV limits. For eligible consumption loans, the regulatory ceiling is capped at 85% for loans up to ₹2.5 Lakh, 80% up to ₹5 Lakh, and 75% for larger loans. Any lender advertising 90% or 100% LTV is violating RBI norms.",
  },
  {
    q: "What interest rate do banks charge on gold loans?",
    a: "Gold loan interest rates typically range from 8.85% to 14.5% p.a. at public sector banks (like SBI, Canara Bank, and Bank of Baroda), 10% to 16% at private banks (HDFC, ICICI), and 12% to 24% p.a. at gold-loan NBFCs (Muthoot, Manappuram) depending on tenure and repayment type.",
  },
  {
    q: "What is a bullet repayment gold loan?",
    a: "In a bullet repayment scheme, you do not pay monthly EMIs. Instead, you repay the entire principal amount plus all accumulated interest together in a single payment at the end of the loan tenure (usually 6 to 12 months).",
  },
  {
    q: "Can I pledge hallmarked and non-hallmarked jewellery?",
    a: "Yes, most banks accept both hallmarked and non-hallmarked ornaments. However, lenders employ certified in-house gold appraisers who perform acid assays or XRF spectrometer testing to verify the actual karat purity before sanctioning the loan.",
  },
  {
    q: "What fees do lenders deduct upfront from my gold loan?",
    a: "Lenders typically charge a processing fee (0.25% to 1% of the loan amount), an appraiser fee (₹200 to ₹500 for testing gold purity), and applicable GST on service charges. These are either paid upfront or deducted from your disbursed loan amount.",
  },
  {
    q: "What happens if I cannot repay my gold loan?",
    a: "If you default on interest or principal repayments, the lender will send statutory demand notices giving you grace periods. If dues remain unpaid, the lender has the legal right under RBI regulations to auction your pledged gold ornaments to recover outstanding dues.",
  },
];

// -------------------------------------------------------------
// COMPREHENSIVE EDUCATIONAL BLOG & FAQ CONTENT
// -------------------------------------------------------------
const goldLoanBlogContent: any = {
  title: "Gold Loan Against Jewellery Calculator: How Much Loan Can You Get?",
  description:
    "Complete consumer guide to gold loan collateral valuation in India. Understand RBI 2025 Master Directions, maximum LTV limits, purity deductions, interest repayment schemes, and lender policies.",
  author: "CalcZen Financial Research Team",
  publishDate: "November 2026",
  readTime: "7 min read",
  sections: [
    {
      title: "How Do Banks and NBFCs Value Your Gold Jewellery?",
      content:
        "When you pledge gold jewellery at a bank or NBFC in India (such as SBI, HDFC Bank, Muthoot Finance, or Manappuram), the valuation follows strict Reserve Bank of India (RBI) guidelines. Lenders do not value your jewellery based on the retail bill you paid or the gemstones embedded in the ornament. Instead, the valuation is calculated purely on the **net intrinsic gold content**.\n\nHere is how every component is handled:\n- **Gross Weight vs Net Weight:** Your ornaments are weighed on a certified scale. Any embedded precious stones, diamonds, pearls, wax fillings (lakh), or non-gold threads are strictly deducted to arrive at the net pure gold weight.\n- **Purity Karat & Fineness:** The gold content is assessed using standard Bureau of Indian Standards (BIS) hallmark fineness (e.g., 22K = 916 fineness or 91.6% pure gold, 18K = 750 fineness or 75.0% pure gold).\n- **Reference Valuation Rate:** Under RBI Master Directions, lenders calculate the collateral value using the lower of the average closing price of gold for the relevant purity over the preceding 30 days, or the closing price on the preceding day published by recognized trade bodies (such as IBJA).",
    },
    {
      title: "Understanding RBI 2025 Tiered LTV Rules for Consumption Loans",
      content:
        "The Loan-to-Value (LTV) ratio determines the maximum percentage of your gold's value that a lender is legally permitted to disburse as a loan. Under the **Reserve Bank of India (Lending Against Gold and Silver Collateral) Directions, 2025**, the maximum permissible LTV for eligible personal/consumption loans is tiered across loan amount bands:\n\n- **Up to ₹2.5 Lakh:** Maximum LTV of **85%**\n- **Above ₹2.5 Lakh and up to ₹5 Lakh:** Maximum LTV of **80%**\n- **Above ₹5 Lakh:** Maximum LTV of **75%**\n\n**Band Boundary Mechanics:** To prevent distortion at band thresholds, RBI directions prescribe a continuous candidate rule. For example, if you pledge gold worth ₹3,00,000, 80% LTV equals ₹2,40,000, which does not exceed the ₹2.5 Lakh threshold; therefore, you remain eligible for up to ₹2,50,000 under Band 1. Lenders can always choose to offer a lower LTV based on their internal risk assessment.",
    },
    {
      title: "Repayment Schemes: Monthly EMI vs Bullet Repayment vs Overdraft",
      content:
        "Indian gold loans offer flexible repayment structures tailored to different cash-flow needs:\n\n1. **Monthly Reducing Balance EMI:** Similar to a home or personal loan, you pay a fixed equated monthly instalment comprising both principal and interest each month. This systematically reduces your debt and carries the lowest total interest cost.\n2. **Bullet Repayment Scheme:** Popular with agricultural borrowers and seasonal traders, you pay neither principal nor monthly interest during the tenure. The entire principal along with accumulated interest is paid in one lump-sum at loan maturity (typically 3, 6, or 12 months).\n3. **Overdraft / Gold Credit Line:** The bank sanctions a credit limit against your gold. You can withdraw and deposit funds at will, and interest is charged strictly on the amount actually used on a daily balance basis.",
    },
    {
      title: "What Happens to Making Charges and Stone Value?",
      content:
        "When purchasing jewellery, buyers pay 8% to 25% making charges, wastage fees, and 3% GST. Furthermore, studded ornaments carry expensive diamonds or gemstones. **None of these charges are included in a gold loan.**\n\nBanks and NBFCs finance only the physical, meltable gold content. If you default on a loan, the lender's only recourse is auctioning the collateral for its raw bullion value under RBI guidelines. Consequently, plain 22K gold bangles, chains, and coins yield a substantially higher loan amount per gram compared to stone-studded jewellery.",
    },
  ],
  faqs: [
    {
      question: "How much loan can I get for 10 grams of 22K gold?",
      answer:
        "If 22K gold is valued at ₹7,200 per gram, 10 grams of net gold is worth ₹72,000. Under RBI's 85% LTV limit for loans up to ₹2.5 Lakh, the maximum indicative loan you can receive is approximately ₹61,200 (₹72,000 × 0.85), subject to lender appraisal and deductions.",
    },
    {
      question: "Why did the bank value my jewellery lower than my purchase bill?",
      answer:
        "Retail jewellery bills include making charges (10% to 25%), wastage margins, 3% GST, and gemstone costs. Gold loans are sanctioned purely on the intrinsic value of the net pure gold weight. Making charges and taxes have zero collateral value.",
    },
    {
      question: "Are diamonds and precious stones valued in a gold loan?",
      answer:
        "No. Under RBI collateral lending directions, lenders deduct the weight of all embedded diamonds, gemstones, pearls, and wax before calculating the loan amount. Only the net gold weight is valued.",
    },
    {
      question: "What is the difference between 22K and 24K gold valuation?",
      answer:
        "24K gold is 99.9% pure bullion, while 22K gold contains 91.6% pure gold (916 fineness) alloyed with other metals for strength. When lenders quote a 24K benchmark rate, they multiply it by 0.916 to determine the eligible value of 22K jewellery.",
    },
    {
      question: "Can I get a 90% or 100% gold loan in India?",
      answer:
        "No. The Reserve Bank of India strictly regulates gold loan LTV limits. For eligible consumption loans, the regulatory ceiling is capped at 85% for loans up to ₹2.5 Lakh, 80% up to ₹5 Lakh, and 75% for larger loans. Any lender advertising 90% or 100% LTV is violating RBI norms.",
    },
    {
      question: "What interest rate do banks charge on gold loans?",
      answer:
        "Gold loan interest rates typically range from 8.85% to 14.5% p.a. at public sector banks (like SBI, Canara Bank, and Bank of Baroda), 10% to 16% at private banks (HDFC, ICICI), and 12% to 24% p.a. at gold-loan NBFCs (Muthoot, Manappuram) depending on tenure and repayment type.",
    },
    {
      question: "What is a bullet repayment gold loan?",
      answer:
        "In a bullet repayment scheme, you do not pay monthly EMIs. Instead, you repay the entire principal amount plus all accumulated interest together in a single payment at the end of the loan tenure (usually 6 to 12 months).",
    },
    {
      question: "Can I pledge hallmarked and non-hallmarked jewellery?",
      answer:
        "Yes, most banks accept both hallmarked and non-hallmarked ornaments. However, lenders employ certified in-house gold appraisers who perform acid assays or XRF spectrometer testing to verify the actual karat purity before sanctioning the loan.",
    },
    {
      question: "What fees do lenders deduct upfront from my gold loan?",
      answer:
        "Lenders typically charge a processing fee (0.25% to 1% of the loan amount), an appraiser fee (₹200 to ₹500 for testing gold purity), and applicable GST on service charges. These are either paid upfront or deducted from your disbursed loan amount.",
    },
    {
      question: "What happens if I cannot repay my gold loan?",
      answer:
        "If you default on interest or principal repayments, the lender will send statutory demand notices giving you grace periods. If dues remain unpaid, the lender has the legal right under RBI regulations to auction your pledged gold ornaments to recover outstanding dues.",
    },
  ],
};

export function GoldLoanAgainstJewelleryCalculator() {
  const calc = getCalculator("gold-loan-against-jewellery-calculator")!;
  const resultsRef = useRef<HTMLDivElement>(null);

  // -------------------------------------------------------------
  // STATE: 4 ESSENTIAL DEFAULT INPUTS
  // -------------------------------------------------------------
  const [grossWeight, setGrossWeight] = useState<number>(20);
  const [purity, setPurity] = useState<GoldPurityKey>("22k-916");
  const [rateBasis, setRateBasis] = useState<RateBasis>("selected_purity");
  const [goldRate, setGoldRate] = useState<number>(7200);
  const [loanMode, setLoanMode] = useState<LoanCalculationMode>("estimate_max");
  const [requestedLoanAmount, setRequestedLoanAmount] = useState<number>(100000);

  // -------------------------------------------------------------
  // STATE: ADVANCED COLLAPSIBLE SECTIONS
  // -------------------------------------------------------------
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);
  const [nonGoldWeight, setNonGoldWeight] = useState<number>(0);
  const [loanPurpose, setLoanPurpose] = useState<LoanPurposeCategory>("consumption");
  const [customLtv, setCustomLtv] = useState<number>(0);
  const [otherDeductions, setOtherDeductions] = useState<number>(0);

  // Repayment Estimator Section
  const [showRepaymentSection, setShowRepaymentSection] = useState<boolean>(false);
  const [repaymentMethod, setRepaymentMethod] = useState<RepaymentMethod>("emi");
  const [annualInterestRate, setAnnualInterestRate] = useState<number>(10.5);
  const [tenureMonths, setTenureMonths] = useState<number>(12);
  const [overdraftUtilisationPct, setOverdraftUtilisationPct] = useState<number>(100);

  // Fees & Upfront Costs Section
  const [showFeesSection, setShowFeesSection] = useState<boolean>(false);
  const [processingFeeType, setProcessingFeeType] = useState<ProcessingFeeType>("percentage");
  const [processingFeeValue, setProcessingFeeValue] = useState<number>(0.5);
  const [valuationFee, setValuationFee] = useState<number>(0);
  const [documentationFee, setDocumentationFee] = useState<number>(0);

  // Result Breakdown & Accordion
  const [showFullCalculation, setShowFullCalculation] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // -------------------------------------------------------------
  // INPUTS PACKAGING & CALCULATION ENGINE
  // -------------------------------------------------------------
  const inputs: GoldLoanInputs = useMemo(
    () => ({
      grossWeight: Number(grossWeight) || 0,
      nonGoldWeight: Number(nonGoldWeight) || 0,
      purity,
      rateBasis,
      goldRate: Number(goldRate) || 0,
      loanMode,
      requestedLoanAmount: Number(requestedLoanAmount) || 0,
      loanPurpose,
      customLtv: Number(customLtv) || 0,
      otherDeductions: Number(otherDeductions) || 0,
      repaymentMethod: showRepaymentSection ? repaymentMethod : "none",
      annualInterestRate: Number(annualInterestRate) || 0,
      tenureMonths: Number(tenureMonths) || 12,
      overdraftUtilisationPct: Number(overdraftUtilisationPct) || 100,
      processingFeeType: showFeesSection ? processingFeeType : "none",
      processingFeeValue: Number(processingFeeValue) || 0,
      valuationFee: showFeesSection ? Number(valuationFee) || 0 : 0,
      documentationFee: showFeesSection ? Number(documentationFee) || 0 : 0,
    }),
    [
      grossWeight,
      nonGoldWeight,
      purity,
      rateBasis,
      goldRate,
      loanMode,
      requestedLoanAmount,
      loanPurpose,
      customLtv,
      otherDeductions,
      showRepaymentSection,
      repaymentMethod,
      annualInterestRate,
      tenureMonths,
      overdraftUtilisationPct,
      showFeesSection,
      processingFeeType,
      processingFeeValue,
      valuationFee,
      documentationFee,
    ]
  );

  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } =
    useCalculatorState(inputs);
  const activeInputs = calculatedInputs || inputs;

  const validation = useMemo(() => validateGoldLoanInputs(inputs), [inputs]);
  const result: GoldLoanCalculationResult = useMemo(
    () => calculateGoldLoan(activeInputs),
    [activeInputs]
  );

  // -------------------------------------------------------------
  // ACTIONS: RESET, COPY & PDF
  // -------------------------------------------------------------
  const handleReset = () => {
    setGrossWeight(20);
    setPurity("22k-916");
    setRateBasis("selected_purity");
    setGoldRate(7200);
    setLoanMode("estimate_max");
    setRequestedLoanAmount(100000);
    setNonGoldWeight(0);
    setLoanPurpose("consumption");
    setCustomLtv(0);
    setOtherDeductions(0);
    setShowAdvancedOptions(false);
    setShowRepaymentSection(false);
    setRepaymentMethod("emi");
    setAnnualInterestRate(10.5);
    setTenureMonths(12);
    setOverdraftUtilisationPct(100);
    setShowFeesSection(false);
    setProcessingFeeType("percentage");
    setProcessingFeeValue(0.5);
    setValuationFee(0);
    setDocumentationFee(0);
    setShowFullCalculation(false);
    resetCalculated();
  };

  const handleCalculateClick = () => {
    markCalculated();
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCopySummary = async () => {
    const summary = [
      `=== CalcZen: Gold Loan Against Jewellery Estimate ===`,
      `Gross Weight: ${result.formattedGrossWeight}`,
      ...(result.nonGoldWeight > 0 ? [`Stones / Non-Gold Deducted: ${result.nonGoldWeight.toFixed(2)} g`] : []),
      `Net Gold Weight: ${result.formattedNetWeight}`,
      `Purity: ${result.purityLabel}`,
      `Gold Rate Used: ${result.formattedEffectiveRate} / g`,
      `Eligible Gold Collateral Value: ${result.formattedEligibleGoldValue}`,
      `Applicable LTV: ${result.formattedEffectiveLtv}`,
      `----------------------------------------------------`,
      `ESTIMATED LOAN AMOUNT: ${result.formattedSanctionedLoan}`,
      `----------------------------------------------------`,
      ...(result.repaymentMethod === "emi"
        ? [
            `Repayment Method: Monthly Reducing EMI`,
            `Tenure: ${result.tenureMonths} Months @ ${result.annualInterestRate}% p.a.`,
            `Estimated Monthly EMI: ${result.formattedMonthlyEmi}`,
            `Total Interest: ${result.formattedTotalInterest}`,
            `Total Repayment: ${result.formattedTotalRepayment}`,
          ]
        : []),
      ...(result.repaymentMethod === "bullet"
        ? [
            `Repayment Method: Bullet (Maturity Payment)`,
            `Tenure: ${result.tenureMonths} Months @ ${result.annualInterestRate}% p.a.`,
            `Maturity Interest: ${result.formattedTotalInterest}`,
            `Total Maturity Repayment: ${result.formattedTotalRepayment}`,
          ]
        : []),
      ...(result.totalUpfrontFees > 0
        ? [
            `Total Upfront Fees: ${result.formattedTotalFees}`,
            `Net Disbursal (Money Received): ${result.formattedNetDisbursal}`,
          ]
        : []),
      `Regulatory Framework: RBI Lending Against Gold & Silver Collateral Directions 2025`,
      `Calculated at: https://www.calczen.in/calculator/gold-loan-against-jewellery-calculator`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summary);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const pdfData = useMemo(() => {
    return {
      title: "Gold Loan Against Jewellery Estimate",
      subtitle: `RBI 2025 Regulatory Collateral Valuation & Loan Estimate`,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      inputs: [
        { label: "Gross Jewellery Weight", value: result.formattedGrossWeight },
        ...(result.nonGoldWeight > 0
          ? [{ label: "Stone / Non-Gold Deductions", value: `${result.nonGoldWeight.toFixed(2)} g` }]
          : []),
        { label: "Net Gold Weight", value: result.formattedNetWeight },
        { label: "Gold Purity", value: result.purityLabel },
        { label: "Gold Valuation Rate", value: `${result.formattedEffectiveRate} / gram` },
        { label: "Loan Purpose", value: loanPurpose === "consumption" ? "Personal / Consumption" : "Business Purpose" },
        ...(customLtv > 0 ? [{ label: "Custom Lender LTV", value: `${customLtv}%` }] : []),
      ],
      results: [
        { label: "Eligible Gold Collateral Value", value: result.formattedEligibleGoldValue },
        { label: "Maximum Regulatory LTV", value: result.formattedEffectiveLtv },
        { label: "Estimated Eligible Loan Amount", value: result.formattedSanctionedLoan },
        ...(result.repaymentMethod === "emi"
          ? [
              { label: "Estimated Monthly EMI", value: result.formattedMonthlyEmi },
              { label: "Total Interest Payable", value: result.formattedTotalInterest },
              { label: "Total Repayment Amount", value: result.formattedTotalRepayment },
            ]
          : []),
        ...(result.repaymentMethod === "bullet"
          ? [
              { label: "Bullet Maturity Interest", value: result.formattedTotalInterest },
              { label: "Total Maturity Repayment", value: result.formattedTotalRepayment },
            ]
          : []),
        ...(result.totalUpfrontFees > 0
          ? [
              { label: "Estimated Upfront Fees", value: result.formattedTotalFees },
              { label: "Net Disbursal (Money Received)", value: result.formattedNetDisbursal },
            ]
          : []),
      ],
      notes: [
        "Gold jewellery is valued by eligible intrinsic gold content only. Stones, beads, wax and making charges are excluded.",
        "Indicative loan estimate based on RBI Lending Against Gold Collateral Directions 2025. Final loan amount depends on physical assaying and lender policy.",
        "CalcZen is an independent financial technology calculator and not a bank, NBFC, or loan broker.",
      ],
    };
  }, [result, loanPurpose, customLtv]);

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Estimate approximately how much loan you can get against your gold jewellery. Valued on intrinsic gold content under Reserve Bank of India (RBI) 2025 LTV guidelines, with monthly reducing EMI, bullet repayment, and fee deduction options."
      formula={`Net Gold Weight = Gross Jewellery Weight − Stones & Non-Gold Weight\n\nEligible Gold Value = Net Gold Weight × Gold Rate per gram\n\nBand 1 (Up to ₹2.5 Lakh): Max Loan = min(85% × Gold Value, ₹2,50,000)\n\nBand 2 (Above ₹2.5L to ₹5 Lakh): If 80% × Gold Value > ₹2,50,000, Max Loan = min(80% × Gold Value, ₹5,00,000)\n\nBand 3 (Above ₹5 Lakh): If 75% × Gold Value > ₹5,00,000, Max Loan = 75% × Gold Value`}
      example={`20g of 22K Gold Jewellery @ ₹7,200/g:\n• Net Gold Weight = 20 grams\n• Eligible Gold Collateral Value = 20 × ₹7,200 = ₹1,44,000\n• Applicable RBI LTV = 85% (Band 1: Up to ₹2.5 Lakh)\n• Estimated Maximum Loan = ₹1,44,000 × 0.85 = ₹1,22,400\n• Optional 12-Month EMI @ 10.5% p.a. = ₹10,790/month`}
      faqs={GOLD_LOAN_FAQS}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN: 4 ESSENTIAL INPUTS + COLLAPSIBLE ADVANCED    */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Landmark className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Gold Loan Calculator</h2>
                  <p className="text-xs text-muted-foreground">
                    Estimate eligible loan against gold ornaments under RBI 2025 LTV guidelines
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                RBI 2025 LTV
              </span>
            </div>

            {/* ---------------------------------------------------- */}
            {/* INPUT 1: GOLD WEIGHT                                */}
            {/* ---------------------------------------------------- */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="grossWeight" className="text-sm font-semibold flex items-center gap-1.5">
                  <Scale className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  How much gold jewellery do you have?
                </Label>
                <span className="text-xs font-semibold text-muted-foreground">in grams (g)</span>
              </div>
              <div className="relative">
                <Input
                  id="grossWeight"
                  type="number"
                  min="0.1"
                  max="10000"
                  step="0.01"
                  value={grossWeight === 0 ? "" : grossWeight}
                  onChange={(e) => setGrossWeight(e.target.value === "" ? 0 : Number(e.target.value))}
                  placeholder="e.g. 20"
                  className="h-12 text-base font-semibold pr-12 rounded-xl"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground pointer-events-none">
                  grams
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Enter the total weight of your gold jewellery. (Stones can be deducted below).
              </p>
            </div>

            {/* ---------------------------------------------------- */}
            {/* INPUT 2: GOLD PURITY                                */}
            {/* ---------------------------------------------------- */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="purity" className="text-sm font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  What is your gold purity?
                </Label>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                  {GOLD_PURITY_MAP[purity].hallmarkCode} Hallmark
                </span>
              </div>
              <select
                id="purity"
                value={purity}
                onChange={(e) => setPurity(e.target.value as GoldPurityKey)}
                aria-label="What is your gold purity?"
                className="w-full h-12 px-3.5 rounded-xl border border-input bg-background text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {Object.values(GOLD_PURITY_MAP).map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-muted-foreground">
                {purity === "22k-916"
                  ? "22K gold means approximately 91.6% pure gold (standard for most Indian jewellery)."
                  : GOLD_PURITY_MAP[purity].description}
              </p>
            </div>

            {/* ---------------------------------------------------- */}
            {/* INPUT 3: TODAY'S GOLD RATE PER GRAM                 */}
            {/* ---------------------------------------------------- */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="goldRate" className="text-sm font-semibold flex items-center gap-1.5">
                  <Coins className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  Today's gold rate per gram
                </Label>
                <span className="text-xs text-muted-foreground">₹ / gram</span>
              </div>

              {/* Rate Basis Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-muted/60 rounded-xl border border-border/60">
                <button
                  type="button"
                  onClick={() => setRateBasis("selected_purity")}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                    rateBasis === "selected_purity"
                      ? "bg-card text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Rate for {GOLD_PURITY_MAP[purity].shortLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setRateBasis("24k_rate")}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                    rateBasis === "24k_rate"
                      ? "bg-card text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Rate for 24K (Pure Gold)
                </button>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground pointer-events-none">
                  ₹
                </span>
                <Input
                  id="goldRate"
                  type="number"
                  min="1000"
                  max="50000"
                  step="10"
                  value={goldRate === 0 ? "" : goldRate}
                  onChange={(e) => setGoldRate(e.target.value === "" ? 0 : Number(e.target.value))}
                  placeholder="e.g. 7200"
                  className="h-12 pl-8 pr-12 text-base font-semibold rounded-xl"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground pointer-events-none">
                  / gram
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {rateBasis === "24k_rate"
                  ? `Your 24K rate will automatically convert to ₹${Math.round(
                      (Number(goldRate) || 0) * GOLD_PURITY_MAP[purity].finenessFraction
                    ).toLocaleString("en-IN")}/g for ${GOLD_PURITY_MAP[purity].shortLabel}.`
                  : `Enter today's prevailing market rate for ${GOLD_PURITY_MAP[purity].shortLabel} gold.`}
              </p>
            </div>

            {/* ---------------------------------------------------- */}
            {/* INPUT 4: LOAN CALCULATION TYPE                      */}
            {/* ---------------------------------------------------- */}
            <div className="space-y-2.5">
              <Label className="text-sm font-semibold flex items-center gap-1.5">
                <Calculator className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                Loan calculation mode
              </Label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setLoanMode("estimate_max")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    loanMode === "estimate_max"
                      ? "border-primary bg-primary/5 text-primary font-bold shadow-2xs"
                      : "border-border/70 hover:border-border text-foreground font-medium"
                  }`}
                >
                  <div className="text-xs sm:text-sm font-bold">Estimate Max Loan</div>
                  <div className="text-[11px] text-muted-foreground">Check maximum feasible loan</div>
                </button>
                <button
                  type="button"
                  onClick={() => setLoanMode("requested_amount")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    loanMode === "requested_amount"
                      ? "border-primary bg-primary/5 text-primary font-bold shadow-2xs"
                      : "border-border/70 hover:border-border text-foreground font-medium"
                  }`}
                >
                  <div className="text-xs sm:text-sm font-bold">I Need a Specific Amount</div>
                  <div className="text-[11px] text-muted-foreground">Check required LTV & approval</div>
                </button>
              </div>

              {/* Revealed if specific loan requested */}
              {loanMode === "requested_amount" && (
                <div className="pt-2 space-y-1.5">
                  <Label htmlFor="requestedLoanAmount" className="text-xs font-semibold text-foreground">
                    Desired Loan Amount (₹)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground pointer-events-none">
                      ₹
                    </span>
                    <Input
                      id="requestedLoanAmount"
                      type="number"
                      min="1000"
                      step="1000"
                      value={requestedLoanAmount === 0 ? "" : requestedLoanAmount}
                      onChange={(e) =>
                        setRequestedLoanAmount(e.target.value === "" ? 0 : Number(e.target.value))
                      }
                      placeholder="e.g. 100000"
                      className="h-11 pl-8 rounded-xl font-semibold text-sm"
                    />
                  </div>
                  {result.eligibleGoldValue > 0 && (
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-muted-foreground">
                        Required LTV:{" "}
                        <strong className="text-foreground">{result.requestedLtvPercentage.toFixed(1)}%</strong>
                      </span>
                      <span className="text-muted-foreground">
                        Permitted Limit:{" "}
                        <strong className="text-foreground">{result.permittedLtvForRequestedAmount}%</strong>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ---------------------------------------------------- */}
            {/* COLLAPSIBLE 1: MORE OPTIONS & DEDUCTIONS            */}
            {/* ---------------------------------------------------- */}
            <div className="pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="w-full flex items-center justify-between py-2 text-xs font-bold text-foreground hover:text-primary transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <span>More options (Stones, Loan Purpose & Custom LTV)</span>
                </span>
                {showAdvancedOptions ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {showAdvancedOptions && (
                <div className="mt-3 p-4 rounded-xl border border-border/70 bg-muted/20 space-y-4">
                  {/* Stone & Non-Gold Deduction */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="nonGoldWeight" className="text-xs font-semibold text-foreground">
                        Stones & Non-Gold Weight (Deduction)
                      </Label>
                      <span className="text-[11px] text-muted-foreground">grams</span>
                    </div>
                    <Input
                      id="nonGoldWeight"
                      type="number"
                      min="0"
                      step="0.01"
                      value={nonGoldWeight === 0 ? "" : nonGoldWeight}
                      onChange={(e) => setNonGoldWeight(e.target.value === "" ? 0 : Number(e.target.value))}
                      placeholder="0"
                      className="h-10 text-sm font-semibold rounded-xl"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      RBI collateral valuation strictly excludes diamonds, beads, wax and stones. Only pure gold content is financed.
                    </p>
                  </div>

                  {/* Loan Purpose */}
                  <div className="space-y-1.5">
                    <Label htmlFor="loanPurpose" className="text-xs font-semibold text-foreground">
                      Loan Purpose Category
                    </Label>
                    <select
                      id="loanPurpose"
                      value={loanPurpose}
                      onChange={(e) => setLoanPurpose(e.target.value as LoanPurposeCategory)}
                      aria-label="Loan Purpose Category"
                      className="w-full h-10 px-3 rounded-xl border border-input bg-background text-foreground text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="consumption">Personal / Consumption Purpose (RBI LTV up to 85%)</option>
                      <option value="business">Business / Commercial Purpose (Lender LTV up to 75%)</option>
                      <option value="unsure">Not Sure / Other</option>
                    </select>
                    <p className="text-[11px] text-muted-foreground">
                      {loanPurpose === "consumption"
                        ? "Qualifies for RBI's tiered maximum LTV bands (85% up to ₹2.5L, 80% up to ₹5L, 75% above ₹5L)."
                        : "Business and non-consumption gold loans are governed by bank policy (typically capped at 75% LTV)."}
                    </p>
                  </div>

                  {/* Custom Lender LTV */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="customLtv" className="text-xs font-semibold text-foreground">
                        Lender's Quoted LTV Percentage (Optional)
                      </Label>
                      <span className="text-[11px] text-muted-foreground">%</span>
                    </div>
                    <Input
                      id="customLtv"
                      type="number"
                      min="1"
                      max="100"
                      step="0.5"
                      value={customLtv === 0 ? "" : customLtv}
                      onChange={(e) => setCustomLtv(e.target.value === "" ? 0 : Number(e.target.value))}
                      placeholder="Leave empty to use regulatory ceiling"
                      className="h-10 text-sm font-semibold rounded-xl"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      If your bank (e.g. SBI, HDFC, Muthoot) has given a specific LTV quote, enter it here (e.g. 75%).
                    </p>
                  </div>

                  {/* Other Deductions */}
                  <div className="space-y-1.5">
                    <Label htmlFor="otherDeductions" className="text-xs font-semibold text-foreground">
                      Other Lender Appraisal Deductions (₹)
                    </Label>
                    <Input
                      id="otherDeductions"
                      type="number"
                      min="0"
                      step="100"
                      value={otherDeductions === 0 ? "" : otherDeductions}
                      onChange={(e) => setOtherDeductions(e.target.value === "" ? 0 : Number(e.target.value))}
                      placeholder="0"
                      className="h-10 text-sm font-semibold rounded-xl"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ---------------------------------------------------- */}
            {/* COLLAPSIBLE 2: HOW MUCH WILL I REPAY?               */}
            {/* ---------------------------------------------------- */}
            <div className="pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => setShowRepaymentSection(!showRepaymentSection)}
                className="w-full flex items-center justify-between py-2 text-xs font-bold text-foreground hover:text-primary transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span>How much will I repay? (Repayment & EMI Estimator)</span>
                </span>
                {showRepaymentSection ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {showRepaymentSection && (
                <div className="mt-3 p-4 rounded-xl border border-border/70 bg-purple-500/5 dark:bg-purple-950/20 space-y-4">
                  {/* Repayment Method */}
                  <div className="space-y-1.5">
                    <Label htmlFor="repaymentMethod" className="text-xs font-semibold text-foreground">
                      Repayment Scheme
                    </Label>
                    <select
                      id="repaymentMethod"
                      value={repaymentMethod}
                      onChange={(e) => setRepaymentMethod(e.target.value as RepaymentMethod)}
                      aria-label="Repayment Scheme"
                      className="w-full h-10 px-3 rounded-xl border border-input bg-background text-foreground text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="emi">Monthly EMI (Reducing Balance - Principal + Interest each month)</option>
                      <option value="bullet">Bullet Repayment (Pay Entire Principal & Interest at Maturity)</option>
                      <option value="overdraft">Overdraft / Gold Credit Line (Interest only on used limit)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Annual Interest Rate */}
                    <div className="space-y-1.5">
                      <Label htmlFor="annualInterestRate" className="text-xs font-semibold text-foreground">
                        Annual Interest Rate (% p.a.)
                      </Label>
                      <div className="relative">
                        <Input
                          id="annualInterestRate"
                          type="number"
                          min="0"
                          max="50"
                          step="0.1"
                          value={annualInterestRate === 0 ? "" : annualInterestRate}
                          onChange={(e) => setAnnualInterestRate(e.target.value === "" ? 0 : Number(e.target.value))}
                          placeholder="e.g. 10.5"
                          className="h-10 text-sm font-semibold pr-8 rounded-xl"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground pointer-events-none">
                          %
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Typical bank rates range from 9.0% to 14.5% p.a.
                      </p>
                    </div>

                    {/* Loan Tenure */}
                    <div className="space-y-1.5">
                      <Label htmlFor="tenureMonths" className="text-xs font-semibold text-foreground">
                        Loan Tenure (Months)
                      </Label>
                      <div className="relative">
                        <Input
                          id="tenureMonths"
                          type="number"
                          min="1"
                          max="60"
                          step="1"
                          value={tenureMonths === 0 ? "" : tenureMonths}
                          onChange={(e) => setTenureMonths(e.target.value === "" ? 0 : Number(e.target.value))}
                          placeholder="e.g. 12"
                          className="h-10 text-sm font-semibold pr-14 rounded-xl"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground pointer-events-none">
                          months
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Standard gold loans are 3 to 12 months (or up to 36 for EMI).
                      </p>
                    </div>
                  </div>

                  {repaymentMethod === "overdraft" && (
                    <div className="space-y-1.5 pt-1 border-t border-border/40">
                      <Label htmlFor="overdraftUtilisationPct" className="text-xs font-semibold text-foreground">
                        Expected Utilisation (% of Sanctioned Limit)
                      </Label>
                      <Input
                        id="overdraftUtilisationPct"
                        type="number"
                        min="1"
                        max="100"
                        step="5"
                        value={overdraftUtilisationPct}
                        onChange={(e) => setOverdraftUtilisationPct(Number(e.target.value))}
                        className="h-10 text-sm font-semibold rounded-xl"
                      />
                      <p className="text-[10px] text-muted-foreground">
                        In overdraft loans, interest is charged only on the exact amount withdrawn, not the total limit.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ---------------------------------------------------- */}
            {/* COLLAPSIBLE 3: FEES & UPFRONT COSTS                 */}
            {/* ---------------------------------------------------- */}
            <div className="pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => setShowFeesSection(!showFeesSection)}
                className="w-full flex items-center justify-between py-2 text-xs font-bold text-foreground hover:text-primary transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Processing Fees & Net Disbursal Amount</span>
                </span>
                {showFeesSection ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {showFeesSection && (
                <div className="mt-3 p-4 rounded-xl border border-border/70 bg-emerald-500/5 dark:bg-emerald-950/20 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="processingFeeType" className="text-xs font-semibold text-foreground">
                        Processing Fee Method
                      </Label>
                      <select
                        id="processingFeeType"
                        value={processingFeeType}
                        onChange={(e) => setProcessingFeeType(e.target.value as ProcessingFeeType)}
                        aria-label="Processing Fee Method"
                        className="w-full h-10 px-3 rounded-xl border border-input bg-background text-foreground text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="percentage">Percentage (%) of Loan Amount</option>
                        <option value="fixed">Fixed Lump-Sum (₹)</option>
                        <option value="none">Zero / Free Processing</option>
                      </select>
                    </div>

                    {processingFeeType !== "none" && (
                      <div className="space-y-1.5">
                        <Label htmlFor="processingFeeValue" className="text-xs font-semibold text-foreground">
                          {processingFeeType === "percentage" ? "Processing Fee (%)" : "Processing Fee (₹)"}
                        </Label>
                        <Input
                          id="processingFeeValue"
                          type="number"
                          min="0"
                          step={processingFeeType === "percentage" ? "0.1" : "50"}
                          value={processingFeeValue === 0 ? "" : processingFeeValue}
                          onChange={(e) => setProcessingFeeValue(e.target.value === "" ? 0 : Number(e.target.value))}
                          placeholder={processingFeeType === "percentage" ? "0.5" : "500"}
                          className="h-10 text-sm font-semibold rounded-xl"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="valuationFee" className="text-xs font-semibold text-foreground">
                        Gold Appraiser / Assaying Fee (₹)
                      </Label>
                      <Input
                        id="valuationFee"
                        type="number"
                        min="0"
                        step="50"
                        value={valuationFee === 0 ? "" : valuationFee}
                        onChange={(e) => setValuationFee(e.target.value === "" ? 0 : Number(e.target.value))}
                        placeholder="e.g. 250"
                        className="h-10 text-sm font-semibold rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="documentationFee" className="text-xs font-semibold text-foreground">
                        Documentation / Stamp Fee (₹)
                      </Label>
                      <Input
                        id="documentationFee"
                        type="number"
                        min="0"
                        step="50"
                        value={documentationFee === 0 ? "" : documentationFee}
                        onChange={(e) => setDocumentationFee(e.target.value === "" ? 0 : Number(e.target.value))}
                        placeholder="e.g. 150"
                        className="h-10 text-sm font-semibold rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Calculate Button */}
            <div className="pt-2">
              <Button
                type="button"
                onClick={handleCalculateClick}
                className="w-full h-12 text-base font-bold rounded-xl shadow-xs flex items-center justify-center gap-2"
              >
                <Calculator className="h-5 w-5" />
                <span>Calculate Eligible Gold Loan</span>
              </Button>
            </div>

            {/* Validation Alerts */}
            {!validation.isValid && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{Object.values(validation.errors)[0]}</span>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: HIGH-CONTRAST RESULTS & BREAKDOWN           */}
        {/* ========================================================= */}
        <div ref={resultsRef} className="lg:col-span-5 space-y-6">
          {hasResult ? (
            <>
              {isOutdated && (
                <OutdatedResultBanner onCalculate={handleCalculateClick} />
              )}
              <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-5 lg:sticky lg:top-24">
            {/* Hero Result Box: Solid Crisp Black Price on Neutral Card */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
                  Estimated Gold Loan Amount
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700">
                  {loanMode === "requested_amount" ? "Requested Loan" : "Regulatory Ceiling"}
                </span>
              </div>

              {/* Big Hero Number: Solid Crisp Black */}
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-black dark:text-white">
                {result.formattedSanctionedLoan}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {loanMode === "requested_amount"
                  ? result.isRequestedLoanApproved
                    ? `Your desired loan of ${result.formattedSanctionedLoan} requires ${result.requestedLtvPercentage.toFixed(1)}% LTV, which is within the permitted ${result.permittedLtvForRequestedAmount}% limit.`
                    : `Warning: Desired loan of ${result.formattedSanctionedLoan} requires ${result.requestedLtvPercentage.toFixed(1)}% LTV, which exceeds the permitted ${result.permittedLtvForRequestedAmount}% maximum limit.`
                  : "Estimated maximum indicative loan based on your gold weight, purity and RBI LTV guidelines."}
              </p>
            </div>

            {/* Requested Loan Exceeded Warning */}
            {loanMode === "requested_amount" && !result.isRequestedLoanApproved && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <div>
                  <strong className="font-bold">LTV Limit Exceeded:</strong> You requested{" "}
                  {result.formattedSanctionedLoan}, but the maximum permissible loan against this gold is{" "}
                  <strong>{result.formattedMaxEligibleLoan}</strong> ({result.permittedLtvForRequestedAmount}% LTV limit).
                </div>
              </div>
            )}

            {/* Summary Breakdown Table: Distinct High-Contrast Colors */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-sm shadow-2xs divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-950">
              {/* 1. Gold Collateral Value: Blue */}
              <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Gold collateral value:</span>
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400 text-sm sm:text-base">
                  {result.formattedEligibleGoldValue}
                </span>
              </div>

              {/* 2. Applicable LTV: Amber / Orange */}
              <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Applicable LTV limit:</span>
                </span>
                <span className="font-bold text-amber-500 dark:text-amber-400 text-sm sm:text-base">
                  {result.formattedEffectiveLtv}
                </span>
              </div>

              {/* 3. Estimated Loan Amount: Solid Black */}
              <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-white shrink-0" />
                  <span className="font-bold text-slate-900 dark:text-white">Estimated loan amount:</span>
                </span>
                <span className="font-black text-black dark:text-white text-sm sm:text-base">
                  {result.formattedSanctionedLoan}
                </span>
              </div>

              {/* 4. Repayment Detail (if enabled): Purple */}
              {result.repaymentMethod === "emi" && (
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Estimated Monthly EMI:
                    </span>
                  </span>
                  <span className="font-bold text-purple-600 dark:text-purple-400 text-sm sm:text-base">
                    {result.formattedMonthlyEmi} / mo
                  </span>
                </div>
              )}

              {result.repaymentMethod === "bullet" && (
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Bullet Maturity Total:
                    </span>
                  </span>
                  <span className="font-bold text-purple-600 dark:text-purple-400 text-sm sm:text-base">
                    {result.formattedTotalRepayment}
                  </span>
                </div>
              )}

              {result.repaymentMethod === "overdraft" && (
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Monthly Overdraft Interest:
                    </span>
                  </span>
                  <span className="font-bold text-purple-600 dark:text-purple-400 text-sm sm:text-base">
                    {formatINR(result.monthlyOverdraftInterest)} / mo
                  </span>
                </div>
              )}

              {/* 5. Upfront Fees & Net Disbursal (if enabled): Emerald */}
              {result.totalUpfrontFees > 0 && (
                <div className="px-4 py-3.5 flex items-center justify-between bg-slate-100/70 dark:bg-slate-900/60 border-t-2 border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Money received after fees:</span>
                  </span>
                  <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
                    {result.formattedNetDisbursal}
                  </span>
                </div>
              )}
            </div>

            {/* Expandable Link: View Full Calculation Breakdown */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowFullCalculation(!showFullCalculation)}
                className="w-full flex items-center justify-between py-2 text-xs font-semibold text-primary hover:underline"
              >
                <span>{showFullCalculation ? "Hide calculation details" : "View full calculation breakdown"}</span>
                {showFullCalculation ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>

              {showFullCalculation && (
                <div className="mt-2.5 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-xs space-y-2.5 shadow-2xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Gross jewellery weight:</span>
                    <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                      {result.formattedGrossWeight}
                    </strong>
                  </div>

                  {result.nonGoldWeight > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Stones / Non-gold deducted:</span>
                      <strong className="text-amber-600 dark:text-amber-400 font-semibold">
                        −{result.nonGoldWeight.toFixed(2)} g
                      </strong>
                    </div>
                  )}

                  <div className="flex justify-between text-muted-foreground">
                    <span>Net pure gold weight:</span>
                    <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                      {result.formattedNetWeight}
                    </strong>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Purity & Fineness:</span>
                    <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                      {result.purityLabel} ({(result.finenessFraction * 100).toFixed(1)}%)
                    </strong>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Gold valuation rate:</span>
                    <strong className="text-blue-600 dark:text-blue-400 font-bold">
                      {result.formattedEffectiveRate} / g
                    </strong>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Intrinsic gold collateral value:</span>
                    <strong className="text-blue-600 dark:text-blue-400 font-bold">
                      {result.formattedEligibleGoldValue}
                    </strong>
                  </div>

                  {/* RBI Band Breakdown Table */}
                  {result.isRbiConsumptionRule && (
                    <div className="pt-2 border-t border-border/40 space-y-1.5">
                      <div className="text-[11px] font-bold text-foreground">
                        RBI 2025 Tiered LTV Band Candidates:
                      </div>
                      <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between pl-1">
                          <span>• Band 1 (≤₹2.5L @ 85%):</span>
                          <span className="font-semibold text-foreground">
                            {formatINR(result.bandCandidates[0]?.candidateAmount || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between pl-1">
                          <span>• Band 2 (&gt;₹2.5L–₹5L @ 80%):</span>
                          <span className={result.bandCandidates[1]?.isValid ? "font-semibold text-foreground" : "text-muted-foreground line-through"}>
                            {result.bandCandidates[1]?.isValid
                              ? formatINR(result.bandCandidates[1].candidateAmount)
                              : "Not applicable (≤₹2.5L)"}
                          </span>
                        </div>
                        <div className="flex justify-between pl-1">
                          <span>• Band 3 (&gt;₹5L @ 75%):</span>
                          <span className={result.bandCandidates[2]?.isValid ? "font-semibold text-foreground" : "text-muted-foreground line-through"}>
                            {result.bandCandidates[2]?.isValid
                              ? formatINR(result.bandCandidates[2].candidateAmount)
                              : "Not applicable (≤₹5L)"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Repayment Breakdown */}
                  {result.repaymentMethod !== "none" && (
                    <div className="pt-2 border-t border-border/40 space-y-1.5">
                      <div className="text-[11px] font-bold text-foreground">
                        Repayment Details ({result.tenureMonths} Months @ {result.annualInterestRate}% p.a.):
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Loan Principal:</span>
                        <strong className="text-foreground font-semibold">{result.formattedSanctionedLoan}</strong>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Total Interest Payable:</span>
                        <strong className="text-purple-600 dark:text-purple-400 font-bold">
                          {result.formattedTotalInterest}
                        </strong>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Total Repayment Over Tenure:</span>
                        <strong className="text-slate-900 dark:text-slate-100 font-bold">
                          {result.formattedTotalRepayment}
                        </strong>
                      </div>
                    </div>
                  )}

                  {/* Fees Breakdown */}
                  {result.totalUpfrontFees > 0 && (
                    <div className="pt-2 border-t border-border/40 space-y-1">
                      <div className="text-[11px] font-bold text-foreground">Upfront Deductions:</div>
                      {result.processingFee > 0 && (
                        <div className="flex justify-between text-muted-foreground pl-1">
                          <span>Processing fee:</span>
                          <span className="font-semibold">{result.formattedProcessingFee}</span>
                        </div>
                      )}
                      {result.valuationFee > 0 && (
                        <div className="flex justify-between text-muted-foreground pl-1">
                          <span>Valuation / Appraiser fee:</span>
                          <span className="font-semibold">{formatINR(result.valuationFee)}</span>
                        </div>
                      )}
                      {result.documentationFee > 0 && (
                        <div className="flex justify-between text-muted-foreground pl-1">
                          <span>Documentation fee:</span>
                          <span className="font-semibold">{formatINR(result.documentationFee)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-foreground pt-1 border-t border-border/40">
                        <span>Net disbursal in hand:</span>
                        <strong className="text-emerald-600 dark:text-emerald-400">{result.formattedNetDisbursal}</strong>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mandatory Regulatory & Consumer Disclaimers */}
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-[11px] text-muted-foreground leading-relaxed space-y-1.5">
              <p>
                <strong className="text-foreground">Important Note:</strong> Your actual gold loan amount depends on the lender's physical appraisal, eligible gold content, verified purity, prevailing 30-day benchmark rate, loan purpose and credit eligibility. This calculator provides an indicative regulatory ceiling estimate, not loan approval.
              </p>
              <p>
                Gold jewellery is financed solely on intrinsic gold weight. Diamonds, gemstones, beads, wax and making charges are excluded from collateral valuation.
              </p>
            </div>

            {/* Action Buttons Toolbar */}
            <div className="pt-3 border-t border-border/60 space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopySummary}
                  className="h-10 text-xs font-semibold rounded-xl border-border hover:bg-muted"
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
                  disabled={!validation.isValid}
                  className="h-10 w-full text-xs font-semibold rounded-xl"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset to defaults
                </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyResultPlaceholder
            message="Ready to estimate gold loan"
            subMessage="Enter your gold weight and purity, then press Calculate Eligible Gold Loan to see regulatory loan amount, LTV, and repayment options."
           />
        )}
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

// -------------------------------------------------------------
// FREQUENTLY ASKED QUESTIONS FOR ACCORDION
// -------------------------------------------------------------
