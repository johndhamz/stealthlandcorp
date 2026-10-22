export type Sector = "residential" | "hotel-leisure" | "agriculture";
export type Status = "pre-selling" | "ready-for-occupancy" | "in-development" | "completed";

export interface UnitType {
  label: string;
  sqm: number;
}

export interface Property {
  slug: string;
  name: string;
  developer: string;
  tagline: string;
  sector: Sector;
  region: string;
  location: string;
  status: Status;
  featured: boolean;
  cardImage: string;
  heroImages: string[];
  gallery: string[];
  summary: string;
  description: string[];
  highlightTitle: string;
  highlights: string[];
  amenities: string[];
  unitTypes?: UnitType[];
  videoIds?: string[];
  mortgageCalculator?: boolean;
  /** Old URLs that should redirect here. */
  legacyPaths?: string[];
  /** Hotel booking (request to book). */
  bookable?: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  bookingNotes?: string;
}

export const sectors: Record<Sector, { label: string; short: string; image: string; blurb: string; description: string[] }> = {
  residential: {
    label: "Residential",
    short: "Homes",
    image: "/images/properties/residential/visayas-3.jpg",
    blurb: "Vibrant living spaces that cater to every market, from accessible housing to luxury communities.",
    description: [
      "As a real estate developer with a focus on residential projects, Stealth Land Corp's portfolio reflects a commitment to creating high-quality living spaces that enhance communities and meet the evolving needs of homeowners and renters alike. We specialise in designing and developing residential properties that balance aesthetic appeal, functionality, and sustainability.",
      "Our work encompasses a range of residential developments, including single-family homes, multi-family complexes, and mixed-use communities. With each project, we strive to create environments that foster connection, comfort, and long-term growth.",
    ],
  },
  "hotel-leisure": {
    label: "Hotel & Leisure",
    short: "Hospitality",
    image: "/images/properties/hotel-leisure.jpg",
    blurb: "Memorable guest experiences, from luxury resorts to urban boutique hotels.",
    description: [
      "With a deep commitment to creating exceptional guest experiences and maximising operational efficiency, Stealth Land Corp's work in hotel and leisure development spans a range of projects from luxury resorts to urban boutique hotels.",
      "Each project is a blend of strategic planning, innovative design, and attention to detail, all aimed at delivering memorable stays and generating strong financial returns.",
    ],
  },
  agriculture: {
    label: "Agriculture",
    short: "Agri-business",
    image: "/images/properties/agriculture.jpg",
    blurb: "Sustainable farming and agri-business models that lift productivity and local economies.",
    description: [
      "With a deep passion for sustainable agriculture, Stealth Land Corp's work in farming and agricultural development focuses on enhancing productivity, sustainability, and community impact.",
      "Over the years we have led initiatives that integrate modern farming techniques, promote environmental stewardship, and support rural economic growth.",
    ],
  },
};

export const statusLabels: Record<Status, string> = {
  "pre-selling": "Pre-selling",
  "ready-for-occupancy": "Ready for occupancy",
  "in-development": "In development",
  completed: "Completed",
};

export interface Region {
  slug: string;
  name: string;
  heading: string;
  description: string[];
}

export const regions: Region[] = [
  {
    slug: "metro-manila",
    name: "Metro Manila",
    heading: "Metro Manila properties",
    description: [
      "Stealth Land Corp invested in Metro Manila properties due to the region's dynamic growth, strategic location, and thriving real estate market. As the economic and cultural hub of the Philippines, Metro Manila offers a unique combination of strong infrastructure, business opportunities, and a growing demand for residential, commercial, and mixed-use developments.",
      "By investing in Metro Manila, we aim to capitalise on rising property values, a growing population, and increasing urbanisation, all while contributing to modern, sustainable communities that meet the needs of both local and international buyers.",
    ],
  },
  {
    slug: "central-southern-luzon",
    name: "Central & Southern Luzon",
    heading: "Central & Southern Luzon",
    description: [
      "Central Luzon and Southern Luzon serve as vital gateways between Metro Manila and the rest of the Philippines, benefiting from expressways, railways, and airports. Both regions are experiencing rapid urbanisation and economic expansion, making them attractive locations for residential, commercial, and mixed-use developments.",
      "Central Luzon, with its proximity to Metro Manila and the Clark economic zone, offers growth driven by demand for suburban living and industrial developments. Southern Luzon, close to Tagaytay and Batangas, provides an ideal setting for leisure and residential projects for local and foreign buyers alike.",
    ],
  },
  {
    slug: "visayas",
    name: "Visayas",
    heading: "Stealth Land in Visayas",
    description: [
      "Central Visayas, home to key cities like Cebu, has established itself as a hub for commerce, trade, and tourism, attracting both local and international investors. The region's vibrant economy is driven by IT-BPO services, manufacturing, and real estate, making it a prime area for growth.",
      "By investing in Central Visayas, Stealth Land Corp taps into expanding markets and contributes to world-class projects that enhance the area's appeal to residents, businesses, and tourists alike.",
    ],
  },
  {
    slug: "palawan",
    name: "Palawan",
    heading: "Palawan",
    description: [
      "Palawan's pristine beaches, crystal-clear waters, and UNESCO World Heritage sites have earned it recognition as one of the best islands in the world. Growing tourism demand creates a strong market for luxury resorts, eco-friendly accommodation, and residential developments.",
      "By investing in Palawan, we capitalise on the island's booming tourism industry while contributing to environmentally sustainable developments that preserve its natural charm.",
    ],
  },
];

