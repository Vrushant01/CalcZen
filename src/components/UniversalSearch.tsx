import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { calculators } from "../data/calculators";

export function UniversalSearch() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut '/'
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute search results
  const q = query.toLowerCase().trim();

  let bestMatch: (typeof calculators)[0] | null = null;
  let related: typeof calculators = [];

  if (q) {
    const scored = calculators.map((c) => {
      let score = 0;
      const cName = c.name.toLowerCase();
      const cDesc = c.description.toLowerCase();
      const cCat = c.category.toLowerCase();
      const cKeywords = c.keywords.join(" ").toLowerCase();
      const cUseCases = c.useCases ? c.useCases.join(" ").toLowerCase() : "";

      const targetText = `${cName} ${cDesc} ${cKeywords} ${cUseCases}`;

      // Exact name match
      if (cName === q) score += 100;
      else if (cName.includes(q)) score += 50;

      // Keyword match
      if (cKeywords.includes(q)) score += 40;

      // Category match
      if (cCat === q) score += 30;

      // Words match
      const stopWords = new Set([
        "how",
        "much",
        "will",
        "i",
        "pay",
        "for",
        "a",
        "an",
        "the",
        "can",
        "do",
        "does",
        "what",
        "is",
        "are",
        "to",
        "my",
        "this",
      ]);
      const words = q.split(/\s+/).filter((w) => w.length > 2 && !stopWords.has(w));
      let wordMatches = 0;
      words.forEach((w) => {
        if (targetText.includes(w)) {
          wordMatches++;
        }
      });
      score += wordMatches * 15;

      return { calc: c, score };
    });

    const filtered = scored.filter((item) => item.score > 0).sort((a, b) => b.score - a.score);
    if (filtered.length > 0) {
      bestMatch = filtered[0].calc;
      related = filtered.slice(1, 4).map((i) => i.calc);

      // If no other results, try filling related from same category
      if (related.length === 0) {
        related = calculators
          .filter((c) => c.category === bestMatch!.category && c.slug !== bestMatch!.slug)
          .slice(0, 3);
      }
    }
  }

  const allDisplayedResults = bestMatch ? [bestMatch, ...related] : [];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, allDisplayedResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < allDisplayedResults.length) {
        navigate({
          to: "/calculator/$slug",
          params: { slug: allDisplayedResults[selectedIndex].slug },
        });
        setIsFocused(false);
      } else if (bestMatch) {
        navigate({ to: "/calculator/$slug", params: { slug: bestMatch.slug } });
        setIsFocused(false);
      }
    } else if (e.key === "Escape") {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  // Quick Prompts
  const quickPrompts = calculators.filter((c) =>
    [
      "loan-emi-calculator",
      "bmi-calculator",
      "percentage-calculator",
      "mortgage-calculator",
      "age-calculator",
    ].includes(c.slug),
  );

  return (
    <div
      className="w-full max-w-[700px] relative z-50 flex flex-col items-center mx-auto"
      ref={containerRef}
    >
      {/* Search Input */}
      <div className="relative group w-full">
        <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl transition-all duration-300 group-hover:bg-accent/30" />
        <div
          className={`relative flex items-center w-full bg-slate-950/80 backdrop-blur-2xl border ${isFocused ? "border-accent/60 shadow-[0_8px_32px_rgba(14,165,233,0.3)] rounded-t-2xl rounded-b-none" : "border-white/15 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)]"} transition-all duration-300 p-1.5 sm:p-2`}
        >
          <Search
            className={`w-5 h-5 sm:w-6 sm:h-6 ml-4 sm:ml-5 shrink-0 transition-colors duration-300 ${isFocused ? "text-accent" : "text-white/50"}`}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search any calculator..."
            className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/40 text-base sm:text-lg px-4 sm:px-5 h-12 sm:h-14 font-medium"
          />
          <div className="hidden sm:flex items-center px-4">
            <kbd className="hidden sm:inline-flex items-center justify-center h-6 px-2 text-[10px] font-bold text-white/40 bg-white/5 border border-white/10 rounded mr-2">
              /
            </kbd>
          </div>
        </div>
      </div>

      {/* Quick Prompts (Only visible when empty state and NOT focused) */}
      {!isFocused && !q && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center w-full mt-6 sm:mt-8"
        >
          <span className="text-[11px] sm:text-xs font-bold text-white/50 mb-3 uppercase tracking-widest">
            Try a calculator
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full">
            {quickPrompts.map((calc, i) => (
              <Link
                key={i}
                to="/calculator/$slug"
                params={{ slug: calc.slug }}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white/80 hover:text-white text-[13px] sm:text-sm font-medium transition-all active:scale-95 backdrop-blur-sm cursor-pointer"
              >
                {calc.name.replace(" Calculator", "")}
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-slate-950/95 backdrop-blur-2xl border border-white/15 border-t-0 rounded-b-2xl shadow-[0_16px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
          >
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2 sm:p-3">
              {!q && (
                <div className="p-2">
                  <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 px-3">
                    Popular Calculators
                  </div>
                  <div className="space-y-1 mt-2">
                    {quickPrompts.map((calc, i) => (
                      <Link
                        key={calc.slug}
                        to="/calculator/$slug"
                        params={{ slug: calc.slug }}
                        onClick={() => setIsFocused(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${selectedIndex === i ? "bg-white/10" : "hover:bg-white/5"}`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 shrink-0">
                          <calc.icon className="w-4 h-4 text-white/70" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="text-sm font-semibold text-white/90 truncate">
                            {calc.name}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {q && bestMatch && (
                <div className="p-2 space-y-4">
                  <div>
                    <div className="text-xs font-bold text-accent uppercase tracking-wider mb-2 px-3">
                      Best Match
                    </div>
                    <Link
                      to="/calculator/$slug"
                      params={{ slug: bestMatch.slug }}
                      onClick={() => setIsFocused(false)}
                      className={`flex flex-col gap-1.5 px-4 py-3.5 rounded-xl transition-all duration-200 border mt-2 ${selectedIndex === 0 ? "bg-accent/15 border-accent/30" : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"}`}
                    >
                      <div className="flex items-center gap-2">
                        <bestMatch.icon className="w-4 h-4 text-accent" />
                        <span className="text-sm font-bold text-white text-left">
                          {bestMatch.name}
                        </span>
                        <span className="text-[10px] font-semibold text-white/40 bg-white/10 px-2 py-0.5 rounded-full ml-auto uppercase tracking-wide">
                          {bestMatch.category}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 line-clamp-1 text-left">
                        {bestMatch.description}
                      </p>
                    </Link>
                  </div>

                  {related.length > 0 && (
                    <div>
                      <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 px-3">
                        Related Calculators
                      </div>
                      <div className="space-y-1">
                        {related.map((calc, i) => (
                          <Link
                            key={calc.slug}
                            to="/calculator/$slug"
                            params={{ slug: calc.slug }}
                            onClick={() => setIsFocused(false)}
                            className={`flex flex-col gap-1 px-4 py-2.5 rounded-xl transition-all duration-200 ${selectedIndex === i + 1 ? "bg-white/10" : "hover:bg-white/5"}`}
                          >
                            <div className="flex items-center gap-2 text-left">
                              <span className="text-sm font-semibold text-white/80">
                                {calc.name}
                              </span>
                            </div>
                            <p className="text-[11px] text-white/40 line-clamp-1 text-left">
                              {calc.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {q && !bestMatch && (
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <Search className="w-5 h-5 text-white/30" />
                  </div>
                  <h3 className="text-sm font-medium text-white mb-1">
                    No exact calculator found.
                  </h3>
                  <p className="text-xs text-white/50 max-w-[200px] mb-4">
                    Try searching for keywords like loan, percentage, or BMI.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
