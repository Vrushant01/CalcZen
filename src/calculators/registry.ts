import { lazy } from "react";
import type { ComponentType } from "react";

// Registry maps calculator slug → lazy component.
export const calculatorComponents: Record<string, ComponentType> = {
  "mortgage-calculator": lazy(() =>
    import("@/calculators/MortgageCalculator").then((m) => ({ default: m.MortgageCalculator })),
  ),
  "compound-interest-calculator": lazy(() =>
    import("@/calculators/CompoundInterestCalculator").then((m) => ({
      default: m.CompoundInterestCalculator,
    })),
  ),
  "loan-emi-calculator": lazy(() =>
    import("@/calculators/LoanEMICalculator").then((m) => ({ default: m.LoanEMICalculator })),
  ),
  "bmi-calculator": lazy(() =>
    import("@/calculators/BMICalculator").then((m) => ({ default: m.BMICalculator })),
  ),
  "calorie-calculator": lazy(() =>
    import("@/calculators/CalorieCalculator").then((m) => ({ default: m.CalorieCalculator })),
  ),
  "water-intake-calculator": lazy(() =>
    import("@/calculators/WaterIntakeCalculator").then((m) => ({
      default: m.WaterIntakeCalculator,
    })),
  ),
  "pregnancy-due-date-calculator": lazy(() =>
    import("@/calculators/PregnancyDueDateCalculator").then((m) => ({
      default: m.PregnancyDueDateCalculator,
    })),
  ),
  "percentage-calculator": lazy(() =>
    import("@/calculators/PercentageCalculator").then((m) => ({ default: m.PercentageCalculator })),
  ),
  "age-calculator": lazy(() =>
    import("@/calculators/AgeCalculator").then((m) => ({ default: m.AgeCalculator })),
  ),
  "tip-calculator": lazy(() =>
    import("@/calculators/TipCalculator").then((m) => ({ default: m.TipCalculator })),
  ),
  "bmr-calculator": lazy(() =>
    import("@/calculators/BMRCalculator").then((m) => ({ default: m.BMRCalculator })),
  ),
  "standard-calculator": lazy(() =>
    import("@/calculators/StandardCalculator").then((m) => ({ default: m.StandardCalculator })),
  ),
  "scientific-calculator": lazy(() =>
    import("@/calculators/ScientificCalculator").then((m) => ({ default: m.ScientificCalculator })),
  ),
  "retirement-calculator": lazy(() =>
    import("@/calculators/RetirementCalculator").then((m) => ({ default: m.RetirementCalculator })),
  ),
  "401k-calculator": lazy(() =>
    import("@/calculators/401kCalculator").then((m) => ({ default: m.Four01kCalculator })),
  ),
  "sip-calculator": lazy(() =>
    import("@/calculators/SIPCalculator").then((m) => ({ default: m.SIPCalculator })),
  ),
  "fd-calculator": lazy(() =>
    import("@/calculators/FDCalculator").then((m) => ({ default: m.FDCalculator })),
  ),
  "gst-calculator": lazy(() =>
    import("@/calculators/GSTCalculator").then((m) => ({ default: m.GSTCalculator })),
  ),
  "attendance-calculator": lazy(() =>
    import("@/calculators/AttendanceCalculator").then((m) => ({ default: m.AttendanceCalculator })),
  ),
  "cgpa-calculator": lazy(() =>
    import("@/calculators/CGPACalculator").then((m) => ({ default: m.CGPACalculator })),
  ),
  "body-fat-calculator": lazy(() =>
    import("@/calculators/BodyFatCalculator").then((m) => ({ default: m.BodyFatCalculator })),
  ),
  "protein-calculator": lazy(() =>
    import("@/calculators/ProteinCalculator").then((m) => ({ default: m.ProteinCalculator })),
  ),
  "inflation-calculator": lazy(() =>
    import("@/calculators/InflationCalculator").then((m) => ({ default: m.InflationCalculator })),
  ),
  "loan-eligibility-calculator": lazy(() =>
    import("@/calculators/LoanEligibilityCalculator").then((m) => ({
      default: m.LoanEligibilityCalculator,
    })),
  ),
  "credit-card-emi-calculator": lazy(() =>
    import("@/calculators/CreditCardEMICalculator").then((m) => ({
      default: m.CreditCardEMICalculator,
    })),
  ),
};
