# CalcZen — Vercel deployment (Vite SPA)

## Stack on Vercel

| Part | Technology |
|------|----------------|
| Frontend | **Vite** + React + TanStack Router (SPA, `dist/`) |
| API | Express serverless (`api/index.ts`) |
| Admin | Vite SPA at `/admin` |

## Vercel dashboard

| Setting | Value |
|---------|--------|
| Framework Preset | **Vite** |
| Root Directory | `.` |
| Build Command | `npm run vercel-build` |
| Output Directory | `dist` |
| Install Command | `npm install && npm install --prefix server && npm install --prefix admin` |

## Environment variables

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
RESEND_API_KEY=
EMAIL_FROM=hello@calczen.in
SITE_URL=https://www.calczen.com
CORS_ORIGIN=https://www.calczen.com,https://YOUR_PROJECT.vercel.app
```

Optional: `SITE_URL` is used when generating `public/sitemap.xml` at build time.

Do **not** set `VITE_API_URL` (same-origin `/api`).

## Deploy

1. Push to GitHub.
2. Import on Vercel → Framework: **Vite**.
3. Add env vars → Deploy.
4. `npm run seed:admin` locally after Supabase tables exist.

## Verify

- `/` — calculator site  
- `/api/health` — API  
- `/admin` — admin panel  
- `/sitemap.xml` — static sitemap  

## Local dev

```bash
npm run dev          # Vite :8080
npm run dev:server   # API :3001
npm run dev:admin    # admin
```
