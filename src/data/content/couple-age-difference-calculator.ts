import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The Couple Age Difference Calculator calculates the exact chronological age gap between two partners, spouses, or dating companions in completed years, months, and days. Tailored specifically for relationship and marriage compatibility analysis, it identifies who is older, computes the total calendar days separating both birth dates, and presents both partners' current ages simultaneously. Unlike a general age tool that tracks an individual's personal lifespan, this calculator focuses entirely on the age dynamic and milestone intersections between two individuals.",

  howItWorks:
    "Enter the date of birth for both you and your partner (names are optional). The calculation engine compares the two calendar dates using proleptic Gregorian calendar borrowing algorithms. It accounts for leap years, varying month lengths (28, 29, 30, or 31 days), and produces an exact chronological difference. It also determines which partner is older and reveals the exact number of total days between your birthdays.",

  formula:
    "Exact Relationship Age Gap Mathematics:\n\nChronological Interval:\n- Compare Birth Date 1 and Birth Date 2 to identify the Older Partner (earlier date) and Younger Partner (later date).\n- If Younger Day < Older Day: Borrow calendar days from the preceding month (28 to 31 days).\n- If Younger Month < Older Month: Borrow 12 months from the Younger Year.\n\nFinal Output Values:\n- Gap in Years = Younger Year − Older Year\n- Gap in Months = Younger Month − Older Month\n- Gap in Days = Younger Day − Older Day\n- Total Days Apart = Exact calendar day count elapsed between both birthdates\n\nSociological Milestone Guideline (Half-Your-Age-Plus-Seven Rule):\n- Minimum Social Age Benchmark = (Older Partner's Age ÷ 2) + 7",

  example:
    "Suppose Partner A was born on September 12, 1992, and Partner B was born on April 25, 1996:\n\n1. Identify Older Partner: Partner A is older (born September 12, 1992).\n2. Calendar Borrowing:\n   - Days: April 25 − September 12 = 13 days.\n   - Months: Borrow 12 months to compute difference from September to April = 7 months.\n   - Years: 1995 (after borrowing) − 1992 = 3 years.\n\nTakeaway Results:\n- Exact Age Gap: 3 years, 7 months, and 13 days\n- Older Partner: Partner A\n- Total Days Apart: 1,321 days\n- Half-Your-Age-Plus-Seven Boundary: Minimum ideal partner age for a 32-year-old is (32 ÷ 2) + 7 = 23 years old.",

  mistakes:
    "The most frequent mistake when comparing relationship ages is simply subtracting the birth years (e.g., 1996 − 1992 = 4 years). This rough estimation completely ignores the birth months and days, often skewing the true age gap by nearly an entire year. Another common pitfall is confusing this partner comparison tool with our individual Age Calculator; if you simply need your personal chronological age or countdown to your next birthday, use our dedicated Age Calculator.",

  faqs: [
    {
      question: "How is the age difference between two partners calculated?",
      answer:
        "The calculator compares both birth dates and applies calendar borrowing mathematics to determine the exact elapsed duration in completed years, months, and days. It accounts for leap days and varying month lengths to ensure zero drift.",
    },
    {
      question: "How does this tool differ from the standard individual Age Calculator?",
      answer:
        'The individual <a href="/calculator/age-calculator" class="text-primary hover:underline">Age Calculator</a> determines a single person\'s chronological age, total hours lived, and countdown to their next birthday. The Couple Age Difference Calculator compares two distinct birthdates to determine the precise gap between partners, who is older, and relationship milestone ages.',
    },
    {
      question: "Does the order in which we enter our birth dates matter?",
      answer:
        "No. You can enter the dates in either order. The calculator automatically analyzes both dates, identifies who was born first, and displays the positive age gap alongside a clear indicator of who is older.",
    },
    {
      question: "What is the half-your-age-plus-seven rule in relationships?",
      answer:
        "The 'half-your-age-plus-seven' rule is a widely referenced cultural heuristic that posits the minimum socially acceptable dating age is half your age plus seven years. For example, a 30-year-old would date someone at least 22 years old ((30 ÷ 2) + 7).",
    },
    {
      question: "What is the average age difference between couples in marriage?",
      answer:
        "Demographic studies across global populations indicate that the median age difference between heterosexual married couples is roughly 2 to 3 years, with the male partner typically being older. However, age differences of 5 to 10+ years are common and widely observed across various cultures.",
    },
    {
      question: "Can I use this calculator if my partner and I were born in the same year?",
      answer:
        "Yes! If you were born in the same year, the calculator returns an age gap of 0 years and details the exact difference in months and days, as well as the total days separating your births.",
    },
  ],

  authorityLinks: [
    {
      text: "Pew Research Center - Age Differences in Dating and Marriage",
      url: "https://www.pewresearch.org/social-trends/",
    },
    {
      text: "Demographic Research Journal - Spousal Age Gaps & Relationship Longevity",
      url: "https://www.demographic-research.org/",
    },
  ],

  relatedCalculators: [
    "age-calculator",
    "love-calculator",
    "flames-calculator",
    "percentage-calculator",
  ],
};

export default content;
