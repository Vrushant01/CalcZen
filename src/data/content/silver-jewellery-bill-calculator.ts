import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The Silver Jewellery Bill Calculator calculates the complete purchase invoice for silver articles, utensils, payals, and 925 sterling silver jewellery in India. It accounts for net silver weight, silver purity grade, per-gram or percentage making charges, and 3% GST.",

  howItWorks:
    "Enter the gross silver weight in grams, deduct any stones or enamel, choose the silver fineness (999 pure silver, 925 sterling silver, or 800/850 traditional silver), and enter the current spot silver rate per kilogram or gram. The calculator computes silver metal cost, craftsmanship charges, and 3% GST.",

  formula:
    "Silver Jewellery Billing Formula:\n\nNet Silver Weight = Gross Weight − Non-Silver Additions\n\nSilver Base Value = Net Silver Weight (g) × (Silver Spot Rate per kg ÷ 1,000) × (Fineness ÷ 100)\n\nTaxable Amount = Silver Base Value + Making Charges\n\nFinal Bill = Taxable Amount × 1.03 (3% GST)",

  example:
    "Purchasing a 50g 925 sterling silver anklet (payal) with silver rate at ₹90,000/kg (₹90/g) and making charges at ₹15 per gram:\n- Silver Base Value: 50g × ₹90 × 0.925 = ₹4,162.50\n- Making Charges: 50g × ₹15 = ₹750.00\n- Pre-tax Total: ₹4,912.50\n- 3% GST: ₹147.38\n- Final Bill: ₹5,059.88",

  mistakes:
    "Buying traditional silver jewellery without checking the hallmarking stamp is a common pitfall; unhallmarked silver can contain as little as 60% to 70% silver purity while being sold at 92.5% sterling prices.",

  faqs: [
    {
      question: "How does silver jewellery billing compare to gold jewellery billing?",
      answer:
        'Both gold and silver jewellery are taxed at the same statutory 3% GST in India under CBIC guidelines. However, silver carries higher percentage making charges relative to metal cost because silver is far less expensive per gram than gold. To compare gold invoice structures, use our <a href="/calculator/gold-jewellery-bill-calculator" class="text-primary hover:underline">Gold Jewellery Bill Calculator</a>.',
    },
    {
      question: "How do I calculate silver exchange value when selling old utensils?",
      answer:
        'Old silver articles are valued by testing the silver fineness (e.g. 80% to 92.5%) and deducting melting loss. To evaluate gold exchange credits and scrap values, explore our <a href="/calculator/old-gold-exchange-value-calculator" class="text-primary hover:underline">Old Gold Exchange Value Calculator</a>.',
    },
    {
      question: "What is 925 silver?",
      answer:
        '925 silver (sterling silver) contains 92.5% pure silver and 7.5% alloy metals, usually copper, to provide strength and prevent bending. Pure 999 silver is too soft for functional jewellery. For gold purity equivalents, check our <a href="/calculator/gold-purity-karat-converter" class="text-primary hover:underline">Gold Purity & Karat Converter</a>.',
    },
  ],

  authorityLinks: [
    {
      text: "Bureau of Indian Standards (BIS) Silver Hallmarking Portal",
      url: "https://www.bis.gov.in/",
    },
  ],

  relatedCalculators: [
    "gold-jewellery-bill-calculator",
    "old-gold-exchange-value-calculator",
    "diamond-jewellery-price-calculator",
    "jewellery-budget-to-weight-calculator",
  ],
};

export default content;
