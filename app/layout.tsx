import type { Metadata } from "next";
import { Inter, Poppins, Space_Grotesk, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "vduystudio — Tích xanh chính thống & mở khóa tài khoản",
  description:
    "vduystudio hỗ trợ tích xanh, mở khóa tài khoản & booking báo chí cho TikTok, Facebook, Instagram/Threads. Minh bạch quy trình, kết quả thật.",
  metadataBase: new URL("https://vduystudio.com"),
  openGraph: {
    title: "vduystudio — Verified Identity Studio",
    description:
      "Tích xanh chính thống, mở khóa tài khoản & booking báo chí cho các nền tảng mạng xã hội.",
    url: "https://vduystudio.com",
    siteName: "vduystudio",
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
      className={`${inter.variable} ${poppins.variable} ${spaceGrotesk.variable} ${instrumentSerif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
