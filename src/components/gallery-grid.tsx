"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { SiteGalleryItem } from "@/lib/data";

const tags = [["all", "All"], ["drinks", "Drinks"], ["brand", "Brand"], ["cafe", "Café"], ["events", "Events"]];

export function GalleryGrid({ items }: { items: SiteGalleryItem[] }) {
  const [tag, setTag] = useState("all");
  const [open, setOpen] = useState<SiteGalleryItem | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const shown = items.filter((i) => tag === "all" || i.tag === tag);
  const present = tags.filter(([t]) => t === "all" || items.some((i) => i.tag === t));
  useEffect(() => { if (open) dlg.current?.showModal(); else dlg.current?.close(); }, [open]);
  return (
    <section className="wrap py-14">
      <div role="group" aria-label="Filter gallery" className="flex flex-wrap gap-2">
        {present.map(([t, l]) => <button key={t} aria-pressed={tag === t} onClick={() => setTag(t)} className={`rounded-full border px-4 py-2 text-sm font-medium ${tag === t ? "border-night bg-night text-crema" : "border-night/20"}`}>{l}</button>)}
      </div>
      <ul className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>li]:mb-5">
        {shown.map((i) => (
          <li key={i.id} className="break-inside-avoid">
            <button onClick={() => setOpen(i)} className="group block w-full overflow-hidden rounded-2xl bg-oat text-left" aria-label={`Open ${i.title}`}>
              <Image src={i.image} alt={i.caption || i.title} width={800} height={1000} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="h-auto w-full transition duration-700 group-hover:scale-[1.03]" />
            </button>
            <p className="mt-2 text-sm"><span className="font-semibold">{i.title}</span> <span className="text-smoke">— {i.caption}</span></p>
          </li>
        ))}
      </ul>
      <dialog ref={dlg} onClose={() => setOpen(null)} onClick={(e) => { if (e.target === dlg.current) setOpen(null); }} className="m-auto max-h-[92vh] w-[min(92vw,900px)] overflow-auto rounded-2xl bg-crema p-0 backdrop:bg-night/80" aria-label={open?.title}>
        {open && (<div className="relative"><Image src={open.image} alt={open.caption || open.title} width={1200} height={1000} className="h-auto w-full" /><div className="flex items-center justify-between gap-4 p-4"><p><span className="font-display text-2xl">{open.title}</span> <span className="text-sm text-smoke">{open.caption}</span></p><button onClick={() => setOpen(null)} className="btn btn-dark !py-2">Close</button></div></div>)}
      </dialog>
    </section>
  );
}
