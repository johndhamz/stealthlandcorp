"use client";

import { useActionState } from "react";
import { deleteInquiry, updateInquiry } from "@/lib/admin/actions/inquiries";
import type { ActionState } from "@/lib/admin/actions/auth";
import { Alert, Field, input } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

interface Props {
  inquiry: { id: string; status: string; notes: string; assigned_to: string | null; updated_at: string };
  admins: { id: string; email: string; full_name: string | null }[];
}

export function InquiryForm({ inquiry, admins }: Props) {
  const [state, action] = useActionState<ActionState, FormData>(updateInquiry, {});
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={inquiry.id} />
      <Alert state={state} />
      {/* Remount the fields whenever the server sends fresh data, so a save never shows stale values. */}
      <div key={inquiry.updated_at} className="space-y-4">
      <Field id="status" label="Status">
        <select id="status" name="status" defaultValue={inquiry.status} className={input}>
          {["new", "contacted", "qualified", "closed"].map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
        </select>
      </Field>
      <Field id="assigned_to" label="Assigned to">
        <select id="assigned_to" name="assigned_to" defaultValue={inquiry.assigned_to ?? ""} className={input}>
          <option value="">Unassigned</option>
          {admins.map((a) => <option key={a.id} value={a.id}>{a.full_name || a.email}</option>)}
        </select>
      </Field>
      <Field id="notes" label="Internal notes">
        <textarea id="notes" name="notes" rows={6} defaultValue={inquiry.notes} className={input} placeholder="Call summary, next steps, preferred unit..." />
      </Field>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <SubmitButton>Save</SubmitButton>
        <ConfirmButton action={() => deleteInquiry(inquiry.id)}>Delete</ConfirmButton>
      </div>
    </form>
  );
}
