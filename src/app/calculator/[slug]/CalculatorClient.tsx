"use client";

import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { calculatorComponents } from "@/calculators/registry";

interface CalculatorClientProps {
  calc: {
    name: string;
    slug: string;
    description: string;
  };
}

export default function CalculatorClient({ calc }: CalculatorClientProps) {
  const Component = calculatorComponents[calc.slug];

  return (
    <PageShell>
      {Component ? (
        <Suspense
          fallback={
            <div className="page-container py-12 sm:py-20">
              <div className="h-64 sm:h-96 rounded-xl sm:rounded-2xl bg-muted/25 animate-pulse" />
            </div>
          }
        >
          <Component />
        </Suspense>
      ) : (
        <div className="page-container max-w-3xl py-16 sm:py-24 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">{calc.name}</h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            This calculator is coming soon.
          </p>
        </div>
      )}
    </PageShell>
  );
}
