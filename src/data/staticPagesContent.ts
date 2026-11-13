export interface StaticSection {
  title: string;
  paragraphs?: string[];
  listItems?: string[];
  subsections?: {
    title: string;
    paragraphs?: string[];
    listItems?: string[];
  }[];
}

export interface StaticPageData {
  title: string;
  description: string;
  canonical: string;
  h1: string;
  intro?: string;
  lastUpdated?: string;
  sections: StaticSection[];
}

export const staticPagesContent: Record<string, StaticPageData> = {
  about: {
    title: "About CalcZen — Free Online Calculators for Finance, Health & Math",
    description:
      "Learn about CalcZen and our mission to deliver free, accurate online calculators with transparent formulas, clear methods, and a clean user experience.",
    canonical: "https://www.calczen.in/about",
    h1: "About CalcZen",
    intro:
      "CalcZen is a free calculator platform for everyday financial, health, and math questions—built to be fast, accurate, and clear about how every result is calculated.",
    sections: [
      {
        title: "Our mission",
        paragraphs: [
          "Calculator sites are often cluttered or opaque. CalcZen focuses on what matters: a clean interface, standard formulas, and results you can understand—not just copy.",
          "Whether you estimate a mortgage payment, check calorie needs, or solve a quick percentage, we aim to deliver reliable online calculators that respect your time.",
        ],
      },
      {
        title: "What we offer",
        paragraphs: ["Free calculator tools across four areas:"],
        listItems: [
          "Finance — mortgages, loans, EMI, compound interest, and related planning tools",
          "Health — BMI, calories, BMR, water intake, and wellness estimates",
          "Math — percentages, ratios, and practical number problems",
          "Everyday — tips, dates, and other daily helpers",
        ],
        subsections: [
          {
            title: "Directory",
            paragraphs: [
              "See everything on our all calculators page or browse by category from the homepage.",
            ],
          },
        ],
      },
      {
        title: "Accuracy and transparency",
        paragraphs: [
          "Each tool uses widely accepted formulas. Where helpful, we show the math, worked examples, and FAQs so you can verify the logic.",
          "Results are estimates. Taxes, fees, health conditions, and personal circumstances can change real outcomes. Use CalcZen as a starting point—not a substitute for professional advice when stakes are high.",
        ],
      },
      {
        title: "Built for you",
        listItems: [
          "Fast — instant updates as you type, without unnecessary reloads",
          "Mobile-friendly — works well on phone, tablet, and desktop",
          "No account — use any calculator immediately; inputs stay in your browser during a session",
          "Educational — we explain the math, especially for finance and health topics where context matters",
        ],
      },
      {
        title: "How we stay free",
        paragraphs: [
          "CalcZen is supported by advertising and privacy-conscious analytics. We do not sell your personal data. Details on cookies, Google Analytics, and Google AdSense are in our Privacy Policy.",
        ],
      },
      {
        title: "Get in touch",
        paragraphs: [
          "Suggestions, bug reports, and feedback are welcome on our contact page. For use limitations, see our Terms of Service and Disclaimer.",
        ],
      },
    ],
  },

  contact: {
    title: "Contact CalcZen — We'd Love to Hear From You",
    description:
      "Get in touch with the CalcZen team. Suggest a new calculator, report a bug, or send us feedback. We reply to all inquiries within 48 hours.",
    canonical: "https://www.calczen.in/contact",
    h1: "Contact us",
    intro: "Have a calculator request or feedback? Drop us a line.",
    sections: [
      {
        title: "Send Us a Message",
        paragraphs: [
          "Have questions, feedback, or suggestions for new calculators? Reach out to us using the contact form or send us an email. We read every message and look forward to hearing from you.",
        ],
      },
      {
        title: "Response Times & Support",
        paragraphs: [
          "We value your feedback and suggestion requests. Our team reviews every submission and typically replies within 24 to 48 business hours. For general inquiries, reporting calculator errors, or suggesting new mathematical or financial simulation tools, please fill out the form above.",
        ],
      },
    ],
  },

  privacy: {
    title: "Privacy Policy — How CalcZen Handles Your Data",
    description:
      "Read the CalcZen Privacy Policy to learn how we handle cookies, Google Analytics, Google AdSense, data protection, and your personal privacy rights.",
    canonical: "https://www.calczen.in/privacy",
    h1: "Privacy Policy",
    lastUpdated: "May 2026",
    intro:
      "This policy explains how CalcZen collects, uses, and protects information when you use our website and free online calculators. We aim to be transparent and handle data responsibly.",
    sections: [
      {
        title: "Overview",
        paragraphs: [
          "You can use CalcZen without an account. Calculator inputs are processed in your browser; we do not require you to submit personal financial or health data to use our tools.",
          "Like most websites, we use limited technical data and cookies to operate the site, understand usage, and (where enabled) display advertising that helps keep our calculators free.",
        ],
      },
      {
        title: "Information we collect",
        subsections: [
          {
            title: "What you provide",
            listItems: [
              "Name, email, and message when you use our contact form",
              "Email if you subscribe to a newsletter (unsubscribe anytime)",
            ],
          },
          {
            title: "What is collected automatically",
            paragraphs: ["We or our providers may receive:"],
            listItems: [
              "Browser, device, and operating system type",
              "Pages viewed, referral source, and general usage patterns",
              "IP address (often truncated or anonymized by analytics)",
              "Cookie identifiers, where applicable",
            ],
          },
        ],
        paragraphs: [
          "We do not intentionally collect sensitive personal data through calculator use. Avoid entering information you do not want processed in your browser session.",
        ],
      },
      {
        title: "How we use information",
        listItems: [
          "Operate and improve CalcZen and our accurate calculator tools",
          "Respond to contact and newsletter requests",
          "Understand which calculators are most useful (analytics)",
          "Display and measure advertising, where applicable",
          "Protect against abuse, fraud, and technical issues",
          "Meet legal obligations",
        ],
        paragraphs: [
          "We do not sell your personal information to third parties for their marketing purposes.",
        ],
      },
      {
        title: "Cookies",
        paragraphs: [
          "Cookies are small files stored on your device. CalcZen and partners may use them for preferences, traffic measurement, and advertising.",
        ],
        listItems: [
          "Essential — basic functionality (e.g. theme or security features)",
          "Analytics — aggregated understanding of how the site is used",
          "Advertising — deliver and measure ads; may support relevance in some cases",
        ],
        subsections: [
          {
            title: "Cookie Control",
            paragraphs: [
              "Control or delete cookies in your browser settings. Blocking some cookies may limit certain features.",
            ],
          },
        ],
      },
      {
        title: "Analytics",
        paragraphs: [
          "We may use Google Analytics or similar services for aggregated usage statistics—such as which finance, health, or math calculator pages are visited.",
          "Data is used in summary form to improve content and performance. Where supported, we use settings intended to reduce individual identification (e.g. IP anonymization).",
        ],
      },
      {
        title: "Advertising and Google AdSense",
        paragraphs: [
          "CalcZen may show ads from Google AdSense or other partners to help cover costs. Partners may use cookies to:",
        ],
        listItems: [
          "Serve ads on CalcZen and other sites you visit",
          "Measure performance and prevent fraud",
          "Show more relevant ads depending on your settings",
        ],
        subsections: [
          {
            title: "Ad Settings",
            paragraphs: [
              "Google and its partners may use advertising cookies based on your visit here and elsewhere. Learn more via Google’s privacy and ads settings; you may opt out of personalized ads through your Google Account or industry tools where available.",
              "Ad vendors are responsible for their own practices—review their policies when relevant.",
            ],
          },
        ],
      },
      {
        title: "Third-party services",
        paragraphs: [
          "We may use providers for hosting, analytics, email, and advertising. They process data on our behalf under their terms and applicable law.",
          "External links are not under our control. Review their privacy policies before sharing personal information.",
        ],
      },
      {
        title: "Retention and security",
        paragraphs: [
          "We keep information only as long as needed—for example, contact messages for a reasonable response period, or analytics in aggregated form for trends.",
          "We apply reasonable measures against unauthorized access or misuse. No internet transmission is completely secure; we cannot guarantee absolute security.",
        ],
      },
      {
        title: "Your rights",
        paragraphs: ["Depending on your location, you may have rights to:"],
        listItems: [
          "Access, correct, or delete certain personal information",
          "Object to or restrict some processing",
          "Withdraw consent (e.g. marketing emails)",
        ],
        subsections: [
          {
            title: "Exercising Rights",
            paragraphs: [
              "Contact us via the contact page. We respond within a reasonable timeframe.",
            ],
          },
        ],
      },
      {
        title: "Children and international visitors",
        paragraphs: [
          "CalcZen is for a general audience. We do not knowingly collect personal information from children under 13 (or the applicable age in your region). Contact us if you believe a child has submitted data.",
          "If you access the site from abroad, data may be processed where our providers operate, subject to this policy.",
        ],
      },
      {
        title: "Policy updates and contact",
        paragraphs: [
          "We may update this policy; the date above will change. Continued use after updates means you accept the revised policy.",
          "Privacy questions: contact us. Use of the site is also governed by our Terms of Service.",
        ],
      },
    ],
  },

  terms: {
    title: "Terms of Service — Using CalcZen Calculators",
    description:
      "Read the CalcZen Terms of Service governing your use of our free calculators. Learn about rules, usage limits, intellectual property, and liability.",
    canonical: "https://www.calczen.in/terms",
    h1: "Terms of Service",
    lastUpdated: "May 2026",
    intro:
      "These Terms govern your use of CalcZen—including all free online calculators and related content. By using the site, you agree to these Terms.",
    sections: [
      {
        title: "About CalcZen",
        paragraphs: [
          "CalcZen provides free calculator tools for finance, health, math, and everyday use, for informational and educational purposes. These Terms apply to all visitors.",
        ],
      },
      {
        title: "Acceptable use",
        paragraphs: ["You agree to use CalcZen lawfully. You must not:"],
        listItems: [
          "Violate applicable laws or regulations",
          "Disrupt, overload, scrape, or reverse-engineer the site without permission",
          "Redistribute substantial content or tools commercially without authorization",
          "Use automated extraction that harms performance or other users",
          "Introduce malware or attempt unauthorized access",
        ],
      },
      {
        title: "Educational purpose",
        paragraphs: [
          "Calculators produce estimates from your inputs and standard formulas on each page. They help you explore scenarios—not replace professional judgment.",
          "Nothing on CalcZen is financial, investment, tax, legal, or medical advice. See our Disclaimer.",
        ],
      },
      {
        title: "Accuracy",
        paragraphs: [
          "We work to keep formulas and logic correct, but we do not warrant that any calculator or result is complete, error-free, or right for your situation.",
          "Verify important results and seek professional advice when decisions have significant financial, legal, or health consequences.",
        ],
      },
      {
        title: "Your responsibility",
        paragraphs: [
          "You are responsible for how you use CalcZen and any decisions based on calculator output. Confirm critical figures independently before acting on them.",
        ],
      },
      {
        title: "Intellectual property",
        paragraphs: [
          "Site content—text, design, branding, layout, and calculator presentation—is protected by applicable intellectual property laws unless otherwise noted.",
          "Personal, non-commercial use is permitted in line with these Terms. Commercial copying, modification, or distribution requires prior written permission, except as allowed by law.",
          "Third-party names and trademarks belong to their owners. References to analytics or ad providers do not imply endorsement.",
        ],
      },
      {
        title: "Third-party links",
        paragraphs: [
          "External links and services (analytics, advertising, etc.) are not controlled by CalcZen. Use them at your own risk under their terms and policies.",
        ],
      },
      {
        title: "Availability",
        paragraphs: [
          "We aim for reliable access but do not guarantee uninterrupted service. We may modify, suspend, or remove any calculator or feature without notice. Maintenance or events beyond our control may affect availability.",
        ],
      },
      {
        title: "Limitation of liability",
        paragraphs: [
          "To the fullest extent permitted by law, CalcZen is not liable for indirect, incidental, special, consequential, or punitive damages from your use—including loss of profits, data, or goodwill—even if advised of the possibility.",
          "Total liability for any claim shall not exceed the greater of (a) amounts you paid us in the twelve months before the claim (typically zero) or (b) one hundred U.S. dollars (USD $100), where permitted.",
        ],
      },
      {
        title: "Indemnification",
        paragraphs: [
          "You agree to indemnify CalcZen from claims arising from your misuse of the site or violation of these Terms, to the extent permitted by law.",
        ],
      },
      {
        title: "Privacy",
        paragraphs: [
          "Data practices are described in our Privacy Policy, incorporated into these Terms by reference.",
        ],
      },
      {
        title: "Changes, governing law, and contact",
        paragraphs: [
          "We may update these Terms; the date above reflects the latest version. Continued use means acceptance. Material changes may be noted on the site where practical.",
          "These Terms are governed by applicable laws where CalcZen operates, without regard to conflict-of-law rules, subject to mandatory consumer protections in your country.",
          "Questions? Visit our contact page.",
        ],
      },
    ],
  },

  disclaimer: {
    title: "Disclaimer — Calculator Use & Limitations | CalcZen",
    description:
      "Read the CalcZen disclaimer regarding our free online calculators. Understand the limitations, informational intent, and terms of calculator results.",
    canonical: "https://www.calczen.in/disclaimer",
    h1: "Disclaimer",
    lastUpdated: "May 2026",
    intro:
      "CalcZen calculators help you estimate and learn—they are not a substitute for professional advice. Please read these limits before using finance, health, or math tools on this site.",
    sections: [
      {
        title: "Informational use only",
        paragraphs: [
          "All calculators and content are for general information and education. They help you explore scenarios and understand formulas—not personalized professional guidance.",
          "By using CalcZen, you agree to this Disclaimer, our Terms of Service, and Privacy Policy.",
        ],
      },
      {
        title: "Not professional advice",
        paragraphs: ["Calculator results do not constitute:"],
        listItems: [
          "Financial, investment, tax, or accounting advice",
          "Medical, nutritional, or mental health advice",
          "Legal advice or any regulated professional service",
        ],
        subsections: [
          {
            title: "Seek Expert Counsel",
            paragraphs: [
              "Consult a qualified professional—financial adviser, accountant, physician, dietitian, or attorney—before important decisions in those areas.",
            ],
          },
        ],
      },
      {
        title: "Accuracy and limitations",
        paragraphs: ["We use recognized formulas and clear explanations, but:"],
        listItems: [
          "Results depend on the values you enter",
          "Fees, taxes, regional rules, and personal circumstances may differ",
          "Health estimates are population-level guides, not diagnoses",
          "Occasional software or browser issues may affect output",
        ],
        subsections: [
          {
            title: "Independent Verification",
            paragraphs: [
              "We do not guarantee completeness or suitability for your situation. Verify important figures independently.",
            ],
          },
        ],
      },
      {
        title: "Finance calculators",
        paragraphs: [
          "Mortgage, loan EMI, and compound interest tools produce planning estimates. They may omit insurance, closing costs, variable rates, penalties, or tax treatment. Do not rely solely on CalcZen for binding financial commitments.",
        ],
      },
      {
        title: "Health calculators",
        paragraphs: [
          "BMI, BMR, calorie, and water tools are not medical devices. Individual needs vary. Speak with a healthcare provider for medical conditions, pregnancy, or major diet or fitness changes.",
        ],
      },
      {
        title: "Math and everyday tools",
        paragraphs: [
          "Math and general calculators are convenience aids. Double-check when precision matters—contracts, billing, payroll, or compliance.",
        ],
      },
      {
        title: "Limitation of liability",
        paragraphs: [
          "To the fullest extent permitted by law, CalcZen disclaims liability for loss or harm from use of the site or reliance on results—including financial, health, or business outcomes. Use is at your own risk.",
        ],
      },
      {
        title: "External links",
        paragraphs: [
          "Third-party links are for convenience. We do not endorse or control external content, products, or services.",
        ],
      },
      {
        title: "Updates and contact",
        paragraphs: [
          "We may revise this Disclaimer; the date above reflects the latest version. Continued use means you accept updates.",
          "Questions? Contact us or read About CalcZen.",
        ],
      },
    ],
  },

  blog: {
    title: "CalcZen Blog — Financial Insights, Health Tips & Math Guides",
    description:
      "Explore the CalcZen Blog for expert guides, financial tips, health calculator breakdowns, tax advice, and practical guides on online tool calculations.",
    canonical: "https://www.calczen.in/blog",
    h1: "Financial Insights, Health Guides, and Calculation Tips",
    intro:
      "Master the calculations, equations, and financial models behind everyday decisions. Simplified mathematics, finance, and wellness guides.",
    sections: [
      {
        title: "Explore Calculation Topics",
        paragraphs: [
          "Browse comprehensive articles designed to simplify mathematics, personal finance, health tracking, and practical computation.",
        ],
        listItems: [
          "Personal Finance — Loan EMI planning, home mortgage amortization, and compound wealth generation",
          "Health & Fitness — Calorie management, basal metabolic rate benchmarks, and hydration targets",
          "Business & Taxes — Goods and Services Tax (GST) calculations, profit margins, and salary breakdowns",
          "Practical Math — Percentage shifts, proportion analysis, and everyday estimation models",
        ],
      },
      {
        title: "Stay Updated with CalcZen",
        paragraphs: [
          "Our articles break down complex formulas into easy step-by-step guides so you can verify the math and make informed financial and health decisions.",
        ],
      },
    ],
  },
};

