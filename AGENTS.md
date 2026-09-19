<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:payload-agent-rules -->
# Payload CMS owns the content

All site content lives in Payload (Postgres), not in code. Conventions:

- Collections/globals are defined in `src/payload/`. After changing any field: `npm run generate:types`, then `npm run migrate:create -- <name>` and `npm run migrate` (schema changes ship as committed migrations in `migrations/` — auto-push is off). `npm run build` applies pending migrations before `next build`.
- Pages/components never import Payload directly — they use the async view-model helpers in `src/lib/payload.ts`.
- Relative imports inside `src/payload/payload.config.ts` (and scripts run with `payload run`) must use explicit `.ts` extensions; the scripts are `.mts` ES modules.
- `src/content/` and `scripts/data/*.json` are seed data only — the CMS is the source of truth afterwards. Never add new content there.
- Files marked "THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD" under `src/app/(payload)/` must not be hand-edited.
- Never share one `context` object between Local API creates that upload media — the storage plugin flags `req.context` and every upload after the first silently becomes a no-op (see scripts/seed.mts).
<!-- END:payload-agent-rules -->

<!-- BEGIN:layout-rules -->
# App structure

- `src/app/(site)/` is the public site (its own root layout, header/footer, Google tag). `src/app/(payload)/` is the CMS admin with Payload's own root layout — the two must never share a layout, or the admin renders inside the marketing chrome.
- Metadata routes (`robots.ts`, `sitemap.ts`, `manifest.ts`, icons), `llms.txt`, `llms-full.txt`, `facts.json`, `og` and `api/inquiry` live at `src/app/` root. Unmatched URLs use `src/app/global-not-found.tsx`.
- The Google tag (`GoogleTag`) goes first in `<head>` of the site layout and the global 404 — exactly once per page, never in the admin.
- sharp's native libvips is bundled through `outputFileTracingIncludes` in `next.config.ts`; without it every Payload route 500s on Vercel.
<!-- END:layout-rules -->

<!-- BEGIN:site-content-rules -->
# Hard content rules (enforced by `npm run check:content` in every build)

- **No client / buyer brand names anywhere** — copy, alt text, filenames, JSON-LD, share images. Partner *factories* are suppliers, not clients, and may be named.
- **No owner or staff personal names, no personal emails, no phone numbers.** The single public contact is `info@abodesourcingbd.com`.
- **No invented facts**: no made-up statistics, MOQs, prices, lead times, ratings, reviews, awards or dates. Numbers shown on the site are computed from CMS counts.
- Certifications are described as "held across our partner factories", never as ABD's own.
- **Never reveal how many styles / products the catalogue holds** — no "71 styles", no "styles listed", no `numberOfItems` in JSON-LD, no result counts in filters. Counts of factories, categories, markets, certifications and QC steps are fine.
- **Slugs are always URL-safe** (`slugField()` in `src/payload/fields/slug.ts` converts typed text; `check:content` fails the build on a bad slug). A raw slug with spaces produced a live 308 loop and an invalid sitemap entry once — never add a plain text `slug` field.
- **Factories are labelled by country** ("Factory in Bangladesh" / "Factory in India", from the factory's `country` field). Factory websites are kept in the CMS but never linked or shown publicly.
- **Third-party logos** (certifications, memberships, factories) are the owners' marks, sourced from their own sites and recorded in `scripts/data/logos/manifest.json`. Always render them through `LogoPlate` (white plate, `fill` + `object-contain`); never redraw or recolour them. A row with no logo falls back to a text badge.
<!-- END:site-content-rules -->

<!-- BEGIN:seo-rules -->
# SEO / AEO / GEO conventions (OmniRank)

- Every page: one `<h1>` (PageHeader), a 40–60 word plain-prose `AnswerBlock` right after it, the metadata from `src/lib/page-meta.ts` via `buildMetadata()`, and a single JSON-LD `@graph` built with `src/lib/schema.ts` (stable `@id`s, real-only fields).
- Titles ≤ 60 chars, descriptions ≤ 155; `page-meta.ts` is the single source used by pages, sitemap, `llms.txt`, `llms-full.txt` and `facts.json`.
- FAQ blocks (≥ 3) render as `<details>` and mirror `FAQPage` JSON-LD from the same array.
- Verify with the OmniRank audit (see README) — target overall ≥ 98, every layer ≥ 93.
<!-- END:seo-rules -->
