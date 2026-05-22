<<<<<<< HEAD
/**
 * Google AdSense (or similar) — enable when approved.
 * Renders nothing until a slot ID / script is configured, so the layout
 * has no reserved empty space. Import and place only where ads should run.
 */
export type AdSlotVariant = "leaderboard" | "rectangle" | "in-content" | "sticky-mobile";

type AdSlotProps = {
  variant?: AdSlotVariant;
  className?: string;
  /** Future: AdSense data-ad-slot or unit id */
  slotId?: string;
};

export function AdSlot(_props: AdSlotProps) {
  return null;
=======
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
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
}
