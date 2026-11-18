// Generates all Aurevo static art (logos, drink illustrations, mockups, café scenes) into public/art.
// Run: node scripts/generate-art.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { C, wordmark, symbol, monogram, svg, logoGroup, patternDefs } from "./art-lib.mjs";
import { products } from "../src/data/menu.ts";
import { NAME, DESCRIPTOR, SLOGAN, DOMAIN } from "./brand-config.mjs";
import { ar as arData } from "../src/data/menu.ar.ts";
const AR = process.env.BRAND_LANG === "ar";
const arName = (slug) => arData[slug]?.name ?? slug;

const OUT = process.env.ART_OUT ?? new URL("../public/art/", import.meta.url).pathname;
const out = (p, s) => {
  const f = new URL(`file://${OUT.replace(/\/$/, "")}/${p}`);
  mkdirSync(new URL(".", f), { recursive: true });
  if (AR) s = s.replace("<svg ", '<svg direction="ltr" ').replace(/ letter-spacing="[^"]*"/g, "").replace(/<text x="40" y="970"[^>]*>[^<]*<\/text>/g, "");
  writeFileSync(f, s);
};
const SERIF = AR ? "Cairo, 'Noto Sans Arabic', sans-serif" : "Georgia, 'Times New Roman', serif";
const SANS = AR ? "Cairo, 'Noto Sans Arabic', sans-serif" : "'Helvetica Neue', Arial, sans-serif";
const shade = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v + amt * (amt < 0 ? v : 255 - v))));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map(f).map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

/* ------------------------------------------------------------------ logos */
{
  const w = wordmark({});
  const sym = symbol({});
  out("logo/logo-primary.svg", svg(680, 160, `<g transform="translate(20 30)">${symbol({ s: 100 })}</g><g transform="translate(150 55) scale(0.5)">${w.markup}</g>`));
  const wd = wordmark({ stroke: C.crema });
  out("logo/logo-primary-light.svg", svg(680, 160, `<g transform="translate(20 30)">${symbol({ ring: C.crema })}</g><g transform="translate(150 55) scale(0.5)">${wd.markup}</g>`));
  // secondary: stacked
  out("logo/logo-secondary.svg", svg(400, 420, `<g transform="translate(150 40)">${symbol({ s: 100 })}</g><g transform="translate(${(400 - w.width * 0.42) / 2} 190) scale(0.42)">${w.markup}</g><text x="200" y="300" text-anchor="middle" font-family="${SANS}" font-size="12" letter-spacing="5" fill="${C.smoke}">${DESCRIPTOR.toUpperCase()}</text><path d="M120 330 H280" stroke="${C.aurum}" stroke-width="2"/>`, C.crema));
  out("logo/logo-secondary-dark.svg", svg(400, 420, `<g transform="translate(150 40)">${symbol({ ring: C.crema, s: 100 })}</g><g transform="translate(${(400 - w.width * 0.42) / 2} 190) scale(0.42)">${wd.markup}</g><text x="200" y="300" text-anchor="middle" font-family="${SANS}" font-size="12" letter-spacing="5" fill="${C.oat}">${DESCRIPTOR.toUpperCase()}</text><path d="M120 330 H280" stroke="${C.aurum}" stroke-width="2"/>`, C.night));
  out("logo/symbol.svg", svg(100, 100, sym));
  out("logo/symbol-light.svg", svg(100, 100, symbol({ ring: C.crema })));
  out("logo/monogram.svg", svg(120, 120, `<circle cx="60" cy="60" r="58" fill="${C.night}"/><g transform="translate(10 10) scale(0.8)">${monogram({ ring: C.crema })}</g>`));
  out("logo/wordmark.svg", svg(w.width + 20, 120, `<g transform="translate(10 10)">${w.markup}</g>`));
  out("logo/wordmark-light.svg", svg(w.width + 20, 120, `<g transform="translate(10 10)">${wd.markup}</g>`));
  // app icon
  if (!process.env.ART_OUT) writeFileSync(new URL("../src/app/icon.svg", import.meta.url), svg(100, 100, symbol({ ring: C.crema, bg: C.night, s: 100 })));
}

