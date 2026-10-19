import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createAdminClient } from "@/lib/supabase/server";
import { isIsoDate, makeReference, nightsBetween, formatPhp, formatStayDate } from "@/lib/bookings";
import { sendEmail } from "@/lib/email";

interface Payload {
  property_slug?: string;
  room_type_id?: string;
  check_in?: string;
  check_out?: string;
  guests?: number;
  rooms?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  special_requests?: string;
  agree_terms?: boolean;
  website?: string; // honeypot
}

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const int = (v: unknown, fallback: number) => (Number.isInteger(Number(v)) && Number(v) > 0 ? Number(v) : fallback);

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ ok: true, reference: makeReference() });

  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ message: "Online booking requests are not available right now. Please email admin@stealthlandcorp.com." }, { status: 503 });
  }

  const checkIn = str(body.check_in, 10);
  const checkOut = str(body.check_out, 10);
  const guests = int(body.guests, 0);
  const rooms = int(body.rooms, 1);
  const guest = {
    first_name: str(body.first_name, 100),
    last_name: str(body.last_name, 100),
    email: str(body.email, 200),
    phone: str(body.phone, 30),
    special_requests: str(body.special_requests, 2000),
  };

  if (!isIsoDate(checkIn) || !isIsoDate(checkOut)) return NextResponse.json({ message: "Choose valid check-in and check-out dates." }, { status: 422 });
  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1 || nights > 60) return NextResponse.json({ message: "Stays must be between 1 and 60 nights." }, { status: 422 });
  const today = new Date().toISOString().slice(0, 10);
  if (checkIn < today) return NextResponse.json({ message: "Check-in date cannot be in the past." }, { status: 422 });
  if (!guests) return NextResponse.json({ message: "Tell us how many guests are staying." }, { status: 422 });
  if (!guest.first_name || !guest.last_name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email) || !guest.phone) {
    return NextResponse.json({ message: "Please complete your name, email and phone number." }, { status: 422 });
  }
  if (!body.agree_terms) return NextResponse.json({ message: "Please accept the Privacy Policy and Terms of Use." }, { status: 422 });

  const admin = createAdminClient();
  const { data: room } = await admin
    .from("room_types")
    .select("id, name, max_guests, nightly_rate, published, property_id, properties!inner(slug, name, bookable)")
    .eq("id", str(body.room_type_id, 60))
    .maybeSingle();
  const prop = (room as unknown as { properties?: { slug: string; name: string; bookable: boolean } } | null)?.properties;
  if (!room || !room.published || !prop?.bookable || prop.slug !== str(body.property_slug, 120)) {
    return NextResponse.json({ message: "That room is not available for booking requests." }, { status: 422 });
  }
  if (guests > room.max_guests * rooms) {
    return NextResponse.json({ message: `${room.name} sleeps up to ${room.max_guests} guests per room. Add another room or choose a larger room.` }, { status: 422 });
  }

  const nightlyRate = Number(room.nightly_rate);
  const total = nightlyRate * nights * rooms;

  let reference = makeReference();
  let inserted = null;
  for (let attempt = 0; attempt < 3 && !inserted; attempt++) {
    const { data, error } = await admin
      .from("bookings")
      .insert({
        reference,
        property_id: room.property_id,
        room_type_id: room.id,
        room_name: room.name,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        rooms,
        ...guest,
        nightly_rate: nightlyRate,
        total,
        status: "requested",
      })
      .select("id, reference")
      .maybeSingle();
    if (error) {
      if (error.code === "23505") {
        reference = makeReference();
        continue;
      }
      console.error("Booking insert failed", error.message);
      return NextResponse.json({ message: "We could not save your request. Please try again or email admin@stealthlandcorp.com." }, { status: 500 });
    }
    inserted = data;
  }
  if (!inserted) return NextResponse.json({ message: "We could not save your request. Please try again." }, { status: 500 });

  const notify = process.env.BOOKING_NOTIFY_EMAIL || "admin@stealthlandcorp.com";
  const summary = [
    `Reference: ${reference}`,
    `Property: ${prop.name}`,
    `Room: ${room.name} x ${rooms}`,
    `Check-in: ${formatStayDate(checkIn)}`,
    `Check-out: ${formatStayDate(checkOut)} (${nights} ${nights === 1 ? "night" : "nights"})`,
    `Guests: ${guests}`,
    `Indicative total: ${formatPhp(total)} (${formatPhp(nightlyRate)} per room per night)`,
    "",
    `Guest: ${guest.first_name} ${guest.last_name}`,
    `Email: ${guest.email}`,
    `Phone: ${guest.phone}`,
    guest.special_requests ? `Special requests: ${guest.special_requests}` : "",
  ]
    .filter((l) => l !== undefined)
    .join("\n");

  await Promise.all([
    sendEmail({ to: notify, subject: `New booking request ${reference} · ${prop.name}`, text: `${summary}\n\nManage it in the admin: /admin/bookings`, replyTo: guest.email }),
    sendEmail({
      to: guest.email,
      subject: `We received your booking request ${reference}`,
      text: `Hi ${guest.first_name},\n\nThank you for your request to stay at ${prop.name}. Our reservations team will confirm availability and payment details by email within one business day.\n\n${summary}\n\nStealth Land Corp`,
    }),
  ]);

  return NextResponse.json({ ok: true, reference, total, nights });
}
