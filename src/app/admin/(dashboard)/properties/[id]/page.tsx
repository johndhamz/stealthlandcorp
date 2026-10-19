import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { createSessionClient } from "@/lib/supabase/server";
import { rowToProperty, type PropertyRow } from "@/lib/data/mappers";
import { PageHeader, btn } from "@/components/admin/ui";
import { PropertyForm } from "../PropertyForm";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSessionClient();
  const { data } = await supabase.from("properties").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const property = rowToProperty(data as PropertyRow);
  return (
    <>
      <PageHeader
        title={property.name}
        description={`Last updated ${property.updatedAt ? new Date(property.updatedAt).toLocaleString("en-PH", { timeZone: "Asia/Manila" }) : "—"}`}
        actions={property.published ? <Link href={`/properties/${property.slug}`} target="_blank" className={btn.secondary}><ExternalLink className="size-4" /> View on site</Link> : undefined}
      />
      <PropertyForm property={property} />
    </>
  );
}
