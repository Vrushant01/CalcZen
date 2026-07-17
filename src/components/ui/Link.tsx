"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to?: string;
  href?: string;
  params?: Record<string, string | number>;
  activeProps?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, href, params, activeProps, className, children, ...props }, ref) => {
    const pathname = usePathname();
    let targetHref = href || to || "/";
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        targetHref = targetHref.replace(`$${key}`, String(value));
        targetHref = targetHref.replace(`:${key}`, String(value));
      });
    }
    const isActive = pathname === targetHref;

    const mergedClassName =
      isActive && activeProps?.className
        ? `${className || ""} ${activeProps.className}`.trim()
        : className;

    const mergedProps = {
      ...props,
      ...(isActive ? activeProps : {}),
      className: mergedClassName,
    };

    return (
      <NextLink href={targetHref} ref={ref} {...mergedProps}>
        {children}
      </NextLink>
    );
  }
);

Link.displayName = "Link";
