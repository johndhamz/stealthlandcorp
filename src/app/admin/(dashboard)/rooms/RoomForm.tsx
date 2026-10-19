"use client";

import { useActionState } from "react";
import Link from "next/link";
import { deleteRoom, saveRoom } from "@/lib/admin/actions/rooms";
import type { ActionState } from "@/lib/admin/actions/auth";
import type { RoomType } from "@/lib/data/mappers";
import { Alert, Card, Field, btn, input } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { ImageUploader } from "@/components/admin/ImageUploader";

export function RoomForm({ room, hotels }: { room?: RoomType; hotels: { id: string; name: string }[] }) {
  const [state, action] = useActionState<ActionState, FormData>(saveRoom, {});
  return (
    <form action={action} className="space-y-6">
      {room && <input type="hidden" name="id" value={room.id} />}
      <Alert state={state} />
      {hotels.length === 0 && <p className="rounded-md border border-gold-500/40 bg-gold-500/10 px-4 py-3 text-sm text-navy-900">No bookable hotels yet. Edit a Hotel & Leisure property and tick “Accept booking requests” first.</p>}
      <Card title="Room details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="property_id" label="Hotel">
            <select id="property_id" name="property_id" defaultValue={room?.propertyId ?? hotels[0]?.id ?? ""} className={input}>
              {hotels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </Field>
          <Field id="name" label="Room name"><input id="name" name="name" required defaultValue={room?.name} className={input} placeholder="Deluxe Room" /></Field>
          <Field id="slug" label="Slug" hint="Leave blank to generate from the name."><input id="slug" name="slug" defaultValue={room?.slug} className={input} /></Field>
          <Field id="nightly_rate" label="Nightly rate (PHP)"><input id="nightly_rate" name="nightly_rate" type="number" min={0} step={1} required defaultValue={room?.nightlyRate} className={input} /></Field>
          <Field id="max_guests" label="Max guests per room"><input id="max_guests" name="max_guests" type="number" min={1} required defaultValue={room?.maxGuests ?? 2} className={input} /></Field>
          <Field id="quantity" label="Number of rooms of this type"><input id="quantity" name="quantity" type="number" min={0} defaultValue={room?.quantity ?? 1} className={input} /></Field>
          <Field id="beds" label="Beds"><input id="beds" name="beds" defaultValue={room?.beds} className={input} placeholder="1 king or 2 twin beds" /></Field>
          <Field id="size_sqm" label="Size (sqm)"><input id="size_sqm" name="size_sqm" type="number" min={0} step={0.5} defaultValue={room?.sizeSqm ?? ""} className={input} /></Field>
          <Field id="sort_order" label="Sort order"><input id="sort_order" name="sort_order" type="number" defaultValue={room?.sortOrder ?? 0} className={input} /></Field>
        </div>
        <div className="mt-4 space-y-4">
          <Field id="description" label="Description"><textarea id="description" name="description" rows={3} defaultValue={room?.description} className={input} /></Field>
          <Field id="amenities" label="Amenities" hint="One per line."><textarea id="amenities" name="amenities" rows={5} defaultValue={room?.amenities.join("\n")} className={input} /></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={room ? room.published : true} className="size-4 accent-gold-500" /> Published on the site</label>
        </div>
      </Card>
      <Card title="Photos">
        <ImageUploader name="images" label="Room photos" initial={room?.images ?? []} folder={`rooms/${room?.slug || "new"}`} hint="First photo is shown on the room card." />
      </Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <SubmitButton variant="gold">{room ? "Save changes" : "Add room"}</SubmitButton>
          <Link href="/admin/rooms" className={btn.secondary}>Cancel</Link>
        </div>
        {room && <ConfirmButton action={() => deleteRoom(room.id)}>Delete room</ConfirmButton>}
      </div>
    </form>
  );
}
