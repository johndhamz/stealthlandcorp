import { createSessionClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { ActivityForm } from "../ActivityForm";

export default async function NewActivityPage() {
  const supabase = await createSessionClient();
  const { data: hotels } = await supabase.from("properties").select("id, name").eq("bookable", true).order("name");
  return (
    <>
      <PageHeader title="Add tour" />
      <ActivityForm hotels={hotels ?? []} />
    </>
  );
}
