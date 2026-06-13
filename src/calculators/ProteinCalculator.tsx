import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog from "@/components/CalculatorBlog";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalculateButton } from "@/components/CalculateButton";
import { Button } from "@/components/ui/button";
import { PDF_SITE_NAME, PDF_SITE_URL } from "@/constants/pdfBrand";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  HeroMetric,
  StatCard,
  DashboardSection,
  InsightCard,
  RecommendationList,
} from "@/components/dashboard";
import { AlertCircle, Activity, Target, Utensils } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type GoalType = "maintenance" | "fat-loss" | "muscle-gain";
type ActivityType = "sedentary" | "light" | "moderate" | "active" | "very-active";

const MULTIPLIERS: Record<GoalType, Record<ActivityType, [number, number]>> = {
  maintenance: {
    sedentary: [0.8, 1.0],
    light: [1.0, 1.2],
    moderate: [1.2, 1.5],
    active: [1.5, 1.7],
    "very-active": [1.7, 2.0],
  },
  "fat-loss": {
    sedentary: [1.2, 1.4],
    light: [1.4, 1.6],
    moderate: [1.6, 1.8],
    active: [1.8, 2.0],
    "very-active": [2.0, 2.4],
  },
  "muscle-gain": {
    sedentary: [1.4, 1.6],
    light: [1.6, 1.8],
    moderate: [1.8, 2.0],
    active: [2.0, 2.2],
    "very-active": [2.2, 2.4],
  },
};

const ACTIVITY_LABELS: Record<ActivityType, string> = {
  sedentary: "Sedentary (Little or no exercise)",
  light: "Lightly Active (Exercise 1-3 days/week)",
  moderate: "Moderately Active (Exercise 3-5 days/week)",
  active: "Active (Exercise 6-7 days/week)",
  "very-active": "Very Active (Hard physical work/training)",
};

const GOAL_LABELS: Record<GoalType, string> = {
  maintenance: "Maintain Weight",
  "fat-loss": "Lose Fat",
  "muscle-gain": "Build Muscle",
};

