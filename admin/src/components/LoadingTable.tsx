export function LoadingTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] overflow-hidden">
      <div className="p-4 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-10 rounded-lg bg-white/5 animate-pulse"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
