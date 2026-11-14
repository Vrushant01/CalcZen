import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The Loan EMI Calculator helps you estimate your Equated Monthly Instalment (EMI) for personal loans, car loans, and home mortgages in India. It calculates your exact monthly repayment, the total interest accrued over the tenure, and the comprehensive amortization schedule. By adjusting loan amount, annual interest rate, and repayment duration, you can compare different loan options, understand the impact of down payments, and plan a budget that protects your monthly cash flow.",

  howItWorks:
    "Enter your total loan principal (the amount you intend to borrow after making any down payment), the lender's annual percentage interest rate, and your desired loan tenure in months or years. The calculator immediately processes these figures using standard reducing-balance amortization mathematics. It displays your monthly EMI obligation, the total interest payable over the loan horizon, and an itemized annual breakdown showing how every monthly payment splits between principal reduction and bank interest.",

  formula:
    "Retail lenders in India determine your Equated Monthly Instalment using the universal reducing-balance formula:\n\nEMI = P × r × (1 + r)^n / ((1 + r)^n − 1)\n\nWhere:\n- P = Principal loan amount borrowed (e.g., ₹5,00,000)\n- r = Monthly interest rate (annual interest rate ÷ 12 ÷ 100; for 9% p.a., r = 0.0075)\n- n = Loan tenure in monthly instalments (tenure in years × 12; for 5 years, n = 60 months)\n\nUnder this reducing-balance method, interest is calculated only on the remaining balance each month. Early payments consist largely of interest, but as the principal balance decreases, a greater proportion of each EMI directly pays down principal.",

  example:
    "Consider a vehicle or personal loan of ₹5,00,000 at an annual interest rate of 9% for a term of 5 years (60 months):\n\n1. Calculate monthly rate (r): 9 ÷ 1200 = 0.0075\n2. Calculate tenure (n): 5 × 12 = 60 months\n3. Calculate compounding factor (1 + r)^n: (1.0075)^60 ≈ 1.565681\n4. Apply formula: EMI = 5,00,000 × 0.0075 × 1.565681 / (1.565681 − 1) ≈ ₹10,379.18 per month\n\nTakeaway Result:\n- Monthly EMI: ₹10,379\n- Total Amount Repaid: ₹6,22,751 (60 × ₹10,379.18)\n- Total Interest Payable: ₹1,22,751 (₹6,22,751 − ₹5,00,000)",

  mistakes:
    "The most frequent borrowing pitfall is agreeing to a flat-rate interest scheme instead of reducing balance, which effectively doubles the true cost of borrowing. Another common mistake is choosing an excessively long tenure just to lower the monthly EMI; while monthly outflow decreases, cumulative interest rises steeply. Borrowers also frequently neglect to factor in processing fees, documentation charges, and GST levied on administrative costs. Finally, not comparing prepayments and foreclosure guidelines across lenders can lead to unnecessary costs if you plan to close the debt early.",

  faqs: [
    {
      question: "What is EMI?",
      answer:
        'An Equated Monthly Instalment (EMI) is a fixed payment made by a borrower to a lender on a set calendar date every month. Each EMI is divided into two parts: principal repayment and interest charges. Under the standard reducing-balance method, your monthly payment stays constant, while the principal portion grows and interest shrinks over time. For home purchases, you can compare property loan payments with our <a href="/calculator/mortgage-calculator" class="text-primary hover:underline">Mortgage Calculator</a>.',
    },
    {
      question: "How to calculate car loan EMI?",
      answer:
        "To calculate car loan EMI, use the standard formula EMI = P × r × (1 + r)^n / ((1 + r)^n − 1). P is the vehicle loan amount after subtracting your down payment, r is the monthly interest rate (annual rate divided by 1200), and n is the tenure in months. Enter your loan amount and interest rate in our free EMI tool to get an instant breakdown of monthly payments, total interest, and amortisation.",
    },
    {
      question: "Does a longer tenure reduce EMI?",
      answer:
        'Yes, choosing a longer loan tenure reduces your monthly EMI because the principal repayment is spread across more months. However, a longer tenure substantially increases the total interest payable over the loan lifetime because interest compounds for a longer duration. To understand how compounding increases costs over long horizons, explore our <a href="/calculator/compound-interest-calculator" class="text-primary hover:underline">Compound Interest Calculator</a> to evaluate short versus long borrowing terms.',
    },
    {
      question: "What is the difference between flat and reducing-balance interest?",
      answer:
        "In a flat interest rate loan, interest is calculated on the entire initial principal for the full tenure, resulting in an effective interest rate nearly double the stated rate. In a reducing-balance loan, interest is calculated only on the outstanding principal balance each month. As you pay off debt, monthly interest charges decline progressively, saving thousands of rupees in borrowing expenses compared to deceptive flat-rate schemes.",
    },
    {
      question: "Can I prepay a loan?",
      answer:
        "Yes, most Indian banks and NBFCs permit partial prepayments or full foreclosure. Prepaying directly reduces the outstanding principal, which permanently cuts subsequent interest charges and shortens your remaining repayment period. Under Reserve Bank of India (RBI) guidelines, floating-rate personal, car, and home loans to individual borrowers cannot carry prepayment penalties. Always verify with your lender whether any foreclosure charges apply to fixed-rate loan facilities.",
    },
    {
      question: "Are there pre-payment penalties on personal loans?",
      answer:
        "Many lenders charge pre-payment penalties if you pay off your loan early, as it deprives them of anticipated interest earnings. These penalties can range from 1% to 5% of the outstanding balance. Always review the loan contract to verify if prepayment penalties apply before making extra lump-sum payments.",
    },
    {
      question: "Does my credit score affect my EMI?",
      answer:
        "Indirectly, yes. Your credit score is the primary factor lenders use to determine your Annual Percentage Rate (APR). A higher credit score qualifies you for a lower interest rate, which in turn significantly reduces your monthly EMI and the total interest you pay over the loan term.",
    },
    {
      question: "Is it better to choose a shorter or longer loan tenure?",
      answer:
        "It depends on your cash flow. A shorter tenure means much higher monthly payments, but you will pay significantly less total interest over the life of the loan. A longer tenure provides lower, more manageable monthly payments, but you will pay much more in long-term interest.",
    },
    {
      question: "What happens if I miss an EMI payment?",
      answer:
        "Missing an EMI payment typically triggers a late fee penalty from the lender. More importantly, if the payment is more than 30 days late, it will be reported to the credit bureaus, which will severely damage your credit score and make future borrowing much more expensive.",
    },
  ],

  authorityLinks: [
    {
      text: "Reserve Bank of India (RBI) Consumer Guidelines",
      url: "https://www.rbi.org.in/",
    },
    {
      text: "Consumer Financial Protection Bureau (CFPB) Loan Guide",
      url: "https://www.consumerfinance.gov/consumer-tools/loans/",
    },
  ],

  relatedCalculators: [
    "mortgage-calculator",
    "compound-interest-calculator",
    "sip-calculator",
    "fd-calculator",
  ],
};

export default content;
