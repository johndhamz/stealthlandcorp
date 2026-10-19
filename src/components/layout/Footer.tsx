import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { Facebook, Instagram, Youtube } from "@/components/ui/SocialIcons";
import { site } from "@/data/site";
import { properties } from "@/data/properties";
import { Year } from "./Year";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-navy-900">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="relative h-10 w-[120px]">
            <Image src="/icons/stealthLogo.png" alt="Stealth Land Corp" fill sizes="120px" className="object-contain object-left" />
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">{site.description}</p>
          <div className="mt-6 flex items-center gap-4">
            <a href={site.social.facebook.href} target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-full border border-white/10 p-2.5 text-white/70 transition hover:border-gold-500 hover:text-gold-400"><Facebook className="size-4" /></a>
            <a href={site.social.instagram.href} target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full border border-white/10 p-2.5 text-white/70 transition hover:border-gold-500 hover:text-gold-400"><Instagram className="size-4" /></a>
            <a href={site.social.youtube.href} target="_blank" rel="noreferrer" aria-label="YouTube" className="rounded-full border border-white/10 p-2.5 text-white/70 transition hover:border-gold-500 hover:text-gold-400"><Youtube className="size-4" /></a>
          </div>
        </div>

        <div>
          <h3 className="eyebrow">Company</h3>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            {site.nav.map((n) => (
              <li key={n.href}><Link href={n.href} className="transition hover:text-gold-400">{n.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow">Properties</h3>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            {properties.map((p) => (
              <li key={p.slug}><Link href={`/properties/${p.slug}`} className="transition hover:text-gold-400">{p.name}<span className="text-white/40"> · {p.region}</span></Link></li>
            ))}
            <li><Link href="/properties" className="text-gold-400 transition hover:text-gold-300">View all →</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow">Get in touch</h3>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            <li><a href={`mailto:${site.email}`} className="flex items-center gap-2 transition hover:text-gold-400"><Mail className="size-4 text-gold-500" /> {site.email}</a></li>
            <li className="text-white/50">Philippines</li>
          </ul>
          <Link href="/contact-us#inquire" className="mt-6 inline-block rounded-md border border-gold-500/60 px-5 py-2.5 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-400 transition hover:bg-gold-500 hover:text-navy-900">
            Request a quote
          </Link>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-xs text-white/50 sm:flex-row">
          <p>All Rights Reserved. {site.legalName} © <Year /></p>
          <ul className="flex items-center gap-5">
            {site.footerLinks.map((l) => (
              <li key={l.href}><Link href={l.href} className="transition hover:text-gold-400">{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
