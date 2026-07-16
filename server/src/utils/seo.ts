/**
 * Automated SEO, Google Discover, and AI Search Optimization Engine
 */

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface SeoOutput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonical: string;
  readingTime: number;
  discoverReady: boolean;
  ogImage: string | null;
  twitterImage: string | null;
  schema: string;
  jsonld: any;
  toc: TocItem[];
}

function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Parses HTML content to extract H2 and H3 tags, injects persistent anchor IDs,
 * and compiles a structured Table of Contents array.
 */
export function processContentAndGenerateToc(content: string): { processedContent: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  if (!content) return { processedContent: "", toc };

  let headingIndex = 0;
  // Match heading tags like <h2>Heading Text</h2> or <h2 class="...">Heading Text</h2>
  const processedContent = content.replace(/<(h[23])([^>]*)>(.*?)<\/\1>/gi, (match, tag, attrs, text) => {
    const cleanText = stripHtml(text);
    const id = `heading-${headingIndex++}`;
    const level = tag.toLowerCase() === "h2" ? 2 : 3;
    toc.push({ id, text: cleanText, level });

    // Check if ID attribute already exists in original tag
    if (/id\s*=/i.test(attrs)) {
      return match;
    }
    // Inject the new ID attribute
    const space = attrs.trim() ? " " : "";
    return `<${tag}${attrs}${space}id="${id}">${text}</${tag}>`;
  });

  return { processedContent, toc };
}

/**
 * Main SEO Engine that runs automatically when a blog post is created or updated.
 */
export function generateSeoData(input: {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  thumbnail?: string | null;
  category: string;
  tags?: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string[];
  author: string;
  faqs?: { question: string; answer: string }[];
  publishDate?: string | null;
}): SeoOutput {
  const title = input.title.trim();
  
  // 1. Auto-slug generation
  let slug = (input.slug || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  
  if (!slug) {
    slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  // 2. Process content and table of contents
  const { processedContent, toc } = processContentAndGenerateToc(input.content || "");

  // 3. Excerpt auto-generation
  const plainText = stripHtml(processedContent);
  let excerpt = (input.excerpt || "").trim();
  if (!excerpt && plainText) {
    excerpt = plainText.substring(0, 155).trim();
    if (plainText.length > 155) excerpt += "...";
  }

  // 4. Meta configurations
  const metaTitle = (input.metaTitle || `${title} | CalcZen`).trim();
  
  let metaDescription = (input.metaDescription || "").trim();
  if (!metaDescription) {
    metaDescription = excerpt.substring(0, 155);
    if (excerpt.length > 155 && !metaDescription.endsWith("...")) {
      metaDescription += "...";
    }
  }

  const category = input.category || "Finance";
  const tags = input.tags || [];
  
  let keywords = input.keywords || [];
  if (keywords.length === 0) {
    keywords = [category, ...tags];
  }

  // 5. Canonical link (canonical URL structure: /blog/category/post-name)
  const siteUrl = "https://calczen.in";
  const canonical = `${siteUrl}/blog/${category.toLowerCase()}/${slug}`;

  // 6. Word count and reading time (200 words per min)
  const words = plainText.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  // 7. Google Discover Score & Compliance Check
  const h2Count = toc.filter(t => t.level === 2).length;
  const faqsCount = input.faqs?.length || 0;
  const hasCoverImage = Boolean(input.thumbnail && input.thumbnail.trim());
  
  // Eligible for discover if word count >= 500, has >= 2 H2 sections, >= 3 FAQs, and has cover image
  const discoverReady = words >= 500 && h2Count >= 2 && faqsCount >= 3 && hasCoverImage;

  // 8. Open Graph & Social images
  const ogImage = input.thumbnail || null;
  const twitterImage = input.thumbnail || null;

  // 9. Structured Data JSON-LD Graph Compiler
  const pubDate = input.publishDate || new Date().toISOString();
  const modDate = new Date().toISOString();
  const keysStr = keywords.join(", ");

  const graph = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${canonical}#blogposting`,
      "isPartOf": {
        "@type": "WebPage",
        "@id": canonical
      },
      "headline": title,
      "image": ogImage ? [ogImage] : [],
      "datePublished": pubDate,
      "dateModified": modDate,
      "author": {
        "@type": "Person",
        "name": input.author || "CalcZen Team",
        "jobTitle": "Technical SEO Architect",
        "worksFor": {
          "@type": "Organization",
          "name": "CalcZen",
          "url": siteUrl
        }
      },
      "publisher": {
        "@type": "Organization",
        "name": "CalcZen",
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/logo.png`
        }
      },
      "description": excerpt,
      "inLanguage": "en-US",
      "mainEntityOfPage": canonical,
      "keywords": keysStr,
      "articleSection": category
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": canonical,
      "url": canonical,
      "name": metaTitle,
      "description": metaDescription,
      "isPartOf": {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`
      },
      "breadcrumb": {
        "@id": `${canonical}#breadcrumb`
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${canonical}#breadcrumb`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": siteUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": `${siteUrl}/blog`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": category,
          "item": `${siteUrl}/blog/${category.toLowerCase()}`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": title,
          "item": canonical
        }
      ]
    }
  ] as any[];

  // FAQ Page Schema
  if (input.faqs && input.faqs.length > 0) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${canonical}#faq`,
      "mainEntity": input.faqs.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer
        }
      }))
    });
  }

  // Speakable schema referencing title and meta description
  graph[0].speakable = {
    "@type": "SpeakableSpecification",
    "xpath": [
      "/html/head/title",
      "/html/head/meta[@name='description']/@content"
    ]
  };

  // Video Object if a video URL is detected (youtube / vimeo iframe or links)
  const videoRegex = /(?:youtube\.com\/embed\/|youtu\.be\/|vimeo\.com\/|vimeo\.com\/video\/)([a-zA-Z0-9_-]+)/i;
  const videoMatch = processedContent.match(videoRegex);
  if (videoMatch) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": title,
      "description": excerpt,
      "thumbnailUrl": ogImage ? [ogImage] : [],
      "uploadDate": pubDate,
      "embedUrl": `https://www.youtube.com/embed/${videoMatch[1]}`
    });
  }

  // HowTo Schema if article contains steps, H3 headings, or explicit steps
  const isTutorial = title.toLowerCase().includes("how to") || title.toLowerCase().includes("guide") || toc.length >= 4;
  if (isTutorial && toc.length > 0) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": title,
      "description": excerpt,
      "step": toc.map((t, idx) => ({
        "@type": "HowToStep",
        "position": idx + 1,
        "url": `${canonical}#${t.id}`,
        "name": t.text,
        "itemListElement": [{
          "@type": "HowToDirection",
          "text": `Learn how to calculate or understand ${t.text} details.`
        }]
      }))
    });
  }

  const jsonld = graph;
  const schema = JSON.stringify(jsonld);

  return {
    title,
    slug,
    excerpt,
    content: processedContent,
    metaTitle,
    metaDescription,
    keywords,
    canonical,
    readingTime,
    discoverReady,
    ogImage,
    twitterImage,
    schema,
    jsonld,
    toc
  };
}
