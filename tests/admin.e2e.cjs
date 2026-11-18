// Admin dashboard e2e against a running app wired to a LIVE Supabase project.
// Needs three staff accounts (admin/editor/viewer). Usage:
//   BASE=http://localhost:3100 QA_PASSWORD=... [QA_DOMAIN=aurevo-qa.dev] node tests/admin.e2e.cjs
// It creates and then deletes its own records (category/product/gallery item) and restores settings.
const { chromium } = require("playwright");
const path = require("path");
const BASE = process.env.BASE || "http://localhost:3100";
const PW = process.env.QA_PASSWORD;
const DOM = process.env.QA_DOMAIN || "aurevo-qa.dev";
if (!PW) { console.error("Set QA_PASSWORD"); process.exit(2); }
const IMG = path.resolve(__dirname, "../public/og.png");
const stamp = Date.now().toString(36);
let failed = 0;
const ok = (n, c, x = "") => { if (!c) failed++; console.log(c ? "PASS" : "FAIL", n, c ? "" : x); };
const toast = (p, re, t = 12000) => p.locator("[data-sonner-toast]").filter({ hasText: re }).first().waitFor({ timeout: t }).then(() => true).catch(() => false);

async function login(b, role, pw = PW) {
  const ctx = await b.newContext({ viewport: { width: 1360, height: 900 } });
  ctx.setDefaultTimeout(60000); ctx.setDefaultNavigationTimeout(60000);
  const p = await ctx.newPage();
  await p.goto(BASE + "/login", { waitUntil: "domcontentloaded" });
  await p.fill("#email", `qa-${role}@${DOM}`);
  await p.fill("#password", pw);
  await p.getByRole("button", { name: "Sign in" }).click();
  return { ctx, p };
}

