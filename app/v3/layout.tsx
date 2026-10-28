import type { Metadata } from "next";
import { Archivo, Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import "../styles/v3-tokens.css";
import "../styles/v3.css";
import SmoothScroll from "@/components/layout/SmoothScroll";

// UI v3 "Verified Orbit" — tách riêng ở /v3, UI cũ ở "/" và /v2 giữ nguyên.
// Font, CSS, Lenis chỉ nạp ở đây; toàn bộ CSS scope dưới `.v3`.
// Dữ liệu dùng chung lớp Supabase (chỉ đọc, qua Server Component).

const display = Archivo({
  subsets: ["latin", "vietnamese"],
  axes: ["wdth"],
  variable: "--font-v3-display",
  display: "swap",
});
const body = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-v3-body",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["500"],
  variable: "--font-v3-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VDuyStudio — Trải nghiệm 3D (xem trước)",
  description:
    "Tích xanh chính thống, mở khóa tài khoản & booking báo chí cho TikTok, Facebook, Instagram/Threads. Giao diện 3D xem trước.",
  // Bản xem trước: không cho Google index, tránh trùng nội dung với trang chủ.
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  alternates: { canonical: "/" },
};

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <SmoothScroll />
      {children}
    </div>
  );
}
