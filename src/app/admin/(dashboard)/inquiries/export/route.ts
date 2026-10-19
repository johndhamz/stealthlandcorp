import { getCurrentUser } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";

const cols = ["created_at", "status", "first_name", "last_name", "email", "phone_number", "country", "place", "project_interest", "where_did_find_about_us", "source", "agree_newsletter", "message", "notes"] as const;

const csv = (v: unknown) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return new Response("Unauthorized", { status: 401 });
  const supabase = await createSessionClient();
  const { data, error } = await supabase.from("inquiries").select(cols.join(",")).order("created_at", { ascending: false });
  if (error) return new Response(error.message, { status: 500 });
  const rows = (data ?? []) as unknown as Record<string, unknown>[];
  const body = [cols.join(","), ...rows.map((r) => cols.map((c) => csv(r[c])).join(","))].join("\n");
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="inquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