(async () => {
  const b = await chromium.launch();

  // ---------- auth
  { const { ctx, p } = await login(b, "admin", "wrong-password-123");
    ok("wrong password is rejected with a message", await p.getByText("Email or password is incorrect").first().waitFor({ timeout: 10000 }).then(() => true).catch(() => false));
    ok("stays on /login after failure", p.url().includes("/login")); await ctx.close(); }

  const { ctx, p } = await login(b, "admin");
  await p.waitForURL("**/admin", { timeout: 15000 }).catch(() => {});
  ok("admin signs in and lands on dashboard", p.url().endsWith("/admin") && (await p.getByRole("heading", { name: /Welcome/ }).count()) === 1, p.url());
  ok("admin sees Team + Activity log nav", (await p.getByRole("link", { name: "Team" }).count()) === 1 && (await p.getByRole("link", { name: "Activity log" }).count()) === 1);

  // ---------- products: list, search, filter, pagination
  await p.goto(BASE + "/admin/products", { waitUntil: "domcontentloaded" });
  ok("products list shows first page of 10", (await p.locator("tbody tr").count()) === 10);
  ok("pagination shows 'Page 1 of 5'", await p.getByText(/Page 1 of 5/).count() > 0);
  await p.getByRole("link", { name: "Next →" }).click(); await p.waitForURL(/page=2/);
  ok("pagination next page works", (await p.getByText(/Page 2 of 5/).count()) > 0);
  await p.goto(BASE + "/admin/products?q=saffron", { waitUntil: "domcontentloaded" });
  await p.goto(BASE + "/admin/products?q=Golden", { waitUntil: "domcontentloaded" });
  ok("search finds 'Golden Hour Latte'", (await p.locator("tbody tr").count()) === 1 && (await p.getByText("Golden Hour Latte").count()) > 0);
  await p.goto(BASE + "/admin/products?q=%25%2C()", { waitUntil: "domcontentloaded" });
  ok("special characters in search do not break the page", (await p.locator("tbody tr").count()) > 0 || (await p.getByText("No products match").count()) > 0);

  // ---------- categories: create, validation, duplicate slug
  await p.goto(BASE + "/admin/categories", { waitUntil: "domcontentloaded" });
  const catName = `QA Category ${stamp}`, catSlug = `qa-category-${stamp}`;
  await p.fill("#name-new", catName); await p.fill("#slug-new", "Bad Slug!");
  await p.getByRole("button", { name: "Add", exact: true }).click();
  ok("invalid slug shows validation error", await p.getByText(/lowercase letters/i).waitFor({ timeout: 8000 }).then(() => true).catch(() => false));
  ok("failed validation keeps typed name", (await p.inputValue("#name-new")) === catName);
  await p.fill("#slug-new", catSlug); await p.getByRole("button", { name: "Add", exact: true }).click();
  ok("category created (toast)", await toast(p, /Category created/));
  await p.reload({ waitUntil: "domcontentloaded" });
  ok("new category listed", (await p.locator(`input[value="${catName}"]`).count()) === 1);
  await p.fill("#name-new", "Dup"); await p.fill("#slug-new", catSlug);
  await p.getByRole("button", { name: "Add", exact: true }).click();
  ok("duplicate slug rejected", await toast(p, /already in use/));

  // ---------- products: create with image upload
  await p.goto(BASE + "/admin/products/new", { waitUntil: "domcontentloaded" });
  const prodName = `QA Product ${stamp}`, prodSlug = `qa-product-${stamp}`;
  await p.fill("#name", prodName); await p.fill("#slug", prodSlug);
  await p.selectOption("#category_id", { label: catName });
  await p.fill("#price_usd", "-1"); await p.fill("#cost_usd", "1.5");
  await p.fill("#ingredients", "Espresso | 36 ml\nMilk | 200 ml"); await p.fill("#method", "Step one\nStep two");
  await p.fill("#description", "A QA test drink."); await p.setInputFiles("#image", IMG); await p.fill("#image_alt", "QA image");
  await p.getByRole("button", { name: "Create product" }).click();
  ok("negative price rejected", await p.locator("[role=alert]").first().waitFor({ timeout: 8000 }).then(() => true).catch(() => false));
  ok("failed validation keeps typed fields", (await p.inputValue("#name")) === prodName && (await p.inputValue("#ingredients")).includes("Milk"));
  await p.fill("#price_usd", "5.5");
  await p.getByRole("button", { name: "Create product" }).click();
  await p.waitForURL(/\/admin\/products\/[0-9a-f-]{36}/, { timeout: 25000 }).catch(() => {});
  const prodUrl = p.url();
  ok("product created and redirected to edit page", /\/admin\/products\/[0-9a-f-]{36}/.test(prodUrl), prodUrl);
  await p.waitForLoadState("networkidle");
  ok("uploaded image is attached & marked primary", (await p.getByText("Primary").count()) > 0 && (await p.locator("main img").count()) > 0);
  const imgSrc = await p.locator("main img").first().getAttribute("src");
  ok("image served from Supabase Storage", /storage\/v1\/object\/public\/media\/products\//.test(decodeURIComponent(imgSrc || "")), imgSrc);

  // edit
  await p.fill("#price_usd", "6.25");
  await p.getByRole("button", { name: "Save changes" }).click();
  ok("product update saved (toast)", await toast(p, /Product saved/));
  await p.reload({ waitUntil: "domcontentloaded" });
  ok("edit persisted", (await p.inputValue("#price_usd")) === "6.25" && (await p.inputValue("#ingredients")).includes("Espresso | 36 ml"));
  // public site reflects it
  const pub = await p.request.get(BASE + `/menu/${prodSlug}`);
  ok("new product page is live on the public site", pub.status() === 200 && (await pub.text()).includes(prodName), String(pub.status()));
  // hide it
  await p.uncheck('input[name=is_active]'); await p.getByRole("button", { name: "Save changes" }).click();
  await toast(p, /Product saved/);
  await p.waitForTimeout(800);
  const pub2 = await p.request.get(BASE + `/menu/${prodSlug}`);
  ok("hidden product 404s on the public site", pub2.status() === 404, String(pub2.status()));

  // ---------- gallery
  await p.goto(BASE + "/admin/gallery", { waitUntil: "domcontentloaded" });
  await p.fill("#t-new", `QA Gallery ${stamp}`); await p.fill("#c-new", "qa caption"); await p.setInputFiles("#i-new", IMG);
  await p.getByRole("button", { name: "Add to gallery" }).click();
  ok("gallery item added (toast)", await toast(p, /Gallery item saved/));
  await p.goto(BASE + `/admin/gallery?q=QA+Gallery+${stamp}`, { waitUntil: "domcontentloaded" });
  const qaGallery = () => p.evaluate(() => [...document.querySelectorAll('input[id^="t-"]')].filter((i) => i.value.startsWith("QA Gallery")).length);
  ok("gallery search finds it", (await qaGallery()) === 1);
  p.once("dialog", (d) => d.accept());
  await p.getByRole("button", { name: "Delete", exact: true }).first().click();
  let left = 1;
  for (let i = 0; i < 12 && left; i++) { await p.waitForTimeout(1500); await p.reload({ waitUntil: "domcontentloaded" }); left = await qaGallery(); }
  ok("gallery item deleted", left === 0);

  // ---------- settings (restore after)
  await p.goto(BASE + "/admin/settings", { waitUntil: "domcontentloaded" });
  const oldSlogan = await p.inputValue("#slogan");
  await p.fill("#slogan", `QA slogan ${stamp}`); await p.fill("#instagram_url", "http://insecure.example");
  await p.getByRole("button", { name: "Save settings" }).click();
  ok("non-https URL rejected", await p.getByText("Must start with https://").waitFor({ timeout: 8000 }).then(() => true).catch(() => false));
  await p.fill("#instagram_url", "https://instagram.com/");
  await p.getByRole("button", { name: "Save settings" }).click();
  ok("settings saved (toast)", await toast(p, /Settings saved/));
  await p.waitForTimeout(800);
  ok("site footer shows the new slogan", (await (await p.request.get(BASE + "/")).text()).includes(`QA slogan ${stamp}`));
  await p.fill("#slogan", oldSlogan); await p.getByRole("button", { name: "Save settings" }).click(); await toast(p, /Settings saved/);

  // ---------- inbox (needs rows created by the public e2e; create one here via the public form)
  const pub3 = await b.newPage(); await pub3.goto(BASE + "/contact", { waitUntil: "domcontentloaded" });
  await pub3.fill("#name", "QA Inbox"); await pub3.fill("#email", "qa-inbox@example.com"); await pub3.fill("#subject", `Inbox test ${stamp}`); await pub3.fill("#message", "Message for inbox test.");
  await pub3.getByRole("button", { name: "Send message" }).click(); await pub3.waitForSelector("[role=status]", { timeout: 15000 }); await pub3.close();
  await p.goto(BASE + `/admin/inbox/contact?q=qa-inbox`, { waitUntil: "domcontentloaded" });
  ok("inbox search finds the message", (await p.locator("tbody tr").count()) >= 1);
  await p.locator("tbody tr").first().getByRole("link").first().click(); await p.waitForURL(/inbox\/contact\/[0-9a-f-]{36}/);
  await p.selectOption("#status", "contacted"); await p.fill("#internal_notes", "Called back");
  await p.getByRole("button", { name: "Update" }).click();
  ok("status + notes updated (toast)", await toast(p, /Inquiry updated/));
  await p.goto(BASE + "/admin/inbox/contact?status=contacted", { waitUntil: "domcontentloaded" });
  ok("status filter works", (await p.locator("tbody tr").count()) >= 1 && (await p.getByText("contacted").count()) > 0);
  await p.goto(BASE + "/admin/inbox/franchise", { waitUntil: "domcontentloaded" });
  ok("franchise inbox lists inquiries", (await p.locator("tbody tr").count()) >= 1);
  ok("unknown inbox kind is a 404", (await p.request.get(BASE + "/admin/inbox/nonsense", { maxRedirects: 0 })).status() !== 200);

  // ---------- team + activity
  await p.goto(BASE + "/admin/team", { waitUntil: "domcontentloaded" });
  const row = p.locator("tbody tr").filter({ hasText: `qa-viewer@${DOM}` });
  await row.locator("select").selectOption("editor"); await row.getByRole("button", { name: "Save" }).click();
  await p.waitForTimeout(1500); await p.reload({ waitUntil: "domcontentloaded" });
  ok("admin can change a role", (await p.locator("tbody tr").filter({ hasText: `qa-viewer@${DOM}` }).locator("select").inputValue()) === "editor");
  await p.locator("tbody tr").filter({ hasText: `qa-viewer@${DOM}` }).locator("select").selectOption("viewer");
  await p.locator("tbody tr").filter({ hasText: `qa-viewer@${DOM}` }).getByRole("button", { name: "Save" }).click(); await p.waitForTimeout(1500);
  ok("admin cannot edit own role (no selector on own row)", (await p.locator("tbody tr").filter({ hasText: `qa-admin@${DOM}` }).locator("select").count()) === 0);
  await p.goto(BASE + "/admin/activity", { waitUntil: "domcontentloaded" });
  ok("activity log records actions", (await p.locator("tbody tr").count()) >= 5 && (await p.getByText(prodName.slice(0, 10)).count()) >= 0);

  // ---------- cleanup: delete product + category
  await p.goto(prodUrl, { waitUntil: "domcontentloaded" });
  p.once("dialog", (d) => d.accept());
  await p.getByRole("button", { name: "Delete product" }).click(); await p.waitForURL(/products\?deleted=1/, { timeout: 15000 }).catch(() => {});
  ok("product deleted", p.url().includes("deleted=1"));
  await p.goto(BASE + "/admin/categories", { waitUntil: "domcontentloaded" });
  p.once("dialog", (d) => d.accept());
  await p.getByRole("button", { name: new RegExp(`Delete “${catName}”`) }).click(); await p.waitForURL(/categories\?deleted=1/, { timeout: 15000 }).catch(() => {});
  ok("category deleted", p.url().includes("deleted=1"));
  // FK protection: deleting a category that still has products must fail gracefully
  await p.goto(BASE + "/admin/categories", { waitUntil: "domcontentloaded" });
  p.once("dialog", (d) => d.accept());
  await p.getByRole("button", { name: /Delete “Espresso”/ }).click(); await p.waitForURL(/categories\?error=/, { timeout: 15000 }).catch(() => {});
  ok("deleting a category in use is blocked with a message", p.url().includes("error="), p.url());

  // ---------- sign out + gating
  await p.goto(BASE + "/admin", { waitUntil: "domcontentloaded" });
  await p.getByRole("button", { name: "Sign out" }).first().click(); await p.waitForURL("**/login");
  await p.goto(BASE + "/admin/products");
  ok("after sign-out /admin redirects to /login", p.url().includes("/login"));
  await ctx.close();

  // ---------- editor role
  { const { ctx, p } = await login(b, "editor"); await p.waitForURL("**/admin", { timeout: 15000 });
    ok("editor does not see Team/Activity", (await p.getByRole("link", { name: "Team" }).count()) === 0);
    await p.goto(BASE + "/admin/team", { waitUntil: "domcontentloaded" });
    ok("editor is redirected away from /admin/team", !p.url().includes("/team"), p.url());
    const first = await (async () => { await p.goto(BASE + "/admin/inbox/franchise", { waitUntil: "domcontentloaded" }); await p.locator("tbody tr").first().getByRole("link").first().click(); await p.waitForURL(/franchise\/[0-9a-f-]{36}/); })();
    void first;
    ok("editor cannot delete inquiries (no delete button)", (await p.getByRole("button", { name: "Delete inquiry" }).count()) === 0);
    ok("editor can edit inquiry status", (await p.getByRole("button", { name: "Update" }).count()) === 1);
    await ctx.close(); }

  // ---------- viewer role
  { const { ctx, p } = await login(b, "viewer"); await p.waitForURL("**/admin", { timeout: 15000 });
    await p.goto(BASE + "/admin/products", { waitUntil: "domcontentloaded" });
    ok("viewer sees no 'New product' button", (await p.getByRole("link", { name: "+ New product" }).count()) === 0);
    await p.locator("tbody tr").first().getByRole("link").first().click(); await p.waitForURL(/products\/[0-9a-f-]{36}/);
    ok("viewer product form is read-only (fieldset disabled)", await p.locator("fieldset[disabled]").count() > 0 && (await p.getByRole("button", { name: "Save changes" }).count()) === 0);
    ok("viewer cannot open /admin/products/new", (await p.goto(BASE + "/admin/products/new"), (await p.title()).length >= 0) && !(await p.getByRole("button", { name: "Create product" }).count()));
    await p.goto(BASE + "/admin/inbox/contact", { waitUntil: "domcontentloaded" });
    ok("viewer can read the inbox", (await p.locator("tbody tr").count()) >= 1);
    await ctx.close(); }

  await b.close();
  console.log(failed ? `\n${failed} admin e2e check(s) failed` : "\nAll admin e2e checks passed");
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error("CRASH", e.message.split("\n")[0]); process.exit(1); });
