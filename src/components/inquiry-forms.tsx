"use client";
import { submitContact, submitFranchise, submitPartnership } from "@/lib/public-actions";
import { Done, Field, Honeypot, Submit, inputProps, useFormAction } from "@/components/form-kit";

export function ContactForm() {
  const { state, run, pending } = useFormAction(submitContact);
  const e = state.errors;
  if (state.ok) return <Done state={state} />;
  return (
    <form action={run} className="relative grid gap-5" noValidate>
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" error={e?.name}><input {...inputProps("name", e)} autoComplete="name" required /></Field>
        <Field label="Email" name="email" error={e?.email}><input {...inputProps("email", e)} type="email" autoComplete="email" required /></Field>
      </div>
      <Field label="Subject" name="subject" error={e?.subject}><input {...inputProps("subject", e)} required /></Field>
      <Field label="Message" name="message" error={e?.message}><textarea {...inputProps("message", e)} rows={6} required /></Field>
      <div><Submit pending={pending}>Send message</Submit></div>
    </form>
  );
}

export function PartnershipForm() {
  const { state, run, pending } = useFormAction(submitPartnership);
  const e = state.errors;
  if (state.ok) return <Done state={state} />;
  return (
    <form action={run} className="relative grid gap-5" noValidate>
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" error={e?.name}><input {...inputProps("name", e)} autoComplete="name" required /></Field>
        <Field label="Email" name="email" error={e?.email}><input {...inputProps("email", e)} type="email" autoComplete="email" required /></Field>
        <Field label="Phone (optional)" name="phone" error={e?.phone}><input {...inputProps("phone", e)} type="tel" autoComplete="tel" /></Field>
        <Field label="Company (optional)" name="company" error={e?.company}><input {...inputProps("company", e)} autoComplete="organization" /></Field>
      </div>
      <Field label="Type of partnership" name="partnership_type" error={e?.partnership_type}>
        <select {...inputProps("partnership_type", e)} defaultValue="coffee_shop">
          <option value="coffee_shop">Café / coffee shop partnership</option>
          <option value="licensing">Signature beverage licensing</option>
          <option value="collaboration">Branded product collaboration</option>
          <option value="supplier">Supplier / roaster</option>
          <option value="media">Media / creator</option>
          <option value="other">Something else</option>
        </select>
      </Field>
      <Field label="Tell us about your idea" name="message" error={e?.message}><textarea {...inputProps("message", e)} rows={5} required /></Field>
      <div><Submit pending={pending}>Send partnership request</Submit></div>
    </form>
  );
}

export function FranchiseForm() {
  const { state, run, pending } = useFormAction(submitFranchise);
  const e = state.errors;
  if (state.ok) return <Done state={state} />;
  return (
    <form action={run} className="relative grid gap-5" noValidate>
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" error={e?.name}><input {...inputProps("name", e)} autoComplete="name" required /></Field>
        <Field label="Email" name="email" error={e?.email}><input {...inputProps("email", e)} type="email" autoComplete="email" required /></Field>
        <Field label="Phone (optional)" name="phone" error={e?.phone}><input {...inputProps("phone", e)} type="tel" autoComplete="tel" /></Field>
        <Field label="Country" name="country" error={e?.country}><input {...inputProps("country", e)} autoComplete="country-name" required /></Field>
        <Field label="City (optional)" name="city" error={e?.city}><input {...inputProps("city", e)} /></Field>
        <Field label="Investment range you are considering" name="investment_range" error={e?.investment_range} hint="Indicative only — no pricing has been set.">
          <select {...inputProps("investment_range", e)} defaultValue="not_sure">
            <option value="not_sure">Not sure yet</option><option value="under_50k">Under US$50k</option><option value="50k_150k">US$50k – 150k</option><option value="150k_400k">US$150k – 400k</option><option value="over_400k">Over US$400k</option>
          </select>
        </Field>
      </div>
      <Field label="Experience" name="experience" error={e?.experience}>
        <select {...inputProps("experience", e)} defaultValue="none">
          <option value="none">New to food & beverage</option><option value="hospitality">Hospitality / café operator</option><option value="multi_unit">Multi-unit operator</option><option value="other">Other</option>
        </select>
      </Field>
      <label className="flex items-center gap-3 text-sm"><input type="checkbox" name="has_site" className="h-5 w-5 accent-[#C9873A]" /> I already have a potential site</label>
      <Field label="Anything else?" name="message" error={e?.message}><textarea {...inputProps("message", e)} rows={4} /></Field>
      <div>
        <label className="flex items-start gap-3 text-sm"><input type="checkbox" name="ack" required className="mt-0.5 h-5 w-5 accent-[#C9873A]" /> <span>I understand Aurevo is a <strong>concept-stage brand</strong>; this is an expression of interest, not an offer, and no franchise is currently available.</span></label>
        {e?.ack && <p role="alert" className="mt-1 text-xs font-medium text-ember">{e.ack}</p>}
      </div>
      <div><Submit pending={pending}>Register interest</Submit></div>
    </form>
  );
}
