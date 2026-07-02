// Dữ liệu dịch vụ tập trung (song ngữ VI/EN) — dùng cho landing và trang chi tiết.
// Sau này trang admin sẽ đọc/ghi đúng cấu trúc này (giá, quy trình, FAQ, dự án).

import type { Lang } from "@/lib/i18n";

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

const processVi: ProcessStep[] = [
  { title: "Tư vấn & khảo sát", desc: "Đánh giá hiện trạng tài khoản, xác định phương án phù hợp và khả năng thành công." },
  { title: "Báo giá & cam kết", desc: "Báo giá minh bạch, ký cam kết rõ ràng về thời gian và điều kiện bảo hành." },
  { title: "Triển khai", desc: "Thực hiện theo đúng chính sách nền tảng, cập nhật tiến độ liên tục cho khách." },
  { title: "Bàn giao & bảo hành", desc: "Bàn giao kết quả, hướng dẫn duy trì và hỗ trợ bảo hành theo cam kết." },
];

const processEn: ProcessStep[] = [
  { title: "Consultation & audit", desc: "We assess your account's current state, define the right approach and success likelihood." },
  { title: "Quote & commitment", desc: "Transparent pricing with a written commitment on timeline and warranty terms." },
  { title: "Execution", desc: "Carried out strictly within platform policies, with continuous progress updates." },
  { title: "Handover & warranty", desc: "Results delivered with maintenance guidance and warranty support as committed." },
];

const contactPriceVi = "Liên hệ báo giá";
const contactPriceEn = "Contact for quote";

const platformsVi: Platform[] = [
  {
    slug: "tiktok",
    name: "TikTok",
    short: "TikTok",
    tagline: "Tích xanh, mở khóa tài khoản & mở khóa tính năng bán hàng.",
    accent: "#00f2ea",
    services: [
      { title: "Tích xanh chính thống", desc: "Xác minh danh tính thật theo đúng chính sách TikTok, tăng độ uy tín và tiếp cận." },
      { title: "Mở khóa tài khoản", desc: "Khôi phục tài khoản bị khóa, hạn chế hoặc vô hiệu hóa một cách an toàn." },
      { title: "Mở khóa Livestream", desc: "Kích hoạt lại quyền livestream cho kênh bị chặn hoặc chưa đủ điều kiện." },
      { title: "Mở khóa Giỏ hàng (TikTok Shop)", desc: "Kích hoạt tính năng giỏ hàng để bắt đầu bán hàng trực tiếp trên TikTok." },
    ],
    pricing: [
      { service: "Tích xanh chính thống", duration: "7–15 ngày", warranty: "12 tháng", price: contactPriceVi },
      { service: "Mở khóa tài khoản", duration: "1–3 ngày", warranty: "30 ngày", price: contactPriceVi },
      { service: "Mở khóa Livestream", duration: "1–2 ngày", warranty: "30 ngày", price: contactPriceVi },
      { service: "Mở khóa Giỏ hàng", duration: "1–3 ngày", warranty: "30 ngày", price: contactPriceVi },
    ],
    process: processVi,
    faq: [
      { q: "Tích xanh có phải chính thống không?", a: "Có. Chúng tôi hỗ trợ hồ sơ xác minh theo đúng quy trình của TikTok, không dùng thủ thuật gây rủi ro khóa kênh." },
      { q: "Cần chuẩn bị gì để lên tích xanh?", a: "Kênh hoạt động ổn định, nội dung sạch và giấy tờ định danh hợp lệ. Chúng tôi sẽ tư vấn chi tiết theo từng trường hợp." },
      { q: "Nếu không thành công thì sao?", a: "Cam kết hoàn phí theo thỏa thuận nếu không đạt kết quả như cam kết ban đầu." },
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
      { title: "Tích xanh chính thống", desc: "Xác minh huy hiệu chính thống cho trang cá nhân hoặc Fanpage doanh nghiệp." },
      { title: "Mở khóa tài khoản cá nhân", desc: "Khôi phục tài khoản Facebook cá nhân bị khóa, checkpoint hoặc vô hiệu hóa." },
      { title: "Mở khóa Fanpage", desc: "Xử lý Fanpage bị hạn chế, gỡ tích hợp hoặc bị vô hiệu do vi phạm." },
    ],
    pricing: [
      { service: "Tích xanh cá nhân/Fanpage", duration: "5–10 ngày", warranty: "12 tháng", price: contactPriceVi },
      { service: "Mở khóa tài khoản cá nhân", duration: "1–3 ngày", warranty: "30 ngày", price: contactPriceVi },
      { service: "Mở khóa Fanpage", duration: "1–3 ngày", warranty: "30 ngày", price: contactPriceVi },
    ],
    process: processVi,
    faq: [
      { q: "Tích xanh Facebook áp dụng cho ai?", a: "Cá nhân có sức ảnh hưởng, thương hiệu, doanh nghiệp có Fanpage hoạt động hợp lệ đều có thể đăng ký." },
      { q: "Fanpage bị vô hiệu hóa có khôi phục được không?", a: "Tùy lý do vi phạm. Chúng tôi khảo sát trước, chỉ nhận khi đánh giá có khả năng khôi phục." },
      { q: "Có cần cung cấp mật khẩu không?", a: "Tùy hạng mục. Với các dịch vụ cần quyền truy cập, chúng tôi có quy trình bảo mật rõ ràng và cam kết." },
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
      { title: "Tích xanh chính thống", desc: "Huy hiệu xác minh cho tài khoản Instagram và Threads theo đúng chính sách Meta." },
      { title: "Mở khóa tài khoản", desc: "Khôi phục tài khoản Instagram/Threads bị khóa, tạm ngưng hoặc hạn chế." },
    ],
    pricing: [
      { service: "Tích xanh chính thống", duration: "5–10 ngày", warranty: "12 tháng", price: contactPriceVi },
      { service: "Mở khóa tài khoản", duration: "1–3 ngày", warranty: "30 ngày", price: contactPriceVi },
    ],
    process: processVi,
    faq: [
      { q: "Tích xanh Instagram và Threads có chung không?", a: "Với Meta Verified, huy hiệu có thể áp dụng đồng bộ. Chúng tôi tư vấn phương án phù hợp cho từng tài khoản." },
      { q: "Tài khoản mới có lên tích được không?", a: "Cần đáp ứng điều kiện tối thiểu về hoạt động và định danh. Chúng tôi khảo sát trước khi nhận." },
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
      { title: "Booking báo chí", desc: "Đăng bài trên các đầu báo uy tín theo nhu cầu thương hiệu, minh bạch bảng giá đầu báo." },
      { title: "Viết bài PR chuẩn SEO", desc: "Đội ngũ content viết bài PR chuyên nghiệp, đúng thông điệp và tối ưu tìm kiếm." },
    ],
    pricing: [
      { service: "Booking theo đầu báo", duration: "2–5 ngày", warranty: "Giữ bài theo gói", price: "Theo bảng đầu báo" },
      { service: "Viết bài PR chuẩn SEO", duration: "2–3 ngày", warranty: "Chỉnh sửa 2 lần", price: contactPriceVi },
    ],
    process: processVi,
    faq: [
      { q: "Được chọn đầu báo không?", a: "Có. Bạn chọn theo bảng đầu báo và ngân sách; chúng tôi tư vấn kênh phù hợp với mục tiêu chiến dịch." },
      { q: "Bài viết có được duyệt trước khi đăng?", a: "Có. Bạn duyệt nội dung và tiêu đề trước khi đăng chính thức." },
    ],
    projects: [
      { title: "Chiến dịch ra mắt mỹ phẩm", result: "Booking 6 đầu báo lớn", tag: "PR" },
      { title: "Sự kiện khai trương", result: "12 bài PR chuẩn SEO", tag: "Content" },
    ],
  },
];

