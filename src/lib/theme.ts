export const THEME_STORAGE_KEY = "calczen-theme";

export type Theme = "light" | "dark";

const listeners = new Set<() => void>();

export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyTheme() {
<<<<<<< HEAD
  listeners.forEach((l) => l());
=======
  listeners.forEach((l) => {
    try {
      l();
    } catch {
      /* ignore subscriber error */
    }
  });
>>>>>>> 529569b (Deploy CalcZen V2)
}

export function getResolvedTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function commitTheme(theme: Theme) {
  const root = document.documentElement;
<<<<<<< HEAD
  root.classList.toggle("dark", theme === "dark");
=======
  const isDark = theme === "dark";
  root.classList.toggle("dark", isDark);
>>>>>>> 529569b (Deploy CalcZen V2)

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* private browsing / blocked storage */
  }

<<<<<<< HEAD
  notifyTheme();
}

const THEME_TRANSITION_MS = 520;
=======
  try {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", isDark ? "#0F172A" : "#F5F7FB");
    }
  } catch {
    /* ignore */
  }

  notifyTheme();
}

// Observe manual DOM class changes or system changes to stay in sync
if (typeof window !== "undefined" && typeof MutationObserver !== "undefined") {
  try {
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "class") {
          notifyTheme();
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("storage", (e) => {
      if (e.key === THEME_STORAGE_KEY && (e.newValue === "light" || e.newValue === "dark")) {
        commitTheme(e.newValue as Theme);
      }
    });
  } catch {
    /* ignore in non-browser environments */
  }
}
>>>>>>> 529569b (Deploy CalcZen V2)

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
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
<<<<<<< HEAD
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
=======

  if (canUseViewTransition() && options?.transition && !prefersReducedMotion()) {
    try {
      root.classList.add("theme-transition");
      const transition = document.startViewTransition(() => {
        commitTheme(theme);
      });
      transition.finished
        .then(() => root.classList.remove("theme-transition"))
        .catch(() => root.classList.remove("theme-transition"));
      return;
    } catch {
      root.classList.remove("theme-transition");
    }
  }

  commitTheme(theme);
}

/** Inline script for <head> — applies stored theme before first paint (defaults to light mode) */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t==="dark";document.documentElement.classList.toggle("dark",d);var m=document.querySelector('meta[name="theme-color"]');if(m){m.setAttribute("content",d?"#0F172A":"#F5F7FB");}}catch(e){}})();`;
>>>>>>> 529569b (Deploy CalcZen V2)
