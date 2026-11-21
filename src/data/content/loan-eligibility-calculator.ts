import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The loan eligibility calculator estimates the maximum loan amount that commercial banks, non-banking financial companies (NBFCs), and housing finance institutions in India will sanction based on your monthly income and existing debt obligations. Incorporating the standard Fixed Obligation to Income Ratio (FOIR) framework (standardly 50% in Indian retail lending), interest rate, and preferred repayment tenure, it determines your available monthly EMI capacity and computes the maximum loan principal you qualify for before submitting formal credit applications.",

  howItWorks:
    "Determining your borrowing eligibility requires key financial and loan parameters:\n\n1. Net Monthly Income (₹): Enter your take-home monthly salary or verifiable monthly net business cash flow.\n2. Existing Monthly EMIs (₹): Enter your ongoing monthly debt commitments, including active car loans, personal loans, student debt, or minimum card dues.\n3. Expected Interest Rate (% p.a.): Input the annual lending rate offered by banks (e.g. 8.5% to 9.5% for home loans, 10% to 15% for personal loans).\n4. Loan Tenure: Select your planned repayment horizon in years (up to 30 years for home mortgages, 7 years for auto loans, 5 years for personal loans).\n5. FOIR Threshold (%): The calculator applies a default 50% FOIR benchmark (banks permit up to 60% for high-income applicants above ₹1.5 Lakhs/month).\n\nClick Calculate to view your maximum allowable monthly EMI, current available EMI headroom, and total qualified loan amount.",

  formula:
    "Indian banks evaluate retail borrowing eligibility using the Fixed Obligation to Income Ratio (FOIR) and Present Value equations:\n\n1. Total Maximum Allowable Monthly Debt Service:\nMax Total Debt EMI = Net Monthly Income × (FOIR % / 100)\n\n2. Available Monthly EMI Capacity for New Loan:\nAvailable EMI = Max Total Debt EMI − Existing Monthly EMIs\nIf Available EMI ≤ 0, the applicant is overleveraged and does not qualify for new debt.\n\n3. Maximum Loan Principal Qualification (Present Value of an Annuity):\nP = Available EMI × [1 − (1 + r)^−n] / r\nwhere:\n- r = Periodic monthly interest rate = Annual Interest Rate / (12 × 100)\n- n = Total repayment tenure in months = Years × 12\n\nNote: Lenders also assess credit bureau scores (CIBIL score ≥ 750), property valuation (LTV ratio up to 80% to 90%), and age at loan maturity (usually capped at 60 to 65 years for salaried employees).",

  example:
    "Consider an Indian salaried professional applying for a home loan with the following financial profile:\n- Net Monthly Take-Home Salary: ₹60,000\n- Existing Active Auto Loan EMI: ₹10,000 per month\n- Benchmark FOIR: 50%\n- Offered Home Loan Interest Rate: 9.0% per annum\n- Desired Loan Tenure: 20 years (240 months)\n\nStep-by-Step Calculation:\n1. Maximum Allowable Debt Capacity = ₹60,000 × 50% = ₹30,000/month\n2. Available EMI for New Home Loan = ₹30,000 − ₹10,000 = ₹20,000/month\n3. Monthly Interest Rate (r) = 9.0 / 1200 = 0.0075 per month\n4. Total Tenure in Months (n) = 20 × 12 = 240 months\n5. Discount Factor = 1 − (1 + 0.0075)^−240 = 1 − (1.0075)^−240 = 1 − 0.166413 = 0.833587\n6. Maximum Eligible Loan Principal (P):\nP = ₹20,000 × (0.833587 / 0.0075) = ₹20,000 × 111.1449 ≈ ₹22,22,899 (₹22.23 Lakhs)\n\nThe applicant qualifies for a maximum home loan of approximately ₹22.23 Lakhs with a ₹20,000 monthly EMI.",

  mistakes:
    "1. Applying with a CIBIL score below 750: A low credit score can lead to outright loan rejection or cause banks to hike interest rates by 100 to 200 basis points, severely slashing eligible principal.\n2. Forgetting credit card revolving debt in existing obligations: Banks factor in 5% of your outstanding credit card limit as an active monthly obligation, reducing your available EMI capacity.\n3. Applying to multiple banks simultaneously: Multiple hard credit inquiries within a short window trigger credit score drops and signal credit distress to automated underwriting engines.\n4. Overestimating loan eligibility without property Loan-to-Value (LTV) limits: Regardless of income, RBI limits home loan sanctions to 75%–90% of verified property market value.\n5. Neglecting retirement age constraints: If you are 45 years old, banks will restrict your tenure to 15 years rather than 30 years, drastically decreasing the maximum eligible loan amount.",

  faqs: [
    {
      question: "What is FOIR and how does it determine loan approval?",
      answer:
        "Fixed Obligation to Income Ratio (FOIR) is the percentage of your monthly net income that banks permit you to spend on debt repayments. Indian lenders typically cap FOIR between 40% and 50% to ensure borrowers retain sufficient cash for living expenses, grocery bills, and emergency savings.",
    },
    {
      question: "How can I increase my maximum eligible loan amount?",
      answer:
        "You can increase your loan eligibility by adding a earning co-applicant (spouse or parent), choosing a longer repayment tenure (up to 30 years), prepaying and closing existing personal or vehicle loans to free up EMI capacity, or maintaining a CIBIL score above 780.",
    },
    {
      question: "Does having a high CIBIL score automatically guarantee loan sanction?",
      answer:
        "A high CIBIL score is necessary but not sufficient. Banks also verify income stability, employer category, bank account statements, tax return compliance (ITR for 2 to 3 years), and physical legal clearance of the property being purchased.",
    },
    {
      question: "Can self-employed individuals and business owners use this calculator?",
      answer:
        "Yes, self-employed professionals can enter their average net monthly profit (Annual Net Profit from audited financial statements divided by 12) to calculate business or mortgage borrowing eligibility.",
    },
    {
      question: "What is the Loan-to-Value (LTV) ratio under RBI rules?",
      answer:
        "Under RBI guidelines, banks can finance up to 90% of property value for home loans up to ₹30 Lakhs, up to 80% for loans between ₹30 Lakhs and ₹75 Lakhs, and up to 75% for loans exceeding ₹75 Lakhs. Borrowers must fund the remaining percentage as an upfront down payment.",
    },
  ],

  authorityLinks: [
    { text: "Reserve Bank of India (RBI) - Master Directions on Retail Lending", url: "https://www.rbi.org.in/" },
    { text: "National Housing Bank (NHB)", url: "https://nhb.org.in/" },
  ],

  relatedCalculators: ["home-loan-emi-calculator", "loan-emi-calculator", "credit-card-emi-calculator", "car-loan-emi-calculator"],
  lastReviewed: "2026-11-21",
};

export default content;
