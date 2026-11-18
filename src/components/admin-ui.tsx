"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { toast } from "sonner";
import { Field, Submit, inputProps, useFormAction } from "@/components/form-kit";
import { signIn } from "@/lib/admin/actions";

/** Shows a toast from ?saved / ?deleted / ?error / ?denied query params, once. */
export function Flash() {
  const sp = useSearchParams();
  useEffect(() => {
    if (sp.get("saved")) toast.success("Saved.");
    if (sp.get("deleted")) toast.success("Deleted.");
    if (sp.get("denied")) toast.error("You don't have permission for that page.");
    if (sp.get("error")) toast.error(sp.get("error") ?? "Something went wrong.");
  }, [sp]);
  return null;
}

export function ConfirmButton({ children, message, className = "btn btn-line !py-2 !px-4 !text-sm text-ember" }: { children: ReactNode; message: string; className?: string }) {
  return <button type="submit" className={className} onClick={(e) => { if (!confirm(message)) e.preventDefault(); }}>{children}</button>;
}

export function AdminNav({ items }: { items: { href: string; label: string; badge?: number }[] }) {
  const path = usePathname();
  return (
    <ul className="flex gap-1 overflow-x-auto lg:grid">
      {items.map((i) => {
        const on = i.href === "/admin" ? path === "/admin" : path.startsWith(i.href);
        return <li key={i.href} className="shrink-0"><Link href={i.href} aria-current={on ? "page" : undefined} className={`flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm font-medium ${on ? "bg-aurum text-night" : "text-oat hover:bg-crema/10"}`}>{i.label}{!!i.badge && <span className="rounded-full bg-ember px-2 py-0.5 text-xs text-crema">{i.badge}</span>}</Link></li>;
      })}
    </ul>
  );
}

export function LoginForm({ next, error }: { next?: string; error?: string }) {
  const { state, run, pending } = useFormAction(signIn);
  return (
    <form action={run} className="grid gap-5" noValidate>
      <input type="hidden" name="next" value={next ?? "/admin"} />
      {error === "config" && <p role="alert" className="rounded-xl bg-ember/10 p-3 text-sm text-ember">Supabase is not configured — set the environment variables first.</p>}
      <Field label="Email" name="email"><input {...inputProps("email")} type="email" autoComplete="username" required /></Field>
      <Field label="Password" name="password" error={state.ok === false ? state.message : undefined}><input {...inputProps("password")} type="password" autoComplete="current-password" required /></Field>
      <Submit pending={pending}>Sign in</Submit>
    </form>
  );
}
