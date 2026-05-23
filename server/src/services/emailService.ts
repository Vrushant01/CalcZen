import { env, hasEmailConfig } from "../config/env.js";
import {
  contactFormEmailHtml,
  type ContactFormEmailData,
  newsletterEmailHtml,
  type SupportReplyEmailData,
  supportReplyEmailHtml,
  welcomeEmailHtml,
} from "../utils/emailTemplates.js";
import { getFromAddress, getResendClient, getSupportFromAddress } from "./resendClient.js";

export type BulkSendResult = {
  sent: number;
  failed: string[];
};

type SendEmailOptions = {
  replyTo?: string;
  from?: string;
};

/** Send a single email via Resend */
async function sendEmail(
  to: string,
  subject: string,
  html: string,
  options?: SendEmailOptions,
): Promise<void> {
  const resend = getResendClient();
  const { error } = await resend.emails.send({
    from: options?.from ?? getFromAddress(),
    to: [to],
    subject,
    html,
    ...(options?.replyTo ? { replyTo: options.replyTo } : {}),
  });
  if (error) {
    throw new Error(error.message);
  }
}

/** Notify team inbox when someone submits the contact form */
export async function sendContactFormEmail(data: ContactFormEmailData): Promise<void> {
  const inbox = env.contactTo;
  const subject = `New Contact Form Submission — ${data.name}`;
  await sendEmail(inbox, subject, contactFormEmailHtml(data), {
    replyTo: data.email,
  });
}

/** Send support reply to the user who submitted the contact form */
export async function sendSupportReplyEmail(
  to: string,
  data: SupportReplyEmailData,
): Promise<void> {
  const subject = `Re: ${data.originalSubject}`;
  await sendEmail(to, subject, supportReplyEmailHtml(data), {
    from: getSupportFromAddress(),
  });
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
