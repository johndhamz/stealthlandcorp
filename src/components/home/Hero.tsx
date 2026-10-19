"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Slide {
  src: string;
  alt: string;
}

interface Props {
  slides: Slide[];
  eyebrow: string;
  title: string;
  subtitle: string;
}

export function Hero({ slides, eyebrow, title, subtitle }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 7000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section className="relative isolate flex min-h-[calc(100svh-72px)] items-end overflow-hidden lg:min-h-[calc(100svh-120px)]">
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={cn("absolute inset-0 transition-opacity duration-[1600ms] ease-out", i === index ? "opacity-100" : "opacity-0")}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className={cn("object-cover", i === index && "animate-ken-burns")}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-800 via-navy-900/55 to-navy-900/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900/70 via-transparent to-transparent" />

      <div className="container-x relative pb-20 pt-32 sm:pb-28">
        <p className="eyebrow mb-5 animate-fade-up">{eyebrow}</p>
        <h1 className="max-w-3xl animate-fade-up font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl [animation-delay:100ms]">
          {title}
        </h1>
        <p className="mt-6 max-w-xl animate-fade-up text-base leading-relaxed text-white/80 sm:text-lg [animation-delay:200ms]">{subtitle}</p>
        <div className="mt-10 flex flex-wrap items-center gap-4 animate-fade-up [animation-delay:300ms]">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 rounded-md bg-gold-500 px-7 py-3.5 font-display text-xs font-semibold uppercase tracking-[0.18em] text-navy-900 transition hover:-translate-y-0.5 hover:bg-gold-400 hover:shadow-[0_10px_30px_-10px_rgba(200,166,90,0.7)]"
          >
            View properties <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/contact-us#inquire"
            className="inline-flex items-center gap-2 rounded-md border border-white/30 px-7 py-3.5 font-display text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition hover:border-gold-500 hover:text-gold-400"
          >
            Request a quote
          </Link>
        </div>

        {slides.length > 1 && (
          <div className="mt-12 flex items-center gap-2" role="tablist" aria-label="Hero slides">
            {slides.map((s, i) => (
              <button
                key={s.src}
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn("h-1 rounded-full transition-all duration-500", i === index ? "w-10 bg-gold-500" : "w-4 bg-white/30 hover:bg-white/60")}
              />
            ))}
          </div>
        )}
      </div>

      <a href="#intro" aria-label="Scroll to content" className="absolute bottom-6 right-6 hidden animate-bounce text-white/50 transition hover:text-gold-400 sm:block">
        <ChevronDown className="size-6" />
      </a>
    </section>
  );
}
