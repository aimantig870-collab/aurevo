import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";

export type Role = "admin" | "editor" | "viewer";
const rank: Record<Role, number> = { viewer: 1, editor: 2, admin: 3 };

/** Memoised per request: layout + page + actions share one user/profile lookup. */
export const getStaff = cache(async () => {
  const db = await serverClient();
  if (!db) return null;
  const { data: { user } } = await db.auth.getUser();
  if (!user) return null;
  const { data: profile } = await db.from("profiles").select("id,email,full_name,role").eq("id", user.id).maybeSingle();
  if (!profile) return null;
  return { db, user, profile: profile as { id: string; email: string; full_name: string; role: Role } };
});
export type Staff = NonNullable<Awaited<ReturnType<typeof getStaff>>>;

/** For pages: redirects to /login when signed out; returns null-safe staff otherwise. */
export async function requireStaff(min: Role = "viewer"): Promise<Staff> {
  const s = await getStaff();
  if (!s) redirect("/login");
  if (rank[s.profile.role] < rank[min]) redirect("/admin?denied=1");
  return s;
}

/** For server actions: returns staff or an error message — never trusts the client. */
export async function guard(min: Role): Promise<{ s: Staff } | { error: string }> {
  const s = await getStaff();
  if (!s) return { error: "Your session has expired. Please sign in again." };
  if (rank[s.profile.role] < rank[min]) return { error: "You do not have permission to do that." };
  return { s };
}

export async function logActivity(s: Staff, action: string, entity: string, entityId?: string, details: Record<string, unknown> = {}) {
  await s.db.from("admin_activity_logs").insert({ actor_id: s.user.id, actor_email: s.profile.email, action, entity, entity_id: entityId ?? null, details });
}
