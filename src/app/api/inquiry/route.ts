import { NextResponse } from "next/server";

/**
 * Forwards website inquiries to the Stealth Land backend.
 * Set INQUIRY_API_URL to override the destination; set INQUIRY_API_KEY to add a bearer token.
 */
const DEFAULT_ENDPOINT = "https://stlc-backend.onrender.com/api/v1/inquiry/property";

interface Payload {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
  country?: string;
  place?: string;
  project_interest?: string;
  project_interest_others?: string;
  where_did_find_about_us?: string;
  message?: string;
  agree_newsletter?: boolean;
  agree_terms?: boolean;
  variant?: string;
  website?: string; // honeypot
}

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  if (body.website) {
    // Honeypot filled in: silently accept.
    return NextResponse.json({ ok: true });
  }

  const payload = {
    first_name: str(body.first_name, 100),
    last_name: str(body.last_name, 100),
    phone_number: str(body.phone_number, 30),
    email: str(body.email, 200),
    country: str(body.country, 100),
    place: str(body.place, 100),
    project_interest: body.project_interest === "Others" ? str(body.project_interest_others, 200) : str(body.project_interest, 200),
    where_did_find_about_us: str(body.where_did_find_about_us, 100),
    message: str(body.message, 3000),
    agree_newsletter: Boolean(body.agree_newsletter),
    agree_terms: Boolean(body.agree_terms),
    source: str(body.variant, 30) || "website",
  };

  const missing = (["first_name", "last_name", "email", "phone_number", "message"] as const).filter((k) => !payload[k]);
  if (missing.length || !payload.agree_terms || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return NextResponse.json({ message: "Please complete all required fields." }, { status: 422 });
  }

  const endpoint = process.env.INQUIRY_API_URL || DEFAULT_ENDPOINT;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.INQUIRY_API_KEY) headers.Authorization = `Bearer ${process.env.INQUIRY_API_KEY}`;

  try {
    const res = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify(payload), signal: AbortSignal.timeout(15_000) });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("Inquiry forward failed", res.status, text.slice(0, 300));
      return NextResponse.json({ message: "We could not send your inquiry right now. Please email admin@stealthlandcorp.com." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Inquiry forward error", err);
    return NextResponse.json({ message: "We could not send your inquiry right now. Please email admin@stealthlandcorp.com." }, { status: 502 });
  }
}
