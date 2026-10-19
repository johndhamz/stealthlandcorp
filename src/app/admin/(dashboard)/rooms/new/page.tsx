import { createSessionClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { RoomForm } from "../RoomForm";

export default async function NewRoomPage() {
  const supabase = await createSessionClient();
  const { data: hotels } = await supabase.from("properties").select("id, name").eq("bookable", true).order("name");
  return (
    <>
      <PageHeader title="Add room" />
      <RoomForm hotels={hotels ?? []} />
    </>
  );
}
