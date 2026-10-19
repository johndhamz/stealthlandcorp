import { Suspense } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { createSessionClient } from "@/lib/supabase/server";
import { sectors, statusLabels, type Sector, type Status } from "@/data/properties";
import { Badge, EmptyState, LinkButton, PageHeader, Table, Td, Th, formatDate } from "@/components/admin/ui";
import { PublishToggle } from "./PublishToggle";

export default function PropertiesAdminPage() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-navy-900/10" />}>
      <PropertiesAdminPageContent />
    </Suspense>
  );
}

async function PropertiesAdminPageContent() {
  const supabase = await createSessionClient();
  const { data } = await supabase
    .from("properties")
    .select("id, slug, name, sector, region, location, status, featured, published, sort_order, updated_at")
    .order("sort_order")
    .order("created_at");

  return (
    <>
      <PageHeader title="Properties" description="Listings shown on the public site. Unpublished properties stay hidden." actions={<LinkButton href="/admin/properties/new" variant="gold">New property</LinkButton>} />
      {data?.length ? (
        <Table>
          <thead>
            <tr>
              <Th>Property</Th>
              <Th>Sector</Th>
              <Th>Status</Th>
              <Th>Visibility</Th>
              <Th>Updated</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.id} className="hover:bg-cream/60">
                <Td>
                  <span className="font-medium">{p.name}</span>
                  {p.featured && <Badge tone="gold">Featured</Badge>}
                  <span className="block text-xs text-navy-600">{p.location} · /properties/{p.slug}</span>
                </Td>
                <Td>{sectors[p.sector as Sector]?.label ?? p.sector}</Td>
                <Td>{statusLabels[p.status as Status] ?? p.status}</Td>
                <Td><PublishToggle id={p.id} published={p.published} /></Td>
                <Td className="whitespace-nowrap text-navy-600">{formatDate(p.updated_at)}</Td>
                <Td className="text-right">
                  <Link href={`/admin/properties/${p.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-navy-900 hover:underline"><Pencil className="size-3.5" /> Edit</Link>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyState title="No properties yet" text="Add your first listing, or run `npm run seed` to import the properties that ship with the site." action={<LinkButton href="/admin/properties/new" variant="gold">New property</LinkButton>} />
      )}
    </>
  );
}
