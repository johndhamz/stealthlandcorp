import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createSessionClient } from "@/lib/supabase/server";
import { Card, PageHeader, btn, formatDate } from "@/components/admin/ui";
import { formatPhp, formatStayDate, priceUnitLabel } from "@/lib/bookings";
import { BookingForm } from "./BookingForm";

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSessionClient();
  const { data } = await supabase.from("bookings").select("*, properties(name, check_in_time, check_out_time), booking_activities(id, activity_name, activity_date, pax, unit_price, price_unit, subtotal)").eq("id", id).maybeSingle();
  if (!data) notFound();
  type TourLine = { id: string; activity_name: string; activity_date: string | null; pax: number; unit_price: number; price_unit: "person" | "group"; subtotal: number };
  const b = data as typeof data & {
    kind: "stay" | "activity";
    activities_total: number;
    properties: { name: string; check_in_time: string; check_out_time: string } | null;
    booking_activities: TourLine[];
  };
  const tourOnly = b.kind === "activity";
  const tours: TourLine[] = b.booking_activities ?? [];

  const rows: [string, string][] = tourOnly
    ? [
        ["Requested", formatDate(b.created_at)],
        ["Type", "Island hopping / day tour (not staying)"],
        ["Property", b.properties?.name ?? "—"],
        ["Tour date", formatStayDate(b.check_in)],
        ["Group size", String(b.guests)],
        ["Email", b.email],
        ["Phone", b.phone],
      ]
    : [
        ["Requested", formatDate(b.created_at)],
        ["Property", b.properties?.name ?? "—"],
        ["Room", `${b.room_name}${b.rooms > 1 ? ` × ${b.rooms}` : ""}`],
        ["Check-in", `${formatStayDate(b.check_in)} · ${b.properties?.check_in_time ?? ""}`],
        ["Check-out", `${formatStayDate(b.check_out)} · ${b.properties?.check_out_time ?? ""}`],
        ["Nights", String(b.nights)],
        ["Guests", String(b.guests)],
        ["Rate", `${formatPhp(Number(b.nightly_rate))} / room / night`],
        ...(tours.length ? ([["Room subtotal", formatPhp(Number(b.nightly_rate) * b.nights * b.rooms)]] as [string, string][]) : []),
        ["Email", b.email],
        ["Phone", b.phone],
      ];
  const subject = encodeURIComponent(`Your booking request ${b.reference} · ${b.properties?.name ?? "Stealth Land Corp"}`);
  const tourLines = tours.map((t) => `${t.activity_name} × ${t.pax}${t.activity_date ? ` on ${formatStayDate(t.activity_date)}` : ""}`).join("\n");
  const body = encodeURIComponent(
    tourOnly
      ? `Hi ${b.first_name},\n\nThank you for your tour request (${b.reference}).\n\n${formatStayDate(b.check_in)}\n${tourLines}\nIndicative total: ${formatPhp(Number(b.total))}\n\n`
      : `Hi ${b.first_name},\n\nThank you for your request to stay with us (${b.reference}).\n\n${b.room_name} · ${formatStayDate(b.check_in)} to ${formatStayDate(b.check_out)} · ${b.guests} guests${tourLines ? `\n${tourLines}` : ""}\nIndicative total: ${formatPhp(Number(b.total))}\n\n`,
  );

  return (
    <>
      <Link href="/admin/bookings" className="mb-4 inline-flex items-center gap-1 text-sm text-navy-600 hover:text-navy-900"><ArrowLeft className="size-4" /> All bookings</Link>
      <PageHeader title={`${b.first_name} ${b.last_name}`} description={<>Reference <span className="font-mono font-semibold">{b.reference}</span>{tourOnly ? " · Day tour" : ""}</>} actions={<a href={`mailto:${b.email}?subject=${subject}&body=${body}`} className={btn.gold}>Email guest</a>} />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6">
          <Card title={tourOnly ? "Tour details" : "Stay details"}>
            <dl className="divide-y divide-navy-900/5 text-sm">
              {rows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-2.5"><dt className="text-navy-600">{k}</dt><dd className="text-right font-medium text-navy-900">{v}</dd></div>
              ))}
            </dl>
          </Card>
          {tours.length > 0 && (
            <Card title={tourOnly ? "Tours requested" : "Island hopping add-ons"}>
              <dl className="divide-y divide-navy-900/5 text-sm">
                {tours.map((t) => (
                  <div key={t.id} className="flex justify-between gap-6 py-2.5">
                    <dt className="text-navy-900"><span className="font-medium">{t.activity_name}</span><span className="block text-xs text-navy-600">{t.pax} {t.pax === 1 ? "guest" : "guests"} · {formatPhp(Number(t.unit_price))} {priceUnitLabel(t.price_unit)}{t.activity_date ? ` · ${formatStayDate(t.activity_date)}` : ""}</span></dt>
                    <dd className="text-right font-medium text-navy-900">{formatPhp(Number(t.subtotal))}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-6 py-2.5"><dt className="text-navy-600">Tours subtotal</dt><dd className="text-right font-semibold text-navy-900">{formatPhp(Number(b.activities_total))}</dd></div>
              </dl>
            </Card>
          )}
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
