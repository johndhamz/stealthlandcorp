import type { ContentKey } from "@/lib/data/content";

export type FieldDef =
  | { name: string; label: string; type: "text"; help?: string }
  | { name: string; label: string; type: "textarea"; help?: string }
  | { name: string; label: string; type: "paragraphs"; help?: string }
  | { name: string; label: string; type: "items"; help?: string; itemFields: { name: string; label: string; type: "text" | "textarea" }[] };

export interface SectionDef {
  title: string;
  description: string;
  fields: FieldDef[];
}

export const contentSchema: Record<ContentKey, SectionDef> = {
  settings: {
    title: "Site settings",
    description: "Contact details and social links shown in the header, footer and contact page.",
    fields: [
      { name: "name", label: "Site name", type: "text" },
      { name: "legalName", label: "Legal name", type: "text" },
      { name: "description", label: "Site description (SEO and footer)", type: "textarea" },
      { name: "email", label: "Contact email", type: "text" },
      { name: "privacyEmail", label: "Privacy requests email", type: "text" },
      { name: "phone", label: "Phone (optional)", type: "text" },
      { name: "address", label: "Address line", type: "text" },
      { name: "facebook", label: "Facebook URL", type: "text" },
      { name: "facebookLabel", label: "Facebook label", type: "text" },
      { name: "instagram", label: "Instagram URL", type: "text" },
      { name: "instagramLabel", label: "Instagram handle", type: "text" },
      { name: "youtube", label: "YouTube URL", type: "text" },
      { name: "youtubeLabel", label: "YouTube label", type: "text" },
    ],
  },
  home: {
    title: "Home page",
    description: "Hero headline, company introduction and the three brand pillars.",
    fields: [
      { name: "heroTitle", label: "Hero title", type: "text" },
      { name: "heroSubtitle", label: "Hero subtitle", type: "textarea" },
      { name: "intro", label: "Introduction paragraphs", type: "paragraphs", help: "Separate paragraphs with a blank line." },
      { name: "pillars", label: "Pillars", type: "items", itemFields: [{ name: "title", label: "Title", type: "text" }, { name: "text", label: "Text", type: "textarea" }] },
    ],
  },
  about: {
    title: "About page",
    description: "Company story, purpose, vision, mission and timeline.",
    fields: [
      { name: "intro", label: "Intro paragraphs", type: "paragraphs" },
      { name: "purpose", label: "Our purpose", type: "paragraphs" },
      { name: "vision", label: "Vision", type: "textarea" },
      { name: "mission", label: "Mission", type: "textarea" },
      { name: "primaries", label: "Stealth Land Primaries", type: "paragraphs" },
      { name: "timeline", label: "Timeline", type: "items", itemFields: [{ name: "year", label: "Year", type: "text" }, { name: "title", label: "Title", type: "text" }, { name: "text", label: "Text", type: "textarea" }] },
    ],
  },
  agents: {
    title: "Agents page",
    description: "Copy for the agent recruitment page.",
    fields: [
      { name: "intro", label: "Intro", type: "textarea" },
      { name: "benefits", label: "Benefits", type: "items", itemFields: [{ name: "title", label: "Title", type: "text" }, { name: "text", label: "Text", type: "textarea" }] },
    ],
  },
  partner: {
    title: "Partner With Us page",
    description: "Partnership types and intro copy.",
    fields: [
      { name: "intro", label: "Intro", type: "textarea" },
      { name: "types", label: "Partnership types", type: "items", itemFields: [{ name: "slug", label: "Slug", type: "text" }, { name: "title", label: "Title", type: "text" }, { name: "text", label: "Text", type: "textarea" }] },
    ],
  },
  portfolio: {
    title: "Properties page",
    description: "Introduction shown at the top of the property listing.",
    fields: [{ name: "intro", label: "Intro paragraphs", type: "paragraphs", help: "The first paragraph appears in the hero, the second above the regions." }],
  },
};
