import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Building2, Check, MapPin, Ruler } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Gallery } from "@/components/properties/Gallery";
import { VideoEmbed } from "@/components/properties/VideoEmbed";
import { MortgageCalculator } from "@/components/properties/MortgageCalculator";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { getProperty, properties, sectors, statusLabels } from "@/data/properties";
import { site } from "@/data/site";

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) return {};
  return {
    title: `${property.name} · ${property.location}`,
    description: property.summary,
    openGraph: { title: `${property.name} by ${property.developer}`, description: property.summary, images: [{ url: property.cardImage }] },
  };
}

export default async function PropertyPage({ params }: Params) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) notFound();

  const related = properties.filter((p) => p.slug !== property.slug).slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.name,
    description: property.summary,
    url: `${site.url}/properties/${property.slug}`,
    image: property.gallery.map((g) => `${site.url}${g}`),
    address: { "@type": "PostalAddress", addressLocality: property.location, addressCountry: "PH" },
    offeredBy: { "@type": "Organization", name: site.legalName, url: site.url },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <Image src={property.heroImages[0]} alt={property.name} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-800 via-navy-900/60 to-navy-900/30" />
        <div className="relative">
          <Breadcrumbs items={[{ label: "Properties", href: "/properties" }, { label: sectors[property.sector].label, href: `/properties?sector=${property.sector}` }, { label: property.name }]} />
          <div className="container-x flex min-h-[60vh] flex-col justify-end pb-16 pt-24 sm:pb-20">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-gold-500 px-3 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-navy-900">{statusLabels[property.status]}</span>
              <span className="rounded-full border border-white/20 bg-navy-950/40 px-3 py-1 text-[11px] text-white/85 backdrop-blur">{sectors[property.sector].label}</span>
            </div>
            <p className="eyebrow mt-6 animate-fade-up">Welcome to</p>
            <h1 className="mt-2 animate-fade-up font-display text-5xl font-bold leading-[1] tracking-tight sm:text-6xl lg:text-7xl [animation-delay:80ms]">{property.name}</h1>
            <p className="mt-4 flex animate-fade-up items-center gap-2 text-white/80 [animation-delay:160ms]">
              <MapPin className="size-4 text-gold-500" /> {property.location} · by {property.developer}
            </p>
            <div className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:240ms]">
              <a href="#inquire" className="inline-flex items-center gap-2 rounded-md bg-gold-500 px-7 py-3.5 font-display text-xs font-semibold uppercase tracking-[0.18em] text-navy-900 transition hover:bg-gold-400">Request a quote <ArrowRight className="size-4" /></a>
              {property.mortgageCalculator && (
                <a href="#calculator" className="inline-flex items-center gap-2 rounded-md border border-white/30 px-7 py-3.5 font-display text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition hover:border-gold-500 hover:text-gold-400">Mortgage calculator</a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick facts */}
      <section className="border-y border-white/5 bg-navy-900">
        <div className="container-x grid gap-6 py-6 sm:grid-cols-3">
          <Fact icon={MapPin} label="Location" value={`${property.location}, ${property.region}`} />
          <Fact icon={Building2} label="Sector" value={sectors[property.sector].label} />
          <Fact icon={Ruler} label={property.unitTypes ? "Unit types" : "Status"} value={property.unitTypes ? property.unitTypes.map((u) => `${u.label} ${u.sqm} sqm`).join(" · ") : statusLabels[property.status]} />
        </div>
      </section>

      {/* Overview + gallery */}
      <section className="container-x grid gap-12 py-20 lg:grid-cols-[1.25fr_1fr] lg:gap-16 lg:py-28">
        <Reveal>
          <Gallery images={property.gallery} name={property.name} />
        </Reveal>
        <Reveal delay={120}>
          <SectionHeading eyebrow={`By ${property.developer}`} title={`The ${property.name}`} />
          <div className="mt-8 space-y-5 leading-relaxed text-white/75">
            {property.description.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {property.amenities.map((a) => (
              <li key={a} className="flex items-start gap-2.5 text-sm text-white/80">
                <Check className="mt-0.5 size-4 shrink-0 text-gold-500" /> {a}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Videos */}
      {property.videoIds?.length ? (
        <section className="border-t border-white/5 bg-navy-900 py-20 lg:py-28">
          <div className="container-x">
            <SectionHeading eyebrow="Walkthrough" title={`Experience ${property.name}`} />
            <div className={`mt-12 grid gap-6 ${property.videoIds.length > 1 ? "md:grid-cols-2 lg:grid-cols-3" : ""}`}>
              {property.videoIds.map((id, i) => (
                <Reveal key={id} delay={i * 100}>
                  <VideoEmbed id={id} title={`${property.name} video ${i + 1}`} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Highlights + inquiry */}
      <section className="container-x grid gap-12 py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:py-28">
        <Reveal>
          <SectionHeading eyebrow="Why here" title={property.highlightTitle} />
          <div className="mt-8 space-y-5 leading-relaxed text-white/75">
            {property.highlights.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          {property.gallery[1] && (
            <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-2xl">
              <Image src={property.gallery[1]} alt={`${property.name} detail`} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          )}
        </Reveal>
        <Reveal delay={120} className="rounded-2xl border border-white/10 bg-navy-900 p-6 sm:p-8">
          <InquiryForm variant="property" defaultProject={`${property.name} by Stealth Land Corp`} title="Inquire now" description={`Request a quote, floor plans and payment terms for ${property.name}.`} />
        </Reveal>
      </section>

      {property.mortgageCalculator && (
        <section id="calculator" className="container-x scroll-mt-24 pb-20 lg:pb-28">
          <Reveal>
            <MortgageCalculator propertyName={property.name} />
          </Reveal>
        </section>
      )}

      {related.length > 0 && (
        <section className="border-t border-white/5 bg-navy-900 py-20 lg:py-24">
          <div className="container-x">
            <div className="flex items-end justify-between gap-6">
              <SectionHeading eyebrow="Explore more" title="Other Stealth Land projects" />
              <Link href="/properties" className="hidden shrink-0 items-center gap-1 text-sm text-gold-400 hover:underline sm:inline-flex">All properties <ArrowRight className="size-4" /></Link>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PropertyCard key={p.slug} property={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function Fact({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-gold-500/10 p-2.5 text-gold-400"><Icon className="size-4" /></div>
      <div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">{label}</p>
        <p className="mt-0.5 text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
