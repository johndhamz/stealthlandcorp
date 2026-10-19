/** Placeholder room inventory for Napuro Resort and Spa. Edit rates and copy in the admin. */
export interface SeedRoom {
  propertySlug: string;
  slug: string;
  name: string;
  description: string;
  images: string[];
  maxGuests: number;
  beds: string;
  sizeSqm: number;
  nightlyRate: number;
  quantity: number;
  amenities: string[];
}

export const seedRooms: SeedRoom[] = [
  {
    propertySlug: "napuro-resort-and-spa",
    slug: "deluxe-room",
    name: "Deluxe Room",
    description: "A calm, contemporary room with a private balcony overlooking the gardens. Ideal for couples and solo travellers.",
    images: ["/images/properties/hotel-leisure.jpg"],
    maxGuests: 2,
    beds: "1 king or 2 twin beds",
    sizeSqm: 32,
    nightlyRate: 4500,
    quantity: 10,
    amenities: ["Garden view balcony", "Rain shower", "Air conditioning", "Mini bar", "Complimentary breakfast"],
  },
  {
    propertySlug: "napuro-resort-and-spa",
    slug: "premier-pool-view",
    name: "Premier Pool View",
    description: "Spacious room steps from the pool, with a daybed on the terrace and a deep soaking tub.",
    images: ["/images/properties/hotel/groove-towers.jpg"],
    maxGuests: 3,
    beds: "1 king bed plus daybed",
    sizeSqm: 42,
    nightlyRate: 6800,
    quantity: 8,
    amenities: ["Pool view terrace", "Soaking tub", "Nespresso machine", "Smart TV", "Complimentary breakfast"],
  },
  {
    propertySlug: "napuro-resort-and-spa",
    slug: "ocean-suite",
    name: "Ocean Suite",
    description: "A one-bedroom suite with a separate living area, panoramic sea views and a private plunge pool.",
    images: ["/images/properties/residential/visayas-4.jpg"],
    maxGuests: 3,
    beds: "1 king bed",
    sizeSqm: 68,
    nightlyRate: 12500,
    quantity: 4,
    amenities: ["Private plunge pool", "Sea view", "Separate living room", "Butler service", "Complimentary breakfast"],
  },
  {
    propertySlug: "napuro-resort-and-spa",
    slug: "family-villa",
    name: "Family Villa",
    description: "Two bedrooms, a full kitchen and a private garden with plunge pool, made for families and small groups.",
    images: ["/images/properties/residential/visayas-2.jpg"],
    maxGuests: 5,
    beds: "1 king bed and 2 twin beds",
    sizeSqm: 95,
    nightlyRate: 18000,
    quantity: 3,
    amenities: ["Two bedrooms", "Private garden and pool", "Kitchenette", "Dining terrace", "Complimentary breakfast"],
  },
];
