import Image from "next/image";
import Link from "next/link";
import { getCatalog, getSettings } from "@/lib/data";
import { values } from "@/data/brand";
import { Notice, ProductCard, SectionHead } from "@/components/ui";
import { Reveal } from "@/components/reveal";

export default async function Home() {
  const [{ products, categories }, s] = await Promise.all([getCatalog(), getSettings()]);
  const featured = products.filter((p) => p.featured).slice(0, 6);
  const hero = products.find((p) => p.slug === "golden-hour-latte") ?? products[0];
  return (
    <>
      <section className="relative overflow-hidden bg-night text-crema grain">
        <div aria-hidden className="absolute left-1/2 top-1/3 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-aurum/15 blur-3xl animate-sun" />
        <div className="wrap relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow text-aurum animate-rise">{s.descriptor} · Concept</p>
            <h1 className="h-display mt-5 text-[clamp(3.2rem,8vw,6.8rem)] animate-rise [animation-delay:.08s]">{s.hero_title.replace(/\.$/, "")}<span className="text-aurum">.</span></h1>
            <p className="mt-6 max-w-lg text-lg text-oat animate-rise [animation-delay:.18s]">{s.hero_subtitle}</p>
            <div className="mt-9 flex flex-wrap gap-3 animate-rise [animation-delay:.28s]">
              <Link href="/signature" className="btn btn-gold">Explore signature drinks</Link>
              <Link href="/virtual-cafe" className="btn btn-line border-crema/40 text-crema hover:bg-crema/10">Step inside the café</Link>
            </div>
            <p className="mt-10 font-display text-2xl italic text-oat animate-rise [animation-delay:.36s]">“{s.slogan}”</p>
          </div>
          <div className="relative mx-auto w-full max-w-md animate-rise [animation-delay:.2s]">
            <div className="absolute -inset-4 rounded-t-[999px] rounded-b-3xl border border-aurum/40" aria-hidden />
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-2xl bg-oat">
              <Image src={hero.image} alt={hero.imageAlt} fill priority sizes="(min-width:1024px) 40vw, 90vw" className="object-cover" />
            </div>
            <Link href={`/menu/${hero.slug}`} className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-crema px-5 py-2.5 text-sm font-semibold text-night shadow-xl">{hero.name} →</Link>
          </div>
        </div>
      </section>

      <section className="wrap grid gap-10 py-20 md:grid-cols-2 md:py-28">
        <Reveal><SectionHead eyebrow="The idea" title={<>A café for the <em>thirty minutes</em> when everything glows.</>} /></Reveal>
        <Reveal delay={120}>
          <p className="text-lg leading-relaxed text-smoke">Aurevo is a premium coffee house concept built around the golden hour — that slow, amber stretch between day and dusk. We pair a specialty-coffee base with the pantries of the world: saffron and date, pandan and ube, miso and tamarind. Every drink on this site is a <strong className="text-night">proposed recipe</strong>, designed to be technically plausible and ready for bench testing.</p>
          <div className="mt-6"><Notice>Aurevo is at concept stage: no operating café, no sales history and no available franchise yet. Everything here is clearly labelled as proposed or estimated.</Notice></div>
        </Reveal>
      </section>

      <section className="bg-crema-2 py-20 md:py-28">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead eyebrow="Signature" title="Fourteen drinks you won’t find elsewhere." />
            <Link href="/signature" className="btn btn-dark">View all signature drinks</Link>
          </div>
          <ul className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => <Reveal as="li" key={p.id} delay={(i % 3) * 90}><ProductCard p={p} /></Reveal>)}
          </ul>
        </div>
      </section>

      <section className="bg-night text-crema">
        <div className="wrap py-20 md:py-28">
          <SectionHead eyebrow="Philosophy" title={<>Slow is a skill. <span className="italic text-aurum">Warm is a standard.</span></>} />
          <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-crema/10 sm:grid-cols-2 lg:grid-cols-5">
            {values.map((v, i) => (
              <li key={v.title} className="bg-night p-7">
                <span className="font-display text-4xl text-aurum">0{i + 1}</span>
                <h3 className="mt-4 font-display text-2xl">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-oat">{v.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="wrap grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2">
        <Reveal className="grid grid-cols-2 gap-4">
          <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-2xl"><Image src="/art/cafe/exterior-night.svg" alt="Concept rendering of the Aurevo storefront at night" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" /></div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl"><Image src="/art/cafe/interior-wide.svg" alt="Concept rendering of the interior" fill sizes="25vw" className="object-cover" /></div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl"><Image src="/art/cafe/counter.svg" alt="Concept rendering of the coffee counter" fill sizes="25vw" className="object-cover" /></div>
        </Reveal>
        <Reveal delay={120}>
          <SectionHead eyebrow="Virtual café" title="Walk through the space before it exists.">Arched windows, brass pendants, terracotta and oak — a space designed so the light does the talking. Six concept views show how the brand lives in three dimensions.</SectionHead>
          <Link href="/virtual-cafe" className="btn btn-dark mt-8">Tour the virtual café</Link>
        </Reveal>
      </section>

      <section className="wrap pb-10">
        <h2 className="sr-only">Menu categories</h2>
        <ul className="flex flex-wrap justify-center gap-3">
          {categories.map((c) => <li key={c.id}><Link href={`/menu?c=${c.slug}`} className="inline-block rounded-full border border-night/20 px-5 py-2.5 text-sm font-medium transition hover:bg-night hover:text-crema">{c.name}</Link></li>)}
        </ul>
      </section>

      <section className="wrap py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-aurum p-10 text-night md:p-16">
          <svg aria-hidden viewBox="0 0 200 100" className="absolute -right-10 -top-10 w-72 text-night/10"><path d="M10 100 A90 90 0 0 1 190 100 Z" fill="currentColor" /></svg>
          <p className="eyebrow">Partnership</p>
          <h2 className="h-display mt-3 max-w-2xl text-4xl md:text-6xl">Bring the golden hour to your café.</h2>
          <p className="mt-4 max-w-xl text-lg">We’re exploring partnerships, signature-beverage licensing and, in time, franchising. Tell us what you have in mind — we’ll be honest about what’s ready and what isn’t.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/partnership" className="btn btn-dark">Start a conversation</Link><Link href="/franchise" className="btn btn-line">Franchise concept</Link></div>
        </div>
      </section>
    </>
  );
}
