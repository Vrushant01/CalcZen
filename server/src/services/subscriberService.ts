import { getSupabase } from "../config/supabase.js";
import type { ApiSubscriber, SubscriberRow, SubscriberStatus } from "../types/database.js";
import { toApiSubscriber } from "../utils/serializers.js";

function isUniqueViolation(error: { code?: string }): boolean {
  return error.code === "23505";
}

export async function findSubscriberByEmail(email: string): Promise<SubscriberRow | null> {
  const { data, error } = await getSupabase()
    .from("subscribers")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;
  return data as SubscriberRow | null;
}

export async function createSubscriber(input: {
  email: string;
  source?: string;
  status?: SubscriberStatus;
}): Promise<ApiSubscriber> {
  const { data, error } = await getSupabase()
    .from("subscribers")
    .insert({
      email: input.email,
      source: input.source ?? "website",
      status: input.status ?? "active",
      subscribed_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) {
    if (isUniqueViolation(error)) {
      const err = new Error("DUPLICATE_EMAIL") as Error & { code: string };
      err.code = "DUPLICATE_EMAIL";
      throw err;
    }
    throw error;
  }

  return toApiSubscriber(data as SubscriberRow);
}

export async function reactivateSubscriber(id: string): Promise<ApiSubscriber> {
  const { data, error } = await getSupabase()
    .from("subscribers")
    .update({
      status: "active",
      subscribed_at: new Date().toISOString(),
      source: "website",
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return toApiSubscriber(data as SubscriberRow);
}

export async function getSubscriberStats(): Promise<{
  total: number;
  active: number;
  unsubscribed: number;
  recentLast30Days: number;
  recentLast7Days: number;
}> {
  const supabase = getSupabase();
  const now = new Date();
  const d30 = new Date(now);
  d30.setDate(d30.getDate() - 30);
  const d7 = new Date(now);
  d7.setDate(d7.getDate() - 7);

  const [totalRes, activeRes, unsubRes, recent30Res, recent7Res] = await Promise.all([
    supabase.from("subscribers").select("*", { count: "exact", head: true }),
    supabase.from("subscribers").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("subscribers").select("*", { count: "exact", head: true }).eq("status", "unsubscribed"),
    supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")
      .gte("subscribed_at", d30.toISOString()),
    supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")
      .gte("subscribed_at", d7.toISOString()),
  ]);

  for (const res of [totalRes, activeRes, unsubRes, recent30Res, recent7Res]) {
    if (res.error) throw res.error;
  }

  return {
    total: totalRes.count ?? 0,
    active: activeRes.count ?? 0,
    unsubscribed: unsubRes.count ?? 0,
    recentLast30Days: recent30Res.count ?? 0,
    recentLast7Days: recent7Res.count ?? 0,
  };
}

export async function getRecentSubscribers(limit = 8): Promise<ApiSubscriber[]> {
  const { data, error } = await getSupabase()
    .from("subscribers")
    .select("*")
    .eq("status", "active")
    .order("subscribed_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as SubscriberRow[]).map(toApiSubscriber);
}

export async function listSubscribers(options: {
  search?: string;
  status?: SubscriberStatus;
  page: number;
  limit: number;
}): Promise<{ subscribers: ApiSubscriber[]; total: number }> {
  const { search, status, page, limit } = options;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = getSupabase()
    .from("subscribers")
    .select("*", { count: "exact" })
    .order("subscribed_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }
  if (search) {
    query = query.ilike("email", `%${search}%`);
  }

  const { data, error, count } = await query.range(from, to);
  if (error) throw error;

  return {
    subscribers: (data as SubscriberRow[]).map(toApiSubscriber),
    total: count ?? 0,
  };
}

export async function deleteSubscriberById(id: string): Promise<boolean> {
  const { error, count } = await getSupabase()
    .from("subscribers")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) throw error;
  return (count ?? 0) > 0;
}

export async function getAllSubscribersForExport(): Promise<ApiSubscriber[]> {
  const { data, error } = await getSupabase()
    .from("subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false });

  if (error) throw error;
  return (data as SubscriberRow[]).map(toApiSubscriber);
}

export async function getActiveSubscriberEmails(): Promise<string[]> {
  const { data, error } = await getSupabase()
    .from("subscribers")
    .select("email")
    .eq("status", "active");

  if (error) throw error;
  return (data as { email: string }[]).map((r) => r.email);
}
