import { env, hasEmailConfig } from "../config/env.js";
import { newsletterEmailHtml, welcomeEmailHtml } from "../utils/emailTemplates.js";
import { getFromAddress, getResendClient } from "./resendClient.js";

export type BulkSendResult = {
  sent: number;
  failed: string[];
};

/** Send a single email via Resend */
async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const resend = getResendClient();
  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: [to],
    subject,
    html,
  });
  if (error) {
    throw new Error(error.message);
  }
}

/** Welcome email after subscription */
export async function sendWelcomeEmail(to: string): Promise<void> {
  await sendEmail(to, `Welcome to ${env.siteName}! 🎉`, welcomeEmailHtml());
}

/** Single newsletter message */
export async function sendNewsletterEmail(
  to: string,
  subject: string,
  bodyHtml: string,
): Promise<void> {
  await sendEmail(to, subject, newsletterEmailHtml(subject, bodyHtml));
}

/** Batch send with rate-friendly chunking (Resend batch limit: 100) */
export async function sendBulkEmails(
  recipients: string[],
  subject: string,
  bodyHtml: string,
): Promise<BulkSendResult> {
  if (recipients.length === 0) {
    return { sent: 0, failed: [] };
  }

  const resend = getResendClient();
  const from = getFromAddress();
  const html = newsletterEmailHtml(subject, bodyHtml);
  const chunkSize = Math.min(env.emailBatchSize, 100);
  const failed: string[] = [];
  let sent = 0;

  for (let i = 0; i < recipients.length; i += chunkSize) {
    const chunk = recipients.slice(i, i + chunkSize);
    const payload = chunk.map((to) => ({
      from,
      to: [to],
      subject,
      html,
    }));

    const { data, error } = await resend.batch.send(payload);

    if (error) {
      console.error("Resend batch error:", error);
      failed.push(...chunk);
      continue;
    }

    const batchCount = data?.data?.length ?? 0;
    sent += batchCount;

    if (batchCount < chunk.length) {
      failed.push(...chunk.slice(batchCount));
    }
  }

  return { sent, failed };
}

export async function verifyEmailConnection(): Promise<boolean> {
  if (!hasEmailConfig()) return false;
  try {
    getResendClient();
    return true;
  } catch {
    return false;
  }
}
