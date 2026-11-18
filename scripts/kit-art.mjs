// Extra drawings for the franchise kit: cup-size lineup and store floor plans (SVG, brand palette).
import { C, svg as baseSvg } from "./art-lib.mjs";
// Pin direction: inline SVG inherits the RTL page direction, which would flip text-anchor start/end.
const svg = (w, h, body, bg) => baseSvg(w, h, body, bg).replace("<svg ", '<svg direction="ltr" ');
const AR = process.env.BRAND_LANG === "ar";
const tr = (en, ar) => (AR ? ar : en);
const SANS = AR ? "Cairo,'Noto Sans Arabic',sans-serif" : "'Hanken Grotesk','Helvetica Neue',Arial,sans-serif";
const SERIF = AR ? "Cairo,'Noto Sans Arabic',sans-serif" : "'Instrument Serif',Georgia,serif";

// Typical industry dimensions in mm: [label, oz, ml, rimØ, baseØ, height]
export const hotCups = [[tr("Piccolo", "بيكولو"), 4, 120, 62, 44, 62], [tr("Small", "صغير"), 8, 240, 80, 56, 92], [tr("Medium", "وسط"), 12, 355, 90, 59, 111], [tr("Large", "كبير"), 16, 473, 90, 60, 136]];
export const coldCups = [[tr("Medium", "وسط"), 12, 355, 98, 58, 112], [tr("Large", "كبير"), 16, 473, 98, 60, 131], [tr("XL", "إضافي"), 22, 650, 98, 62, 158]];

export function cupSizesSvg() {
  const k = 2.4; // px per mm
  const W = 1840, H = 620, base = 440;
  let b = `<rect width="${W}" height="${H}" fill="${C.crema}"/>`;
  b += `<text x="40" y="50" font-family="${SANS}" font-size="18" letter-spacing="4" fill="${C.smoke}">${tr("HOT CUPS · DOUBLE-WALL PAPER (rim Ø × height in mm)", "أكواب ساخنة · ورق مزدوج الجدار (القطر × الارتفاع بالملم)")}</text>`;
  b += `<text x="1010" y="50" font-family="${SANS}" font-size="18" letter-spacing="4" fill="${C.smoke}">${tr("COLD CUPS · CLEAR PET + DOME LID", "أكواب باردة · PET شفاف + غطاء مقبّب")}</text>`;
  b += `<path d="M30 ${base} H${W - 30}" stroke="${C.oat}" stroke-width="3"/>`;
  let x = 60;
  for (const [n, oz, ml, rim, bs, h] of hotCups) {
    const r = (rim * k) / 2, bsr = (bs * k) / 2, hh = h * k, cx = x + r;
    b += `<path d="M${cx - r} ${base - hh} H${cx + r} L${cx + bsr} ${base} H${cx - bsr} Z" fill="${C.night}"/><rect x="${cx - r - 6}" y="${base - hh - 14}" width="${2 * r + 12}" height="14" rx="5" fill="#3a2a22"/><rect x="${cx - r + 6}" y="${base - hh * 0.62}" width="${2 * r - 12}" height="${hh * 0.34}" fill="${C.aurum}" opacity="0.9"/>`;
    b += `<text x="${cx}" y="${base + 40}" text-anchor="middle" font-family="${SERIF}" font-size="34" fill="${C.night}">${oz} ${tr("oz", "أونصة")}</text><text x="${cx}" y="${base + 66}" text-anchor="middle" font-family="${SANS}" font-size="18" fill="${C.smoke}">${ml} ${tr("ml", "مل")} · ${n}</text><text x="${cx}" y="${base + 90}" text-anchor="middle" font-family="${SANS}" font-size="16" fill="${C.smoke}">Ø${rim} × ${h} ${tr("mm", "ملم")}</text>`;
    x += 2 * r + 40;
  }
  x = 1010;
  for (const [n, oz, ml, rim, bs, h] of coldCups) {
    const r = (rim * k) / 2, bsr = (bs * k) / 2, hh = h * k, cx = x + r;
    b += `<path d="M${cx - r} ${base - hh} H${cx + r} L${cx + bsr} ${base} H${cx - bsr} Z" fill="#fff" fill-opacity="0.55" stroke="${C.night}" stroke-opacity="0.35" stroke-width="2"/><path d="M${cx - r + 8} ${base - hh * 0.72} H${cx + r - 8} L${cx + bsr - 3} ${base - 4} H${cx - bsr + 3} Z" fill="${C.ember}" opacity="0.85"/><path d="M${cx - r - 4} ${base - hh} C${cx - r} ${base - hh - 60} ${cx + r} ${base - hh - 60} ${cx + r + 4} ${base - hh} Z" fill="#fff" fill-opacity="0.6" stroke="${C.night}" stroke-opacity="0.3" stroke-width="2"/>`;
    b += `<text x="${cx}" y="${base + 40}" text-anchor="middle" font-family="${SERIF}" font-size="34" fill="${C.night}">${oz} ${tr("oz", "أونصة")}</text><text x="${cx}" y="${base + 66}" text-anchor="middle" font-family="${SANS}" font-size="18" fill="${C.smoke}">${ml} ${tr("ml", "مل")} · ${n}</text><text x="${cx}" y="${base + 90}" text-anchor="middle" font-family="${SANS}" font-size="16" fill="${C.smoke}">Ø${rim} × ${h} ${tr("mm", "ملم")}</text>`;
    x += 2 * r + 40;
  }
  b += `<text x="40" y="${H - 16}" font-family="${SANS}" font-size="16" fill="${C.smoke}">${tr("Dimensions are typical industry values for illustration — confirm exact specifications and printing templates with your cup supplier.", "الأبعاد قيم تقريبية شائعة في السوق للتوضيح، وتُؤكَّد المواصفات الدقيقة وقوالب الطباعة مع مورّد الأكواب.")}</text>`;
  return svg(W, H, b);
}

