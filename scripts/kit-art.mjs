// Extra drawings for the franchise kit: cup-size lineup and store floor plans (SVG, brand palette).
import { C, svg } from "./art-lib.mjs";
const SANS = "'Hanken Grotesk','Helvetica Neue',Arial,sans-serif";
const SERIF = "'Instrument Serif',Georgia,serif";

// Typical industry dimensions in mm: [label, oz, ml, rimØ, baseØ, height]
export const hotCups = [["Piccolo", 4, 120, 62, 44, 62], ["Small", 8, 240, 80, 56, 92], ["Medium", 12, 355, 90, 59, 111], ["Large", 16, 473, 90, 60, 136]];
export const coldCups = [["Medium", 12, 355, 98, 58, 112], ["Large", 16, 473, 98, 60, 131], ["XL", 22, 650, 98, 62, 158]];

export function cupSizesSvg() {
  const k = 2.4; // px per mm
  const W = 1840, H = 620, base = 440;
  let b = `<rect width="${W}" height="${H}" fill="${C.crema}"/>`;
  b += `<text x="40" y="50" font-family="${SANS}" font-size="18" letter-spacing="4" fill="${C.smoke}">HOT CUPS · DOUBLE-WALL PAPER (rim Ø × height in mm)</text>`;
  b += `<text x="1010" y="50" font-family="${SANS}" font-size="18" letter-spacing="4" fill="${C.smoke}">COLD CUPS · CLEAR PET + DOME LID</text>`;
  b += `<path d="M30 ${base} H${W - 30}" stroke="${C.oat}" stroke-width="3"/>`;
  let x = 60;
  for (const [n, oz, ml, rim, bs, h] of hotCups) {
    const r = (rim * k) / 2, bsr = (bs * k) / 2, hh = h * k, cx = x + r;
    b += `<path d="M${cx - r} ${base - hh} H${cx + r} L${cx + bsr} ${base} H${cx - bsr} Z" fill="${C.night}"/><rect x="${cx - r - 6}" y="${base - hh - 14}" width="${2 * r + 12}" height="14" rx="5" fill="#3a2a22"/><rect x="${cx - r + 6}" y="${base - hh * 0.62}" width="${2 * r - 12}" height="${hh * 0.34}" fill="${C.aurum}" opacity="0.9"/>`;
    b += `<text x="${cx}" y="${base + 40}" text-anchor="middle" font-family="${SERIF}" font-size="34" fill="${C.night}">${oz} oz</text><text x="${cx}" y="${base + 66}" text-anchor="middle" font-family="${SANS}" font-size="18" fill="${C.smoke}">${ml} ml · ${n}</text><text x="${cx}" y="${base + 90}" text-anchor="middle" font-family="${SANS}" font-size="16" fill="${C.smoke}">Ø${rim} × ${h} mm</text>`;
    x += 2 * r + 40;
  }
  x = 1010;
  for (const [n, oz, ml, rim, bs, h] of coldCups) {
    const r = (rim * k) / 2, bsr = (bs * k) / 2, hh = h * k, cx = x + r;
    b += `<path d="M${cx - r} ${base - hh} H${cx + r} L${cx + bsr} ${base} H${cx - bsr} Z" fill="#fff" fill-opacity="0.55" stroke="${C.night}" stroke-opacity="0.35" stroke-width="2"/><path d="M${cx - r + 8} ${base - hh * 0.72} H${cx + r - 8} L${cx + bsr - 3} ${base - 4} H${cx - bsr + 3} Z" fill="${C.ember}" opacity="0.85"/><path d="M${cx - r - 4} ${base - hh} C${cx - r} ${base - hh - 60} ${cx + r} ${base - hh - 60} ${cx + r + 4} ${base - hh} Z" fill="#fff" fill-opacity="0.6" stroke="${C.night}" stroke-opacity="0.3" stroke-width="2"/>`;
    b += `<text x="${cx}" y="${base + 40}" text-anchor="middle" font-family="${SERIF}" font-size="34" fill="${C.night}">${oz} oz</text><text x="${cx}" y="${base + 66}" text-anchor="middle" font-family="${SANS}" font-size="18" fill="${C.smoke}">${ml} ml · ${n}</text><text x="${cx}" y="${base + 90}" text-anchor="middle" font-family="${SANS}" font-size="16" fill="${C.smoke}">Ø${rim} × ${h} mm</text>`;
    x += 2 * r + 40;
  }
  b += `<text x="40" y="${H - 16}" font-family="${SANS}" font-size="16" fill="${C.smoke}">Dimensions are typical industry values for illustration — confirm exact specifications and printing templates with your cup supplier.</text>`;
  return svg(W, H, b);
}

