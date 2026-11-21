import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The product profit calculator computes net profitability, gross profit margins, retail markups, and break-even selling prices for e-commerce sellers, retail store owners, manufacturers, and direct-to-consumer (D2C) brands. Selling products online or offline involves numerous hidden expenses: raw manufacturing costs, packaging, shipping freight, marketplace commissions (Amazon, Flipkart, Shopify), payment gateway transaction fees (2% + GST), marketing spend, and Goods and Services Tax (GST). This tool consolidates your complete cost structure to ensure every unit sold yields a sustainable, positive net margin.",

  howItWorks:
    "Calculating product profitability follows a structured financial input framework:\n\n1. Core Product Economics: Enter Cost Price (CP) per unit and Planned Selling Price (SP) per unit in Indian Rupees, along with Order Quantity.\n2. Ancillary Packaging & Shipping (Optional): Add per-unit packaging material costs and shipping charges.\n3. Platform & Marketplace Fees (Optional): Input platform referral fees (e.g. 8% to 15% for e-commerce marketplaces) and payment gateway charges (standard 2%).\n4. Marketing & Advertising: Factor in Customer Acquisition Cost (CAC) or ad spend per unit.\n5. Discounts & GST (Optional): Toggle promotional discounts and specify whether your selling price is inclusive or exclusive of GST.\n\nClick Calculate to view your profit per unit, total order profit, profit margin percentage, markup percentage, and break-even floor price.",

  formula:
    "The calculator applies standard commercial accounting equations:\n\n1. Total Cost Per Unit:\nTotal Cost = Cost Price + Packaging + Allocated Shipping + Marketing (CAC) + Platform Commission + Gateway Fees\n\n2. Profit Per Unit:\nProfit = Actual Selling Price (Net of GST and Discounts) − Total Cost Per Unit\n\n3. Profit Margin vs. Markup (Crucial Distinction):\n- Profit Margin (%) = (Profit Per Unit / Selling Price) × 100\n  (Measures what percentage of total customer revenue is kept as profit)\n- Markup (%) = (Profit Per Unit / Total Cost Per Unit) × 100\n  (Measures the percentage added on top of the cost price to arrive at the selling price)\n\n4. Total Order Profit:\nTotal Profit = Profit Per Unit × Total Quantity\n\n5. Break-Even Price:\nBreak-Even Price = Total Cost Per Unit\n(The exact price below which your business incurs a net cash loss on the transaction).",

  example:
    "Consider an Indian direct-to-consumer e-commerce brand manufacturing handcrafted apparel:\n- Cost Price (CP): ₹500 per unit\n- Selling Price (SP): ₹800 per unit\n- Order Quantity: 10 units\n- Additional Expenses: None (simplified baseline model)\n\nFinancial Breakdown:\n- Total Sales Revenue = ₹800 × 10 = ₹8,000\n- Total Product Cost = ₹500 × 10 = ₹5,000\n- Total Net Profit = ₹8,000 − ₹5,000 = ₹3,000\n- Profit Per Unit = ₹800 − ₹500 = ₹300 per piece\n\nMargin & Markup Metrics:\n- Profit Margin = (₹300 / ₹800) × 100 = 37.50%\n- Markup Percentage = (₹300 / ₹500) × 100 = 60.00%\n- Break-Even Selling Price = ₹500\n\nEvery ₹100 earned in revenue generates ₹37.50 in net profit, achieved by applying a 60% markup over base production cost.",

  mistakes:
    "1. Confusing profit margin with markup: Believing that adding a 50% markup on cost produces a 50% margin (it actually produces a 33.3% margin) leads to dangerous underpricing of inventory.\n2. Forgetting customer returns and RTO (Return to Origin) freight: In Indian e-commerce, Cash on Delivery (COD) orders frequently suffer 15% to 25% RTO rates; failing to build reverse logistics costs into pricing destroys margins.\n3. Ignoring 18% GST on platform commissions and gateway fees: Payment gateways charge 2% plus 18% GST, and marketplaces charge referral commissions plus GST, eroding net revenue.\n4. Omitting packaging and handling costs: Bubble wrap, branded corrugated boxes, security tape, and labor add ₹20 to ₹60 per order that cannot be overlooked.\n5. Discounting below break-even during holiday sales: Running flash sales without knowing your exact break-even floor price causes high sales volume to paradoxically increase financial business losses.",

  faqs: [
    {
      question: "What is a healthy profit margin for a retail or e-commerce business?",
      answer:
        "For direct-to-consumer (D2C) brands, a gross profit margin of 50% to 70% is recommended to absorb marketing customer acquisition costs (CAC) and platform fees, leaving a net profit margin of 15% to 25%. For wholesale businesses with low overhead, net margins of 8% to 12% are common.",
    },
    {
      question: "Why is markup always higher than profit margin?",
      answer:
        "Markup is calculated on the smaller base (the cost price), while margin is calculated on the larger base (the selling price). For example, if cost is ₹100 and price is ₹200 (profit ₹100), markup is 100%, but profit margin is 50%.",
    },
    {
      question: "What is Return to Origin (RTO) and how does it hurt profit?",
      answer:
        "RTO occurs when a buyer rejects or fails to accept a shipped package (especially COD orders). The seller must pay forward courier freight, reverse transit shipping, and absorb damaged packaging without earning any sales revenue.",
    },
    {
      question: "How do payment gateway fees work in India?",
      answer:
        "Indian payment gateways (like Razorpay, Cashfree, or PayU) standardly charge a 2% transaction fee on debit/credit card and netbanking transactions, plus an 18% GST on that fee (effective fee of 2.36%). UPI transactions are often zero-rated or billed at reduced merchant rates.",
    },
    {
      question: "How do I calculate break-even quantity?",
      answer:
        "To find how many units you must sell to cover fixed monthly overheads (like warehouse rent and salaries), divide your Total Fixed Costs by your Profit Contribution Per Unit (Selling Price minus Variable Cost per unit).",
    },
  ],

  authorityLinks: [
    { text: "Ministry of Micro, Small and Medium Enterprises (MSME)", url: "https://msme.gov.in/" },
    { text: "Department for Promotion of Industry and Internal Trade (DPIIT)", url: "https://dpiit.gov.in/" },
  ],

  relatedCalculators: ["gst-calculator", "gst-invoice-calculator", "percentage-calculator", "standard-calculator"],
  lastReviewed: "2026-11-21",
};

export default content;
