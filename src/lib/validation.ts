import { z } from "zod";

/** Strips tags/control chars and collapses whitespace. Output is still escaped by React on render. */
export const clean = (s: string) =>
  s.replace(/<[^>]*>/g, "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/[ \t]+/g, " ").trim();

const text = (min: number, max: number, label: string) =>
  z.string().transform(clean).pipe(z.string().min(min, `${label} is too short`).max(max, `${label} is too long`));
const optional = (max: number) =>
  z.string().optional().transform((v) => (v ? clean(v) : "")).pipe(z.string().max(max));

export const contactSchema = z.object({
  name: text(2, 120, "Name"),
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(200),
  subject: text(2, 160, "Subject"),
  message: text(10, 4000, "Message"),
});

export const partnershipSchema = z.object({
  name: text(2, 120, "Name"),
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(200),
  phone: optional(40),
  company: optional(160),
  partnership_type: z.enum(["coffee_shop", "licensing", "collaboration", "supplier", "media", "other"]),
  message: text(10, 4000, "Message"),
});

export const franchiseSchema = z.object({
  name: text(2, 120, "Name"),
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(200),
  phone: optional(40),
  country: text(2, 80, "Country"),
  city: optional(80),
  investment_range: z.enum(["under_50k", "50k_150k", "150k_400k", "over_400k", "not_sure"]),
  experience: z.enum(["none", "hospitality", "multi_unit", "other"]),
  has_site: z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean()),
  message: optional(4000),
  ack: z.literal("on", { message: "Please confirm you understand this is a concept stage enquiry" }),
});

// ---- admin
export const slug = z.string().trim().toLowerCase().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes");
export const productSchema = z.object({
  name: text(2, 120, "Name"),
  slug,
  category_id: z.string().uuid("Choose a category"),
  tier: z.enum(["signature", "classic"]),
  serve: z.enum(["hot", "iced", "either", "dessert", "bakery"]),
  tagline: optional(200),
  description: optional(1200),
  ingredients: z.string().optional().default(""),
  method: z.string().optional().default(""),
  temperature: optional(80),
  cup_size: optional(80),
  presentation: optional(300),
  garnish: optional(200),
  target_customer: optional(300),
  story: optional(600),
  caffeine: z.enum(["yes", "optional", "none"]),
  cost_usd: z.coerce.number().min(0).max(999),
  price_usd: z.coerce.number().min(0).max(999),
  recipe_status: z.enum(["proposed", "in_testing", "approved"]),
  is_active: z.preprocess((v) => v === "on", z.boolean()),
  is_featured: z.preprocess((v) => v === "on", z.boolean()),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
});
export const categorySchema = z.object({
  name: text(2, 80, "Name"), slug, blurb: optional(300),
  sort_order: z.coerce.number().int().min(0).max(999).default(0),
  is_active: z.preprocess((v) => v === "on", z.boolean()),
});
export const gallerySchema = z.object({
  title: text(1, 120, "Title"), caption: optional(300),
  tag: z.enum(["drinks", "brand", "cafe", "events"]),
  sort_order: z.coerce.number().int().min(0).max(999).default(0),
  is_active: z.preprocess((v) => v === "on", z.boolean()),
  image_url: z.string().trim().max(600).optional().default(""),
});

export const parseIngredients = (s: string) =>
  s.split("\n").map((l) => clean(l)).filter(Boolean).map((l) => {
    const [item, ...rest] = l.split("|");
    return { item: clean(item), qty: clean(rest.join("|")) };
  });
export const parseLines = (s: string) => s.split("\n").map((l) => clean(l)).filter(Boolean);

export type FormState = { ok?: boolean; message?: string; errors?: Record<string, string> };
export const fieldErrors = (e: z.ZodError): Record<string, string> =>
  Object.fromEntries(e.issues.map((i) => [String(i.path[0] ?? "form"), i.message]));