/* ------------------------------------------------------------------ icons */
{
  const stroke = `fill="none" stroke="${C.night}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"`;
  const icons = {
    cup: `<path d="M12 22 H44 V40 A10 10 0 0 1 34 50 H22 A10 10 0 0 1 12 40 Z M44 26 H50 A5 5 0 0 1 50 38 H44 M20 12 V16 M28 10 V16 M36 12 V16" ${stroke}/>`,
    bean: `<ellipse cx="32" cy="32" rx="14" ry="22" transform="rotate(35 32 32)" ${stroke}/><path d="M22 20 C34 28 28 38 42 46" ${stroke}/>`,
    sun: `<path d="M14 40 A18 18 0 0 1 50 40 M8 46 H56 M32 8 V16 M12 20 L17 25 M52 20 L47 25" ${stroke}/>`,
    leaf: `<path d="M14 50 C10 24 30 10 52 12 C54 34 40 52 14 50 Z M14 50 L36 28" ${stroke}/>`,
    croissant: `<path d="M8 38 C12 22 24 16 32 16 C40 16 52 22 56 38 C48 36 44 40 40 44 C36 40 28 40 24 44 C20 40 16 36 8 38 Z M24 20 L28 40 M40 20 L36 40" ${stroke}/>`,
    pin: `<path d="M32 56 C20 40 14 32 14 24 A18 18 0 0 1 50 24 C50 32 44 40 32 56 Z" ${stroke}/><circle cx="32" cy="24" r="6" ${stroke}/>`,
    bag: `<path d="M14 20 H50 L52 54 H12 Z M24 20 V14 A8 8 0 0 1 40 14 V20" ${stroke}/>`,
    clock: `<circle cx="32" cy="32" r="22" ${stroke}/><path d="M32 18 V32 L42 38" ${stroke}/>`,
  };
  Object.assign(icons, {
    espresso: `<path d="M14 26 H40 V38 A10 10 0 0 1 30 48 H24 A10 10 0 0 1 14 38 Z M40 29 H45 A4 4 0 0 1 45 37 H40 M10 52 H46 M24 14 C22 18 26 20 24 24 M31 14 C29 18 33 20 31 24" ${stroke}/>`,
    americano: `<path d="M16 22 H44 L41 52 H19 Z M13 22 H47 M24 10 C21 14 27 17 24 21 M32 10 C29 14 35 17 32 21 M38 10 C35 14 41 17 38 21" ${stroke}/>`,
    cappuccino: `<path d="M10 28 H44 V38 A12 12 0 0 1 32 50 H22 A12 12 0 0 1 10 38 Z M44 31 H50 A5 5 0 0 1 50 41 H44 M10 28 C10 21 17 18 27 18 C37 18 44 21 44 28 M20 24 C24 22 30 22 34 24" ${stroke}/>`,
    latte: `<path d="M20 12 H44 L42 52 H22 Z M21 26 H43 M22 38 H42 M30 18 H34" ${stroke}/>`,
    mocha: `<path d="M12 24 H42 V38 A12 12 0 0 1 30 50 H24 A12 12 0 0 1 12 38 Z M42 28 H47 A4 4 0 0 1 47 36 H42 M50 14 H58 V22 H50 Z M54 14 V22 M50 18 H58" ${stroke}/>`,
    "cold-coffee": `<path d="M18 20 H46 L43 54 H21 Z M16 20 H48 M34 6 L38 20 M24 30 H40 M26 38 H38" ${stroke}/><rect x="26" y="40" width="8" height="8" rx="2" ${stroke}/>`,
    "iced-drinks": `<path d="M16 16 H48 L44 54 H20 Z M38 4 L34 16 M18 28 H46" ${stroke}/><circle cx="46" cy="22" r="8" ${stroke}/><path d="M46 14 V30 M38 22 H54" ${stroke}/>`,
    "signature-drinks": `<path d="M16 34 H42 V42 A10 10 0 0 1 32 52 H26 A10 10 0 0 1 16 42 Z M42 37 H46 A4 4 0 0 1 46 45 H42 M29 4 V14 M18 10 L22 17 M40 10 L36 17 M10 22 L18 24 M48 22 L40 24" ${stroke}/>`,
    "specialty-coffee": `<path d="M14 10 H50 M18 10 L28 32 H36 L46 10 M26 32 V40 M38 32 V40 M16 44 H48 V52 H16 Z" ${stroke}/>`,
    desserts: `<path d="M8 44 L52 44 L52 52 L8 52 Z M8 44 L16 22 L52 22 L52 44 M16 22 L30 14 L52 14 L52 22 M30 22 V44" ${stroke}/><circle cx="22" cy="12" r="3" ${stroke}/>`,
    bakery: icons.croissant,
  });
  for (const [k, v] of Object.entries(icons)) out(`icons/${k}.svg`, svg(64, 64, v));
}

