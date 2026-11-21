import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The Goods and Services Tax (GST) calculator computes tax liabilities, taxable base amounts, and invoice totals for businesses, consumers, freelancers, and accounting professionals in India. Established under the historic 'One Nation, One Tax' reform in 2017, GST applies across standardized tax slabs: 0%, 5%, 12%, 18%, and 28%. This tool operates in two essential modes: GST Exclusive (adding GST to a net base price) and GST Inclusive (extracting the embedded tax component from a gross sticker price), while automatically splitting the tax into CGST and SGST for intra-state sales or IGST for inter-state transactions.",

  howItWorks:
    "To compute GST, select your calculation mode and provide transaction values:\n\n1. Mode Selection:\n   - GST Exclusive: Add tax to a net price to determine the total invoice amount payable by the buyer.\n   - GST Inclusive: Reverse-calculate from a gross price to find the pre-tax base cost and exact tax collected.\n2. Amount (₹): Enter the base price or MRP invoice total in Indian Rupees.\n3. GST Rate (%): Select standard Indian GST slabs (5%, 12%, 18%, 28%) or type a customized rate for specialized goods like precious metals (3% for gold and silver, 0.25% for cut diamonds).\n4. Transaction Type: Select Intra-State (within same state: split evenly into Central CGST and State SGST) or Inter-State (between different states: billed as Integrated IGST).\n\nClick Calculate to view the taxable base value, GST amount, CGST/SGST split, and final billing total.",

  formula:
    "The calculator applies standard Indian indirect tax accounting formulas:\n\n1. GST Exclusive (Adding GST to Base Amount):\n- GST Amount = (Base Amount × GST Rate) / 100\n- Final Total Amount = Base Amount + GST Amount\n\n2. GST Inclusive (Extracting GST from Gross Price):\n- Base Taxable Amount = Gross Amount / [1 + (GST Rate / 100)]\n- GST Amount = Gross Amount − Base Taxable Amount\n\n3. Tax Component Distribution:\n- Intra-State Sales (Within State):\n  CGST (Central GST) = GST Amount / 2\n  SGST (State GST) = GST Amount / 2 (or UTGST for Union Territories)\n- Inter-State Sales (Between Different States):\n  IGST (Integrated GST) = Full GST Amount\n\nPrecious Metal Specific Slabs (Gold/Silver): Standard rate is 3% GST on metal value and 5% GST on making charges.",

  example:
    "Example 1 - GST Exclusive (Adding Tax):\nA freelance digital marketer bills a client ₹10,000 for consulting services at standard 18% GST (Intra-state transaction):\n- Base Amount: ₹10,000\n- GST Rate: 18%\n- Total GST Amount = (10,000 × 18) / 100 = ₹1,800\n- Tax Split: CGST (9%) = ₹900, SGST (9%) = ₹900\n- Final Invoice Amount = ₹10,000 + ₹1,800 = ₹11,800\n\nExample 2 - GST Inclusive (Extracting Tax):\nA consumer purchases an electronic device with an all-inclusive retail MRP of ₹11,800 (18% GST slab):\n- Gross Invoice Amount: ₹11,800\n- Base Pre-Tax Amount = 11,800 / 1.18 = ₹10,000\n- Embedded GST Collected = ₹11,800 − ₹10,000 = ₹1,800\n- Tax Split: CGST = ₹900, SGST = ₹900",

  mistakes:
    "1. Multiplying gross inclusive price by tax rate directly: Calculating 18% of ₹11,800 gives ₹2,124, which is mathematically incorrect; you must divide by 1.18 to extract the true ₹1,800 tax component.\n2. Biling CGST and SGST on inter-state sales: When selling to a client registered in another Indian state, you must bill Integrated GST (IGST), not CGST/SGST.\n3. Claiming Input Tax Credit (ITC) without matching GSTR-2B: Claiming input tax credit for vendor purchases without the supplier filing GSTR-1 and appearing in your GSTR-2B leads to statutory tax notices and interest penalties under Section 50.\n4. Applying wrong GST rates on composite supplies: Mixed supplies must be classified under correct Harmonized System of Nomenclature (HSN) or Service Accounting Codes (SAC).\n5. Forgetting that e-invoicing is mandatory for eligible businesses: Businesses exceeding statutory aggregate turnover thresholds must generate real-time Invoice Reference Numbers (IRN) on the government portal.",

  faqs: [
    {
      question: "What are the four primary GST tax slabs in India?",
      answer:
        "The primary GST slabs in India are 5% (essential household items, basic transport, packaged food), 12% (processed foods, business software), 18% (most commercial services, industrial goods, capital equipment), and 28% (luxury items, automobiles, aerated beverages). Gold carries a special 3% rate.",
    },
    {
      question: "What is the difference between CGST, SGST, and IGST?",
      answer:
        "CGST (Central GST) and SGST (State GST) apply to intra-state transactions within the same state, splitting revenue equally between the central and state governments. IGST (Integrated GST) applies to inter-state sales between different states or import goods, collected by the Centre and shared with the destination state.",
    },
    {
      question: "What is Input Tax Credit (ITC)?",
      answer:
        "Input Tax Credit allows GST-registered businesses to reduce the tax they owe on sales by the amount of GST they have already paid on business-related purchases of raw materials, capital goods, and services, preventing cascading 'tax on tax'.",
    },
    {
      question: "Is GST mandatory for small businesses and freelancers?",
      answer:
        "In India, GST registration is mandatory if your annual aggregate turnover exceeds ₹40 Lakhs for goods (₹20 Lakhs in special category states) or ₹20 Lakhs for service providers and freelancers (₹10 Lakhs in special category states). It is also mandatory for anyone selling interstate or via e-commerce.",
    },
    {
      question: "How do I calculate GST on discounted products?",
      answer:
        "GST is legally calculated on the net transaction value after subtracting trade discounts. For example, if a ₹1,000 shirt has a 20% discount (₹800 net price), 5% GST is applied to the discounted ₹800, adding ₹40 for a total of ₹840.",
    },
  ],

  authorityLinks: [
    { text: "Goods and Services Tax Council", url: "https://gstcouncil.gov.in/" },
    { text: "Central Board of Indirect Taxes and Customs (CBIC)", url: "https://cbic-gst.gov.in/" },
    { text: "Official GST Portal of India", url: "https://www.gst.gov.in/" },
  ],

  relatedCalculators: ["gst-invoice-calculator", "product-profit-calculator", "credit-card-emi-calculator", "percentage-calculator"],
  lastReviewed: "2026-11-21",
};

export default content;
