import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/ui";
import { contentSchema } from "@/lib/admin/content-schema";
import { getContent, type ContentKey } from "@/lib/data/content";
import { ContentForm } from "./ContentForm";

export default async function ContentEditPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const schema = contentSchema[key as ContentKey];
  if (!schema) notFound();
  const data = (await getContent(key as ContentKey)) as unknown as Record<string, unknown>;
  return (
    <>
      <Link href="/admin/content" className="mb-4 inline-flex items-center gap-1 text-sm text-navy-600 hover:text-navy-900"><ArrowLeft className="size-4" /> Site content</Link>
      <PageHeader title={schema.title} description={schema.description} />
      <ContentForm contentKey={key} schema={schema} data={data} />
    </>
  );
}
