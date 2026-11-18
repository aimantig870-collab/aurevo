import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalog } from "@/lib/data";
import { Notice, ProductCard, money } from "@/components/ui";

export const dynamicParams = true;
export async function generateStaticParams() {
  const { products } = await getCatalog();
  return products.map((p) => ({ slug: p.slug }));
}
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getCatalog()).products.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: p.name, description: `${p.tagline} ${p.description}`.slice(0, 200), openGraph: { images: [p.image] } };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const { products } = await getCatalog();
  const p = products.find((x) => x.slug === slug);
  if (!p) notFound();
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const rows: [string, string][] = [["Serving temperature", p.temperature], ["Cup size", p.cupSize], ["Presentation", p.presentation], ["Garnish", p.garnish], ["Caffeine", p.caffeine === "none" ? "Caffeine-free" : p.caffeine === "optional" ? "Optional espresso" : "Contains caffeine"]].filter(([, v]) => v) as [string, string][];
  return (
    <>
      <div className="wrap pt-8 text-sm text-smoke"><Link href="/menu" className="hover:text-ember">Menu</Link> / <Link href={`/menu?c=${p.category}`} className="hover:text-ember">{p.categoryName}</Link> / <span className="text-night">{p.name}</span></div>
      <article className="wrap grid gap-12 py-10 lg:grid-cols-2 lg:py-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-oat"><Image src={p.image} alt={p.imageAlt} fill priority sizes="(min-width:1024px) 45vw, 95vw" className="object-cover" /></div>
          <p className="mt-3 text-xs text-smoke">Concept illustration — not a photograph of a tested product.</p>
        </div>
        <div>
          <p className="eyebrow text-ember">{p.categoryName}{p.tier === "signature" ? " · Signature" : ""}</p>
          <h1 className="h-display mt-3 text-5xl md:text-7xl">{p.name}</h1>
          <p className="mt-3 font-display text-3xl italic text-bronze">{p.tagline}</p>
          <p className="mt-6 text-lg leading-relaxed text-smoke">{p.description}</p>
          <p className="mt-6 text-4xl font-semibold">{money(p.priceUsd)} <span className="text-sm font-normal text-smoke">suggested price (estimate)</span></p>
          <div className="mt-6"><Notice><strong>Recipe status: {p.recipeStatus.replace("_", " ")}.</strong> Quantities and costs are planning estimates and have not been bench-tested.</Notice></div>

          <dl className="mt-8 divide-y divide-night/10 border-y border-night/10 text-sm">
            {rows.map(([k, v]) => <div key={k} className="grid grid-cols-[10rem_1fr] gap-4 py-3"><dt className="text-smoke">{k}</dt><dd className="font-medium">{v}</dd></div>)}
          </dl>

          {p.ingredients.length > 0 && (
            <section className="mt-10"><h2 className="font-display text-3xl">Ingredients <span className="text-base text-smoke">(proposed quantities)</span></h2>
              <ul className="mt-4 divide-y divide-night/10 text-sm">{p.ingredients.map((i) => <li key={i.item} className="flex justify-between gap-4 py-2.5"><span>{i.item}</span><span className="shrink-0 font-semibold text-bronze">{i.qty}</span></li>)}</ul>
            </section>
          )}
          {p.method.length > 0 && (
            <section className="mt-10"><h2 className="font-display text-3xl">Preparation</h2>
              <ol className="mt-4 grid gap-3 text-sm leading-relaxed">{p.method.map((m, i) => <li key={i} className="flex gap-4"><span className="font-display text-2xl leading-none text-aurum">{i + 1}</span><span>{m}</span></li>)}</ol>
            </section>
          )}
          {(p.story || p.target) && (
            <section className="mt-10 grid gap-5 rounded-2xl bg-crema-2 p-6 text-sm">
              {p.story && <div><h3 className="eyebrow text-ember">The story</h3><p className="mt-2 text-base">{p.story}</p></div>}
              {p.target && <div><h3 className="eyebrow text-ember">Who it’s for</h3><p className="mt-2 text-base">{p.target}</p></div>}
            </section>
          )}
          <section className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-night/10 p-5 text-center text-sm">
            <div><p className="text-smoke">Est. ingredient cost</p><p className="text-xl font-semibold">{money(p.costUsd)}</p></div>
            <div><p className="text-smoke">Price</p><p className="text-xl font-semibold">{money(p.priceUsd)}</p></div>
            <div><p className="text-smoke">Ingredient margin</p><p className="text-xl font-semibold">{p.marginPct}%</p></div>
            <p className="col-span-3 text-xs text-smoke">Excludes packaging, labour, rent and wastage. Estimates only.</p>
          </section>
        </div>
      </article>
      {related.length > 0 && (
        <section className="bg-crema-2 py-16"><div className="wrap"><h2 className="font-display text-4xl">More from {p.categoryName}</h2>
          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">{related.map((r) => <li key={r.id}><ProductCard p={r} /></li>)}</ul></div></section>
      )}
    </>
  );
}
