import { test } from "node:test";
import assert from "node:assert/strict";
import { products, categories } from "../src/data/menu.ts";
import { standardRecipes } from "../src/data/standard-recipes.ts";
import { ar, arCategories, arQty, arTemp, arSize } from "../src/data/menu.ar.ts";

const eng = (p: (typeof products)[number]) => (p.ingredients?.length ? { ing: p.ingredients, method: p.method ?? [] } : { ing: standardRecipes[p.slug]?.ingredients ?? [], method: standardRecipes[p.slug]?.method ?? [] });
const latin = (s: string) => (s.match(/[A-Za-z]{3,}/g) ?? []).filter((w) => !["Doppio", "V60", "PET", "ml", "kg"].includes(w));

test("every product and category has an Arabic translation", () => {
  for (const p of products) assert.ok(ar[p.slug], `missing Arabic for ${p.slug}`);
  for (const c of categories) assert.ok(arCategories[c.slug], `missing Arabic category ${c.slug}`);
});
test("ingredient and method counts match the English source", () => {
  for (const p of products) {
    const e = eng(p), a = ar[p.slug];
    assert.equal(a.ing?.length ?? 0, e.ing.length, `${p.slug}: ingredients ${a.ing?.length} vs ${e.ing.length}`);
    assert.equal(a.method?.length ?? 0, e.method.length, `${p.slug}: method ${a.method?.length} vs ${e.method.length}`);
  }
});
test("Arabic fields are present for signature drinks", () => {
  for (const p of products.filter((x) => x.tier === "signature")) {
    const a = ar[p.slug];
    for (const k of ["tagline", "description", "presentation", "garnish", "target", "story"] as const) assert.ok(a[k], `${p.slug}.${k}`);
  }
});
test("translated quantities, temperatures and sizes contain no stray English words", () => {
  const bad: string[] = [];
  for (const p of products) {
    for (const i of eng(p).ing) { const w = latin(arQty(i.qty)); if (w.length) bad.push(`${p.slug} qty "${i.qty}" → ${w}`); }
    for (const t of [arTemp(p.temperature), arSize(p.cupSize)]) { const w = latin(t); if (w.length) bad.push(`${p.slug} "${t}" → ${w}`); }
  }
  assert.deepEqual(bad, []);
});
