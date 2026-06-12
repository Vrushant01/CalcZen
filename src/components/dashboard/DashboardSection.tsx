import { cn } from "@/lib/utils";

type Props = {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleRight?: React.ReactNode;
};

export function DashboardSection({ title, children, className, titleRight }: Props) {
  return (
    <div className={cn("dashboard-section flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between gap-4">
        <h3 className="dashboard-section-title text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
        {titleRight && <div className="shrink-0">{titleRight}</div>}
      </div>
      {children}
    </div>
  );
}
