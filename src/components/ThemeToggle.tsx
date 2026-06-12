import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { isDark, toggle } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className={cn(
        "group relative inline-flex h-9 w-[4.25rem] shrink-0 cursor-pointer items-center rounded-full p-1",
        "border border-border/50 bg-[var(--toggle-track)]",
        "shadow-[inset_0_1px_2px_oklch(0_0_0_/_0.06)]",
        "transition-[background-color,border-color,box-shadow,transform] duration-300 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "active:scale-[0.94]",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-full bg-gradient-accent opacity-0 transition-opacity duration-500 ease-in-out",
          isDark && "opacity-[0.12]",
        )}
      />

      <Sun
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-2.5 z-0 h-3 w-3 transition-all duration-500 ease-in-out",
          isDark ? "scale-50 opacity-20 text-muted-foreground" : "scale-90 opacity-40 text-amber-500/80",
        )}
      />
      <Moon
        aria-hidden
        className={cn(
          "pointer-events-none absolute right-2.5 z-0 h-3 w-3 transition-all duration-500 ease-in-out",
          isDark ? "scale-90 opacity-40 text-accent/80" : "scale-50 opacity-20 text-muted-foreground",
        )}
      />

      <span
        aria-hidden
        className={cn(
          "theme-toggle-thumb relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--toggle-thumb)]",
          "shadow-[0_2px_10px_oklch(0_0_0_/_0.15),0_0_0_1px_oklch(1_0_0_/_0.08)]",
          "transition-[background-color,transform,box-shadow] duration-500 ease-[cubic-bezier(0.34,1.25,0.64,1)]",
          "will-change-transform",
          isDark ? "translate-x-8" : "translate-x-0",
        )}
      >
        <Sun
          className={cn(
            "absolute h-3.5 w-3.5 transition-all duration-500 ease-in-out",
            isDark
              ? "rotate-[120deg] scale-0 opacity-0 text-amber-400"
              : "rotate-0 scale-100 opacity-100 text-amber-500",
          )}
        />
        <Moon
          className={cn(
            "absolute h-3.5 w-3.5 transition-all duration-500 ease-in-out",
            isDark
              ? "rotate-0 scale-100 opacity-100 text-accent"
              : "-rotate-[120deg] scale-0 opacity-0 text-accent",
          )}
        />
      </span>
    </button>
  );
}
