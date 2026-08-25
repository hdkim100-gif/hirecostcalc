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
    { url: `${BASE_URL}/about`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE_URL}/privacy`, changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${BASE_URL}/terms`, changeFrequency: "yearly" as const, priority: 0.2 },
  ];
}