const platformsEn: Platform[] = [
  {
    slug: "tiktok",
    name: "TikTok",
    short: "TikTok",
    tagline: "Verification badge, account recovery & seller feature unlocks.",
    accent: "#00f2ea",
    services: [
      { title: "Official verification badge", desc: "Genuine identity verification following TikTok policy — boosting credibility and reach." },
      { title: "Account recovery", desc: "Safely restore accounts that are locked, restricted or deactivated." },
      { title: "Livestream unlock", desc: "Reactivate livestream permission for blocked or not-yet-eligible channels." },
      { title: "Shop cart unlock (TikTok Shop)", desc: "Activate the shopping cart feature to start selling directly on TikTok." },
    ],
    pricing: [
      { service: "Official verification badge", duration: "7–15 days", warranty: "12 months", price: contactPriceEn },
      { service: "Account recovery", duration: "1–3 days", warranty: "30 days", price: contactPriceEn },
      { service: "Livestream unlock", duration: "1–2 days", warranty: "30 days", price: contactPriceEn },
      { service: "Shop cart unlock", duration: "1–3 days", warranty: "30 days", price: contactPriceEn },
    ],
    process: processEn,
    faq: [
      { q: "Is the badge officially issued?", a: "Yes. We prepare verification dossiers following TikTok's official process — no tricks that risk your channel." },
      { q: "What do I need to get verified?", a: "A stable, clean-content channel and valid identity documents. We advise in detail case by case." },
      { q: "What if it doesn't succeed?", a: "Refund is committed per agreement if the promised result isn't achieved." },
    ],
    projects: [
      { title: "@brand.hub — 2.1M followers", result: "Verified in 18 days, shop cart unlocked", tag: "Verified" },
      { title: "Women's fashion shop", result: "Livestream unlocked within 24h", tag: "Livestream" },
      { title: "Tech review channel", result: "Locked account recovered in 48h", tag: "Recovery" },
    ],
  },
  {
    slug: "facebook",
    name: "Facebook",
    short: "Facebook",
    tagline: "Verification badge & recovery for personal accounts / fanpages.",
    accent: "#1877f2",
    services: [
      { title: "Official verification badge", desc: "Official badge verification for personal profiles or business fanpages." },
      { title: "Personal account recovery", desc: "Restore personal Facebook accounts that are locked, checkpointed or disabled." },
      { title: "Fanpage recovery", desc: "Resolve restricted fanpages, remove integration issues or policy-violation disables." },
    ],
    pricing: [
      { service: "Personal/Fanpage badge", duration: "5–10 days", warranty: "12 months", price: contactPriceEn },
      { service: "Personal account recovery", duration: "1–3 days", warranty: "30 days", price: contactPriceEn },
      { service: "Fanpage recovery", duration: "1–3 days", warranty: "30 days", price: contactPriceEn },
    ],
    process: processEn,
    faq: [
      { q: "Who can get the Facebook badge?", a: "Influential individuals, brands and businesses with a legitimately operating fanpage can apply." },
      { q: "Can a disabled fanpage be recovered?", a: "It depends on the violation. We audit first and only take cases we judge recoverable." },
      { q: "Do I need to share my password?", a: "Depends on the service. Where access is needed, we follow a clear, committed security protocol." },
    ],
    projects: [
      { title: "Northern F&B fanpage", result: "Locked fanpage recovered in 48h", tag: "Fanpage" },
      { title: "KOL personal profile", result: "Officially verified in 9 days", tag: "Verified" },
    ],
  },
  {
    slug: "instagram-threads",
    name: "Instagram / Threads",
    short: "IG / Threads",
    tagline: "Official verification & account recovery for Instagram, Threads.",
    accent: "#dd2a7b",
    services: [
      { title: "Official verification badge", desc: "Verified badge for Instagram and Threads accounts per Meta policy." },
      { title: "Account recovery", desc: "Restore Instagram/Threads accounts that are locked, suspended or restricted." },
    ],
    pricing: [
      { service: "Official verification badge", duration: "5–10 days", warranty: "12 months", price: contactPriceEn },
      { service: "Account recovery", duration: "1–3 days", warranty: "30 days", price: contactPriceEn },
    ],
    process: processEn,
    faq: [
      { q: "Do Instagram and Threads badges come together?", a: "With Meta Verified the badge can apply across both. We advise the right approach per account." },
      { q: "Can new accounts get verified?", a: "Minimum activity and identity conditions apply. We audit before accepting." },
    ],
    projects: [
      { title: "Photography studio", result: "IG verified in 7 days", tag: "Verified" },
      { title: "Beauty account", result: "Suspended account recovered", tag: "Recovery" },
    ],
  },
  {
    slug: "bao-chi",
    name: "Press & PR",
    short: "Press",
    tagline: "Press booking & PR article writing on major news outlets.",
    accent: "#f59e0b",
    services: [
      { title: "Press booking", desc: "Publish on reputable news outlets to fit your brand, with transparent outlet pricing." },
      { title: "SEO-standard PR writing", desc: "Professional content team writing PR articles on-message and search-optimized." },
    ],
    pricing: [
      { service: "Booking per outlet", duration: "2–5 days", warranty: "Retention per package", price: "Per outlet list" },
      { service: "SEO-standard PR writing", duration: "2–3 days", warranty: "2 revisions", price: contactPriceEn },
    ],
    process: processEn,
    faq: [
      { q: "Can I choose the outlets?", a: "Yes. You pick from the outlet list and budget; we advise the channels that fit your campaign goals." },
      { q: "Do I approve articles before publishing?", a: "Yes. You approve the content and headline before official publication." },
    ],
    projects: [
      { title: "Cosmetics launch campaign", result: "Booked 6 major outlets", tag: "PR" },
      { title: "Grand opening event", result: "12 SEO-standard PR articles", tag: "Content" },
    ],
  },
];

// Quy trình 4 bước dùng chung cho mọi giao diện.
export function getProcess(lang: Lang = "vi"): ProcessStep[] {
  return lang === "en" ? processEn : processVi;
}

export function getPlatforms(lang: Lang = "vi"): Platform[] {
  return lang === "en" ? platformsEn : platformsVi;
}

export function getPlatform(slug: string, lang: Lang = "vi"): Platform | undefined {
  return getPlatforms(lang).find((p) => p.slug === slug);
}

// Giữ export cũ (mặc định tiếng Việt) cho chỗ nào còn import trực tiếp.
export const platforms = platformsVi;
