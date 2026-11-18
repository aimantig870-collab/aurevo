"use client";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { SiteCategory, SiteProduct } from "@/lib/data";
import { ProductCard } from "@/components/ui";

export function MenuExplorer({ products, categories }: { products: SiteProduct[]; categories: SiteCategory[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const cat = params.get("c") ?? "all";
  const [q, setQ] = useState("");
  const [temp, setTemp] = useState<"all" | "hot" | "iced">("all");
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter((p) =>
      (cat === "all" || p.category === cat) &&
      (temp === "all" || p.serve === temp || p.serve === "either") &&
      (!needle || `${p.name} ${p.tagline} ${p.description}`.toLowerCase().includes(needle)));
  }, [products, cat, q, temp]);
  const setCat = (c: string) => router.replace(c === "all" ? "/menu" : `/menu?c=${c}`, { scroll: false });
  const active = categories.find((c) => c.slug === cat);
  return (
    <section className="wrap py-12 md:py-16">
      <div className="sticky top-[72px] z-30 -mx-5 bg-crema/95 px-5 py-4 backdrop-blur sm:mx-0 sm:px-0">
        <div role="tablist" aria-label="Menu categories" className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
          {[{ slug: "all", name: "All" }, ...categories].map((c) => (
            <button key={c.slug} role="tab" aria-selected={cat === c.slug} onClick={() => setCat(c.slug)} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${cat === c.slug ? "border-night bg-night text-crema" : "border-night/20 hover:border-night"}`}>{c.name}</button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="menu-q">Search the menu</label>
          <input id="menu-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search drinks, flavours…" className="field max-w-xs !py-2.5" />
          <div className="flex gap-1 rounded-full border border-night/20 p-1" role="group" aria-label="Temperature">
            {(["all", "hot", "iced"] as const).map((t) => (
              <button key={t} aria-pressed={temp === t} onClick={() => setTemp(t)} className={`rounded-full px-4 py-1.5 text-sm capitalize ${temp === t ? "bg-aurum font-semibold" : ""}`}>{t}</button>
            ))}
          </div>
          <p aria-live="polite" className="text-sm text-smoke">{list.length} item{list.length === 1 ? "" : "s"}</p>
        </div>
      </div>
      {active && <p className="mt-6 max-w-xl font-display text-3xl italic text-smoke">{active.blurb}</p>}
      {list.length === 0 ? (
        <p className="py-24 text-center text-smoke">Nothing matches — try another search.</p>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p, i) => <li key={p.id}><ProductCard p={p} priority={i < 4} /></li>)}
        </ul>
      )}
    </section>
  );
}
