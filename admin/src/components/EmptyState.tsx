import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  title: string;
  description?: string;
};

export function EmptyState({ icon: Icon, title, description }: Props) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--color-card-border)] bg-[var(--color-card)]/50 p-12 text-center">
      <Icon className="h-10 w-10 mx-auto text-[var(--color-muted)] opacity-60" />
      <p className="mt-3 font-medium">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-[var(--color-muted)] max-w-sm mx-auto">{description}</p>
      )}
    </div>
  );
}
