// ADSENSE SLOT — wire data-ad-slot when AdSense is approved.
// Reserves space to avoid CLS.
type Props = { variant?: "leaderboard" | "rectangle" | "in-content" | "sticky-mobile"; className?: string };

const sizes: Record<NonNullable<Props["variant"]>, string> = {
  "leaderboard": "h-[90px] md:h-[90px]",
  "rectangle": "h-[250px]",
  "in-content": "h-[200px] md:h-[280px]",
  "sticky-mobile": "h-[60px]",
};

export function AdSlot({ variant = "in-content", className = "" }: Props) {
  return (
    <div
      className={`w-full ${sizes[variant]} flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 text-xs text-muted-foreground ${className}`}
      aria-label="Advertisement"
    >
      Advertisement
    </div>
  );
}
