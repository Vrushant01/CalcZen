import { cn } from "@/lib/utils";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  /** Vertical padding preset */
  spacing?: "default" | "tight" | "legal";
};

/** Consistent max-width, horizontal padding, and overflow-safe page wrapper */
export function PageContainer({ children, className, spacing = "default" }: PageContainerProps) {
  const spacingClass = {
    default: "py-6 sm:py-8 md:py-10",
    tight: "py-5 sm:py-6",
    legal: "py-10 sm:py-14 md:py-16",
  }[spacing];

  return (
    <div className={cn("page-container min-w-0", spacingClass, className)}>{children}</div>
  );
}
