import bcrypt from "bcryptjs";
import { env, hasDbConfig } from "../config/env.js";
import { verifySupabaseConnection } from "../config/supabase.js";
import { adminExists, createAdmin } from "../services/adminService.js";

async function seed() {
  if (!hasDbConfig()) {
    console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) in server/.env");
    process.exit(1);
  }

  if (!env.adminEmail || !env.adminPassword) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env");
    process.exit(1);
  }

  const connected = await verifySupabaseConnection();
  if (!connected) {
    console.error("Could not connect to Supabase. Check URL/key and run supabase/schema.sql first.");
    process.exit(1);
  }

  if (await adminExists(env.adminEmail)) {
    console.log("Admin already exists:", env.adminEmail);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(env.adminPassword, 12);
  await createAdmin({
    email: env.adminEmail,
    passwordHash,
    name: "Admin",
  });

  console.log("Admin created:", env.adminEmail);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
