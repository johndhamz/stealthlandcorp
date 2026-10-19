"use client";

import Image from "next/image";
import { useCallback, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Expand, Sailboat } from "lucide-react";
import { cn } from "@/lib/utils";
import { Lightbox } from "@/components/ui/Lightbox";

interface Props {
  images: string[];
  name: string;
  /** Overlay content (title, price) drawn over the bottom of the photo. */
  children?: ReactNode;
}

/** Swipeable photo strip for a tour card: arrows, dots, tap to open the full-screen viewer. */
export function TourGallery({ images, name, children }: Props) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const touchX = useRef<number | null>(null);
  const many = images.length > 1;

  const prev = useCallback(() => setActive((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length]);
  const close = useCallback(() => setOpen(false), []);

  return (
    <div
      className="relative aspect-[16/9] overflow-hidden"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null || !many) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
      }}
    >
      {images.length ? (
        <button type="button" onClick={() => setOpen(true)} aria-label={`Open ${name} photos`} className="absolute inset-0 cursor-zoom-in">
          {images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={`${name} photo ${i + 1}`}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              loading={i === 0 ? undefined : "lazy"}
              className={cn("object-cover transition-all duration-700 group-hover:scale-105", i === active ? "opacity-100" : "opacity-0")}
              unoptimized={src.startsWith("http://")}
            />
          ))}
        </button>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy-700 via-navy-800 to-navy-950">
          <Sailboat className="size-14 text-gold-500/30" aria-hidden="true" />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent" />

      {many && (
        <>
          <button type="button" onClick={prev} aria-label="Previous photo" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-navy-950/60 p-1.5 text-white opacity-70 backdrop-blur transition hover:bg-gold-500 hover:text-navy-900 md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100">
            <ChevronLeft className="size-4" />
          </button>
          <button type="button" onClick={next} aria-label="Next photo" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-navy-950/60 p-1.5 text-white opacity-70 backdrop-blur transition hover:bg-gold-500 hover:text-navy-900 md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100">
            <ChevronRight className="size-4" />
          </button>
          <div className="absolute left-3 top-3 flex items-center gap-1.5" role="tablist" aria-label={`${name} photos`}>
            {images.map((src, i) => (
              <button key={src} type="button" role="tab" aria-selected={i === active} aria-label={`Photo ${i + 1}`} onClick={() => setActive(i)} className={cn("h-1.5 rounded-full transition-all", i === active ? "w-5 bg-gold-500" : "w-1.5 bg-white/60 hover:bg-white")} />
            ))}
          </div>
        </>
      )}
      {images.length > 0 && (
        <button type="button" onClick={() => setOpen(true)} aria-label="View photos fullscreen" className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-navy-950/60 px-2.5 py-1 text-[11px] text-white/90 backdrop-blur transition hover:bg-gold-500 hover:text-navy-900">
          <Expand className="size-3.5" /> {images.length} {images.length === 1 ? "photo" : "photos"}
        </button>
      )}

      {children && <div className="pointer-events-none absolute bottom-4 left-4 right-4">{children}</div>}

      {open && images.length > 0 && <Lightbox images={images} active={active} name={name} onClose={close} onPrev={prev} onNext={next} onSelect={setActive} />}
    </div>
  );
}
