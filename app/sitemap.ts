// app/sitemap.ts

import { type MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://cloud-practitioner.com",
      lastModified: new Date(),
    },
    // Add other static or dynamic routes here
  ];
}
