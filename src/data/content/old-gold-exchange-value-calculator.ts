import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The Old Gold Exchange Value Calculator estimates the fair scrap and resale value of used or heirloom gold jewellery in India. It accounts for gross vs net weight, carat fineness, melting loss, and standard jeweller refining deductions so you never undersell your precious metals.",

  howItWorks:
    "Enter the weight of your old jewellery, its karat purity (e.g. 22K, 18K, or non-hallmarked gold), and current 24K spot market rate. The calculator determines pure gold content, applies typical market melting deductions (0% to 3%), and outputs the exact cash resale value or new jewellery exchange credit.",

  formula:
    "Old Gold Resale Valuation Formula:\n\nPure Gold Weight (g) = Net Weight (g) × (Karat Purity ÷ 24)\n\nIntrinsic Gold Value = Pure Gold Weight × 24K Spot Rate per gram\n\nFinal Resale / Exchange Value = Intrinsic Gold Value × (1 − Melting Deduction %)",

  example:
    "Exchanging a 15-gram 22K old gold necklace when 24K gold is ₹7,500/g with a 2% melting deduction:\n- Purity: 22 / 24 = 91.67% (0.9167)\n- Pure Gold Content: 15g × 0.9167 = 13.75g\n- Intrinsic Value: 13.75g × ₹7,500 = ₹1,03,125\n- Net Exchange Credit (after 2% deduction): ₹1,03,125 × 0.98 = ₹1,01,062.50",

  mistakes:
    "Selling old jewellery without removing lac, wax, enamel, or synthetic stones allows dealers to deduct excess weight. Always demand an XRF purity test at a certified hallmarking centre before agreeing to scrap prices.",

  faqs: [
    {
      question: "How do jewellers value old gold compared to new jewellery purchases?",
      answer:
        'When you exchange old gold for new jewellery, the old gold is credited at full market scrap value without making charges or previous taxes. You then pay making charges and 3% GST on the new ornament. To simulate the entire invoice including exchange credit, use our <a href="/calculator/gold-jewellery-bill-calculator" class="text-primary hover:underline">Gold Jewellery Bill Calculator</a>.',
    },
    {
      question: "Should I pledge my gold for a loan instead of selling it?",
      answer:
        'If you need short-term funds and want to retain your heirloom jewellery, a gold loan allows you to borrow up to 75% of your gold value (LTV) while retaining ownership. To calculate maximum loan eligibility, interest rates, and EMI payments, explore our <a href="/calculator/gold-loan-against-jewellery-calculator" class="text-primary hover:underline">Gold Loan Against Jewellery Calculator</a>.',
    },
    {
      question: "How do I check the exact karat purity of unhallmarked gold?",
      answer:
        'Unhallmarked gold often carries lower purity than stamped. To convert karats into fineness percentages and calculate price differences between 22K, 20K, and 18K, use our <a href="/calculator/gold-purity-karat-converter" class="text-primary hover:underline">Gold Purity & Karat Converter</a>.',
    },
  ],

  authorityLinks: [
    {
      text: "World Gold Council Retail Gold Guidelines",
      url: "https://www.gold.org/",
    },
  ],

  relatedCalculators: [
    "gold-jewellery-bill-calculator",
    "gold-loan-against-jewellery-calculator",
    "gold-purity-karat-converter",
    "silver-jewellery-bill-calculator",
  ],
};

export default content;
