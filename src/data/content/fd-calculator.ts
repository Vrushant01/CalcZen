import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The Fixed Deposit (FD) Calculator determines the maturity amount and interest earned on term deposits across Indian banks and post offices. It supports cumulative compounding deposits as well as periodic interest payout schedules.",

  howItWorks:
    "Enter your deposit amount, annual interest rate, tenure (in days, months, or years), and compounding frequency (typically quarterly in Indian retail banking). The calculator computes your maturity value, total interest, and applicable TDS deductions.",

  formula:
    "Quarterly Compounded Fixed Deposit Formula:\n\nA = P × (1 + r/4)^(4t)\n\nWhere:\n- A = Maturity amount\n- P = Principal deposit amount\n- r = Annual interest rate (in decimal format)\n- t = Tenure in years",

  example:
    "Depositing ₹2,00,000 for 3 years at 7.0% per annum compounded quarterly:\n- Total Principal Invested: ₹2,00,000\n- Total Interest Earned: ₹46,288\n- Final Maturity Amount: ₹2,46,288",

  mistakes:
    "A common mistake is forgetting that bank FD interest is fully taxable under your income tax slab, which reduces real post-tax returns. Another pitfall is premature withdrawal penalties.",

  faqs: [
    {
      question: "How does Fixed Deposit compare to market investments like SIPs?",
      answer:
        'A Fixed Deposit offers guaranteed safety and predictable returns, making it ideal for emergency funds and short-term capital preservation. However, equity mutual funds generally deliver higher long-term inflation-adjusted growth. You can model disciplined mutual fund returns using our <a href="/calculator/sip-calculator" class="text-primary hover:underline">SIP Calculator</a> or general investment growth with the <a href="/calculator/compound-interest-calculator" class="text-primary hover:underline">Compound Interest Calculator</a>.',
    },
    {
      question: "Can I use an FD as collateral for a bank loan?",
      answer:
        'Yes, most Indian banks offer overdrafts or loans against fixed deposits at 1% to 2% above the deposit rate, avoiding premature liquidation. If you are comparing borrowing options across personal or vehicle loans, assess your monthly payments using our <a href="/calculator/loan-emi-calculator" class="text-primary hover:underline">Loan EMI Calculator</a> or housing loans with the <a href="/calculator/mortgage-calculator" class="text-primary hover:underline">Mortgage Calculator</a>.',
    },
  ],

  authorityLinks: [
    {
      text: "Reserve Bank of India (RBI) Bank Deposit Guidelines",
      url: "https://www.rbi.org.in/",
    },
  ],

  relatedCalculators: [
    "sip-calculator",
    "compound-interest-calculator",
    "loan-emi-calculator",
    "mortgage-calculator",
  ],
};

export default content;
