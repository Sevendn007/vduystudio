import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// ---------------------------------------------------------------------------
// Quality tier (quyết định 1 lần khi mount, không đổi khi resize)
// ---------------------------------------------------------------------------
export type Quality = { mobile: boolean; reduced: boolean; dpr: number };

export function detectQuality(): Quality {
  const mobile = window.innerWidth < 760;
  let reduced = false;
  try {
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    reduced = false;
  }
  const dpr = mobile ? 1 : Math.min(1.5, window.devicePixelRatio || 1);
  return { mobile, reduced, dpr };
}

// Font hiển thị: đọc biến --ff-display do layout cung cấp (next/font Archivo),
// nối thêm fallback hệ thống. Không tải font ngoài trong component.
const FONT_FALLBACK = `"Archivo", "Inter", "SF Pro Display", "Helvetica Neue", Arial, sans-serif`;
export function displayFontFamily(el?: Element | null): string {
  try {
    // --ff-display chỉ định nghĩa trong scope .v3 → đọc font-family ĐÃ TÍNH của chính overlay
    // (next/font đăng ký family dưới tên băm, canvas phải dùng đúng tên đó).
    const v = el ? getComputedStyle(el).fontFamily.trim() : "";
    return v ? `${v}, ${FONT_FALLBACK}` : FONT_FALLBACK;
  } catch {
    return FONT_FALLBACK;
  }
}

// ---------------------------------------------------------------------------
// Monogram "VD" = MỘT nét kính liên tục:
//   dấu tích ✓ (V) có tay phải dài vươn lên → tay phải ấy chính là sống của chữ D,
//   nét tiếp tục cong thành bụng D rồi quay về "hôn" sống chữ gần đỉnh dấu tích.
// Không phải chữ in hoa extrude: đây là một đường ống kính tiết diện tròn (hơi dẹt)
// uốn theo spline, hai đầu bo cầu.
// ---------------------------------------------------------------------------
export const TUBE_R = 0.27;
const P_A = new THREE.Vector3(-1.46, 0.34, 0); // đầu tay ngắn của dấu tích
const P_V = new THREE.Vector3(-0.74, -1.22, 0); // đỉnh dấu tích
const P_T = new THREE.Vector3(0.16, 1.26, 0); // đỉnh tay dài = đỉnh sống D
const P_B1 = new THREE.Vector3(1.62, 1.22, 0); // control bụng D (trên)
const P_B2 = new THREE.Vector3(1.66, -1.22, 0); // control bụng D (dưới)
const P_E = new THREE.Vector3(-0.06, -0.96, 0); // bụng D kết thúc, chạm sống chữ

function dir(from: THREE.Vector3, to: THREE.Vector3): THREE.Vector3 {
  return to.clone().sub(from).normalize();
}

export function buildMonogramPath(): THREE.CurvePath<THREE.Vector3> {
  const path = new THREE.CurvePath<THREE.Vector3>();
  const rV = 0.3; // bo đỉnh dấu tích
  const rT = 0.34; // bo góc trên nơi sống D rẽ vào bụng
  const V1 = P_V.clone().add(dir(P_V, P_A).multiplyScalar(rV));
  const V2 = P_V.clone().add(dir(P_V, P_T).multiplyScalar(rV));
  const T1 = P_T.clone().add(dir(P_T, P_V).multiplyScalar(rT));
  const T2 = P_T.clone().add(dir(P_T, P_B1).multiplyScalar(rT));
  path.add(new THREE.LineCurve3(P_A, V1));
  path.add(new THREE.QuadraticBezierCurve3(V1, P_V, V2));
  path.add(new THREE.LineCurve3(V2, T1));
  path.add(new THREE.QuadraticBezierCurve3(T1, P_T, T2));
  path.add(new THREE.CubicBezierCurve3(T2, P_B1, P_B2, P_E));
  return path;
}

