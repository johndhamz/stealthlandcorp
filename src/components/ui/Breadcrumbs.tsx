import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Fragment } from "react";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="container-x py-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-white/60">
        {all.map((item, i) => {
          const last = i === all.length - 1;
          return (
            <Fragment key={`${item.label}-${i}`}>
              <li>
                {item.href && !last ? (
                  <Link href={item.href} className="transition hover:text-gold-400">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gold-400" aria-current={last ? "page" : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
              {!last && (
                <li aria-hidden="true">
                  <ChevronRight className="size-3 text-white/30" />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
