import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { createSessionClient } from "@/lib/supabase/server";
import { Badge, EmptyState, PageHeader, Table, Td, Th, formatDate } from "@/components/admin/ui";
import { BOOKING_STATUSES, bookingStatusLabels, formatPhp, formatStayDate, type BookingStatus } from "@/lib/bookings";
import { cn } from "@/lib/utils";

export default function BookingsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  return (
    <>
      <PageHeader title="Bookings" description="Booking requests from the resort pages. Confirm availability and payment with the guest by email, then update the status here." />
      <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-navy-900/10" />}>
        <List searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function List({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status = "" } = await searchParams;
  const supabase = await createSessionClient();
  let query = supabase.from("bookings").select("id, reference, kind, created_at, first_name, last_name, email, room_name, check_in, check_out, nights, guests, rooms, total, activities_total, status, properties(name), booking_activities(activity_name, pax)").order("created_at", { ascending: false }).limit(200);
  if ((BOOKING_STATUSES as readonly string[]).includes(status)) query = query.eq("status", status);
  const { data } = await query;
  const rows = (data ?? []) as unknown as { id: string; reference: string; kind: "stay" | "activity"; created_at: string; first_name: string; last_name: string; email: string; room_name: string; check_in: string; check_out: string; nights: number; guests: number; rooms: number; total: number; activities_total: number; status: BookingStatus; properties: { name: string } | null; booking_activities: { activity_name: string; pax: number }[] }[];

  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2">
        <Chip href="/admin/bookings" active={!status}>All</Chip>
        {BOOKING_STATUSES.map((s) => <Chip key={s} href={`/admin/bookings?status=${s}`} active={status === s}>{bookingStatusLabels[s]}</Chip>)}
      </div>
      {rows.length ? (
        <Table>
          <thead>
            <tr><Th>Reference</Th><Th>Guest</Th><Th>Dates</Th><Th>Room / tours</Th><Th>Total</Th><Th>Status</Th><Th /></tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.id} className="hover:bg-cream/60">
                <Td><span className="font-mono text-xs font-semibold">{b.reference}</span><span className="block text-xs text-navy-600">{formatDate(b.created_at)}</span></Td>
                <Td><span className="font-medium">{b.first_name} {b.last_name}</span><span className="block text-xs text-navy-600">{b.email}</span></Td>
                <Td className="whitespace-nowrap">
                  {b.kind === "activity" ? <>{formatStayDate(b.check_in)}<span className="block text-xs text-navy-600">Day tour · {b.guests} guests</span></> : <>{formatStayDate(b.check_in)} → {formatStayDate(b.check_out)}<span className="block text-xs text-navy-600">{b.nights} {b.nights === 1 ? "night" : "nights"} · {b.guests} guests</span></>}
                </Td>
                <Td>
                  {b.kind === "activity" ? <Badge tone="blue">Tour only</Badge> : <>{b.room_name}{b.rooms > 1 ? ` × ${b.rooms}` : ""}</>}
                  {b.booking_activities?.length > 0 && <span className="block text-xs text-navy-600">{b.booking_activities.map((a) => `${a.activity_name} × ${a.pax}`).join(", ")}</span>}
                  <span className="block text-xs text-navy-600">{b.properties?.name}</span>
                </Td>
                <Td className="font-medium">{formatPhp(Number(b.total))}</Td>
                <Td><BookingBadge status={b.status} /></Td>
                <Td className="text-right"><Link href={`/admin/bookings/${b.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-navy-900 hover:underline">Open <ArrowRight className="size-3.5" /></Link></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyState title="No booking requests" text={status ? "Nothing with this status yet." : "Requests from the resort booking form will appear here."} />
      )}
    </>
  );
}

export function BookingBadge({ status }: { status: BookingStatus }) {
  const tone = status === "requested" ? "gold" : status === "confirmed" ? "green" : status === "completed" ? "blue" : status === "declined" ? "red" : "neutral";
  return <Badge tone={tone}>{bookingStatusLabels[status]}</Badge>;
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={cn("rounded-full border px-3.5 py-1.5 text-xs font-semibold transition", active ? "border-navy-900 bg-navy-900 text-white" : "border-navy-900/15 bg-white text-navy-700 hover:border-navy-900/40")}>
      {children}
    </Link>
  );
}
