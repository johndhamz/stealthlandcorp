"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Mail, Menu, X } from "lucide-react";
import { Facebook, Instagram, Youtube } from "@/components/ui/SocialIcons";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileSub, setMobileSub] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href.split("?")[0]));

  return (
    <header className={cn("sticky top-0 z-50 transition-all duration-300", scrolled ? "bg-navy-900/90 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md" : "bg-navy-800")}>
      {/* Top bar */}
      <div className={cn("hidden border-b border-white/5 transition-all duration-300 lg:block", scrolled ? "max-h-0 overflow-hidden opacity-0" : "max-h-12 opacity-100")}>
        <div className="container-x flex h-10 items-center justify-end gap-6 text-xs text-white/60">
          <a href={site.social.youtube.href} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 transition hover:text-gold-400">
            <Youtube className="size-3.5" /> {site.social.youtube.label}
          </a>
          <a href={`mailto:${site.email}`} className="flex items-center gap-1.5 transition hover:text-gold-400">
            <Mail className="size-3.5" /> {site.email}
          </a>
          <a href={site.social.facebook.href} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 transition hover:text-gold-400">
            <Facebook className="size-3.5" /> {site.social.facebook.label}
          </a>
          <a href={site.social.instagram.href} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 transition hover:text-gold-400">
            <Instagram className="size-3.5" /> {site.social.instagram.label}
          </a>
        </div>
      </div>

      {/* Main bar */}
      <div className="container-x flex h-[72px] items-center justify-between lg:h-20">
        <Link href="/" className="relative block h-9 w-[104px] shrink-0 sm:h-10 sm:w-[118px]" aria-label="Stealth Land Corp home">
          <Image src="/icons/stealthLogo.png" alt="Stealth Land Corp" fill priority sizes="120px" className="object-contain object-left" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {site.nav.map((item) =>
            "children" in item ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 text-sm font-medium transition hover:text-gold-400",
                    isActive(item.href) ? "text-gold-400" : "text-white/85",
                  )}
                >
                  {item.label}
                  <ChevronDown className="size-3.5 transition group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute left-1/2 top-full w-56 -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="overflow-hidden rounded-lg border border-white/10 bg-navy-900 p-1.5 shadow-2xl">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href} className="block rounded-md px-3 py-2 text-sm text-white/80 transition hover:bg-white/5 hover:text-gold-400">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn("px-4 py-2 text-sm font-medium transition hover:text-gold-400", isActive(item.href) ? "text-gold-400" : "text-white/85")}
              >
                {item.label}
              </Link>
            ),
          )}
          <Link
            href="/contact-us#inquire"
            className="ml-3 rounded-md bg-gold-500 px-5 py-2.5 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-900 transition hover:bg-gold-400"
          >
            Inquire now
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 text-white transition hover:bg-white/5 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-x-0 top-[72px] bottom-0 z-40 overflow-y-auto bg-navy-900 transition-all duration-300 lg:hidden",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
        )}
      >
        <nav className="container-x flex flex-col py-4" aria-label="Mobile">
          {site.nav.map((item) =>
            "children" in item ? (
              <div key={item.href} className="border-b border-white/5">
                <button
                  type="button"
                  onClick={() => setMobileSub((v) => (v === item.href ? null : item.href))}
                  className="flex w-full items-center justify-between py-4 text-left font-display text-base font-semibold"
                  aria-expanded={mobileSub === item.href}
                >
                  {item.label}
                  <ChevronDown className={cn("size-4 transition", mobileSub === item.href && "rotate-180")} />
                </button>
                <div className={cn("grid transition-all duration-300", mobileSub === item.href ? "grid-rows-[1fr] pb-3" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href} onClick={close} className="block py-2.5 pl-4 text-sm text-white/75 hover:text-gold-400">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} onClick={close} className="border-b border-white/5 py-4 font-display text-base font-semibold hover:text-gold-400">
                {item.label}
              </Link>
            ),
          )}
          <Link href="/contact-us#inquire" onClick={close} className="mt-6 rounded-md bg-gold-500 px-5 py-3.5 text-center font-display text-xs font-semibold uppercase tracking-[0.18em] text-navy-900">
            Inquire now
          </Link>
          <div className="mt-8 flex items-center gap-5 text-white/60">
            <a href={site.social.facebook.href} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook className="size-5" /></a>
            <a href={site.social.instagram.href} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram className="size-5" /></a>
            <a href={site.social.youtube.href} target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube className="size-5" /></a>
            <a href={`mailto:${site.email}`} aria-label="Email"><Mail className="size-5" /></a>
          </div>
        </nav>
      </div>
    </header>
  );
}
