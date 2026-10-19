"use client";

import { useActionState } from "react";
import { deleteBooking, updateBooking } from "@/lib/admin/actions/bookings";
import type { ActionState } from "@/lib/admin/actions/auth";
import { BOOKING_STATUSES, bookingStatusLabels } from "@/lib/bookings";
import { Alert, Field, input } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export function BookingForm({ booking }: { booking: { id: string; status: string; notes: string; total: number; updated_at: string } }) {
  const [state, action] = useActionState<ActionState, FormData>(updateBooking, {});
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={booking.id} />
      <Alert state={state} />
      <div key={booking.updated_at} className="space-y-4">
        <Field id="status" label="Status">
          <select id="status" name="status" defaultValue={booking.status} className={input}>
            {BOOKING_STATUSES.map((s) => <option key={s} value={s}>{bookingStatusLabels[s]}</option>)}
          </select>
        </Field>
        <Field id="total" label="Agreed total (PHP)" hint="Adjust if you quoted a different price."><input id="total" name="total" type="number" min={0} step={1} defaultValue={booking.total} className={input} /></Field>
        <Field id="notes" label="Internal notes"><textarea id="notes" name="notes" rows={6} defaultValue={booking.notes} className={input} placeholder="Payment received, room assigned, airport pickup..." /></Field>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <SubmitButton>Save</SubmitButton>
        <ConfirmButton action={() => deleteBooking(booking.id)}>Delete</ConfirmButton>
      </div>
    </form>
  );
}
