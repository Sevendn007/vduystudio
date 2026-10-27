import type { Metadata } from "next";
import { Space_Grotesk, Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import "../styles/tokens.css";
import "../styles/holo.css";
import SmoothScroll from "@/components/layout/SmoothScroll";

// UI mới (Holo Glass) — tách riêng ở /v2, UI cũ ở "/" giữ nguyên.
// Font, CSS, Lenis chỉ nạp ở đây nên không ảnh hưởng UI cũ; toàn bộ CSS được scope dưới `.holo`.
// Dữ liệu dùng chung các hàm đọc Supabase sẵn có (chỉ đọc), không đụng backend/DB.

const display = Space_Grotesk({ subsets: ["latin", "vietnamese"], weight: ["500", "700"], variable: "--font-display", display: "swap" });
const body = Be_Vietnam_Pro({ subsets: ["latin", "vietnamese"], weight: ["400", "500", "600"], variable: "--font-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin", "vietnamese"], weight: ["500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "VDuyStudio — Giao diện mới (xem trước)",
  // Bản xem trước: không cho Google index, tránh trùng nội dung với trang chủ.
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  alternates: { canonical: "/" },
};

export default function HoloLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <SmoothScroll />
      {children}
    </div>
  );
}
