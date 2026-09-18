<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:payload-agent-rules -->
# Payload CMS owns the content

All site content lives in Payload (Postgres), not in code. Conventions:

- Collections/globals are defined in `src/payload/`; after changing any field, run `npm run generate:types` (and `generate:importmap` if admin components changed).
- Pages/components never import Payload directly — they use the async view-model helpers in `src/lib/payload.ts`.
- Relative imports inside `src/payload/payload.config.ts` must use explicit `.ts` extensions (Node 25 + Payload CLI loaders).
- `src/content/` is legacy seed data only — never add new content there.
- Files marked "THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD" under `src/app/(payload)/` must not be hand-edited.
<!-- END:payload-agent-rules -->
