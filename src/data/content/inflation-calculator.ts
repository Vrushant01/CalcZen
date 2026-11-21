import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The inflation calculator measures the erosion of purchasing power over time and projects the future cost of goods, living expenses, higher education, and healthcare. Designed for financial planners, retirees, salaried savers, and families in India, it models how consistent annual inflation compounds over 1 to 50 years. By visualizing how much future money is required to equal today's purchasing power—and conversely, how much today's savings will dwindle in real terms if left in low-yielding accounts—it provides the mathematical urgency needed for inflation-beating asset allocation.",

  howItWorks:
    "Calculating inflation-adjusted values takes just three simple inputs:\n\n1. Amount (₹): Enter the starting capital, current annual living budget, or college tuition fee in Indian Rupees (e.g. ₹1,00,000).\n2. Annual Inflation Rate (%): Input the projected average annual inflation rate (historical Consumer Price Index in India typically averages 5% to 7% for general living, and 8% to 12% for healthcare and higher education).\n3. Time Horizon: Select or enter the number of years into the future (e.g. 5, 10, 20, or 30 years).\n\nClick Calculate to receive the future cost required to match your current lifestyle, along with the depreciated real purchasing power of your baseline money over that horizon.",

  formula:
    "The calculator utilizes the standard compound interest inflation model:\n\n1. Future Cost of Goods and Services (FV):\nFV = PV × (1 + r)^n\nwhere:\n- PV = Present Value (current cost today)\n- r = Annual inflation rate expressed as a decimal (e.g., 6% = 0.06)\n- n = Time horizon in years\n\n2. Depreciated Purchasing Power of Today's Currency (Real Value):\nReal Purchasing Power = PV ÷ (1 + r)^n\nThis represents how much goods today's cash amount will be able to buy after n years of compounding inflation.\n\n3. Rule of 72 (Doubling Time Approximation):\nYears to Double in Cost ≈ 72 / Inflation Rate (%)\nAt a 6% annual inflation rate, everyday living expenses double roughly every 72 / 6 = 12 years.",

  example:
    "Consider an Indian family planning future living expenses with an initial baseline of ₹1,00,000 at an average 6.0% annual inflation rate over a 10-year period:\n- Present Value (PV): ₹1,00,000\n- Inflation Rate (r): 6.0% p.a. (0.06)\n- Time Horizon (n): 10 years\n\nMathematical Evaluation:\n- Compounding Factor = (1 + 0.06)^10 = (1.06)^10 ≈ 1.790847\n- Future Cost = ₹1,00,000 × 1.790847 = ₹1,79,085\n- Real Purchasing Power = ₹1,00,000 / 1.790847 = ₹55,839\n\nInterpretation:\nIn 10 years, you will need ₹1,79,085 to purchase the exact same basket of household groceries that costs ₹1,00,000 today. Conversely, if you leave ₹1,00,000 in physical cash or a 0% checking account, its real purchasing power will have collapsed by 44.16% to just ₹55,839.",

  mistakes:
    "1. Assuming headline CPI reflects personal lifestyle inflation: General CPI includes subsidized food and rural staples; urban families with children in private schools and private healthcare often face personal inflation rates of 8% to 10%.\n2. Leaving emergency savings in fixed deposits below inflation: Earning 6.5% interest on an FD that is taxed at your 30% income slab yields a net return of ~4.55%, resulting in guaranteed negative real wealth after 6% inflation.\n3. Overlooking education and medical inflation in retirement plans: Assuming a flat 5% inflation across a 30-year retirement understates elderly hospital and care expenditures by hundreds of thousands of rupees.\n4. Forgetting the Rule of 72: Failing to recognize that a seemingly modest 7% inflation rate doubles living expenses every decade.\n5. Delaying equity investments out of volatility fear: Equities are volatile in the short term, but broad market index funds remain the most accessible asset class with proven long-term positive real returns beating inflation.",

  faqs: [
    {
      question: "What is the difference between headline CPI and Core Inflation in India?",
      answer:
        "Headline Consumer Price Index (CPI) measures the total inflation in an economy, including volatile food and fuel prices. Core Inflation excludes food and fuel to measure the underlying long-term price trend in manufactured goods and services.",
    },
    {
      question: "What is the Reserve Bank of India's official inflation target?",
      answer:
        "Under the Flexible Inflation Targeting framework, the RBI Monetary Policy Committee is mandated to maintain headline CPI inflation at 4.0% with an allowable tolerance band of +/- 2% (ranging between 2.0% and 6.0%).",
    },
    {
      question: "How can individual investors protect their wealth from inflation?",
      answer:
        "To beat inflation, investors allocate capital to asset classes that generate real positive returns: equity mutual funds (index funds and diversified equities), sovereign gold bonds (SGBs / gold), commercial and residential real estate, and inflation-indexed or floating-rate debt instruments.",
    },
    {
      question: "What is shrinkflation?",
      answer:
        "Shrinkflation is a form of hidden inflation where manufacturers reduce the size, weight, or quantity of a packaged product while keeping the retail sticker price identical, effectively increasing the per-unit cost to the consumer.",
    },
    {
      question: "Why does compounding make inflation so destructive over long periods?",
      answer:
        "Like compound interest in reverse, each year's price increase builds on the accumulated price increases of previous years. A 7% inflation rate doesn't just increase prices by 70% over 10 years; due to geometric compounding, prices actually surge by 96.7%.",
    },
  ],

  authorityLinks: [
    { text: "Reserve Bank of India (RBI) - Monetary Policy & Inflation Targets", url: "https://www.rbi.org.in/" },
    { text: "Ministry of Statistics and Programme Implementation (MOSPI) - CPI Releases", url: "https://mospi.gov.in/" },
  ],

  relatedCalculators: ["compound-interest-calculator", "retirement-calculator", "sip-calculator", "401k-calculator"],
  lastReviewed: "2026-11-21",
};

export default content;