const xml = (t) => String(t).replace(/&(?!amp;|lt;|gt;)/g, "&amp;").replace(/</g, "&lt;");
const label = (x, y, t, s = 13, fill = C.night, anchor = "middle") => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${SANS}" font-size="${s}" font-weight="600" fill="${fill}">${xml(t)}</text>`;
const zone = (x, y, w, h, fill, t, sub = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${C.night}" stroke-width="2"/>${label(x + w / 2, y + h / 2 - (sub ? 2 : -5), t, 13)}${sub ? label(x + w / 2, y + h / 2 + 15, sub, 11, C.smoke) : ""}`;
const table = (x, y, r = 16) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.oat}" stroke="${C.night}" stroke-width="1.5"/><circle cx="${x - r - 9}" cy="${y}" r="6" fill="${C.ember}"/><circle cx="${x + r + 9}" cy="${y}" r="6" fill="${C.ember}"/>`;

/** Flagship ≈ 90 m² (10 m × 9 m) at 60 px / m. */
export function flagshipPlanSvg() {
  const m = 60, ox = 50, oy = 70, W = 1100, H = 700;
  let b = `<rect width="${W}" height="${H}" fill="${C.crema}"/>` + label(40, 38, "FLAGSHIP FORMAT · ≈ 90 m² · 10 m × 9 m · ≈ 26 seats", 14, C.smoke, "start");
  b += `<rect x="${ox}" y="${oy}" width="${10 * m}" height="${9 * m}" fill="#fffaf1" stroke="${C.night}" stroke-width="5"/>`;
  b += zone(ox + 5, oy + 5, 3.2 * m, 4 * m, "#e7dcc6", "BACK OF HOUSE", "prep · dishwash · dry store ≈ 13 m²");
  b += zone(ox + 3.2 * m + 5, oy + 5, 2.6 * m, 1.6 * m, "#ddd", "Staff / office", "");
  b += zone(ox + 8 * m, oy + 5, 2 * m - 5, 2.4 * m, "#dfe6d6", "WC", "accessible");
  b += zone(ox + 3.4 * m, oy + 4.1 * m, 6.2 * m, 1.2 * m, C.night, "", ""); b += label(ox + 6.5 * m, oy + 4.1 * m + 36, "ESPRESSO BAR / COUNTER · 6.2 m", 13, C.crema);
  b += zone(ox + 3.4 * m, oy + 5.3 * m + 6, 1.6 * m, 0.8 * m, C.aurum, "Pastry", "display");
  b += zone(ox + 8.2 * m, oy + 5.3 * m + 6, 1.4 * m, 0.8 * m, C.rose, "Retail", "beans");
  b += `<rect x="${ox + 5}" y="${oy + 4.4 * m}" width="${0.9 * m}" height="${4.5 * m - 10}" fill="${C.cardamom}" opacity="0.5" stroke="${C.night}"/>` + label(ox + 5 + 0.45 * m, oy + 6.5 * m, "BANQUETTE", 11, C.night, "middle");
  for (const [x, y] of [[2.6, 7.3], [4.6, 7.3], [6.6, 7.3], [8.6, 7.3]]) b += table(ox + x * m, oy + y * m);
  b += `<rect x="${ox + 2.6 * m}" y="${oy + 8.1 * m}" width="${4.2 * m}" height="0.6" fill="none"/>` + `<rect x="${ox + 3 * m}" y="${oy + 8.2 * m - 4}" width="${3.6 * m}" height="${0.55 * m}" rx="6" fill="${C.oat}" stroke="${C.night}" stroke-width="1.5"/>` + label(ox + 4.8 * m, oy + 8.2 * m + 22, "communal table · 6", 10, C.night);
  b += `<rect x="${ox + 7.2 * m}" y="${oy + 8.1 * m - 6}" width="${2.4 * m}" height="${0.7 * m}" fill="${C.aurum}" opacity="0.35" stroke="${C.night}" stroke-dasharray="4 3"/>` + label(ox + 8.4 * m, oy + 8.1 * m + 22, "photo corner", 10);
  b += `<rect x="${ox + 4.4 * m}" y="${oy + 9 * m - 4}" width="${1.2 * m}" height="8" fill="${C.ember}"/>` + label(ox + 5 * m, oy + 9 * m + 28, "ENTRANCE (double door, step-free)", 12, C.ember);
  b += `<path d="M${ox + 5} ${oy + 9 * m} H${ox + 10 * m - 5}" stroke="${C.night}" stroke-width="3" stroke-dasharray="14 6"/>`;
  b += label(ox + 5 * m, oy - 12, "10.0 m", 12, C.smoke); b += `<path d="M${ox} ${oy - 28} H${ox + 10 * m}" stroke="${C.smoke}" stroke-width="1"/>`;
  b += label(ox + 10 * m + 40, oy + 4.5 * m, "9.0 m", 12, C.smoke);
  // legend
  const lx = 760; b += label(lx, 120, "ZONES (approx.)", 13, C.smoke, "start");
  [["Seating & circulation", "≈ 44 m²"], ["Espresso bar + pastry + retail", "≈ 12 m²"], ["Back of house (prep, wash, store)", "≈ 13 m²"], ["WC + staff", "≈ 9 m²"], ["Entrance / queue", "≈ 12 m²"]].forEach(([a, c], i) => { b += label(lx, 150 + i * 28, `${a}`, 13, C.night, "start") + label(lx + 290, 150 + i * 28, c, 13, C.bronze ?? C.ember, "end"); });
  b += label(lx, 330, "SEATS", 13, C.smoke, "start");
  [["Banquette", "6"], ["Two-tops × 4", "8–10"], ["Communal table", "6"], ["Bar stools", "5"]].forEach(([a, c], i) => { b += label(lx, 360 + i * 28, a, 13, C.night, "start") + label(lx + 290, 360 + i * 28, c, 13, C.ember, "end"); });
  b += label(lx, 500, "Schematic only — not an architectural drawing.", 12, C.smoke, "start") + label(lx, 520, "Local code (egress, accessibility, ventilation,", 12, C.smoke, "start") + label(lx, 538, "grease/handwash/WC counts) must be verified by an architect.", 12, C.smoke, "start");
  return svg(W, H, b);
}

