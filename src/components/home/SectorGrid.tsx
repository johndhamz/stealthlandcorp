import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { sectors, properties, type Sector } from "@/data/properties";
import { Reveal } from "@/components/ui/Reveal";

export function SectorGrid() {
  const entries = Object.entries(sectors) as [Sector, (typeof sectors)[Sector]][];
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {entries.map(([key, s], i) => {
        const count = properties.filter((p) => p.sector === key).length;
        return (
          <Reveal key={key} delay={i * 100}>
            <Link href={`/properties?sector=${key}`} className="group relative block aspect-[4/5] overflow-hidden rounded-xl md:aspect-[3/4]">
              <Image src={s.image} alt={s.label} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="eyebrow mb-2">{count > 0 ? `${count} ${count === 1 ? "project" : "projects"}` : "Pipeline"}</p>
                <h3 className="flex items-center justify-between font-display text-2xl font-bold">
                  {s.label}
                  <ArrowUpRight className="size-5 text-gold-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{s.blurb}</p>
              </div>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
