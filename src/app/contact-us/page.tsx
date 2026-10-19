import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { Facebook, Instagram, Youtube } from "@/components/ui/SocialIcons";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Stealth Land Corp for pre-selling and ready-for-occupancy condominium quotes, site visits and partnership inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact us" title="We would love to hear from you" description="Request a quote on pre-selling and RFO condominiums, schedule a site visit, or ask us anything about our developments." crumbs={[{ label: "Contact Us" }]} compact />

      <section className="container-x grid gap-12 py-16 lg:grid-cols-[1fr_1.4fr] lg:gap-20 lg:py-24">
        <Reveal className="space-y-8">
          <div className="rounded-2xl border border-white/8 bg-navy-900 p-7">
            <h2 className="font-display text-xl font-bold">Get in touch</h2>
            <ul className="mt-5 space-y-4 text-sm text-white/75">
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-3 transition hover:text-gold-400">
                  <span className="rounded-lg bg-gold-500/10 p-2.5 text-gold-400"><Mail className="size-4" /></span>
                  {site.email}
                </a>
              </li>
              <li>
                <a href={site.social.facebook.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-gold-400">
                  <span className="rounded-lg bg-gold-500/10 p-2.5 text-gold-400"><Facebook className="size-4" /></span>
                  {site.social.facebook.label}
                </a>
              </li>
              <li>
                <a href={site.social.instagram.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-gold-400">
                  <span className="rounded-lg bg-gold-500/10 p-2.5 text-gold-400"><Instagram className="size-4" /></span>
                  @{site.social.instagram.label}
                </a>
              </li>
              <li>
                <a href={site.social.youtube.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-gold-400">
                  <span className="rounded-lg bg-gold-500/10 p-2.5 text-gold-400"><Youtube className="size-4" /></span>
                  {site.social.youtube.label}
                </a>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-gold-500/20 bg-gradient-to-br from-navy-900 to-navy-950 p-7">
            <p className="eyebrow">Response time</p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">We typically respond within one to two business days. For urgent reservation requests, mention your preferred unit and move-in timeline in your message.</p>
          </div>
        </Reveal>
        <Reveal delay={120} className="scroll-mt-28 rounded-2xl border border-white/10 bg-navy-900 p-6 sm:p-8" >
          <InquiryForm variant="contact" title="Inquire now" description="Contact us today and we will get back to you soon." />
        </Reveal>
      </section>
    </>
  );
}
