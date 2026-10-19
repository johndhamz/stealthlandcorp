import { Suspense } from "react";
import { createSessionClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { Card, PageHeader, Table, Th, formatDate } from "@/components/admin/ui";
import { CreateUserForm, UserRow } from "./UserForms";

export default function UsersPage() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-navy-900/10" />}>
      <UsersPageContent />
    </Suspense>
  );
}

async function UsersPageContent() {
  const me = await requireAdmin();
  const supabase = await createSessionClient();
  const { data } = await supabase.from("profiles").select("id, email, full_name, role, created_at").order("created_at");
  const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  return (
    <>
      <PageHeader title="Users" description="Admins can manage everything. Agents can sign in but only see what is assigned to them." />
      {!hasServiceKey && (
        <p className="mb-6 rounded-md border border-gold-500/40 bg-gold-500/10 px-4 py-3 text-sm text-navy-900">
          Creating users, resetting passwords and deleting accounts needs <code>SUPABASE_SERVICE_ROLE_KEY</code> in the server environment.
        </p>
      )}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Table>
          <thead>
            <tr><Th>User</Th><Th>Role</Th><Th>Created</Th><Th /></tr>
          </thead>
          <tbody>
            {(data ?? []).map((u) => (
              <UserRow key={u.id} user={u} isSelf={u.id === me.id} createdLabel={formatDate(u.created_at)} />
            ))}
          </tbody>
        </Table>
        <Card title="Add user" description="The user can sign in straight away with this password.">
          <CreateUserForm />
        </Card>
      </div>
    </>
  );
}
