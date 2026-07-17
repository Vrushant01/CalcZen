"use client";

import { Link } from "@/components/ui/Link";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const nav = [
    { to: "/calculators", label: "All Calculators" },
    { to: "/category/finance", label: "Finance" },
    { to: "/category/health", label: "Health" },
    { to: "/category/math", label: "Math" },
    { to: "/blog", label: "Blog" },
    { to: "/about", label: "About" },
  ];

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
      <div className="page-container flex h-14 sm:h-16 items-center justify-between gap-1.5 sm:gap-3 !py-0">
        <Link
          to="/"
          className="flex min-w-0 shrink items-center gap-2 group touch-target !min-w-0 !justify-start"
          onClick={() => setOpen(false)}
        >
          <BrandLogo
            className="transition-[transform,filter] duration-300 ease-out group-hover:scale-[1.015]"
            imgClassName="h-8 w-8 sm:h-9 sm:w-9"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 min-w-0">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-2.5 lg:px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 ease-out rounded-lg hover:bg-muted/70 whitespace-nowrap"
              activeProps={{
                className:
                  "px-2.5 lg:px-3 py-2 text-sm font-semibold text-foreground rounded-lg bg-muted/90 shadow-soft whitespace-nowrap",
              }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

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
            className="md:hidden touch-target inline-flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-muted/80 active:bg-muted outline-none focus:outline-none focus-visible:ring-0"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Backdrop for click outside */}
      <div
        className={cn(
          "fixed inset-0 top-[3.5rem] sm:top-[4rem] z-30 md:hidden bg-background/40 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Compact Dropdown Menu */}
      <div
        id="mobile-nav"
        className={cn(
          "absolute left-0 right-0 top-full z-40 md:hidden bg-background/98 backdrop-blur-2xl border-b border-border/40 shadow-xl transition-all duration-200 ease-out origin-top",
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <nav className="flex flex-col justify-start p-3 sm:p-4 gap-0.5 max-h-[280px] overflow-y-auto">
          <Link
            to="/calculators"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[15px] font-semibold text-foreground bg-accent/10 border border-accent/20 active:scale-[0.98] transition-transform shadow-sm mb-2"
          >
            <Search className="h-4 w-4 text-accent shrink-0" />
            Search Calculators
          </Link>

          <div className="w-full h-px bg-border/40 mb-1.5 shrink-0" />

          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 active:bg-muted/70 transition-all flex items-center justify-between group"
            >
              <span>{n.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
