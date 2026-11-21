import { calculateFlames } from '../src/utils/flamesCalculatorUtils.ts';
import { calculateCementBagEstimate, DEFAULT_CEMENT_INPUTS } from '../src/utils/cementCalculatorUtils.ts';

console.log('--- Smoke testing formulas for Task 1 and Task 2 ---');

// 1. 401(k) calculator
// Age 30 to 65 (35 yrs), Salary $80,000, 6% employee, 50% match up to 6% (so 3% match = $2,400), 3% salary growth, 8% return, 2.5% inflation
// Let's implement the loop as in 401kCalculator.tsx
function test401k(age = 30, retAge = 65, balance = 50000, salary = 80000, contrPct = 6, matchPct = 50, limitPct = 6, growthPct = 3, returnPct = 8) {
  let currBal = balance;
  let currSal = salary;
  let totalContr = 0;
  let totalMatch = 0;
  for (let y = age; y < retAge; y++) {
    const empContr = currSal * (contrPct / 100);
    const eligibleMatchSal = currSal * (limitPct / 100);
    const mPct = Math.min(contrPct, limitPct);
    const empmatch = currSal * (mPct / 100) * (matchPct / 100);
    totalContr += empContr;
    totalMatch += empmatch;
    currBal = (currBal + empContr + empmatch) * (1 + returnPct / 100);
    currSal *= (1 + growthPct / 100);
  }
  return { finalBalance: Math.round(currBal), totalContr: Math.round(totalContr), totalMatch: Math.round(totalMatch) };
}
console.log('401k (30->65, $80k, 6% contr, 50% match to 6%, 8% return):', test401k());

// 2. Retirement calculator
// Age 30 to 65 (35 yrs), $50,000 savings, $500/mo ($6,000/yr), 7% return
function testRetirement(age = 30, retAge = 65, lifeExp = 85, balance = 50000, monthly = 500, returnPct = 7) {
  let currBal = balance;
  for (let y = age; y < retAge; y++) {
    currBal = (currBal + monthly * 12) * (1 + returnPct / 100);
  }
  return { corpusAtRetirement: Math.round(currBal) };
}
console.log('Retirement (30->65, $50k initial, $500/mo, 7% return):', testRetirement());

// 3. BMR calculator (Mifflin-St Jeor)
// Male, 30 yrs, 175 cm, 72 kg
const bmrMale = 10 * 72 + 6.25 * 175 - 5 * 30 + 5;
// Female, 28 yrs, 162 cm, 58 kg
const bmrFemale = 10 * 58 + 6.25 * 162 - 5 * 28 - 161;
console.log('BMR Male (72kg, 175cm, 30y):', bmrMale, 'kcal/day; Sedentary (x1.2):', Math.round(bmrMale * 1.2));
console.log('BMR Female (58kg, 162cm, 28y):', bmrFemale, 'kcal/day; Moderate (x1.55):', Math.round(bmrFemale * 1.55));

// 4. Percentage calculator
// 15% of 200 = 30
// 50 is what % of 80 = 62.5%
// Increase from 100 to 125 = +25%
console.log('Percentage: 15% of 200 =', (15 * 200) / 100);
console.log('Percentage: 50 of 80 =', ((50 / 80) * 100).toFixed(2) + '%');
console.log('Percentage: 100 to 125 change =', (((125 - 100) / 100) * 100).toFixed(2) + '%');

// 5. Scientific calculator
// sin(30 deg) = 0.5; sqrt(144) = 12; 5! = 120; log10(1000) = 3; ln(e) = 1; 2^10 = 1024
console.log('Scientific: sin(30 deg) =', Math.sin(30 * Math.PI / 180));
console.log('Scientific: 2^10 =', Math.pow(2, 10));
console.log('Scientific: log10(1000) =', Math.log10(1000));

// 6. Standard calculator
// 1500 + 450 - 120 * 2 = 1710; (2500 * 0.18) = 450
console.log('Standard arithmetic: 1500 * 1.18 =', 1500 * 1.18);

// 7. Tip calculator
// Bill ₹2,400, 10% tip, 4 people
const bill7 = 2400, tip7 = 10, people7 = 4;
const tipAmt7 = (bill7 * tip7) / 100; // 240
const total7 = bill7 + tipAmt7; // 2640
const per7 = total7 / people7; // 660
console.log('Tip: Bill ₹2400, 10% tip, 4 guests -> Total: ₹' + total7 + ', Per Person: ₹' + per7);

// 8. Attendance calculator
// 45 conducted, 30 attended (66.67%). Target 75%.
const cond8 = 45, att8 = 30, target8 = 75;
const currPct8 = (att8 / cond8) * 100; // 66.67%
const req8 = Math.ceil((target8 * cond8 - 100 * att8) / (100 - target8)); // (75*45 - 3000)/25 = (3375-3000)/25 = 375/25 = 15
console.log(`Attendance: 30/45 (${currPct8.toFixed(2)}%), classes needed for 75%: ${req8}`);

