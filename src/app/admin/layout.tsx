import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { requireStaff } from "@/lib/admin/auth";
import { signOut } from "@/lib/admin/actions";
import { AdminNav, Flash } from "@/components/admin-ui";
import { Logo } from "@/components/logo";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Aurevo admin" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { db, profile } = await requireStaff();
  const counts = await Promise.all(["partnership_requests", "franchise_inquiries", "contact_messages"].map((t) => db.from(t).select("id", { count: "exact", head: true }).eq("status", "new")));
  const [np, nf, nc] = counts.map((c) => c.count ?? 0);
  const items = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/categories", label: "Categories" },
    { href: "/admin/gallery", label: "Gallery" },
    { href: "/admin/settings", label: "Site content" },
    { href: "/admin/inbox/contact", label: "Messages", badge: nc },
    { href: "/admin/inbox/partnership", label: "Partnerships", badge: np },
    { href: "/admin/inbox/franchise", label: "Franchise", badge: nf },
    ...(profile.role === "admin" ? [{ href: "/admin/team", label: "Team" }, { href: "/admin/activity", label: "Activity log" }] : []),
  ];
  return (
    <div className="min-h-screen bg-crema-2 lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="bg-night p-4 text-crema lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:p-6">
        <div className="flex items-center justify-between lg:block"><Logo light className="h-8 w-auto" /><p className="eyebrow text-aurum lg:mt-6">Admin</p></div>
        <nav aria-label="Admin" className="mt-4"><AdminNav items={items} /></nav>
        <div className="mt-6 hidden border-t border-crema/10 pt-5 text-xs text-oat lg:block">
          <p className="truncate">{profile.email}</p><p className="mt-1 capitalize">Role: {profile.role}</p>
          <form action={signOut} className="mt-4"><button className="btn btn-line !py-2 !text-sm">Sign out</button></form>
          <Link href="/" className="mt-4 block underline underline-offset-4">View site →</Link>
        </div>
        <form action={signOut} className="mt-3 lg:hidden"><button className="text-xs underline">Sign out ({profile.role})</button></form>
      </aside>
      <main id="main" className="min-w-0 p-5 md:p-10"><Suspense><Flash /></Suspense>{children}</main>
    </div>
  );
}
