import { requireStaff } from "@/lib/admin/auth";
import { Card, Pagination, Title, fmtDate, pageOf, range } from "@/components/admin-bits";

export default async function Activity({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams;
  const { db } = await requireStaff("admin");
  const page = pageOf(sp.page);
  const [from, to] = range(page);
  const { data, count } = await db.from("admin_activity_logs").select("*", { count: "exact" }).order("created_at", { ascending: false }).range(from, to);
  return (
    <>
      <Title>Activity log</Title>
      <Card className="overflow-x-auto !p-0"><table className="w-full min-w-[640px] text-left text-sm"><caption className="sr-only">Admin activity</caption>
        <thead className="border-b border-night/10 text-smoke"><tr><th className="p-4">When</th><th>Who</th><th>Action</th><th>Entity</th><th>Details</th></tr></thead>
        <tbody>{data?.map((l) => <tr key={l.id} className="border-b border-night/5 align-top"><td className="whitespace-nowrap p-4">{fmtDate(l.created_at)}</td><td>{l.actor_email}</td><td className="capitalize">{l.action.replace("_", " ")}</td><td>{l.entity}</td><td className="max-w-xs truncate font-mono text-xs text-smoke">{JSON.stringify(l.details)}</td></tr>)}
          {!data?.length && <tr><td colSpan={5} className="p-8 text-center text-smoke">No activity yet.</td></tr>}</tbody></table></Card>
      <Pagination page={page} total={count ?? 0} base="/admin/activity" params={{}} />
    </>
  );
}
