import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The Home Electricity Bill Calculator estimates your total monthly and bi-monthly residential electricity charges across Indian states (such as Maharashtra, Delhi, Karnataka, Tamil Nadu, Gujarat, and Uttar Pradesh). It accounts for graded telescopic tariff slabs, fixed meter charges, electricity duty, and fuel surcharge adjustments (FPPCA).",

  howItWorks:
    "Enter your monthly consumption in units (kWh) or select your state to apply official DISCOM tariff slabs. The calculator applies progressive tiered billing rates to compute energy charges, adds fixed monthly meter fees and state duties, and produces a complete itemized electricity bill.",

  formula:
    "Telescopic Slab Tariff Billing:\n\nTotal Energy Charges = ∑ (Units in Slab_i × Rate_i)\n\nFinal Bill = Total Energy Charges + Fixed Monthly Meter Charges + Electricity Duty (%) + Regulatory Surcharges",

  example:
    "Consuming 250 units in a state with slabs: 0–100 units @ ₹3.50, 101–200 units @ ₹5.50, 201+ units @ ₹7.50, plus ₹100 fixed charge:\n- First 100 units: 100 × ₹3.50 = ₹350\n- Next 100 units: 100 × ₹5.50 = ₹550\n- Next 50 units: 50 × ₹7.50 = ₹375\n- Energy Charges: ₹1,275\n- Fixed Charges: ₹100\n- Estimated Total Bill: ₹1,375 (plus local duty)",

  mistakes:
    "A frequent misconception is assuming that crossing into a higher tariff bracket applies the higher rate to all units consumed. Indian residential tariffs are telescopic, meaning each slab rate applies only to units within that specific band.",

  faqs: [
    {
      question: "How can I pinpoint which appliances are driving up my electricity bill?",
      answer:
        'To isolate high-consumption devices, check the wattage and hours of use for each item in your home. Heavy consumers like geysers, refrigerators, and washing machines can be evaluated individually with our <a href="/calculator/appliance-electricity-cost-calculator" class="text-primary hover:underline">Appliance Electricity Cost Calculator</a>.',
    },
    {
      question: "How much does running an air conditioner add to my monthly power bill?",
      answer:
        'Running a 1.5-ton 3-star AC for 8 hours daily typically consumes 8 to 10 units per day, adding ₹1,800 to ₹2,500 to your monthly bill depending on your state tariff. You can compare inverter versus non-inverter models and star ratings using our <a href="/calculator/ac-electricity-cost-calculator" class="text-primary hover:underline">AC Electricity Cost Calculator</a>.',
    },
  ],

  authorityLinks: [
    {
      text: "Ministry of Power Government of India Consumer Energy Portal",
      url: "https://powermin.gov.in/",
    },
  ],

  relatedCalculators: [
    "appliance-electricity-cost-calculator",
    "ac-electricity-cost-calculator",
    "percentage-calculator",
  ],
};

export default content;
