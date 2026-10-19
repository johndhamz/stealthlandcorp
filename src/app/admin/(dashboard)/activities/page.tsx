import { Suspense } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { createSessionClient } from "@/lib/supabase/server";
import { Badge, EmptyState, LinkButton, PageHeader, Table, Td, Th } from "@/components/admin/ui";
import { formatPhp, priceUnitLabel } from "@/lib/bookings";

export default function ActivitiesPage() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-navy-900/10" />}>
      <ActivitiesPageContent />
    </Suspense>
  );
}

async function ActivitiesPageContent() {
  const supabase = await createSessionClient();
  const { data } = await supabase
    .from("activities")
    .select("id, name, slug, category, price, price_unit, min_pax, max_pax, duration, published, sort_order, properties(name)")
    .order("sort_order")
    .order("price");
  const rows = (data ?? []) as unknown as { id: string; name: string; slug: string; category: string; price: number; price_unit: "person" | "group"; min_pax: number; max_pax: number; duration: string; published: boolean; properties: { name: string } | null }[];

  return (
    <>
      <PageHeader title="Activities" description="Island hopping tours and activities guests can add to a stay or request on their own. Rates shown on the site are indicative." actions={<LinkButton href="/admin/activities/new" variant="gold">Add tour</LinkButton>} />
      {rows.length ? (
        <Table>
          <thead>
            <tr><Th>Tour</Th><Th>Section</Th><Th>Resort</Th><Th>Price</Th><Th>Guests</Th><Th>Duration</Th><Th>Visibility</Th><Th /></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-cream/60">
                <Td><span className="font-medium">{r.name}</span><span className="block text-xs text-navy-600">{r.slug}</span></Td>
                <Td>{r.category || "—"}</Td>
                <Td>{r.properties?.name ?? "—"}</Td>
                <Td className="font-medium">{formatPhp(Number(r.price))}<span className="block text-xs font-normal text-navy-600">{priceUnitLabel(r.price_unit)}</span></Td>
                <Td>{r.min_pax === r.max_pax ? r.max_pax : `${r.min_pax}–${r.max_pax}`}</Td>
                <Td>{r.duration || "—"}</Td>
                <Td>{r.published ? <Badge tone="green">Published</Badge> : <Badge>Hidden</Badge>}</Td>
                <Td className="text-right"><Link href={`/admin/activities/${r.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-navy-900 hover:underline"><Pencil className="size-3.5" /> Edit</Link></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyState title="No tours yet" text="Add island hopping tours to a resort marked as bookable." action={<LinkButton href="/admin/activities/new" variant="gold">Add tour</LinkButton>} />
      )}
    </>
  );
}
