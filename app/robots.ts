// app/robots.ts

import { type MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://cloud-practitioner.com/sitemap.xml",
    host: "https://cloud-practitioner.com",
  };
}
