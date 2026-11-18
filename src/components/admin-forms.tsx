"use client";
import Image from "next/image";
import { Field, Submit, inputProps, useFormAction } from "@/components/form-kit";
import { saveCategory, saveGallery, saveProduct, saveSettings, updateInquiry } from "@/lib/admin/actions";

type Opt = { id: string; name: string };
export type ProductRow = Record<string, string | number | boolean | null | undefined> & { id?: string };

export function ProductForm({ p, categories, readOnly }: { p: ProductRow; categories: Opt[]; readOnly: boolean }) {
  const { state, run, pending } = useFormAction(saveProduct);
  const e = state.errors;
  const d = (k: string) => (p[k] ?? "") as string;
  return (
    <form onSubmit={run} className="grid gap-6" noValidate>
      {p.id && <input type="hidden" name="id" value={p.id} />}
      <fieldset disabled={readOnly || pending} className="grid gap-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" name="name" error={e?.name}><input {...inputProps("name", e)} defaultValue={d("name")} required /></Field>
          <Field label="Slug (URL)" name="slug" error={e?.slug} hint="lowercase-with-dashes"><input {...inputProps("slug", e)} defaultValue={d("slug")} required /></Field>
          <Field label="Category" name="category_id" error={e?.category_id}>
            <select {...inputProps("category_id", e)} defaultValue={d("category_id")} required><option value="">Choose…</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          </Field>
          <Field label="Tier" name="tier"><select {...inputProps("tier", e)} defaultValue={d("tier") || "classic"}><option value="signature">Signature</option><option value="classic">Classic</option></select></Field>
          <Field label="Serve" name="serve"><select {...inputProps("serve", e)} defaultValue={d("serve") || "hot"}>{["hot", "iced", "either", "dessert", "bakery"].map((s) => <option key={s}>{s}</option>)}</select></Field>
          <Field label="Caffeine" name="caffeine"><select {...inputProps("caffeine", e)} defaultValue={d("caffeine") || "yes"}><option value="yes">Yes</option><option value="optional">Optional</option><option value="none">None</option></select></Field>
          <Field label="Estimated ingredient cost (USD)" name="cost_usd" error={e?.cost_usd}><input {...inputProps("cost_usd", e)} type="number" step="0.01" min="0" defaultValue={d("cost_usd") || 0} /></Field>
          <Field label="Price (USD)" name="price_usd" error={e?.price_usd}><input {...inputProps("price_usd", e)} type="number" step="0.01" min="0" defaultValue={d("price_usd") || 0} /></Field>
          <Field label="Recipe status" name="recipe_status"><select {...inputProps("recipe_status", e)} defaultValue={d("recipe_status") || "proposed"}><option value="proposed">Proposed (untested)</option><option value="in_testing">In testing</option><option value="approved">Approved</option></select></Field>
          <Field label="Sort order" name="sort_order"><input {...inputProps("sort_order", e)} type="number" min="0" defaultValue={d("sort_order") || 0} /></Field>
        </div>
        <Field label="Tagline" name="tagline" error={e?.tagline}><input {...inputProps("tagline", e)} defaultValue={d("tagline")} /></Field>
        <Field label="Description" name="description" error={e?.description}><textarea {...inputProps("description", e)} rows={3} defaultValue={d("description")} /></Field>
        <Field label="Ingredients" name="ingredients" hint="One per line: Item | quantity"><textarea {...inputProps("ingredients", e)} rows={5} defaultValue={d("ingredients_text")} className="field font-mono text-sm" /></Field>
        <Field label="Preparation steps" name="method" hint="One step per line"><textarea {...inputProps("method", e)} rows={5} defaultValue={d("method_text")} /></Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Serving temperature" name="temperature"><input {...inputProps("temperature", e)} defaultValue={d("temperature")} /></Field>
          <Field label="Cup size" name="cup_size"><input {...inputProps("cup_size", e)} defaultValue={d("cup_size")} /></Field>
          <Field label="Presentation" name="presentation"><input {...inputProps("presentation", e)} defaultValue={d("presentation")} /></Field>
          <Field label="Garnish" name="garnish"><input {...inputProps("garnish", e)} defaultValue={d("garnish")} /></Field>
        </div>
        <Field label="Target customer" name="target_customer"><input {...inputProps("target_customer", e)} defaultValue={d("target_customer")} /></Field>
        <Field label="Product story" name="story"><textarea {...inputProps("story", e)} rows={2} defaultValue={d("story")} /></Field>
        <div className="grid gap-5 rounded-2xl bg-crema-2 p-5 sm:grid-cols-2">
          <Field label="Add image (JPG/PNG/WebP/AVIF, max 5 MB)" name="image"><input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="block w-full text-sm" /></Field>
          <Field label="Image alt text" name="image_alt"><input {...inputProps("image_alt", e)} /></Field>
        </div>
        <div className="flex flex-wrap gap-6 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" name="is_active" defaultChecked={p.id ? Boolean(p.is_active) : true} className="h-5 w-5 accent-[#C9873A]" /> Visible on site</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="is_featured" defaultChecked={Boolean(p.is_featured)} className="h-5 w-5 accent-[#C9873A]" /> Featured on home</label>
        </div>
        {!readOnly && <div><Submit pending={pending}>{p.id ? "Save changes" : "Create product"}</Submit></div>}
      </fieldset>
      {readOnly && <p className="text-sm text-smoke">Your role is read-only.</p>}
    </form>
  );
}

