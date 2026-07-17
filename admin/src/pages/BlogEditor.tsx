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
  AlertTriangle,
  CheckCircle,
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
  "Education",
  "Math",
  "Everyday",
  "Science",
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
  { slug: "sleep-calculator", name: "Sleep Calculator" },
  { slug: "regular-calculator", name: "Regular Calculator" },
  { slug: "scientific-calculator", name: "Scientific Calculator" },
  { slug: "retirement-calculator", name: "Retirement Calculator" },
  { slug: "401k-calculator", name: "401(k) Calculator" },
  { slug: "sip-calculator", name: "SIP Calculator" },
  { slug: "fd-calculator", name: "FD Calculator" },
  { slug: "gst-calculator", name: "GST Calculator" },
  { slug: "attendance-calculator", name: "Attendance Calculator" },
  { slug: "cgpa-calculator", name: "CGPA Calculator" },
  { slug: "body-fat-calculator", name: "Body Fat Calculator" },
  { slug: "protein-calculator", name: "Protein Calculator" },
  { slug: "inflation-calculator", name: "Inflation Calculator" },
  { slug: "loan-eligibility-calculator", name: "Loan Eligibility Calculator" },
  { slug: "credit-card-emi-calculator", name: "Credit Card EMI Calculator" },
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

  // Manual Overrides (Hidden in collapsed Details Accordion)
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

  // Quality Validation Checks Modal States
  const [qualityWarnings, setQualityWarnings] = useState<string[]>([]);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);

  // Real-time Audit Scores State
  const [scores, setScores] = useState({
    discover: 0,
    seo: 0,
    performance: 0,
    accessibility: 0,
    schema: 0,
    wordCount: 0,
    h1Count: 0,
    h2Count: 0,
    internalLinks: 0,
    externalLinks: 0,
  });

  // Calculate realtime audit parameters and scores
  useEffect(() => {
    const interval = setInterval(() => {
      if (!editorRef.current) return;

      const content = editorRef.current.innerHTML || "";
      const textContent = editorRef.current.innerText || "";
      const words = textContent.trim().split(/\s+/).filter(Boolean).length;

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;

      const h1Count = tempDiv.querySelectorAll("h1").length;
      const h2Count = tempDiv.querySelectorAll("h2").length;
      const h3Count = tempDiv.querySelectorAll("h3").length;
      const imgs = tempDiv.querySelectorAll("img");
      const links = tempDiv.querySelectorAll("a");

      let missingAlts = 0;
      imgs.forEach((img) => {
        if (!img.getAttribute("alt")?.trim()) missingAlts++;
      });

      let internal = 0;
      let external = 0;
      links.forEach((link) => {
        const href = link.getAttribute("href") || "";
        if (href.startsWith("/") || href.includes("calczen.in")) internal++;
        else if (href.startsWith("http")) external++;
      });

      // 1. Google Discover Score
      let discoverScore = 0;
      if (words >= 500) discoverScore += 25;
      else if (words > 200) discoverScore += 10;
      if (h2Count >= 2) discoverScore += 25;
      if (faqs.length >= 3) discoverScore += 25;
      if (thumbnail && thumbnail.trim()) discoverScore += 25;

      // 2. SEO Score
      let seoScore = 0;
      if (title.trim().length >= 30 && title.trim().length <= 60) seoScore += 20;
      else if (title.trim().length > 0) seoScore += 10;
      const descVal = metaDescription || excerpt;
      if (descVal.trim().length >= 120 && descVal.trim().length <= 160) seoScore += 20;
      else if (descVal.trim().length > 0) seoScore += 10;
      if (h1Count === 0) seoScore += 20;
      if (internal >= 1) seoScore += 20;
      if (tags.trim()) seoScore += 20;

      // 3. Performance Score
      let perfScore = 95;
      if (thumbnail && thumbnail.startsWith("data:image/") && thumbnail.length > 500 * 1024) perfScore -= 20;
      if (imgs.length > 3) perfScore -= 10;

      // 4. Accessibility Score
      let accessScore = 100;
      if (missingAlts > 0) accessScore -= Math.min(40, missingAlts * 15);
      if (h1Count > 0) accessScore -= 10;
      if (h3Count > 0 && h2Count === 0) accessScore -= 15;

      // 5. Schema Score
      let schemaScore = 30; // base schemas
      if (faqs.length >= 3) schemaScore += 30;
      if (h2Count >= 3) schemaScore += 20;
      if (content.includes("youtube.com") || content.includes("vimeo.com")) schemaScore += 20;

      setScores({
        discover: discoverScore,
        seo: seoScore,
        performance: Math.max(30, perfScore),
        accessibility: Math.max(30, accessScore),
        schema: Math.min(100, schemaScore),
        wordCount: words,
        h1Count,
        h2Count,
        internalLinks: internal,
        externalLinks: external,
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [title, excerpt, thumbnail, tags, faqs, metaDescription]);

  // 1. Fetch Blog if Edit Mode
  useEffect(() => {
    if (!isEdit) {
      const savedDraft = localStorage.getItem("calczen_blog_draft_new");
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          if (confirm("Found an auto-saved draft. Would you like to restore it?")) {
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
            editorRef.current.innerHTML = blog.content.replace(/<(h[23])id=/gi, "<$1 id=");
          }

          const savedDraft = localStorage.getItem(`calczen_blog_draft_${id}`);
          if (savedDraft) {
            try {
              const parsed = JSON.parse(savedDraft);
              if (new Date(parsed.updatedAt) > new Date(blog.updatedAt)) {
                if (confirm("Your browser has a newer auto-saved draft. Restore now?")) {
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
    if (!isEdit) {
      setPublished(draft.published || false);
    }
    setMetaTitle(draft.metaTitle || "");
    setMetaDescription(draft.metaDescription || "");
    setKeywords(draft.keywords || "");
    setFaqs(draft.faqs || []);
    if (editorRef.current) {
      editorRef.current.innerHTML = (draft.content || "").replace(/<(h[23])id=/gi, "<$1 id=");
    }
    toast.success("Draft restored successfully");
  }

  // 2. Dynamic Auto Slug Generator
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isEdit) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setSlug(generated);
    }
  };

  // 3. Auto-save draft
  useEffect(() => {
    const interval = setInterval(() => {
      if (saving) return;
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
      setAutoSaveTime(new Date().toLocaleTimeString());
    }, 15000);

    return () => clearInterval(interval);
  }, [title, slug, excerpt, thumbnail, category, tags, author, featured, published, metaTitle, metaDescription, keywords, faqs, isEdit, id, saving]);

  // Formatter commands
  function execCmd(command: string, value: string = "") {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }

  function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        toast.error("Image file is large. Compressed WebP/JPEG under 200KB is recommended for core web vitals.");
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

  function insertLink() {
    const url = prompt("Enter URL:");
    if (url) execCmd("createLink", url);
  }

  function insertImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
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
    const cols = parseInt(prompt("Columns:", "3") || "0");
    const rows = parseInt(prompt("Rows:", "3") || "0");
    if (!cols || !rows) return;

    let html = `<table class="calc-editor-table w-full border-collapse border border-[var(--color-card-border)] my-4 text-left text-sm"><thead><tr>`;
    for (let c = 0; c < cols; c++) {
      html += `<th class="border border-[var(--color-card-border)] p-2 font-semibold bg-white/5">Header ${c + 1}</th>`;
    }
    html += `</tr></thead><tbody>`;
    for (let r = 0; r < rows; r++) {
      html += `<tr>`;
      for (let c = 0; c < cols; c++) {
        html += `<td class="border border-[var(--color-card-border)] p-2">Cell Data</td>`;
      }
      html += `</tr>`;
    }
    html += `</tbody></table><p>&nbsp;</p>`;

    execCmd("insertHTML", html);
  }

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
    toast.success(`Embedded ${calc.name} block`);
  }

  // Notion/Medium paste formatter
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");
    let contentToInsert = "";

    if (html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const cleanNode = (node: Node): string => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.nodeValue ? escapeHtml(node.nodeValue) : "";
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          const tagName = el.tagName.toLowerCase();
          const allowedTags = ["p", "h1", "h2", "h3", "h4", "ul", "ol", "li", "strong", "em", "u", "a", "blockquote", "table", "thead", "tbody", "tr", "th", "td", "br"];
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
            el.childNodes.forEach((child) => { childrenContent += cleanNode(child); });
            if (tagName === "br") return "<br>";
            return `<${tagName}${attributes}>${childrenContent}</${tagName}>`;
          } else {
            let childrenContent = "";
            el.childNodes.forEach((child) => { childrenContent += cleanNode(child); });
            return childrenContent;
          }
        }
        return "";
      };
      let cleanedHtml = "";
      doc.body.childNodes.forEach((child) => { cleanedHtml += cleanNode(child); });
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

  // Quality Validation Checker prior to publish saving
  function runQualityAudit(): string[] {
    const warningsList: string[] = [];
    const content = editorRef.current?.innerHTML.trim() || "";

    if (!title.trim()) warningsList.push("Article Title is completely missing.");
    if (!slug.trim()) warningsList.push("URL slug is empty.");
    
    // Evaluate content length
    const words = scores.wordCount;
    if (words < 500) {
      warningsList.push(`Thin content detected: post has only ${words} words (recommended minimum 500 words for ranking).`);
    }

    // Evaluate H1 structure
    if (scores.h1Count > 0) {
      warningsList.push(`Duplicate H1 warning: ${scores.h1Count} H1 tags detected in body. H1 must be reserved exclusively for the post title.`);
    }

    // Evaluate structural depth
    if (scores.h2Count < 2) {
      warningsList.push(`Under-structured content: only ${scores.h2Count} H2 headings found. Discover and Search require at least 2 structured sub-sections.`);
    }

    // Evaluate image media
    if (!thumbnail.trim()) {
      warningsList.push("Featured Image is missing (required for Google Discover large card preview layouts).");
    } else if (thumbnail.startsWith("data:image/") && thumbnail.length > 500 * 1024) {
      warningsList.push("Featured Image file size is extremely large (> 500KB). Consider compressing to WebP under 200KB for Core Web Vitals.");
    }

    // Evaluate FAQ markup
    if (faqs.length < 3) {
      warningsList.push(`FAQ count warning: only ${faqs.length} FAQs configured. Providing at least 3 FAQs increases chance of Rich Snippets.`);
    }

    // Evaluate accessibility alts
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const imgs = tempDiv.querySelectorAll("img");
    let missingAltCount = 0;
    imgs.forEach((img) => {
      if (!img.getAttribute("alt")?.trim()) missingAltCount++;
    });
    if (missingAltCount > 0) {
      warningsList.push(`Accessibility audit warning: ${missingAltCount} images inside the article are missing descriptive alt tags.`);
    }

    // Evaluate internal link anchors
    let hasBrokenLinks = false;
    tempDiv.querySelectorAll("a").forEach((a) => {
      const href = a.getAttribute("href") || "";
      if (!href.trim() || href === "#") hasBrokenLinks = true;
    });
    if (hasBrokenLinks) {
      warningsList.push("Article contains broken or empty links (anchor tag href is missing).");
    }

    return warningsList;
  }

  // Pre-save submission handling
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Article Title is required");
      return;
    }
    if (!slug.trim()) {
      toast.error("Slug is required");
      return;
    }

    const content = editorRef.current?.innerHTML.trim() || "";
    if (!content || content === "<br>") {
      toast.error("Content is required");
      return;
    }

    // Trigger quality validations if publishing live
    if (published) {
      const auditWarnings = runQualityAudit();
      if (auditWarnings.length > 0) {
        setQualityWarnings(auditWarnings);
        setShowWarningModal(true);
        return;
      }
    }

    await executeSave();
  }

  async function executeSave() {
    setShowWarningModal(false);
    setSaving(true);
    const content = editorRef.current?.innerHTML.trim() || "";

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
      published,
      faqs,
    };

    try {
      if (isEdit) {
        await api.updateBlog(id!, payload);
        toast.success("Article updated successfully");
        localStorage.removeItem(`calczen_blog_draft_${id}`);
      } else {
        await api.createBlog(payload);
        toast.success("Article published successfully");
        localStorage.removeItem("calczen_blog_draft_new");
      }
      navigate("/blogs");
    } catch (err: any) {
      toast.error(err instanceof Error ? err.message : "Failed to save article settings");
    } finally {
      setSaving(false);
    }
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
              description="SEO optimization, schema markups, and Discover configurations will be automatically generated upon publish."
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
            {autoSaveTime && (
              <span className="text-[11px] text-[var(--color-muted)] italic mr-1 shrink-0 hidden md:inline">
                Draft auto-saved: {autoSaveTime}
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
                  Editing Mode
                </>
              )}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Saving Changes..." : "Publish Post"}
            </button>
          </div>
        </div>

        {activeTab === "preview" ? (
          /* PREVIEW PORTAL */
          <div className="rounded-xl border border-[var(--color-card-border)] bg-slate-950 p-6 md:p-10 text-white min-h-[500px]">
            <div className="max-w-3xl mx-auto">
              <span className="inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
                {category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold mt-3 leading-tight tracking-tight">{title || "Untitled Post"}</h1>
              <p className="text-sm text-[var(--color-muted)] mt-4">
                By <strong className="text-white">{author}</strong> · Reading time: ~ {scores.readingTime || Math.max(1, Math.ceil(scores.wordCount / 200))} min
              </p>

              {thumbnail && (
                <img
                  src={thumbnail}
                  alt=""
                  className="w-full h-80 object-cover rounded-xl mt-6 border border-white/10"
                />
              )}

              <div className="mt-8 border-t border-white/5 pt-6 prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-a:text-indigo-400 prose-strong:text-white select-text">
                <div
                  dangerouslySetInnerHTML={{
                    __html: editorRef.current?.innerHTML || "",
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* EDITING ENVIRONMENT */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Editor Input Column */}
            <div className="lg:col-span-8 space-y-5">
              <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-5 space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold mb-1.5 text-white">
                    Article Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    maxLength={150}
                    value={title}
                    onChange={handleTitleChange}
                    className="w-full rounded-lg border border-[var(--color-card-border)] bg-black px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-muted)]"
                    placeholder="Enter blog post title..."
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
                      placeholder="url-slug-here"
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
                    Short Excerpt (Auto-generated if left blank)
                  </label>
                  <textarea
                    id="excerpt"
                    rows={3}
                    maxLength={300}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-card-border)] bg-black px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-muted)] resize-none"
                    placeholder="Brief 1-2 sentence article description summary..."
                  />
                </div>
              </div>

              {/* Rich Visual Editor */}
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
                      className="p-2 rounded hover:bg-white/5 text-[var(--color-muted)] hover:text-white font-bold text-xs"
                      title="H2 Header"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => execCmd("formatBlock", "H3")}
                      className="p-2 rounded hover:bg-white/5 text-[var(--color-muted)] hover:text-white font-bold text-xs"
                      title="H3 Header"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => execCmd("formatBlock", "P")}
                      className="px-2 py-1 text-xs rounded hover:bg-white/5 text-[var(--color-muted)] hover:text-white font-semibold"
                      title="Paragraph Text"
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
                      title="Numbered List"
                    >
                      <ListOrdered size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => execCmd("formatBlock", "BLOCKQUOTE")}
                      className="p-2 rounded hover:bg-white/5 text-[var(--color-muted)] hover:text-white"
                      title="Quote"
                    >
                      <Quote size={16} />
                    </button>
                    <span className="h-4 w-px bg-[var(--color-card-border)] mx-1" />
                    <button
                      type="button"
                      onClick={insertLink}
                      className="p-2 rounded hover:bg-white/5 text-[var(--color-muted)] hover:text-white"
                      title="Insert Hyperlink"
                    >
                      <LinkIcon size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={insertImage}
                      className="p-2 rounded hover:bg-white/5 text-[var(--color-muted)] hover:text-white"
                      title="Insert Image"
                    >
                      <Image size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={insertTable}
                      className="p-2 rounded hover:bg-white/5 text-[var(--color-muted)] hover:text-white"
                      title="Insert Table"
                    >
                      <Table size={16} />
                    </button>
                  </div>

                  {/* Dynamic Calculator embedding widget */}
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
                    >
                      <Sparkles size={10} />
                      Link Tool
                    </button>
                  </div>
                </div>

                <div
                  ref={editorRef}
                  contentEditable
                  onPaste={handlePaste}
                  className="min-h-[500px] p-6 md:p-8 text-base text-slate-200 outline-none select-text prose prose-invert max-w-3xl mx-auto w-full focus:ring-0 overflow-y-auto"
                  style={{ backgroundColor: "black" }}
                  data-placeholder="Visually craft your premium article content here..."
                  suppressContentEditableWarning
                />
              </div>

              {/* FAQs accordion manager */}
              <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--color-card-border)] pb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <List size={16} className="text-indigo-400" />
                    Interactive FAQs Accordion
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
                  <p className="text-sm text-[var(--color-muted)] italic py-2">No FAQs created. Add at least 3 for schema inclusion.</p>
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
                          <label className="block text-[10px] font-bold text-[var(--color-muted)] uppercase mb-1">Question {idx + 1}</label>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => {
                              const newFaqs = faqs.map((f, i) =>
                                i === idx ? { ...f, question: e.target.value } : f
                              );
                              setFaqs(newFaqs);
                            }}
                            className="w-full rounded-lg border border-[var(--color-card-border)] bg-black px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            placeholder="e.g. What is Compound Interest?"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[var(--color-muted)] uppercase mb-1">Answer</label>
                          <textarea
                            rows={2}
                            value={faq.answer}
                            onChange={(e) => {
                              const newFaqs = faqs.map((f, i) =>
                                i === idx ? { ...f, answer: e.target.value } : f
                              );
                              setFaqs(newFaqs);
                            }}
                            className="w-full rounded-lg border border-[var(--color-card-border)] bg-black px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                            placeholder="Provide details..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Configs Column & Audit Card Panel */}
            <div className="lg:col-span-4 space-y-5">
              {/* Quality Audit Dashboard Panel */}
              <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-5 space-y-4">
                <h3 className="text-sm font-bold border-b border-[var(--color-card-border)] pb-2 text-white flex items-center gap-2">
                  <Globe size={16} className="text-indigo-400" />
                  SEO &amp; Discover Audit
                </h3>

                <div className="space-y-4">
                  {/* Google Discover Score */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                      <span>Google Discover Eligibility</span>
                      <span className={scores.discover >= 75 ? "text-green-400" : scores.discover >= 50 ? "text-yellow-400" : "text-red-400"}>
                        {scores.discover}%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${scores.discover >= 75 ? "bg-green-500" : scores.discover >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{ width: `${scores.discover}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Search Engine Optimization Score */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                      <span>Technical SEO Rating</span>
                      <span className={scores.seo >= 80 ? "text-green-400" : "text-yellow-400"}>
                        {scores.seo}%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 bg-indigo-500`}
                        style={{ width: `${scores.seo}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Performance Rating */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                      <span>Performance &amp; Web Vitals</span>
                      <span className={scores.performance >= 90 ? "text-green-400" : "text-yellow-400"}>
                        {scores.performance}%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 bg-emerald-500`}
                        style={{ width: `${scores.performance}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Accessibility Rating */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                      <span>Accessibility Score</span>
                      <span className={scores.accessibility >= 90 ? "text-green-400" : "text-yellow-400"}>
                        {scores.accessibility}%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 bg-teal-500`}
                        style={{ width: `${scores.accessibility}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Schema Markup rating */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                      <span>Schema Markup Score</span>
                      <span className={scores.schema >= 80 ? "text-green-400" : "text-yellow-400"}>
                        {scores.schema}%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 bg-purple-500`}
                        style={{ width: `${scores.schema}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Score Indicators Summary */}
                <div className="text-[11px] text-[var(--color-muted)] pt-2 border-t border-[var(--color-card-border)] space-y-1">
                  <div className="flex justify-between">
                    <span>Word Count (target 500+):</span>
                    <span className={scores.wordCount >= 500 ? "text-green-400 font-bold" : "text-yellow-400 font-bold"}>{scores.wordCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>H2 Headings:</span>
                    <span>{scores.h2Count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Internal Links:</span>
                    <span>{scores.internalLinks}</span>
                  </div>
                </div>
              </div>

              {/* Status and Cover Image Panel */}
              <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-5 space-y-4">
                <h3 className="text-sm font-bold border-b border-[var(--color-card-border)] pb-2 text-white flex items-center gap-2">
                  <Settings size={16} className="text-[var(--color-primary)]" />
                  Publication Status
                </h3>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Publish Live</p>
                    <p className="text-xs text-[var(--color-muted)] mt-0.5">Index article live on the site.</p>
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
                    <p className="text-sm font-semibold text-white">Featured Post</p>
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
                      Featured Cover Image
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
                          Upload Featured Image
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
                        Required dimensions: <strong>minimum 1200px wide</strong>.
                        Best practice format: <strong>WebP</strong> under 200KB.
                      </p>
                    </div>
                  </div>

                  {thumbnail && (
                    <div className="relative rounded overflow-hidden h-24 border border-[var(--color-card-border)] bg-black">
                      <img
                        src={thumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="author" className="block text-xs font-bold text-[var(--color-muted)] uppercase mb-1">
                      Author
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

              {/* Tags & Focus Keywords Panel */}
              <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-5 space-y-4">
                <h3 className="text-sm font-bold border-b border-[var(--color-card-border)] pb-2 text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-indigo-400" />
                  Meta Keywords &amp; Tags
                </h3>

                <div>
                  <label htmlFor="keywords" className="block text-xs font-bold text-[var(--color-muted)] uppercase mb-1">
                    Focus Keywords (Comma Separated)
                  </label>
                  <input
                    id="keywords"
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-card-border)] bg-black px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-muted)]"
                    placeholder="sip, investing, compound growth (auto-generated if empty)"
                  />
                </div>

                <div>
                  <label htmlFor="tags" className="block text-xs font-bold text-[var(--color-muted)] uppercase mb-1">
                    Tags / Badges (Comma Separated)
                  </label>
                  <input
                    id="tags"
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-card-border)] bg-black px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-muted)]"
                    placeholder="guides, wealth creation, tutorials"
                  />
                </div>
              </div>

              {/* SEO Configurations Drawer (Optional Overrides) */}
              <details className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer focus:outline-none select-none">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-indigo-400" />
                    Meta SEO Override (Optional)
                  </h3>
                  <span className="text-xs text-indigo-400 font-semibold hover:underline">Customize</span>
                </summary>
                <div className="space-y-4 mt-4 pt-4 border-t border-[var(--color-card-border)]">
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
                      placeholder="Title | CalcZen (Auto-generated if empty)"
                    />
                    <p className="text-[10px] text-[var(--color-muted)] mt-1">Target range: 50-60 characters.</p>
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
                      placeholder="teasor snippet description... (Auto-generated if empty)"
                    />
                    <p className="text-[10px] text-[var(--color-muted)] mt-1">Target range: 120-160 characters.</p>
                  </div>
                </div>
              </details>
            </div>
          </div>
        )}
      </form>

      {/* Quality Validation Audit Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
          <div className="bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-2xl p-6 max-w-lg w-full max-h-[80vh] flex flex-col shadow-glow">
            <div className="flex items-center gap-3 border-b border-[var(--color-card-border)] pb-4 text-yellow-500">
              <AlertTriangle size={24} />
              <h4 className="font-bold text-lg text-white">SEO &amp; Discover Quality Audit Alerts</h4>
            </div>

            <p className="text-sm text-[var(--color-muted)] my-4 leading-relaxed">
              We evaluated your article against Google Discover, search, and accessibility guidelines. Consider resolving the following warnings to maximize ranking potential:
            </p>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-6">
              {qualityWarnings.map((warning, idx) => (
                <div key={idx} className="flex gap-2 text-xs text-slate-300 leading-relaxed border-l-2 border-yellow-500 pl-3">
                  <span>{warning}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 border-t border-[var(--color-card-border)] pt-4 justify-end">
              <button
                type="button"
                onClick={() => setShowWarningModal(false)}
                className="px-4 py-2 border border-[var(--color-card-border)] rounded-lg text-sm text-slate-300 hover:bg-white/5 transition-all"
              >
                Back to Editing
              </button>
              <button
                type="button"
                onClick={executeSave}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-all"
              >
                Publish Post Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
