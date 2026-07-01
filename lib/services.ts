// Dữ liệu dịch vụ tập trung — dùng cho cả landing page và trang chi tiết.
// Sau này trang admin sẽ đọc/ghi đúng cấu trúc này (giá, quy trình, FAQ, dự án).

export type PriceRow = {
  service: string;
  duration: string;
  warranty: string;
  price: string;
};

export type ProcessStep = { title: string; desc: string };
export type Faq = { q: string; a: string };
export type ServiceItem = { title: string; desc: string };
export type Project = { title: string; result: string; tag: string };

export type Platform = {
  slug: string;
  name: string;
  short: string;
  tagline: string;
  accent: string; // màu nhấn của nền tảng
  services: ServiceItem[];
  pricing: PriceRow[];
  process: ProcessStep[];
  faq: Faq[];
  projects: Project[];
};

const commonProcess: ProcessStep[] = [
  {
    title: "Tư vấn & khảo sát",
    desc: "Đánh giá hiện trạng tài khoản, xác định phương án phù hợp và khả năng thành công.",
  },
  {
    title: "Báo giá & cam kết",
    desc: "Báo giá minh bạch, ký cam kết rõ ràng về thời gian và điều kiện bảo hành.",
  },
  {
    title: "Triển khai",
    desc: "Thực hiện theo đúng chính sách nền tảng, cập nhật tiến độ liên tục cho khách.",
  },
  {
    title: "Bàn giao & bảo hành",
    desc: "Bàn giao kết quả, hướng dẫn duy trì và hỗ trợ bảo hành theo cam kết.",
  },
];

