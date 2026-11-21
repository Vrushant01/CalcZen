export const goldValueCalculatorContent = {
  h1: "Gold Value Calculator",
  intro:
    "Convert your gold weight into exact rupees based on today's live bullion market rates with our Gold Value Calculator. Choose 24K, 22K, or 18K purity, enter weight in grams, tolas, or ounces, add making charges and statutory 3% GST, and verify your jewellery's authentic worth instantly.",
  howToUseSteps: [
    "Select your measurement unit: grams, 10 grams, Indian tolas (11.66g), or troy ounces (31.10g).",
    "Enter the net gold weight of your ornament, bar, or coin.",
    "Choose the karat purity of your item: 24K pure gold, 22K jewellery gold, 18K diamond jewellery gold, or 14K gold.",
    "Review or adjust the 24K benchmark gold rate per gram (synced with daily live market updates).",
    "Optionally enter making charges as a percentage of gold value or a flat rupee amount per gram.",
    "Verify the GST rate (standard 3% on precious jewellery in India).",
    "Click Calculate to view the pure bullion value, making charges, tax breakdown, and per-gram rate across all karats.",
  ],
  formula:
    "Gold valuation begins by computing effective purity: 24K is 99.9% pure (1.0 factor), 22K is 91.6% pure (22/24 = 0.9167), 18K is 75.0% pure (18/24 = 0.75), and 14K is 58.3% pure (14/24 = 0.5833). Base Gold Value = Net Weight (grams) × Benchmark 24K Rate per gram × Purity Factor. Subtotal with Making = Base Gold Value + Making Charges. Under Indian taxation rules, Goods and Services Tax (GST) is levied at 3% on the combined total: Final Price = Subtotal with Making + (Subtotal with Making × 3%).",
  workedExample: {
    description:
      "A buyer purchases a 22K gold necklace weighing 16.0 grams when the 24K benchmark bullion rate is ₹7,500 per gram. The jeweller charges 12.0% making charges and 3.0% GST.",
    table: [
      { label: "Net Gold Weight", value: "16.00 grams" },
      { label: "Karat Purity", value: "22K (91.67% pure gold)" },
      { label: "24K Benchmark Rate", value: "₹7,500 / gram" },
      { label: "Effective 22K Rate", value: "₹6,875 / gram" },
      { label: "Base Gold Bullion Value", value: "₹1,10,000" },
      { label: "Making Charges (12%)", value: "₹13,200" },
      { label: "Taxable Value", value: "₹1,23,200" },
      { label: "GST (3%)", value: "₹3,696" },
      { label: "Final Jewellery Invoice Total", value: "₹1,26,896" },
    ],
  },
  quickReferenceTable: {
    title: "Gold Rate Reference Table Across Karats (24K Rate: ₹7,500/g)",
    headers: ["Gold Karat", "Purity Percentage", "Price Per Gram", "Price Per 10 Grams", "Common Usage"],
    rows: [
      ["24K (Pure Gold)", "99.9%", "₹7,500", "₹75,000", "Gold bars, sovereign mint coins, bullion investment"],
      ["22K (Standard Jewellery)", "91.67%", "₹6,875", "₹68,750", "Traditional bridal necklaces, bangles, chains"],
      ["18K (Ornamental)", "75.00%", "₹5,625", "₹56,250", "Diamond jewellery, gemstone rings, luxury watches"],
      ["14K (Durable Fashion)", "58.33%", "₹4,375", "₹43,750", "Daily wear rings, modern lightweight jewellery"],
    ],
  },
  mistakes: [
    "Confusing gross weight with net gold weight: Stones, cubic zirconia, pearls, and wax filler inside bangles add substantial weight but have zero gold value. Always demand an invoice showing the net gold weight separately.",
    "Paying excessive making charges: Making charges range from 6% to 25% depending on machine-made vs handmade craftsmanship. Negotiating making charges or shopping during festival offers can save significant amounts.",
    "Overlooking the 6-digit HUID hallmark: Since April 2023, the Bureau of Indian Standards (BIS) mandates a 6-character alphanumeric Hallmarking Unique Identification (HUID) code alongside the BIS triangular logo on all hallmarked gold sold in India.",
    "Expecting GST refund when reselling old gold: When selling gold back to a jeweller or gold buyer, you only receive the prevailing bullion value minus testing deductions; the original 3% GST and making charges paid at purchase cannot be recovered.",
    "Assuming uniform gold prices across Indian cities: Gold prices vary by ₹50 to ₹200 per 10g between Mumbai, Chennai, Delhi, and Kolkata due to state transportation levies, local jeweller associations, and regional bullion freight costs.",
  ],
  faqs: [
    {
      q: "Why do daily gold prices differ between Indian cities?",
      a: "Gold prices vary between cities like Mumbai, Chennai, and Delhi due to localized factors including state logistics, local transport freight, municipal octroi, and differences in regional jeweller association daily rate-setting mechanisms. Port cities like Mumbai typically offer slightly lower base rates than landlocked northern states.",
    },
    {
      q: "What is the difference between 22K and 24K gold?",
      a: "24-karat gold is 99.9% pure elemental gold. Because pure gold is very soft and malleable, it easily bends and scratches, making it unsuitable for intricate studded ornaments. 22-karat gold contains 91.67% pure gold alloyed with 8.33% metals like copper and zinc, providing the structural strength needed for durable everyday jewellery.",
    },
    {
      q: "How are making charges calculated on gold jewellery?",
      a: "Making charges represent the artisan labor and manufacturing costs of crafting jewellery. Jewellers calculate them either as a percentage of the pure gold value (typically 8% to 20%) or as a flat rate per gram (e.g. ₹300 to ₹700 per gram). Plain machine-made chains carry lower making charges, whereas temple and filigree jewellery command premium rates.",
    },
    {
      q: "How can I verify if my gold jewellery is authentic and BIS hallmarked?",
      a: "Authentic hallmarked jewellery features three laser-engraved symbols: the triangular BIS logo, the purity mark (such as 22K916 or 18K750), and a unique 6-digit alphanumeric HUID code. You can verify the HUID code directly on the BIS Care smartphone app to confirm the certified hallmarking center, jeweller registration, and testing date.",
    },
    {
      q: "How is resale value calculated when selling old gold jewellery?",
      a: "When you sell old gold back to a jeweller, the valuation is based strictly on the net weight of pure gold multiplied by the prevailing 24K or 22K buying rate. Jewellers deduct 1% to 3% for melting and refining losses. The making charges and 3% GST originally paid on the retail purchase invoice are non-recoverable on resale.",
    },
    {
      q: "How much gold weight is in one Indian tola?",
      a: "In traditional Indian bullion markets, one tola equals 11.6638 grams (often simplified to 11.66 grams). However, many modern branded jewellers standardize bullion coins in 10-gram denominations. When buying or selling by tola, always clarify whether the transaction is based on the traditional 11.66g tola or modern 10g metric unit.",
    },
  ],
  relatedSlugs: [
    "gold-jewellery-bill-calculator",
    "gold-making-charges-calculator",
    "gold-purity-karat-converter",
    "old-gold-exchange-value-calculator",
  ],
};

