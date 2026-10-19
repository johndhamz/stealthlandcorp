import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { about, agentsPage, home, partnerPage, portfolioIntro } from "@/data/content";
import { site } from "@/data/site";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/server";

export const CONTENT_TAG = "site-content";

export interface SiteSettings {
  name: string;
  legalName: string;
  description: string;
  email: string;
  privacyEmail: string;
  phone: string;
  address: string;
  facebook: string;
  facebookLabel: string;
  instagram: string;
  instagramLabel: string;
  youtube: string;
  youtubeLabel: string;
}

export const defaultSettings: SiteSettings = {
  name: site.name,
  legalName: site.legalName,
  description: site.description,
  email: site.email,
  privacyEmail: site.privacyEmail,
  phone: "",
  address: "Philippines",
  facebook: site.social.facebook.href,
  facebookLabel: site.social.facebook.label,
  instagram: site.social.instagram.href,
  instagramLabel: site.social.instagram.label,
  youtube: site.social.youtube.href,
  youtubeLabel: site.social.youtube.label,
};

export type HomeContent = typeof home;
export type AboutContent = typeof about;
export type AgentsContent = typeof agentsPage;
export type PartnerContent = typeof partnerPage;
export interface PortfolioContent { intro: string[] }

export interface ContentMap {
  settings: SiteSettings;
  home: HomeContent;
  about: AboutContent;
  agents: AgentsContent;
  partner: PartnerContent;
  portfolio: PortfolioContent;
}

export const defaultContent: ContentMap = {
  settings: defaultSettings,
  home,
  about,
  agents: agentsPage,
  partner: partnerPage,
  portfolio: { intro: [...portfolioIntro] },
};

export type ContentKey = keyof ContentMap;

async function loadAllContent(): Promise<Partial<Record<ContentKey, unknown>>> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  if (!isSupabaseConfigured()) return {};
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("site_content").select("key, data");
  if (error) {
    console.error("loadAllContent", error.message);
    return {};
  }
  return Object.fromEntries((data ?? []).map((row) => [row.key, row.data]));
}

/** Returns stored content merged over the code defaults, so new fields always have a value. */
export async function getContent<K extends ContentKey>(key: K): Promise<ContentMap[K]> {
  const stored = await loadAllContent();
  const value = stored[key];
  if (!value || typeof value !== "object") return defaultContent[key];
  return { ...defaultContent[key], ...(value as object) } as ContentMap[K];
}

export async function getSettings() {
  return getContent("settings");
}
