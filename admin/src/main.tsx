import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

function AdminBoot() {
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
      <div className="admin-loader" role="status" aria-live="polite" aria-label="Loading CalcZen Admin">
        <img src="/brand/calczen-logo.png" alt="CalcZen" className="admin-loader-logo" />
      </div>
    );
  }

  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AdminBoot />
  </StrictMode>,
);
