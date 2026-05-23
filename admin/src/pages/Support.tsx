import { useCallback, useEffect, useState } from "react";
import { Inbox, Mail, Search, Send } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AdminLayout";
import { LoadingTable } from "@/components/LoadingTable";
import { api, type ContactMessage } from "@/services/api";

function StatusBadge({ status }: { status: ContactMessage["status"] }) {
  const styles = {
    unread: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    read: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    replied: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function SupportPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const loadList = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await api.contactMessages({
        search: search || undefined,
        status: statusFilter || undefined,
        page,
        limit: 20,
      });
      if (res.data) {
        setMessages(res.data.messages);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setLoadingList(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const loadDetail = useCallback(async (id: string) => {
    setLoadingDetail(true);
    setSelectedId(id);
    try {
      const res = await api.contactMessage(id);
      if (res.data) {
        setSelected(res.data);
        setReplyText(res.data.adminReply ?? "");
        setMessages((prev) =>
          prev.map((m) =>
            m._id === id ? { ...m, status: res.data!.status } : m,
          ),
        );
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load message");
      setSelected(null);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  async function handleSendReply() {
    if (!selected) return;
    const trimmed = replyText.trim();
    if (trimmed.length < 1) {
      toast.error("Write a reply before sending.");
      return;
    }
    if (!confirm(`Send reply to ${selected.email}?`)) return;

    setSending(true);
    try {
      const res = await api.replyToMessage(selected._id, trimmed);
      toast.success(res.message ?? "Reply sent");
      if (res.data) {
        setSelected(res.data);
        setMessages((prev) =>
          prev.map((m) => (m._id === res.data!._id ? res.data! : m)),
        );
      }
      loadList();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send reply");
    } finally {
      setSending(false);
    }
  }

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <>
      <PageHeader
        title="Support inbox"
        description="Contact form messages — read and reply directly from the admin panel."
      />

      <div className="flex flex-col lg:flex-row gap-4 min-h-[520px]">
        <div className="lg:w-[380px] shrink-0 flex flex-col rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] overflow-hidden">
          <div className="p-3 border-b border-[var(--color-card-border)] space-y-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
              />
              <input
                type="search"
                placeholder="Search name, email, message…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--color-card-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-[var(--color-card-border)] bg-[var(--color-background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="">All statuses</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[480px]">
            {loadingList ? (
              <div className="p-4">
                <LoadingTable rows={4} />
              </div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center text-sm text-[var(--color-muted)]">
                <Inbox size={32} className="mx-auto mb-2 opacity-50" />
                No messages found.
              </div>
            ) : (
              <ul>
                {messages.map((m) => (
                  <li key={m._id}>
                    <button
                      type="button"
                      onClick={() => loadDetail(m._id)}
                      className={`w-full text-left px-4 py-3 border-b border-[var(--color-card-border)] transition-colors hover:bg-white/5 ${
                        selectedId === m._id ? "bg-[var(--color-primary)]/15 border-l-2 border-l-[var(--color-primary)]" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-sm truncate">{m.name}</span>
                        {m.status === "unread" && (
                          <span className="shrink-0 w-2 h-2 rounded-full bg-amber-400 mt-1.5" title="Unread" />
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-muted)] truncate mt-0.5">{m.email}</p>
                      <p className="text-xs text-[var(--color-muted)] truncate mt-1">{m.subject}</p>
                      <div className="flex items-center justify-between mt-2 gap-2">
                        <StatusBadge status={m.status} />
                        <span className="text-[10px] text-[var(--color-muted)]">
                          {new Date(m.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {pagination.pages > 1 && (
            <div className="p-2 border-t border-[var(--color-card-border)] flex items-center justify-between text-xs">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-2 py-1 rounded border border-[var(--color-card-border)] disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-[var(--color-muted)]">
                {page}/{pagination.pages}
              </span>
              <button
                type="button"
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => p + 1)}
                className="px-2 py-1 rounded border border-[var(--color-card-border)] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-4 md:p-6 min-h-[320px]">
          {!selectedId ? (
            <div className="h-full flex flex-col items-center justify-center text-[var(--color-muted)] text-sm">
              <Mail size={40} className="mb-3 opacity-40" />
              Select a message to view details and reply.
              {unreadCount > 0 && (
                <p className="mt-2 text-amber-300">{unreadCount} unread on this page</p>
              )}
            </div>
          ) : loadingDetail ? (
            <div className="py-12 text-center text-sm text-[var(--color-muted)]">Loading…</div>
          ) : selected ? (
            <div className="flex flex-col h-full">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{selected.name}</h2>
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-sm text-[var(--color-primary-hover)] hover:underline"
                  >
                    {selected.email}
                  </a>
                </div>
                <StatusBadge status={selected.status} />
              </div>

              <p className="text-xs text-[var(--color-muted)] mb-4">
                Received {formatDate(selected.createdAt)}
                {selected.updatedAt !== selected.createdAt &&
                  ` · Updated ${formatDate(selected.updatedAt)}`}
              </p>

              <p className="text-sm font-medium text-[var(--color-muted)] mb-1">Subject</p>
              <p className="text-sm mb-4">{selected.subject}</p>

              <p className="text-sm font-medium text-[var(--color-muted)] mb-1">Message</p>
              <div className="rounded-lg border border-[var(--color-card-border)] bg-[var(--color-background)] p-4 text-sm whitespace-pre-wrap mb-6 max-h-48 overflow-y-auto">
                {selected.message}
              </div>

              {selected.adminReply && selected.status === "replied" && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-emerald-400 mb-1">Previous reply</p>
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm whitespace-pre-wrap">
                    {selected.adminReply}
                  </div>
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-[var(--color-card-border)]">
                <label htmlFor="admin-reply" className="text-sm font-medium block mb-2">
                  Your reply
                </label>
                <textarea
                  id="admin-reply"
                  rows={5}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={sending}
                  placeholder="Write your reply to the user…"
                  className="w-full rounded-lg border border-[var(--color-card-border)] bg-[var(--color-background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-y min-h-[120px]"
                />
                <button
                  type="button"
                  onClick={handleSendReply}
                  disabled={sending || !replyText.trim()}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] disabled:opacity-50 transition-colors"
                >
                  <Send size={16} />
                  {sending ? "Sending…" : "Send reply"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
