import Link from "next/link";
import { Logo } from "@/components/logo";
import type { getSettings } from "@/lib/data";

type S = Awaited<ReturnType<typeof getSettings>>;

export function SiteFooter({ s }: { s: S }) {
  const cols = [
    { h: "Explore", l: [["/menu", "Menu"], ["/signature", "Signature drinks"], ["/gallery", "Gallery"], ["/virtual-cafe", "Virtual café"]] },
    { h: "Brand", l: [["/about", "About the brand"], ["/our-story", "Our story"], ["/brand", "Brand identity"]] },
    { h: "Business", l: [["/franchise", "Franchise concept"], ["/partnership", "Partnership"], ["/contact", "Contact"]] },
  ];
  const social = [["Instagram", s.instagram_url], ["TikTok", s.tiktok_url], ["Facebook", s.facebook_url], ["Pinterest", s.pinterest_url]];
  return (
    <footer className="bg-night text-crema">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo light className="h-10 w-auto" />
          <p className="mt-5 max-w-xs font-display text-2xl italic text-oat">{s.slogan}</p>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-oat">
            {social.map(([n, u]) => <li key={n}><a className="underline-offset-4 hover:text-aurum hover:underline" href={u} target="_blank" rel="noopener noreferrer">{n}</a></li>)}
          </ul>
        </div>
        {cols.map((c) => (
          <nav key={c.h} aria-label={c.h}>
            <h2 className="eyebrow text-aurum">{c.h}</h2>
            <ul className="mt-4 grid gap-2.5 text-sm">{c.l.map(([h, t]) => <li key={h}><Link className="text-oat hover:text-crema" href={h}>{t}</Link></li>)}</ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-crema/10">
        <div className="wrap grid gap-3 py-6 text-xs leading-relaxed text-oat md:grid-cols-[1fr_auto]">
          <p><strong className="text-crema">Concept stage.</strong> {s.stage_notice} All recipes are proposed and untested; prices and financial figures are estimates. Illustrations are concept art, not photographs. Name availability is not a trademark clearance.</p>
          <p>© {new Date().getFullYear()} Aurevo concept. <Link href="/admin" className="underline-offset-4 hover:underline">Staff</Link></p>
        </div>
      </div>
    </footer>
  );
}
