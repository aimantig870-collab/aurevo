"use client";
import { useEffect, useRef, type ReactNode } from "react";

/** Fades content in once when scrolled into view. Respects reduced motion via CSS. */
export function Reveal({ children, delay = 0, className = "", as: Tag = "div" }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "li" | "section" }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { el.classList.add("in"); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Any = Tag as "div";
  return <Any ref={ref} data-reveal className={className} style={{ "--d": `${delay}ms` } as React.CSSProperties}>{children}</Any>;
}
