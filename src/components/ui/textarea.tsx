import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
<<<<<<< HEAD
          "flex min-h-[60px] w-full rounded-md border border-input bg-[var(--input-background)] px-3 py-2 text-base shadow-input placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/60 focus-visible:border-accent/40 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-border/50",
=======
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
