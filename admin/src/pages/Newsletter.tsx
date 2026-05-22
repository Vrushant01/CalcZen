import { useEffect, useRef, useState } from "react";
import { Send, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AdminLayout";
import { EmptyState } from "@/components/EmptyState";
import { api } from "@/services/api";

export function NewsletterPage() {
  const [subject, setSubject] = useState("");
  const [sending, setSending] = useState(false);
  const [activeCount, setActiveCount] = useState(0);
  const [history, setHistory] = useState<
    Array<{ _id: string; subject: string; sentAt: string; recipientCount: number }>
  >([]);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([api.stats(), api.newsletterHistory()])
      .then(([statsRes, histRes]) => {
        if (statsRes.data) setActiveCount(statsRes.data.active);
        if (histRes.data) setHistory(histRes.data);
      })
      .catch(() => {});
  }, []);

  function execCommand(cmd: string, value?: string) {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const htmlContent = editorRef.current?.innerHTML?.trim() ?? "";
    if (!htmlContent || htmlContent === "<br>") {
      toast.error("Please write a message");
      return;
    }
    if (
      !confirm(
        `Send "${subject}" to ${activeCount} active subscriber${activeCount === 1 ? "" : "s"} via Resend?`,
      )
    ) {
      return;
    }

    setSending(true);
    try {
      const res = await api.sendNewsletter(subject, htmlContent);
      toast.success(res.message ?? "Newsletter sent");
      setSubject("");
      if (editorRef.current) editorRef.current.innerHTML = "";
      const hist = await api.newsletterHistory();
      if (hist.data) setHistory(hist.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Send failed");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Send Newsletter"
        description="Compose and send a message to all active subscribers via Resend."
      />

      <p className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--color-muted)] rounded-lg border border-[var(--color-card-border)] bg-[var(--color-card)] px-3 py-2">
        <Users size={16} />
        <span>
          <strong className="text-[var(--color-foreground)]">{activeCount}</strong> active
          subscribers will receive this email
        </span>
      </p>

      <form onSubmit={handleSend} className="space-y-4 max-w-3xl">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-1.5">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            required
            maxLength={200}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-card-border)] bg-[var(--color-card)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            placeholder="Monthly calculator updates"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Message</label>
          <div className="flex flex-wrap gap-1 mb-2 p-2 rounded-t-lg border border-b-0 border-[var(--color-card-border)] bg-[var(--color-card)]">
            {[
              ["bold", "B"],
              ["italic", "I"],
              ["underline", "U"],
              ["insertUnorderedList", "• List"],
              ["createLink", "Link"],
            ].map(([cmd, label]) => (
              <button
                key={cmd}
                type="button"
                onClick={() => {
                  if (cmd === "createLink") {
                    const url = prompt("Enter URL:");
                    if (url) execCommand(cmd, url);
                  } else {
                    execCommand(cmd);
                  }
                }}
                className="px-2 py-1 text-xs rounded border border-[var(--color-card-border)] hover:bg-white/5"
              >
                {label}
              </button>
            ))}
          </div>
          <div
            ref={editorRef}
            contentEditable
            className="min-h-[200px] rounded-b-lg border border-[var(--color-card-border)] bg-[var(--color-card)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] prose prose-invert max-w-none"
            data-placeholder="Write your newsletter…"
            suppressContentEditableWarning
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
        >
          <Send size={18} />
          {sending ? "Sending via Resend…" : "Send to active subscribers"}
        </button>
      </form>

      {history.length === 0 && !sending && (
        <div className="mt-12">
          <EmptyState
            icon={Send}
            title="No newsletters sent yet"
            description="Your sent campaigns will appear here with delivery counts."
          />
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-semibold mb-4">Recent newsletters</h2>
          <ul className="space-y-2">
            {history.map((n) => (
              <li
                key={n._id}
                className="rounded-lg border border-[var(--color-card-border)] bg-[var(--color-card)] px-4 py-3 text-sm"
              >
                <span className="font-medium">{n.subject}</span>
                <span className="text-[var(--color-muted)] ml-2">
                  — {n.recipientCount} sent · {new Date(n.sentAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
