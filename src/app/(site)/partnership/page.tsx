import type { Metadata } from "next";
import { PageHero, SectionHead } from "@/components/ui";
import { PartnershipForm } from "@/components/inquiry-forms";

export const metadata: Metadata = { title: "Partnership", description: "Partner with Aurevo: café partnerships, signature beverage licensing, branded collaborations and supplier relationships." };

const types = [
  ["Café partnerships", "Feature Aurevo signatures and design elements inside an existing café."],
  ["Beverage licensing", "License individual recipes and the Aurevo name for your menu (subject to legal agreements)."],
  ["Brand collaborations", "Co-created packaged products — beans, cold brew, syrups, merchandise."],
  ["Suppliers & roasters", "We’re seeking roasters, dairies and pantry producers for the pilot menu."],
];

export default function Partnership() {
  return (
    <>
      <PageHero eyebrow="Partnership" title={<>Let’s make something <em>golden.</em></>}>Early-stage brands move fast and keep promises small. Tell us what you’d like to explore.</PageHero>
      <section className="wrap py-20"><ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{types.map(([h, b]) => <li key={h} className="rounded-2xl border border-night/10 bg-crema-2 p-6"><h2 className="font-display text-3xl">{h}</h2><p className="mt-3 text-sm text-smoke">{b}</p></li>)}</ul></section>
      <section className="wrap grid gap-14 pb-24 lg:grid-cols-[0.8fr_1.2fr]">
        <div><SectionHead eyebrow="Start here" title="Send a partnership request.">We’ll reply within three business days. Aurevo is at concept stage — we’ll tell you plainly what is and isn’t available today.</SectionHead></div>
        <PartnershipForm />
      </section>
    </>
  );
}
