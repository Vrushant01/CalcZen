# CalcZen — Subscription, Supabase & Resend

Production-ready subscriber system with **Supabase PostgreSQL**, **Resend** email, and the **admin panel**.

## Architecture

```
CalcZen website  →  POST /api/subscribe  →  Supabase (subscribers)
                        ↓
                  Resend welcome email (hello@calczen.in)

Admin panel (/admin)  →  JWT  →  Dashboard / Newsletter  →  Resend batch
```

## 1. Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run `server/supabase/schema.sql`
3. Copy credentials from **Project Settings → API**:
   - `SUPABASE_URL`
   - `service_role` key (recommended for server) or `anon` key

## 2. Environment (`server/.env`)

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side key (bypasses RLS) |
| `SUPABASE_ANON_KEY` | Fallback if service role not set |
| `JWT_SECRET` | Admin auth |
| `RESEND_API_KEY` | Resend API key |
| `EMAIL_FROM` | `hello@calczen.in` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed admin |

## 3. Local development

```bash
npm install
cd server && npm install
npm run seed:admin    # after Supabase tables exist
npm run dev:server    # :3001
npm run dev           # website
npm run dev:admin     # :5174/admin
```

## Database tables

### `subscribers`
| Column | Type |
|--------|------|
| id | UUID |
| email | TEXT (unique) |
| subscribed_at | TIMESTAMPTZ |
| source | TEXT |
| status | `active` \| `unsubscribed` |

### `admins` / `newsletters`
See `server/supabase/schema.sql`.

## API routes (unchanged)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/subscribe` | Subscribe + welcome email |
| POST | `/api/auth/login` | Admin login |
| GET | `/api/admin/stats` | Analytics |
| GET | `/api/admin/subscribers` | List / search / paginate |
| POST | `/api/newsletters/send` | Newsletter to active subscribers |

## Folder structure

```
server/
 ├── supabase/schema.sql
 ├── src/
 │   ├── config/supabase.ts
 │   ├── services/
 │   │   ├── subscriberService.ts
 │   │   ├── adminService.ts
 │   │   ├── newsletterService.ts
 │   │   └── emailService.ts      # Resend
 │   ├── controllers/
 │   └── types/database.ts
 └── server.js
```

## Migrating from MongoDB

1. Export subscribers from MongoDB (or CSV from admin)
2. Insert into Supabase `subscribers` with matching columns
3. Re-run `npm run seed:admin` if admins table is empty
4. Remove `MONGODB_URI` from env

## Vercel

Set all `server/.env` variables in Vercel project settings. Build server before deploy:

```bash
cd server && npm run build
```

Use `api/index.ts` serverless handler or deploy server to Railway/Render with `npm start`.
