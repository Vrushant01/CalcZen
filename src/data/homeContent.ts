import { calculators } from "./calculators.ts";

export interface IntroParagraphSegment {
  text: string;
  href?: string;
  external?: boolean;
}

export interface HomeIntroContent {
  title: string;
  paragraphs: IntroParagraphSegment[][];
}

export const featuredCalculatorSlugs: string[] = calculators
  .filter((c) => c.popular)
  .map((c) => c.slug);

export const homeIntro: HomeIntroContent = {
  title: "About CalcZen calculators",
  paragraphs: [
    [
      {
        text: "CalcZen is a modern, privacy-first online calculation platform built to deliver instantaneous, dependable, and mathematically verified answers for your daily quantitative challenges. Whether you are planning a long-term home mortgage, monitoring personal health and fitness targets, auditing household energy consumption, or analyzing business profit margins, CalcZen eliminates guesswork with simple, transparent computational tools. Every calculator across our entire platform is 100% free to access, requiring no user registration, no account sign-up, and no subscription paywalls. All data you enter is computed in real time directly within your web browser, guaranteeing that your personal financial figures and private records remain strictly on your device. Discover our complete collection of verified tools across ",
      },
      {
        text: "All Calculators",
        href: "/calculators",
      },
      {
        text: " to make confident, data-driven decisions every single day.",
      },
    ],
    [
      {
        text: "Our curated toolkit spans a wide variety of practical everyday categories, including personal finance, health and fitness, mathematics, salary and career compensation, business operations, home construction, domestic electricity, and precious jewellery. For wellness and nutrition planning, our metrics follow scientific references established by the ",
      },
      {
        text: "World Health Organization",
        href: "https://www.who.int",
        external: true,
      },
      {
        text: ", ensuring reliable baselines for energy expenditure and body mass targets. From estimating monthly loan EMIs, fixed deposit returns, and statutory GST invoices to calculating concrete volumes, air conditioner electricity bills, and hallmarked gold purity, CalcZen translates intricate industrial equations into clean, accessible interfaces. Each calculator is engineered to assist everyday users, students, homeowners, tradespeople, and business owners in solving complex multi-variable problems effortlessly, without needing financial degrees or technical training.",
      },
    ],
    [
      {
        text: "Mathematical integrity and absolute transparency guide every calculation engine we build. Rather than obscuring figures behind opaque formulas, CalcZen provides clear formula references, comprehensive breakdown tables, and educational explanations that illustrate exactly how your results are generated. Our models strictly align with official benchmarks, such as lending guidelines published by the ",
      },
      {
        text: "Reserve Bank of India",
        href: "https://www.rbi.org.in",
        external: true,
      },
      {
        text: ", hallmarking standards from the ",
      },
      {
        text: "Bureau of Indian Standards",
        href: "https://www.bis.gov.in",
        external: true,
      },
      {
        text: ", and statutory GST slabs. To deepen your understanding of smart financial management, energy efficiency, and everyday arithmetic, explore our comprehensive ",
      },
      {
        text: "CalcZen Tools",
        href: "/tools",
      },
      {
        text: ", designed to make complex numbers simple, actionable, and practical for everyone.",
      },
    ],
  ],
};

export function getIntroHtml(): string {
  return homeIntro.paragraphs
    .map(
      (para) =>
        `<p>${para
          .map((seg) =>
            seg.href
              ? `<a href="${seg.href}"${seg.external ? ' target="_blank" rel="noopener noreferrer"' : ''} class="text-primary hover:underline font-medium">${seg.text}</a>`
              : seg.text
          )
          .join("")}</p>`
    )
    .join("\n");
}

export function getIntroPlainText(): string {
  return homeIntro.paragraphs
    .map((para) => para.map((seg) => seg.text).join(""))
    .join("\n\n");
}
