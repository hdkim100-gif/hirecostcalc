import type { MetadataRoute } from "next";
import { allStateSlugs } from "@/lib/state-content";

export const dynamic = "force-static";

const BASE_URL = "https://hirecostcalc.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, changeFrequency: "monthly", priority: 1 },
    ...allStateSlugs().map((slug) => ({
      url: `${BASE_URL}/employee-cost-calculator/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
