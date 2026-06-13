import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Table,
  Link as LinkIcon,
  Image,
  Sparkles,
  Save,
  Globe,
  Eye,
  EyeOff,
  Settings,
  Calculator,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../components/AdminLayout";
import { api, type Blog } from "../services/api";

const CATEGORIES = [
  "Finance",
  "Health",
  "Mortgage",
  "Taxes",
  "Loans",
  "BMI",
  "Fitness",
  "Investment",
  "Business",
];

const CALCULATORS = [
  { slug: "mortgage-calculator", name: "Mortgage Calculator" },
  { slug: "compound-interest-calculator", name: "Compound Interest Calculator" },
  { slug: "loan-emi-calculator", name: "Loan EMI Calculator" },
  { slug: "bmi-calculator", name: "BMI Calculator" },
  { slug: "calorie-calculator", name: "Calorie Calculator" },
  { slug: "water-intake-calculator", name: "Water Intake Calculator" },
  { slug: "pregnancy-due-date-calculator", name: "Pregnancy Due Date Calculator" },
  { slug: "percentage-calculator", name: "Percentage Calculator" },
  { slug: "age-calculator", name: "Age Calculator" },
  { slug: "tip-calculator", name: "Tip Calculator" },
  { slug: "bmr-calculator", name: "BMR Calculator" },
];

