import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/admin/auth";
import { deleteInquiry } from "@/lib/admin/actions";
import { inboxTable } from "@/lib/admin/inbox";
import { InquiryEditor } from "@/components/admin-forms";
import { Card, StatusPill, Title, fmtDate } from "@/components/admin-bits";
import { ConfirmButton } from "@/components/admin-ui";

const HIDE = new Set(["id", "status", "internal_notes", "updated_at"]);

export default async function InquiryDetail({ params }: { params: Promise<{ kind: string; id: string }> }) {
  const { kind, id } = await params;
  const table = inboxTable(kind);
  if (!table || !/^[0-9a-f-]{36}$/.test(id)) notFound();
  const { db, profile } = await requireStaff();
  const { data } = await db.from(table).select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const r = data as Record<string, string | boolean | null>;
  return (
    <>
      <Link href={`/admin/inbox/${kind}`} className="text-sm underline underline-offset-4">← Back</Link>
      <Title action={<StatusPill s={String(r.status)} />}>{String(r.name)}</Title>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card><dl className="grid gap-4 text-sm">
          {Object.entries(r).filter(([k, v]) => !HIDE.has(k) && v !== null && v !== "").map(([k, v]) => (
            <div key={k} className="grid gap-1 sm:grid-cols-[10rem_1fr]"><dt className="text-smoke capitalize">{k.replaceAll("_", " ")}</dt><dd className="whitespace-pre-wrap break-words">{k === "created_at" ? fmtDate(String(v)) : k === "email" ? <a className="underline" href={`mailto:${v}`}>{String(v)}</a> : typeof v === "boolean" ? (v ? "Yes" : "No") : String(v).replaceAll("_", k === "message" ? "_" : " ")}</dd></div>))}
        </dl></Card>
        <div className="grid content-start gap-6">
          <Card><InquiryEditor kind={kind} id={id} status={String(r.status)} notes={String(r.internal_notes ?? "")} readOnly={profile.role === "viewer"} /></Card>
          {profile.role === "admin" && <Card><form action={deleteInquiry}><input type="hidden" name="kind" value={kind} /><input type="hidden" name="id" value={id} /><ConfirmButton message="Permanently delete this inquiry?">Delete inquiry</ConfirmButton></form></Card>}
        </div>
      </div>
    </>
  );
}
