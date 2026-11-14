import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The Compound Interest Calculator visualizes the exponential growth of your investments over time. By calculating interest earned on both your initial principal and previous accumulated interest, this tool illustrates the wealth-building power of compounding and regular systematic contributions.",

  howItWorks:
    "Enter your starting principal balance, regular contribution amount and frequency (monthly or annual), annual rate of return, compounding frequency, and investment duration. The calculator models future asset values, total contributions, and cumulative interest earned across your entire investment horizon.",

  formula:
    "Compound Interest Equation with Regular Contributions:\n\nA = P(1 + r/n)^(nt) + PMT × [ ((1 + r/n)^(nt) − 1) / (r/n) ]\n\nWhere:\n- A = Future investment value\n- P = Initial investment principal\n- r = Annual interest rate (in decimal format)\n- n = Number of compounding intervals per year\n- t = Investment horizon in years\n- PMT = Periodic regular contribution amount",

  example:
    "Investing an initial ₹1,00,000 with monthly contributions of ₹5,000 at a 10% annual return compounded monthly for 15 years:\n- Total Amount Invested: ₹10,00,000 (₹1,00,000 initial + ₹9,00,000 contributions)\n- Total Interest Earned: ₹15,53,680\n- Final Accumulated Corpus: ₹25,53,680",

  mistakes:
    "The costliest compounding mistake is delaying investing; starting even five years earlier often doubles your final corpus due to exponential growth. Another common error is underestimating the erosion caused by inflation or high fund management expense ratios.",

  faqs: [
    {
      question: "How does compound interest differ from simple interest?",
      answer:
        "Simple interest is calculated solely on your initial principal amount throughout the term. In contrast, compound interest calculates returns on both your principal and previously accrued interest. Over decades, this compounding snowball effect results in exponential capital growth.",
    },
    {
      question: "How can I compare investing returns against loan borrowing costs?",
      answer:
        'To decide whether to invest surplus income or pay down debt, compare your expected investment compounding against your loan interest rates using our <a href="/calculator/loan-emi-calculator" class="text-primary hover:underline">Loan EMI Calculator</a> or property financing via the <a href="/calculator/mortgage-calculator" class="text-primary hover:underline">Mortgage Calculator</a>.',
    },
    {
      question: "What is the difference between lump-sum compounding and a monthly SIP?",
      answer:
        'A lump-sum investment compounds a single initial balance over time, whereas a Systematic Investment Plan (SIP) adds disciplined monthly instalments that benefit from rupee cost averaging. You can model mutual fund equity plans directly with our <a href="/calculator/sip-calculator" class="text-primary hover:underline">SIP Calculator</a> or secure guaranteed bank growth using the <a href="/calculator/fd-calculator" class="text-primary hover:underline">FD Calculator</a>.',
    },
  ],

  authorityLinks: [
    {
      text: "SEC Investor.gov Compound Interest Calculator Guide",
      url: "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator",
    },
  ],

  relatedCalculators: [
    "sip-calculator",
    "fd-calculator",
    "loan-emi-calculator",
    "mortgage-calculator",
  ],
};

export default content;
