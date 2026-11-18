import type { Metadata } from "next";
import Image from "next/image";
import { palette } from "@/data/brand";
import { PageHero, SectionHead } from "@/components/ui";

export const metadata: Metadata = { title: "Brand Identity", description: "Aurevo’s logo system, typography, colour palette, patterns, iconography and applications." };

const logos = [
  ["Primary logo", "/art/logo/logo-primary.svg", "bg-crema-2", 680, 160],
  ["Primary — reversed", "/art/logo/logo-primary-light.svg", "bg-night", 680, 160],
  ["Secondary (stacked)", "/art/logo/logo-secondary.svg", "bg-crema-2", 400, 420],
  ["Symbol", "/art/logo/symbol.svg", "bg-crema-2", 100, 100],
  ["Monogram", "/art/logo/monogram.svg", "bg-crema-2", 120, 120],
  ["Wordmark", "/art/logo/wordmark.svg", "bg-crema-2", 480, 120],
] as const;
const mockups = [["hot-cup", "Hot cup"], ["cold-cup", "Cold cup"], ["coffee-bag", "Coffee bag"], ["paper-bag", "Paper bag"], ["pastry-box", "Pastry box"], ["napkin", "Napkin"], ["uniform", "Staff uniform"], ["menu", "Menu"], ["business-card", "Business cards"], ["signage", "Store signage"], ["product-label", "Product label"]];
const icons = ["cup", "bean", "sun", "leaf", "croissant", "pin", "bag", "clock"];

export default function Brand() {
  return (
    <>
      <PageHero eyebrow="Brand identity" title={<>One sun. <em>Everywhere.</em></>}>The logo system, palette, type and applications — built to look identical on a cup in Doha and a sign in Oslo.</PageHero>
      <section className="wrap py-20">
        <SectionHead eyebrow="Logo system" title="The sun rises from the cup.">The symbol is a sun rising over a cup’s rim. In the logotype the “O” is that same sun resting on the horizon. Letterforms are custom monoline geometry — no stock fonts in the logo.</SectionHead>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {logos.map(([t, src, bg, w, h]) => <li key={t}><div className={`grid aspect-[4/3] place-items-center rounded-2xl p-8 ${bg}`}><Image src={src} alt={t} width={w} height={h} className="max-h-full w-auto max-w-full" /></div><p className="mt-2 text-sm font-semibold">{t}</p></li>)}
        </ul>
        <div className="mt-10 grid gap-6 rounded-2xl bg-crema-2 p-6 text-sm md:grid-cols-3">
          <div><h3 className="eyebrow text-ember">Clear space</h3><p className="mt-2">Keep a margin equal to the height of the “A” on all sides.</p></div>
          <div><h3 className="eyebrow text-ember">Minimum size</h3><p className="mt-2">Primary logo 28 px / 10 mm high. Symbol 16 px / 6 mm.</p></div>
          <div><h3 className="eyebrow text-ember">Never</h3><p className="mt-2">Stretch, recolour outside the palette, add shadows, or place on busy imagery.</p></div>
        </div>
      </section>
      <section className="bg-night text-crema"><div className="wrap py-20">
        <SectionHead eyebrow="Colour" title="Espresso, crema and a drop of sun." />
        <h3 className="eyebrow mt-10 text-aurum">Primary</h3>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">{palette.primary.map((c) => <li key={c.hex} className="overflow-hidden rounded-2xl bg-night-2"><div className="h-28 border-b border-crema/10" style={{ background: c.hex }} /><div className="p-4"><p className="font-display text-2xl">{c.name}</p><p className="font-mono text-xs text-aurum">{c.hex}</p><p className="mt-1 text-xs text-oat">{c.use}</p></div></li>)}</ul>
        <h3 className="eyebrow mt-10 text-aurum">Secondary</h3>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{palette.secondary.map((c) => <li key={c.hex} className="overflow-hidden rounded-2xl bg-night-2"><div className="h-20" style={{ background: c.hex }} /><div className="p-3"><p className="font-display text-xl">{c.name}</p><p className="font-mono text-xs text-aurum">{c.hex}</p><p className="mt-1 text-xs text-oat">{c.use}</p></div></li>)}</ul>
        <p className="mt-6 text-sm text-oat">Accessibility: Aurum text on Crema fails contrast — use Bronze (#8A5A1E) for gold text on light backgrounds; Aurum is for fills and for text on Espresso.</p>
      </div></section>
      <section className="wrap grid gap-12 py-20 lg:grid-cols-2">
        <div><SectionHead eyebrow="Typography" title="Instrument Serif & Hanken Grotesk" />
          <div className="mt-8 rounded-2xl bg-crema-2 p-8"><p className="h-display text-6xl">Aa <em>Golden hour</em></p><p className="eyebrow mt-3 text-smoke">Display — Instrument Serif Regular & Italic</p></div>
          <div className="mt-4 rounded-2xl bg-crema-2 p-8"><p className="text-2xl font-semibold">Aa Slow down. Glow up.</p><p className="mt-2 text-smoke">Body, UI and labels — Hanken Grotesk, weights 400–700. Eyebrows are 12 px, tracked +22%, uppercase.</p></div></div>
        <div><SectionHead eyebrow="Iconography" title="Line icons, 3 px, round caps" />
          <ul className="mt-8 grid grid-cols-4 gap-4">{icons.map((i) => <li key={i} className="grid aspect-square place-items-center rounded-2xl bg-crema-2"><Image src={`/art/icons/${i}.svg`} alt={`${i} icon`} width={48} height={48} /></li>)}</ul>
          <h3 className="eyebrow mt-10 text-ember">Pattern: “Sunrise tile”</h3>
          <div className="mt-3 h-36 rounded-2xl" style={{ backgroundImage: "url('/art/mockups/napkin.svg')", backgroundSize: "cover", backgroundPosition: "center" }} role="img" aria-label="Sunrise pattern on a napkin" /></div>
      </section>
      <section className="bg-crema-2"><div className="wrap py-20"><SectionHead eyebrow="Applications" title="One identity, every surface." />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{mockups.map(([f, t]) => <li key={f}><div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-oat"><Image src={`/art/mockups/${f}.svg`} alt={`${t} mockup`} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" /></div><p className="mt-2 text-sm font-semibold">{t}</p></li>)}</ul>
        <p className="mt-6 text-xs text-smoke">Flat vector mockups for identity review — not production-ready dielines. Printers will need die-cut artwork.</p></div></section>
    </>
  );
}
