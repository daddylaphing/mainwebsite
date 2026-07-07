import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://laphing.in";
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/#products`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
