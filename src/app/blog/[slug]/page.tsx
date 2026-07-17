import { redirect } from "next/navigation";
import { fetchBlogBySlug } from "@/lib/blog-api";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export default async function LegacyBlogRedirectPage({ params }: RouteParams) {
  const { slug } = await params;
  let blog = null;
  try {
    const res = await fetchBlogBySlug(slug);
    if (res.ok && res.data) {
      blog = res.data;
    }
  } catch {}

  if (!blog) {
    redirect("/blog");
  }

  const category = (blog.category || "finance").toLowerCase();
  redirect(`/blog/${category}/${blog.slug}`);
}
