import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { sectors, statusLabels, type Property } from "@/data/properties";
import { cn } from "@/lib/utils";

export function PropertyCard({ property, priority = false, large = false, fromRate }: { property: Property; priority?: boolean; large?: boolean; fromRate?: number }) {
  return (
    <Link
      href={`/properties/${property.slug}`}
      className={cn("group relative block overflow-hidden rounded-xl border border-white/8 bg-navy-900 transition hover:border-gold-500/40 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]")}
    >
      <div className={cn("relative overflow-hidden", large ? "aspect-[16/10]" : "aspect-[4/3]")}>
        <Image
          src={property.cardImage}
          alt={property.name}
          fill
          priority={priority}
          sizes={large ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex gap-2">
          <span className={cn("rounded-full px-3 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.16em]", property.status === "pre-selling" ? "bg-gold-500 text-navy-900" : "bg-white/15 text-white backdrop-blur")}>
            {statusLabels[property.status]}
          </span>
        </div>
        <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-navy-950/50 px-3 py-1 text-[11px] text-white/85 backdrop-blur">
          {sectors[property.sector].label}
        </span>
      </div>
      <div className="p-5 sm:p-6">
        <h3 className="font-display text-xl font-bold leading-tight transition group-hover:text-gold-400">{property.name}</h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-white/60">
          <MapPin className="size-3.5 text-gold-500" /> {property.location}
        </p>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/65">{property.summary}</p>
        <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4">
          {fromRate ? (
            <p className="text-xs text-white/55">From <span className="font-semibold text-gold-400">₱{fromRate.toLocaleString("en-PH")}</span> / night</p>
          ) : property.unitTypes ? (
            <p className="text-xs text-white/55">{property.unitTypes.map((u) => u.label).join(" · ")}</p>
          ) : (
            <p className="text-xs text-white/55">{property.region}</p>
          )}
          <span className="inline-flex items-center gap-1 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-400">
            View <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
