// Thông tin liên hệ & thương hiệu dùng chung toàn site.
// Thay các giá trị placeholder bên dưới bằng thông tin thật của bạn.

export const site = {
  name: "VDuyStudio",
  domain: "vduystudio.com",
  tagline: "Verified Identity Studio",
  description:
    "Tích xanh chính thống, mở khóa tài khoản & booking báo chí cho TikTok, Facebook, Instagram/Threads. Minh bạch quy trình, kết quả thật.",
  contact: {
    zalo: "https://zalo.me/0000000000",
    telegram: "https://t.me/vduystudio",
    messenger: "https://m.me/vduystudio",
    phone: "0000 000 000",
    email: "hello@vduystudio.com",
  },
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
} as const;
