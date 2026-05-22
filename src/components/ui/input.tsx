import * as React from "react";

import { cn } from "@/lib/utils";

const inputClassName =
  "flex h-11 sm:h-10 w-full min-w-0 rounded-md border border-input bg-[var(--input-background)] px-3 py-2 text-base shadow-input transition-[color,background-color,border-color,box-shadow] duration-300 ease-out file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/60 focus-visible:border-accent/40 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm dark:border-border/50";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputClassName, className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
