// Thông tin liên hệ & thương hiệu dùng chung toàn site (song ngữ VI/EN).
// Thay các giá trị placeholder bên dưới bằng thông tin thật của bạn.

import type { Lang } from "@/lib/i18n";

export const site = {
  name: "VDuyStudio",
  domain: "vduystudio.com",
  tagline: "Verified Identity Studio",
  contact: {
    zalo: "https://zalo.me/0000000000",
    telegram: "https://t.me/vduystudio",
    messenger: "https://m.me/vduystudio",
    phone: "0000 000 000",
    email: "hello@vduystudio.com",
  },
} as const;

export type Testimonial = {
  name: string;
  company: string;
  quote: string;
  hue: number;
};

type SiteText = {
  description: string;
  stats: { value: string; label: string }[];
  testimonials: Testimonial[];
};

const vi: SiteText = {
  description:
    "Tích xanh chính thống, mở khóa tài khoản & booking báo chí cho TikTok, Facebook, Instagram/Threads. Minh bạch quy trình, kết quả thật.",
  stats: [
    { value: "1.200+", label: "Tài khoản đã lên tích" },
    { value: "98%", label: "Tỉ lệ thành công" },
    { value: "4.9/5", label: "Đánh giá khách hàng" },
    { value: "3+ năm", label: "Kinh nghiệm" },
  ],
  testimonials: [
    {
      name: "Minh Anh",
      company: "CEO — LuxHouse Cosmetics",
      quote:
        "Lên tích xanh TikTok đúng như cam kết, hỗ trợ nhiệt tình. Doanh thu livestream tăng rõ sau khi có tick.",
      hue: 330,
    },
    {
      name: "Quốc Huy",
      company: "Founder — Huy's Kitchen (F&B)",
      quote:
        "Fanpage bị khóa được xử lý chỉ trong 48 giờ, giá minh bạch. Quá chuyên nghiệp.",
      hue: 210,
    },
    {
      name: "Thu Trang",
      company: "Giám đốc Marketing — Bloom Beauty",
      quote:
        "Team booking báo chí rất chuyên nghiệp, bài viết chất lượng, đúng thông điệp thương hiệu.",
      hue: 160,
    },
  ],
};

const en: SiteText = {
  description:
    "Official verification badges, account recovery & press booking for TikTok, Facebook, Instagram/Threads. Transparent process, real results.",
  stats: [
    { value: "1,200+", label: "Accounts verified" },
    { value: "98%", label: "Success rate" },
    { value: "4.9/5", label: "Client rating" },
    { value: "3+ yrs", label: "Experience" },
  ],
  testimonials: [
    {
      name: "Minh Anh",
      company: "CEO — LuxHouse Cosmetics",
      quote:
        "Got the TikTok blue badge exactly as promised, with dedicated support. Livestream revenue clearly grew after verification.",
      hue: 330,
    },
    {
      name: "Quốc Huy",
      company: "Founder — Huy's Kitchen (F&B)",
      quote:
        "Our locked fanpage was recovered within 48 hours, with transparent pricing. Extremely professional.",
      hue: 210,
    },
    {
      name: "Thu Trang",
      company: "Marketing Director — Bloom Beauty",
      quote:
        "The press booking team is very professional — quality articles that match our brand message.",
      hue: 160,
    },
  ],
};

export function siteText(lang: Lang): SiteText {
  return lang === "en" ? en : vi;
}
