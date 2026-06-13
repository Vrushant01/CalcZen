import { useCallback, useSyncExternalStore } from "react";
import { applyTheme, getResolvedTheme, subscribeTheme, type Theme } from "@/lib/theme";

export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, getResolvedTheme, () => "light" as Theme);

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next, { transition: true });
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return {
    theme,
    isDark: theme === "dark",
    setTheme,
    toggle,
  };
}
