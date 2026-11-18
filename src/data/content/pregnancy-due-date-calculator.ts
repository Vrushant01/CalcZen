import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The Pregnancy Due Date Calculator estimates your baby's expected date of delivery (EDD), tracks current gestational age in completed weeks and days, and outlines trimester transitions using established obstetrical standards. Based on Naegele's rule and clinical obstetrics protocols endorsed by the American College of Obstetricians and Gynecologists (ACOG), this tool converts the first day of your last menstrual period (LMP) and your unique cycle length into an accurate developmental timeline for prenatal care, ultrasound scheduling, and birth planning.",

  howItWorks:
    "Enter the first day of your Last Menstrual Period (LMP) and your average menstrual cycle length (defaulting to the standard 28 days). The calculator applies Naegele's rule by adding 280 days (40 weeks) to your LMP, calibrating the date forward or backward if your cycle deviates from 28 days. It determines your current gestational week, days elapsed, days remaining until delivery, and highlights critical milestones such as dating scans, anatomy ultrasounds, and trimester boundaries.",

  formula:
    "Naegele's Calculation Rule:\nEstimated Due Date (EDD) = LMP Date + 1 Year − 3 Months + 7 Days + (Menstrual Cycle Length − 28 Days)\n\nGestational Milestones Calculation:\n- Current Gestational Age = Current Date − LMP Date (in completed weeks + days)\n- Conception Estimate ≈ LMP Date + 14 Days (for a standard 28-day cycle)\n- First Trimester: Weeks 1 through 13\n- Second Trimester: Weeks 14 through 27\n- Third Trimester: Weeks 28 through 40+",

  example:
    "Suppose an expectant mother's last menstrual period began on May 10, 2025, with an average 30-day menstrual cycle:\n\n1. Baseline Naegele's Rule: May 10 + 1 year (May 10, 2026) − 3 months (Feb 10, 2026) + 7 days = February 17, 2026.\n2. Cycle Adjustment: 30 days − 28 days = +2 days.\n3. Final Estimated Delivery Date: February 19, 2026.\n\nTakeaway Milestones:\n- Full 40 Weeks Due Date: February 19, 2026\n- Estimated Conception Window: May 24 – May 26, 2025\n- End of First Trimester (13 Weeks): August 9, 2025\n- Anatomy Scan Target Window: Weeks 18 to 22 (Mid-September to Mid-October 2025)",

  mistakes:
    "A frequent misconception is assuming babies are always born exactly on their estimated due date. In clinical reality, only about 4% to 5% of deliveries occur precisely on the predicted EDD, while full-term births routinely occur anywhere between 37 weeks and 42 weeks. Another common error is confusing gestational age (which starts from the mother's LMP) with conceptual age (fetal age, which is roughly two weeks shorter). Always confirm your clinical timeline with an early first-trimester crown-rump length (CRL) ultrasound scan.",

  faqs: [
    {
      question: "How accurate is the estimated due date calculated from the LMP?",
      answer:
        "The LMP-based calculation provides a reliable clinical estimate assuming a regular 28-day cycle. In modern obstetrics, a first-trimester dating ultrasound (measuring the crown-rump length between 8 and 13 weeks) is considered the most accurate method and can refine the EDD if discrepancies exceed 5 to 7 days.",
    },
    {
      question: "What is Naegele's rule and why does cycle length matter?",
      answer:
        "Naegele's rule is the clinical gold standard that models human pregnancy as 280 days (40 weeks) from the first day of the last menstrual period. Because ovulation typically occurs 14 days prior to the next expected period, longer or shorter menstrual cycles shift ovulation and conception, which our calculator factors into your final delivery date.",
    },
    {
      question: "What are the three trimesters of pregnancy?",
      answer:
        "Human pregnancy spans 40 weeks divided into three trimesters: The First Trimester covers Week 1 to Week 13 (fetal organogenesis); the Second Trimester covers Week 14 to Week 27 (rapid anatomical growth and movement); and the Third Trimester covers Week 28 through delivery (weight gain and lung maturation).",
    },
    {
      question: "What is the difference between gestational age and fetal age?",
      answer:
        "Gestational age is measured from the first day of your last menstrual period and is the standard measure used by OB-GYNs. Fetal (conceptional) age is the actual age of the developing fetus, which begins at fertilization—typically about two weeks after your LMP.",
    },
    {
      question: "How can I support maternal wellness during pregnancy?",
      answer:
        'Maintaining adequate hydration and healthy maternal nutrition is essential for amniotic fluid volume and placental health. Monitor your daily hydration targets using our <a href="/calculator/water-intake-calculator" class="text-primary hover:underline">Water Intake Calculator</a> or estimate foundational energy expenditure with our <a href="/calculator/bmr-calculator" class="text-primary hover:underline">BMR Calculator</a>.',
    },
  ],

  authorityLinks: [
    {
      text: "American College of Obstetricians and Gynecologists (ACOG) Methods for Estimating Due Date",
      url: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date",
    },
    {
      text: "NHS UK Due Date and Pregnancy Timeline Guide",
      url: "https://www.nhs.uk/pregnancy/finding-out/due-date-calculator/",
    },
  ],

  relatedCalculators: [
    "water-intake-calculator",
    "bmi-calculator",
    "calorie-calculator",
    "sleep-calculator",
  ],
};

export default content;
