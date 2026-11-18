export const homeLoanEmiCalculatorContent = {
  h1: "Home Loan EMI Calculator",
  intro:
    "Calculate your housing loan instalments and discover how part-prepayments can save lakhs of rupees in interest with our Home Loan EMI Calculator for India. View your monthly repayment schedule, compare reducing tenure versus reducing EMI, and make smart home financing choices for your family.",
  howToUseSteps: [
    "Enter your required home loan principal amount in rupees.",
    "Specify the annual interest rate quoted by your bank or housing finance company.",
    "Choose your repayment duration in years (commonly 15 to 30 years).",
    "Optionally choose a prepayment strategy (one-time lump sum or recurring annual prepayments).",
    "Select your preferred prepayment benefit: reduce loan tenure to become debt-free sooner, or reduce monthly EMI to ease immediate cash flow.",
    "Click Calculate to view your baseline instalment, interest savings, reduced tenure, and comprehensive yearly amortization table.",
  ],
  formula:
    "Home loan Equated Monthly Instalments (EMIs) are calculated via the standard reducing-balance formula: EMI = [P × r × (1 + r)^n] / [(1 + r)^n − 1]. Here, P represents the sanctioned loan principal, r is the monthly interest rate (annual interest percentage divided by 1200), and n is the tenure in months. Whenever you make an unscheduled part-prepayment, the entire extra payment directly credits against the unpaid principal, immediately contracting the baseline on which future interest is levied. Choosing to reduce tenure retains the original EMI while substantially truncating the remaining number of months.",
  workedExample: {
    description:
      "A homebuyer takes a ₹50,00,000 housing loan at an interest rate of 8.50% p.a. for a tenure of 20 years (240 months). At Month 12, the borrower makes a one-time lump-sum part-prepayment of ₹5,00,000 choosing to reduce tenure.",
    table: [
      { label: "Sanctioned Principal (P)", value: "₹50,00,000" },
      { label: "Interest Rate", value: "8.50% p.a. reducing" },
      { label: "Original Tenure", value: "20 Years (240 Months)" },
      { label: "Standard Monthly EMI", value: "₹43,391" },
      { label: "Baseline Total Interest (No Prepayment)", value: "₹54,13,879" },
      { label: "Lump-Sum Prepayment (Month 12)", value: "₹5,00,000" },
      { label: "Revised Loan Tenure", value: "16 Years (192 Months)" },
      { label: "Tenure Reduction", value: "48 Months (4 Years Saved)" },
      { label: "Net Interest Saved", value: "₹16,03,691" },
    ],
  },
  quickReferenceTable: {
    title: "Home Loan EMI by Loan Amount and Tenure (at 8.5% p.a.)",
    headers: ["Loan Amount", "15 Years EMI", "20 Years EMI", "25 Years EMI", "30 Years EMI"],
    rows: [
      ["₹30 Lakh", "₹29,542", "₹26,035", "₹24,157", "₹23,067"],
      ["₹50 Lakh", "₹49,237", "₹43,391", "₹40,261", "₹38,446"],
      ["₹75 Lakh", "₹73,855", "₹65,087", "₹60,392", "₹57,668"],
      ["₹1 Crore", "₹98,474", "₹86,782", "₹80,523", "₹76,891"],
    ],
  },
  mistakes: [
    "Prioritizing maximum loan tenure to minimize monthly EMI: Stretching tenure from 20 to 30 years cuts EMI slightly but can add ₹20+ lakh in extra cumulative interest on a ₹50 lakh loan.",
    "Not utilizing annual bonuses for micro-prepayments: Prepaying just one extra EMI per calendar year can cut a 20-year home loan duration by nearly 3 to 4 years.",
    "Ignoring home loan balance transfer opportunities: If market rates drop by 0.50% to 1.00% or your credit score improves significantly, renegotiating with your current lender or transferring your loan can save substantial interest.",
    "Over-leveraging beyond safe income limits: Committing over 50% of your take-home household income to fixed loan EMIs leaves little cushion for job transitions, medical emergencies, or inflation.",
    "Failing to collect original property title deeds and NOC promptly: When foreclosing or closing a home loan, ensure the bank returns your original registry documents and files an official satisfaction of charge with CERSAI.",
  ],
  faqs: [
    {
      q: "How does part-prepayment on a home loan work in India?",
      a: "A part-prepayment is any extra lump-sum payment you make over and above your scheduled monthly EMI. The entire prepaid amount is deducted directly from your principal outstanding balance. Because interest is charged only on the remaining balance, prepaying early in the loan cycle saves the highest amount of interest.",
    },
    {
      q: "Should I choose to reduce loan tenure or reduce monthly EMI after a prepayment?",
      a: "Reducing loan tenure maximizes overall interest savings and allows you to become debt-free years ahead of schedule. Reducing monthly EMI provides breathing room in your immediate monthly household budget. If your cash flow is steady, choosing tenure reduction is almost always financially superior.",
    },
    {
      q: "What tax benefits are available on home loans under Indian income tax laws?",
      a: "Under current Indian tax provisions, borrowers may claim deductions for interest paid under Section 24(b) (up to ₹2 lakh annually for self-occupied properties) and principal repayment under Section 80C (up to ₹1.5 lakh annually, subject to aggregate 80C limits). These figures reflect general rules under the old tax regime and may not apply under the new tax regime. Always verify current statutory tax provisions and consult a qualified chartered accountant or tax advisor.",
    },
    {
      q: "What is the difference between a fixed and a floating home loan rate?",
      a: "Floating interest rates fluctuate alongside the bank's external benchmark lending rate (such as the RBI Repo Rate). When the repo rate rises or falls, your home loan rate adjusts accordingly. Fixed rates remain locked for a specified timeframe but typically start 1.0% to 2.5% higher than prevailing floating rates.",
    },
    {
      q: "How much home loan EMI is safe relative to monthly income?",
      a: "As a broad financial guideline, financial planners recommend capping your total monthly debt obligations (including home loan, car loan, and personal credit) at approximately 40% of your net monthly take-home salary. This guideline ensures sufficient liquidity for household living costs, investments, and unexpected emergencies.",
    },
    {
      q: "Are there foreclosure or prepayment penalties on home loans?",
      a: "Per Reserve Bank of India (RBI) regulations, banks and housing finance companies are strictly prohibited from charging prepayment or foreclosure penalties on floating-rate home loans sanctioned to individual borrowers. Fixed-rate home loans, loans to business entities, or dual-rate loans may still carry prepayment penalties of 2% to 3% plus GST.",
    },
  ],
  relatedSlugs: [
    "loan-emi-calculator",
    "car-loan-emi-calculator",
    "loan-eligibility-calculator",
    "fd-calculator",
  ],
};
