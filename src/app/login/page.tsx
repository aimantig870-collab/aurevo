import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { LoginForm } from "@/components/admin-ui";

export const metadata: Metadata = { title: "Staff sign in", robots: { index: false, follow: false } };

export default async function Login({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const sp = await searchParams;
  return (
    <main id="main" className="grid min-h-screen place-items-center bg-night px-5">
      <div className="w-full max-w-md rounded-3xl bg-crema p-8 md:p-10">
        <Logo />
        <h1 className="h-display mt-8 text-4xl">Staff sign in</h1>
        <p className="mb-6 mt-2 text-sm text-smoke">Accounts are created by an administrator in Supabase. New accounts start with read-only access.</p>
        <Suspense><LoginForm next={sp.next} error={sp.error} /></Suspense>
        <Link href="/" className="mt-6 inline-block text-sm underline underline-offset-4">← Back to site</Link>
      </div>
    </main>
  );
}
