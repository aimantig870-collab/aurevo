// Brand source of truth. Content that admins can override lives in the DB (brand_settings);
// these are the defaults and the fallback when Supabase is not configured.

export const brand = {
  name: "Aurevo",
  descriptor: "Golden Hour Coffee House",
  slogan: "Slow down. Glow up.",
  tagline: "Coffee for the golden hour.",
  stage:
    "Aurevo is a proposed brand concept. There is no operating café, no validated franchise offer, and no customer sales history yet.",
  email: "hello@aurevo.example",
  partnerEmail: "partners@aurevo.example",
  social: { instagram: "https://instagram.com/", tiktok: "https://tiktok.com/", facebook: "https://facebook.com/", pinterest: "https://pinterest.com/" },
};

export const palette = {
  primary: [
    { name: "Espresso Night", hex: "#1B120D", use: "Primary dark, text, signage" },
    { name: "Crema", hex: "#F4EBDD", use: "Primary light, backgrounds" },
    { name: "Aurum", hex: "#C9873A", use: "Signature accent, the sun" },
  ],
  secondary: [
    { name: "Ember Clay", hex: "#A4492B", use: "Warm accent, seasonal" },
    { name: "Cardamom", hex: "#6E7A5A", use: "Botanical accent, sustainability" },
    { name: "Oat", hex: "#D9C6A8", use: "Neutral surfaces, packaging" },
    { name: "Rosewater", hex: "#D9A79A", use: "Soft accent, floral drinks" },
    { name: "Smoke", hex: "#6B5C50", use: "Secondary text" },
  ],
};

export const values = [
  { title: "Slow is a skill", body: "We design drinks to be savoured — nothing rushed, nothing generic." },
  { title: "Warm, not loud", body: "Premium should feel welcoming. Quiet confidence over spectacle." },
  { title: "Honest origins", body: "We say what is tested and what is proposed. No invented numbers, ever." },
  { title: "Crossroads flavour", body: "Saffron, pandan, miso, tamarind, ube — world pantries on a specialty-coffee base." },
  { title: "Built to travel", body: "Every standard is documented so the experience works in any city." },
];

export const personas = [
  { name: "Layla, 29", role: "Creative professional", need: "A third place that looks as good as it tastes and has seats worth staying in.", hook: "Golden Hour Latte, Rose Cloud Cold Brew" },
  { name: "Daniel, 38", role: "Hybrid worker & parent", need: "A reliably excellent flat white and a calm hour between meetings.", hook: "Flat White, Silk Road Cappuccino" },
  { name: "Mei, 22", role: "Student & content creator", need: "Playful flavours, great light for photos and prices that feel fair.", hook: "Ube Cloud Latte, Midnight Sesame" },
  { name: "Omar, 45", role: "Prospective café partner", need: "A distinctive concept with documented standards and honest economics.", hook: "Partnership & franchise programme" },
];

export const nameShortlist = [
  { name: "Aurevo", score: 9, verdict: "Chosen", note: "From aurum (gold) + the open vowels of 'au revoir' — a warm goodbye to the day. Three syllables, no hard sounds, reads the same in English, Arabic transliteration and Romance languages. Web search found no café/coffee brand with this exact name (not a trademark search)." },
  { name: "Vellora", score: 7, verdict: "Runner-up", note: "Pleasant sound but close to Vellore (a city in India) and weaker story. No exact brand found in search." },
  { name: "Emberlune", score: 6, verdict: "Rejected", note: "Hard to say consistently; 'Ember' prefix is crowded (e.g. Ember Coffee Co.)." },
  { name: "Solvane", score: 6, verdict: "Rejected", note: "Cold, technical sound; no connection to coffee or hospitality." },
  { name: "Noctua", score: 4, verdict: "Rejected", note: "Existing business found: Noctua Coffee Roasters." },
  { name: "Lumeroast", score: 4, verdict: "Rejected", note: "Descriptive and generic; weak for licensing/franchise." },
];

export const nav = [
  { href: "/menu", label: "Menu" },
  { href: "/signature", label: "Signature" },
  { href: "/virtual-cafe", label: "Virtual Café" },
  { href: "/our-story", label: "Story" },
  { href: "/brand", label: "Brand" },
  { href: "/franchise", label: "Franchise" },
  { href: "/contact", label: "Contact" },
];

export const galleryDefaults = [
  { title: "Golden Hour Latte", caption: "Saffron-honey latte (concept illustration)", image: "/art/drinks/golden-hour-latte.svg", tag: "drinks" },
  { title: "First Light", caption: "Espresso yuzu tonic (concept illustration)", image: "/art/drinks/first-light.svg", tag: "drinks" },
  { title: "Rose Cloud Cold Brew", caption: "Rose-vanilla cold foam (concept illustration)", image: "/art/drinks/rose-cloud-cold-brew.svg", tag: "drinks" },
  { title: "Monsoon", caption: "Pandan coconut cold brew (concept illustration)", image: "/art/drinks/monsoon.svg", tag: "drinks" },
  { title: "Hot cup", caption: "Hot cup mockup", image: "/art/mockups/hot-cup.svg", tag: "brand" },
  { title: "Cold cup", caption: "Cold cup mockup", image: "/art/mockups/cold-cup.svg", tag: "brand" },
  { title: "Coffee bag", caption: "Whole-bean bag mockup", image: "/art/mockups/coffee-bag.svg", tag: "brand" },
  { title: "Storefront at dusk", caption: "Concept rendering — exterior, night", image: "/art/cafe/exterior-night.svg", tag: "cafe" },
  { title: "Interior", caption: "Concept rendering — interior wide", image: "/art/cafe/interior-wide.svg", tag: "cafe" },
  { title: "Coffee counter", caption: "Concept rendering — counter", image: "/art/cafe/counter.svg", tag: "cafe" },
  { title: "Midnight Sesame", caption: "Black sesame latte (concept illustration)", image: "/art/drinks/midnight-sesame.svg", tag: "drinks" },
  { title: "Sunset Spritz", caption: "Tamarind espresso spritz (concept illustration)", image: "/art/drinks/sunset-spritz.svg", tag: "drinks" },
];
