// Nội dung song ngữ cho giao diện HOLO GLASS (trang chủ + khung chung).
// Số liệu/khách hàng giữ nguyên như bản cũ; admin chưa chỉnh được các mục này.

import type { Lang } from "@/lib/i18n";

export const BRANDS = [
  "Bệnh viện Thẩm mỹ Nam An",
  "Mailisa",
  "MQ Skin",
  "Mapstudy",
  "Cà Mèn",
  "Tây Bắc TV",
  "Sypik",
  "Mecowa",
];

export const CLIENTS = [
  "Nghệ sĩ Thanh Hiền",
  "Nghệ sĩ Kim Phương",
  "Nghệ sĩ Bữu Đa",
  "Nghệ sĩ Lê Dương Bảo Lâm",
  "Ca sĩ Đàm Vĩnh Hưng",
  "Ca sĩ Chu Bin",
  "Lộc FUHO",
  "Hằng Du Mục",
  "Cú Đấm Thép",
];

export type Icon3DName =
  | "verify" | "shield" | "unlock" | "megaphone" | "website" | "chat" | "growth" | "handshake"
  | "tiktok" | "facebook" | "instagram" | "threads" | "youtube" | "x" | "messenger" | "press";

export type HomeService = {
  slug: string;
  icons: Icon3DName[];
  name: string;
  desc: string;
  clients: number;
};

export const SERVICES = (lang: Lang): HomeService[] => [
  {
    slug: "tiktok",
    icons: ["tiktok", "verify"],
    name: "TikTok",
    desc: lang === "en"
      ? "Verification badge · account recovery · livestream & shop cart unlocks"
      : "Tích xanh chính thống · mở khóa tài khoản · livestream & giỏ hàng",
    clients: 3450,
  },
  {
    slug: "facebook",
    icons: ["facebook"],
    name: "Facebook",
    desc: lang === "en" ? "Verification badge · personal account & fanpage recovery" : "Tích xanh · mở khóa tài khoản cá nhân & Fanpage",
    clients: 2890,
  },
  {
    slug: "instagram-threads",
    icons: ["instagram", "threads"],
    name: "Instagram / Threads",
    desc: lang === "en" ? "Official badge & account recovery per Meta policy" : "Tích xanh & mở khóa tài khoản theo chính sách Meta",
    clients: 1250,
  },
  {
    slug: "bao-chi",
    icons: ["megaphone"],
    name: lang === "en" ? "Press & PR" : "Báo chí & PR",
    desc: lang === "en" ? "Press booking · SEO-standard PR writing on major outlets" : "Booking báo chí · viết bài PR chuẩn SEO trên đầu báo lớn",
    clients: 850,
  },
  {
    slug: "website",
    icons: ["website"],
    name: "Website & Tools",
    desc: lang === "en" ? "Landing pages · E-commerce · Custom software for SMBs" : "Landing page, Portfolio, Web bán hàng & Tool phần mềm",
    clients: 540,
  },
];

export const STATS = (lang: Lang) => [
  { to: 1200, decimals: 0, suffix: "+", label: lang === "en" ? "Accounts verified" : "Tài khoản đã lên tích" },
  { to: 98, decimals: 0, suffix: "%", label: lang === "en" ? "Success rate" : "Tỉ lệ thành công" },
  { to: 4.9, decimals: 1, suffix: "/5", label: lang === "en" ? "Client rating" : "Đánh giá khách hàng" },
  { to: 3, decimals: 0, suffix: lang === "en" ? "+ yrs" : "+ năm", label: lang === "en" ? "Experience" : "Kinh nghiệm" },
];

export const PROCESS_ICONS: Icon3DName[] = ["chat", "handshake", "shield", "verify"];

export const PLATFORM_NAME: Record<string, string> = {
  tiktok: "TikTok",
  facebook: "Facebook",
  instagram: "Instagram",
  "instagram-threads": "Instagram",
  "bao-chi": "Báo chí",
  website: "Website",
};