/** Kiosk ≈ 20 m² (5 m × 4 m) at 100 px / m. */
export function kioskPlanSvg() {
  const m = 100, ox = 60, oy = 80, W = 1100, H = 560;
  let b = `<rect width="${W}" height="${H}" fill="${C.crema}"/>` + label(40, 40, "KIOSK FORMAT · ≈ 20 m² · 5 m × 4 m · take-away + 6–8 stand/stool seats", 14, C.smoke, "start");
  b += `<rect x="${ox}" y="${oy}" width="${5 * m}" height="${4 * m}" fill="#fffaf1" stroke="${C.night}" stroke-width="5"/>`;
  b += zone(ox + 5, oy + 5, 1.6 * m, 1.6 * m, "#e7dcc6", "Dry store", "+ cold room");
  b += zone(ox + 1.6 * m + 10, oy + 5, 3.4 * m - 15, 0.5 * m, "#ddd", "Back counter · fridges · ice");
  b += `<rect x="${ox + 1.8 * m}" y="${oy + 1.3 * m}" width="${3 * m - 5}" height="${0.9 * m}" fill="${C.night}"/>` + label(ox + 3.3 * m, oy + 1.3 * m + 38, "ESPRESSO BAR (2-group) · POS · grinders", 13, C.crema);
  b += zone(ox + 1.8 * m, oy + 2.2 * m + 6, 1.4 * m, 0.7 * m, C.aurum, "Pastry", "display");
  b += `<rect x="${ox + 5}" y="${oy + 2.6 * m}" width="${1.5 * m}" height="${1.4 * m - 10}" fill="none" stroke="${C.night}" stroke-dasharray="5 4"/>` + label(ox + 0.8 * m, oy + 3.3 * m, "service &amp;", 11) + label(ox + 0.8 * m, oy + 3.3 * m + 16, "queue", 11);
  b += `<rect x="${ox + 3.4 * m}" y="${oy + 4 * m - 4}" width="${1.4 * m}" height="8" fill="${C.ember}"/>`;
  b += label(ox + 2.5 * m, oy + 4 * m + 30, "Walk-up window / open frontage", 12, C.ember);
  for (const x of [1.3, 2.4, 3.5, 4.6]) b += table(ox + x * m, oy + 4 * m + 90, 14);
  b += label(ox + 2.5 * m, oy + 4 * m + 130, "outdoor stand tables (permit dependent)", 11, C.smoke);
  b += label(780, 140, "KIOSK STAFFING", 13, C.smoke, "start") + label(780, 170, "2 baristas per shift (peak), 1 off-peak", 13, C.night, "start") + label(780, 198, "Menu: espresso + milk + cold + 6 signatures +", 13, C.night, "start") + label(780, 218, "packaged pastry (no on-site baking)", 13, C.night, "start") + label(780, 270, "Equipment (est.): 2-group machine, 2 grinders,", 13, C.night, "start") + label(780, 290, "under-counter fridges ×2, ice maker, display case,", 13, C.night, "start") + label(780, 310, "POS, water filtration", 13, C.night, "start");
  b += label(780, 380, "Schematic only — verify with architect and landlord.", 12, C.smoke, "start");
  return svg(W, H, b);
}
