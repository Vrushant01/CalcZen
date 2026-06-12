const fs = require('fs');
const path = require('path');

const calculatorsDir = 'c:/Users/HP/Downloads/CalcVerse-pdfchange/CalcVerse-pdfchange/src/calculators';

const faqsData = {
  "401kCalculator.tsx": [
    {
      q: "What is a 401(k) calculator?",
      a: "A 401(k) calculator is an online tool that projects the future value of your employer-sponsored retirement account based on your salary, contributions, investment returns, and employer matching rules. It helps you visualize how compounding interest and regular salary deferrals grow your retirement nest egg over time."
    },
    {
      q: "How does an employer match work?",
      a: "An employer match is when your employer contributes money to your 401(k) based on your own contribution rate. Typically, they match a percentage of your salary up to a certain limit (e.g., 50% of your contributions up to 6% of your salary). This represents free money and immediate returns on your savings."
    },
    {
      q: "What are the contribution limits for a 401(k)?",
      a: "The IRS sets annual contribution limits for 401(k) accounts, which adjust periodically for inflation. For 2024, the basic employee deferral limit is $23,000, while individuals aged 50 or older can make an additional catch-up contribution of $7,500. Total employer plus employee contributions are also subject to combined annual limits."
    },
    {
      q: "What is the difference between a traditional and Roth 401(k)?",
      a: "A traditional 401(k) uses pre-tax contributions, which lowers your taxable income today, but you pay ordinary income tax on withdrawals in retirement. A Roth 401(k) uses after-tax contributions, meaning you get no tax break now, but all qualifying withdrawals in retirement are entirely tax-free. Choose based on your current tax bracket."
    },
    {
      q: "How does compounding interest affect my 401(k) balance?",
      a: "Compounding interest is the process where your investment earnings generate their own earnings over time. By reinvesting dividends and capital gains, your 401(k) balance grows exponentially. Starting early is critical, as a few extra years of compounding can result in hundreds of thousands of dollars in additional retirement wealth."
    },
    {
      q: "Should I maximize my 401(k) contributions?",
      a: "You should aim to contribute at least enough to receive your employer's full matching contribution, as this is equivalent to a 100% return on your investment. If your budget allows, maximizing your contributions up to the IRS limit helps secure your long-term financial independence and reduces your current income tax burden."
    },
    {
      q: "What happens if I withdraw money early from my 401(k)?",
      a: "If you withdraw money from a traditional 401(k) before age 59&frac12;, you will generally face a 10% IRS early withdrawal penalty on top of paying standard federal and state income taxes on the distributed amount. Some exceptions apply for hardships or first-time home purchases, but early withdrawals severely disrupt compounding growth."
    },
    {
      q: "How do salary increases affect my retirement savings?",
      a: "When your salary increases, your 401(k) contributions grow proportionally if you save a fixed percentage of your income. To accelerate your wealth, you can implement 'contribution rate matching' by allocating a portion of your raise directly to your retirement savings rate, as modeled in our <a href=\"/calculator/retirement-calculator\" class=\"text-primary hover:underline\">Retirement Calculator</a>."
    }
  ],
  "AgeCalculator.tsx": [
    {
      q: "What is an age calculator?",
      a: "An age calculator is an online chronological tool that determines the exact time interval between a birth date and a target date. It displays age in years, months, weeks, days, hours, and minutes. It helps users track milestones, calculate time elapsed, or see the countdown to their next birthday."
    },
    {
      q: "How is my exact age calculated?",
      a: "Your exact age is calculated by comparing the calendar dates of your birth date and the current date. The calculation accounts for leap years (which contain 366 days), the varying number of days in calendar months, and time zones to ensure precise hour and minute details are rendered."
    },
    {
      q: "What is a leap year and how does it affect age calculations?",
      a: "A leap year occurs every four years and adds an extra day (February 29) to the calendar to keep it aligned with the Earth's orbit. Age calculators account for these extra days when calculating your age in total days, weeks, or minutes, preventing minor drift errors over decades."
    },
    {
      q: "Can I use this tool to calculate age on a future date?",
      a: "Yes, you can use this tool to calculate your age on any past or future target date. This is useful for planning retirement dates, verifying age requirements for upcoming travel or events, or seeing exactly how old you will be when you reach specific financial milestones, like buying a home."
    },
    {
      q: "How does the next birthday countdown work?",
      a: "The next birthday countdown calculates the difference between the current date and the date of your upcoming birthday. It displays the remaining months, days, hours, and minutes. This helps you plan birthday celebrations or count down the days until a major age milestone or adult age requirement."
    },
    {
      q: "Why does my age in days seem higher than expected?",
      a: "Your age in days seems high because it counts every single 24-hour period you have lived, including leap years. Over decades, the extra leap days add up. For example, a 30-year-old has lived over 10,950 days. Track other everyday metrics like tipping using our <a href=\"/calculator/tip-calculator\" class=\"text-primary hover:underline\">Tip Calculator</a>."
    },
    {
      q: "What does chronological age mean?",
      a: "Chronological age is the amount of time that has passed from your birth date to the present date. It is measured in calendar units like years, months, and days. It is the standard legal measurement of age used for government documents, educational registration, retirement eligibility, and general everyday social milestones."
    },
    {
      q: "How does time calculation relate to other calculators?",
      a: "Time calculation is a basic component of many calculators. For example, tracking interest growth over a specific period is essential in financial tools. You can apply your age or remaining working years to plan long-term retirement goals and project nest egg savings with our advanced <a href=\"/calculator/retirement-calculator\" class=\"text-primary hover:underline\">Retirement Calculator</a>."
    }
  ],
  "BMICalculator.tsx": [
    {
      q: "What is BMI?",
      a: "Body Mass Index (BMI) is a medical screening metric that estimates your body fat relative to your height and weight. It is calculated by dividing your weight in kilograms by the square of your height in meters. It places individuals into clinical categories like underweight, healthy weight, overweight, or obese to screen for risks."
    },
    {
      q: "Is BMI accurate?",
      a: "BMI is generally accurate as a population-level screening tool, but it does have limitations for individuals. Because it does not distinguish between muscle mass and fat mass, highly muscular athletes or bodybuilders can be classified as overweight. It should be evaluated alongside other health indicators, such as those estimated in our <a href=\"/calculator/bmr-calculator\" class=\"text-primary hover:underline\">BMR Calculator</a>."
    },
    {
      q: "What is a healthy BMI range?",
      a: "For most adults, a healthy BMI range is between 18.5 and 24.9. A score below 18.5 is considered underweight, 25 to 29.9 is overweight, and 30 or above is obese. Maintaining a healthy BMI reduces the risk of cardiovascular disease, type 2 diabetes, and hypertension. Track your daily nutrition targets with our <a href=\"/calculator/calorie-calculator\" class=\"text-primary hover:underline\">Calorie Calculator</a>."
    },
    {
      q: "Can athletes use BMI?",
      a: "Athletes can use BMI, but they must interpret the results with caution. Since muscle tissue is denser than fat tissue, muscular athletes may have a high BMI that suggests they are overweight or obese, despite having very low body fat. They should combine BMI with body fat percentage measurements for a complete picture."
    },
    {
      q: "Does age affect BMI?",
      a: "Age does not change the basic BMI formula, but it does affect how BMI categories are interpreted. Older adults naturally lose muscle mass and gain fat, meaning a slightly higher BMI (25-27) may actually be healthier for them. For children and teens, BMI is plotted on growth percentiles to account for age and sex development."
    },
    {
      q: "How does BMI relate to overall body weight?",
      a: "BMI estimates your body weight category to help you understand if your weight is appropriate for your height. Being underweight or obese carries metabolic health risks. If you are adjusting your physical activity or dietary habits to modify your weight, keeping track of your hydration using our <a href=\"/calculator/water-intake-calculator\" class=\"text-primary hover:underline\">Water Intake Calculator</a> is also recommended."
    },
    {
      q: "What is the difference between BMI and BMI Prime?",
      a: "BMI is the standard ratio of weight to height, while BMI Prime is a ratio of your actual BMI to the upper limit of the healthy range (25). A BMI Prime of 1.0 or lower is healthy, while anything above 1.0 indicates you are overweight. It provides a quick look at how far you deviate from healthy limits."
    },
    {
      q: "How does body composition influence my health metrics?",
      a: "Body composition&mdash;the ratio of fat, muscle, bone, and water in your body&mdash;is a much more detailed health indicator than BMI alone. Two people with the same BMI can have completely different body composition profiles and health risks. Understanding your body's energy consumption at rest can be further explored using our metabolic <a href=\"/calculator/bmr-calculator\" class=\"text-primary hover:underline\">BMR Calculator</a>."
    }
  ],
  "BMRCalculator.tsx": [
    {
      q: "What is Basal Metabolic Rate (BMR)?",
      a: "Basal Metabolic Rate (BMR) represents the minimum number of calories your body requires to perform basic, life-sustaining metabolic functions (like breathing, circulation, and cell production) at complete rest. It serves as the baseline for calculating your total daily energy usage and structuring your personal diet plans."
    },
    {
      q: "How is BMR calculated?",
      a: "BMR is calculated using standardized clinical formulas like the Mifflin-St Jeor or Harris-Benedict equations. These calculations take into account variables such as age, biological sex, height, and weight. Lenders of energy metabolism rely on these parameters because physical dimensions dictate resting cellular energy consumption."
    },
    {
      q: "Why does sex affect BMR?",
      a: "Biological sex affects BMR because men typically have a higher percentage of lean muscle mass, while women tend to possess more fat tissue. Muscle is metabolically active and burns more calories at rest than fat, which leads to higher baseline BMR scores in men of similar size."
    },
    {
      q: "How does BMR differ from TDEE?",
      a: "BMR represents calories burned at complete rest, while Total Daily Energy Expenditure (TDEE) includes your BMR plus the calories burned through physical activities and food digestion. To manage body weight, you must structure your food intake relative to your TDEE rather than your BMR. Explore daily caloric needs with our <a href=\"/calculator/calorie-calculator\" class=\"text-primary hover:underline\">Calorie Calculator</a>."
    },
    {
      q: "Can I increase my BMR?",
      a: "You can increase your BMR by building lean muscle mass through resistance training. Since muscle tissue is denser and metabolically more active than adipose fat tissue, having more muscle raises your resting calorie expenditure. Staying well-hydrated is also key, which you can track using our <a href=\"/calculator/water-intake-calculator\" class=\"text-primary hover:underline\">Water Intake Calculator</a>."
    },
    {
      q: "Why does BMR decrease with age?",
      a: "BMR decreases with age due to sarcopenia, which is the natural loss of lean muscle tissue and the accumulation of fat that occurs as we grow older. Physical activity levels and hormone production also drop over time, causing a gradual decline in the body's resting metabolic rate."
    },
    {
      q: "Does losing weight lower my BMR?",
      a: "Yes, losing weight lowers your BMR because a smaller body requires less energy to sustain itself. This metabolic adaptation is why weight loss can plateau over time, requiring you to recalculate your baseline resting metabolism and adjust physical activity or caloric intake targets accordingly."
    },
    {
      q: "How should I use BMR for weight loss planning?",
      a: "To plan weight loss, first calculate your BMR, then multiply it by your activity multiplier to find your TDEE. Eating fewer calories than your TDEE creates a caloric deficit, prompting weight loss. You can check your general body weight categories online using our <a href=\"/calculator/bmi-calculator\" class=\"text-primary hover:underline\">BMI Calculator</a>."
    }
  ],
  "CalorieCalculator.tsx": [
    {
      q: "What is a calorie calculator?",
      a: "A calorie calculator is a nutritional tool that estimates the total number of calories your body needs to maintain, lose, or gain weight. It uses your height, weight, age, sex, and exercise frequency to compute your total daily energy expenditure (TDEE) and outline macro guidelines."
    },
    {
      q: "What is TDEE and how does it work?",
      a: "Total Daily Energy Expenditure (TDEE) is an estimation of how many calories your body burns in a single 24-hour period, factoring in your basal metabolic rate (BMR) and physical activity levels. Eating below your TDEE triggers weight loss, while eating above it promotes weight gain. Balance hydration with our <a href=\"/calculator/water-intake-calculator\" class=\"text-primary hover:underline\">Water Intake Calculator</a>."
    },
    {
      q: "How many calories should I eat to lose weight?",
      a: "To lose weight safely, you should aim for a modest caloric deficit of 300 to 500 calories below your calculated TDEE. This range facilitates a sustainable fat loss rate of about 0.5 to 1 pound per week, preserving lean muscle mass and preventing hormonal disruption."
    },
    {
      q: "How does physical activity affect my calorie needs?",
      a: "Physical activity raises your daily calorie requirements because muscles require ATP energy to contract and recover. The more active you are, the higher your activity multiplier, which directly increases your TDEE. Keeping your multiplier accurate prevents overestimating how much food you should consume."
    },
    {
      q: "Should I eat differently depending on my fitness goals?",
      a: "Yes. For fat loss, keep a caloric deficit and eat plenty of protein to protect muscles. For muscle gain, maintain a caloric surplus and pair it with strength training. Track your metabolic base rate at rest to refine these goals by visiting our <a href=\"/calculator/bmr-calculator\" class=\"text-primary hover:underline\">BMR Calculator</a>."
    },
    {
      q: "Are all calories created equal for health?",
      a: "While weight change is driven by thermodynamic energy balance, food quality affects appetite, metabolic rate, and muscle growth. Getting calories from lean proteins, complex carbs, and healthy fats is much better for energy, satiety, and health than consuming processed simple sugars."
    },
    {
      q: "How accurate are calorie calculators?",
      a: "Calorie calculators provide a highly accurate statistical baseline, but individual metabolism can vary by 10-15% based on genetics, muscle mass, and thyroid health. Use the calculator's estimate as a starting point and adjust based on weight changes over several weeks. Monitor your general health with our <a href=\"/calculator/bmi-calculator\" class=\"text-primary hover:underline\">BMI Calculator</a>."
    },
    {
      q: "What is metabolic adaptation?",
      a: "Metabolic adaptation is the body's natural response to prolonged caloric restriction, where it lowers its resting energy expenditure to conserve fuel. This slowdown is why continuous dieting gets harder. Taking diet breaks and increasing resistance training helps mitigate this metabolic decline."
    }
  ],
  "CompoundInterestCalculator.tsx": [
    {
      q: "What is compound interest?",
      a: "Compound interest is the addition of interest to the principal sum of a deposit or loan, where interest earns interest on itself. This compounding effect causes investments to grow exponentially over time, especially when compared to simple interest. It is a cornerstone of long-term financial planning."
    },
    {
      q: "How does compound frequency affect investment growth?",
      a: "Compound frequency refers to how often accumulated interest is calculated and added to the principal balance. The more frequently interest compounds (e.g., daily or monthly instead of annually), the faster your wealth accumulates. You can calculate other borrowing scenarios with our <a href=\"/calculator/loan-emi-calculator\" class=\"text-primary hover:underline\">Loan EMI Calculator</a>."
    },
    {
      q: "What is the difference between simple and compound interest?",
      a: "Simple interest is calculated solely on the initial principal amount invested. Compound interest is calculated on the initial principal plus all interest accumulated from previous periods. Over long horizons, this compounding difference creates a massive divergence in total savings growth."
    },
    {
      q: "How does inflation affect my compound returns?",
      a: "Inflation erodes the purchasing power of your money over time, meaning a dollar today buys less in the future. When evaluating long-term investment projections, you must subtract the inflation rate from your nominal yield to find the real rate of return and avoid overestimating future spending power."
    },
    {
      q: "Can I calculate future value with monthly contributions?",
      a: "Yes, our calculator lets you model monthly or annual contributions alongside your initial principal. Regular contributions accelerate the compounding process, as interest is immediately earned on the new deposits. You can check percentage-based budget allocations with our <a href=\"/calculator/percentage-calculator\" class=\"text-primary hover:underline\">Percentage Calculator</a>."
    },
    {
      q: "What is the Rule of 72?",
      a: "The Rule of 72 is a quick mental formula used to estimate how many years it will take for an investment to double at a fixed annual rate of interest. Simply divide 72 by your annual interest rate (e.g., at a 6% return, your money doubles in about 12 years)."
    },
    {
      q: "Why is starting early so important for compound growth?",
      a: "Starting early is critical because compounding interest relies heavily on time. In the initial years, growth is slow, but in later decades, the exponential curve bends sharply upward. A delay of just five years early in life can cut your final retirement nest egg in half."
    },
    {
      q: "How does compound interest relate to retirement planning?",
      a: "Retirement planning relies on compounding interest to build a nest egg large enough to support you without working. By consistently saving over your career, your contributions build a self-sustaining asset. Estimate your retirement targets and contribution matches with our dedicated <a href=\"/calculator/retirement-calculator\" class=\"text-primary hover:underline\">Retirement Calculator</a>."
    }
  ],
  "LoanEMICalculator.tsx": [
    {
      q: "What is a loan EMI?",
      a: "An Equated Monthly Installment (EMI) is a fixed payment made by a borrower to a lender at a scheduled date each month. It covers both principal and interest. The EMI remains constant throughout the loan term, though the proportions allocated to interest and principal change."
    },
    {
      q: "How does interest rate affect my EMI?",
      a: "A higher interest rate directly increases the interest component of your payment, raising your monthly EMI and the total cost of the loan. Conversely, securing a lower interest rate reduces your monthly payment. You can analyze other monthly interest-compounding scenarios using our <a href=\"/calculator/mortgage-calculator\" class=\"text-primary hover:underline\">Mortgage Calculator</a>."
    },
    {
      q: "What is the difference between flat and reducing interest rates?",
      a: "A flat rate calculates interest on the entire original principal for the whole term, which is very expensive. A reducing balance rate calculates interest only on the outstanding principal balance each month. As you repay the principal, the monthly interest charge decreases significantly."
    },
    {
      q: "Can I lower my EMI by extending the loan term?",
      a: "Yes, extending the loan term spreads principal repayment over more months, lowering your monthly EMI. However, this dramatically increases the total interest paid over the life of the loan. You can see how compounding impacts long-term capital by visiting our <a href=\"/calculator/compound-interest-calculator\" class=\"text-primary hover:underline\">Compound Interest Calculator</a>."
    },
    {
      q: "What is a loan amortization schedule?",
      a: "A loan amortization schedule is a complete table showing the breakdown of every monthly payment over the life of the loan. It displays the exact amount of each payment that goes toward interest, how much goes toward principal, and the remaining loan balance after each installment."
    },
    {
      q: "Are prepayments beneficial for reducing loan costs?",
      a: "Yes, making extra prepayments directly toward your loan's principal balance is highly beneficial. It reduces the outstanding principal, which lowers the interest charged in all subsequent months. This lets you pay off the debt faster and saves thousands of dollars in lifetime interest costs."
    },
    {
      q: "What is the processing fee on loans?",
      a: "A processing fee is a one-time charge levied by lenders to cover the administrative costs of evaluating and documenting your loan application. It is typically a small percentage of the total loan amount and is either deducted from the disbursed loan or paid upfront."
    },
    {
      q: "How should I plan my monthly borrowing budget?",
      a: "You should plan your borrowing budget by keeping your total monthly debt payments (including loans, credit cards, and housing) below 36% of your gross monthly income. You can easily determine percentage allocations and verify your debt ratios with our online <a href=\"/calculator/percentage-calculator\" class=\"text-primary hover:underline\">Percentage Calculator</a>."
    }
  ],
  "MortgageCalculator.tsx": [
    {
      q: "What is a mortgage calculator?",
      a: "A mortgage calculator is an online financial tool that estimates your monthly housing payment based on key parameters such as the home purchase price, down payment size, annual interest rate, and loan term. It helps buyers budget their finances and see the total cost of interest over the life of the loan."
    },
    {
      q: "How is mortgage interest calculated?",
      a: "Mortgage interest is calculated monthly using the remaining principal balance of your home loan. Lenders divide the annual interest rate by twelve and multiply it by the outstanding balance. Early payments go mostly toward interest, but over time, more of your money reduces the principal balance, as modeled in our standard <a href=\"/calculator/loan-emi-calculator\" class=\"text-primary hover:underline\">Loan EMI Calculator</a>."
    },
    {
      q: "Should I include property taxes?",
      a: "Yes, you should always include property taxes in your mortgage calculations because they are a mandatory component of your total monthly housing obligation (PITI). Local governments assess property taxes annually, and lenders typically collect a prorated amount monthly via escrow. Excluding taxes will lead to a significant understatement of your true cost of homeownership."
    },
    {
      q: "What affects monthly mortgage payments?",
      a: "Your monthly mortgage payments are affected by several factors including the home price, down payment amount, interest rate, loan tenure, property taxes, home insurance premiums, and any applicable homeowners association (HOA) fees. Adjusting these numbers changes your monthly cash flow, and you can see how interest compounding affects your wealth by using our <a href=\"/calculator/compound-interest-calculator\" class=\"text-primary hover:underline\">Compound Interest Calculator</a>."
    },
    {
      q: "How much house can I afford?",
      a: "To determine how much house you can afford, financial experts recommend the 28/36 rule. Under this rule, your monthly mortgage payment (PITI) should not exceed 28% of your gross monthly income, and your total debt obligations should stay below 36%. You can easily run percentage-based budgets using our handy <a href=\"/calculator/percentage-calculator\" class=\"text-primary hover:underline\">Percentage Calculator</a>."
    },
    {
      q: "Is a 15-year or 30-year mortgage better?",
      a: "A 15-year mortgage has higher monthly payments but charges a lower interest rate, helping you save thousands in lifetime interest and build equity quickly. A 30-year mortgage features lower monthly payments for budget flexibility but results in much higher overall interest costs. Choosing depends on your monthly cash flow constraints and long-term financial planning goals."
    },
    {
      q: "How can I avoid paying Private Mortgage Insurance (PMI)?",
      a: "You can avoid paying Private Mortgage Insurance (PMI) by putting down at least 20% of the home's purchase price. Lenders require PMI on conventional loans with down payments below 20% to protect themselves against borrower default. Once your home equity reaches 20% of the property value, you can request to cancel your PMI policy."
    },
    {
      q: "Does prepaying my mortgage principal save money?",
      a: "Yes, making extra payments directly toward your mortgage principal balance saves a substantial amount of money. By reducing the outstanding principal balance, you reduce the base on which monthly interest is calculated. This shortens your loan term and cuts your overall interest burden, letting you pay off the home years ahead of schedule."
    }
  ],
  "PercentageCalculator.tsx": [
    {
      q: "How do I calculate percentage increase?",
      a: "To calculate percentage increase, subtract the original starting value from the new final value, divide the difference by the original starting value, and then multiply the result by 100. This calculation determines the relative rate of growth between two numbers over a specific period."
    },
    {
      q: "How do I calculate discounts?",
      a: "To calculate a discount, multiply the original price of the item by the discount percentage rate, then divide by 100 to find the discount amount. Subtract this discount amount from the original price to determine the final sale price. This is useful for shopping and budgeting."
    },
    {
      q: "What is percentage difference?",
      a: "Percentage difference measures the relative difference between two values when there is no clear direction or starting value. It is calculated by dividing the absolute difference between the two numbers by their average, then multiplying by 100 to express the value as a percentage."
    },
    {
      q: "Can I calculate sales tax?",
      a: "Yes, you can calculate sales tax by multiplying the purchase price of your items by the local sales tax rate, then dividing by 100. Adding this calculated tax amount to the purchase price gives your total final cost. You can calculate gratuity offsets in dining bills using our <a href=\"/calculator/tip-calculator\" class=\"text-primary hover:underline\">Tip Calculator</a>."
    },
    {
      q: "How do markups work?",
      a: "A markup is the amount added to the wholesale cost of a product to determine its retail price. It is calculated by multiplying the cost by the markup percentage. Markups ensure a retail sale generates enough gross margin to cover operating expenses and business profitability."
    },
    {
      q: "What is the difference between percentage change and percentage points?",
      a: "Percentage change measures the relative difference between two numbers, while percentage points measure the absolute difference between two percentage values. For example, if an interest rate climbs from 5% to 6%, it represents a 1 percentage point increase, but a 20% relative percentage increase in the rate."
    },
    {
      q: "Why do consecutive discounts not add up directly?",
      a: "Consecutive discounts do not add up directly because the second discount applies to the already-reduced price, not to the original baseline price. Therefore, a 20% discount followed by a 10% discount equals a 28% total reduction, not a 30% reduction. Run compounding growth models with our <a href=\"/calculator/compound-interest-calculator\" class=\"text-primary hover:underline\">Compound Interest Calculator</a>."
    },
    {
      q: "How can percentage math help with personal debt management?",
      a: "Percentage calculations help you compare interest rates on credit cards and bank loans. Understanding the percentage rates of interest lets you allocate extra funds toward paying down the debt with the highest rate, which reduces overall borrowing costs. Check your monthly payments with our <a href=\"/calculator/loan-emi-calculator\" class=\"text-primary hover:underline\">Loan EMI Calculator</a>."
    }
  ],
  "PregnancyDueDateCalculator.tsx": [
    {
      q: "How is my estimated pregnancy due date calculated?",
      a: "Your estimated pregnancy due date is typically calculated using Naegele's rule, which adds 280 days (40 weeks) to the first day of your last menstrual period (LMP). The calculation assumes a regular 28-day menstrual cycle, with conception occurring approximately 14 days after the start of the period."
    },
    {
      q: "How accurate is the estimated due date?",
      a: "The estimated due date is a helpful guideline, but only about 4% to 5% of babies are born on their exact due date. Most births occur within a window of two weeks before or after the target date. Your healthcare provider may revise the date based on early dating ultrasounds."
    },
    {
      q: "What if I do not remember my last menstrual period?",
      a: "If you do not remember your LMP, your healthcare provider will estimate your due date using an early dating ultrasound, typically performed in the first trimester. The ultrasound measures the baby's crown-rump length, which provides a highly accurate estimate of gestational age."
    },
    {
      q: "Can a changing menstrual cycle affect my due date?",
      a: "Yes, variations in your menstrual cycle length can affect your actual due date. The standard calculation assumes a 28-day cycle. If your cycle is longer, ovulation occurs later, meaning your actual due date is likely later than standard LMP calculations estimate. Your doctor will adjust for this."
    },
    {
      q: "What is gestational age?",
      a: "Gestational age is the measurement of pregnancy progress, calculated from the first day of your last menstrual period. It is measured in weeks and days. Since ovulation occurs later, the baby's biological age (conception age) is typically two weeks less than the calculated gestational age."
    },
    {
      q: "What percentage of babies are born early or late?",
      a: "Approximately 90% of babies are born between weeks 37 and 42 of pregnancy, which is considered full term. Babies born before 37 weeks are premature, while those born after 42 weeks are post-term. Lenders of prenatal care monitor these milestones closely to ensure a safe delivery."
    },
    {
      q: "Why is tracking weight and nutrition important during pregnancy?",
      a: "Tracking weight gain and caloric intake is essential during pregnancy to support fetal growth and maintain maternal health. Caloric needs increase, especially in the second and third trimesters. You can estimate your base resting metabolism using our <a href=\"/calculator/bmr-calculator\" class=\"text-primary hover:underline\">BMR Calculator</a>, and evaluate general fitness by checking our <a href=\"/calculator/bmi-calculator\" class=\"text-primary hover:underline\">BMI Calculator</a>."
    },
    {
      q: "How does hydration impact pregnancy?",
      a: "Proper hydration is critical during pregnancy because water supports the formation of amniotic fluid, aids in nutrient transport, and prevents common pregnancy discomforts like urinary tract infections or swelling. Expecting mothers should track their daily fluid targets using our personalized <a href=\"/calculator/water-intake-calculator\" class=\"text-primary hover:underline\">Water Intake Calculator</a>."
    }
  ],
  "RetirementCalculator.tsx": [
    {
      q: "What is a retirement calculator?",
      a: "A retirement calculator is a financial planning tool that projects your future savings corpus and retirement readiness based on current age, retirement age, savings rate, investment yields, and inflation. It helps you determine if your current savings trajectory will support your target lifestyle."
    },
    {
      q: "What is the 4% rule in retirement?",
      a: "The 4% rule is a guideline stating that you can safely withdraw 4% of your retirement portfolio's value in the first year of retirement, and adjust that amount for inflation each subsequent year, without running out of money over a 30-year horizon. It helps size your required nest egg."
    },
    {
      q: "How does inflation affect my retirement planning?",
      a: "Inflation reduces the purchasing power of your money over time, meaning you will need a larger nominal income in retirement to maintain your current standard of living. Retirement calculators must factor in an inflation rate (usually 2-3% annually) to project realistic future costs and savings requirements."
    },
    {
      q: "How does compounding interest help my retirement fund?",
      a: "Compounding interest is when your savings earn investment returns, and those returns generate their own returns. Over decades, this creates exponential growth. Starting early maximizes compounding, making it much easier to build a large retirement corpus. Learn about investment growth by using our <a href=\"/calculator/compound-interest-calculator\" class=\"text-primary hover:underline\">Compound Interest Calculator</a>."
    },
    {
      q: "What is a Retirement Income Gap?",
      a: "A Retirement Income Gap is the shortfall between your projected retirement expenses and your guaranteed retirement income sources (like Social Security or pensions) plus your portfolio withdrawals. Identifying this gap early allows you to increase savings or adjust your retirement age to prevent financial hardship."
    },
    {
      q: "Should I prioritize saving in a 401(k) or IRA?",
      a: "You should prioritize saving in an employer-sponsored 401(k) at least up to the matching contribution limit, as this match is free money. Additional savings can be allocated to a Traditional or Roth IRA depending on your tax bracket. Explore employer matching options with our <a href=\"/calculator/401k-calculator\" class=\"text-primary hover:underline\">401(k) Calculator</a>."
    },
    {
      q: "How does my retirement age affect my savings needs?",
      a: "Retiring early increases the number of years your savings must support you and reduces the time your investments have to compound. Conversely, working longer allows your savings to grow further and increases your monthly Social Security benefits. You can calculate percentage budget shifts with our <a href=\"/calculator/percentage-calculator\" class=\"text-primary hover:underline\">Percentage Calculator</a>."
    },
    {
      q: "What is the difference between pre-tax and post-tax retirement savings?",
      a: "Pre-tax savings (traditional accounts) reduce your taxable income now, but withdrawals in retirement are taxed as ordinary income. Post-tax savings (Roth accounts) provide no tax break today, but withdrawals in retirement are entirely tax-free. Evaluating your future tax bracket helps determine which account type is most advantageous."
    }
  ],
  "ScientificCalculator.tsx": [
    {
      q: "What functions does a scientific calculator support?",
      a: "A scientific calculator supports advanced mathematical operations including trigonometry (sin, cos, tan), inverse trigonometry, logarithmic functions (log, ln), exponents, roots, factorials, and constants like Pi and e. It handles multi-step equations and order of operations (PEMDAS) for complex academic or engineering calculations."
    },
    {
      q: "Can it solve trigonometric equations?",
      a: "Yes, it can evaluate trigonometric functions and inverse trigonometric equations for any angle parameter. You must ensure the calculator is set to the correct mode (Degree or Radian) depending on the equation's formatting to prevent calculation errors. If you need simple arithmetic, use our <a href=\"/calculator/standard-calculator\" class=\"text-primary hover:underline\">Standard Calculator</a>."
    },
    {
      q: "Does it support radians and degrees?",
      a: "Yes, our scientific calculator features a toggle switch to transition between Degree (DEG) and Radian (RAD) modes. Degree mode is standard for basic geometry and physics, while Radian mode is essential for calculus, advanced physics, and engineering equations that involve circular motion."
    },
    {
      q: "What is scientific notation?",
      a: "Scientific notation is a method of writing very large or very small numbers using powers of 10 (e.g., 6.02 x 10^23). It simplifies calculations in chemistry, physics, and astronomy, allowing scientists to write values without long strings of placeholder zeros."
    },
    {
      q: "Can students use it for exams?",
      a: "Yes, online scientific calculators are excellent study tools for homework and exam preparation in courses like algebra, chemistry, and calculus. However, for physical classroom exams, standard academic rules typically require standalone physical hardware. Check percentage ratios for test grading with our <a href=\"/calculator/percentage-calculator\" class=\"text-primary hover:underline\">Percentage Calculator</a>."
    },
    {
      q: "What is the difference between log and ln?",
      a: "Log (common logarithm) calculates exponents using a base of 10, whereas Ln (natural logarithm) calculates exponents using the mathematical constant e (approximately 2.718). Common logarithms are standard in everyday scaling, while natural logarithms are vital in calculus and growth modeling."
    },
    {
      q: "How do parentheses affect the order of operations?",
      a: "Parentheses tell the calculator to evaluate the enclosed expression first, overriding standard algebraic precedence (PEMDAS). Using parentheses is critical when grouping terms in fraction numerators or exponent bases to ensure the calculator evaluates the expression exactly as intended."
    },
    {
      q: "Does this calculator preserve calculation history?",
      a: "Yes, our scientific calculator features an interactive session history panel that logs your equations and results. You can reuse previous calculations or copy results directly to your clipboard. This prevents manual copy errors during multi-step problems, letting you focus on the equations."
    }
  ],
  "StandardCalculator.tsx": [
    {
      q: "What is a standard calculator?",
      a: "A standard calculator is a basic mathematical tool designed to perform everyday arithmetic operations, including addition, subtraction, multiplication, and division. It features a simple layout and an interactive session history to track calculations, making it perfect for quick receipts and household budgeting."
    },
    {
      q: "Does the calculation history persist?",
      a: "Yes, the calculation history persists in-memory as you navigate our platform during your session. You can copy previous results or clear the history panel at any time. If you need advanced functions like trigonometry or logarithms, explore our advanced <a href=\"/calculator/scientific-calculator\" class=\"text-primary hover:underline\">Scientific Calculator</a>."
    },
    {
      q: "How do keyboard key mappings work?",
      a: "Our standard calculator supports keyboard inputs. Simply focus anywhere on the calculator page and press numbers, decimal points, or basic mathematical operators (+, -, *, /). Press Enter to solve the equation and Escape to clear the display screen, making calculations fast and seamless."
    },
    {
      q: "How do percentage calculations work?",
      a: "On a standard calculator, percentage operations calculate relative shifts or portions. For example, typing '100 + 5%' adds 5% of 100, resulting in 105. For detailed percentage differences, markups, or shopping discounts, we recommend using our specialized <a href=\"/calculator/percentage-calculator\" class=\"text-primary hover:underline\">Percentage Calculator</a>."
    },
    {
      q: "What happens if I divide by zero?",
      a: "Dividing by zero is mathematically undefined. If you attempt this operation on our calculator, it will display an error message. This is because division partition rules cannot divide a quantity into zero parts, preventing a logical numerical outcome."
    },
    {
      q: "How is a standard calculator different from a scientific one?",
      a: "A standard calculator focuses solely on basic arithmetic and percentage operations. A scientific calculator supports advanced features like trigonometry, logarithms, factorials, scientific notation, and variables, which are needed for algebra, engineering, and laboratory science courses."
    },
    {
      q: "Can I use this calculator for business accounting?",
      a: "Yes, you can use the standard calculator for quick accounting tasks like totaling invoices, verifying expense reports, or summing up monthly expenses. For complex interest rate analysis or monthly borrowing amortizations, explore our financial <a href=\"/calculator/loan-emi-calculator\" class=\"text-primary hover:underline\">Loan EMI Calculator</a>."
    },
    {
      q: "Does clicking C clear my history?",
      a: "No, clicking the clear button (C) clears the current active display screen so you can start a new calculation, but it preserves your session history panel. You can manually delete individual history entries or clear the entire history log using the clear link at the top."
    }
  ],
  "TipCalculator.tsx": [
    {
      q: "What is a tip calculator?",
      a: "A tip calculator is an everyday billing tool that calculates gratuity amounts and splits restaurant bills evenly among group diners. It factors in local sales tax and tip percentages, helping you avoid confusing mental math and awkward calculations at the table."
    },
    {
      q: "Should I calculate tips before or after sales tax?",
      a: "Standard tipping etiquette dictates that you should calculate tips based on the pre-tax bill amount, as tax is a government levy and not a service component. However, tipping on the final post-tax total is common and appreciated by service staff. Set custom percentage parameters with our <a href=\"/calculator/percentage-calculator\" class=\"text-primary hover:underline\">Percentage Calculator</a>."
    },
    {
      q: "What is a standard tipping rate?",
      a: "In the United States, a standard tip for sit-down restaurant service is 15% to 20% of the pre-tax bill, with 18% being the most common average. For buffet service or bartenders, 10% to 15% is standard, while exceptional service often warrants 22% or more."
    },
    {
      q: "How do I split a bill unevenly among friends?",
      a: "To split a bill unevenly, calculate each diner's individual subtotal, add the local tax percentage, and apply the tip rate to their portion. While our calculator splits bills evenly, you can perform quick individual arithmetic checks using our standard <a href=\"/calculator/standard-calculator\" class=\"text-primary hover:underline\">Standard Calculator</a>."
    },
    {
      q: "What should I do if a service charge is already included?",
      a: "If a 'service charge' or 'automatic gratuity' is already printed on the bill (common for groups of 6 or more), you do not need to add an additional tip. Check the bill closely to ensure you do not tip twice, though you can add extra for stellar service."
    },
    {
      q: "Is it customary to tip on takeout orders?",
      a: "Tipping on takeout orders is not strictly mandatory, but it is customary to leave 10% to 15% to show appreciation for the kitchen staff who prepare and package your meal. During busy periods, leaving a tip helps support hospitality workers."
    },
    {
      q: "Should I tip delivery drivers?",
      a: "Yes, it is highly recommended to tip delivery drivers 10% to 15% of the order total, with a minimum of $3 to $5, to compensate for their travel time and fuel costs. Tipping drivers ensures prompt service and supports independent contractors."
    },
    {
      q: "How do I calculate tip percentages manually?",
      a: "To calculate a tip manually, find 10% of the bill by moving the decimal point one place to the left, then double that amount to find 20%, or add half of the 10% amount to estimate a 15% tip. Our calculator automates this math to prevent billing mistakes."
    }
  ],
  "WaterIntakeCalculator.tsx": [
    {
      q: "Do other drinks count?",
      a: "Yes, other non-alcoholic beverages like tea, coffee, and fruit juices count toward your daily hydration target. Many foods, especially water-rich fruits and vegetables, also contribute. However, pure water remains the healthiest choice because it contains no added sugars or calories, aiding in health, as shown in our <a href=\"/calculator/calorie-calculator\" class=\"text-primary hover:underline\">Calorie Calculator</a>."
    },
    {
      q: "Can I drink too much water?",
      a: "Yes, drinking excessive water in a short period can lead to hyponatremia, a dangerous condition where blood sodium levels drop too low. This is rare and typically occurs only during intense endurance sports. Drink moderately and listen to your body's natural thirst signals."
    },
    {
      q: "Should I drink more in hot weather?",
      a: "Yes, you must increase your water intake in hot or humid weather because your body loses more fluids through sweat to maintain a safe temperature. Adding 500 to 1,000 ml of water, or consuming electrolyte drinks, is recommended on warm days to prevent mild dehydration."
    },
    {
      q: "Does coffee or tea count toward my daily hydration target?",
      a: "Yes, caffeinated drinks like coffee and tea count toward your daily hydration target. While caffeine has a mild diuretic effect, the liquid in these beverages outweighs the fluid loss. Keep caffeine intake moderate to support optimal hydration and general physical wellness."
    },
    {
      q: "What are the early signs of mild dehydration?",
      a: "The earliest symptoms of mild dehydration include dry mouth, dark yellow urine, headache, fatigue, and muscle cramps. If you experience these, drink water immediately. Monitoring hydration is especially important during physical exercise, which you can track alongside BMR calculations using our <a href=\"/calculator/bmr-calculator\" class=\"text-primary hover:underline\">BMR Calculator</a>."
    },
    {
      q: "How much water does the average adult need daily?",
      a: "The general baseline recommendation is about 3.7 liters (125 oz) daily for men and 2.7 liters (91 oz) for women, which includes fluids from food. However, your exact personal target depends on weight, activity, and climate, which our hydration calculator estimates."
    },
    {
      q: "How does body weight affect water requirements?",
      a: "Body weight directly affects your water requirements because larger bodies possess a higher volume of blood and metabolic tissue to hydrate. A common rule of thumb is to drink half your body weight in ounces of water daily, adjusting upward for exercise and hot weather."
    },
    {
      q: "Why is hydration critical for physical performance?",
      a: "Hydration is critical because water regulates body temperature, lubricates joints, transports nutrients, and prevents muscle fatigue. Even a 2% drop in body water content can cause a significant decline in athletic performance, concentration, and energy levels. Track your health index online by using our <a href=\"/calculator/bmi-calculator\" class=\"text-primary hover:underline\">BMI Calculator</a>."
    }
  ]
};

