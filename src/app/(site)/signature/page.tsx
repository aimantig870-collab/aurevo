import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCatalog } from "@/lib/data";
import { Notice, PageHero, money } from "@/components/ui";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = { title: "Signature Drinks", description: "Fourteen original Aurevo signature drinks — saffron, date, sesame, pandan, miso, tamarind and more. Proposed recipes, untested." };

export default async function Signature() {
  const { products } = await getCatalog();
  const list = products.filter((p) => p.tier === "signature");
  return (
    <>
      <PageHero eyebrow="Signature drinks" title={<>The Aurevo <em>palette.</em></>}>Each recipe pairs a specialty-coffee base with a pantry ingredient from another part of the world.</PageHero>
      <div className="wrap pt-10"><Notice><strong>Proposed recipes.</strong> None of these drinks has been physically tested, costed with supplier quotes, or sold. Treat quantities, costs and margins as planning estimates.</Notice></div>
      <ol className="wrap grid gap-24 py-20">
        {list.map((p, i) => (
          <li key={p.id}>
            <Reveal className={`grid items-center gap-10 md:grid-cols-2 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <Link href={`/menu/${p.slug}`} className="relative block aspect-[4/5] overflow-hidden rounded-3xl bg-oat">
                <Image src={p.image} alt={p.imageAlt} fill sizes="(min-width:768px) 45vw, 95vw" className="object-cover transition duration-700 hover:scale-[1.03]" />
              </Link>
              <div>
                <p className="eyebrow text-ember">№ {String(i + 1).padStart(2, "0")} · {p.serve === "either" ? "Hot or iced" : p.serve}</p>
                <h2 className="h-display mt-3 text-5xl md:text-6xl">{p.name}</h2>
                <p className="mt-3 font-display text-2xl italic text-bronze">{p.tagline}</p>
                <p className="mt-5 text-lg text-smoke">{p.description}</p>
                <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-night/10 py-5 text-sm">
                  <div><dt className="text-smoke">Size</dt><dd className="font-semibold">{p.cupSize}</dd></div>
                  <div><dt className="text-smoke">Suggested price</dt><dd className="font-semibold">{money(p.priceUsd)}</dd></div>
                </dl>
                <Link href={`/menu/${p.slug}`} className="btn btn-dark mt-6">Recipe &amp; details</Link>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </>
  );
}
