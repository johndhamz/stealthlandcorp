"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchX } from "lucide-react";
import { sectors, statusLabels, type Property, type Sector, type Status } from "@/data/properties";
import { PropertyCard } from "./PropertyCard";
import { cn } from "@/lib/utils";

const sectorKeys = Object.keys(sectors) as Sector[];
const statusKeys = Object.keys(statusLabels) as Status[];

export function PropertyExplorer({ properties, rates = {} }: { properties: Property[]; rates?: Record<string, number> }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const sector = params.get("sector") ?? "";
  const region = params.get("region") ?? "";
  const status = params.get("status") ?? "";

  const regions = useMemo(() => Array.from(new Set(properties.map((p) => p.region))), [properties]);

  const filtered = useMemo(
    () =>
      properties.filter(
        (p) => (!sector || p.sector === sector) && (!region || p.region === region) && (!status || p.status === status),
      ),
    [properties, sector, region, status],
  );

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const hasFilters = Boolean(sector || region || status);

  return (
    <div>
      {/* Sector tabs */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Sector">
        <FilterChip active={!sector} onClick={() => update("sector", "")}>All sectors</FilterChip>
        {sectorKeys.map((k) => (
          <FilterChip key={k} active={sector === k} onClick={() => update("sector", k)}>
            {sectors[k].label}
          </FilterChip>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex-1">
          <span className="sr-only">Region</span>
          <select className="field" value={region} onChange={(e) => update("region", e.target.value)}>
            <option value="">All regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>
        <label className="flex-1">
          <span className="sr-only">Status</span>
          <select className="field" value={status} onChange={(e) => update("status", e.target.value)}>
            <option value="">Any status</option>
            {statusKeys.map((s) => (
              <option key={s} value={s}>{statusLabels[s]}</option>
            ))}
          </select>
        </label>
        <p className="shrink-0 text-sm text-white/55 sm:pl-2">
          {filtered.length} {filtered.length === 1 ? "property" : "properties"}
          {hasFilters && (
            <button type="button" onClick={() => router.replace(pathname, { scroll: false })} className="ml-3 text-gold-400 underline-offset-4 hover:underline">
              Clear
            </button>
          )}
        </p>
      </div>

      {sector && sectors[sector as Sector] && (
        <div className="mt-8 max-w-3xl space-y-3 text-sm leading-relaxed text-white/70">
          {sectors[sector as Sector].description.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <PropertyCard key={p.slug} property={p} priority={i < 3} fromRate={rates[p.slug]} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-xl border border-dashed border-white/15 p-12 text-center">
          <SearchX className="mx-auto size-8 text-gold-500" />
          <h3 className="mt-4 font-display text-lg font-bold">Projects in this sector are in development</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/60">
            We are preparing new launches here. Leave your details and we will notify you when reservations open.
          </p>
          <a href="/contact-us#inquire" className="mt-6 inline-block rounded-md bg-gold-500 px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.18em] text-navy-900 transition hover:bg-gold-400">
            Get notified
          </a>
        </div>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.16em] transition",
        active ? "border-gold-500 bg-gold-500 text-navy-900" : "border-white/15 text-white/75 hover:border-gold-500/60 hover:text-gold-400",
      )}
    >
      {children}
    </button>
  );
}
