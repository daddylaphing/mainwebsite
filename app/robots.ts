import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://laphing.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/account",
          "/account/settings",
          "/api/",
          "/auth/",
          "/admin/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
