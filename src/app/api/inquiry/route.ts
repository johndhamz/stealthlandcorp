import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createAdminClient } from "@/lib/supabase/server";

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
const FAIL = { message: "We could not send your inquiry right now. Please email admin@stealthlandcorp.com." };

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  if (body.website) return NextResponse.json({ ok: true }); // honeypot

  const record = {
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

  const missing = (["first_name", "last_name", "email", "phone_number", "message"] as const).filter((k) => !record[k]);
  if (missing.length || !record.agree_terms || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email)) {
    return NextResponse.json({ message: "Please complete all required fields." }, { status: 422 });
  }

  let saved = false;
  if (isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { error } = await createAdminClient().from("inquiries").insert(record);
      if (error) console.error("Inquiry insert failed", error.message);
      else saved = true;
    } catch (err) {
      console.error("Inquiry insert error", err);
    }
  }

  let forwarded = false;
  const forwardUrl = process.env.INQUIRY_FORWARD_URL;
  if (forwardUrl) {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (process.env.INQUIRY_FORWARD_KEY) headers.Authorization = `Bearer ${process.env.INQUIRY_FORWARD_KEY}`;
    try {
      const res = await fetch(forwardUrl, { method: "POST", headers, body: JSON.stringify(record), signal: AbortSignal.timeout(15_000) });
      forwarded = res.ok;
      if (!res.ok) console.error("Inquiry forward failed", res.status, (await res.text().catch(() => "")).slice(0, 300));
    } catch (err) {
      console.error("Inquiry forward error", err);
    }
  }

  if (!saved && !forwarded) return NextResponse.json(FAIL, { status: 502 });
  return NextResponse.json({ ok: true });
}
