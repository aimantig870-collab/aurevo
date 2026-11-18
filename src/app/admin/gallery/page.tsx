import { requireStaff } from "@/lib/admin/auth";
import { deleteGallery } from "@/lib/admin/actions";
import { GalleryForm } from "@/components/admin-forms";
import { Card, Pagination, Title, pageOf, range, safeLike } from "@/components/admin-bits";
import { ConfirmButton } from "@/components/admin-ui";

export default async function GalleryAdmin({ searchParams }: { searchParams: Promise<{ q?: string; tag?: string; page?: string }> }) {
  const sp = await searchParams;
  const { db, profile } = await requireStaff();
  const readOnly = profile.role === "viewer";
  const page = pageOf(sp.page);
  let q = db.from("gallery").select("*", { count: "exact" });
  if (sp.q && safeLike(sp.q)) q = q.ilike("title", `%${safeLike(sp.q)}%`);
  if (sp.tag && sp.tag !== "all") q = q.eq("tag", sp.tag);
  const [from, to] = range(page);
  const { data, count } = await q.order("sort_order").range(from, to);
  return (
    <>
      <Title>Gallery</Title>
      <form className="mb-6 flex flex-wrap gap-3" role="search">
        <input name="q" defaultValue={sp.q} placeholder="Search title…" aria-label="Search gallery" className="field max-w-xs !py-2.5" />
        <select name="tag" defaultValue={sp.tag ?? "all"} aria-label="Tag" className="field w-auto !py-2.5"><option value="all">All tags</option>{["drinks", "brand", "cafe", "events"].map((t) => <option key={t}>{t}</option>)}</select>
        <button className="btn btn-dark !py-2.5">Filter</button>
      </form>
      {!readOnly && <Card className="mb-8"><h2 className="mb-4 font-display text-3xl">Add an image</h2><div className="max-w-md"><GalleryForm readOnly={false} /></div></Card>}
      <ul className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
        {data?.map((g) => (
          <li key={g.id}><Card><GalleryForm g={g} readOnly={readOnly} />
            {!readOnly && <form action={deleteGallery} className="mt-3"><input type="hidden" name="id" value={g.id} /><ConfirmButton message="Delete this gallery item?">Delete</ConfirmButton></form>}</Card></li>
        ))}
      </ul>
      {!data?.length && <p className="py-12 text-center text-smoke">Nothing here yet.</p>}
      <Pagination page={page} total={count ?? 0} base="/admin/gallery" params={{ q: sp.q, tag: sp.tag }} />
    </>
  );
}
