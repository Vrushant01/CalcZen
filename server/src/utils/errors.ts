import { env } from "../config/env.js";

type SupabaseError = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

export function formatDbError(err: unknown): { status: number; message: string } {
  const e = err as SupabaseError;

  if (e?.code === "PGRST205" || e?.message?.includes("Could not find the table")) {
    return {
      status: 503,
      message:
        "Database tables are not set up. Run server/supabase/schema.sql in your Supabase SQL Editor.",
    };
  }

  if (e?.code === "23505") {
    return { status: 409, message: "This email is already subscribed." };
  }

  if (env.nodeEnv === "development" && e?.message) {
    return { status: 500, message: e.message };
  }

  return { status: 500, message: "Internal server error" };
}
