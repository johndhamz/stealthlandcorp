import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { properties } from "@/data/properties";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about-us", "/properties", "/agents", "/partner-with-us", "/contact-us", "/privacy-policy", "/terms-of-use"];
  return [
    ...staticRoutes.map((path) => ({ url: `${site.url}${path}`, changeFrequency: "monthly" as const, priority: path === "" ? 1 : 0.7 })),
    ...properties.map((p) => ({ url: `${site.url}/properties/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.9 })),
  ];
}
