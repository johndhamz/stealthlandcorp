import "server-only";

/**
 * Minimal email sender using Resend's REST API. Does nothing (but logs) when RESEND_API_KEY is unset,
 * so booking requests still succeed in environments without email configured.
 */
export async function sendEmail(input: { to: string | string[]; subject: string; text: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Stealth Land Corp <reservations@stealthlandcorp.com>";
  if (!key) {
    console.info("[email skipped: RESEND_API_KEY not set]", input.subject, "->", input.to);
    return { skipped: true };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: Array.isArray(input.to) ? input.to : [input.to], subject: input.subject, text: input.text, reply_to: input.replyTo }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    console.error("Email send failed", res.status, (await res.text().catch(() => "")).slice(0, 300));
    return { error: true };
  }
  return { ok: true };
}