/* ------------------------------------------------------------------ drinks */
function drinkArt(p) {
  const a = p.art;
  const W = 800, H = 1000;
  const cx = 400;
  const bg = a.bg;
  const dark = shade(bg, -0.25);
  const light = shade(bg, 0.35);
  let b = `<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${bg}"/></linearGradient><radialGradient id="sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff" stop-opacity="0.65"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><linearGradient id="table" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dark}"/><stop offset="1" stop-color="${shade(dark, -0.3)}"/></linearGradient><linearGradient id="glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0.55"/><stop offset="0.25" stop-color="#fff" stop-opacity="0.08"/><stop offset="0.8" stop-color="#fff" stop-opacity="0.1"/><stop offset="1" stop-color="#fff" stop-opacity="0.45"/></linearGradient></defs>`;
  b += `<rect width="${W}" height="${H}" fill="url(#bg)"/><circle cx="${cx}" cy="470" r="420" fill="url(#sun)"/>`;
  // brand sun arc
  b += `<path d="M120 640 A280 280 0 0 1 680 640 Z" fill="${shade(bg, 0.12)}" opacity="0.55"/>`;
  b += `<rect y="740" width="${W}" height="260" fill="url(#table)"/><ellipse cx="${cx}" cy="775" rx="270" ry="38" fill="#000" opacity="0.18"/>`;
  const tableY = 770;
  let topY = 460; // y of vessel top centre (for garnish)
  const layers = a.layers;

  const liquid = (x0, x1, yTop, yBot, clip) => {
    const n = layers.length;
    const h = (yBot - yTop) / n;
    return layers.map((c, i) => `<rect x="${x0 - 5}" y="${yBot - (i + 1) * h}" width="${x1 - x0 + 10}" height="${h + 1}" fill="${c}" ${clip ? `clip-path="url(#${clip})"` : ""}/>`).join("");
  };

  if (a.vessel === "cup") {
    topY = 520;
    b += `<ellipse cx="${cx}" cy="${tableY}" rx="270" ry="46" fill="${C.crema}"/><ellipse cx="${cx}" cy="${tableY - 6}" rx="240" ry="36" fill="${shade(C.crema, -0.06)}"/>`;
    b += `<path d="M560 560 C660 540 680 660 590 690" fill="none" stroke="${C.crema}" stroke-width="30" stroke-linecap="round"/>`;
    b += `<path d="M230 520 H570 C570 660 540 745 400 750 C260 745 230 660 230 520 Z" fill="${C.crema}"/><path d="M570 520 C570 660 540 745 400 750 C500 740 520 640 520 520 Z" fill="#000" opacity="0.08"/>`;
    b += `<ellipse cx="${cx}" cy="520" rx="170" ry="44" fill="${shade(C.crema, -0.1)}"/><ellipse cx="${cx}" cy="524" rx="150" ry="36" fill="${layers.at(-1)}"/>`;
    if (a.foam) b += `<ellipse cx="${cx}" cy="526" rx="128" ry="29" fill="${a.foam}"/><path d="M${cx} 508 C${cx - 42} 500 ${cx - 46} 530 ${cx} 546 C${cx + 46} 530 ${cx + 42} 500 ${cx} 508 Z" fill="${shade(a.foam, -0.18)}" opacity="0.8"/>`;
    b += `<rect x="256" y="640" width="288" height="6" rx="3" fill="${C.aurum}" opacity="0.85"/>`;
  } else if (a.vessel === "tall" || a.vessel === "glass" || a.vessel === "tulip") {
    const tall = a.vessel === "tall";
    const yT = tall ? 290 : a.vessel === "glass" ? 470 : 340;
    const yB = tableY - 10;
    const wt = tall ? 140 : a.vessel === "glass" ? 120 : 160;
    const wb = tall ? 105 : a.vessel === "glass" ? 100 : 40;
    topY = yT;
    const path = a.vessel === "tulip"
      ? `M${cx - wt} ${yT} C${cx - wt} ${yT + 200} ${cx - 50} ${yT + 270} ${cx - 14} ${yT + 290} V${yB - 24} C${cx - 14} ${yB - 10} ${cx - 90} ${yB - 12} ${cx - 120} ${yB} H${cx + 120} C${cx + 90} ${yB - 12} ${cx + 14} ${yB - 10} ${cx + 14} ${yB - 24} V${yT + 290} C${cx + 50} ${yT + 270} ${cx + wt} ${yT + 200} ${cx + wt} ${yT} Z`
      : `M${cx - wt} ${yT} L${cx - wb} ${yB} H${cx + wb} L${cx + wt} ${yT} Z`;
    const liqBot = a.vessel === "tulip" ? yT + 270 : yB - 8;
    b += `<defs><clipPath id="gc"><path d="${path}"/></clipPath></defs>`;
    b += `<g clip-path="url(#gc)">${liquid(cx - wt, cx + wt, yT + (a.foam ? 70 : 40), liqBot, null)}`;
    if (a.foam) b += `<rect x="${cx - wt}" y="${yT + 6}" width="${wt * 2}" height="70" fill="${a.foam}"/><path d="M${cx - wt} ${yT + 76} q${wt / 4} 18 ${wt / 2} 4 t${wt / 2} 4 t${wt / 2} 4 t${wt / 2} -2" fill="none" stroke="${shade(a.foam, -0.15)}" stroke-width="3"/>`;
    if (a.ice) {
      const cubes = [[-70, 120, 34], [20, 100, 38], [-20, 190, 36], [60, 180, 32], [-80, 250, 36], [30, 290, 34], [-30, 340, 38]];
      b += cubes.map(([dx, dy, s], i) => `<rect x="${cx + dx}" y="${yT + dy}" width="${s * 1.5}" height="${s * 1.5}" rx="8" fill="#fff" opacity="0.28" transform="rotate(${i * 13 - 20} ${cx + dx + s} ${yT + dy + s})"/>`).join("");
    }
    b += `</g><path d="${path}" fill="url(#glass)" stroke="#fff" stroke-opacity="0.7" stroke-width="4"/>`;
    b += `<rect x="${cx + 70}" y="${yT - 150}" width="14" height="${yB - yT + 20}" rx="7" fill="${C.cardamom}" transform="rotate(8 ${cx + 70} ${yT})" opacity="0.9"/>`;
  } else {
    // plate
    topY = 600;
    b += `<ellipse cx="${cx}" cy="${tableY}" rx="290" ry="58" fill="${C.crema}"/><ellipse cx="${cx}" cy="${tableY - 4}" rx="220" ry="40" fill="${shade(C.crema, -0.05)}"/>`;
    b += `<path d="M230 ${tableY - 20} C240 ${tableY - 150} 560 ${tableY - 150} 570 ${tableY - 20} C520 ${tableY + 20} 280 ${tableY + 20} 230 ${tableY - 20} Z" fill="${layers[0]}"/><path d="M280 ${tableY - 90} C340 ${tableY - 130} 460 ${tableY - 130} 520 ${tableY - 90}" fill="none" stroke="#fff" stroke-opacity="0.25" stroke-width="10" stroke-linecap="round"/>`;
  }

  // garnish
  const g = a.garnish;
  const gy = topY;
  if (g === "saffron") b += [-40, 0, 40].map((d, i) => `<path d="M${cx + d} ${gy + 4} q${10 + i * 6} -26 ${30 - i * 12} -14" fill="none" stroke="#c0392b" stroke-width="4" stroke-linecap="round"/>`).join("") + `<circle cx="${cx - 50}" cy="${gy + 12}" r="3" fill="#9bab55"/><circle cx="${cx + 56}" cy="${gy + 14}" r="3" fill="#9bab55"/>`;
  if (g === "petals") b += [[-60, 12], [-20, 0], [30, 14], [70, 4], [0, 22]].map(([dx, dy], i) => `<ellipse cx="${cx + dx}" cy="${gy + dy + 20}" rx="14" ry="8" fill="${i % 2 ? "#e8a0b0" : "#c4566e"}" transform="rotate(${i * 38} ${cx + dx} ${gy + dy + 20})"/>`).join("");
  if (g === "leaf") b += `<path d="M${cx + 90} ${gy - 20} C${cx + 160} ${gy - 130} ${cx + 230} ${gy - 80} ${cx + 160} ${gy + 10} C${cx + 130} ${gy - 20} ${cx + 110} ${gy - 20} ${cx + 90} ${gy - 20} Z" fill="#5b8a3a"/><path d="M${cx + 98} ${gy - 18} L${cx + 190} ${gy - 70}" stroke="#3f6a26" stroke-width="3"/>` + [-40, 10, 55].map((d) => `<circle cx="${cx + d}" cy="${gy + 24}" r="5" fill="#f7efd9"/>`).join("");
  if (g === "wheel") b += `<g transform="translate(${cx + 95} ${gy + 6})"><circle r="46" fill="${C.aurum}"/><circle r="38" fill="#fbe6b0"/>${[0, 45, 90, 135].map((r) => `<line x1="0" y1="-38" x2="0" y2="38" stroke="${C.aurum}" stroke-width="3" transform="rotate(${r})"/>`).join("")}</g><path d="M${cx - 30} ${gy - 20} q10 -50 30 -30 M${cx - 10} ${gy - 20} q10 -40 26 -24" stroke="#5b8a3a" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  if (g === "nibs") b += Array.from({ length: 12 }, (_, i) => `<rect x="${cx - 70 + ((i * 37) % 140)}" y="${gy + 10 + ((i * 13) % 30)}" width="9" height="7" rx="2" fill="#2a1a12" transform="rotate(${i * 25} ${cx - 70 + ((i * 37) % 140)} ${gy + 14})"/>`).join("");
  if (g === "zest") b += `<path d="M${cx + 50} ${gy + 10} q40 -50 10 -70 q-30 -10 -24 20 q10 24 30 6" fill="none" stroke="#e8892b" stroke-width="7" stroke-linecap="round"/>`;
  if (g === "sesame") b += Array.from({ length: 24 }, (_, i) => `<ellipse cx="${cx - 90 + ((i * 53) % 180)}" cy="${gy + 14 + ((i * 29) % 26)}" rx="4" ry="2.5" fill="#f7efd9" transform="rotate(${i * 40} ${cx} ${gy})"/>`).join("");
  if (g === "almond") b += Array.from({ length: 9 }, (_, i) => `<path d="M${cx - 70 + i * 17} ${gy + 6 + ((i * 7) % 20)} q8 -12 18 -2 q-8 10 -18 2" fill="#e2c892" stroke="#a98254" stroke-width="1.5"/>`).join("");
  if (g === "cinnamon") b += `<rect x="${cx + 150}" y="${tableY - 24}" width="150" height="22" rx="11" fill="#8a4b24" transform="rotate(-12 ${cx + 220} ${tableY})"/><path d="M${cx + 300} ${tableY - 40} q-20 -50 10 -90 q30 -40 6 -90" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="10" stroke-linecap="round"/>`;
  if (g === "gelato") b += `<circle cx="${cx}" cy="${topY - 10}" r="40" fill="#f6ead0"/>` ;
  if (g === "crumb" || g === "flake") b += Array.from({ length: 14 }, (_, i) => `<circle cx="${cx - 70 + ((i * 41) % 140)}" cy="${gy + 14 + ((i * 17) % 26)}" r="${3 + (i % 3)}" fill="${g === "flake" ? "#fff" : shade(layers[0], 0.3)}"/>`).join("");

  // vessel highlight & label strip
  b += `<g transform="translate(40 40) scale(0.4)">${symbol({ ring: C.night })}</g>`;
  if (!AR) b += `<rect x="0" y="905" width="${W}" height="95" fill="${C.night}"/><text x="40" y="962" font-family="${SERIF}" font-size="38" fill="${C.crema}">${p.name.replace(/&/g, "&amp;")}</text><text x="${W - 40}" y="962" text-anchor="end" font-family="${SANS}" font-size="16" letter-spacing="4" fill="${C.aurum}">PROPOSED RECIPE</text>`;
  return svg(W, H, b);
}
products.forEach((p) => out(`drinks/${p.slug}.svg`, drinkArt(p)));

