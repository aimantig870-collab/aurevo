// Builds the Brand & Franchise Starter Kit: PDF + asset folders + PNG exports + costing data.
// Run: npm run kit   (rename: BRAND_NAME="X" BRAND_DESCRIPTOR="Y" BRAND_SLOGAN="Z" npm run kit)
import { mkdirSync, writeFileSync, readdirSync, copyFileSync, rmSync, existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { categories, products, margin, money } from "../src/data/menu.ts";
import { standardRecipes } from "../src/data/standard-recipes.ts";
import { palette, values, personas } from "../src/data/brand.ts";
import { NAME, DESCRIPTOR, SLOGAN, SLUG, DOMAIN } from "./brand-config.mjs";
import { cupSizesSvg, flagshipPlanSvg, kioskPlanSvg, hotCups, coldCups } from "./kit-art.mjs";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const KIT = path.join(ROOT, "brand-kit");
const ASSETS = path.join(KIT, "assets");
const T = (s = "") => String(s).replaceAll("Aurevo", NAME).replaceAll("AUREVO", NAME.toUpperCase()).replaceAll("aurevo", SLUG);
const esc = (s = "") => T(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const A = (p) => `../assets/${p}`;

// ------------------------------------------------------------------ 1. artwork into brand-kit/assets
rmSync(ASSETS, { recursive: true, force: true });
mkdirSync(ASSETS, { recursive: true });
const { execFileSync } = await import("node:child_process");
execFileSync("node", ["scripts/generate-art.mjs"], { cwd: ROOT, env: { ...process.env, ART_OUT: ASSETS }, stdio: "pipe" });
mkdirSync(path.join(ASSETS, "kit"), { recursive: true });
writeFileSync(path.join(ASSETS, "kit/cup-sizes.svg"), cupSizesSvg());
writeFileSync(path.join(ASSETS, "kit/floorplan-flagship.svg"), flagshipPlanSvg());
writeFileSync(path.join(ASSETS, "kit/floorplan-kiosk.svg"), kioskPlanSvg());

// ------------------------------------------------------------------ 2. content helpers
const sig = products.filter((p) => p.tier === "signature");
const rec = (p) => (p.ingredients?.length ? { ingredients: p.ingredients, method: p.method ?? [], note: "" } : standardRecipes[p.slug] ?? { ingredients: [], method: [] });
const rgb = (hex) => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const cmyk = (hex) => { const [r, g, b] = rgb(hex).map((v) => v / 255); const k = 1 - Math.max(r, g, b); if (k === 1) return [0, 0, 0, 100]; return [(1 - r - k) / (1 - k), (1 - g - k) / (1 - k), (1 - b - k) / (1 - k), k].map((v) => Math.round(v * 100)); };

const pages = []; // { section, dark?, html }
const add = (section, html, dark = false) => pages.push({ section, html, dark });
const head = (eyebrow, title, sub = "") => `<div class="hd"><p class="eb">${esc(eyebrow)}</p><h2>${title}</h2>${sub ? `<p class="sub">${esc(sub)}</p>` : ""}</div>`;
const img = (src, cls = "") => `<img class="${cls}" src="${A(src)}" alt="">`;
const tbl = (rows, cols, cls = "") => `<table class="${cls}"><thead><tr>${cols.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
const ul = (a) => `<ul>${a.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
const callout = (t) => `<div class="note">${t}</div>`;

// ---- cover
add("Cover", `<div class="cover"><img class="clogo" src="${A("logo/logo-primary-light.svg")}" alt=""><div><p class="eb gold">Brand &amp; Franchise Starter Kit</p><h1>${esc(NAME)}</h1><p class="cs">${esc(DESCRIPTOR)} — “${esc(SLOGAN)}”</p></div><p class="fine">Version 1.0 · Concept stage. Everything in this kit is a proposal: recipes are untested, prices and financial figures are estimates, the name is not trademark-cleared and no franchise is currently offered. See page 4.</p></div>`, true);

// ---- contents is inserted later (needs page numbers)
add("Contents", "__TOC__");

add("Overview", `${head("The concept", `A café built for the <em>golden hour</em>`, "Positioning, promise and personality")}
<div class="cols3"><div><h3>Positioning</h3><p>An accessible-luxury specialty café: a rigorous coffee base with world-pantry flavours — saffron, date, sesame, pandan, miso, tamarind, ube — in a space designed around warm light.</p><h3>Mission</h3><p>Make the quiet part of the day feel special, with drinks that surprise and standards that travel.</p><h3>Vision</h3><p>A recognisable international brand grown carefully: one proven location first, partners only when operations are validated.</p></div>
<div><h3>Slogan</h3><p class="big">“${esc(SLOGAN)}”</p><h3>Personality</h3><p>Warm · assured · curious · unhurried · generous · precise.</p><h3>Voice</h3><p>Short sentences, sensory words, a little poetry. Never pushy; never claims we can’t prove (“proposed”, “we’d pour” — not “world’s best”).</p></div>
<div><h3>Values</h3>${ul(values.map((v) => `${v.title} — ${v.body}`))}</div></div>`);

add("Overview", `${head("Who it is for", "Customers and operators", "Fictional planning archetypes — not research findings")}
<div class="cards4">${personas.map((p) => `<div class="card"><h3>${esc(p.name)}</h3><p class="eb">${esc(p.role)}</p><p>${esc(p.need)}</p><p class="fine">Try: ${esc(p.hook)}</p></div>`).join("")}</div>
<div class="cols2" style="margin-top:20px"><div><h3>Competitive position</h3>${ul(["Global chains: convenient, flavour-generic → we are distinctive and warmer.", "Third-wave specialty cafés: excellent coffee, austere → same craft, friendlier flavour-led menu.", "Trend-led dessert/tea brands: viral, light on coffee → trend flavours built on real espresso technique."])}</div>
<div><h3>Differentiation</h3>${ul(["14 original signature drinks with documented recipes.", "One ownable visual idea: the sun rising from a cup.", "A complete operating system: standards, SOPs, training, QC.", "Radical honesty about what is tested and what is proposed."])}</div></div>`);

add("Overview", `${head("Read this first", "Honest status of this brand", "What is done, what is estimated, what is still required")}
<div class="cols3"><div class="card"><h3>✓ Done in this kit</h3>${ul(["Brand strategy, name, slogan", "Logo system, colours, type, pattern, icons", "Cup, packaging, uniform, signage, menu designs", "Store concept, floor plans, equipment & fit-out specs", "41 menu items with proposed recipes & sizes", "Operations manual, training & QC framework", "Franchise package outline & economic scenarios"])}</div>
<div class="card"><h3>≈ Estimated</h3>${ul(["Ingredient costs and selling prices", "Equipment & fit-out budgets", "All revenue and profit scenarios", "Cup dimensions (confirm with supplier)", "Fee levels (placeholders, not set)"])}</div>
<div class="card warn"><h3>✗ Still required before opening or franchising</h3>${ul(["Bench-test every recipe (3 trials, taster panel)", "Official trademark search in each country", "Supplier quotes for all costs", "Local legal counsel: franchise disclosure rules", "Food-safety & allergen validation, permits", "A pilot café generating real sales data"])}</div></div>`);

// ---- identity
add("Identity", `${head("Logo system", "The sun rises from the cup", "Custom monoline lettering — the “O” is the sun on the horizon")}
<div class="logos"><div class="lg l1"><img src="${A("logo/logo-primary.svg")}" alt=""><p>Primary logo</p></div><div class="lg dk"><img src="${A("logo/logo-primary-light.svg")}" alt=""><p>Primary — reversed</p></div><div class="lg"><img src="${A("logo/logo-secondary.svg")}" alt="" style="height:230px"><p>Secondary (stacked)</p></div><div class="lg"><img src="${A("logo/symbol.svg")}" alt="" style="height:110px"><p>Symbol</p></div><div class="lg"><img src="${A("logo/monogram.svg")}" alt="" style="height:110px"><p>Monogram</p></div><div class="lg"><img src="${A("logo/wordmark.svg")}" alt="" style="width:90%"><p>Wordmark</p></div></div>`);
add("Identity", `${head("Logo rules", "Using the logo correctly")}
<div class="cols3"><div class="card"><h3>Clear space</h3><p>Keep a margin equal to the height of the first letter on all sides. Nothing may enter this zone.</p><h3>Minimum size</h3><p>Primary logo: 28 px / 10 mm high. Symbol alone: 16 px / 6 mm. Below this use the symbol only.</p></div>
<div class="card"><h3>Colour versions</h3><p>Dark logo on Crema/Oat; reversed (Crema) logo on Espresso Night; one-colour Espresso for stamps/foil; one-colour Crema for dark packaging. Gold sun only on the full-colour versions.</p></div>
<div class="card warn"><h3>Never</h3>${ul(["Stretch, rotate or outline the logo", "Recolour outside the palette", "Add shadows, gradients or effects", "Place on busy photography without a solid plate", "Re-draw the letters or substitute a font", "Use the symbol and wordmark in a new arrangement"])}</div></div>`);
add("Identity", `${head("Colour", "Espresso, crema and a drop of sun", "Match to your printer’s nearest Pantone; values below are screen/approximate CMYK")}
<div class="sw">${[...palette.primary, ...palette.secondary].map((c) => { const [r, g, b] = rgb(c.hex); const [C, M, Y, K] = cmyk(c.hex); return `<div><i style="background:${c.hex}"></i><h4>${esc(c.name)}</h4><p>${c.hex}<br>RGB ${r}·${g}·${b}<br>CMYK ≈ ${C}·${M}·${Y}·${K}</p><p class="fine">${esc(c.use)}</p></div>`; }).join("")}</div>
${callout("<b>Accessibility:</b> gold (Aurum) on cream fails text contrast. For gold text on light backgrounds use Bronze #8A5A1E; use Aurum for fills and for text on Espresso Night.")}`);
add("Identity", `${head("Type, pattern and icons", "Instrument Serif + Hanken Grotesk")}
<div class="cols3"><div class="card"><p class="serif" style="font-size:64px;line-height:1">Aa <em>Golden hour</em></p><p class="eb">Display — Instrument Serif (Regular, Italic)</p><p class="fine">Headlines, menu item names, cup quotes. Free (Google Fonts / OFL).</p><p style="font:600 22px Hanken Grotesk Variable">Aa Slow down. Glow up.</p><p class="eb">Body &amp; UI — Hanken Grotesk 400–700</p><p class="fine">Eyebrow labels: 12 px, +22% tracking, uppercase.</p></div>
<div class="card"><h3>Pattern — “Sunrise tile”</h3><div class="pat" style="background-image:url(${A("mockups/napkin.svg")})"></div><p class="fine">Arc + horizon + three rays. Use on napkins, bag interiors, tissue, wrapping; never behind text.</p></div>
<div class="card"><h3>Icon set</h3><div class="icons">${["cup", "bean", "sun", "leaf", "croissant", "pin", "bag", "clock"].map((i) => `<img src="${A(`icons/${i}.svg`)}" alt="">`).join("")}</div><p class="fine">3 px line, round caps, 64 px grid. For menu boards, loyalty cards, signage wayfinding.</p></div></div>`);

// ---- cups
add("Cups & packaging", `${head("Cup programme", "Sizes, volumes and dimensions", "Hot: 4 sizes · Cold: 3 sizes · Espresso: ceramic")}
<img class="wide" src="${A("kit/cup-sizes.svg")}" alt="">
<p class="fine" style="margin-top:8px">Naming on menu: Piccolo (4 oz) · Small (8) · Medium (12) · Large (16) · cold XL (22). Espresso 2 oz and Doppio 3 oz are served in ceramic.</p>`);
add("Cups & packaging", `${head("Cup specification", "What to order from the supplier")}
${tbl([["Hot cup 4 / 8 / 12 / 16 oz", "Double-wall paper (no sleeve needed) or single-wall + sleeve", "Dark Espresso body, Crema logo, gold foil/ink band", "Fits 80 mm lid (4 oz) / 90 mm lid (8–16 oz); matt black lid with sip hole"], ["Cold cup 12 / 16 / 22 oz", "Clear PET (rPET preferred) or PLA where local compost infrastructure exists", "Logo stamp + sunrise band printed 1-colour white/gold", "98 mm dome lid (cream/foam), flat lid (iced coffee); paper straw Ø8 mm"], ["Espresso 2 oz / Doppio 3 oz", "Ceramic, matt black or Crema glaze", "Symbol on base, no print on body", "Saucer with sparkling-water shot glass"], ["Paper sleeve", "Kraft or Crema, 1-colour Espresso", "Pattern + logo", "For single-wall cups"], ["Takeaway tray / carrier", "Moulded fibre", "Debossed symbol", "2- and 4-cup"]], ["Item", "Material", "Print / finish", "Lid & accessories"])}
${callout("Print notes: supply vector artwork (SVG/PDF in <b>assets</b>) and request the supplier’s die-line template — the mockups here are not production dielines. Minimum order quantities for custom print are typically 10,000+ cups; use stock plain black cups + stickers/sleeves for the pilot.")}`);
add("Cups & packaging", `${head("Cup artwork", "Hot and cold")}
<div class="duo">${img("mockups/hot-cup.svg", "mk")}${img("mockups/cold-cup.svg", "mk")}</div><p class="fine">Artwork shown is the identity mockup. Colours: Espresso Night body, Crema logo, Aurum band. Cold cup: Ember drink colour is illustrative only.</p>`);
add("Cups & packaging", `${head("Packaging", "Bags, boxes, napkins, labels")}
<div class="grid5">${["coffee-bag:Whole-bean bag (250 g)", "paper-bag:Takeaway paper bag", "pastry-box:Pastry box", "napkin:Napkin", "product-label:Bottle label (cold brew 500 ml)"].map((s) => { const [f, t] = s.split(":"); return `<div>${img(`mockups/${f}.svg`, "mk")}<p>${t}</p></div>`; }).join("")}</div>
<p class="fine">Coffee bag: 250 g kraft/black stand-up pouch with one-way valve; label states blend, roast date, tasting notes and brew guide. Paper bags: 80–100 gsm natural kraft with 1-colour logo and sunrise pattern interior.</p>`);
add("Cups & packaging", `${head("Uniform, print and signage", "The brand on people and storefront")}
<div class="grid4">${["uniform:Barista apron — charcoal, gold stitching, symbol on chest", "menu:Menu card / board", "business-card:Business cards", "signage:Storefront fascia + blade sign"].map((s) => { const [f, t] = s.split(":"); return `<div>${img(`mockups/${f}.svg`, "mk")}<p>${t}</p></div>`; }).join("")}</div>
<p class="fine">Uniform: charcoal apron, Crema or white tee, black trousers/jeans, Aurum name badge. Fabric: 240 gsm cotton-twill, adjustable neck, cross-back straps, 2 front pockets.</p>`);

// ---- store design
add("Store design", `${head("Store concept", "A lantern on the street", "Concept illustrations — not architectural drawings")}
<div class="trio">${img("cafe/exterior-day.svg", "mk16")}${img("cafe/exterior-night.svg", "mk16")}${img("cafe/interior-wide.svg", "mk16")}</div>
<div class="trio">${img("cafe/counter.svg", "mk16")}${img("cafe/seating.svg", "mk16")}${img("cafe/product-studio.svg", "mk16")}</div>`);
add("Store design", `${head("Design standards", "Materials, lighting, furniture, signage")}
<div class="cols3"><div class="card"><h3>Architecture &amp; materials</h3>${ul(["Arched openings (or arch-shaped graphic/wall niches if structure is fixed)", "Lime plaster / textured paint in Crema", "Oak (or oak-effect) counter top, charcoal counter base", "Terracotta tile or panels as accent", "Blackened steel window frames, brass-finish details"])}</div>
<div class="card"><h3>Lighting</h3>${ul(["2700 K warm white throughout (CRI ≥ 90)", "Brass pendants over the counter, 40–50 lux ambient seating, 300 lux at the bar", "Dimmable; scene: “Golden hour” 4–6 pm at 70%", "Amber glow visible through the façade at night", "Backlit logo fascia (LED, 3000 K max)"])}</div>
<div class="card"><h3>Furniture &amp; decor</h3>${ul(["Terracotta banquette along windows", "Round oak two-tops; one communal table", "Leather-topped stools at the bar", "Cardamom-green planting (real/preserved)", "Open oak shelving for retail beans", "One feature wall carrying the symbol"])}</div></div>`);
add("Store design", `${head("Floor plan — flagship", "≈ 90 m² · ≈ 26 seats")}<img class="wide" src="${A("kit/floorplan-flagship.svg")}" alt="">`);
add("Store design", `${head("Floor plan — kiosk", "≈ 20 m² compact format")}<img class="wide" src="${A("kit/floorplan-kiosk.svg")}" alt="">`);

const equip = [["Espresso machine, 2-group (or 3-group if > 200 tx/day)", 15, 19], ["Espresso grinders ×2 (+ 1 for single-origin/decaf)", 3, 5], ["Cold-brew system (kegs / fridge) + dispensing", 1.5, 3.5], ["Ice machine (≈ 90 kg/day)", 3, 4.5], ["Under-counter refrigeration ×3 + freezer", 6, 9], ["Pastry display (chilled) + gelato display (affogato)", 3, 5], ["Convection oven (finishing/baking)", 3, 5], ["Glasswasher / dishwasher", 3, 4.5], ["Water filtration + softening", 1, 2], ["POS + printer + KDS tablet", 1.5, 3], ["Smallwares: pitchers, scales, tampers, shakers, glassware, trays", 4, 7.5], ["Blenders ×2 and torch/cloche for table-side finishing", 1, 2]];
const eLow = equip.reduce((s, r) => s + r[1], 0), eHigh = equip.reduce((s, r) => s + r[2], 0);
add("Store design", `${head("Equipment list — flagship", `≈ US$${eLow.toFixed(1)}k – ${eHigh.toFixed(1)}k (estimate)`, "Specifications by category — obtain at least three supplier quotes per line")}
${tbl([...equip.map(([n, l, h]) => [esc(n), `$${l}k`, `$${h}k`]), [`<b>Total (estimate)</b>`, `<b>$${eLow.toFixed(1)}k</b>`, `<b>$${eHigh.toFixed(1)}k</b>`]], ["Equipment", "Low", "High"])}
<p class="fine">Prices vary widely by country, new vs. refurbished and lease vs. purchase. Electrical, plumbing and ventilation capacity must be confirmed by an engineer before ordering.</p>`);

// ---- menu overview
const menuRows = [];
for (const c of categories) for (const p of products.filter((x) => x.category === c.slug)) menuRows.push([esc(c.name), `<b>${esc(p.name)}</b>${p.tier === "signature" ? " ★" : ""}`, esc(p.cupSize), esc(p.temperature), money(p.priceUsd), money(p.costUsd), `${margin(p)}%`]);
for (let i = 0; i < menuRows.length; i += 14) add("Menu & recipes", `${head("Menu overview", `Items ${i + 1}–${Math.min(i + 14, menuRows.length)} of ${menuRows.length}`, "★ = signature · prices and costs are estimates in USD · margin = ingredients only")}${tbl(menuRows.slice(i, i + 14), ["Category", "Item", "Size", "Serving temp.", "Price", "Est. cost", "Margin"], "sm")}`);

// ---- recipe cards
sig.forEach((p, i) => {
  const r = rec(p);
  add("Signature recipes", `<div class="rc"><div class="rimg"><img src="${A(`drinks/${p.slug}.svg`)}" alt=""><p class="fine">Concept illustration · № ${String(i + 1).padStart(2, "0")} of 14</p></div>
<div class="rbody"><p class="eb">${esc(categories.find((c) => c.slug === p.category)?.name ?? "")} · ${p.serve === "either" ? "hot or iced" : esc(p.serve)} · <b class="stamp">PROPOSED — UNTESTED</b></p><h2 class="rt">${esc(p.name)}</h2><p class="tag">${esc(p.tagline)}</p>
<div class="spec"><div><span>Cup size</span>${esc(p.cupSize)}</div><div><span>Serving temp.</span>${esc(p.temperature)}</div><div><span>Price (est.)</span>${money(p.priceUsd)}</div><div><span>Ingr. cost (est.)</span>${money(p.costUsd)}</div><div><span>Ingr. margin</span>${margin(p)}%</div><div><span>Caffeine</span>${p.caffeine === "none" ? "none" : p.caffeine === "optional" ? "optional" : "yes"}</div></div>
<div class="two"><div><h4>Ingredients &amp; proposed quantities</h4><table class="ing">${r.ingredients.map((x) => `<tr><td>${esc(x.item)}</td><td>${esc(x.qty)}</td></tr>`).join("")}</table></div><div><h4>Preparation</h4><ol>${r.method.map((m) => `<li>${esc(m)}</li>`).join("")}</ol></div></div>
<div class="foot3"><div><h4>Presentation</h4><p>${esc(p.presentation)}</p></div><div><h4>Garnish</h4><p>${esc(p.garnish)}</p></div><div><h4>Target customer</h4><p>${esc(p.target)}</p></div></div><p class="story">“${esc(p.story)}”</p></div></div>`);
});
const classicsList = products.filter((p) => p.tier === "classic");
const weight = (p) => { const r = rec(p); return r.ingredients.map((x) => x.item.length + x.qty.length + 4).reduce((a, b) => a + b, 0) + r.method.join(" ").length + (r.note?.length ?? 0) + 120; };
const stdChunks = []; { let cur = [], w = 0; for (const p of classicsList) { const pw = weight(p); if (cur.length && (w + pw > 1500 || cur.length >= 5)) { stdChunks.push(cur); cur = []; w = 0; } cur.push(p); w += pw; } if (cur.length) stdChunks.push(cur); }
for (const chunk of stdChunks) {
  add("Standard recipes", `${head("Standard recipes", "Classic menu — preparation specs", "Proposed · untested · every milk drink is built on the standard double (18 g in / 36 g out)")}
<div class="std">${chunk.map((p) => { const r = rec(p); return `<div class="sr"><h4>${esc(p.name)} <span>${esc(p.cupSize)} · ${esc(p.temperature)} · ${money(p.priceUsd)}</span></h4>${r.yield ? `<p class="fine">Yield: ${esc(r.yield)}</p>` : ""}<p class="ingl">${r.ingredients.map((x) => `${esc(x.item)} <b>${esc(x.qty)}</b>`).join(" · ")}</p><p class="mth">${r.method.map((m, k) => `${k + 1}. ${esc(m)}`).join(" ")}</p>${r.note ? `<p class="fine">${esc(r.note)}</p>` : ""}</div>`; }).join("")}</div>`);
}

// ---- costing & pricing
const sigAvg = sig.reduce((s, p) => s + margin(p), 0) / sig.length;
add("Menu & recipes", `${head("Costing & pricing logic", "How the numbers were built", "Planning estimates — replace with supplier quotes")}
<div class="cols3"><div class="card"><h3>Ingredient cost basis</h3>${ul(["Specialty beans ≈ $25/kg → 18 g dose ≈ $0.45", "Whole milk ≈ $1.30/L · oat ≈ $2.60/L", "Syrups/pastes made in-house at stated batch specs", "Excludes packaging (≈ $0.25–0.40 per drink), labour, rent, wastage"])}</div>
<div class="card"><h3>Price logic</h3>${ul(["Classic espresso/milk drinks priced to sit within the premium-specialty band of the market", "Signature drinks +$1–2 over a comparable classic for the craft and ingredients", "Target blended ingredient margin ≈ 75–80%; blended cost of goods incl. packaging ≈ 27%"])}</div>
<div class="card"><h3>Results (estimates)</h3><p class="big">${sigAvg.toFixed(0)}%</p><p>average ingredient margin across the 14 signatures</p><p class="fine">Spreadsheet with formulas: <b>${esc(SLUG)}-menu-costing.xlsx</b> — change any cost or price and margins recalculate.</p></div></div>`);

// ---- operations
add("Operations manual", `${head("Preparation standards", "The rules behind every drink")}
<div class="cols3"><div class="card"><h3>Espresso</h3>${ul(["Standard double: 18 g in / 36 g out / 25–30 s / 93 °C", "Single: 9 g in / 18 g out", "Dial in at opening and after each bag change; log dose, yield, time", "Discard shots outside 22–32 s; tamp level ≈ 15 kg", "Grinder purged before first dose; hoppers filled ≤ 3 days"])}</div>
<div class="card"><h3>Milk &amp; syrups</h3>${ul(["Steam to 60–62 °C (oat 60 °C max); never re-steam", "Fridge ≤ 4 °C; discard opened milk after 3 days", "Syrups labelled with date; discard per shelf-life (saffron/date/sesame/pandan/tamarind ≤ 2 weeks chilled)", "Ube, miso, sesame, honey items: wash scoops between uses (allergen control)"])}</div>
<div class="card"><h3>Cold &amp; presentation</h3>${ul(["Cold brew batches ≤ 5 days, filtered, labelled", "Ice: fresh, from sealed machine; scoop never touches hands", "Garnish per recipe card; photograph reference for each drink", "Tableside items (affogato, Dusk Ember cloche) only in the café, not on delivery"])}</div></div>`);
add("Operations manual", `${head("Daily operating checklists", "Open · service · close")}
<div class="cols3"><div class="card"><h3>Opening (≈ 45 min before)</h3>${ul(["Lights, music, HVAC; walk the floor — cleanliness check", "Machine on and up to temperature; flush groups", "Grinder purge; dial-in; taste and log", "Fridge temp check (≤ 4 °C); stock syrups and milk with dates", "Bake/finish pastry; fill display; set menu board", "Float and POS check; payment test"])}</div>
<div class="card"><h3>Service</h3>${ul(["Greet within 10 s; say the name of the drink back", "Ticket-time target: espresso/milk ≤ 4 min, cold ≤ 5 min", "Wipe steam wand after every use; purge", "Restock every hour: cups, lids, ice, milk", "Toilets checked every 60 min with a log sheet", "Complaint → fix first, apologise, log"])}</div>
<div class="card"><h3>Closing</h3>${ul(["Backflush machine; clean group heads, wands, drip trays", "Empty and clean grinders as per schedule", "Cover/store milk and syrups; label and date", "Waste log; count and record cash", "Mop; take out rubbish; lock up", "Order sheet for tomorrow"])}</div></div>`);
add("Operations manual", `${head("Quality control", "How we check every location", "Scored monthly by the franchisor/area manager")}
${tbl([["Taste & recipe compliance", "5 randomly chosen drinks tasted against recipe card", "30"], ["Appearance & presentation", "Garnish, glassware, foam quality vs. photo reference", "15"], ["Cleanliness & hygiene", "Floor, counter, toilets, staff hygiene, pest checks", "20"], ["Service speed & friendliness", "Ticket-time sample, greeting, order accuracy", "15"], ["Food safety & records", "Fridge logs, date labels, allergen control, cleaning logs", "15"], ["Brand standards", "Uniform, signage, playlist, scent, menu accuracy", "5"]], ["Category", "What is checked", "Points"])}
<p class="fine">Pass mark ≥ 90/100. Below 80 triggers a corrective-action plan within 7 days and re-inspection within 30 days. Customer complaints answered within 48 h.</p>`);
add("Operations manual", `${head("People", "Staffing, roles and the 4-week training programme")}
<div class="cols2"><div class="card"><h3>Flagship staffing (typical, assumption)</h3>${ul(["1 Manager (full-time)", "1 Head barista / trainer", "4–6 Baristas (rota, 2–3 per shift)", "1–2 Kitchen/pastry assistants", "1–2 Floor/cleaning staff", "Total ≈ 8–11 people (≈ 6–7 FTE)"])}<p class="fine">Labour model varies strongly with country, wages and opening hours.</p></div>
<div class="card"><h3>Training programme</h3>${tbl([["Week 1", "Hospitality, hygiene &amp; food safety, menu knowledge, POS"], ["Week 2", "Espresso, dialling in, milk steaming, latte art basics"], ["Week 3", "All 14 signatures, syrups &amp; garnishes, cold bar"], ["Week 4", "Service flow, rush simulation, closing; certification test"]], ["When", "Content"])}<p class="fine">Certification: practical test (10 drinks to spec) + written test ≥ 85%. Refresher every 6 months.</p></div></div>`);
add("Operations manual", `${head("Supply & inventory", "What to source and how to control it")}
<div class="cols3"><div class="card"><h3>Core suppliers to qualify</h3>${ul(["Roaster (house blend + 3 single-origins)", "Dairy and barista oat milk", "Spices & pantry (saffron, cardamom, miso, pandan, tamarind, ube, sesame, hojicha, matcha)", "Chocolate couverture, honey, syrups base", "Bakery supplier or commissary", "Cups, lids, packaging, cleaning"])}</div>
<div class="card"><h3>Par levels (starting rule)</h3>${ul(["Beans: 7 days; milk: 2 days; syrups: made weekly", "Packaging: 4 weeks", "Perishables ordered daily/alt-day", "FIFO labels on everything; weekly stock count", "Target waste ≤ 3% of COGS"])}</div>
<div class="card"><h3>Quality of supply</h3>${ul(["Written spec sheet per ingredient", "Food-safety certificates on file", "Roast date ≤ 21 days at use", "Two approved suppliers for each critical item", "Franchisee sourcing rules to be defined by contract"])}</div></div>`);

// ---- marketing
add("Marketing", `${head("Marketing kit", "Launch plan and social guidelines", "Full strategy and 30-day content calendar in the accompanying documents")}
<div class="cols3"><div class="card"><h3>Channels &amp; roles</h3>${ul(["Instagram: brand home, Reels, Stories polls", "TikTok: recipe process and flavour explainers", "Pinterest: evergreen drink and space pins", "Facebook: partners, events, local community"])}</div>
<div class="card"><h3>Pre-opening (8 weeks)</h3>${ul(["W1–2: reveal brand, name story, palette", "W3–4: recipe development, taster panels (real)", "W5–6: space reveal, creator tastings", "W7–8: opening week schedule, waitlist offer"])}</div>
<div class="card warn"><h3>Rules</h3>${ul(["No fake followers, reviews or sales claims", "Label concept art as concept until real", "Disclose gifted/paid content", "Never promise earnings to prospective franchisees"])}</div></div>`);

// ---- franchise
add("Franchise package", `${head("The franchise package", "What a partner would receive", "Status column shows what exists today")}
${tbl([["Brand identity files (logos, colours, type, patterns, icons)", "In this kit (SVG/PNG)"], ["Packaging & cup artwork", "Identity mockups in this kit; production dielines required"], ["Menu & recipe book (41 items) + sizes", "In this kit — recipes untested"], ["Costing spreadsheet", "In this kit — estimates"], ["Store design guide, floor plans (flagship, kiosk)", "In this kit — schematic; architect needed"], ["Equipment & fit-out specifications", "In this kit — categories and budgets"], ["Operations manual (SOPs, QC, training)", "Framework in this kit — validate in pilot"], ["Marketing kit & launch plan", "Strategy in this kit"], ["Supplier introductions & purchasing terms", "To be built"], ["Franchise agreement & disclosure documents", "<b>Not drafted — lawyer required</b>"], ["Pilot-validated unit economics", "<b>Not yet available</b>"], ["Ongoing support (field visits, QC audits, menu updates)", "To be defined"]], ["Component", "Status"])}`);
add("Franchise package", `${head("Formats", "Three ways to open")}
<div class="cols3"><div class="card"><h3>Flagship café</h3><p>≈ 80–120 m², ≈ 26 seats, full menu incl. desserts and retail beans.</p><p class="big">≈ $${(126 + eLow + 10 + 6 + 10 + 30).toFixed(0)}k – $${(198 + eHigh + 20 + 10 + 20 + 50).toFixed(0)}k</p><p class="fine">all-in start-up estimate (see next page)</p></div><div class="card"><h3>Kiosk</h3><p>≈ 15–30 m², take-away focus, 6 signatures + classics, packaged pastry.</p><p class="big">to be estimated</p><p class="fine">expected well below flagship; needs local quotes</p></div><div class="card"><h3>Shop-in-shop licence</h3><p>Signature drinks and design elements inside an existing café, supplied syrups/pastes.</p><p class="big">licence fee model</p><p class="fine">per-venue annual + per-drink royalty — to be set</p></div></div>`);
add("Franchise package", `${head("Start-up budget", "Flagship café — estimate", "Replace every line with local quotes")}
${tbl([["Fit-out (≈ 90 m² × $1,400–2,200/m²)", "$126k", "$198k"], ["Equipment (see equipment list)", `$${eLow.toFixed(0)}k`, `$${eHigh.toFixed(0)}k`], ["Permits, deposits, legal", "$10k", "$20k"], ["Opening inventory", "$6k", "$10k"], ["Pre-opening training & marketing", "$10k", "$20k"], ["Working-capital reserve (≈ 3 months)", "$30k", "$50k"], ["<b>Total</b>", "<b>≈ $227k</b>", "<b>≈ $368k</b>"]], ["Item", "Low", "High"])}
<p class="fine">Does not include franchise/licence fees (not set). The equipment line uses the range from the equipment list.</p>`);
add("Franchise package", `${head("Unit economics", "Annual scenarios — one café (estimates)", "Assumptions: ticket $9.50 · 360 days · COGS 27% · rent $84k · other opex $60k + 3% of revenue")}
${tbl([["Transactions / day", "120", "200", "280"], ["Revenue", "$410,400", "$684,000", "$957,600"], ["COGS (27%)", "$110,808", "$184,680", "$258,552"], ["Labour", "$200,000", "$230,000", "$270,000"], ["Rent", "$84,000", "$84,000", "$84,000"], ["Other opex", "$72,312", "$80,520", "$88,728"], ["<b>EBITDA</b>", "<b>–$56,720 (–13.8%)</b>", "<b>$104,800 (15.3%)</b>", "<b>$256,320 (26.8%)</b>"]], ["", "Low", "Base", "High"])}
${callout("<b>Read honestly:</b> the low case loses money; the base case would take roughly 2–4 years to recover the investment before ramp-up, tax, financing and owner pay; the high case is optimistic. Transactions/day are scenarios, not forecasts. These are not earnings claims.")}`);
add("Franchise package", `${head("Process", "From first conversation to opening", "Typical timeline 6–9 months (assumption)")}
<div class="steps">${["Enquiry (form / call)", "Qualification: experience, capital, market", "Information pack — only once legally permitted", "Disclosure period + legal review", "Site approval (traffic, rent, permits)", "Agreement signed", "Design, fit-out, equipment, hiring", "Training (4 weeks) + pre-opening audit", "Opening + 90-day support"].map((s, i) => `<div><b>${i + 1}</b><p>${esc(s)}</p></div>`).join("")}</div>
<div class="cols2" style="margin-top:18px"><div class="card warn tight"><h3>Readiness gates — do not offer a franchise until all are met</h3>${ul(["Pilot café operated with real sales data", "Recipes bench-tested; costs verified with quotes", "Trademarks searched and registered per country", "Disclosure documents drafted by local counsel", "Operations manual validated in the pilot", "Audited unit economics"])}</div>
<div class="card tight"><h3>Fees (placeholders — not set)</h3>${ul(["Initial franchise fee: to be defined", "Royalty: to be defined (market norms vary; 4–8% of sales is common — not benchmarked here)", "Marketing fund: to be defined", "Territory & term: to be defined by counsel"])}</div></div>`);
add("Legal & next steps", `${head("Legal & compliance checklist", "Before any commercial use")}
<div class="cols3"><div class="card"><h3>Brand</h3>${ul(["Official trademark search + registration (classes 30, 35, 43) in each country", "Domain names and social handles secured", "Copyright assignment for all designs and lettering", "Font licences (both fonts are open-licence)"])}</div><div class="card"><h3>Franchise / licensing</h3>${ul(["Local franchise-law review (many countries require disclosure documents and registration)", "Franchise agreement, brand manual, territory rules", "Recipe confidentiality & IP protection", "Insurance and liability allocation"])}</div><div class="card"><h3>Operations</h3>${ul(["Food-business licence, HACCP/food-safety plan", "Allergen labelling (milk, nuts, sesame, gluten, soy)", "Fire, health, signage, music-licensing permits", "Employment contracts and training records"])}</div></div>
<p class="fine" style="margin-top:14px">This kit is not legal, tax or investment advice.</p>`);
add("Legal & next steps", `${head("Next steps", "From concept to a first location")}
<div class="steps">${["Choose and legally clear the final name", "Bench-test and finalise recipes", "Get supplier quotes; update costing", "Select site; engage architect", "Order cups/packaging for pilot", "Open pilot café / pop-up", "Collect 3–6 months of real data", "Engage counsel; build franchise documents"].map((s, i) => `<div><b>${i + 1}</b><p>${esc(s)}</p></div>`).join("")}</div>
<div class="contact"><p class="eb gold">Contact</p><p>${esc(NAME)} · partners@${DOMAIN} · [phone] · [address]</p></div>`, true);

// ------------------------------------------------------------------ 3. assemble HTML
const sections = [];
pages.forEach((p, i) => { if (!sections.find((s) => s.name === p.section)) sections.push({ name: p.section, page: i + 1 }); });
const toc = `${head("Contents", "What is inside")}<ol class="toc">${sections.filter((s) => !["Cover", "Contents"].includes(s.name)).map((s) => `<li><span>${esc(s.name)}</span><i></i><b>${s.page}</b></li>`).join("")}</ol><div class="note" style="margin-top:20px"><b>Also in the folder:</b> <code>assets/</code> (all logos, mockups, drink art, store scenes as SVG), <code>assets-png/</code> (PNG exports), <code>${esc(SLUG)}-menu-costing.xlsx</code>.</div>`;
const fontDir = path.join(ROOT, "node_modules");
const css = `
@font-face{font-family:'Instrument Serif';src:url('file://${fontDir}/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2');font-style:normal}
@font-face{font-family:'Instrument Serif';src:url('file://${fontDir}/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2');font-style:italic}
@font-face{font-family:'Hanken Grotesk Variable';src:url('file://${fontDir}/@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2');font-weight:100 900}
@page{size:1280px 720px;margin:0}
*{box-sizing:border-box;margin:0}body{font-family:'Hanken Grotesk Variable',sans-serif;color:#1B120D;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:1280px;height:720px;position:relative;overflow:hidden;page-break-after:always;background:#F4EBDD;padding:44px 60px 54px}
.page.dark{background:#1B120D;color:#F4EBDD}
.ft{position:absolute;left:60px;right:60px;bottom:18px;display:flex;justify-content:space-between;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#6B5C50}
.dark .ft{color:#D9C6A8}
.eb{font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#A4492B}.gold{color:#C9873A}.dark .eb{color:#C9873A}
h1{font:400 120px/0.95 'Instrument Serif',serif}h2{font:400 54px/1.02 'Instrument Serif',serif;margin-top:6px}h2 em,.big em{color:#8A5A1E}
h3{font:400 28px/1.1 'Instrument Serif',serif;margin:12px 0 5px}h4{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#A4492B;margin:2px 0 6px}
.hd{margin-bottom:22px}.sub{font-size:15px;color:#6B5C50;margin-top:6px}
p,li{font-size:16px;line-height:1.5}ul{padding-left:16px}li{margin:3px 0}.fine{font-size:12.5px;color:#6B5C50;line-height:1.4}.dark .fine{color:#D9C6A8}
.big{font:400 46px/1.1 'Instrument Serif',serif;color:#8A5A1E;margin:6px 0}.serif{font-family:'Instrument Serif',serif}
.cols3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.cols2{display:grid;grid-template-columns:1fr 1fr;gap:20px}.cards4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.card{background:#EBDFCB;border-radius:14px;padding:16px 18px}.card.warn{background:#F0D9CE;border:1px solid #A4492B55}.dark .card{background:#2A1C14}
.note{background:#C9873A22;border:1px solid #C9873A88;border-radius:12px;padding:12px 16px;font-size:14.5px;line-height:1.45;margin-top:12px}
table{width:100%;border-collapse:collapse;font-size:15px}th{text-align:left;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#6B5C50;border-bottom:2px solid #1B120D;padding:6px 8px}td{padding:6px 8px;border-bottom:1px solid #1B120D22;vertical-align:top}table.sm td{padding:5px 8px;font-size:14px}table.sm th{padding:4px 8px}
.cover{height:100%;display:flex;flex-direction:column;justify-content:space-between;padding:20px 0}.clogo{height:64px;align-self:flex-start}.cs{font:italic 400 36px 'Instrument Serif',serif;color:#D9C6A8;margin-top:12px}
.toc{list-style:none;padding:0;columns:2;column-gap:60px}.toc li{display:flex;align-items:baseline;gap:8px;font:400 32px 'Instrument Serif',serif;margin:10px 0}.toc i{flex:1;border-bottom:1px dotted #6B5C50}.toc b{font:600 14px 'Hanken Grotesk Variable'}
.logos{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.lg{background:#EBDFCB;border-radius:14px;height:225px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:14px}.lg.dk{background:#1B120D;color:#F4EBDD}.lg img{max-width:88%;max-height:150px}.lg p{font-size:12px;letter-spacing:.14em;text-transform:uppercase}
.sw{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.sw>div{background:#EBDFCB;border-radius:12px;padding:10px}.sw i{display:block;height:62px;border-radius:8px;border:1px solid #1B120D22}.sw h4{color:#1B120D;margin:8px 0 2px;font-size:13px}.sw p{font-size:12.5px;line-height:1.4}
.pat{height:120px;border-radius:10px;background-size:cover;background-position:center}.icons{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.icons img{width:100%}
.wide{width:100%;max-height:520px;object-fit:contain;border-radius:12px}.duo{display:grid;grid-template-columns:1fr 1fr;gap:20px}.mk{width:100%;height:480px;object-fit:contain;background:#EBDFCB;border-radius:12px}.duo .mk{height:500px}
.grid5{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}.grid5 .mk{height:330px}.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.grid4 .mk{height:330px}.grid5 p,.grid4 p{font-size:13px;margin-top:6px}
.trio{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:12px}.mk16{width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:12px}
.rc{display:grid;grid-template-columns:380px 1fr;gap:34px;height:100%}.rimg img{width:380px;height:475px;object-fit:cover;border-radius:16px}.rimg .fine{margin-top:6px}
.rt{font-size:58px}.tag{font:italic 26px 'Instrument Serif',serif;color:#8A5A1E;margin:2px 0 8px}.stamp{color:#A4492B}
.spec{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;background:#EBDFCB;border-radius:12px;padding:10px 12px;font-size:14px;font-weight:600;margin-bottom:12px}.spec span{display:block;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#6B5C50;font-weight:500}
.two{display:grid;grid-template-columns:1fr 1.15fr;gap:20px}.ing td{padding:4px 8px 4px 0;font-size:14px}.ing td:last-child{text-align:right;font-weight:700;color:#8A5A1E;white-space:nowrap}ol{padding-left:18px}ol li{font-size:14px;line-height:1.4;margin:3px 0}
.foot3{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:14px}.foot3 p{font-size:13px;line-height:1.4}.story{font:italic 20px 'Instrument Serif',serif;color:#6B5C50;margin-top:6px}
.std{display:grid;gap:10px}.sr{background:#EBDFCB;border-radius:10px;padding:10px 16px}.sr h4{font-size:15px;letter-spacing:.06em;color:#1B120D;margin:0 0 2px;text-transform:none}.sr h4 span{font-weight:400;color:#6B5C50;font-size:13px}.ingl,.mth{font-size:13px;line-height:1.4}.mth{color:#3a2a22}
.tight li{font-size:13.5px;margin:1px 0;line-height:1.4}.tight h3{margin-top:2px}.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.steps>div{background:#EBDFCB;border-radius:12px;padding:8px 14px;display:flex;gap:12px;align-items:center}.dark .steps>div{background:#2A1C14}.steps b{font:400 40px 'Instrument Serif',serif;color:#C9873A}
.contact{margin-top:24px;padding:16px 20px;border:1px solid #C9873A88;border-radius:14px}code{background:#00000012;padding:1px 5px;border-radius:4px;font-size:11px}`;
const body = pages.map((p, i) => `<section class="page${p.dark ? " dark" : ""}" data-section="${esc(p.section)}">${p.html === "__TOC__" ? toc : p.html}${i === 0 ? "" : `<div class="ft"><span>${esc(NAME)} · Brand &amp; Franchise Starter Kit · v1.0 (concept)</span><span>${i + 1} / ${pages.length}</span></div>`}</section>`).join("\n");
mkdirSync(path.join(KIT, "_build"), { recursive: true });
const htmlPath = path.join(KIT, "_build/kit.html");
writeFileSync(htmlPath, `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(NAME)} — Brand & Franchise Starter Kit</title><style>${css}</style></head><body>${body}</body></html>`);

// ------------------------------------------------------------------ 4. render PDF + overflow check
const { chromium } = require("playwright");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto("file://" + htmlPath, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
const overflow = await page.evaluate(() => [...document.querySelectorAll(".page")].map((p, i) => {
  const lim = p.getBoundingClientRect().bottom - 40; // keep clear of the footer
  let max = 0; p.querySelectorAll("*").forEach((e) => { if (e.closest(".ft")) return; const r = e.getBoundingClientRect(); if (r.height > 0) max = Math.max(max, r.bottom); });
  return max > lim + 1 ? { page: i + 1, section: p.dataset.section, over: Math.round(max - lim) } : null;
}).filter(Boolean));
const pdfName = `${SLUG}-brand-franchise-kit.pdf`;
await page.pdf({ path: path.join(KIT, pdfName), width: "1280px", height: "720px", printBackground: true });
await browser.close();
console.log(`PDF: ${pdfName} — ${pages.length} pages`);
console.log(overflow.length ? "OVERFLOW on pages: " + JSON.stringify(overflow) : "No page overflow detected");

// ------------------------------------------------------------------ 5. PNG exports + costing data
const sharp = require("sharp");
const PNG = path.join(KIT, "assets-png");
rmSync(PNG, { recursive: true, force: true });
let n = 0;
for (const dir of ["logo", "mockups", "drinks", "cafe", "icons", "kit"]) {
  mkdirSync(path.join(PNG, dir), { recursive: true });
  for (const f of readdirSync(path.join(ASSETS, dir)).filter((x) => x.endsWith(".svg"))) {
    const density = dir === "logo" || dir === "icons" ? 300 : 150;
    try { await sharp(readFileSync(path.join(ASSETS, dir, f)), { density }).png().toFile(path.join(PNG, dir, f.replace(".svg", ".png"))); n++; }
    catch (e) { console.error(`PNG FAILED: ${dir}/${f} — ${String(e.message).split("\n")[0]}`); process.exitCode = 1; }
  }
}
console.log(`PNG exports: ${n}`);
mkdirSync(path.join(KIT, "data"), { recursive: true });
writeFileSync(path.join(KIT, "data/brand.json"), JSON.stringify({ name: NAME, slug: SLUG, descriptor: DESCRIPTOR, slogan: SLOGAN }));
writeFileSync(path.join(KIT, "data/menu.json"), JSON.stringify(products.map((p) => { const r = rec(p); return { category: categories.find((c) => c.slug === p.category)?.name, name: T(p.name), tier: p.tier, size: p.cupSize, temperature: p.temperature, ingredients: r.ingredients.map((x) => `${T(x.item)} — ${x.qty}`).join("; "), method: r.method.map((m, i) => `${i + 1}. ${T(m)}`).join(" "), cost: p.costUsd, price: p.priceUsd }; }), null, 1));
rmSync(path.join(KIT, "_build"), { recursive: true, force: true });
