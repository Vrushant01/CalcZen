import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog, { type BlogContent } from "@/components/CalculatorBlog";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { CalculatorCurrencyBar } from "@/components/CurrencySelector";
import { MoneyField } from "@/components/MoneyField";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalculateButton } from "@/components/CalculateButton";
import { PDF_SITE_NAME, PDF_SITE_URL } from "@/constants/pdfBrand";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { useCurrency } from "@/hooks/use-currency";
import { formatPdfUsd } from "@/utils/formatPdfUsd";
import { motion } from "framer-motion";
import {
  HeroMetric,
  StatCard,
  DashboardSection,
  InsightCard,
  ComparisonTable,
  RecommendationList,
} from "@/components/dashboard";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const blogContent: BlogContent = {
  primaryKeyword: "GST Calculator",
  category: "finance",
  introText:
    "The Goods and Services Tax (GST) is a comprehensive, multi-stage, destination-based tax that is levied on every value addition. Understanding how to properly add or remove GST from your product or service prices is essential for businesses, consumers, and accounting professionals. Our GST Calculator allows you to seamlessly perform forward (adding GST) and reverse (removing GST) calculations, breaking down the central and state tax components instantly.",
  sections: [
    {
      title: "What is Goods and Services Tax (GST)?",
      paragraphs: [
        "The Goods and Services Tax (GST) is an indirect tax used in many countries worldwide to replace a complex web of previous indirect taxes (like excise duty, VAT, and service tax). Because it is a destination-based consumption tax, the revenue is collected by the authority where the final consumption takes place rather than where the goods are manufactured.",
        "A critical aspect of GST is the input tax credit (ITC) system. At each stage of the supply chain, businesses can claim a credit for the GST they paid on their purchases, meaning that the final tax burden falls entirely on the end consumer. This cascading effect of 'tax on tax' is eliminated, promoting a more transparent and efficient economic structure.",
        "Navigating the different tax slabs—typically ranging from 0% for essential goods up to 28% for luxury items—can be challenging without the right tools. Accurate pricing is necessary to ensure legal compliance and maintain healthy profit margins.",
      ],
      callout: {
        type: "quickFact",
        title: "The GST Rollout",
        text: "Did you know? In countries like India, GST was introduced as a historic 'One Nation, One Tax' reform in 2017 to unify the fragmented state-level and federal-level tax systems into a single cohesive market.",
      },
    },
    {
      title: "How to Calculate GST (Adding GST)",
      paragraphs: [
        "Adding GST to a base price is the most common calculation scenario. This happens when a manufacturer, wholesaler, or retailer needs to determine the final retail price (Maximum Retail Price or MRP) to charge a customer. The base price represents the cost of the goods or services before any tax is applied.",
        "The formula for adding GST is straightforward: you multiply the base price by the GST rate percentage to find the GST amount, and then add this amount to the original base price to get the final selling price.",
        "For example, if you are selling a mobile phone with a base price of $1,000 and the applicable GST rate is 18%, the GST amount is $180. Therefore, the final selling price including GST will be $1,180. This final amount is what the customer pays, and the $180 is collected and remitted to the tax authorities.",
      ],
      formulaBox: {
        title: "Adding GST Formula",
        formula:
          "GST Amount = Base Price × (GST Rate / 100)\nFinal Price = Base Price + GST Amount",
        variables: [
          { name: "Base Price", desc: "The original cost before any tax is applied." },
          { name: "GST Rate", desc: "The applicable tax percentage (e.g., 5%, 12%, 18%, 28%)." },
          { name: "Final Price", desc: "The total amount the consumer pays, inclusive of GST." },
        ],
      },
    },
    {
      title: "How to Perform a Reverse GST Calculation (Removing GST)",
      paragraphs: [
        "Reverse GST calculation, also known as 'removing GST', is crucial when you know the final inclusive price of an item and need to work backward to determine the original base price and the exact amount of tax that was charged.",
        "This is particularly useful for accounting purposes when entering expenses into financial software. If a receipt only shows a final total of $1,180 and you know the item falls under the 18% tax slab, you cannot simply subtract 18% from $1,180. Doing so would yield an incorrect base price.",
        "Instead, you must divide the final price by (1 + the GST rate as a decimal). This isolates the original base price, allowing you to accurately deduct the base price from the final price to find the exact tax component.",
      ],
      formulaBox: {
        title: "Removing GST Formula",
        formula:
          "Base Price = Final Price / [1 + (GST Rate / 100)]\nGST Amount = Final Price - Base Price",
        variables: [
          { name: "Final Price", desc: "The total cost including tax." },
          { name: "GST Rate", desc: "The applicable tax percentage." },
          { name: "Base Price", desc: "The original price of the item excluding the tax." },
        ],
      },
      exampleBox: {
        title: "Example: Removing 18% GST from a $1,180 Total",
        inputs: [
          { name: "Total Price", val: "$1,180" },
          { name: "GST Rate", val: "18%" },
        ],
        steps: [
          "1. Convert the rate to a decimal: 18 / 100 = 0.18",
          "2. Add 1 to the decimal rate: 1 + 0.18 = 1.18",
          "3. Divide the total price by this number: $1,180 / 1.18 = $1,000 (Base Price)",
          "4. Subtract Base Price from Total Price to find GST Amount: $1,180 - $1,000 = $180",
        ],
        result: "The base price is $1,000 and the GST paid is $180.",
      },
    },
    {
      title: "Understanding CGST, SGST, and IGST",
      paragraphs: [
        "In dual-GST structures, the tax is divided into three main components to ensure equitable revenue distribution between federal and state or provincial governments: Central GST (CGST), State GST (SGST), and Integrated GST (IGST).",
        "When a transaction occurs within a single state (an intra-state sale), the applicable GST rate is split equally into two halves. For an 18% GST slab, 9% is collected as CGST for the central government, and 9% is collected as SGST for the state government.",
        "Conversely, when a transaction occurs across state borders (an inter-state sale), the entire tax is collected as Integrated GST (IGST) by the central government, which later apportions the state's share. Regardless of whether it is CGST/SGST or IGST, the total tax percentage paid by the consumer remains exactly the same.",
      ],
      callout: {
        type: "proTip",
        title: "Invoicing Compliance",
        text: "Always clearly separate the CGST, SGST, or IGST amounts on your tax invoices. Many jurisdictions require these individual breakdowns by law to allow buyers to claim input tax credits successfully.",
      },
    },
    {
      title: "Common GST Tax Slabs Explained",
      paragraphs: [
        "Governments categorize goods and services into different tax slabs based on their necessity. Essential items often fall into the exempt (0%) or lower tax brackets, while luxury items are taxed at the highest rates.",
        "The standard slabs typically observed are:",
        "- **5% Slab:** Mass consumption items, basic food supplies, and essential services like standard transport.",
        "- **12% Slab:** Processed foods, computers, standard hospitality, and consumer goods.",
        "- **18% Slab:** The most common slab, covering a vast majority of services, electronics, financial services, and telecom.",
        "- **28% Slab:** Luxury goods, automobiles, tobacco, and high-end consumer electronics. In some cases, an additional cess is applied on top of the 28% rate for highly discouraged or luxury goods.",
        "Proper classification of your inventory using Harmonized System of Nomenclature (HSN) codes ensures you apply the correct tax slab to every transaction.",
      ],
    },
  ],
  faqs: [
    {
      q: "What is a GST Calculator?",
      a: "A GST Calculator is an online tool designed to quickly compute the Goods and Services Tax added to a base price, or seamlessly extract the tax component from an inclusive price. It simplifies accounting by automating complex formula-driven calculations.",
    },
    {
      q: "How is GST calculated on an item?",
      a: "To calculate GST, you multiply the base cost of an item by the applicable GST rate. For example, a $100 item with a 5% GST will incur a $5 tax, bringing the total cost to $105.",
    },
    {
      q: "What is the difference between 'Add GST' and 'Remove GST'?",
      a: "'Add GST' takes a net price (before tax) and calculates the tax to give you the final gross price. 'Remove GST' takes a gross price (already including tax) and mathematically separates it into the original net price and the exact tax amount.",
    },
    {
      q: "Can I just subtract 18% from the total to remove an 18% GST?",
      a: "No. Subtracting 18% from a tax-inclusive total will yield an incorrect number. You must use the formula: Base Price = Final Price / (1 + Rate). For instance, $118 / 1.18 = $100, whereas $118 - 18% = $96.76.",
    },
    {
      q: "What are the components of GST?",
      a: "In a dual-system, GST is typically split into CGST (Central GST) and SGST (State GST) for local sales. For sales across state borders, it is levied entirely as IGST (Integrated GST).",
    },
    {
      q: "Does the GST rate change depending on the state?",
      a: "No, the overall GST percentage for a specific product remains the same across the country. Only the distribution (CGST/SGST vs IGST) changes based on whether the sale is local or interstate.",
    },
    {
      q: "Is GST applicable to all goods and services?",
      a: "Most goods and services are subject to GST, but some essential items like fresh produce, unbranded grains, and specific healthcare or educational services may be completely exempt (0% tax rate) depending on your jurisdiction.",
    },
    {
      q: "Why should I use an automated GST calculator?",
      a: "An automated calculator eliminates human arithmetic errors, saves time during billing or accounting, instantly splits the tax into CGST/SGST, and ensures you remain compliant with strict invoicing regulations.",
    },
  ],
};

