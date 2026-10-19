import { PageHeader } from "@/components/admin/ui";
import { PropertyForm } from "../PropertyForm";

export default function NewPropertyPage() {
  return (
    <>
      <PageHeader title="New property" description="Fill in the listing details. You can save it unpublished and publish later." />
      <PropertyForm />
    </>
  );
}
