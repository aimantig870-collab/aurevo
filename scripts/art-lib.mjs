// Shared SVG building blocks for Aurevo brand art. Text-free logo paths so logos render identically everywhere.
export const C = {
  night: "#1B120D", crema: "#F4EBDD", aurum: "#C9873A", ember: "#A4492B",
  cardamom: "#6E7A5A", oat: "#D9C6A8", rose: "#D9A79A", smoke: "#6B5C50",
};

// Monoline geometric letters on a 100-tall grid. Each returns {w, d} (path data, local coords).
// "O" is replaced by the sun mark (circle + horizon) in the logotype.
const L = {
  A: { w: 70, d: "M0 100 L35 0 L70 100 M12 66 H58" },
  U: { w: 62, d: "M0 0 V62 A31 31 0 0 0 62 62 V0" },
  R: { w: 58, d: "M0 100 V0 H30 A24 24 0 0 1 30 48 H0 M30 48 L58 100" },
  E: { w: 52, d: "M52 0 H0 V100 H52 M0 50 H44" },
  V: { w: 70, d: "M0 0 L35 100 L70 0" },
  O: { w: 100, d: "M50 0 A50 50 0 1 1 49.99 0 Z" },
};

/** Returns SVG markup (a <g>) for the AUREVO logotype and its pixel size. */
export function wordmark({ stroke = C.night, sun = C.aurum, weight = 9, gap = 22 } = {}) {
  const word = ["A", "U", "R", "E", "V", "O"];
  let x = 0;
  let out = "";
  word.forEach((ch, i) => {
    const g = L[ch];
    if (ch === "O") {
      out += `<g transform="translate(${x} 0)"><circle cx="50" cy="50" r="46" fill="none" stroke="${stroke}" stroke-width="${weight}"/><path d="M4 62 H96" stroke="${sun}" stroke-width="${weight}" stroke-linecap="butt"/><path d="M22 62 A28 28 0 0 1 78 62 Z" fill="${sun}"/></g>`;
    } else {
      out += `<path transform="translate(${x} 0)" d="${g.d}" fill="none" stroke="${stroke}" stroke-width="${weight}" stroke-linejoin="miter" stroke-linecap="butt"/>`;
    }
    x += g.w + (i < word.length - 1 ? gap : 0);
  });
  return { markup: out, width: x, height: 100 };
}

/** The Aurevo symbol: sun rising from a cup rim. */
export function symbol({ ring = C.night, sun = C.aurum, bg = null, s = 100 } = {}) {
  return `<g transform="scale(${s / 100})">${bg ? `<circle cx="50" cy="50" r="50" fill="${bg}"/>` : ""}<circle cx="50" cy="50" r="42" fill="none" stroke="${ring}" stroke-width="5"/><path d="M26 58 A24 24 0 0 1 74 58 Z" fill="${sun}"/><path d="M20 58 H80 V62 A22 22 0 0 1 58 84 H42 A22 22 0 0 1 20 62 Z" fill="${ring}"/></g>`;
}

/** Monogram: A with a sun dot. */
export function monogram({ ring = C.night, sun = C.aurum, s = 100 } = {}) {
  return `<g transform="scale(${s / 100})"><path d="M18 88 L50 14 L82 88 M30 62 H70" fill="none" stroke="${ring}" stroke-width="8"/><circle cx="50" cy="40" r="7" fill="${sun}"/></g>`;
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
