import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles.css";

const AdminApp = lazy(() => import("../admin/src/App"));

const router = getRouter();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Root element #root not found");
}

// Evaluate hostname and local development overrides on boot
const hostname = typeof window !== "undefined" ? window.location.hostname : "";
const isAdminHost =
  hostname === "admin.calczen.in" ||
  hostname.startsWith("admin.") ||
  (typeof window !== "undefined" && window.location.search.includes("admin=true"));

createRoot(rootEl).render(
  <StrictMode>
    {isAdminHost ? (
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
    ) : (
      <RouterProvider router={router} />
    )}
  </StrictMode>,
);
