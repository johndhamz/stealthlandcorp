"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Sailboat } from "lucide-react";
import type { Activity } from "@/lib/data/mappers";
import { activitySubtotal, formatPhp, formatStayDate } from "@/lib/bookings";
import { ActivityPicker, activitiesTotal, selectionsToPayload, type ActivitySelections } from "./ActivityPicker";
import { ContactFields, Honeypot, TermsCheckbox, isoPlus, labelCls } from "./fields";
import { Row } from "./BookingForm";

interface Props {
  propertySlug: string;
  propertyName: string;
  activities: Activity[];
  notes?: string;
  initialActivityId?: string;
}

/** Standalone day-tour request for visitors who are not staying at the resort. */
export function ActivityRequestForm({ propertySlug, propertyName, activities, notes, initialActivityId }: Props) {
  const [tourDate, setTourDate] = useState("");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with the browser clock (external system)
    setTourDate(isoPlus(1));
  }, []);
  const [selected, setSelected] = useState<ActivitySelections>(() => {
    const a = activities.find((x) => x.id === initialActivityId);
    return a ? { [a.id]: { pax: Math.min(Math.max(2, a.minPax), a.maxPax), date: "" } } : {};
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<{ reference: string; total: number } | null>(null);

  const chosen = activities.filter((a) => selected[a.id]);
  const total = activitiesTotal(activities, selected);

  useEffect(() => {
    const onClick = (e: Event) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>(".book-tour");
      if (!el?.dataset.activity) return;
      e.preventDefault();
      const a = activities.find((x) => x.id === el.dataset.activity);
      if (a) setSelected((prev) => (prev[a.id] ? prev : { ...prev, [a.id]: { pax: Math.min(Math.max(2, a.minPax), a.maxPax), date: "" } }));
      document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [activities]);

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const data = Object.fromEntries(new FormData(ev.currentTarget).entries());
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "activity",
          property_slug: propertySlug,
          tour_date: tourDate,
          activities: selectionsToPayload(selected, tourDate),
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          special_requests: data.special_requests,
          agree_terms: Boolean(data.agree_terms),
          website: data.website,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { message?: string; reference?: string; total?: number };
      if (!res.ok || !json.reference) throw new Error(json.message || "Something went wrong. Please try again.");
      setResult({ reference: json.reference, total: json.total ?? total });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (!activities.length) return null;

  if (status === "success" && result) {
    return (
      <div className="rounded-2xl border border-gold-500/30 bg-navy-900 p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-gold-500" />
        <h3 className="mt-4 font-display text-2xl font-bold">Tour request received</h3>
        <p className="mt-2 text-white/70">Your reference is</p>
        <p className="mt-1 font-display text-3xl font-bold tracking-wide text-gold-400">{result.reference}</p>
        <div className="mx-auto mt-6 max-w-md rounded-lg border border-white/10 bg-white/[0.03] p-4 text-left text-sm text-white/80">
          <p><strong>{formatStayDate(tourDate)}</strong></p>
          {chosen.map((a) => (
            <p key={a.id} className="mt-1">{a.name} · {selected[a.id].pax} {selected[a.id].pax === 1 ? "guest" : "guests"}</p>
          ))}
          <p className="mt-1">Indicative total: <strong className="text-gold-400">{formatPhp(result.total)}</strong></p>
        </div>
        <p className="mx-auto mt-6 max-w-md text-sm text-white/65">Our team will confirm boat availability, weather and payment details by email within one business day.</p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-6 text-sm text-gold-400 underline-offset-4 hover:underline">Make another request</button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 rounded-2xl border border-white/10 bg-navy-900 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr]">
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <div>
          <p className="eyebrow mb-2">Day tours</p>
          <h3 className="font-display text-2xl font-bold">Island hopping from {propertyName}</h3>
          <p className="mt-2 text-sm text-white/65">Not staying with us? Request a tour on its own. No payment is taken now; we confirm availability and send payment options by email.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="tr-date" className={labelCls}>Tour date</label>
            <input id="tr-date" type="date" value={tourDate} min={isoPlus(0)} onChange={(e) => setTourDate(e.target.value)} className="field [color-scheme:dark]" required />
          </div>
        </div>

        <div>
          <p className={labelCls}>Choose your tours</p>
          <ActivityPicker activities={activities} selected={selected} onChange={setSelected} defaultPax={2} idPrefix="tr" />
          {chosen.length === 0 && <p className="mt-2 text-xs text-gold-400">Tick at least one tour.</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <ContactFields prefix="tr" />
          <div className="sm:col-span-2">
            <label htmlFor="tr-req" className={labelCls}>Notes (optional)</label>
            <textarea id="tr-req" name="special_requests" rows={3} className="field" placeholder="Pick-up point, children in the group, dietary needs..." />
          </div>
        </div>
        <Honeypot />
        <TermsCheckbox />

        {status === "error" && <p role="alert" className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{message}</p>}

        <button type="submit" disabled={status === "submitting" || chosen.length === 0 || !tourDate} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gold-500 px-7 py-3.5 font-display text-xs font-semibold uppercase tracking-[0.18em] text-navy-900 transition hover:bg-gold-400 disabled:opacity-60 sm:w-auto">
          {status === "submitting" && <Loader2 className="size-4 animate-spin" />}
          {status === "submitting" ? "Sending" : "Send tour request"}
        </button>
      </form>

      <aside className="rounded-xl border border-gold-500/20 bg-gradient-to-br from-navy-800 to-navy-950 p-6">
        <p className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.18em] text-gold-400"><Sailboat className="size-4" /> Your tour</p>
        <dl className="mt-5 space-y-3 text-sm">
          <Row k="Date" v={tourDate ? formatStayDate(tourDate) : "—"} />
          {chosen.length === 0 && <Row k="Tours" v="None selected" />}
          {chosen.map((a) => (
            <Row key={a.id} k={`${a.name} × ${selected[a.id].pax}`} v={formatPhp(activitySubtotal(a.price, a.priceUnit, selected[a.id].pax))} />
          ))}
        </dl>
        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="text-xs uppercase tracking-[0.18em] text-white/55">Indicative total</p>
          <p className="mt-1 font-display text-3xl font-bold text-gold-400" aria-live="polite">{formatPhp(total)}</p>
          <p className="mt-2 text-[11px] leading-relaxed text-white/45">Tours run weather permitting and exclude taxes and service charges unless stated. {notes}</p>
        </div>
      </aside>
    </div>
  );
}
