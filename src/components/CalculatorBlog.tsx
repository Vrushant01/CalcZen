import { Link } from "@tanstack/react-router";

export interface BlogContent {
  primaryKeyword: string;
  h2Heading: string;
  h3Heading: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  h2Body: string;
  h3Body: string;
  paragraph4: string;
  closingParagraph: string;
  internalLinks: {
    text: string;
    calculatorName: string;
    href: string;
  }[];
}

type Props = {
  content: BlogContent;
};

export default function CalculatorBlog({ content }: Props) {
  return (
    <article
      className="mt-10 pt-8 border-t border-border max-w-[720px]"
    >
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.08em] mb-4">
        Understanding {content.primaryKeyword}
      </p>

      <p className={pClass}>{content.paragraph1}</p>
      <p className={pClass}>{content.paragraph2}</p>
      <p className={pClass}>{content.paragraph3}</p>

      <h2 className={h2Class}>{content.h2Heading}</h2>
      <p className={pClass}>{content.h2Body}</p>

      <h3 className={h3Class}>{content.h3Heading}</h3>
      <p className={pClass}>{content.h3Body}</p>

      <p className={pClass}>{content.paragraph4}</p>
      <p className={pClass}>{content.closingParagraph}</p>

      <div className="mt-6 py-3.5 px-4 rounded-lg bg-muted/50 border-l-[3px] border-l-[#1D9E75]">
        <p className="text-xs text-muted-foreground leading-relaxed m-0">
          Related:{" "}
          {content.internalLinks.map((link, i) => (
            <span key={link.href}>
              {i > 0 && " · "}
              <Link
                to={link.href}
                className="text-[#0F6E56] font-medium no-underline hover:underline"
              >
                {link.calculatorName}
              </Link>
            </span>
          ))}
          .
        </p>
      </div>
    </article>
  );
}

const pClass = "text-sm text-muted-foreground leading-[1.8] mb-3.5";
const h2Class = "text-[17px] font-medium text-foreground mt-6 mb-2.5";
const h3Class = "text-[15px] font-medium text-foreground mt-4 mb-2";
