"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createAgentLogin, deleteAgent, saveAgent } from "@/lib/admin/actions/agents";
import type { ActionState } from "@/lib/admin/actions/auth";
import { Alert, Card, Field, btn, input } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export interface AgentRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  territory: string;
  status: string;
  notes: string;
  user_id: string | null;
}

export function AgentForm({ agent }: { agent?: AgentRecord }) {
  const [state, action] = useActionState<ActionState, FormData>(saveAgent, {});
  const [loginState, loginAction] = useActionState<ActionState, FormData>(createAgentLogin, {});
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <form action={action} className="space-y-6">
        {agent && <input type="hidden" name="id" value={agent.id} />}
        <Alert state={state} />
        <Card title="Agent details">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="name" label="Full name"><input id="name" name="name" required defaultValue={agent?.name} className={input} /></Field>
            <Field id="email" label="Email"><input id="email" name="email" type="email" required defaultValue={agent?.email} className={input} /></Field>
            <Field id="phone" label="Phone"><input id="phone" name="phone" defaultValue={agent?.phone} className={input} /></Field>
            <Field id="company" label="Brokerage / company"><input id="company" name="company" defaultValue={agent?.company} className={input} /></Field>
            <Field id="territory" label="Territory"><input id="territory" name="territory" defaultValue={agent?.territory} className={input} placeholder="Cebu, Overseas..." /></Field>
            <Field id="status" label="Status">
              <select id="status" name="status" defaultValue={agent?.status ?? "pending"} className={input}>
                <option value="pending">Pending</option>
                <option value="accredited">Accredited</option>
                <option value="inactive">Inactive</option>
              </select>
            </Field>
          </div>
          <div className="mt-4"><Field id="notes" label="Notes"><textarea id="notes" name="notes" rows={4} defaultValue={agent?.notes} className={input} /></Field></div>
        </Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <SubmitButton variant="gold">{agent ? "Save changes" : "Add agent"}</SubmitButton>
            <Link href="/admin/agents" className={btn.secondary}>Cancel</Link>
          </div>
          {agent && <ConfirmButton action={() => deleteAgent(agent.id)}>Delete agent</ConfirmButton>}
        </div>
      </form>

      {agent && (
        <Card title="Agent login" description={agent.user_id ? "This agent can sign in with their email." : "Create a password so the agent can sign in. Agents have the agent role, not admin."}>
          {agent.user_id ? (
            <p className="text-sm text-emerald-700">Login active for {agent.email}.</p>
          ) : (
            <form action={loginAction} className="space-y-4">
              <input type="hidden" name="id" value={agent.id} />
              <Alert state={loginState} />
              <Field id="password" label="Temporary password" hint="At least 8 characters. Share it with the agent securely."><input id="password" name="password" type="text" minLength={8} required className={input} /></Field>
              <SubmitButton>Create login</SubmitButton>
            </form>
          )}
        </Card>
      )}
    </div>
  );
}
