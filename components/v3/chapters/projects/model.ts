import type { DbProject } from "@/lib/data";
import type { Lang } from "@/lib/i18n";
import { localizeVi, shortUrl, tidy } from "@/lib/v3/format";
import { DEFAULT_PROJECTS } from "@/components/premiumKit";
import { platformLabel } from "../../ui/PlatformMark";

// Chuẩn hoá một dòng `projects` của DB thành dữ liệu hiển thị ổn định: DB không đồng đều
// (result khi là link hồ sơ, khi là ghi chú, khi null; tag dài ngắn tuỳ ý) nên mọi biến thể giao diện
// đọc qua đây, không đọc thô.
export type ProjectView = {
  id: string;
  title: string;
  platform: string | null;
  platformName: string;
  handle: string | null; // @tên tài khoản (khi result là link)
  href: string | null;
  note: string | null; // result dạng ghi chú (không phải link)
  outcome: string | null; // tag đã bỏ phần "sau N ngày"
  days: number | null;
  date: string | null;
  image: string;
};

// DB nhập không thống nhất (khi IN HOA, khi Viết Hoa Từng Chữ, khi viết thường): đưa về dạng câu, giữ "(A-Z)".
const sentence = (s: string) => {
  if (!s) return s;
  const words = s.split(" ").map((w, i) => (/^\(?[A-Z]-[A-Z]\)?$/.test(w) ? w : i === 0 ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase()));
  return words.join(" ").replace(/tiktok/gi, "TikTok").replace(/facebook/gi, "Facebook").replace(/instagram/gi, "Instagram");
};
// "6/2025" → "06/2025" cho đồng nhất với "09/2024"; ngày đầy đủ (02/07/2026) giữ nguyên.
const normDate = (d: string | null) => (d && /^\d\/\d{4}$/.test(d.trim()) ? `0${d.trim()}` : d);

const isUrl = (s: string) => /^https?:\/\//i.test(s) || /^(www\.)?(tiktok|facebook|instagram|threads)\.(com|net)\//i.test(s);

export function toView(p: DbProject, lang: Lang, i: number): ProjectView {
  const result = (p.result ?? "").trim();
  const url = result && isUrl(result);
  let tag = localizeVi(tidy(p.tag), lang);
  let days: number | null = null;
  const m = (p.tag ?? "").match(/sau\s*(\d+)\s*ng[àa]y|in\s*(\d+)\s*days/i);
  if (m) {
    days = Number(m[1] ?? m[2]);
    tag = localizeVi(tidy((p.tag ?? "").replace(/\s*(sau\s*\d+\s*ng[àa]y|in\s*\d+\s*days)\s*$/i, "")), lang);
  }
  return {
    id: p.id || String(i),
    title: localizeVi(tidy(p.title), lang),
    platform: p.platform,
    platformName: platformLabel(p.platform),
    handle: url ? shortUrl(result) : null,
    href: url ? (result.startsWith("http") ? result : `https://${result}`) : null,
    note: !url && result ? tidy(result) : null,
    outcome: tag ? sentence(tag) : null,
    days,
    date: normDate(p.date),
    image: p.image_url || DEFAULT_PROJECTS[i % DEFAULT_PROJECTS.length].image_url || `/images/d${(i % 4) + 1}.webp`,
  };
}

export const projectLabels = (lang: Lang) =>
  lang === "en"
    ? { platform: "Platform", account: "Account", result: "Outcome", time: "Delivered in", days: (n: number) => (n === 1 ? "1 day" : `${n} days`), open: "View profile", prev: "Previous", next: "Next", date: "Completed" }
    : { platform: "Nền tảng", account: "Tài khoản", result: "Kết quả", time: "Hoàn thành sau", days: (n: number) => `${n} ngày`, open: "Xem trang", prev: "Trước", next: "Sau", date: "Hoàn thành" };
