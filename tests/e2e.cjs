// Smoke/e2e checks against a running production server. Usage: BASE=http://localhost:3100 node tests/e2e.cjs
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://localhost:3100";
const PAGES = ["/", "/about", "/our-story", "/menu", "/signature", "/menu/golden-hour-latte", "/gallery", "/virtual-cafe", "/brand", "/franchise", "/partnership", "/contact"];
let failed = 0;
const ok = (name, cond, extra = "") => { if (!cond) failed++; console.log(cond ? "PASS" : "FAIL", name, cond ? "" : extra); };

(async () => {
  const b = await chromium.launch();
  for (const [label, vp] of [["desktop", { width: 1280, height: 800 }], ["mobile", { width: 375, height: 700 }]]) {
    const ctx = await b.newContext({ viewport: vp });
    const p = await ctx.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(String(e)));
    p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    p.on("response", (r) => r.status() >= 400 && !r.url().includes("favicon") && errors.push(`${r.status()} ${r.url()}`));
    for (const path of PAGES) {
      const r = await p.goto(BASE + path, { waitUntil: "networkidle" });
      ok(`${label} ${path} → 200`, r.status() === 200, String(r.status()));
      const h1 = await p.locator("h1").count();
      ok(`${label} ${path} has exactly one h1`, h1 === 1, String(h1));
      const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      ok(`${label} ${path} no horizontal overflow`, overflow <= 1, `${overflow}px`);
      const noAlt = await p.locator("img:not([alt])").count();
      ok(`${label} ${path} images have alt`, noAlt === 0, String(noAlt));
    }
    ok(`${label} no console/network errors`, errors.length === 0, errors.slice(0, 3).join(" | "));
    await ctx.close();
  }

  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  // menu filtering + search
  await p.goto(BASE + "/menu", { waitUntil: "networkidle" });
  const total = await p.locator("main ul li a[href^='/menu/']").count();
  await p.getByRole("tab", { name: "Latte", exact: true }).click();
  await p.waitForTimeout(300);
  const lattes = await p.locator("main ul li a[href^='/menu/']").count();
  ok("menu category filter narrows results", lattes > 0 && lattes < total, `${lattes}/${total}`);
  await p.getByRole("tab", { name: "All" }).click();
  await p.fill("#menu-q", "saffron");
  await p.waitForTimeout(200);
  ok("menu search finds saffron drink", (await p.locator("main ul li a[href^='/menu/']").count()) === 1);
  // product detail honesty labels
  await p.goto(BASE + "/menu/golden-hour-latte");
  ok("product page flags recipe as proposed", (await p.getByText(/Recipe status: proposed/i).count()) > 0);
  // contact form validation (client sends to server action → field errors)
  await p.goto(BASE + "/contact", { waitUntil: "networkidle" });
  await p.getByRole("button", { name: "Send message" }).click();
  await p.waitForSelector("[role=alert]");
  ok("contact form shows validation errors", (await p.locator("[role=alert]").count()) >= 1);
  // valid submission → either success (backend) or honest 'unavailable' message, never silent
  await p.fill("#name", "Test Person"); await p.fill("#email", "test@example.com"); await p.fill("#subject", "Hello"); await p.fill("#message", "This is a test message for the form.");
  await p.getByRole("button", { name: "Send message" }).click();
  await p.waitForSelector("[data-sonner-toast], [role=status]", { timeout: 8000 });
  ok("contact submit gives user feedback", true);
  // franchise acknowledgement required
  await p.goto(BASE + "/franchise", { waitUntil: "networkidle" });
  ok("franchise page states no franchise is available", (await p.getByText("No franchise is currently for sale").count()) > 0);
  // admin gating
  const r = await p.goto(BASE + "/admin/products", { waitUntil: "networkidle" });
  ok("/admin redirects unauthenticated users to /login", p.url().includes("/login"), p.url());
  ok("login page is noindex", (await p.locator('meta[name=robots][content*=noindex]').count()) > 0);
  void r;
  // security headers
  const res = await p.request.get(BASE + "/");
  const h = res.headers();
  ok("security headers present", h["x-frame-options"] === "DENY" && h["x-content-type-options"] === "nosniff");
  ok("robots.txt disallows /admin", (await (await p.request.get(BASE + "/robots.txt")).text()).includes("Disallow: /admin"));
  ok("sitemap lists product pages", (await (await p.request.get(BASE + "/sitemap.xml")).text()).includes("/menu/golden-hour-latte"));
  await b.close();
  console.log(failed ? `\n${failed} e2e check(s) failed` : "\nAll e2e checks passed");
  process.exit(failed ? 1 : 0);
})();
