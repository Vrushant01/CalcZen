import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Inbox, LayoutDashboard, LogOut, Mail, FileText, Menu, X } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { clearToken } from "../services/api";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/blogs", label: "Blogs", icon: FileText },
  { to: "/support", label: "Support", icon: Inbox },
  { to: "/newsletter", label: "Newsletter", icon: Mail },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function logout() {
    clearToken();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--color-background)]">
      {/* Sidebar / Topbar container */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--color-card-border)] bg-[var(--color-card)] p-4 md:min-h-screen shrink-0 transition-all duration-300">
        <div className="flex items-center justify-between md:block md:mb-8">
          <div>
            <Link to="/dashboard" className="inline-flex items-center gap-2" onClick={() => setMenuOpen(false)}>
              <BrandLogo imageClassName="h-8 w-8 object-contain" labelClassName="text-xl font-bold tracking-tight" />
            </Link>
            <p className="text-xs text-[var(--color-muted)] mt-1">Admin Panel</p>
          </div>
          
          {/* Hamburger toggle button on mobile */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-[var(--color-muted)] hover:text-white rounded-lg hover:bg-white/5 transition-colors focus:outline-none touch-target"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Collapsible/Slideable Navigation block on mobile */}
        <div
          className={`mt-4 md:mt-0 transition-all duration-300 overflow-hidden md:max-h-none ${
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 md:opacity-100"
          }`}
        >
          <nav className="flex flex-col gap-1.5 py-2 md:py-0">
            {nav.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--color-primary)] text-white"
                      : "text-[var(--color-muted)] hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
          
          <button
            type="button"
            onClick={logout}
            className="mt-4 md:mt-8 flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-[var(--color-muted)] hover:text-white hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors w-full text-left"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8 overflow-auto w-full max-w-full">
        <Outlet />
      </main>
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--color-muted)]">{label}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: accent ?? "rgba(99,102,241,0.2)" }}
        >
          <Icon size={22} className="text-[var(--color-primary-hover)]" />
        </div>
      </div>
    </div>
  );
}

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      {description && <p className="text-sm text-[var(--color-muted)] mt-1">{description}</p>}
    </div>
  );
}
