# Build Journey — ABD Sourcing Bangladesh

A running log of structural decisions. One line per working chunk.

## 2026-05-27
- STEP 1 done: extracted 71 product photos + 10 logos + 5 factory logos + 5 office shots from `ABD Profile_15-05-26.pdf` via PyMuPDF (deduped by pixel hash, dropped <300px and 3 swatch grids).
- Scaffolded Next.js 16.2.6 (App Router, TS, Tailwind v4, src dir) + shadcn/ui (base-nova / base-ui), `trailingSlash: true`.
- Authored OKLCH semantic tokens (forest green + warm paper + sand/gold) with light + `.dark`, one `--radius` scale, Hanken Grotesk (body) + Fraunces (display) via next/font.
- All facts live in typed arrays under `src/content/` with explicit stable slugs; counts computed via `.length`.
- Route skeleton: 12 static + 18 dynamic `[slug]` (services×6, products×5, factories×6) via `generateStaticParams`; shared sticky header/footer chrome, breadcrumbs + BreadcrumbList JSON-LD, Organization/LocalBusiness JSON-LD, `sitemap.ts`, `robots.ts`.
- Verified: `next build` clean, `eslint` clean, 308 redirect no-slash → trailing-slash, all canonical URLs 200, sitemap enumerates every route.
- STEP 2 done: motion layer in `globals.css` — animated hero aurora, `.press-fx` (on every `[data-slot=button]`), `.interact` card hover-lift, `.img-zoom`, anchor active tap-cue, `.reveal`, and the route-change `.nav-progress` bar — each paired with a `prefers-reduced-motion` guard, plus a global reduced-motion safety reset.
- Motion components: `Reveal` (IntersectionObserver, no-JS/reduced-motion safe) and `NavProgress` (route-change). Card hover-lift centralized from inline Tailwind to the guarded `.interact` utility across all index pages.
- shadcn primitives added (base-nova / base-ui): card, badge, input, select, textarea, dialog, sheet, breadcrumb, skeleton, label; button kept with custom `xl` size + `press-fx`. Mobile nav upgraded to a focus-trapped Sheet (closes on link click — no setState-in-effect).
- Verified: `next build` + `eslint` clean; mobile Sheet, hover-lift, reveal, and aurora confirmed in-browser.
- STEP 3 done: all routes fully populated from content arrays. Completed the cross-link triangle via `src/lib/relations.ts` — product category pages now list "Sourced through these factories" + "Related services"; factory pages list "How we support this factory"; service pages list "Factories involved". Adopted the Badge primitive for sub-item / category tags. Added `Reveal` scroll motion to the services/products/factories index grids and the category gallery. `next build` + `eslint` clean (excluded `.remember`/`.venv` from lint).
- STEP 4 done: inquiry Server Action (zod-validated → Resend, prefilled mailto fallback when no key) + engaging 3-step glass form (stepper, per-step client validation, optimistic submit, success/error/fallback states). Recipient = the public inbox (override via INQUIRY_TO_EMAILS).
- Design overhaul (user-directed): gradient + glassmorphism vocabulary — ambient backdrop, .glass / .glass-on-dark / .ring-gradient, brand gradient fills, .text-gradient, all as named utilities. Applied to header, hero (gradient headline), glass stat tiles, cards, CTA band, why-choose-us, export markets, contact form.
- Modern SVG logomark (forest badge + needle-point "A" + gold thread) wired into chrome; favicon (icon.svg), apple-icon, opengraph-image + twitter-image (1200×630), web manifest.
- SEO: per-page keywords + OG on every route, robots directives, richer root metadata.
- Export markets rebuilt as glass cards with real country flags (country-flag-icons). Footer credit: "Made with ♥ by Public Pulse Agency". Added verified Sprayway + Nimbus buyer logos.
- Refinements: hero H1 changed to the company name "ABD SOURCING BANGLADESH" (uppercase, gradient accent) with the tagline as a sub-headline. Contact form simplified from a 3-step wizard back to a single clean professional glass form (all fields one screen, designed inline validation, optimistic submit, success/error/mailto-fallback states).
- STEP 5 done: @media print styles (hide chrome, force light, kill gradients/shadows/blur). A11y: introduced --accent-ink (AA-contrast gold ~4.9:1) for eyebrow text on light surfaces — fixes all color-contrast fails; fixed logo accessible-name mismatch (removed aria-label, sr-only "homepage"). Verified unique <title> on all 11 sampled routes, alt on every image, sitemap covers all routes.
- Lighthouse (mobile, prod build): Home P94/A100/BP100/SEO100; Contact P91/A100/BP100/SEO100. TBT 0ms, CLS 0 on both. Build + lint clean.
- cPanel deployment retarget: switched to static export (output:"export" + unoptimized images), produces /out for upload to public_html. Server Action replaced by public/api/inquiry.php — PHP mailer hits the Resend REST API server-side so the API key never reaches the browser. .htaccess added (gzip, long-cache, security headers). docs/DEPLOYMENT.md written. Removed unused resend + zod npm deps. Build emits all 35 routes + sitemap + manifest + icons + PHP + .htaccess into out/ (~15 MB); lint clean; static-serve smoke test passes.
- Retargeted to Vercel-only (user dropped cPanel). Removed public/.htaccess + public/api/inquiry.php. Reverted next.config to standard Next (image optimizer on, trailingSlash on). Added Next Route Handler at src/app/api/inquiry/route.ts that calls Resend REST via fetch (no SDK dep) — same logic the PHP file had, now in TypeScript and runs on Vercel. Form posts to /api/inquiry. Renamed package "abd-scaffold" → "abodesourcingbd-com". Updated DEPLOYMENT.md to a Vercel guide (GitHub-driven auto-deploy + env vars).
- Initialized git on `main`, configured remote → https://github.com/The-Public-Pulse-Agency/abodesourcingbd.com.git, made the initial commit (164 files, build clean, lint clean, 36 routes including /api/inquiry).

