import Image from "next/image";
import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  crumbs: Crumb[];
  children?: ReactNode;
  compact?: boolean;
}

export function PageHero({ eyebrow, title, description, image, crumbs, children, compact }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      {image && (
        <>
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-800/70 via-navy-800/80 to-navy-800" />
        </>
      )}
      <div className="relative">
        <Breadcrumbs items={crumbs} />
        <div className={`container-x ${compact ? "pb-12 pt-6" : "pb-20 pt-10 sm:pb-24 sm:pt-14"}`}>
          {eyebrow && <p className="eyebrow mb-4 animate-fade-up">{eyebrow}</p>}
          <h1 className="animate-fade-up font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl [animation-delay:80ms]">
            {title}
          </h1>
          {description && (
            <p className="mt-6 max-w-2xl animate-fade-up text-base leading-relaxed text-white/75 sm:text-lg [animation-delay:160ms]">
              {description}
            </p>
          )}
          {children && <div className="mt-8 animate-fade-up [animation-delay:240ms]">{children}</div>}
        </div>
      </div>
    </section>
  );
}
