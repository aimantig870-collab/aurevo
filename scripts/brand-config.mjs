// The ONLY place the brand name is set for generated artwork. Rename everything with:
//   BRAND_NAME="Your Name" BRAND_DESCRIPTOR="Your descriptor" BRAND_SLOGAN="Your slogan" npm run kit
export const NAME = (process.env.BRAND_NAME ?? "Aurevo").trim();
export const DESCRIPTOR = (process.env.BRAND_DESCRIPTOR ?? "Golden Hour Coffee House").trim();
export const SLOGAN = (process.env.BRAND_SLOGAN ?? "Slow down. Glow up.").trim();
export const SLUG = NAME.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "brand";
export const DOMAIN = `${SLUG}.example`;
