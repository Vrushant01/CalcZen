import { Header } from "./Header";
import { Footer } from "./Footer";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
<<<<<<< HEAD
    <div className="min-h-dvh flex flex-col select-none overflow-x-clip w-full">
      <Header />
      <main className="flex-1 min-w-0 w-full">{children}</main>
=======
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
      <Footer />
    </div>
  );
}
