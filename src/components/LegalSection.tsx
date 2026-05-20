type LegalSectionProps = {
  title: string;
  id?: string;
  children: React.ReactNode;
};

/** Semantic section block for legal and about pages */
export function LegalSection({ title, id, children }: LegalSectionProps) {
  const sectionId =
    id ??
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  return (
    <section className="legal-section" aria-labelledby={sectionId}>
      <h2 id={sectionId}>{title}</h2>
      <div className="legal-section-body">{children}</div>
    </section>
  );
}
