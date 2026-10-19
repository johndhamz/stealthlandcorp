"use client";

import { useActionState } from "react";
import Link from "next/link";
import { saveProperty, deleteProperty } from "@/lib/admin/actions/properties";
import type { ActionState } from "@/lib/admin/actions/auth";
import { sectors, statusLabels } from "@/data/properties";
import type { AdminProperty } from "@/lib/data/mappers";
import { Alert, Card, Field, btn, input } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { ImageUploader } from "@/components/admin/ImageUploader";

export function PropertyForm({ property }: { property?: AdminProperty }) {
  const [state, action] = useActionState<ActionState, FormData>(saveProperty, {});
  const p = property;
  const folder = p?.slug || "new";

  return (
    <form action={action} className="space-y-6">
      {p && <input type="hidden" name="id" value={p.id} />}
      <Alert state={state} />

      <Card title="Basics">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="name" label="Name"><input id="name" name="name" required defaultValue={p?.name} className={input} /></Field>
          <Field id="slug" label="URL slug" hint="Leave blank to generate from the name."><input id="slug" name="slug" defaultValue={p?.slug} className={input} placeholder="alpha-tower" /></Field>
          <Field id="tagline" label="Tagline"><input id="tagline" name="tagline" defaultValue={p?.tagline} className={input} /></Field>
          <Field id="developer" label="Developer"><input id="developer" name="developer" defaultValue={p?.developer ?? "Stealth Land Corp"} className={input} /></Field>
          <Field id="sector" label="Sector">
            <select id="sector" name="sector" defaultValue={p?.sector ?? "residential"} className={input}>
              {Object.entries(sectors).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
            </select>
          </Field>
          <Field id="status" label="Status">
            <select id="status" name="status" defaultValue={p?.status ?? "pre-selling"} className={input}>
              {Object.entries(statusLabels).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </Field>
          <Field id="region" label="Region" hint="Visayas, Palawan, Metro Manila, Central & Southern Luzon"><input id="region" name="region" defaultValue={p?.region} className={input} /></Field>
          <Field id="location" label="Location"><input id="location" name="location" defaultValue={p?.location} className={input} placeholder="Cebu City, Cebu" /></Field>
          <Field id="sort_order" label="Sort order" hint="Lower numbers appear first."><input id="sort_order" name="sort_order" type="number" defaultValue={p?.sortOrder ?? 0} className={input} /></Field>
        </div>
        <div className="mt-5 flex flex-wrap gap-6 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" name="published" defaultChecked={p ? p.published : true} className="size-4 accent-gold-500" /> Published on the site</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="featured" defaultChecked={p?.featured} className="size-4 accent-gold-500" /> Featured on the home page</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="mortgage_calculator" defaultChecked={p?.mortgageCalculator} className="size-4 accent-gold-500" /> Show mortgage calculator</label>
        </div>
      </Card>

      <Card title="Images" description="The first gallery image is used as the cover unless you set one explicitly.">
        <div className="space-y-6">
          <ImageUploader name="gallery" label="Gallery" initial={p?.gallery ?? []} folder={folder} hint="Drag order with the arrows. JPG, PNG or WebP up to 15 MB." />
          <ImageUploader name="card_image" label="Cover image (optional override)" initial={p?.cardImage ? [p.cardImage] : []} folder={folder} single />
          <ImageUploader name="hero_images" label="Hero slideshow (optional)" initial={p?.heroImages ?? []} folder={folder} hint="Defaults to the first four gallery images." />
        </div>
      </Card>

      <Card title="Copy">
        <div className="space-y-4">
          <Field id="summary" label="Short summary" hint="Shown on cards and in search results."><textarea id="summary" name="summary" rows={2} defaultValue={p?.summary} className={input} /></Field>
          <Field id="description" label="Description" hint="Separate paragraphs with a blank line."><textarea id="description" name="description" rows={6} defaultValue={p?.description.join("\n\n")} className={input} /></Field>
          <Field id="highlight_title" label="Highlight heading"><input id="highlight_title" name="highlight_title" defaultValue={p?.highlightTitle} className={input} placeholder="Pursue your dream home at ..." /></Field>
          <Field id="highlights" label="Highlight paragraphs" hint="Separate paragraphs with a blank line."><textarea id="highlights" name="highlights" rows={5} defaultValue={p?.highlights.join("\n\n")} className={input} /></Field>
          <Field id="amenities" label="Amenities" hint="One per line."><textarea id="amenities" name="amenities" rows={5} defaultValue={p?.amenities.join("\n")} className={input} /></Field>
        </div>
      </Card>

      <Card title="Hotel booking" description="For Hotel & Leisure properties. Room types and rates are managed under Rooms.">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="bookable" defaultChecked={p?.bookable} className="size-4 accent-gold-500" /> Accept booking requests on this property&apos;s page</label>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field id="check_in_time" label="Check-in time"><input id="check_in_time" name="check_in_time" defaultValue={p?.checkInTime ?? "2:00 PM"} className={input} /></Field>
          <Field id="check_out_time" label="Check-out time"><input id="check_out_time" name="check_out_time" defaultValue={p?.checkOutTime ?? "12:00 NN"} className={input} /></Field>
          <div className="sm:col-span-3"><Field id="booking_notes" label="Booking notes" hint="Shown under the indicative total on the booking form."><textarea id="booking_notes" name="booking_notes" rows={2} defaultValue={p?.bookingNotes} className={input} /></Field></div>
        </div>
      </Card>

      <Card title="Units, videos and redirects">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field id="unit_types" label="Unit types" hint="One per line as Label | sqm"><textarea id="unit_types" name="unit_types" rows={4} defaultValue={p?.unitTypes?.map((u) => `${u.label} | ${u.sqm}`).join("\n")} className={input} placeholder={"Studio | 32\n1 Bedroom | 40"} /></Field>
          <Field id="video_ids" label="YouTube videos" hint="One link or video ID per line."><textarea id="video_ids" name="video_ids" rows={4} defaultValue={p?.videoIds?.join("\n")} className={input} /></Field>
          <Field id="legacy_paths" label="Old URLs to redirect" hint="One path per line, applied on next deploy."><textarea id="legacy_paths" name="legacy_paths" rows={4} defaultValue={p?.legacyPaths?.join("\n")} className={input} /></Field>
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <SubmitButton variant="gold">{p ? "Save changes" : "Create property"}</SubmitButton>
          <Link href="/admin/properties" className={btn.secondary}>Cancel</Link>
        </div>
        {p && <ConfirmButton action={() => deleteProperty(p.id)}>Delete property</ConfirmButton>}
      </div>
    </form>
  );
}
