// Anonymous-visitor checks against a LIVE Supabase project.
// Usage: NODE_USE_ENV_PROXY=1 SUPABASE_URL=... SUPABASE_KEY=... node tests/live-anon.test.mjs
// Any network error is a FAILURE (it must never pass vacuously).
import { createClient } from "@supabase/supabase-js";
const { SUPABASE_URL: url, SUPABASE_KEY: key } = process.env;
if (!url || !key) { console.error("Set SUPABASE_URL and SUPABASE_KEY"); process.exit(2); }
const db = createClient(url, key, { auth: { persistSession: false } });
let failed = 0;
const t = (n, c) => { if (!c) failed++; console.log(c ? "PASS" : "FAIL", n); };
const net = (e) => e && /fetch failed|ENOTFOUND|ECONN/i.test(e.message + (e.details ?? ""));

const p = await db.from("products").select("id", { count: "exact", head: true });
t("reachable: anon reads all 41 products", !p.error && p.count === 41);
if (net(p.error)) { console.error("NETWORK ERROR — aborting:", p.error.message); process.exit(1); }
const cats = await db.from("categories").select("id", { count: "exact", head: true });
t("anon reads 11 categories", cats.count === 11);

const m = await db.from("contact_messages").select("id");
t("anon cannot read contact messages", !net(m.error) && (m.data ?? []).length === 0);
const w = await db.from("products").update({ price_usd: 0.01 }).eq("slug", "espresso").select();
t("anon cannot update products", !net(w.error) && (w.data ?? []).length === 0);
const d = await db.from("products").delete().eq("slug", "espresso").select();
t("anon cannot delete products", !net(d.error) && (d.data ?? []).length === 0);
const bad = await db.from("contact_messages").insert({ name: "QA", email: "qa@example.com", subject: "Sub", message: "A long enough message", status: "closed" });
t("anon cannot insert with status=closed (RLS)", !!bad.error && !net(bad.error));
const bad2 = await db.from("contact_messages").insert({ name: "QA", email: "not-an-email", subject: "Sub", message: "A long enough message" });
t("anon insert with invalid email rejected (CHECK)", !!bad2.error && !net(bad2.error));
const rpc = await db.rpc("is_admin");
t("helper functions not callable via RPC", !!rpc.error && !net(rpc.error));
const prof = await db.from("profiles").select("id");
t("anon cannot read profiles", !net(prof.error) && (prof.data ?? []).length === 0);
const log = await db.from("admin_activity_logs").select("id");
t("anon cannot read audit log", !net(log.error) && (log.data ?? []).length === 0);
const up = await db.storage.from("media").upload(`hack-${Date.now()}.png`, new Blob(["x"]), { contentType: "image/png" });
t("anon cannot upload to storage", !!up.error && !net(up.error));
const s = await db.from("brand_settings").select("key", { count: "exact", head: true });
t("anon reads brand settings", s.count === 13);
console.log(failed ? `\n${failed} live check(s) failed` : "\nAll live anon checks passed");
process.exit(failed ? 1 : 0);
