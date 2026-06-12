import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { BrandLogo } from "@/components/BrandLogo";
import { categories } from "@/data/calculators";

interface FooterAccordionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FooterAccordion({ title, isOpen, onToggle, children }: FooterAccordionProps) {
  return (
    <div className="border-b border-border/20 sm:border-b-0 pb-1.5 sm:pb-0 min-w-0">
      <button
        onClick={onToggle}
        className="flex sm:hidden w-full items-center justify-between py-3.5 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground text-left"
      >
        <span>{title}</span>
        <span className="text-sm font-normal text-muted-foreground/50">{isOpen ? "−" : "+"}</span>
      </button>
      <h2 className="hidden sm:block text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground mb-2.5">
        {title}
      </h2>
      <div
        className={`sm:block overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100 mt-1" : "max-h-0 sm:max-h-none opacity-0 sm:opacity-100"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const linkClass =
    "inline-flex min-h-[2.25rem] items-center text-sm text-muted-foreground/90 hover:text-foreground transition-colors duration-200";

  return (
    <footer className="border-t border-border/50 bg-gradient-surface mt-12 sm:mt-16 md:mt-20">
      <div className="page-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-y-6 sm:gap-x-10 lg:gap-x-14 py-6 sm:py-8">
          <div className="sm:col-span-2 lg:col-span-4 min-w-0">
            <Link to="/" className="inline-flex items-center gap-2.5 group touch-target !min-w-0 !justify-start">
              <BrandLogo imgClassName="h-8 w-8" labelClassName="text-base font-semibold tracking-tight" />
            </Link>
            <p className="mt-2.5 text-sm text-muted-foreground/90 leading-relaxed max-w-sm">
              Fast, reliable calculators for finance, health, math, and everyday use.
            </p>
          </div>

          <div className="flex flex-col gap-0 sm:contents">
            <div className="lg:col-span-2 lg:col-start-7">
              <FooterAccordion
                title="Categories"
                isOpen={openSection === "categories"}
                onToggle={() => toggleSection("categories")}
              >
                <ul className="flex flex-col gap-1 sm:gap-2">
                  {categories.map((c) => (
                    <li key={c.slug}>
                      <Link
                        to="/category/$slug"
                        params={{ slug: c.slug }}
                        className={linkClass}
                        onClick={() => setOpenSection(null)}
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterAccordion>
            </div>

            <div className="lg:col-span-2">
              <FooterAccordion
                title="Company"
                isOpen={openSection === "company"}
                onToggle={() => toggleSection("company")}
              >
                <ul className="flex flex-col gap-1 sm:gap-2">
                  <li>
                    <Link to="/about" className={linkClass} onClick={() => setOpenSection(null)}>
                      About
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog" className={linkClass} onClick={() => setOpenSection(null)}>
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className={linkClass} onClick={() => setOpenSection(null)}>
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link to="/calculators" className={linkClass} onClick={() => setOpenSection(null)}>
                      All calculators
                    </Link>
                  </li>
                </ul>
              </FooterAccordion>
            </div>

            <div className="col-span-2 sm:col-span-1 lg:col-span-2">
              <FooterAccordion
                title="Legal"
                isOpen={openSection === "legal"}
                onToggle={() => toggleSection("legal")}
              >
                <ul className="flex flex-col gap-1 sm:gap-2 sm:flex-row sm:flex-wrap lg:flex-col">
                  <li>
                    <Link to="/privacy" className={linkClass} onClick={() => setOpenSection(null)}>
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className={linkClass} onClick={() => setOpenSection(null)}>
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link to="/disclaimer" className={linkClass} onClick={() => setOpenSection(null)}>
                      Disclaimer
                    </Link>
                  </li>
                </ul>
              </FooterAccordion>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/50">
        <div className="page-container py-4 sm:py-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground/75 tabular-nums">
            © {year} CalcZen
          </p>
          <p className="text-xs text-muted-foreground/75 leading-relaxed sm:text-right max-w-md">
            For informational use only—not professional advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
