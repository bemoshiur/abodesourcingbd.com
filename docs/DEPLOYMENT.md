# Deploying to Vercel

Next.js 16 + **Payload CMS v3** in one app. Vercel auto-detects it; the only requirement is that
the project's **Build Command is the package script** (`npm run build`), because that script
applies database migrations and runs the content guard before `next build`.

## 1. Services

| Service | What for | Notes |
|---|---|---|
| **Neon Postgres** | all CMS content | pooled connection string → `DATABASE_URL` |
| **Vercel Blob** | image uploads | the store may be **private** (default here) or public — see `BLOB_ACCESS` |
| **Resend** | inquiry emails | domain `mail.abodesourcingbd.com` is verified |

## 2. Environment variables (Vercel → Settings → Environment Variables → Production)

| Variable | Value |
|---|---|
| `DATABASE_URL` | Neon pooled connection string |
| `PAYLOAD_SECRET` | long random string (`openssl rand -base64 32`) — changing it signs everyone out of `/admin` |
| `BLOB_READ_WRITE_TOKEN` | added automatically when the Blob store is connected to the project |
| `BLOB_ACCESS` | `private` (default) for a private store; `public` only for a public store |
| `RESEND_API_KEY` · `INQUIRY_FROM_EMAIL` | inquiry delivery |
| `INQUIRY_TO_EMAILS` | `info@abodesourcingbd.com` (defaults to this if empty) |

Environment variables are baked in at build time — redeploy after changing them.

## 3. Project settings

- **Framework:** Next.js · **Build Command:** `npm run build` (do **not** override with `next build`)
- **Production branch:** `main`
- **Domains:** `www.abodesourcingbd.com` is the canonical origin (CMS *Site Settings → url*). If you
  make the apex primary instead, update that CMS value and redirect `www` → apex with a **308**.
  The origin in *Site Settings → url* must be the one that answers `200` with no redirect.

## 4. First deploy

```bash
git push origin main            # Vercel builds: migrate → content guard → next build
```

Create the admin login once (never commit real values):

```bash
ADMIN_EMAIL=… ADMIN_PASSWORD='…' npm run admin:create      # run locally against the production DATABASE_URL
```

Sign in at `/admin` and change the password.

## 5. Verify

```bash
for p in / /products/ /contact/ /llms.txt /llms-full.txt /facts.json /robots.txt /sitemap.xml; do
  curl -s -o /dev/null -w "$p %{http_code}\n" https://www.abodesourcingbd.com$p; done
omnirank audit --config omnirank.config.json      # target: overall ≥ 98, every layer ≥ 93
```

Also submit `https://www.abodesourcingbd.com/sitemap.xml` in **Google Search Console** and **Bing
Webmaster Tools** (owner action).

## 6. Troubleshooting

- **A change "isn't showing"**: check `gh api repos/<owner>/<repo>/deployments` for a recent
  deployment — a repo move/rename can silently disconnect Vercel's Git integration.
- **Images 404 / 400**: run `npm run media:repair` (re-uploads anything missing from Blob and verifies).
- **Build fails at "Content guard"**: a buyer/brand name, personal name, phone number or extra
  email is in published content — the message names the exact record.
- **Rotate secrets** (Neon password, Blob token, `PAYLOAD_SECRET`) in the provider dashboards, then
  update Vercel and redeploy.
