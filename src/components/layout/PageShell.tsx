import { Header } from "./Header";
import { Footer } from "./Footer";

type PageShellProps = {
  children: React.ReactNode;
  hideHeader?: boolean;
};

export function PageShell({ children, hideHeader = false }: PageShellProps) {
  return (
    <div className="min-h-dvh flex flex-col select-none w-full">
      {!hideHeader && <Header />}
      <main className="flex-1 min-w-0 w-full">{children}</main>
      <Footer />
    </div>
  );
}
