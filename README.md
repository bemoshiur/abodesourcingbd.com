# ABD Sourcing Bangladesh

> **Delivering Apparel. Building Trust.**

Marketing site for **ABD Sourcing Bangladesh** — a Dhaka-based garments
buying & sourcing office serving global fashion and workwear brands across
Europe and North America. Knitwear, woven, sportswear, outerwear, and
customized apparel.

Live: [abodesourcingbd.com](https://abodesourcingbd.com)

---

## Stack

- **Next.js 16** (App Router, React Server Components) + **React 19**
- **TypeScript** (strict), **Tailwind CSS v4**
- **shadcn/ui** (base-nova style) on **Base UI** primitives
- **lucide-react** icons, **country-flag-icons** for export-market flags
- **Payload CMS v3** embedded in the same app — admin panel at `/admin`,
  Postgres (Neon) for content, Vercel Blob for image uploads
- **Resend** REST API for the inquiry form (server-side via Next Route Handler)
- Deployed on **Vercel** (auto-builds from `main`)

---

## Quick start

```bash
npm install
# fill .env.local (see .env.example): PAYLOAD_SECRET, DATABASE_URL, RESEND_API_KEY
npm run seed       # one-time: import the existing content into the CMS
npm run dev        # http://localhost:3000 — admin at /admin
```

To test inquiry-form delivery locally, add your Resend key to `.env.local`
(gitignored). Without a key the form gracefully falls back to a prefilled
`mailto:` link — never dead-ends.

### Other scripts

```bash
npm run build    # production build
npm start        # serve the production build locally
npm run lint     # ESLint
```

---

## Project layout

```
src/
  app/
    layout.tsx                  Root layout (chrome, fonts, metadata)
    page.tsx                    /
    about/, services/, products/, factories/, buyers/, compliance/, contact/
    services/[slug]/            Dynamic service pages
    products/[slug]/            Dynamic product-category pages
    factories/[slug]/           Dynamic factory pages
    api/inquiry/route.ts        Form mailer → Resend REST
    (payload)/                  Payload CMS admin (/admin) + REST API (/api)
    sitemap.ts, robots.ts, manifest.ts
    icon.svg, apple-icon.png, opengraph-image.png, twitter-image.png
  payload/
    payload.config.ts           Payload config (collections, globals, db, storage)
    collections/                Users, Media, Services, ProductCategories,
                                ProductShots, Factories, Buyers
    globals/                    SiteSettings, SiteContent
    payload-types.ts            Generated — run `npm run generate:types`
  lib/
    payload.ts                  Data-access layer — all pages read content here
    routes.ts, utils.ts
  components/
    ui/                         shadcn primitives
    site-header, site-footer, cta-band, breadcrumbs, page-header
    inquiry-form, logo, logo-mark, export-markets
    stats-strip, why-choose-us, reveal, nav-progress, icon, jsonld
  content/                      LEGACY — original data, kept only as the
                              seed source; delete after seeding is verified
scripts/
  seed.ts                       One-time import of src/content into Payload
public/
  products/, logos/, factories/, office/     Original assets (office photos
                                             are still served from here)
docs/
  DEPLOYMENT.md, JOURNEY.md
```

---

## Editing content (admin panel)

All site content is edited in the Payload CMS admin panel at **`/admin`**
(no code changes needed): services, product categories, product photos,
factories, buyers, company details, mission/vision, certifications, export
markets, and the QC process. Images are uploaded to Vercel Blob via the
**Media** collection.

Pages are statically generated with a 60-second revalidation window, so an
edit in the admin goes live within about a minute — no redeploy.

The first admin user is created on first visit to `/admin`
(email + password). Slugs are stored explicitly on every item; changing a
slug changes that page's URL.

---

## Inquiry form

`/contact/` posts JSON to **`/api/inquiry`** (Next Route Handler). The
handler validates, then calls Resend's REST API with `RESEND_API_KEY`
read from the server environment — the key never reaches the browser.
Designed states: success, validation error, network/server error, and a
no-key `mailto:` fallback.

### Env vars

| Var | Purpose | Required |
|---|---|---|
| `PAYLOAD_SECRET` | Random secret for Payload sessions | yes |
| `DATABASE_URL` | Postgres connection string (Neon) | yes |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token for Media uploads | yes on Vercel (optional locally — falls back to disk) |
| `RESEND_API_KEY` | Public Pulse Agency Resend key | yes (else mailto fallback) |
| `INQUIRY_FROM_EMAIL` | `From` address (must be a Resend-verified domain) | optional |
| `INQUIRY_TO_EMAILS` | Comma-separated recipients | optional (defaults to `shakhawat@abodesourcingbd.com`) |

See [`.env.example`](.env.example).

---

## Deployment

GitHub-driven Vercel deploys: any push to `main` triggers a production
build; PRs get preview URLs. Full step-by-step (Vercel import, env vars,
custom domain) is in [**docs/DEPLOYMENT.md**](docs/DEPLOYMENT.md).

---

## Design system

- One palette: forest green (`--primary`), warm-paper neutral, restrained
  sand/gold accent. OKLCH semantic tokens, light + `.dark`.
- One radius scale derived from a single `--radius`.
- One type family: **Hanken Grotesk** (body) + **Fraunces** (display, hero
  only) via `next/font`.
- Gradient + glassmorphism vocabulary as reusable utilities (`.glass`,
  `.ring-gradient`, `.text-gradient`, `.bg-brand-gradient`, ambient
  backdrop).
- Every animation paired with a `prefers-reduced-motion` guard in the same
  edit, plus a global reduced-motion safety reset.

Last measured Lighthouse (mobile, production build):
**Home 94/100/100/100 · Contact 91/100/100/100** (Perf/A11y/Best-Practices/SEO).

---

## Credits

Built by [**Public Pulse Agency**](https://publicpulse.com.bd) for ABD
Sourcing Bangladesh.
