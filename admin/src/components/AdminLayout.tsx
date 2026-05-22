import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Mail, Users } from "lucide-react";
import { clearToken } from "@/services/api";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/newsletter", label: "Newsletter", icon: Mail },
];

export function AdminLayout() {
  const navigate = useNavigate();

  function logout() {
    clearToken();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--color-card-border)] bg-[var(--color-card)] p-4 md:min-h-screen shrink-0">
        <div className="mb-8">
          <Link to="/dashboard" className="text-xl font-bold text-white">
            CalcZen
          </Link>
          <p className="text-xs text-[var(--color-muted)] mt-1">Admin Panel</p>
        </div>
        <nav className="flex md:flex-col gap-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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
          className="mt-6 flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-muted)] hover:text-white transition-colors w-full"
        >
          <LogOut size={18} />
          Log out
        </button>
      </aside>
      <main className="flex-1 p-4 md:p-8 overflow-auto">
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
