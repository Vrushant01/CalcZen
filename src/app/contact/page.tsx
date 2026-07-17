import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact CalcZen — We'd Love to Hear From You",
  description:
    "Get in touch with the CalcZen team. Suggest a new calculator, report a bug, or send us feedback. We reply to all inquiries within 48 hours.",
  openGraph: {
    title: "Contact CalcZen",
    description:
      "Get in touch with the CalcZen team. Suggest a new calculator, report a bug, or send us feedback. We reply to all inquiries within 48 hours.",
    url: "https://calczen.in/contact",
  },
  twitter: {
    description:
      "Get in touch with the CalcZen team. Suggest a new calculator, report a bug, or send us feedback. We reply to all inquiries within 48 hours.",
  },
  alternates: {
    canonical: "https://calczen.in/contact",
  },
};

export default function ContactPage() {
  const jsonLdContact = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact CalcZen — We'd Love to Hear From You",
    description:
      "Get in touch with the CalcZen team. Suggest a new calculator, report a bug, or send us feedback. We reply to all inquiries within 48 hours.",
    url: "https://calczen.in/contact",
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://calczen.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Contact Us",
        item: "https://calczen.in/contact",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdContact) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <ContactClient />
    </>
  );
}
