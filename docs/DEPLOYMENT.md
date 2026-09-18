# Deploying to Vercel

This is a standard Next.js project (App Router, Next 16, React 19) with
**Payload CMS v3** embedded in the same app (admin at `/admin`). Vercel
auto-detects it — no `vercel.json`, no special config. The inquiry form
delivers via the **Next Route Handler** at `src/app/api/inquiry/route.ts`,
which calls Resend's REST API server-side so the API key never reaches the
browser.

---

## 0. One-time services the CMS needs

Payload stores content in **Postgres** and uploads in **Vercel Blob**.

1. **Neon Postgres (free tier):** create an account at https://neon.tech →
   new project → copy the pooled connection string
   (`postgresql://…?sslmode=require`). This is `DATABASE_URL`.
2. **Vercel Blob:** in the Vercel project → **Storage → Create Database →
   Blob** → connect to the project. Vercel sets `BLOB_READ_WRITE_TOKEN`
   automatically on deploy; for local dev copy the token from the store's
   `.env.local` tab.
3. **`PAYLOAD_SECRET`:** any random string — `openssl rand -base64 32`.

## 1. Push to GitHub

The remote is already set to:

```
https://github.com/The-Public-Pulse-Agency/abodesourcingbd.com.git
```

From the repo root:

```bash
git push -u origin main
```

(You'll be prompted for a GitHub personal access token if HTTPS is set up;
or use SSH if your key is added to GitHub.)

---

## 2. Import the repo into Vercel

1. Go to **https://vercel.com/new** while signed in with the GitHub account
   that owns `The-Public-Pulse-Agency/abodesourcingbd.com`.
2. Pick **Import Git Repository** → select that repo.
3. Vercel auto-detects:
   - **Framework Preset:** Next.js
   - **Build Command:** `next build`
   - **Output Directory:** `.next` (handled by Vercel automatically)
   - **Install Command:** `npm install`

   Leave the defaults — they're correct.

---

## 3. Add environment variables

Before the first deploy, click **Environment Variables** and add these
(scope to **Production** *and* **Preview** so PR previews also work):

| Key | Value |
|---|---|
| `PAYLOAD_SECRET` | Random string (`openssl rand -base64 32`) |
| `DATABASE_URL` | Neon Postgres connection string |
| `BLOB_READ_WRITE_TOKEN` | Set automatically if you connected the Blob store |
| `RESEND_API_KEY` | _Public Pulse Agency Resend key_ (`re_…`) |
| `INQUIRY_FROM_EMAIL` _(optional)_ | `ABD Sourcing <noreply@your-verified-domain.com>` |
| `INQUIRY_TO_EMAILS` _(optional)_ | `shakhawat@abodesourcingbd.com` |

- Get the Resend key from https://resend.com/api-keys (use a key scoped to
  this project; "Full access" is fine for sending).
- `INQUIRY_FROM_EMAIL` **must be on a domain you've verified in Resend**.
  Until you've verified one, leave it unset and Resend will use its shared
  test sender (`onboarding@resend.dev`) — works, but Gmail may treat the
  email as suspicious. Verify a real domain ASAP via
  https://resend.com/domains.
- `INQUIRY_TO_EMAILS` defaults to `shakhawat@abodesourcingbd.com` if
  omitted; comma-separate to add more recipients.

Click **Deploy**. First build takes ~2–3 minutes.

## 3b. First run: seed the content + create the admin user

After the first successful deploy:

1. Run the seed **once** against the production database from your machine:

   ```bash
   # .env.local must contain the production DATABASE_URL (+ BLOB_READ_WRITE_TOKEN)
   npm run seed
   ```

   This imports all existing content (services, categories, photos,
   factories, buyers, settings) into the CMS. It is idempotent — safe to
   re-run.
2. Open `https://abodesourcingbd.com/admin` — Payload asks you to create
   the first user. That email + password is the admin login.
3. From then on, all content edits happen in `/admin`; changes go live
   within ~60 seconds (ISR), no redeploy needed.

---

## 4. Verify the form

Open the live URL Vercel hands you (e.g.
`abodesourcingbd-com.vercel.app`) → `/contact/` → fill the form → submit.

| Response | What you see | Action |
|---|---|---|
| `200 ok` | Green "Inquiry sent" panel | ✅ Email lands at shakhawat@ |
| `fallback: true` | Amber "Open in your email app" | `RESEND_API_KEY` isn't set in Vercel env |
| `502` | Red error + "Open in your email app" | Check Resend dashboard — usually unverified `from` address |
| `400` | Red inline errors under fields | Form validation working as intended |

---

## 5. Custom domain (`abodesourcingbd.com`)

In the Vercel project → **Settings → Domains** → add `abodesourcingbd.com`
and `www.abodesourcingbd.com`. Vercel shows the exact A / CNAME records to
point at your DNS provider. Once DNS propagates, Vercel auto-issues an SSL
cert and the site goes live on the real domain.

The site already canonicalises to `https://abodesourcingbd.com` via
metadata + sitemap.

---

## 6. Re-deploy

Vercel watches the GitHub branch — any push to `main` triggers a new
production build. Pull requests get auto-preview URLs. No manual steps
needed.

For an immediate deploy without pushing, run:

```bash
npx vercel --prod
```

(from the repo root, after `npx vercel link` once to associate the local
repo with the Vercel project).

---

## Local development

```bash
npm install
# .env.local needs PAYLOAD_SECRET + DATABASE_URL (+ BLOB_READ_WRITE_TOKEN
# for real uploads; without it uploads stay on local disk)
npm run seed     # first time only — imports the legacy content into the CMS
npm run dev      # http://localhost:3000 — admin at /admin
```

The inquiry form's Route Handler runs in dev too — set `RESEND_API_KEY`
in `.env.local` (gitignored) to test real send locally:

```bash
echo 'RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx' >> .env.local
npm run dev
```

Without a key, the form gracefully shows the amber "Open in your email
app" mailto fallback — same behaviour you'll see in Vercel previews
where you haven't added the env var.
