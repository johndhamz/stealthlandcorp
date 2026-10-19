import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/admin/ui";
import { contentSchema } from "@/lib/admin/content-schema";

export default function ContentIndexPage() {
  return (
    <>
      <PageHeader title="Site content" description="Edit the copy and contact details shown on the public site. Changes go live immediately." />
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(contentSchema).map(([key, s]) => (
          <Link key={key} href={`/admin/content/${key}`} className="group rounded-xl border border-navy-900/10 bg-white p-5 shadow-sm transition hover:border-gold-500/60">
            <h2 className="flex items-center justify-between font-display text-base font-bold text-navy-900">
              {s.title} <ArrowRight className="size-4 text-gold-600 transition group-hover:translate-x-0.5" />
            </h2>
            <p className="mt-1 text-sm text-navy-600">{s.description}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
