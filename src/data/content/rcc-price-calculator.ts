import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The RCC Price Calculator estimates the total material quantities and cost for Reinforced Cement Concrete (RCC) construction works in India, including slabs, beams, columns, and foundations. It computes required cement bags, sand volume, aggregate volume, and steel reinforcement tonnage based on standard mix proportions like M20 and M25.",

  howItWorks:
    "Enter the dimensions of your concrete structural member (length, breadth, and depth/thickness) and your selected concrete mix ratio (such as M20: 1:1.5:3 or M25: 1:1:2). The calculator converts wet concrete volume into dry volume (multiplying by 1.54 to account for voids), computes exact material weights and cement bags, and applies local Indian market rates to estimate total casting expenditure.",

  formula:
    "Dry Volume Conversion:\nDry Volume = Wet Concrete Volume × 1.54\n\nMaterial Quantities for Ratio (1 : S : A):\n- Cement Volume = Dry Volume × [ 1 / (1 + S + A) ]\n- Cement Bags = Cement Volume (m³) ÷ 0.035 m³ per 50kg bag\n- Sand (m³) = Dry Volume × [ S / (1 + S + A) ]\n- Aggregate (m³) = Dry Volume × [ A / (1 + S + A) ]\n- Steel Weight = Wet Volume × Steel Percentage (1% to 2%) × 7850 kg/m³",

  example:
    "For an RCC roof slab of 100 m² with 125mm (0.125m) thickness using M20 concrete (1:1.5:3):\n- Wet Volume: 100 × 0.125 = 12.5 m³\n- Dry Volume: 12.5 × 1.54 = 19.25 m³\n- Cement Bags Required: ≈ 100 bags (50kg each)\n- Sand Volume: ≈ 5.25 m³ (185 cu.ft)\n- Coarse Aggregate: ≈ 10.5 m³ (370 cu.ft)\n- Steel Rebar (1%): ≈ 980 kg (0.98 MT)",

  mistakes:
    "A frequent civil estimation error is neglecting the 1.54 dry volume factor, which leads to ordering 35% less cement and aggregate than needed on site. Another mistake is forgetting to add 5% for site wastage and spillage during transit and vibration.",

  faqs: [
    {
      question: "How do I calculate cement bags needed for an RCC slab?",
      answer:
        'To calculate cement bags for an RCC slab, compute the wet volume (length × breadth × thickness), multiply by 1.54 to obtain the dry volume, and divide by the mix ratio sum. For a detailed bag-by-bag breakdown covering brickwork, plastering, and flooring, use our dedicated <a href="/calculator/cement-bag-calculator" class="text-primary hover:underline">Cement Bag Calculator</a>.',
    },
    {
      question: "What is the standard concrete mix ratio for residential slabs and columns?",
      answer:
        "The standard mix ratio for residential RCC slabs and beams is M20 (1 part cement : 1.5 parts sand : 3 parts coarse aggregate), which provides a characteristic compressive strength of 20 N/mm² at 28 days. Heavy structural columns and footings typically require M25 (1:1:2) for superior load-bearing capacity.",
    },
    {
      question: "How much steel reinforcement is needed per cubic meter of RCC?",
      answer:
        'On average, residential construction requires 80 to 100 kg of steel per cubic meter (m³) for roof slabs, 100 to 120 kg/m³ for beams, and 130 to 160 kg/m³ for structural columns and foundation footings.',
    },
    {
      question: "What GST and financing considerations apply to RCC construction?",
      answer:
        'In India, GST on cement is charged at 28%, while steel rebars and RMC (ready-mix concrete) are taxed at 18%. To calculate the tax breakdown on supplier bills, try our <a href="/calculator/gst-calculator" class="text-primary hover:underline">GST Calculator</a>, or plan home construction financing with our <a href="/calculator/loan-emi-calculator" class="text-primary hover:underline">Loan EMI Calculator</a>.',
    },
  ],

  authorityLinks: [
    {
      text: "Bureau of Indian Standards (BIS) IS 456: Plain and Reinforced Concrete Code of Practice",
      url: "https://www.bis.gov.in/",
    },
  ],

  relatedCalculators: [
    "cement-bag-calculator",
    "gst-calculator",
    "loan-emi-calculator",
  ],
};

export default content;
