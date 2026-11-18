# Deployment & operations guide

## 1. Install locally
```bash
npm install
cp .env.example .env.local   # fill in Supabase values (optional for a preview — the site falls back to bundled data)
npm run dev                  # http://localhost:3000
```
Node 20.19+ (tested on 22). Without Supabase variables the public site works from seed data; forms report "submissions unavailable" and `/admin` redirects to `/login`.

## 2. Supabase setup (use a **new, dedicated project**)
1. Create a project at supabase.com (choose the region closest to your customers).
2. **SQL Editor →** run `supabase/migrations/0001_init.sql`, then `0002_private_helpers.sql`, then `supabase/seed.sql`. (Or with the CLI: `supabase link --project-ref <ref> && supabase db push`.)
3. **Authentication → Providers:** keep Email enabled; **disable public sign-ups** (Authentication → Sign In / Providers → "Allow new users to sign up" off) so only invited staff can exist. Set a strong password policy and enable MFA if your plan allows.
4. **Authentication → Users → Add user** (email + password) for each staff member. They start as *viewer*.
5. Promote the first admin in the SQL Editor:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@yourdomain.com';
   ```
   After that, manage roles at **/admin/team**.
6. **Settings → API:** copy the Project URL and the *publishable/anon* key into `.env.local`. **Do not** use or paste the service-role key anywhere — the app never needs it.
7. Storage bucket `media` (public read, 5 MB, images only) is created by the migration; uploads are restricted to editors/admins by policy.
8. **Authentication → URL configuration:** set Site URL to your production domain.

## 3. Deploy to Vercel
1. Push to GitHub: `git remote add origin <url> && git push -u origin main`.
2. Vercel → *Add New Project* → import the repo (framework: Next.js; no overrides needed).
3. Environment variables (Production + Preview): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` (e.g. `https://www.yourdomain.com`).
4. Deploy. Then *Settings → Domains* → add your custom domain and follow the DNS instructions (HTTPS is automatic).
5. Recommended: enable **Vercel Firewall rate limiting** on `POST /contact`, `/partnership`, `/franchise` (the in-app throttle is per-instance only).

## 4. Production checklist
- [ ] New Supabase project; migration + seed applied; RLS enabled on all tables (`select tablename, rowsecurity from pg_tables where schemaname='public'`)
- [ ] Supabase **Security Advisor** shows no errors
- [ ] Public sign-ups disabled; at least one admin promoted; test viewer/editor/admin accounts verified
- [ ] Env vars set in Vercel; **no service-role key** in any env/source (`grep -r service_role .`)
- [ ] Real contact emails set in /admin → Site content (defaults use `@aurevo.example`)
- [ ] Replace placeholder social URLs
- [ ] Trademark search + legal review done before commercial launch / any franchise language
- [ ] Privacy policy & cookie notice added if you add analytics/marketing pixels (the site currently sets no tracking cookies)
- [ ] Custom domain + HTTPS verified; `NEXT_PUBLIC_SITE_URL` updated; sitemap submitted to Search Console
- [ ] Run `npm run test`, `npm run build`, then `BASE=<url> npm run test:e2e` against the preview deployment
- [ ] Submit each form once in production and confirm it appears in the admin inbox

## 5. Backups
- **Supabase:** paid plans include daily backups (Pro: 7 days; enable **PITR** add-on for point-in-time). Free plans have none — take manual dumps.
- **Manual logical backup (weekly, store off-platform and encrypted):**
  ```bash
  supabase db dump --db-url "$SUPABASE_DB_URL" -f backup-$(date +%F).sql
  supabase db dump --db-url "$SUPABASE_DB_URL" --data-only -f data-$(date +%F).sql
  ```
- **Storage (`media` bucket):** copy with the Supabase dashboard or `supabase storage cp -r ss:///media ./media-backup`.
- **Restore drill:** restore into a scratch project quarterly and run `npm run test:db`-style spot checks.
- Code and migrations live in Git.

## 6. Maintenance
- **Content:** products, categories, gallery, site text and inquiries are managed in `/admin` — no deploy needed (pages revalidate on save and every 5 min).
- **Menu data source of truth:** `src/data/menu.ts` (seed + fallback). After editing run `npm run seed:build` to refresh `supabase/seed.sql` and `docs/menu-recipes.md`. Note: the seed does not overwrite existing DB rows.
- **Art:** `npm run art` regenerates all vector art; `node scripts/make-og.cjs` rebuilds `public/og.png`.
- **Schema changes:** add a new numbered file in `supabase/migrations/` (never edit applied ones); update `tests/db.test.mjs`.
- **Dependencies:** monthly `npm outdated`, `npm audit`; rerun the test suite.
- **Monitoring:** Vercel logs/Analytics, Supabase logs + advisors. Review `/admin/activity` for unexpected changes.
- **Rotating access:** remove leavers in Supabase → Authentication → Users; rotate the anon key only if abused (it is public by design; RLS is the protection).

## 7. Testing against a live Supabase project
`tests/live-anon.test.mjs` and `tests/admin.e2e.cjs` run against a real project. They need three staff accounts (`qa-admin@`, `qa-editor@`, `qa-viewer@<domain>`) with matching roles — create them in a **test/staging** project, not production — and `QA_PASSWORD`. The public e2e and admin e2e write test rows (contact messages etc.); clean them with `delete from contact_messages where email like 'qa-%' or email like 'test@%';` (and the same for the other inquiry tables).
In restricted sandboxes where Node's `fetch` ignores the HTTP proxy, set `NODE_USE_ENV_PROXY=1` (not needed on Vercel).
