import { apiFetch, getNetworkErrorMessage } from "@/lib/api-config";

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  _gotcha?: string;
};

export type ContactResult = { ok: true; message: string } | { ok: false; message: string };

export async function submitContactForm(payload: ContactPayload): Promise<ContactResult> {
  try {
    const res = await apiFetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
    };

    if (res.ok && data.success) {
      return {
        ok: true,
        message: data.message ?? "Thanks for reaching out — we'll reply within 48 hours.",
      };
    }

    return {
      ok: false,
      message: data.message ?? `Something went wrong (${res.status}). Please try again.`,
    };
  } catch (err) {
    return {
      ok: false,
      message: getNetworkErrorMessage(err),
    };
  }
}
