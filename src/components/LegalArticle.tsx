import { Link } from "@/components/ui/Link";
import { PageContainer } from "@/components/layout/PageContainer";

type LegalArticleProps = {
  title: string;
  lastUpdated?: string;
  intro?: string;
  children: React.ReactNode;
};

export function LegalArticle({ title, lastUpdated, intro, children }: LegalArticleProps) {
  return (
    <PageContainer spacing="legal" className="max-w-3xl !mx-auto w-full">
      <article className="legal-page min-w-0 w-full">
        <header className="legal-page-header">
          <h1 className="text-2xl sm:text-3xl md:text-[2rem] font-semibold tracking-tight text-foreground text-balance leading-tight">
            {title}
          </h1>
          {lastUpdated && (
            <p className="mt-3 sm:mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
              Last updated · {lastUpdated}
            </p>
          )}
          {intro && <p className="legal-page-intro">{intro}</p>}
        </header>

        <div className="legal-content min-w-0">{children}</div>

        <footer className="legal-page-footer">
          <p className="text-sm leading-relaxed">
            Questions?{" "}
            <Link to="/contact" className="legal-inline-link">
              Contact us
            </Link>
            {" · "}
            <Link to="/calculators" className="legal-inline-link">
              Browse calculators
            </Link>
          </p>
        </footer>
      </article>
    </PageContainer>
  );
}
