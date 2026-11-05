import re

with open(r'c:\Users\Krish\OneDrive\Desktop\CAL\CalcZen-aefeb215e37b8a685c1084963fedc460823c7441\calczen\src\routes\index.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace imports
content = content.replace(
    'import { createFileRoute, Link } from "@tanstack/react-router";',
    'import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";'
)
content = content.replace(
    'import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";',
    'import { ArrowRight, Sparkles, ChevronDown, Search } from "lucide-react";'
)

# Replace Index component up to Popular Calculators Section
start_marker = "function Index() {"
end_marker = "      {/* Popular Calculators Section */}"

new_hero = """function Index() {
  const navigate = useNavigate();
  const popular = calculators.filter((c) => c.popular).slice(0, 8);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e?: React.FormEvent, directQuery?: string) => {
    if (e) e.preventDefault();
    const query = (directQuery || searchQuery).toLowerCase().trim();
    if (!query) return;

    // Lightweight matching system
    if (query.includes("attendance")) {
      toast.success("Navigating to Attendance Calculator (Coming soon!)");
    } else if (query.includes("salary")) {
      toast.success("Navigating to Salary Calculator (Coming soon!)");
    } else if (query.includes("trip") || query.includes("fuel")) {
      toast.success("Navigating to Trip Cost Calculator (Coming soon!)");
    } else if (query.includes("pack") || query.includes("compare")) {
      toast.success("Navigating to Comparison Calculator (Coming soon!)");
    } else {
      toast.success(`Searching for: ${query}`);
    }
  };

  return (
    <PageShell>
      {/* NEW CALCZEN 2.0 HERO */}
      <section className="hero-section relative flex flex-col justify-center items-center overflow-hidden bg-gradient-hero pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="absolute inset-0 bg-gradient-mesh opacity-90 pointer-events-none" />
        
        <div className="relative page-container hero-container w-full z-10 px-4 max-w-4xl mx-auto flex flex-col items-center text-center">
          
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-5 sm:mb-7"
          >
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.22em] text-white/70 uppercase">
              EVERYDAY CALCULATIONS, MADE SIMPLE
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="hero-headline text-4xl sm:text-5xl md:text-[64px] lg:text-[76px] font-extrabold tracking-tight text-white leading-[1.05] text-balance mb-6 max-w-3xl"
          >
            What do you need <br className="hidden sm:inline" />
            to <span className="text-gradient bg-gradient-to-r from-accent via-[#38bdf8] to-[#a78bfa] bg-clip-text text-transparent">figure out?</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-xl text-white/80 dark:text-slate-300 leading-relaxed font-normal max-w-[680px] mb-10 sm:mb-12"
          >
            Fast, accurate online calculators for finance, health, and daily math — simple tools designed for speed and clarity.
          </motion.p>

          {/* Search Input */}
          <motion.form
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            onSubmit={handleSearch}
            className="w-full max-w-[700px] relative group"
          >
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl transition-all duration-300 group-hover:bg-accent/30 group-focus-within:bg-accent/40" />
            <div className="relative flex items-center w-full bg-slate-950/60 backdrop-blur-xl border border-white/15 rounded-full p-1.5 sm:p-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 group-focus-within:border-accent/60 group-focus-within:shadow-[0_8px_32px_rgba(14,165,233,0.2)]">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white/50 ml-4 sm:ml-5 shrink-0 transition-colors duration-300 group-focus-within:text-accent" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Try “How many classes can I miss?”"
                className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/40 text-base sm:text-lg px-4 sm:px-5 h-12 sm:h-14 font-medium"
              />
              <Button
                type="submit"
                className="hidden sm:flex h-12 px-7 bg-accent text-accent-foreground hover:bg-accent/90 rounded-full font-bold text-sm shrink-0 transition-transform active:scale-95 shadow-[0_2px_10px_rgba(14,165,233,0.3)]"
              >
                Calculate
              </Button>
            </div>
          </motion.form>

          {/* Quick Prompts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 w-full max-w-3xl"
          >
            {[
              { icon: "🎓", label: "My attendance" },
              { icon: "💰", label: "My in-hand salary" },
              { icon: "⛽", label: "Trip cost" },
              { icon: "🛒", label: "Which pack is cheaper?" }
            ].map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setSearchQuery(prompt.label);
                  handleSearch(undefined, prompt.label);
                }}
                className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white/80 hover:text-white text-[13px] sm:text-sm font-medium transition-all active:scale-95 backdrop-blur-sm cursor-pointer"
              >
                <span>{prompt.icon}</span>
                <span>{prompt.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Existing Calculator Categories (Moved inside Hero) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="w-full mt-16 sm:mt-24 pt-10 sm:pt-12 border-t border-white/10 relative"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent blur-[2px]" />
            <h3 className="text-[11px] sm:text-xs font-bold text-white/50 mb-6 sm:mb-8 uppercase tracking-[0.15em]">
              Explore by what you're trying to solve
            </h3>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="group relative flex items-center gap-2 sm:gap-3 px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 hover:bg-slate-900/80 hover:border-white/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 shadow-soft"
                >
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-white/5 border border-white/5 transition-transform duration-300 group-hover:scale-105">
                    <c.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${c.iconColor}`} />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-white group-hover:text-white/90">
                    {c.name}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>

        </div>
        
        {/* Subtle curved transition at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden line-height-0 pointer-events-none">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-[calc(100%+1.3px)] h-[52px] sm:h-[72px] text-[var(--background)] fill-current transition-colors duration-500"
          >
            <path
              d="M0,0 C350,105 550,105 600,105 C650,105 850,105 1200,0 L1200,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

"""

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + new_hero + content[end_idx:]
    with open(r'c:\Users\Krish\OneDrive\Desktop\CAL\CalcZen-aefeb215e37b8a685c1084963fedc460823c7441\calczen\src\routes\index.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully replaced.")
else:
    print("Could not find markers.")
