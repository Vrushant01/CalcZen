import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The tip calculator calculates dining gratuities and divides restaurant, cafe, or travel bills evenly among multiple guests. Perfect for diners, international tourists traveling in India or abroad, and roommates dining out, it computes exact tip amounts based on custom percentages, presents the total payable bill, and breaks down the per-person financial obligation. In addition, it provides transparent legal guidance on restaurant service charges in India under Central Consumer Protection Authority (CCPA) regulations.",

  howItWorks:
    "Splitting your bill with the tip calculator takes just a few seconds:\n\n1. Bill Amount: Enter the total subtotal before gratuity (e.g. food and beverage total before or after tax depending on regional tipping conventions).\n2. Tip Percentage (%): Choose a standard tip preset (e.g. 5%, 10%, 15%, 20%) or type a custom percentage matching the quality of service provided.\n3. Number of People: Specify how many individuals are splitting the check (default is 1 for individual payment).\n4. Currency Symbol: Switch between Rupee (₹), Dollar ($), Euro (€), or Pound (£) to suit domestic dining or international travel.\n\nClick Calculate to view the total gratuity amount, final aggregate invoice total, per-person share, and tip contribution per diner.",

  formula:
    "The calculator applies standard proportional gratuity and per-capita division equations:\n\n1. Tip Amount = Bill Amount × (Tip Percentage / 100)\n2. Total Bill with Tip = Bill Amount + Tip Amount\n3. Per Person Share = Total Bill with Tip / Number of People\n4. Tip Per Person = Tip Amount / Number of People\n\nImportant Consumer Law Context in India:\nUnder the Central Consumer Protection Authority (CCPA) guidelines issued by the Ministry of Consumer Affairs, hotels and restaurants are prohibited from levying service charges automatically or by default on food bills. Service charges are strictly voluntary, and consumers have the legal right to request the restaurant to remove any mandatory service charge line item before deciding whether to leave an optional tip.",

  example:
    "Consider a group of 4 friends dining out at a restaurant in Bangalore:\n- Pre-tip food bill: ₹2,400\n- Selected tip percentage: 10% (for attentive table service)\n- Number of guests: 4 people\n\nMathematical Breakdown:\n- Tip Amount = (₹2,400 × 10) / 100 = ₹240\n- Total Bill = ₹2,400 + ₹240 = ₹2,640\n- Total Per Person Share = ₹2,640 / 4 = ₹660 per diner\n- Tip Share Per Person = ₹240 / 4 = ₹60 per diner\n\nEach guest pays exactly ₹660 (₹600 for their food portion and ₹60 for their share of the server tip).",

  mistakes:
    "1. Double tipping on bills with pre-included service charges: Some restaurants still print a 5% to 10% 'service charge' on the bill. Adding an additional 10% tip results in double-paying gratuity unless you consciously intend to reward the server extra.\n2. Tipping on government taxes (GST): In India, food is subject to 5% GST (or 18% in luxury hotel properties). Gratuity is traditionally calculated on the pre-tax food and beverage subtotal, not on the post-tax amount.\n3. Failing to round off cash payments cleanly: Splitting non-round totals (e.g. ₹663.33) when paying with physical currency causes change hassles; use UPI for exact digital splits.\n4. Forgetting international cultural norms when traveling: While tipping 15% to 20% is customary in North America, tipping is uncommon and sometimes considered offensive in countries like Japan and South Korea.\n5. Omitting shared appetizers or corkage fees: When splitting evenly among friends who ordered disproportionately, discuss split adjustments beforehand to prevent dining conflicts.",

  faqs: [
    {
      question: "Is paying a service charge mandatory in restaurants in India?",
      answer:
        "No. The Central Consumer Protection Authority (CCPA) guidelines explicitly state that a service charge cannot be added automatically or by default to food and beverage bills. It is purely voluntary and optional. If a restaurant includes a service charge without your consent, you can legally ask them to remove it.",
    },
    {
      question: "What is the customary tipping percentage in India?",
      answer:
        "In Indian casual dining restaurants and cafes, a tip of 5% to 10% of the food subtotal is customary for satisfactory service. At high-end fine dining establishments, 10% is standard. For small eateries, street stalls, and delivery riders, rounding up the bill or tipping ₹20 to ₹50 is appreciated.",
    },
    {
      question: "Should tips be calculated on the pre-tax or post-tax amount?",
      answer:
        "Etiquette guidelines recommend calculating tips on the pre-tax subtotal of food and beverage items. Taxes (such as CGST and SGST) are government levies, not services rendered by restaurant staff.",
    },
    {
      question: "How do I split an uneven bill where some people ordered more?",
      answer:
        "While this calculator provides equal per-capita splits for convenience, for heavily uneven orders (e.g., alcohol vs. non-drinkers), calculate each person's exact subtotal first and apply the agreed tip percentage proportionally to each individual's portion.",
    },
    {
      question: "Can I tip digitally via UPI or credit card in India?",
      answer:
        "Yes, many restaurants allow you to add a tip to card terminals or provide a separate server UPI QR code. However, tipping cash directly to your server often ensures the funds reach the service staff immediately without administrative delays.",
    },
  ],

  authorityLinks: [
    { text: "Central Consumer Protection Authority (CCPA)", url: "https://consumeraffairs.nic.in/" },
    { text: "National Consumer Helpline (NCH)", url: "https://consumerhelpline.gov.in/" },
  ],

  relatedCalculators: ["gst-calculator", "percentage-calculator", "standard-calculator"],
  lastReviewed: "2026-11-21",
};

export default content;
