import { apiFetch, getNetworkErrorMessage } from "@/lib/api-config";

export type SubscribeResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

export async function subscribeEmail(email: string): Promise<SubscribeResult> {
  try {
    const res = await apiFetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
    };

    if (res.ok && data.success) {
      return { ok: true, message: data.message ?? "Thanks! You're subscribed." };
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
