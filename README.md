# ABD Sourcing Bangladesh

> **Delivering Apparel. Building Trust.**

Marketing and lead-generation site for **ABD Sourcing Bangladesh** — a Dhaka-based garments
buying & sourcing office serving global fashion and workwear brands across Europe and North
America. Knitwear, woven wear, activewear, outerwear and workwear.

Live: [www.abodesourcingbd.com](https://www.abodesourcingbd.com) · Admin: `/admin`

---

## Stack

- **Next.js 16** (App Router, React Server Components) + **React 19**, **TypeScript** (strict)
- **Tailwind CSS v4**, shadcn/ui on **Base UI** primitives, **lucide-react** icons
- **Payload CMS v3** embedded in the same app — admin at `/admin`, **Postgres (Neon)** for
  content, **Vercel Blob** for images (private store, served through `/api/media/file/*`)
- **Resend** for the inquiry form (server-side Route Handler)
- Deployed on **Vercel**; SEO/AEO/GEO audited with **OmniRank**

---

## Quick start

```bash
npm install
cp .env.example .env.local     # fill DATABASE_URL, PAYLOAD_SECRET, BLOB_READ_WRITE_TOKEN, RESEND_API_KEY
npm run migrate                # create/upgrade the database schema
npm run seed                   # base content, 71 products (needs Website_images/), SEO copy
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a long random password' npm run admin:create
npm run dev
```

| Script | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Next.js. `build` = fix migration imports → `payload migrate` → content guard → `next build` |
| `npm run migrate` · `migrate:create -- <name>` · `migrate:status` | Database migrations (committed in `migrations/`) |
| `npm run generate:types` | Regenerate `src/payload/payload-types.ts` after any schema change |
| `npm run seed [-- base\|products\|imagery\|seo]` | Idempotent content import (`scripts/seed.mts`, data in `scripts/data/`) |
| `npm run admin:create` | Create or reset the CMS admin (`ADMIN_EMAIL` / `ADMIN_PASSWORD` from the environment) |
| `npm run check:content` | Fails if any published content contains buyer names, personal names, phone numbers or extra emails |
| `npm run media:repair [-- <substr>]` | Re-upload any Media file that is missing from Blob storage and verify it |

---

## Hard content rules

Enforced by `npm run check:content`, which runs in every build (a violation blocks the deploy):

1. **No client / buyer brand names** anywhere — copy, alt text, filenames, structured data.
2. **No owner or staff personal names, personal emails or phone numbers.** The one public
   contact is `info@abodesourcingbd.com`.
3. **No invented facts.** Statistics are computed from CMS counts; certifications are worded
   as "held across our partner factories".

---

## Project layout

```
src/app/            routes (home, about, services, products, factories, compliance, contact),
                    /og share cards, llms.txt / llms-full.txt / facts.json, robots, sitemap
src/components/     UI (header, footer, product card/gallery/explorer, inquiry list, marquee, FAQ …)
src/lib/payload.ts  the only bridge to the CMS — async view-model helpers
src/lib/page-meta.ts  title / description / heading / answer for every page (single source)
src/lib/seo.ts · schema.ts · answers.ts · default-faqs.ts   metadata, JSON-LD, fallbacks
src/payload/        collections, globals, hooks, storage adapter, generated types
migrations/         committed Payload migrations
scripts/            seed, admin bootstrap, content guard, media repair, seed data
```

---

## Editing content (admin panel)

Sign in at `/admin`. Saved changes go live immediately (every save revalidates the site).

- **Products** — name, style number, composition/GSM/construction, photos, featured, order,
  per-product SEO. Each product gets its own page at `/products/<category>/<slug>/`.
- **Product categories · Services · Factories** — copy, quick answer (40–60 words), FAQs, SEO
  title/description/heading.
- **Page SEO & FAQs** (global) — title, description, H1, answer and FAQs for every main page.
- **Site Settings** — identity, the public email, address, showroom photo, content licence for
  AI engines (`none` or `CC BY 4.0`), profile links.
- **Site Content** — certifications (add a logo per certification and it replaces the text
  badge in the scrolling band), QC steps, production flow, export markets.
- **Media** — every image needs alt text; never include client or brand names.

## Inquiry list

Visitors tap **Add to inquiry** on any style; the list persists in the browser, shows in the
header drawer, and is attached to the contact form. Selected styles (name, style ref and link)
are included in the email sent to `INQUIRY_TO_EMAILS`.

---

## SEO · AEO · GEO

Implemented to the [OmniRank](https://github.com/bemoshiur/OmniRank) spec: keyword-led titles
and descriptions, a 40–60 word `AnswerBlock` on every URL, FAQ blocks mirrored as `FAQPage`
JSON-LD, one `@graph` per page with stable `@id`s (no phone, ratings or offers), `speakable`,
`llms.txt` / `llms-full.txt` / `facts.json`, an explicit AI-crawler allowlist in `robots.txt`,
a sitemap with honest `lastmod`, and per-page share images.

```bash
# local build audit
npm run build && npm start &
python3.14 -m venv .venv-omnirank && .venv-omnirank/bin/pip install \
  "omnirank @ git+https://github.com/bemoshiur/OmniRank.git@v0.4.0#subdirectory=scripts/py"
.venv-omnirank/bin/omnirank audit --config omnirank.config.json      # audits the production origin
```

A weekly GitHub Action (`.github/workflows/omnirank.yml`) audits production.

---

## Deployment

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — environment variables, domains, first deploy,
admin creation, verification and troubleshooting.

---

## Design system

One palette (forest green + warm paper + restrained sand/gold, OKLCH tokens), one radius scale,
**Hanken Grotesk** + **Fraunces** via `next/font`. Gradient / glass / mesh utilities
(`.glass`, `.mesh-dark`, `.mesh-light`, `.text-gradient`, `.ring-gradient`, `.spotlight`,
`.marquee-*`). Every animation has a `prefers-reduced-motion` fallback, and the marquee has a
visible pause control.

Mobile Lighthouse (throttled): Accessibility 100 · SEO 100 · Best Practices 96 · Performance 87–91.

---

## Credits

Built by [**Public Pulse Agency**](https://publicpulse.com.bd) for ABD Sourcing Bangladesh.
