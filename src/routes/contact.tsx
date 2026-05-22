import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
<<<<<<< HEAD
      { title: "Contact CalcZen — We'd Love to Hear From You" },
      { name: "description", content: "Suggest a calculator, report an issue, or say hello. The CalcZen team replies within 48 hours." },
      { property: "og:title", content: "Contact CalcZen" },
=======
      { title: "Contact CalcVerse — We'd Love to Hear From You" },
      { name: "description", content: "Suggest a calculator, report an issue, or say hello. The CalcVerse team replies within 48 hours." },
      { property: "og:title", content: "Contact CalcVerse" },
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
      { property: "og:description", content: "Suggest a calculator or report an issue." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  message: z.string().trim().min(5, "Tell us a little more").max(2000),
});

function Contact() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parse = schema.safeParse({ name: fd.get("name"), email: fd.get("email"), message: fd.get("message") });
    if (!parse.success) {
      const errs: Record<string, string> = {};
      parse.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSent(true);
  };

  return (
    <PageShell>
<<<<<<< HEAD
      <div className="page-container max-w-2xl py-10 sm:py-16 min-w-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance">Contact us</h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">Have a calculator request or feedback? Drop us a line.</p>
=======
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight">Contact us</h1>
        <p className="mt-2 text-muted-foreground">Have a calculator request or feedback? Drop us a line.</p>
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
        {sent ? (
          <div className="mt-8 rounded-2xl border border-success/30 bg-success/10 p-6 text-success-foreground">
            Thanks for reaching out — we'll reply within 48 hours.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <Label>Name</Label>
              <Input name="name" className="mt-1" />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label>Email</Label>
              <Input name="email" type="email" className="mt-1" />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label>Message</Label>
              <Textarea name="message" rows={5} className="mt-1" />
              {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
            </div>
<<<<<<< HEAD
            <Button type="submit" className="w-full sm:w-auto bg-gradient-accent min-h-11">Send message</Button>
=======
            <Button type="submit" className="bg-gradient-accent">Send message</Button>
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
          </form>
        )}
      </div>
    </PageShell>
  );
}
