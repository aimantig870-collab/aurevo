# Aurevo — project roadmap & status

| # | Stage | Status | Evidence |
|---|-------|--------|----------|
| 1 | Environment inspection & architecture | ✅ Done | Next.js 16 / React 19 / Tailwind 4 / Supabase |
| 2 | Brand strategy & creative direction | ✅ Done | `docs/brand-strategy.md` |
| 3 | Visual identity (logo, palette, type, mockups) | ✅ Done (vector) | `public/art/*`, `/brand` page |
| 4 | Website (12 public pages) | ✅ Done | `npm run test:e2e` |
| 5 | Database & backend | ✅ Written + tested in an in-process Postgres | `supabase/migrations`, `npm run test:db` |
| 6 | Admin dashboard | ✅ Built and tested on a live Supabase project (49 checks) | `src/app/admin` |
| 7 | Marketing content structure | ✅ Done | `docs/marketing-strategy.md`, `docs/content-calendar.md` |
| 8 | Security & validation | ✅ Done (see README) | RLS tests, zod, headers |
| 9 | Testing | ✅ Unit + DB/RLS + e2e smoke | 7 + 18 + 109 checks |
| 10 | Deployment preparation | ✅ Docs ready; Supabase project `aurevo` live; ⏳ Vercel deploy not done | `docs/deployment.md` |

## Key decisions / assumptions
- **Name: Aurevo** — chosen from six candidates; web search found no direct café conflict. **Not a trademark clearance.**
- **No service-role key anywhere.** All admin work runs as the signed-in user under RLS; visitors can only INSERT into inquiry tables.
- **Public site works without Supabase** (falls back to bundled seed data) so it can be previewed; forms then say submissions are unavailable rather than pretending to save.
- **Imagery:** AI image credits were limited (10 credits, free plan), so all art is programmatic SVG, clearly labelled "concept illustration". Photoreal prompts are in `docs/photography-direction.md`.
- **Currency:** USD estimates. **Every recipe is proposed/untested.**
- Migrations were applied to a **new dedicated project** (`aurevo`); the existing project holding another app's `products` table was left untouched.
