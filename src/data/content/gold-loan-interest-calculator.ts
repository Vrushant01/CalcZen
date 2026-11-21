export const goldLoanInterestCalculatorContent = {
  h1: "Gold Loan EMI & Interest Calculator",
  intro:
    "Evaluate your gold borrowing options with our Gold Loan EMI & Interest Calculator for India. Calculate your maximum eligible loan amount based on certified karat purity and today's gold rate. Compare reducing-balance EMI, monthly-interest with principal-at-end, and bullet repayment schemes to find the most cost-effective financing plan.",
  howToUseSteps: [
    "Enter the net weight of your gold jewellery or coins in grams (excluding gemstones and stones).",
    "Select your gold purity (24K pure gold, standard 22K jewellery gold, or 18K ornamental gold).",
    "Confirm or adjust the gold rate per gram (automatically synced with live benchmarks when available).",
    "Set the Loan-to-Value (LTV) ratio (RBI mandates a ceiling of 75% for retail jewellery loans).",
    "Enter your lender's annual interest rate % and repayment tenure in months.",
    "Choose your repayment structure: Monthly EMI, Monthly Interest with principal at maturity, or Bullet repayment.",
    "Click Calculate to review your sanctioned loan limit, exact interest burden, and total financing expenditure.",
  ],
  formula:
    "The valuation and interest calculations follow regulated banking benchmarks. Gold Value is determined as Weight (grams) × Benchmark 24K Rate per gram × Karat Factor (24K = 1.0, 22K = 0.9167, 18K = 0.75). The Eligible Loan is computed as Gold Value × LTV% (capped at 75%). For EMI repayment, instalments follow the reducing-balance formula: EMI = [P × r × (1 + r)^n] / [(1 + r)^n − 1]. Under monthly-interest schemes, interest is charged as P × (annual rate / 1200) each month with P returned at tenure end. Under bullet repayment, interest accumulates over the term and is paid alongside principal at maturity.",
  workedExample: {
    description:
      "A borrower pledges 50 grams of 22K hallmarked gold jewellery when 24K gold is ₹7,500 per gram. The bank offers an annual interest rate of 10.50% p.a. for a 12-month tenure at the maximum statutory 75% Loan-to-Value (LTV) ratio with a 0.5% processing fee.",
    table: [
      { label: "Net Gold Weight", value: "50 grams" },
      { label: "Gold Karat Purity", value: "22K (91.67% pure gold)" },
      { label: "Effective Gold Valuation", value: "₹3,43,750" },
      { label: "Eligible Loan Principal (75% LTV)", value: "₹2,57,813" },
      { label: "Option A: Monthly Reducing EMI", value: "₹22,726 / month (Total Interest: ₹14,899)" },
      { label: "Option B: Monthly Interest Only", value: "₹2,256 / month (Total Interest: ₹27,070)" },
      { label: "Option C: Bullet Repayment (At End)", value: "₹0 / month (Total Interest: ₹28,427 at maturity)" },
      { label: "Bank Processing Fee (0.5%)", value: "₹1,289" },
    ],
  },
  quickReferenceTable: {
    title: "Gold Loan Repayment Options Compared (₹2,50,000 Loan at 10.5% for 1 Year)",
    headers: ["Repayment Scheme", "Monthly Outflow", "Principal Repayment", "Total Interest", "Total Paid"],
    rows: [
      ["Regular EMI (Reducing)", "₹22,037", "Monthly across 12 mos", "₹14,444", "₹2,64,444"],
      ["Monthly Interest Only", "₹2,188", "₹2,50,000 at Month 12", "₹26,250", "₹2,76,250"],
      ["Bullet Repayment", "₹0", "₹2,50,000 + interest at Month 12", "₹27,566", "₹2,77,566"],
    ],
  },
  mistakes: [
    "Gross weight vs net weight confusion: Lenders physically deduct the weight of lac, beads, enamel, and synthetic stones. Only the net weight of pure gold is factored into valuation.",
    "Choosing bullet repayment without a planned liquidity event: Bullet repayment offers immediate relief with zero monthly payments, but leaves the entire principal and compounded interest due simultaneously on the final day.",
    "Ignoring LTV margin call risks: If global gold prices drop sharply during your loan tenure, the LTV ratio may exceed the 75% regulatory limit, triggering urgent bank margin calls demanding cash deposits or extra gold pledge.",
    "Overlooking pre-closure and pledge release timelines: Ensure your lender provides a transparent inventory receipt detailing exact ornament counts, gross weight, and hallmarked status before handing over jewellery.",
    "Pledging non-hallmarked jewellery without purity testing: Non-hallmarked ornaments undergo karatometer testing at branches, where acid testing or lower assessed purity may result in a smaller loan offer than anticipated.",
  ],
  faqs: [
    {
      q: "How do banks and NBFCs determine eligible gold loan amounts?",
      a: "Lenders calculate your eligible loan amount by evaluating the net weight of pure gold in your jewellery, multiplied by the 30-day average price of 22-karat gold published by industry bodies like IBJA. Under Reserve Bank of India regulations, the maximum sanctioned loan cannot exceed 75% of this evaluated collateral value.",
    },
    {
      q: "What is the 75% Loan-to-Value (LTV) rule mandated by the RBI?",
      a: "The Reserve Bank of India mandates that commercial banks and non-banking financial companies (NBFCs) can lend up to a maximum of 75% of the market value of pledged gold jewellery. This 25% safety margin protects lenders and borrowers against day-to-day market volatility in gold prices.",
    },
    {
      q: "What are the key differences between EMI, Monthly Interest, and Bullet repayments?",
      a: "Under an EMI scheme, you pay both interest and principal every month, achieving the lowest overall interest cost. Under a Monthly Interest plan, you pay interest monthly and settle the full principal as a lump sum at the end. In a Bullet loan, zero monthly payments are required; the entire principal plus accumulated interest is settled on the final due date.",
    },
    {
      q: "What happens if market gold prices crash during my active loan?",
      a: "If gold prices experience a steep decline, the market value of your collateral decreases, causing your outstanding loan balance to breach the 75% LTV limit. When this happens, the lender issues a margin call requiring you to either prepay part of the loan principal or pledge additional gold ornaments to restore the required LTV buffer.",
    },
    {
      q: "What documents are required to secure a gold loan in India?",
      a: "Gold loans require minimal documentation compared to unsecured loans. You typically need proof of identity (Aadhaar card, PAN card, passport, or voter ID) and proof of address. Because the loan is fully secured by physical gold, detailed income proofs, salary slips, or high credit scores are generally not mandatory.",
    },
    {
      q: "Can I inspect related gold jewellery tools on CalcZen?",
      a: "Yes. For detailed jewellery billing breakdowns including making charges and GST, visit our <a href=\"/calculator/gold-jewellery-bill-calculator\" class=\"text-primary hover:underline font-medium\">Gold Jewellery Bill Calculator</a>. To check statutory karat purity percentages, explore the <a href=\"/calculator/gold-purity-karat-converter\" class=\"text-primary hover:underline font-medium\">Gold Purity &amp; Karat Converter</a>.",
    },
  ],
  relatedSlugs: [
    "gold-jewellery-bill-calculator",
    "gold-loan-against-jewellery-calculator",
    "gold-purity-karat-converter",
    "loan-emi-calculator",
  ],
};

