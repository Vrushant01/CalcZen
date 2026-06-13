import { apiFetch, getNetworkErrorMessage } from "@/lib/api-config";

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

export type BlogsResponse = {
  blogs: Blog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

export async function fetchPublishedBlogs(params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ ok: true; data: BlogsResponse } | { ok: false; message: string }> {
  try {
    const q = new URLSearchParams();
    if (params?.category) q.set("category", params.category);
    if (params?.search) q.set("search", params.search);
    if (params?.page) q.set("page", String(params.page));
    if (params?.limit) q.set("limit", String(params.limit));
    const query = q.toString() ? `?${q}` : "";

    const res = await apiFetch(`/api/blogs${query}`);
    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      data?: BlogsResponse;
      message?: string;
    };

    if (res.ok && data.success && data.data) {
      return { ok: true, data: data.data };
    }

    return {
      ok: false,
      message: data.message ?? `Failed to fetch blogs (${res.status})`,
    };
  } catch (err) {
    return { ok: false, message: getNetworkErrorMessage(err) };
  }
}

export async function fetchBlogBySlug(
  slug: string,
): Promise<{ ok: true; data: Blog } | { ok: false; message: string }> {
  try {
    const res = await apiFetch(`/api/blogs/${slug}`);
    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      data?: Blog;
      message?: string;
    };

    if (res.ok && data.success && data.data) {
      return { ok: true, data: data.data };
    }

    return {
      ok: false,
      message: data.message ?? `Failed to load article (${res.status})`,
    };
  } catch (err) {
    return { ok: false, message: getNetworkErrorMessage(err) };
  }
}

export async function trackBlogView(id: string): Promise<void> {
  try {
    await apiFetch(`/api/blogs/${id}/view`, { method: "POST" });
  } catch (err) {
    console.warn("Failed to track view in background:", err);
  }
}
