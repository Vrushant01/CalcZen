import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The GST invoice calculator generates itemized commercial tax invoice breakdowns for Indian small and medium enterprises (MSMEs), wholesale distributors, retailers, and independent contractors. It computes line-item subtotal values, applies item-level or overall commercial trade discounts, calculates Goods and Services Tax (GST) across statutory tax rates (0%, 5%, 12%, 18%, 28%), and splits tax balances into Central CGST, State SGST, or Integrated IGST. Designed in conformity with statutory invoice rules under the Central Goods and Services Tax (CGST) Rules, it provides a transparent calculation of invoice grand totals and itemized tax schedules.",

  howItWorks:
    "To generate an itemized GST invoice breakdown, enter your commercial billing details:\n\n1. Item Rows: Add one or more product or service line items, specifying item description, quantity, and unit price in Indian Rupees.\n2. Trade Discount: Apply item-level percentage discounts or cash allowances to determine taxable transaction values.\n3. Tax Slabs: Select the statutory GST rate (5%, 12%, 18%, 28%) or custom rate (e.g. 3% for precious jewellery) applicable to the specific HSN or SAC code.\n4. Transaction Classification: Select Intra-State (within same state: split into equal CGST and SGST portions) or Inter-State (between different states: integrated IGST).\n5. Shipping & Handling (Optional): Add delivery charges or packaging fees subject to composite supply tax rates.\n\nClick Calculate to review your itemized tax invoice summary, aggregate taxable amount, total tax liability, and rounded invoice grand total.",

  formula:
    "The calculator applies standard Indian tax invoicing mathematics under CGST Section 15:\n\nFor each line item i:\n- Line Subtotal_i = Unit Price_i × Quantity_i\n- Discount Amount_i = Line Subtotal_i × (Discount %_i / 100)\n- Taxable Value_i = Line Subtotal_i − Discount Amount_i\n- Line GST_i = Taxable Value_i × (GST Rate_i / 100)\n- Line Total_i = Taxable Value_i + Line GST_i\n\nInvoice Aggregate Totals:\n- Gross Invoice Subtotal = ∑ Line Subtotal_i\n- Total Commercial Discounts = ∑ Discount Amount_i\n- Net Taxable Value = ∑ Taxable Value_i\n- Total Central GST (CGST) = (∑ Line GST_i) / 2 (for intra-state supplies)\n- Total State GST (SGST) = (∑ Line GST_i) / 2 (for intra-state supplies)\n- Total Integrated GST (IGST) = ∑ Line GST_i (for inter-state supplies)\n- Final Invoice Grand Total = Net Taxable Value + Total GST + Ancillary Freight Charges",

  example:
    "Consider an Indian wholesale supplier invoicing 5 units of industrial equipment to an intra-state business client:\n- Product: Industrial Valve Units\n- Quantity: 5 units\n- Unit Price: ₹1,000 per unit\n- Trade Discount: 0%\n- Applicable GST Rate: 18% (Intra-state transaction)\n\nMathematical Breakdown:\n- Line Subtotal = 5 × ₹1,000 = ₹5,000\n- Net Taxable Transaction Value = ₹5,000\n- Total GST (18%) = ₹5,000 × 0.18 = ₹900\n- Central GST (CGST @ 9%) = ₹450\n- State GST (SGST @ 9%) = ₹450\n- Invoice Grand Total = ₹5,000 + ₹900 = ₹5,900\n\nBoth buyer and seller retain clear visibility into the ₹5,000 taxable base and the ₹900 eligible Input Tax Credit (ITC).",

  mistakes:
    "1. Omitting the mandatory HSN or SAC classification: Tax invoices without required 4-digit, 6-digit, or 8-digit HSN/SAC codes based on turnover violate Section 31 statutory invoicing standards.\n2. Calculating GST on prices before applying trade discounts: Section 15(3) of the CGST Act mandates that discounts recorded on the invoice must be deducted before computing GST.\n3. Mixing intra-state and inter-state tax headers: Invoicing CGST/SGST on an interstate shipment invalidates the recipient's ability to claim Input Tax Credit in GSTR-2B.\n4. Forgetting GST on freight and packaging charges: Delivery and packing charges are composite supplies bundled with principal goods, attracting tax at the principal item's GST rate.\n5. Failing to display the customer's active GSTIN on B2B invoices: B2B invoices lacking the buyer's 15-digit GSTIN will be treated as unregistered B2C transactions, preventing ITC claims.",

  faqs: [
    {
      question: "What mandatory details must be present on a valid GST tax invoice in India?",
      answer:
        "Under Rule 46 of the CGST Rules, a valid tax invoice must include: Supplier name, address, and GSTIN; consecutive alphanumeric serial number; date of issue; recipient details and GSTIN (for registered buyers); HSN/SAC code; item description, quantity, and unit rate; total taxable value; GST rates and segregated CGST, SGST, or IGST amounts; and signature or digital authentication.",
    },
    {
      question: "What is the difference between a Tax Invoice and a Bill of Supply?",
      answer:
        "A Tax Invoice is issued by regular GST-registered businesses selling taxable goods or services, enabling the buyer to claim Input Tax Credit (ITC). A Bill of Supply is issued by Composition Scheme taxpayers or businesses dealing exclusively in exempt goods, where no tax can be charged to the buyer.",
    },
    {
      question: "How does invoice rounding work under GST?",
      answer:
        "Under Section 170 of the CGST Act, the final tax amount and total invoice value can be rounded off to the nearest Indian Rupee. Amounts of 50 paise or more are rounded up to the next rupee, and amounts under 50 paise are rounded down.",
    },
    {
      question: "When is e-invoicing mandatory for Indian businesses?",
      answer:
        "Under current CBIC notifications, e-invoicing is mandatory for all businesses whose aggregate annual turnover in any preceding financial year exceeded ₹5 Crores for B2B supplies and exports. Invoices must be registered on the Invoice Registration Portal (IRP) to obtain an IRN and QR code.",
    },
    {
      question: "How does post-sale cash discount affect an issued GST invoice?",
      answer:
        "Post-sale discounts agreed upon after invoice issuance cannot be changed on the original invoice. Instead, the seller must issue a formal GST Credit Note under Section 34, referencing the original invoice number, to adjust tax liabilities.",
    },
  ],

  authorityLinks: [
    { text: "Central Board of Indirect Taxes and Customs (CBIC) - GST Invoicing Rules", url: "https://cbic-gst.gov.in/" },
    { text: "Official GST Portal of India", url: "https://www.gst.gov.in/" },
  ],

  relatedCalculators: ["gst-calculator", "product-profit-calculator", "standard-calculator", "credit-card-emi-calculator"],
  lastReviewed: "2026-11-21",
};

export default content;
