export const site = {
  name: "Stealth Land Corp",
  legalName: "Stealth Land Corporation",
  tagline: "Sustainability. Innovation. Customer-Centricity.",
  description:
    "Stealth Land Corp is a Philippine real estate developer creating sustainable residential, hotel & leisure, and agricultural developments across Cebu, Palawan, Luzon and Metro Manila.",
  url: "https://stealthlandcorp.com",
  email: "admin@stealthlandcorp.com",
  privacyEmail: "stealthlandcorp@gmail.com",
  social: {
    facebook: { label: "StealthLandCorporation", href: "https://www.facebook.com/StealthLandCorporation" },
    instagram: { label: "stealthlandcorp", href: "https://www.instagram.com/stealthlandcorp/" },
    youtube: { label: "Stealth Land", href: "https://www.youtube.com/@StealthLandCorp" },
  },
  nav: [
    { label: "About Us", href: "/about-us" },
    {
      label: "Properties",
      href: "/properties",
      children: [
        { label: "All properties", href: "/properties" },
        { label: "Residential", href: "/properties?sector=residential" },
        { label: "Hotel & Leisure", href: "/properties?sector=hotel-leisure" },
        { label: "Agriculture", href: "/properties?sector=agriculture" },
      ],
    },
    { label: "Agents", href: "/agents" },
    { label: "Partner With Us", href: "/partner-with-us" },
    { label: "Contact Us", href: "/contact-us" },
  ],
  footerLinks: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Use", href: "/terms-of-use" },
    { label: "Contact Us", href: "/contact-us" },
  ],
} as const;

export const countries = [
  "Philippines", "United States", "Japan", "Australia", "Canada",
  "United Kingdom", "Germany", "France", "India", "China", "Singapore",
  "United Arab Emirates", "South Korea", "Hong Kong", "Other",
] as const;

export const philippinePlaces = [
  "Manila", "Cebu", "Davao", "Baguio", "Boracay", "Palawan", "Tagaytay", "Vigan", "Bohol", "Subic", "Other",
] as const;

export const referralSources = [
  "Billboard", "Broker", "Events", "Friends/Relatives", "Magazines", "Newspaper", "Online", "Others",
] as const;
