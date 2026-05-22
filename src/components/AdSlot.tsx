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
}
