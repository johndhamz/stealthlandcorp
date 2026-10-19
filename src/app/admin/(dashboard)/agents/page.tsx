import { Suspense } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { createSessionClient } from "@/lib/supabase/server";
import { Badge, EmptyState, LinkButton, PageHeader, Table, Td, Th, formatDate } from "@/components/admin/ui";

export default function AgentsPage() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-navy-900/10" />}>
      <AgentsPageContent />
    </Suspense>
  );
}

async function AgentsPageContent() {
  const supabase = await createSessionClient();
  const { data } = await supabase.from("agents").select("id, name, email, phone, company, territory, status, user_id, created_at").order("created_at", { ascending: false });
  return (
    <>
      <PageHeader title="Agents" description="Accredited agents and brokers. Give an agent a login to let them sign in." actions={<LinkButton href="/admin/agents/new" variant="gold">Add agent</LinkButton>} />
      {data?.length ? (
        <Table>
          <thead>
            <tr><Th>Agent</Th><Th>Company</Th><Th>Territory</Th><Th>Status</Th><Th>Login</Th><Th>Added</Th><Th /></tr>
          </thead>
          <tbody>
            {data.map((a) => (
              <tr key={a.id} className="hover:bg-cream/60">
                <Td><span className="font-medium">{a.name}</span><span className="block text-xs text-navy-600">{a.email}{a.phone ? ` · ${a.phone}` : ""}</span></Td>
                <Td>{a.company || "—"}</Td>
                <Td>{a.territory || "—"}</Td>
                <Td><Badge tone={a.status === "accredited" ? "green" : a.status === "pending" ? "gold" : "neutral"}>{a.status}</Badge></Td>
                <Td>{a.user_id ? <Badge tone="blue">Active</Badge> : <span className="text-xs text-navy-600">None</span>}</Td>
                <Td className="whitespace-nowrap text-navy-600">{formatDate(a.created_at)}</Td>
                <Td className="text-right"><Link href={`/admin/agents/${a.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-navy-900 hover:underline"><Pencil className="size-3.5" /> Edit</Link></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyState title="No agents yet" text="Add agents manually, or review applications that arrive through the Agents page form in Inquiries." action={<LinkButton href="/admin/agents/new" variant="gold">Add agent</LinkButton>} />
      )}
    </>
  );
}
