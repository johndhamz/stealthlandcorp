/**
 * Island hopping tours for Napuro Resort and Spa (Roxas, Palawan). Tour A islands and the inclusions
 * came from the client; Tour B and C islands are nearby Roxas / Dumaran spots to be confirmed. Edit in the admin.
 */
export type PriceUnit = "person" | "group";

export interface SeedActivity {
  propertySlug: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  images: string[];
  duration: string;
  schedule: string;
  price: number;
  priceUnit: PriceUnit;
  minPax: number;
  maxPax: number;
  inclusions: string[];
  notes: string;
}

const img = (f: string) => `/images/activities/napuro/${f}`;

/** Same inclusions on every tour. */
const inclusions = [
  "Complimentary pick-up around Roxas town proper",
  "Lunch and refreshments",
  "Boat transfer",
  "Local tour guide",
  "Life vest onboard",
  "Boat captain and crew",
  "Cottage",
  "Island entrance fees",
  "Free drone shot (groups of 10)",
];

const notes = "Bring reef-safe sunscreen, a hat and a dry bag. Tours run weather permitting and may be rescheduled on coast guard advice.";

export const seedActivities: SeedActivity[] = [
  {
    propertySlug: "napuro-resort-and-spa",
    slug: "tour-a",
    name: "Tour A · 5 Island Destinations",
    category: "Island hopping from Roxas",
    tagline: "Purao Island · Shell Sandbar · Johnson Sandbar · Madles Sandbar · Modessa Island",
    description: "The classic Roxas circuit. Start on Purao Island’s cottages and white beach, hop to Shell Sandbar, walk the two-kilometre Johnson Sandbar, the longest in Palawan, stop at Madles Sandbar, and finish swimming off Modessa Island.",
    images: [img("purao-island.jpg"), img("madles-sandbar.jpg"), img("modessa-island.jpg"), img("sandbar-curve.jpg"), img("madles-sandbar-poster.jpg")],
    duration: "Full day · 5 islands",
    schedule: "Departs 8:00 AM, returns 4:00 PM",
    price: 1800,
    priceUnit: "person",
    minPax: 2,
    maxPax: 15,
    inclusions,
    notes,
  },
  {
    propertySlug: "napuro-resort-and-spa",
    slug: "tour-b",
    name: "Tour B · 4 Islands",
    category: "Island hopping from Roxas",
    tagline: "Pungtod Sandbar · Green Island · Reef Island · Stanlake Island",
    description: "Sandbars, reefs and a bird island. Swim off Pungtod Sandbar, snorkel the marine sanctuary around Green Island, drift over the corals of Reef Island and visit Stanlake Island, nesting ground of the Tabon bird.",
    images: [img("pungtod-sandbar.jpg"), img("pungtod-sandbar-aerial.jpg"), img("island-reef-boats.jpg"), img("mangrove-estuary.jpg")],
    duration: "Full day · 4 islands",
    schedule: "Departs 8:00 AM, returns 3:30 PM",
    price: 1500,
    priceUnit: "person",
    minPax: 2,
    maxPax: 15,
    inclusions,
    notes,
  },
  {
    propertySlug: "napuro-resort-and-spa",
    slug: "tour-c",
    name: "Tour C · 4 Islands",
    category: "Island hopping from Roxas",
    tagline: "Renambakan Island · Encantasia Island · Hardin Coral · Queen Coral",
    description: "A longer crossing north to the Dumaran side for quieter islands and the best snorkelling in the area. Beach time on Renambakan and Encantasia islands, then two reef stops at Hardin Coral and Queen Coral.",
    images: [img("sandbar-bangka.jpg"), img("island-reef-boats.jpg"), img("mangrove-river-aerial.jpg")],
    duration: "Full day · 4 islands",
    schedule: "Departs 7:30 AM, returns 4:30 PM",
    price: 2200,
    priceUnit: "person",
    minPax: 4,
    maxPax: 15,
    inclusions,
    notes,
  },
];

/** El Nido's four standard joiner routes (Bacuit Bay). Prices are typical 2026 joiner rates; confirm with the operator. */
const elNidoInclusions = ["Shared outrigger boat", "Licensed tour guide", "Lunch cooked on board", "Snorkel mask and life vest", "Drinking water"];
const elNidoNotes =
  "El Nido is about three hours by van from Roxas; transfers can be arranged on request. The El Nido Eco-Tourism Development Fee (valid 10 days), lagoon entrance and kayak hire are paid locally and not included.";
const elNido = (t: Pick<SeedActivity, "slug" | "name" | "tagline" | "description" | "duration" | "schedule" | "price">): SeedActivity => ({
  propertySlug: "napuro-resort-and-spa",
  category: "El Nido tours",
  images: [],
  priceUnit: "person",
  minPax: 1,
  maxPax: 15,
  inclusions: elNidoInclusions,
  notes: elNidoNotes,
  ...t,
});

seedActivities.push(
  elNido({
    slug: "el-nido-tour-a",
    name: "El Nido Tour A · Lagoons & Beaches",
    tagline: "Big or Small Lagoon · Secret Lagoon · Shimizu Island · 7 Commandos Beach",
    description: "El Nido’s signature route. Kayak the limestone-walled Big Lagoon (or Small Lagoon, assigned daily), slip through a rock crevice into Secret Lagoon, lunch on Shimizu Island and end the day on 7 Commandos Beach.",
    duration: "Full day · 4 to 5 stops",
    schedule: "Departs El Nido town 9:00 AM, returns 4:00 PM",
    price: 1500,
  }),
  elNido({
    slug: "el-nido-tour-b",
    name: "El Nido Tour B · Caves & Islands",
    tagline: "Snake Island · Cudugnon Cave · Cathedral Cave · Pinagbuyutan Island · Entalula Beach",
    description: "Walk the S-shaped sandbar of Snake Island at low tide, crawl into Cudugnon Cave, pass the towering Cathedral Cave by boat, and swim off Pinagbuyutan Island and Entalula Beach.",
    duration: "Full day · 5 stops",
    schedule: "Departs El Nido town 9:00 AM, returns 4:00 PM",
    price: 1600,
  }),
  elNido({
    slug: "el-nido-tour-c",
    name: "El Nido Tour C · Hidden Beaches & Shrine",
    tagline: "Hidden Beach · Secret Beach · Matinloc Shrine · Helicopter Island · Star Beach",
    description: "The most dramatic scenery in Bacuit Bay. Swim through a narrow gap into Secret Beach, explore Hidden Beach and the Matinloc Shrine viewpoint, then snorkel at Helicopter Island and Star Beach.",
    duration: "Full day · 5 stops · longest boat rides",
    schedule: "Departs El Nido town 9:00 AM, returns 4:30 PM",
    price: 1700,
  }),
  elNido({
    slug: "el-nido-tour-d",
    name: "El Nido Tour D · Cadlao Lagoon & Beaches",
    tagline: "Cadlao Lagoon · Paradise Beach · Pasandigan Beach · Natnat Beach · Bukal Beach",
    description: "The relaxed route closest to town. Short boat rides to the shallow Cadlao Lagoon and a string of quiet beaches on Cadlao Island, with plenty of swimming and snorkelling time.",
    duration: "Full day · 5 stops · shortest boat rides",
    schedule: "Departs El Nido town 9:00 AM, returns 3:30 PM",
    price: 1500,
  }),
);