export function ProteinCalculator() {
  const calc = getCalculator("protein-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [weightKg, setWeightKg] = useState<number | "">(70);
  const [weightLb, setWeightLb] = useState<number | "">(154);
  const [goal, setGoal] = useState<GoalType>("maintenance");
  const [activity, setActivity] = useState<ActivityType>("moderate");

  const [calcUnit, setCalcUnit] = useState<"metric" | "imperial">("metric");
  const [calcWeightKg, setCalcWeightKg] = useState<number>(70);
  const [calcWeightLb, setCalcWeightLb] = useState<number>(154);
  const [calcGoal, setCalcGoal] = useState<GoalType>("maintenance");
  const [calcActivity, setCalcActivity] = useState<ActivityType>("moderate");

  const { minProtein, maxProtein, avgProtein, minPerMeal, maxPerMeal, gPerKg } = useMemo(() => {
    const weightInKg = calcUnit === "metric" ? calcWeightKg : calcWeightLb / 2.20462;
    const [minMultiplier, maxMultiplier] = MULTIPLIERS[calcGoal][calcActivity];

    const minP = weightInKg * minMultiplier;
    const maxP = weightInKg * maxMultiplier;
    const avgP = (minP + maxP) / 2;

    return {
      minProtein: Math.round(minP),
      maxProtein: Math.round(maxP),
      avgProtein: Math.round(avgP),
      minPerMeal: Math.round(minP / 4),
      maxPerMeal: Math.round(maxP / 4),
      gPerKg: [minMultiplier, maxMultiplier],
    };
  }, [calcUnit, calcWeightKg, calcWeightLb, calcGoal, calcActivity]);

  const isButtonDisabled =
    unit === "metric" ? !weightKg || weightKg <= 0 : !weightLb || weightLb <= 0;

  const handleCalculate = () => {
    if (isButtonDisabled) return;
    setCalcUnit(unit);
    if (unit === "metric") {
      setCalcWeightKg(Number(weightKg));
    } else {
      setCalcWeightLb(Number(weightLb));
    }
    setCalcGoal(goal);
    setCalcActivity(activity);
    markCalculated();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isButtonDisabled) handleCalculate();
  };

  const handleReset = () => {
    setWeightKg(70);
    setWeightLb(154);
    setUnit("metric");
    setGoal("maintenance");
    setActivity("moderate");
    resetCalculated();
  };

  const mealDistributionData = [
    { meals: "3 Meals", protein: Math.round(avgProtein / 3) },
    { meals: "4 Meals", protein: Math.round(avgProtein / 4) },
    { meals: "5 Meals", protein: Math.round(avgProtein / 5) },
    { meals: "6 Meals", protein: Math.round(avgProtein / 6) },
  ];

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

  const pdfData = hasResult
    ? {
        calculatorName: "Protein Calculator",
        calculatorSlug: "protein-calculator",
        siteName: PDF_SITE_NAME,
        siteUrl: PDF_SITE_URL,
        inputs: [
          {
            label: "Weight",
            value: calcUnit === "metric" ? `${calcWeightKg} kg` : `${calcWeightLb} lb`,
          },
          { label: "Goal", value: GOAL_LABELS[calcGoal] },
          { label: "Activity Level", value: ACTIVITY_LABELS[calcActivity] },
        ],
        results: [
          {
            label: "Daily Protein Target",
            value: `${minProtein}g - ${maxProtein}g`,
            highlight: true,
          },
          { label: "Recommended Avg", value: `${avgProtein}g/day`, highlight: true },
          {
            label: "Per Meal (4 meals)",
            value: `${minPerMeal}g - ${maxPerMeal}g`,
            highlight: false,
          },
          { label: "Grams per kg", value: `${gPerKg[0]} - ${gPerKg[1]} g/kg`, highlight: false },
        ],
        summary: `Based on your weight of ${calcUnit === "metric" ? calcWeightKg + " kg" : calcWeightLb + " lb"}, your goal to ${GOAL_LABELS[calcGoal].toLowerCase()}, and an activity level of ${ACTIVITY_LABELS[calcActivity].toLowerCase()}, you need between ${minProtein} and ${maxProtein} grams of protein daily. An ideal target to aim for is ${avgProtein} grams per day.`,
      }
    : null;

  const blogData = {
    primaryKeyword: "Protein Intake",
    category: "Health & Fitness",
    introText:
      "Protein is an essential macronutrient that plays a critical role in almost every biological process in the human body. From building and repairing muscle tissue to producing enzymes and hormones, getting adequate protein is non-negotiable for optimal health. Unlike carbohydrates and fats, your body doesn't store excess protein for later use in the same way. This makes regular, daily consumption crucial. Whether your goal is to build muscle, lose body fat while maintaining lean mass, or simply support your overall well-being, understanding your protein needs is step one.",
    sections: [
      {
        title: "How We Calculate Your Needs",
        paragraphs: [
          "This Protein Calculator uses evidence-based multipliers based on two main factors: your **activity level** and your **fitness goals**.",
        ],
        callout: {
          type: "proTip" as const,
          title: "Maintenance & General Health",
          text: "If you're largely sedentary and just looking to maintain health, the Recommended Dietary Allowance (RDA) is set at 0.8 grams per kilogram of body weight. However, many modern nutritionists argue this is a bare minimum rather than an optimal target. We recommend slightly higher amounts (1.0 - 1.2g/kg) even for sedentary individuals to support healthy aging and satiety. Active individuals looking to maintain weight need progressively more (1.2 - 2.0g/kg).",
        },
      },
      {
        title: "Muscle Gain (Hypertrophy)",
        paragraphs: [
          "To build new muscle tissue, your body needs a positive nitrogen balance. This requires a surplus of protein combined with resistance training. The recommended range is generally 1.6 to 2.2 grams per kilogram of body weight.",
          "Going significantly above 2.2g/kg (or 1g/lb) rarely provides additional muscle-building benefits and simply results in the excess being oxidized for energy.",
        ],
      },
      {
        title: "Fat Loss Requirements",
        paragraphs: [
          "Counterintuitively, your protein needs often **increase** when you are in a caloric deficit. When you consume fewer calories than you burn, your body risks breaking down muscle tissue for energy.",
          "High protein intake (1.6 to 2.4 g/kg) helps preserve lean mass while losing fat, and it also increases satiety (keeping you full) and the thermic effect of food (burning more calories during digestion).",
        ],
      },
      {
        title: "Best Sources of Protein",
        paragraphs: [
          "Not all proteins are created equal. 'Complete' proteins contain all nine essential amino acids that your body cannot produce on its own.",
          "**Animal Sources:** Chicken breast, turkey, lean beef, fish, eggs, and dairy (Greek yogurt, cottage cheese, whey protein) are all complete and highly bioavailable.",
          "**Plant-Based Sources:** Tofu, tempeh, edamame, and quinoa are excellent complete plant proteins. Other sources like beans, lentils, and nuts are incomplete on their own but provide adequate amino acids when eaten as part of a varied diet throughout the day.",
        ],
        callout: {
          type: "commonMistake" as const,
          title: "Timing and Distribution",
          text: "While total daily protein intake is the most important factor, distribution matters. Your body can only utilize a certain amount of protein for muscle building in a single sitting (typically estimated around 20-40 grams). Therefore, eating 150g of protein in one massive meal is less optimal than eating 30-40g across 4-5 meals. This approach keeps muscle protein synthesis elevated throughout the day.",
        },
      },
    ],
  };

  const faqsData = [
    {
      q: "Is it safe to eat a high-protein diet?",
      a: "For healthy individuals with no pre-existing kidney issues, high-protein diets are generally safe. Your body efficiently processes and eliminates the excess. However, if you have chronic kidney disease, you must consult a doctor as a high-protein diet can exacerbate kidney problems.",
    },
    {
      q: "Can I build muscle on a plant-based diet?",
      a: "Absolutely. While many plant proteins are incomplete on their own, eating a diverse range of plant-based foods (like rice and beans, lentils, tofu, and seeds) throughout the day will provide all the essential amino acids needed for muscle growth.",
    },
    {
      q: "Do I need protein shakes to hit my goal?",
      a: "No, protein shakes are a supplement, not a requirement. They are simply a convenient, cost-effective way to get high-quality protein, especially post-workout or when you're busy. You can absolutely hit your targets through whole foods alone.",
    },
    {
      q: "Will eating too much protein make me fat?",
      a: "Weight gain is driven by a caloric surplus, regardless of the macronutrient. However, protein is very satiating and has a high thermic effect, making it harder to overeat compared to fats or carbohydrates. Excess protein is eventually oxidized for energy or stored, but it is less efficiently converted to fat than carbs or dietary fats.",
    },
    {
      q: "How much protein do I need right after a workout?",
      a: "The 'anabolic window' isn't as short as once believed. While getting 20-40g of protein within a few hours of training is ideal, your total daily intake matters far more. If you ate a protein-rich meal 2 hours before training, you don't need to rush a shake immediately after.",
    },
    {
      q: "Should I count incomplete proteins towards my daily goal?",
      a: "Yes, you should count all protein from your food (including from oats, bread, or vegetables) towards your total daily goal. As long as your diet is varied, the amino acids will pool and be utilized efficiently by your body.",
    },
    {
      q: "What is the difference between Whey and Casein protein?",
      a: "Both are derived from milk. Whey protein is fast-digesting, making it popular for post-workout recovery. Casein protein digests very slowly, releasing amino acids over several hours, making it a popular choice before bed to prevent muscle breakdown overnight.",
    },
    {
      q: "Does cooking meat destroy its protein?",
      a: "No. Cooking denatures the protein (changes its shape), which actually makes it easier for your body to digest and absorb. However, severely burning or charring meat can damage some amino acids and create harmful compounds, so moderate cooking methods are best.",
    },
  ];

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Calculate your ideal daily protein intake based on your weight, activity level, and fitness goals."
      formula={`Protein (g) = Weight (kg) × Multiplier\nMultiplier varies between 0.8 and 2.4 based on goal and activity level.`}
      example={`70 kg adult seeking muscle gain with moderate activity:\nProtein = 70 × 1.8 = 126g daily target.`}
      faqs={faqsData}
      blog={<CalculatorBlog content={blogData} />}
    >
      <div className="flex flex-col gap-6">
        <div className="calc-input-column">
          {/* Unit Toggle */}
          <div className="inline-flex bg-muted p-1 rounded-lg self-start">
            <button
              type="button"
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${unit === "metric" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setUnit("metric")}
            >
              Metric (kg)
            </button>
            <button
              type="button"
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${unit === "imperial" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setUnit("imperial")}
            >
              Imperial (lb)
            </button>
          </div>

          <div className="calc-field-grid-2 mt-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight ({unit === "metric" ? "kg" : "lb"})</Label>
              <Input
                id="weight"
                type="number"
                min="0"
                step="0.1"
                value={unit === "metric" ? weightKg : weightLb}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : "";
                  if (unit === "metric") setWeightKg(val);
                  else setWeightLb(val);
                }}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Fitness Goal</Label>
              <Select value={goal} onValueChange={(val) => setGoal(val as GoalType)}>
                <SelectTrigger id="goal">
                  <SelectValue placeholder="Select a goal" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(GOAL_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2 mt-4">
            <Label htmlFor="activity">Activity Level</Label>
            <Select value={activity} onValueChange={(val) => setActivity(val as ActivityType)}>
              <SelectTrigger id="activity">
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ACTIVITY_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-row gap-3 mt-4">
            <CalculateButton
              category="health"
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
            className="flex flex-col gap-6"
          >
              <Alert
                className="medical-alert"
              >
                <AlertCircle className="h-4 w-4 medical-alert-icon" />
                <AlertTitle className="medical-alert-title font-semibold">Medical Disclaimer</AlertTitle>
                <AlertDescription className="medical-alert-text">
                  This calculator provides estimates for educational purposes only. It is not
                  intended as medical advice. Please consult with a healthcare professional or
                  registered dietitian before significantly changing your diet or protein intake,
                  especially if you have kidney disease or other medical conditions.
                </AlertDescription>
              </Alert>

              <DashboardSection title="Protein Requirement">
                <HeroMetric
                  label="Daily Protein Target"
                  value={`${avgProtein}g`}
                  sub={`Range: ${minProtein}g to ${maxProtein}g`}
                  glow="blue"
                />
              </DashboardSection>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCard
                  index={0}
                  label="Per kg of Bodyweight"
                  value={`${gPerKg[0]} - ${gPerKg[1]}g`}
                  accent="green"
                />
                <StatCard
                  index={1}
                  label="Target Per Meal (4 Meals)"
                  value={`${minPerMeal} - ${maxPerMeal}g`}
                  accent="amber"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <DashboardSection title="Meal Distribution">
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={mealDistributionData}
                          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="var(--color-border)"
                          />
                          <XAxis
                            dataKey="meals"
                            axisLine={false}
                            tickLine={false}
                            stroke="var(--color-muted-foreground)"
                            fontSize={12}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            stroke="var(--color-muted-foreground)"
                            fontSize={12}
                            tickFormatter={(val) => `${val}g`}
                          />
                          <Tooltip
                            cursor={{ fill: "var(--color-muted)", opacity: 0.4 }}
                            contentStyle={{
                              backgroundColor: "var(--color-card)",
                              borderColor: "var(--color-border)",
                              borderRadius: "8px",
                            }}
                            formatter={(value: number) => [`${value}g`, "Protein per Meal"]}
                          />
                          <Bar
                            dataKey="protein"
                            fill="var(--color-chart-1)"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={50}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Protein grams per meal based on meal frequency
                    </p>
                  </DashboardSection>
                </div>

                <div className="lg:col-span-1">
                  <DashboardSection title="Target Per Meal Frequency">
                    <div className="flex flex-col gap-2.5 py-1">
                      {[3, 4, 5, 6].map((numMeals) => {
                        const amount = Math.round(avgProtein / numMeals);
                        const minAmount = Math.round(minProtein / numMeals);
                        const maxAmount = Math.round(maxProtein / numMeals);
                        return (
                          <div key={numMeals} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/50 hover:border-border transition-colors">
                            <div className="flex flex-col">
                              <span className="font-semibold text-sm text-foreground">{numMeals} Meals / day</span>
                              <span className="text-[10px] text-muted-foreground">Range: {minAmount}-{maxAmount}g</span>
                            </div>
                            <div className="text-right">
                              <span className="font-extrabold text-base text-accent">{amount}g</span>
                              <span className="text-[9px] text-muted-foreground block">per meal</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </DashboardSection>
                </div>
              </div>

              <DashboardSection title="Smart Insights">
                <div className="flex flex-col gap-2.5">
                  <InsightCard
                    index={0}
                    tone="info"
                    text="Spread It Out: Distribute your protein intake evenly across 3-5 meals to maximize muscle protein synthesis."
                  />
                  <InsightCard
                    index={1}
                    tone="success"
                    text="Focus on Quality: Prioritize complete protein sources like meat, poultry, fish, eggs, dairy, or soy."
                  />
                  <InsightCard
                    index={2}
                    tone="tip"
                    text="Post-Workout: Aim for 20-40g of high-quality protein within 2 hours after your workout."
                  />
                </div>
              </DashboardSection>

              <div className="flex flex-col">
                {pdfData && <CalculatorPdfExport pdfData={pdfData} />}
              </div>
          </motion.div>
        )}
      </div>
    </CalculatorPageLayout>
  );
}