/* ------------------------------------------------------------------ mockups */
const mk = (name, w, h, bg, body) => out(`mockups/${name}.svg`, svg(w, h, body, bg));
const lw = (opts, x, y, scale) => logoGroup(opts, x, y, scale);
const shadow = (cx, y, rx) => `<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${rx * 0.12}" fill="#000" opacity="0.18"/>`;

// hot cup
{
  const l = lw({ stroke: C.crema }, 0, 0, 0.26);
  mk("hot-cup", 800, 1000, C.oat, `${shadow(400, 880, 190)}<path d="M240 250 H560 L520 860 H280 Z" fill="${C.night}"/><path d="M240 250 H560 L555 300 H245 Z" fill="${shade(C.night, 0.12)}"/><rect x="230" y="190" width="340" height="70" rx="14" fill="${C.night}"/><rect x="215" y="150" width="370" height="50" rx="16" fill="${shade(C.night, 0.1)}"/><g transform="translate(${400 - l.w / 2} 520)">${lw({ stroke: C.crema }, 0, 0, 0.26).g}</g><g transform="translate(360 400) scale(0.8)">${symbol({ ring: C.crema })}</g><path d="M262 740 H538 M270 790 H530" stroke="${C.aurum}" stroke-width="5"/><text x="400" y="640" text-anchor="middle" font-family="${SANS}" font-size="12" letter-spacing="4" fill="${C.oat}">${DESCRIPTOR.toUpperCase()}</text>`);
}
// cold cup
{
  const l = lw({}, 0, 0, 0.2);
  mk("cold-cup", 800, 1000, C.crema, `${shadow(400, 900, 180)}<rect x="560" y="60" width="16" height="540" rx="8" fill="${C.aurum}" transform="rotate(8 560 60)"/><path d="M250 260 H550 L515 880 H285 Z" fill="#fff" opacity="0.55" stroke="${C.night}" stroke-opacity="0.2" stroke-width="3"/><path d="M262 360 H538 L512 870 H288 Z" fill="${C.ember}" opacity="0.88"/><path d="M262 360 H538 L532 470 H268 Z" fill="${C.rose}"/><path d="M240 235 C240 130 560 130 560 235 Z" fill="#fff" opacity="0.6" stroke="${C.night}" stroke-opacity="0.2" stroke-width="3"/><rect x="236" y="235" width="328" height="34" rx="14" fill="${C.night}"/><g transform="translate(${400 - l.w / 2} 620)">${lw({ stroke: C.crema }, 0, 0, 0.2).g}</g><g transform="translate(366 520) scale(0.68)">${symbol({ ring: C.crema })}</g>`);
}
// coffee bag
{
  const l = lw({ stroke: C.crema }, 0, 0, 0.28);
  mk("coffee-bag", 800, 1000, C.oat, `${shadow(400, 910, 230)}<path d="M200 170 H600 L620 890 H180 Z" fill="${C.night}"/><path d="M200 170 H600 L598 230 H202 Z" fill="${shade(C.night, 0.14)}"/><path d="M200 170 H600" stroke="${C.aurum}" stroke-width="8"/><circle cx="400" cy="300" r="26" fill="${shade(C.night, 0.25)}"/><circle cx="400" cy="300" r="12" fill="${C.night}"/><g transform="translate(${400 - l.w / 2} 470)">${l.g}</g><g transform="translate(350 340) scale(0.9)">${symbol({ ring: C.crema })}</g><rect x="260" y="610" width="280" height="190" rx="10" fill="${C.crema}"/><text x="400" y="655" text-anchor="middle" font-family="${SERIF}" font-size="30" fill="${C.night}">${AR ? "خلطة البيت رقم 1" : "House Blend No. 1"}</text><text x="400" y="688" text-anchor="middle" font-family="${SANS}" font-size="13" letter-spacing="3" fill="${C.smoke}">${AR ? "كاكاو · بندق · قشر برتقال" : "COCOA · HAZELNUT · ORANGE PEEL"}</text><path d="M290 712 H510" stroke="${C.aurum}" stroke-width="2"/><text x="400" y="745" text-anchor="middle" font-family="${SANS}" font-size="13" fill="${C.smoke}">${AR ? "تحميص متوسط · 250 غ · حبوب كاملة" : "Medium roast · 250 g · Whole bean"}</text><text x="400" y="775" text-anchor="middle" font-family="${SANS}" font-size="11" fill="${C.smoke}">${AR ? "نموذج تصوّري — الخلطة لم تُختبر" : "Concept mockup — blend untested"}</text>`);
}
// paper bag
{
  const l = lw({ stroke: C.night }, 0, 0, 0.22);
  mk("paper-bag", 800, 1000, C.crema, `${shadow(400, 900, 250)}<path d="M290 260 C290 100 510 100 510 260" fill="none" stroke="${C.aurum}" stroke-width="12"/><path d="M180 260 H620 L640 890 H160 Z" fill="${C.oat}"/><path d="M620 260 L640 890 L560 890 L560 260 Z" fill="#000" opacity="0.07"/><g transform="translate(${400 - l.w / 2} 480)">${l.g}</g><g transform="translate(350 340) scale(1)">${symbol({})}</g><path d="M180 760 H640" stroke="${C.night}" stroke-width="4"/><text x="400" y="830" text-anchor="middle" font-family="${SANS}" font-size="16" letter-spacing="7" fill="${C.night}">${SLOGAN.toUpperCase()}</text>`);
}
// napkin
{
  mk("napkin", 800, 800, C.oat, `<defs>${patternDefs("pt", C.aurum, C.crema, 70)}</defs>${shadow(400, 700, 280)}<path d="M180 160 L560 130 L620 560 L230 620 Z" fill="url(#pt)"/><path d="M180 160 L560 130 L620 560 L230 620 Z" fill="none" stroke="${C.night}" stroke-opacity="0.12" stroke-width="2"/><path d="M360 150 L400 350 L610 340" fill="${C.crema}" opacity="0.5"/><g transform="translate(300 420) scale(0.55)">${symbol({})}</g><text x="400" y="560" text-anchor="middle" font-family="${SANS}" font-size="12" letter-spacing="5" fill="${C.night}" transform="rotate(-4 400 560)">${NAME.toUpperCase()}</text>`);
}
// uniform (apron)
{
  const l = lw({ stroke: C.crema }, 0, 0, 0.2);
  mk("uniform", 800, 1000, C.crema, `<circle cx="400" cy="130" r="64" fill="${C.oat}"/><path d="M270 240 C270 190 530 190 530 240 L580 420 H220 Z" fill="${C.oat}"/><rect x="340" y="190" width="120" height="40" fill="${C.oat}"/><path d="M330 180 C340 270 460 270 470 180 L520 960 H280 Z" fill="${C.night}" opacity="0"/><path d="M300 230 H500 L560 960 H240 Z" fill="${C.night}"/><path d="M300 230 L260 120 M500 230 L540 120" stroke="${C.aurum}" stroke-width="10"/><rect x="310" y="620" width="180" height="120" rx="10" fill="${shade(C.night, 0.1)}"/><g transform="translate(${400 - l.w / 2} 430)">${l.g}</g><g transform="translate(370 330) scale(0.6)">${symbol({ ring: C.crema })}</g><path d="M310 690 H490" stroke="${C.aurum}" stroke-width="3"/><text x="400" y="880" text-anchor="middle" font-family="${SANS}" font-size="13" letter-spacing="5" fill="${C.oat}">${AR ? "مريول الباريستا — فحمي / ذهبي" : "BARISTA APRON — CHARCOAL / GOLD"}</text>`);
}
// menu
{
  const l = lw({}, 0, 0, 0.22);
  const rows = (AR ? [["espresso", "3.20"], ["cortado", "4.20"], ["flat-white", "4.60"], ["golden-hour-latte", "6.80"], ["first-light", "6.40"], ["dusk-ember", "6.60"], ["burnt-honey-affogato", "7.20"]].map(([k, p]) => [arName(k), p]) : [["Espresso", "3.20"], ["Cortado", "4.20"], ["Flat White", "4.60"], ["Golden Hour Latte", "6.80"], ["First Light", "6.40"], ["Dusk Ember", "6.60"], ["Burnt Honey Affogato", "7.20"]]);
  mk("menu", 800, 1000, C.oat, `${shadow(400, 940, 260)}<rect x="130" y="60" width="540" height="860" rx="6" fill="${C.crema}"/><g transform="translate(${400 - l.w / 2} 110)">${l.g}</g><text x="400" y="200" text-anchor="middle" font-family="${SANS}" font-size="12" letter-spacing="6" fill="${C.smoke}">${AR ? "المميّزات والكلاسيكيات" : "SIGNATURE &amp; CLASSICS"}</text><path d="M330 220 H470" stroke="${C.aurum}" stroke-width="2"/>${rows.map(([n, p], i) => `<text x="${AR ? 610 : 190}" y="${290 + i * 70}" ${AR ? 'text-anchor="end"' : ""} font-family="${SERIF}" font-size="28" fill="${C.night}">${n}</text><text x="${AR ? 190 : 610}" y="${290 + i * 70}" text-anchor="${AR ? "start" : "end"}" font-family="${SANS}" font-size="20" fill="${C.ember}">${p}</text><path d="M190 ${306 + i * 70} H610" stroke="${C.oat}" stroke-width="2" stroke-dasharray="2 6"/>`).join("")}<text x="400" y="880" text-anchor="middle" font-family="${SANS}" font-size="11" fill="${C.smoke}">${AR ? "منيو تصوّري — الأسعار تقديرية" : "Concept menu — prices are estimates"}</text>`);
}
// business cards
{
  const l = lw({ stroke: C.crema }, 0, 0, 0.18);
  mk("business-card", 900, 700, C.oat, `${shadow(450, 640, 300)}<g transform="rotate(-6 300 250)"><rect x="100" y="90" width="460" height="260" rx="8" fill="${C.night}"/><g transform="translate(${330 - l.w / 2} 195)">${l.g}</g><g transform="translate(305 125) scale(0.5)">${symbol({ ring: C.crema })}</g></g><g transform="rotate(5 600 450)"><rect x="330" y="300" width="460" height="260" rx="8" fill="${C.crema}"/><path d="M330 300 H790" stroke="${C.aurum}" stroke-width="6"/><text x="365" y="370" font-family="${SERIF}" font-size="26" fill="${C.night}">${AR ? "اسمك" : "Your Name"}</text><text x="365" y="396" font-family="${SANS}" font-size="11" letter-spacing="3" fill="${C.smoke}">${AR ? "الشراكات" : "PARTNERSHIPS"} · ${NAME.toUpperCase()}</text><text x="365" y="490" font-family="${SANS}" font-size="12" fill="${C.night}">partners@${DOMAIN}</text><text x="365" y="512" font-family="${SANS}" font-size="12" fill="${C.night}">${DOMAIN}</text><g transform="translate(715 480) scale(0.45)">${symbol({})}</g></g>`);
}
// signage
{
  const l = lw({ stroke: C.crema }, 0, 0, 0.55);
  mk("signage", 1200, 800, "#cdbba0", `<rect x="0" y="560" width="1200" height="240" fill="#a99679"/><rect x="100" y="140" width="1000" height="180" rx="6" fill="${C.night}"/><g transform="translate(${600 - l.w / 2} 190)">${l.g}</g><rect x="100" y="320" width="1000" height="10" fill="${C.aurum}"/><rect x="250" y="360" width="700" height="200" fill="#e8d7b5"/><rect x="120" y="360" width="130" height="200" fill="${C.night}" opacity="0.9"/><g transform="translate(1120 360)"><rect x="-8" y="0" width="70" height="8" fill="${C.night}"/><rect x="0" y="0" width="6" height="30" fill="${C.night}"/><rect x="-20" y="30" width="110" height="130" rx="65 65 8 8" fill="${C.night}"/><g transform="translate(5 60) scale(0.6)">${symbol({ ring: C.crema })}</g></g>`);
}
// product label
{
  const l = lw({}, 0, 0, 0.17);
  mk("product-label", 800, 900, C.crema, `${shadow(400, 810, 200)}<rect x="290" y="70" width="220" height="90" rx="10" fill="${C.night}"/><rect x="250" y="160" width="300" height="640" rx="40" fill="#fff" opacity="0.5" stroke="${C.night}" stroke-opacity="0.25" stroke-width="3"/><rect x="262" y="320" width="276" height="470" rx="30" fill="${C.ember}" opacity="0.88"/><rect x="270" y="400" width="260" height="320" rx="8" fill="${C.crema}"/><g transform="translate(${400 - l.w / 2} 460)">${l.g}</g><g transform="translate(370 410) scale(0.3)">${symbol({})}</g><text x="400" y="540" text-anchor="middle" font-family="${SERIF}" font-size="28" fill="${C.night}">${AR ? "كولد برو" : "Cold Brew"}</text><text x="400" y="565" text-anchor="middle" font-family="${SANS}" font-size="11" letter-spacing="3" fill="${C.smoke}">${AR ? "منقوع ببطء · 16 ساعة" : "SLOW STEEPED · 16 HOURS"}</text><path d="M300 590 H500" stroke="${C.aurum}" stroke-width="2"/><text x="400" y="640" text-anchor="middle" font-family="${SANS}" font-size="11" fill="${C.smoke}">${AR ? "ملصق تصوّري — 500 مل" : "Concept label — 500 ml"}</text>`);
}
// packaging: pastry box
{
  const l = lw({ stroke: C.night }, 0, 0, 0.2);
  mk("pastry-box", 900, 800, C.crema, `${shadow(450, 660, 320)}<path d="M150 280 L450 200 L750 280 L450 360 Z" fill="${C.oat}"/><path d="M150 280 V540 L450 640 V360 Z" fill="${shade(C.oat, -0.08)}"/><path d="M750 280 V540 L450 640 V360 Z" fill="${shade(C.oat, -0.18)}"/><g transform="translate(330 300) skewY(18) scale(1)"><g transform="translate(0 0)">${l.g}</g></g><path d="M450 360 V640" stroke="${C.aurum}" stroke-width="6"/><g transform="translate(405 255) scale(0.4)">${symbol({})}</g>`);
}

