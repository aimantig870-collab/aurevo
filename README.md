# Aurevo — Golden Hour Coffee House (concept)

A complete **brand + digital platform** for an original, premium virtual café: strategy, identity, 41-item menu with 14 signature recipes, a 12-page website, a role-based admin dashboard on Supabase, marketing plan, financial model and franchise framework.

> **Honesty notice.** Aurevo is a *concept*. There is no operating café, no sales history, no validated franchise. **All recipes are proposed/untested; all prices, costs and financial figures are estimates.** The name is **not** trademark-cleared. Visuals are vector concept art, not photographs.

## Quick start
```bash
npm install && npm run dev     # works without Supabase (bundled seed data)
npm test                       # unit + database/RLS tests (no network needed)
npm run build && npm start     # then: BASE=http://localhost:3000 npm run test:e2e
```
Deployment, Supabase setup, backups and the production checklist: **[docs/deployment.md](docs/deployment.md)**.

## Technologies
Next.js 16 (App Router, React 19, TypeScript) · Tailwind CSS 4 · Supabase (Postgres, Auth, Storage, RLS) via `@supabase/ssr` · Zod validation · Sonner toasts · Fontsource (self-hosted Instrument Serif + Hanken Grotesk) · Vercel hosting. Dev: PGlite (in-process Postgres for tests), Playwright. Runtime dependencies: 7.

## Project structure
```
src/
  app/(site)/        12 public pages: / about our-story menu menu/[slug] signature gallery virtual-cafe brand franchise partnership contact
  app/admin/         dashboard, products(+[id]), categories, gallery, settings, inbox/[kind](+[id]), team, activity
  app/login/         staff sign-in            app/{sitemap,robots,not-found,error}
  components/        site chrome, forms, menu explorer, gallery, admin UI
  lib/               data.ts (Supabase↔seed), validation.ts (zod), public-actions.ts,
                     admin/{auth,actions,inbox}.ts, supabase/{public,server}.ts
  data/              menu.ts (41 products, recipes, costs) · brand.ts (palette, personas, names)
  proxy.ts           session refresh + /admin gate
supabase/            migrations/0001_init.sql · 0002_private_helpers.sql · seed.sql (generated)
scripts/             generate-art.mjs · build-seed.mjs · make-og.cjs
public/art/          logos, 41 drink illustrations, 11 mockups, 6 café scenes, icons
docs/                ROADMAP · brand-strategy · menu-recipes · photography-direction · marketing-strategy
                     content-calendar (30 days) · business-model · franchise-framework · deployment
tests/               validation.test.ts · db.test.mjs (local Postgres) · e2e.cjs (public site)
                     live-anon.test.mjs · admin.e2e.cjs (need a live Supabase project)
```

## Features
- **Public:** premium responsive site; searchable/filterable menu; product detail with recipe, cost, margin (labelled estimates); gallery with lightbox; virtual-café tour; full brand guidelines page; honest franchise & partnership pages; working contact / partnership / franchise forms (server-validated, honeypot, throttle); SEO metadata, sitemap, robots, OG image, security headers, skip link, reduced-motion support.
- **Admin:** email/password auth; roles (admin/editor/viewer); CRUD for products (multi-image upload, primary image), categories, gallery, site content; inbox for 3 inquiry types with search, status filter, pagination, notes; team/role management; audit log; toasts and server-side validation everywhere.

## Database (Supabase / Postgres)
`profiles` · `categories` · `products` · `product_images` · `gallery` · `brand_settings` · `partnership_requests` · `franchise_inquiries` · `contact_messages` · `admin_activity_logs` — with FKs, CHECK constraints, indexes, `updated_at` triggers, role-guard trigger, RLS on every table, storage bucket policies. Visitors can only INSERT inquiries (status forced to `new`); staff read; editors update; admins delete.

## Security notes
Admin routes gated twice (proxy + server-side role check in every page/action) · all writes validated by Zod on the server · HTML stripped from free text, React escapes output · RLS is the final authority · **no service-role key exists in the project** · `.env*` git-ignored, `.env.example` provided · uploads restricted by type (JPG/PNG/WebP/AVIF) and 5 MB · privilege-escalation trigger blocks self-promotion · CSP not yet configured (see remaining tasks).

## Testing results (this build)
| Suite | Result |
|---|---|
| `tsc` typecheck, `eslint` | clean |
| `npm run test:unit` — validation/sanitisation | **7/7 pass** |
| `npm run test:db` — migrations + seed + 18 RLS/role/constraint checks (local Postgres) | **all pass** |
| `npm run test:e2e` — 12 pages × desktop+mobile, menu filter/search, forms, admin gating, headers, SEO files, form-value-preservation regression | **110/110 pass** |
| `tests/live-anon.test.mjs` — anonymous visitor vs. a **live Supabase project** (reads, blocked writes/RPC/storage) | **12/12 pass** |
| `tests/admin.e2e.cjs` — admin dashboard on a **live Supabase project**: login, product/category/gallery CRUD, Storage image upload, settings → public site, inbox, roles, audit log, admin/editor/viewer restrictions | **49/49 pass** |
| Supabase security advisor (live project) | **0 findings** |
| `next build` | 58 static pages, no errors |

Bugs found by the live tests and fixed: React 19 `<form action>` wiped typed values after a validation error (now `onSubmit` + transition, regression-tested); role-helper functions were callable through the public API (moved to a private schema, migration 0002).

**Limits:** live tests ran against one project from a sandbox whose proxy adds latency, so admin pages looked slow (~3 s); expect far less on Vercel↔Supabase. Not yet done: a real Vercel deployment, email notifications, and load/penetration testing.

## Remaining tasks
1. Create your real staff accounts in Supabase (Authentication → Users), promote the first admin (see docs/deployment.md), disable public sign-ups.
2. Official trademark searches + legal advice; secure domains/handles.
3. Bench-test all 14 signatures (+ classics); replace estimated costs with supplier quotes; update recipe status in admin.
4. Commission real photography / photoreal renders (prompts ready) to replace concept art; produce print-ready dielines.
5. Email notifications for new inquiries (e.g. Supabase Database Webhook → Resend); CAPTCHA/Turnstile if spam appears; edge rate limiting.
6. Add Content-Security-Policy header; privacy policy/cookie notice before analytics.
7. Pilot café/pop-up to generate real data before any franchise language changes.
