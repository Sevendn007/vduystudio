// Prefix của UI v3. Mọi link nội bộ trong v3 đi qua V3_HOME để khi go-live
// (đổi env / rewrites) không phải sửa từng component.
export const V3_HOME = (process.env.NEXT_PUBLIC_V3_HOME || "/v3").replace(/\/$/, "");

/** Nối một path con vào prefix v3. href("/dich-vu/tiktok") → "/v3/dich-vu/tiktok". */
export function href(path: string): string {
  if (!path.startsWith("/")) path = "/" + path;
  return V3_HOME + path;
}

/** Anchor trong trang chủ v3 (giữ nguyên hash để cuộn mượt). */
export function hash(id: string): string {
  return `${V3_HOME}#${id}`;
}
