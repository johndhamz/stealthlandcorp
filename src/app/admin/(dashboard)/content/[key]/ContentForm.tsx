"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { saveContent } from "@/lib/admin/actions/content";
import type { ActionState } from "@/lib/admin/actions/auth";
import type { SectionDef, FieldDef } from "@/lib/admin/content-schema";
import { Alert, Card, Field, btn, input } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/SubmitButton";

export function ContentForm({ contentKey, schema, data }: { contentKey: string; schema: SectionDef; data: Record<string, unknown> }) {
  const [state, action] = useActionState<ActionState, FormData>(saveContent, {});
  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="key" value={contentKey} />
      <Alert state={state} />
      <Card>
        <div key={JSON.stringify(data)} className="space-y-5">
          {schema.fields.map((f) => <FieldInput key={f.name} field={f} value={data[f.name]} />)}
        </div>
      </Card>
      <SubmitButton variant="gold">Save changes</SubmitButton>
    </form>
  );
}

function FieldInput({ field, value }: { field: FieldDef; value: unknown }) {
  if (field.type === "text") return <Field id={field.name} label={field.label} hint={field.help}><input id={field.name} name={field.name} defaultValue={String(value ?? "")} className={input} /></Field>;
  if (field.type === "textarea") return <Field id={field.name} label={field.label} hint={field.help}><textarea id={field.name} name={field.name} rows={3} defaultValue={String(value ?? "")} className={input} /></Field>;
  if (field.type === "paragraphs") {
    const text = Array.isArray(value) ? (value as string[]).join("\n\n") : String(value ?? "");
    return <Field id={field.name} label={field.label} hint={field.help ?? "Separate paragraphs with a blank line."}><textarea id={field.name} name={field.name} rows={Math.min(14, Math.max(5, text.split("\n").length + 2))} defaultValue={text} className={input} /></Field>;
  }
  return <ItemsInput field={field} value={value} />;
}

function ItemsInput({ field, value }: { field: Extract<FieldDef, { type: "items" }>; value: unknown }) {
  const initial = Array.isArray(value) ? (value as Record<string, string>[]) : [];
  const [items, setItems] = useState<Record<string, string>[]>(initial.length ? initial : [{}]);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-navy-700">{field.label}</span>
        <button type="button" onClick={() => setItems((x) => [...x, {}])} className={`${btn.secondary} !py-1.5 !text-xs`}><Plus className="size-3.5" /> Add</button>
      </div>
      <input type="hidden" name={`${field.name}__count`} value={items.length} />
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-navy-900/10 bg-cream/60 p-4">
            <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
              {field.itemFields.map((sub) =>
                sub.type === "textarea" ? (
                  <label key={sub.name} className="sm:col-span-2 text-xs font-semibold text-navy-700">
                    {sub.label}
                    <textarea name={`${field.name}.${i}.${sub.name}`} rows={2} defaultValue={item[sub.name] ?? ""} className={`${input} mt-1 font-normal`} />
                  </label>
                ) : (
                  <label key={sub.name} className="text-xs font-semibold text-navy-700">
                    {sub.label}
                    <input name={`${field.name}.${i}.${sub.name}`} defaultValue={item[sub.name] ?? ""} className={`${input} mt-1 font-normal`} />
                  </label>
                ),
              )}
            </div>
            <button type="button" onClick={() => setItems((x) => x.filter((_, k) => k !== i))} className="mt-2 inline-flex items-center gap-1 text-xs text-red-600 hover:underline"><Trash2 className="size-3.5" /> Remove</button>
          </div>
        ))}
      </div>
      {field.help && <p className="mt-1 text-xs text-navy-600">{field.help}</p>}
    </div>
  );
}
