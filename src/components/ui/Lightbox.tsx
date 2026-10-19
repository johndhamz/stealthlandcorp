"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  images: string[];
  active: number;
  name: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (i: number) => void;
}

/** Full-screen image viewer with keyboard, swipe and thumbnail navigation. Shared by property and tour galleries. */
export function Lightbox({ images, active, name, onClose, onPrev, onNext, onSelect }: Props) {
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-navy-950/95 p-4 backdrop-blur"
      role="dialog"
      aria-modal="true"
      aria-label={`${name} gallery`}
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 40) (dx < 0 ? onNext : onPrev)();
      }}
    >
      <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-gold-500 hover:text-navy-900">
        <X className="size-5" />
      </button>
      <div className="relative h-full w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
        <Image src={images[active]} alt={`${name} view ${active + 1}`} fill sizes="100vw" className="object-contain" />
      </div>
      <p className="mt-3 text-sm text-white/70">
        {name} · {active + 1} / {images.length}
      </p>
      {images.length > 1 && (
        <>
          <div className="mt-3 flex max-w-full gap-2 overflow-x-auto pb-1" onClick={(e) => e.stopPropagation()}>
            {images.map((src, i) => (
              <button key={src} type="button" onClick={() => onSelect(i)} aria-label={`Show image ${i + 1}`} className={cn("relative h-14 w-20 shrink-0 overflow-hidden rounded-md border-2 transition", i === active ? "border-gold-500" : "border-transparent opacity-60 hover:opacity-100")}>
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
          <button type="button" onClick={(e) => { e.stopPropagation(); onPrev(); }} aria-label="Previous image" className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-gold-500 hover:text-navy-900"><ChevronLeft className="size-6" /></button>
          <button type="button" onClick={(e) => { e.stopPropagation(); onNext(); }} aria-label="Next image" className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-gold-500 hover:text-navy-900"><ChevronRight className="size-6" /></button>
        </>
      )}
    </div>
  );
}
