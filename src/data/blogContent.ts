import type { BlogContent } from "@/components/CalculatorBlog";

export const blogContent: Record<string, BlogContent> = {
  mortgage: {
    primaryKeyword: "mortgage calculator",
    h2Heading: "How Your Monthly Mortgage Payment Is Calculated",
    h3Heading: "The 28% Rule — What Lenders Actually Check",
    paragraph1:
      "A mortgage calculator gives you the exact monthly payment on a home loan before you ever speak to a lender. Understanding this number early protects you from committing to a home that stretches your finances beyond a safe limit. In the USA, the average 30-year fixed mortgage rate in 2025 sits between 6.0% and 7.0% depending on your credit score and lender.",
    paragraph2:
      "Your monthly mortgage payment has four components lenders call PITI — principal, interest, taxes, and insurance. Most free calculators show only principal and interest. CalcZen shows you the full breakdown so the number you see matches what you actually pay each month. On a $350,000 loan at 6.5% for 30 years, your principal and interest alone is $2,212 per month.",
    paragraph3:
      "The total interest paid over a 30-year mortgage often exceeds the original loan amount. A $300,000 home loan at 6.5% costs $382,633 in interest over 30 years — more than the home itself. Seeing this number before signing is the single most powerful thing a first-time buyer can do.",
    h2Body:
      "The mortgage payment formula is M = P[r(1+r)^n] divided by [(1+r)^n - 1]. P is your loan principal, r is your monthly interest rate (annual rate divided by 12), and n is the total number of payments. A $400,000 loan at 6.5% annual interest over 360 months produces a monthly payment of $2,528. This formula is used by every bank, mortgage broker, and lender in the USA and UK.",
    h3Body:
      "Lenders use the 28% rule to decide whether you qualify for a mortgage. Your total monthly housing costs — including mortgage, property tax, and insurance — must not exceed 28% of your gross monthly income. On a $90,000 annual salary that means a maximum housing payment of $2,100 per month. If your calculated payment exceeds this threshold, you either need a larger down payment, a lower purchase price, or a longer loan term to qualify.",
    paragraph4:
      "UK homebuyers face different mortgage structures. Most UK mortgages are fixed for 2 or 5 years before reverting to a standard variable rate, unlike the 30-year fixed common in the USA. This means UK borrowers need to recalculate their payments every time they remortgage. Using a UK mortgage calculator that accounts for stamp duty land tax and arrangement fees gives a much more accurate picture of total costs.",
    closingParagraph:
      "Recalculate your mortgage whenever interest rates change, your income changes, or you consider overpaying. Even an extra £100 or $100 per month toward your principal reduces a 30-year mortgage to approximately 25 years and saves tens of thousands in interest. The mortgage calculator above updates instantly — use it to model different scenarios before your next conversation with a lender.",
    internalLinks: [
      {
        text: "compare monthly loan repayments",
        calculatorName: "Loan EMI Calculator",
        href: "/calculator/loan-emi-calculator",
      },
      {
        text: "watch your savings grow alongside your payments",
        calculatorName: "Compound Interest Calculator",
        href: "/calculator/compound-interest-calculator",
      },
    ],
  },

  loan: {
    primaryKeyword: "loan EMI calculator",
    h2Heading: "What Your EMI Actually Costs You Over Time",
    h3Heading: "How to Reduce Your Total Loan Interest",
    paragraph1:
      "A loan EMI calculator tells you the exact monthly instalment on any personal, car, or student loan before you borrow. EMI stands for Equated Monthly Instalment — the fixed amount you pay every month until the loan is fully repaid. Knowing your EMI before signing prevents the most common financial mistake people make: borrowing more than their monthly budget can comfortably absorb.",
    paragraph2:
      "The EMI formula is E = P × r × (1+r)^n divided by [(1+r)^n - 1], where P is the principal, r is the monthly interest rate, and n is the number of months. On a $20,000 personal loan at 10% annual interest over 48 months, your EMI is $507 per month and your total interest paid is $4,336 — 21.7% of the original amount. This is the true cost of borrowing that lenders rarely highlight upfront.",
    paragraph3:
      "Credit card debt carried month to month typically charges 18% to 24% APR — three to four times higher than a personal loan. Using our loan EMI calculator to consolidate high-interest credit card debt into a single personal loan at 9% to 11% APR can reduce monthly payments by 40% and cut total interest by more than half.",
    h2Body:
      "Total interest paid grows sharply with loan tenure. A $15,000 car loan at 8% interest costs $912 in interest over 24 months. Extend the same loan to 60 months and total interest jumps to $2,356. A longer tenure gives you a lower monthly EMI but a significantly higher total cost. The EMI calculator lets you find the exact break-even point between affordable monthly payments and minimum total cost.",
    h3Body:
      "Three proven methods reduce total loan interest without increasing your monthly EMI. First, make one extra EMI payment per year — this alone cuts a 5-year loan to approximately 4.2 years. Second, apply any bonus, tax refund, or windfall directly to the principal — every dollar of principal reduced saves you interest for all remaining months. Third, refinance when market rates drop by 1.5% or more — the break-even point on refinancing costs is typically 14 to 22 months.",
    paragraph4:
      "UK borrowers should compare loans using the Annual Percentage Rate (APR) rather than the stated interest rate. The APR includes arrangement fees and other charges, making it the true cost comparison tool. A loan advertised at 6.9% with a £150 arrangement fee has a higher APR than a loan at 7.2% with no fees if your loan amount is under £3,000. Always calculate the total repayment amount rather than focusing only on the monthly EMI.",
    closingParagraph:
      "Before taking any loan, run three scenarios in the EMI calculator — your preferred term, a shorter term to see how much you save, and a longer term to see the maximum cost. This three-scenario approach takes under two minutes and gives you more negotiating power with any lender. The difference between a well-informed borrower and an uninformed one is often thousands of dollars or pounds in total repayment.",
    internalLinks: [
      {
        text: "see how a home loan compares to personal debt",
        calculatorName: "Mortgage Calculator",
        href: "/calculator/mortgage-calculator",
      },
      {
        text: "see what investing that money instead would return",
        calculatorName: "Compound Interest Calculator",
        href: "/calculator/compound-interest-calculator",
      },
    ],
  },

  bmi: {
    primaryKeyword: "BMI calculator",
    h2Heading: "What Your BMI Score Means for Your Health",
    h3Heading: "BMI Limitations — What the Number Does Not Tell You",
    paragraph1:
      "A BMI calculator measures Body Mass Index — the ratio of your weight to the square of your height — and places you in one of four categories: underweight, healthy weight, overweight, or obese. The World Health Organization defines a healthy BMI as 18.5 to 24.9 for adults. BMI is the most widely used screening tool for weight-related health risk in the USA, UK, and globally because it requires only two measurements and takes seconds to calculate.",
    paragraph2:
      "For a person who is 175 cm tall, a healthy weight range is 56.6 kg to 76.4 kg. At 80 kg that person has a BMI of 26.1 — overweight category — and would need to lose approximately 3.7 kg to return to the healthy range. These are the specific, actionable numbers that turn a BMI result from an abstract score into a concrete health target.",
    paragraph3:
      "Research published in The Lancet shows that people with a BMI between 25 and 30 have a 20% higher risk of developing type 2 diabetes compared to those in the healthy range. People with a BMI above 30 face a 40% higher risk of cardiovascular disease. Understanding where you sit on this scale is the first step toward making meaningful lifestyle changes.",
    h2Body:
      "The BMI formula divides your weight in kilograms by your height in metres squared: BMI = kg / m². In imperial units the formula is BMI = (weight in lbs × 703) / (height in inches)². A 200 lb person who is 5 feet 10 inches tall has a BMI of 28.7, placing them in the overweight category. At 175 lbs the same person has a BMI of 25.1 — borderline healthy. This single formula is used by the NHS, the CDC, and health insurers across the USA and UK to assess weight-related risk.",
    h3Body:
      "BMI does not distinguish between muscle and fat, which means highly muscular individuals are routinely misclassified as overweight or obese. A professional rugby player weighing 105 kg at 183 cm has a BMI of 31.3 — clinically obese by the standard definition — despite having 8% body fat. For older adults over 65, research suggests that a BMI between 25 and 27 may actually be associated with lower mortality risk than the standard healthy range. Always treat your BMI result as a starting point for a conversation with your doctor, not a final diagnosis.",
    paragraph4:
      "Children and teenagers use different BMI charts than adults because healthy weight ranges change with age and growth. A BMI of 22 is healthy for a 35-year-old adult but may be overweight for a 12-year-old depending on their height and developmental stage. Paediatric BMI is calculated the same way but interpreted using age-specific and gender-specific percentile charts from the CDC or NHS.",
    closingParagraph:
      "Track your BMI monthly rather than daily — weight fluctuates by 1 to 2 kg day to day due to water retention and food intake, making daily tracking misleading. A consistent downward trend over 8 to 12 weeks is far more meaningful than any single measurement. Use the BMI calculator above alongside your calorie intake data to build a complete picture of your progress.",
    internalLinks: [
      {
        text: "calculate your daily calorie needs to reach your target weight",
        calculatorName: "Calorie Calculator",
        href: "/calculator/calorie-calculator",
      },
      {
        text: "find calories burned at rest for your body size",
        calculatorName: "BMR Calculator",
        href: "/calculator/bmr-calculator",
      },
    ],
  },

  compound: {
    primaryKeyword: "compound interest calculator",
    h2Heading: "Why Compound Interest Is Called the Eighth Wonder of the World",
    h3Heading: "Monthly Contributions vs Lump Sum — Which Builds More Wealth",
    paragraph1:
      "A compound interest calculator shows you exactly how an investment grows when interest is earned not just on your original principal but also on every dollar of interest accumulated. Albert Einstein reportedly called compound interest the eighth wonder of the world — and the mathematics justify that reputation. A $10,000 investment at 8% annual interest compounded monthly becomes $49,268 after 20 years with no additional contributions — nearly five times the original amount.",
    paragraph2:
      "The frequency of compounding makes a measurable difference to your final balance. $10,000 at 8% annual interest compounded annually grows to $46,610 after 20 years. The same investment compounded monthly grows to $49,268 — a difference of $2,658 with zero extra effort. Compounded daily produces $49,378. When comparing savings accounts, ISAs, or investment platforms, always check the compounding frequency, not just the headline interest rate.",
    paragraph3:
      "Starting five years earlier produces a larger final balance than doubling your monthly contribution. An investor who starts at 25 and invests $300 per month at 7% until age 65 accumulates $798,000. An investor who starts at 30 and invests $600 per month at the same rate until 65 accumulates only $761,000 — less money despite contributing twice as much per month. Time in the market is the single most powerful variable in the compound interest formula.",
    h2Body:
      "The compound interest formula is A = P(1 + r/n)^(nt) where A is the final amount, P is your principal, r is the annual interest rate as a decimal, n is the number of compounding periods per year, and t is time in years. For investments with regular contributions the formula extends to include the future value of an annuity. A $500 monthly contribution at 8% for 30 years produces a final balance of $734,075 — $734,075 built from $180,000 of contributions and $554,075 of compounded returns. The interest earned exceeds the amount invested by more than three times.",
    h3Body:
      "Monthly contributions consistently outperform lump sum investments when the investor does not have a large initial capital. Investing $200 per month for 30 years at 8% produces $298,072. A single lump sum investment of $72,000 (the same total amount over 30 years) invested at 30 years before the target date produces $725,473. The lump sum wins when invested at the beginning — but most people do not have $72,000 available at age 25. Regular monthly contributions are the realistic path for most savers, and the compound interest calculator shows you exactly where each approach leads over your specific time horizon.",
    paragraph4:
      "Stocks and shares ISAs in the UK and Roth IRAs in the USA both allow compound growth with zero tax on returns — making them the most efficient vehicles for long-term wealth building. A UK investor contributing the maximum £20,000 ISA allowance annually at 7% return for 25 years accumulates £1,346,000 completely tax-free. The equivalent in a taxable account at a 20% capital gains tax rate would yield approximately £1,156,000 after tax — a difference of £190,000 attributable entirely to tax-free compounding.",
    closingParagraph:
      "The compound interest calculator works for any scenario — savings accounts, investment portfolios, pension funds, property appreciation, or business reinvestment. Change the rate, the time period, and the contribution amount to find the exact combination that matches your financial goals. The most important action is to start today — every month of delay costs you compound returns that cannot be recovered.",
    internalLinks: [
      {
        text: "compare growth to your monthly loan costs",
        calculatorName: "Loan EMI Calculator",
        href: "/calculator/loan-emi-calculator",
      },
      {
        text: "see how compound growth compares to your mortgage interest cost",
        calculatorName: "Mortgage Calculator",
        href: "/calculator/mortgage-calculator",
      },
    ],
  },

  tip: {
    primaryKeyword: "tip calculator",
    h2Heading: "Tipping Etiquette in the USA and UK — What Is Expected",
    h3Heading: "How to Split a Bill Fairly When People Order Different Amounts",
    paragraph1:
      "A tip calculator removes the awkward mental arithmetic at the end of a restaurant meal by calculating the exact tip amount and splitting the total equally among your group. In the USA, tipping is a cultural and economic expectation rather than an optional gesture — service industry workers in most states earn a base wage of $2.13 per hour under federal tipped minimum wage rules, making gratuities their primary income source.",
    paragraph2:
      "Standard tipping rates in the USA in 2025 are 18% to 20% for good restaurant service, 15% for acceptable service, and 10% or less only for genuinely poor service. For a $85 restaurant bill with 4 people at 20% tip, the total comes to $102 and each person pays $25.50. At a bar or coffee shop, $1 to $2 per drink is standard. Hotel housekeeping expects $3 to $5 per night. Rideshare drivers typically receive 15% to 20%.",
    paragraph3:
      "In the UK, tipping customs differ significantly from the USA. Restaurant tips of 10% to 12.5% are considered generous — many UK restaurants add a 12.5% service charge automatically which you are legally entitled to remove if service was poor. UK bar staff do not expect tips. Hotel porters typically receive £1 to £2 per bag. Always check your bill before adding a tip manually — paying twice because of an automatic service charge is a common tourist mistake in London.",
    h2Body:
      "Pre-tax vs post-tax tipping is a genuine debate in the USA. Technically a tip should be calculated on the pre-tax subtotal — you are tipping on the service, not on the government's share of your bill. On a $100 meal with 8% sales tax, tipping 20% on the pre-tax amount gives a $20 tip. Tipping 20% on the post-tax total of $108 gives a $21.60 tip — a $1.60 difference that is genuinely inconsequential but worth knowing. The CalcZen tip calculator lets you choose pre-tax or post-tax calculation.",
    h3Body:
      "Splitting a bill fairly becomes complicated when one person orders a $45 steak and another orders a $14 salad. Equal splitting in this scenario means the salad person subsidises the steak person by $15.50. The fairest approach is itemised splitting — each person pays for what they ordered plus an equal share of the tip. Our tip calculator supports both equal splitting and custom amount splitting so every person in your group pays exactly their fair share.",
    paragraph4:
      "Food delivery tips follow different conventions than restaurant dining. DoorDash, Uber Eats, and Deliveroo drivers receive 100% of the tip in most cases — unlike some restaurant workers who tip-pool with kitchen staff. A 15% to 20% tip on delivery orders is the current standard expectation given that drivers use their own vehicles, cover their own fuel costs, and manage variable weather conditions. On a $40 delivery order that means a $6 to $8 tip is appropriate.",
    closingParagraph:
      "Use the tip calculator above before sitting down at a restaurant to know your budget ceiling for the entire meal including gratuity. If you are planning a group dinner, set a per-person budget of meal cost plus 20% tip plus tax — this prevents the uncomfortable moment when the bill arrives and the maths does not work out for someone at the table.",
    internalLinks: [
      {
        text: "calculate your daily calorie needs after dining out",
        calculatorName: "Calorie Calculator",
        href: "/calculator/calorie-calculator",
      },
      {
        text: "see how small daily savings compound into serious wealth",
        calculatorName: "Compound Interest Calculator",
        href: "/calculator/compound-interest-calculator",
      },
    ],
  },

  percentage: {
    primaryKeyword: "percentage calculator",
    h2Heading: "The Three Types of Percentage Problems People Search For",
    h3Heading: "Percentage Change — How to Calculate Increases and Decreases",
    paragraph1:
      "A percentage calculator solves the three most common percentage problems in one place: finding what percentage one number is of another, calculating X percent of a given number, and working out the original value after a percentage increase or decrease. Percentages appear in every area of financial and everyday life — tax rates, discounts, salary increases, exam scores, interest rates, and investment returns all depend on percentage calculations.",
    paragraph2:
      'The most searched percentage question on Google is "what is X percent of Y" — with over 1.8 million searches per month globally. To find 15% of $240, multiply 240 by 0.15 to get $36. To find what percentage $36 is of $240, divide 36 by 240 and multiply by 100 to get 15%. These two operations are inverses of each other, and confusing them is the source of most percentage errors in everyday life.',
    paragraph3:
      "Sales discounts are the most common real-world percentage calculation for consumers. A jacket priced at $180 with a 35% discount costs $180 minus ($180 × 0.35) = $180 minus $63 = $117. If the same jacket is then reduced by a further 20% in a sale, the additional discount applies to $117, not to the original $180 — a common misconception that leads consumers to overestimate their savings. Two successive discounts of 35% and 20% do not equal a 55% discount. The actual combined discount is 48%.",
    h2Body:
      "The three core percentage formulas are: (1) Percentage of a number: Result = (Percentage / 100) × Number. (2) What percentage is A of B: Percentage = (A / B) × 100. (3) Original value before a percentage change: Original = Current Value / (1 + Percentage/100) for an increase, or Current Value / (1 - Percentage/100) for a decrease. All three are built into the CalcZen percentage calculator with labelled inputs so you never need to remember which formula applies.",
    h3Body:
      "Percentage change measures how much a value has increased or decreased relative to its starting point. The formula is: Percentage change = ((New Value - Old Value) / Old Value) × 100. If your salary increased from $65,000 to $72,000, the percentage increase is ((72,000 - 65,000) / 65,000) × 100 = 10.77%. If house prices fell from £320,000 to £295,000, the percentage decrease is ((295,000 - 320,000) / 320,000) × 100 = -7.81%. Percentage change is always calculated relative to the original value — this is why a 50% fall followed by a 50% rise does not return you to the starting point. It leaves you 25% below where you started.",
    paragraph4:
      "Percentage calculations are critical for understanding investment returns. If a stock portfolio grows from $10,000 to $14,500, the return is 45%. If it then falls 30%, the new value is $10,150 — just 1.5% above the original investment despite the 45% gain. This asymmetry between percentage gains and losses is why financial advisors emphasise avoiding large losses over chasing large gains.",
    closingParagraph:
      "The percentage calculator above handles all three calculation modes instantly. Switch between modes using the tabs — percentage of a number, percentage one number is of another, and percentage change. For shopping decisions, tax calculations, salary negotiations, and investment analysis, accurate percentage calculations give you confidence that the numbers in front of you are correct.",
    internalLinks: [
      {
        text: "apply percentage calculations to your mortgage interest",
        calculatorName: "Mortgage Calculator",
        href: "/calculator/mortgage-calculator",
      },
      {
        text: "see interest as a percentage of your loan principal",
        calculatorName: "Loan EMI Calculator",
        href: "/calculator/loan-emi-calculator",
      },
    ],
  },

  age: {
    primaryKeyword: "age calculator",
    h2Heading: "Why Knowing Your Exact Age in Days Matters More Than You Think",
    h3Heading: "Age Calculations for Legal, Medical, and Financial Purposes",
    paragraph1:
      "An age calculator tells you your exact age in years, months, days, and hours from your date of birth to today. While most people know their age in years, the precise age in days and months has real implications for legal eligibility, medical screening schedules, retirement planning, and insurance premium calculations. In the USA, eligibility for Medicare begins at exactly 65 years — not 65 years and a few months — making the precise calculation genuinely important.",
    paragraph2:
      "If you were born on March 15, 1985, you are currently 40 years, 2 months, and 6 days old as of May 21, 2025 — or approximately 14,671 days of life experience. You have lived through roughly 352,104 hours. Your next birthday is in 9 months and 24 days. These numbers have more than novelty value — financial planners use exact age calculations for pension vesting, insurance underwriters use them for policy pricing, and doctors use them for age-adjusted health screening recommendations.",
    paragraph3:
      "The UK state pension age is currently 66 for both men and women, rising to 67 between 2026 and 2028. Knowing exactly how many months you are from state pension age determines whether it is worth making voluntary National Insurance contributions to increase your pension entitlement. Each missing year of NI contributions reduces your state pension by approximately £5.82 per week — £302.64 per year for the rest of your life.",
    h2Body:
      "Age calculation is more complex than subtracting birth year from the current year because months and days matter. If today is May 21 and your birthday is June 15, you have not yet had your birthday this year — your age is one year less than the year subtraction suggests. The CalcZen age calculator accounts for leap years, varying month lengths, and the exact day of calculation to give a precise result rather than a rounded approximation.",
    h3Body:
      "Legal age thresholds that depend on precise date calculations include: voting eligibility at exactly 18 years in the USA and UK, alcohol purchase at 21 in the USA and 18 in the UK, car rental eligibility (most companies require 25 years for standard rates), Medicare enrollment at 65 in the USA, and mandatory retirement account minimum distributions starting at age 73 in the USA from 2023 onwards. A date calculation error of even one day can affect legal eligibility in edge cases.",
    paragraph4:
      "Medical screening schedules are age-specific. In the USA, colorectal cancer screening begins at 45 for average-risk adults per the American Cancer Society guidelines updated in 2021. Mammogram screening is recommended annually from age 40 by the American College of Radiology. UK NHS breast screening begins at 50. Knowing your exact age relative to these thresholds tells you which screenings to request at your next GP or primary care appointment.",
    closingParagraph:
      "The age calculator above also shows how many days until your next birthday — useful for planning celebrations, applying for age-restricted services, or tracking milestone birthdays. Share your result using the share button to start conversations about how many days your friends and family have lived. It is the kind of surprising number that makes people stop and think.",
    internalLinks: [
      {
        text: "plan your retirement timeline with the",
        calculatorName: "Compound Interest Calculator",
        href: "/calculator/compound-interest-calculator",
      },
      {
        text: "calculate your health metrics alongside your age with the",
        calculatorName: "BMI Calculator",
        href: "/calculator/bmi-calculator",
      },
    ],
  },

  calorie: {
    primaryKeyword: "calorie calculator",
    h2Heading: "How Your Daily Calorie Need Is Calculated — The Science",
    h3Heading: "Why Most Calorie Deficits Fail After 6 Weeks",
    paragraph1:
      "A calorie calculator estimates your Total Daily Energy Expenditure (TDEE) — the number of calories your body needs each day to maintain your current weight at your current activity level. TDEE is the most important number in any fat loss, muscle gain, or weight maintenance plan because every sustainable dietary approach begins with knowing your personal maintenance calories. Generic 2,000 calorie guidelines are meaningless for anyone outside the narrow demographic they were designed for.",
    paragraph2:
      "For a 34-year-old male who is 180 cm tall, weighs 85 kg, and exercises 3 to 4 times per week, the Mifflin-St Jeor equation produces a TDEE of approximately 2,847 calories per day. To lose 0.5 kg per week this person needs a 500 calorie daily deficit — consuming 2,347 calories per day. At that rate, losing 5 kg takes 10 weeks. To lose 1 kg per week requires a 1,000 calorie daily deficit, which is aggressive and sustainable only for people with significant excess weight.",
    paragraph3:
      "The quality of calories matters alongside the quantity. 2,000 calories of whole foods produces different hormonal and satiety responses than 2,000 calories of processed food — even though the calorie counts are identical. Research from the National Institutes of Health shows that ultra-processed food diets lead to 500 additional calories consumed per day compared to whole food diets when subjects are given unlimited access to both. Calorie counting is most effective when combined with food quality awareness.",
    h2Body:
      "The Mifflin-St Jeor equation calculates Basal Metabolic Rate (BMR) — the calories burned at complete rest. For men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5. For women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) - 161. TDEE is then calculated by multiplying BMR by an activity factor: 1.2 for sedentary, 1.375 for light exercise, 1.55 for moderate exercise, 1.725 for heavy exercise, and 1.9 for very heavy exercise or a physical job. The CalcZen calorie calculator uses the Mifflin-St Jeor formula because it is the most accurate for the majority of adults according to a 2005 meta-analysis in the Journal of the American Dietetic Association.",
    h3Body:
      "Most calorie deficits fail after 6 weeks because the body adapts to lower calorie intake through a process called metabolic adaptation. When you consistently eat below maintenance calories, your body reduces TDEE by 10% to 15% through unconscious reductions in movement, body temperature regulation, and non-exercise activity thermogenesis (NEAT). This is why weight loss often plateaus after initial success. The solution is a diet break — returning to maintenance calories for 1 to 2 weeks every 6 to 8 weeks — which resets metabolic adaptation and makes subsequent deficits more effective.",
    paragraph4:
      "Protein intake is the most important dietary variable for both fat loss and muscle preservation. Research consistently shows that 1.6 to 2.2 grams of protein per kilogram of body weight per day maximises muscle retention during a calorie deficit. For an 80 kg person that means 128 to 176 grams of protein daily — significantly more than the 0.8 g/kg recommended dietary allowance, which was designed to prevent deficiency rather than optimise body composition.",
    closingParagraph:
      "Recalculate your TDEE every 4 to 6 weeks as your weight changes — a lighter body burns fewer calories and your maintenance level decreases accordingly. The calorie calculator above gives you the exact numbers for your current weight. Use the result as your starting point, track your actual weight change over two weeks, and adjust your calorie target based on real data rather than theoretical projections.",
    internalLinks: [
      {
        text: "track your weight against healthy ranges with the",
        calculatorName: "BMI Calculator",
        href: "/calculator/bmi-calculator",
      },
      {
        text: "see how consistent small savings compound over time",
        calculatorName: "Compound Interest Calculator",
        href: "/calculator/compound-interest-calculator",
      },
    ],
  },

  water: {
    primaryKeyword: "water intake calculator",
    h2Heading: "How Much Water Your Body Actually Needs Each Day",
    h3Heading: "Hydration for Exercise, Heat, and Weight Loss",
    paragraph1:
      "A water intake calculator estimates how many litres or cups of water you should drink daily based on your body weight and activity level. The NHS recommends 6 to 8 glasses of fluid per day for average UK adults, while many US health organisations suggest roughly 3.7 litres for men and 2.7 litres for women including fluids from food. Your personal target depends on weight, climate, exercise intensity, and pregnancy status — not a single universal number.",
    paragraph2:
      "A common rule used by dietitians is 35 ml per kilogram of body weight per day as a baseline. A 70 kg adult needs about 2.45 litres before adding exercise. Thirty minutes of moderate exercise adds roughly 350 ml — bringing the total to about 2.8 litres, or 12 standard 240 ml cups. Dehydration of just 2% of body weight impairs concentration and endurance; athletes can lose 1 to 2 litres per hour in hot conditions.",
    paragraph3:
      "Coffee, tea, milk, and water-rich foods such as fruit and soup all count toward hydration. Plain water remains the most efficient choice because it has zero calories and no diuretic effect at normal consumption levels. UK and US adults who replace sugary drinks with water often cut 200 to 400 calories daily without changing food intake — a change that can produce 10 to 20 kg of fat loss over a year if sustained.",
    h2Body:
      "The water intake calculator on CalcZen combines weight-based hydration with an activity multiplier. Heavier people need more absolute volume; active people need extra fluid to replace sweat losses. A 90 kg person doing 60 minutes of daily exercise may need 3.5 litres compared to 2.6 litres for a sedentary 60 kg person. Spread intake across the day — drinking 500 ml in one sitting is less effective than steady sips because the kidneys process fluid more efficiently at moderate rates.",
    h3Body:
      "Exercise hydration should begin before you train. Drinking 400 to 600 ml two hours before exercise, then 150 to 250 ml every 15 to 20 minutes during activity, reduces cramping and performance drops. After exercise, replace roughly 1.5 litres per kilogram of body weight lost on the scales. Hot UK summers and humid US climates increase needs by 500 to 1,000 ml daily even without formal exercise. Breastfeeding women need an extra 700 ml per day above baseline according to WHO guidance.",
    paragraph4:
      "Signs you may need more water include dark yellow urine, headaches, dry mouth, and afternoon fatigue. Clear or pale straw-coloured urine usually indicates adequate hydration. Older adults often feel thirst less sharply, so scheduled drinks at meals and mid-morning breaks matter more after age 65. Medications such as diuretics change requirements — discuss targets with your GP if you manage heart or kidney conditions.",
    closingParagraph:
      "Use the water intake calculator whenever your weight, exercise routine, or season changes. Recalculate after gaining or losing 5 kg, starting a new training block, or moving to a hotter climate. Pair your hydration target with the BMI calculator and calorie calculator to align fluid intake with weight and energy goals for a complete daily health picture.",
    internalLinks: [
      {
        text: "check healthy weight for your height",
        calculatorName: "BMI Calculator",
        href: "/calculator/bmi-calculator",
      },
      {
        text: "balance fluids with daily calorie targets",
        calculatorName: "Calorie Calculator",
        href: "/calculator/calorie-calculator",
      },
    ],
  },

  pregnancy: {
    primaryKeyword: "pregnancy due date calculator",
    h2Heading: "How Your Due Date Is Calculated From Your Last Period",
    h3Heading: "Trimesters, Screening Weeks, and When to Call Your Provider",
    paragraph1:
      "A pregnancy due date calculator applies Naegele's rule — add 280 days (40 weeks) to the first day of your last menstrual period (LMP) — to estimate when your baby is likely to arrive. Only about 5% of babies are born on the exact due date; most arrive between 37 and 42 weeks. The calculator gives you a planning anchor for maternity leave, nursery prep, and prenatal appointments in the USA and UK.",
    paragraph2:
      "If your LMP started on 1 January 2025, your estimated due date is 8 October 2025. At 21 May 2025 you would be roughly 20 weeks pregnant — halfway through the second trimester. Early ultrasound dating between 8 and 13 weeks can adjust this date by several days if cycle length differs from the standard 28-day assumption. IVF pregnancies use embryo transfer date instead of LMP, which is more precise.",
    paragraph3:
      "UK NHS care includes the 12-week dating scan and the 20-week anomaly scan — both scheduled from gestational age. US prenatal guidelines recommend first-trimester screening around 11 to 14 weeks and anatomy ultrasound near 20 weeks. Knowing your current week helps you book tests in the correct window rather than missing time-sensitive options such as combined screening or NIPT.",
    h2Body:
      "Gestational age counts from LMP, not from conception. Conception typically occurs around day 14 of a 28-day cycle, so at 4 weeks pregnant by LMP the embryo is only about 2 weeks old biologically. The pregnancy due date calculator shows both calendar due date and current week so you can align with clinic paperwork. Long or irregular cycles may shift ovulation — a dating scan remains the gold standard when LMP is uncertain.",
    h3Body:
      "Trimester boundaries are weeks 0 to 12 (first), 13 to 26 (second), and 27 to 40+ (third). Second trimester often brings reduced nausea and increased energy; third trimester brings weekly monitoring for blood pressure and fetal movement in high-risk pregnancies. Call your midwife or OB immediately for heavy bleeding, severe headache with vision changes, reduced fetal movement after 28 weeks, or regular contractions before 37 weeks.",
    paragraph4:
      "UK employees can take up to 52 weeks maternity leave; Statutory Maternity Pay often applies for 39 weeks subject to eligibility. US leave varies by employer and state — FMLA provides up to 12 weeks unpaid job-protected leave for qualifying workers. Planning finance around your due date means modelling income during leave using your household budget and any short-term disability benefits.",
    closingParagraph:
      "Update the pregnancy due date calculator if your clinician revises your EDD after ultrasound. Keep a note of your current week for every appointment. Combine this timeline with the age calculator for older siblings and the water intake calculator for hydration targets if you are increasing fluids during pregnancy.",
    internalLinks: [
      {
        text: "track exact ages for family milestones",
        calculatorName: "Age Calculator",
        href: "/calculator/age-calculator",
      },
      {
        text: "support hydration during pregnancy",
        calculatorName: "Water Intake Calculator",
        href: "/calculator/water-intake-calculator",
      },
    ],
  },

  bmr: {
    primaryKeyword: "BMR calculator",
    h2Heading: "What Basal Metabolic Rate Tells You About Daily Calories",
    h3Heading: "From BMR to TDEE — Adding Activity and Goals",
    paragraph1:
      "A BMR calculator estimates Basal Metabolic Rate — the calories your body burns at complete rest to keep your heart, lungs, brain, and organs functioning. BMR typically accounts for 60% to 75% of total daily energy use for sedentary adults. The Mifflin-St Jeor equation is the standard used by NHS dietitians and US clinical nutritionists because it predicts measured metabolism more accurately than older formulas for most adults.",
    paragraph2:
      "A 30-year-old man at 175 cm and 72 kg has a BMR of about 1,679 kcal per day. A woman of the same age, height, and weight has about 1,518 kcal because of differences in lean mass and hormonal factors. Multiplying BMR by an activity factor gives Total Daily Energy Expenditure (TDEE). At 1.55 (moderate exercise), those figures become roughly 2,602 kcal and 2,353 kcal respectively — the maintenance calories before any fat-loss deficit.",
    paragraph3:
      "Undereating far below BMR for long periods can slow thyroid output and reduce non-exercise movement unconsciously. Very low calorie diets below 1,200 kcal for women or 1,500 kcal for men without medical supervision risk muscle loss and nutrient gaps. A sustainable fat-loss plan usually sets intake at 15% to 25% below TDEE, not below BMR, unless directed by a registered dietitian or physician.",
    h2Body:
      "The Mifflin-St Jeor BMR formulas are: men — (10 × kg) + (6.25 × cm) − (5 × age) + 5; women — (10 × kg) + (6.25 × cm) − (5 × age) − 161. A 45-year-old woman at 165 cm and 78 kg has BMR ≈ 1,456 kcal. Adding light activity (×1.375) yields TDEE ≈ 2,002 kcal. The BMR calculator isolates rest-only burn so you can see how much movement and exercise add on top — often 400 to 900 kcal for desk workers who train three times weekly.",
    h3Body:
      "Muscle mass raises BMR: two people at the same weight can differ by 200 to 300 kcal daily if one carries more lean tissue. Strength training during a cut helps preserve BMR better than cardio alone. Sleep deprivation of even one night can reduce next-day energy expenditure and increase hunger hormones — another reason BMR is a baseline, not a fixed destiny. Recalculate every 4 to 6 weeks as weight changes.",
    paragraph4:
      "UK food labelling and US FDA labels use kcal interchangeably called Calories. Athletes in heavy training may need 1.9 × BMR or higher. Older adults sometimes need slightly higher protein per kg to protect muscle even when total calories drop. Pair BMR results with medical advice if you manage diabetes, eating disorders, or are pregnant — standard equations are not tuned for those states.",
    closingParagraph:
      "Run the BMR calculator after every 3 to 5 kg change in body weight. Use the result with the calorie calculator for full TDEE and weight-loss targets, and the BMI calculator to see whether your current weight sits in a healthy range. Together they form a clear numbers-based plan without guesswork.",
    internalLinks: [
      {
        text: "turn BMR into daily calorie targets",
        calculatorName: "Calorie Calculator",
        href: "/calculator/calorie-calculator",
      },
      {
        text: "screen weight status alongside metabolism",
        calculatorName: "BMI Calculator",
        href: "/calculator/bmi-calculator",
      },
    ],
  },
};
