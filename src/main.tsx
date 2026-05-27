import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles.css";

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

function AppBoot() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reveal = () => window.setTimeout(() => setReady(true), 460);
    if (document.readyState === "complete") {
      reveal();
    } else {
      window.addEventListener("load", reveal, { once: true });
    }
    const fallback = window.setTimeout(() => setReady(true), 1700);

    return () => {
      window.removeEventListener("load", reveal);
      window.clearTimeout(fallback);
    };
  }, []);

  if (!ready) {
    return (
      <div className="app-loader" role="status" aria-live="polite" aria-label="Loading CalcZen">
        <img src="/brand/calczen-logo.png" alt="CalcZen" className="app-loader-logo" />
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

createRoot(rootEl).render(
  <StrictMode>
    <AppBoot />
  </StrictMode>,
);
