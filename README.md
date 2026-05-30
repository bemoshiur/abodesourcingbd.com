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
- **Resend** REST API for the inquiry form (server-side via Next Route Handler)
- Deployed on **Vercel** (auto-builds from `main`)

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

To test inquiry-form delivery locally, drop your Resend key into
`.env.local` (gitignored):

```bash
echo 'RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx' > .env.local
npm run dev
```

Without a key the form gracefully falls back to a prefilled `mailto:` link
— never dead-ends.

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
    services/[slug]/            6 dynamic service pages
    products/[slug]/            5 dynamic product-category pages
    factories/[slug]/           6 dynamic factory pages
    api/inquiry/route.ts        Form mailer → Resend REST
    sitemap.ts, robots.ts, manifest.ts
    icon.svg, apple-icon.png, opengraph-image.png, twitter-image.png
  content/
    site.ts                     Identity, partners, mission, vision, certs, etc.
    services.ts, products.ts, factories.ts, buyers.ts
    slugify.ts                  Authoring helper (slugs are still stored explicitly)
  components/
    ui/                         shadcn primitives
    site-header, site-footer, cta-band, breadcrumbs, page-header
    inquiry-form, logo, logo-mark, logo-wall, export-markets
    stats-strip, why-choose-us, reveal, nav-progress, icon, jsonld
  lib/
    routes.ts, relations.ts, utils.ts
public/
  products/, logos/, factories/, office/     Local assets
docs/
  DEPLOYMENT.md, JOURNEY.md
```

---

## Content model

All content lives as typed arrays under `src/content/`. Counts shown on the
site (factories, markets, categories, buyers, certifications) are computed
with `.length` so they can never drift from the data. Slugs are **stored
explicitly** on every item (WordPress-style permalinks); they are never
derived from titles at render time.

To add a service, product category, factory, or buyer: append an entry to
the relevant array and the new detail page is generated automatically via
`generateStaticParams()`.

```ts
// src/content/services.ts
export const services: Service[] = [
  {
    slug: "merchandising-support",       // explicit, stable
    title: "Merchandising Support",
    icon: "ClipboardList",
    summary: "…",
    intro: "…",
    covers: [ /* … */ ],
    how: [ /* … */ ],
    relatedCategories: ["knitwear", "woven-wear"],
  },
  // …
];
```

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
