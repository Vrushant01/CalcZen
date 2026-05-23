import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm } from "@/lib/contact-api";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact CalcZen — We'd Love to Hear From You" },
      { name: "description", content: "Suggest a calculator, report an issue, or say hello. The CalcZen team replies within 48 hours." },
      { property: "og:title", content: "Contact CalcZen" },
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
  message: z.string().trim().min(10, "Please write at least 10 characters").max(2000),
});

function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    const fd = new FormData(e.currentTarget);
    const parse = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      message: fd.get("message"),
    });

    if (!parse.success) {
      const errs: Record<string, string> = {};
      parse.error.issues.forEach((i) => {
        errs[i.path[0] as string] = i.message;
      });
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);

    const result = await submitContactForm({
      name: parse.data.name,
      email: parse.data.email,
      message: parse.data.message,
      _gotcha: String(fd.get("_gotcha") ?? ""),
    });

    setLoading(false);

    if (result.ok) {
      setSent(true);
      formRef.current?.reset();
      return;
    }

    setFormError(result.message);
  };

  return (
    <PageShell>
      <div className="page-container max-w-2xl py-10 sm:py-16 min-w-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance">Contact us</h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">Have a calculator request or feedback? Drop us a line.</p>
        {sent ? (
          <div
            className="mt-8 rounded-2xl border border-success/30 bg-success/10 p-6 text-success-foreground dark:text-emerald-100"
            role="status"
          >
            Thanks for reaching out — we'll reply within 48 hours.
          </div>
        ) : (
          <form ref={formRef} onSubmit={onSubmit} className="mt-8 space-y-4">
            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute h-0 w-0 opacity-0 pointer-events-none"
            />
            <div>
              <Label>Name</Label>
              <Input name="name" className="mt-1" disabled={loading} />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label>Email</Label>
              <Input name="email" type="email" className="mt-1" disabled={loading} />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label>Message</Label>
              <Textarea name="message" rows={5} className="mt-1" disabled={loading} />
              {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
            </div>
            {formError && (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-accent min-h-11"
            >
              {loading ? "Sending…" : "Send message"}
            </Button>
          </form>
        )}
      </div>
    </PageShell>
  );
}
