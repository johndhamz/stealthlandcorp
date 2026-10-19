"use client";

import { useActionState } from "react";
import Link from "next/link";
import { deleteActivity, saveActivity } from "@/lib/admin/actions/activities";
import type { ActionState } from "@/lib/admin/actions/auth";
import type { Activity } from "@/lib/data/mappers";
import { Alert, Card, Field, btn, input } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { ImageUploader } from "@/components/admin/ImageUploader";

export function ActivityForm({ activity, hotels }: { activity?: Activity; hotels: { id: string; name: string }[] }) {
  const [state, action] = useActionState<ActionState, FormData>(saveActivity, {});
  return (
    <form action={action} className="space-y-6">
      {activity && <input type="hidden" name="id" value={activity.id} />}
      <Alert state={state} />
      {hotels.length === 0 && <p className="rounded-md border border-gold-500/40 bg-gold-500/10 px-4 py-3 text-sm text-navy-900">No bookable resorts yet. Edit a Hotel & Leisure property and tick “Accept booking requests” first.</p>}
      <Card title="Tour details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="property_id" label="Resort">
            <select id="property_id" name="property_id" defaultValue={activity?.propertyId ?? hotels[0]?.id ?? ""} className={input}>
              {hotels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </Field>
          <Field id="name" label="Tour name"><input id="name" name="name" required defaultValue={activity?.name} className={input} placeholder="Sandbar Trio Island Hopping" /></Field>
          <Field id="category" label="Section" hint="Tours with the same section name are grouped together on the page."><input id="category" name="category" defaultValue={activity?.category} className={input} placeholder="Island hopping from Roxas" /></Field>
          <Field id="tagline" label="Tagline" hint="One line shown under the name on the card."><input id="tagline" name="tagline" defaultValue={activity?.tagline} className={input} placeholder="Madles, Pungtod and Purao in one day" /></Field>
          <Field id="slug" label="Slug" hint="Leave blank to generate from the name."><input id="slug" name="slug" defaultValue={activity?.slug} className={input} /></Field>
          <Field id="price" label="Price (PHP)"><input id="price" name="price" type="number" min={0} step={1} required defaultValue={activity?.price} className={input} /></Field>
          <Field id="price_unit" label="Priced per">
            <select id="price_unit" name="price_unit" defaultValue={activity?.priceUnit ?? "person"} className={input}>
              <option value="person">Person</option>
              <option value="group">Group / boat (flat rate)</option>
            </select>
          </Field>
          <Field id="min_pax" label="Minimum guests"><input id="min_pax" name="min_pax" type="number" min={1} required defaultValue={activity?.minPax ?? 1} className={input} /></Field>
          <Field id="max_pax" label="Maximum guests"><input id="max_pax" name="max_pax" type="number" min={1} required defaultValue={activity?.maxPax ?? 10} className={input} /></Field>
          <Field id="duration" label="Duration"><input id="duration" name="duration" defaultValue={activity?.duration} className={input} placeholder="Full day · about 7 hours" /></Field>
          <Field id="schedule" label="Schedule"><input id="schedule" name="schedule" defaultValue={activity?.schedule} className={input} placeholder="Departs 8:00 AM, returns 3:00 PM" /></Field>
          <Field id="sort_order" label="Sort order"><input id="sort_order" name="sort_order" type="number" defaultValue={activity?.sortOrder ?? 0} className={input} /></Field>
        </div>
        <div className="mt-4 space-y-4">
          <Field id="description" label="Description"><textarea id="description" name="description" rows={3} defaultValue={activity?.description} className={input} /></Field>
          <Field id="inclusions" label="Inclusions" hint="One per line."><textarea id="inclusions" name="inclusions" rows={5} defaultValue={activity?.inclusions.join("\n")} className={input} /></Field>
          <Field id="notes" label="Good to know" hint="What to bring, weather policy, age limits."><textarea id="notes" name="notes" rows={2} defaultValue={activity?.notes} className={input} /></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={activity ? activity.published : true} className="size-4 accent-gold-500" /> Published on the site</label>
        </div>
      </Card>
      <Card title="Photos">
        <ImageUploader name="images" label="Tour photos" initial={activity?.images ?? []} folder={`activities/${activity?.slug || "new"}`} hint="First photo is shown on the tour card." />
      </Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <SubmitButton variant="gold">{activity ? "Save changes" : "Add tour"}</SubmitButton>
          <Link href="/admin/activities" className={btn.secondary}>Cancel</Link>
        </div>
        {activity && <ConfirmButton action={() => deleteActivity(activity.id)}>Delete tour</ConfirmButton>}
      </div>
    </form>
  );
}
