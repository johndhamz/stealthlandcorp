"use client";

import Link from "next/link";

export const labelCls = "mb-1.5 block text-xs font-medium text-white/70";

/** Name, email and phone inputs shared by the stay and tour request forms. */
export function ContactFields({ prefix }: { prefix: string }) {
  return (
    <>
      <div>
        <label htmlFor={`${prefix}-first`} className={labelCls}>First name</label>
        <input id={`${prefix}-first`} name="first_name" autoComplete="given-name" required className="field" placeholder="Juan" />
      </div>
      <div>
        <label htmlFor={`${prefix}-last`} className={labelCls}>Last name</label>
        <input id={`${prefix}-last`} name="last_name" autoComplete="family-name" required className="field" placeholder="Dela Cruz" />
      </div>
      <div>
        <label htmlFor={`${prefix}-email`} className={labelCls}>Email</label>
        <input id={`${prefix}-email`} name="email" type="email" autoComplete="email" required className="field" placeholder="you@example.com" />
      </div>
      <div>
        <label htmlFor={`${prefix}-phone`} className={labelCls}>Phone</label>
        <input id={`${prefix}-phone`} name="phone" type="tel" autoComplete="tel" required className="field" placeholder="+63 917 000 0000" />
      </div>
    </>
  );
}

export function TermsCheckbox() {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 text-xs text-white/70">
      <input type="checkbox" name="agree_terms" required className="mt-0.5 size-4 shrink-0 accent-gold-500" />
      <span>
        I agree to the <Link href="/privacy-policy" className="text-gold-500 underline-offset-2 hover:underline">Privacy Policy</Link> and{" "}
        <Link href="/terms-of-use" className="text-gold-500 underline-offset-2 hover:underline">Terms of Use</Link>.
      </span>
    </label>
  );
}

/** Honeypot field: bots fill it, humans never see it. */
export function Honeypot() {
  return <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />;
}

/** Local calendar date (not UTC) plus N days, as YYYY-MM-DD. */
export function isoPlus(days: number, from?: string) {
  const d = from ? new Date(`${from}T00:00:00`) : new Date();
  d.setDate(d.getDate() + days);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
