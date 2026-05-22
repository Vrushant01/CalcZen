import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { api, getToken } from "@/services/api";

export function ProtectedRoute() {
  const [status, setStatus] = useState<"loading" | "ok" | "fail">("loading");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setStatus("fail");
      return;
    }
    api
      .me()
      .then(() => setStatus("ok"))
      .catch(() => setStatus("fail"));
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "fail") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