export function BlogEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // Core fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [category, setCategory] = useState("Finance");
  const [tags, setTags] = useState("");
  const [author, setAuthor] = useState("CalcZen Team");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);
  
  // SEO fields
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);

  // Editor states
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autoSaveTime, setAutoSaveTime] = useState<string | null>(null);
  const [selectedCalc, setSelectedCalc] = useState(CALCULATORS[0].slug);

  const editorRef = useRef<HTMLDivElement>(null);

  // SEO Metrics State
  const [metrics, setMetrics] = useState({
    wordCount: 0,
    h2Count: 0,
    internalLinks: 0,
    externalLinks: 0,
  });

  // Calculate metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (!editorRef.current) return;
      
      const content = editorRef.current.innerHTML;
      const textContent = editorRef.current.innerText || "";
      const words = textContent.trim().split(/\s+/).filter(Boolean).length;
      
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      
      const h2Count = tempDiv.querySelectorAll("h2").length;
      
      const links = Array.from(tempDiv.querySelectorAll("a"));
      let internal = 0;
      let external = 0;
      links.forEach(link => {
        const href = link.getAttribute("href") || "";
        if (href.startsWith("/") || href.includes("calczen.com")) internal++;
        else if (href.startsWith("http")) external++;
      });
      
      setMetrics({ wordCount: words, h2Count, internalLinks: internal, externalLinks: external });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 1. Fetch Blog if Edit Mode
  useEffect(() => {
    if (!isEdit) {
      // Check for local storage auto-saved draft
      const savedDraft = localStorage.getItem("calczen_blog_draft_new");
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          if (confirm("Found an auto-saved unsaved draft in your browser. Would you like to restore it?")) {
            restoreDraft(parsed);
          } else {
            localStorage.removeItem("calczen_blog_draft_new");
          }
        } catch {}
      }
      return;
    }

    async function fetchBlog() {
      setLoading(true);
      try {
        const res = await api.blog(id!);
        if (res.data) {
          const blog = res.data;
          setTitle(blog.title);
          setSlug(blog.slug);
          setExcerpt(blog.excerpt);
          setThumbnail(blog.thumbnail || "");
          setCategory(blog.category);
          setTags(blog.tags?.join(", ") || "");
          setAuthor(blog.author || "CalcZen Team");
          setFeatured(blog.featured);
          setPublished(blog.published);
          setMetaTitle(blog.metaTitle || "");
          setMetaDescription(blog.metaDescription || "");
          setKeywords(blog.keywords?.join(", ") || "");
          setFaqs(blog.faqs || []);
          
          if (editorRef.current) {
            editorRef.current.innerHTML = blog.content;
          }

          // Check if local storage has a newer version
          const savedDraft = localStorage.getItem(`calczen_blog_draft_${id}`);
          if (savedDraft) {
            try {
              const parsed = JSON.parse(savedDraft);
              if (new Date(parsed.updatedAt) > new Date(blog.updatedAt)) {
                if (confirm("Your browser has a newer auto-saved version of this article. Restoring is recommended. Restore now?")) {
                  restoreDraft(parsed);
                }
              }
            } catch {}
          }
        }
      } catch (err) {
        toast.error("Failed to load article details");
        navigate("/blogs");
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [id, isEdit, navigate]);

  function restoreDraft(draft: any) {
    setTitle(draft.title || "");
    setSlug(draft.slug || "");
    setExcerpt(draft.excerpt || "");
    setThumbnail(draft.thumbnail || "");
    setCategory(draft.category || "Finance");
    setTags(draft.tags || "");
    setAuthor(draft.author || "CalcZen Team");
    setFeatured(draft.featured || false);
    setPublished(draft.published || false);
    setMetaTitle(draft.metaTitle || "");
    setMetaDescription(draft.metaDescription || "");
    setKeywords(draft.keywords || "");
    setFaqs(draft.faqs || []);
    if (editorRef.current) {
      editorRef.current.innerHTML = draft.content || "";
    }
    toast.success("Draft restored from browser storage");
  }

  // 2. Dynamic Auto Slug Generator
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isEdit) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // remove special characters
        .trim()
        .replace(/\s+/g, "-") // replace spaces with hyphens
        .replace(/-+/g, "-"); // remove double hyphens
      setSlug(generated);
    }
  };

  // 3. Auto-save engine (every 15 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!title.trim() && !editorRef.current?.innerHTML.trim()) return;

      const draftPayload = {
        title,
        slug,
        excerpt,
        content: editorRef.current?.innerHTML || "",
        thumbnail,
        category,
        tags,
        author,
        featured,
        published,
        metaTitle,
        metaDescription,
        keywords,
        faqs,
        updatedAt: new Date().toISOString(),
      };

      const key = isEdit ? `calczen_blog_draft_${id}` : "calczen_blog_draft_new";
      localStorage.setItem(key, JSON.stringify(draftPayload));
      const now = new Date();
      setAutoSaveTime(now.toLocaleTimeString());
    }, 15000);

    return () => clearInterval(interval);
  }, [title, slug, excerpt, thumbnail, category, tags, author, featured, published, metaTitle, metaDescription, keywords, faqs, isEdit, id]);

  // Visual text formatting operations
  function execCmd(command: string, value: string = "") {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }

  function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        toast.error("File is larger than 800 KB. We recommend uploading a compressed WebP/JPEG under 800 KB for optimal performance.");
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setThumbnail(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // Visual structures insertions
  function insertLink() {
    const url = prompt("Enter full URL (e.g. https://google.com):");
    if (url) execCmd("createLink", url);
  }

  function insertImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 800 * 1024) {
          toast.error("Image file is too large (max 800 KB recommended for fast page loads).");
        }
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            execCmd("insertImage", reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  function insertTable() {
    const cols = parseInt(prompt("Enter number of columns:", "3") || "0");
    const rows = parseInt(prompt("Enter number of rows:", "3") || "0");
    if (!cols || !rows) return;

    let html = `<table class="calc-editor-table w-full border-collapse border border-[var(--color-card-border)] my-4 text-left text-sm"><thead><tr>`;
    for (let c = 0; c < cols; c++) {
      html += `<th class="border border-[var(--color-card-border)] p-2 font-semibold bg-white/5">Header ${c + 1}</th>`;
    }
    html += `</tr></thead><tbody>`;
    for (let r = 0; r < rows; r++) {
      html += `<tr>`;
      for (let c = 0; c < cols; c++) {
        html += `<td class="border border-[var(--color-card-border)] p-2">Data Cell</td>`;
      }
      html += `</tr>`;
    }
    html += `</tbody></table><p>&nbsp;</p>`;

    execCmd("insertHTML", html);
  }

  // Calculator custom card block insertion
  function insertCalculatorBlock() {
    const calc = CALCULATORS.find((c) => c.slug === selectedCalc);
    if (!calc) return;

    const html = `
      <div class="calc-cta-block rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-5 my-6 flex flex-col sm:flex-row items-center justify-between gap-4 select-none" data-slug="${calc.slug}" contenteditable="false">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calculator"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
          </div>
          <div>
            <h4 class="font-semibold text-white text-base leading-tight">Try Our Premium ${calc.name} →</h4>
            <p class="text-xs text-[var(--color-muted)] mt-1">Calculate and simulate figures instantly.</p>
          </div>
        </div>
        <span class="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 py-2 hover:scale-[1.02] active:scale-[0.98] transition-all">Calculate Now</span>
      </div>
      <p>&nbsp;</p>
    `;

    execCmd("insertHTML", html);
    toast.success(`Embedded ${calc.name} card into article`);
  }

  // 3.5 Robust Notion/Medium Paste Sanitizer and Spacing Engine
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const clipboardData = e.clipboardData;
    const html = clipboardData.getData("text/html");
    const text = clipboardData.getData("text/plain");

    let contentToInsert = "";

    if (html) {
      // Paste rich HTML, but sanitize it to keep only clean, semantic blog tags:
      // p, h1, h2, h3, h4, ul, ol, li, strong, em, u, a, blockquote, table, thead, tbody, tr, th, td, br
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      
      const cleanNode = (node: Node): string => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.nodeValue ? escapeHtml(node.nodeValue) : "";
        }
        
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          const tagName = el.tagName.toLowerCase();
          
          const allowedTags = [
            "p", "h1", "h2", "h3", "h4", "ul", "ol", "li", "strong", 
            "em", "u", "a", "blockquote", "table", "thead", "tbody", 
            "tr", "th", "td", "br"
          ];
          
          if (allowedTags.includes(tagName)) {
            let attributes = "";
            if (tagName === "a") {
              const href = el.getAttribute("href");
              if (href) {
                attributes = ` href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:underline"`;
              }
            } else if (tagName === "table") {
              attributes = ` class="calc-editor-table w-full border-collapse border border-[var(--color-card-border)] my-4 text-left text-sm"`;
            } else if (tagName === "th") {
              attributes = ` class="border border-[var(--color-card-border)] p-2 font-semibold bg-white/5"`;
            } else if (tagName === "td") {
              attributes = ` class="border border-[var(--color-card-border)] p-2"`;
            }
            
            let childrenContent = "";
            el.childNodes.forEach((child) => {
              childrenContent += cleanNode(child);
            });
            
            if (tagName === "br") return "<br>";
            
            return `<${tagName}${attributes}>${childrenContent}</${tagName}>`;
          } else {
            let childrenContent = "";
            el.childNodes.forEach((child) => {
              childrenContent += cleanNode(child);
            });
            return childrenContent;
          }
        }
        return "";
      };
      
      let cleanedHtml = "";
      doc.body.childNodes.forEach((child) => {
        cleanedHtml += cleanNode(child);
      });
      
      cleanedHtml = cleanedHtml.replace(/<p>\s*<\/p>/g, "");
      contentToInsert = cleanedHtml;
    } else if (text) {
      const paragraphs = text.split(/\r?\n\s*\r?\n/);
      contentToInsert = paragraphs
        .map((p) => {
          const trimmed = p.trim();
          if (!trimmed) return "";
          if (trimmed.startsWith("# ")) {
            return `<h2 class="text-xl font-bold mt-6 mb-3 text-white">${escapeHtml(trimmed.substring(2))}</h2>`;
          }
          if (trimmed.startsWith("## ")) {
            return `<h2 class="text-xl font-bold mt-6 mb-3 text-white">${escapeHtml(trimmed.substring(3))}</h2>`;
          }
          if (trimmed.startsWith("### ")) {
            return `<h3 class="text-lg font-semibold mt-4 mb-2 text-slate-200">${escapeHtml(trimmed.substring(4))}</h3>`;
          }
          return `<p class="mb-4 leading-relaxed text-sm sm:text-base text-slate-300">${escapeHtml(trimmed).replace(/\n/g, "<br>")}</p>`;
        })
        .filter(Boolean)
        .join("");
    }

    if (contentToInsert) {
      document.execCommand("insertHTML", false, contentToInsert);
    }
  };

  function escapeHtml(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // 4. Save Blog Handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const content = editorRef.current?.innerHTML.trim() || "";

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!slug.trim()) {
      toast.error("URL Slug is required");
      return;
    }
    if (!excerpt.trim()) {
      toast.error("Short Excerpt is required");
      return;
    }
    if (!content || content === "<br>") {
      toast.error("Article content is required");
      return;
    }

    // Dynamic Reading Time Estimator (avg 200 words per minute)
    const textContent = editorRef.current?.innerText || "";
    const words = textContent.trim().split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(words / 200));

    const payload = {
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      excerpt: excerpt.trim(),
      content,
      thumbnail: thumbnail.trim() || null,
      category,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      metaTitle: metaTitle.trim() || null,
      metaDescription: metaDescription.trim() || null,
      keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
      author: author.trim() || "CalcZen Team",
      featured,
      faqs,
      readingTime,
    };

    if (published) {
      if (!metaTitle.trim()) { toast.error("Meta Title is required to publish."); return; }
      if (!metaDescription.trim()) { toast.error("Meta Description is required to publish."); return; }
      if (!thumbnail.trim()) { toast.error("Featured Image is required to publish."); return; }
      if (words < 500) { toast.error("Blog must have at least 500 words to publish."); return; }
      
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      const h2Count = tempDiv.querySelectorAll("h2").length;
      if (h2Count < 2) { toast.error("Blog must have at least 2 H2 sections to publish."); return; }
      
      if (faqs.length < 3) { toast.error("Blog must have at least 3 FAQs to publish."); return; }
      
      const links = Array.from(tempDiv.querySelectorAll("a"));
      let internal = 0;
      let external = 0;
      links.forEach(link => {
        const href = link.getAttribute("href") || "";
        if (href.startsWith("/") || href.includes("calczen.com")) internal++;
        else if (href.startsWith("http")) external++;
      });
      if (internal < 2) { toast.error("Blog must have at least 2 internal links to publish."); return; }
      if (external < 1) { toast.error("Blog must have at least 1 external authority link to publish."); return; }
    }

    setSaving(true);
    try {
      if (isEdit) {
        await api.updateBlog(id!, payload);
        toast.success("Article updated successfully");
        localStorage.removeItem(`calczen_blog_draft_${id}`);
      } else {
        await api.createBlog(payload);
        toast.success("Article created successfully");
        localStorage.removeItem("calczen_blog_draft_new");
      }
      navigate("/blogs");
    } catch (err: any) {
      toast.error(err instanceof Error ? err.message : "Failed to save article");
    } finally {
      setSaving(false);
    }
  }

  // Clean-room preview processor: detects calculator CTA blocks and keywords
  const processPreviewContent = (rawHtml: string) => {
    // Return standard visual html
    return rawHtml;
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 mx-auto animate-spin text-[var(--color-primary)]" />
          <p className="mt-2 text-sm text-[var(--color-muted)]">Loading article settings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-6xl pb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-[var(--color-card-border)] pb-4">
          <div className="flex items-center gap-3">
            <Link
              to="/blogs"
              className="p-2 text-[var(--color-muted)] hover:text-white rounded border border-[var(--color-card-border)] bg-[var(--color-card)] hover:bg-white/5 transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <PageHeader
              title={isEdit ? "Edit Article" : "Create Article"}
              description={isEdit ? "Update your existing article content and configurations." : "Draft a new publication with SEO optimization."}
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
            {autoSaveTime && (
              <span className="text-[11px] text-[var(--color-muted)] italic mr-1 shrink-0 hidden md:inline">
                Auto-saved in browser: {autoSaveTime}
              </span>
            )}
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === "edit" ? "preview" : "edit")}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-card-border)] bg-[var(--color-card)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
            >
              {activeTab === "edit" ? (
                <>
                  <Eye size={16} />
                  Live Preview
                </>
              ) : (
                <>
                  <EyeOff size={16} />
                  Back to Editing
                </>
              )}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Saving Changes..." : "Save Article"}
            </button>
          </div>
        </div>

        {activeTab === "preview" ? (
          /* PREVIEW MODE */
          <div className="rounded-xl border border-[var(--color-card-border)] bg-slate-950 p-6 md:p-10 text-white min-h-[500px]">
            <div className="max-w-3xl mx-auto">
              <span className="inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
                {category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold mt-3 leading-tight tracking-tight">{title || "Article Title"}</h1>
              <p className="text-sm text-[var(--color-muted)] mt-4">
                By <strong className="text-white">{author}</strong> · Reading time: ~ {Math.max(1, Math.ceil((editorRef.current?.innerText || "").split(" ").length / 200))} min
              </p>

              {thumbnail && (
                <img
                  src={thumbnail}
                  alt=""
                  className="w-full h-80 object-cover rounded-xl mt-6 border border-white/10"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60";
                  }}
                />
              )}

              <div className="mt-8 border-t border-white/5 pt-6 prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-a:text-indigo-400 prose-strong:text-white select-text">
                <div
                  dangerouslySetInnerHTML={{
                    __html: processPreviewContent(editorRef.current?.innerHTML || ""),
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* EDITING MODE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Main Fields Column */}
            <div className="lg:col-span-8 space-y-5">
              <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-5 space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold mb-1.5 text-white">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    maxLength={150}
                    value={title}
                    onChange={handleTitleChange}
                    className="w-full rounded-lg border border-[var(--color-card-border)] bg-black px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-muted)]"
                    placeholder="Enter an attention-grabbing blog title..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="slug" className="block text-sm font-semibold mb-1.5 text-white">
                      URL Slug
                    </label>
                    <input
                      id="slug"
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                      className="w-full rounded-lg border border-[var(--color-card-border)] bg-black px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] font-mono"
                      placeholder="url-slug-goes-here"
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-semibold mb-1.5 text-white">
                      Category
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-lg border border-[var(--color-card-border)] bg-black px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="excerpt" className="block text-sm font-semibold mb-1.5 text-white">
                    Short Summary (Excerpt)
                  </label>
                  <textarea
                    id="excerpt"
                    required
                    rows={3}
                    maxLength={300}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-card-border)] bg-black px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-muted)] resize-none"
                    placeholder="Provide a compelling 1-2 sentence meta summary of the article..."
                  />
                </div>
              </div>

              {/* Rich visual WYSIWYG Editor */}
              <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] overflow-hidden shadow-card">
                <div className="bg-white/5 border-b border-[var(--color-card-border)] p-2.5 flex flex-wrap gap-1 items-center justify-between">
                  <div className="flex flex-wrap gap-1 items-center">
                    <button
                      type="button"
                      onClick={() => execCmd("bold")}
                      className="p-2 rounded hover:bg-white/5 text-[var(--color-muted)] hover:text-white"
                      title="Bold"
                    >
                      <Bold size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => execCmd("italic")}
                      className="p-2 rounded hover:bg-white/5 text-[var(--color-muted)] hover:text-white"
                      title="Italic"
                    >
                      <Italic size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => execCmd("underline")}
                      className="p-2 rounded hover:bg-white/5 text-[var(--color-muted)] hover:text-white"
                      title="Underline"
                    >
                      <Underline size={16} />
                    </button>
                    <span className="h-4 w-px bg-[var(--color-card-border)] mx-1" />
                    <button
                      type="button"
                      onClick={() => execCmd("formatBlock", "H2")}
                      className="p-2 rounded hover:bg-white/5 text-[var(--color-muted)] hover:text-white"
                      title="H2 Header"
                    >
                      <Heading2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => execCmd("formatBlock", "H3")}
                      className="p-2 rounded hover:bg-white/5 text-[var(--color-muted)] hover:text-white"
                      title="H3 Header"
                    >
                      <Heading3 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => execCmd("formatBlock", "P")}
                      className="px-2 py-1 text-xs rounded hover:bg-white/5 text-[var(--color-muted)] hover:text-white font-medium"
                      title="Normal Text Paragraph"
                    >
                      P
                    </button>
                    <span className="h-4 w-px bg-[var(--color-card-border)] mx-1" />
                    <button
                      type="button"
                      onClick={() => execCmd("insertUnorderedList")}
                      className="p-2 rounded hover:bg-white/5 text-[var(--color-muted)] hover:text-white"
                      title="Bullet List"
                    >
                      <List size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => execCmd("insertOrderedList")}
                      className="p-2 rounded hover:bg-white/5 text-[var(--color-muted)] hover:text-white"
                      title="Ordered List"
                    >
                      <ListOrdered size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => execCmd("formatBlock", "BLOCKQUOTE")}
                      className="p-2 rounded hover:bg-white/5 text-[var(--color-muted)] hover:text-white"
                      title="Blockquote"
                    >
                      <Quote size={16} />
                    </button>
                    <span className="h-4 w-px bg-[var(--color-card-border)] mx-1" />
                    <button
                      type="button"
                      onClick={insertLink}
                      className="p-2 rounded hover:bg-white/5 text-[var(--color-muted)] hover:text-white"
                      title="Insert Link"
                    >
                      <LinkIcon size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={insertImage}
                      className="p-2 rounded hover:bg-white/5 text-[var(--color-muted)] hover:text-white"
                      title="Upload Image from Files"
                    >
                      <Image size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={insertTable}
                      className="p-2 rounded hover:bg-white/5 text-[var(--color-muted)] hover:text-white"
                      title="Insert Responsive Table"
                    >
                      <Table size={16} />
                    </button>
                  </div>

                  {/* Calculator CTA embedding controller */}
                  <div className="flex items-center gap-1.5 border border-indigo-500/20 bg-indigo-950/20 px-2 py-1 rounded-lg">
                    <Calculator size={14} className="text-indigo-400" />
                    <select
                      value={selectedCalc}
                      onChange={(e) => setSelectedCalc(e.target.value)}
                      className="bg-transparent text-[11px] text-indigo-300 font-semibold border-none focus:outline-none focus:ring-0 max-w-[150px]"
                    >
                      {CALCULATORS.map((c) => (
                        <option key={c.slug} value={c.slug} className="bg-slate-900 text-white">
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={insertCalculatorBlock}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 transition-all"
                      title="Embed Interactive Calculator CTA"
                    >
                      <Sparkles size={10} />
                      Embed Card
                    </button>
                  </div>
                </div>

                <div
                  ref={editorRef}
                  contentEditable
                  onPaste={handlePaste}
                  className="min-h-[500px] p-6 md:p-8 text-base text-slate-200 outline-none select-text prose prose-invert max-w-3xl mx-auto w-full focus:ring-0 overflow-y-auto"
                  style={{ backgroundColor: "black" }}
                  data-placeholder="Start visually composing your premium article copy..."
                  suppressContentEditableWarning
                />
              </div>
              
              {/* FAQ Section */}
              <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--color-card-border)] pb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <List size={16} className="text-indigo-400" />
                    Frequently Asked Questions
                  </h3>
                  <button
                    type="button"
                    onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    + Add FAQ
                  </button>
                </div>
                
                {faqs.length === 0 ? (
                  <p className="text-sm text-[var(--color-muted)] italic py-2">No FAQs added yet. Add at least 3 for optimal SEO.</p>
                ) : (
                  <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                      <div key={idx} className="border border-[var(--color-card-border)] rounded-lg p-3 bg-black/50 space-y-3 relative group">
                        <button 
                          type="button"
                          onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                          className="absolute right-3 top-3 text-[var(--color-muted)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                        <div>
                          <label className="block text-xs font-bold text-[var(--color-muted)] uppercase mb-1">Question {idx + 1}</label>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => {
                              const newFaqs = [...faqs];
                              newFaqs[idx].question = e.target.value;
                              setFaqs(newFaqs);
                            }}
                            className="w-full rounded-lg border border-[var(--color-card-border)] bg-black px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            placeholder="e.g., What is a good credit score?"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[var(--color-muted)] uppercase mb-1">Answer</label>
                          <textarea
                            rows={2}
                            value={faq.answer}
                            onChange={(e) => {
                              const newFaqs = [...faqs];
                              newFaqs[idx].answer = e.target.value;
                              setFaqs(newFaqs);
                            }}
                            className="w-full rounded-lg border border-[var(--color-card-border)] bg-black px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                            placeholder="A good credit score is generally..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Configurations Column */}
            <div className="lg:col-span-4 space-y-5">
              {/* Publication States Panel */}
              <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-5 space-y-4">
                <h3 className="text-sm font-bold border-b border-[var(--color-card-border)] pb-2 text-white flex items-center gap-2">
                  <Settings size={16} className="text-[var(--color-primary)]" />
                  Publication Status
                </h3>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Publish Directly</p>
                    <p className="text-xs text-[var(--color-muted)] mt-0.5">Toggle to index live on site.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPublished(!published)}
                    className={`h-6 w-11 rounded-full p-0.5 transition-colors focus:outline-none ${
                      published ? "bg-green-500" : "bg-zinc-700"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-full bg-white transition-transform ${
                        published ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-[var(--color-card-border)] pt-4">
                  <div>
                    <p className="text-sm font-semibold text-white">Featured Article</p>
                    <p className="text-xs text-[var(--color-muted)] mt-0.5">Showcase at top of blog.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFeatured(!featured)}
                    className={`h-6 w-11 rounded-full p-0.5 transition-colors focus:outline-none ${
                      featured ? "bg-indigo-500" : "bg-zinc-700"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-full bg-white transition-transform ${
                        featured ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="space-y-3 border-t border-[var(--color-card-border)] pt-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--color-muted)] uppercase mb-1">
                      Cover Thumbnail Image
                    </label>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          id="thumbnail-file"
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById("thumbnail-file")?.click()}
                          className="h-9 px-3 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                        >
                          Upload Cover Image
                        </button>
                        {thumbnail && (
                          <button
                            type="button"
                            onClick={() => setThumbnail("")}
                            className="h-9 px-3 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-red-400 hover:text-red-300 transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-[var(--color-muted)] leading-relaxed mt-1">
                        Recommended dimensions: <strong>1200 x 630 pixels</strong> (16:9 aspect ratio) for optimal social preview. 
                        Recommended file size: <strong>under 200 KB</strong> (maximum 800 KB, format: WebP or JPEG).
                      </p>
                    </div>
                  </div>

                  {thumbnail && (
                    <div className="relative rounded overflow-hidden h-24 border border-[var(--color-card-border)] bg-black">
                      <img
                        src={thumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&auto=format&fit=crop&q=60";
                        }}
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="author" className="block text-xs font-bold text-[var(--color-muted)] uppercase mb-1">
                      Author Name
                    </label>
                    <input
                      id="author"
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full rounded-lg border border-[var(--color-card-border)] bg-black px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                </div>
              </div>

              {/* SEO Configurations Drawer */}
              <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-5 space-y-4">
                <h3 className="text-sm font-bold border-b border-[var(--color-card-border)] pb-2 text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-indigo-400" />
                  Meta SEO settings
                </h3>

                <div>
                  <label htmlFor="metaTitle" className="block text-xs font-bold text-[var(--color-muted)] uppercase mb-1">
                    Meta SEO Title
                  </label>
                  <input
                    id="metaTitle"
                    type="text"
                    maxLength={70}
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-card-border)] bg-black px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-muted)]"
                    placeholder="Recommends: Title | CalcZen"
                  />
                  <p className="text-[10px] text-[var(--color-muted)] mt-1">Recommended length: under 60 characters.</p>
                </div>

                <div>
                  <label htmlFor="metaDesc" className="block text-xs font-bold text-[var(--color-muted)] uppercase mb-1">
                    Meta Description
                  </label>
                  <textarea
                    id="metaDesc"
                    rows={3}
                    maxLength={160}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-card-border)] bg-black px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-muted)] resize-none"
                    placeholder="Write a concise SEO teaser..."
                  />
                  <p className="text-[10px] text-[var(--color-muted)] mt-1">Recommended length: under 160 characters.</p>
                </div>

                <div>
                  <label htmlFor="keywords" className="block text-xs font-bold text-[var(--color-muted)] uppercase mb-1">
                    Focus Keywords
                  </label>
                  <input
                    id="keywords"
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-card-border)] bg-black px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-muted)]"
                    placeholder="mortgage, emi, interest (comma separated)"
                  />
                </div>

                <div>
                  <label htmlFor="tags" className="block text-xs font-bold text-[var(--color-muted)] uppercase mb-1">
                    Pill Tags
                  </label>
                  <input
                    id="tags"
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-card-border)] bg-black px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-muted)]"
                    placeholder="home loan, rates, guide (comma separated)"
                  />
                </div>
              </div>
              
              {/* Live SEO Quality Enforcement Panel */}
              <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-5 space-y-4 sticky top-4">
                <h3 className="text-sm font-bold border-b border-[var(--color-card-border)] pb-2 text-white flex items-center gap-2">
                  <Globe size={16} className="text-green-400" />
                  SEO Quality Panel
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-muted)]">Word Count (Min 500)</span>
                    <span className={`text-xs font-bold ${metrics.wordCount >= 500 ? 'text-green-400' : 'text-red-400'}`}>
                      {metrics.wordCount} {metrics.wordCount >= 500 ? '✓' : '✗'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-muted)]">H2 Sections (Min 2)</span>
                    <span className={`text-xs font-bold ${metrics.h2Count >= 2 ? 'text-green-400' : 'text-red-400'}`}>
                      {metrics.h2Count} {metrics.h2Count >= 2 ? '✓' : '✗'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-muted)]">FAQs (Min 3)</span>
                    <span className={`text-xs font-bold ${faqs.length >= 3 ? 'text-green-400' : 'text-red-400'}`}>
                      {faqs.length} {faqs.length >= 3 ? '✓' : '✗'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-muted)]">Internal Links (Min 2)</span>
                    <span className={`text-xs font-bold ${metrics.internalLinks >= 2 ? 'text-green-400' : 'text-red-400'}`}>
                      {metrics.internalLinks} {metrics.internalLinks >= 2 ? '✓' : '✗'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-muted)]">External Links (Min 1)</span>
                    <span className={`text-xs font-bold ${metrics.externalLinks >= 1 ? 'text-green-400' : 'text-red-400'}`}>
                      {metrics.externalLinks} {metrics.externalLinks >= 1 ? '✓' : '✗'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-muted)]">Meta Required Fields</span>
                    <span className={`text-xs font-bold ${(metaTitle && metaDescription && thumbnail) ? 'text-green-400' : 'text-red-400'}`}>
                      {(metaTitle && metaDescription && thumbnail) ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
                
                {published && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-300">
                    <strong>Note:</strong> You must meet all green checkmarks before you can save this article as Published.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </form>
    </>
  );
}
