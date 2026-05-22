<<<<<<< HEAD
=======
"use client";

>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

<<<<<<< HEAD
const selectTriggerClassName =
  "group flex h-11 sm:h-10 w-full min-w-0 items-center justify-between gap-2 whitespace-nowrap rounded-lg border border-input bg-[var(--input-background)] px-3.5 py-2 text-sm font-medium shadow-input ring-offset-background transition-[border-color,box-shadow,background-color] duration-200 ease-out cursor-pointer data-[placeholder]:text-muted-foreground hover:border-accent/30 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-accent/40 data-[state=open]:border-accent/50 data-[state=open]:ring-2 data-[state=open]:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 dark:border-border/50 [&>span]:line-clamp-1";

=======
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
<<<<<<< HEAD
  <SelectPrimitive.Trigger ref={ref} className={cn(selectTriggerClassName, className)} {...props}>
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-data-[state=open]:rotate-180" />
=======
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
<<<<<<< HEAD
    className={cn("flex cursor-default items-center justify-center py-1.5 text-muted-foreground", className)}
=======
    className={cn("flex cursor-default items-center justify-center py-1", className)}
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
<<<<<<< HEAD
    className={cn("flex cursor-default items-center justify-center py-1.5 text-muted-foreground", className)}
=======
    className={cn("flex cursor-default items-center justify-center py-1", className)}
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

<<<<<<< HEAD
const selectContentClassName =
  "relative z-50 max-h-[min(var(--radix-select-content-available-height),18rem)] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-border/70 bg-popover text-popover-foreground shadow-glow-lg p-1.5 dark:border-border/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-[0.98] data-[state=open]:zoom-in-[0.98] data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 duration-200 origin-[--radix-select-content-transform-origin]";

=======
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
<<<<<<< HEAD
      className={cn(selectContentClassName, position === "popper" && "data-[side=bottom]:translate-y-1", className)}
=======
      className={cn(
        "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
<<<<<<< HEAD
      <SelectPrimitive.Viewport className="p-0.5">{children}</SelectPrimitive.Viewport>
=======
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
<<<<<<< HEAD
    className={cn("px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground", className)}
=======
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

<<<<<<< HEAD
const selectItemClassName =
  "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2.5 pl-3 pr-9 text-sm outline-none transition-colors duration-150 ease-out focus:bg-muted/80 focus:text-foreground data-[highlighted]:bg-muted/80 data-[highlighted]:text-foreground data-[state=checked]:bg-accent/15 data-[state=checked]:font-medium data-[state=checked]:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

=======
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
<<<<<<< HEAD
  <SelectPrimitive.Item ref={ref} className={cn(selectItemClassName, className)} {...props}>
    <span className="absolute right-2.5 flex h-4 w-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4 text-accent" strokeWidth={2.5} />
=======
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
<<<<<<< HEAD
  <SelectPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-border/60", className)} {...props} />
=======
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
