import type { Metadata } from "next";
import Image from "next/image";
import { Notice, PageHero } from "@/components/ui";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = { title: "Virtual Café", description: "Concept renderings and design standards for the Aurevo café: architecture, interior, lighting, furniture and signage." };

const views = [
  { img: "/art/cafe/exterior-day.svg", t: "Exterior — daytime", d: "A warm plaster façade with arched windows, a charcoal fascia carrying the AUREVO logotype, terracotta awnings and planters in cardamom green." },
  { img: "/art/cafe/exterior-night.svg", t: "Exterior — night", d: "The arches glow amber from within. Brass-toned lighting makes the storefront read as a lantern on the street." },
  { img: "/art/cafe/interior-wide.svg", t: "Interior — wide view", d: "Brass pendants above a long oak-and-charcoal counter; open shelving for retail beans; mixed stools and two-tops for flexible seating." },
  { img: "/art/cafe/counter.svg", t: "Coffee counter", d: "The bar is theatre: espresso machine and grinders face the guest, a menu board in crema-on-charcoal, pastry display at the register." },
  { img: "/art/cafe/seating.svg", t: "Customer seating", d: "A terracotta banquette beneath arched windows catches the golden hour. Plants, low tables and a green feature wall soften the room." },
  { img: "/art/cafe/product-studio.svg", t: "Product photography set", d: "A dedicated corner with window-side diffusion, warm bounce card and oak tabletop for consistent drink photography." },
];
const spec = [
  ["Architecture", "Arched openings, rendered plaster, steel-framed glazing, a charcoal fascia with a brass-finish edge."],
  ["Materials", "Lime plaster (Crema), oak, terracotta tile, blackened steel, brass accents, cardamom-green planting."],
  ["Lighting", "2700 K throughout. Brass pendants over the counter; low, indirect wall washes; a sunrise-gold feature light behind the bar."],
  ["Furniture", "Oak two-tops, terracotta banquette, leather-topped stools, boucle lounge chairs. Rounded corners everywhere."],
  ["Signage", "Fascia logotype, blade sign with symbol, window arcs with the sun mark, menu board in Instrument Serif."],
  ["Display", "Open oak shelving for whole-bean bags; refrigerated pastry case; a glass-fronted “golden shelf” for signature desserts."],
];

export default function VirtualCafe() {
  return (
    <>
      <PageHero eyebrow="Virtual café" title={<>Step inside the <em>glow.</em></>}>Six consistent concept views and the design standards behind them.</PageHero>
      <div className="wrap pt-10"><Notice><strong>Concept art.</strong> These are stylised vector illustrations, not photorealistic renders or architectural drawings. Photoreal renders can be commissioned from the prompts in <code>docs/photography-direction.md</code>.</Notice></div>
      <ul className="wrap grid gap-16 py-16">
        {views.map((v, i) => (
          <li key={v.t}><Reveal className="grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div className={`relative aspect-[16/10] overflow-hidden rounded-3xl bg-oat ${i % 2 ? "lg:order-2" : ""}`}><Image src={v.img} alt={`Concept illustration: ${v.t}`} fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover" /></div>
            <div><p className="eyebrow text-ember">View {i + 1} of 6</p><h2 className="h-display mt-2 text-4xl md:text-5xl">{v.t}</h2><p className="mt-4 text-lg text-smoke">{v.d}</p></div>
          </Reveal></li>
        ))}
      </ul>
      <section className="bg-night text-crema"><div className="wrap py-20"><h2 className="h-display text-4xl md:text-5xl">Design standards</h2>
        <dl className="mt-10 grid gap-px overflow-hidden rounded-3xl bg-crema/10 md:grid-cols-2 lg:grid-cols-3">{spec.map(([k, v]) => <div key={k} className="bg-night p-7"><dt className="font-display text-3xl text-aurum">{k}</dt><dd className="mt-3 text-sm leading-relaxed text-oat">{v}</dd></div>)}</dl></div></section>
    </>
  );
}
