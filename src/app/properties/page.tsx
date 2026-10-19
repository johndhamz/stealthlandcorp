import type { Metadata } from "next";
import { Suspense } from "react";
import { MapPin } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PropertyExplorer } from "@/components/properties/PropertyExplorer";
import { properties, regions } from "@/data/properties";
import { portfolioIntro } from "@/data/content";

export const metadata: Metadata = {
  title: "Properties",
  description: "Explore Stealth Land Corp's portfolio of pre-selling residential towers, hotel and leisure destinations and agricultural developments across the Philippines.",
};

export default function PropertiesPage() {
  return (
    <>
      <PageHero eyebrow="Project portfolio" title="Properties" description={portfolioIntro[0]} image="/images/properties/residential/visayas.jpg" crumbs={[{ label: "Properties" }]} />

      <section className="container-x py-16 lg:py-20">
        <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-white/5" />}>
          <PropertyExplorer properties={properties} />
        </Suspense>
      </section>

      <section className="border-t border-white/5 bg-navy-900 py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="Where we build" title="Strategic locations across the Philippines" description={portfolioIntro[1]} />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {regions.map((r, i) => {
              const count = properties.filter((p) => p.region === r.name).length;
              return (
                <Reveal key={r.slug} delay={i * 80} className="rounded-2xl border border-white/8 bg-navy-800 p-7">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="flex items-center gap-2 font-display text-xl font-bold">
                      <MapPin className="size-4 text-gold-500" /> {r.heading}
                    </h3>
                    <span className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/60">
                      {count > 0 ? `${count} ${count === 1 ? "project" : "projects"}` : "In planning"}
                    </span>
                  </div>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/68">
                    {r.description.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
