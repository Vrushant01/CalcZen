import { lazy } from "react";
import type { ComponentType } from "react";

// Registry maps calculator slug → lazy component.
export const calculatorComponents: Record<string, ComponentType> = {
  "mortgage-calculator": lazy(() => import("@/calculators/MortgageCalculator").then(m => ({ default: m.MortgageCalculator }))),
  "compound-interest-calculator": lazy(() => import("@/calculators/CompoundInterestCalculator").then(m => ({ default: m.CompoundInterestCalculator }))),
  "loan-emi-calculator": lazy(() => import("@/calculators/LoanEMICalculator").then(m => ({ default: m.LoanEMICalculator }))),
  "bmi-calculator": lazy(() => import("@/calculators/BMICalculator").then(m => ({ default: m.BMICalculator }))),
  "calorie-calculator": lazy(() => import("@/calculators/CalorieCalculator").then(m => ({ default: m.CalorieCalculator }))),
  "water-intake-calculator": lazy(() => import("@/calculators/WaterIntakeCalculator").then(m => ({ default: m.WaterIntakeCalculator }))),
  "pregnancy-due-date-calculator": lazy(() => import("@/calculators/PregnancyDueDateCalculator").then(m => ({ default: m.PregnancyDueDateCalculator }))),
  "percentage-calculator": lazy(() => import("@/calculators/PercentageCalculator").then(m => ({ default: m.PercentageCalculator }))),
  "age-calculator": lazy(() => import("@/calculators/AgeCalculator").then(m => ({ default: m.AgeCalculator }))),
  "tip-calculator": lazy(() => import("@/calculators/TipCalculator").then(m => ({ default: m.TipCalculator }))),
  "bmr-calculator": lazy(() => import("@/calculators/BMRCalculator").then(m => ({ default: m.BMRCalculator }))),
  "regular-calculator": lazy(() => import("@/calculators/RegularCalculator").then(m => ({ default: m.RegularCalculator }))),
  "scientific-calculator": lazy(() => import("@/calculators/ScientificCalculator").then(m => ({ default: m.ScientificCalculator }))),
};
