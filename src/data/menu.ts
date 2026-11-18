// Single source of truth for the Aurevo menu.
// ALL recipes are PROPOSED (untested). Costs/prices are ESTIMATES in USD.
// Cost basis: specialty beans ~US$25/kg (18 g dose ≈ $0.45), whole milk ~US$1.30/L,
// oat milk ~US$2.60/L. Ingredient cost only — excludes packaging, labour, rent, wastage.

export type Category = {
  slug: string;
  name: string;
  blurb: string;
  sort: number;
};

export type ArtConfig = {
  vessel: "cup" | "tall" | "glass" | "tulip" | "plate" | "bag";
  layers: string[]; // liquid colours, bottom → top
  foam?: string;
  ice?: boolean;
  garnish?: "saffron" | "petals" | "leaf" | "wheel" | "nibs" | "zest" | "sesame" | "almond" | "cinnamon" | "gelato" | "crumb" | "flake";
  bg: string;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  tier: "signature" | "classic";
  serve: "hot" | "iced" | "either" | "dessert" | "bakery";
  tagline: string;
  description: string;
  ingredients?: { item: string; qty: string }[];
  method?: string[];
  temperature: string;
  cupSize: string;
  presentation?: string;
  garnish?: string;
  costUsd: number;
  priceUsd: number;
  target?: string;
  story?: string;
  caffeine?: "yes" | "optional" | "none";
  art: ArtConfig;
};

export const categories: Category[] = [
  { slug: "espresso", name: "Espresso", blurb: "The base of everything we do — pulled short, sweet and syrupy.", sort: 1 },
  { slug: "americano", name: "Americano", blurb: "Long, clean and quietly aromatic.", sort: 2 },
  { slug: "cappuccino", name: "Cappuccino", blurb: "Equal parts espresso, steam and silk.", sort: 3 },
  { slug: "latte", name: "Latte", blurb: "Soft, milky and generous.", sort: 4 },
  { slug: "mocha", name: "Mocha", blurb: "Real dark chocolate, never powder.", sort: 5 },
  { slug: "cold-coffee", name: "Cold Coffee", blurb: "Slow-steeped and bright over ice.", sort: 6 },
  { slug: "iced-drinks", name: "Iced Drinks", blurb: "Refreshers beyond the coffee bean.", sort: 7 },
  { slug: "signature-drinks", name: "Signature Drinks", blurb: "Fourteen original recipes — the Aurevo palette.", sort: 8 },
  { slug: "specialty-coffee", name: "Specialty Coffee", blurb: "Single-origin, brewed by hand.", sort: 9 },
  { slug: "desserts", name: "Desserts", blurb: "Small, rich, finished with a flourish.", sort: 10 },
  { slug: "bakery", name: "Bakery", blurb: "Laminated, baked and glazed each morning.", sort: 11 },
];

// ---------------------------------------------------------------- Signature
const S = "signature-drinks";

