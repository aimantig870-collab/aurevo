"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/data/brand";
import { Logo } from "@/components/logo";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const path = usePathname();
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 ${solid || open ? "bg-crema/95 shadow-[0_1px_0_rgba(27,18,13,0.08)] backdrop-blur" : "bg-crema/70 backdrop-blur-sm"}`}>
      <div className="wrap flex h-[72px] items-center justify-between">
        <Logo />
        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} aria-current={path.startsWith(n.href) ? "page" : undefined} className={`text-sm font-medium transition-colors hover:text-ember ${path.startsWith(n.href) ? "text-ember" : ""}`}>{n.label}</Link>
          ))}
          <Link href="/partnership" className="btn btn-dark !py-2.5 !text-sm">Partner with us</Link>
        </nav>
        <button type="button" className="grid h-11 w-11 place-items-center rounded-full border border-night/20 lg:hidden" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
          <span className="relative block h-3 w-5"><span className={`absolute left-0 top-0 h-0.5 w-5 bg-night transition ${open ? "translate-y-[5px] rotate-45" : ""}`} /><span className={`absolute left-0 top-[10px] h-0.5 w-5 bg-night transition ${open ? "-translate-y-[5px] -rotate-45" : ""}`} /></span>
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="wrap border-t border-night/10 pb-6 pt-2 lg:hidden">
          <ul className="grid">
            {[{ href: "/", label: "Home" }, ...nav, { href: "/gallery", label: "Gallery" }, { href: "/partnership", label: "Partnership" }].map((n) => (
              <li key={n.href}><Link href={n.href} onClick={() => setOpen(false)} className="block border-b border-night/10 py-3.5 font-display text-2xl">{n.label}</Link></li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
