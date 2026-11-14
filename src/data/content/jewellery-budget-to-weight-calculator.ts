import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The Jewellery Budget to Weight Calculator reverse-engineers the maximum gold or diamond jewellery weight you can purchase for a fixed rupee budget in India. It factors in spot gold rates, purity karats (24K, 22K, 18K), making charges (percentage, per-gram, or flat), and mandatory 3% GST.",

  howItWorks:
    "Enter your target financial budget (e.g., ₹50,000 or ₹2,00,000), current 24K gold rate, desired karat purity (22K or 18K), and expected making charge structure. The calculator applies reverse algebraic formulas to strip 3% GST and craftsmanship fees, deducing the exact maximum gold weight in grams you can afford.",

  formula:
    "Reverse Budget Calculation:\n\nPre-Tax Budget = Total Rupee Budget ÷ 1.03 (Subtract 3% GST)\n\nFor Percentage Making Charges (M%):\nMax Gold Weight (g) = Pre-Tax Budget ÷ [ Purity Gold Rate per gram × (1 + M/100) ]\n\nFor Per-Gram Making Charges (₹/g):\nMax Gold Weight (g) = Pre-Tax Budget ÷ ( Purity Gold Rate per gram + Making Charge per gram )",

  example:
    "With a budget of ₹1,00,000 for 22K gold jewellery (22K rate = ₹7,000/g) with 10% making charges:\n- Pre-Tax Budget: ₹1,00,000 ÷ 1.03 = ₹97,087.38\n- Effective Cost Per Gram: ₹7,000 × 1.10 = ₹7,700/g\n- Affordable Gold Weight: ₹97,087.38 ÷ ₹7,700 ≈ 12.61 grams",

  mistakes:
    "A frequent shopping error is shopping with a gross budget without leaving room for 3% GST and making charges, leading to awkward compromises at the checkout counter.",

  faqs: [
    {
      question: "How do making charges affect the amount of gold I can buy for my budget?",
      answer:
        'Higher making charges directly reduce the physical gold weight you take home. For instance, on a ₹1,00,000 budget, reducing making charges from 16% to 8% lets you buy nearly one additional gram of pure gold. To compare showroom offers and per-gram equivalents, use our <a href="/calculator/gold-making-charges-calculator" class="text-primary hover:underline">Gold Making Charges Calculator</a>.',
    },
    {
      question: "How do I calculate the full itemized invoice once I pick a design?",
      answer:
        'Once you know your affordable weight, you can itemize stones, hallmarking fees, and making charges using our <a href="/calculator/gold-jewellery-bill-calculator" class="text-primary hover:underline">Gold Jewellery Bill Calculator</a>.',
    },
    {
      question: "How much more gold weight can I get if I choose 18K instead of 22K?",
      answer:
        'Because 18K contains 75% gold compared to 22K\'s 91.6%, the gold rate per gram is roughly 18% lower, allowing you to purchase 18% to 22% more metal volume for the same budget. To verify exact price per gram differences, check our <a href="/calculator/gold-purity-karat-converter" class="text-primary hover:underline">Gold Purity & Karat Converter</a>.',
    },
  ],

  authorityLinks: [
    {
      text: "India Bullion and Jewellers Association (IBJA) Daily Gold Rates",
      url: "https://ibja.co/",
    },
  ],

  relatedCalculators: [
    "gold-making-charges-calculator",
    "gold-jewellery-bill-calculator",
    "gold-purity-karat-converter",
    "silver-jewellery-bill-calculator",
  ],
};

export default content;