/* ------------------------------------------------------------------ café scenes */
const W = 1600, H = 1000;
const win = (x, y, w, h, lit) => `<path d="M${x} ${y + h} V${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} V${y + h} Z" fill="${lit ? "#f6c46e" : "#9fb3b8"}"/><path d="M${x} ${y + h} V${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} V${y + h} Z" fill="none" stroke="${C.night}" stroke-width="8"/><path d="M${x + w / 2} ${y} V${y + h} M${x} ${y + h * 0.55} H${x + w}" stroke="${C.night}" stroke-width="5"/>`;
function exterior(night) {
  const sky = night ? ["#0f1020", "#3a2a3a"] : ["#f6d9a0", "#bcd3d6"];
  const wall = night ? "#6b5a4c" : "#e4cfae";
  const l = lw({ stroke: C.crema }, 0, 0, 0.62);
  let b = `<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient><radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffc864" stop-opacity="0.7"/><stop offset="1" stop-color="#ffc864" stop-opacity="0"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#sk)"/>`;
  if (night) b += Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 197) % W}" cy="${(i * 83) % 380}" r="${1 + (i % 3) * 0.8}" fill="#fff" opacity="0.8"/>`).join("") + `<circle cx="1330" cy="140" r="46" fill="#f4ebdd"/>`; else b += `<circle cx="1250" cy="250" r="120" fill="#fff" opacity="0.5"/><circle cx="1250" cy="250" r="70" fill="${C.aurum}" opacity="0.85"/>`;
  b += `<rect y="800" width="${W}" height="200" fill="${night ? "#2a2429" : "#b9a88f"}"/><rect x="180" y="250" width="1240" height="560" fill="${wall}"/><rect x="150" y="215" width="1300" height="50" fill="${night ? "#2a1b14" : C.night}"/><rect x="190" y="265" width="1220" height="150" fill="${C.night}"/><g transform="translate(${800 - l.w / 2} 305)">${l.g}</g><path d="M760 400 H840" stroke="${C.aurum}" stroke-width="4"/>`;
  b += win(260, 450, 200, 340, night) + win(1140, 450, 200, 340, night);
  b += `<path d="M640 810 V560 A160 160 0 0 1 960 560 V810 Z" fill="${C.night}"/><path d="M670 810 V570 A130 130 0 0 1 930 570 V810 Z" fill="${night ? "#f6c46e" : "#8fa7ab"}"/><path d="M800 440 V810" stroke="${C.night}" stroke-width="6"/><circle cx="780" cy="650" r="7" fill="${C.aurum}"/><circle cx="820" cy="650" r="7" fill="${C.aurum}"/>`;
  b += `<path d="M240 440 H480 L500 480 H220 Z" fill="${C.ember}"/><path d="M1120 440 H1360 L1380 480 H1100 Z" fill="${C.ember}"/>`;
  b += `<g transform="translate(560 300) scale(0.7)">${symbol({ ring: C.crema })}</g>`;
  // planters
  for (const x of [540, 1010]) b += `<rect x="${x}" y="740" width="50" height="70" rx="6" fill="${C.ember}"/><circle cx="${x + 25}" cy="715" r="36" fill="${C.cardamom}"/><circle cx="${x + 5}" cy="730" r="24" fill="#5e6b4c"/>`;
  if (night) b += `<circle cx="360" cy="620" r="260" fill="url(#glow)"/><circle cx="1240" cy="620" r="260" fill="url(#glow)"/><circle cx="800" cy="680" r="300" fill="url(#glow)"/>`;
  b += `<text x="40" y="970" font-family="${SANS}" font-size="14" fill="${night ? C.oat : C.night}" opacity="0.8">Concept illustration — not a photograph; design subject to architect and local regulation.</text>`;
  return svg(W, H, b);
}
out("cafe/exterior-day.svg", exterior(false));
out("cafe/exterior-night.svg", exterior(true));

