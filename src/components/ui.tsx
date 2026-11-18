import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { SiteProduct } from "@/lib/data";

export const money = (n: number) => `$${n.toFixed(2)}`;

export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-night text-crema grain">
      <div aria-hidden className="absolute -right-24 top-10 h-[420px] w-[420px] rounded-full bg-aurum/20 blur-3xl" />
      <svg aria-hidden viewBox="0 0 200 100" className="absolute -bottom-1 right-0 w-[min(620px,70%)] text-aurum opacity-90"><path d="M10 100 A90 90 0 0 1 190 100 Z" fill="currentColor" /></svg>
      <div className="wrap relative py-20 md:py-28">
        <p className="eyebrow text-aurum animate-rise">{eyebrow}</p>
        <h1 className="h-display mt-4 max-w-3xl text-5xl animate-rise md:text-7xl [animation-delay:.08s]">{title}</h1>
        {children && <div className="mt-6 max-w-xl text-lg text-oat animate-rise [animation-delay:.16s]">{children}</div>}
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, children, center = false }: { eyebrow: string; title: ReactNode; children?: ReactNode; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="eyebrow text-ember">{eyebrow}</p>
      <h2 className="h-display mt-3 text-4xl md:text-5xl">{title}</h2>
      {children && <p className="mt-4 text-lg text-smoke">{children}</p>}
    </div>
  );
}

export function Notice({ children, tone = "gold" }: { children: ReactNode; tone?: "gold" | "dark" }) {
  return (
    <div role="note" className={`rounded-2xl border px-5 py-4 text-sm leading-relaxed ${tone === "dark" ? "border-aurum/40 bg-night-2 text-oat" : "border-aurum/50 bg-aurum/10 text-night"}`}>
      {children}
    </div>
  );
}

export function ProductCard({ p, priority = false }: { p: SiteProduct; priority?: boolean }) {
  return (
    <Link href={`/menu/${p.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-oat">
        <Image src={p.image} alt={p.imageAlt} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 45vw, 90vw" priority={priority} className="object-cover transition duration-700 group-hover:scale-[1.04]" />
        {p.tier === "signature" && <span className="absolute left-3 top-3 rounded-full bg-night/85 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-widest text-aurum">Signature</span>}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-2xl leading-tight group-hover:text-ember">{p.name}</h3>
        <span className="shrink-0 text-sm font-semibold text-bronze">{money(p.priceUsd)}</span>
      </div>
      <p className="mt-1 text-sm text-smoke">{p.tagline}</p>
    </Link>
  );
}
