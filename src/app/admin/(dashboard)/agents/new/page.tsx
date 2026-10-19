import { PageHeader } from "@/components/admin/ui";
import { AgentForm } from "../AgentForm";

export default function NewAgentPage() {
  return (
    <>
      <PageHeader title="Add agent" />
      <AgentForm />
    </>
  );
}
