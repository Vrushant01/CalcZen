import { assertProductionEnv, env, hasDbConfig, hasEmailConfig } from "./config/env.js";
import { getCorsPolicySummary } from "./config/cors.js";
import { createApp } from "./app.js";

async function main() {
  assertProductionEnv();

  if (!hasDbConfig()) {
    console.warn("SUPABASE_URL / key not set — database operations will fail.");
  }

  const app = await createApp();

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
