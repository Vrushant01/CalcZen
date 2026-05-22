# Deploy CalcZen API on Render

Use this when the **frontend stays on Vercel** (or elsewhere) and the **Express API + admin** run on Render.

## Architecture

```
Vercel (Vite SPA)  ──HTTPS──►  Render Web Service (Express)
  calczen.vercel.app              calczen-api.onrender.com
                                  ├── /api/*
                                  └── /admin
```

## 1. Prerequisites

- GitHub repo pushed
- Supabase: `server/supabase/schema.sql` already run
- Resend domain verified for `EMAIL_FROM`

## 2. Create Render Web Service

1. Go to [dashboard.render.com](https://dashboard.render.com) → **New +** → **Web Service**
2. Connect your GitHub repo
3. Configure:

| Setting | Value |
|---------|--------|
| **Name** | `calczen-api` (or any name) |
| **Root Directory** | `server` |
| **Runtime** | Node |
| **Build Command** | `npm install && npm run build:admin` |
| **Start Command** | `npm start` |
| **Health Check Path** | `/api/health` |

Render sets `PORT` automatically — do not hardcode it.

## 3. Environment variables (Render dashboard)

Add under **Environment**:

| Variable | Required | Example |
|----------|----------|---------|
| `NODE_ENV` | Yes | `production` |
| `SUPABASE_URL` | Yes | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | service role key |
| `JWT_SECRET` | Yes | long random string |
| `RESEND_API_KEY` | Yes | `re_...` |
| `EMAIL_FROM` | Yes | `hello@calczen.in` |
| `SITE_URL` | Yes | `https://www.calczen.com` |
| `CORS_ORIGIN` | Yes | see below |
| `ADMIN_EMAIL` | For seed only | used locally with `npm run seed:admin` |
| `ADMIN_PASSWORD` | For seed only | used locally with `npm run seed:admin` |

### `CORS_ORIGIN` (important)

Comma-separated list of every URL that calls your API (no trailing slash):

```env
CORS_ORIGIN=https://www.calczen.com,https://calczen.vercel.app,https://calczen-git-main-you.vercel.app
```

Include your real **Vercel production URL** and preview URLs if you use them.

## 4. Deploy

Click **Create Web Service** (or **Manual Deploy**). Wait until status is **Live**.

Your API base URL will look like:

`https://calczen-api.onrender.com`

Test:

- `https://calczen-api.onrender.com/api/health` → `"database": "connected"`
- `https://calczen-api.onrender.com/admin` → admin login

## 5. Connect Vercel frontend to Render API

In **Vercel → Project → Environment Variables** add:

```env
VITE_API_URL=https://calczen-api.onrender.com
```

Use your actual Render URL (no trailing slash). Apply to **Production** and **Preview**, then **Redeploy** Vercel.

The site will call `https://calczen-api.onrender.com/api/subscribe` instead of same-origin `/api`.

### Admin on Render

Open admin at:

`https://calczen-api.onrender.com/admin`

Build `admin` is included via `npm run build:admin` on Render. The API runs with `node server.js` (no `dist/` compile step).

For admin API calls from the browser, set in **admin** build on Render — admin uses `VITE_API_URL` too. When served from same Render host, leave `VITE_API_URL` empty on Render (same origin). Only the **Vercel** frontend needs `VITE_API_URL`.

## 6. Seed admin user

On your PC (with production Supabase creds in `server/.env`):

```bash
npm run seed:admin
```

## 7. Optional: deploy with Blueprint

Repo includes `render.yaml`. In Render: **New +** → **Blueprint** → select repo → fill secret env vars when prompted.

## Free tier notes

- Render free web services **spin down** after inactivity; first request may take ~30s.
- Upgrade to a paid instance for always-on API.

## Local dev (unchanged)

```bash
npm run dev:server    # API :3001
npm run dev           # Vite :8080 (proxies /api → :3001)
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS error from Vercel | Add Vercel URL to `CORS_ORIGIN` on Render, redeploy |
| Subscribe fails | Check `VITE_API_URL` on Vercel matches Render URL |
| Admin 503 | Ensure `npm run build:admin` ran (builds `admin/dist`) |
| DB errors | Run `schema.sql` in Supabase; check `SUPABASE_*` keys |
