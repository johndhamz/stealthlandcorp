import Image from "next/image";
import { Clock, Sailboat, Users } from "lucide-react";
import type { Activity } from "@/lib/data/mappers";
import { formatPhp, priceUnitLabel } from "@/lib/bookings";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/** Tours grouped by their admin "Section" name, in first-seen order. */
export function groupActivities(activities: Activity[]) {
  const groups = new Map<string, Activity[]>();
  for (const a of activities) {
    const key = a.category.trim();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(a);
  }
  return [...groups.entries()];
}

export function ActivitiesSection({ activities, propertyName, hasRooms }: { activities: Activity[]; propertyName: string; hasRooms: boolean }) {
  const groups = groupActivities(activities);
  return (
    <>
      {groups.map(([category, items], gi) => {
        const first = gi === 0;
        return (
          <section key={category || "activities"} id={first ? "activities" : slugId(category)} className="scroll-mt-24 border-t border-white/5 py-20 lg:py-28">
            <div className="container-x">
              <SectionHeading
                eyebrow={category || "Island hopping & activities"}
                title={first ? `Explore the islands around ${propertyName}` : category}
                description={
                  first
                    ? "Sandbars, reefs and islands a short bangka ride from the resort. Add a tour to your stay or request a day tour on its own. Rates are indicative and confirmed by our team."
                    : "Full-day trips run with our partner operators. Add one to your stay or request it on its own. Rates are indicative; transfers and park fees are confirmed by our team."
                }
              />
              <div className="mt-12 grid gap-6 md:grid-cols-2">
                {items.map((a, i) => (
                  <ActivityCard key={a.id} a={a} delay={i * 80} hasRooms={hasRooms} />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}

function slugId(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "tours";
}

function ActivityCard({ a, delay, hasRooms }: { a: Activity; delay: number; hasRooms: boolean }) {
  return (
    <Reveal delay={delay} className="group flex flex-col overflow-hidden rounded-xl border border-white/8 bg-navy-900 transition hover:border-gold-500/40">
      <div className="relative aspect-[16/9] overflow-hidden">
        {a.images[0] ? (
          <Image src={a.images[0]} alt={a.name} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" unoptimized={a.images[0].startsWith("http://")} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy-700 via-navy-800 to-navy-950">
            <Sailboat className="size-14 text-gold-500/30" aria-hidden="true" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-bold">{a.name}</h3>
            {a.tagline && <p className="mt-0.5 text-xs text-white/70">{a.tagline}</p>}
          </div>
          <p className="shrink-0 text-right">
            <span className="font-display text-lg font-bold text-gold-400">{formatPhp(a.price)}</span>
            <span className="block text-[11px] text-white/60">{priceUnitLabel(a.priceUnit)}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-sm leading-relaxed text-white/70">{a.description}</p>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/60">
          {a.duration && <li className="flex items-center gap-1.5"><Clock className="size-3.5 text-gold-500" /> {a.duration}</li>}
          {a.schedule && <li className="flex items-center gap-1.5"><Sailboat className="size-3.5 text-gold-500" /> {a.schedule}</li>}
          <li className="flex items-center gap-1.5"><Users className="size-3.5 text-gold-500" /> {a.minPax === a.maxPax ? `${a.maxPax} guests` : `${a.minPax}–${a.maxPax} guests`}</li>
        </ul>
        {a.inclusions.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {a.inclusions.map((x) => (
              <li key={x} className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/70">{x}</li>
            ))}
          </ul>
        )}
        {a.notes && <p className="mt-4 text-[11px] leading-relaxed text-white/45">{a.notes}</p>}
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          {hasRooms && (
            <a href={`#book?activity=${a.id}`} data-activity={a.id} className="add-activity inline-flex items-center justify-center rounded-md bg-gold-500 px-5 py-2.5 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-900 transition hover:bg-gold-400">
              Add to my stay
            </a>
          )}
          <a href={`#book?tour=${a.id}`} data-activity={a.id} className={`book-tour inline-flex items-center justify-center rounded-md px-5 py-2.5 font-display text-[11px] font-semibold uppercase tracking-[0.18em] transition ${hasRooms ? "border border-white/25 text-white hover:border-gold-500 hover:text-gold-400" : "bg-gold-500 text-navy-900 hover:bg-gold-400"}`}>
            {hasRooms ? "Tour only" : "Request this tour"}
          </a>
        </div>
      </div>
    </Reveal>
  );
}
