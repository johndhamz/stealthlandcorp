import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createAdminClient } from "@/lib/supabase/server";
import { activitySubtotal, isIsoDate, makeReference, nightsBetween, formatPhp, formatStayDate, priceUnitLabel } from "@/lib/bookings";
import { sendEmail } from "@/lib/email";

interface ActivityInput {
  activity_id?: string;
  pax?: number;
  date?: string;
}

interface Payload {
  kind?: "stay" | "activity";
  property_slug?: string;
  room_type_id?: string;
  check_in?: string;
  check_out?: string;
  tour_date?: string;
  guests?: number;
  rooms?: number;
  activities?: ActivityInput[];
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  special_requests?: string;
  agree_terms?: boolean;
  website?: string; // honeypot
}

interface ActivityRowLite {
  id: string;
  name: string;
  price: number;
  price_unit: "person" | "group";
  min_pax: number;
  max_pax: number;
  published: boolean;
  property_id: string;
}

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const int = (v: unknown, fallback: number) => (Number.isInteger(Number(v)) && Number(v) > 0 ? Number(v) : fallback);
const fail = (message: string, status = 422) => NextResponse.json({ message }, { status });

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return fail("Invalid request body.", 400);
  }
  if (body.website) return NextResponse.json({ ok: true, reference: makeReference() });

  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return fail("Online booking requests are not available right now. Please email admin@stealthlandcorp.com.", 503);
  }

  const kind = body.kind === "activity" ? "activity" : "stay";
  const propertySlug = str(body.property_slug, 120);
  const guest = {
    first_name: str(body.first_name, 100),
    last_name: str(body.last_name, 100),
    email: str(body.email, 200),
    phone: str(body.phone, 30),
    special_requests: str(body.special_requests, 2000),
  };
  if (!guest.first_name || !guest.last_name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email) || !guest.phone) {
    return fail("Please complete your name, email and phone number.");
  }
  if (!body.agree_terms) return fail("Please accept the Privacy Policy and Terms of Use.");

  const today = new Date().toISOString().slice(0, 10);
  const admin = createAdminClient();

  // --- Stay details (room request) or tour date (activity-only request) ---
  interface RoomLite { id: string; name: string; max_guests: number; nightly_rate: number; property_id: string }
  interface PropLite { id: string; slug: string; name: string; bookable: boolean }
  let checkIn: string;
  let checkOut: string;
  let nights = 0;
  let guests = int(body.guests, 0);
  let rooms = 0;
  let room: RoomLite | null = null;
  let prop: PropLite;

  if (kind === "stay") {
    checkIn = str(body.check_in, 10);
    checkOut = str(body.check_out, 10);
    rooms = int(body.rooms, 1);
    if (!isIsoDate(checkIn) || !isIsoDate(checkOut)) return fail("Choose valid check-in and check-out dates.");
    nights = nightsBetween(checkIn, checkOut);
    if (nights < 1 || nights > 60) return fail("Stays must be between 1 and 60 nights.");
    if (checkIn < today) return fail("Check-in date cannot be in the past.");
    if (!guests) return fail("Tell us how many guests are staying.");

    const { data } = await admin
      .from("room_types")
      .select("id, name, max_guests, nightly_rate, published, property_id, properties!inner(id, slug, name, bookable)")
      .eq("id", str(body.room_type_id, 60))
      .maybeSingle();
    const r = data as unknown as (RoomLite & { published: boolean; properties?: PropLite }) | null;
    if (!r || !r.published || !r.properties?.bookable || r.properties.slug !== propertySlug) return fail("That room is not available for booking requests.");
    if (guests > r.max_guests * rooms) return fail(`${r.name} sleeps up to ${r.max_guests} guests per room. Add another room or choose a larger room.`);
    room = r;
    prop = r.properties;
  } else {
    const tourDate = str(body.tour_date, 10);
    if (!isIsoDate(tourDate)) return fail("Choose a valid tour date.");
    if (tourDate < today) return fail("Tour date cannot be in the past.");
    checkIn = tourDate;
    checkOut = tourDate;
    const { data } = await admin.from("properties").select("id, slug, name, bookable").eq("slug", propertySlug).maybeSingle();
    const p = data as PropLite | null;
    if (!p?.bookable) return fail("That property is not accepting tour requests.");
    prop = p;
  }

  // --- Activities (add-ons for a stay, required for a tour-only request) ---
  const wanted = (Array.isArray(body.activities) ? body.activities : []).slice(0, 10);
  const ids = [...new Set(wanted.map((a) => str(a.activity_id, 60)).filter(Boolean))];
  if (kind === "activity" && ids.length === 0) return fail("Choose at least one tour.");
  const activityLines: { activity_id: string; activity_name: string; activity_date: string | null; pax: number; unit_price: number; price_unit: string; subtotal: number }[] = [];
  if (ids.length) {
    const { data } = await admin.from("activities").select("id, name, price, price_unit, min_pax, max_pax, published, property_id").in("id", ids);
    const byId = new Map(((data ?? []) as ActivityRowLite[]).map((a) => [a.id, a]));
    for (const input of wanted) {
      const a = byId.get(str(input.activity_id, 60));
      if (!a || !a.published || a.property_id !== prop.id) return fail("One of the selected tours is not available.");
      if (activityLines.some((l) => l.activity_id === a.id)) continue;
      const pax = int(input.pax, 0);
      if (pax < a.min_pax || pax > a.max_pax) return fail(`${a.name} takes ${a.min_pax === a.max_pax ? a.max_pax : `${a.min_pax} to ${a.max_pax}`} guests.`);
      let date = str(input.date, 10);
      if (date && !isIsoDate(date)) return fail(`Choose a valid date for ${a.name}.`);
      if (kind === "activity") date = checkIn;
      else if (date && (date < checkIn || date >= checkOut)) return fail(`${a.name} must be scheduled between your check-in and the night before check-out.`);
      const unitPrice = Number(a.price);
      activityLines.push({ activity_id: a.id, activity_name: a.name, activity_date: date || null, pax, unit_price: unitPrice, price_unit: a.price_unit, subtotal: activitySubtotal(unitPrice, a.price_unit, pax) });
    }
  }
  if (kind === "activity") guests = Math.max(...activityLines.map((l) => l.pax));

  const nightlyRate = room ? Number(room.nightly_rate) : 0;
  const roomTotal = nightlyRate * nights * rooms;
  const activitiesTotal = activityLines.reduce((s, l) => s + l.subtotal, 0);
  const total = roomTotal + activitiesTotal;

  // --- Insert, retrying on a reference collision ---
  let reference = makeReference();
  let inserted: { id: string } | null = null;
  for (let attempt = 0; attempt < 3 && !inserted; attempt++) {
    const { data, error } = await admin
      .from("bookings")
      .insert({
        reference,
        kind,
        property_id: prop.id,
        room_type_id: room?.id ?? null,
        room_name: room?.name ?? "",
        check_in: checkIn,
        check_out: checkOut,
        guests,
        rooms,
        ...guest,
        nightly_rate: nightlyRate,
        activities_total: activitiesTotal,
        total,
        status: "requested",
      })
      .select("id")
      .maybeSingle();
    if (error) {
      if (error.code === "23505") {
        reference = makeReference();
        continue;
      }
      console.error("Booking insert failed", error.message);
      return fail("We could not save your request. Please try again or email admin@stealthlandcorp.com.", 500);
    }
    inserted = data;
  }
  if (!inserted) return fail("We could not save your request. Please try again.", 500);

  if (activityLines.length) {
    const { error } = await admin.from("booking_activities").insert(activityLines.map((l) => ({ ...l, booking_id: inserted.id })));
    if (error) console.error("Booking activities insert failed", error.message);
  }

  // --- Notifications ---
  const notify = process.env.BOOKING_NOTIFY_EMAIL || "admin@stealthlandcorp.com";
  const activityText = activityLines.map((l) => `Tour: ${l.activity_name} x ${l.pax} (${formatPhp(l.unit_price)} ${priceUnitLabel(l.price_unit as "person" | "group")})${l.activity_date ? ` on ${formatStayDate(l.activity_date)}` : ""} = ${formatPhp(l.subtotal)}`);
  const summary = [
    `Reference: ${reference}`,
    `Type: ${kind === "stay" ? "Room stay" : "Island hopping / day tour"}`,
    `Property: ${prop.name}`,
    ...(room
      ? [
          `Room: ${room.name} x ${rooms}`,
          `Check-in: ${formatStayDate(checkIn)}`,
          `Check-out: ${formatStayDate(checkOut)} (${nights} ${nights === 1 ? "night" : "nights"})`,
          `Guests: ${guests}`,
          `Room subtotal: ${formatPhp(roomTotal)} (${formatPhp(nightlyRate)} per room per night)`,
        ]
      : [`Tour date: ${formatStayDate(checkIn)}`, `Group size: ${guests}`]),
    ...activityText,
    `Indicative total: ${formatPhp(total)}`,
    "",
    `Guest: ${guest.first_name} ${guest.last_name}`,
    `Email: ${guest.email}`,
    `Phone: ${guest.phone}`,
    guest.special_requests ? `Notes: ${guest.special_requests}` : "",
  ].join("\n");

  const label = kind === "stay" ? "booking" : "tour";
  await Promise.all([
    sendEmail({ to: notify, subject: `New ${label} request ${reference} · ${prop.name}`, text: `${summary}\n\nManage it in the admin: /admin/bookings`, replyTo: guest.email }),
    sendEmail({
      to: guest.email,
      subject: `We received your ${label} request ${reference}`,
      text: `Hi ${guest.first_name},\n\nThank you for your ${label} request at ${prop.name}. Our team will confirm availability and payment details by email within one business day.\n\n${summary}\n\nStealth Land Corp`,
    }),
  ]);

  return NextResponse.json({ ok: true, reference, total, nights });
}
