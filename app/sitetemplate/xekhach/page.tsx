import type { Metadata, Viewport } from "next";
import "./styles/classic.css";
import "./styles/future.css";
import KimLyDemo from "@/components/sitetemplate/xekhach/KimLyDemo";

export const metadata: Metadata = {
  title: "Nhà xe Kim Lý — Mẫu website",
  description:
    "Hai phương án thiết kế website cho nhà xe Kim Lý (Đắk Nông ⇄ Sài Gòn), đổi qua lại ngay trong trang.",
};

export const viewport: Viewport = {
  themeColor: "#030611",
};

export default function KimLyPage() {
  return <KimLyDemo />;
}
