import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The Diamond Jewellery Price Calculator estimates the retail price of diamond rings, necklaces, and earrings in India. It calculates gold mount value, diamond carat pricing based on the 4Cs (Cut, Color, Clarity, Carat), micro-setting making charges, certification fees (IGI/GIA), and 3% GST.",

  howItWorks:
    "Enter the gold mount weight in grams and gold purity (typically 18K or 14K for diamond jewellery), the total diamond weight in carats, and the diamond quality grade (e.g. VVS-EF, VS-GH, SI-IJ). The calculator calculates the precious metal cost, adds certified diamond values and specialized craftsmanship charges, and applies 3% GST.",

  formula:
    "Diamond Jewellery Pricing Equation:\n\nGold Mount Cost = Mount Weight (g) × Purity Gold Rate per gram\n\nDiamond Cost = Total Carat Weight (cts) × Diamond Rate per Carat\n\nFinal Price = [ Gold Mount Cost + Diamond Cost + Setting Charges + IGI/GIA Certification ] × 1.03 (3% GST)",

  example:
    "An 18K gold solitaire ring with 3.5g gold mount at ₹5,500/g and a 0.50 ct VS-GH diamond at ₹75,000/ct, with ₹3,500 making charge:\n- Gold Mount Cost: 3.5g × ₹5,500 = ₹19,250\n- Diamond Value: 0.50 ct × ₹75,000 = ₹37,500\n- Making & Certification: ₹3,500\n- Pre-tax Total: ₹60,250\n- 3% GST: ₹1,807.50\n- Final Bill: ₹62,057.50",

  mistakes:
    "Buying diamond jewellery without an independent laboratory certificate (GIA or IGI) is a major risk, as synthetic lab-grown diamonds or low-clarity treated stones can be misrepresented as natural fine diamonds.",

  faqs: [
    {
      question: "Why is 18K or 14K gold preferred for diamond jewellery over 22K?",
      answer:
        '22K gold is too soft to securely hold diamond prongs over time, leading to loose or lost stones. 18K gold (75% purity) and 14K gold (58.5% purity) are alloyed with stronger metals to provide the structural rigidity required for micro-prong settings. You can verify karat compositions using our <a href="/calculator/gold-purity-karat-converter" class="text-primary hover:underline">Gold Purity & Karat Converter</a>.',
    },
    {
      question: "How do diamond jewellery making charges compare to plain gold?",
      answer:
        'Diamond jewellery requires precision microscope diamond setting, laser soldering, and rhodium plating, resulting in higher making charges (typically ₹800 to ₹1,800 per gram or 15% to 30%). To compare plain gold making charges, check our <a href="/calculator/gold-making-charges-calculator" class="text-primary hover:underline">Gold Making Charges Calculator</a>.',
    },
    {
      question: "How do I calculate silver or plain gold jewellery prices?",
      answer:
        'For silver ornaments and utensils, see our <a href="/calculator/silver-jewellery-bill-calculator" class="text-primary hover:underline">Silver Jewellery Bill Calculator</a>, or calculate full gold purchase invoices with the <a href="/calculator/gold-jewellery-bill-calculator" class="text-primary hover:underline">Gold Jewellery Bill Calculator</a>.',
    },
  ],

  authorityLinks: [
    {
      text: "Gemological Institute of America (GIA) 4Cs Diamond Quality Standards",
      url: "https://www.gia.edu/",
    },
  ],

  relatedCalculators: [
    "gold-jewellery-bill-calculator",
    "silver-jewellery-bill-calculator",
    "gold-making-charges-calculator",
    "gold-purity-karat-converter",
  ],
};

export default content;
