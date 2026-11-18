"use server";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { serverClient } from "@/lib/supabase/server";
import { guard, logActivity, type Staff } from "@/lib/admin/auth";
import { categorySchema, fieldErrors, gallerySchema, parseIngredients, parseLines, productSchema, clean, type FormState } from "@/lib/validation";

const refresh = () => revalidatePath("/", "layout");
const fail = (message: string, errors?: Record<string, string>): FormState => ({ ok: false, message, errors });
const dbMsg = (e: { code?: string; message: string }) => (e.code === "23505" ? "That slug is already in use." : e.code === "23503" ? "This item is still in use elsewhere." : e.message);

// ------------------------------------------------------------ auth
export async function signIn(_: FormState, fd: FormData): Promise<FormState> {
  const parsed = z.object({ email: z.string().trim().email(), password: z.string().min(6).max(200) }).safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail("Enter a valid email and password.");
  const db = await serverClient();
  if (!db) return fail("The backend is not configured.");
  const { error } = await db.auth.signInWithPassword(parsed.data);
  if (error) return fail("Email or password is incorrect.");
  const next = String(fd.get("next") ?? "/admin");
  redirect(next.startsWith("/admin") ? next : "/admin");
}
export async function signOut() {
  const db = await serverClient();
  await db?.auth.signOut();
  redirect("/login");
}

// ------------------------------------------------------------ uploads
const MIME: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };
async function upload(s: Staff, file: File, folder: string): Promise<{ url: string } | { error: string }> {
  const ext = MIME[file.type];
  if (!ext) return { error: "Images must be JPG, PNG, WebP or AVIF." };
  if (file.size > 5 * 1024 * 1024) return { error: "Images must be 5 MB or smaller." };
  const path = `${folder}/${randomUUID()}.${ext}`;
  const { error } = await s.db.storage.from("media").upload(path, file, { contentType: file.type, upsert: false });
  if (error) return { error: `Upload failed: ${error.message}` };
  return { url: s.db.storage.from("media").getPublicUrl(path).data.publicUrl };
}
const fileOf = (fd: FormData, k: string) => { const f = fd.get(k); return f instanceof File && f.size > 0 ? f : null; };

// ------------------------------------------------------------ products
export async function saveProduct(_: FormState, fd: FormData): Promise<FormState> {
  const g = await guard("editor");
  if ("error" in g) return fail(g.error);
  const id = String(fd.get("id") ?? "");
  const parsed = productSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail("Please fix the highlighted fields.", fieldErrors(parsed.error));
  const { ingredients, method, ...rest } = parsed.data;
  const row = { ...rest, ingredients: parseIngredients(ingredients), method: parseLines(method) };
  const q = id ? g.s.db.from("products").update(row).eq("id", id).select("id").single() : g.s.db.from("products").insert(row).select("id").single();
  const { data, error } = await q;
  if (error) return fail(dbMsg(error), error.code === "23505" ? { slug: "Slug already in use" } : undefined);
  const file = fileOf(fd, "image");
  if (file) {
    const up = await upload(g.s, file, "products");
    if ("error" in up) return fail(`Saved, but the image was not added. ${up.error}`);
    const { count } = await g.s.db.from("product_images").select("id", { count: "exact", head: true }).eq("product_id", data.id);
    await g.s.db.from("product_images").insert({ product_id: data.id, url: up.url, alt: clean(String(fd.get("image_alt") ?? "")) || parsed.data.name, is_primary: !count });
  }
  await logActivity(g.s, id ? "update" : "create", "product", data.id, { name: parsed.data.name });
  refresh();
  if (!id) redirect(`/admin/products/${data.id}?saved=1`);
  return { ok: true, message: "Product saved." };
}
export async function deleteProduct(fd: FormData) {
  const g = await guard("editor");
  if ("error" in g) return;
  const id = String(fd.get("id"));
  await g.s.db.from("products").delete().eq("id", id);
  await logActivity(g.s, "delete", "product", id);
  refresh();
  redirect("/admin/products?deleted=1");
}
export async function setPrimaryImage(fd: FormData) {
  const g = await guard("editor");
  if ("error" in g) return;
  const id = String(fd.get("id")), product = String(fd.get("product_id"));
  await g.s.db.from("product_images").update({ is_primary: false }).eq("product_id", product);
  await g.s.db.from("product_images").update({ is_primary: true }).eq("id", id);
  refresh(); revalidatePath(`/admin/products/${product}`);
}
export async function deleteProductImage(fd: FormData) {
  const g = await guard("editor");
  if ("error" in g) return;
  const id = String(fd.get("id")), product = String(fd.get("product_id"));
  await g.s.db.from("product_images").delete().eq("id", id);
  await logActivity(g.s, "delete", "product_image", id);
  refresh(); revalidatePath(`/admin/products/${product}`);
}

// ------------------------------------------------------------ categories
export async function saveCategory(_: FormState, fd: FormData): Promise<FormState> {
  const g = await guard("editor");
  if ("error" in g) return fail(g.error);
  const id = String(fd.get("id") ?? "");
  const parsed = categorySchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail("Please fix the highlighted fields.", fieldErrors(parsed.error));
  const { error } = id ? await g.s.db.from("categories").update(parsed.data).eq("id", id) : await g.s.db.from("categories").insert(parsed.data);
  if (error) return fail(dbMsg(error));
  await logActivity(g.s, id ? "update" : "create", "category", id || undefined, { name: parsed.data.name });
  refresh(); revalidatePath("/admin/categories");
  return { ok: true, message: id ? "Category updated." : "Category created." };
}
export async function deleteCategory(fd: FormData) {
  const g = await guard("editor");
  if ("error" in g) return;
  const id = String(fd.get("id"));
  const { error } = await g.s.db.from("categories").delete().eq("id", id);
  if (error) redirect(`/admin/categories?error=${encodeURIComponent(error.code === "23503" ? "Move or delete its products first." : error.message)}`);
  await logActivity(g.s, "delete", "category", id);
  refresh(); redirect("/admin/categories?deleted=1");
}

