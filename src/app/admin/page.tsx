import Link from "next/link";
import { requireStaff } from "@/lib/admin/auth";
import { Card, StatusPill, Title, fmtDate } from "@/components/admin-bits";

export default async function Dashboard() {
  const { db, profile } = await requireStaff();
  const count = async (t: string) => (await db.from(t).select("id", { count: "exact", head: true })).count ?? 0;
  const [products, active, gallery, newC, newP, newF, recent] = await Promise.all([
    count("products"),
    db.from("products").select("id", { count: "exact", head: true }).eq("is_active", true).then((r) => r.count ?? 0),
    count("gallery"),
    db.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new").then((r) => r.count ?? 0),
    db.from("partnership_requests").select("id", { count: "exact", head: true }).eq("status", "new").then((r) => r.count ?? 0),
    db.from("franchise_inquiries").select("id", { count: "exact", head: true }).eq("status", "new").then((r) => r.count ?? 0),
    db.from("contact_messages").select("id,name,subject,status,created_at").order("created_at", { ascending: false }).limit(5),
  ]);
  const stats = [["Products", `${active}/${products} live`, "/admin/products"], ["Gallery items", String(gallery), "/admin/gallery"], ["New messages", String(newC), "/admin/inbox/contact"], ["New partnerships", String(newP), "/admin/inbox/partnership"], ["New franchise", String(newF), "/admin/inbox/franchise"]];
  return (
    <>
      <Title>Welcome{profile.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}</Title>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{stats.map(([l, v, h]) => <li key={l}><Link href={h}><Card className="transition hover:shadow-lg"><p className="text-sm text-smoke">{l}</p><p className="mt-1 font-display text-4xl">{v}</p></Card></Link></li>)}</ul>
      <h2 className="mt-12 font-display text-3xl">Latest messages</h2>
      <Card className="mt-4">
        {recent.data?.length ? <ul className="divide-y divide-night/10">{recent.data.map((m) => <li key={m.id}><Link href={`/admin/inbox/contact/${m.id}`} className="flex flex-wrap items-center justify-between gap-2 py-3 hover:text-ember"><span><strong>{m.name}</strong> — {m.subject}</span><span className="flex items-center gap-3 text-xs text-smoke">{fmtDate(m.created_at)} <StatusPill s={m.status} /></span></Link></li>)}</ul> : <p className="text-sm text-smoke">No messages yet.</p>}
      </Card>
    </>
  );
}
