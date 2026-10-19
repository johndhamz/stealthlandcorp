import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createSessionClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { AgentForm, type AgentRecord } from "../AgentForm";

export default async function EditAgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSessionClient();
  const { data } = await supabase.from("agents").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return (
    <>
      <Link href="/admin/agents" className="mb-4 inline-flex items-center gap-1 text-sm text-navy-600 hover:text-navy-900"><ArrowLeft className="size-4" /> All agents</Link>
      <PageHeader title={data.name} description={data.email} />
      <AgentForm agent={data as AgentRecord} />
    </>
  );
}
