"use client";

import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  faqs: FAQItem[];
  answerClassName?: string;
}

interface FaqItemProps {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: (e: React.MouseEvent) => void;
  answerClassName?: string;
}

function FaqItem({ q, a, isOpen, onToggle, answerClassName }: FaqItemProps) {
  const [shouldRenderContent, setShouldRenderContent] = useState(isOpen);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setShouldRenderContent(true);
      // Let the browser render the details content first, then apply the transition
      timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 10);
    } else {
      setIsTransitioning(false);
      // Wait for the transition to finish (300ms) before removing the open attribute
      timer = setTimeout(() => {
        setShouldRenderContent(false);
      }, 300);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <details
      open={shouldRenderContent || isOpen}
      className="py-3 sm:py-3.5 group [&_summary::-webkit-details-marker]:hidden"
    >
      <summary
        onClick={onToggle}
        aria-expanded={isOpen}
        className="cursor-pointer font-medium text-sm sm:text-base flex items-start justify-between gap-3 list-none min-h-[2.75rem] py-0.5 select-none text-left"
      >
        <span className="text-balance pr-1">{q}</span>
        <ChevronRight
          className={cn(
            "h-4 w-4 shrink-0 mt-0.5 transition-transform duration-300",
            isOpen && "rotate-90",
          )}
        />
      </summary>
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen && isTransitioning ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden min-h-0">
          <p
            className={cn(
              "mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed",
              answerClassName,
            )}
          >
            {a}
          </p>
        </div>
      </div>
    </details>
  );
}

export function FaqAccordion({ faqs, answerClassName }: FaqAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleToggle = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="divide-y divide-border">
      {faqs.map((f, idx) => (
        <FaqItem
          key={f.q}
          q={f.q}
          a={f.a}
          isOpen={activeIndex === idx}
          onToggle={(e) => handleToggle(idx, e)}
          answerClassName={answerClassName}
        />
      ))}
    </div>
  );
}
