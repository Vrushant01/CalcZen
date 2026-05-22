const API_BASE = import.meta.env.VITE_API_URL ?? "";

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

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const json = await res.json().catch(() => ({ success: false, message: "Invalid response" }));

  if (!res.ok) {
    throw new Error(json.message ?? `Request failed (${res.status})`);
  }

  return json;
}

export type AdminStats = {
  total: number;
  active: number;
  unsubscribed: number;
  recentLast30Days: number;
  recentLast7Days: number;
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
    const res = await fetch(`${API_BASE}/api/admin/subscribers/export/csv`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Export failed");
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
};
