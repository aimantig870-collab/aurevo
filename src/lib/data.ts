import { brand, galleryDefaults } from "@/data/brand";
import { categories as seedCategories, products as seedProducts, margin } from "@/data/menu";
import { publicClient } from "@/lib/supabase/public";

export type SiteCategory = { id: string; slug: string; name: string; blurb: string; sort: number };
export type SiteProduct = {
  id: string; slug: string; name: string; category: string; categoryName: string;
  tier: "signature" | "classic"; serve: string; tagline: string; description: string;
  ingredients: { item: string; qty: string }[]; method: string[];
  temperature: string; cupSize: string; presentation: string; garnish: string;
  target: string; story: string; caffeine: string; costUsd: number; priceUsd: number;
  marginPct: number; image: string; imageAlt: string; recipeStatus: string; featured: boolean;
};
export type SiteGalleryItem = { id: string; title: string; caption: string; image: string; tag: string };
export type Catalog = { source: "supabase" | "seed"; categories: SiteCategory[]; products: SiteProduct[] };

function fromSeed(): Catalog {
  const cats = seedCategories.map((c) => ({ id: c.slug, slug: c.slug, name: c.name, blurb: c.blurb, sort: c.sort }));
  const products = seedProducts.map((p, i) => ({
    id: p.slug, slug: p.slug, name: p.name, category: p.category,
    categoryName: cats.find((c) => c.slug === p.category)?.name ?? "",
    tier: p.tier, serve: p.serve, tagline: p.tagline, description: p.description,
    ingredients: p.ingredients ?? [], method: p.method ?? [],
    temperature: p.temperature, cupSize: p.cupSize, presentation: p.presentation ?? "", garnish: p.garnish ?? "",
    target: p.target ?? "", story: p.story ?? "", caffeine: p.caffeine ?? "yes",
    costUsd: p.costUsd, priceUsd: p.priceUsd, marginPct: margin(p),
    image: `/art/drinks/${p.slug}.svg`, imageAlt: `${p.name} — concept illustration`,
    recipeStatus: "proposed", featured: p.tier === "signature" && i < 6,
  }));
  return { source: "seed", categories: cats, products };
}

/** Reads the catalogue from Supabase when configured; otherwise (or on failure) from the bundled seed data. */
export async function getCatalog(): Promise<Catalog> {
  const db = publicClient();
  if (!db) return fromSeed();
  try {
    const [c, p] = await Promise.all([
      db.from("categories").select("id,slug,name,blurb,sort_order").eq("is_active", true).order("sort_order"),
      db.from("products").select("*, product_images(url,alt,is_primary,sort_order)").eq("is_active", true).order("sort_order"),
    ]);
    if (c.error || p.error || !c.data?.length) throw c.error ?? p.error ?? new Error("empty");
    const cats: SiteCategory[] = c.data.map((r) => ({ id: r.id, slug: r.slug, name: r.name, blurb: r.blurb, sort: r.sort_order }));
    const byId = new Map(cats.map((x) => [x.id, x]));
    const products: SiteProduct[] = (p.data ?? []).flatMap((r) => {
      const cat = byId.get(r.category_id);
      if (!cat) return [];
      const imgs = [...(r.product_images ?? [])].sort((a: { is_primary: boolean }, b: { is_primary: boolean }) => Number(b.is_primary) - Number(a.is_primary));
      const cost = Number(r.cost_usd), price = Number(r.price_usd);
      return [{
        id: r.id, slug: r.slug, name: r.name, category: cat.slug, categoryName: cat.name,
        tier: r.tier, serve: r.serve, tagline: r.tagline, description: r.description,
        ingredients: r.ingredients ?? [], method: r.method ?? [],
        temperature: r.temperature, cupSize: r.cup_size, presentation: r.presentation, garnish: r.garnish,
        target: r.target_customer, story: r.story, caffeine: r.caffeine, costUsd: cost, priceUsd: price,
        marginPct: margin({ costUsd: cost, priceUsd: price }),
        image: imgs[0]?.url ?? "/art/logo/symbol.svg", imageAlt: imgs[0]?.alt || `${r.name}`,
        recipeStatus: r.recipe_status, featured: r.is_featured,
      }];
    });
    return { source: "supabase", categories: cats, products };
  } catch {
    return fromSeed();
  }
}

export async function getGallery(): Promise<SiteGalleryItem[]> {
  const fallback = galleryDefaults.map((g, i) => ({ id: String(i), title: g.title, caption: g.caption, image: g.image, tag: g.tag }));
  const db = publicClient();
  if (!db) return fallback;
  const { data, error } = await db.from("gallery").select("id,title,caption,image_url,tag").eq("is_active", true).order("sort_order");
  if (error || !data?.length) return fallback;
  return data.map((r) => ({ id: r.id, title: r.title, caption: r.caption, image: r.image_url, tag: r.tag }));
}

export const settingDefaults: Record<string, string> = {
  brand_name: brand.name, descriptor: brand.descriptor, slogan: brand.slogan, tagline: brand.tagline,
  stage_notice: brand.stage, contact_email: brand.email, partner_email: brand.partnerEmail,
  hero_title: "Coffee for the golden hour.",
  hero_subtitle: "A proposed premium café concept — original drinks, a warm world palette and a design built to travel.",
  instagram_url: brand.social.instagram, tiktok_url: brand.social.tiktok, facebook_url: brand.social.facebook, pinterest_url: brand.social.pinterest,
};

export async function getSettings(): Promise<Record<string, string>> {
  const db = publicClient();
  if (!db) return settingDefaults;
  const { data, error } = await db.from("brand_settings").select("key,value");
  if (error || !data) return settingDefaults;
  return { ...settingDefaults, ...Object.fromEntries(data.filter((r) => r.value !== "").map((r) => [r.key, r.value])) };
}
