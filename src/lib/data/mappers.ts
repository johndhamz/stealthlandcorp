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
  bookable: boolean;
  check_in_time: string;
  check_out_time: string;
  booking_notes: string;
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
    bookable: r.bookable,
    checkInTime: r.check_in_time,
    checkOutTime: r.check_out_time,
    bookingNotes: r.booking_notes,
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
    bookable: Boolean(p.bookable),
    check_in_time: p.checkInTime ?? "2:00 PM",
    check_out_time: p.checkOutTime ?? "12:00 NN",
    booking_notes: p.bookingNotes ?? "",
  };
}

export interface RoomTypeRow {
  id: string;
  property_id: string;
  slug: string;
  name: string;
  description: string;
  images: string[];
  max_guests: number;
  beds: string;
  size_sqm: number | null;
  nightly_rate: number;
  quantity: number;
  amenities: string[];
  published: boolean;
  sort_order: number;
  updated_at?: string;
}

export interface RoomType {
  id: string;
  propertyId: string;
  slug: string;
  name: string;
  description: string;
  images: string[];
  maxGuests: number;
  beds: string;
  sizeSqm: number | null;
  nightlyRate: number;
  quantity: number;
  amenities: string[];
  published: boolean;
  sortOrder: number;
}

export function rowToRoomType(r: RoomTypeRow): RoomType {
  return {
    id: r.id,
    propertyId: r.property_id,
    slug: r.slug,
    name: r.name,
    description: r.description,
    images: r.images ?? [],
    maxGuests: r.max_guests,
    beds: r.beds,
    sizeSqm: r.size_sqm == null ? null : Number(r.size_sqm),
    nightlyRate: Number(r.nightly_rate),
    quantity: r.quantity,
    amenities: r.amenities ?? [],
    published: r.published,
    sortOrder: r.sort_order,
  };
}
