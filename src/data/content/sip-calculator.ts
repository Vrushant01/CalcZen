import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The SIP Calculator estimates the wealth accumulated through Systematic Investment Plans (SIP) in mutual funds. By investing a fixed amount every month, you benefit from market volatility through rupee cost averaging and power long-term financial goals like retirement, home purchase, or education.",

  howItWorks:
    "Enter your monthly SIP instalment amount, expected annual rate of return, and investment tenure in years. The calculator projects your total capital invested, the estimated wealth gain, and the maturity corpus.",

  formula:
    "Mutual Fund SIP Maturity Formula:\n\nM = P × [ ((1 + i)^n − 1) / i ] × (1 + i)\n\nWhere:\n- M = Final maturity corpus\n- P = Monthly SIP instalment amount\n- i = Monthly return rate (Annual expected return ÷ 12 ÷ 100)\n- n = Total number of monthly contributions (Tenure in years × 12)",

  example:
    "Investing ₹10,000 monthly for 15 years at an expected annual return of 12%:\n- Total Amount Invested: ₹18,00,000\n- Estimated Returns: ₹32,45,760\n- Total Maturity Value: ₹50,45,760",

  mistakes:
    "Stopping SIP contributions during market corrections is a frequent investor mistake; downturns allow you to acquire more mutual fund units at lower prices. Another pitfall is ignoring inflation when setting future wealth targets.",

  faqs: [
    {
      question: "What is the difference between SIP and a Fixed Deposit?",
      answer:
        'A Systematic Investment Plan (SIP) invests periodically in market-linked mutual funds, offering higher potential wealth generation over the long term but with market fluctuations. In contrast, a Fixed Deposit offers a guaranteed, fixed interest rate with zero capital risk. Compare guaranteed returns with our <a href="/calculator/fd-calculator" class="text-primary hover:underline">FD Calculator</a> or explore compounding with the <a href="/calculator/compound-interest-calculator" class="text-primary hover:underline">Compound Interest Calculator</a>.',
    },
    {
      question: "Can SIP returns help me offset loan borrowing costs?",
      answer:
        'Yes, disciplined mutual fund investing can build an investment corpus that outpaces borrowing interest rates. For example, investing surplus income in an equity SIP while servicing a home or car loan can build substantial net worth. You can calculate your monthly debt obligations using our <a href="/calculator/loan-emi-calculator" class="text-primary hover:underline">Loan EMI Calculator</a> or housing loans via the <a href="/calculator/mortgage-calculator" class="text-primary hover:underline">Mortgage Calculator</a>.',
    },
  ],

  authorityLinks: [
    {
      text: "Association of Mutual Funds in India (AMFI) SIP Guide",
      url: "https://www.amfiindia.com/",
    },
  ],

  relatedCalculators: [
    "compound-interest-calculator",
    "fd-calculator",
    "loan-emi-calculator",
    "mortgage-calculator",
  ],
};

export default content;
