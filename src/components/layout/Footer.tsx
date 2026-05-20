import { Link } from "@tanstack/react-router";
import { Calculator } from "lucide-react";
import { categories } from "@/data/calculators";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40 mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-accent">
              <Calculator className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">CalcVerse</span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            Smart online calculators for finance, health, business and everyday life.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Categories</h4>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to="/category/$slug" params={{ slug: c.slug }} className="text-muted-foreground hover:text-foreground">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
            <li><Link to="/calculators" className="text-muted-foreground hover:text-foreground">All Calculators</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link></li>
            <li><Link to="/disclaimer" className="text-muted-foreground hover:text-foreground">Disclaimer</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} CalcVerse. All rights reserved.</p>
          <p>Built for accuracy. Always consult a professional for financial or health decisions.</p>
        </div>
      </div>
    </footer>
  );
}
