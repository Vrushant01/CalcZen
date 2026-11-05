import { useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalculateButton } from "@/components/CalculateButton";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Star, ChevronDown, ChevronUp } from "lucide-react";
import {
  calculateLoveCompatibilityV2,
  type LoveCalculationResult,
} from "@/utils/loveCalculatorUtils";

function CircularProgress({ percentage }: { percentage: number }) {
  const radius = 80;
  const stroke = 10;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg] drop-shadow-xl">
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-pink-500/15"
        />
        <motion.circle
          stroke="url(#pink-gradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <defs>
          <linearGradient id="pink-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-5xl font-black bg-gradient-to-br from-pink-400 to-rose-500 bg-clip-text text-transparent drop-shadow-sm">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

export function LoveCalculator() {
  const calc = getCalculator("love-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  const [name1, setName1] = useState("");
  const [dob1, setDob1] = useState("");
  const [name2, setName2] = useState("");
  const [dob2, setDob2] = useState("");
  const [status, setStatus] = useState("Dating");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [result, setResult] = useState<LoveCalculationResult | null>(null);

  const [showNumDetails, setShowNumDetails] = useState(false);
  const [showAstDetails, setShowAstDetails] = useState(false);

  const validate = () => {
    let valid = true;
    const newErrors: { [key: string]: string } = {};

    if (!name1.trim()) {
      newErrors.name1 = "Please enter your name.";
      valid = false;
    }
    if (!dob1) {
      newErrors.dob1 = "Please select your date of birth.";
      valid = false;
    }

    if (!name2.trim()) {
      newErrors.name2 = "Please enter your partner's name.";
      valid = false;
    }
    if (!dob2) {
      newErrors.dob2 = "Please select their date of birth.";
      valid = false;
    }

    if (!status) {
      newErrors.status = "Please select a relationship status.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleCalculate = () => {
    if (!validate()) return;

    const r = calculateLoveCompatibilityV2(name1.trim(), dob1, name2.trim(), dob2, status);
    setResult(r);
    markCalculated();
    setShowNumDetails(false);
    setShowAstDetails(false);
  };

  const handleReset = () => {
    setName1("");
    setDob1("");
    setName2("");
    setDob2("");
    setStatus("Dating");
    setErrors({});
    setResult(null);
    resetCalculated();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCalculate();
  };

  const handleShare = () => {
    if (!result) return;
    const text = `${result.personA.name} & ${result.personB.name} got ${result.overallScore}% Love Compatibility on CalcZen. Check your compatibility at ${window.location.href}`;
    if (navigator.share) {
      navigator
        .share({ title: "CalcZen Love Calculator", text, url: window.location.href })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert("Result copied to clipboard!");
    }
  };

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Explore your relationship compatibility with a fun name, numerology, and astrology-based calculation."
      example="Enter your name and date of birth, your partner's name and date of birth, and discover your personalized compatibility profile!"
      faqs={[
        {
          q: "How is the love percentage calculated?",
          a: "We use a three-layer deterministic model: Name Compatibility (traditional TRUE LOVES letter-counting), Numerology (Pythagorean Name Numbers and Life Path Numbers), and Astrology (Western Sun Sign element matching).",
        },
        {
          q: "Does name order affect the result?",
          a: "No. The calculation is completely symmetric. The order you enter the names does not change the scores.",
        },
        {
          q: "Is the love percentage scientifically accurate?",
          a: "No, this is strictly a novelty tool intended for entertainment only. Numerology and astrology are traditional belief systems, not scientifically validated measures of relationship compatibility.",
        },
        {
          q: "Why do I need to enter dates of birth?",
          a: "Dates of birth are used to calculate your Life Path Numbers for numerology and your Sun Signs for astrology, giving a richer, multi-layered compatibility result.",
        },
        {
          q: "Does the calculator store my personal information?",
          a: "No. All calculations are performed instantly in your browser. We do not store, track, or transmit any names or dates entered into the calculator.",
        },
      ]}
    >
      <div className="flex flex-col gap-8">
        {/* INPUT STATE */}
        <div className={`calc-input-column space-y-8 ${hasResult ? "hidden" : "block"}`}>
          <div className="flex flex-col md:flex-row gap-6 md:gap-4 relative items-stretch">
            {/* Person 1 */}
            <div className="flex-1 space-y-4 p-5 rounded-2xl bg-card border border-border/60 shadow-sm relative z-10">
              <h3 className="text-sm font-semibold text-foreground border-b border-border/50 pb-2 mb-3">
                Your Details
              </h3>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Your Name</Label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={name1}
                  onChange={(e) => {
                    setName1(e.target.value);
                    setErrors((p) => ({ ...p, name1: "" }));
                  }}
                  onKeyDown={handleKeyDown}
                  className={`mt-1.5 focus-visible:ring-pink-500/20 focus-visible:border-pink-500/50 ${errors.name1 ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                />
                {errors.name1 && <p className="text-xs text-destructive mt-1.5">{errors.name1}</p>}
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">
                  Your Date of Birth
                </Label>
                <Input
                  type="date"
                  value={dob1}
                  onChange={(e) => {
                    setDob1(e.target.value);
                    setErrors((p) => ({ ...p, dob1: "" }));
                  }}
                  onKeyDown={handleKeyDown}
                  className={`mt-1.5 focus-visible:ring-pink-500/20 focus-visible:border-pink-500/50 ${errors.dob1 ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                />
                {errors.dob1 && <p className="text-xs text-destructive mt-1.5">{errors.dob1}</p>}
              </div>
            </div>

            {/* Heart Divider (Desktop: center absolute, Mobile: static center) */}
            <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-20 flex justify-center py-2 md:py-0">
              <div className="w-12 h-12 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center backdrop-blur-md shadow-sm">
                <Heart className="w-6 h-6 text-pink-500 fill-pink-500/20" />
              </div>
            </div>

            {/* Person 2 */}
            <div className="flex-1 space-y-4 p-5 rounded-2xl bg-card border border-border/60 shadow-sm relative z-10">
              <h3 className="text-sm font-semibold text-foreground border-b border-border/50 pb-2 mb-3">
                Partner's Details
              </h3>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Partner's Name</Label>
                <Input
                  type="text"
                  placeholder="Enter your partner's name"
                  value={name2}
                  onChange={(e) => {
                    setName2(e.target.value);
                    setErrors((p) => ({ ...p, name2: "" }));
                  }}
                  onKeyDown={handleKeyDown}
                  className={`mt-1.5 focus-visible:ring-pink-500/20 focus-visible:border-pink-500/50 ${errors.name2 ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                />
                {errors.name2 && <p className="text-xs text-destructive mt-1.5">{errors.name2}</p>}
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">
                  Partner's Date of Birth
                </Label>
                <Input
                  type="date"
                  value={dob2}
                  onChange={(e) => {
                    setDob2(e.target.value);
                    setErrors((p) => ({ ...p, dob2: "" }));
                  }}
                  onKeyDown={handleKeyDown}
                  className={`mt-1.5 focus-visible:ring-pink-500/20 focus-visible:border-pink-500/50 ${errors.dob2 ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                />
                {errors.dob2 && <p className="text-xs text-destructive mt-1.5">{errors.dob2}</p>}
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm">
            <Label className="text-xs font-medium text-muted-foreground">Relationship Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Just Friends">Just Friends</SelectItem>
                <SelectItem value="Crush">Crush</SelectItem>
                <SelectItem value="Dating">Dating</SelectItem>
                <SelectItem value="In a Relationship">In a Relationship</SelectItem>
                <SelectItem value="Engaged">Engaged</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Long Distance">Long Distance</SelectItem>
                <SelectItem value="It's Complicated">It's Complicated</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-xs text-destructive mt-1.5">{errors.status}</p>}
          </div>

          <div className="flex flex-row gap-3 pt-2">
            <CalculateButton
              category="love-and-relationships"
              className="flex-1 min-h-12"
              onClick={handleCalculate}
            >
              Calculate Love Compatibility
            </CalculateButton>
            <Button variant="outline" className="flex-1 min-h-12" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>

        {/* RESULT STATE */}
        {hasResult && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="rounded-3xl bg-[#0f172a] dark:bg-[#0b0f19] border border-pink-500/20 shadow-2xl relative overflow-hidden"
          >
            {/* Background glowing effects */}
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-pink-500/10 to-transparent pointer-events-none" />
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-pink-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-violet-500/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="p-6 sm:p-10 relative z-10 flex flex-col items-center">
              {/* Names & Heart */}
              <div className="flex items-center justify-center gap-4 w-full mb-10">
                <div className="flex-1 text-right text-lg sm:text-2xl font-bold text-white truncate uppercase tracking-wider">
                  {result.personA.name}
                </div>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.1, 1] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="w-12 h-12 shrink-0 rounded-full bg-pink-500/20 flex items-center justify-center border border-pink-500/30"
                >
                  <Heart className="w-6 h-6 text-pink-400 fill-pink-400/50" />
                </motion.div>
                <div className="flex-1 text-left text-lg sm:text-2xl font-bold text-white truncate uppercase tracking-wider">
                  {result.personB.name}
                </div>
              </div>

              {/* Main Score Ring */}
              <div className="mb-4">
                <CircularProgress percentage={result.overallScore} />
              </div>

              <div className="text-center mb-8">
                <div className="text-xs font-bold tracking-[0.2em] text-pink-300/70 uppercase mb-2">
                  Love Compatibility
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  {result.interpretation}
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 mt-4 rounded-full bg-white/5 border border-white/10 text-sm text-pink-200">
                  <span className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                  Status: {result.relationshipStatus}
                </div>
              </div>

              {/* Three Mini Cards */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                  <div className="text-3xl font-bold text-white mb-1">{result.nameScore}%</div>
                  <div className="text-xs font-semibold text-pink-300 uppercase tracking-wider">
                    Name Score
                  </div>
                  <div className="text-[11px] text-white/50 mt-1">Based on names entered</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                  <div className="text-3xl font-bold text-white mb-1">
                    {result.numerologyScore}%
                  </div>
                  <div className="text-xs font-semibold text-violet-300 uppercase tracking-wider">
                    Numerology
                  </div>
                  <div className="text-[11px] text-white/50 mt-1">Life Path & Name Numbers</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                  <div className="text-3xl font-bold text-white mb-1">{result.astrologyScore}%</div>
                  <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                    Astrology
                  </div>
                  <div className="text-[11px] text-white/50 mt-1">Sun Sign compatibility</div>
                </div>
              </div>

              {/* Detailed Expandable Sections */}
              <div className="w-full flex flex-col gap-4 mb-10">
                {/* Numerology Details */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                  <button
                    onClick={() => setShowNumDetails(!showNumDetails)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-white">Numerology Breakdown</span>
                    </div>
                    {showNumDetails ? (
                      <ChevronUp className="w-5 h-5 text-white/50" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white/50" />
                    )}
                  </button>
                  <AnimatePresence>
                    {showNumDetails && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-2 border-t border-white/10">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <div className="text-xs text-white/50 uppercase tracking-wider">
                                {result.personA.name}
                              </div>
                              <div className="text-sm text-white">
                                Name Number:{" "}
                                <span className="font-bold text-violet-300">
                                  {result.personA.nameNumber}
                                </span>
                              </div>
                              <div className="text-sm text-white">
                                Life Path:{" "}
                                <span className="font-bold text-violet-300">
                                  {result.personA.lifePathNumber}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-xs text-white/50 uppercase tracking-wider">
                                {result.personB.name}
                              </div>
                              <div className="text-sm text-white">
                                Name Number:{" "}
                                <span className="font-bold text-violet-300">
                                  {result.personB.nameNumber}
                                </span>
                              </div>
                              <div className="text-sm text-white">
                                Life Path:{" "}
                                <span className="font-bold text-violet-300">
                                  {result.personB.lifePathNumber}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-violet-200/80 leading-relaxed bg-violet-500/10 p-3 rounded-lg border border-violet-500/20">
                            {result.numerologyInsight}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Astrology Details */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                  <button
                    onClick={() => setShowAstDetails(!showAstDetails)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Star className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-white">Astrology Breakdown</span>
                    </div>
                    {showAstDetails ? (
                      <ChevronUp className="w-5 h-5 text-white/50" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white/50" />
                    )}
                  </button>
                  <AnimatePresence>
                    {showAstDetails && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-2 border-t border-white/10">
                          <div className="flex items-center justify-center gap-6 mb-4 py-3 bg-white/5 rounded-xl border border-white/10">
                            <div className="text-center">
                              <div className="text-xs text-white/50 uppercase tracking-wider mb-1">
                                {result.personA.name}
                              </div>
                              <div className="font-bold text-blue-300">
                                {result.personA.zodiacSign}
                              </div>
                            </div>
                            <Heart className="w-4 h-4 text-white/20" />
                            <div className="text-center">
                              <div className="text-xs text-white/50 uppercase tracking-wider mb-1">
                                {result.personB.name}
                              </div>
                              <div className="font-bold text-blue-300">
                                {result.personB.zodiacSign}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-blue-200/80 leading-relaxed bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                            {result.astrologyInsight}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="w-full text-center p-4 rounded-xl bg-white/5 border border-white/10 mb-10">
                <p className="text-[11px] sm:text-xs text-white/40 leading-relaxed">
                  <strong className="text-white/60">For entertainment and reflection only.</strong>{" "}
                  Numerology and astrology are traditional belief systems, not scientifically
                  validated measures of relationship compatibility. Your score should not be treated
                  as a prediction or guarantee about a relationship.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Button
                  onClick={handleReset}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white min-h-12 text-base shadow-lg shadow-pink-500/25 transition-all"
                >
                  Calculate Again
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex-1 border-white/20 text-white hover:bg-white/10 hover:border-white/30 min-h-12 text-base transition-all"
                >
                  Share Result
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-16 prose prose-slate dark:prose-invert max-w-none">
        <h2>How Our Love Calculator & Compatibility Test Works</h2>
        <p>
          Our love calculator by name uses a fun, multi-layered combination of traditional
          Pythagorean numerology, Western astrology elements, and classic name-matching logic.
          Simply enter your names and dates of birth to get an instant love percentage score. Every
          name and birth date carries unique energies — our compatibility calculator analyzes the
          numerological value of every letter, cross-references it with your astrological Sun Signs,
          and delivers your love compatibility score in seconds.
        </p>

        <h2>Why Use The CalcZen Love Calculator by Name?</h2>
        <p>
          Unlike basic one-dimensional tests, our true love calculator by name combines 3 distinct
          analytical systems: deep numerology analysis, real Western astrology sign compatibility,
          and traditional letter-matching algorithms. Discover your love percentage by name, explore
          the detailed breakdown of your relationship dynamics, and share the results with your
          partner or crush. Try the ultimate love calculator by name today!
        </p>

        <h2>Love Calculator vs. Compatibility Test — What's the Difference?</h2>
        <p>
          People use the two terms interchangeably, and honestly, that's fine — they're usually
          asking the same question. A love calculator typically gives you a fast, playful number:
          two names in, a percentage out. A compatibility test implies a bit more structure behind
          it — the kind of thing that looks at multiple factors (numerology values, elemental
          pairings, and astrology) rather than just a single score.
        </p>

        <p>
          Ours does both at once. When you run a compatibility test here, you're getting the same
          underlying three-layer engine that powers the love calculator — it's just framed as a
          deeper check with real insights rather than a one-off number. If you're testing a name for
          fun, call it a love calculator. If you want the fuller breakdown behind the score, that's
          the compatibility test. Same tool, same math, different reason for using it.
        </p>
      </div>
    </CalculatorPageLayout>
  );
}
