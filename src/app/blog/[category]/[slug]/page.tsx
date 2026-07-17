import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchBlogBySlug, fetchPublishedBlogs } from "@/lib/blog-api";
import { parseBlogContent } from "@/utils/blog-parser";
import BlogDetailClient from "./BlogDetailClient";

export const revalidate = 60; // ISR revalidate every 60 seconds

interface RouteParams {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  let blog = null;

  try {
    const res = await fetchBlogBySlug(slug);
    if (res.ok && res.data) {
      blog = res.data;
    }
  } catch (err) {
    console.warn("Failed to fetch blog meta during generateMetadata:", err);
  }

  if (!blog) {
    return {
      title: "Article Not Found | CalcZen",
    };
  }

  const title = blog.metaTitle || `${blog.title} | CalcZen Blog`;
  const desc = blog.metaDescription || blog.excerpt;
  const canonical = blog.canonical || `https://calczen.in/blog/${blog.category.toLowerCase()}/${blog.slug}`;
  const ogImage = blog.thumbnail || "https://calczen.in/icons/android-chrome-512x512.png";

  return {
    title,
    description: desc,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        "max-image-preview": "large",
      },
    },
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: desc,
      url: canonical,
      type: "article",
      images: [
        {
          url: ogImage,
          alt: blog.title,
        },
      ],
      siteName: "CalcZen",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [ogImage],
    },
  };
}

export default async function BlogDetailPage({ params }: RouteParams) {
  const { slug } = await params;
  let blog = null;

  try {
    const res = await fetchBlogBySlug(slug);
    if (res.ok && res.data) {
      blog = res.data;
    }
  } catch (err) {
    console.error("Failed to load blog detail on server:", err);
  }

  if (!blog) {
    notFound();
  }

  // Fetch related blogs in same category on the server
  let relatedBlogs: any[] = [];
  try {
    const relRes = await fetchPublishedBlogs({
      category: blog.category,
      page: 1,
      limit: 3,
    });
    if (relRes.ok && relRes.data) {
      relatedBlogs = relRes.data.blogs.filter((b) => b._id !== blog!._id).slice(0, 2);
    }
  } catch (err) {
    console.warn("Failed to fetch related blogs on server:", err);
  }

  // Parse CTA blocks and inject keyword calculators on the server
  const renderedContent = parseBlogContent(blog.content, blog.toc || []);

  const siteUrl = "https://calczen.in";
  const canonical = blog.canonical || `${siteUrl}/blog/${blog.category.toLowerCase()}/${blog.slug}`;
  const keys = blog.keywords && blog.keywords.length > 0 ? blog.keywords.join(", ") : blog.tags.join(", ");

  // Structured schemas
  const schemas: any[] = [];
  
  if (blog.jsonld) {
    const graph = Array.isArray(blog.jsonld) ? blog.jsonld : [blog.jsonld];
    schemas.push(...graph);
  } else {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: blog.title,
      image: blog.thumbnail || "",
      genre: blog.category,
      keywords: keys,
      publisher: {
        "@type": "Organization",
        name: "CalcZen",
        logo: { "@type": "ImageObject", url: `${siteUrl}/brand-logo.png` },
      },
      url: canonical,
      datePublished: blog.publishDate || blog.createdAt,
      dateModified: blog.updatedAt,
      author: { "@type": "Person", name: blog.author },
      description: blog.excerpt || blog.metaDescription,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonical,
      },
    });

    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      name: blog.metaTitle || `${blog.title} | CalcZen`,
      description: blog.metaDescription || blog.excerpt,
      url: canonical,
    });

    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
        { "@type": "ListItem", position: 3, name: blog.category, item: `${siteUrl}/blog?category=${blog.category.toLowerCase()}` },
        { "@type": "ListItem", position: 4, name: blog.title, item: canonical },
      ],
    });
  }

  // Preloading LCP Featured Image: React 19 hoists link tags rendered inside components to <head> automatically!
  return (
    <>
      {blog.thumbnail && (
        <link
          rel="preload"
          as="image"
          href={blog.thumbnail}
          imageSrcSet={`${blog.thumbnail} 1200w, ${blog.thumbnail}?w=800 800w, ${blog.thumbnail}?w=400 400w`}
          imageSizes="(max-width: 768px) 100vw, 800px"
          // @ts-ignore
          fetchpriority="high"
        />
      )}
      {schemas.map((s, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <BlogDetailClient
        blog={blog}
        relatedBlogs={relatedBlogs}
        renderedContent={renderedContent}
      />
    </>
  );
}
