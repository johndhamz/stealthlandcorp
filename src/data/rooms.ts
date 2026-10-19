/**
 * Room inventory for Napuro Resort and Spa: native-style cottages and island villas, modelled on
 * Palawan beach resorts. Rates and copy are placeholders; edit them in the admin.
 */
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

const img = (f: string) => `/images/rooms/napuro/${f}.jpg`;

export const seedRooms: SeedRoom[] = [
  {
    propertySlug: "napuro-resort-and-spa",
    slug: "native-garden-cottage",
    name: "Native Garden Cottage",
    description: "A classic Palawan kubo of bamboo and cogon thatch set in the coconut garden a short walk from the beach. Simple, cool and quiet, with a private veranda and your own bathroom.",
    images: [img("bamboo-cottage"), img("cottage-garden")],
    maxGuests: 2,
    beds: "1 queen bed",
    sizeSqm: 24,
    nightlyRate: 3200,
    quantity: 8,
    amenities: ["Air conditioning and ceiling fan", "Private bathroom with hot shower", "Veranda with hammock", "Nipa and bamboo build", "Complimentary breakfast"],
  },
  {
    propertySlug: "napuro-resort-and-spa",
    slug: "beachfront-native-cottage",
    name: "Beachfront Native Cottage",
    description: "A stilted nipa cottage right on the sand, with the sea a few steps from your veranda. Wake to the bangkas coming in and watch the sunset from the day bed.",
    images: [img("beachfront-nipa-cottage"), img("beachfront-cottages-from-sea"), img("beach-cabana")],
    maxGuests: 3,
    beds: "1 queen bed plus day bed",
    sizeSqm: 28,
    nightlyRate: 4800,
    quantity: 6,
    amenities: ["Beachfront veranda", "Air conditioning", "Hot shower", "Mini fridge", "Beach cabana for your cottage", "Complimentary breakfast"],
  },
  {
    propertySlug: "napuro-resort-and-spa",
    slug: "seaview-island-villa",
    name: "Seaview Island Villa",
    description: "Our top room: a timber villa on stilts over the shallows with a wraparound deck, panoramic sea view and a deep soaking tub. Built in native style with modern comforts.",
    images: [img("sea-villas"), img("stilt-deck")],
    maxGuests: 3,
    beds: "1 king bed",
    sizeSqm: 45,
    nightlyRate: 8500,
    quantity: 4,
    amenities: ["Over-water deck with sea view", "Soaking tub and rain shower", "Air conditioning", "Minibar and coffee station", "Daily turndown", "Complimentary breakfast"],
  },
  {
    propertySlug: "napuro-resort-and-spa",
    slug: "family-kubo",
    name: "Family Kubo",
    description: "A two-storey native house for families and barkadas: two bedrooms, a sleeping loft, a kitchenette and a big shaded deck facing the beach.",
    images: [img("family-house"), img("family-house-deck"), img("beach-huts")],
    maxGuests: 6,
    beds: "1 king bed, 2 twin beds and loft futons",
    sizeSqm: 80,
    nightlyRate: 12000,
    quantity: 3,
    amenities: ["Two bedrooms plus loft", "Kitchenette and dining deck", "Air conditioning", "Two bathrooms", "Beach-facing deck", "Complimentary breakfast"],
  },
];
