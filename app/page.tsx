import type { Metadata } from "next";
import { Archivo, Be_Vietnam_Pro, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./styles/v3-tokens.css";
import "./styles/v3.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import V3Home from "@/components/v3/V3Home";
import { fetchProjects, fetchFeedbacks, fetchSettings, fetchAllPricing } from "@/lib/v3/data.server";

// ISR: Dữ liệu tự làm mới mỗi 60s, HTML render sẵn dữ liệu thật (tối ưu SEO).
export const revalidate = 60;

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
const serif = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["500"],
  style: ["italic"],
  variable: "--font-v3-serif",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["500"],
  variable: "--font-v3-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VDuyStudio — Tích xanh chính thống & mở khóa tài khoản",
  description:
    "VDuyStudio hỗ trợ tích xanh, mở khóa tài khoản & booking báo chí cho TikTok, Facebook, Instagram/Threads. Minh bạch quy trình, kết quả thật.",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const PRICING_SLUGS = ["tiktok", "facebook", "instagram-threads", "bao-chi", "website"];

export default async function Home() {
  const [projects, feedbacks, settings, pricing] = await Promise.all([
    fetchProjects(),
    fetchFeedbacks(),
    fetchSettings(),
    fetchAllPricing(PRICING_SLUGS),
  ]);

  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} ${serif.variable}`}>
      <SmoothScroll />
      <V3Home
        projects={projects}
        feedbacks={feedbacks}
        settings={settings}
        pricing={pricing}
      />
    </div>
  );
}
