export const tmtSteelWeightCalculatorContent = {
  h1: "TMT Steel Weight Calculator",
  intro:
    "Calculate TMT rebars weight in kilograms and tonnes instantly with our TMT Steel Weight Calculator. Using the civil engineering benchmark formula d²/162, estimate weights for standard 6mm to 32mm reinforcement bars, calculate required 12-metre commercial lengths, and compute overall structural steel costs for your residential building project.",
  howToUseSteps: [
    "Select your reinforcement bar diameter in millimetres (standard options: 8mm, 10mm, 12mm, 16mm, 20mm, 25mm, or 32mm).",
    "Enter the length per bar in either metres (standard commercial rebar length is 12 metres) or feet.",
    "Specify the total count or quantity of bars required for your structural element.",
    "Optionally provide the prevailing retail steel rate per kg (typically ₹60 to ₹75/kg in Indian regional markets).",
    "Click Calculate to view unit weight per metre, weight per single bar, total metric tonnage, equivalent 12m commercial bar count, and estimated steel expense.",
  ],
  formula:
    "The weight of cylindrical steel reinforcement bars is derived directly from the physical density of structural carbon steel (7,850 kg/m³). Unit Weight per metre (kg/m) = Volume of 1m cylinder × Steel Density = (π/4) × (d/1000)² × 1 × 7850 = (3.14159 / 4) × (d² / 1,000,000) × 7850 = d² / 162.28, conventionally standardized across Indian construction sites as d² / 162. Multiplying this unit weight by individual bar length gives single bar weight: Weight per Bar = (d² / 162) × Length (m). Total Weight = Weight per Bar × Number of Bars.",
  workedExample: {
    description:
      "A contractor needs reinforcement steel for a residential roof slab consisting of 80 bars of 10mm diameter and 60 bars of 12mm diameter, each cut to a 12-metre commercial length. The prevailing site delivery rate is ₹65 per kg.",
    table: [
      { label: "10mm Unit Weight (d²/162)", value: "0.617 kg / metre" },
      { label: "10mm Single 12m Bar Weight", value: "7.41 kg" },
      { label: "10mm Total Weight (80 Bars)", value: "592.59 kg (0.593 Tonnes)" },
      { label: "12mm Unit Weight (d²/162)", value: "0.889 kg / metre" },
      { label: "12mm Single 12m Bar Weight", value: "10.67 kg" },
      { label: "12mm Total Weight (60 Bars)", value: "640.00 kg (0.640 Tonnes)" },
      { label: "Combined Steel Weight", value: "1,232.59 kg (1.233 Tonnes)" },
      { label: "Total Steel Material Cost (@ ₹65/kg)", value: "₹80,118" },
    ],
  },
  quickReferenceTable: {
    title: "IS 1786 Standard TMT Bar Weight & Quantity Chart",
    headers: ["Diameter (mm)", "Weight / Metre (kg)", "Weight / 12m Bar (kg)", "Bars / Metric Tonne", "IS Tolerance"],
    rows: [
      ["8 mm", "0.395 kg/m", "4.74 kg", "211 bars", "±7%"],
      ["10 mm", "0.617 kg/m", "7.41 kg", "135 bars", "±5%"],
      ["12 mm", "0.889 kg/m", "10.67 kg", "94 bars", "±5%"],
      ["16 mm", "1.580 kg/m", "18.96 kg", "53 bars", "±5%"],
      ["20 mm", "2.469 kg/m", "29.63 kg", "34 bars", "±3%"],
      ["25 mm", "3.858 kg/m", "46.30 kg", "22 bars", "±3%"],
      ["28 mm", "4.840 kg/m", "58.07 kg", "17 bars", "±3%"],
      ["32 mm", "6.321 kg/m", "75.85 kg", "13 bars", "±3%"],
    ],
  },
  mistakes: [
    "Buying steel strictly by bar count rather than certified weighbridge weight: Rolling mills produce bars within IS 1786 permissible weight tolerances (±3% to ±7%). Always verify your truckload at an independent certified weighbridge (dharam kanta).",
    "Using non-D grade rebar in seismic zones: Standard Fe500 lacks the high elongation percentage of Fe500D or Fe550D. The 'D' indicates superior ductility, crucial for earthquake resistance in Indian building codes.",
    "Neglecting lap length and cutting wastage allowances: Straight mathematical estimates omit steel overlaps (typically 40d to 50d lap length) and cutting offcuts. Add a mandatory 4% to 6% wastage buffer when placing bulk orders.",
    "Storing TMT steel bars directly on damp soil: Storing rebars directly on bare ground causes surface scaling and deep rusting, which reduces cross-sectional diameter and weakens concrete-steel bonding.",
    "Mismatched rebar sizes in column and beam junctions: Substituting 16mm bars with extra 12mm bars without consulting a structural engineer alters reinforcement spacing and impairs concrete aggregate flow.",
  ],
  faqs: [
    {
      q: "How do you calculate the weight of a TMT steel bar manually?",
      a: "The weight is computed using the formula Weight = (d² / 162) × Length in metres, where d is the rebar diameter in millimetres. For example, a standard 12-metre bar of 12mm diameter weighs (12 × 12 / 162) × 12 = 0.8889 × 12 = 10.67 kg. For measurements in feet, divide d² by 533.",
    },
    {
      q: "How much steel is required per square foot for a house in India?",
      a: "As a general structural engineering rule of thumb, residential RCC construction consumes approximately 3.5 kg to 4.5 kg of steel per square foot of total built-up area. For a standard 1,000 sq ft home, total reinforcement steel consumption typically spans 3.5 to 4.5 metric tonnes across footings, columns, plinth beams, and roof slabs.",
    },
    {
      q: "What is the difference between Fe500, Fe550, and Fe500D TMT steel?",
      a: "The number denotes minimum yield strength in N/mm² (Fe500 provides 500 N/mm²). The 'D' designation signifies enhanced ductility and higher elongation (minimum 16% to 18% elongation vs 12% in standard Fe500). Fe500D and Fe550D absorb significantly more energy during earthquakes and ground shifts, making them standard for residential structures.",
    },
    {
      q: "How many 12-metre TMT bars are in one metric tonne (1,000 kg)?",
      a: "The number of bars per tonne depends directly on the bar diameter. One metric tonne contains approximately 211 bars of 8mm, 135 bars of 10mm, 94 bars of 12mm, 53 bars of 16mm, and 34 bars of 20mm.",
    },
    {
      q: "What are IS 1786 permissible weight tolerances?",
      a: "The Bureau of Indian Standards (IS 1786) permits specific manufacturing variations between actual and nominal bar weight: ±7% for bars up to 10mm, ±5% for bars from 10mm to 16mm, and ±3% for bars over 16mm. Reputable primary brands (such as Tata Tiscon, JSW Neosteel, and SAIL) adhere strictly within these bands.",
    },
    {
      q: "Which other construction estimators are available on CalcZen?",
      a: "You can calculate your roof slab concrete mix using our <a href=\"/calculator/rcc-price-calculator\" class=\"text-primary hover:underline font-medium\">RCC Price Calculator</a> and estimate cement, sand, and aggregate with the <a href=\"/calculator/cement-bag-calculator\" class=\"text-primary hover:underline font-medium\">Cement Bag Calculator</a>.",
    },
  ],
  relatedSlugs: [
    "cement-bag-calculator",
    "rcc-price-calculator",
    "brick-calculator",
    "tile-calculator",
  ],
};
