import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Heart,
  Plus,
  Activity,
  Sparkles,
  Coins,
  TrendingUp,
  Star,
  Clock,
  Calendar,
} from "lucide-react";

export interface CalculateButtonProps extends ButtonProps {
  category: "health" | "finance" | "math" | "everyday";
}

interface Particle {
  id: number;
  targetX: number;
  targetY: number;
  arcY: number;
  rotate: number;
  size: number;
  duration: number;
  color: string;
  glowColor: string;
  icon: React.ReactNode;
}

const CATEGORY_COLORS = {
  health: {
    ringColor: "rgba(16, 185, 129, 0.45)", // Emerald
    particles: ["#ec4899", "#10b981", "#06b6d4", "#f43f5e"],
  },
  finance: {
    ringColor: "rgba(14, 165, 233, 0.45)", // Sky
    particles: ["#f59e0b", "#10b981", "#0ea5e9", "#059669"],
  },
  math: {
    ringColor: "rgba(139, 92, 246, 0.45)", // Violet
    particles: ["#8b5cf6", "#6366f1", "#3b82f6", "#a855f7"],
  },
  everyday: {
    ringColor: "rgba(245, 158, 11, 0.45)", // Amber
    particles: ["#f59e0b", "#f97316", "#eab308", "#14b8a6"],
  },
};

export function CalculateButton({
  category,
  className,
  onClick,
  disabled,
  children = "Calculate",
  ...props
}: CalculateButtonProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isBursting, setIsBursting] = useState(false);
  const [showRing, setShowRing] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Monitor system-wide preferences and document themes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);

    if (typeof document !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
      const observer = new MutationObserver(() => {
        setIsDark(document.documentElement.classList.contains("dark"));
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      return () => {
        mediaQuery.removeEventListener("change", handler);
        observer.disconnect();
      };
    }
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    // Trigger button scale compress & expands soft colored ring
    setIsBursting(true);
    setShowRing(true);
    setTimeout(() => setIsBursting(false), 300);
    setTimeout(() => setShowRing(false), 500);

    if (!prefersReducedMotion) {
      const newParticles = generateParticles(category);
      setParticles(newParticles);
      // Clean up after the animation completes (900ms)
      setTimeout(() => {
        setParticles([]);
      }, 1000);
    }

    if (onClick) {
      onClick(e);
    }
  };

  const generateParticles = (cat: typeof category): Particle[] => {
    const count = 8 + Math.floor(Math.random() * 5); // Clean count: 8-12 particles
    const list: Particle[] = [];
    const colors = CATEGORY_COLORS[cat].particles;

    for (let i = 0; i < count; i++) {
      // Perfect radial distribution for even spread
      const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.1 - 0.05);

      // Strict travel distance: 75px to 105px (stays strictly within 120px radius)
      const travelDistance = 75 + Math.random() * 30;
      const targetX = Math.cos(angle) * travelDistance;
      const targetY = Math.sin(angle) * travelDistance;

      // Short elegant arc Peak
      const arcY = targetY * 0.6 - 8;

      // Clean, small particle sizes: 14px–24px, maximum hero at 28px
      let size = 14;
      const roll = Math.random();
      if (roll < 0.85) {
        size = 14 + Math.floor(Math.random() * 9); // 14px–22px
      } else {
        size = 25 + Math.floor(Math.random() * 4); // 25px–28px max
      }

      // Elegant short fade duration: 700ms–900ms
      const duration = 0.7 + Math.random() * 0.2;

      const color = colors[i % colors.length];
      const rotate = Math.random() * 80 - 40; // modest rotation

      list.push({
        id: Math.random(),
        targetX,
        targetY,
        arcY,
        rotate,
        size,
        duration,
        color,
        glowColor: color,
        icon: getCategoryIcon(cat, i),
      });
    }
    return list;
  };

  const getCategoryIcon = (cat: typeof category, index: number): React.ReactNode => {
    if (cat === "health") {
      const items = [
        "❤️",
        "➕",
        "💓",
        <Heart className="w-full h-full fill-rose-500 text-rose-500" key="h" />,
        <Plus className="w-full h-full text-emerald-500 stroke-[3]" key="p" />,
        <Activity className="w-full h-full text-cyan-400 stroke-[2]" key="a" />,
      ];
      return items[index % items.length];
    } else if (cat === "finance") {
      const items = [
        "💰",
        "₹",
        "📈",
        <Coins className="w-full h-full text-amber-500 fill-amber-400/90" key="c" />,
        <TrendingUp className="w-full h-full text-emerald-500 stroke-[2]" key="t" />,
        <span className="font-bold leading-none select-none text-sky-400" key="d">
          $
        </span>,
      ];
      return items[index % items.length];
    } else if (cat === "math") {
      const symbols = ["➕", "➖", "✖️", "➗", "=", "🔢", "📐", "π", "x", "y", "7", "5"];
      return symbols[index % symbols.length];
    } else {
      // everyday
      const items = [
        "⭐",
        "⏰",
        "📅",
        <Star className="w-full h-full text-amber-400 fill-amber-300" key="st" />,
        <Clock className="w-full h-full text-sky-400" key="cl" />,
        <Calendar className="w-full h-full text-teal-400" key="ca" />,
      ];
      return items[index % items.length];
    }
  };

  // Subtle support glow configuration
  const getGlowFilter = (p: Particle) => {
    if (isDark) {
      return `drop-shadow(0 2px 4px ${p.glowColor})`;
    }
    return `drop-shadow(0 1px 2px rgba(0, 0, 0, 0.08)) drop-shadow(0 1px 2px ${p.glowColor})`;
  };

  return (
    <div className="relative w-full flex-1 overflow-visible">
      {/* Soft category-colored expanding ring */}
      <AnimatePresence>
        {showRing && !prefersReducedMotion && (
          <motion.div
            initial={{ scale: 0.1, opacity: 0.85 }}
            animate={{ scale: 1.25, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-10 w-full aspect-square max-w-[150px]"
            style={{
              border: `1.5px solid ${CATEGORY_COLORS[category].ringColor}`,
              boxShadow: `0 0 12px ${CATEGORY_COLORS[category].ringColor}`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Button press briefly compresses (scale 0.98) */}
      <motion.div
        className="w-full h-full"
        animate={isBursting && !prefersReducedMotion ? { scale: [1, 0.98, 1] } : { scale: 1 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <Button
          ref={buttonRef}
          className={cn("w-full relative overflow-visible select-none", className)}
          onClick={handleClick}
          disabled={disabled}
          {...props}
        >
          {children}
        </Button>
      </motion.div>

      {/* Local floating particles burst - stays strictly attached to button center */}
      {!prefersReducedMotion && particles.length > 0 && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 overflow-visible w-0 h-0">
          {particles.map((p) => {
            const isText = typeof p.icon === "string";

            return (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, scale: 0, opacity: 0.95 }}
                animate={{
                  x: p.targetX,
                  y: [0, p.arcY, p.targetY],
                  scale: [0, 1.1, 1, 0],
                  opacity: [0.95, 1, 0.8, 0],
                  rotate: [0, p.rotate],
                }}
                transition={{
                  duration: p.duration,
                  ease: [0.16, 1, 0.3, 1], // easeOutExpo
                }}
                className="absolute flex items-center justify-center pointer-events-none select-none"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  fontSize: `${p.size}px`,
                  color: p.color,
                  filter: getGlowFilter(p),
                }}
              >
                {isText ? (
                  <span
                    className="leading-none font-sans select-none block"
                    style={{ fontSize: `${p.size * 0.9}px` }}
                  >
                    {p.icon}
                  </span>
                ) : (
                  p.icon
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
