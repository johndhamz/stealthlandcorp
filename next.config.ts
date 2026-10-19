import type { NextConfig } from "next";
import { properties } from "./src/data/properties";

const legacyRedirects = properties.flatMap((p) =>
  (p.legacyPaths ?? []).map((source) => ({ source, destination: `/properties/${p.slug}`, permanent: true })),
);

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
  async redirects() {
    return [
      ...legacyRedirects,
      { source: "/properties/residential", destination: "/properties?sector=residential", permanent: true },
      { source: "/properties/residential/:region", destination: "/properties?sector=residential", permanent: true },
      { source: "/properties/hotel-leisure", destination: "/properties?sector=hotel-leisure", permanent: true },
      { source: "/partner-with-us/:type", destination: "/partner-with-us", permanent: true },
      { source: "/coming-soon", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
