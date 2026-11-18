// Shared SVG building blocks for brand art. Text-free logo paths so logos render identically everywhere.
import { NAME } from "./brand-config.mjs";
export const C = {
  night: "#1B120D", crema: "#F4EBDD", aurum: "#C9873A", ember: "#A4492B",
  cardamom: "#6E7A5A", oat: "#D9C6A8", rose: "#D9A79A", smoke: "#6B5C50",
};

// Custom monoline geometric alphabet on a 100-tall grid: { w: advance width, d: path }.
// Any brand name can be set in config; letters outside A–Z are ignored.
const L = {
  A: { w: 70, d: "M0 100 L35 0 L70 100 M12 66 H58" },
  B: { w: 52, d: "M0 0 V100 M0 0 H26 A23 23 0 0 1 26 46 H0 M26 46 A27 27 0 0 1 26 100 H0" },
  C: { w: 60, d: "M60 22 C52 6 38 0 30 0 C12 0 0 20 0 50 C0 80 12 100 30 100 C38 100 52 94 60 78" },
  D: { w: 58, d: "M0 0 V100 H18 A40 50 0 0 0 18 0 Z" },
  E: { w: 52, d: "M52 0 H0 V100 H52 M0 50 H44" },
  F: { w: 50, d: "M50 0 H0 V100 M0 48 H42" },
  G: { w: 64, d: "M62 22 C54 6 40 0 32 0 C14 0 0 20 0 50 C0 80 14 100 32 100 C50 100 64 84 64 56 H34" },
  H: { w: 60, d: "M0 0 V100 M60 0 V100 M0 50 H60" },
  I: { w: 0, d: "M0 0 V100" },
  J: { w: 44, d: "M44 0 V70 A22 30 0 0 1 0 70" },
  K: { w: 56, d: "M0 0 V100 M56 0 L0 58 M18 40 L56 100" },
  L: { w: 46, d: "M0 0 V100 H46" },
  M: { w: 80, d: "M0 100 V0 L40 70 L80 0 V100" },
  N: { w: 60, d: "M0 100 V0 L60 100 V0" },
  O: { w: 100, d: "M50 0 A50 50 0 1 1 49.99 0 Z" },
  P: { w: 52, d: "M0 100 V0 H26 A25 25 0 0 1 26 50 H0" },
  Q: { w: 64, d: "M32 0 C12 0 0 20 0 50 C0 80 12 100 32 100 C52 100 64 80 64 50 C64 20 52 0 32 0 Z M40 74 L66 108" },
  R: { w: 58, d: "M0 100 V0 H30 A24 24 0 0 1 30 48 H0 M30 48 L58 100" },
  S: { w: 54, d: "M54 18 C48 6 38 0 27 0 C10 0 2 12 2 26 C2 40 14 46 27 50 C40 54 54 60 54 74 C54 88 44 100 27 100 C14 100 4 94 0 80" },
  T: { w: 60, d: "M0 0 H60 M30 0 V100" },
  U: { w: 62, d: "M0 0 V62 A31 31 0 0 0 62 62 V0" },
  V: { w: 70, d: "M0 0 L35 100 L70 0" },
  W: { w: 96, d: "M0 0 L24 100 L48 30 L72 100 L96 0" },
  X: { w: 60, d: "M0 0 L60 100 M60 0 L0 100" },
  Y: { w: 60, d: "M0 0 L30 52 L60 0 M30 52 V100" },
  Z: { w: 54, d: "M0 0 H54 L0 100 H54" },
};

/** Logotype markup for `name`. The LAST "O" (if any) becomes the sun resting on the horizon. */
export function wordmark({ name = NAME, stroke = C.night, sun = C.aurum, weight = 9, gap = 22 } = {}) {
  const word = [...name.toUpperCase()].filter((ch) => ch === " " || L[ch]);
  const lastO = word.lastIndexOf("O");
  let x = 0;
  let out = "";
  word.forEach((ch, i) => {
    if (ch === " ") { x += 40; return; }
    const g = L[ch];
    if (ch === "O" && i === lastO) {
      out += `<g transform="translate(${x} 0)"><circle cx="50" cy="50" r="46" fill="none" stroke="${stroke}" stroke-width="${weight}"/><path d="M4 62 H96" stroke="${sun}" stroke-width="${weight}" stroke-linecap="butt"/><path d="M22 62 A28 28 0 0 1 78 62 Z" fill="${sun}"/></g>`;
    } else if (ch === "O") {
      out += `<circle transform="translate(${x} 0)" cx="50" cy="50" r="46" fill="none" stroke="${stroke}" stroke-width="${weight}"/>`;
    } else {
      out += `<path transform="translate(${x} 0)" d="${g.d}" fill="none" stroke="${stroke}" stroke-width="${weight}" stroke-linejoin="miter" stroke-linecap="butt"/>`;
    }
    x += g.w + (i < word.length - 1 ? gap : 0);
  });
  return { markup: out, width: Math.max(x, 1), height: 100 };
}

/** The Aurevo symbol: sun rising from a cup rim. */
export function symbol({ ring = C.night, sun = C.aurum, bg = null, s = 100 } = {}) {
  return `<g transform="scale(${s / 100})">${bg ? `<circle cx="50" cy="50" r="50" fill="${bg}"/>` : ""}<circle cx="50" cy="50" r="42" fill="none" stroke="${ring}" stroke-width="5"/><path d="M26 58 A24 24 0 0 1 74 58 Z" fill="${sun}"/><path d="M20 58 H80 V62 A22 22 0 0 1 58 84 H42 A22 22 0 0 1 20 62 Z" fill="${ring}"/></g>`;
}

/** Monogram: the brand initial with a sun dot. */
export function monogram({ ring = C.night, sun = C.aurum, s = 100, initial = NAME[0] ?? "A" } = {}) {
  const g = L[initial.toUpperCase()] ?? L.A;
  const k = 64 / 100; // letter height 64
  const w = g.w * k;
  return `<g transform="scale(${s / 100})"><g transform="translate(${50 - w / 2} 24) scale(${k})"><path d="${g.d}" fill="none" stroke="${ring}" stroke-width="12"/></g><circle cx="${50 + w / 2 + 2}" cy="20" r="7" fill="${sun}"/></g>`;
}

export const svg = (w, h, body, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">${bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : ""}${body}</svg>`;

export const logoGroup = (opts, x, y, scale) => {
  const w = wordmark(opts);
  return { g: `<g transform="translate(${x} ${y}) scale(${scale})">${w.markup}</g>`, w: w.width * scale, h: w.height * scale };
};

/** Repeating sun-ray pattern tile (used on napkins/bags). */
export const patternDefs = (id, color, bg, size = 60) =>
  `<pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse"><rect width="${size}" height="${size}" fill="${bg}"/><path d="M${size * 0.2} ${size * 0.62} A${size * 0.3} ${size * 0.3} 0 0 1 ${size * 0.8} ${size * 0.62} Z" fill="${color}" opacity="0.9"/><path d="M${size * 0.12} ${size * 0.62} H${size * 0.88}" stroke="${color}" stroke-width="2"/><path d="M${size * 0.5} ${size * 0.1} V${size * 0.2} M${size * 0.22} ${size * 0.2} L${size * 0.28} ${size * 0.27} M${size * 0.78} ${size * 0.2} L${size * 0.72} ${size * 0.27}" stroke="${color}" stroke-width="2" stroke-linecap="round"/></pattern>`;
