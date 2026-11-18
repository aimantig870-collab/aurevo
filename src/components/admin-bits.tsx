import Link from "next/link";

export const PAGE_SIZE = 10;
export const qs = (base: string, params: Record<string, string | number | undefined>) => {
  const u = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== "" && v !== "all") u.set(k, String(v)); });
  const s = u.toString();
  return s ? `${base}?${s}` : base;
};
export const pageOf = (v?: string) => Math.max(1, Number.parseInt(v ?? "1", 10) || 1);
export const range = (page: number) => [(page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1] as const;
/** Escapes characters that are special inside a PostgREST .or()/ilike filter. */
export const safeLike = (s: string) => s.replace(/[%_,()\\*]/g, " ").trim().slice(0, 80);

export function Pagination({ page, total, base, params }: { page: number; total: number; base: string; params: Record<string, string | undefined> }) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (pages <= 1) return <p className="mt-4 text-sm text-smoke">{total} result{total === 1 ? "" : "s"}</p>;
  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-between text-sm">
      <p className="text-smoke">Page {page} of {pages} · {total} results</p>
      <div className="flex gap-2">
        {page > 1 && <Link className="btn btn-line !py-2" href={qs(base, { ...params, page: page - 1 })}>← Prev</Link>}
        {page < pages && <Link className="btn btn-line !py-2" href={qs(base, { ...params, page: page + 1 })}>Next →</Link>}
      </div>
    </nav>
  );
}

export const Title = ({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) => (
  <div className="mb-8 flex flex-wrap items-center justify-between gap-4"><h1 className="h-display text-4xl md:text-5xl">{children}</h1>{action}</div>
);
export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => <div className={`rounded-2xl bg-crema p-5 md:p-6 ${className}`}>{children}</div>;
export const StatusPill = ({ s }: { s: string }) => {
  const c = s === "new" ? "bg-ember text-crema" : s === "closed" ? "bg-night/10" : s === "spam" ? "bg-night/30" : "bg-aurum/40";
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${c}`}>{s.replace("_", " ")}</span>;
};
export const fmtDate = (d: string) => new Date(d).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