// 9. Body Fat (US Navy)
// Male, height 175cm, waist 85cm, neck 38cm, weight 75kg
const wMinusN9 = 85 - 38; // 47
const bfMale9 = 495 / (1.0324 - 0.19077 * Math.log10(47) + 0.15456 * Math.log10(175)) - 450;
const fatMass9 = 75 * (bfMale9 / 100);
const leanMass9 = 75 - fatMass9;
console.log(`Body Fat Male (85cm waist, 38cm neck, 175cm ht, 75kg): ${bfMale9.toFixed(1)}%, Fat: ${fatMass9.toFixed(1)}kg, Lean: ${leanMass9.toFixed(1)}kg`);

// 10. CGPA calculator
// 4 subjects: Course 1 (4 credits, Grade 9), Course 2 (3 credits, Grade 8), Course 3 (3 credits, Grade 10), Course 4 (2 credits, Grade 7)
const totalCredits10 = 4 + 3 + 3 + 2; // 12
const totalPoints10 = 4*9 + 3*8 + 3*10 + 2*7; // 36 + 24 + 30 + 14 = 104
const sgpa10 = totalPoints10 / totalCredits10; // 104 / 12 = 8.67
console.log(`CGPA/SGPA: 12 credits, 104 grade points -> SGPA: ${sgpa10.toFixed(2)}`);

// 11. Credit card EMI
// Balance ₹50,000, 18% p.a., 12 months
const p11 = 50000, r11 = 18 / 1200, n11 = 12;
const emi11 = (p11 * r11 * Math.pow(1 + r11, n11)) / (Math.pow(1 + r11, n11) - 1);
const total11 = emi11 * n11;
const int11 = total11 - p11;
console.log(`Credit Card EMI (₹50,000 @ 18% for 12 mos): EMI = ₹${Math.round(emi11)}, Total Int = ₹${Math.round(int11)}`);

// 12. CTC to In-hand
// CTC ₹12,00,000, New Regime
// Standard deduction = ₹75,000. Basic = 50% (₹6,00,000). Employee PF = 12% of basic (or ₹21,600 if capped at ₹1800/mo, or ₹72,000).
// In SalaryCalculator default: Basic = 40% (₹4,80,000), PF = ₹21,600 (or ₹57,600).
console.log('Salary CTC ₹12 Lakhs: taxable income after ₹75k standard deduction = ₹11,25,000');

// 13. FLAMES
console.log('FLAMES ("Rahul", "Priya"):', calculateFlames("Rahul", "Priya"));

// 14. GST Calculator
// Amount ₹10,000, 18% GST (Exclusive) -> Base ₹10,000, GST ₹1,800 (CGST ₹900, SGST ₹900), Total ₹11,800
// Amount ₹11,800, 18% GST (Inclusive) -> Base = 11800 / 1.18 = 10,000, GST ₹1,800
console.log('GST 18% Exclusive ₹10k: GST ₹1,800, Total ₹11,800');
console.log('GST 18% Inclusive ₹11,800: Base ₹10,000, GST ₹1,800');

// 15. GST Invoice
// Item 1: 5 units @ ₹1,000 = ₹5,000, 18% GST = ₹900, Total = ₹5,900
console.log('GST Invoice: 5 units @ ₹1,000 with 18% GST = ₹5,900');

// 16. Inflation calculator
// Amount ₹1,00,000, Rate 6% p.a., 10 years
const a16 = 100000, r16 = 0.06, y16 = 10;
const futCost16 = Math.round(a16 * Math.pow(1 + r16, y16)); // 179085
const purPower16 = Math.round(a16 / Math.pow(1 + r16, y16)); // 55839
console.log(`Inflation ₹1,00,000 at 6% for 10y: Future Cost = ₹${futCost16}, Purchasing Power = ₹${purPower16}`);

// 17. Job offer comparison
// Offer A: ₹15L Fixed, ₹2L Variable. Offer B: ₹18L (₹13L Fixed, ₹5L Variable).
console.log('Job Offer: Offer A guaranteed ₹15L vs Offer B guaranteed ₹13L');

// 18. Loan Eligibility
// Monthly income ₹60,000, existing EMI ₹10,000, FOIR 50% = max EMI ₹30,000, available EMI ₹20,000.
// Rate 9.0%, Tenure 20 years (240 mos).
const inc18 = 60000, exist18 = 10000, rate18 = 9.0, yrs18 = 20;
const availEmi18 = (inc18 * 0.5) - exist18; // 20,000
const r18 = rate18 / 1200, n18 = yrs18 * 12;
const maxLoan18 = Math.round(availEmi18 * ((1 - Math.pow(1 + r18, -n18)) / r18));
console.log(`Loan Eligibility: Income ₹60k, existing EMI ₹10k, 9% for 20y: Available EMI = ₹20,000, Max Loan = ₹${maxLoan18}`);

// 19. Love calculator
console.log('Love calculator: algorithmic compatibility score between two names');

// 20. Product Profit
// CP ₹500, SP ₹800, Qty 10
// Revenue = ₹8,000, Cost = ₹5,000, Profit = ₹3,000, Margin = 37.5%, Markup = 60%
console.log('Product Profit: CP ₹500, SP ₹800 -> Profit ₹300, Margin 37.5%, Markup 60%');

// 21. Protein calculator
// 70 kg, muscle gain (1.6 - 2.2 g/kg, moderate activity)
console.log('Protein 70kg muscle gain (1.6 - 2.2 g/kg):', 70 * 1.6, 'to', 70 * 2.2, 'g/day');
