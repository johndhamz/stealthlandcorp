"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { cn } from "@/lib/utils";
import { Lightbox } from "@/components/ui/Lightbox";

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  const prev = useCallback(() => setActive((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length]);

  const close = useCallback(() => setOpen(false), []);

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

      {open && <Lightbox images={images} active={active} name={name} onClose={close} onPrev={prev} onNext={next} onSelect={setActive} />}
    </div>
  );
}
