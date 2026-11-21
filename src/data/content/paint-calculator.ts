export const paintCalculatorContent = {
  h1: "Paint Calculator",
  intro:
    "Accurately calculate how much paint and primer you need for any room or home with our free Paint Calculator for India. Determine wall and ceiling surface area, subtract doors and windows, calculate exact liters across multiple coats, and break down paint quantities into standard 1L, 4L, 10L, and 20L commercial buckets to prevent costly contractor over-purchasing.",
  howToUseSteps: [
    "Enter your room length, width, and ceiling height in feet.",
    "Specify the number of doors and windows to accurately subtract unpainted opening areas.",
    "Select whether you want to include ceiling painting in the calculation.",
    "Choose your required number of paint coats (2 coats recommended for fresh or color-change repainting).",
    "Adjust the paint spreading rate if you know your paint brand's exact coverage (standard premium interior emulsion covers 90 to 110 sq ft per liter per coat).",
    "Toggle primer coat calculation if painting fresh plastered walls or applying deep contrasting shades.",
    "Optionally enter paint and primer price per liter to get an itemized material cost estimate.",
    "Click Calculate to get net paintable square footage, required paint and primer in liters, optimal commercial can sizes, and total budget.",
  ],
  formula:
    "Paint calculation begins with total surface area: Gross Wall Area (sq ft) = 2 × (Room Length + Room Width) × Ceiling Height. If painting the ceiling, add Ceiling Area (sq ft) = Room Length × Room Width. Net Paintable Area = Gross Wall Area + Ceiling Area − (Doors Count × Door Area + Windows Count × Window Area). Required Paint Volume (Liters) = (Net Paintable Area × Number of Coats) / Spreading Rate per Liter per Coat. For primer: Primer Liters = Net Paintable Area / Primer Spreading Rate. Total commercial tins are optimized by packing liters into 20-liter drums, 10-liter buckets, 4-liter gallon cans, and 1-liter touch-up packs.",
  workedExample: {
    description:
      "A homeowner repaints a standard master bedroom measuring 14.0 ft length, 12.0 ft width, and 10.0 ft height. The room has 1 standard door (21 sq ft), 2 windows (15 sq ft each), includes the ceiling, and receives 2 coats of premium acrylic emulsion covering 100 sq ft per liter per coat, plus 1 coat of primer covering 120 sq ft per liter.",
    table: [
      { label: "Room Dimensions", value: "14 ft (L) × 12 ft (W) × 10 ft (H)" },
      { label: "Gross Wall Perimeter Area", value: "520.00 sq ft [2 × (14 + 12) × 10]" },
      { label: "Ceiling Surface Area", value: "168.00 sq ft (14 × 12)" },
      { label: "Openings Deductions", value: "51.00 sq ft [1 door (21) + 2 windows (30)]" },
      { label: "Net Paintable Surface Area", value: "637.00 sq ft (520 + 168 − 51)" },
      { label: "Number of Coats Applied", value: "2 coats of acrylic emulsion" },
      { label: "Theoretical Paint Needed", value: "12.74 Liters [(637 × 2) / 100]" },
      { label: "Recommended Paint Purchase", value: "13 Liters (One 10L bucket + One 4L can)" },
      { label: "Primer Required (1 Coat)", value: "5.31 Liters (637 / 120) → 6 Liters" },
      { label: "Estimated Material Expense (@ ₹380/L paint, ₹180/L primer)", value: "₹6,400 total paint & primer" },
    ],
  },
  quickReferenceTable: {
    title: "Indian Wall Paint Coverage, Coats & Spreading Rates Reference",
    headers: ["Paint Type", "Common Indian Brands", "Coverage (Sq Ft / L / Coat)", "Recommended Coats", "Ideal Usage"],
    rows: [
      ["Interior Acrylic Emulsion", "Apex, Royale, Tractor", "90 to 110 sq ft", "2 coats", "Living rooms, bedrooms, interior walls"],
      ["Interior Distemper", "Utsav, TruCare", "70 to 90 sq ft", "2 to 3 coats", "Budget rental units, temporary ceilings"],
      ["Exterior Weather Emulsion", "Apex Ultima, Weathercoat", "55 to 70 sq ft", "2 coats", "Outdoor facade, boundary walls, balconies"],
      ["Water-Based Wall Primer", "Decoprime, SmartCare", "110 to 130 sq ft", "1 coat", "Fresh cement plaster, cured putty"],
      ["Oil-Based Enamel Paint", "Apcolite, Berger Luxol", "80 to 100 sq ft", "2 coats", "Wood doors, metal window grills, gates"],
      ["Acrylic Wall Putty", "Birla White, JK Wall", "12 to 15 sq ft per kg", "2 coats", "Substrate leveling and pinhole filling"],
    ],
  },
  mistakes: [
    "Skipping the wall primer coat over freshly plastered masonry: Fresh cement plaster contains alkaline salts that bleed through paint without an alkali-resistant primer barrier, leading to patchy efflorescence and early peeling.",
    "Forgetting to deduct windows and large door openings: Calculating room surface purely as perimeter multiplied by height without deducting French doors, wardrobes, and windows results in buying 15% to 25% surplus paint.",
    "Applying the second coat before the first coat cures thoroughly: Applying subsequent coats over damp paint traps moisture, producing surface blisters, uneven sheen, and brush roller drag marks.",
    "Failing to account for porous masonry absorbency: Highly porous raw cement surfaces absorb significantly more primer and paint on the first coat, reducing spreading coverage by up to 20% compared to smooth repainting surfaces.",
    "Ignoring batch lot numbers when purchasing multiple paint cans: Tinted emulsions can display subtle shade deviations across manufacturing batches. Always blend different buckets together in a large tub (boxing) before rolling.",
  ],
  faqs: [
    {
      q: "How many liters of paint do I need for a 10×10 ft room in India?",
      a: "A 10×10 ft room with a 10 ft ceiling height has approximately 400 sq ft of gross wall area. After deducting 40 sq ft for a door and window, the net wall area is 360 sq ft. For 2 coats of emulsion paint with a coverage of 100 sq ft per liter per coat, you need exactly 7.2 liters, or rounded up, an 8-liter purchase (two 4-liter cans). If painting the ceiling (100 sq ft), add 2 liters.",
    },
    {
      q: "What is the standard spreading coverage of emulsion paint in India?",
      a: "Standard interior acrylic emulsions (such as Asian Paints Royale, Berger Silk, or Dulux Velvet) provide an average spreading coverage of 90 to 110 square feet per liter for two coats on smooth primed walls. On rough or unprimed surfaces, coverage may drop to 70 to 80 square feet per liter.",
    },
    {
      q: "Do I really need a primer coat before painting?",
      a: "Yes. Primer acts as a bonding adhesive between the drywall or cement plaster substrate and the finish paint. It seals porous surfaces, neutralizes plaster alkalinity, ensures uniform color saturation, and significantly improves the lifespan and scrub resistance of your paint finish.",
    },
    {
      q: "What commercial can and bucket sizes are available in Indian hardware stores?",
      a: "Paint manufacturers in India package architectural paints in 1-liter tins, 4-liter cans, 10-liter buckets, and 20-liter industrial drums. Buying larger 10L or 20L containers yields a 10% to 15% lower price per liter compared to purchasing multiple 1-liter tins.",
    },
    {
      q: "How much acrylic wall putty is needed per square foot?",
      a: "For fresh masonry, two coats of white cement-based wall putty generally consume about 0.08 to 0.12 kg per square foot (approx. 10 to 14 sq ft coverage per kg for two coats). Putty smooths out undulations and fills fine shrinkage cracks before primer application.",
    },
    {
      q: "How does ceiling paint requirement differ from wall paint?",
      a: "Ceilings are typically painted with flat matte white or high-hiding ceiling emulsions to prevent light reflection and glare. Because ceilings do not experience physical hand contact or scuffing, 1 to 2 coats of a high-opacity flat white emulsion or distemper are sufficient.",
    },
    {
      q: "What other construction and home finishing tools are available on CalcZen?",
      a: "Plan your entire home finishing budget seamlessly: calculate flooring tiles with our <a href=\"/calculator/tile-calculator\" class=\"text-primary hover:underline font-medium\">Tile Calculator</a>, estimate concrete and plaster mortar with the <a href=\"/calculator/cement-bag-calculator\" class=\"text-primary hover:underline font-medium\">Cement Bag Calculator</a>, compute wall masonry using the <a href=\"/calculator/brick-calculator\" class=\"text-primary hover:underline font-medium\">Brick Calculator</a>, and evaluate clean solar power using the <a href=\"/calculator/rooftop-solar-calculator\" class=\"text-primary hover:underline font-medium\">Rooftop Solar Calculator</a>.",
    },
  ],
  relatedSlugs: [
    "tile-calculator",
    "brick-calculator",
    "cement-bag-calculator",
    "rooftop-solar-calculator",
  ],
};

