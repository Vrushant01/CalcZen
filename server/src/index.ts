import { assertProductionEnv, env, hasDbConfig, hasEmailConfig } from "./config/env.js";
import { getCorsPolicySummary } from "./config/cors.js";
import { createApp } from "./app.js";

async function main() {
  assertProductionEnv();

  if (!hasDbConfig()) {
    console.warn("SUPABASE_URL / key not set — database operations will fail.");
  }

  const app = await createApp();

  // Route Auditor: Recursively logs all registered express endpoints on boot
  try {
    console.log("\n=== REGISTERED BACKEND ROUTE TREE ===");
    const logStack = (stack: any[], parent = "") => {
      stack.forEach((r) => {
        if (r.route) {
          const methods = Object.keys(r.route.methods).map(m => m.toUpperCase()).join(", ");
          console.log(`[ROUTE] [${methods}] ${parent}${r.route.path}`);
        } else if (r.name === "router" && r.handle && r.handle.stack) {
          let mountPath = "";
          if (r.regexp) {
            const match = r.regexp.toString().match(/^\/\^\\(\/\w+)/);
            if (match && match[1]) mountPath = match[1];
          }
          logStack(r.handle.stack, parent + mountPath);
        }
      });
    };
    logStack(app._router.stack);
    console.log("=====================================\n");
  } catch (err) {
    console.warn("Failed to audit express route tree on boot:", err);
  }

  const host = process.env.RENDER || process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";
  const trustProxy = app.get("trust proxy");

  app.listen(env.port, host, () => {
    console.log(`Server running on http://${host}:${env.port}`);
    console.log(`Trust proxy: ${trustProxy === 1 || trustProxy === true ? "enabled (1)" : "disabled"}`);
    console.log(`CORS policy: ${getCorsPolicySummary()}`);
    console.log(`Admin panel: http://localhost:${env.port}/admin`);
    console.log(`API: http://localhost:${env.port}/api`);
    console.log(hasDbConfig() ? "Database: Supabase PostgreSQL" : "Database: NOT configured");
    console.log(
      hasEmailConfig()
        ? `Email: Resend (${env.emailFrom})`
        : "Email: NOT configured — set RESEND_API_KEY",
    );
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
