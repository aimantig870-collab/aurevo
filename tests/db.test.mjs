// Validates migration + seed + RLS policies against an in-process Postgres (PGlite) with Supabase auth stubs.
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
const db = new PGlite();
const root = new URL("../supabase/", import.meta.url).pathname;
// Supabase stubs
await db.exec(`
create role anon nologin; create role authenticated nologin;
create schema auth; create schema storage;
create table auth.users (id uuid primary key default gen_random_uuid(), email text, raw_user_meta_data jsonb default '{}');
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.uid', true), '')::uuid $$;
create table storage.buckets (id text primary key, name text, public boolean, file_size_limit int, allowed_mime_types text[]);
create table storage.objects (id uuid default gen_random_uuid(), bucket_id text, name text);
alter table storage.objects enable row level security;
grant usage on schema auth, storage to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
`);
await db.exec(readFileSync(root + "migrations/0001_init.sql", "utf8"));
await db.exec(readFileSync(root + "migrations/0002_private_helpers.sql", "utf8"));
await db.exec(readFileSync(root + "seed.sql", "utf8"));
const n = async (t) => (await db.query(`select count(*)::int c from public.${t}`)).rows[0].c;
console.log("products", await n("products"), "categories", await n("categories"), "images", await n("product_images"), "gallery", await n("gallery"), "settings", await n("brand_settings"));

const as = async (role, uid, sql, params) => {
  await db.exec(`set role ${role}; select set_config('request.jwt.uid','${uid ?? ""}',false);`);
  try { return { ok: true, res: await db.query(sql, params) }; }
  catch (e) { return { ok: false, err: e.message }; }
  finally { await db.exec("reset role;"); }
};
// create users (trigger makes viewer profiles)
const mk = async (email) => (await db.query(`insert into auth.users(email) values ($1) returning id`, [email])).rows[0].id;
const admin = await mk("a@x.com"), editor = await mk("e@x.com"), viewer = await mk("v@x.com");
await db.exec(`update public.profiles set role='admin' where email='a@x.com'; update public.profiles set role='editor' where email='e@x.com';`);
let failed = 0;
const t = (name, cond) => { if (!cond) failed++; console.log(cond ? "PASS" : "FAIL", name); };

t("anon reads active products", (await as("anon", null, "select count(*)::int c from public.products")).res.rows[0].c === 41);
t("anon cannot read contact messages", (await as("anon", null, "select * from public.contact_messages")).ok === false || (await as("anon", null, "select * from public.contact_messages")).res.rows.length === 0);
t("anon can insert contact message", (await as("anon", null, "insert into public.contact_messages(name,email,subject,message) values ('Ann','a@b.co','Hello','Hello there friend')")).ok);
t("anon cannot insert with status closed", !(await as("anon", null, "insert into public.contact_messages(name,email,subject,message,status) values ('Ann','a@b.co','Hello','Hello there friend','closed')")).ok);
t("anon rejects bad email", !(await as("anon", null, "insert into public.contact_messages(name,email,subject,message) values ('Ann','nope','Hello','Hello there friend')")).ok);
t("anon cannot write products", (await as("anon", null, "update public.products set price_usd=1")).ok === false);
t("viewer reads inbox", (await as("authenticated", viewer, "select count(*)::int c from public.contact_messages")).res.rows[0].c === 1);
const vu = await as("authenticated", viewer, "update public.products set price_usd=1 returning id");
t("viewer cannot update products (0 rows)", !vu.ok || vu.res.rows.length === 0);
const eu = await as("authenticated", editor, "update public.products set price_usd=9.99 where slug='espresso' returning id");
t("editor updates products", eu.ok && eu.res.rows.length === 1);
const ed = await as("authenticated", editor, "delete from public.contact_messages returning id");
t("editor cannot delete inquiries", !ed.ok || ed.res.rows.length === 0);
const es = await as("authenticated", editor, "update public.contact_messages set status='closed' returning id");
t("editor can update inquiry status", es.ok && es.res.rows.length === 1);
t("editor cannot self-promote", !(await as("authenticated", editor, "update public.profiles set role='admin' where id=$1", [editor])).ok || (await db.query("select role from public.profiles where id=$1", [editor])).rows[0].role === "editor");
t("admin can delete inquiries", (await as("authenticated", admin, "delete from public.contact_messages returning id")).res.rows.length === 1);
t("admin can change role", (await as("authenticated", admin, "update public.profiles set role='editor' where id=$1 returning id", [viewer])).res.rows.length === 1);
t("editor cannot read activity logs", (await as("authenticated", editor, "select * from public.admin_activity_logs")).res.rows.length === 0);
t("editor can append activity as self", (await as("authenticated", editor, "insert into public.admin_activity_logs(actor_id,action,entity) values ($1,'update','product')", [editor])).ok);
t("editor cannot forge actor", !(await as("authenticated", editor, "insert into public.admin_activity_logs(actor_id,action,entity) values ($1,'update','product')", [admin])).ok);
t("one primary image per product", !(await as("authenticated", admin, "insert into public.product_images(product_id,url,is_primary) select id,'x',true from public.products where slug='espresso'; insert into public.product_images(product_id,url,is_primary) select id,'y',true from public.products where slug='espresso'")).ok);

console.log(failed ? `\n${failed} DB check(s) failed` : "\nAll DB checks passed");
process.exit(failed ? 1 : 0);
