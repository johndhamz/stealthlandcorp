import { notFound } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";
import { rowToRoomType, type RoomTypeRow } from "@/lib/data/mappers";
import { PageHeader } from "@/components/admin/ui";
import { RoomForm } from "../RoomForm";

export default async function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSessionClient();
  const [{ data }, { data: hotels }] = await Promise.all([
    supabase.from("room_types").select("*").eq("id", id).maybeSingle(),
    supabase.from("properties").select("id, name").eq("bookable", true).order("name"),
  ]);
  if (!data) notFound();
  const room = rowToRoomType(data as RoomTypeRow);
  return (
    <>
      <PageHeader title={room.name} />
      <RoomForm room={room} hotels={hotels ?? []} />
    </>
  );
}
