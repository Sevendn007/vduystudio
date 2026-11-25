// Chuẩn hoá chữ hiển thị cho v3 (chỉ trình bày — KHÔNG sửa dữ liệu DB).

const PLACEHOLDER_PRICE = /^(li[eê]n h[eệ]( b[aá]o gi[aá])?|contact( for quote)?|)$/i;

/** Giá đã công bố (không phải "Liên hệ báo giá"/rỗng). */
export function realPrice(p?: string | null): boolean {
  return Boolean(p && !PLACEHOLDER_PRICE.test(p.trim()));
}

/** "30000000" | "30.000.000" → "30.000.000đ"; chuỗi đã có đơn vị (đ, k, tr, VND, $…) giữ nguyên. */
export function fmtPrice(p: string, lang: "vi" | "en" = "vi"): string {
  const s = p.trim();
  if (/^[\d.,\s]+$/.test(s)) {
    const n = Number(s.replace(/\D/g, ""));
    if (Number.isFinite(n) && n > 0) return lang === "en" ? `${n.toLocaleString("en-US")} VND` : `${n.toLocaleString("vi-VN")}đ`;
  }
  return s;
}

/** Số kiểu Việt: 3450 → "3.450". */
export function fmtNum(n: number, lang: "vi" | "en" = "vi"): string {
  return n.toLocaleString(lang === "en" ? "en-US" : "vi-VN");
}

/** Bảo hành có dạng thời hạn rõ ràng (12 tháng, 1 năm, vĩnh viễn, trọn đời…) → đáng hiện ở thẻ tóm tắt. */
export function isTermWarranty(w?: string | null): boolean {
  if (!w) return false;
  return /\d|th[aá]ng|n[aă]m|v[iĩ]nh vi[eễ]n|tr[oọ]n đ[oờ]i|month|year|lifetime/i.test(w);
}

/** "01 — Dịch vụ" → "Dịch vụ" (số chương v3 đánh lại theo thứ tự trang). */
export function stripNo(s: string): string {
  return s.replace(/^\s*\d+\s*[—–-]\s*/, "");
}

/** URL thô → "@handle" (mạng xã hội) hoặc tên miền, bỏ query `?_r=1&_t=…`. */
export function shortUrl(u: string): string {
  try {
    const url = new URL(u.startsWith("http") ? u : `https://${u}`);
    const host = url.hostname.replace(/^www\.|^m\.|^vt\./, "");
    const seg = url.pathname.split("/").filter(Boolean);
    const at = seg.find((x) => x.startsWith("@"));
    if (at) return at;
    if (/(facebook|instagram|threads)\.(com|net)/.test(host) && seg[0] && !/^(profile\.php|share|p|reel|watch)$/.test(seg[0])) return `@${seg[0]}`;
    return host;
  } catch {
    return u;
  }
}

// RegExp constructor: tsconfig target es2017 không cho literal \p{L}.
const NON_LETTER = new RegExp("[^\\p{L}]", "gu");
const WORD_START = new RegExp("(^|[\\s(“\"'/-])(\\p{L})", "gu");

