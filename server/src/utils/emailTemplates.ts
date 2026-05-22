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
