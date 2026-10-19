"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

export function VideoEmbed({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-navy-950">
      {play ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0" aria-label={`Play ${title}`}>
          <Image src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" unoptimized />
          <div className="absolute inset-0 bg-navy-950/30 transition group-hover:bg-navy-950/10" />
          <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold-500 text-navy-900 shadow-xl transition group-hover:scale-110">
            <Play className="ml-1 size-6 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
}
