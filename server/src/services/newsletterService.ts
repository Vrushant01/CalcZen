import { getSupabase } from "../config/supabase.js";
import type { ApiNewsletter, NewsletterRow } from "../types/database.js";
import { toApiNewsletter } from "../utils/serializers.js";

export async function createNewsletterRecord(input: {
  subject: string;
  htmlContent: string;
  recipientCount: number;
  sentBy: string;
}): Promise<ApiNewsletter> {
  const { data, error } = await getSupabase()
    .from("newsletters")
    .insert({
      subject: input.subject,
      html_content: input.htmlContent,
      recipient_count: input.recipientCount,
      sent_by: input.sentBy,
      sent_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) throw error;
  return toApiNewsletter(data as NewsletterRow);
}

export async function listNewsletterHistory(limit = 50): Promise<ApiNewsletter[]> {
  const { data, error } = await getSupabase()
    .from("newsletters")
    .select("*")
    .order("sent_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  const rows = data as NewsletterRow[];
  const adminIds = [...new Set(rows.map((r) => r.sent_by).filter(Boolean))] as string[];

  let adminMap = new Map<string, { email: string; name: string | null }>();
  if (adminIds.length > 0) {
    const { data: admins } = await getSupabase()
      .from("admins")
      .select("id, email, name")
      .in("id", adminIds);
    if (admins) {
      for (const a of admins as { id: string; email: string; name: string | null }[]) {
        adminMap.set(a.id, { email: a.email, name: a.name });
      }
    }
  }

  return rows.map((row) =>
    toApiNewsletter({
      ...row,
      admins: row.sent_by ? adminMap.get(row.sent_by) ?? null : null,
    }),
  );
}
