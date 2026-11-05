<<<<<<< HEAD
"use client";

=======
>>>>>>> 529569b (Deploy CalcZen V2)
import { useCallback, useSyncExternalStore } from "react";
import { applyTheme, getResolvedTheme, subscribeTheme, type Theme } from "@/lib/theme";

export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, getResolvedTheme, () => "light" as Theme);

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next, { transition: true });
  }, []);

  const toggle = useCallback(() => {
<<<<<<< HEAD
    setTheme(theme === "dark" ? "light" : "dark");
=======
    const isCurrentlyDark =
      typeof document !== "undefined"
        ? document.documentElement.classList.contains("dark")
        : theme === "dark";
    setTheme(isCurrentlyDark ? "light" : "dark");
>>>>>>> 529569b (Deploy CalcZen V2)
  }, [theme, setTheme]);

  return {
    theme,
    isDark: theme === "dark",
    setTheme,
    toggle,
  };
}
