import type { Property } from "@/data/properties";
import type { ProjectOption } from "@/components/forms/InquiryForm";

export function projectOptions(properties: Property[]): ProjectOption[] {
  return properties.map((p) => ({ value: `${p.name} by Stealth Land Corp`, label: `${p.name} · ${p.location}` }));
}