export function GSTCalculator() {
  const calc = getCalculator("gst-calculator")!;
  const { format } = useCurrency();
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  const [mode, setMode] = useState<"add" | "remove">("add");
  const [amount, setAmount] = useState<number | "">(1000);
  const [rate, setRate] = useState<number>(18);

  const [calcMode, setCalcMode] = useState<"add" | "remove">("add");
  const [calcAmount, setCalcAmount] = useState<number>(1000);
  const [calcRate, setCalcRate] = useState<number>(18);

  const result = useMemo(() => {
    const r = calcRate / 100;
    let baseAmount = 0;
    let gstAmount = 0;
    let finalAmount = 0;

    if (calcMode === "add") {
      baseAmount = calcAmount;
      gstAmount = baseAmount * r;
      finalAmount = baseAmount + gstAmount;
    } else {
      finalAmount = calcAmount;
      baseAmount = finalAmount / (1 + r);
      gstAmount = finalAmount - baseAmount;
    }

    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;
    const effectiveRate = calcRate;

    return { baseAmount, gstAmount, finalAmount, cgst, sgst, effectiveRate };
  }, [calcAmount, calcRate, calcMode]);

  const isButtonDisabled = !amount || Number(amount) <= 0;

  const handleCalculate = () => {
    if (isButtonDisabled) return;
    setCalcMode(mode);
    setCalcAmount(Number(amount));
    setCalcRate(rate);
    markCalculated();
  };

  const handleReset = () => {
    setMode("add");
    setAmount(1000);
    setRate(18);
    setCalcMode("add");
    setCalcAmount(1000);
    setCalcRate(18);
    resetCalculated();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isButtonDisabled) handleCalculate();
  };

  const pdfData = hasResult
    ? {
        calculatorName: "GST Calculator",
        calculatorSlug: "gst-calculator",
        siteName: PDF_SITE_NAME,
        siteUrl: PDF_SITE_URL,
        inputs: [
          {
            label: "Calculation Mode",
            value:
              calcMode === "add"
                ? "Add GST (Exclusive -> Inclusive)"
                : "Remove GST (Inclusive -> Exclusive)",
          },
          { label: "Input Amount", value: formatPdfUsd(calcAmount) },
          { label: "GST Rate", value: `${calcRate}%` },
        ],
        results: [
          {
            label: "Base Amount (Exc. GST)",
            value: formatPdfUsd(result.baseAmount),
            highlight: false,
          },
          { label: "CGST Amount", value: formatPdfUsd(result.cgst), highlight: false },
          { label: "SGST Amount", value: formatPdfUsd(result.sgst), highlight: false },
          { label: "Total GST Amount", value: formatPdfUsd(result.gstAmount), highlight: false },
          {
            label: "Final Amount (Inc. GST)",
            value: formatPdfUsd(result.finalAmount),
            highlight: true,
          },
        ],
        summary: `You chose to ${calcMode === "add" ? "add" : "remove"} ${calcRate}% GST. The original base price is ${formatPdfUsd(result.baseAmount)}, with a total tax component of ${formatPdfUsd(result.gstAmount)}. The total final amount is ${formatPdfUsd(result.finalAmount)}.`,
      }
    : null;

  const donutData = [
    { name: "Base Amount", value: result.baseAmount },
    { name: "CGST", value: result.cgst },
    { name: "SGST", value: result.sgst },
  ].filter((d) => d.value > 0);
  const chartColors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)"];

  const tooltipStyle = {
    contentStyle: {
      background: "var(--color-card)",
      borderColor: "var(--color-border)",
      borderRadius: "8px",
      fontSize: 12,
    },
    labelStyle: { color: "var(--color-foreground)" },
    itemStyle: { color: "var(--color-foreground)" },
  };

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Easily add or remove GST from a price. Select the tax slab and operation mode to instantly view the net price, total tax, and state/central tax breakdown."
      formula={`Adding GST:\nGST = Base × (Rate / 100)\nTotal = Base + GST\n\nRemoving GST:\nBase = Total / (1 + Rate/100)\nGST = Total - Base`}
      example={`Adding 18% GST to $1000:\nGST = 1000 × 0.18 = $180\nTotal = $1180\n\nRemoving 18% GST from $1180:\nBase = 1180 / 1.18 = $1000\nGST = 1180 - 1000 = $180`}
      faqs={blogContent.faqs!}
      blog={<CalculatorBlog content={blogContent} />}
    >
      <CalculatorCurrencyBar />
      <div className="flex flex-col gap-6">
        <div className="calc-input-column">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-muted-foreground">Calculation Mode</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={mode === "add" ? "default" : "outline"}
                onClick={() => setMode("add")}
                className="flex-1"
              >
                Add GST
              </Button>
              <Button
                type="button"
                variant={mode === "remove" ? "default" : "outline"}
                onClick={() => setMode("remove")}
                className="flex-1"
              >
                Remove GST
              </Button>
            </div>
          </div>

          <MoneyField
            label={mode === "add" ? "Base Amount (Before Tax)" : "Total Amount (After Tax)"}
            value={amount}
            onChange={(v) => setAmount(v)}
          />

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-muted-foreground">GST Rate</Label>
            <div className="flex flex-wrap gap-2">
              {[5, 12, 18, 28].map((r) => (
                <Button
                  key={r}
                  type="button"
                  variant={rate === r ? "default" : "outline"}
                  onClick={() => setRate(r)}
                  className="flex-1 min-w-[3rem]"
                >
                  {r}%
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-row gap-3 mt-4">
            <CalculateButton
              category="finance"
              className="flex-1 min-h-11"
              disabled={isButtonDisabled}
              onClick={handleCalculate}
            >
              Calculate
            </CalculateButton>
            <Button variant="outline" className="flex-1 min-h-11" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>

        {hasResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-2 flex flex-col gap-6"
          >
            <HeroMetric
              label={calcMode === "add" ? "Total Amount (Inc. GST)" : "Base Amount (Exc. GST)"}
              value={format(calcMode === "add" ? result.finalAmount : result.baseAmount)}
              sub={`CGST ${format(result.cgst)} + SGST ${format(result.sgst)} = Total Tax ${format(result.gstAmount)}`}
              glow="#0ea5e9"
            />

            <DashboardSection title="Tax Breakdown">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard
                  index={0}
                  label="Base Amount"
                  value={format(result.baseAmount)}
                  accent="blue"
                />
                <StatCard
                  index={1}
                  label="Total GST"
                  value={format(result.gstAmount)}
                  accent="amber"
                  badge={`${calcRate}%`}
                />
                <StatCard
                  index={2}
                  label="Final Amount"
                  value={format(result.finalAmount)}
                  accent="green"
                />
                <StatCard
                  index={3}
                  label="CGST (Central)"
                  value={format(result.cgst)}
                  accent="purple"
                  badge={`${calcRate / 2}%`}
                />
                <StatCard
                  index={4}
                  label="SGST (State)"
                  value={format(result.sgst)}
                  accent="purple"
                  badge={`${calcRate / 2}%`}
                />
              </div>
            </DashboardSection>

            <DashboardSection title="Component Distribution">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border/60 bg-card p-4 shadow-soft col-span-1 md:col-span-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Price vs Tax Breakdown
                  </div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donutData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={50}
                          outerRadius={74}
                          paddingAngle={3}
                        >
                          {donutData.map((_, i) => (
                            <Cell key={i} fill={chartColors[i % chartColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number) => format(v)} {...tooltipStyle} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </DashboardSection>

            {/* Insights */}
            <DashboardSection title="Smart Insights">
              <div className="flex flex-col gap-2">
                <InsightCard
                  index={0}
                  tone="info"
                  text={`The effective GST amount is ${format(result.gstAmount)}, which accounts for ${((result.gstAmount / result.finalAmount) * 100).toFixed(1)}% of the final inclusive price.`}
                />
                <InsightCard
                  index={1}
                  tone="tip"
                  text={
                    calcMode === "add"
                      ? "When invoicing customers, make sure to display the Base Amount, CGST, and SGST separately to remain compliant."
                      : "When logging expenses, input the Base Amount as your business expense and claim the GST Amount as an Input Tax Credit (ITC)."
                  }
                />
              </div>
            </DashboardSection>

            <div className="flex flex-col">
              <CalculatorPdfExport pdfData={pdfData} />
            </div>
          </motion.div>
        )}
      </div>
    </CalculatorPageLayout>
  );
}
