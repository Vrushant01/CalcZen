import type {
  AdminRow,
  ApiAdmin,
  ApiNewsletter,
  ApiSubscriber,
  NewsletterRow,
  SubscriberRow,
} from "../types/database.js";

export function toApiSubscriber(row: SubscriberRow): ApiSubscriber {
  return {
    _id: row.id,
    email: row.email,
    subscribedAt: row.subscribed_at,
    source: row.source,
    status: row.status,
  };
}

export function toApiAdmin(row: AdminRow): ApiAdmin {
  return {
    _id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    name: row.name,
    createdAt: row.created_at,
  };
}

export function toApiNewsletter(
  row: NewsletterRow & { admins?: { email: string; name: string | null } | null },
): ApiNewsletter {
  return {
    _id: row.id,
    subject: row.subject,
    htmlContent: row.html_content,
    sentAt: row.sent_at,
    recipientCount: row.recipient_count,
    sentBy: row.sent_by,
    sentByAdmin: row.admins
      ? { email: row.admins.email, name: row.admins.name }
      : null,
  };
}