const alphaImages = [
  "/images/properties/residential/visayas.jpg",
  "/images/properties/residential/visayas-2.jpg",
  "/images/properties/residential/visayas-3.jpg",
  "/images/properties/residential/visayas-4.jpg",
];

export const properties: Property[] = [
  {
    slug: "alpha-tower",
    name: "Alpha Tower",
    developer: "Stealth Land Corp",
    tagline: "Own a piece of the Cebu City skyline.",
    sector: "residential",
    region: "Visayas",
    location: "Cebu City, Cebu",
    status: "pre-selling",
    featured: true,
    cardImage: "/images/properties/residential/visayas-3.jpg",
    heroImages: alphaImages,
    gallery: alphaImages,
    summary:
      "Be part of an exclusive community where modern living meets convenience. Secure your unit today and experience urban living at its finest.",
    description: [
      "Introducing Alpha Tower, a modern oasis that combines luxury living with sustainability. Nestled in a prime location, this condominium offers breathtaking views of both the majestic mountains and the vibrant city skyline.",
      "With top-tier amenities, including two resort-style pools, a fitness centre, and lush green spaces, residents can enjoy a relaxing and eco-friendly lifestyle. Thoughtfully designed with sustainability in mind, Alpha Tower provides a perfect blend of comfort, convenience, and natural beauty, making it an ideal retreat from the hustle and bustle of city life.",
    ],
    highlightTitle: "Pursue your dream home at Alpha Tower",
    highlights: [
      "Where city convenience meets natural beauty. Perfectly located for easy access to urban amenities, this condominium offers a seamless blend of modern living and serene landscapes.",
      "Enjoy stunning views of the city skyline and nearby mountains from the comfort of your home, all while being just minutes away from shopping, dining, and entertainment. Alpha Tower is the ideal place to start a home that balances the best of city life with a peaceful retreat.",
    ],
    amenities: [
      "Two resort-style swimming pools",
      "Fully equipped fitness centre",
      "Landscaped gardens and green spaces",
      "Mountain and city skyline views",
      "24/7 security and concierge",
      "Minutes from shopping and dining",
    ],
    unitTypes: [
      { label: "Studio", sqm: 32 },
      { label: "1 Bedroom", sqm: 40 },
      { label: "2 Bedroom", sqm: 55 },
    ],
    videoIds: ["3m5eBymw9kM", "wkljDmxL5XI", "OkdypLXISao"],
    mortgageCalculator: true,
    legacyPaths: ["/properties/residential/visayas/alpha-tower", "/properties/residential/visayas"],
  },
  {
    slug: "grove-tower",
    name: "Grove Tower",
    developer: "Stealth Land Corp",
    tagline: "Island living, elevated.",
    sector: "residential",
    region: "Palawan",
    location: "Puerto Princesa, Palawan",
    status: "pre-selling",
    featured: true,
    cardImage: "/images/properties/hotel/groove-towers.jpg",
    heroImages: ["/images/properties/hotel/groove-towers.jpg"],
    gallery: ["/images/properties/hotel/groove-towers.jpg"],
    summary:
      "Be part of an exclusive community where modern living meets convenience at Grove Tower. Secure your unit today and experience island living at its finest.",
    description: [
      "Introducing Grove Tower, a modern oasis that combines luxury living with sustainability. Nestled in a prime location, this condominium offers breathtaking views of both the majestic mountains and the vibrant skyline.",
      "With top-tier amenities, including two resort-style pools, a fitness centre, and lush green spaces, residents can enjoy a relaxing and eco-friendly lifestyle. Thoughtfully designed with sustainability in mind, Grove Tower provides a perfect blend of comfort, convenience, and natural beauty.",
    ],
    highlightTitle: "Pursue your dream home at Grove Tower",
    highlights: [
      "Where city convenience meets natural beauty. Perfectly located for easy access to urban amenities, this condominium offers a seamless blend of modern living and serene landscapes.",
      "Enjoy stunning views from the comfort of your home while being just minutes away from shopping, dining, and entertainment. Grove Tower is the ideal place to start a home that balances the best of city life with a peaceful retreat.",
    ],
    amenities: [
      "Two resort-style swimming pools",
      "Fitness centre",
      "Lush landscaped green spaces",
      "Panoramic island and mountain views",
      "24/7 security",
      "Close to Palawan's top destinations",
    ],
    unitTypes: [
      { label: "Studio", sqm: 32 },
      { label: "1 Bedroom", sqm: 40 },
      { label: "2 Bedroom", sqm: 55 },
    ],
    mortgageCalculator: true,
    legacyPaths: [
      "/properties/residential/palawan/grove-tower",
      "/properties/residential/palawan",
      "/properties/hotel/groove-tower",
    ],
  },
  {
    slug: "el-nido-coffee-plantation",
    name: "El Nido Coffee Plantation",
    developer: "Stealth Land Corp",
    tagline: "Sip the serenity of paradise.",
    sector: "agriculture",
    region: "Palawan",
    location: "El Nido, Palawan",
    status: "in-development",
    featured: false,
    cardImage: "/images/properties/agriculture.jpg",
    heroImages: ["/images/properties/agriculture.jpg", "/images/properties/agriculture/agri-2.jpeg"],
    gallery: ["/images/properties/agriculture.jpg", "/images/properties/agriculture/agri-1.jpeg", "/images/properties/agriculture/agri-2.jpeg"],
    summary:
      "A sanctuary for coffee lovers and nature enthusiasts in the lush, green hills of El Nido, producing sustainably grown Arabica and Robusta beans.",
    description: [
      "Nestled in the lush, green hills of El Nido, Palawan, El Nido Coffee Plantation is more than just a farm. It is a sanctuary for coffee lovers and nature enthusiasts alike. The farm is dedicated to producing high-quality, sustainably grown coffee while preserving the natural beauty of this breathtaking region.",
      "Surrounded by pristine forests, crystal-clear rivers, and panoramic views of the mountains and sea, this idyllic location provides the perfect climate for growing coffee and a peaceful retreat from the hustle and bustle of city life.",
    ],
    highlightTitle: "El Nido Coffee: sip the serenity of paradise",
    highlights: [
      "We take pride in every step of the coffee-making process, from planting and nurturing the coffee trees to harvesting, processing, and roasting the beans. The farm produces a variety of Arabica and Robusta beans, each with its own unique flavour profile reflecting the rich biodiversity of El Nido.",
      "We believe in giving back to the community that makes the farm possible. Through fair-trade practices and community development projects, we strive to create a positive impact on the lives of our farmers and their families.",
    ],
    amenities: [
      "Sustainably grown Arabica and Robusta",
      "Fair-trade community partnerships",
      "Farm visits and tastings",
      "Forest, river and sea views",
    ],
    legacyPaths: ["/properties/agriculture/agricultural", "/properties/agriculture"],
  },
  {
    slug: "napuro-resort-and-spa",
    name: "Napuro Resort and Spa",
    developer: "Stealth Land Corp",
    tagline: "Unwind where the island meets the sea.",
    sector: "hotel-leisure",
    region: "Palawan",
    location: "Roxas, Palawan, Philippines",
    status: "in-development",
    featured: false,
    cardImage: "/images/properties/hotel-leisure.jpg",
    heroImages: ["/images/properties/hotel-leisure.jpg", "/images/properties/hotel/groove-towers.jpg"],
    gallery: ["/images/properties/hotel-leisure.jpg", "/images/properties/hotel/groove-towers.jpg", "/images/properties/agriculture/agri-2.jpeg"],
    summary:
      "A boutique resort and spa by Stealth Land Corp. Choose a room, pick your dates and send a booking request. Our reservations team confirms by email.",
    description: [
      "Napuro Resort and Spa brings Stealth Land Corp's hospitality vision to life: a boutique retreat that pairs refined, contemporary rooms with the natural beauty of its island setting.",
      "Guests can expect a full-service spa, pool, and dining that showcases local produce, with the warm, attentive service that turns a stay into a memory. Rooms, rates and photography shown here are placeholders and will be updated ahead of opening.",
    ],
    highlightTitle: "Rest, restore and reconnect",
    highlights: [
      "Every stay is designed around slow mornings and golden-hour evenings. Wake to garden or sea views, spend the day between the pool and the spa, and end it with dinner under the stars.",
      "Booking is simple: pick your room and dates, tell us who is travelling, and our reservations team will confirm availability and payment details by email within one business day.",
    ],
    amenities: [
      "Full-service spa and wellness pavilion",
      "Outdoor pool and sun deck",
      "Restaurant and poolside bar",
      "Complimentary breakfast",
      "Airport and pier transfers on request",
      "Free Wi-Fi throughout the resort",
    ],
    bookable: true,
    checkInTime: "2:00 PM",
    checkOutTime: "12:00 NN",
    bookingNotes: "Rates are indicative and confirmed by our reservations team. Children under 6 stay free when sharing with parents.",
  },
];

export function getProperty(slug: string) {
  return properties.find((p) => p.slug === slug);
}

export function getFeatured() {
  return properties.filter((p) => p.featured);
}

export const propertyLocations = Array.from(new Set(properties.map((p) => p.region)));
