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
    >
      <Link
        to="/calculator/$slug"
        params={{ slug: calc.slug }}
        className="group block h-full rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-glow hover:border-accent/40 hover:-translate-y-0.5 transition-all"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-accent text-primary-foreground">
            <Icon className="h-5 w-5" />
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
        </div>
        <h3 className="font-semibold text-base mb-1 group-hover:text-accent transition-colors">{calc.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{calc.description}</p>
      </Link>
    </motion.div>
  );
}
