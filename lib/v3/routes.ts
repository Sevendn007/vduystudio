// Prefix của UI v3. Trang chủ v3 giờ là "/" chính thức.
export const V3_HOME = (process.env.NEXT_PUBLIC_V3_HOME || "").replace(/\/$/, "");

/** Link trang con: href("/dich-vu/tiktok") → "/dich-vu/tiktok". */
export function href(path: string): string {
  if (!path.startsWith("/")) path = "/" + path;
  return path;
}

/** Anchor trong trang chủ (giữ nguyên hash để cuộn mượt). */
export function hash(id: string): string {
  return V3_HOME ? `${V3_HOME}#${id}` : `#${id}`;
}
