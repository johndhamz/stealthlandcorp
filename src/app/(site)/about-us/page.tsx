import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Compass, Eye, Target } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { getContent } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "About Us",
  description: "Stealth Land Corp is a leading Philippine real estate developer crafting sustainable, thoughtfully planned communities across Cebu, Palawan, Luzon and Metro Manila.",
};

export default async function AboutPage() {
  const about = await getContent("about");
  return (
    <>
      <PageHero eyebrow="About us" title="Stealth Land Corp" description={about.intro[0]} image="/images/properties/residential/visayas-2.jpg" crumbs={[{ label: "About Us" }]} />

      <section className="container-x grid gap-12 py-20 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:py-28">
        <Reveal>
          <SectionHeading eyebrow="Our purpose" title="Communities where people can thrive" />
          <div className="mt-8 space-y-5 leading-relaxed text-white/75">
            {about.purpose.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="mt-6 text-white/75">{about.intro[1]}</p>
        </Reveal>
        <Reveal delay={120} className="grid gap-5">
          <div className="rounded-2xl border border-white/8 bg-navy-900 p-7">
            <div className="mb-4 inline-flex rounded-lg bg-gold-500/10 p-2.5 text-gold-400"><Eye className="size-5" /></div>
            <h3 className="font-display text-xl font-bold">Vision</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{about.vision}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-navy-900 p-7">
            <div className="mb-4 inline-flex rounded-lg bg-gold-500/10 p-2.5 text-gold-400"><Target className="size-5" /></div>
            <h3 className="font-display text-xl font-bold">Mission</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{about.mission}</p>
          </div>
        </Reveal>
      </section>

      {/* Timeline */}
      <section className="border-y border-white/5 bg-navy-900 py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="Our journey" title="From Primaries to a multi-sector portfolio" align="center" />
          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {about.timeline.map((t, i) => (
              <Reveal key={t.year} delay={i * 120} as="li" className="relative rounded-2xl border border-white/8 bg-navy-800 p-7">
                <span className="font-display text-3xl font-bold text-gold-400">{t.year}</span>
                <h3 className="mt-3 font-display text-lg font-bold">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{t.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Primaries */}
      <section className="container-x grid items-center gap-12 py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:py-28">
        <Reveal className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:order-2">
          <Image src="/images/properties/hotel/groove-towers.jpg" alt="Grove Tower, Palawan" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </Reveal>
        <Reveal delay={100} className="lg:order-1">
          <div className="mb-4 inline-flex rounded-lg bg-gold-500/10 p-2.5 text-gold-400"><Compass className="size-5" /></div>
          <SectionHeading eyebrow="Stealth Land Primaries" title="Stealth Land ventures into the broader market" />
          <div className="mt-8 space-y-5 leading-relaxed text-white/75">
            {about.primaries.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-8">
            <Button href="/properties">
              View our project portfolio <ArrowRight className="size-4" />
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
