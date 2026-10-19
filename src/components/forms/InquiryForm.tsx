"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { countries, philippinePlaces, referralSources } from "@/data/site";
import { cn } from "@/lib/utils";

type Variant = "home" | "contact" | "property" | "agent" | "partner";

export interface ProjectOption {
  value: string;
  label: string;
}

interface Props {
  variant?: Variant;
  projects?: ProjectOption[];
  defaultProject?: string;
  defaultTopic?: string;
  title?: string;
  description?: string;
  light?: boolean;
  compact?: boolean;
}

type Errors = Partial<Record<string, string>>;

export function InquiryForm({ variant = "contact", projects = [], defaultProject, defaultTopic, title, description, light, compact }: Props) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverMessage, setServerMessage] = useState("");
  const [project, setProject] = useState(defaultProject ?? "");
  const [country, setCountry] = useState("Philippines");

  const showProject = variant === "contact" || variant === "property";
  const showPlace = variant === "contact";
  const showReferral = variant === "contact";
  const showTopic = variant === "partner";
  const fieldClass = cn("field", light && "field-light");

  function validate(data: Record<string, FormDataEntryValue>): Errors {
    const e: Errors = {};
    if (!String(data.first_name).trim()) e.first_name = "Required";
    if (!String(data.last_name).trim()) e.last_name = "Required";
    const email = String(data.email).trim();
    if (!email) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email address";
    const phone = String(data.phone_number).replace(/[\s()-]/g, "");
    if (!phone) e.phone_number = "Required";
    else if (!/^\+?\d{7,15}$/.test(phone)) e.phone_number = "Enter a valid phone number";
    if (!String(data.country)) e.country = "Required";
    if (showProject && !String(data.project_interest)) e.project_interest = "Required";
    if (showProject && String(data.project_interest) === "Others" && !String(data.project_interest_others).trim()) e.project_interest_others = "Tell us what you're looking for";
    if (showReferral && !String(data.where_did_find_about_us)) e.where_did_find_about_us = "Required";
    if (!String(data.message).trim()) e.message = "Required";
    if (!data.agree_terms) e.agree_terms = "You must agree to continue";
    return e;
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = form.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }
    setStatus("submitting");
    setServerMessage("");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, variant, agree_newsletter: Boolean(data.agree_newsletter), agree_terms: Boolean(data.agree_terms) }),
      });
      const json = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) throw new Error(json.message || "Something went wrong. Please try again.");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setServerMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className={cn("rounded-xl border p-8 text-center", light ? "border-navy-900/10 bg-white" : "border-gold-500/30 bg-white/[0.03]")}>
        <CheckCircle2 className="mx-auto size-10 text-gold-500" />
        <h3 className={cn("mt-4 font-display text-xl font-bold", light && "text-navy-900")}>Thank you. We have received your inquiry.</h3>
        <p className={cn("mt-2 text-sm", light ? "text-navy-700" : "text-white/65")}>A member of the Stealth Land team will get back to you shortly.</p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-6 text-sm text-gold-500 underline-offset-4 hover:underline">
          Send another inquiry
        </button>
      </div>
    );
  }

  const labelCls = cn("mb-1.5 block text-xs font-medium", light ? "text-navy-700" : "text-white/70");
  const err = (k: string) => errors[k] && <p className="mt-1 text-xs text-red-400">{errors[k]}</p>;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4" id="inquire">
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className={cn("font-display text-2xl font-bold sm:text-3xl", light ? "text-navy-900" : "text-white")}>{title}</h2>}
          {description && <p className={cn("mt-2 text-sm", light ? "text-navy-700" : "text-white/65")}>{description}</p>}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${variant}-first_name`} className={labelCls}>First name</label>
          <input id={`${variant}-first_name`} name="first_name" autoComplete="given-name" className={fieldClass} placeholder="Juan" aria-invalid={!!errors.first_name} />
          {err("first_name")}
        </div>
        <div>
          <label htmlFor={`${variant}-last_name`} className={labelCls}>Last name</label>
          <input id={`${variant}-last_name`} name="last_name" autoComplete="family-name" className={fieldClass} placeholder="Dela Cruz" aria-invalid={!!errors.last_name} />
          {err("last_name")}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${variant}-phone`} className={labelCls}>Phone number</label>
          <input id={`${variant}-phone`} name="phone_number" type="tel" inputMode="tel" autoComplete="tel" className={fieldClass} placeholder="+63 917 000 0000" aria-invalid={!!errors.phone_number} />
          {err("phone_number")}
        </div>
        <div>
          <label htmlFor={`${variant}-email`} className={labelCls}>Email</label>
          <input id={`${variant}-email`} name="email" type="email" autoComplete="email" className={fieldClass} placeholder="you@example.com" aria-invalid={!!errors.email} />
          {err("email")}
        </div>
      </div>

      <div className={cn("grid gap-4", showPlace && country === "Philippines" && "sm:grid-cols-2")}>
        <div>
          <label htmlFor={`${variant}-country`} className={labelCls}>Country</label>
          <select id={`${variant}-country`} name="country" className={fieldClass} value={country} onChange={(e) => setCountry(e.target.value)} aria-invalid={!!errors.country}>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {err("country")}
        </div>
        {showPlace && country === "Philippines" && (
          <div>
            <label htmlFor={`${variant}-place`} className={labelCls}>City / Province</label>
            <select id={`${variant}-place`} name="place" className={fieldClass} defaultValue="">
              <option value="">Select a place</option>
              {philippinePlaces.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {showProject && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${variant}-project`} className={labelCls}>Project of interest</label>
            <select id={`${variant}-project`} name="project_interest" className={fieldClass} value={project} onChange={(e) => setProject(e.target.value)} aria-invalid={!!errors.project_interest}>
              <option value="">Select a project</option>
              {projects.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
              <option value="Others">Others</option>
              <option value="Not Applicable">Not applicable</option>
            </select>
            {err("project_interest")}
          </div>
          {project === "Others" && (
            <div>
              <label htmlFor={`${variant}-project_other`} className={labelCls}>Tell us what you are looking for</label>
              <input id={`${variant}-project_other`} name="project_interest_others" className={fieldClass} placeholder="e.g. 2BR in Cebu" aria-invalid={!!errors.project_interest_others} />
              {err("project_interest_others")}
            </div>
          )}
        </div>
      )}

      {showTopic && (
        <div>
          <label htmlFor={`${variant}-topic`} className={labelCls}>Partnership type</label>
          <select id={`${variant}-topic`} name="project_interest" className={fieldClass} defaultValue={defaultTopic ?? ""}>
            <option value="">Select a partnership type</option>
            <option value="Investor Relations">Investor Relations</option>
            <option value="Landowner / Joint Venture">Landowner / Joint Venture</option>
            <option value="Broker / Agency">Broker / Agency</option>
            <option value="Contractor / Supplier">Contractor / Supplier</option>
          </select>
        </div>
      )}

      {showReferral && (
        <div>
          <label htmlFor={`${variant}-ref`} className={labelCls}>Where did you find out about us?</label>
          <select id={`${variant}-ref`} name="where_did_find_about_us" className={fieldClass} defaultValue="" aria-invalid={!!errors.where_did_find_about_us}>
            <option value="">Select one</option>
            {referralSources.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {err("where_did_find_about_us")}
        </div>
      )}

      <div>
        <label htmlFor={`${variant}-message`} className={labelCls}>Message</label>
        <textarea id={`${variant}-message`} name="message" rows={compact ? 3 : 4} className={fieldClass} placeholder="Tell us about your requirements, preferred unit, or questions." aria-invalid={!!errors.message} />
        {err("message")}
      </div>

      <div className={cn("space-y-2.5 text-xs", light ? "text-navy-700" : "text-white/70")}>
        <label className="flex cursor-pointer items-start gap-2.5">
          <input type="checkbox" name="agree_newsletter" className="mt-0.5 size-4 shrink-0 accent-gold-500" />
          <span>I want to receive news and updates about Stealth Land.</span>
        </label>
        <label className="flex cursor-pointer items-start gap-2.5">
          <input type="checkbox" name="agree_terms" className="mt-0.5 size-4 shrink-0 accent-gold-500" aria-invalid={!!errors.agree_terms} />
          <span>
            I have read and agree with the website&apos;s{" "}
            <Link href="/privacy-policy" className="text-gold-500 underline-offset-2 hover:underline">Privacy Policy</Link> and{" "}
            <Link href="/terms-of-use" className="text-gold-500 underline-offset-2 hover:underline">Terms of Use</Link>.
          </span>
        </label>
        {err("agree_terms")}
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{serverMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gold-500 px-7 py-3.5 font-display text-xs font-semibold uppercase tracking-[0.18em] text-navy-900 transition hover:bg-gold-400 disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" && <Loader2 className="size-4 animate-spin" />}
        {status === "submitting" ? "Sending" : "Submit inquiry"}
      </button>
    </form>
  );
}
