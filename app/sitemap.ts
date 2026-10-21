import type { MetadataRoute } from "next";
import { platforms } from "@/lib/services";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://vduystudio.com";
const SERVICES = platforms.map((p) => p.slug);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, priority: 1 },
    { url: `${BASE}/du-an`, lastModified: now, priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: now, priority: 0.7 },
    ...SERVICES.map((s) => ({ url: `${BASE}/dich-vu/${s}`, lastModified: now, priority: 0.8 })),
  ];
}
