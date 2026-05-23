import { getSupabase } from "../config/supabase.js";
import type {
  ApiContactMessage,
  ContactMessageRow,
  ContactMessageStatus,
} from "../types/database.js";
import { toApiContactMessage } from "../utils/serializers.js";

export async function createContactMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<ApiContactMessage> {
  const now = new Date().toISOString();
  const { data, error } = await getSupabase()
    .from("contact_messages")
    .insert({
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message,
      status: "unread",
      created_at: now,
      updated_at: now,
    })
    .select("*")
    .single();

  if (error) throw error;
  return toApiContactMessage(data as ContactMessageRow);
}

export async function listContactMessages(params: {
  search?: string;
  status?: ContactMessageStatus;
  page?: number;
  limit?: number;
}): Promise<{
  messages: ApiContactMessage[];
  pagination: { page: number; limit: number; total: number; pages: number };
}> {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(50, Math.max(1, params.limit ?? 20));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = getSupabase()
    .from("contact_messages")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (params.status) {
    query = query.eq("status", params.status);
  }

  if (params.search?.trim()) {
    const safe = params.search.trim().replace(/[%_,]/g, "");
    const pattern = `%${safe}%`;
    query = query.or(
      `name.ilike.${pattern},email.ilike.${pattern},subject.ilike.${pattern},message.ilike.${pattern}`,
    );
  }

  const { data, error, count } = await query.range(from, to);

  if (error) throw error;

  const total = count ?? 0;
  const rows = (data ?? []) as ContactMessageRow[];

  return {
    messages: rows.map(toApiContactMessage),
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export async function getContactMessageById(id: string): Promise<ApiContactMessage | null> {
  const { data, error } = await getSupabase()
    .from("contact_messages")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return toApiContactMessage(data as ContactMessageRow);
}

export async function markContactMessageRead(id: string): Promise<ApiContactMessage | null> {
  const existing = await getContactMessageById(id);
  if (!existing || existing.status !== "unread") {
    return existing;
  }

  const { data, error } = await getSupabase()
    .from("contact_messages")
    .update({
      status: "read",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return toApiContactMessage(data as ContactMessageRow);
}

export async function saveContactReply(
  id: string,
  adminReply: string,
): Promise<ApiContactMessage | null> {
  const { data, error } = await getSupabase()
    .from("contact_messages")
    .update({
      admin_reply: adminReply,
      status: "replied",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  if (!data) return null;
  return toApiContactMessage(data as ContactMessageRow);
}

export async function countUnreadContactMessages(): Promise<number> {
  const { count, error } = await getSupabase()
    .from("contact_messages")
    .select("*", { count: "exact", head: true })
    .eq("status", "unread");

  if (error) throw error;
  return count ?? 0;
}
