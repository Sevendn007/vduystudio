import { PlatformIcon, type Platform } from "@/components/brand";
import Icon3 from "./Icon3";

// Logo nền tảng: dùng đúng bộ icon của trang production (components/brand → PlatformIcon).
const KIND: Record<string, Platform> = {
  tiktok: "tiktok",
  facebook: "facebook",
  instagram: "instagram",
  "instagram-threads": "instagram",
  threads: "threads",
  "bao-chi": "press",
  website: "website",
};
const LABEL: Record<string, string> = {
  tiktok: "TikTok", facebook: "Facebook", instagram: "Instagram", "instagram-threads": "Instagram", threads: "Threads", "bao-chi": "Báo chí", website: "Website",
};

export function platformLabel(p?: string | null): string {
  return (p && LABEL[p]) || p || "";
}

export default function PlatformMark({ platform, size = 28 }: { platform?: string | null; size?: number }) {
  const kind = (platform && KIND[platform]) || "website";
  // Báo chí & website không có logo tượng trưng rõ ràng → giữ glyph đơn giản (icon cũ).
  if (kind === "press" || kind === "website") {
    return (
      <span className="v3-pm v3-pm-glyph" role="img" aria-label={platformLabel(platform)} style={{ width: size, height: size }}>
        <Icon3 name={kind === "press" ? "megaphone" : "website"} size={Math.round(size * 0.6)} />
      </span>
    );
  }
  return (
    <span className="v3-pm" role="img" aria-label={platformLabel(platform)} style={{ width: size, height: size }}>
      <PlatformIcon kind={kind} size={size} />
    </span>
  );
}
