import { lazy } from "react";
import type { ComponentType } from "react";

// Registry maps calculator slug → lazy component.
export const calculatorComponents: Record<string, ComponentType> = {
  "gst-invoice-calculator": lazy(() =>
    import("@/calculators/GstInvoiceCalculator").then((m) => ({
      default: m.GstInvoiceCalculator,
    })),
  ),
  "gst-calculator-india": lazy(() =>
    import("@/calculators/GstInvoiceCalculator").then((m) => ({
      default: m.GstInvoiceCalculator,
    })),
  ),
  "cgst-sgst-calculator": lazy(() =>
    import("@/calculators/GstInvoiceCalculator").then((m) => ({
      default: m.GstInvoiceCalculator,
    })),
  ),
  "igst-calculator": lazy(() =>
    import("@/calculators/GstInvoiceCalculator").then((m) => ({
      default: m.GstInvoiceCalculator,
    })),
  ),
  "gst-bill-calculator": lazy(() =>
    import("@/calculators/GstInvoiceCalculator").then((m) => ({
      default: m.GstInvoiceCalculator,
    })),
  ),
  "product-profit-calculator": lazy(() =>
    import("@/calculators/ProductProfitCalculator").then((m) => ({
      default: m.ProductProfitCalculator,
    })),
  ),
  "profit-calculator": lazy(() =>
    import("@/calculators/ProductProfitCalculator").then((m) => ({
      default: m.ProductProfitCalculator,
    })),
  ),
  "profit-margin-calculator": lazy(() =>
    import("@/calculators/ProductProfitCalculator").then((m) => ({
      default: m.ProductProfitCalculator,
    })),
  ),
  "product-profit": lazy(() =>
    import("@/calculators/ProductProfitCalculator").then((m) => ({
      default: m.ProductProfitCalculator,
    })),
  ),
  "business-profit-calculator": lazy(() =>
    import("@/calculators/ProductProfitCalculator").then((m) => ({
      default: m.ProductProfitCalculator,
    })),
  ),
  "home-electricity-bill-calculator": lazy(() =>
    import("@/calculators/HomeElectricityBillCalculator").then((m) => ({
      default: m.HomeElectricityBillCalculator,
    })),
  ),
  "appliance-electricity-cost-calculator": lazy(() =>
    import("@/calculators/ApplianceElectricityCostCalculator").then((m) => ({
      default: m.ApplianceElectricityCostCalculator,
    })),
  ),
  "ac-electricity-cost-calculator": lazy(() =>
    import("@/calculators/AcElectricityCostCalculator").then((m) => ({
      default: m.AcElectricityCostCalculator,
    })),
  ),
  "cement-bag-calculator": lazy(() =>
    import("@/calculators/CementBagCalculator").then((m) => ({
      default: m.CementBagCalculator,
    })),
  ),
  "rcc-price-calculator": lazy(() =>
    import("@/calculators/RccPriceCalculator").then((m) => ({
      default: m.RccPriceCalculator,
    })),
  ),
  "gold-making-charges-calculator": lazy(() =>
    import("@/calculators/GoldMakingChargesCalculator").then((m) => ({
      default: m.GoldMakingChargesCalculator,
    })),
  ),
  "gold-jewellery-bill-calculator": lazy(() =>
    import("@/calculators/GoldJewelleryBillCalculator").then((m) => ({
      default: m.GoldJewelleryBillCalculator,
    })),
  ),
  "old-gold-exchange-value-calculator": lazy(() =>
    import("@/calculators/OldGoldExchangeValueCalculator").then((m) => ({
      default: m.OldGoldExchangeValueCalculator,
    })),
  ),
  "old-gold-calculator": lazy(() =>
    import("@/calculators/OldGoldExchangeValueCalculator").then((m) => ({
      default: m.OldGoldExchangeValueCalculator,
    })),
  ),
  "gold-exchange-calculator": lazy(() =>
    import("@/calculators/OldGoldExchangeValueCalculator").then((m) => ({
      default: m.OldGoldExchangeValueCalculator,
    })),
  ),
  "old-gold-value-calculator": lazy(() =>
    import("@/calculators/OldGoldExchangeValueCalculator").then((m) => ({
      default: m.OldGoldExchangeValueCalculator,
    })),
  ),
  "gold-resale-calculator": lazy(() =>
    import("@/calculators/OldGoldExchangeValueCalculator").then((m) => ({
      default: m.OldGoldExchangeValueCalculator,
    })),
  ),
  "silver-jewellery-bill-calculator": lazy(() =>
    import("@/calculators/SilverJewelleryBillCalculator").then((m) => ({
      default: m.SilverJewelleryBillCalculator,
    })),
  ),
  "silver-calculator": lazy(() =>
    import("@/calculators/SilverJewelleryBillCalculator").then((m) => ({
      default: m.SilverJewelleryBillCalculator,
    })),
  ),
  "silver-jewellery-calculator": lazy(() =>
    import("@/calculators/SilverJewelleryBillCalculator").then((m) => ({
      default: m.SilverJewelleryBillCalculator,
    })),
  ),
  "silver-rate-calculator": lazy(() =>
    import("@/calculators/SilverJewelleryBillCalculator").then((m) => ({
      default: m.SilverJewelleryBillCalculator,
    })),
  ),
  "silver-bill-calculator": lazy(() =>
    import("@/calculators/SilverJewelleryBillCalculator").then((m) => ({
      default: m.SilverJewelleryBillCalculator,
    })),
  ),
  "silver-price-calculator": lazy(() =>
    import("@/calculators/SilverJewelleryBillCalculator").then((m) => ({
      default: m.SilverJewelleryBillCalculator,
    })),
  ),
  "gold-purity-karat-converter": lazy(() =>
    import("@/calculators/GoldPurityKaratConverter").then((m) => ({
      default: m.GoldPurityKaratConverter,
    })),
  ),
  "gold-purity-calculator": lazy(() =>
    import("@/calculators/GoldPurityKaratConverter").then((m) => ({
      default: m.GoldPurityKaratConverter,
    })),
  ),
  "gold-karat-converter": lazy(() =>
    import("@/calculators/GoldPurityKaratConverter").then((m) => ({
      default: m.GoldPurityKaratConverter,
    })),
  ),
  "gold-fineness-calculator": lazy(() =>
    import("@/calculators/GoldPurityKaratConverter").then((m) => ({
      default: m.GoldPurityKaratConverter,
    })),
  ),
  "karat-to-percentage-calculator": lazy(() =>
    import("@/calculators/GoldPurityKaratConverter").then((m) => ({
      default: m.GoldPurityKaratConverter,
    })),
  ),
  "916-gold-purity-calculator": lazy(() =>
    import("@/calculators/GoldPurityKaratConverter").then((m) => ({
      default: m.GoldPurityKaratConverter,
    })),
  ),
  "diamond-jewellery-price-calculator": lazy(() =>
    import("@/calculators/DiamondJewelleryPriceCalculator").then((m) => ({
      default: m.DiamondJewelleryPriceCalculator,
    })),
  ),
  "diamond-jewellery-calculator": lazy(() =>
    import("@/calculators/DiamondJewelleryPriceCalculator").then((m) => ({
      default: m.DiamondJewelleryPriceCalculator,
    })),
  ),
  "diamond-price-calculator": lazy(() =>
    import("@/calculators/DiamondJewelleryPriceCalculator").then((m) => ({
      default: m.DiamondJewelleryPriceCalculator,
    })),
  ),
  "diamond-ring-price-calculator": lazy(() =>
    import("@/calculators/DiamondJewelleryPriceCalculator").then((m) => ({
      default: m.DiamondJewelleryPriceCalculator,
    })),
  ),
  "gold-loan-against-jewellery-calculator": lazy(() =>
    import("@/calculators/GoldLoanAgainstJewelleryCalculator").then((m) => ({
      default: m.GoldLoanAgainstJewelleryCalculator,
    })),
  ),
  "gold-loan-calculator": lazy(() =>
    import("@/calculators/GoldLoanAgainstJewelleryCalculator").then((m) => ({
      default: m.GoldLoanAgainstJewelleryCalculator,
    })),
  ),
  "loan-against-gold-calculator": lazy(() =>
    import("@/calculators/GoldLoanAgainstJewelleryCalculator").then((m) => ({
      default: m.GoldLoanAgainstJewelleryCalculator,
    })),
  ),
  "jewellery-loan-calculator": lazy(() =>
    import("@/calculators/GoldLoanAgainstJewelleryCalculator").then((m) => ({
      default: m.GoldLoanAgainstJewelleryCalculator,
    })),
  ),
  "gold-loan-emi-calculator": lazy(() =>
    import("@/calculators/GoldLoanAgainstJewelleryCalculator").then((m) => ({
      default: m.GoldLoanAgainstJewelleryCalculator,
    })),
  ),
  "jewellery-budget-to-weight-calculator": lazy(() =>
    import("@/calculators/JewelleryBudgetToWeightCalculator").then((m) => ({
      default: m.JewelleryBudgetToWeightCalculator,
    })),
  ),
  "jewellery-budget-calculator": lazy(() =>
    import("@/calculators/JewelleryBudgetToWeightCalculator").then((m) => ({
      default: m.JewelleryBudgetToWeightCalculator,
    })),
  ),
  "gold-budget-calculator": lazy(() =>
    import("@/calculators/JewelleryBudgetToWeightCalculator").then((m) => ({
      default: m.JewelleryBudgetToWeightCalculator,
    })),
  ),
  "gold-weight-calculator": lazy(() =>
    import("@/calculators/JewelleryBudgetToWeightCalculator").then((m) => ({
      default: m.JewelleryBudgetToWeightCalculator,
    })),
  ),
  "gold-weight-by-budget-calculator": lazy(() =>
    import("@/calculators/JewelleryBudgetToWeightCalculator").then((m) => ({
      default: m.JewelleryBudgetToWeightCalculator,
    })),
  ),
  "how-much-gold-can-i-buy": lazy(() =>
    import("@/calculators/JewelleryBudgetToWeightCalculator").then((m) => ({
      default: m.JewelleryBudgetToWeightCalculator,
    })),
  ),
  "diamond-calculator": lazy(() =>
    import("@/calculators/DiamondJewelleryPriceCalculator").then((m) => ({
      default: m.DiamondJewelleryPriceCalculator,
    })),
  ),
  "job-offer-comparison-calculator": lazy(() =>
    import("@/calculators/JobOfferCalculator").then((m) => ({ default: m.JobOfferCalculator })),
  ),
  "ctc-to-in-hand-salary-calculator": lazy(() =>
    import("@/calculators/SalaryCalculator").then((m) => ({ default: m.SalaryCalculator })),
  ),
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
  "sleep-calculator": lazy(() =>
    import("@/calculators/SleepCalculator").then((m) => ({
      default: m.SleepCalculator,
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
  "regular-calculator": lazy(() =>
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
  "love-calculator": lazy(() =>
    import("@/calculators/LoveCalculator").then((m) => ({ default: m.LoveCalculator })),
  ),
  "flames-calculator": lazy(() =>
    import("@/calculators/FlamesCalculator").then((m) => ({ default: m.FlamesCalculator })),
  ),
  "couple-age-difference-calculator": lazy(() =>
    import("@/calculators/CoupleAgeDifferenceCalculator").then((m) => ({
      default: m.CoupleAgeDifferenceCalculator,
    })),
  ),
};
