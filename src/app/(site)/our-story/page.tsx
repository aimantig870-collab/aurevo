import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = { title: "Our Story", description: "The story behind Aurevo and an honest account of where the brand stands today." };

const truth = [
  ["Done", "Brand strategy, name shortlist, visual identity, 14 proposed signature recipes, concept renderings, website and management tools."],
  ["Estimated", "Recipe costs, selling prices, margins and the financial model — all built from stated assumptions, not supplier quotes."],
  ["Not yet done", "Bench-testing of recipes, a trademark search, supplier quotes, a physical location, legal franchise documents and any sales."],
];

export default function Story() {
  return (
    <>
      <PageHero eyebrow="Our story" title={<>It starts with the <em>light.</em></>} />
      <article className="wrap max-w-3xl py-20 text-lg leading-relaxed">
        <Reveal><p className="font-display text-4xl leading-tight">Every café has a golden hour — that stretch when sun slants low and everyone, without being asked, slows down.</p></Reveal>
        <Reveal delay={80}><p className="mt-8 text-smoke">Aurevo began as a question: what if a café were designed entirely around that moment? Not just warm lighting, but warm everything — a menu that feels like a long afternoon, a ritual that rewards patience, a brand you could recognise by its glow.</p></Reveal>
        <Reveal delay={80}><p className="mt-6 text-smoke">The name joins <em>aurum</em>, Latin for gold, with the soft vowels of <em>au revoir</em> — a warm goodbye to the day. Our symbol is a sun rising from a cup’s rim; the “O” in our wordmark is that same sun on the horizon.</p></Reveal>
        <Reveal delay={80}><p className="mt-6 text-smoke">The flavours come from crossroads: saffron and date from the Gulf, pandan from Southeast Asia, miso and hojicha from Japan, tamarind from South Asia, ube from the Philippines — all anchored by a classic specialty espresso.</p></Reveal>
      </article>
      <section className="bg-night text-crema"><div className="wrap py-20">
        <p className="eyebrow text-aurum">Where we really are</p>
        <h2 className="h-display mt-3 max-w-2xl text-4xl md:text-5xl">An honest status report.</h2>
        <dl className="mt-10 grid gap-px overflow-hidden rounded-3xl bg-crema/10 md:grid-cols-3">{truth.map(([h, b]) => <div key={h} className="bg-night p-7"><dt className="font-display text-3xl text-aurum">{h}</dt><dd className="mt-3 text-oat">{b}</dd></div>)}</dl>
      </div></section>
    </>
  );
}
