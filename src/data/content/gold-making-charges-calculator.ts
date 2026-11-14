import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The Gold Making Charges Calculator helps buyers in India understand, calculate, and compare making charges ('Ghadai') on gold jewellery. When buying hallmarked gold ornaments, the final bill includes the intrinsic gold value plus fabrication charges, potential wastage, and statutory 3% GST. This calculator allows you to convert between percentage, per-gram, and flat-fee making charge quotes, evaluate showroom discounts, and verify the exact tax impact before you make a purchase. Making charge terms vary widely by jeweller and design complexity, so always confirm exact billing line items with your jeweller.",

  howItWorks:
    "Enter the net gold weight in grams, the current gold rate for your purity (e.g. 22K or 18K), and the making charge format quoted by the showroom (percentage of gold value, fixed rupees per gram, or a flat lump sum). The calculator computes the raw gold value, the net making charges, applicable wastage, and the 3% GST (1.5% CGST + 1.5% SGST). It standardizes all pricing into equivalent per-gram and percentage metrics so you can easily compare offers between competing jewellers.",

  formula:
    "In India, standard retail gold jewellery billing follows the composite formula:\n\nTotal Bill = [ (Net Gold Weight × Purity Gold Rate) + Net Making Charges + Applicable Wastage − Discounts ] × 1.03 (3% GST)\n\nMaking Charge Formats:\n- Percentage Method: Making Charges = Raw Gold Value × (Making % ÷ 100)\n- Per-Gram Method: Making Charges = Net Gold Weight (g) × (₹ per gram)\n- Flat Fee Method: Making Charges = Lump-sum INR\n- Equivalent Percentage: (Net Making Charges ÷ Raw Gold Value) × 100\n- Making Charge Per Gram: Net Making Charges ÷ Net Gold Weight (g)",

  example:
    "Suppose you purchase a 10-gram 22K (916 hallmark) gold necklace. The 22K gold rate is ₹7,000 per gram, and the jeweller quotes an 8% making charge with zero wastage:\n\n1. Raw Gold Value: 10g × ₹7,000 = ₹70,000\n2. Making Charges (8%): ₹70,000 × 0.08 = ₹5,600 (Equivalent to ₹560 per gram)\n3. Pre-tax Subtotal: ₹70,000 + ₹5,600 = ₹75,600\n4. 3% GST: ₹75,600 × 0.03 = ₹2,268 (₹1,134 CGST + ₹1,134 SGST)\n\nTakeaway Result:\n- Total Jewellery Cost: ₹77,868\n- Effective Making Charge per gram: ₹560/g\n- Total GST Payable: ₹2,268",

  mistakes:
    "A frequent error among jewellery buyers is paying both high making charges (e.g., 12%) and a separate high wastage percentage (e.g., 6% to 8%). In modern manufacturing, casting loss is minimal; reputable jewellers generally bundle wastage into a single transparent making charge. Another mistake is assuming that percentage-based making charges stay constant; when spot gold rates rise, a percentage fee automatically increases your rupee labor cost even though craftsmanship did not change. Always insist on an unbundled bill with a mandatory 6-digit BIS Hallmarking Unique Identification (HUID).",

  faqs: [
    {
      question: "What is making charges in gold jewellery and how is it calculated?",
      answer:
        'Making charges (or "Ghadai") cover the craftsmanship, casting, cutting, and detailing required to transform raw gold into a finished ornament. Showrooms calculate making charges using three methods: a percentage of the raw gold value, a fixed rate per gram of net weight, or a flat fee per piece. For a full itemized invoice breakdown, use our <a href="/calculator/gold-jewellery-bill-calculator" class="text-primary hover:underline">Gold Jewellery Bill Calculator</a>.',
    },
    {
      question: "What is 916 hallmark gold and does it affect making charges?",
      answer:
        '916 hallmark gold is 22 Karat gold containing 91.6% pure gold alloyed with 8.4% metals like copper or zinc for durability. Under BIS standards, every hallmarked piece features the BIS triangle, 22K916 mark, and a unique 6-digit HUID. Because 22K is standard for Indian jewellery, making charges typically range from 6% to 14% for machine-made chains and 14% to 25% for handcrafted temple jewellery. You can verify purity ratios with our <a href="/calculator/gold-purity-karat-converter" class="text-primary hover:underline">Gold Purity & Karat Converter</a>.',
    },
    {
      question: "What is the difference between making charges and wastage in Indian jewellery?",
      answer:
        "Making charges represent the artisan labor and design cost, whereas wastage (historically called 'Kada') accounts for microscopic gold dust lost during polishing and filing. Modern computerized induction casting minimizes gold loss to under 1%. Most branded showrooms now bundle wastage into making charges. Be cautious if an invoice bills both high making charges (10%+) and separate high wastage (5%+).",
    },
    {
      question: "How does 3% GST apply to gold jewellery and making charges in India?",
      answer:
        'Under Central Board of Indirect Taxes and Customs (CBIC) rules, retail jewellery sales represent a single composite supply taxed at a uniform 3% GST (1.5% CGST + 1.5% SGST). GST is applied to the final pre-tax total (raw gold value plus making charges and wastage minus discounts). You do not pay a separate 5% or 18% service tax on making charges. Calculate general tax breakdowns with our <a href="/calculator/gst-calculator" class="text-primary hover:underline">GST Calculator</a>.',
    },
    {
      question: "Can I negotiate making charges with jewellers in India?",
      answer:
        "Yes, making charges represent the retail margin of a jewellery showroom and are often negotiable, particularly during festival seasons like Dhanteras, Diwali, or Akshaya Tritiya. You can often negotiate 15% to 30% discounts on making fees or ask the jeweller to match a per-gram rate from a competing hallmarked showroom. Remember to confirm final terms directly with your jeweller.",
    },
  ],

  authorityLinks: [
    {
      text: "Bureau of Indian Standards (BIS) Hallmarking Guidelines",
      url: "https://www.bis.gov.in/",
    },
    {
      text: "Central Board of Indirect Taxes and Customs (CBIC) GST Rates",
      url: "https://cbic-gst.gov.in/",
    },
  ],

  relatedCalculators: [
    "gold-jewellery-bill-calculator",
    "jewellery-budget-to-weight-calculator",
    "gold-purity-karat-converter",
    "old-gold-exchange-value-calculator",
  ],
};

export default content;
