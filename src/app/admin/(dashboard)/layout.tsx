import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { signOut } from "@/lib/admin/actions/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}

async function Shell({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <AdminShell user={user} signOut={signOut}>
      {children}
    </AdminShell>
  );
}

function Skeleton() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-64 bg-navy-900 lg:block" />
      <div className="flex-1 p-10">
        <div className="h-8 w-48 animate-pulse rounded bg-navy-900/10" />
        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-navy-900/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
