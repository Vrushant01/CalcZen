import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { fetchBlogBySlug } from "@/lib/blog-api";

// This route acts as a legacy redirect to the new canonical structure: /blog/$category/$slug
export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const res = await fetchBlogBySlug(params.slug);
    if (!res.ok || !res.data) {
      throw notFound();
    }

    const blog = res.data;
    const category = (blog.category || "finance").toLowerCase();

    // Trigger immediate, clean router redirect to the correct category route
    throw redirect({
      to: "/blog/$category/$slug",
      params: {
        category,
        slug: blog.slug,
      },
      replace: true,
    });
  },
  component: () => null,
});
