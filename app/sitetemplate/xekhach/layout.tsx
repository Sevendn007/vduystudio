import type { Metadata } from "next";
import { Archivo, Be_Vietnam_Pro, Chakra_Petch, Oswald, Playfair_Display } from "next/font/google";
import "./styles/kl-base.css";

// Demo template cho khách — không cho index (bản thật sẽ nằm ở domain của nhà xe).
export const metadata: Metadata = {
  title: { default: "Nhà xe Kim Lý — Mẫu website", template: "%s · Demo Kim Lý" },
  description:
    "Hai phương án thiết kế website nhà xe Kim Lý (Đắk Nông ⇄ Sài Gòn) do VDuyStudio thực hiện.",
  robots: { index: false, follow: false, nocache: true },
};

const body = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--kl-ff-body",
  display: "swap",
});
const display = Oswald({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--kl-ff-display",
  display: "swap",
});
// Chakra Petch có subset vietnamese (Orbitron/Rajdhani thì không — không dùng được).
const tech = Chakra_Petch({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--kl-ff-tech",
  display: "swap",
});
// Archivo + Playfair: đúng bộ chữ khổng lồ của trang chủ VDuyStudio
const brand = Archivo({
  subsets: ["latin", "vietnamese"],
  axes: ["wdth"],
  variable: "--kl-ff-brand",
  display: "swap",
});
const serif = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["500"],
  style: ["italic"],
  variable: "--kl-ff-serif",
  display: "swap",
});

export default function KimLyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`kl-root ${body.variable} ${display.variable} ${brand.variable} ${serif.variable} ${tech.variable}`}>
      {children}
    </div>
  );
}