function lamps(xs, y, lit = true) {
  return xs.map((x) => `<path d="M${x} 0 V${y}" stroke="${C.night}" stroke-width="3"/><path d="M${x - 34} ${y + 40} A34 34 0 0 1 ${x + 34} ${y + 40} Z" fill="${C.aurum}"/><circle cx="${x}" cy="${y + 54}" r="90" fill="#ffc864" opacity="${lit ? 0.18 : 0}"/>`).join("");
}
const stool = (x, y) => `<rect x="${x - 5}" y="${y}" width="10" height="110" fill="${C.night}"/><ellipse cx="${x}" cy="${y}" rx="38" ry="12" fill="${C.ember}"/>`;
out("cafe/interior-wide.svg", svg(W, H, `<rect width="${W}" height="${H}" fill="#d8c3a0"/><rect y="760" width="${W}" height="240" fill="#8b6b4a"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${i * 140} 760 L${i * 140 - 120 + 60} 1000" stroke="#7a5a3c" stroke-width="3"/>`).join("")}<rect x="0" y="0" width="${W}" height="120" fill="${C.night}"/><rect x="120" y="170" width="1360" height="480" fill="#e8d7b5"/><g transform="translate(650 215)"><g transform="scale(1)">${symbol({ s: 120 })}</g></g>${[0, 1, 2].map((i) => `<rect x="${200 + i * 430}" y="360" width="340" height="14" fill="${C.night}"/><rect x="${200 + i * 430}" y="480" width="340" height="14" fill="${C.night}"/>${Array.from({ length: 6 }, (_, j) => `<rect x="${215 + i * 430 + j * 52}" y="${325 - (j % 2) * 15}" width="30" height="${35 + (j % 2) * 15}" rx="4" fill="${[C.ember, C.cardamom, C.aurum, C.night, C.rose, C.smoke][j]}"/><rect x="${215 + i * 430 + j * 52}" y="${445 - (j % 3) * 12}" width="30" height="${35 + (j % 3) * 12}" rx="4" fill="${[C.cardamom, C.rose, C.ember, C.aurum, C.smoke, C.night][j]}"/>`).join("")}`).join("")}<rect x="120" y="650" width="760" height="120" fill="${C.night}"/><rect x="100" y="640" width="800" height="22" fill="${C.aurum}"/>${[200, 330, 460, 590, 720].map((x) => stool(x, 800)).join("")}${lamps([300, 560, 820, 1100, 1360], 190)}<g>${[[1050, 760], [1280, 800]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="90" ry="22" fill="${C.night}" opacity="0.18"/><rect x="${x - 70}" y="${y - 70}" width="140" height="14" rx="7" fill="${C.oat}"/><rect x="${x - 6}" y="${y - 56}" width="12" height="60" fill="${C.night}"/><circle cx="${x - 30}" cy="${y - 85}" r="14" fill="${C.cardamom}"/>${stool(x - 110, y - 40)}${stool(x + 110, y - 40)}`).join("")}</g><g transform="translate(1380 520)"><rect x="0" y="130" width="80" height="120" rx="8" fill="${C.ember}"/><circle cx="40" cy="90" r="60" fill="${C.cardamom}"/><circle cx="14" cy="120" r="40" fill="#5e6b4c"/></g><text x="40" y="970" font-family="${SANS}" font-size="14" fill="${C.crema}" opacity="0.9">Concept illustration — interior, wide view.</text>`));
out("cafe/counter.svg", svg(W, H, `<defs><linearGradient id="cw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8d7b5"/><stop offset="1" stop-color="#cdb48a"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#cw)"/><rect y="0" width="${W}" height="100" fill="${C.night}"/>${lamps([400, 800, 1200], 100)}<rect x="160" y="150" width="1280" height="260" rx="6" fill="${C.night}"/><text x="800" y="230" text-anchor="middle" font-family="${SERIF}" font-size="44" fill="${C.crema}">${AR ? "اليوم في " + NAME : "Today at " + NAME}</text><path d="M620 250 H980" stroke="${C.aurum}" stroke-width="3"/>${(AR ? ["إسبريسو 3.20", "فلات وايت 4.60", "لاتيه الساعة الذهبية 6.80", "أول ضوء 6.40"] : ["Espresso 3.20", "Flat White 4.60", "Golden Hour Latte 6.80", "First Light 6.40"]).map((t, i) => `<text x="${220 + (i % 2) * 640}" y="${300 + Math.floor(i / 2) * 50}" font-family="${SANS}" font-size="22" fill="${C.oat}">${t}</text>`).join("")}<rect x="230" y="500" width="560" height="170" rx="14" fill="#9aa0a3"/><rect x="250" y="440" width="520" height="70" rx="10" fill="#b6bcbf"/><circle cx="330" cy="585" r="42" fill="${C.night}"/><circle cx="510" cy="585" r="42" fill="${C.night}"/><circle cx="690" cy="585" r="42" fill="${C.night}"/><rect x="270" y="640" width="480" height="14" rx="6" fill="${C.aurum}"/><rect x="900" y="470" width="120" height="200" rx="10" fill="${C.night}"/><path d="M910 470 L960 410 L1010 470 Z" fill="${C.ember}"/><rect x="1080" y="540" width="130" height="130" rx="10" fill="#b6bcbf"/><rect x="0" y="670" width="${W}" height="330" fill="${C.night}"/><rect x="0" y="650" width="${W}" height="30" fill="${C.aurum}"/>${Array.from({ length: 16 }, (_, i) => `<rect x="${i * 100 + 10}" y="720" width="80" height="260" rx="4" fill="#000" opacity="0.18"/>`).join("")}<g transform="translate(720 690) scale(0.42)">${symbol({ ring: C.crema })}</g>${[1250, 1330, 1410].map((x, i) => `<path d="M${x - 24} 560 H${x + 24} L${x + 18} 650 H${x - 18} Z" fill="${[C.crema, C.oat, C.rose][i]}"/>`).join("")}<text x="40" y="970" font-family="${SANS}" font-size="14" fill="${C.oat}">Concept illustration — espresso counter.</text>`));
out("cafe/seating.svg", svg(W, H, `<rect width="${W}" height="${H}" fill="#e2cfae"/><rect y="760" width="${W}" height="240" fill="#a0805c"/>${win(120, 120, 300, 560, true)}${win(1180, 120, 300, 560, true)}<path d="M120 680 L420 680 L700 980 L-100 980 Z" fill="#fff3c8" opacity="0.28"/><rect x="480" y="150" width="620" height="400" rx="6" fill="${C.cardamom}" opacity="0.9"/><g transform="translate(720 220)">${symbol({ ring: C.crema, s: 160 })}</g>${lamps([560, 800, 1040], 80)}<g><rect x="460" y="620" width="680" height="140" rx="30" fill="${C.ember}"/><rect x="440" y="560" width="720" height="110" rx="30" fill="${shade(C.ember, 0.1)}"/><rect x="560" y="800" width="480" height="24" rx="12" fill="${C.night}"/><rect x="580" y="824" width="14" height="110" fill="${C.night}"/><rect x="1006" y="824" width="14" height="110" fill="${C.night}"/><ellipse cx="800" cy="796" rx="60" ry="10" fill="#000" opacity="0.1"/><rect x="760" y="760" width="80" height="40" rx="8" fill="${C.crema}"/></g><g transform="translate(60 520)"><rect x="0" y="180" width="90" height="140" rx="8" fill="${C.ember}"/><circle cx="45" cy="130" r="70" fill="${C.cardamom}"/><circle cx="15" cy="170" r="46" fill="#5e6b4c"/></g><text x="40" y="970" font-family="${SANS}" font-size="14" fill="${C.night}" opacity="0.8">Concept illustration — customer seating area.</text>`));
out("cafe/product-studio.svg", svg(W, H, `<defs><radialGradient id="ps" cx="0.5" cy="0.4" r="0.8"><stop offset="0" stop-color="#f6d9a0"/><stop offset="1" stop-color="${C.oat}"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#ps)"/><rect y="680" width="${W}" height="320" fill="#c9a574"/><path d="M0 680 Q800 640 1600 680" stroke="#fff" stroke-opacity="0.4" stroke-width="3" fill="none"/><rect x="60" y="100" width="260" height="520" rx="8" fill="#fff" opacity="0.85"/><rect x="1280" y="140" width="260" height="480" rx="8" fill="#fff" opacity="0.55"/><path d="M320 200 L700 640 L560 640 L320 360 Z" fill="#fff" opacity="0.18"/><g transform="translate(560 90) scale(0.82)">${drinkArt(products.find((x) => x.slug === "golden-hour-latte")).replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "")}</g><g transform="translate(1120 560) scale(0.12)">${symbol({ s: 100 })}</g><ellipse cx="800" cy="860" rx="240" ry="30" fill="#000" opacity="0.18"/><text x="40" y="970" font-family="${SANS}" font-size="14" fill="${C.night}" opacity="0.8">Concept illustration — product photography set (soft window light, warm bounce).</text>`));

// OG image + hero
out("og.svg", svg(1200, 630, `<rect width="1200" height="630" fill="${C.night}"/><circle cx="900" cy="360" r="240" fill="${C.aurum}" opacity="0.18"/><path d="M620 420 A280 280 0 0 1 1180 420 Z" fill="${C.aurum}" opacity="0.9"/><g transform="translate(80 210) scale(0.9)">${wordmark({ stroke: C.crema }).markup}</g><text x="84" y="420" font-family="${SERIF}" font-size="46" font-style="italic" fill="${C.oat}">${SLOGAN}</text><text x="84" y="500" font-family="${SANS}" font-size="20" letter-spacing="8" fill="${C.aurum}">${DESCRIPTOR.toUpperCase()}</text>`));
console.log("art generated");
