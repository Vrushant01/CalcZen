import { env } from "../config/env.js";

/** CalcZen dark email theme */
const colors = {
  bg: "#0b0f19",
  card: "#131a2b",
  cardBorder: "#1e293b",
  text: "#f1f5f9",
  muted: "#94a3b8",
  primary: "#6366f1",
  primaryLight: "#818cf8",
  accent: "#f59e0b",
  surface: "#1a2236",
};

function layout(content: string, preheader = ""): string {
  const year = new Date().getFullYear();
  const siteUrl = env.siteUrl.startsWith("http") ? env.siteUrl : `https://${env.siteUrl}`;
  const siteName = env.siteName;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${siteName}</title>
  <style>
    body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: ${colors.bg}; }
    @media only screen and (max-width: 600px) {
      .wrapper { width: 100% !important; }
      .mobile-pad { padding-left: 20px !important; padding-right: 20px !important; }
      .btn { display: block !important; width: 100% !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${colors.bg};font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <span style="display:none;font-size:1px;color:${colors.bg};line-height:1px;max-height:0;opacity:0;overflow:hidden;">${escapeHtml(preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${colors.bg};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" class="wrapper" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="background:linear-gradient(135deg,${colors.bg} 0%,${colors.card} 55%,${colors.primary} 120%);border:1px solid ${colors.cardBorder};border-radius:16px 16px 0 0;padding:32px;text-align:center;">
              <h1 style="margin:0;font-size:28px;font-weight:800;color:${colors.text};letter-spacing:-0.5px;">${siteName}</h1>
              <p style="margin:10px 0 0;font-size:14px;color:${colors.muted};">Free calculators for finance, health &amp; everyday life</p>
            </td>
          </tr>
          <tr>
            <td class="mobile-pad" style="background-color:${colors.card};border-left:1px solid ${colors.cardBorder};border-right:1px solid ${colors.cardBorder};padding:36px 32px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="background-color:${colors.surface};border:1px solid ${colors.cardBorder};border-top:0;border-radius:0 0 16px 16px;padding:24px 32px;text-align:center;">
              <p style="margin:0 0 10px;font-size:12px;color:${colors.muted};line-height:1.6;">
                You received this because you subscribed at
                <a href="${siteUrl}" style="color:${colors.accent};text-decoration:none;font-weight:600;">${siteName}</a>
              </p>
              <p style="margin:0;font-size:11px;color:${colors.muted};">
                &copy; ${year} ${siteName} · Reply &quot;unsubscribe&quot; to opt out
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function welcomeEmailHtml(): string {
  const base = env.siteUrl.startsWith("http") ? env.siteUrl : `https://${env.siteUrl}`;
  const calculatorsUrl = `${base.replace(/\/$/, "")}/calculators`;

  const content = `
    <h2 style="margin:0 0 16px;font-size:24px;font-weight:700;color:${colors.text};">Welcome to ${env.siteName} 🎉</h2>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:${colors.muted};">
      Thanks for subscribing. You&apos;ll get updates about new calculators, finance tips, and helpful tools — no spam.
    </p>
    <p style="margin:0 0 28px;font-size:16px;line-height:1.65;color:${colors.muted};">
      Explore mortgage, BMI, percentage, tip calculators and more — fast, accurate, and free.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 8px;">
      <tr>
        <td align="center" style="border-radius:10px;background:linear-gradient(135deg,${colors.primary},${colors.primaryLight});">
          <a href="${calculatorsUrl}" class="btn" style="display:inline-block;padding:14px 32px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:10px;">
            Explore Calculators
          </a>
        </td>
      </tr>
    </table>
  `;

  return layout(content, `Welcome to ${env.siteName}`);
}

export function newsletterEmailHtml(subject: string, bodyHtml: string): string {
  const content = `
    <h2 style="margin:0 0 20px;font-size:22px;font-weight:700;color:${colors.text};">${escapeHtml(subject)}</h2>
    <div style="font-size:16px;line-height:1.7;color:${colors.muted};">${bodyHtml}</div>
  `;
  return layout(content, subject);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function contactLayout(content: string, preheader: string): string {
  const year = new Date().getFullYear();
  const siteUrl = env.siteUrl.startsWith("http") ? env.siteUrl : `https://${env.siteUrl}`;
  const siteName = env.siteName;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${siteName} — Contact</title>
  <style>
    body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: ${colors.bg}; }
    @media only screen and (max-width: 600px) {
      .wrapper { width: 100% !important; }
      .mobile-pad { padding-left: 20px !important; padding-right: 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${colors.bg};font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <span style="display:none;font-size:1px;color:${colors.bg};line-height:1px;max-height:0;opacity:0;overflow:hidden;">${escapeHtml(preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${colors.bg};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" class="wrapper" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="background:linear-gradient(135deg,${colors.bg} 0%,${colors.card} 55%,${colors.primary} 120%);border:1px solid ${colors.cardBorder};border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
              <h1 style="margin:0;font-size:22px;font-weight:800;color:${colors.text};letter-spacing:-0.5px;">${siteName}</h1>
              <p style="margin:8px 0 0;font-size:13px;color:${colors.muted};">New contact form submission</p>
            </td>
          </tr>
          <tr>
            <td class="mobile-pad" style="background-color:${colors.card};border-left:1px solid ${colors.cardBorder};border-right:1px solid ${colors.cardBorder};padding:32px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="background-color:${colors.surface};border:1px solid ${colors.cardBorder};border-top:0;border-radius:0 0 16px 16px;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;color:${colors.muted};line-height:1.6;">
                Sent via <a href="${siteUrl}/contact" style="color:${colors.accent};text-decoration:none;">${siteUrl}/contact</a>
                · &copy; ${year} ${siteName}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export type ContactFormEmailData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
};

export type SupportReplyEmailData = {
  recipientName: string;
  originalSubject: string;
  originalMessage: string;
  replyBody: string;
};

export function contactFormEmailHtml(data: ContactFormEmailData): string {
  const content = `
    <h2 style="margin:0 0 20px;font-size:20px;font-weight:700;color:${colors.text};">New Contact Form Submission</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid ${colors.cardBorder};">
          <p style="margin:0 0 4px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:${colors.muted};">Name</p>
          <p style="margin:0;font-size:16px;color:${colors.text};">${escapeHtml(data.name)}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid ${colors.cardBorder};">
          <p style="margin:0 0 4px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:${colors.muted};">Email</p>
          <p style="margin:0;font-size:16px;">
            <a href="mailto:${escapeHtml(data.email)}" style="color:${colors.primaryLight};text-decoration:none;">${escapeHtml(data.email)}</a>
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid ${colors.cardBorder};">
          <p style="margin:0 0 4px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:${colors.muted};">Subject</p>
          <p style="margin:0;font-size:16px;color:${colors.text};">${escapeHtml(data.subject)}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid ${colors.cardBorder};">
          <p style="margin:0 0 4px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:${colors.muted};">Submitted</p>
          <p style="margin:0;font-size:14px;color:${colors.muted};">${escapeHtml(data.submittedAt)}</p>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 8px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:${colors.muted};">Message</p>
    <div style="margin:0;padding:16px;background-color:${colors.surface};border:1px solid ${colors.cardBorder};border-radius:10px;font-size:15px;line-height:1.65;color:${colors.text};white-space:pre-wrap;">${escapeHtml(data.message)}</div>
    <p style="margin:24px 0 0;font-size:13px;color:${colors.muted};">
      Reply directly to this email to respond to the sender (Reply-To is set to their address).
    </p>
  `;

  return contactLayout(content, `Contact from ${data.name}`);
}

function supportLayout(content: string, preheader: string): string {
  const year = new Date().getFullYear();
  const siteUrl = env.siteUrl.startsWith("http") ? env.siteUrl : `https://${env.siteUrl}`;
  const siteName = env.siteName;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${siteName} Support</title>
  <style>
    body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: ${colors.bg}; }
    @media only screen and (max-width: 600px) {
      .wrapper { width: 100% !important; }
      .mobile-pad { padding-left: 20px !important; padding-right: 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${colors.bg};font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <span style="display:none;font-size:1px;color:${colors.bg};line-height:1px;max-height:0;opacity:0;overflow:hidden;">${escapeHtml(preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${colors.bg};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" class="wrapper" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="background:linear-gradient(135deg,${colors.bg} 0%,${colors.card} 55%,${colors.primary} 120%);border:1px solid ${colors.cardBorder};border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
              <h1 style="margin:0;font-size:22px;font-weight:800;color:${colors.text};">${siteName}</h1>
              <p style="margin:8px 0 0;font-size:13px;color:${colors.muted};">Support reply</p>
            </td>
          </tr>
          <tr>
            <td class="mobile-pad" style="background-color:${colors.card};border-left:1px solid ${colors.cardBorder};border-right:1px solid ${colors.cardBorder};padding:32px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="background-color:${colors.surface};border:1px solid ${colors.cardBorder};border-top:0;border-radius:0 0 16px 16px;padding:24px 32px;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;color:${colors.muted};line-height:1.6;">
                Questions? Visit <a href="${siteUrl}/contact" style="color:${colors.accent};text-decoration:none;font-weight:600;">${siteName}</a>
              </p>
              <p style="margin:0;font-size:11px;color:${colors.muted};">&copy; ${year} ${siteName}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function supportReplyEmailHtml(data: SupportReplyEmailData): string {
  const content = `
    <p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:${colors.text};">
      Hi ${escapeHtml(data.recipientName)},
    </p>
    <p style="margin:0 0 24px;font-size:16px;line-height:1.65;color:${colors.muted};">
      Thank you for contacting ${env.siteName}. Here is our reply to your message:
    </p>
    <div style="margin:0 0 28px;padding:20px;background-color:${colors.surface};border-left:4px solid ${colors.primary};border-radius:8px;font-size:15px;line-height:1.7;color:${colors.text};white-space:pre-wrap;">${escapeHtml(data.replyBody)}</div>
    <p style="margin:0 0 8px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:${colors.muted};">Your original message</p>
    <p style="margin:0 0 4px;font-size:13px;color:${colors.muted};"><strong style="color:${colors.text};">Subject:</strong> ${escapeHtml(data.originalSubject)}</p>
    <div style="margin:0;padding:14px;background-color:${colors.bg};border:1px solid ${colors.cardBorder};border-radius:8px;font-size:14px;line-height:1.6;color:${colors.muted};white-space:pre-wrap;">${escapeHtml(data.originalMessage)}</div>
  `;

  return supportLayout(content, `Re: ${data.originalSubject}`);
}
