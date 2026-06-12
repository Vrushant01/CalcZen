import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { CalculatorMeta } from "@/data/calculators";

export function CalculatorCard({ calc, index = 0 }: { calc: CalculatorMeta; index?: number }) {
  const Icon = calc.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="h-full"
    >
      <Link
        to="/calculator/$slug"
        params={{ slug: calc.slug }}
        className="group relative surface-card flex flex-col justify-between rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:-translate-y-1 min-w-0 active:scale-[0.99] transition-transform h-[160px] sm:h-[175px]"
      >
        <div className="flex flex-col items-start min-w-0 w-full">
          {/* Icon */}
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-accent text-primary-foreground shadow-glow transition-shadow duration-300 group-hover:shadow-glow-lg mb-2.5 sm:mb-3">
            <Icon className="h-4.5 w-4.5 sm:h-5 w-5" />
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-1.5 group-hover:text-accent transition-colors truncate w-full pr-6">
            {calc.name}
          </h3>

          {/* Description clamped: max 3 lines on mobile, max 2 lines on desktop */}
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 md:line-clamp-2 w-full leading-normal">
            {calc.description}
          </p>

          {/* AEO Hidden Structured Metadata */}
          <div className="sr-only" aria-hidden="true">
            <span data-aeo="calculator-type">{calc.calculatorType || "calculator"}</span>
            <span data-aeo="category">{calc.category}</span>
            <span data-aeo="use-cases">{calc.useCases?.join(", ")}</span>
            <span data-aeo="keywords">{calc.keywords.join(", ")}</span>
          </div>
        </div>

        {/* Uniform Arrow Position */}
        <ArrowRight className="absolute top-4 right-4 sm:top-5 sm:right-5 h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
      </Link>
    </motion.div>
  );
}
