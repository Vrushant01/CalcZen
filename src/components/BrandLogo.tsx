import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  imgClassName?: string;
  labelClassName?: string;
  showLabel?: boolean;
  label?: string;
};

export function BrandLogo({
  className,
  imgClassName,
  labelClassName,
  showLabel = true,
  label = "CalcZen",
}: BrandLogoProps) {
  const isDefaultWordmark = label.trim().toLowerCase() === "calczen";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <img
        src="/brand/calczen-logo.png"
        alt="CalcZen logo"
        className={cn("h-9 w-9 object-contain", imgClassName)}
        loading="eager"
      />
      {showLabel ? (
        isDefaultWordmark ? (
          <span className={cn("truncate text-base sm:text-lg font-bold tracking-tight", labelClassName)}>
            <span className="text-foreground">Calc</span>
            <span className="bg-gradient-to-r from-[#1D56D8] via-[#177FE8] to-[#1BC8FF] bg-clip-text text-transparent">Zen</span>
          </span>
        ) : (
          <span className={cn("truncate text-base sm:text-lg font-bold tracking-tight text-foreground", labelClassName)}>
            {label}
          </span>
        )
      ) : null}
    </span>
  );
}
