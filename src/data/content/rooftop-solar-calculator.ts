export const rooftopSolarCalculatorContent = {
  h1: "Rooftop Solar Calculator",
  intro:
    "Estimate your ideal solar panel system size, PM Surya Ghar Muft Bijli Yojana central government subsidy, net investment, monthly electricity bill savings, and payback period with our free Rooftop Solar Calculator for India. Find out how many solar panels fit your roof and start generating clean, free power today.",
  howToUseSteps: [
    "Choose whether you want to calculate your solar requirements by your Monthly Electricity Bill (₹) or Average Units Consumed (kWh).",
    "Enter your average monthly power bill or monthly units.",
    "Input your average electricity tariff rate per unit (default ₹7.50/kWh for urban Indian residential DISCOMs).",
    "Specify your available shadow-free rooftop area in square feet.",
    "Keep the PM Surya Ghar Subsidy toggle enabled to include central government financial assistance.",
    "Optionally fine-tune the turnkey installation cost per kW (standard market rate is ₹55,000 to ₹65,000 per kW).",
    "Click Calculate to get your recommended system capacity in kW, subsidy amount, net cost, annual savings, payback timeline, and 25-year return on investment.",
  ],
  formula:
    "Solar capacity sizing starts with daily household electricity demand: Monthly Units Consumed = Monthly Bill / Electricity Tariff. Required Daily Generation = Monthly Units / 30. In India, 1 kW of grid-connected rooftop solar produces approximately 4.0 kWh (units) of electricity per day across 300 sunny days annually. Recommended Capacity (kW) = Daily Generation / 4.0. Required Shadow-Free Roof Space (sq ft) = Capacity (kW) × 100 sq ft. Gross System Cost = Capacity (kW) × Installation Cost per kW. Central Subsidy under PM Surya Ghar Muft Bijli Yojana: ₹30,000 for 1 kW; ₹60,000 for 2 kW; and ₹78,000 for systems 3 kW or greater. Net Investment = Gross Cost − Central Subsidy. Annual Electricity Savings = Annual Generation (Units) × Tariff Rate. Payback Period (Years) = Net Investment / Annual Savings. Lifetime 25-year savings factor in standard 0.7% annual solar panel degradation alongside a conservative 3% annual grid tariff inflation.",
  workedExample: {
    description:
      "A family living in an independent house in Pune pays an average monthly electricity bill of ₹3,000 at a residential tariff of ₹7.50 per unit. They have 450 sq ft of shadow-free terrace space and install an on-grid residential solar power plant under PM Surya Ghar Muft Bijli Yojana.",
    table: [
      { label: "Monthly Electricity Consumption", value: "400 kWh (units) per month" },
      { label: "Recommended System Size", value: "3.5 kW grid-tied solar system" },
      { label: "Roof Space Required", value: "350 sq ft (out of 450 sq ft available)" },
      { label: "Daily Generation Output", value: "14.0 kWh (units) / day" },
      { label: "Annual Clean Power Generated", value: "5,110 kWh (units) / year" },
      { label: "Turnkey Installation Cost (@ ₹60,000/kW)", value: "₹2,10,000 gross expense" },
      { label: "PM Surya Ghar Central Subsidy", value: "₹78,000 fixed central assistance" },
      { label: "Net Out-of-Pocket Investment", value: "₹1,32,000 (Gross − Subsidy)" },
      { label: "Estimated Annual Power Savings", value: "₹37,800 per year" },
      { label: "Financial Payback Period", value: "3.5 Years" },
      { label: "25-Year Cumulative Savings", value: "₹12,40,000+ net lifetime profit" },
    ],
  },
  quickReferenceTable: {
    title: "PM Surya Ghar Slabs, System Capacities & Generation Reference",
    headers: ["System Size", "Daily Units", "Monthly Units", "Roof Space Required", "PM Surya Ghar Subsidy", "Avg Net Cost"],
    rows: [
      ["1 kW System", "4 units", "120 units", "100 sq ft", "₹30,000", "₹25,000 to ₹35,000"],
      ["2 kW System", "8 units", "240 units", "200 sq ft", "₹60,000", "₹55,000 to ₹70,000"],
      ["3 kW System", "12 units", "360 units", "300 sq ft", "₹78,000 (Max Cap)", "₹95,000 to ₹1,15,000"],
      ["4 kW System", "16 units", "480 units", "400 sq ft", "₹78,000", "₹1,50,000 to ₹1,75,000"],
      ["5 kW System", "20 units", "600 units", "500 sq ft", "₹78,000", "₹2,05,000 to ₹2,35,000"],
      ["10 kW System", "40 units", "1,200 units", "1,000 sq ft", "₹78,000", "₹4,80,000 to ₹5,40,000"],
    ],
  },
  mistakes: [
    "Ignoring shadow obstacles on your terrace: Water tanks, staircase mumties, neighboring high-rises, and parapet walls cast moving shadows. Even partial shade on a single cell can choke an entire panel string under central string inverters. Use elevated mounting structures or micro-inverters if shadows exist.",
    "Over-sizing beyond your DISCOM sanctioned load: Most Indian state electricity distribution companies (DISCOMs) permit net-metered rooftop solar capacity up to 80% to 100% of your sanctioned connected load. Verify your latest power bill's sanctioned kW before purchasing equipment.",
    "Buying non-DCR (Domestic Content Requirement) modules when applying for government subsidy: Under MNRE and PM Surya Ghar guidelines, central financial assistance is exclusively disbursed for systems utilizing ALMM-listed solar cells and modules manufactured in India.",
    "Failing to plan for module cleaning and water tap access: Indian ambient dust and particulate pollution reduce solar panel efficiency by 15% to 25% if left unwashed. Ensure convenient rooftop tap access to wipe panels every fortnight.",
    "Assuming off-grid battery systems are economical for urban homes: Battery replacement every 4 to 6 years nearly doubles long-term operational costs. For areas with over 95% grid availability, on-grid net metering delivers vastly superior payback.",
  ],
  faqs: [
    {
      q: "What is the PM Surya Ghar Muft Bijli Yojana subsidy amount in 2024–2026?",
      a: "Under the PM Surya Ghar Muft Bijli Yojana launched by the Government of India, residential rooftop solar systems receive a direct bank transfer (DBT) subsidy of ₹30,000 for a 1 kW system, ₹60,000 for a 2 kW system, and a maximum cap of ₹78,000 for systems of 3 kW or higher.",
    },
    {
      q: "How many solar panels do I need to run a 1.5 ton AC?",
      a: "A 5-star 1.5-ton inverter air conditioner consumes approximately 1.2 to 1.5 units (kWh) of electricity per hour of operation. Running it for 6 to 8 hours daily requires about 8 to 10 units, which is generated comfortably by a 2.5 kW to 3 kW rooftop solar system (roughly 5 to 6 modern 540W mono-PERC panels).",
    },
    {
      q: "How does net metering work in India?",
      a: "With an on-grid net metering connection, your DISCOM replaces your existing energy meter with a bi-directional meter. During sunny daylight hours, excess solar energy generated beyond your immediate household usage is exported to the municipal grid. At night, you draw grid power. Your monthly bill reflects only the net difference (Units Consumed − Units Exported).",
    },
    {
      q: "How much shadow-free roof area is required for 1 kW of solar?",
      a: "As a standard rule of thumb, each 1 kW of rooftop solar requires approximately 80 to 100 square feet of shadow-free south-facing terrace space. Higher efficiency mono-PERC or TopCon panels (540W to 580W each) require slightly less surface area compared to older poly-crystalline panels.",
    },
    {
      q: "What is the average payback period for residential solar in India?",
      a: "With the PM Surya Ghar central subsidy and standard residential electricity tariffs of ₹7 to ₹9 per unit, the average payback period for a residential on-grid rooftop solar plant is between 3 to 4.5 years. Because modern panels carry a 25-year performance warranty, the system provides over 20 years of essentially free electricity.",
    },
    {
      q: "Do solar panels generate electricity on cloudy or rainy days?",
      a: "Yes, solar photovoltaic panels generate power using diffused daylight even on overcast or monsoon days, though generation drops to roughly 20% to 40% of their peak summer output. Net metering balances these seasonal dips using electricity grid credits.",
    },
    {
      q: "Which power, finance, and home planning tools work well with this calculator?",
      a: "Audit your current power consumption with our <a href=\"/calculator/home-electricity-bill-calculator\" class=\"text-primary hover:underline font-medium\">Home Electricity Bill Calculator</a>, convert your plot measurements using the <a href=\"/calculator/land-area-converter\" class=\"text-primary hover:underline font-medium\">Land Area Converter</a>, and compute structural foundation requirements with the <a href=\"/calculator/cement-bag-calculator\" class=\"text-primary hover:underline font-medium\">Cement Bag Calculator</a>.",
    },
  ],
  relatedSlugs: [
    "home-electricity-bill-calculator",
    "land-area-converter",
    "cement-bag-calculator",
    "paint-calculator",
  ],
};
