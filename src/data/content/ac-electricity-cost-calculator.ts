import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The AC Electricity Cost Calculator calculates the power consumption and operating expenses of room air conditioners in India. It models costs across 1-Ton, 1.5-Ton, and 2-Ton capacities, inverter vs non-inverter technologies, and BEE Star ratings (1-Star to 5-Star) to help you choose energy-efficient cooling and minimize summer power bills.",

  howItWorks:
    "Select your AC tonnage (1T, 1.5T, or 2T), compressor type (Inverter vs Fixed Speed), and BEE Star rating (or ISEER rating). Enter daily usage hours, operational months per year, and electricity tariff per unit (₹/kWh). The calculator computes realistic hourly, monthly, and seasonal operating costs.",

  formula:
    "AC Power Consumption Formula:\n\nCooling Capacity (Watts) ÷ ISEER = Input Power (Watts)\n\nDaily Energy (kWh / Units) = [ Input Power (Watts) × Compressor Duty Cycle (0.6 to 0.7 for Inverter) × Daily Hours ] ÷ 1,000\n\nMonthly Cost (₹) = Daily Units × 30 days × Electricity Tariff (₹ per Unit)",

  example:
    "A 1.5-Ton 5-Star Inverter AC (ISEER 5.0) running for 8 hours daily at ₹7.50 per unit in summer:\n- Average Power Draw: ~850 Watts (accounting for inverter thermostat modulating)\n- Daily Units Consumed: (850 × 8) ÷ 1,000 = 6.8 kWh (Units)\n- Monthly Electricity Cost: 6.8 × 30 × ₹7.50 = ₹1,530",

  mistakes:
    "A common mistake is setting the thermostat to 18°C hoping it cools faster; ACs cool at the same rate regardless of target temperature. Setting your thermostat to BEE's recommended 24°C saves up to 24% in electricity consumption compared to 18°C.",

  faqs: [
    {
      question: "How does AC usage impact my total household electricity bill?",
      answer:
        'During Indian summer months, air conditioning often accounts for 50% to 70% of total household power consumption, easily pushing your usage into higher-priced tariff slabs. To estimate your overall bill including tier slabs and meter fees, check our <a href="/calculator/home-electricity-bill-calculator" class="text-primary hover:underline">Home Electricity Bill Calculator</a>.',
    },
    {
      question: "How can I compare AC costs with other heavy appliances like water heaters?",
      answer:
        'You can evaluate and compare power consumption across refrigerators, geysers, microwaves, and washing machines using our dedicated <a href="/calculator/appliance-electricity-cost-calculator" class="text-primary hover:underline">Appliance Electricity Cost Calculator</a>.',
    },
  ],

  authorityLinks: [
    {
      text: "Bureau of Energy Efficiency (BEE) India Air Conditioner Standards",
      url: "https://beeindia.gov.in/",
    },
  ],

  relatedCalculators: [
    "home-electricity-bill-calculator",
    "appliance-electricity-cost-calculator",
    "percentage-calculator",
  ],
};

export default content;
