/** Supabase row types (snake_case matches PostgreSQL columns) */

export type SubscriberStatus = "active" | "unsubscribed";

export type SubscriberRow = {
  id: string;
  email: string;
  subscribed_at: string;
  source: string;
  status: SubscriberStatus;
};

export type AdminRow = {
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
  created_at: string;
};

export type NewsletterRow = {
  id: string;
  subject: string;
  html_content: string;
  sent_at: string;
  recipient_count: number;
  sent_by: string | null;
};

/** API shape (backward compatible with previous MongoDB responses) */
export type ApiSubscriber = {
  _id: string;
  email: string;
  subscribedAt: string;
  source: string;
  status: SubscriberStatus;
};

export type ApiAdmin = {
  _id: string;
  email: string;
  passwordHash: string;
  name?: string | null;
  createdAt: string;
};

export type ApiNewsletter = {
  _id: string;
  subject: string;
  htmlContent: string;
  sentAt: string;
  recipientCount: number;
  sentBy: string | null;
  sentByAdmin?: { email: string; name: string | null } | null;
};

export type ContactMessageStatus = "unread" | "read" | "replied";

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  admin_reply: string | null;
  created_at: string;
  updated_at: string;
};

export type ApiContactMessage = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  adminReply: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BlogRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string | null;
  category: string;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
  keywords: string[];
  author: string;
  calculator_links: any; // JSONB
  featured: boolean;
  published: boolean;
  views: number;
  reading_time: number;
  publish_date: string | null;
  created_at: string;
  updated_at: string;
};

export type ApiBlog = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string | null;
  category: string;
  tags: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string[];
  author: string;
  calculatorLinks: any;
  featured: boolean;
  published: boolean;
  views: number;
  readingTime: number;
  publishDate: string | null;
  createdAt: string;
  updatedAt: string;
};

