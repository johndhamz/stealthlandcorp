import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { Pillars } from "@/components/home/Pillars";
import { SectorGrid } from "@/components/home/SectorGrid";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { regions } from "@/data/properties";
import { getContent } from "@/lib/data/content";
import { getFeaturedProperties, getPublishedProperties } from "@/lib/data/properties";
import { projectOptions } from "@/lib/data/options";

const slides = [
  { src: "/images/properties/residential/visayas-3.jpg", alt: "Alpha Tower, Cebu City at dusk" },
  { src: "/images/properties/hotel/groove-towers.jpg", alt: "Grove Tower, Palawan" },
  { src: "/images/properties/residential/visayas.jpg", alt: "Alpha Tower facade" },
  { src: "/images/properties/residential/visayas-4.jpg", alt: "Alpha Tower amenities" },
];

export default async function HomePage() {
  const [home, properties] = await Promise.all([getContent("home"), getPublishedProperties()]);
  const featured = await getFeaturedProperties();
  const stats = [
    { value: String(properties.length), label: "Active projects" },
    { value: String(regions.length), label: "Regions across the Philippines" },
    { value: "3", label: "Sectors: residential, hospitality, agriculture" },
    { value: "2012", label: "Stealth Land Primaries established" },
  ];

  return (
    <>
      <Hero slides={slides} eyebrow="Pre-selling properties · Cebu & Palawan" title={home.heroTitle} subtitle={home.heroSubtitle} />

      {/* Stats strip */}
      <section className="border-y border-white/5 bg-navy-900">
        <div className="container-x grid grid-cols-2 divide-white/5 py-8 sm:grid-cols-4 sm:divide-x">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="px-2 py-3 text-center sm:px-6">
              <p className="font-display text-3xl font-bold text-gold-400 sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs leading-snug text-white/55">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Intro */}
      <section id="intro" className="container-x grid gap-12 py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-28">
        <Reveal>
          <SectionHeading eyebrow="Stealth Land Corporation" title="Sustainability. Innovation. Customer-Centricity." />
          <div className="mt-8 space-y-5 text-base leading-relaxed text-white/75">
            {home.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-8">
            <Button href="/about-us" variant="outline">
              About the company <ArrowRight className="size-4" />
            </Button>
          </div>
        </Reveal>
        <Reveal delay={150} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image src="/images/properties/residential/visayas-2.jpg" alt="Alpha Tower rendering" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-gold-500/30 bg-navy-900 p-5 shadow-2xl sm:block">
            <p className="eyebrow">Now pre-selling</p>
            <p className="mt-1 font-display text-lg font-bold">Alpha Tower · Cebu City</p>
            <Link href="/properties/alpha-tower" className="mt-2 inline-flex items-center gap-1 text-sm text-gold-400 hover:underline">
              Explore the tower <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Pillars */}
      <section className="container-x pb-20 lg:pb-28">
        <Pillars items={home.pillars} />
      </section>

      {/* Featured */}
      <section className="border-t border-white/5 bg-navy-900 py-20 lg:py-28">
        <div className="container-x">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow="Featured properties" title="Now accepting reservations" description="Pre-selling residences in two of the most desirable addresses in the Visayas and Palawan." />
            <Button href="/properties" variant="ghost" className="shrink-0 pl-0 sm:pl-6">
              View all properties <ArrowRight className="size-4" />
            </Button>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={i * 120}>
                <PropertyCard property={p} large priority={i === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="container-x py-20 lg:py-28">
        <SectionHeading eyebrow="Project portfolio" title="Three sectors, one standard of quality" description="From high-rise residences to boutique hospitality and sustainable agriculture, every Stealth Land project is planned to create lasting value." />
        <div className="mt-12">
          <SectorGrid />
        </div>
      </section>

      {/* Inquiry */}
      <section className="relative overflow-hidden border-t border-white/5">
        <Image src="/images/properties/residential/visayas-4.jpg" alt="" fill sizes="100vw" className="object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-800 via-navy-800/95 to-navy-800/80" />
        <div className="container-x relative grid gap-12 py-20 lg:grid-cols-[1fr_1.2fr] lg:gap-20 lg:py-28">
          <Reveal>
            <SectionHeading eyebrow="Inquire now" title="Request a quote on pre-selling and RFO units" description="Tell us what you are looking for and a Stealth Land specialist will reach out with pricing, floor plans and payment terms." />
            <ul className="mt-8 space-y-3 text-sm text-white/70">
              {["Flexible payment terms from 3 to 15 years", "Studio, 1-bedroom and 2-bedroom layouts", "Accredited agent support in the Philippines and overseas"].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-500" /> {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120} className="rounded-2xl border border-white/10 bg-navy-900/80 p-6 backdrop-blur sm:p-8">
            <InquiryForm variant="home" projects={projectOptions(properties)} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
