"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { CalendarDays, CheckCircle2, Loader2 } from "lucide-react";
import type { RoomType } from "@/lib/data/mappers";
import { formatPhp, formatStayDate, nightsBetween } from "@/lib/bookings";

interface Props {
  propertySlug: string;
  propertyName: string;
  rooms: RoomType[];
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
}

function isoPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function BookingForm({ propertySlug, propertyName, rooms, checkInTime, checkOutTime, notes }: Props) {
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? "");
  const [checkIn, setCheckIn] = useState(isoPlus(7));
  const [checkOut, setCheckOut] = useState(isoPlus(9));
  const [guests, setGuests] = useState(2);
  const [roomCount, setRoomCount] = useState(1);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<{ reference: string; total: number; nights: number } | null>(null);

  const room = rooms.find((r) => r.id === roomId) ?? rooms[0];
  const nights = nightsBetween(checkIn, checkOut);
  const total = room ? room.nightlyRate * Math.max(nights, 0) * roomCount : 0;
  const tooManyGuests = room ? guests > room.maxGuests * roomCount : false;

  // "Request to book" buttons on the room cards pre-select that room.
  useEffect(() => {
    const onClick = (e: Event) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>(".book-room");
      if (!el?.dataset.room) return;
      e.preventDefault();
      setRoomId(el.dataset.room);
      document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const minCheckOut = useMemo(() => {
    const d = new Date(`${checkIn}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString().slice(0, 10);
  }, [checkIn]);

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (!room) return;
    const form = ev.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          property_slug: propertySlug,
          room_type_id: room.id,
          check_in: checkIn,
          check_out: checkOut,
          guests,
          rooms: roomCount,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          special_requests: data.special_requests,
          agree_terms: Boolean(data.agree_terms),
          website: data.website,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { message?: string; reference?: string; total?: number; nights?: number };
      if (!res.ok || !json.reference) throw new Error(json.message || "Something went wrong. Please try again.");
      setResult({ reference: json.reference, total: json.total ?? total, nights: json.nights ?? nights });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (!rooms.length) return null;

  if (status === "success" && result && room) {
    return (
      <div id="book" className="scroll-mt-24 rounded-2xl border border-gold-500/30 bg-navy-900 p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-gold-500" />
        <h3 className="mt-4 font-display text-2xl font-bold">Request received</h3>
        <p className="mt-2 text-white/70">Your reference is</p>
        <p className="mt-1 font-display text-3xl font-bold tracking-wide text-gold-400">{result.reference}</p>
        <div className="mx-auto mt-6 max-w-md rounded-lg border border-white/10 bg-white/[0.03] p-4 text-left text-sm text-white/80">
          <p><strong>{room.name}</strong> × {roomCount} · {guests} {guests === 1 ? "guest" : "guests"}</p>
          <p className="mt-1">{formatStayDate(checkIn)} → {formatStayDate(checkOut)} · {result.nights} {result.nights === 1 ? "night" : "nights"}</p>
          <p className="mt-1">Indicative total: <strong className="text-gold-400">{formatPhp(result.total)}</strong></p>
        </div>
        <p className="mx-auto mt-6 max-w-md text-sm text-white/65">
          Our reservations team will confirm availability and payment details by email within one business day. Keep your reference handy.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-6 text-sm text-gold-400 underline-offset-4 hover:underline">
          Make another request
        </button>
      </div>
    );
  }

  const labelCls = "mb-1.5 block text-xs font-medium text-white/70";

  return (
    <div id="book" className="scroll-mt-24 grid gap-8 rounded-2xl border border-white/10 bg-navy-900 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr]">
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <div>
          <p className="eyebrow mb-2">Request to book</p>
          <h3 className="font-display text-2xl font-bold">Plan your stay at {propertyName}</h3>
          <p className="mt-2 text-sm text-white/65">No payment is taken now. We confirm availability and send payment options by email.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="bk-room" className={labelCls}>Room</label>
            <select id="bk-room" value={roomId} onChange={(e) => setRoomId(e.target.value)} className="field">
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>{r.name} · {formatPhp(r.nightlyRate)}/night · up to {r.maxGuests} guests</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="bk-in" className={labelCls}>Check-in</label>
            <input id="bk-in" type="date" value={checkIn} min={isoPlus(0)} onChange={(e) => {
                const v = e.target.value;
                setCheckIn(v);
                if (checkOut <= v) {
                  const d = new Date(`${v}T00:00:00Z`);
                  d.setUTCDate(d.getUTCDate() + 1);
                  setCheckOut(d.toISOString().slice(0, 10));
                }
              }} className="field [color-scheme:dark]" required />
          </div>
          <div>
            <label htmlFor="bk-out" className={labelCls}>Check-out</label>
            <input id="bk-out" type="date" value={checkOut} min={minCheckOut} onChange={(e) => setCheckOut(e.target.value)} className="field [color-scheme:dark]" required />
          </div>
          <div>
            <label htmlFor="bk-guests" className={labelCls}>Guests</label>
            <select id="bk-guests" value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="field">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="bk-rooms" className={labelCls}>Rooms</label>
            <select id="bk-rooms" value={roomCount} onChange={(e) => setRoomCount(Number(e.target.value))} className="field">
              {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} {n === 1 ? "room" : "rooms"}</option>)}
            </select>
          </div>
        </div>
        {tooManyGuests && room && (
          <p className="text-xs text-gold-400">{room.name} sleeps up to {room.maxGuests} per room. Add a room or pick a larger room type.</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bk-first" className={labelCls}>First name</label>
            <input id="bk-first" name="first_name" autoComplete="given-name" required className="field" placeholder="Juan" />
          </div>
          <div>
            <label htmlFor="bk-last" className={labelCls}>Last name</label>
            <input id="bk-last" name="last_name" autoComplete="family-name" required className="field" placeholder="Dela Cruz" />
          </div>
          <div>
            <label htmlFor="bk-email" className={labelCls}>Email</label>
            <input id="bk-email" name="email" type="email" autoComplete="email" required className="field" placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="bk-phone" className={labelCls}>Phone</label>
            <input id="bk-phone" name="phone" type="tel" autoComplete="tel" required className="field" placeholder="+63 917 000 0000" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="bk-req" className={labelCls}>Special requests (optional)</label>
            <textarea id="bk-req" name="special_requests" rows={3} className="field" placeholder="Arrival time, dietary needs, celebrations..." />
          </div>
        </div>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        <label className="flex cursor-pointer items-start gap-2.5 text-xs text-white/70">
          <input type="checkbox" name="agree_terms" required className="mt-0.5 size-4 shrink-0 accent-gold-500" />
          <span>
            I agree to the <Link href="/privacy-policy" className="text-gold-500 underline-offset-2 hover:underline">Privacy Policy</Link> and{" "}
            <Link href="/terms-of-use" className="text-gold-500 underline-offset-2 hover:underline">Terms of Use</Link>.
          </span>
        </label>

        {status === "error" && <p role="alert" className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{message}</p>}

        <button type="submit" disabled={status === "submitting" || tooManyGuests || nights < 1} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gold-500 px-7 py-3.5 font-display text-xs font-semibold uppercase tracking-[0.18em] text-navy-900 transition hover:bg-gold-400 disabled:opacity-60 sm:w-auto">
          {status === "submitting" && <Loader2 className="size-4 animate-spin" />}
          {status === "submitting" ? "Sending" : "Send booking request"}
        </button>
      </form>

      <aside className="rounded-xl border border-gold-500/20 bg-gradient-to-br from-navy-800 to-navy-950 p-6">
        <p className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.18em] text-gold-400"><CalendarDays className="size-4" /> Your stay</p>
        {room && (
          <dl className="mt-5 space-y-3 text-sm">
            <Row k="Room" v={`${room.name} × ${roomCount}`} />
            <Row k="Check-in" v={`${formatStayDate(checkIn)}${checkInTime ? ` · ${checkInTime}` : ""}`} />
            <Row k="Check-out" v={`${formatStayDate(checkOut)}${checkOutTime ? ` · ${checkOutTime}` : ""}`} />
            <Row k="Nights" v={String(Math.max(nights, 0))} />
            <Row k="Guests" v={String(guests)} />
            <Row k="Rate" v={`${formatPhp(room.nightlyRate)} / room / night`} />
          </dl>
        )}
        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="text-xs uppercase tracking-[0.18em] text-white/55">Indicative total</p>
          <p className="mt-1 font-display text-3xl font-bold text-gold-400" aria-live="polite">{formatPhp(total)}</p>
          <p className="mt-2 text-[11px] leading-relaxed text-white/45">Rates are indicative and exclude taxes and service charges unless stated. Final pricing is confirmed by our reservations team. {notes}</p>
        </div>
      </aside>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-white/60">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}