export function CategoryForm({ c, readOnly }: { c?: { id: string; name: string; slug: string; blurb: string; sort_order: number; is_active: boolean }; readOnly: boolean }) {
  const { state, run, pending } = useFormAction(saveCategory);
  const e = state.errors;
  return (
    <form onSubmit={run} className="grid gap-3 rounded-2xl border border-night/10 p-4 md:grid-cols-[1.2fr_1.2fr_2fr_6rem_auto_auto] md:items-start" noValidate>
      {c && <input type="hidden" name="id" value={c.id} />}
      <fieldset disabled={readOnly || pending} className="contents">
        <Field htmlFor={`name-${c?.id ?? "new"}`} label="Name" name="name" error={e?.name}><input {...inputProps("name", e)} id={`name-${c?.id ?? "new"}`} defaultValue={c?.name} required /></Field>
        <Field htmlFor={`slug-${c?.id ?? "new"}`} label="Slug" name="slug" error={e?.slug}><input {...inputProps("slug", e)} id={`slug-${c?.id ?? "new"}`} defaultValue={c?.slug} required /></Field>
        <Field htmlFor={`blurb-${c?.id ?? "new"}`} label="Blurb" name="blurb"><input {...inputProps("blurb", e)} id={`blurb-${c?.id ?? "new"}`} defaultValue={c?.blurb} /></Field>
        <Field htmlFor={`so-${c?.id ?? "new"}`} label="Order" name="sort_order"><input {...inputProps("sort_order", e)} id={`so-${c?.id ?? "new"}`} type="number" defaultValue={c?.sort_order ?? 0} /></Field>
        <label className="flex items-center gap-2 pt-8 text-sm"><input type="checkbox" name="is_active" defaultChecked={c ? c.is_active : true} className="h-5 w-5 accent-[#C9873A]" /> Active</label>
        <div className="pt-7"><Submit pending={pending}>{c ? "Save" : "Add"}</Submit></div>
      </fieldset>
    </form>
  );
}

