import type { Metadata } from "next";
import { brand, nameShortlist, personas, values } from "@/data/brand";
import { Notice, PageHero, SectionHead } from "@/components/ui";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = { title: "About the Brand", description: "Aurevo’s positioning, mission, vision, personality, values, audience and competitive position." };

const pillars = [
  ["Positioning", "An accessible-luxury specialty café for people who want something genuinely different: world-pantry flavours on a rigorous coffee base, in a space built around warm light."],
  ["Mission", "To make the quiet part of the day feel special — with drinks that surprise, service that’s unhurried, and standards that travel."],
  ["Vision", "A recognisable international café brand, grown carefully: first proven in one location, then partnered and licensed only when the operations are tested."],
  ["Philosophy", "Slow down, glow up. Good things — coffee, light, conversation — improve when you stop rushing them."],
];
const personality = ["Warm", "Assured", "Curious", "Unhurried", "Generous", "Precise"];
const compare = [
  ["Global chains", "Consistent and convenient, but flavour-generic and impersonal.", "Distinct recipes, warmer ritual, a design people want to photograph."],
  ["Third-wave specialty cafés", "Excellent coffee, often austere and intimidating.", "Same coffee seriousness with a welcoming, flavour-led menu."],
  ["Trend-led bubble-tea/dessert brands", "Fun and viral, light on coffee craft.", "Trend-aware flavours (ube, pandan) built on real espresso technique."],
];

export default function About() {
  return (
    <>
      <PageHero eyebrow="About the brand" title={<>A new café, <em>carefully imagined.</em></>}>The strategy behind Aurevo — and how we chose the name.</PageHero>
      <section className="wrap py-20">
        <div className="grid gap-px overflow-hidden rounded-3xl bg-night/10 md:grid-cols-2">
          {pillars.map(([h, b]) => <Reveal key={h} className="bg-crema p-8 md:p-10"><h2 className="eyebrow text-ember">{h}</h2><p className="mt-4 font-display text-3xl leading-snug">{b}</p></Reveal>)}
        </div>
      </section>
      <section className="bg-night text-crema"><div className="wrap grid gap-12 py-20 lg:grid-cols-2">
        <div><SectionHead eyebrow="Personality" title="If Aurevo were a person…" /><ul className="mt-8 flex flex-wrap gap-3">{personality.map((t) => <li key={t} className="rounded-full border border-aurum/50 px-5 py-2 font-display text-xl text-aurum">{t}</li>)}</ul>
          <p className="mt-8 text-oat">Voice: short sentences, sensory words, a little poetry, never pushy. We say “we’d pour” and “proposed” — not “world’s best”. Honest about what’s tested.</p></div>
        <ul className="grid gap-5">{values.map((v) => <li key={v.title} className="border-b border-crema/15 pb-5"><h3 className="font-display text-2xl text-aurum">{v.title}</h3><p className="mt-1 text-oat">{v.body}</p></li>)}</ul>
      </div></section>
      <section className="wrap py-20">
        <SectionHead eyebrow="Audience" title="Who we’re designing for" />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{personas.map((p) => (
          <li key={p.name} className="rounded-2xl border border-night/10 bg-crema-2 p-6"><p className="font-display text-3xl">{p.name}</p><p className="eyebrow mt-1 text-ember">{p.role}</p><p className="mt-4 text-sm">{p.need}</p><p className="mt-3 text-xs text-smoke">Try: {p.hook}</p></li>))}</ul>
        <p className="mt-4 text-xs text-smoke">Personas are fictional planning archetypes, not research findings.</p>
      </section>
      <section className="bg-crema-2"><div className="wrap py-20">
        <SectionHead eyebrow="Competitive position" title="Where Aurevo sits" />
        <div className="mt-10 overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><caption className="sr-only">Competitive comparison</caption><thead><tr className="border-b border-night/20 text-smoke"><th className="py-3 pr-4 font-semibold">Competitor type</th><th className="py-3 pr-4 font-semibold">Their strength / gap</th><th className="py-3 font-semibold">Aurevo’s angle</th></tr></thead><tbody>{compare.map(([a, b, c]) => <tr key={a} className="border-b border-night/10 align-top"><th scope="row" className="py-4 pr-4 font-display text-xl font-normal">{a}</th><td className="py-4 pr-4">{b}</td><td className="py-4">{c}</td></tr>)}</tbody></table></div>
      </div></section>
      <section className="wrap py-20">
        <SectionHead eyebrow="Naming" title="How we chose “Aurevo”">Six names were evaluated for pronunciation, story, international reach and obvious conflicts found through web search.</SectionHead>
        <ul className="mt-10 grid gap-4">{nameShortlist.map((n) => (
          <li key={n.name} className={`grid gap-2 rounded-2xl border p-5 sm:grid-cols-[10rem_5rem_1fr] sm:items-baseline ${n.verdict === "Chosen" ? "border-aurum bg-aurum/10" : "border-night/10"}`}>
            <span className="font-display text-3xl">{n.name}</span><span className="text-sm font-semibold">{n.score}/10 · {n.verdict}</span><span className="text-sm text-smoke">{n.note}</span></li>))}</ul>
        <div className="mt-8"><Notice><strong>Not a trademark clearance.</strong> “{brand.name}” has only been checked through general web search. An official trademark search (and legal advice) in each target country is required before any commercial use, registration or franchise offer.</Notice></div>
      </section>
    </>
  );
}
