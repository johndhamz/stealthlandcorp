import type { Metadata } from "next";
import { Briefcase, Handshake, LandPlot, Wrench } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { getContent } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Partner With Us",
  description: "Investor relations, landowner joint ventures, brokerage accreditation and supplier partnerships with Stealth Land Corp.",
};

const icons = [Briefcase, LandPlot, Handshake, Wrench];

export default async function PartnerPage() {
  const partnerPage = await getContent("partner");
  return (
    <>
      <PageHero eyebrow="Partner with us" title="Grow with Stealth Land" description={partnerPage.intro} image="/images/properties/hotel/groove-towers.jpg" crumbs={[{ label: "Partner With Us" }]} />

      <section className="container-x py-20 lg:py-28">
        <SectionHeading eyebrow="Partnership types" title="Four ways to work together" />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {partnerPage.types.map((t, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal key={t.slug} delay={i * 90}>
                <a href={`#inquire`} className="group flex h-full gap-5 rounded-xl border border-white/8 bg-white/[0.03] p-6 transition hover:border-gold-500/40 hover:bg-white/[0.05]">
                  <div className="h-fit rounded-lg bg-gold-500/10 p-3 text-gold-400 transition group-hover:bg-gold-500 group-hover:text-navy-900"><Icon className="size-5" /></div>
                  <div>
                    <h3 className="font-display text-lg font-bold">{t.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">{t.text}</p>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="border-t border-white/5 bg-navy-900 py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <Reveal>
            <SectionHeading eyebrow="Start the conversation" title="Tell us about your proposal" description="Share a short overview of the opportunity, the location and your timeline. The relevant team at Stealth Land will follow up directly." />
          </Reveal>
          <Reveal delay={120} className="rounded-2xl border border-white/10 bg-navy-800 p-6 sm:p-8">
            <InquiryForm variant="partner" title="Partnership inquiry" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