const xml = (t) => String(t).replace(/&(?!amp;|lt;|gt;)/g, "&amp;").replace(/</g, "&lt;");
const label = (x, y, t, s = 13, fill = C.night, anchor = "middle") => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${SANS}" font-size="${AR ? Math.round(s * 1.2) : s}" font-weight="600" fill="${fill}">${xml(t)}</text>`;
const zone = (x, y, w, h, fill, t, sub = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${C.night}" stroke-width="2"/>${label(x + w / 2, y + h / 2 - (sub ? 2 : -5), t, 13)}${sub ? label(x + w / 2, y + h / 2 + 15, sub, 11, C.smoke) : ""}`;
const table = (x, y, r = 16) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.oat}" stroke="${C.night}" stroke-width="1.5"/><circle cx="${x - r - 9}" cy="${y}" r="6" fill="${C.ember}"/><circle cx="${x + r + 9}" cy="${y}" r="6" fill="${C.ember}"/>`;

/** Flagship ≈ 90 m² (10 m × 9 m) at 60 px / m. */
export function flagshipPlanSvg() {
  const m = 60, ox = 50, oy = 70, W = 1100, H = 700;
  let b = `<rect width="${W}" height="${H}" fill="${C.crema}"/>` + label(40, 38, tr("FLAGSHIP FORMAT · ≈ 90 m² · 10 m × 9 m · ≈ 26 seats", "النموذج الرئيسي · ≈ 90 م² · 10 م × 9 م · ≈ 26 مقعداً"), 14, C.smoke, "start");
  b += `<rect x="${ox}" y="${oy}" width="${10 * m}" height="${9 * m}" fill="#fffaf1" stroke="${C.night}" stroke-width="5"/>`;
  b += zone(ox + 5, oy + 5, 3.2 * m, 4 * m, "#e7dcc6", tr("BACK OF HOUSE", "الخلفية"), tr("prep · dishwash · dry store ≈ 13 m²", "تحضير · غسيل · مخزن جاف ≈ 13 م²"));
  b += zone(ox + 3.2 * m + 5, oy + 5, 2.6 * m, 1.6 * m, "#ddd", tr("Staff / office", "موظفون / مكتب"), "");
  b += zone(ox + 8 * m, oy + 5, 2 * m - 5, 2.4 * m, "#dfe6d6", tr("WC", "دورة مياه"), tr("accessible", "لذوي الإعاقة"));
  b += zone(ox + 3.4 * m, oy + 4.1 * m, 6.2 * m, 1.2 * m, C.night, "", ""); b += label(ox + 6.5 * m, oy + 4.1 * m + 36, tr("ESPRESSO BAR / COUNTER · 6.2 m", "بار الإسبريسو / الكاونتر · 6.2 م"), 13, C.crema);
  b += zone(ox + 3.4 * m, oy + 5.3 * m + 6, 1.6 * m, 0.8 * m, C.aurum, tr("Pastry", "معجنات"), tr("display", "عرض"));
  b += zone(ox + 8.2 * m, oy + 5.3 * m + 6, 1.4 * m, 0.8 * m, C.rose, tr("Retail", "بيع"), tr("beans", "بن"));
  b += `<rect x="${ox + 5}" y="${oy + 4.4 * m}" width="${0.9 * m}" height="${4.5 * m - 10}" fill="${C.cardamom}" opacity="0.5" stroke="${C.night}"/>` + label(ox + 5 + 0.45 * m, oy + 6.5 * m, tr("BANQUETTE", "كنبة"), 11, C.night, "middle");
  for (const [x, y] of [[2.6, 7.3], [4.6, 7.3], [6.6, 7.3], [8.6, 7.3]]) b += table(ox + x * m, oy + y * m);
  b += `<rect x="${ox + 2.6 * m}" y="${oy + 8.1 * m}" width="${4.2 * m}" height="0.6" fill="none"/>` + `<rect x="${ox + 3 * m}" y="${oy + 8.2 * m - 4}" width="${3.6 * m}" height="${0.55 * m}" rx="6" fill="${C.oat}" stroke="${C.night}" stroke-width="1.5"/>` + label(ox + 4.8 * m, oy + 8.2 * m + 22, tr("communal table · 6", "طاولة مشتركة · 6"), 10, C.night);
  b += `<rect x="${ox + 7.2 * m}" y="${oy + 8.1 * m - 6}" width="${2.4 * m}" height="${0.7 * m}" fill="${C.aurum}" opacity="0.35" stroke="${C.night}" stroke-dasharray="4 3"/>` + label(ox + 8.4 * m, oy + 8.1 * m + 22, tr("photo corner", "ركن التصوير"), 10);
  b += `<rect x="${ox + 4.4 * m}" y="${oy + 9 * m - 4}" width="${1.2 * m}" height="8" fill="${C.ember}"/>` + label(ox + 5 * m, oy + 9 * m + 28, tr("ENTRANCE (double door, step-free)", "المدخل (باب مزدوج بلا درج)"), 12, C.ember);
  b += `<path d="M${ox + 5} ${oy + 9 * m} H${ox + 10 * m - 5}" stroke="${C.night}" stroke-width="3" stroke-dasharray="14 6"/>`;
  b += label(ox + 5 * m, oy - 12, tr("10.0 m", "10.0 م"), 12, C.smoke); b += `<path d="M${ox} ${oy - 28} H${ox + 10 * m}" stroke="${C.smoke}" stroke-width="1"/>`;
  b += label(ox + 10 * m + 40, oy + 4.5 * m, tr("9.0 m", "9.0 م"), 12, C.smoke);
  // legend
  const lx = 760, A1 = AR ? "end" : "start", A2 = AR ? "start" : "end", X1 = AR ? lx + 330 : lx, X2 = AR ? lx : lx + 290;
  b += label(X1, 120, tr("ZONES (approx.)", "المناطق (تقريبي)"), 13, C.smoke, A1);
  [[tr("Seating & circulation", "الجلوس والحركة"), "≈ 44 م²"], [tr("Espresso bar + pastry + retail", "بار الإسبريسو + المعجنات + البيع"), "≈ 12 م²"], [tr("Back of house (prep, wash, store)", "الخلفية (تحضير، غسيل، تخزين)"), "≈ 13 م²"], [tr("WC + staff", "دورات المياه + الموظفون"), "≈ 9 م²"], [tr("Entrance / queue", "المدخل / الطابور"), "≈ 12 م²"]].forEach(([a, c], i) => { b += label(X1, 150 + i * 28, `${a}`, 13, C.night, A1) + label(X2, 150 + i * 28, tr(c.replace("م²", "m²"), c), 13, C.ember, A2); });
  b += label(X1, 330, tr("SEATS", "المقاعد"), 13, C.smoke, A1);
  [[tr("Banquette", "كنبة"), "6"], [tr("Two-tops × 4", "طاولات ثنائية × 4"), "8–10"], [tr("Communal table", "طاولة مشتركة"), "6"], [tr("Bar stools", "كراسي البار"), "5"]].forEach(([a, c], i) => { b += label(X1, 360 + i * 28, a, 13, C.night, A1) + label(X2, 360 + i * 28, c, 13, C.ember, A2); });
  b += label(X1, 500, tr("Schematic only — not an architectural drawing.", "مخطط توضيحي فقط، وليس رسماً معمارياً."), 12, C.smoke, A1) + label(X1, 520, tr("Local code (egress, accessibility,", "تُراجَع الاشتراطات المحلية (المخارج، سهولة الوصول،"), 12, C.smoke, A1) + label(X1, 538, tr("ventilation, WC counts) must be verified by an architect.", "التهوية، عدد دورات المياه) مع مهندس معماري."), 12, C.smoke, A1);
  return svg(W, H, b);
}

