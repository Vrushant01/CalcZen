# Deploy CalcZen to Vercel

Single Vercel project serves the **TanStack Start site** (Nitro), **Express API** (`/api/*`), and **admin panel** (`/admin`) in one serverless function via `plugins/express-api.ts`.

## Prerequisites

1. Run `server/supabase/schema.sql` in Supabase SQL Editor.
2. Resend domain verified for `EMAIL_FROM`.
3. GitHub repo connected to Vercel (or deploy via CLI).

## Environment variables

Add these in **Vercel → Project → Settings → Environment Variables** (Production + Preview):

| Variable | Required | Notes |
|----------|----------|--------|
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-side key |
| `JWT_SECRET` | Yes | Strong random string |
| `RESEND_API_KEY` | Yes | For welcome + newsletter emails |
| `EMAIL_FROM` | Yes | e.g. `hello@calczen.in` |
| `CORS_ORIGIN` | Yes | Your site URL(s), comma-separated, e.g. `https://www.calczen.com,https://calczen.vercel.app` |
| `SITE_URL` | Yes | Public site URL |
| `SITE_NAME` | No | Default `CalcZen` |
| `ADMIN_EMAIL` | For seed | Used by `npm run seed:admin` locally |
| `ADMIN_PASSWORD` | For seed | Used by `npm run seed:admin` locally |
| `NODE_ENV` | Auto | Vercel sets `production` |

Do **not** set `VITE_API_URL` on Vercel unless the API is on a different domain.

## Deploy

1. Import the repo in [vercel.com/new](https://vercel.com/new).
2. Framework preset: **TanStack Start** (or leave auto-detect).
3. Root directory: repository root.
4. Build command: `npm run vercel-build` (default from `vercel.json`).
5. Deploy.

After first deploy:

```bash
# Seed admin (run locally with production Supabase creds in server/.env)
npm run seed:admin
```

## Verify

- Site: `https://your-project.vercel.app`
- API health: `https://your-project.vercel.app/api/health`
- Admin: `https://your-project.vercel.app/admin`

## Local Vercel-style build

```powershell
$env:VERCEL = "1"
npm run build:vercel
```

## Cloudflare (Lovable default)

Local dev and Cloudflare deploy still use the Cloudflare plugin (`VERCEL` unset). Use `wrangler deploy` for Workers hosting.