import type { CalculatorEducationalContent } from "../content-types";

const educationalContent: CalculatorEducationalContent = {
  whatItDoes: goldLoanInterestCalculatorContent.intro,
  howItWorks: Array.isArray(goldLoanInterestCalculatorContent.howToUseSteps) ? goldLoanInterestCalculatorContent.howToUseSteps.join("\n\n") : "",
  formula: goldLoanInterestCalculatorContent.formula,
  example: typeof goldLoanInterestCalculatorContent.workedExample === 'object' && goldLoanInterestCalculatorContent.workedExample ? (goldLoanInterestCalculatorContent.workedExample.description + "\n\n" + (goldLoanInterestCalculatorContent.workedExample.table || []).map((t: any) => `${t.label}: ${t.value}`).join("\n")) : "",
  mistakes: Array.isArray(goldLoanInterestCalculatorContent.mistakes) ? goldLoanInterestCalculatorContent.mistakes.join("\n\n") : String(goldLoanInterestCalculatorContent.mistakes || ""),
  faqs: Array.isArray(goldLoanInterestCalculatorContent.faqs) ? goldLoanInterestCalculatorContent.faqs.map((f: any) => ({ question: f.q, answer: f.a })) : [],
  authorityLinks: [
    { text: "Bureau of Indian Standards (BIS)", url: "https://www.bis.gov.in/" },
    { text: "Reserve Bank of India (RBI)", url: "https://www.rbi.org.in/" },
  ],
  relatedCalculators: goldLoanInterestCalculatorContent.relatedSlugs || ["gold-loan-against-jewellery-calculator","gold-value-calculator","loan-emi-calculator"],
  lastReviewed: "2026-11-21",
};

export default educationalContent;
