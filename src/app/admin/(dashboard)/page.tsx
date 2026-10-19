import Link from "next/link";
import { ArrowRight, Building2, CalendarCheck, Inbox, UserRound } from "lucide-react";
import { createSessionClient } from "@/lib/supabase/server";
import { Card, PageHeader, StatusBadge, Table, Td, Th, formatDate, LinkButton } from "@/components/admin/ui";

export default async function DashboardPage() {
  const supabase = await createSessionClient();
  const [props, pub, newInq, pendingAgents, newBookings, recent] = await Promise.all([
    supabase.from("properties").select("id", { count: "exact", head: true }),
    supabase.from("properties").select("id", { count: "exact", head: true }).eq("published", true),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("agents").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "requested"),
    supabase.from("inquiries").select("id, created_at, first_name, last_name, email, project_interest, status").order("created_at", { ascending: false }).limit(8),
  ]);

  const stats = [
    { label: "Properties", value: props.count ?? 0, sub: `${pub.count ?? 0} published`, icon: Building2, href: "/admin/properties" },
    { label: "New inquiries", value: newInq.count ?? 0, sub: "awaiting contact", icon: Inbox, href: "/admin/inquiries?status=new" },
    { label: "Pending agents", value: pendingAgents.count ?? 0, sub: "awaiting accreditation", icon: UserRound, href: "/admin/agents" },
    { label: "Booking requests", value: newBookings.count ?? 0, sub: "awaiting confirmation", icon: CalendarCheck, href: "/admin/bookings?status=requested" },
  ];

  return (
    <>
      <PageHeader title="Dashboard" description="Overview of listings, leads and the agent network." actions={<LinkButton href="/admin/properties/new" variant="gold">New property</LinkButton>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href} className="group rounded-xl border border-navy-900/10 bg-white p-5 shadow-sm transition hover:border-gold-500/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-navy-600">{s.label}</span>
                <Icon className="size-4 text-gold-600" />
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-navy-900">{s.value}</p>
              <p className="mt-1 text-xs text-navy-600">{s.sub}</p>
            </Link>
          );
        })}
      </div>

      <Card className="mt-8" title="Recent inquiries" description="The latest leads from every form on the site.">
        {recent.data?.length ? (
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Name</Th>
                <Th>Project</Th>
                <Th>Status</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {recent.data.map((r) => (
                <tr key={r.id} className="hover:bg-cream/60">
                  <Td className="whitespace-nowrap text-navy-600">{formatDate(r.created_at)}</Td>
                  <Td>
                    <span className="font-medium">{r.first_name} {r.last_name}</span>
                    <span className="block text-xs text-navy-600">{r.email}</span>
                  </Td>
                  <Td>{r.project_interest || "—"}</Td>
                  <Td><StatusBadge status={r.status} /></Td>
                  <Td className="text-right"><Link href={`/admin/inquiries/${r.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-navy-900 hover:underline">Open <ArrowRight className="size-3.5" /></Link></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-sm text-navy-600">No inquiries yet. Submissions from the website forms will appear here.</p>
        )}
      </Card>
    </>
  );
}