export function GalleryForm({ g, readOnly }: { g?: { id: string; title: string; caption: string; image_url: string; tag: string; sort_order: number; is_active: boolean }; readOnly: boolean }) {
  const { state, run, pending } = useFormAction(saveGallery);
  const e = state.errors;
  const k = g?.id ?? "new";
  return (
    <form onSubmit={run} className="grid gap-3" noValidate>
      {g && <input type="hidden" name="id" value={g.id} />}
      <fieldset disabled={readOnly || pending} className="grid gap-3">
        {g && <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-oat"><Image src={g.image_url} alt={g.title} fill sizes="320px" className="object-cover" /></div>}
        <Field htmlFor={`t-${k}`} label="Title" name="title" error={e?.title}><input {...inputProps("title", e)} id={`t-${k}`} defaultValue={g?.title} required /></Field>
        <Field htmlFor={`c-${k}`} label="Caption" name="caption"><input {...inputProps("caption", e)} id={`c-${k}`} defaultValue={g?.caption} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field htmlFor={`g-${k}`} label="Tag" name="tag"><select {...inputProps("tag", e)} id={`g-${k}`} defaultValue={g?.tag ?? "drinks"}>{["drinks", "brand", "cafe", "events"].map((t) => <option key={t}>{t}</option>)}</select></Field>
          <Field htmlFor={`o-${k}`} label="Order" name="sort_order"><input {...inputProps("sort_order", e)} id={`o-${k}`} type="number" defaultValue={g?.sort_order ?? 0} /></Field>
        </div>
        <Field htmlFor={`i-${k}`} label={g ? "Replace image" : "Upload image"} name="image" error={e?.image}><input id={`i-${k}`} name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="block w-full text-sm" /></Field>
        {!g && <Field htmlFor={`u-${k}`} label="…or image URL (https)" name="image_url" error={e?.image_url}><input {...inputProps("image_url", e)} id={`u-${k}`} /></Field>}
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_active" defaultChecked={g ? g.is_active : true} className="h-5 w-5 accent-[#C9873A]" /> Visible</label>
        <div><Submit pending={pending}>{g ? "Save" : "Add to gallery"}</Submit></div>
      </fieldset>
    </form>
  );
}

const SETTINGS: [string, string, boolean?][] = [
  ["brand_name", "Brand name"], ["descriptor", "Descriptor"], ["slogan", "Slogan"], ["tagline", "Tagline"],
  ["hero_title", "Home hero title"], ["hero_subtitle", "Home hero subtitle", true], ["stage_notice", "Concept-stage notice (shown in footer)", true],
  ["contact_email", "Contact email"], ["partner_email", "Partnership email"],
  ["instagram_url", "Instagram URL"], ["tiktok_url", "TikTok URL"], ["facebook_url", "Facebook URL"], ["pinterest_url", "Pinterest URL"],
];
export function SettingsForm({ values, readOnly }: { values: Record<string, string>; readOnly: boolean }) {
  const { state, run, pending } = useFormAction(saveSettings);
  const e = state.errors;
  return (
    <form onSubmit={run} className="grid max-w-3xl gap-5" noValidate>
      <fieldset disabled={readOnly || pending} className="grid gap-5">
        {SETTINGS.map(([k, l, long]) => (
          <Field key={k} label={l} name={k} error={e?.[k]}>{long ? <textarea {...inputProps(k, e)} rows={3} defaultValue={values[k]} /> : <input {...inputProps(k, e)} defaultValue={values[k]} />}</Field>
        ))}
        {!readOnly && <div><Submit pending={pending}>Save settings</Submit></div>}
      </fieldset>
    </form>
  );
}

export function InquiryEditor({ kind, id, status, notes, readOnly }: { kind: string; id: string; status: string; notes: string; readOnly: boolean }) {
  const { state, run, pending } = useFormAction(updateInquiry);
  return (
    <form onSubmit={run} className="grid gap-4">
      <input type="hidden" name="kind" value={kind} /><input type="hidden" name="id" value={id} />
      <fieldset disabled={readOnly || pending} className="grid gap-4">
        <Field label="Status" name="status" error={state.errors?.status}><select {...inputProps("status", state.errors)} defaultValue={status}>{["new", "in_review", "contacted", "closed", "spam"].map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}</select></Field>
        <Field label="Internal notes (never shown publicly)" name="internal_notes"><textarea {...inputProps("internal_notes", state.errors)} rows={4} defaultValue={notes} /></Field>
        {!readOnly && <div><Submit pending={pending}>Update</Submit></div>}
      </fieldset>
    </form>
  );
}
