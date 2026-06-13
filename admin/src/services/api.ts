import { apiFetch, getApiBaseUrl, getNetworkErrorMessage } from "../lib/api-config";

export function getToken(): string | null {
  return localStorage.getItem("admin_token");
}

export function setToken(token: string): void {
  localStorage.setItem("admin_token", token);
}

export function clearToken(): void {
  localStorage.removeItem("admin_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<{ success: boolean; message?: string; data?: T }> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await apiFetch(path, { ...options, headers });
  } catch (err) {
    throw new Error(getNetworkErrorMessage(err));
  }

  const json = (await res.json().catch(() => ({
    success: false,
    message: "Invalid response from server",
  }))) as { success?: boolean; message?: string; data?: T };

  // Check BOTH HTTP status and payload response.success for authentication failure
  const isUnauthenticated = 
    res.status === 401 || 
    (json.success === false && (
      json.message?.toLowerCase().includes("auth") ||
      json.message?.toLowerCase().includes("token") ||
      json.message?.toLowerCase().includes("unauthorized")
    ));

  if (isUnauthenticated) {
    clearToken();
    if (typeof window !== "undefined") {
      const isLoginPath = window.location.pathname.endsWith("/login");
      if (!isLoginPath) {
        // Enforce hard redirect to login page
        window.location.href = "/login";
        throw new Error(json.message ?? "Authentication required");
      }
    }
  }

  if (!res.ok || json.success === false) {
    throw new Error(json.message ?? `Request failed (${res.status})`);
  }

  return {
    success: json.success ?? true,
    message: json.message,
    data: json.data,
  };
}

export type AdminStats = {
  total: number;
  active: number;
  unsubscribed: number;
  recentLast30Days: number;
  recentLast7Days: number;
};

export type ContactMessage = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  adminReply: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BlogStats = {
  total: number;
  published: number;
  drafts: number;
  views: number;
};

export type Blog = {
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
  faqs: { question: string; answer: string }[];
  featured: boolean;
  published: boolean;
  views: number;
  readingTime: number;
  publishDate: string | null;
  createdAt: string;
  updatedAt: string;
};


export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; admin: { id: string; email: string; name?: string } }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) },
    ),

  me: () => request<{ id: string; email: string; name?: string }>("/api/auth/me"),

  stats: () => request<AdminStats>("/api/admin/stats"),

  recentSubscribers: () =>
    request<
      Array<{
        _id: string;
        email: string;
        subscribedAt: string;
        source: string;
        status: string;
      }>
    >("/api/admin/subscribers/recent"),

  subscribers: (params?: {
    search?: string;
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const q = new URLSearchParams();
    if (params?.search) q.set("search", params.search);
    if (params?.page) q.set("page", String(params.page));
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.status) q.set("status", params.status);
    const query = q.toString() ? `?${q}` : "";
    return request<{
      subscribers: Array<{
        _id: string;
        email: string;
        subscribedAt: string;
        source: string;
        status: string;
      }>;
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/api/admin/subscribers${query}`);
  },

  deleteSubscriber: (id: string) =>
    request(`/api/admin/subscribers/${id}`, { method: "DELETE" }),

  exportCsv: async () => {
    const token = getToken();
    let res: Response;
    try {
      res = await apiFetch("/api/admin/subscribers/export/csv", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (err) {
      throw new Error(getNetworkErrorMessage(err));
    }
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { message?: string };
      throw new Error(err.message ?? `Export failed (${res.status})`);
    }
    return res.blob();
  },

  sendNewsletter: (subject: string, htmlContent: string) =>
    request<{ sent: number; total: number; failed?: string[] }>("/api/newsletters/send", {
      method: "POST",
      body: JSON.stringify({ subject, htmlContent }),
    }),

  newsletterHistory: () =>
    request<
      Array<{
        _id: string;
        subject: string;
        sentAt: string;
        recipientCount: number;
      }>
    >("/api/newsletters/history"),

  contactMessages: (params?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const q = new URLSearchParams();
    if (params?.search) q.set("search", params.search);
    if (params?.status) q.set("status", params.status);
    if (params?.page) q.set("page", String(params.page));
    if (params?.limit) q.set("limit", String(params.limit));
    const query = q.toString() ? `?${q}` : "";
    return request<{
      messages: ContactMessage[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/api/admin/contact-messages${query}`);
  },

  contactMessage: (id: string) =>
    request<ContactMessage>(`/api/admin/contact-messages/${id}`),

  replyToMessage: (id: string, reply: string) =>
    request<ContactMessage>("/api/admin/reply-message", {
      method: "POST",
      body: JSON.stringify({ id, reply }),
    }),

  blogStats: () =>
    request<BlogStats>("/api/admin/blogs/stats"),

  blogs: (params?: {
    search?: string;
    category?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const q = new URLSearchParams();
    if (params?.search) q.set("search", params.search);
    if (params?.category) q.set("category", params.category);
    if (params?.status) q.set("status", params.status);
    if (params?.page) q.set("page", String(params.page));
    if (params?.limit) q.set("limit", String(params.limit));
    const query = q.toString() ? `?${q}` : "";
    return request<{
      blogs: Blog[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/api/admin/blogs${query}`);
  },

  blog: (id: string) =>
    request<Blog>(`/api/admin/blogs/${id}`),

  createBlog: (body: Partial<Blog>) =>
    request<Blog>("/api/admin/blogs", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateBlog: (id: string, body: Partial<Blog>) =>
    request<Blog>(`/api/admin/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteBlog: (id: string) =>
    request(`/api/admin/blogs/${id}`, { method: "DELETE" }),

  infrastructureStats: () =>
    request<any>("/api/admin/infrastructure/stats"),
};


/** Resolved API base (for debugging / display). */
export const apiBaseUrl = getApiBaseUrl;
