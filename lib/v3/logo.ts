// Hình học logo v3 (một nguồn duy nhất cho logo phẳng SVG lẫn bản 3D ở hero).
// viewBox 0 0 100 100 — dấu tích ✓ (cobalt) có tay dài vươn lên thành sống chữ D (mực).
export const LOGO_CHECK: [number, number][] = [[12, 52], [32, 76], [50, 18]];
export const LOGO_CHECK_D = "M12 52 L32 76 L50 18";
export const LOGO_D_D = "M48 18 H58 C78 18 90 32 90 50 C90 68 78 82 58 82 H40";
export const LOGO_CHECK_W = 13;
export const LOGO_D_W = 11;

/** Nét chữ D dạng polyline (lấy mẫu bezier) cho bản 3D. */
export function logoDPoints(seg = 20): [number, number][] {
  const pts: [number, number][] = [[48, 18], [58, 18]];
  const cubic = (p0: number[], p1: number[], p2: number[], p3: number[]) => {
    for (let i = 1; i <= seg; i++) {
      const t = i / seg, u = 1 - t;
      pts.push([
        u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
        u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
      ]);
    }
  };
  cubic([58, 18], [78, 18], [90, 32], [90, 50]);
  cubic([90, 50], [90, 68], [78, 82], [58, 82]);
  pts.push([40, 82]);
  return pts;
}
