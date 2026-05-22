import type { ApiSubscriber } from "../types/database.js";

export function subscribersToCsv(subscribers: ApiSubscriber[]): string {
  const header = "email,subscribedAt,source,status";
  const rows = subscribers.map((s) => {
    const email = `"${s.email.replace(/"/g, '""')}"`;
    const date = new Date(s.subscribedAt).toISOString();
    const source = `"${(s.source ?? "website").replace(/"/g, '""')}"`;
    return `${email},${date},${source},${s.status}`;
  });
  return [header, ...rows].join("\n");
}
