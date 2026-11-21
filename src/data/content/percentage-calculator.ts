import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The percentage calculator provides an intuitive, high-precision mathematical suite for solving essential ratio, proportion, and percentage problems. Ideal for retail shoppers, e-commerce sellers, accounting professionals, school and university students, and stock market investors, it solves the three foundational percentage equations: finding a given percentage of an amount, determining what percentage one value is of another, and calculating the exact percentage increase or decrease between two numbers. It eliminates manual mental math mistakes across commercial discounts, tax computations, markups, test scores, and financial returns.",

  howItWorks:
    "The calculator features three dedicated calculation modes tailored to specific real-world tasks:\n\n1. Mode 1 - Percentage of a Value (What is P% of X?): Enter the percentage rate P and the base quantity X. Use this to determine discounts, tip shares, interest accruals, or sales tax.\n2. Mode 2 - Percentage Representation (Y is what % of X?): Enter the observed part Y and the whole base value X. Use this to find exam score percentages, profit-to-revenue ratios, or completion progress.\n3. Mode 3 - Percentage Change (From X to Y): Enter the initial starting value X and the new final value Y. Use this to track portfolio performance, commodity price surges, inflation shifts, or business revenue growth.\n\nClick Calculate in any mode to instantly view the calculated answer, mathematical working, and unit ratio.",

  formula:
    "The calculator executes standardized arithmetic percentage formulas:\n\n1. Percentage of a Number:\nResult = (P × X) / 100\nwhere P is the percentage rate and X is the base amount.\n\n2. Value as a Percentage of Base:\nPercentage (%) = (Y / X) × 100\nwhere Y is the component part and X is the total reference whole (X ≠ 0).\n\n3. Percentage Increase or Decrease:\nPercentage Change (%) = ((Y − X) / |X|) × 100\n- If Y > X, the change is positive, representing a percentage increase.\n- If Y < X, the change is negative, representing a percentage discount or reduction.\n\nPercentage Point vs Percentage Change Rule:\nWhen comparing two percentages directly (e.g. interest rate rising from 6% to 8%), the change is 2 percentage points, but a 33.33% relative percentage increase: ((8 − 6) / 6) × 100 = 33.33%.",

  example:
    "Mode 1 Example (Retail Discount):\nDetermine a 15% promotional discount on a garment tagged at ₹200:\n- Result = (15 × 200) / 100 = ₹30 discount\n- Final checkout price = ₹200 − ₹30 = ₹170\n\nMode 2 Example (Exam Score):\nA student scores 50 marks out of a total maximum of 80 marks in an academic evaluation:\n- Percentage = (50 / 80) × 100 = 0.625 × 100 = 62.50%\n\nMode 3 Example (Price Inflation):\nThe price of a construction raw material rises from an initial ₹100 per unit to a revised ₹125 per unit:\n- Absolute Change = ₹125 − ₹100 = +₹25\n- Percentage Change = (25 / 100) × 100 = +25.00% price increase.",

  mistakes:
    "1. Confusing percentage points with percentage change: If an interest rate climbs from 5% to 6%, it increased by 1 percentage point, but by 20% in relative terms ((6 − 5)/5 × 100 = 20%).\n2. Applying sequential percentages additively: Applying a 20% discount followed by a 10% coupon does not equal 30% off; the actual combined reduction is 28% because the second discount applies to the already discounted subtotal.\n3. Reversing the base in percentage changes: When calculating growth from 80 to 100, the divisor must be the baseline 80, yielding +25%, not the terminal 100.\n4. Mistaking profit margin for markup: A 50% markup on cost ($100 cost sold for $150) yields a 33.33% profit margin on selling price, not a 50% margin.\n5. Dividing by zero: Entering zero as the baseline denominator generates an undefined mathematical error.",

  faqs: [
    {
      question: "How do I calculate a percentage without a calculator?",
      answer:
        "To find 10% of any number quickly, shift the decimal point one position to the left (e.g. 10% of 450 is 45). To find 5%, take half of the 10% figure (22.5). To find 1%, shift the decimal two places left (4.5). You can then combine these mental building blocks to calculate any percentage rapidly.",
    },
    {
      question: "What is the difference between markup and margin?",
      answer:
        "Markup is the percentage added to the cost price to determine the selling price: (Profit / Cost) × 100. Profit Margin is the percentage of the selling price that is profit: (Profit / Selling Price) × 100. Markup will always be numerically higher than the corresponding profit margin for profitable sales.",
    },
    {
      question: "Can a percentage increase exceed 100%?",
      answer:
        "Yes, whenever a final value is more than double its original starting baseline, the percentage increase exceeds 100%. For example, an investment growing from ₹10,000 to ₹30,000 experienced an increase of ((30000 − 10000) / 10000) × 100 = +200%.",
    },
    {
      question: "How do I calculate percentage decrease or discount?",
      answer:
        "Subtract the discounted sale price from the original sticker price to find the absolute savings. Divide that difference by the original price and multiply by 100. For example, an item reduced from ₹500 to ₹400 gives: ((500 − 400) / 500) × 100 = 20% discount.",
    },
    {
      question: "Why does reversing a percentage increase not return the original number?",
      answer:
        "Because the base changes. If ₹100 increases by 25%, it becomes ₹125. If ₹125 decreases by 25%, the 25% reduction is calculated on the larger ₹125 base (₹31.25), resulting in ₹93.75, not the original ₹100.",
    },
  ],

  authorityLinks: [
    { text: "National Council of Educational Research and Training (NCERT) - Mathematics", url: "https://ncert.nic.in/" },
    { text: "Reserve Bank of India (RBI) - Financial Literacy", url: "https://www.rbi.org.in/" },
  ],

  relatedCalculators: ["gst-calculator", "product-profit-calculator", "tip-calculator", "standard-calculator"],
  lastReviewed: "2026-11-21",
};

export default content;