import type { CalculatorEducationalContent } from "../content-types";

const educationalContent: CalculatorEducationalContent = {
  whatItDoes: paintCalculatorContent.intro,
  howItWorks: Array.isArray(paintCalculatorContent.howToUseSteps) ? paintCalculatorContent.howToUseSteps.join("\n\n") : "",
  formula: paintCalculatorContent.formula,
  example: typeof paintCalculatorContent.workedExample === 'object' && paintCalculatorContent.workedExample ? (paintCalculatorContent.workedExample.description + "\n\n" + (paintCalculatorContent.workedExample.table || []).map((t: any) => `${t.label}: ${t.value}`).join("\n")) : "",
  mistakes: Array.isArray(paintCalculatorContent.mistakes) ? paintCalculatorContent.mistakes.join("\n\n") : String(paintCalculatorContent.mistakes || ""),
  faqs: Array.isArray(paintCalculatorContent.faqs) ? paintCalculatorContent.faqs.map((f: any) => ({ question: f.q, answer: f.a })) : [],
  authorityLinks: [
    { text: "Bureau of Indian Standards (BIS)", url: "https://www.bis.gov.in/" },
    { text: "Reserve Bank of India (RBI)", url: "https://www.rbi.org.in/" },
  ],
  relatedCalculators: paintCalculatorContent.relatedSlugs || ["tile-calculator","brick-calculator","cement-bag-calculator"],
  lastReviewed: "2026-11-21",
};

export default educationalContent;
