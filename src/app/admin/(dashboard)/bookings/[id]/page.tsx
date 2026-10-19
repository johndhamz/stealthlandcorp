import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createSessionClient } from "@/lib/supabase/server";
import { Card, PageHeader, btn, formatDate } from "@/components/admin/ui";
import { formatPhp, formatStayDate } from "@/lib/bookings";
import { BookingForm } from "./BookingForm";

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSessionClient();
  const { data } = await supabase.from("bookings").select("*, properties(name, check_in_time, check_out_time)").eq("id", id).maybeSingle();
  if (!data) notFound();
  const b = data as typeof data & { properties: { name: string; check_in_time: string; check_out_time: string } | null };

  const rows: [string, string][] = [
    ["Requested", formatDate(b.created_at)],
    ["Property", b.properties?.name ?? "—"],
    ["Room", `${b.room_name}${b.rooms > 1 ? ` × ${b.rooms}` : ""}`],
    ["Check-in", `${formatStayDate(b.check_in)} · ${b.properties?.check_in_time ?? ""}`],
    ["Check-out", `${formatStayDate(b.check_out)} · ${b.properties?.check_out_time ?? ""}`],
    ["Nights", String(b.nights)],
    ["Guests", String(b.guests)],
    ["Rate", `${formatPhp(Number(b.nightly_rate))} / room / night`],
    ["Email", b.email],
    ["Phone", b.phone],
  ];
  const subject = encodeURIComponent(`Your booking request ${b.reference} · ${b.properties?.name ?? "Stealth Land Corp"}`);
  const body = encodeURIComponent(`Hi ${b.first_name},\n\nThank you for your request to stay with us (${b.reference}).\n\n${b.room_name} · ${formatStayDate(b.check_in)} to ${formatStayDate(b.check_out)} · ${b.guests} guests\nIndicative total: ${formatPhp(Number(b.total))}\n\n`);

  return (
    <>
      <Link href="/admin/bookings" className="mb-4 inline-flex items-center gap-1 text-sm text-navy-600 hover:text-navy-900"><ArrowLeft className="size-4" /> All bookings</Link>
      <PageHeader title={`${b.first_name} ${b.last_name}`} description={<>Reference <span className="font-mono font-semibold">{b.reference}</span></>} actions={<a href={`mailto:${b.email}?subject=${subject}&body=${body}`} className={btn.gold}>Email guest</a>} />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6">
          <Card title="Stay details">
            <dl className="divide-y divide-navy-900/5 text-sm">
              {rows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-2.5"><dt className="text-navy-600">{k}</dt><dd className="text-right font-medium text-navy-900">{v}</dd></div>
              ))}
            </dl>
          </Card>
          {b.special_requests && (
            <Card title="Special requests"><p className="whitespace-pre-wrap text-sm leading-relaxed text-navy-900">{b.special_requests}</p></Card>
          )}
        </div>
        <Card title="Manage booking" description="Update the status once you have confirmed availability and payment with the guest.">
          <BookingForm booking={{ id: b.id, status: b.status, notes: b.notes, total: Number(b.total), updated_at: b.updated_at }} />
        </Card>
      </div>
    </>
  );
}
