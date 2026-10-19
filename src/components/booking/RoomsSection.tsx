import { BedDouble, Maximize2, Users } from "lucide-react";
import { TourGallery } from "./TourGallery";
import type { RoomType } from "@/lib/data/mappers";
import { formatPhp } from "@/lib/bookings";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function RoomsSection({ rooms, propertyName }: { rooms: RoomType[]; propertyName: string }) {
  return (
    <section id="rooms" className="scroll-mt-24 border-t border-white/5 bg-navy-900 py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading eyebrow="Rooms & villas" title={`Stay at ${propertyName}`} description="Indicative nightly rates. Choose a room, pick your dates and send a request. Our reservations team confirms availability and payment by email." />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {rooms.map((room, i) => (
            <Reveal key={room.id} delay={i * 80} className="group flex flex-col overflow-hidden rounded-xl border border-white/8 bg-navy-800 transition hover:border-gold-500/40">
              <TourGallery images={room.images} name={room.name}>
                <div className="flex items-end justify-between gap-4">
                  <h3 className="font-display text-xl font-bold">{room.name}</h3>
                  <p className="shrink-0 text-right">
                    <span className="font-display text-lg font-bold text-gold-400">{formatPhp(room.nightlyRate)}</span>
                    <span className="block text-[11px] text-white/60">per night</span>
                  </p>
                </div>
              </TourGallery>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <p className="text-sm leading-relaxed text-white/70">{room.description}</p>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/60">
                  <li className="flex items-center gap-1.5"><Users className="size-3.5 text-gold-500" /> Up to {room.maxGuests} guests</li>
                  {room.beds && <li className="flex items-center gap-1.5"><BedDouble className="size-3.5 text-gold-500" /> {room.beds}</li>}
                  {room.sizeSqm && <li className="flex items-center gap-1.5"><Maximize2 className="size-3.5 text-gold-500" /> {room.sizeSqm} sqm</li>}
                </ul>
                {room.amenities.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {room.amenities.slice(0, 5).map((a) => (
                      <li key={a} className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/70">{a}</li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto pt-5">
                  <a href={`#book?room=${room.id}`} data-room={room.id} className="book-room inline-flex items-center justify-center rounded-md bg-gold-500 px-5 py-2.5 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-900 transition hover:bg-gold-400">
                    Request to book
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
