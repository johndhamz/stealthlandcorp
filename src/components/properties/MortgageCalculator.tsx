"use client";

import { useMemo, useState } from "react";
import { Calendar, Home, Maximize2, Sofa, Wallet } from "lucide-react";
import { computeMortgage, FINISHES, ROOM_TYPES, SQM_MAX, SQM_MIN, TERMS, toCurrency, type Finish, type RoomType } from "@/lib/mortgage";
import { formatMoney } from "@/lib/utils";

export function MortgageCalculator({ propertyName }: { propertyName: string }) {
  const [currency, setCurrency] = useState<"PHP" | "USD">("PHP");
  const [years, setYears] = useState(3);
  const [room, setRoom] = useState<RoomType>("studio");
  const [finish, setFinish] = useState<Finish>("full");
  const [sqm, setSqm] = useState<number>(ROOM_TYPES[0].sqm);
  const [dp, setDp] = useState(0);

  const result = useMemo(() => computeMortgage({ sqm, finish, years, downpaymentPct: dp }), [sqm, finish, years, dp]);

  const money = (v: number) => formatMoney(toCurrency(v, currency), currency);
  const pct = ((sqm - SQM_MIN) / (SQM_MAX - SQM_MIN)) * 100;

  return (
    <div className="rounded-2xl border border-white/10 bg-navy-900 p-6 sm:p-10">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="eyebrow mb-2">Plan your purchase</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Mortgage calculator</h2>
          <p className="mt-2 text-sm text-white/60">Indicative monthly amortisation for a unit at {propertyName}.</p>

          <div className="mt-8 space-y-6">
            <Field icon={Calendar} label="Payment term">
              <select className="field" value={years} onChange={(e) => setYears(Number(e.target.value))}>
                {TERMS.map((y) => (
                  <option key={y} value={y}>{y} years fixed</option>
                ))}
              </select>
            </Field>

            <Field icon={Home} label="Unit type">
              <div className="grid grid-cols-3 gap-2">
                {ROOM_TYPES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => { setRoom(r.value); setSqm(r.sqm); }}
                    aria-pressed={room === r.value}
                    className={`rounded-md border px-3 py-2.5 text-sm font-medium transition ${room === r.value ? "border-gold-500 bg-gold-500 text-navy-900" : "border-white/15 text-white/80 hover:border-gold-500/60"}`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </Field>

            <Field icon={Maximize2} label="Floor area" value={`${sqm} sqm`}>
              <input
                type="range"
                min={SQM_MIN}
                max={SQM_MAX}
                step={1}
                value={sqm}
                onChange={(e) => setSqm(Number(e.target.value))}
                className="slider mt-2"
                style={{ "--pct": `${pct}%` } as React.CSSProperties}
                aria-label="Floor area in square metres"
              />
            </Field>

            <Field icon={Sofa} label="Finish">
              <select className="field" value={finish} onChange={(e) => setFinish(e.target.value as Finish)}>
                {FINISHES.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </Field>

            <Field icon={Wallet} label="Downpayment" value={`${dp}% · ${money(result.downpayment)}`}>
              <input
                type="range"
                min={0}
                max={50}
                step={5}
                value={dp}
                onChange={(e) => setDp(Number(e.target.value))}
                className="slider mt-2"
                style={{ "--pct": `${(dp / 50) * 100}%` } as React.CSSProperties}
                aria-label="Downpayment percentage"
              />
            </Field>
          </div>
        </div>

        <div className="flex flex-col rounded-xl border border-gold-500/20 bg-gradient-to-br from-navy-800 to-navy-950 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-4xl font-bold">{years}</p>
              <p className="text-sm text-gold-400">years</p>
            </div>
            <div className="flex rounded-md border border-white/15 p-0.5 text-xs">
              {(["PHP", "USD"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  aria-pressed={currency === c}
                  className={`rounded px-3 py-1.5 font-semibold transition ${currency === c ? "bg-gold-500 text-navy-900" : "text-white/70 hover:text-white"}`}
                >
                  {c === "PHP" ? "₱ PHP" : "$ USD"}
                </button>
              ))}
            </div>
          </div>

          <div className="my-auto py-10 text-center">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Monthly payment</p>
            <p className="mt-3 font-display text-4xl font-bold text-gold-400 sm:text-5xl" aria-live="polite">{money(result.monthly)}</p>
            <p className="mt-2 text-xs text-white/50">{result.months} monthly payments</p>
          </div>

          <dl className="space-y-3 border-t border-white/10 pt-5 text-sm">
            <Row label="Unit price" value={money(result.total)} />
            <Row label="Downpayment" value={money(result.downpayment)} />
            <Row label="Amount financed" value={money(result.financed)} strong />
          </dl>
          <p className="mt-5 text-[11px] leading-relaxed text-white/40">
            Figures are indicative, exclude bank interest and fees, and do not constitute an offer. Final pricing is confirmed on reservation.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, value, children }: { icon: React.ElementType; label: string; value?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-2 font-display text-sm font-semibold text-gold-400">
          <Icon className="size-4" /> {label}
        </span>
        {value && <strong className="text-sm">{value}</strong>}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-white/60">{label}</dt>
      <dd className={strong ? "font-semibold text-white" : "text-white/85"}>{value}</dd>
    </div>
  );
}
