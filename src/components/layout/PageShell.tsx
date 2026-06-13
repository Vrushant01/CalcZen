import { Header } from "./Header";
import { Footer } from "./Footer";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col select-none w-full">
      <Header />
      <main className="flex-1 min-w-0 w-full">{children}</main>
      <Footer />
    </div>
  );
}
