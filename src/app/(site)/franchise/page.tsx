import type { Metadata } from "next";
import { Notice, PageHero, SectionHead } from "@/components/ui";
import { FranchiseForm } from "@/components/inquiry-forms";

export const metadata: Metadata = { title: "Franchise Opportunities", description: "The proposed Aurevo franchise concept — business model, operating model and the work required before any franchise is offered. Concept stage." };

const model = [
  ["Brand concept", "A premium, flavour-led café with a documented menu, design kit and training system."],
  ["Business model (proposed)", "Franchisee funds and operates a location; Aurevo would provide brand, recipes, supply guidance, training and marketing. Fee structure is not set."],
  ["Operating model (proposed)", "Formats under study: flagship café (80–120 m²), compact kiosk (15–30 m²) and shop-in-shop beverage licence."],
  ["Partnership advantages (intended)", "Distinct IP and recipes, a complete visual identity, standard operating procedures, central marketing assets."],
];
const invest = ["Leasehold improvements & fit-out", "Equipment (espresso, grinders, refrigeration, POS)", "Initial inventory & smallwares", "Licences, permits & legal", "Pre-opening staffing & training", "Opening marketing", "Working capital reserve", "Franchise / licence fees (to be defined)"];
const gates = [
  "Pilot café operated by Aurevo with real sales data",
  "Recipes bench-tested; costs verified with supplier quotes",
  "Trademark searches and registration in target countries",
  "Franchise disclosure documents and agreement drafted by qualified counsel, per country",
  "Operations manual and training programme validated in the pilot",
  "Audited unit economics",
];

export default function Franchise() {
  return (
    <>
      <PageHero eyebrow="Franchise opportunities" title={<>A franchise concept, <em>honestly framed.</em></>}>Here is what we’re designing — and everything that must happen before it’s real.</PageHero>
      <div className="wrap pt-10"><Notice><strong>No franchise is currently for sale.</strong> Aurevo has no operating location, no validated unit economics and no franchise disclosure documents. This page describes a proposed concept for discussion with potential partners. Nothing here is an offer, an earnings claim, or legal or financial advice.</Notice></div>
      <section className="wrap py-20"><SectionHead eyebrow="Proposed concept" title="What a future partnership could look like." />
        <dl className="mt-10 grid gap-px overflow-hidden rounded-3xl bg-night/10 md:grid-cols-2">{model.map(([k, v]) => <div key={k} className="bg-crema p-8"><dt className="font-display text-3xl">{k}</dt><dd className="mt-3 text-smoke">{v}</dd></div>)}</dl></section>
      <section className="bg-night text-crema"><div className="wrap grid gap-14 py-20 lg:grid-cols-2">
        <div><SectionHead eyebrow="Investment categories" title="Where capital would go." /><ul className="mt-8 grid gap-3">{invest.map((i) => <li key={i} className="flex gap-3 border-b border-crema/15 pb-3 text-oat"><span className="text-aurum">◆</span>{i}</li>)}</ul><p className="mt-5 text-sm text-oat">Amounts are deliberately not published: they will depend on market, format and verified quotes.</p></div>
        <div><SectionHead eyebrow="Readiness gates" title="Before we say “franchise available”." /><ol className="mt-8 grid gap-3">{gates.map((g, i) => <li key={g} className="flex gap-4 border-b border-crema/15 pb-3 text-oat"><span className="font-display text-2xl text-aurum">{i + 1}</span>{g}</li>)}</ol></div>
      </div></section>
      <section className="wrap grid gap-14 py-20 lg:grid-cols-[0.8fr_1.2fr]" id="register">
        <div><SectionHead eyebrow="Register interest" title="Join the early conversation.">Interested parties will be contacted as the concept matures. Expressing interest creates no obligation on either side.</SectionHead></div>
        <FranchiseForm />
      </section>
    </>
  );
}
