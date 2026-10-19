import type { Property, Sector, Status, UnitType } from "@/data/properties";

export interface PropertyRow {
  id: string;
  slug: string;
  name: string;
  developer: string;
  tagline: string;
  sector: Sector;
  region: string;
  location: string;
  status: Status;
  featured: boolean;
  published: boolean;
  card_image: string;
  hero_images: string[];
  gallery: string[];
  summary: string;
  description: string[];
  highlight_title: string;
  highlights: string[];
  amenities: string[];
  unit_types: UnitType[];
  video_ids: string[];
  mortgage_calculator: boolean;
  legacy_paths: string[];
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export type AdminProperty = Property & { id: string; published: boolean; sortOrder: number; updatedAt?: string };

export function rowToProperty(r: PropertyRow): AdminProperty {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    developer: r.developer,
    tagline: r.tagline,
    sector: r.sector,
    region: r.region,
    location: r.location,
    status: r.status,
    featured: r.featured,
    published: r.published,
    cardImage: r.card_image,
    heroImages: r.hero_images ?? [],
    gallery: r.gallery ?? [],
    summary: r.summary,
    description: r.description ?? [],
    highlightTitle: r.highlight_title,
    highlights: r.highlights ?? [],
    amenities: r.amenities ?? [],
    unitTypes: r.unit_types?.length ? r.unit_types : undefined,
    videoIds: r.video_ids?.length ? r.video_ids : undefined,
    mortgageCalculator: r.mortgage_calculator,
    legacyPaths: r.legacy_paths?.length ? r.legacy_paths : undefined,
    sortOrder: r.sort_order,
    updatedAt: r.updated_at,
  };
}

export function propertyToRow(p: Property, extra: { published?: boolean; sortOrder?: number } = {}): Omit<PropertyRow, "id"> {
  return {
    slug: p.slug,
    name: p.name,
    developer: p.developer,
    tagline: p.tagline,
    sector: p.sector,
    region: p.region,
    location: p.location,
    status: p.status,
    featured: p.featured,
    published: extra.published ?? true,
    card_image: p.cardImage,
    hero_images: p.heroImages,
    gallery: p.gallery,
    summary: p.summary,
    description: p.description,
    highlight_title: p.highlightTitle,
    highlights: p.highlights,
    amenities: p.amenities,
    unit_types: p.unitTypes ?? [],
    video_ids: p.videoIds ?? [],
    mortgage_calculator: Boolean(p.mortgageCalculator),
    legacy_paths: p.legacyPaths ?? [],
    sort_order: extra.sortOrder ?? 0,
  };
}
