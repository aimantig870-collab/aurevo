import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import { PageHero, SectionHead } from "@/components/ui";
import { ContactForm } from "@/components/inquiry-forms";

export const metadata: Metadata = { title: "Contact Us", description: "Get in touch with the Aurevo team." };

export default async function Contact() {
  const s = await getSettings();
  return (
    <>
      <PageHero eyebrow="Contact" title={<>Say <em>hello.</em></>}>Questions, press, ideas — we read everything.</PageHero>
      <section className="wrap grid gap-14 py-20 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHead eyebrow="Reach us" title="We’re easy to find." />
          <dl className="mt-8 grid gap-5 text-sm">
            <div><dt className="eyebrow text-ember">General</dt><dd className="mt-1"><a className="underline underline-offset-4" href={`mailto:${s.contact_email}`}>{s.contact_email}</a></dd></div>
            <div><dt className="eyebrow text-ember">Partnerships</dt><dd className="mt-1"><a className="underline underline-offset-4" href={`mailto:${s.partner_email}`}>{s.partner_email}</a></dd></div>
            <div><dt className="eyebrow text-ember">Visit</dt><dd className="mt-1 text-smoke">There is no physical café yet. Aurevo currently exists as a digital concept.</dd></div>
          </dl>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
