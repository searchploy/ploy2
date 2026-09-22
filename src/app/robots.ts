import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/pages";

/**
 * Everything public is crawlable. The disallow list covers authenticated and
 * transactional areas only — these hold personal data, return nothing useful
 * to a crawler, and in the case of /report/ contain report ids.
 */
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/account/",
          "/dashboard/",
          "/auth/",
          "/report/",
          "/sign-in",
          "/sign-up",
          "/verify-email",
          "/forgot-password",
          "/reset-password",
          "/profile",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
