// Prefix của UI v3. Trang chủ v3 nằm ở V3_HOME; các trang con (dự án, blog,
// dịch vụ) CHƯA có bản v3 → link thẳng sang trang hiện hành (không 404).
export const V3_HOME = (process.env.NEXT_PUBLIC_V3_HOME || "/v3").replace(/\/$/, "");

/** Link trang con. Chưa có bản v3 nên trả path gốc: href("/dich-vu/tiktok") → "/dich-vu/tiktok". */
export function href(path: string): string {
  if (!path.startsWith("/")) path = "/" + path;
  return path;
}

/** Anchor trong trang chủ v3 (giữ nguyên hash để cuộn mượt). */
export function hash(id: string): string {
  return `${V3_HOME}#${id}`;
}
