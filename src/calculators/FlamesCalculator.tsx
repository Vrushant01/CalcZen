import { useState, useEffect } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalculateButton } from "@/components/CalculateButton";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, X } from "lucide-react";
import { calculateFlames, type FlamesCalculationResult } from "@/utils/flamesCalculatorUtils";

export function FlamesCalculator() {
  const calc = getCalculator("flames-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<FlamesCalculationResult | null>(null);

  // Animation state
  const [animating, setAnimating] = useState(false);
  const [currentFlames, setCurrentFlames] = useState<string[]>(["F", "L", "A", "M", "E", "S"]);
  const [animStepIndex, setAnimStepIndex] = useState(0);

  const validate = () => {
    let valid = true;
    const newErrors: { [key: string]: string } = {};

    if (!name1.trim() || !/[a-zA-Z]/.test(name1)) {
      newErrors.name1 = "Please enter your name.";
      valid = false;
    }
    if (!name2.trim() || !/[a-zA-Z]/.test(name2)) {
      newErrors.name2 = "Please enter your partner's name.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleCalculate = () => {
    if (!validate()) return;

    const r = calculateFlames(name1.trim(), name2.trim());
    setResult(r);
    markCalculated();

    // Start animation
    setAnimating(true);
    setCurrentFlames(["F", "L", "A", "M", "E", "S"]);
    setAnimStepIndex(0);
  };

  const handleReset = () => {
    setName1("");
    setName2("");
    setErrors({});
    setResult(null);
    setAnimating(false);
    resetCalculated();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCalculate();
  };

  const handleShare = () => {
    if (!result) return;
    const text = `🔥 My FLAMES result on CalcZen\n\n${name1.trim()} ❤️ ${name2.trim()}\n\nResult: ${result.resultName}\n\nTry the FLAMES Calculator:\n${window.location.href}`;
    if (navigator.share) {
      navigator
        .share({ title: "CalcZen FLAMES Calculator", text, url: window.location.href })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert("Result copied to clipboard!");
    }
  };

  // Process the animation steps
  useEffect(() => {
    if (animating && result && animStepIndex < result.eliminationSteps.length) {
      const timer = setTimeout(() => {
        const step = result.eliminationSteps[animStepIndex];
        setCurrentFlames(step.after);
        setAnimStepIndex((prev) => prev + 1);
      }, 600); // 600ms per elimination step
      return () => clearTimeout(timer);
    } else if (animating && result && animStepIndex >= result.eliminationSteps.length) {
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [animating, result, animStepIndex]);

  const flamesLegend = [
    { l: "F", name: "Friends", color: "text-emerald-400" },
    { l: "L", name: "Love", color: "text-pink-500" },
    { l: "A", name: "Affection", color: "text-rose-400" },
    { l: "M", name: "Marriage", color: "text-amber-400" },
    { l: "E", name: "Enemies", color: "text-red-500" },
    { l: "S", name: "Siblings", color: "text-blue-400" },
  ];

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Play the classic FLAMES game digitally! Enter your names to discover your playful relationship result."
      example="Enter your name and your partner's name, then we will cross out the matching letters and calculate your FLAMES destiny!"
      faqs={[
        {
          q: "What does FLAMES stand for?",
          a: "Friends, Love, Affection, Marriage, Enemies, and Siblings.",
        },
        {
          q: "How does the FLAMES calculator work?",
          a: "Matching letters are cancelled one-for-one, the remaining letters are counted, and that count is used to eliminate letters from FLAMES until one remains.",
        },
        {
          q: "Does capitalization matter?",
          a: "No. The calculation treats uppercase and lowercase letters the same.",
        },
        {
          q: "Do spaces matter?",
          a: "No. Spaces and punctuation are completely ignored in the calculation.",
        },
        {
          q: "Can I use a nickname?",
          a: "Yes. You can use first names, full names, or nicknames.",
        },
        {
          q: "Does changing spelling change the result?",
          a: "Yes. Because the game relies on exactly matching letters, spelling differences will change the remaining letter count and the final result.",
        },
        {
          q: "Does the order of names matter?",
          a: "No, CalcZen's implementation is symmetric. Krish + Tisha will give the same result as Tisha + Krish.",
        },
        {
          q: "Is FLAMES scientifically accurate?",
          a: "No. It is a fun traditional name game for entertainment only, not a scientific psychological relationship test.",
        },
      ]}
    >
      <div className="flex flex-col gap-8">
        {/* INPUT STATE */}
        <div className={`calc-input-column space-y-8 ${hasResult ? "hidden" : "block"}`}>
          <div className="flex flex-col md:flex-row gap-6 md:gap-4 relative items-center">
            <div className="flex-1 w-full space-y-4 p-5 rounded-2xl bg-card border border-border/60 shadow-sm relative z-10">
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

            {/* Heart Divider (Desktop: absolute center, Mobile: static center) */}
            <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-20 flex justify-center py-2 md:py-0">
              <div className="w-12 h-12 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center backdrop-blur-md shadow-sm">
                <Heart className="w-6 h-6 text-pink-500 fill-pink-500/20" />
              </div>
            </div>

            <div className="flex-1 w-full space-y-4 p-5 rounded-2xl bg-card border border-border/60 shadow-sm relative z-10">
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
          </div>

          <div className="flex flex-row gap-3 pt-2">
            <CalculateButton
              category="love-and-relationships"
              className="flex-1 min-h-12"
              onClick={handleCalculate}
            >
              Calculate FLAMES
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
            className="rounded-3xl bg-[#0f172a] dark:bg-[#0b0f19] border border-pink-500/20 shadow-2xl relative overflow-hidden text-white"
            aria-live="polite"
          >
            {/* Background glowing effects */}
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-pink-500/10 to-transparent pointer-events-none" />
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-pink-500/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="p-6 sm:p-10 relative z-10 flex flex-col items-center">
              <div className="text-xs font-bold tracking-[0.2em] text-pink-300/70 uppercase mb-8">
                Your FLAMES Result
              </div>

              {/* Names & Heart */}
              <div className="flex items-center justify-center gap-4 w-full mb-10">
                <div className="flex-1 text-right text-lg sm:text-2xl font-bold text-white truncate uppercase tracking-wider">
                  {name1.trim()}
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 fill-pink-400/50" />
                </div>
                <div className="flex-1 text-left text-lg sm:text-2xl font-bold text-white truncate uppercase tracking-wider">
                  {name2.trim()}
                </div>
              </div>

              {/* Dynamic Visualization & Final Result */}
              <div className="w-full flex flex-col items-center justify-center min-h-[200px] mb-8">
                {animating ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="text-sm font-semibold text-pink-300/70 uppercase tracking-widest animate-pulse">
                      Calculating...
                    </div>
                    <div className="flex items-center gap-3 sm:gap-6">
                      {["F", "L", "A", "M", "E", "S"].map((letter, i) => {
                        const isPresent = currentFlames.includes(letter);
                        return (
                          <div key={i} className="relative">
                            <span
                              className={`text-3xl sm:text-5xl font-black transition-all duration-300 ${isPresent ? "text-white" : "text-slate-600"}`}
                            >
                              {letter}
                            </span>
                            {!isPresent && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="absolute inset-0 flex items-center justify-center"
                              >
                                <X className="w-8 h-8 sm:w-12 sm:h-12 text-pink-500" />
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="text-7xl sm:text-9xl font-black bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent drop-shadow-2xl mb-2">
                      {result.resultLetter}
                    </div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-widest uppercase mb-4">
                      {result.resultName}
                    </div>
                    <p className="text-pink-100 max-w-md mx-auto text-sm sm:text-base bg-white/5 p-4 rounded-xl border border-white/10 opacity-90">
                      {result.resultDescription}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Result Statistics */}
              <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center backdrop-blur-sm">
                  <div className="text-3xl font-bold text-white mb-1">
                    {result.matchedLetters.length}
                  </div>
                  <div className="text-xs font-semibold text-pink-300 uppercase tracking-wider">
                    Matched Letters
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center backdrop-blur-sm">
                  <div className="text-3xl font-bold text-white mb-1">{result.unmatchedCount}</div>
                  <div className="text-xs font-semibold text-violet-300 uppercase tracking-wider">
                    Remaining Letters
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center backdrop-blur-sm">
                  <div className="text-3xl font-bold text-white mb-1">
                    {result.eliminationSteps.length}
                  </div>
                  <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                    Elimination Rounds
                  </div>
                </div>
              </div>

              {/* Special Note if Remaining Count is 0 */}
              {result.unmatchedCount === 0 && (
                <div className="w-full bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-10 text-center">
                  <p className="text-sm text-blue-200">
                    <strong className="text-white">All letters matched exactly!</strong> Since 0
                    letters remain, CalcZen uses the standard <strong>Friends</strong> fallback for
                    this special case.
                  </p>
                </div>
              )}

              {/* What Does FLAMES Mean? Section */}
              <div className="w-full mb-10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-400" /> What Does FLAMES Mean?
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {flamesLegend.map((item) => (
                    <div
                      key={item.l}
                      className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
                        result.resultLetter === item.l && !animating
                          ? "bg-white/15 border-pink-400/50 shadow-[0_0_15px_rgba(236,72,153,0.3)] scale-105 z-10"
                          : "bg-white/5 border-white/5 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <span
                        className={`text-2xl font-black ${result.resultLetter === item.l && !animating ? item.color : "text-slate-300"} mb-1`}
                      >
                        {item.l}
                      </span>
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${result.resultLetter === item.l && !animating ? "text-white" : "text-slate-400"}`}
                      >
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calculation Breakdown Section */}
              <div className="w-full bg-black/20 border border-white/10 rounded-2xl p-5 sm:p-8 mb-10">
                <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-3">
                  How Your Result Was Calculated
                </h3>

                <div className="space-y-6 text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-slate-400 uppercase text-[10px] tracking-widest mb-1">
                        Step 1 & 2: Normalized Names
                      </div>
                      <div className="font-mono text-white bg-black/30 p-2 rounded">
                        {result.normalizedNameA || "(empty)"}
                      </div>
                      <div className="font-mono text-white bg-black/30 p-2 rounded mt-2">
                        {result.normalizedNameB || "(empty)"}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 uppercase text-[10px] tracking-widest mb-1">
                        Step 3: Matched Letters
                      </div>
                      <div className="font-mono text-pink-300 bg-pink-500/10 p-2 rounded min-h-[36px] flex items-center flex-wrap gap-1">
                        {result.matchedLetters.length > 0
                          ? result.matchedLetters.map((l, i) => (
                              <span key={i} className="bg-pink-500/20 px-1.5 rounded">
                                {l}
                              </span>
                            ))
                          : "None"}
                      </div>
                      <div className="text-slate-400 uppercase text-[10px] tracking-widest mt-3 mb-1">
                        Step 4: Remaining Count
                      </div>
                      <div className="font-mono text-white bg-black/30 p-2 rounded">
                        {result.unmatchedCount}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400 uppercase text-[10px] tracking-widest mb-2">
                      Step 5: Circular Elimination
                    </div>
                    <div className="bg-black/30 rounded p-3 space-y-2 max-h-[250px] overflow-y-auto">
                      {result.eliminationSteps.length > 0 ? (
                        result.eliminationSteps.map((step, idx) => (
                          <div
                            key={idx}
                            className="flex flex-wrap items-center gap-2 text-xs font-mono"
                          >
                            <span className="text-slate-500">Round {idx + 1}:</span>
                            <span className="text-white tracking-widest">
                              {step.before.join(" ")}
                            </span>
                            <span className="text-pink-400 mx-1">→ remove {step.removed} →</span>
                            <span className="text-white tracking-widest">
                              {step.after.join(" ")}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-500 text-xs italic">
                          No elimination steps (0 remaining letters).
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="w-full text-center p-4 rounded-xl bg-white/5 border border-white/10 mb-10">
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                  <strong className="text-slate-300">For entertainment and reflection only.</strong>{" "}
                  FLAMES is a traditional name-based game. It is not a scientific or psychological
                  relationship test, and your result should not be treated as a real prediction.
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

      <div className="mt-16 prose prose-slate dark:prose-invert max-w-none select-copy">
        <h2>What Is a FLAMES Calculator?</h2>
        <p>
          A FLAMES Calculator is an online version of the traditional FLAMES name game. It compares
          two names by cancelling matching letters, counts the remaining letters, and uses that
          count to eliminate letters from F-L-A-M-E-S until one result remains. The final result
          represents Friends, Love, Affection, Marriage, Enemies, or Siblings.
        </p>

        <h2>What Does FLAMES Stand For?</h2>
        <div className="overflow-x-auto my-6">
          <table className="w-full text-left border-collapse min-w-[300px]">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 font-bold">Letter</th>
                <th className="py-2 font-bold">Meaning</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-2 font-mono font-bold text-emerald-500">F</td>
                <td className="py-2">Friends</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 font-mono font-bold text-pink-500">L</td>
                <td className="py-2">Love</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 font-mono font-bold text-rose-500">A</td>
                <td className="py-2">Affection</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 font-mono font-bold text-amber-500">M</td>
                <td className="py-2">Marriage</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 font-mono font-bold text-red-500">E</td>
                <td className="py-2">Enemies</td>
              </tr>
              <tr>
                <td className="py-2 font-mono font-bold text-blue-500">S</td>
                <td className="py-2">Siblings</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>How Does the FLAMES Calculator Work?</h2>
        <p>The calculation is completely deterministic and follows the classic algorithm:</p>

        <h3>Step 1 — Enter two names</h3>
        <p>First, enter your name and your partner's name.</p>

        <h3>Step 2 — Normalize the names</h3>
        <p>
          The calculator ignores capitalization, spaces, and punctuation, treating "Alex" and "ALEX"
          exactly the same.
        </p>

        <h3>Step 3 — Match common letters</h3>
        <p>
          Matching letters between the two names are cancelled <em>one-for-one</em>. If you have two
          'A's and the other name has one 'A', only one 'A' is cancelled and one 'A' remains.
        </p>

        <h3>Step 4 — Count the remaining letters</h3>
        <p>The calculator counts all unmatched letters that remain after cancellation.</p>

        <h3>Step 5 — Eliminate letters from FLAMES</h3>
        <p>
          Using the remaining count, we circularly count through the letters F-L-A-M-E-S. When the
          count is reached, that letter is removed. The count continues from the next available
          letter.
        </p>

        <h3>Step 6 — Final result</h3>
        <p>
          This process continues until exactly one letter remains. That final letter determines your
          FLAMES result!
        </p>

        <h2>Worked FLAMES Example</h2>
        <p>
          Let's calculate the FLAMES result for <strong>Alex</strong> and <strong>Jordan</strong>:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Step 1 & 2:</strong> Normalized names are ALEX and JORDAN.
          </li>
          <li>
            <strong>Step 3:</strong> The letter 'A' is shared and cancelled.
          </li>
          <li>
            <strong>Step 4:</strong> Remaining letters: L, E, X (from Alex) and J, O, R, D, N (from
            Jordan). Total remaining count is 8.
          </li>
          <li>
            <strong>Step 5:</strong> We count to 8 on F-L-A-M-E-S circularly. The first eliminated
            letter is 'L'. We continue eliminating circularly (E, M, F, S).
          </li>
          <li>
            <strong>Step 6:</strong> The final remaining letter is 'A', which stands for{" "}
            <strong>Affection</strong>!
          </li>
        </ul>

        <h2>Is the FLAMES Calculator Accurate?</h2>
        <p>
          FLAMES is a traditional entertainment game, not a scientifically validated relationship
          test. The result is determined by the letters in the names and the FLAMES elimination
          method. It should be treated as a fun result rather than a measurement of relationship
          compatibility or a prediction of the future.
        </p>

        <h2>Why Can Different FLAMES Calculators Give Different Results?</h2>
        <p>
          Different websites may implement variations of the traditional FLAMES rules, especially
          around letter normalization, elimination details, or edge cases. CalcZen uses one
          documented deterministic implementation so repeated calculations with the same names
          produce the same result.
        </p>
      </div>
    </CalculatorPageLayout>
  );
}
