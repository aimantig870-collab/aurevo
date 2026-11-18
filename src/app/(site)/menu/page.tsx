import type { Metadata } from "next";
import { Suspense } from "react";
import { getCatalog } from "@/lib/data";
import { PageHero } from "@/components/ui";
import { MenuExplorer } from "@/components/menu-explorer";

export const metadata: Metadata = { title: "Menu", description: "The full Aurevo menu — espresso, lattes, cold coffee, fourteen signature drinks, desserts and bakery. All recipes proposed; prices are estimates." };

export default async function MenuPage() {
  const { products, categories } = await getCatalog();
  return (
    <>
      <PageHero eyebrow="Menu" title={<>Everything we’d pour, <em>and bake.</em></>}>Classics done carefully, plus fourteen original signatures. Prices in USD are planning estimates.</PageHero>
      <Suspense><MenuExplorer products={products} categories={categories} /></Suspense>
    </>
  );
}
