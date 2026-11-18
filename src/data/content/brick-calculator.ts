export const brickCalculatorContent = {
  h1: "Brick Calculator",
  intro:
    "Estimate the exact number of bricks, cement bags, and river sand required for any masonry wall with our Brick Calculator for India. Calculate material requirements for 9-inch load-bearing walls and 4.5-inch partition walls, deduct door and window openings, account for masonry wastage, and generate comprehensive construction budgets.",
  howToUseSteps: [
    "Enter wall dimensions: length, height, and thickness in metres or feet.",
    "Select your unit of measurement (metres or feet) to automatically convert dimensions.",
    "Choose your brick type: standard modular bricks (190×90×90 mm), traditional red clay bricks (230×110×70 mm), or custom dimensions.",
    "Enter total deduction area in square metres for door and window openings.",
    "Select your mortar mix ratio (standard 1:4 for external walls or 1:6 for internal partition walls).",
    "Specify expected breakage and handling wastage (5% recommended).",
    "Optionally enter local brick, cement bag, and sand unit prices to calculate total material expenditure.",
    "Click Calculate to view required bricks, dry mortar volume, cement bags, and sand metric tonnage.",
  ],
  formula:
    "The calculation calculates net masonry volume: Net Wall Volume = (Length × Height × Thickness) − (Openings Area × Thickness). Nominal Brick Volume with 10mm mortar joint = (Length + 0.01) × (Width + 0.01) × (Height + 0.01). Number of Bricks = Net Wall Volume / Nominal Brick Volume. Wet Mortar Volume = Net Wall Volume − (Number of Bricks × Un-mortared Brick Volume). Dry Mortar Volume = Wet Volume × 1.27 (accounting for void penetration and dry shrinkage). For a mortar ratio 1:N (e.g. 1:6), Cement Volume = Dry Volume × [1 / (1 + N)], and Sand Volume = Dry Volume × [N / (1 + N)]. Number of 50kg cement bags = Cement Volume / 0.0347 m³.",
  workedExample: {
    description:
      "A homebuilder constructs a 9-inch external boundary wall measuring 10.0 metres long, 3.0 metres high, and 0.23 metres thick (9 inches) using standard modular bricks (190×90×90 mm with 10mm mortar) and a 1:5 cement-sand mortar ratio, deducting 3.0 sq.m for a gate opening with 5% wastage.",
    table: [
      { label: "Gross Wall Volume", value: "6.90 m³" },
      { label: "Gate Opening Deduction", value: "0.69 m³" },
      { label: "Net Masonry Volume", value: "6.21 m³" },
      { label: "Gross Bricks (at 500 bricks/m³)", value: "3,105 bricks" },
      { label: "Bricks with 5% Wastage", value: "3,260 bricks" },
      { label: "Dry Mortar Required (Factor 1.27)", value: "1.63 m³" },
      { label: "Cement Required (1:5 ratio)", value: "8 bags (50kg each)" },
      { label: "Sand Required (1:5 ratio)", value: "1.36 m³ (2.17 Tonnes)" },
      { label: "Estimated Total Cost (@ ₹9/brick, ₹380/bag cement, ₹1,200/tonne sand)", value: "₹35,014" },
    ],
  },
  quickReferenceTable: {
    title: "Brick & Mortar Estimation Thumb Rules for Indian Construction",
    headers: ["Wall Type", "Bricks per Sq Ft", "Bricks per Sq Metre", "Recommended Mortar", "Cement Bags / 100 Sq Ft"],
    rows: [
      ["4.5-Inch Single Brick Wall", "4.5 to 5 bricks", "48 to 50 bricks", "1:4 Cement Sand", "1.2 to 1.5 bags"],
      ["9-Inch Double Brick Wall", "9.5 to 10 bricks", "98 to 100 bricks", "1:6 Cement Sand", "2.5 to 3.0 bags"],
      ["13.5-Inch Foundation Wall", "14.5 to 15 bricks", "145 to 150 bricks", "1:4 Cement Sand", "4.0 to 4.5 bags"],
      ["Fly Ash Brick 9-Inch Wall", "8.5 to 9 bricks", "90 to 92 bricks", "1:5 Cement Sand", "2.2 to 2.6 bags"],
    ],
  },
  mistakes: [
    "Failing to soak clay bricks in water prior to laying: Dry red clay bricks rapidly absorb water from wet mortar, weakening the cement paste and causing mortar crumbling and wall micro-cracks.",
    "Omitting door and window frame deductions: Failing to subtract lintels, doors, and window openings inflates brick and cement estimates by 10% to 25%, resulting in costly surplus material.",
    "Using lean 1:7 or 1:8 mortar on external walls: Weak mortar ratios degrade rapidly when exposed to monsoon moisture, leading to water seepage, damp patches, and efflorescence on interior plaster.",
    "Neglecting vertical joint (perpend) thickness: Irregular mortar joints exceeding 12mm to 15mm weaken the compressive strength of the wall and increase cement mortar consumption significantly.",
    "Ordering bricks without a breakages and handling buffer: Red clay bricks suffer 3% to 7% chipping and breakage during transport and unloading. A 5% wastage allowance avoids project stoppages.",
  ],
  faqs: [
    {
      q: "How many bricks are needed per square foot of wall in India?",
      a: "For a standard 4.5-inch partition wall (single brick thick), you need approximately 4.5 to 5 bricks per square foot of wall surface area. For a 9-inch load-bearing wall (double brick thick), you require roughly 9.5 to 10 bricks per square foot, assuming standard modular brick dimensions and 10mm mortar joints.",
    },
    {
      q: "What is the difference between a 4.5-inch and a 9-inch brick wall?",
      a: "A 4.5-inch wall (half-brick thick) is non-load-bearing, used primarily for internal partition walls, bathroom dividers, and small boundary enclosures. A 9-inch wall (full-brick thick) is load-bearing, providing superior structural stability, thermal insulation, and weather protection, making it standard for external perimeter walls and multi-storey structures.",
    },
    {
      q: "Which mortar ratio should I choose for brick masonry?",
      a: "A 1:4 mortar mix (1 part cement to 4 parts sand) is recommended for 4.5-inch thin partition walls, parapet walls, and structural foundations requiring higher bonding strength. A 1:6 mortar mix is standard and economical for regular 9-inch load-bearing walls where compressive masonry loads dominate.",
    },
    {
      q: "How are fly ash bricks different from traditional red clay bricks?",
      a: "Fly ash bricks are manufactured from industrial pulverized fly ash, cement, and stone dust using hydraulic compression. They offer uniform dimensions, smooth edges, sharper corners, and require 20% to 30% less mortar than uneven kiln-fired red clay bricks, while generating lower environmental carbon footprints.",
    },
    {
      q: "Why is the dry mortar volume factor set to 1.27?",
      a: "When water is added to dry cement and sand, the fine cement particles fill the microscopic voids between sand grains, causing a 25% to 30% volumetric contraction. To produce 1 cubic metre of wet, workable mortar on site, civil engineers multiply the wet volume by 1.27 to determine the required dry material volume.",
    },
    {
      q: "Where can I calculate plaster and concrete requirements on CalcZen?",
      a: "To estimate cement and sand for subsequent wall plastering, use our <a href=\"/calculator/cement-bag-calculator\" class=\"text-primary hover:underline font-medium\">Cement Bag Calculator</a>, and calculate rebar requirements using the <a href=\"/calculator/tmt-steel-weight-calculator\" class=\"text-primary hover:underline font-medium\">TMT Steel Weight Calculator</a>.",
    },
  ],
  relatedSlugs: [
    "cement-bag-calculator",
    "rcc-price-calculator",
    "tmt-steel-weight-calculator",
    "tile-calculator",
  ],
};
