export const THEME_STORAGE_KEY = "calczen-theme";

export type Theme = "light" | "dark";

const listeners = new Set<() => void>();

export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyTheme() {
  listeners.forEach((l) => l());
}

export function getResolvedTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function commitTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* private browsing / blocked storage */
  }

  notifyTheme();
}

const THEME_TRANSITION_MS = 520;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function canUseViewTransition(): boolean {
  return (
    typeof document !== "undefined" &&
    "startViewTransition" in document &&
    typeof document.startViewTransition === "function"
  );
}

export function applyTheme(theme: Theme, options?: { transition?: boolean }) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const animate = options?.transition && !prefersReducedMotion();

  if (!animate) {
    commitTheme(theme);
    return;
  }

  const finish = () => {
    window.setTimeout(() => {
      root.classList.remove("theme-transition");
    }, THEME_TRANSITION_MS);
  };

  if (canUseViewTransition()) {
    root.classList.add("theme-transition");
    const transition = document.startViewTransition(() => {
      commitTheme(theme);
    });
    transition.finished.then(finish).catch(finish);
    return;
  }

  root.classList.add("theme-transition");
  commitTheme(theme);
  finish();
}

/** Inline script for <head> — applies stored/system theme before first paint */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;
