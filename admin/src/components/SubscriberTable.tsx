import { Trash2, Users } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { LoadingTable } from "@/components/LoadingTable";

export type SubscriberRow = {
  _id: string;
  email: string;
  subscribedAt: string;
  source: string;
  status?: string;
};

type Props = {
  subscribers: SubscriberRow[];
  loading?: boolean;
  onDelete: (id: string) => void;
  deletingId?: string | null;
};

function StatusBadge({ status }: { status?: string }) {
  const active = status !== "unsubscribed";
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
        active
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-slate-500/15 text-slate-400"
      }`}
    >
      {active ? "active" : "unsubscribed"}
    </span>
  );
}

export function SubscriberTable({ subscribers, loading, onDelete, deletingId }: Props) {
  if (loading) {
    return <LoadingTable />;
  }

  if (subscribers.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No subscribers found"
        description="New sign-ups from your website will appear here."
      />
    );
  }

  return (
    <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-card-border)] text-left text-[var(--color-muted)]">
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Subscribed</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium w-16" />
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s) => (
              <tr
                key={s._id}
                className="border-b border-[var(--color-card-border)] last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-4 py-3 font-medium">{s.email}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={s.status} />
                </td>
                <td className="px-4 py-3 text-[var(--color-muted)] whitespace-nowrap">
                  {new Date(s.subscribedAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{s.source}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onDelete(s._id)}
                    disabled={deletingId === s._id}
                    className="p-1.5 rounded text-[var(--color-danger)] hover:bg-red-500/10 disabled:opacity-50 transition-colors"
                    title="Delete subscriber"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
