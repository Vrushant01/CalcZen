import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The job offer comparison calculator provides a multi-factor financial decision model for evaluating competing employment offers. When changing jobs, comparing top-line Cost to Company (CTC) figures alone is often deeply misleading. A high CTC offer may consist predominantly of high-risk variable bonuses, illiquid startup equity with four-year vesting cliffs, or require exhausting daily commutes that erode your real hourly wage. This calculator benchmarks guaranteed fixed cash, risk-adjusted performance bonuses, equity valuations, healthcare benefits, and commute costs side-by-side to uncover your true real take-home compensation.",

  howItWorks:
    "To compare two or three employment offers side by side, configure the offer profiles:\n\n1. Base Fixed Salary: Enter guaranteed annual fixed salary and allowances for Offer A and Offer B.\n2. Variable Performance Bonus: Specify the target annual incentive or performance bonus, and select a realistic payout scenario (Worst Case 0%, Expected Case 50%–80%, Best Case 100%).\n3. Equity & ESOPs: Input the annual vested value of Employee Stock Options (ESOPs) or Restricted Stock Units (RSUs), and choose whether to value them nominally or risk-adjusted based on private company illiquidity.\n4. Daily Commute & Location: Enter expected monthly travel expenses, daily commuting hours, and work-from-home flexibility to factor in transit deductions.\n5. Additional Benefits: Factor in employer-provided health insurance coverage, retirement provident fund matches, and joining bonuses.\n\nClick Calculate to compare guaranteed cash security, total compensation projections, and net monthly real take-home earnings.",

  formula:
    "The calculator decomposes compensation into risk-adjusted financial tiers:\n\n1. Guaranteed Cash Annual:\nGuaranteed Cash = Annual Fixed Base Salary + Guaranteed Retainers and Allowances\n\n2. Risk-Adjusted Total Compensation:\nTotal Comp = Guaranteed Cash + (Variable Bonus × Probability Payout Factor) + (Equity Vesting × Liquidity Haircut Factor) + Corporate Benefits\n- Payout Scenarios: Worst (0%), Expected (50% to 80%), Best (100%)\n- Private Startup Equity Haircut: Unlisted private startup ESOPs are discounted by 50% to 80% to reflect illiquidity and venture failure risk; public multinational RSUs are valued at nominal market pricing.\n\n3. Real Take-Home Net Compensation:\nReal Take-Home = Net Salary (after statutory tax and PF) − Annual Commute Costs − Relocation Rent Differentials\n\nEffective Hourly Wage = Real Annual Take-Home / [Total Annual Working Hours + (Daily Commute Hours × 240 Working Days)]",

  example:
    "Consider a software professional comparing two attractive employment offers in India:\n\nOffer A (Established Enterprise - Hybrid):\n- Guaranteed Fixed Base: ₹15,00,000\n- Performance Variable: ₹2,00,000 (Historical 80% payout = ₹1,60,000)\n- Guaranteed Cash: ₹15,00,000\n- Expected Total Comp: ₹16,60,000\n- Commute: 2 days/week in office (Commute cost: ₹30,000/year)\n\nOffer B (High-Growth Startup - 5 Days In-Office):\n- Guaranteed Fixed Base: ₹13,00,000\n- Performance Variable: ₹5,00,000 (Aggressive target, historical 50% payout = ₹2,50,000)\n- Nominal Headline CTC: ₹18,00,000\n- Guaranteed Cash: ₹13,00,000\n- Expected Total Comp: ₹15,50,000\n- Commute: 5 days/week in office (Commute cost: ₹80,000/year)\n\nStrategic Comparison:\nAlthough Offer B advertises a higher top-line headline CTC of ₹18 Lakhs compared to Offer A's ₹17 Lakhs, Offer A provides ₹2,00,000 more in guaranteed, unshakeable fixed cash, ₹1,10,000 higher expected take-home after realistic bonus realization, and saves ₹50,000 in commute costs. Offer A is clearly the superior financial and lifestyle choice.",

  mistakes:
    "1. Equating top-line CTC with bank account take-home: Believing an ₹18 Lakh CTC with ₹5 Lakhs in variable bonus is superior to a clean ₹15 Lakh fixed base offer leads to severe cash flow disappointment.\n2. Valuing unlisted startup ESOPs at full seed/Series A pitch-deck valuation: Over 90% of early-stage startups fail to achieve an IPO or secondary buyout; treating illiquid stock options as guaranteed cash is dangerous.\n3. Ignoring daily commute time and fuel expenses: Spending 2.5 hours daily in traffic costs over 600 hours of personal life annually and adds significant fuel, cab, and vehicle wear-and-tear costs.\n4. Forgetting equity vesting cliffs: Most employee stock plans feature a mandatory 1-year cliff before any shares vest; leaving a company at 11 months forfeits 100% of your equity grant.\n5. Overlooking health insurance and family coverage: Losing employer-subsidized parental health insurance coverage can force you to spend ₹40,000 to ₹70,000 out-of-pocket annually on private medical policies.",

  faqs: [
    {
      question: "What is the difference between RSUs and ESOPs?",
      answer:
        "RSUs (Restricted Stock Units) are actual company shares granted to you that vest over time without requiring you to buy them, common in public tech companies. ESOPs (Employee Stock Option Plans) are options giving you the legal right to purchase shares at a predetermined exercise price, common in private startups.",
    },
    {
      question: "How should I evaluate joining bonuses?",
      answer:
        "Joining bonuses provide immediate liquidity, but remember they are taxed at your marginal income tax slab in month one and almost universally include a 12-month or 24-month clawback clause requiring full repayment if you resign early.",
    },
    {
      question: "What is an ESOP vesting cliff?",
      answer:
        "A vesting cliff is a minimum employment duration (standardly 12 months) before any portion of your stock grant vests. For a 4-year grant with a 1-year cliff, 25% vests at the 12-month mark, and the remaining 75% vests monthly or quarterly over the subsequent 36 months.",
    },
    {
      question: "How do I calculate the financial value of working remotely?",
      answer:
        "Calculate your direct annual savings on fuel, transit, work wardrobe, and outside dining, and add the value of your saved commute hours evaluated at your hourly wage. For many professionals, full remote flexibility is equivalent to an 8% to 15% salary premium.",
    },
    {
      question: "Can I negotiate fixed base salary versus variable bonus?",
      answer:
        "Yes, candidates with competing offers can strategically request hiring managers to shift a portion of aggressive variable pay into guaranteed fixed base salary to ensure predictable monthly cash flow.",
    },
  ],

  authorityLinks: [
    { text: "Ministry of Labour & Employment", url: "https://labour.gov.in/" },
    { text: "Income Tax Department of India - Salary Tax Slabs", url: "https://www.incometax.gov.in/" },
  ],

  relatedCalculators: ["ctc-to-in-hand-salary-calculator", "product-profit-calculator", "loan-eligibility-calculator"],
  lastReviewed: "2026-11-21",
};

export default content;
