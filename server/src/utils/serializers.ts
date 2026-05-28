import type {
  AdminRow,
  ApiAdmin,
  ApiContactMessage,
  ApiNewsletter,
  ApiSubscriber,
  ContactMessageRow,
  NewsletterRow,
  SubscriberRow,
  BlogRow,
  ApiBlog,
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

export function toApiContactMessage(row: ContactMessageRow): ApiContactMessage {
  return {
    _id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    status: row.status,
    adminReply: row.admin_reply,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
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

export function toApiBlog(row: BlogRow): ApiBlog {
  return {
    _id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    thumbnail: row.thumbnail,
    category: row.category,
    tags: row.tags || [],
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    keywords: row.keywords || [],
    author: row.author,
    calculatorLinks: row.calculator_links,
    featured: row.featured,
    published: row.published,
    views: row.views,
    readingTime: row.reading_time,
    publishDate: row.publish_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

