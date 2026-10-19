import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createSessionClient } from "@/lib/supabase/server";
import { Card, PageHeader, btn, formatDate } from "@/components/admin/ui";
import { InquiryForm } from "./InquiryForm";

export default async function InquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSessionClient();
  const [{ data: inq }, { data: admins }] = await Promise.all([
    supabase.from("inquiries").select("*").eq("id", id).maybeSingle(),
    supabase.from("profiles").select("id, email, full_name").order("email"),
  ]);
  if (!inq) notFound();

  const rows: [string, string][] = [
    ["Submitted", formatDate(inq.created_at)],
    ["Email", inq.email],
    ["Phone", inq.phone_number],
    ["Country", [inq.country, inq.place].filter(Boolean).join(" · ")],
    ["Project interest", inq.project_interest || "—"],
    ["Found us via", inq.where_did_find_about_us || "—"],
    ["Source form", inq.source],
    ["Newsletter", inq.agree_newsletter ? "Opted in" : "No"],
  ];

  return (
    <>
      <Link href="/admin/inquiries" className="mb-4 inline-flex items-center gap-1 text-sm text-navy-600 hover:text-navy-900"><ArrowLeft className="size-4" /> All inquiries</Link>
      <PageHeader title={`${inq.first_name} ${inq.last_name}`} description={inq.project_interest || "General inquiry"} actions={<a href={`mailto:${inq.email}?subject=${encodeURIComponent("Your inquiry with Stealth Land Corp")}`} className={btn.gold}>Reply by email</a>} />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6">
          <Card title="Message">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-navy-900">{inq.message}</p>
          </Card>
          <Card title="Details">
            <dl className="divide-y divide-navy-900/5 text-sm">
              {rows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-2.5">
                  <dt className="text-navy-600">{k}</dt>
                  <dd className="text-right font-medium text-navy-900">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
        <Card title="Follow-up" description="Track where this lead is and leave notes for the team.">
          <InquiryForm inquiry={{ id: inq.id, status: inq.status, notes: inq.notes, assigned_to: inq.assigned_to, updated_at: inq.updated_at }} admins={admins ?? []} />
        </Card>
      </div>
    </>
  );
}
