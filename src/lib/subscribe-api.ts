/** Same-origin /api in dev (Vite proxy → :3001). Set VITE_API_URL for production. */
const API_BASE =
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? "" : "http://localhost:3001");

export type SubscribeResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

export async function subscribeEmail(email: string): Promise<SubscribeResult> {
  try {
    const res = await fetch(`${API_BASE}/api/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = (await res.json()) as { success?: boolean; message?: string };

    if (res.ok && data.success) {
      return { ok: true, message: data.message ?? "Thanks! You're subscribed." };
    }

    return {
      ok: false,
      message: data.message ?? "Something went wrong. Please try again.",
    };
  } catch {
    return {
      ok: false,
      message:
        "Could not reach the server. Make sure the API is running (npm run dev:server) and restart the website after config changes.",
    };
  }
}
