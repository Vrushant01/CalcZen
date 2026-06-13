import * as React from "react";

import { cn } from "@/lib/utils";

const inputClassName =
  "flex h-11 sm:h-10 w-full min-w-0 rounded-md border border-input bg-[var(--input-background)] px-3 py-2 text-base shadow-input transition-[color,background-color,border-color,box-shadow] duration-300 ease-out file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/60 focus-visible:border-accent/40 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm dark:border-border/50";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const originalValue = e.target.value;

      // Determine if the value represents a numeric format (e.g. integer, float, negative, or blank)
      const isNumeric = type === "number" || (originalValue && /^-?\d*\.?\d*$/.test(originalValue));

      if (isNumeric) {
        const sanitizedValue = originalValue.replace(/^(-?)0+(?=\d)/, "$1");

        if (originalValue !== sanitizedValue) {
          let selectionStart: number | null = null;
          let selectionEnd: number | null = null;
          const originalLen = originalValue.length;

          if (type !== "number") {
            try {
              selectionStart = e.target.selectionStart;
              selectionEnd = e.target.selectionEnd;
            } catch (err) {
              // ignore
            }
          }

          e.target.value = sanitizedValue;

          if (type !== "number" && selectionStart !== null && selectionEnd !== null) {
            const diff = originalLen - sanitizedValue.length;
            const newStart = Math.max(0, selectionStart - diff);
            const newEnd = Math.max(0, selectionEnd - diff);
            try {
              // Defer cursor update to the end of the current call stack to ensure React paint
              setTimeout(() => {
                e.target.setSelectionRange(newStart, newEnd);
              }, 0);
            } catch (err) {
              // ignore
            }
          }
        }
      }

      if (onChange) {
        onChange(e);
      }
    };

    return (
      <input
        type={type}
        className={cn(inputClassName, className)}
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
