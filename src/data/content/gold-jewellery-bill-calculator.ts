import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The Gold Jewellery Bill Calculator generates a complete, unbundled invoice estimate for purchasing gold jewellery in India. It calculates pure gold value, making charges, precious stone charges, hallmarking fees (₹45 + 18% GST), and statutory 3% GST, while accounting for old gold exchange credits.",

  howItWorks:
    "Enter the gross ornament weight, gemstone/bead weight, gold karat purity (24K, 22K, 18K, 14K), current spot rate, making charge terms, and any old gold exchange weight. The calculator computes the net gold weight, itemizes fabrication and hallmark charges, deducts exchange value, and calculates the final payable amount with 3% GST.",

  formula:
    "Indian Jewellery Billing Formula:\n\nNet Gold Weight = Gross Weight − Stone Weight\n\nGross Gold Value = Net Gold Weight × Purity Gold Rate per gram\n\nTaxable Subtotal = Gross Gold Value + Making Charges + Stone Value − Old Gold Credit\n\nFinal Bill = Taxable Subtotal × 1.03 (3% GST) + Mandatory BIS Hallmarking Fee (₹53.10)",

  example:
    "A 12g gross 22K gold ring with 1g synthetic stones (11g net gold) at ₹7,200/g with 10% making charges:\n- Gold Value: 11g × ₹7,200 = ₹79,200\n- Making Charges (10%): ₹7,920\n- Pre-tax Total: ₹87,120\n- 3% GST: ₹2,613.60\n- Final Bill: ₹89,733.60 (+ hallmarking fee)",

  mistakes:
    "The most critical jewellery purchasing mistake is allowing a jeweller to weigh stones at gold price. Always insist that stone weight is deducted from gross weight before multiplying by gold rate.",

  faqs: [
    {
      question: "How do jewellers calculate making charges on the bill?",
      answer:
        'Making charges can be billed as a percentage of raw gold value, a fixed fee per gram, or a flat amount. To compare different jewellers\' making charges and negotiate fair labor rates, use our <a href="/calculator/gold-making-charges-calculator" class="text-primary hover:underline">Gold Making Charges Calculator</a>.',
    },
    {
      question: "How do I exchange my old gold jewellery toward a new purchase?",
      answer:
        'When exchanging old jewellery, jewellers test the karat purity, melt the ornament, and deduct a refining fee (typically 1% to 3%). You can calculate your fair exchange credit and purity melt value before visiting the showroom using our <a href="/calculator/old-gold-exchange-value-calculator" class="text-primary hover:underline">Old Gold Exchange Value Calculator</a>.',
    },
    {
      question: "How can I figure out how much gold weight I can buy within my budget?",
      answer:
        'If you have a fixed budget (e.g. ₹1,00,000) and want to know how many grams of 22K or 18K jewellery you can afford after making charges and 3% GST, try our <a href="/calculator/jewellery-budget-to-weight-calculator" class="text-primary hover:underline">Jewellery Budget to Weight Calculator</a>.',
    },
    {
      question: "How is karat purity converted between 24K, 22K, and 18K?",
      answer:
        '24K is 99.9% pure, 22K (916) contains 91.6% gold, and 18K contains 75.0% gold. To verify exact purity percentages and calculate price per gram across karats, use our <a href="/calculator/gold-purity-karat-converter" class="text-primary hover:underline">Gold Purity & Karat Converter</a>.',
    },
  ],

  authorityLinks: [
    {
      text: "Bureau of Indian Standards (BIS) Gold Hallmarking Portal",
      url: "https://www.bis.gov.in/",
    },
  ],

  relatedCalculators: [
    "gold-making-charges-calculator",
    "old-gold-exchange-value-calculator",
    "jewellery-budget-to-weight-calculator",
    "gold-purity-karat-converter",
  ],
};

export default content;
