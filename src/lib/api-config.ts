/** Production API (Render). Override with VITE_API_URL in .env files. */
export const PRODUCTION_API_URL = "https://calczen.onrender.com";

const REQUEST_TIMEOUT_MS = 30_000;

/** Base URL without trailing slash. Empty in dev = Vite proxy to local API. */
export function getApiBaseUrl(): string {
  // Support Next.js / Node env
  const nextApiUrl = typeof process !== "undefined" ? process.env.VITE_API_URL || process.env.NEXT_PUBLIC_API_URL : undefined;
  if (nextApiUrl) {
    return nextApiUrl.replace(/\/$/, "");
  }

  // Support Vite env
  const fromEnv = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_API_URL?.trim() : undefined;
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }

  const isDev = typeof process !== "undefined" ? process.env.NODE_ENV === "development" : (typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.DEV : false);
  if (isDev) {
    return "http://localhost:3001/api";
  }

  if (typeof window !== "undefined" && window.location) {
    return `${window.location.origin}/api`;
  }
  return `${PRODUCTION_API_URL}/api`;
}

export function buildApiUrl(path: string): string {
  let base = getApiBaseUrl();
  base = base.replace(/\/$/, "");
  let cleanPath = path.startsWith("/") ? path : `/${path}`;

  // Prevent duplicate "/api/api" prefixing and handle absolute vs relative mismatches
  if (base.endsWith("/api") && cleanPath.startsWith("/api/")) {
    cleanPath = cleanPath.substring(4);
  } else if (!base.endsWith("/api") && !cleanPath.startsWith("/api/")) {
    cleanPath = `/api${cleanPath}`;
  }

  return `${base}${cleanPath}`;
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const resolvedUrl = buildApiUrl(path);

  try {
    const res = await fetch(resolvedUrl, {
      ...init,
      signal: init?.signal ?? controller.signal,
    });

    return res;
  } catch (err) {
    console.error(`[API ERROR] Exception during fetch to ${resolvedUrl}:`, err);
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function getNetworkErrorMessage(err: unknown): string {
  if (err instanceof DOMException && err.name === "AbortError") {
    return "Request timed out. Please try again.";
  }
  if (err instanceof TypeError) {
    return "Could not reach the server. Check your connection and try again.";
  }
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}
