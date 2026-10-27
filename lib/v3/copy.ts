// Chuỗi RIÊNG của v3 (song ngữ VI/EN). Copy chung (hero, services, stats,
// brands, clients, process…) vẫn lấy từ lib/homeCopy.ts & lib/services.ts.
// heroTag copy từ OptionPremium.tsx (TX là const nội bộ, không export).
import type { Lang } from "@/lib/i18n";

export type StationKey =
  | "hero" | "services" | "trust" | "projects" | "process" | "feedback" | "contact";

type V3Copy = {
  heroTag: string;
  tagline: string;
  simulate: string;          // nhãn "Mô phỏng minh hoạ"
  tryName: string;           // chip "Thử với tên bạn"
  handlePlaceholder: string;
  ctaHandle: (h: string) => string;
  profileFollowers: string;
  priceAnchorFallback: string;
  priceContact: string;      // nhãn khi chưa công bố giá
  quoteZalo: string;
  viewPricing: string;
  scrollHint: string;
  skip: string;
  pricingTitle: string;
  pricingNote: string;
  pricingCols: { service: string; duration: string; warranty: string; price: string };
  kpiRequests: string;
  dock: { zalo: string; messenger: string; pricing: string };
  stations: Record<StationKey, { no: string; journey: string; nav: string }>;
  giant: { results: string };
  allReviews: (n: number) => string;
  collapse: string;
  similar: string;
  lightboxClose: string;
  soundOn: string;
  soundOff: string;
};

const vi: V3Copy = {
  heroTag: "Dịch vụ xác minh & bảo vệ tài khoản mạng xã hội",
  tagline: "Verified Identity Studio",
  simulate: "Mô phỏng minh hoạ",
  tryName: "Thử với tên bạn",
  handlePlaceholder: "tên kênh của bạn",
  ctaHandle: (h) => `Lên tích cho @${h} →`,
  profileFollowers: "2.1Tr theo dõi · 48.6Tr thích",
  priceAnchorFallback: "Tích xanh chính thống · 7–15 ngày · bảo hành 12 tháng",
  priceContact: "Báo giá trong giờ làm việc",
  quoteZalo: "Báo giá Zalo",
  viewPricing: "Xem bảng giá ↓",
  scrollHint: "Cuộn để bay vào studio",
  skip: "Bỏ qua",
  pricingTitle: "Bảng giá nhanh",
  pricingNote: "Giá tham khảo theo hiện trạng tài khoản — nhắn Zalo để nhận báo giá chính xác.",
  pricingCols: { service: "Dịch vụ", duration: "Thời gian", warranty: "Bảo hành", price: "Giá" },
  kpiRequests: "lượt yêu cầu đã xử lý",
  dock: { zalo: "Zalo", messenger: "Messenger", pricing: "Bảng giá" },
  stations: {
    hero: { no: "01", journey: "Khởi hành", nav: "Giới thiệu" },
    services: { no: "02", journey: "Kiểm tra", nav: "Dịch vụ & Giá" },
    trust: { no: "03", journey: "Tin cậy", nav: "Đối tác" },
    projects: { no: "04", journey: "Kết quả", nav: "Dự án" },
    process: { no: "05", journey: "Quy trình", nav: "Quy trình" },
    feedback: { no: "06", journey: "Lắng nghe", nav: "Feedback" },
    contact: { no: "07", journey: "Bứt phá", nav: "Liên hệ" },
  },
  giant: { results: "KẾT QUẢ THẬT" },
  allReviews: (n) => `Xem tất cả ${n} đánh giá`,
  collapse: "Thu gọn",
  similar: "Tư vấn dịch vụ tương tự",
  lightboxClose: "Đóng",
  soundOn: "Bật âm thanh",
  soundOff: "Tắt âm thanh",
};

const en: V3Copy = {
  heroTag: "Social media verification & account protection services",
  tagline: "Verified Identity Studio",
  simulate: "Illustrative simulation",
  tryName: "Try your name",
  handlePlaceholder: "your handle",
  ctaHandle: (h) => `Verify @${h} →`,
  profileFollowers: "2.1M followers · 48.6M likes",
  priceAnchorFallback: "Official verification · 7–15 days · 12-month warranty",
  priceContact: "Quote within business hours",
  quoteZalo: "Get a quote",
  viewPricing: "See pricing ↓",
  scrollHint: "Scroll to enter the studio",
  skip: "Skip",
  pricingTitle: "Quick pricing",
  pricingNote: "Indicative pricing based on your account — message us on Zalo for an exact quote.",
  pricingCols: { service: "Service", duration: "Time", warranty: "Warranty", price: "Price" },
  kpiRequests: "requests handled",
  dock: { zalo: "Zalo", messenger: "Messenger", pricing: "Pricing" },
  stations: {
    hero: { no: "01", journey: "Launch", nav: "Intro" },
    services: { no: "02", journey: "Check", nav: "Services & Pricing" },
    trust: { no: "03", journey: "Trust", nav: "Partners" },
    projects: { no: "04", journey: "Results", nav: "Projects" },
    process: { no: "05", journey: "Process", nav: "Process" },
    feedback: { no: "06", journey: "Listen", nav: "Feedback" },
    contact: { no: "07", journey: "Scale", nav: "Contact" },
  },
  giant: { results: "REAL RESULTS" },
  allReviews: (n) => `See all ${n} reviews`,
  collapse: "Collapse",
  similar: "Ask about a similar service",
  lightboxClose: "Close",
  soundOn: "Sound on",
  soundOff: "Sound off",
};

export function v3Copy(lang: Lang): V3Copy {
  return lang === "en" ? en : vi;
}

// Accent nền tảng cho thẻ dịch vụ: #8b5cf6 (Website, tím) → iris xanh trong v3.
export const V3_ACCENT: Record<string, string> = {
  tiktok: "#5ef2e6",
  facebook: "#6096ff",
  "instagram-threads": "#ec78c8",
  "bao-chi": "#ffbe5c",
  website: "#8ab4ff",
};
