"use client";

import type { Activity } from "@/lib/data/mappers";
import { activitySubtotal, formatPhp, priceUnitLabel } from "@/lib/bookings";
import { labelCls } from "./fields";

export interface ActivitySelection {
  pax: number;
  date: string;
}
export type ActivitySelections = Record<string, ActivitySelection>;

interface Props {
  activities: Activity[];
  selected: ActivitySelections;
  onChange: (next: ActivitySelections) => void;
  /** Head count used when an activity is first ticked. */
  defaultPax: number;
  /** When set, each ticked activity gets its own date input bounded to this range. */
  dates?: { min: string; max: string; initial: string };
  idPrefix: string;
}

/** Checkbox list of tours with head count (and optional per-tour date) for the ticked ones. */
export function ActivityPicker({ activities, selected, onChange, defaultPax, dates, idPrefix }: Props) {
  function toggle(a: Activity, on: boolean) {
    const next = { ...selected };
    if (on) next[a.id] = { pax: Math.min(Math.max(defaultPax, a.minPax), a.maxPax), date: dates?.initial ?? "" };
    else delete next[a.id];
    onChange(next);
  }
  function update(id: string, patch: Partial<ActivitySelection>) {
    onChange({ ...selected, [id]: { ...selected[id], ...patch } });
  }

  const categories = [...new Set(activities.map((a) => a.category.trim()))];
  const showGroups = categories.length > 1;

  return (
    <ul className="divide-y divide-white/10 rounded-lg border border-white/10">
      {activities.map((a, i) => {
        const startsGroup = showGroups && (i === 0 || activities[i - 1].category.trim() !== a.category.trim());
        const sel = selected[a.id];
        const cid = `${idPrefix}-act-${a.id}`;
        return (
          <li key={a.id} className="p-3.5 sm:p-4">
            {startsGroup && <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-400">{a.category.trim() || "Tours"}</p>}
            <label htmlFor={cid} className="flex cursor-pointer items-start gap-3">
              <input id={cid} type="checkbox" checked={Boolean(sel)} onChange={(e) => toggle(a, e.target.checked)} className="mt-1 size-4 shrink-0 accent-gold-500" data-activity-checkbox={a.id} />
              <span className="flex-1">
                <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span className="font-medium">{a.name}</span>
                  <span className="text-sm text-gold-400">{formatPhp(a.price)} <span className="text-xs text-white/55">{priceUnitLabel(a.priceUnit)}</span></span>
                </span>
                <span className="mt-0.5 block text-xs text-white/55">{a.duration}{a.schedule ? ` · ${a.schedule}` : ""}</span>
              </span>
            </label>
            {sel && (
              <div className="mt-3 grid gap-3 pl-7 sm:grid-cols-[auto_auto_1fr] sm:items-end">
                <div>
                  <label htmlFor={`${cid}-pax`} className={labelCls}>Guests</label>
                  <select id={`${cid}-pax`} value={sel.pax} onChange={(e) => update(a.id, { pax: Number(e.target.value) })} className="field py-2">
                    {Array.from({ length: a.maxPax - a.minPax + 1 }, (_, i) => a.minPax + i).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                {dates && (
                  <div>
                    <label htmlFor={`${cid}-date`} className={labelCls}>Tour date</label>
                    <input id={`${cid}-date`} type="date" value={sel.date || dates.initial} min={dates.min} max={dates.max} onChange={(e) => update(a.id, { date: e.target.value })} className="field py-2 [color-scheme:dark]" />
                  </div>
                )}
                <p className="text-sm text-white/70 sm:text-right">Subtotal <strong className="text-white">{formatPhp(activitySubtotal(a.price, a.priceUnit, sel.pax))}</strong></p>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function activitiesTotal(activities: Activity[], selected: ActivitySelections) {
  return activities.reduce((sum, a) => (selected[a.id] ? sum + activitySubtotal(a.price, a.priceUnit, selected[a.id].pax) : sum), 0);
}

export function selectionsToPayload(selected: ActivitySelections, fallbackDate?: string) {
  return Object.entries(selected).map(([activity_id, s]) => ({ activity_id, pax: s.pax, date: s.date || fallbackDate || "" }));
}
