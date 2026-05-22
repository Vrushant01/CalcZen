import { getSupabase } from "../config/supabase.js";
import type { AdminRow, ApiAdmin } from "../types/database.js";
import { toApiAdmin } from "../utils/serializers.js";

export async function findAdminByEmail(email: string): Promise<ApiAdmin | null> {
  const { data, error } = await getSupabase()
    .from("admins")
    .select("*")
    .eq("email", email.toLowerCase().trim())
    .maybeSingle();

  if (error) throw error;
  return data ? toApiAdmin(data as AdminRow) : null;
}

export async function findAdminById(id: string): Promise<ApiAdmin | null> {
  const { data, error } = await getSupabase()
    .from("admins")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? toApiAdmin(data as AdminRow) : null;
}

export async function createAdmin(input: {
  email: string;
  passwordHash: string;
  name?: string;
}): Promise<ApiAdmin> {
  const { data, error } = await getSupabase()
    .from("admins")
    .insert({
      email: input.email.toLowerCase().trim(),
      password_hash: input.passwordHash,
      name: input.name ?? "Admin",
    })
    .select("*")
    .single();

  if (error) throw error;
  return toApiAdmin(data as AdminRow);
}

export async function adminExists(email: string): Promise<boolean> {
  const admin = await findAdminByEmail(email);
  return admin !== null;
}
