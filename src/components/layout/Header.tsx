import { Link } from "@tanstack/react-router";
<<<<<<< HEAD
import { Calculator, Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
=======
import { Calculator, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3

export function Header() {
  const [open, setOpen] = useState(false);
  const nav = [
    { to: "/calculators", label: "All Calculators" },
    { to: "/category/finance", label: "Finance" },
    { to: "/category/health", label: "Health" },
    { to: "/category/math", label: "Math" },
    { to: "/about", label: "About" },
  ];

<<<<<<< HEAD
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass-header backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/60 transition-[background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
      <div className="page-container flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-3 !py-0">
        <Link
          to="/"
          className="flex min-w-0 shrink items-center gap-2 group touch-target !min-w-0 !justify-start"
          onClick={() => setOpen(false)}
        >
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-accent shadow-glow transition-[transform,box-shadow] duration-300 ease-out group-hover:scale-105 group-hover:shadow-glow-lg">
            <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
          </div>
          <span className="truncate text-base sm:text-lg font-bold tracking-tight">
            Calc<span className="text-gradient">Zen</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 min-w-0">
=======
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-accent shadow-glow transition-transform group-hover:scale-105">
            <Calculator className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Calc<span className="text-gradient">Verse</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
<<<<<<< HEAD
              className="px-2.5 lg:px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 ease-out rounded-lg hover:bg-muted/70 whitespace-nowrap"
              activeProps={{
                className:
                  "px-2.5 lg:px-3 py-2 text-sm font-semibold text-foreground rounded-lg bg-muted/90 shadow-soft whitespace-nowrap",
              }}
=======
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
              activeProps={{ className: "px-3 py-2 text-sm font-semibold text-foreground rounded-md bg-muted" }}
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
            >
              {n.label}
            </Link>
          ))}
        </nav>

<<<<<<< HEAD
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <ThemeToggle className="scale-90 sm:scale-100" />
          <Link to="/calculators" className="hidden sm:inline-flex">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 h-9 border-border/60 bg-card/50 shadow-soft hover:shadow-card"
            >
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">Search</span>
            </Button>
          </Link>
          <button
            type="button"
            className="md:hidden touch-target inline-flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-muted/80 active:bg-muted"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
=======
        <div className="flex items-center gap-2">
          <Link to="/calculators" className="hidden sm:inline-flex">
            <Button variant="outline" size="sm" className="gap-2">
              <Search className="h-4 w-4" /> Search
            </Button>
          </Link>
          <button
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

<<<<<<< HEAD
      <div
        id="mobile-nav"
        className={cn(
          "md:hidden border-t border-border/60 bg-background/98 backdrop-blur-xl overflow-hidden transition-[max-height,opacity] duration-300 ease-out",
          open ? "max-h-[min(85dvh,28rem)] opacity-100" : "max-h-0 opacity-0 border-t-transparent",
        )}
        aria-hidden={!open}
      >
        <nav className="page-container flex flex-col gap-0.5 !py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <Link
            to="/calculators"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-3 py-3 text-sm font-medium text-foreground bg-muted/50 active:bg-muted"
          >
            <Search className="h-4 w-4 text-accent shrink-0" />
            Search calculators
          </Link>
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 active:bg-muted min-h-[2.75rem] flex items-center"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
=======
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
    </header>
  );
}