const vi = {
  nav: { services: "Dịch vụ", process: "Quy trình", projects: "Dự án", feedback: "Feedback", blog: "Blog", contact: "Liên hệ", menu: "Menu" },
  hero: {
    chip: "✦ Xác minh & bảo vệ tài khoản mạng xã hội",
    h1a: "Uy tín số,",
    h1b: "bắt đầu từ",
    accent: "dấu tích xanh.",
    sub: "Tích xanh chính thống, mở khóa tài khoản & booking báo chí cho",
    rotating: ["TikTok", "Facebook", "Instagram", "Threads"],
    cta1: "Nhận tư vấn miễn phí →",
    cta2: "Xem dự án",
    scroll: "Cuộn để khám phá",
  },
  trusted: "Đồng hành cùng",
  manifesto:
    "Chúng tôi không bán dấu tích. Chúng tôi xây dựng uy tín số: minh bạch quy trình, đúng chính sách nền tảng, kết quả có thể kiểm chứng.",
  services: {
    eyebrow: "01 — Dịch vụ", h2a: "Một đối tác.", h2b: "Năm nền tảng.", clients: "khách hàng", more: "Xem chi tiết",
    lead: "Từ tích xanh, mở khóa tài khoản đến báo chí và website — một đầu mối xử lý trọn gói, đúng chính sách từng nền tảng.",
    kpi1: "khách hàng đã phục vụ", kpi2: "nền tảng hỗ trợ", kpi3: "cam kết bằng văn bản",
    popular: "Phổ biến nhất",
    step1: "Hồ sơ", step2: "Xét duyệt", step3: "Đã xác minh",
    ctaTitle: "Chưa biết chọn gói nào?",
    ctaDesc: "Gửi link tài khoản, chúng tôi kiểm tra miễn phí và báo khả năng thành công ngay trong giờ làm việc.",
    ctaBtn: "Kiểm tra miễn phí", ctaBtn2: "Xem quy trình",
  },
  projects: { eyebrow: "02 — Dự án", h2a: "Kết quả thật.", h2b: "Tích xanh thật.", all: "Xem tất cả dự án →", prev: "Dự án trước", next: "Dự án sau", similar: "Tư vấn dịch vụ tương tự", close: "Đóng" },
  clients: { eyebrow: "03 — Khách hàng", h2: "Nghệ sĩ & thương hiệu đã tin chọn" },
  process: { eyebrow: "04 — Quy trình", h2a: "4 bước.", h2b: "Minh bạch từng bước." },
  feedback: { eyebrow: "05 — Feedback", h2: "Khách hàng nói gì" },
  cta: { h2: "Sẵn sàng bứt phá?", sub: "Tư vấn & báo giá miễn phí, phản hồi trong giờ làm việc.", zalo: "Chat Zalo", messenger: "Messenger" },
  footer: { links: "Liên kết", follow: "Theo dõi", rights: "Bảo lưu mọi quyền." },
};

type Copy = typeof vi;

const en: Copy = {
  nav: { services: "Services", process: "Process", projects: "Projects", feedback: "Feedback", blog: "Blog", contact: "Contact", menu: "Menu" },
  hero: {
    chip: "✦ Social verification & account protection",
    h1a: "Digital trust",
    h1b: "starts with a",
    accent: "blue check.",
    sub: "Official badges, account recovery & press booking for",
    rotating: ["TikTok", "Facebook", "Instagram", "Threads"],
    cta1: "Get a free consultation →",
    cta2: "See our work",
    scroll: "Scroll to explore",
  },
  trusted: "Trusted by",
  manifesto:
    "We don't sell badges. We build digital trust: transparent process, platform-compliant, verifiable results.",
  services: {
    eyebrow: "01 — Services", h2a: "One partner.", h2b: "Five platforms.", clients: "clients", more: "View details",
    lead: "From verification badges and account recovery to press and websites — one team handling it end-to-end, within each platform's policy.",
    kpi1: "clients served", kpi2: "platforms covered", kpi3: "written commitment",
    popular: "Most popular",
    step1: "Profile", step2: "Review", step3: "Verified",
    ctaTitle: "Not sure which plan?",
    ctaDesc: "Send us your account link — we'll check it for free and tell you the success odds within business hours.",
    ctaBtn: "Free check", ctaBtn2: "See the process",
  },
  projects: { eyebrow: "02 — Projects", h2a: "Real results.", h2b: "Real badges.", all: "View all projects →", prev: "Previous project", next: "Next project", similar: "Get a similar service", close: "Close" },
  clients: { eyebrow: "03 — Clients", h2: "Artists & brands who trust us" },
  process: { eyebrow: "04 — Process", h2a: "Four steps.", h2b: "Fully transparent." },
  feedback: { eyebrow: "05 — Feedback", h2: "What clients say" },
  cta: { h2: "Ready to scale?", sub: "Free consultation & quote, reply within business hours.", zalo: "Chat on Zalo", messenger: "Messenger" },
  footer: { links: "Links", follow: "Follow", rights: "All rights reserved." },
};

export function homeCopy(lang: Lang): Copy {
  return lang === "en" ? en : vi;
}
