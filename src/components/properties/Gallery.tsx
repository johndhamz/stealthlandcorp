"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";
import { cn } from "@/lib/utils";

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  const prev = useCallback(() => setActive((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, prev, next]);

  return (
    <div>
      <div className="group relative aspect-[16/10] overflow-hidden rounded-xl bg-navy-900">
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`${name} view ${i + 1}`}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 60vw, 100vw"
            className={cn("object-cover transition-opacity duration-700", i === active ? "opacity-100" : "opacity-0")}
          />
        ))}
        {images.length > 1 && (
          <>
            <button type="button" onClick={prev} aria-label="Previous image" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-navy-950/60 p-2 text-white opacity-0 backdrop-blur transition hover:bg-gold-500 hover:text-navy-900 group-hover:opacity-100 focus:opacity-100">
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" onClick={next} aria-label="Next image" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-navy-950/60 p-2 text-white opacity-0 backdrop-blur transition hover:bg-gold-500 hover:text-navy-900 group-hover:opacity-100 focus:opacity-100">
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
        <button type="button" onClick={() => setOpen(true)} aria-label="Open fullscreen" className="absolute bottom-3 right-3 rounded-full bg-navy-950/60 p-2 text-white backdrop-blur transition hover:bg-gold-500 hover:text-navy-900">
          <Expand className="size-4" />
        </button>
        <span className="absolute bottom-3 left-3 rounded-full bg-navy-950/60 px-3 py-1 text-xs text-white/85 backdrop-blur">
          {active + 1} / {images.length}
        </span>
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={cn("relative aspect-[4/3] overflow-hidden rounded-lg border-2 transition", i === active ? "border-gold-500" : "border-transparent opacity-60 hover:opacity-100")}
            >
              <Image src={src} alt="" fill sizes="150px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/95 p-4 backdrop-blur" role="dialog" aria-modal="true" aria-label={`${name} gallery`}>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-gold-500 hover:text-navy-900">
            <X className="size-5" />
          </button>
          <div className="relative h-full w-full max-w-6xl">
            <Image src={images[active]} alt={`${name} view ${active + 1}`} fill sizes="100vw" className="object-contain" />
          </div>
          {images.length > 1 && (
            <>
              <button type="button" onClick={prev} aria-label="Previous image" className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-gold-500 hover:text-navy-900"><ChevronLeft className="size-6" /></button>
              <button type="button" onClick={next} aria-label="Next image" className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-gold-500 hover:text-navy-900"><ChevronRight className="size-6" /></button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
