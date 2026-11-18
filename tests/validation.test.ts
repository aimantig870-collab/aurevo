import { test } from "node:test";
import assert from "node:assert/strict";
import { clean, contactSchema, franchiseSchema, partnershipSchema, parseIngredients, productSchema } from "../src/lib/validation.ts";

test("clean strips tags and control chars", () => {
  assert.equal(clean("  <script>alert(1)</script>Hello\u0000   world "), "alert(1)Hello world");
});
test("contact: valid input is normalised", () => {
  const r = contactSchema.parse({ name: " Ann ", email: " ANN@Example.com ", subject: "Hi there", message: "A decent message body" });
  assert.equal(r.email, "ann@example.com");
  assert.equal(r.name, "Ann");
});
test("contact: rejects bad email, short message, HTML-only fields", () => {
  assert.equal(contactSchema.safeParse({ name: "A", email: "x", subject: "s", message: "short" }).success, false);
  assert.equal(contactSchema.safeParse({ name: "<b></b>", email: "a@b.co", subject: "Hello", message: "long enough message" }).success, false);
});
test("partnership: enum enforced", () => {
  const base = { name: "Ann", email: "a@b.co", message: "long enough message" };
  assert.equal(partnershipSchema.safeParse({ ...base, partnership_type: "licensing" }).success, true);
  assert.equal(partnershipSchema.safeParse({ ...base, partnership_type: "hack" }).success, false);
});
test("franchise: requires concept-stage acknowledgement", () => {
  const base = { name: "Ann", email: "a@b.co", country: "UAE", investment_range: "not_sure", experience: "none" };
  assert.equal(franchiseSchema.safeParse(base).success, false);
  const ok = franchiseSchema.safeParse({ ...base, ack: "on", has_site: "on" });
  assert.equal(ok.success, true);
  assert.equal(ok.success && ok.data.has_site, true);
});
test("product: slug format, price bounds", () => {
  const base = { name: "Test Drink", slug: "test-drink", category_id: "11111111-1111-4111-8111-111111111111", tier: "classic", serve: "hot", caffeine: "yes", cost_usd: "1.2", price_usd: "5", recipe_status: "proposed" };
  assert.equal(productSchema.safeParse(base).success, true);
  assert.equal(productSchema.safeParse({ ...base, slug: "Bad Slug!" }).success, false);
  assert.equal(productSchema.safeParse({ ...base, price_usd: "-1" }).success, false);
});
test("parseIngredients splits item|qty lines", () => {
  assert.deepEqual(parseIngredients("Espresso | 36 ml\n\nMilk|200 ml"), [{ item: "Espresso", qty: "36 ml" }, { item: "Milk", qty: "200 ml" }]);
});
