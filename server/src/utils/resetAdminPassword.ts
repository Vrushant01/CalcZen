import bcrypt from "bcryptjs";
import { env, hasDbConfig } from "../config/env.js";
import { getSupabase } from "../config/supabase.js";

/**
 * Reset an existing admin password (or create if missing).
 * Usage from project root:
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=new-secret npm run admin:reset-password --prefix server
 */
async function main() {
  if (!hasDbConfig()) {
    console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env");
    process.exit(1);
  }

  if (!env.adminEmail || !env.adminPassword) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env (or env vars)");
    process.exit(1);
  }

  const email = env.adminEmail.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(env.adminPassword, 12);
  const supabase = getSupabase();

  const { data: existing } = await supabase.from("admins").select("id").eq("email", email).maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("admins")
      .update({ password_hash: passwordHash })
      .eq("email", email);

    if (error) {
      console.error(error);
      process.exit(1);
    }
    console.log("Password updated for:", email);
  } else {
    const { error } = await supabase.from("admins").insert({
      email,
      password_hash: passwordHash,
      name: "Admin",
    });

    if (error) {
      console.error(error);
      process.exit(1);
    }
    console.log("Admin created:", email);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
