import { requireStaff } from "@/lib/admin/auth";
import { setRole } from "@/lib/admin/actions";
import { Card, Title, fmtDate } from "@/components/admin-bits";

export default async function Team() {
  const { db, user } = await requireStaff("admin");
  const { data } = await db.from("profiles").select("id,email,full_name,role,created_at").order("created_at");
  return (
    <>
      <Title>Team &amp; roles</Title>
      <p className="mb-4 max-w-2xl text-sm text-smoke"><strong>Admin</strong>: everything. <strong>Editor</strong>: content and inquiries (cannot delete inquiries or manage roles). <strong>Viewer</strong>: read-only. Create accounts in Supabase → Authentication → Users; they appear here as viewers.</p>
      <Card className="overflow-x-auto !p-0"><table className="w-full min-w-[560px] text-left text-sm"><caption className="sr-only">Staff accounts</caption>
        <thead className="border-b border-night/10 text-smoke"><tr><th className="p-4">Account</th><th>Joined</th><th>Role</th></tr></thead>
        <tbody>{data?.map((p) => (
          <tr key={p.id} className="border-b border-night/5"><th scope="row" className="p-4 font-semibold">{p.email}<div className="text-xs font-normal text-smoke">{p.full_name}</div></th><td>{fmtDate(p.created_at)}</td>
            <td>{p.id === user.id ? <span className="capitalize">{p.role} (you)</span> : <form action={setRole} className="flex gap-2"><input type="hidden" name="id" value={p.id} /><select name="role" defaultValue={p.role} aria-label={`Role for ${p.email}`} className="field w-auto !py-1.5"><option>admin</option><option>editor</option><option>viewer</option></select><button className="btn btn-dark !px-4 !py-1.5 !text-sm">Save</button></form>}</td></tr>))}</tbody></table></Card>
    </>
  );
}
