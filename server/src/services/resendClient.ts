import { Resend } from "resend";
import { env, hasEmailConfig } from "../config/env.js";

let client: Resend | null = null;

export function getResendClient(): Resend {
  if (!hasEmailConfig()) {
    throw new Error("Email is not configured. Set RESEND_API_KEY and EMAIL_FROM.");
  }
  if (!client) {
    client = new Resend(env.resendApiKey);
  }
  return client;
}

export function getFromAddress(): string {
  const from = env.emailFrom;
  return from.includes("<") ? from : `${env.siteName} <${from}>`;
}
