// One-off: rasterise public/art/og.svg → public/og.png (social crawlers do not accept SVG). Run: node scripts/make-og.cjs
const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto("file://" + path.resolve(__dirname, "../public/art/og.svg"));
  await p.screenshot({ path: path.resolve(__dirname, "../public/og.png") });
  await b.close();
})();
