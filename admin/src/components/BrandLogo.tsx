type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  showLabel?: boolean;
  labelClassName?: string;
};

export function BrandLogo({
  className,
  imageClassName,
  showLabel = true,
  labelClassName,
}: BrandLogoProps) {
  return (
    <span className={className ?? "inline-flex items-center gap-2.5"}>
      <img
        src="/brand/calczen-logo.png"
        alt="CalcZen logo"
        className={imageClassName ?? "h-9 w-9 object-contain"}
        loading="eager"
      />
      {showLabel ? (
        <span className={labelClassName ?? "text-xl font-bold tracking-tight"}>
          <span className="text-white">Calc</span>
          <span className="bg-gradient-to-r from-[#1D56D8] via-[#177FE8] to-[#1BC8FF] bg-clip-text text-transparent">Zen</span>
        </span>
      ) : null}
    </span>
  );
}
