import { notFound } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";
import { rowToActivity, type ActivityRow } from "@/lib/data/mappers";
import { PageHeader } from "@/components/admin/ui";
import { ActivityForm } from "../ActivityForm";

export default async function EditActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSessionClient();
  const [{ data }, { data: hotels }] = await Promise.all([
    supabase.from("activities").select("*").eq("id", id).maybeSingle(),
    supabase.from("properties").select("id, name").eq("bookable", true).order("name"),
  ]);
  if (!data) notFound();
  const activity = rowToActivity(data as ActivityRow);
  return (
    <>
      <PageHeader title={activity.name} />
      <ActivityForm activity={activity} hotels={hotels ?? []} />
    </>
  );
}
