/** Shared booking helpers (safe for client and server). */
export const BOOKING_STATUSES = ["requested", "confirmed", "declined", "cancelled", "completed"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const bookingStatusLabels: Record<BookingStatus, string> = {
  requested: "Requested",
  confirmed: "Confirmed",
  declined: "Declined",
  cancelled: "Cancelled",
  completed: "Completed",
};

export function nightsBetween(checkIn: string, checkOut: string) {
  const a = new Date(`${checkIn}T00:00:00Z`).getTime();
  const b = new Date(`${checkOut}T00:00:00Z`).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 0;
  return Math.round((b - a) / 86_400_000);
}

export function isIsoDate(s: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(new Date(`${s}T00:00:00Z`).getTime());
}

export function makeReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `NPR-${out}`;
}

export function formatPhp(n: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(n);
}

export function formatStayDate(iso: string) {
  return new Intl.DateTimeFormat("en-PH", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
}

export const BOOKING_KINDS = ["stay", "activity"] as const;
export type BookingKind = (typeof BOOKING_KINDS)[number];

/** Price of one activity line: per-person rates multiply by head count, group rates are flat. */
export function activitySubtotal(price: number, priceUnit: "person" | "group", pax: number) {
  return priceUnit === "group" ? price : price * Math.max(pax, 0);
}

export function priceUnitLabel(priceUnit: "person" | "group") {
  return priceUnit === "group" ? "per boat" : "per person";
}