/** Làm gọn caption: rút gọn URL, chữ IN HOA toàn bộ → viết hoa chữ cái đầu mỗi từ. */
export function tidy(s?: string | null): string {
  if (!s) return "";
  let out = s.replace(/(https?:\/\/[^\s]+|(?:www\.)?(?:tiktok|facebook|instagram|threads)\.(?:com|net)\/[^\s]+)/gi, (m) => shortUrl(m));
  out = out.replace(/\s{2,}/g, " ").trim();
  const letters = out.replace(NON_LETTER, "");
  if (letters.length > 3 && letters === letters.toLocaleUpperCase("vi") && letters !== letters.toLocaleLowerCase("vi")) {
    out = out
      .toLocaleLowerCase("vi")
      .replace(WORD_START, (_m, a: string, b: string) => a + b.toLocaleUpperCase("vi"));
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// Bản EN cho chuỗi lấy từ DB (tên dịch vụ, thời gian, bảo hành, vai trò, tiêu đề dự án…).
// Chỉ là lớp trình bày: dịch theo mẫu đã biết, không đụng dữ liệu gốc. Tên riêng giữ nguyên.
// Nội dung tự do (lời feedback) KHÔNG dịch: hiển thị nguyên bản kèm nhãn "Vietnamese".

const VI_CHARS = new RegExp("[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]", "i");

/** Chuỗi còn dấu tiếng Việt (dùng để gắn nhãn "Vietnamese" trên bản EN). */
export function hasVietnamese(s?: string | null): boolean {
  return Boolean(s && VI_CHARS.test(s));
}

const brandName = (b: string) => ({ tiktok: "TikTok", facebook: "Facebook", instagram: "Instagram", threads: "Threads" } as Record<string, string>)[b.toLowerCase()] ?? b;
const plural = (n: string, one: string) => `${n} ${Number(n) === 1 ? one : one + "s"}`;

const VI_EN: [RegExp, string | ((...a: string[]) => string)][] = [
  // thời gian & bảo hành
  [/(\d+)\s*[-–]\s*(\d+)\s*ngày/gi, (_m, a, b) => `${a}–${b} days`],
  [/(\d+)\s*ngày/gi, (_m, a) => plural(a, "day")],
  [/0?(\d+)\s*tháng/gi, (_m, a) => plural(a, "month")],
  [/(\d+)\s*năm/gi, (_m, a) => plural(a, "year")],
  [/không bảo hành/gi, "No warranty"],
  [/theo bảng đầu báo/gi, "Per outlet price list"],
  [/vĩnh viễn|trọn đời/gi, "Lifetime"],
  [/liên hệ báo giá|liên hệ/gi, "Contact us"],
  // tên dịch vụ
  [/^mở khóa tài khoản\s+(\S+)/i, (_m, b) => `${brandName(b)} account recovery`],
  [/^mở khóa livestream\s*(\S*)/i, (_m, b) => `${b ? brandName(b) + " " : ""}livestream unlock`],
  [/^mở khóa giỏ hàng/i, "Shop cart unlock"],
  [/^tích xanh\s+(tiktok|facebook|instagram|threads)\s+chính thống/i, (_m, b) => `Official ${brandName(b)} verification`],
  [/xác minh tích xanh chính chủ/gi, "Official verification"],
  [/^tích xanh\s+(tiktok|facebook|instagram|threads)\s*$/i, (_m, b) => `${brandName(b)} verification`],
  [/^tích xanh\s*$/i, "Verified badge"],
  [/\(a-z\)/gi, "(full service)"],
  [/\(đã có báo chí\)/gi, "(press coverage in place)"],
  [/\bsau\s+(\d+)/gi, (_m, a) => `in ${a}`],
  // tiêu đề dự án
  [/^tích xanh\s+tiktoker\s+/i, "Verified TikToker "],
  [/^tích xanh\s+fanpage\s+/i, "Verified fanpage "],
  [/^tích xanh\s+(?=\S)/i, "Verified "],
  [/^công ty tnhh\s+(.+)$/i, (_m, n) => `${n} Co., Ltd`],
  // vai trò
  [/^ca sĩ\s*$/i, "Singer"],
  [/^nghệ sĩ\s*$/i, "Artist"],
  [/^ca sĩ\s+/i, "Singer "],
  [/^nghệ sĩ\s+/i, "Artist "],
  // từ lẻ còn sót
  [/tích xanh/gi, "verified badge"],
  [/chính (chủ|thống)/gi, "official"],
  [/tài khoản/gi, "account"],
  [/mở khóa/gi, "unlock"],
  [/báo chí/gi, "press"],
];

/** Bản EN của chuỗi DB đã biết mẫu; chuỗi khác (tên riêng, lời feedback) giữ nguyên. */
export function localizeVi(s: string | null | undefined, lang: "vi" | "en"): string {
  const t = (s ?? "").trim();
  if (!t || lang !== "en" || !hasVietnamese(t) && !/ngày|tháng|năm|tiktok|tích xanh/i.test(t)) return t;
  let out = t;
  for (const [re, rep] of VI_EN) out = out.replace(re, rep as string);
  return out.replace(/\s{2,}/g, " ").trim();
}