import type { CalculatorEducationalContent } from "../content-types";

const educationalContent: CalculatorEducationalContent = {
  whatItDoes: goldValueCalculatorContent.intro,
  howItWorks: Array.isArray(goldValueCalculatorContent.howToUseSteps) ? goldValueCalculatorContent.howToUseSteps.join("\n\n") : "",
  formula: goldValueCalculatorContent.formula,
  example: typeof goldValueCalculatorContent.workedExample === 'object' && goldValueCalculatorContent.workedExample ? (goldValueCalculatorContent.workedExample.description + "\n\n" + (goldValueCalculatorContent.workedExample.table || []).map((t: any) => `${t.label}: ${t.value}`).join("\n")) : "",
  mistakes: Array.isArray(goldValueCalculatorContent.mistakes) ? goldValueCalculatorContent.mistakes.join("\n\n") : String(goldValueCalculatorContent.mistakes || ""),
  faqs: Array.isArray(goldValueCalculatorContent.faqs) ? goldValueCalculatorContent.faqs.map((f: any) => ({ question: f.q, answer: f.a })) : [],
  authorityLinks: [
    { text: "Bureau of Indian Standards (BIS)", url: "https://www.bis.gov.in/" },
    { text: "Reserve Bank of India (RBI)", url: "https://www.rbi.org.in/" },
  ],
  relatedCalculators: goldValueCalculatorContent.relatedSlugs || ["gold-jewellery-bill-calculator","gold-purity-karat-converter","gold-making-charges-calculator"],
  lastReviewed: "2026-11-21",
};

export default educationalContent;