// 1 geometry duy nhất (ống + 2 nắp cầu gộp lại) → 1 draw call, 1 MeshTransmissionMaterial.
export function buildMonogramGeometry(hi: boolean): THREE.BufferGeometry {
  const path = buildMonogramPath();
  const tube = new THREE.TubeGeometry(path, hi ? 240 : 130, TUBE_R, hi ? 24 : 14, false);
  const capA = new THREE.SphereGeometry(TUBE_R, hi ? 28 : 16, hi ? 18 : 10);
  capA.translate(P_A.x, P_A.y, P_A.z);
  const capE = new THREE.SphereGeometry(TUBE_R, hi ? 28 : 16, hi ? 18 : 10);
  capE.translate(P_E.x, P_E.y, P_E.z);
  const merged = mergeGeometries([tube, capA, capE], false);
  if (!merged) {
    capA.dispose();
    capE.dispose();
    tube.scale(1, 1, 0.84);
    tube.computeBoundingSphere();
    return tube;
  }
  tube.dispose();
  capA.dispose();
  capE.dispose();
  merged.scale(1, 1, 0.84); // hơi dẹt theo chiều sâu → cảm giác thanh kính đúc, không phải ống nước
  merged.computeBoundingSphere();
  return merged;
}

// ---------------------------------------------------------------------------
// Backdrop typography: canvas 2D vẽ các hàng chữ khổng lồ (font đậm hệ thống),
// tile ngang hoàn hảo (mỗi hàng n đơn vị cách đều W/n) → shader cuộn từng hàng.
// Chỉ dùng kênh alpha làm mask; màu do shader quyết.
// ---------------------------------------------------------------------------
export const TYPE_ROWS = 5;
export const DEFAULT_WORDS = ["VERIFIED", "VDUYSTUDIO", "IDENTITY", "VDUYSTUDIO", "VERIFIED"];

function setFont(ctx: CanvasRenderingContext2D, px: number, family: string) {
  ctx.font = `900 ${px}px ${family}`;
  // Nếu chuỗi font không hợp lệ, canvas giữ font cũ → kiểm tra và dùng fallback an toàn.
  if (!ctx.font.includes(`${px}px`)) ctx.font = `900 ${px}px Arial, Helvetica, sans-serif`;
}

export function drawTypeCanvas(canvas: HTMLCanvasElement, family: string, words: string[] = DEFAULT_WORDS) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#000";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  const rowH = H / TYPE_ROWS;
  for (let r = 0; r < TYPE_ROWS; r++) {
    const word = words[r % words.length];
    const px = Math.round(rowH * 0.74);
    setFont(ctx, px, family);
    const wordW = ctx.measureText(word).width;
    const gap = px * 0.42;
    const dia = px * 0.2;
    const unitW = wordW + gap + dia + gap;
    const n = Math.max(1, Math.floor(W / unitW));
    const spacing = W / n;
    const off = ((r * 0.37 + 0.1) * spacing) % spacing;
    const cy = rowH * (r + 0.52);
    for (let i = -1; i <= n; i++) {
      const x = i * spacing + off;
      ctx.fillText(word, x, cy);
      // dấu ✦ vẽ tay (không phụ thuộc glyph của font)
      const dx = x + wordW + gap + dia / 2;
      ctx.beginPath();
      ctx.moveTo(dx, cy - dia / 2);
      ctx.lineTo(dx + dia / 2, cy);
      ctx.lineTo(dx, cy + dia / 2);
      ctx.lineTo(dx - dia / 2, cy);
      ctx.closePath();
      ctx.fill();
    }
  }
}

export function createTypeTexture(hi: boolean, family: string): { texture: THREE.CanvasTexture; redraw: (words?: string[]) => void } {
  const W = hi ? 2048 : 1024;
  const H = W / 2; // plane 20x10 → tỉ lệ 2:1, chữ không méo
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  let current = DEFAULT_WORDS;
  const redraw = (words?: string[]) => {
    if (words) current = words;
    drawTypeCanvas(canvas, family, current);
    texture.needsUpdate = true;
  };
  redraw();
  return { texture, redraw };
}
