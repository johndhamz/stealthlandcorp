import { Suspense } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { createSessionClient } from "@/lib/supabase/server";
import { Badge, EmptyState, LinkButton, PageHeader, Table, Td, Th } from "@/components/admin/ui";
import { formatPhp } from "@/lib/bookings";

export default function RoomsPage() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-navy-900/10" />}>
      <RoomsPageContent />
    </Suspense>
  );
}

async function RoomsPageContent() {
  const supabase = await createSessionClient();
  const { data } = await supabase
    .from("room_types")
    .select("id, name, slug, nightly_rate, max_guests, quantity, published, sort_order, properties(name)")
    .order("sort_order")
    .order("nightly_rate");
  const rows = (data ?? []) as unknown as { id: string; name: string; slug: string; nightly_rate: number; max_guests: number; quantity: number; published: boolean; properties: { name: string } | null }[];

  return (
    <>
      <PageHeader title="Rooms" description="Room types and nightly rates for bookable hotels and resorts. Rates shown on the site are indicative." actions={<LinkButton href="/admin/rooms/new" variant="gold">Add room</LinkButton>} />
      {rows.length ? (
        <Table>
          <thead>
            <tr><Th>Room</Th><Th>Hotel</Th><Th>Rate / night</Th><Th>Sleeps</Th><Th>Inventory</Th><Th>Visibility</Th><Th /></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-cream/60">
                <Td><span className="font-medium">{r.name}</span><span className="block text-xs text-navy-600">{r.slug}</span></Td>
                <Td>{r.properties?.name ?? "—"}</Td>
                <Td className="font-medium">{formatPhp(Number(r.nightly_rate))}</Td>
                <Td>{r.max_guests}</Td>
                <Td>{r.quantity}</Td>
                <Td>{r.published ? <Badge tone="green">Published</Badge> : <Badge>Hidden</Badge>}</Td>
                <Td className="text-right"><Link href={`/admin/rooms/${r.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-navy-900 hover:underline"><Pencil className="size-3.5" /> Edit</Link></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyState title="No rooms yet" text="Add room types to a hotel property marked as bookable." action={<LinkButton href="/admin/rooms/new" variant="gold">Add room</LinkButton>} />
      )}
    </>
  );
}
