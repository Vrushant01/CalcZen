import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The CTC to In-Hand Salary Calculator decodes Indian corporate employment offer letters, converting your annual Cost to Company (CTC) into your true monthly take-home paycheck. Many job seekers are surprised when a ₹12 Lakh CTC offer translates to significantly less in their bank account each month. This tool dissects every component of your compensation structure: Basic Salary, House Rent Allowance (HRA), Special Allowance, Employer and Employee Provident Fund (EPF), Gratuity provisions, Professional Tax (PT), and income tax deductions under both the New Tax Regime (Section 115BAC) and Old Tax Regime for Financial Year 2026–27.",

  howItWorks:
    "To analyze your take-home pay, enter your offer parameters into the calculator:\n\n1. Annual CTC: Enter your total annual Cost to Company in Indian Rupees (e.g. ₹12,00,000).\n2. Tax Regime: Compare the New Tax Regime (default with lower slab rates and standard deduction) against the Old Tax Regime (allowing HRA, 80C, and 80D deductions).\n3. State of Employment: Select your state (e.g. Karnataka, Maharashtra, Delhi) to compute applicable state Professional Tax (capped at ₹2,500/year).\n4. Salary Structure: Choose between Standard Structure (Basic at 40% to 50% of CTC) or customize your Basic and HRA percentages.\n5. Statutory EPF & Gratuity: Toggle whether employee PF is capped at the statutory ceiling (₹1,800/month on ₹15,000 wage ceiling) or calculated on full uncapped basic salary.\n\nClick Calculate to receive your monthly net in-hand salary, annual gross earnings, statutory retirement contributions, and regime comparison.",

  formula:
    "The calculation progresses through three financial stages:\n\nStage 1 - Annual CTC Dissection:\nAnnual CTC = Gross Salary + Employer PF + Gratuity Provision + Other Employer Benefits\n- Basic Salary = CTC × 40% (standard corporate benchmark)\n- HRA = Basic Salary × 40% (or 50% for metro cities)\n- Employer PF = 12% of Basic (capped at ₹21,600/year under statutory ceiling, or uncapped)\n- Gratuity Provision = (15 / 26) × (Basic / 12) × 12 ≈ 4.81% of Basic\n- Special Allowance = CTC − (Basic + HRA + Employer PF + Gratuity)\n- Annual Gross Salary = CTC − Employer PF − Gratuity\n\nStage 2 - Monthly Paycheck Deductions:\nMonthly In-Hand = Monthly Gross − Employee PF − Professional Tax (PT) − Monthly Income Tax TDS\n- Employee PF: Matches employer contribution (12% of basic or ₹1,800/month)\n- Professional Tax (PT): Governed by state rules (e.g. ₹200/month in Karnataka/Maharashtra, ₹300 in February)\n\nStage 3 - Income Tax TDS (New Regime FY 2026-27):\nTaxable Income = Gross Salary − Standard Deduction (₹75,000 under New Regime)\nSlab Rates applied with Section 87A rebate for taxable incomes up to statutory thresholds, plus 4% Health and Education Cess.",

  example:
    "Consider a corporate software employee in Bengaluru (Karnataka) with an Annual CTC of ₹12,00,000 under the New Tax Regime (statutory PF cap applied):\n- Annual CTC: ₹12,00,000\n- Monthly Fixed Gross Salary: ₹96,347\n- Monthly Basic Salary: ₹38,539\n\nMonthly Paycheck Deductions:\n- Employee PF (statutory ceiling): ₹1,800/month\n- Professional Tax (Karnataka): ₹200/month\n- Monthly Income Tax TDS (New Regime after ₹75k standard deduction): ₹5,389/month\n- Total Monthly Deductions = ₹1,800 + ₹200 + ₹5,389 = ₹7,389\n\nNet Take-Home:\n- Monthly In-Hand Salary: ₹96,347 − ₹7,389 = ₹88,958 per month\n- Annual Net Take-Home: ₹10,67,496 per year\n\nEmployer contributions (PF ₹1,800/mo and Gratuity provision ₹1,853/mo) make up the remainder of the ₹1,00,000 monthly CTC.",

  mistakes:
    "1. Assuming CTC equals monthly take-home divided by 12: Dividing a ₹12 Lakh CTC by 12 gives an expectation of ₹1,00,000/month; in reality, statutory PF, gratuity, PT, and income tax reduce take-home to ~₹88,958.\n2. Overestimating performance variable bonuses: Joining offers often display 100% variable bonus potential in CTC; if company performance yields only 70% payout, your actual compensation drops accordingly.\n3. Opting for the wrong tax regime: The New Tax Regime offers lower slab rates and a ₹75,000 standard deduction, but employees paying high house rent (HRA) and home loan interest may save significantly more under the Old Regime.\n4. Forgetting that gratuity requires 5 years of continuous service: Gratuity provisions deducted from your CTC are only paid out if you complete 5 continuous years with the same employer under the Payment of Gratuity Act.\n5. Neglecting state-specific Professional Tax differences: States like Delhi and Rajasthan levy zero Professional Tax, whereas Karnataka, Maharashtra, and West Bengal levy up to ₹2,500 annually.",

  faqs: [
    {
      question: "What is the difference between CTC, Gross Salary, and Net Take-Home?",
      answer:
        "CTC (Cost to Company) is the total annual expenditure an employer incurs on you, including retirement provisions. Gross Salary is your earnings before employee tax and PF deductions. Net Take-Home (In-Hand) is the actual cash credited to your bank account every month after all deductions.",
    },
    {
      question: "Which tax regime is better for salaried employees in FY 2026-27?",
      answer:
        "For employees with total annual deductions (Section 80C, 80D, HRA, and home loan interest) under ₹3.75 Lakhs, the New Tax Regime is generally more beneficial due to lower tax rates and an increased ₹75,000 standard deduction. Those with substantial home loan interest and high rental deductions often save more under the Old Regime.",
    },
    {
      question: "Can I choose to opt out of Employees' Provident Fund (EPF)?",
      answer:
        "If your basic salary at your first formal job was above ₹15,000 per month, EPF membership is technically voluntary, and you can submit Form 11 to opt out. However, most established corporate employers make EPF mandatory across all staff for social security compliance.",
    },
    {
      question: "How is Gratuity calculated in my salary structure?",
      answer:
        "Under the Payment of Gratuity Act 1972, gratuity is calculated as: (15 × Last Drawn Basic Salary × Number of Years of Service) / 26. Employers include a monthly provision of approximately 4.81% of your basic pay in your CTC.",
    },
    {
      question: "What is the maximum limit on Professional Tax in India?",
      answer:
        "Under Article 276(2) of the Constitution of India, the maximum professional tax that any state government or municipal authority can levy on an individual is legally capped at ₹2,500 per financial year.",
    },
  ],

  authorityLinks: [
    { text: "Income Tax Department of India", url: "https://www.incometax.gov.in/" },
    { text: "Employees' Provident Fund Organisation (EPFO)", url: "https://www.epfindia.gov.in/" },
    { text: "Ministry of Labour & Employment - Gratuity Guidelines", url: "https://labour.gov.in/" },
  ],

  relatedCalculators: ["job-offer-comparison-calculator", "product-profit-calculator", "loan-eligibility-calculator", "credit-card-emi-calculator"],
  lastReviewed: "2026-11-21",
};

export default content;