// Validate that every FAQ has answers within 50 to 150 words
for (const [file, faqs] of Object.entries(faqsData)) {
  if (faqs.length < 5) {
    console.error(`Error: ${file} has only ${faqs.length} FAQs. Minimum is 5.`);
    process.exit(1);
  }
  faqs.forEach((faq, index) => {
    const wordCount = faq.a.split(/\s+/).filter(Boolean).length;
    if (wordCount < 50 || wordCount > 150) {
      console.error(`Error in ${file} FAQ #${index + 1}: word count is ${wordCount}. Must be between 50 and 150.`);
      process.exit(1);
    }
    if (!faq.q.trim().endsWith('?')) {
      console.error(`Error in ${file} FAQ #${index + 1}: question does not end with '?'. Q: "${faq.q}"`);
      process.exit(1);
    }
  });
}

console.log("Validation passed! All FAQs are valid. Updating files...");

// Apply updates to files
for (const [file, faqs] of Object.entries(faqsData)) {
  const filePath = path.join(calculatorsDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // Format new faqs array
  let faqsStr = "faqs={[\n";
  faqs.forEach((faq, idx) => {
    // Escape quotes in question and answer
    const qEsc = faq.q.replace(/"/g, '\\"');
    const aEsc = faq.a.replace(/"/g, '\\"');
    faqsStr += `        { q: "${qEsc}", a: "${aEsc}" }${idx < faqs.length - 1 ? ',' : ''}\n`;
  });
  faqsStr += "      ]}";

  // Replace existing faqs={[ ... ]}
  const regex = /faqs=\{\[\s*([\s\S]*?)\s*\]\}/;
  if (!regex.test(content)) {
    console.error(`Could not find faqs prop in ${file}`);
    continue;
  }
  content = content.replace(regex, faqsStr);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file} successfully.`);
}

console.log("All files updated successfully.");
