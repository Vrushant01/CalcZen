import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The Cement Bag Calculator calculates the precise number of 50kg cement bags required for concrete casting, brick masonry, wall plastering, and flooring works in India. It prevents material shortages and eliminates surplus wastage during building construction.",

  howItWorks:
    "Choose your construction activity (RCC concrete casting, brick masonry walling, internal/external plastering, or tile flooring). Enter the dimensions or built-up area and your specified mortar or concrete mix grade. The calculator computes dry material requirements and outputs the exact number of 50kg cement bags along with sand and aggregate volumes.",

  formula:
    "Standard Cement Bag Calculations in India:\n\n1 Bag of Cement = 50 kg = 0.035 m³ (approx. 1.226 cu.ft)\n\nFor Concrete (M20: 1:1.5:3):\n- Dry Volume = Wet Volume × 1.54\n- Cement Bags = [ Dry Volume × (1 / 5.5) ] ÷ 0.035 m³\n\nFor Plastering (1:4 Mortar, 12mm thickness):\n- Mortar Volume = Area (m²) × 0.012 m × 1.33 (dry conversion & joint filling)\n- Cement Bags = [ Mortar Volume × (1 / 5) ] ÷ 0.035 m³",

  example:
    "Plastering a 100 m² wall area with 12mm thick 1:4 cement mortar:\n- Wet Plaster Volume: 100 × 0.012 = 1.2 m³\n- Dry Mortar Volume (× 1.33): 1.596 m³\n- Cement Required: 1.596 ÷ 5 = 0.3192 m³\n- Cement Bags (50kg): 0.3192 ÷ 0.035 ≈ 9.1 bags (Order 10 bags with wastage)",

  mistakes:
    "Failing to account for 5% to 10% site wastage from broken bags, spillage, and masonry joint filling leads to sudden mid-work project pauses. Another error is storing excess cement bags without moisture protection, causing cement to set in storage.",

  faqs: [
    {
      question: "How many cement bags are in 1 cubic meter of M20 concrete?",
      answer:
        'One cubic meter (1 m³) of M20 concrete (1:1.5:3 ratio) requires approximately 8.0 to 8.2 bags of 50kg cement (approx. 400 kg of cement). For complete structural member estimates including sand, aggregate, and steel rebar, use our <a href="/calculator/rcc-price-calculator" class="text-primary hover:underline">RCC Price Calculator</a>.',
    },
    {
      question: "How many cement bags are needed for 1,000 square feet of slab?",
      answer:
        'A 1,000 sq ft roof slab with 5-inch (125mm) thickness requires approximately 11.6 m³ of wet concrete, which translates to roughly 92 to 96 bags of 50kg cement using M20 grade concrete. You can verify total casting costs with our <a href="/calculator/rcc-price-calculator" class="text-primary hover:underline">RCC Price Calculator</a>.',
    },
  ],

  authorityLinks: [
    {
      text: "Central Public Works Department (CPWD) Specifications for Concrete and Mortar",
      url: "https://cpwd.gov.in/",
    },
  ],

  relatedCalculators: [
    "rcc-price-calculator",
    "gst-calculator",
    "loan-emi-calculator",
  ],
};

export default content;
