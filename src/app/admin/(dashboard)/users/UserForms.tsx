"use client";

import { useActionState, useState } from "react";
import { createUser, deleteUser, resetUserPassword, updateUserRole } from "@/lib/admin/actions/users";
import type { ActionState } from "@/lib/admin/actions/auth";
import { Alert, Badge, Field, Td, btn, input } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/SubmitButton";

export function CreateUserForm() {
  const [state, action] = useActionState<ActionState, FormData>(createUser, {});
  return (
    <form action={action} className="space-y-4">
      <Alert state={state} />
      <Field id="full_name" label="Full name"><input id="full_name" name="full_name" className={input} /></Field>
      <Field id="new_email" label="Email"><input id="new_email" name="email" type="email" required className={input} /></Field>
      <Field id="new_password" label="Password" hint="At least 8 characters."><input id="new_password" name="password" type="text" minLength={8} required className={input} /></Field>
      <Field id="role" label="Role">
        <select id="role" name="role" defaultValue="admin" className={input}>
          <option value="admin">Admin</option>
          <option value="agent">Agent</option>
        </select>
      </Field>
      <SubmitButton variant="gold">Create user</SubmitButton>
    </form>
  );
}

export function UserRow({ user, isSelf, createdLabel }: { user: { id: string; email: string; full_name: string | null; role: string }; isSelf: boolean; createdLabel: string }) {
  const [roleState, roleAction] = useActionState<ActionState, FormData>(updateUserRole, {});
  const [pwState, pwAction] = useActionState<ActionState, FormData>(resetUserPassword, {});
  const [delState, delAction] = useActionState<ActionState, FormData>(deleteUser, {});
  const [open, setOpen] = useState<"pw" | "del" | null>(null);
  const msg = roleState.error || roleState.success || pwState.error || pwState.success || delState.error || delState.success;

  return (
    <tr className="align-top hover:bg-cream/60">
      <Td>
        <span className="font-medium">{user.full_name || "—"}</span>
        {isSelf && <Badge tone="gold">You</Badge>}
        <span className="block text-xs text-navy-600">{user.email}</span>
        {msg && <span className={`mt-1 block text-xs ${roleState.error || pwState.error || delState.error ? "text-red-600" : "text-emerald-700"}`}>{msg}</span>}
      </Td>
      <Td>
        <form action={roleAction} className="flex items-center gap-2">
          <input type="hidden" name="id" value={user.id} />
          <select name="role" defaultValue={user.role} className={`${input} !w-auto !py-1.5 !text-xs`} disabled={isSelf}>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
          </select>
          {!isSelf && <SubmitButton variant="secondary" className="!py-1.5 !text-xs">Update</SubmitButton>}
        </form>
      </Td>
      <Td className="whitespace-nowrap text-navy-600">{createdLabel}</Td>
      <Td className="text-right">
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <button type="button" onClick={() => setOpen(open === "pw" ? null : "pw")} className={`${btn.secondary} !py-1.5 !text-xs`}>Reset password</button>
            {!isSelf && <button type="button" onClick={() => setOpen(open === "del" ? null : "del")} className={`${btn.danger} !py-1.5 !text-xs`}>Delete</button>}
          </div>
          {open === "pw" && (
            <form action={pwAction} className="flex gap-2">
              <input type="hidden" name="id" value={user.id} />
              <input name="password" type="text" minLength={8} required placeholder="New password" className={`${input} !w-44 !py-1.5 !text-xs`} />
              <SubmitButton className="!py-1.5 !text-xs">Set</SubmitButton>
            </form>
          )}
          {open === "del" && (
            <form action={delAction} className="flex items-center gap-2">
              <input type="hidden" name="id" value={user.id} />
              <span className="text-xs text-navy-600">Delete this user?</span>
              <SubmitButton variant="danger" className="!py-1.5 !text-xs">Confirm</SubmitButton>
            </form>
          )}
        </div>
      </Td>
    </tr>
  );
}
