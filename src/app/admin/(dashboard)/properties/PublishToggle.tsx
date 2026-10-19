"use client";

import { useOptimistic, useTransition } from "react";
import { setPropertyPublished } from "@/lib/admin/actions/properties";
import { cn } from "@/lib/utils";

export function PublishToggle({ id, published }: { id: string; published: boolean }) {
  const [optimistic, setOptimistic] = useOptimistic(published);
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={optimistic}
      disabled={pending}
      onClick={() =>
        start(async () => {
          setOptimistic(!optimistic);
          await setPropertyPublished(id, !optimistic);
        })
      }
      className={cn("inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition", optimistic ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-navy-900/15 bg-white text-navy-600")}
    >
      <span className={cn("size-2 rounded-full", optimistic ? "bg-emerald-500" : "bg-navy-900/30")} />
      {optimistic ? "Published" : "Hidden"}
    </button>
  );
}
