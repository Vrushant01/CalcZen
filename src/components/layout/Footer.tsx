import { Link } from "@tanstack/react-router";
import { Calculator } from "lucide-react";
import { categories } from "@/data/calculators";

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <h2 className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground mb-2.5">
        {title}
      </h2>
      {children}
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  const linkClass =
    "inline-flex min-h-[2.25rem] items-center text-sm text-muted-foreground/90 hover:text-foreground transition-colors duration-200";

  return (
    <footer className="border-t border-border/50 bg-gradient-surface mt-12 sm:mt-16 md:mt-20">
      <div className="page-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-y-6 sm:gap-x-10 lg:gap-x-14 py-8 sm:py-8">
          <div className="sm:col-span-2 lg:col-span-4 min-w-0">
            <Link to="/" className="inline-flex items-center gap-2.5 group touch-target !min-w-0 !justify-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-accent shadow-glow transition-shadow group-hover:shadow-glow-lg">
                <Calculator className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-base font-semibold text-foreground tracking-tight">CalcVerse</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground/90 leading-relaxed max-w-sm">
              Fast, reliable calculators for finance, health, math, and everyday use.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:contents">
            <div className="lg:col-span-2 lg:col-start-7">
              <FooterColumn title="Categories">
                <ul className="flex flex-col gap-1 sm:gap-2">
                  {categories.map((c) => (
                    <li key={c.slug}>
                      <Link
                        to="/category/$slug"
                        params={{ slug: c.slug }}
                        className={linkClass}
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>
            </div>

            <div className="lg:col-span-2">
              <FooterColumn title="Company">
                <ul className="flex flex-col gap-1 sm:gap-2">
                  <li>
                    <Link to="/about" className={linkClass}>
                      About
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className={linkClass}>
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link to="/calculators" className={linkClass}>
                      All calculators
                    </Link>
                  </li>
                </ul>
              </FooterColumn>
            </div>

            <div className="col-span-2 sm:col-span-1 lg:col-span-2">
              <FooterColumn title="Legal">
                <ul className="flex flex-col gap-1 sm:gap-2 sm:flex-row sm:flex-wrap lg:flex-col">
                  <li>
                    <Link to="/privacy" className={linkClass}>
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className={linkClass}>
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link to="/disclaimer" className={linkClass}>
                      Disclaimer
                    </Link>
                  </li>
                </ul>
              </FooterColumn>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/50">
        <div className="page-container py-4 sm:py-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground/75 tabular-nums">
            © {year} CalcVerse
          </p>
          <p className="text-xs text-muted-foreground/75 leading-relaxed sm:text-right max-w-md">
            For informational use only—not professional advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