export const platforms: Platform[] = [
  {
    slug: "tiktok",
    name: "TikTok",
    short: "TikTok",
    tagline: "Tích xanh, mở khóa tài khoản & mở khóa tính năng bán hàng.",
    accent: "#00f2ea",
    services: [
      {
        title: "Tích xanh chính thống",
        desc: "Xác minh danh tính thật theo đúng chính sách TikTok, tăng độ uy tín và tiếp cận.",
      },
      {
        title: "Mở khóa tài khoản",
        desc: "Khôi phục tài khoản bị khóa, hạn chế hoặc vô hiệu hóa một cách an toàn.",
      },
      {
        title: "Mở khóa Livestream",
        desc: "Kích hoạt lại quyền livestream cho kênh bị chặn hoặc chưa đủ điều kiện.",
      },
      {
        title: "Mở khóa Giỏ hàng (TikTok Shop)",
        desc: "Kích hoạt tính năng giỏ hàng để bắt đầu bán hàng trực tiếp trên TikTok.",
      },
    ],
    pricing: [
      { service: "Tích xanh chính thống", duration: "7–15 ngày", warranty: "12 tháng", price: "Liên hệ báo giá" },
      { service: "Mở khóa tài khoản", duration: "1–3 ngày", warranty: "30 ngày", price: "Liên hệ báo giá" },
      { service: "Mở khóa Livestream", duration: "1–2 ngày", warranty: "30 ngày", price: "Liên hệ báo giá" },
      { service: "Mở khóa Giỏ hàng", duration: "1–3 ngày", warranty: "30 ngày", price: "Liên hệ báo giá" },
    ],
    process: commonProcess,
    faq: [
      {
        q: "Tích xanh có phải chính thống không?",
        a: "Có. Chúng tôi hỗ trợ hồ sơ xác minh theo đúng quy trình của TikTok, không dùng thủ thuật gây rủi ro khóa kênh.",
      },
      {
        q: "Cần chuẩn bị gì để lên tích xanh?",
        a: "Kênh hoạt động ổn định, nội dung sạch và giấy tờ định danh hợp lệ. Chúng tôi sẽ tư vấn chi tiết theo từng trường hợp.",
      },
      {
        q: "Nếu không thành công thì sao?",
        a: "Cam kết hoàn phí theo thỏa thuận nếu không đạt kết quả như cam kết ban đầu.",
      },
    ],
    projects: [
      { title: "@brand.hub — 2.1M follow", result: "Tích xanh sau 18 ngày, mở khóa giỏ hàng", tag: "Tích xanh" },
      { title: "Shop thời trang nữ", result: "Mở khóa Livestream trong 24h", tag: "Livestream" },
      { title: "Kênh review công nghệ", result: "Khôi phục tài khoản bị khóa 48h", tag: "Mở khóa" },
    ],
  },
  {
    slug: "facebook",
    name: "Facebook",
    short: "Facebook",
    tagline: "Tích xanh & mở khóa tài khoản cá nhân / Fanpage.",
    accent: "#1877f2",
    services: [
      {
        title: "Tích xanh chính thống",
        desc: "Xác minh huy hiệu chính thống cho trang cá nhân hoặc Fanpage doanh nghiệp.",
      },
      {
        title: "Mở khóa tài khoản cá nhân",
        desc: "Khôi phục tài khoản Facebook cá nhân bị khóa, checkpoint hoặc vô hiệu hóa.",
      },
      {
        title: "Mở khóa Fanpage",
        desc: "Xử lý Fanpage bị hạn chế, gỡ tích hợp hoặc bị vô hiệu do vi phạm.",
      },
    ],
    pricing: [
      { service: "Tích xanh cá nhân/Fanpage", duration: "5–10 ngày", warranty: "12 tháng", price: "Liên hệ báo giá" },
      { service: "Mở khóa tài khoản cá nhân", duration: "1–3 ngày", warranty: "30 ngày", price: "Liên hệ báo giá" },
      { service: "Mở khóa Fanpage", duration: "1–3 ngày", warranty: "30 ngày", price: "Liên hệ báo giá" },
    ],
    process: commonProcess,
    faq: [
      {
        q: "Tích xanh Facebook áp dụng cho ai?",
        a: "Cá nhân có sức ảnh hưởng, thương hiệu, doanh nghiệp có Fanpage hoạt động hợp lệ đều có thể đăng ký.",
      },
      {
        q: "Fanpage bị vô hiệu hóa có khôi phục được không?",
        a: "Tùy lý do vi phạm. Chúng tôi khảo sát trước, chỉ nhận khi đánh giá có khả năng khôi phục.",
      },
      {
        q: "Có cần cung cấp mật khẩu không?",
        a: "Tùy hạng mục. Với các dịch vụ cần quyền truy cập, chúng tôi có quy trình bảo mật rõ ràng và cam kết.",
      },
    ],
    projects: [
      { title: "Fanpage F&B miền Bắc", result: "Khôi phục Fanpage bị khóa trong 48h", tag: "Fanpage" },
      { title: "Trang cá nhân KOL", result: "Tích xanh chính thống sau 9 ngày", tag: "Tích xanh" },
    ],
  },
  {
    slug: "instagram-threads",
    name: "Instagram / Threads",
    short: "IG / Threads",
    tagline: "Tích xanh chính thống & mở khóa tài khoản Instagram, Threads.",
    accent: "#dd2a7b",
    services: [
      {
        title: "Tích xanh chính thống",
        desc: "Huy hiệu xác minh cho tài khoản Instagram và Threads theo đúng chính sách Meta.",
      },
      {
        title: "Mở khóa tài khoản",
        desc: "Khôi phục tài khoản Instagram/Threads bị khóa, tạm ngưng hoặc hạn chế.",
      },
    ],
    pricing: [
      { service: "Tích xanh chính thống", duration: "5–10 ngày", warranty: "12 tháng", price: "Liên hệ báo giá" },
      { service: "Mở khóa tài khoản", duration: "1–3 ngày", warranty: "30 ngày", price: "Liên hệ báo giá" },
    ],
    process: commonProcess,
    faq: [
      {
        q: "Tích xanh Instagram và Threads có chung không?",
        a: "Với Meta Verified, huy hiệu có thể áp dụng đồng bộ. Chúng tôi tư vấn phương án phù hợp cho từng tài khoản.",
      },
      {
        q: "Tài khoản mới có lên tích được không?",
        a: "Cần đáp ứng điều kiện tối thiểu về hoạt động và định danh. Chúng tôi khảo sát trước khi nhận.",
      },
    ],
    projects: [
      { title: "Studio nhiếp ảnh", result: "Tích xanh IG sau 7 ngày", tag: "Tích xanh" },
      { title: "Tài khoản beauty", result: "Mở khóa tài khoản bị tạm ngưng", tag: "Mở khóa" },
    ],
  },
  {
    slug: "bao-chi",
    name: "Báo chí",
    short: "Báo chí",
    tagline: "Booking báo chí & viết bài PR trên các đầu báo lớn.",
    accent: "#f59e0b",
    services: [
      {
        title: "Booking báo chí",
        desc: "Đăng bài trên các đầu báo uy tín theo nhu cầu thương hiệu, minh bạch bảng giá đầu báo.",
      },
      {
        title: "Viết bài PR chuẩn SEO",
        desc: "Đội ngũ content viết bài PR chuyên nghiệp, đúng thông điệp và tối ưu tìm kiếm.",
      },
    ],
    pricing: [
      { service: "Booking theo đầu báo", duration: "2–5 ngày", warranty: "Giữ bài theo gói", price: "Theo bảng đầu báo" },
      { service: "Viết bài PR chuẩn SEO", duration: "2–3 ngày", warranty: "Chỉnh sửa 2 lần", price: "Liên hệ báo giá" },
    ],
    process: commonProcess,
    faq: [
      {
        q: "Được chọn đầu báo không?",
        a: "Có. Bạn chọn theo bảng đầu báo và ngân sách; chúng tôi tư vấn kênh phù hợp với mục tiêu chiến dịch.",
      },
      {
        q: "Bài viết có được duyệt trước khi đăng?",
        a: "Có. Bạn duyệt nội dung và tiêu đề trước khi đăng chính thức.",
      },
    ],
    projects: [
      { title: "Chiến dịch ra mắt mỹ phẩm", result: "Booking 6 đầu báo lớn", tag: "PR" },
      { title: "Sự kiện khai trương", result: "12 bài PR chuẩn SEO", tag: "Content" },
    ],
  },
];

export function getPlatform(slug: string): Platform | undefined {
  return platforms.find((p) => p.slug === slug);
}
