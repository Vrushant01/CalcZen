import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The Appliance Electricity Cost Calculator estimates the power consumption and electricity expenses of individual household electrical devices in India. By selecting appliances like refrigerators, geysers, washing machines, and televisions, you can determine daily, monthly, and annual running costs based on your state's electricity tariff per unit (kWh).",

  howItWorks:
    "Select an appliance from the library or enter custom wattage ratings. Input your average daily usage in hours and your local electricity tariff per unit (₹/kWh). The calculator converts wattage and operating hours into electricity units (kWh) and applies your tariff to calculate exact electricity bills.",

  formula:
    "Electrical Energy Consumption & Cost Formula:\n\nDaily Energy (kWh / Units) = [ Power Rating (Watts) × Usage Hours per Day ] ÷ 1,000\n\nMonthly Units (kWh) = Daily Energy × 30 days\n\nMonthly Running Cost (₹) = Monthly Units (kWh) × Electricity Tariff (₹ per Unit)",

  example:
    "A 2,000-Watt water heater (geyser) running for 1.5 hours daily at ₹7.50 per unit:\n- Daily Consumption: (2,000 × 1.5) ÷ 1,000 = 3.0 kWh (Units)\n- Monthly Consumption: 3.0 × 30 = 90 Units\n- Monthly Electricity Bill: 90 × ₹7.50 = ₹675.00",

  mistakes:
    "A common error is confusing peak wattage ratings with actual operational power draw. Thermostatically controlled devices like inverter refrigerators and air conditioners run at maximum wattage only when cooling, then throttle down. Calculate comprehensive household totals with our Home Electricity Bill Calculator.",

  faqs: [
    {
      question: "How do I calculate my complete monthly house electricity bill?",
      answer:
        'While this tool calculates individual appliance expenses, your utility bill applies tiered slab tariffs and fixed meter charges. To estimate your whole-house monthly bill across all rooms and appliances with state-wise tariff slabs, use our <a href="/calculator/home-electricity-bill-calculator" class="text-primary hover:underline">Home Electricity Bill Calculator</a>.',
    },
    {
      question: "Which household appliances consume the most electricity?",
      answer:
        'In typical Indian homes, heating and cooling appliances consume the largest portion of electricity: air conditioners (1,500W–2,500W), water geysers (2,000W), and induction cooktops. For a detailed breakdown of AC running costs across 1-ton, 1.5-ton, and 2-ton models with star ratings, check our <a href="/calculator/ac-electricity-cost-calculator" class="text-primary hover:underline">AC Electricity Cost Calculator</a>.',
    },
  ],

  authorityLinks: [
    {
      text: "Bureau of Energy Efficiency (BEE) Star Rating Energy Standards",
      url: "https://beeindia.gov.in/",
    },
  ],

  relatedCalculators: [
    "home-electricity-bill-calculator",
    "ac-electricity-cost-calculator",
    "percentage-calculator",
  ],
};

export default content;
