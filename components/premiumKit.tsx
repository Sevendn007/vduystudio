"use client";

// Bộ component dùng chung cho style PREMIUM — nhúng được ở mọi trang
// (trang chủ, /du-an, /dich-vu/[slug]). Mỗi component tự mang CSS.
// - SpriteImg: sprite tách nền từ logo.png (mark / hành tinh)
// - Mark3D:   mark VJ + tích xanh xếp lớp có độ dày, xoay quanh trục dọc
// - Wordmark: chữ VDUY (teal) + STUDIO (bạc) với vệt sáng chạy qua lại
// - IPhone:   khung điện thoại viền titan + Dynamic Island, ảnh 9:19.5

import { useState } from "react";
import NextImage from "next/image";
import ReactDOM from "react-dom";
import type { DbProject } from "@/lib/data";

// Preload sprite (SSR chèn <link rel="preload"> vào head, dedupe theo URL).
// Cast any vì @types/react-dom 18 chưa khai báo preload dù Next 14 đã hỗ trợ.
function preloadImage(url: string) {
  (ReactDOM as unknown as { preload?: (href: string, opts: { as: string }) => void }).preload?.(url, { as: "image" });
}

// Sprite tĩnh sinh sẵn từ logo.png bằng scripts/generate-assets.mjs
// (trước đây tách bằng canvas ở runtime — chậm vì phải tải logo.png 1.1MB).
const SPRITE: Record<"mark" | "p1" | "p2", string> = {
  mark: "/images/sprites/mark.png",
  p1: "/images/sprites/p1.png",
  p2: "/images/sprites/p2.png",
};
const MARK_NAV = "/images/sprites/mark-nav.png";

// Dự án showcase khi DB trống — dùng chung cho trang chủ & /du-an.
export const DEFAULT_PROJECTS: DbProject[] = [
  { id: "p1", platform: "tiktok", tag: "Verification", title: "Khuyến Dương", result: "TikTok · 1,7Tr Follower · 62,7Tr Thích", image_url: "/images/d1.webp", sort_order: null, date: null },
  { id: "p2", platform: "tiktok", tag: "Verification", title: "Chí Khang", result: "TikTok · 2,7Tr Follower · 239,3Tr Thích", image_url: "/images/d2.webp", sort_order: null, date: null },
  { id: "p3", platform: "tiktok", tag: "Verification", title: "Chuyện Ma Chú 3 Duy", result: "TikTok · 3,2Tr Follower · 148,5Tr Thích", image_url: "/images/d3.webp", sort_order: null, date: null },
  { id: "p4", platform: "tiktok", tag: "Verification", title: "Mai Trí Thức", result: "TikTok · 2,2Tr Follower · 178,1Tr Thích", image_url: "/images/d4.webp", sort_order: null, date: null },
];

export function SpriteImg({ kind, alt = "", className }: { kind: "mark" | "p1" | "p2"; alt?: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={SPRITE[kind]} alt={alt} className={className} draggable={false} decoding="async" />;
}

// Mark 3D: bước lớp 0.6px (<1px) nên khi quay nghiêng các lớp hoà thành
// cạnh liền khối, không lộ sọc. Bản nav dùng sprite thu nhỏ 128px.
export function Mark3D({ layers = 32, className, alt = "" }: { layers?: number; className?: string; alt?: string }) {
  const url = className?.includes("nav") ? MARK_NAV : SPRITE.mark;
  preloadImage(url);
  return (
    <div className={`pm-mark-stack ${className ?? ""}`}>
      {Array.from({ length: layers }, (_, i) => {
        const isFront = i === layers - 1;
        const isBack = i === 0;
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={url}
            alt={isFront ? alt : ""}
            aria-hidden={!isFront}
            draggable={false}
            decoding="async"
            className={isFront ? "front" : isBack ? "back" : "side"}
            style={{ transform: `translateZ(${(i - (layers - 1) / 2) * 0.6}px)` }}
          />
        );
      })}
    </div>
  );
}

// Wordmark VDUYSTUDIO: màu đồng nhất mọi nơi (VDUY teal · STUDIO bạc chrome)
// + vệt sáng trắng chạy qua lại (alternate). part="vduy"/"studio" để render
// tách hai bên logo như hero.
export function Wordmark({ className, part = "full" }: { className?: string; part?: "vduy" | "studio" | "full" }) {
  const text = part === "vduy" ? "VDUY" : part === "studio" ? "STUDIO" : "VDUYSTUDIO";
  return (
    <span className={`pm-wm ${className ?? ""}`} aria-label={text}>
      <span className="pm-wm-base" aria-hidden>
        {part !== "studio" && <i>VDUY</i>}
        {part !== "vduy" && <em>STUDIO</em>}
      </span>
      <span className="pm-wm-shine" aria-hidden>{text}</span>
    </span>
  );
}

// next/image chỉ nhận đường dẫn local và host đã khai báo trong next.config
// (Supabase Storage); URL host khác render <img> thường như trước.
function canOptimize(url: string) {
  return url.startsWith("/") || /^https:\/\/[^/]+\.supabase\.co\/storage\/v1\/object\/public\//.test(url);
}

// Khung iPhone; ảnh DB lỗi/thiếu → rơi về fallback nên khung không bao giờ trống.
export function IPhone({ src, fallback, alt, size = "md", tilt }: { src: string | null; fallback?: string | null; alt: string; size?: "lg" | "md" | "sm"; tilt?: "l" | "r" }) {
  const chain = [src, fallback].filter(Boolean) as string[];
  const [idx, setIdx] = useState(0);
  const cur = chain[idx];
  return (
    <div className={`pm-phone ${size} ${tilt === "l" ? "tilt-l" : tilt === "r" ? "tilt-r" : ""}`}>
      <div className="pm-phone-screen">
        {cur ? (
          canOptimize(cur) ? (
            <NextImage src={cur} alt={alt} fill sizes="240px" loading="lazy" onError={() => setIdx((i) => i + 1)} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cur} alt={alt} loading="lazy" decoding="async" onError={() => setIdx((i) => i + 1)} />
          )
        ) : (
          <div className="pm-phone-empty">{alt}</div>
        )}
        <span className="pm-island" />
      </div>
    </div>
  );
}
