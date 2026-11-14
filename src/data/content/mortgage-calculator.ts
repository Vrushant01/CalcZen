import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The Mortgage Calculator estimates your monthly home loan payment, total interest charges, and comprehensive amortization schedule. By inputting your target property purchase price, down payment percentage, loan tenure, and interest rate, you can assess monthly cash flow commitments and evaluate refinancing opportunities before committing to a home purchase.",

  howItWorks:
    "Enter your home price, down payment, loan term, and interest rate. The calculator deduces your net borrowing principal, applies standard monthly amortization algorithms, and provides an itemized breakdown of principal repayment, interest costs, and total payments across your mortgage term.",

  formula:
    "Standard Mortgage Amortization Formula:\n\nM = P × [ r(1 + r)^n ] / [ (1 + r)^n − 1 ]\n\nWhere:\n- M = Total monthly mortgage payment\n- P = Principal loan amount (Home purchase price − Down payment)\n- r = Monthly interest rate (Annual interest rate ÷ 12 ÷ 100)\n- n = Number of monthly payments (Loan term in years × 12)",

  example:
    "For a ₹50,00,000 property with a 20% down payment (₹10,00,000), borrowing ₹40,00,000 at 8.5% annual interest for 20 years (240 months):\n- Monthly Mortgage Payment: ≈ ₹34,713\n- Total Loan Repayment: ₹83,31,093\n- Total Interest Payable: ₹43,31,093",

  mistakes:
    "A frequent home buying mistake is focusing solely on principal and interest while overlooking property taxes, registration charges, and insurance costs. Another common error is choosing maximum loan terms that dramatically inflate lifetime interest expenses. Plan personal or vehicle borrowing alongside property loans with our Loan EMI Calculator.",

  faqs: [
    {
      question: "How does a mortgage compare to a standard personal loan?",
      answer:
        'A mortgage is a secured borrowing facility tied to real estate property, typically offering lower interest rates and longer repayment durations (15 to 30 years). In contrast, personal loans are unsecured, shorter in duration, and carry higher rates. To compare non-housing borrowing scenarios, use our <a href="/calculator/loan-emi-calculator" class="text-primary hover:underline">Loan EMI Calculator</a>.',
    },
    {
      question: "How can prepayments reduce my mortgage interest?",
      answer:
        'Making periodic lump-sum prepayments directly reduces your outstanding loan principal. Because interest is charged on the reducing balance, prepayments significantly shorten your loan duration and save lakhs in cumulative interest. You can evaluate how surplus savings compound over time using our <a href="/calculator/compound-interest-calculator" class="text-primary hover:underline">Compound Interest Calculator</a>.',
    },
    {
      question: "Should I invest my extra savings in mutual funds or prepay my home loan?",
      answer:
        'This depends on your mortgage interest rate versus your projected investment return. If your expected mutual fund return exceeds your loan interest rate, systematic investing may build more wealth. You can project disciplined monthly investment returns with our <a href="/calculator/sip-calculator" class="text-primary hover:underline">SIP Calculator</a> or compare safe returns with the <a href="/calculator/fd-calculator" class="text-primary hover:underline">FD Calculator</a>.',
    },
  ],

  authorityLinks: [
    {
      text: "Consumer Financial Protection Bureau (CFPB) Owning a Home Guide",
      url: "https://www.consumerfinance.gov/owning-a-home/",
    },
  ],

  relatedCalculators: [
    "loan-emi-calculator",
    "compound-interest-calculator",
    "sip-calculator",
    "fd-calculator",
  ],
};

export default content;
