import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, hasDbConfig } from "./env.js";

let client: SupabaseClient | null = null;

/** Server-side Supabase client (service role or anon key from env) */
export function getSupabase(): SupabaseClient {
  if (!hasDbConfig()) {
    throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  if (!client) {
    client = createClient(env.supabaseUrl, env.supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return client;
}

/** Verify connection with a lightweight query */
export async function verifySupabaseConnection(): Promise<boolean> {
  if (!hasDbConfig()) return false;
  try {
    const { error } = await getSupabase().from("subscribers").select("id", { count: "exact", head: true });
    return !error;
  } catch {
    return false;
  }
}