// ------------------------------------------------------------ gallery
export async function saveGallery(_: FormState, fd: FormData): Promise<FormState> {
  const g = await guard("editor");
  if ("error" in g) return fail(g.error);
  const id = String(fd.get("id") ?? "");
  const parsed = gallerySchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail("Please fix the highlighted fields.", fieldErrors(parsed.error));
  let url = parsed.data.image_url;
  const file = fileOf(fd, "image");
  if (file) { const up = await upload(g.s, file, "gallery"); if ("error" in up) return fail(up.error); url = up.url; }
  if (!url && !id) return fail("Upload an image or paste an image URL.", { image: "Image required" });
  if (url && !/^(https:\/\/|\/art\/)/.test(url)) return fail("Image URL must start with https://", { image_url: "Must start with https://" });
  const { image_url: _ignored, ...rest } = parsed.data; void _ignored;
  const row = { ...rest, ...(url ? { image_url: url } : {}) };
  const { error } = id ? await g.s.db.from("gallery").update(row).eq("id", id) : await g.s.db.from("gallery").insert({ ...row, image_url: url });
  if (error) return fail(dbMsg(error));
  await logActivity(g.s, id ? "update" : "create", "gallery", id || undefined, { title: parsed.data.title });
  refresh(); revalidatePath("/admin/gallery");
  return { ok: true, message: "Gallery item saved." };
}
export async function deleteGallery(fd: FormData) {
  const g = await guard("editor");
  if ("error" in g) return;
  const id = String(fd.get("id"));
  await g.s.db.from("gallery").delete().eq("id", id);
  await logActivity(g.s, "delete", "gallery", id);
  refresh(); revalidatePath("/admin/gallery");
}

// ------------------------------------------------------------ settings
const SETTING_KEYS = ["brand_name", "descriptor", "slogan", "tagline", "hero_title", "hero_subtitle", "stage_notice", "contact_email", "partner_email", "instagram_url", "tiktok_url", "facebook_url", "pinterest_url"] as const;
export async function saveSettings(_: FormState, fd: FormData): Promise<FormState> {
  const g = await guard("editor");
  if ("error" in g) return fail(g.error);
  const errors: Record<string, string> = {};
  const rows = SETTING_KEYS.map((key) => {
    const value = clean(String(fd.get(key) ?? ""));
    if (key.endsWith("_url") && value && !/^https:\/\//.test(value)) errors[key] = "Must start with https://";
    if (key.endsWith("_email") && value && !z.string().email().safeParse(value).success) errors[key] = "Invalid email";
    if (value.length > 600) errors[key] = "Too long";
    return { key, value, updated_by: g.s.user.id };
  });
  if (Object.keys(errors).length) return fail("Please fix the highlighted fields.", errors);
  const { error } = await g.s.db.from("brand_settings").upsert(rows);
  if (error) return fail(error.message);
  await logActivity(g.s, "update", "brand_settings");
  refresh();
  return { ok: true, message: "Settings saved." };
}

// ------------------------------------------------------------ inquiries
import { inboxTable } from "@/lib/admin/inbox";

export async function updateInquiry(_: FormState, fd: FormData): Promise<FormState> {
  const g = await guard("editor");
  if ("error" in g) return fail(g.error);
  const table = inboxTable(String(fd.get("kind")));
  const parsed = z.object({ id: z.string().uuid(), status: z.enum(["new", "in_review", "contacted", "closed", "spam"]), internal_notes: z.string().max(4000).transform(clean) }).safeParse(Object.fromEntries(fd));
  if (!table || !parsed.success) return fail("Invalid request.");
  const { error } = await g.s.db.from(table).update({ status: parsed.data.status, internal_notes: parsed.data.internal_notes }).eq("id", parsed.data.id);
  if (error) return fail(error.message);
  await logActivity(g.s, "update", table, parsed.data.id, { status: parsed.data.status });
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Inquiry updated." };
}
export async function deleteInquiry(fd: FormData) {
  const g = await guard("admin");
  if ("error" in g) return;
  const kind = String(fd.get("kind")), table = inboxTable(kind), id = String(fd.get("id"));
  if (!table) return;
  await g.s.db.from(table).delete().eq("id", id);
  await logActivity(g.s, "delete", table, id);
  redirect(`/admin/inbox/${kind}?deleted=1`);
}

// ------------------------------------------------------------ team
export async function setRole(fd: FormData) {
  const g = await guard("admin");
  if ("error" in g) return;
  const parsed = z.object({ id: z.string().uuid(), role: z.enum(["admin", "editor", "viewer"]) }).safeParse(Object.fromEntries(fd));
  if (!parsed.success || parsed.data.id === g.s.user.id) return; // admins cannot demote themselves
  await g.s.db.from("profiles").update({ role: parsed.data.role }).eq("id", parsed.data.id);
  await logActivity(g.s, "role_change", "profile", parsed.data.id, { role: parsed.data.role });
  revalidatePath("/admin/team");
}
