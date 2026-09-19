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
- **Build stops at the content guard with `payloadInitError`**: Payload could not start — most likely a
  transient database connection problem (the cause was not captured). It happened twice on 2026-09-19
  in local builds, then passed 3 further builds and 8 out of 8 stand-alone start-ups with identical code
  and dependencies. Re-run the build; a failed Vercel deploy never replaces the live one.

## 7. Release checklist

Run from the repo root with `.env.local` pointing at the database (local builds read the live
database; they do not write to it):

```bash
npm run lint && npm test         # 0 errors; unit tests pass
npm run build                    # migrate → content guard → next build
npm start                        # then look at http://localhost:3000 at 390 px and 1440 px
git push origin <branch>:main    # a push to main is a production deploy — get the owner's OK first
```

When Vercel shows the deployment as *Ready* (about 2–3 minutes; `npx vercel ls abodesourcingbd-com`):

- the key URLs answer `200` (section 5);
- `omnirank audit --config omnirank.config.json` → overall ≥ 98, every layer ≥ 93 (100/100 on 2026-09-19);
- look at Home, a category, a product, Compliance and Contact at phone width: hero, footer call-to-action,
  footer certification strip, no sideways scroll;
- nothing that must not be public appears in the rendered pages — the content guard checks the CMS,
  so also spot-check the HTML for buyer names, personal names and phone numbers.

## 8. Git workflow

- `origin` is `github.com/bemoshiur/abodesourcingbd.com`; **`main` is production**.
- Work on a short-lived branch and fast-forward it into `main` after the checklist. Commit explicit
  paths, never `git add -A`: `.env*`, `.next/`, `node_modules/` and local working folders are git-ignored on purpose.
- Vercel builds every branch, but only `main` can succeed: `DATABASE_URL` exists only in Vercel's
  *Production* environment, so `payload migrate` fails in previews. That is deliberate — an unfinished
  migration can never run against the live database from a branch. Test locally instead.
- Schema changes ship as committed migrations (`npm run migrate:create -- <name>`) and the deploy
  applies them. Try every new migration on a scratch database first (`CREATE DATABASE` on the Neon
  project, point `DATABASE_URL` at it, `npm run migrate`, drop it afterwards).
- Releases are marked with tags. `release-2026-09-19` is the rebuilt Payload site with the Indian
  partner factories, 17 certifications and the redesigned Home hero.
- Unmerged work is kept on branch `seo-backlog` (guides collection, richer `llms.txt` / `facts.json`,
  robots, two migrations that are **not** applied to production). Rebase it onto `main` before using
  it and expect conflicts in `src/lib/answers.ts`, `src/lib/payload.ts` and `scripts/set-copy.mts`.
- Dependabot opens pull requests for dependency updates. Lockfile-only ones are safe to take after the
  checklist; anything touching `next`, `sharp` or `@payloadcms/*` follows § 9.

## 9. Maintenance and security

Snapshot 2026-09-19 (`npm audit --omit=dev`): **17 findings — 1 critical, 2 high, 13 moderate, 1 low.**
It was 29 before the lockfile update shipped in this release, which cleared every finding that does
not need a framework upgrade (`hono`, `js-yaml`, `qs`, `fast-uri`, `nanoid`, `ip-address`,
`brace-expansion`, `browserslist`, … — Dependabot PRs #3, #7, #8, #12, #14–#20).

What is left is **one supervised upgrade**:

| Finding | Where | Cleared by |
|---|---|---|
| Next.js advisories, including two critical remote-code-execution issues (one Windows-only, one in the image optimizer with AVIF) | `next` 16.2.6 | Next ≥ 16.3.3 (Dependabot PR #22) |
| sharp / libvips CVEs; PostCSS file-read | `sharp` 0.35.3, `postcss` bundled inside Next | Next 16.3.5 and sharp ≥ 0.35.4 (PR #21) |
| Moderate findings in the Payload family (drizzle / esbuild tooling, dompurify, …) | `payload`, `@payloadcms/*` 3.88 | Payload ≥ 3.90.1, which itself requires Next ≥ 16.3.3 |

Exposure, so the urgency is judged fairly: the site has no middleware, the public site uses no Server
Actions (the admin uses Payload's own server functions), and on Vercel `/_next/image` is served by
Vercel's image optimisation service. Still worth scheduling soon.

Procedure:

1. On a branch, bump `next` (it is pinned exactly in `package.json`) to the latest 16.3.x and `sharp`.
2. `npm run build`, then confirm `sharp-libvips` files are listed in
   `.next/server/app/(payload)/api/[...slug]/route.js.nft.json` — without them every Payload route
   returns 500 on Vercel (see `outputFileTracingIncludes` in `next.config.ts`).
3. Run the release checklist, sign in at `/admin`, edit and save a record, upload an image.
4. Merge, watch the deploy, verify production.
5. Repeat for `payload` and `@payloadcms/*` (also bump the exact-pinned `@payloadcms/plugin-cloud-storage`).
   Run `npm run migrate:create -- drift-check` on a scratch database: the generated migration should be
   empty; if it is not, the upgrade changes the schema and must ship as a real migration.
