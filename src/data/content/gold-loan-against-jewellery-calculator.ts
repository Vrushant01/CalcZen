import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The Gold Loan Against Jewellery Calculator calculates maximum borrowing eligibility, monthly interest payments, and loan repayment options when pledging physical gold ornaments with Indian commercial banks or NBFCs. It applies the Reserve Bank of India (RBI) mandated 75% Loan-to-Value (LTV) limit to determine your loan ceiling.",

  howItWorks:
    "Enter the net gold weight of your pledged ornaments, the gold karat purity, and current market gold rates. The calculator computes the intrinsic value of your pledged gold, applies the maximum 75% LTV ratio, and outputs loan sanction amounts alongside monthly EMI or bullet interest repayment options.",

  formula:
    "Gold Loan Eligibility Formula:\n\nIntrinsic Gold Value = Net Weight (g) × (Karat / 24) × 24K Gold Rate\n\nMaximum Loan Eligible = Intrinsic Gold Value × 0.75 (75% LTV Cap)\n\nMonthly Simple Interest = (Loan Sanctioned × Annual Interest Rate) ÷ 1200",

  example:
    "Pledging 40 grams of 22K gold ornaments with 24K gold rate at ₹7,500/g:\n- Pure Gold Content: 40 × (22/24) = 36.67 grams\n- Intrinsic Gold Value: 36.67g × ₹7,500 = ₹2,75,000\n- Maximum Loan Amount (75% LTV): ₹2,75,000 × 0.75 = ₹2,06,250\n- Monthly Interest at 9.5% p.a.: (2,06,250 × 9.5) ÷ 1200 = ₹1,632.81/month",

  mistakes:
    "A frequent borrower mistake is expecting banks to evaluate stone weight or making charges in loan value; lenders strictly evaluate net pure gold weight. Another pitfall is ignoring auction risks if interest payments fall overdue.",

  faqs: [
    {
      question: "How does a gold loan compare to a personal loan or vehicle EMI?",
      answer:
        'Because gold loans are secured by liquid gold collateral, banks offer lower interest rates (8% to 12%) and instant approvals without credit score scrutiny. In contrast, personal loans carry higher rates (12% to 20%). To compare monthly EMI payment schedules, use our <a href="/calculator/loan-emi-calculator" class="text-primary hover:underline">Loan EMI Calculator</a>.',
    },
    {
      question: "How is gold value calculated for a loan?",
      answer:
        'Lenders determine gold value using the trailing 30-day average 22K spot gold rate published by the India Bullion and Jewellers Association (IBJA). To check your gold scrap and market valuation, use our <a href="/calculator/old-gold-exchange-value-calculator" class="text-primary hover:underline">Old Gold Exchange Value Calculator</a>.',
    },
    {
      question: "Can I convert different gold purities to calculate loan value?",
      answer:
        'Yes, lenders adjust valuation based on exact karat purity (e.g. 18K receives 75% of 24K value). To verify purity conversion factors and prices per gram, check our <a href="/calculator/gold-purity-karat-converter" class="text-primary hover:underline">Gold Purity & Karat Converter</a>.',
    },
  ],

  authorityLinks: [
    {
      text: "Reserve Bank of India (RBI) Regulatory Guidelines on Loans Against Gold Jewellery",
      url: "https://www.rbi.org.in/",
    },
  ],

  relatedCalculators: [
    "loan-emi-calculator",
    "old-gold-exchange-value-calculator",
    "gold-jewellery-bill-calculator",
    "gold-purity-karat-converter",
  ],
};

export default content;
