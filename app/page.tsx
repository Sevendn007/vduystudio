import type { Metadata } from "next";
import "./styles/v3-tokens.css";
import "./styles/v3.css";
import "./styles/v3-projects.css";
import { v3FontVars } from "@/lib/v3/fonts";
import SmoothScroll from "@/components/layout/SmoothScroll";
import V3Home from "@/components/v3/V3Home";
import { fetchProjects, fetchFeedbacks, fetchSettings, fetchAllPricing } from "@/lib/v3/data.server";

// ISR: Dữ liệu tự làm mới mỗi 60s, HTML render sẵn dữ liệu thật (tối ưu SEO).
export const revalidate = 60;

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
    <div className={v3FontVars}>
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
