import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AdminLayout } from "@/components/AdminLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardPage } from "@/pages/Dashboard";
import { LoginPage } from "@/pages/Login";
import { NewsletterPage } from "@/pages/Newsletter";
import { SupportPage } from "@/pages/Support";
import { BlogListPage } from "@/pages/BlogList";
import { BlogEditorPage } from "@/pages/BlogEditor";

export default function App() {
  return (
    <BrowserRouter basename="/admin">
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
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

