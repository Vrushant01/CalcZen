import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The Fixed Deposit (FD) Calculator determines the final maturity corpus, accumulated interest earnings, and compounding growth for bank and post office term deposits in India. Whether you choose a cumulative reinvestment deposit where interest compounds quarterly until maturity, or a non-cumulative scheme where payouts are disbursed monthly or quarterly for regular living expenses, this tool accurately projects your cash flows under Reserve Bank of India (RBI) compounding conventions.",

  howItWorks:
    "To evaluate your term deposit growth accurately, follow these straightforward steps:\n1. Deposit Amount (Principal): Enter your initial investment capital in Rupees (for example ₹1,00,000 or ₹5,00,000).\n2. Annual Interest Rate: Input the contracted annual percentage rate offered by your bank or non-banking financial company (e.g. 7.10% per annum for general depositors or 7.60% for senior citizens).\n3. Tenure Duration: Enter the total holding period broken down by full years and additional months (such as 3 years and 0 months).\n4. Compounding Frequency: Select quarterly compounding (the standard regulatory frequency adopted by public and private commercial banks in India), half-yearly, annual, or monthly compounding.\n5. Click 'Calculate' to generate your detailed maturity breakdown, interest-to-principal ratio, and growth trajectory.",

  formula:
    "Cumulative Fixed Deposit Compounding Formula:\n\nA = P × (1 + r / n)^(n × t)\nInterest Earned = A - P\n\nWhere:\n- A = Final maturity value received at the conclusion of the deposit\n- P = Principal deposit amount invested at inception (₹)\n- r = Nominal annual rate of interest expressed in decimal form (e.g. 7.10% = 0.071)\n- n = Number of compounding intervals per financial year (4 for quarterly compounding, 2 for semi-annual, 1 for annual, 12 for monthly)\n- t = Deposit tenure expressed in years (calculated as Years + [Months / 12])",

  example:
    "Consider an Indian investor depositing ₹1,00,000 in a 3-year cumulative bank fixed deposit at 7.10% per annum with quarterly compounding:\n- Principal Deposit (P): ₹1,00,000\n- Nominal Annual Rate (r): 7.10% (0.071)\n- Compounding Frequency (n): 4 quarters per year\n- Tenure (t): 3.0 years (12 total compounding cycles)\n- Quarterly Interest Rate: 0.071 / 4 = 0.01775 (1.775% per quarter)\n- Compounding Multiplier: (1 + 0.01775)^12 ≈ 1.233974\n- Total Maturity Corpus (A): ₹1,00,000 × 1.233974 = ₹1,23,397\n- Total Compound Interest Earned: ₹1,23,397 - ₹1,00,000 = ₹23,397",

  mistakes:
    "1. Neglecting Tax Deducted at Source (TDS): Indian banks deduct 10% TDS (20% without PAN) when total annual FD interest across all branches of a single bank exceeds ₹40,000 for regular individuals or ₹50,000 for senior citizens under Section 194A.\n2. Overlooking Income Tax Slab Liability: TDS is merely an interim withholding, not a final tax settlement. FD interest is added to your 'Income from Other Sources' and taxed at your marginal income tax slab rate (up to 30% plus cess).\n3. Premature Liquidation Penalties: Breaking an FD before tenure completion typically incurs a 0.50% to 1.00% penal reduction in the applicable interest rate for the period held, eroding accrued compounding benefits.\n4. Ignoring Post-Inflation Returns: If inflation averages 5.5% and your 30% slab reduces a 7% nominal FD return to 4.90% post-tax, your real purchasing power declines. Maintain a balance between safe FDs and growth-oriented mutual funds.",

  faqs: [
    {
      question: "How does fixed deposit compounding work in Indian commercial banks?",
      answer:
        "By Reserve Bank of India (RBI) directive, Indian scheduled commercial banks compound interest on term deposits on a quarterly basis. Every three months, the interest accrued during that quarter is added to the principal balance, and subsequent interest calculations are applied to this higher compounded figure. This yields an effective annual yield noticeably higher than the nominal contracted interest rate.",
    },
    {
      question: "What is the primary difference between cumulative and non-cumulative FDs?",
      answer:
        "In a cumulative fixed deposit, all accrued interest is reinvested quarterly and disbursed in one lump sum at final maturity, maximizing the wealth-building effect of compound growth. In a non-cumulative fixed deposit, the accrued interest is credited directly to your savings account at fixed intervals—monthly, quarterly, or half-yearly—making it best suited for retirees requiring predictable cash flow for household expenses.",
    },
    {
      question: "Is my bank fixed deposit safe and insured in India?",
      answer:
        "Yes. Under the Deposit Insurance and Credit Guarantee Corporation (DICGC), a fully owned subsidiary of the RBI, every depositor across insured commercial, cooperative, and regional rural banks is insured up to a maximum limit of ₹5,00,000 (encompassing both principal and accrued interest) per bank across all accounts and branches held in the same capacity.",
    },
    {
      question: "How can senior citizens avoid TDS deductions on their FD interest?",
      answer:
        "If a senior citizen's estimated total annual taxable income falls below the minimum exemption threshold, they can submit Form 15H at the beginning of each financial year to prevent TDS deduction by the bank. Non-senior citizens whose total income is below the taxable threshold can submit Form 15G under identical guidelines.",
    },
    {
      question: "Can I take a loan against my fixed deposit without breaking it?",
      answer:
        'Yes. Most banks permit account holders to borrow up to 90% to 95% of their deposit balance as an overdraft or demand loan at an interest rate typically 1% to 2% above the contracted deposit rate. This preserves the accumulated compounding benefits while fulfilling urgent emergency cash requirements. You can calculate personal borrowing repayments with our <a href="/calculator/loan-emi-calculator" class="text-primary hover:underline">Loan EMI Calculator</a> or compare long-term wealth growth using our <a href="/calculator/sip-calculator" class="text-primary hover:underline">SIP Calculator</a>.',
    },
  ],

  authorityLinks: [
    {
      text: "Reserve Bank of India (RBI) Bank Deposit Regulatory Master Directions",
      url: "https://www.rbi.org.in/",
    },
    {
      text: "Income Tax Department — Section 194A TDS on Interest on Securities",
      url: "https://www.incometax.gov.in/",
    },
    {
      text: "DICGC Deposit Insurance Information & Bank Coverage Limits",
      url: "https://www.dicgc.org.in/",
    },
  ],

  relatedCalculators: [
    "sip-calculator",
    "compound-interest-calculator",
    "loan-emi-calculator",
    "mortgage-calculator",
  ],

  lastReviewed: "2026-11-21",
};

export default content;
