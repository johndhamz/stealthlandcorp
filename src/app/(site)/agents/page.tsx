import type { Metadata } from "next";
import { BadgeDollarSign, GraduationCap, Megaphone, Users } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { getContent } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Agents",
  description: "Join the Stealth Land Corp accredited agent and broker network and sell pre-selling residences in Cebu and Palawan with full marketing support.",
};

const icons = [BadgeDollarSign, Megaphone, GraduationCap, Users];

export default async function AgentsPage() {
  const agentsPage = await getContent("agents");
  return (
    <>
      <PageHero eyebrow="Agents & brokers" title="Sell with Stealth Land" description={agentsPage.intro} image="/images/properties/residential/visayas-4.jpg" crumbs={[{ label: "Agents" }]} />

      <section className="container-x py-20 lg:py-28">
        <SectionHeading eyebrow="Why partner with us" title="Everything you need to close" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {agentsPage.benefits.map((b, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal key={b.title} delay={i * 90} className="rounded-xl border border-white/8 bg-white/[0.03] p-6 transition hover:border-gold-500/40">
                <div className="mb-4 inline-flex rounded-lg bg-gold-500/10 p-2.5 text-gold-400"><Icon className="size-5" /></div>
                <h3 className="font-display text-lg font-bold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{b.text}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="border-t border-white/5 bg-navy-900 py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <Reveal>
            <SectionHeading eyebrow="Accreditation" title="Apply to become an accredited agent" description="Tell us about your brokerage, your territory and the markets you serve. Our sales team will reach out with the accreditation requirements and onboarding schedule." />
            <ol className="mt-8 space-y-4 text-sm text-white/70">
              {["Submit the form with your details", "Receive the accreditation checklist", "Complete product training and site tour", "Start selling with full marketing support"].map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gold-500 font-display text-[11px] font-bold text-navy-900">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={120} className="rounded-2xl border border-white/10 bg-navy-800 p-6 sm:p-8">
            <InquiryForm variant="agent" title="Agent application" description="We respond to accreditation requests within a few business days." />
          </Reveal>
        </div>
      </section>
    </>
  );
}
