import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The Gold Purity & Karat Converter converts gold purity across karats (24K, 22K, 18K, 14K, 10K), fineness parts per thousand (999, 916, 750, 585, 417), and percentage purity. It also calculates accurate per-gram gold rates based on current 24K benchmark market rates in India.",

  howItWorks:
    "Select or enter the karat rating or millesimal fineness of your ornament, along with the current market rate for 24 Karat gold. The converter calculates the exact proportion of fine pure gold, alloy content, and the equivalent fair price per gram for that karat purity.",

  formula:
    "Purity Conversion Formulas:\n\nPurity Percentage (%) = (Karat / 24) × 100\n\nMillesimal Fineness (Parts per Thousand) = (Karat / 24) × 1000\n\nKarat Price per Gram = 24K Market Price per Gram × (Karat / 24)",

  example:
    "If 24K gold is ₹7,500 per gram:\n- 22K (916 Hallmarked): (22 / 24) × ₹7,500 = ₹6,875 per gram (91.67% pure)\n- 18K (750 Hallmarked): (18 / 24) × ₹7,500 = ₹5,625 per gram (75.00% pure)\n- 14K (585 Hallmarked): (14 / 24) × ₹7,500 = ₹4,375 per gram (58.33% pure)",

  mistakes:
    "Assuming that 22K jewellery should cost the same per gram as 24K bullion. In retail stores, jewellery is made of 22K or 18K gold because 24K is too soft for crafting durable ornaments.",

  faqs: [
    {
      question: "What does BIS 916 hallmarking on gold jewellery mean?",
      answer:
        'BIS 916 indicates 22 Karat gold having 91.6% purity (916 parts per thousand pure gold and 84 parts alloy metals like copper and silver). To calculate how making charges and GST are added to 916 jewellery, use our <a href="/calculator/gold-making-charges-calculator" class="text-primary hover:underline">Gold Making Charges Calculator</a>.',
    },
    {
      question: "How do I calculate the full billing cost for a gold ornament?",
      answer:
        'To see the itemized breakdown of pure gold value, stone deductions, making charges, and 3% GST on a jewellery purchase, check our <a href="/calculator/gold-jewellery-bill-calculator" class="text-primary hover:underline">Gold Jewellery Bill Calculator</a>.',
    },
    {
      question: "What value do I get when exchanging old gold ornaments of different karats?",
      answer:
        'Jewellers test old gold for purity (such as 18K, 20K, or 22K) and deduct nominal melting loss before crediting the exchange value. You can estimate your net cash or exchange credit using our <a href="/calculator/old-gold-exchange-value-calculator" class="text-primary hover:underline">Old Gold Exchange Value Calculator</a>.',
    },
    {
      question: "How does gold purity affect diamond and studded jewellery prices?",
      answer:
        'Diamond jewellery is typically crafted in 18K or 14K gold to ensure hardness and prevent gemstones from dislodging. To calculate the combined cost of diamond carats, metal purity, and certification charges, visit our <a href="/calculator/diamond-jewellery-price-calculator" class="text-primary hover:underline">Diamond Jewellery Price Calculator</a>.',
    },
  ],

  authorityLinks: [
    {
      text: "Bureau of Indian Standards (BIS) Hallmarking Guidelines",
      url: "https://www.bis.gov.in/",
    },
    {
      text: "World Gold Council – Gold Purity Standards",
      url: "https://www.gold.org/",
    },
  ],

  relatedCalculators: [
    "gold-making-charges-calculator",
    "gold-jewellery-bill-calculator",
    "old-gold-exchange-value-calculator",
    "diamond-jewellery-price-calculator",
  ],
};

export default content;
