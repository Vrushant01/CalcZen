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
          "Calculator websites are often cluttered with invasive popups, slow tracking scripts, or opaque formulas that don't explain how numbers are computed. CalcZen focuses on what matters: an ultra-fast, clean interface, verified mathematical algorithms, and actionable results you can understand and independently verify.",
          "Whether you are estimating a home loan EMI, planning retirement savings, checking your daily protein needs, or computing GST on a commercial invoice, we deliver reliable online tools that respect your time and privacy.",
        ],
      },
      {
        title: "Who runs CalcZen",
        paragraphs: [
          "CalcZen was founded and is actively maintained by Krish Barvaliya and Vrushant Shiroya, full-stack web developers based in Vadodara, Gujarat, India. With experience in building modern web interfaces and financial calculations, Krish and Vrushant created CalcZen to make quantitative decisions simpler, transparent, and accessible to everyone.",
          "Frustrated by existing calculator portals that bury formulas behind opaque black boxes and excessive advertisements, Krish and Vrushant built CalcZen as an open, educational utility where every calculation is accompanied by its underlying formula, real worked examples, and practical guidance.",
          "You can reach Krish and Vrushant directly with suggestions, feedback, or technical questions at hello@calczen.in.",
        ],
      },
      {
        title: "How we build and check our calculators",
        paragraphs: [
          "Accuracy and computational integrity are the foundation of CalcZen. Every calculation tool on our platform follows a rigorous development and verification lifecycle:",
        ],
        listItems: [
          "Official Source Alignment: Calculation formulas and financial logic are modeled strictly on published guidelines from authoritative institutions—including the Reserve Bank of India (RBI), the Income Tax Department of India, the Central Board of Indirect Taxes and Customs (CBIC), the Bureau of Indian Standards (BIS), the Indian Council of Medical Research (ICMR-NIN), and the World Health Organization (WHO).",
          "Pure TypeScript Engines: All core formulas are implemented in isolated, pure TypeScript modules without UI dependencies, allowing automated testing of mathematical outputs against verified external baselines.",
          "Comprehensive Edge-Case Testing: Every tool is stress-tested against boundary conditions—such as zero denominators, extreme interest rates, negative inputs, and leap years—to ensure that invalid numbers like NaN, undefined, or Infinity never reach users.",
          "Regular Regulatory Recalibration: Statutory rules that change over time (such as Union Budget tax slab revisions, EPF statutory wage limits, and state Professional Tax schedules) are systematically updated each financial year with transparent 'as of' dates.",
        ],
      },
      {
        title: "Editorial and corrections policy",
        paragraphs: [
          "We are deeply committed to editorial honesty, clarity, and rapid error correction:",
          "To report a suspected error or suggest an algorithmic improvement, please email our editorial desk at hello@calczen.in.",
        ],
        listItems: [
          "No Black Boxes: Every calculator page features transparent formula explanations, variable definitions, and step-by-step practical worked examples with real numbers.",
          "Clear Scope and Disclaimers: We clearly state the boundaries of our tools. Health calculators state they are for informational purposes and not a substitute for clinical medical evaluation. Finance calculators emphasize that results are estimates and not formal financial advice.",
          "Swift Corrections: If a user or domain expert reports a calculation discrepancy, statutory inaccuracy, or typographic error, our engineering team audits the codebase within 24 to 48 business hours, deploys the required fix, and updates the visible 'Last reviewed' audit date on the calculator.",
        ],
      },
      {
        title: "What we offer",
        paragraphs: ["Free calculator tools across five key categories:"],
        listItems: [
          "Finance & Loans — Loan EMI, mortgages, compound interest, credit card balance conversions, loan eligibility, and retirement planning",
          "Jewellery & Precious Metals — Gold jewellery billing, hallmarked gold purity conversion, making charges, and silver bills",
          "Construction & Materials — Concrete RCC, cement bags, brick masonry, wall plaster, paint, tile estimation, and TMT steel bar weights",
          "Health & Fitness — BMI, basal metabolic rate (BMR), body fat percentage, calorie burn, water intake, and daily protein targets",
          "Math & Business Utilities — GST invoicing, product profit margins, attendance recovery, CGPA to percentage, and scientific arithmetic",
        ],
      },
      {
        title: "How we stay free",
        paragraphs: [
          "CalcZen is supported by non-intrusive online advertising through Google AdSense. We do not sell your personal data or charge subscriptions for our tools. Details on advertising cookies, third-party vendor practices, and privacy controls are detailed in our Privacy Policy.",
        ],
      },
    ],
  },

  contact: {
    title: "Contact CalcZen — We'd Love to Hear From You",
    description:
      "Get in touch with the CalcZen team. Suggest a new calculator, report an error, or send us feedback. Email us directly at hello@calczen.in.",
    canonical: "https://www.calczen.in/contact",
    h1: "Contact us",
    intro:
      "Have a calculator request, feedback, or a calculation correction? We'd love to hear from you. Reach out via email or use the form below.",
    sections: [
      {
        title: "Direct Contact Information",
        paragraphs: [
          "For general inquiries, reporting calculator errors, partnerships, or suggesting new mathematical or financial simulation tools, please email us directly:",
          "Email: hello@calczen.in",
          "Owners & Maintainers: Krish Barvaliya and Vrushant Shiroya",
          "Location: Vadodara, Gujarat, India",
        ],
      },
      {
        title: "Response Times & Support",
        paragraphs: [
          "We value your feedback and read every message. Our team reviews all incoming inquiries and typically replies within 24 to 48 business hours. If you are reporting a mathematical discrepancy in a calculator, please include the input values used and the expected result so we can review the algorithm promptly.",
        ],
      },
    ],
  },

  privacy: {
    title: "Privacy Policy — How CalcZen Handles Your Data",
    description:
      "Read the CalcZen Privacy Policy to learn how we handle cookies, Google AdSense, third-party advertising vendors, and user privacy rights.",
    canonical: "https://www.calczen.in/privacy",
    h1: "Privacy Policy",
    lastUpdated: "November 2026",
    intro:
      "This policy explains how CalcZen collects, uses, and protects information when you use our website and free online calculators. We are committed to transparency and responsible data handling.",
    sections: [
      {
        title: "Overview & Local Browser Processing",
        paragraphs: [
          "You can use all calculators on CalcZen completely free and without creating an account. All numeric inputs (such as loan amounts, salary figures, body measurements, or commercial prices) are processed locally inside your web browser via client-side JavaScript. We do not transmit or store your personal calculator input values on our backend servers.",
          "Like most websites, we use limited technical data and cookies to operate the site, monitor system reliability, and serve digital advertisements that keep our service completely free.",
        ],
      },
      {
        title: "Information We Collect",
        subsections: [
          {
            title: "Information You Voluntarily Provide",
            listItems: [
              "Name, email address, and message content when you send us an email or submit a contact inquiry to hello@calczen.in.",
            ],
          },
          {
            title: "Information Collected Automatically",
            paragraphs: ["When you browse CalcZen, our web hosting infrastructure and analytics may log:"],
            listItems: [
              "Browser type, device model, screen resolution, and operating system",
              "Referring website URLs and pages visited on CalcZen",
              "Standard server access logs and truncated IP addresses for DDoS protection",
              "Cookie identifiers and basic session metrics",
            ],
          },
        ],
      },
      {
        title: "Cookies and Google AdSense Advertising",
        paragraphs: [
          "CalcZen displays digital advertisements served by Google AdSense and its certified third-party vendor networks to finance website operations and hosting infrastructure.",
          "Google and third-party advertising vendors use cookies to serve ads based on your prior visits to CalcZen and other websites across the internet.",
          "Google's use of advertising cookies enables it and its partners to serve personalized ads based on your visit to CalcZen and/or other sites on the Internet.",
        ],
        subsections: [
          {
            title: "How to Opt Out of Personalized Advertising",
            paragraphs: [
              "You have the right to opt out of personalized advertising at any time. You can customize your ad preferences or opt out of personalized advertising by visiting Google Ads Settings (https://www.google.com/settings/ads).",
              "Alternatively, you can opt out of third-party vendor cookies for personalized advertising by visiting the Network Advertising Initiative (NAI) opt-out page or AboutAds choices (https://www.aboutads.info/choices/).",
              "You can also configure your web browser to reject all cookies or notify you when a cookie is placed on your device.",
            ],
          },
        ],
      },
      {
        title: "Third-Party Service Providers",
        paragraphs: [
          "We partner with trusted third-party providers for web hosting (Vercel), DNS routing, and analytics. These providers access technical data strictly to deliver contracted infrastructure services in compliance with data privacy regulations.",
          "CalcZen contains external links to official government and regulatory resources (such as RBI, Income Tax Dept, CBIC, and WHO). We do not control and are not responsible for the privacy practices of external third-party websites.",
        ],
      },
      {
        title: "Data Retention & Security",
        paragraphs: [
          "Communication sent to hello@calczen.in is retained only as long as necessary to resolve your request and maintain editorial audit logs. We implement industry-standard encryption (HTTPS / SSL) to secure all data transmissions.",
        ],
      },
      {
        title: "Contact Concerning Privacy",
        paragraphs: [
          "If you have any questions about this Privacy Policy, your rights, or our advertising practices, please contact Krish Barvaliya and Vrushant Shiroya at hello@calczen.in.",
        ],
      },
    ],
  },

  terms: {
    title: "Terms of Service — CalcZen Free Online Calculators",
    description:
      "Review the Terms of Service governing your use of CalcZen's free calculators, content, and mathematical simulation tools.",
    canonical: "https://www.calczen.in/terms",
    h1: "Terms of Service",
    lastUpdated: "November 2026",
    intro:
      "Please read these Terms of Service carefully before using CalcZen. By accessing our calculators and content, you agree to be bound by these terms.",
    sections: [
      {
        title: "Use of Our Services",
        paragraphs: [
          "CalcZen provides free calculation tools, formulas, and educational guides for personal, academic, and business evaluation. You agree to use these tools responsibly and in compliance with all applicable local, national, and international laws.",
        ],
      },
      {
        title: "Intellectual Property",
        paragraphs: [
          "The design, branding, original software code, explanatory articles, worked examples, and compilation of calculators on CalcZen are protected by copyright and intellectual property laws. You may not scrape, reproduce, or redistribute our proprietary software without prior written permission.",
        ],
      },
      {
        title: "Limitation of Liability",
        paragraphs: [
          "CalcZen and its maintainers provide all tools and content on an 'as-is' and 'as-available' basis. While we strive for mathematical rigor, we do not warrant that calculations are free from human error, rounding variations, or regulatory changes. In no event shall CalcZen be liable for any direct, indirect, incidental, or consequential damages resulting from your use of or inability to use our tools.",
        ],
      },
    ],
  },

  disclaimer: {
    title: "Disclaimer — Estimates Only | CalcZen",
    description:
      "Read the CalcZen Disclaimer regarding our calculation results, financial estimates, and health tools.",
    canonical: "https://www.calczen.in/disclaimer",
    h1: "Disclaimer",
    lastUpdated: "November 2026",
    intro:
      "All calculations and educational materials provided on CalcZen are intended strictly for informational, educational, and estimation purposes.",
    sections: [
      {
        title: "Financial and Loan Calculations",
        paragraphs: [
          "Results generated by our loan, mortgage, tax, salary, and investment calculators are estimates based on standard financial formulas and user-supplied parameters. Actual bank loan terms, interest rates, processing fees, tax liabilities, and investment returns will vary based on lender underwriting, personal credit scores, and statutory notifications. CalcZen is not a bank, lender, or certified financial advisor.",
        ],
      },
      {
        title: "Health and Wellness Calculations",
        paragraphs: [
          "Health calculators (including BMI, BMR, Body Fat, and Protein tools) are based on general population statistical models (such as Mifflin-St Jeor and U.S. Navy formulas). They are not medical diagnostic tools. Always consult a licensed physician, clinical dietitian, or healthcare professional before making diet, fitness, or medication decisions.",
        ],
      },
      {
        title: "Updates and Inquiries",
        paragraphs: [
          "We regularly audit and update our tools to reflect current formulas. If you have questions regarding our calculations, please contact us at hello@calczen.in.",
        ],
      },
    ],
  },
};