## 2026-08-21
- Removed owner-identifying content (user-directed): Leadership section on /about, Partners card on /contact, buyer logo wall on Home + /buyers (brand list stays), `partners` array in site.ts, logo-wall component.
- Integrated **Payload CMS v3.88** (full Next 16.2 support) embedded in-app: collections Users/Media/Services/ProductCategories/ProductShots/Factories/Buyers + globals SiteSettings/SiteContent under `src/payload/`; `(payload)` route group serves `/admin` + REST `/api/*` (existing `/api/inquiry` wins by specificity). Postgres adapter (Neon) + Vercel Blob for Media.
- All pages/components moved from `src/content/*` imports to async helpers in `src/lib/payload.ts` (React-cache memoized); every content page now has `revalidate = 60` (ISR) so admin edits go live within a minute. `generateStaticParams` queries Payload; `src/lib/relations.ts` absorbed into the data layer; inquiry form receives markets/categories as props.
- `scripts/seed.ts` (idempotent, `npm run seed`) imports the legacy `src/content/*` arrays + uploads public/ images into Media. Legacy content kept until the seed is verified against a real DB.
- Gotcha: Node 25 + Payload's loaders need explicit `.ts` extensions on relative imports in `payload.config.ts` (`allowImportingTsExtensions` enabled in tsconfig).
- Pending: owner provisions Neon `DATABASE_URL` + Vercel Blob token + `PAYLOAD_SECRET`; then seed, create first admin user, build-verify, deploy.

## 2026-09 — CMS rebuild
- Payload CMS on Neon + private Vercel Blob (custom storage adapter). Buyers, partners/leadership and phone numbers removed; single public inbox.
- Product catalogue (style refs, composition, GSM) from the owner's spec sheets, each with its own page; "Add to inquiry" list wired into the contact form.
- Certifications: 14 marks in a two-row scrolling band with pause control and reduced-motion fallback.
- UI/UX pass: mesh gradients, glass, spotlight cards, staggered reveals, mega-menu, mobile action bars.
- SEO/AEO/GEO to the OmniRank spec: answer blocks, FAQs, JSON-LD graph, llms.txt/facts.json, AI-crawler allowlist, honest sitemap; keyword map (no volume data was available — Semrush/Ahrefs had no credits).
- Guards: content guard in every build; media integrity repair script; browser QA (overflow, headings, alt, interactions).
