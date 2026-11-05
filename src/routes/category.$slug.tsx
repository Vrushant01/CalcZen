import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { CalculatorCard } from "@/components/CalculatorCard";
import { calculatorsByCategory, getCategory } from "@/data/calculators";
import { ChevronRight } from "lucide-react";
import { FaqAccordion } from "@/components/FaqAccordion";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const cat = getCategory(params.slug);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData }) => {
    const cat = loaderData?.cat;
    if (!cat) return {};
    const title = `${cat.name} Calculators | CalcZen`;
    const desc = `${cat.description}. Free online ${cat.name.toLowerCase()} calculators with formulas, examples and instant results.`;
    const url = `https://calczen.in/category/${cat.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { name: "twitter:description", content: desc },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <PageShell>
      <PageContainer className="py-16 sm:py-24 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Category not found</h1>
        <Link
          to="/calculators"
          className="mt-6 inline-flex min-h-[2.75rem] items-center text-accent"
        >
          Browse all calculators
        </Link>
      </PageContainer>
    </PageShell>
  ),
});

// Category landing page copy database
const CATEGORY_LANDING_DATA: Record<
  string,
  {
    intro: string;
    faqs: Array<{ q: string; a: string }>;
    relatedCategories: Array<{ slug: string; name: string }>;
  }
> = {
  finance: {
    intro:
      "Welcome to our comprehensive suite of personal finance, home loan, and investment calculators. These educational tools are designed to help you analyze loan payouts, estimate compound growth curves, calculate monthly EMI payouts, and plan for your long-term wealth goals. Every tool includes transparent mathematical formulas, step-by-step examples, and expert explanations to simplify your calculations.",
    faqs: [
      {
        q: "What is an EMI and how is it calculated?",
        a: "EMI stands for Equated Monthly Installment. It is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are calculated using the formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1], where P is the principal loan amount, R is the monthly interest rate, and N is the monthly loan tenure.",
      },
      {
        q: "What is the difference between simple and compound interest?",
        a: "Simple interest is calculated solely on the principal amount of a loan or deposit. Compound interest is calculated on the principal amount plus any accumulated interest from previous periods, allowing your savings or investment to grow exponentially over time.",
      },
      {
        q: "How does inflation affect my investments?",
        a: "Inflation reduces the purchasing power of your money over time. When evaluating investment returns, you should calculate the 'real rate of return' by subtracting the annual inflation rate from your nominal investment yield to understand its true growth.",
      },
    ],
    relatedCategories: [
      { slug: "math", name: "Math Calculators" },
      { slug: "everyday", name: "Everyday Calculators" },
    ],
  },
  health: {
    intro:
      "Take control of your wellness, nutrition, and fitness goals with our scientific health calculators. Based on clinical formulas (such as the Harris-Benedict BMR equation and body mass index formulas), these tools enable you to estimate daily calorie requirements, compute your BMI category, determine optimal hydration, and track pregnancy milestones with ease. Always consult a healthcare professional for personalized medical advice.",
    faqs: [
      {
        q: "What is a healthy Body Mass Index (BMI) range?",
        a: "For most adults, a healthy BMI ranges between 18.5 and 24.9. A BMI below 18.5 is categorized as underweight, 25 to 29.9 is considered overweight, and 30 or above is categorized as obese. Note that BMI is an estimate and does not distinguish between muscle mass and fat.",
      },
      {
        q: "What is Basal Metabolic Rate (BMR) and TDEE?",
        a: "BMR (Basal Metabolic Rate) is the number of calories your body needs to maintain basic life-sustaining functions at rest. TDEE (Total Daily Energy Expenditure) is an estimate of how many calories you burn per day once physical activity is added. Eating fewer calories than your TDEE will result in weight loss.",
      },
      {
        q: "How much water should I drink daily?",
        a: "While a general guideline is eight 8-ounce glasses (about 2 liters) per day, optimal hydration depends on your body weight, activity level, climate, and overall health. Our Water Intake Calculator provides a personalized estimation.",
      },
    ],
    relatedCategories: [
      { slug: "everyday", name: "Everyday Calculators" },
      { slug: "finance", name: "Finance Calculators" },
    ],
  },
  math: {
    intro:
      "Solve everyday math problems, calculate percentage ratios, and find exact age calculations instantly using our fast math calculators. Designed for students, professionals, and daily problem-solving, these educational math tools take the complexity out of calculations. From fractional percentage increases to exact interval analysis, CalcZen makes math simple and accessible.",
    faqs: [
      {
        q: "How do I calculate a percentage increase?",
        a: "To calculate a percentage increase, subtract the original value from the new value, divide the result by the original value, and then multiply by 100. Formula: Percentage Increase = [(New Value - Original Value) / Original Value] * 100.",
      },
      {
        q: "How do I calculate age exactly?",
        a: "Exact age is calculated by comparing your birth date against the current date, accounting for leap years, variable days in calendar months, and time zones. Our Age Calculator provides your age in years, months, days, hours, and even total minutes.",
      },
      {
        q: "Why are percentage calculators useful?",
        a: "Percentage calculations are used daily in budgeting, tax estimations, sales discounts, scientific metrics, interest rates, and data comparison. They convert raw comparisons into easy-to-understand fractional values.",
      },
    ],
    relatedCategories: [
      { slug: "finance", name: "Finance Calculators" },
      { slug: "everyday", name: "Everyday Calculators" },
    ],
  },
  everyday: {
    intro:
      "Make quick lifestyle calculations, split restaurant bills, and structure everyday decisions using our highly intuitive lifestyle calculators. Whether you are managing restaurant tipping etiquette, splitting standard group costs, or evaluating daily metrics, these tools are built to save time and prevent calculation stress.",
    faqs: [
      {
        q: "What is the standard tipping rate at restaurants?",
        a: "In the United States and many other regions, a standard tip ranges between 15% and 20% of the pre-tax bill, depending on the quality of service. For exceptional service, 22% or more is common.",
      },
      {
        q: "How can I easily split a bill among friends?",
        a: "Split a bill by dividing the total bill (including tax and tip) by the number of people. Our Tip Calculator handles variable split counts and tip percentages dynamically to make bill-splitting simple.",
      },
      {
        q: "Are lifestyle calculations secure?",
        a: "Yes, all lifestyle calculations on CalcZen are executed locally in your browser. None of your private transaction amounts, billing details, or parameters are sent to our servers, ensuring complete privacy.",
      },
    ],
    relatedCategories: [
      { slug: "health", name: "Health Calculators" },
      { slug: "math", name: "Math Calculators" },
    ],
  },
  "salary-and-employment": {
    intro:
      "Explore comprehensive salary and employment calculators designed for employees, HR specialists, and hiring managers. Calculate your monthly take-home salary from total annual CTC, break down statutory EPF, Gratuity, ESI, Professional Tax, and compare tax liability under the New and Old Tax Regimes for FY 2026-27.",
    faqs: [
      {
        q: "What is the difference between CTC, Gross Salary, and In-Hand Salary?",
        a: "Cost to Company (CTC) is the total annual expense an employer incurs to hire and retain an employee, including employer PF, gratuity provisions, and annual bonuses. Gross Salary is the cash compensation paid to the employee before employee deductions. In-Hand (Take-Home) Salary is the actual net amount credited to the employee's bank account after deducting Employee PF, Professional Tax, ESI, and monthly income tax (TDS).",
      },
      {
        q: "How does the New Tax Regime compare to the Old Tax Regime for FY 2026-27?",
        a: "The New Tax Regime provides a higher Standard Deduction of ₹75,000 and lower tax slab rates, with a full Section 87A rebate for taxable income up to ₹7,00,000 (meaning zero tax on gross salary up to ₹7,75,000). The Old Tax Regime allows deductions for HRA, Section 80C (up to ₹1.5L), 80D (health insurance), and home loan interest with a ₹50,000 standard deduction.",
      },
      {
        q: "Is Employer PF and Gratuity deducted from my monthly take-home pay?",
        a: "No. Employer PF and Gratuity are employer-side benefits included in your annual CTC package. They reduce the fixed gross cash salary available for monthly payout, but are not deducted a second time from your monthly paycheck.",
      },
      {
        q: "What is Professional Tax and does it vary by state?",
        a: "Professional Tax is a state-level tax levied on salaried employees, capped constitutionally at ₹2,500 per year. Some states (like Delhi and Haryana) levy no professional tax, while states like Maharashtra, Gujarat, Karnataka, and Telangana apply monthly slabs up to ₹200 or ₹208 per month.",
      },
    ],
    relatedCategories: [
      { slug: "finance", name: "Finance Calculators" },
      { slug: "everyday", name: "Everyday Calculators" },
    ],
  },
  jewellery: {
    intro:
      "Calculate exact gold jewellery bills in India with complete transparency. Understand how jewellers compute gold prices by purity (24K, 22K 916, 18K), making charges, wastage (value addition), gemstone costs, and standard 3% GST. Compare jeweller quotations, verify billing accuracy against official BIS and CBIC standards, and calculate maximum gold weight from your budget.",
    faqs: [
      {
        q: "How is a gold jewellery bill calculated in India?",
        a: "A standard gold jewellery bill consists of: (1) Gold Value = Net Gold Weight (in grams) × Gold Rate per gram for the specific purity; (2) Making Charges (percentage, per-gram, or flat); (3) Wastage / Value Addition (if applicable); (4) Gemstones or Diamond value; (5) BIS Hallmarking fee (₹45 + GST); minus any eligible discounts; plus (6) 3% GST on the total pre-tax transaction value.",
      },
      {
        q: "What is the difference between 22K and 24K gold?",
        a: "24K gold is 99.9% pure gold, but it is too soft for crafting durable jewellery. 22K gold (91.6% pure, hallmarked as 916) is alloyed with zinc, copper, or silver to provide structural strength. To derive the 22K gold rate from a 24K benchmark rate: 22K Rate = 24K Rate × (22 / 24).",
      },
      {
        q: "What is the official GST rate on gold jewellery in India?",
        a: "Under official Central Board of Indirect Taxes and Customs (CBIC) rules, retail sale of gold jewellery to an end customer attracts a flat 3% GST on the total transaction value (CGST 1.5% + SGST 1.5% for intra-state sales, or IGST 3% for inter-state sales), whether making charges are shown separately or bundled into the bill.",
      },
      {
        q: "What are wastage charges and why do jewellers charge them?",
        a: "Wastage (or Value Addition) refers to gold lost during melting, cutting, and polishing. In traditional handmade jewellery, 3% to 8% wastage was common. However, modern automated machinery has minimized gold loss. Many branded jewellers now include wastage within their making charges. Always verify that your jeweller does not charge both high making charges and high wastage.",
      },
      {
        q: "What is BIS Hallmarking and HUID?",
        a: "BIS Hallmarking certifies the purity of gold jewellery in India. As mandated by the Government of India, all hallmarked jewellery carries three marks: (1) BIS Logo, (2) Purity Grade (e.g. 22K916, 18K750, 14K585), and (3) a unique 6-digit alphanumeric Hallmark Unique Identification (HUID) code stamped on each individual piece.",
      },
    ],
    relatedCategories: [
      { slug: "finance", name: "Finance Calculators" },
      { slug: "salary-and-employment", name: "Salary & Employment" },
      { slug: "everyday", name: "Everyday Calculators" },
    ],
  },
  "home-construction": {
    intro:
      "Estimate construction materials, quantities, and costs for residential and commercial building work in India. Calculate concrete volume, cement bags, fine sand, coarse aggregate, TMT steel rebar, centering shuttering, and contractor labour charges following Indian Standards (IS 456:2000, IS 10262:2019, IS 1786) and CPWD specifications.",
    faqs: [
      {
        q: "How is RCC construction cost calculated in India?",
        a: "RCC construction cost is the sum of: (1) Concrete materials (cement bags, sand, aggregate, water, admixtures) or Ready-Mix Concrete (RMC); (2) TMT steel rebar and binding wire; (3) Centering and shuttering formwork hire and carpenter labour; (4) Concreting labour (masons, mixers, vibrator operators); (5) Machinery hire (mixers, vibrators, pumps); plus any applicable contractor overheads, profit, and GST.",
      },
      {
        q: "What is the standard concrete mix ratio for residential roof slabs?",
        a: "Under IS 456:2000, the minimum recommended grade of concrete for reinforced concrete (RCC) is M20, which has a nominal volumetric mix ratio of 1 part cement : 1.5 parts sand : 3 parts coarse aggregate (1:1.5:3). For heavily loaded columns or multi-storey structures, M25 (1:1:2) or an approved laboratory design mix is used.",
      },
      {
        q: "What is the dry volume factor in concrete calculations?",
        a: "When dry cement, sand, and aggregate are mixed with water and compacted, air voids collapse and fine sand particles occupy spaces between coarse aggregates. A dry volume factor of 1.54 is standardly applied by CPWD and civil engineers, meaning 1 cubic metre of wet compacted concrete requires 1.54 cubic metres of dry ingredients.",
      },
      {
        q: "How much steel is needed for RCC slab and columns?",
        a: "As standard rule of thumb per SP 34 and CPWD: roof slabs require 70 to 90 kg of steel per m³ (approx. 1.8 to 2.5 kg/sq ft of 5-inch slab); beams require 100 to 140 kg/m³; columns require 130 to 180 kg/m³; and footings require 60 to 90 kg/m³.",
      },
    ],
    relatedCategories: [
      { slug: "finance", name: "Finance Calculators" },
      { slug: "math", name: "Math Calculators" },
      { slug: "everyday", name: "Everyday Calculators" },
    ],
  },
  electricity: {
    intro:
      "Calculate electricity consumption, appliance running costs, and household energy usage in India. From air conditioners and refrigerators to complete monthly household bill impact, our electricity calculators help you understand your power consumption in kilowatt-hours (units), compare energy efficiency (BEE star ratings), and plan energy-saving measures following official Indian electricity regulatory tariff schedules.",
    faqs: [
      {
        q: "What is 1 unit of electricity in India?",
        a: "In India and worldwide, 1 unit of electricity equals 1 kilowatt-hour (1 kWh). This represents an electrical power draw of 1,000 watts running continuously for 1 hour (or a 100-watt bulb running for 10 hours). Your electricity meter measures the total kWh consumed.",
      },
      {
        q: "How many electricity units does a 1.5-ton AC consume per hour?",
        a: "A 1.5-ton AC does not consume 1.5 kW constantly. A modern 5-star or 3-star inverter AC typically has a rated input power of 1,100 W to 1,500 W. Once the room reaches the set temperature, an inverter compressor reduces its speed, drawing approximately 700 W to 1,000 W on average (0.7 to 1.0 units per hour). Non-inverter ACs draw closer to 1.4 to 1.6 units per operating hour.",
      },
      {
        q: "Why do electricity bills increase rapidly with AC usage?",
        a: "Most Indian states (such as Gujarat, Maharashtra, Delhi, Karnataka, and Tamil Nadu) use progressive, telescopic slab-based tariffs. Basic household appliances (lights, fans, refrigerator) already consume 100 to 150 units, filling the lower, cheaper slabs. When an AC is used, all AC consumption falls into higher marginal tariff slabs (often ₹6 to ₹12+ per unit), significantly increasing the incremental bill.",
      },
      {
        q: "How much electricity can be saved by increasing the AC temperature to 24°C?",
        a: "According to the Bureau of Energy Efficiency (BEE), every 1°C increase in your AC set temperature saves approximately 6% of electricity consumption. Running your air conditioner at 24°C instead of 18°C or 20°C can reduce your monthly AC cooling bill by 24% to 36% without compromising thermal comfort.",
      },
    ],
    relatedCategories: [
      { slug: "finance", name: "Finance Calculators" },
      { slug: "everyday", name: "Everyday Calculators" },
      { slug: "home-construction", name: "Home Construction" },
    ],
  },
  business: {
    intro:
      "Simple, transparent business calculators to help entrepreneurs, shopkeepers, resellers, manufacturers, and online marketplace sellers calculate profits, net margins, markups, and break-even selling prices. Whether you are selling on Amazon, Flipkart, Meesho, your own Shopify store, or running a local retail counter, our tools help you account for shipping, packaging, commissions, discounts, and GST so you always price for healthy profitability.",
    faqs: [
      {
        q: "What is the difference between profit margin and markup?",
        a: "Profit margin represents your net profit divided by your selling price (revenue), showing the percentage of every rupee earned that you keep. Markup is your profit divided by your buying or manufacturing cost, showing how much you marked up your cost price. For example, buying at ₹500 and selling at ₹800 yields a ₹300 profit, which is a 37.5% margin and a 60% markup.",
      },
      {
        q: "How do I calculate break-even selling price for a product?",
        a: "Break-even price is the exact price at which total revenue equals total product costs and expenses (zero profit and zero loss). Calculate it as: Break-Even Price = Total Fixed Costs Per Unit / (1 − Total Percentage Fees Rate). For instance, if fixed product cost is ₹450 and marketplace commission is 10%, break-even price is ₹450 / 0.90 = ₹500.",
      },
      {
        q: "Why should I deduct GST before calculating my profit?",
        a: "In India, consumer retail prices are normally quoted inclusive of GST. However, GST collected from the buyer is a tax liability that must be paid to the government via GSTR-3B filings. It does not belong to your business and cannot be counted as profit.",
      },
      {
        q: "How do marketplace fees affect online selling profits?",
        a: "Marketplaces like Amazon and Flipkart deduct category referral commissions (5% to 18%), fixed closing fees (₹5 to ₹35), and shipping/handling charges on every order, plus 18% GST on these service fees. Factoring in these deductions before setting your listing price prevents unexpected losses.",
      },
    ],
    relatedCategories: [
      { slug: "finance", name: "Finance Calculators" },
      { slug: "salary-and-employment", name: "Salary & Employment" },
      { slug: "math", name: "Math & Percentage Calculators" },
    ],
  },
};

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  const list = calculatorsByCategory(cat.slug);
  const data = CATEGORY_LANDING_DATA[cat.slug] || {
    intro: cat.description,
    faqs: [],
    relatedCategories: [],
  };

  return (
    <PageShell>
      <PageContainer>
        <nav
          aria-label="Breadcrumb"
          className="scroll-touch-x flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4"
        >
          <Link to="/" className="shrink-0 hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="text-foreground font-medium truncate">{cat.name}</span>
        </nav>

        <header className="mb-6 sm:mb-8 min-w-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance">
            {cat.slug === "finance"
              ? "Personal Finance, Investment, and Loan Calculators"
              : cat.slug === "health"
                ? "Scientific Health, Fitness, and Wellness Calculators"
                : cat.slug === "math"
                  ? "Free Math, Percentage, and Everyday Arithmetic Calculators"
                  : cat.slug === "salary-and-employment"
                    ? "Salary, CTC, In-Hand Pay & Employment Calculators"
                    : cat.slug === "jewellery"
                      ? "Gold Jewellery Price, Bill Breakdown & GST Calculators"
                      : cat.slug === "home-construction"
                        ? "Home Construction, Material Takeoff & RCC Price Calculators"
                        : cat.slug === "electricity"
                          ? "Electricity Bill, AC Cost & Power Consumption Calculators"
                          : cat.slug === "business"
                            ? "Business, Profit Margin, Markup & Pricing Calculators"
                            : "Useful Lifestyle, Bill Splitting, and Date Calculators"}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-4xl leading-relaxed">
            {data.intro}
          </p>
        </header>

        {/* Dynamic Calculator Grid */}
        <section className="min-w-0" aria-label={`${cat.name} Tools`}>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
            Available {cat.name} Calculators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 min-w-0">
            {list.map((c, i) => (
              <CalculatorCard key={c.slug} calc={c} index={i} />
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        {data.faqs.length > 0 && (
          <section className="surface-card rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 min-w-0 mt-8 sm:mt-12">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              {cat.name} Frequently Asked Questions
            </h2>
            <FaqAccordion faqs={data.faqs} />
          </section>
        )}

        {/* Cross-Category Internal Linking */}
        {data.relatedCategories.length > 0 && (
          <section className="min-w-0 mt-8 sm:mt-12 pt-6 border-t border-border/40">
            <h2 className="font-semibold text-sm sm:text-base text-foreground mb-3">
              Explore More Categories
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {data.relatedCategories.map((rc) => (
                <Link
                  key={rc.slug}
                  to="/category/$slug"
                  params={{ slug: rc.slug }}
                  className="rounded-lg px-4 py-2 text-xs font-semibold border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                >
                  {rc.name} →
                </Link>
              ))}
            </div>
          </section>
        )}
      </PageContainer>

      {/* JSON-LD Schemas (FAQPage & BreadcrumbList) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "@id": `https://calczen.in/category/${cat.slug}#webpage`,
                name: `${cat.name} Calculators | CalcZen`,
                description: `Browse free online ${cat.name} calculators. Fast, accurate, and easy to use with step-by-step solutions.`,
                url: `https://calczen.in/category/${cat.slug}`,
              },
              {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "@id": `https://calczen.in/category/${cat.slug}#collection`,
                name: `${cat.name} Calculators`,
                description: `Browse our complete list of free online ${cat.name} calculators.`,
                url: `https://calczen.in/category/${cat.slug}`,
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "@id": `https://calczen.in/category/${cat.slug}#faq`,
                mainEntity: data.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: f.a,
                  },
                })),
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "@id": `https://calczen.in/category/${cat.slug}#breadcrumb`,
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://calczen.in",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: cat.name,
                    item: `https://calczen.in/category/${cat.slug}`,
                  },
                ],
              },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
