import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Archivo } from "next/font/google";
import "./globals.css";
import ChatFab from "@/components/ChatFab";
import { LangProvider } from "@/lib/i18n";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

// Fallback cho Druk Wide Super: Archivo variable (trục width mở rộng tới 125%).
const archivo = Archivo({
  subsets: ["latin", "vietnamese"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#03040c",
};

export const metadata: Metadata = {
  title: "VDuyStudio — Tích xanh chính thống & mở khóa tài khoản",
  description:
    "VDuyStudio hỗ trợ tích xanh, mở khóa tài khoản & booking báo chí cho TikTok, Facebook, Instagram/Threads. Minh bạch quy trình, kết quả thật.",
  metadataBase: new URL("https://vduystudio.com"),
  openGraph: {
    title: "VDuyStudio — Verified Identity Studio",
    description:
      "Tích xanh chính thống, mở khóa tài khoản & booking báo chí cho các nền tảng mạng xã hội.",
    url: "https://vduystudio.com",
    siteName: "VDuyStudio",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${spaceGrotesk.variable} ${archivo.variable}`}
    >
      <body>
        <LangProvider>
          {children}
          <ChatFab />
        </LangProvider>
      </body>
    </html>
  );
}