/** Kiosk ≈ 20 m² (5 m × 4 m) at 100 px / m. */
export function kioskPlanSvg() {
  const m = 100, ox = 60, oy = 80, W = 1100, H = 560;
  let b = `<rect width="${W}" height="${H}" fill="${C.crema}"/>` + label(40, 40, tr("KIOSK FORMAT · ≈ 20 m² · 5 m × 4 m · take-away + 6–8 stand/stool seats", "نموذج الكشك · ≈ 20 م² · 5 م × 4 م · طلبات خارجية + 6–8 مقاعد/طاولات وقوف"), 14, C.smoke, "start");
  b += `<rect x="${ox}" y="${oy}" width="${5 * m}" height="${4 * m}" fill="#fffaf1" stroke="${C.night}" stroke-width="5"/>`;
  b += zone(ox + 5, oy + 5, 1.6 * m, 1.6 * m, "#e7dcc6", tr("Dry store", "مخزن جاف"), tr("+ cold room", "+ غرفة تبريد"));
  b += zone(ox + 1.6 * m + 10, oy + 5, 3.4 * m - 15, 0.5 * m, "#ddd", tr("Back counter · fridges · ice", "كاونتر خلفي · ثلاجات · ثلج"));
  b += `<rect x="${ox + 1.8 * m}" y="${oy + 1.3 * m}" width="${3 * m - 5}" height="${0.9 * m}" fill="${C.night}"/>` + label(ox + 3.3 * m, oy + 1.3 * m + 38, tr("ESPRESSO BAR (2-group) · POS · grinders", "بار الإسبريسو (مجموعتان) · الكاشير · المطاحن"), 13, C.crema);
  b += zone(ox + 1.8 * m, oy + 2.2 * m + 6, 1.4 * m, 0.7 * m, C.aurum, tr("Pastry", "معجنات"), tr("display", "عرض"));
  b += `<rect x="${ox + 5}" y="${oy + 2.6 * m}" width="${1.5 * m}" height="${1.4 * m - 10}" fill="none" stroke="${C.night}" stroke-dasharray="5 4"/>` + label(ox + 0.8 * m, oy + 3.3 * m, tr("service &amp;", "الخدمة"), 11) + label(ox + 0.8 * m, oy + 3.3 * m + 16, tr("queue", "والطابور"), 11);
  b += `<rect x="${ox + 3.4 * m}" y="${oy + 4 * m - 4}" width="${1.4 * m}" height="8" fill="${C.ember}"/>`;
  b += label(ox + 2.5 * m, oy + 4 * m + 30, tr("Walk-up window / open frontage", "نافذة طلب / واجهة مفتوحة"), 12, C.ember);
  for (const x of [1.3, 2.4, 3.5, 4.6]) b += table(ox + x * m, oy + 4 * m + 90, 14);
  b += label(ox + 2.5 * m, oy + 4 * m + 130, tr("outdoor stand tables (permit dependent)", "طاولات وقوف خارجية (حسب التصريح)"), 11, C.smoke);
  const KA = AR ? "end" : "start", KX = AR ? 1060 : 780;
  b += label(KX, 140, tr("KIOSK STAFFING", "تشغيل الكشك"), 13, C.smoke, KA) + label(KX, 170, tr("2 baristas per shift (peak), 1 off-peak", "باريستا اثنان في الوردية وقت الذروة، وواحد خارجها"), 13, C.night, KA) + label(KX, 198, tr("Menu: espresso + milk + cold + 6 signatures +", "المنيو: إسبريسو + حليب + باردة + 6 مشروبات مميزة +"), 13, C.night, KA) + label(KX, 218, tr("packaged pastry (no on-site baking)", "معجنات جاهزة (بلا خَبز في الموقع)"), 13, C.night, KA) + label(KX, 270, tr("Equipment (est.): 2-group machine, 2 grinders,", "المعدات (تقديري): ماكينة مجموعتين، مطحنتان،"), 13, C.night, KA) + label(KX, 290, tr("under-counter fridges ×2, ice maker, display case,", "ثلاجتان تحت الكاونتر، ماكينة ثلج، ثلاجة عرض،"), 13, C.night, KA) + label(KX, 310, tr("POS, water filtration", "كاشير، فلترة مياه"), 13, C.night, KA);
  b += label(KX, 380, tr("Schematic only — verify with architect and landlord.", "مخطط توضيحي فقط، ويُراجَع مع المهندس والمالك."), 12, C.smoke, KA);
  return svg(W, H, b);
}
