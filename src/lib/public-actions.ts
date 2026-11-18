"use server";
import { headers } from "next/headers";
import { publicClient } from "@/lib/supabase/public";
import { contactSchema, fieldErrors, franchiseSchema, partnershipSchema, type FormState } from "@/lib/validation";
import type { ZodType } from "zod";

// Best-effort per-instance throttle (serverless instances are ephemeral). Use Vercel Firewall rate limiting for hard limits.
const hits = new Map<string, number[]>();
async function throttled(): Promise<boolean> {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  if (recent.length >= 5) return true;
  hits.set(ip, [...recent, now]);
  return false;
}

async function submit(table: string, schema: ZodType, fd: FormData, strip: string[] = []): Promise<FormState> {
  if (fd.get("website")) return { ok: true, message: "Thank you — we will be in touch." }; // honeypot: silently drop bots
  const parsed = schema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { ok: false, message: "Please check the highlighted fields.", errors: fieldErrors(parsed.error) };
  if (await throttled()) return { ok: false, message: "Too many submissions. Please try again in a few minutes." };
  const db = publicClient();
  if (!db) return { ok: false, message: "Submissions are unavailable until the backend is configured." };
  const row = { ...(parsed.data as Record<string, unknown>) };
  strip.forEach((k) => delete row[k]);
  const { error } = await db.from(table).insert(row);
  if (error) return { ok: false, message: "We could not save your message. Please try again shortly." };
  return { ok: true, message: "Thank you — your message has been received. We usually reply within 3 business days." };
}

export async function submitContact(_: FormState, fd: FormData) { return submit("contact_messages", contactSchema, fd); }
export async function submitPartnership(_: FormState, fd: FormData) { return submit("partnership_requests", partnershipSchema, fd); }
export async function submitFranchise(_: FormState, fd: FormData) { return submit("franchise_inquiries", franchiseSchema, fd, ["ack"]); }