export const signature: Product[] = [
  {
    slug: "golden-hour-latte", name: "Golden Hour Latte", category: S, tier: "signature", serve: "hot",
    tagline: "Saffron, honey and the last warm light of the day.",
    description: "A silky latte sweetened with saffron-steeped honey and finished with pistachio dust. Floral, gently sweet, deeply golden.",
    ingredients: [
      { item: "Double espresso (18 g in / 36 g out)", qty: "36 ml" },
      { item: "Saffron-honey syrup*", qty: "15 ml" },
      { item: "Whole milk (or oat)", qty: "200 ml" },
      { item: "Crushed pistachio", qty: "1 g" },
      { item: "Saffron threads (garnish)", qty: "3 threads" },
    ],
    method: [
      "*Syrup: steep 0.4 g saffron in 50 g hot water 15 min, stir into 100 g honey. Keep chilled up to 2 weeks.",
      "Pull the double espresso directly onto the syrup in a pre-warmed 12 oz cup and stir.",
      "Steam milk to 60–65 °C with fine microfoam; pour in a tight rosetta.",
      "Dust with pistachio and float three saffron threads.",
    ],
    temperature: "62–65 °C", cupSize: "12 oz / 355 ml ceramic",
    presentation: "Warm stoneware cup on an oat-coloured saucer with a single pistachio shortbread.",
    garnish: "Saffron threads, pistachio dust",
    costUsd: 1.28, priceUsd: 6.8, caffeine: "yes",
    target: "Flavour-curious professionals and gifting customers who want a drink that photographs as well as it tastes.",
    story: "Named for the thirty minutes when a café feels most like itself — light slanting low, everyone slowing down.",
    art: { vessel: "cup", layers: ["#7a4a22", "#d9a441"], foam: "#f1d9a0", garnish: "saffron", bg: "#e9c27a" },
  },
  {
    slug: "first-light", name: "First Light", category: S, tier: "signature", serve: "iced",
    tagline: "Espresso over yuzu tonic — a sparkling sunrise.",
    description: "Bright, citrusy and bubbly: a freshly pulled espresso shot poured over yuzu-honey tonic so the drink shifts from amber to gold as you sip.",
    ingredients: [
      { item: "Espresso, shot (18 g in / 36 g out)", qty: "36 ml" },
      { item: "Tonic water", qty: "120 ml" },
      { item: "Yuzu juice", qty: "15 ml" },
      { item: "Honey syrup (1:1)", qty: "10 ml" },
      { item: "Ice", qty: "150 g" },
      { item: "Dehydrated lemon wheel + thyme", qty: "1 + 1 sprig" },
    ],
    method: [
      "Fill a tall glass with ice; add yuzu juice and honey syrup, stir briefly.",
      "Top with tonic water, pouring down a spoon to keep carbonation.",
      "Pull the espresso and pour slowly over the back of a spoon so it floats as a layer.",
      "Garnish with dehydrated lemon and thyme. Serve unstirred.",
    ],
    temperature: "Served 2–4 °C", cupSize: "16 oz / 473 ml tall glass",
    presentation: "Tall Collins glass with a paper straw and a visible amber-to-gold gradient.",
    garnish: "Dehydrated lemon wheel, thyme",
    costUsd: 1.5, priceUsd: 6.4, caffeine: "yes",
    target: "Summer and post-gym customers who want caffeine without milk.",
    story: "The moment before the city wakes: cold, clear and full of promise.",
    art: { vessel: "tall", layers: ["#f3e2a6", "#e2b553", "#7a4a22"], ice: true, garnish: "wheel", bg: "#f2d9a0" },
  },
  {
    slug: "dusk-ember", name: "Dusk Ember", category: S, tier: "signature", serve: "hot",
    tagline: "Date syrup, torched cinnamon and a pinch of sea salt.",
    description: "A deep, caramel-toned latte sweetened with slow-cooked Medjool dates and perfumed by a torched cinnamon stick.",
    ingredients: [
      { item: "Double espresso", qty: "36 ml" },
      { item: "Medjool date syrup*", qty: "20 ml" },
      { item: "Whole milk", qty: "180 ml" },
      { item: "Cinnamon stick (torched)", qty: "1 small" },
      { item: "Flaked sea salt", qty: "1 pinch" },
    ],
    method: [
      "*Syrup: simmer 100 g pitted Medjool dates with 200 ml water 15 min, blend and strain.",
      "Combine espresso and date syrup in a warm cup.",
      "Steam milk to 62 °C and pour; finish with salt.",
      "Torch the cinnamon stick, rest it on the saucer and cloche briefly for aroma at the table.",
    ],
    temperature: "62 °C", cupSize: "12 oz / 355 ml ceramic",
    presentation: "Dark glazed cup, smouldering cinnamon stick on the saucer.",
    garnish: "Torched cinnamon stick, sea salt",
    costUsd: 1.15, priceUsd: 6.6, caffeine: "yes",
    target: "Evening customers and anyone who loves toffee and spice without refined sugar.",
    story: "Inspired by the smell of a fire dying down — warm, smoky, reluctant to end.",
    art: { vessel: "cup", layers: ["#4a2a15", "#a56a35"], foam: "#e9cda0", garnish: "cinnamon", bg: "#c9803f" },
  },
  {
    slug: "midnight-sesame", name: "Midnight Sesame", category: S, tier: "signature", serve: "either",
    tagline: "Black sesame cream, espresso and honey.",
    description: "Nutty, toasty and slate-grey with a velvet mouthfeel. Black sesame cream replaces syrup for a savoury-sweet depth.",
    ingredients: [
      { item: "Double espresso", qty: "36 ml" },
      { item: "Black sesame cream*", qty: "25 g" },
      { item: "Whole milk (or oat)", qty: "200 ml" },
      { item: "Toasted white sesame", qty: "1 g" },
    ],
    method: [
      "*Cream: grind 100 g toasted black sesame to a paste, blend with 40 g honey and 20 g water.",
      "Whisk sesame cream with espresso until smooth.",
      "Add steamed milk (hot) or milk over ice (iced). Stir.",
      "Finish with toasted sesame.",
    ],
    temperature: "Hot 62 °C or iced 2–4 °C", cupSize: "12 oz hot / 16 oz iced",
    presentation: "Matte charcoal cup, or tall glass with a dark ink-like swirl.",
    garnish: "Toasted white sesame",
    costUsd: 1.42, priceUsd: 6.9, caffeine: "yes",
    target: "Customers familiar with East Asian flavours and adventurous latte drinkers.",
    story: "The quiet hours after midnight, when the best ideas arrive.",
    art: { vessel: "cup", layers: ["#1f1b1b", "#5a5352"], foam: "#a8a09a", garnish: "sesame", bg: "#8b8178" },
  },
  {
    slug: "rose-cloud-cold-brew", name: "Rose Cloud Cold Brew", category: S, tier: "signature", serve: "iced",
    tagline: "Cold brew under a vanilla-rose cloud.",
    description: "Smooth 16-hour cold brew crowned with a lightly floral rose-vanilla cold foam and a scatter of dried petals.",
    ingredients: [
      { item: "Cold brew (ready to drink)", qty: "200 ml" },
      { item: "Ice", qty: "120 g" },
      { item: "Heavy cream", qty: "30 ml" },
      { item: "Milk (2%)", qty: "30 ml" },
      { item: "Vanilla syrup", qty: "8 ml" },
      { item: "Rose water", qty: "0.5 ml (≈ 8 drops)" },
      { item: "Dried rose petals", qty: "0.3 g" },
    ],
    method: [
      "Pour cold brew over ice.",
      "Froth cream, milk, vanilla and rose water for 15–20 s until pourable and thick.",
      "Float foam over the coffee and scatter petals.",
    ],
    temperature: "Served 2–4 °C", cupSize: "16 oz / 473 ml clear cup",
    presentation: "Clear tall glass so the layers read from every angle.",
    garnish: "Dried rose petals",
    costUsd: 1.3, priceUsd: 6.6, caffeine: "yes",
    target: "Instagram-first customers aged 18–34; strong gifting and date-night appeal.",
    story: "A romantic take on cold brew — soft enough to be dessert, clean enough to be coffee.",
    art: { vessel: "tall", layers: ["#2a1a12", "#4b2e1f"], foam: "#f4d9d2", ice: true, garnish: "petals", bg: "#e8b7ab" },
  },
  {
    slug: "hazelnut-noir-mocha", name: "Hazelnut Noir Mocha", category: S, tier: "signature", serve: "hot",
    tagline: "70% dark chocolate ganache and toasted hazelnut praline.",
    description: "A grown-up mocha built on real couverture melted into a ganache, lifted by hazelnut praline and cacao nibs.",
    ingredients: [
      { item: "Double espresso", qty: "36 ml" },
      { item: "70% dark chocolate couverture", qty: "25 g" },
      { item: "Hazelnut praline paste", qty: "12 g" },
      { item: "Whole milk", qty: "190 ml" },
      { item: "Cacao nibs + hazelnut crumb", qty: "2 g" },
    ],
    method: [
      "Melt chocolate in 20 ml hot water with praline, whisk to a ganache in the cup.",
      "Pull espresso into the ganache and stir.",
      "Steam milk to 60 °C and pour, keeping texture glossy.",
      "Finish with nibs and crumb.",
    ],
    temperature: "60 °C", cupSize: "12 oz / 355 ml ceramic",
    presentation: "Black cup, small square of dark chocolate on the saucer.",
    garnish: "Cacao nibs, hazelnut crumb",
    costUsd: 1.58, priceUsd: 7.0, caffeine: "yes",
    target: "Chocolate lovers who find café mochas too sweet.",
    story: "The mocha, re-imagined as a dark chocolate tasting.",
    art: { vessel: "cup", layers: ["#2e1a10", "#6b3a22"], foam: "#c79a6b", garnish: "nibs", bg: "#a8673a" },
  },
  {
    slug: "neroli-cortado", name: "Neroli Cortado", category: S, tier: "signature", serve: "hot",
    tagline: "Orange blossom honey and a twist of zest.",
    description: "A small, polished cortado scented with orange blossom — fragrant, balanced, and over in six perfect sips.",
    ingredients: [
      { item: "Double espresso", qty: "36 ml" },
      { item: "Steamed whole milk", qty: "90 ml" },
      { item: "Orange blossom honey", qty: "8 g" },
      { item: "Orange blossom water", qty: "0.5 ml (≈ 10 drops)" },
      { item: "Orange zest", qty: "1 twist" },
    ],
    method: [
      "Dissolve honey in the fresh espresso; add orange blossom water (taste first — it is potent).",
      "Pour in 90 ml of lightly textured milk.",
      "Express orange zest over the surface and drop in.",
    ],
    temperature: "58–60 °C", cupSize: "5 oz / 150 ml glass",
    presentation: "Gibraltar-style glass on a mini tray with a sparkling-water chaser.",
    garnish: "Expressed orange zest",
    costUsd: 0.88, priceUsd: 5.4, caffeine: "yes",
    target: "Coffee purists who want something distinctive without a big milky drink.",
    story: "A nod to Mediterranean courtyards where orange trees perfume the morning espresso.",
    art: { vessel: "glass", layers: ["#7a4a22", "#c9985a"], foam: "#f1dcb8", garnish: "zest", bg: "#f0c48a" },
  },
  {
    slug: "monsoon", name: "Monsoon", category: S, tier: "signature", serve: "iced",
    tagline: "Pandan cold brew under toasted coconut cloud.",
    description: "Green-tinged pandan syrup and cold brew topped with coconut cream foam — tropical, creamy and refreshing.",
    ingredients: [
      { item: "Cold brew", qty: "180 ml" },
      { item: "Pandan syrup*", qty: "15 ml" },
      { item: "Coconut cream", qty: "30 ml" },
      { item: "Oat milk", qty: "20 ml" },
      { item: "Simple syrup", qty: "5 ml" },
      { item: "Ice", qty: "120 g" },
      { item: "Toasted coconut flakes + pandan leaf knot", qty: "garnish" },
    ],
    method: [
      "*Syrup: blend 5 pandan leaves with 100 ml water, strain, simmer with 100 g sugar.",
      "Layer pandan syrup, ice and cold brew.",
      "Froth coconut cream, oat milk and simple syrup; float on top.",
      "Garnish with coconut flakes and a knotted pandan leaf.",
    ],
    temperature: "Served 2–4 °C", cupSize: "16 oz / 473 ml tall glass",
    presentation: "Tall glass with a knotted pandan leaf on the rim.",
    garnish: "Toasted coconut, pandan leaf knot",
    costUsd: 1.22, priceUsd: 6.6, caffeine: "yes",
    target: "Customers from or curious about Southeast Asian flavours; dairy-free friendly.",
    story: "The fresh, green breath of the air after a tropical downpour.",
    art: { vessel: "tall", layers: ["#2a1a12", "#5b6b2f", "#9bab55"], foam: "#f6f1e3", ice: true, garnish: "leaf", bg: "#b7c68a" },
  },
  {
    slug: "amber-miso", name: "Amber Miso", category: S, tier: "signature", serve: "either",
    tagline: "Maple, white miso and a flake of sea salt.",
    description: "A salted-caramel latte that tastes like toffee but gets its depth from fermented miso. Savoury edges, long sweet finish.",
    ingredients: [
      { item: "Double espresso", qty: "36 ml" },
      { item: "Maple-miso caramel*", qty: "20 ml" },
      { item: "Whole milk (or oat)", qty: "200 ml" },
      { item: "Flaked sea salt + black sesame", qty: "pinch" },
    ],
    method: [
      "*Caramel: whisk 20 g white (shiro) miso into 120 ml warm maple syrup, reduce 5 min on low heat. Cool.",
      "Whisk caramel into hot espresso until dissolved.",
      "Add steamed milk or milk over ice. Taste and adjust — miso brands vary in salt.",
    ],
    temperature: "Hot 62 °C or iced 2–4 °C", cupSize: "12 oz hot / 16 oz iced",
    presentation: "Amber glass or stoneware, caramel drizzled inside the cup.",
    garnish: "Sea salt flake, black sesame",
    costUsd: 1.2, priceUsd: 6.8, caffeine: "yes",
    target: "Salted-caramel fans looking for something less sugary and more complex.",
    story: "Umami meets maple — a friendship between two continents.",
    art: { vessel: "cup", layers: ["#7a4a22", "#c88a3f"], foam: "#f0d6a8", garnish: "flake", bg: "#d9a14e" },
  },
  {
    slug: "sunset-spritz", name: "Sunset Spritz", category: S, tier: "signature", serve: "iced",
    tagline: "Tamarind, lime and espresso over sparkling water.",
    description: "A non-alcoholic coffee spritz: tangy tamarind syrup, lime and espresso lifted with bubbles and a chilli-salt rim.",
    ingredients: [
      { item: "Espresso shot, chilled", qty: "36 ml" },
      { item: "Tamarind syrup*", qty: "20 ml" },
      { item: "Lime juice", qty: "10 ml" },
      { item: "Sparkling water", qty: "120 ml" },
      { item: "Ice", qty: "150 g" },
      { item: "Orange wheel, chilli-salt rim", qty: "garnish" },
    ],
    method: [
      "*Syrup: simmer 40 g tamarind pulp, 40 g sugar and 100 ml water 8 min; strain.",
      "Rim half the glass with chilli-lime salt; fill with ice.",
      "Add tamarind syrup, lime and sparkling water; stir.",
      "Float chilled espresso on top; garnish with orange wheel.",
    ],
    temperature: "Served 2–4 °C", cupSize: "16 oz / 473 ml stemmed glass",
    presentation: "Stemmed glass with a burnt-orange gradient.",
    garnish: "Orange wheel, chilli-salt rim",
    costUsd: 1.05, priceUsd: 6.2, caffeine: "yes",
    target: "Customers who want a daytime non-alcoholic social drink.",
    story: "A sundowner for people who still have somewhere to be in the morning.",
    art: { vessel: "tulip", layers: ["#8b3a1c", "#d96b2b", "#f0a65a"], ice: true, garnish: "wheel", bg: "#f0a65a" },
  },
  {
    slug: "silk-road-cappuccino", name: "Silk Road Cappuccino", category: S, tier: "signature", serve: "hot",
    tagline: "Cardamom, cinnamon and toasted almond.",
    description: "A fragrant cappuccino inspired by spice-route coffees: cardamom and cinnamon syrup, a cloud of foam, toasted almond.",
    ingredients: [
      { item: "Double espresso", qty: "36 ml" },
      { item: "Cardamom-cinnamon syrup*", qty: "12 ml" },
      { item: "Whole milk", qty: "150 ml" },
      { item: "Toasted almond slivers", qty: "2 g" },
      { item: "Ground cardamom", qty: "pinch" },
    ],
    method: [
      "*Syrup: crush 6 cardamom pods, simmer with 1 cinnamon stick in 100 g sugar + 100 ml water 10 min; strain.",
      "Pull espresso onto syrup and stir.",
      "Steam milk to 62 °C with dense, glossy foam; pour a classic cappuccino.",
      "Top with almonds and a pinch of cardamom.",
    ],
    temperature: "62 °C", cupSize: "8 oz / 240 ml ceramic",
    presentation: "Wide-rimmed cup, almond shortbread on the side.",
    garnish: "Almond slivers, cardamom dust",
    costUsd: 1.02, priceUsd: 5.9, caffeine: "yes",
    target: "Customers who love chai or Arabic coffee spices; strong appeal in Gulf and South Asian markets.",
    story: "Caravans carried cardamom, cinnamon and coffee along the same roads.",
    art: { vessel: "cup", layers: ["#5a3319", "#a7743f"], foam: "#efd7ae", garnish: "almond", bg: "#cf9a5d" },
  },
  {
    slug: "ube-cloud-latte", name: "Ube Cloud Latte", category: S, tier: "signature", serve: "either",
    tagline: "Purple yam, coconut and espresso.",
    description: "Naturally violet and subtly vanilla-sweet. Ube halaya whisked into milk with coconut and an optional espresso shot.",
    ingredients: [
      { item: "Ube halaya (purple yam jam)", qty: "25 g" },
      { item: "Whole milk", qty: "180 ml" },
      { item: "Coconut milk", qty: "20 ml" },
      { item: "Espresso (optional)", qty: "36 ml" },
      { item: "Ube crumb", qty: "1 g" },
    ],
    method: [
      "Whisk ube halaya with 30 ml hot milk until smooth.",
      "Add espresso (if using) and remaining steamed milk and coconut milk.",
      "Garnish with ube crumb. Serve over ice for the iced version.",
    ],
    temperature: "Hot 62 °C or iced 2–4 °C", cupSize: "12 oz hot / 16 oz iced",
    presentation: "Pale lilac drink in a white cup or clear glass.",
    garnish: "Ube crumb",
    costUsd: 1.55, priceUsd: 6.8, caffeine: "optional",
    target: "Photo-led younger customers and non-coffee drinkers.",
    story: "Colour as comfort — the dessert aisle of a Manila bakery in a cup.",
    art: { vessel: "tall", layers: ["#6a4a9c", "#a98bd4", "#d8c8ee"], foam: "#f1ebf7", ice: true, garnish: "crumb", bg: "#c9b6e8" },
  },
  {
    slug: "hojicha-honey-iced", name: "Hojicha Honey Iced", category: S, tier: "signature", serve: "iced",
    tagline: "Roasted green tea, honey and oat milk.",
    description: "A caffeine-light, toasty tea latte: roasted hojicha whisked with honey and oat milk over ice.",
    ingredients: [
      { item: "Hojicha powder", qty: "3 g" },
      { item: "Hot water (80 °C)", qty: "40 ml" },
      { item: "Honey", qty: "12 g" },
      { item: "Oat milk", qty: "180 ml" },
      { item: "Ice", qty: "130 g" },
    ],
    method: [
      "Whisk hojicha powder and hot water to a smooth paste; dissolve honey in it.",
      "Fill glass with ice, add oat milk, then pour the hojicha concentrate over.",
      "Serve with a stir stick.",
    ],
    temperature: "Served 2–4 °C", cupSize: "16 oz / 473 ml glass",
    presentation: "Tall glass with a warm brown-to-cream gradient.",
    garnish: "Dusting of hojicha",
    costUsd: 1.0, priceUsd: 6.2, caffeine: "none",
    target: "Non-coffee drinkers, afternoon customers and parents.",
    story: "The smell of roasted tea leaves — like a quiet street in Kyoto at dusk.",
    art: { vessel: "tall", layers: ["#6b4a2e", "#a98254", "#e9d6b4"], ice: true, bg: "#d9b98a" },
  },
  {
    slug: "burnt-honey-affogato", name: "Burnt Honey Affogato", category: S, tier: "signature", serve: "dessert",
    tagline: "Vanilla gelato drowned in hot espresso and burnt honey.",
    description: "A tableside dessert: bean-flecked vanilla gelato, a double espresso poured over, and a shard of burnt honey.",
    ingredients: [
      { item: "Vanilla bean gelato", qty: "90 g" },
      { item: "Hot espresso", qty: "36 ml" },
      { item: "Burnt honey*", qty: "10 g" },
      { item: "Shortbread crumb + sea salt", qty: "2 g" },
    ],
    method: [
      "*Burnt honey: cook honey over medium heat to deep amber (~140 °C) with a pinch of salt; cool.",
      "Scoop gelato into a chilled glass; drizzle with burnt honey.",
      "Serve with espresso in a small pitcher to pour at the table.",
    ],
    temperature: "Hot espresso over frozen gelato", cupSize: "6 oz / 180 ml coupe",
    presentation: "Chilled coupe with a tableside espresso pour.",
    garnish: "Shortbread crumb, sea salt",
    costUsd: 1.65, priceUsd: 7.2, caffeine: "yes",
    target: "After-dinner customers and sharing occasions.",
    story: "A closing ritual for the golden hour: something cold, something bitter, something golden.",
    art: { vessel: "glass", layers: ["#5a3319", "#f3e6c8"], foam: "#f7efd9", garnish: "gelato", bg: "#e9c996" },
  },
];

