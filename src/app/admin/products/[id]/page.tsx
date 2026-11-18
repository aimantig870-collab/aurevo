import Image from "next/image";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/admin/auth";
import { deleteProduct, deleteProductImage, setPrimaryImage } from "@/lib/admin/actions";
import { ProductForm, type ProductRow } from "@/components/admin-forms";
import { Card, Title } from "@/components/admin-bits";
import { ConfirmButton } from "@/components/admin-ui";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { db, profile } = await requireStaff();
  const readOnly = profile.role === "viewer";
  const { data: cats } = await db.from("categories").select("id,name").order("sort_order");
  let row: ProductRow = {};
  let images: { id: string; url: string; alt: string; is_primary: boolean }[] = [];
  if (id !== "new") {
    if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
    const { data: p } = await db.from("products").select("*").eq("id", id).maybeSingle();
    if (!p) notFound();
    row = { ...p, ingredients_text: (p.ingredients as { item: string; qty: string }[]).map((i) => `${i.item} | ${i.qty}`).join("\n"), method_text: (p.method as string[]).join("\n") };
    images = (await db.from("product_images").select("id,url,alt,is_primary").eq("product_id", id).order("is_primary", { ascending: false })).data ?? [];
  } else if (readOnly) notFound();
  return (
    <>
      <Title>{id === "new" ? "New product" : String(row.name)}</Title>
      <div className="grid gap-8 xl:grid-cols-[1fr_22rem]">
        <Card><ProductForm p={row} categories={cats ?? []} readOnly={readOnly} /></Card>
        {id !== "new" && (
          <div className="grid content-start gap-6">
            <Card><h2 className="font-display text-2xl">Images</h2>
              {images.length === 0 && <p className="mt-2 text-sm text-smoke">No images yet — add one in the form.</p>}
              <ul className="mt-4 grid gap-4">{images.map((i) => (
                <li key={i.id}><div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-oat"><Image src={i.url} alt={i.alt} fill sizes="320px" className="object-cover" /></div>
                  <div className="mt-2 flex items-center gap-2 text-sm">{i.is_primary ? <strong className="text-bronze">Primary</strong> : !readOnly && <form action={setPrimaryImage}><input type="hidden" name="id" value={i.id} /><input type="hidden" name="product_id" value={id} /><button className="underline underline-offset-4">Make primary</button></form>}
                    {!readOnly && <form action={deleteProductImage} className="ml-auto"><input type="hidden" name="id" value={i.id} /><input type="hidden" name="product_id" value={id} /><ConfirmButton message="Remove this image?">Remove</ConfirmButton></form>}</div></li>))}</ul>
            </Card>
            {!readOnly && <Card><h2 className="font-display text-2xl">Danger zone</h2><form action={deleteProduct} className="mt-3"><input type="hidden" name="id" value={id} /><ConfirmButton message="Delete this product permanently?">Delete product</ConfirmButton></form></Card>}
          </div>
        )}
      </div>
    </>
  );
}
