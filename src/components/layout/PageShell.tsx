import { Header } from "./Header";
import { Footer } from "./Footer";

<<<<<<< HEAD
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col select-none w-full">
      <Header />
=======
type PageShellProps = {
  children: React.ReactNode;
  hideHeader?: boolean;
};

export function PageShell({ children, hideHeader = false }: PageShellProps) {
  return (
    <div className="min-h-dvh flex flex-col select-none w-full">
      {!hideHeader && <Header />}
>>>>>>> 529569b (Deploy CalcZen V2)
      <main className="flex-1 min-w-0 w-full">{children}</main>
      <Footer />
    </div>
  );
}
