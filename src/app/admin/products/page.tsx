import Link from "next/link";
import { requireStaff } from "@/lib/admin/auth";
import { Card, Pagination, Title, pageOf, range, safeLike } from "@/components/admin-bits";

type SP = { q?: string; category?: string; status?: string; page?: string };
const money = (n: number) => `$${Number(n).toFixed(2)}`;

export default async function Products({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const { db, profile } = await requireStaff();
  const page = pageOf(sp.page);
  const { data: cats } = await db.from("categories").select("id,name").order("sort_order");
  let q = db.from("products").select("id,name,slug,tier,price_usd,cost_usd,is_active,recipe_status,categories(name)", { count: "exact" });
  if (sp.q && safeLike(sp.q)) q = q.or(`name.ilike.%${safeLike(sp.q)}%,slug.ilike.%${safeLike(sp.q)}%`);
  if (sp.category && sp.category !== "all") q = q.eq("category_id", sp.category);
  if (sp.status === "live") q = q.eq("is_active", true);
  if (sp.status === "hidden") q = q.eq("is_active", false);
  const [from, to] = range(page);
  const { data, count } = await q.order("sort_order").order("name").range(from, to);
  return (
    <>
      <Title action={profile.role !== "viewer" && <Link href="/admin/products/new" className="btn btn-dark">+ New product</Link>}>Products</Title>
      <form className="mb-5 flex flex-wrap gap-3" role="search">
        <input name="q" defaultValue={sp.q} placeholder="Search name or slug…" aria-label="Search products" className="field max-w-xs !py-2.5" />
        <select name="category" defaultValue={sp.category ?? "all"} aria-label="Category" className="field w-auto !py-2.5"><option value="all">All categories</option>{cats?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <select name="status" defaultValue={sp.status ?? "all"} aria-label="Visibility" className="field w-auto !py-2.5"><option value="all">Any visibility</option><option value="live">Live</option><option value="hidden">Hidden</option></select>
        <button className="btn btn-dark !py-2.5">Filter</button>
        {(sp.q || sp.category || sp.status) && <Link href="/admin/products" className="btn btn-line !py-2.5">Reset</Link>}
      </form>
      <Card className="overflow-x-auto !p-0">
        <table className="w-full min-w-[720px] text-left text-sm"><caption className="sr-only">Products</caption>
          <thead className="border-b border-night/10 text-smoke"><tr><th className="p-4">Name</th><th>Category</th><th>Tier</th><th>Price</th><th>Cost</th><th>Status</th><th><span className="sr-only">Edit</span></th></tr></thead>
          <tbody>{data?.map((p) => (
            <tr key={p.id} className="border-b border-night/5 hover:bg-crema-2">
              <th scope="row" className="p-4 font-semibold"><Link href={`/admin/products/${p.id}`} className="hover:text-ember">{p.name}</Link></th>
              <td>{(p.categories as unknown as { name: string } | null)?.name}</td><td className="capitalize">{p.tier}</td><td>{money(p.price_usd)}</td><td>{money(p.cost_usd)}</td>
              <td>{p.is_active ? "Live" : <span className="text-ember">Hidden</span>} · <span className="text-smoke">{p.recipe_status.replace("_", " ")}</span></td>
              <td className="pr-4 text-right"><Link href={`/admin/products/${p.id}`} className="underline underline-offset-4">{profile.role === "viewer" ? "View" : "Edit"}</Link></td>
            </tr>))}
            {!data?.length && <tr><td colSpan={7} className="p-8 text-center text-smoke">No products match.</td></tr>}
          </tbody></table>
      </Card>
      <Pagination page={page} total={count ?? 0} base="/admin/products" params={{ q: sp.q, category: sp.category, status: sp.status }} />
    </>
  );
}
