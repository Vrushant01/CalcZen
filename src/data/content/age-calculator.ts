import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The Age Calculator calculates your exact chronological age in years, months, and days, as well as total elapsed days, hours, and minutes from your date of birth. It also enables you to calculate your age on any past or future target date, check eligibility for government exams, academic admissions, or insurance policies, and discover the exact countdown to your next birthday.",

  howItWorks:
    "Enter your date of birth and the target date (which defaults to today's date). The calculator compares the calendar dates and applies precise calendar borrowing mathematics. It accounts for leap years (with 366 days), the differing lengths of Gregorian calendar months (28, 29, 30, or 31 days), and daylight boundaries to produce an exact chronological duration breakdown.",

  formula:
    "Calendar Borrowing Age Mathematics:\n\nIf targetDay < birthDay:\n- Borrow days from the previous month (28 to 31 days depending on the specific month).\n- Decrement targetMonth by 1.\n\nIf targetMonth < birthMonth:\n- Borrow 12 months from the target year.\n- Decrement targetYear by 1.\n\nFinal Elapsed Duration:\n- Elapsed Years = targetYear − birthYear\n- Elapsed Months = targetMonth − birthMonth\n- Elapsed Days = targetDay − birthDay\n- Total Days Elapsed = Exact Julian day count between birth date and target date, including all leap years.",

  example:
    "Suppose a person was born on June 15, 1995, and wishes to calculate their exact age on January 10, 2025:\n\n1. Target Day (10) < Birth Day (15): Borrow days from December (31 days). 10 + 31 − 15 = 26 days.\n2. Target Month (0 after borrowing) < Birth Month (6): Borrow 12 months from 2025. 12 − 6 = 6 months.\n3. Target Year (2024 after borrowing) − Birth Year (1995) = 29 years.\n\nTakeaway Result:\n- Exact Age: 29 years, 6 months, and 26 days\n- Total Days Alive: 10,802 days\n- Next Birthday: June 15, 2025 (in 5 months and 5 days)",

  mistakes:
    "A frequent mistake in manual age calculation is assuming every month has 30 days or every year has 365 days. Over several decades, ignoring leap years and varying month lengths can lead to an error of 5 to 10 days. Another common pitfall is entering birthdates in US format (MM/DD/YYYY) instead of Indian standard (DD/MM/YYYY) on official forms. Always confirm the cut-off date specified by competitive examinations or official government notices.",

  faqs: [
    {
      question: "How can I calculate my age on a particular date in the future or past?",
      answer:
        'To calculate your age on a particular date, simply change the "Calculate Age As Of" field to any target date. The tool instantly computes your exact age in years, months, and days on that specific date. This is especially useful for verifying eligibility criteria for competitive government exams, driving licences, passport renewals, or insurance applications.',
    },
    {
      question: "Why do some months have different days and how does the calculator handle leap years?",
      answer:
        "The Gregorian calendar features months with 28, 29, 30, and 31 days, and adds a leap day on February 29 every 4 years. Our calculator tracks the exact calendar days for each specific month in your lifespan, preventing drift errors and guaranteeing that total elapsed days and minutes are completely accurate.",
    },
    {
      question: "How is chronological age different from biological or gestational age?",
      answer:
        'Chronological age is the exact calendar time elapsed since birth. Biological age reflects cellular and physical health, which can be influenced by diet, exercise, and lifestyle. Gestational age, on the other hand, measures fetal development starting from the first day of the mother\'s last menstrual period. To track pregnancy milestones, use our <a href="/calculator/pregnancy-due-date-calculator" class="text-primary hover:underline">Pregnancy Due Date Calculator</a>.',
    },
    {
      question: "How do I calculate the age gap between two people?",
      answer:
        'You can calculate the chronological age between two birth dates, or explore our dedicated <a href="/calculator/couple-age-difference-calculator" class="text-primary hover:underline">Couple Age Difference Calculator</a> to view the exact calendar gap in years, months, and days between partners.',
    },
    {
      question: "How does the birthday countdown work?",
      answer:
        "The birthday countdown identifies your next birthday in the current or upcoming calendar year and computes the exact remaining days, hours, and minutes. It helps you plan celebrations, milestone birthdays, or retirement timelines with absolute precision.",
    },
  ],

  authorityLinks: [
    {
      text: "National Institute on Aging (NIH) Biological vs Chronological Age",
      url: "https://www.nia.nih.gov/",
    },
    {
      text: "World Health Organization (WHO) Ageing and Health Guidelines",
      url: "https://www.who.int/news-room/fact-sheets/detail/ageing-and-health",
    },
  ],

  relatedCalculators: [
    "couple-age-difference-calculator",
    "percentage-calculator",
    "pregnancy-due-date-calculator",
    "tip-calculator",
  ],
};

export default content;
