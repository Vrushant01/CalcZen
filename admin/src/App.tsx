import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AdminLayout } from "./components/AdminLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardPage } from "./pages/Dashboard";
import { LoginPage } from "./pages/Login";
import { NewsletterPage } from "./pages/Newsletter";
import { SupportPage } from "./pages/Support";
import { BlogListPage } from "./pages/BlogList";
import { BlogEditorPage } from "./pages/BlogEditor";
import "./styles.css";

export default function App() {
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";
  const isSubdomain = hostname === "admin.calczen.in" || hostname.startsWith("admin.");
  const useAdminParam = typeof window !== "undefined" && window.location.search.includes("admin=true");
  const hasAdminInPath = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
  
  // In production on the subdomain (or local dev with ?admin=true without /admin path), use no basename.
  // If we are on calczen.in/admin or testing via localhost with /admin prefix, use "/admin".
  const basename = (isSubdomain && !hasAdminInPath && !useAdminParam) ? undefined : "/admin";

  return (
    <div className="admin-theme">
      <BrowserRouter basename={basename}>
        <Toaster richColors position="top-right" theme="dark" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/blogs" element={<BlogListPage />} />
              <Route path="/blogs/new" element={<BlogEditorPage />} />
              <Route path="/blogs/edit/:id" element={<BlogEditorPage />} />
              <Route path="/newsletter" element={<NewsletterPage />} />
              <Route path="/support" element={<SupportPage />} />
            </Route>
            {/* Fallbacks are nested inside ProtectedRoute to guarantee authentication gating */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

