import type { Metadata, Viewport } from "next";
import { Inter, Oswald, Anton, Space_Grotesk, Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./styles/tokens.css";
import "./styles/holo.css";
import ChatFab from "@/components/ChatFab";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { LangProvider } from "@/lib/i18n";
import { site } from "@/lib/site";

// Font HOLO GLASS
const display = Space_Grotesk({ subsets: ["latin", "vietnamese"], weight: ["500", "700"], variable: "--font-display", display: "swap" });
const body = Be_Vietnam_Pro({ subsets: ["latin", "vietnamese"], weight: ["400", "500", "600"], variable: "--font-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin", "vietnamese"], weight: ["500"], variable: "--font-mono", display: "swap" });

// Font cũ — chỉ còn dùng cho trang con chưa chuyển giao diện (không preload).
const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter", display: "swap", preload: false });
const oswald = Oswald({ subsets: ["latin", "vietnamese"], weight: ["400", "500", "600", "700"], variable: "--font-oswald", display: "swap", preload: false });
const anton = Anton({ subsets: ["latin", "vietnamese"], weight: "400", variable: "--font-anton", display: "swap", preload: false });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#02040a",
};

const description =
  "VDuyStudio hỗ trợ tích xanh, mở khóa tài khoản & booking báo chí cho TikTok, Facebook, Instagram/Threads. Minh bạch quy trình, kết quả thật.";

export const metadata: Metadata = {
  title: "VDuyStudio — Tích xanh chính thống & mở khóa tài khoản",
  description,
  metadataBase: new URL("https://vduystudio.com"),
  openGraph: {
    title: "VDuyStudio — Verified Identity Studio",
    description: "Uy tín số, bắt đầu từ dấu tích xanh. Tích xanh chính thống, mở khóa tài khoản & booking báo chí.",
    url: "https://vduystudio.com",
    siteName: "VDuyStudio",
    locale: "vi_VN",
    type: "website",
    images: [{ url: "/brand/social/og-image.jpg", width: 1200, height: 630, alt: "VDuyStudio" }],
  },
  twitter: { card: "summary_large_image", images: ["/brand/social/og-image.jpg"] },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "VDuyStudio",
  url: "https://vduystudio.com",
  logo: "https://vduystudio.com/brand/logo/vduy-logo-3d-512.webp",
  image: "https://vduystudio.com/brand/social/og-image.jpg",
  description,
  slogan: "Verified Identity Studio",
  sameAs: Object.entries(site.contact).filter(([k]) => k !== "zalo").map(([, v]) => v),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="vi"
      className={`${display.variable} ${body.variable} ${mono.variable} ${inter.variable} ${oswald.variable} ${anton.variable}`}
    >
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <LangProvider>
          <SmoothScroll />
          {children}
          <ChatFab />
        </LangProvider>
      </body>
    </html>
  );
}
