"use client";
import { startTransition, useActionState, useEffect, useRef, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import type { FormState } from "@/lib/validation";

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;

/**
 * Wraps a server action for use with <form onSubmit={run}>.
 * We deliberately avoid <form action={...}>: React 19 resets uncontrolled fields after an action completes,
 * which would wipe everything the user typed when validation fails. Creation forms (no hidden `id`) are
 * cleared manually on success.
 */
export function useFormAction(action: Action) {
  const [state, dispatch, pending] = useActionState(action, {} as FormState);
  const form = useRef<HTMLFormElement | null>(null);
  const run = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.current = e.currentTarget;
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  };
  useEffect(() => {
    if (state.message) (state.ok ? toast.success : toast.error)(state.message);
    const f = form.current;
    if (state.ok && f && f.isConnected && !f.elements.namedItem("id")) f.reset();
  }, [state]);
  return { state, run, pending };
}

export function Field({ label, name, error, hint, htmlFor, children }: { label: string; name: string; error?: string; hint?: string; htmlFor?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor ?? name} className="mb-1.5 block text-sm font-semibold">{label}</label>
      {children}
      {hint && !error && <p id={`${name}-hint`} className="mt-1 text-xs text-smoke">{hint}</p>}
      {error && <p id={`${name}-err`} role="alert" className="mt-1 text-xs font-medium text-ember">{error}</p>}
    </div>
  );
}

export const inputProps = (name: string, errors?: Record<string, string>) => ({
  id: name, name, className: "field", "aria-invalid": errors?.[name] ? (true as const) : undefined,
  "aria-describedby": errors?.[name] ? `${name}-err` : undefined,
});

/** Hidden honeypot — real users never see or fill it. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>Website<input tabIndex={-1} autoComplete="off" name="website" /></label>
    </div>
  );
}

export function Submit({ pending, children }: { pending: boolean; children: ReactNode }) {
  return <button type="submit" disabled={pending} className="btn btn-dark disabled:opacity-60">{pending ? "Sending…" : children}</button>;
}

export function Done({ state }: { state: FormState }) {
  if (!state.ok) return null;
  return <div role="status" className="rounded-2xl border border-cardamom/40 bg-cardamom/10 p-5 text-sm">{state.message}</div>;
}
