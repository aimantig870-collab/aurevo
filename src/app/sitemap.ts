import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";
import { getCatalog } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products } = await getCatalog();
  const pages = ["", "/about", "/our-story", "/menu", "/signature", "/gallery", "/virtual-cafe", "/brand", "/franchise", "/partnership", "/contact"];
  return [...pages.map((p) => ({ url: `${siteUrl}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })), ...products.map((p) => ({ url: `${siteUrl}/menu/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.6 }))];
}
