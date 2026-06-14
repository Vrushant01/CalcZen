import { useMemo, useState, useEffect } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog from "@/components/CalculatorBlog";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { blogContent } from "@/data/blogContent";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalculateButton } from "@/components/CalculateButton";
import { PDF_SITE_NAME, PDF_SITE_URL } from "@/constants/pdfBrand";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  Sun,
  Clock,
  Trash2,
  AlertCircle,
  Activity,
  Sparkles,
  RefreshCw,
  Bookmark,
  Check,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  HeroMetric,
  StatCard,
  DashboardSection,
  InsightCard,
  RecommendationList,
} from "@/components/dashboard";

// --- Time Helpers ---
const parseTimeToMinutes = (timeStr: string): number => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

const minutesToTimeStr = (minutes: number): string => {
  const normalized = (minutes + 1440) % 1440;
  const h = Math.floor(normalized / 60)
    .toString()
    .padStart(2, "0");
  const m = Math.floor(normalized % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}`;
};

const formatTime12h = (timeStr: string): string => {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const minStr = m.toString().padStart(2, "0");
  return `${hour12}:${minStr} ${ampm}`;
};

// Cycle phase breakdown (realistic percentages per cycle)
interface CyclePhase {
  light: number; // minutes
  deep: number; // minutes
  rem: number; // minutes
  description: string;
}

const CYCLE_PHASES: Record<number, CyclePhase> = {
  1: {
    light: 55,
    deep: 25,
    rem: 10,
    description: "Transition into sleep. Deep sleep is dominant, focusing on physical recovery.",
  },
  2: {
    light: 50,
    deep: 22,
    rem: 18,
    description:
      "More light sleep. Deep sleep continues to support cellular repair. First REM dream occurs.",
  },
  3: {
    light: 48,
    deep: 15,
    rem: 27,
    description: "Deep sleep decreases. REM sleep lengthens, helping with memory consolidation.",
  },
  4: {
    light: 45,
    deep: 10,
    rem: 35,
    description:
      "Light and REM sleep dominate. Brain activity increases, preparing for mental sharpness.",
  },
  5: {
    light: 43,
    deep: 5,
    rem: 42,
    description:
      "REM sleep is at its longest. Dreams are highly vivid. Critical for cognitive restoration.",
  },
  6: {
    light: 40,
    deep: 0,
    rem: 50,
    description: "Mostly light sleep and long REM periods. Body prepares to wake up naturally.",
  },
};

interface SleepOption {
  bedtime: string;
  wakeTime: string;
  cycles: number;
  durationMin: number;
  quality: "Poor" | "Good" | "Excellent" | "Optimal";
  recommended: boolean;
}

export function SleepCalculator() {
  const calc = getCalculator("sleep-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  const [activeTab, setActiveTab] = useState<"wakeup" | "sleepnow" | "custom">("wakeup");
  const [latency, setLatency] = useState<number>(15);

  // Inputs
  const [wakeTime, setWakeTime] = useState<string>("07:00");
  const [customBedtime, setCustomBedtime] = useState<string>("22:30");
  const [customWakeTime, setCustomWakeTime] = useState<string>("06:30");

  // Output options & selection
  const [options, setOptions] = useState<SleepOption[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SleepOption | null>(null);

  // Run calculation based on mode
  const handleCalculate = () => {
    const lat = Number(latency) || 0;
    let computedOptions: SleepOption[] = [];
    let selected: SleepOption | null = null;

    if (activeTab === "wakeup") {
      const wakeMin = parseTimeToMinutes(wakeTime);
      // We calculate backward for cycles 3, 4, 5, 6
      const cycleCounts = [6, 5, 4, 3];
      computedOptions = cycleCounts.map((c) => {
        const sleepDuration = c * 90;
        const totalDurationWithLatency = sleepDuration + lat;
        const bedMin = (wakeMin - totalDurationWithLatency + 1440) % 1440;
        const bedtimeStr = minutesToTimeStr(bedMin);
        const quality = c < 4 ? "Poor" : c < 5 ? "Good" : c <= 6 ? "Excellent" : "Optimal";

        return {
          bedtime: bedtimeStr,
          wakeTime,
          cycles: c,
          durationMin: sleepDuration,
          quality,
          recommended: c === 5 || c === 6,
        };
      });

      // Default select the 5-cycle plan
      selected = computedOptions.find((o) => o.cycles === 5) || computedOptions[0];
    } else if (activeTab === "sleepnow") {
      // Use current time
      const now = new Date();
      const currentMin = now.getHours() * 60 + now.getMinutes();
      const cycleCounts = [3, 4, 5, 6];
      computedOptions = cycleCounts.map((c) => {
        const sleepDuration = c * 90;
        const totalDurationWithLatency = sleepDuration + lat;
        const wakeMin = (currentMin + totalDurationWithLatency) % 1440;
        const wakeTimeStr = minutesToTimeStr(wakeMin);
        const quality = c < 4 ? "Poor" : c < 5 ? "Good" : c <= 6 ? "Excellent" : "Optimal";

        return {
          bedtime: minutesToTimeStr(currentMin),
          wakeTime: wakeTimeStr,
          cycles: c,
          durationMin: sleepDuration,
          quality,
          recommended: c === 5 || c === 6,
        };
      });

      // Default select the 5-cycle plan
      selected = computedOptions.find((o) => o.cycles === 5) || computedOptions[2];
    } else {
      // Custom Plan
      const bedMin = parseTimeToMinutes(customBedtime);
      const wakeMin = parseTimeToMinutes(customWakeTime);
      let diffMin = wakeMin - bedMin;
      if (diffMin < 0) {
        diffMin += 1440; // crosses midnight
      }

      const sleepMin = Math.max(0, diffMin - lat);
      const cyclesCount = Number((sleepMin / 90).toFixed(2));
      let quality: "Poor" | "Good" | "Excellent" | "Optimal" = "Poor";

      if (cyclesCount < 4) quality = "Poor";
      else if (cyclesCount < 5) quality = "Good";
      else if (cyclesCount <= 6) quality = "Excellent";
      else quality = "Optimal";

      selected = {
        bedtime: customBedtime,
        wakeTime: customWakeTime,
        cycles: cyclesCount,
        durationMin: sleepMin,
        quality,
        recommended: cyclesCount >= 4.5 && cyclesCount <= 6.2,
      };
      computedOptions = [selected];
    }

    setOptions(computedOptions);
    setSelectedPlan(selected);
    markCalculated();
  };

  const handleReset = () => {
    setLatency(15);
    setWakeTime("07:00");
    setCustomBedtime("22:30");
    setCustomWakeTime("06:30");
    setOptions([]);
    setSelectedPlan(null);
    resetCalculated();
  };

  // Format active plan outputs
  const durationLabel = useMemo(() => {
    if (!selectedPlan) return "—";
    const h = Math.floor(selectedPlan.durationMin / 60);
    const m = Math.floor(selectedPlan.durationMin % 60);
    return `${h}h ${m}m`;
  }, [selectedPlan]);

  const cyclesLabel = useMemo(() => {
    if (!selectedPlan) return "—";
    return `${selectedPlan.cycles} ${selectedPlan.cycles === 1 ? "Cycle" : "Cycles"}`;
  }, [selectedPlan]);

  const qualityColor = useMemo(() => {
    if (!selectedPlan) return "text-muted-foreground";
    switch (selectedPlan.quality) {
      case "Poor":
        return "text-red-500 dark:text-red-400";
      case "Good":
        return "text-amber-500 dark:text-amber-400";
      case "Excellent":
        return "text-emerald-500 dark:text-emerald-400";
      case "Optimal":
        return "text-purple-500 dark:text-purple-400";
    }
  }, [selectedPlan]);

  const qualityBadgeColor = useMemo(() => {
    if (!selectedPlan) return "default";
    switch (selectedPlan.quality) {
      case "Poor":
        return "red";
      case "Good":
        return "amber";
      case "Excellent":
        return "green";
      case "Optimal":
        return "purple";
    }
  }, [selectedPlan]);

  // Clinical health insights
  const healthInsight = useMemo(() => {
    if (!selectedPlan) return "";
    const c = selectedPlan.cycles;
    if (c < 4) {
      return `You are completing ${c} sleep cycles (${durationLabel} of sleep). Waking up with less than 4 cycles regularly causes acute sleep debt, which severely impacts short-term memory, focus, and immune response. Consider sleeping earlier.`;
    }
    if (c < 5) {
      return `You are completing ${c} sleep cycles. This is a functional amount of sleep, but falls slightly short of the recommended range. Waking up during this cycle may still leave you slightly tired. Try adding one more cycle.`;
    }
    if (c <= 6) {
      return `You are completing ${c} full sleep cycles, which perfectly aligns with the recommended 7.5 to 9 hours of sleep. This will maximize REM and deep sleep ratios, and you will wake up at the end of a light sleep stage.`;
    }
    return `You are completing ${c} sleep cycles. While a long sleep duration is restorative, sleeping more than 9 hours consistently can induce sleep inertia and lethargy, causing you to feel groggy during the day.`;
  }, [selectedPlan, durationLabel]);

  // PDF Export data structure
  const pdfData = useMemo(() => {
    if (!hasResult || !selectedPlan) return null;
    const modeLabel =
      activeTab === "wakeup"
        ? "Calculate from Wake-up Time"
        : activeTab === "sleepnow"
          ? "Calculate from Sleep Now"
          : "Custom Sleep Plan";

    return {
      calculatorName: "Sleep Calculator",
      calculatorSlug: "sleep-calculator",
      siteName: PDF_SITE_NAME,
      siteUrl: PDF_SITE_URL,
      inputs: [
        { label: "Calculation Mode", value: modeLabel },
        ...(activeTab === "wakeup"
          ? [
              { label: "Target Wake-up Time", value: formatTime12h(wakeTime) },
              { label: "Sleep Latency", value: `${latency} minutes` },
            ]
          : activeTab === "sleepnow"
            ? [
                { label: "Current Bedtime", value: formatTime12h(selectedPlan.bedtime) },
                { label: "Sleep Latency", value: `${latency} minutes` },
              ]
            : [
                { label: "Bedtime", value: formatTime12h(customBedtime) },
                { label: "Wake-up Time", value: formatTime12h(customWakeTime) },
                { label: "Sleep Latency", value: `${latency} minutes` },
              ]),
      ],
      results: [
        { label: "Sleep Duration", value: durationLabel, highlight: true },
        { label: "Sleep Cycles", value: `${selectedPlan.cycles} Complete Cycles`, highlight: true },
        { label: "Sleep Quality", value: selectedPlan.quality, highlight: false },
        { label: "Recommended Range", value: "7 - 9 Hours (5-6 cycles)", highlight: false },
      ],
      summary: `Based on your sleep plan (Sleep: ${formatTime12h(selectedPlan.bedtime)} to Wake: ${formatTime12h(selectedPlan.wakeTime)}), you will get ${durationLabel} of sleep, completing ${cyclesLabel}. This results in a sleep quality rating of "${selectedPlan.quality}". Completed sleep cycles prevent waking up during deep sleep stages, minimizing morning grogginess.`,
    };
  }, [
    hasResult,
    selectedPlan,
    activeTab,
    wakeTime,
    customBedtime,
    customWakeTime,
    latency,
    durationLabel,
    cyclesLabel,
  ]);

  // Recharts Hypnogram sleep stages data points generator
  const rechartsData = useMemo(() => {
    if (!selectedPlan) return [];
    const lat = Number(latency) || 0;
    const cycles = Math.ceil(selectedPlan.cycles) || 5;
    const bedMin = parseTimeToMinutes(selectedPlan.bedtime);

    const data = [];

    // Start Awake
    data.push({
      time: formatTime12h(selectedPlan.bedtime),
      stageValue: 4.0,
      stageLabel: "Awake",
    });

    // Falling asleep (latency end / first cycle start)
    const tStart = bedMin + lat;
    data.push({
      time: formatTime12h(minutesToTimeStr(tStart)),
      stageValue: 2.0,
      stageLabel: "Light Sleep",
    });

    for (let i = 0; i < cycles; i++) {
      const t0 = tStart + i * 90;

      // Cycle 1-2 have deeper sleep, later cycles have shallower deep sleep
      const deepVal = i >= 4 ? 1.8 : i >= 2 ? 1.4 : 1.0;

      data.push({
        time: formatTime12h(minutesToTimeStr(t0 + 25)),
        stageValue: deepVal,
        stageLabel: "Deep Sleep",
      });

      data.push({
        time: formatTime12h(minutesToTimeStr(t0 + 65)),
        stageValue: 3.0,
        stageLabel: "REM Sleep",
      });

      data.push({
        time: formatTime12h(minutesToTimeStr(t0 + 90)),
        stageValue: 2.0,
        stageLabel: "Light Sleep",
      });
    }

    return data;
  }, [selectedPlan, latency]);

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Optimize your sleep hygiene by mapping out your sleep schedules based on the scientifically accepted 90-minute sleep cycles. Plan bedtimes and wake times to rise feeling energized, avoiding mid-cycle disruptions."
      formula={`Optimal Sleep time = Sleep Latency (15 min) + (Cycle Count × 90 min)`}
      example={`To wake up refreshed at 6:00 AM, sleep at either 10:15 PM (5 cycles / 7.5h sleep) or 8:45 PM (6 cycles / 9h sleep) to align with cycle boundaries.`}
      faqs={[
        {
          q: "What is a sleep cycle?",
          a: "A sleep cycle is a recurring progression through stages of non-REM (NREM) and REM sleep, lasting about 90 minutes. Healthy adults complete 4 to 6 cycles per night, transitioning from light sleep to deep sleep, then rising to REM sleep before the cycle resets.",
        },
        {
          q: "How many hours should adults sleep?",
          a: "Most healthy adults require 7 to 9 hours of sleep per night to maintain cognitive function and physical health. This equates to 5 or 6 complete sleep cycles, ensuring a balanced distribution of deep physical recovery and mental REM stages.",
        },
        {
          q: "Why is REM sleep important?",
          a: "REM (Rapid Eye Movement) sleep is crucial for cognitive health, emotional regulation, and memory consolidation. During REM stages, the brain processes the day's experiences, forms neural connections, and clears toxins, supporting learning and mood stability.",
        },
        {
          q: "What happens if I miss sleep?",
          a: "Missing sleep accumulates a 'sleep debt,' leading to decreased focus, slowed reaction times, weakened immunity, and mood instability. Chronic sleep deprivation increases the risk of cardiovascular disease, obesity, and type 2 diabetes.",
        },
        {
          q: "Can I oversleep?",
          a: "Yes. Regularly sleeping more than 9 hours (more than 6 cycles) can cause a state of lethargy known as sleep inertia. It disrupts your biological circadian clock, which is linked to headaches, back pain, and depressive symptoms.",
        },
        {
          q: "What is the best bedtime?",
          a: "The best bedtime is calculated by counting backward from your target wake-up time in 90-minute increments, then subtracting an average of 15 minutes to account for the time it takes you to fall asleep (sleep latency).",
        },
        {
          q: "How accurate is this calculator?",
          a: "The calculator is highly accurate in projecting sleep cycle times based on the clinical average of 90 minutes. However, individual sleep cycles are dynamic and can range between 80 and 110 minutes, changing slightly throughout the night.",
        },
        {
          q: "Do naps affect sleep cycles?",
          a: "Yes. A power nap of 20 to 30 minutes keeps you in light sleep and restores alertness. Napping for 90 minutes allows you to complete one full cycle, but can interfere with your nighttime sleep schedule if taken too late in the afternoon.",
        },
        {
          q: "Is 6 hours enough sleep?",
          a: "For most people, 6 hours (4 cycles) is a baseline for survival but is insufficient for optimal performance. Over time, getting only 6 hours of rest results in cumulative cognitive deficits, similar to staying awake for 24 hours straight.",
        },
        {
          q: "How does sleep affect health?",
          a: "Proper sleep is essential for vital physiological functions, including cellular repair, hormone balance (cortisol, insulin, growth hormone), metabolic regulation, and waste clearance from the brain's glymphatic system.",
        },
      ]}
      blog={<CalculatorBlog content={blogContent.sleep} />}
    >
      <div className="flex flex-col gap-6">
        {/* Calculator Inputs */}
        <div className="calc-input-column">
          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              setActiveTab(v as "wakeup" | "sleepnow" | "custom");
              resetCalculated();
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="wakeup" className="text-xs sm:text-sm">
                Wake Up At
              </TabsTrigger>
              <TabsTrigger value="sleepnow" className="text-xs sm:text-sm">
                Sleep Now
              </TabsTrigger>
              <TabsTrigger value="custom" className="text-xs sm:text-sm">
                Custom Plan
              </TabsTrigger>
            </TabsList>

            {/* Mode 1: Wake Up At */}
            <TabsContent value="wakeup" className="space-y-4">
              <div>
                <Label htmlFor="wake-time" className="text-xs font-semibold text-muted-foreground">
                  I want to wake up at:
                </Label>
                <div className="relative mt-1 flex items-center">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="wake-time"
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="pl-10 min-h-11 cursor-pointer"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Mode 2: Sleep Now */}
            <TabsContent value="sleepnow" className="space-y-4">
              <div className="rounded-lg bg-muted/30 border border-border/40 p-4 text-center">
                <Moon className="h-8 w-8 text-primary mx-auto mb-2 animate-pulse" />
                <p className="text-sm font-medium text-foreground">Going to sleep right now?</p>
                <p className="text-xs text-muted-foreground mt-1">
                  The calculator will project sleep cycles starting immediately, factoring in your
                  sleep latency.
                </p>
              </div>
            </TabsContent>

            {/* Mode 3: Custom Sleep Planning */}
            <TabsContent value="custom" className="space-y-4">
              <div className="calc-field-grid-2">
                <div>
                  <Label
                    htmlFor="custom-bedtime"
                    className="text-xs font-semibold text-muted-foreground"
                  >
                    Bedtime:
                  </Label>
                  <div className="relative mt-1 flex items-center">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="custom-bedtime"
                      type="time"
                      value={customBedtime}
                      onChange={(e) => setCustomBedtime(e.target.value)}
                      className="pl-10 min-h-11 cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="custom-waketime"
                    className="text-xs font-semibold text-muted-foreground"
                  >
                    Wake-up Time:
                  </Label>
                  <div className="relative mt-1 flex items-center">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="custom-waketime"
                      type="time"
                      value={customWakeTime}
                      onChange={(e) => setCustomWakeTime(e.target.value)}
                      className="pl-10 min-h-11 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Latency Input (Shared) */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <Label
                htmlFor="latency-range"
                className="text-xs font-semibold text-muted-foreground"
              >
                Time to fall asleep (Sleep Latency):
              </Label>
              <span className="text-xs font-medium text-primary">{latency} minutes</span>
            </div>
            <input
              id="latency-range"
              type="range"
              min="0"
              max="60"
              step="5"
              value={latency}
              onChange={(e) => setLatency(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>0 min (Instant)</span>
              <span>15 min (Average)</span>
              <span>60 min</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-row gap-3 mt-5">
            <CalculateButton
              category="health"
              className="flex-1 min-h-11"
              onClick={handleCalculate}
            >
              Calculate Sleep Cycles
            </CalculateButton>
            <Button variant="outline" className="flex-1 min-h-11" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>

        {/* Premium Results Dashboard */}
        {hasResult && selectedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            {/* Health Disclaimer Banner */}
            <div className="medical-alert border rounded-lg p-4 flex gap-3 text-sm text-left">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 medical-alert-icon" />
              <div className="medical-alert-text">
                <strong className="medical-alert-title mr-1">Sleep Health Tip:</strong> Everyone's
                internal biological clock (circadian rhythm) is unique. While 90 minutes is the
                clinical standard average cycle, yours may range from 80 to 110 minutes. Use these
                recommendations as a baseline and adapt them to your personal rest levels.
              </div>
            </div>

            {/* Results Hero Metric */}
            <HeroMetric
              label="Optimal Sleep Duration"
              value={durationLabel}
              badge={{ text: selectedPlan.quality, color: qualityBadgeColor }}
              sub={`Selected Sleep Plan: ${formatTime12h(selectedPlan.bedtime)} to ${formatTime12h(selectedPlan.wakeTime)}`}
              glow="#8b5cf6"
            />

            {/* Sleep Target options (only for Mode 1 and 2) */}
            {options.length > 1 && (
              <DashboardSection title="Available Sleep Scenarios">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {options.map((opt) => {
                    const isSelected = selectedPlan.cycles === opt.cycles;
                    const hours = Math.floor(opt.durationMin / 60);
                    const mins = opt.durationMin % 60;

                    return (
                      <div
                        key={opt.cycles}
                        onClick={() => setSelectedPlan(opt)}
                        className={`relative rounded-xl border p-4 cursor-pointer text-left transition-all duration-300 ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-md scale-102 ring-1 ring-primary"
                            : "border-border/60 bg-card hover:border-primary/40 hover:bg-muted/10"
                        }`}
                      >
                        {opt.recommended && (
                          <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                        )}
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide">
                            {opt.cycles} Sleep Cycles
                          </p>
                          <p className="text-lg font-bold text-foreground">
                            {activeTab === "wakeup"
                              ? formatTime12h(opt.bedtime)
                              : formatTime12h(opt.wakeTime)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {hours}h {mins}m Sleep
                          </p>
                          <div className="flex items-center gap-1.5 mt-2">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                opt.quality === "Poor"
                                  ? "bg-red-500/10 text-red-500"
                                  : opt.quality === "Good"
                                    ? "bg-amber-500/10 text-amber-500"
                                    : opt.quality === "Excellent"
                                      ? "bg-emerald-500/10 text-emerald-500"
                                      : "bg-purple-500/10 text-purple-500"
                              }`}
                            >
                              {opt.quality}
                            </span>
                            {opt.recommended && (
                              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium select-none">
                                Recommended
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </DashboardSection>
            )}

            {/* Key Metrics Dashboard Section */}
            <DashboardSection title="Detailed Rest Breakdown">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard
                  index={0}
                  label="Bedtime"
                  value={formatTime12h(selectedPlan.bedtime)}
                  accent="purple"
                  subValue={`Fall asleep: ${formatTime12h(minutesToTimeStr(parseTimeToMinutes(selectedPlan.bedtime) + latency))}`}
                />
                <StatCard
                  index={1}
                  label="Wake-up Time"
                  value={formatTime12h(selectedPlan.wakeTime)}
                  accent="cyan"
                  subValue="Optimal cycle boundary"
                />
                <StatCard
                  index={2}
                  label="Total Sleep Cycles"
                  value={cyclesLabel}
                  accent={
                    selectedPlan.cycles >= 5 ? "green" : selectedPlan.cycles >= 4 ? "amber" : "red"
                  }
                  subValue="90 mins per cycle"
                />
                <StatCard
                  index={3}
                  label="Sleep Quality Rating"
                  value={selectedPlan.quality}
                  accent={
                    selectedPlan.quality === "Excellent" || selectedPlan.quality === "Optimal"
                      ? "green"
                      : selectedPlan.quality === "Good"
                        ? "amber"
                        : "red"
                  }
                />
                <StatCard
                  index={4}
                  label="Recommended Range"
                  value="7 - 9 Hours"
                  accent="default"
                  subValue="5 - 6 complete cycles"
                />
                <StatCard
                  index={5}
                  label="Falling Asleep Time"
                  value={`${latency} min`}
                  accent="default"
                  subValue="Included in timeline"
                />
              </div>
            </DashboardSection>

            {/* Interactive Sleep Cycle Timeline Visualization */}
            <DashboardSection title="Sleep Cycle Timeline Visualization">
              <div className="rounded-xl border border-border/60 bg-card p-5 shadow-soft text-left space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Sleep Wave Hypnogram</h4>
                    <p className="text-xs text-muted-foreground">
                      Progression through sleep stages over your sleep period
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-[10px] font-medium text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-sky-400"></span> Light Sleep
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-indigo-600"></span> Deep Sleep
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-purple-500"></span> REM Sleep
                    </div>
                  </div>
                </div>

                {/* Recharts AreaChart hypnogram */}
                <div className="w-full bg-muted/10 border border-border/40 rounded-xl p-4 shadow-inner">
                  <div className="h-64 sm:h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={rechartsData}
                        margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                        <XAxis
                          dataKey="time"
                          stroke="var(--color-muted-foreground)"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                          dy={8}
                        />
                        <YAxis
                          domain={[0.8, 4.2]}
                          ticks={[1, 2, 3, 4]}
                          tickFormatter={(v) => {
                            if (v === 4) return "Awake";
                            if (v === 3) return "REM";
                            if (v === 2) return "Light";
                            if (v === 1) return "Deep";
                            return "";
                          }}
                          stroke="var(--color-muted-foreground)"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                          dx={-8}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="rounded-lg border border-border bg-card p-2.5 shadow-soft text-xs text-left">
                                  <p className="font-semibold text-foreground">{data.time}</p>
                                  <p className="mt-1 text-purple-500 dark:text-purple-400 font-medium">
                                    {data.stageLabel}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="stageValue"
                          stroke="#8b5cf6"
                          strokeWidth={2.5}
                          fill="url(#sleepGrad)"
                          dot={{ r: 3, stroke: "#8b5cf6", strokeWidth: 1.5, fill: "var(--color-card)" }}
                          activeDot={{ r: 5, stroke: "#8b5cf6", strokeWidth: 2, fill: "var(--color-card)" }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Segmented Timeline Blocks */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Sleep Cycle Sequence
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {Array.from({ length: Math.ceil(selectedPlan.cycles) }).map((_, idx) => {
                      const cycleNum = idx + 1;
                      const phaseInfo = CYCLE_PHASES[cycleNum] || CYCLE_PHASES[6];
                      const startOffset = latency + idx * 90;
                      const bedMin = parseTimeToMinutes(selectedPlan.bedtime);
                      const cycleStart = minutesToTimeStr(bedMin + startOffset);
                      const cycleEnd = minutesToTimeStr(bedMin + startOffset + 90);

                      // Calculate percentages of visual segments
                      const totalPct = phaseInfo.light + phaseInfo.deep + phaseInfo.rem;
                      const lightW = (phaseInfo.light / totalPct) * 100;
                      const deepW = (phaseInfo.deep / totalPct) * 100;
                      const remW = (phaseInfo.rem / totalPct) * 100;

                      return (
                        <div
                          key={idx}
                          className="rounded-xl border border-border/50 bg-muted/20 p-3 flex flex-col gap-2 hover:border-primary/30 transition-all hover:bg-muted/30 text-left"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-foreground">
                              Cycle {cycleNum}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-semibold">
                              90 min
                            </span>
                          </div>
                          <p className="text-[10px] text-primary font-medium">
                            {formatTime12h(cycleStart)} - {formatTime12h(cycleEnd)}
                          </p>

                          {/* Colored bar */}
                          <div className="h-3 w-full rounded-full overflow-hidden flex bg-muted mt-1 select-none">
                            <div
                              style={{ width: `${lightW}%` }}
                              className="bg-sky-400 hover:opacity-85 transition-opacity"
                              title={`Light Sleep: ${phaseInfo.light} min`}
                            />
                            {phaseInfo.deep > 0 && (
                              <div
                                style={{ width: `${deepW}%` }}
                                className="bg-indigo-600 hover:opacity-85 transition-opacity"
                                title={`Deep Sleep: ${phaseInfo.deep} min`}
                              />
                            )}
                            <div
                              style={{ width: `${remW}%` }}
                              className="bg-purple-500 hover:opacity-85 transition-opacity"
                              title={`REM Sleep: ${phaseInfo.rem} min`}
                            />
                          </div>

                          <div className="text-[10px] text-muted-foreground leading-normal mt-1 border-t border-border/30 pt-1.5">
                            {phaseInfo.description}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </DashboardSection>

            {/* Smart Insights Dashboard Section */}
            <DashboardSection title="Smart Insights">
              <div className="flex flex-col gap-2 text-left">
                <InsightCard
                  index={0}
                  tone={selectedPlan.cycles >= 5 && selectedPlan.cycles <= 6.2 ? "success" : "info"}
                  text={healthInsight}
                />
                <InsightCard
                  index={1}
                  tone="info"
                  text={`Your estimated bedtime includes a ${latency}-minute falling asleep period. Getting into bed at exactly ${formatTime12h(selectedPlan.bedtime)} allows you to begin your first cycle around ${formatTime12h(minutesToTimeStr(parseTimeToMinutes(selectedPlan.bedtime) + latency))}.`}
                />
                <InsightCard
                  index={2}
                  tone="tip"
                  text="Maintain a consistent wake-up time, even on weekends. Circadian rhythms respond best to steady alarms, helping you fall asleep naturally at night without melatonin supplements."
                />
              </div>
            </DashboardSection>

            {/* Recommendations Dashboard Section */}
            <DashboardSection title="Sleep Hygiene Recommendations">
              <RecommendationList
                items={[
                  {
                    title: "Establish a Pre-Bedtime Routine",
                    description:
                      "Wind down 30-60 minutes before bedtime. Avoid blue light from smartphones, computers, or television screens, as it tricks the brain into suppressing melatonin production.",
                  },
                  {
                    title: "Keep the Bedroom Cool and Dark",
                    description:
                      "The ideal sleeping temperature is between 60°F and 67°F (15°C to 19°C). Use blackout curtains or an eye mask to ensure complete darkness, prompting melatonin release.",
                  },
                  {
                    title: "Limit Caffeine and Heavy Meals",
                    description:
                      "Avoid consuming caffeine within 6-8 hours of sleeping and stop eating heavy meals 3 hours before bed. Digestion and stimulants disrupt deep sleep and REM phases.",
                  },
                ]}
              />
            </DashboardSection>

            {/* PDF Export Action */}
            <div className="flex flex-col">
              {pdfData && <CalculatorPdfExport pdfData={pdfData} />}
            </div>
          </motion.div>
        )}
      </div>
    </CalculatorPageLayout>
  );
}