// ---------------------------------------------------------------- Classics
type C = Omit<Product, "tier" | "art"> & { art?: ArtConfig };
const classic = (p: C): Product => ({
  ...p,
  tier: "classic",
  art: p.art ?? defaultArt(p),
});

function defaultArt(p: { serve: Product["serve"]; category: string }): ArtConfig {
  if (p.serve === "bakery") return { vessel: "plate", layers: ["#c98a3f"], garnish: "crumb", bg: "#ead8b9" };
  if (p.serve === "dessert") return { vessel: "plate", layers: ["#4a2a15"], garnish: "nibs", bg: "#e1c9a4" };
  if (p.serve === "iced") return { vessel: "tall", layers: ["#3a2418", "#7a4a22"], ice: true, bg: "#d9b98a" };
  if (p.category === "espresso") return { vessel: "glass", layers: ["#3a2418", "#7a4a22"], foam: "#d9a441", bg: "#c9a574" };
  return { vessel: "cup", layers: ["#5a3319", "#a7743f"], foam: "#efd7ae", bg: "#d6b27c" };
}

export const classics: Product[] = [
  classic({ slug: "espresso", name: "Espresso", category: "espresso", serve: "hot", tagline: "9 g in, 18 g out, 27 seconds.", description: "A single shot of our house blend, pulled short and syrupy with notes of cocoa, toasted hazelnut and orange peel.", temperature: "65–70 °C", cupSize: "2 oz / 60 ml", costUsd: 0.25, priceUsd: 3.2 }),
  classic({ slug: "doppio", name: "Doppio", category: "espresso", serve: "hot", tagline: "18 g in, 36 g out — our standard double.", description: "The double shot every Aurevo milk drink is built on: full body and a long, sweet finish.", temperature: "65–70 °C", cupSize: "3 oz / 90 ml", costUsd: 0.45, priceUsd: 3.9 }),
  classic({ slug: "cortado", name: "Cortado", category: "espresso", serve: "hot", tagline: "Espresso, cut with warm milk.", description: "Equal parts espresso and silky milk in a small glass.", temperature: "60 °C", cupSize: "4 oz / 120 ml", costUsd: 0.74, priceUsd: 4.2 }),
  classic({ slug: "americano", name: "Americano", category: "americano", serve: "hot", tagline: "Long, clean and quietly aromatic.", description: "Double espresso lengthened with hot filtered water.", temperature: "70 °C", cupSize: "12 oz / 355 ml", costUsd: 0.52, priceUsd: 3.8 }),
  classic({ slug: "long-black", name: "Long Black", category: "americano", serve: "hot", tagline: "Water first, shot on top — crema preserved.", description: "A double shot poured onto hot water to keep the crema intact.", temperature: "70 °C", cupSize: "8 oz / 240 ml", costUsd: 0.52, priceUsd: 3.9 }),
  classic({ slug: "cappuccino", name: "Cappuccino", category: "cappuccino", serve: "hot", tagline: "Equal parts espresso, steam and silk.", description: "Double espresso, textured milk and a thick velvety crown.", temperature: "62 °C", cupSize: "6 oz / 180 ml", costUsd: 0.86, priceUsd: 4.6 }),
  classic({ slug: "oat-cappuccino", name: "Oat Cappuccino", category: "cappuccino", serve: "hot", tagline: "Plant-based, equally velvety.", description: "Barista oat milk steamed to a glossy foam over a double espresso.", temperature: "62 °C", cupSize: "6 oz / 180 ml", costUsd: 0.98, priceUsd: 5.1 }),
  classic({ slug: "latte", name: "Latte", category: "latte", serve: "hot", tagline: "Soft, milky and generous.", description: "Double espresso with plenty of steamed milk and a thin foam.", temperature: "62 °C", cupSize: "12 oz / 355 ml", costUsd: 0.98, priceUsd: 4.8 }),
  classic({ slug: "flat-white", name: "Flat White", category: "latte", serve: "hot", tagline: "Ristretto double with microfoam.", description: "A strong, small latte with a thin layer of microfoam.", temperature: "60 °C", cupSize: "6 oz / 180 ml", costUsd: 0.86, priceUsd: 4.6 }),
  classic({ slug: "vanilla-bean-latte", name: "Vanilla Bean Latte", category: "latte", serve: "either", tagline: "House vanilla, real bean.", description: "Latte with house vanilla bean syrup.", temperature: "Hot 62 °C or iced", cupSize: "12 oz / 355 ml", costUsd: 1.1, priceUsd: 5.4 }),
  classic({ slug: "dark-mocha", name: "Dark Chocolate Mocha", category: "mocha", serve: "either", tagline: "Real couverture, no powder.", description: "Espresso, melted 70% dark chocolate and steamed milk.", temperature: "Hot 60 °C or iced", cupSize: "12 oz / 355 ml", costUsd: 1.3, priceUsd: 5.6 }),
  classic({ slug: "white-mocha", name: "White Chocolate Mocha", category: "mocha", serve: "either", tagline: "Creamy and sweet.", description: "Espresso and melted white chocolate with steamed milk.", temperature: "Hot 60 °C or iced", cupSize: "12 oz / 355 ml", costUsd: 1.25, priceUsd: 5.6 }),
  classic({ slug: "cold-brew", name: "Cold Brew", category: "cold-coffee", serve: "iced", tagline: "Steeped 16 hours, served over ice.", description: "Smooth, low-acid and naturally sweet.", temperature: "2–4 °C", cupSize: "16 oz / 473 ml", costUsd: 0.75, priceUsd: 5.0 }),
  classic({ slug: "iced-latte", name: "Iced Latte", category: "cold-coffee", serve: "iced", tagline: "Double espresso, cold milk, ice.", description: "Simple, refreshing and always on the menu.", temperature: "2–4 °C", cupSize: "16 oz / 473 ml", costUsd: 1.0, priceUsd: 5.2 }),
  classic({ slug: "iced-americano", name: "Iced Americano", category: "cold-coffee", serve: "iced", tagline: "Bold and crisp.", description: "Double espresso poured over water and ice.", temperature: "2–4 °C", cupSize: "16 oz / 473 ml", costUsd: 0.55, priceUsd: 4.2 }),
  classic({ slug: "iced-matcha-latte", name: "Iced Matcha Latte", category: "iced-drinks", serve: "iced", tagline: "Ceremonial-grade, whisked to order.", description: "Ceremonial matcha with milk over ice.", temperature: "2–4 °C", cupSize: "16 oz / 473 ml", costUsd: 1.3, priceUsd: 5.8, art: { vessel: "tall", layers: ["#6d8a3a", "#a4bd6a", "#eef0d8"], ice: true, bg: "#cfdc9e" } }),
  classic({ slug: "iced-chai", name: "Iced Spiced Chai", category: "iced-drinks", serve: "iced", tagline: "Slow-simmered masala spices.", description: "House chai concentrate with milk over ice.", temperature: "2–4 °C", cupSize: "16 oz / 473 ml", costUsd: 0.95, priceUsd: 5.4, art: { vessel: "tall", layers: ["#8a5a2e", "#c79a62", "#efdcb8"], ice: true, bg: "#dcb98a" } }),
  classic({ slug: "hibiscus-berry-cooler", name: "Hibiscus Berry Cooler", category: "iced-drinks", serve: "iced", tagline: "Caffeine-free and ruby bright.", description: "Hibiscus tea, mixed berries and lemon over crushed ice.", temperature: "2–4 °C", cupSize: "16 oz / 473 ml", costUsd: 0.95, priceUsd: 5.2, caffeine: "none", art: { vessel: "tall", layers: ["#9b1c3c", "#d84a6a", "#f3a5b5"], ice: true, bg: "#f0b5c0" } }),
  classic({ slug: "single-origin-pour-over", name: "Single-Origin Pour Over (V60)", category: "specialty-coffee", serve: "hot", tagline: "Rotating origin, hand-poured.", description: "A rotating single-origin coffee brewed by hand; tasting notes on the card each week.", temperature: "68 °C", cupSize: "10 oz / 300 ml", costUsd: 1.5, priceUsd: 6.5 }),
  classic({ slug: "espresso-flight", name: "Espresso Flight", category: "specialty-coffee", serve: "hot", tagline: "Three origins, three shots.", description: "Three single-origin espressos served with sparkling water and tasting notes.", temperature: "65–70 °C", cupSize: "3 × 1.5 oz", costUsd: 1.9, priceUsd: 9.0 }),
  classic({ slug: "basque-cheesecake", name: "Burnt Basque Cheesecake", category: "desserts", serve: "dessert", tagline: "Caramelised top, custard centre.", description: "Crustless, deeply caramelised cheesecake with a soft centre.", temperature: "Chilled", cupSize: "1 slice (≈ 110 g)", costUsd: 1.9, priceUsd: 6.5 }),
  classic({ slug: "dark-chocolate-tart", name: "Dark Chocolate Tart", category: "desserts", serve: "dessert", tagline: "Salted, glossy, 70% cacao.", description: "Buttery sablé shell with a silky dark chocolate ganache.", temperature: "Room temperature", cupSize: "1 slice (≈ 100 g)", costUsd: 2.0, priceUsd: 6.8 }),
  classic({ slug: "cardamom-panna-cotta", name: "Cardamom Panna Cotta", category: "desserts", serve: "dessert", tagline: "Wobbly, floral, finished with pistachio.", description: "Cardamom-scented cream set in a glass with rose-poached fruit.", temperature: "Chilled", cupSize: "5 oz / 150 ml", costUsd: 1.6, priceUsd: 6.2 }),
  classic({ slug: "butter-croissant", name: "Butter Croissant", category: "bakery", serve: "bakery", tagline: "Laminated for 27 layers.", description: "All-butter croissant baked fresh each morning.", temperature: "Warm", cupSize: "1 piece", costUsd: 0.9, priceUsd: 4.0 }),
  classic({ slug: "almond-croissant", name: "Almond Croissant", category: "bakery", serve: "bakery", tagline: "Twice-baked with frangipane.", description: "Day-old croissant soaked, filled with almond cream and baked again.", temperature: "Warm", cupSize: "1 piece", costUsd: 1.2, priceUsd: 4.8 }),
  classic({ slug: "orange-cardamom-bun", name: "Orange-Cardamom Morning Bun", category: "bakery", serve: "bakery", tagline: "Spiralled, sticky, fragrant.", description: "Laminated dough rolled with orange zest, sugar and cardamom.", temperature: "Warm", cupSize: "1 piece", costUsd: 1.0, priceUsd: 4.6 }),
  classic({ slug: "sesame-honey-financier", name: "Sesame Honey Financier", category: "bakery", serve: "bakery", tagline: "Brown-butter almond cake.", description: "A small brown-butter cake with honey and toasted sesame.", temperature: "Room temperature", cupSize: "1 piece", costUsd: 0.8, priceUsd: 3.8 }),
];

export const products: Product[] = [...signature, ...classics];

export const margin = (p: Pick<Product, "costUsd" | "priceUsd">) =>
  Math.round(((p.priceUsd - p.costUsd) / p.priceUsd) * 1000) / 10;

export const money = (n: number) => `$${n.toFixed(2)}`;
