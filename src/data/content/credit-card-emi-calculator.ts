import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The credit card EMI calculator models the financial cost of converting outstanding credit card retail balances, large electronic purchases, or cash advances into monthly Equated Monthly Instalments (EMIs). Serving cardholders in India, it computes your exact monthly payment, total interest charges, and effective annual financing cost across tenures from 3 to 24 months. Crucially, it illustrates how high card interest rates (typically 14% to 24% for EMI conversions, compared to 36% to 42% for revolving unpaid balances) and statutory 18% GST on interest charges impact your household budget.",

  howItWorks:
    "To analyze a credit card balance conversion, provide the financing terms:\n\n1. Purchase / Balance Amount (₹): Enter the outstanding retail transaction amount or credit card balance to be converted into an EMI.\n2. Annual Interest Rate (%): Input the reducing balance interest rate offered by your card issuer (standard post-purchase EMI rates range from 13% to 18% p.a.).\n3. Loan Tenure: Select your repayment duration in months (commonly 3, 6, 9, 12, 18, or 24 months).\n4. Processing Fee (Optional): Enter any one-time processing fee charged by the bank (typically 1% to 2% + 18% GST).\n\nClick Calculate to view your monthly installment, cumulative interest expense, statutory GST liability, and full month-by-month amortization schedule.",

  formula:
    "The monthly EMI is computed using the standard reducing-balance amortization formula:\n\nEMI = [P × r × (1 + r)^n] / [(1 + r)^n − 1]\n\nwhere:\n- P = Principal transaction amount converted to EMI\n- r = Monthly interest rate = Annual Interest Rate / (12 × 100)\n- n = Loan repayment tenure in months\n\nCumulative Financing Cost Breakdown:\n- Total Repayment = EMI × n\n- Total Interest Paid = Total Repayment − P\n- Statutory GST on Interest (India): In India, an 18% Goods and Services Tax (GST) is levied on financial services, including credit card interest and processing fees under SAC 9971. Card statements bill 18% GST on the interest component of each monthly installment.\n- Total Out-of-Pocket Expense = Total Repayment + (Total Interest × 0.18) + Processing Fee with GST.",

  example:
    "Consider a cardholder in India converting an electronics purchase of ₹50,000 into a 12-month credit card EMI at an interest rate of 18.0% per annum:\n- Principal Amount (P): ₹50,000\n- Annual Interest Rate: 18.0% p.a.\n- Monthly Rate (r): 18 / 1200 = 0.015 (1.5% per month)\n- Tenure (n): 12 months\n\nMonthly EMI Calculation:\n- EMI = [50,000 × 0.015 × (1.015)^12] / [(1.015)^12 − 1]\n- EMI = [750 × 1.195618] / [0.195618] = 896.71 / 0.195618 ≈ ₹4,584 per month\n\nTotal Financing Cost:\n- Total 12-Month Payments = ₹4,584 × 12 = ₹55,008\n- Total Interest Paid = ₹55,008 − ₹50,000 = ₹5,008\n- Statutory GST on Interest (18%) = ₹5,008 × 0.18 ≈ ₹901\n- Effective Net Cost of Financing = ₹55,909 (excluding initial bank processing fees)",

  mistakes:
    "1. Paying only the 'Minimum Amount Due': Paying the minimum 5% due on a credit card statement does not convert the debt to an EMI; instead, it subjects the entire remaining balance to punitive revolving interest rates of 36% to 42% p.a. from the transaction date.\n2. Forgetting the 18% GST levied on credit card interest: Indian credit card statements add 18% GST to the interest portion of every monthly installment, raising the effective borrowing cost beyond the quoted interest rate.\n3. Blocking your credit limit during the EMI tenure: When you convert ₹50,000 to an EMI, your available credit limit is immediately reduced by ₹50,000 and is restored only incrementally as monthly principal is repaid.\n4. Preclosing the EMI without checking foreclosure fees: Many card issuers charge a 3% foreclosure fee plus 18% GST if you pay off the remaining EMI balance early.\n5. Falling for 'No Cost EMI' processing fee traps: Merchant subvention may offset the interest amount, but banks still levy processing fees (₹199 to ₹299 + GST) and charge GST on the interest discount.",

  faqs: [
    {
      question: "How does 'No Cost EMI' actually work in India?",
      answer:
        "Under Reserve Bank of India (RBI) regulations, zero-interest loans are prohibited. In a 'No Cost EMI', the merchant provides an upfront discount equal to the total interest the bank will charge over the tenure. However, cardholders must still pay 18% GST on that interest amount, meaning a 'No Cost EMI' is rarely 100% free.",
    },
    {
      question: "What is the difference between merchant EMI and post-purchase bank EMI?",
      answer:
        "A merchant EMI is selected at online or store checkout, often featuring promotional interest subsidies or zero processing fees. A post-purchase EMI is initiated through your banking app after the transaction has posted, typically carrying standard bank interest rates (14% to 18%) and processing charges.",
    },
    {
      question: "Does converting a purchase to an EMI affect my CIBIL credit score?",
      answer:
        "Converting to an EMI can positively impact your credit score if you make every monthly installment on time, as it demonstrates disciplined debt repayment. However, it blocks a portion of your credit limit, temporarily raising your credit utilization ratio (CUR).",
    },
    {
      question: "What happens if I miss an EMI payment on my credit card?",
      answer:
        "Missing an EMI payment triggers a late payment fee (up to ₹1,300 + GST), revokes your interest-free grace period on new purchases, and subjects the missed installment to standard revolving finance charges of 3.5% per month (42% p.a.), alongside a negative report to credit bureaus like CIBIL.",
    },
    {
      question: "Can I prepay or foreclose my credit card EMI early?",
      answer:
        "Yes, you can foreclose an active credit card EMI by contacting your bank's customer service or using mobile banking. Most banks levy a prepayment fee of 2% to 3% on the outstanding principal balance plus 18% GST.",
    },
  ],

  authorityLinks: [
    { text: "Reserve Bank of India (RBI) - Master Direction on Credit Card and Debit Card Issuance", url: "https://www.rbi.org.in/" },
    { text: "Banking Ombudsman Scheme - RBI", url: "https://cms.rbi.org.in/" },
  ],

  relatedCalculators: ["loan-emi-calculator", "loan-eligibility-calculator", "gst-calculator", "compound-interest-calculator"],
  lastReviewed: "2026-11-21",
};

export default content;
