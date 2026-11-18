import type { Metadata } from "next";
import { getGallery } from "@/lib/data";
import { PageHero } from "@/components/ui";
import { GalleryGrid } from "@/components/gallery-grid";

export const metadata: Metadata = { title: "Gallery", description: "Drinks, packaging and café concept visuals from the Aurevo brand." };

export default async function Gallery() {
  const items = await getGallery();
  return (
    <>
      <PageHero eyebrow="Gallery" title={<>The brand, <em>in pictures.</em></>}>Concept illustrations and mockups. Real photography will replace them once recipes are tested.</PageHero>
      <GalleryGrid items={items} />
    </>
  );
}
