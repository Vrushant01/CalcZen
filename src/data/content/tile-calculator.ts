export const tileCalculatorContent = {
  h1: "Tile Calculator",
  intro:
    "Calculate the exact number of floor and wall tiles for any room with our free Tile Calculator for India. Choose popular formats like 2×2 ft, 2×4 ft, or 600×600 mm vitrified tiles, incorporate cutting and skirting wastage, determine box quantities, and budget your flooring or bathroom renovation accurately.",
  howToUseSteps: [
    "Enter the length and width of your room in either feet or metres.",
    "Optionally enter any deduction areas in square feet (such as built-in kitchen cabinets, pillars, or offsets).",
    "Select your tile size from popular Indian standards (2×2 ft, 2×4 ft, 600×600 mm, 800×800 mm) or enter custom dimensions.",
    "Set your wastage buffer (10% standard for straight laying, 15% for diagonal or herringbone patterns).",
    "Enter the number of tiles packaged per commercial box (typically 4 pieces per box for 2×2 ft vitrified tiles).",
    "Optionally enter the price per tile or price per square foot to compute overall material expense.",
    "Click Calculate to view total floor area, required tiles with wastage, commercial boxes needed, and estimated cost.",
  ],
  formula:
    "Tile calculation starts by determining the net surface area: Room Area (sq ft) = (Room Length × Room Width) − Deductions. Single Tile Area (sq ft) = [Tile Length (mm) / 304.8] × [Tile Width (mm) / 304.8]. The raw number of tiles needed is Room Area / Single Tile Area (rounded up). Factoring in cutting and corner breakage gives Tiles with Wastage = Ceil[Raw Tiles × (1 + Wastage% / 100)]. Commercial Boxes = Ceil(Tiles with Wastage / Tiles per Box). Total Material Cost = Tiles with Wastage × Price per Tile (or Total Purchased Sq Ft × Price per Sq Ft).",
  workedExample: {
    description:
      "A homeowner tiles a living room measuring 16.0 ft by 12.0 ft (192 sq ft) using popular 2×2 ft (600×600 mm) vitrified tiles packed 4 pieces per box, with 10% cutting wastage and an area rate of ₹55 per sq ft.",
    table: [
      { label: "Room Dimensions", value: "16 ft × 12 ft" },
      { label: "Net Floor Area", value: "192.00 sq ft (17.84 m²)" },
      { label: "Selected Tile Format", value: "2 ft × 2 ft (4.00 sq ft per tile)" },
      { label: "Base Tile Count (No Wastage)", value: "48 tiles" },
      { label: "Cutting Wastage (10%)", value: "5 extra tiles" },
      { label: "Total Tiles with Wastage", value: "53 tiles" },
      { label: "Commercial Packaging", value: "4 tiles per box" },
      { label: "Boxes Required (Rounded Up)", value: "14 boxes (56 tiles total)" },
      { label: "Estimated Material Expense (@ ₹55/sq ft)", value: "₹12,320" },
    ],
  },
  quickReferenceTable: {
    title: "Popular Indian Tile Formats & Box Coverage Reference",
    headers: ["Tile Format", "Size in mm", "Area per Tile (Sq Ft)", "Pieces per Box", "Box Coverage (Sq Ft)"],
    rows: [
      ["1×1 Ft Ceramic", "300 × 300 mm", "0.97 sq ft", "10 to 12 pcs", "9.7 to 11.6 sq ft"],
      ["2×2 Ft Vitrified", "600 × 600 mm", "3.88 sq ft", "4 pcs", "15.5 sq ft"],
      ["2×4 Ft GVT Slab", "600 × 1200 mm", "7.75 sq ft", "2 pcs", "15.5 sq ft"],
      ["800×800 mm Large", "800 × 800 mm", "6.89 sq ft", "3 pcs", "20.7 sq ft"],
      ["1×1.5 Ft Wall Tile", "300 × 450 mm", "1.45 sq ft", "6 to 8 pcs", "8.7 to 11.6 sq ft"],
    ],
  },
  mistakes: [
    "Underestimating cutting wastage on diagonal or herringbone layouts: Straight grid patterns require roughly 8% to 10% wastage, whereas diagonal layouts or rooms with multiple irregular angles demand 15% to 18% extra tile allowance.",
    "Forgetting perimeter skirting tiles: Skirting along the bottom perimeter of walls typically requires 10% to 15% additional tile pieces, usually cut from matching floor tiles on site.",
    "Failing to reserve a spare box for future plumbing or tile repair: Ceramic and vitrified tile batches carry subtle dye-lot color variations. Finding an identical color match two years later is nearly impossible without a stored surplus box.",
    "Neglecting spacer and grout joint gaps: Large format vitrified tiles (GVT) require minimum 2mm to 3mm spacer joints with epoxy grout to accommodate thermal slab expansion and prevent tile tenting.",
    "Applying slippery polished vitrified tiles in wet bathroom zones: Polished tiles become dangerously slippery when wet. Use matte, anti-skid, or rustic ceramic finishes for bathroom floors and balconies.",
  ],
  faqs: [
    {
      q: "How much tile wastage should I budget for flooring?",
      a: "For standard rectangular rooms with a straight grid layout, add a 10% wastage allowance. For diagonal tile layouts, herringbone designs, or rooms with multiple pillars and irregular angles, increase your wastage buffer to 15%. This accounts for cut edge pieces, outlet profiling, and accidental transit breakage.",
    },
    {
      q: "How are tiles calculated for wall tiling in bathrooms and kitchens?",
      a: "To calculate wall tiles, compute the wall surface area by multiplying perimeter by tiling height: Wall Area = 2 × (Length + Width) × Tiling Height. Subtract the area of doors and windows, divide by the area of an individual wall tile, and add 10% for cutting offcuts and plumbing penetrations.",
    },
    {
      q: "How do I account for skirting tiles in my floor estimate?",
      a: "Skirting is installed around the room perimeter, typically 4 inches (100mm) high. Measure the room perimeter (2 × Length + 2 × Width), subtract door openings, and divide this perimeter length by the tile width to determine how many tiles will be cut into skirting strips.",
    },
    {
      q: "Why are tiles sold by the box rather than individual pieces?",
      a: "Manufacturers package tiles in heavy cardboard boxes with styrofoam cushioning to prevent shipping fractures and maintain consistent manufacturing dye lots and caliber sizes. Retailers sell full boxes, meaning your calculated tile total must always be rounded up to the nearest whole box.",
    },
    {
      q: "What is the difference between ceramic and vitrified tiles?",
      a: "Ceramic tiles are kiln-baked from clay at moderate temperatures and absorb 3% to 6% water, making them ideal for light residential walls. Vitrified tiles are hydraulic-pressed from clay, quartz, and silica, melted into a non-porous glass-like state with less than 0.5% water absorption, providing immense strength and stain resistance for floors.",
    },
    {
      q: "Which construction and wall estimators pair well with this tool?",
      a: "Before laying floor tiles, calculate your mortar bedding using our <a href=\"/calculator/cement-bag-calculator\" class=\"text-primary hover:underline font-medium\">Cement Bag Calculator</a>, estimate wall masonry with the <a href=\"/calculator/brick-calculator\" class=\"text-primary hover:underline font-medium\">Brick Calculator</a>, and budget wall painting with the <a href=\"/calculator/paint-calculator\" class=\"text-primary hover:underline font-medium\">Paint Calculator</a>.",
    },
  ],
  relatedSlugs: [
    "brick-calculator",
    "cement-bag-calculator",
    "paint-calculator",
    "tmt-steel-weight-calculator",
  ],
};
