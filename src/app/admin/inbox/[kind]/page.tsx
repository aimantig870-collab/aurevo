import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/admin/auth";
import { inboxTable } from "@/lib/admin/inbox";
import { Card, Pagination, StatusPill, Title, fmtDate, pageOf, range, safeLike } from "@/components/admin-bits";

const LABEL: Record<string, string> = { contact: "Contact messages", partnership: "Partnership requests", franchise: "Franchise inquiries" };

export default async function Inbox({ params, searchParams }: { params: Promise<{ kind: string }>; searchParams: Promise<{ q?: string; status?: string; page?: string }> }) {
  const { kind } = await params;
  const sp = await searchParams;
  const table = inboxTable(kind);
  if (!table) notFound();
  const { db } = await requireStaff();
  const page = pageOf(sp.page);
  let q = db.from(table).select("*", { count: "exact" });
  if (sp.status && sp.status !== "all") q = q.eq("status", sp.status);
  if (sp.q && safeLike(sp.q)) q = q.or(`name.ilike.%${safeLike(sp.q)}%,email.ilike.%${safeLike(sp.q)}%`);
  const [from, to] = range(page);
  const { data, count } = await q.order("created_at", { ascending: false }).range(from, to);
  const sub = (r: Record<string, string>) => kind === "contact" ? r.subject : kind === "partnership" ? r.partnership_type?.replace("_", " ") : `${r.country}${r.city ? ", " + r.city : ""} · ${r.investment_range?.replaceAll("_", " ")}`;
  return (
    <>
      <Title>{LABEL[kind]}</Title>
      <form className="mb-5 flex flex-wrap gap-3" role="search">
        <input name="q" defaultValue={sp.q} placeholder="Search name or email…" aria-label="Search" className="field max-w-xs !py-2.5" />
        <select name="status" defaultValue={sp.status ?? "all"} aria-label="Status" className="field w-auto !py-2.5"><option value="all">Any status</option>{["new", "in_review", "contacted", "closed", "spam"].map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}</select>
        <button className="btn btn-dark !py-2.5">Filter</button>
      </form>
      <Card className="overflow-x-auto !p-0"><table className="w-full min-w-[640px] text-left text-sm"><caption className="sr-only">{LABEL[kind]}</caption>
        <thead className="border-b border-night/10 text-smoke"><tr><th className="p-4">From</th><th>{kind === "contact" ? "Subject" : kind === "partnership" ? "Type" : "Location · budget"}</th><th>Received</th><th>Status</th></tr></thead>
        <tbody>{(data as Record<string, string>[] | null)?.map((r) => (
          <tr key={r.id} className="border-b border-night/5 hover:bg-crema-2"><th scope="row" className="p-4 font-semibold"><Link href={`/admin/inbox/${kind}/${r.id}`} className="hover:text-ember">{r.name}</Link><div className="text-xs font-normal text-smoke">{r.email}</div></th><td className="capitalize">{sub(r)}</td><td>{fmtDate(r.created_at)}</td><td><StatusPill s={r.status} /></td></tr>))}
          {!data?.length && <tr><td colSpan={4} className="p-8 text-center text-smoke">Nothing here.</td></tr>}</tbody></table></Card>
      <Pagination page={page} total={count ?? 0} base={`/admin/inbox/${kind}`} params={{ q: sp.q, status: sp.status }} />
    </>
  );
}
