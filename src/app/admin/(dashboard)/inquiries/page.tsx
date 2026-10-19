import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Download } from "lucide-react";
import { createSessionClient } from "@/lib/supabase/server";
import { EmptyState, PageHeader, StatusBadge, Table, Td, Th, btn, formatDate } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

const STATUSES = ["new", "contacted", "qualified", "closed"] as const;

export default function InquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  return (
    <>
      <PageHeader title="Inquiries" description="Every submission from the website forms." actions={/* file download, not a page */ /* eslint-disable-next-line @next/next/no-html-link-for-pages */
        <a href="/admin/inquiries/export" className={btn.secondary}><Download className="size-4" /> Export CSV</a>} />
      <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-navy-900/10" />}>
        <List searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function List({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const { status = "", q = "" } = await searchParams;
  const supabase = await createSessionClient();
  let query = supabase.from("inquiries").select("id, created_at, first_name, last_name, email, phone_number, project_interest, source, status").order("created_at", { ascending: false }).limit(200);
  if (status && (STATUSES as readonly string[]).includes(status)) query = query.eq("status", status);
  if (q) query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%,project_interest.ilike.%${q}%`);
  const { data } = await query;

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Chip href="/admin/inquiries" active={!status}>All</Chip>
          {STATUSES.map((s) => <Chip key={s} href={`/admin/inquiries?status=${s}`} active={status === s}>{s}</Chip>)}
        </div>
        <form className="flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="Search name, email, project" className="field field-light !py-2 sm:w-64" />
          <button type="submit" className={btn.secondary}>Search</button>
        </form>
      </div>
      {data?.length ? (
        <Table>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Name</Th>
              <Th>Contact</Th>
              <Th>Project</Th>
              <Th>Source</Th>
              <Th>Status</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.id} className="hover:bg-cream/60">
                <Td className="whitespace-nowrap text-navy-600">{formatDate(r.created_at)}</Td>
                <Td className="font-medium">{r.first_name} {r.last_name}</Td>
                <Td><span className="block">{r.email}</span><span className="block text-xs text-navy-600">{r.phone_number}</span></Td>
                <Td>{r.project_interest || "—"}</Td>
                <Td className="text-navy-600">{r.source}</Td>
                <Td><StatusBadge status={r.status} /></Td>
                <Td className="text-right"><Link href={`/admin/inquiries/${r.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-navy-900 hover:underline">Open <ArrowRight className="size-3.5" /></Link></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyState title="No inquiries found" text={status || q ? "Try a different filter." : "Submissions from the website forms will appear here."} />
      )}
    </>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={cn("rounded-full border px-3.5 py-1.5 text-xs font-semibold capitalize transition", active ? "border-navy-900 bg-navy-900 text-white" : "border-navy-900/15 bg-white text-navy-700 hover:border-navy-900/40")}>
      {children}
    </Link>
  );
}
