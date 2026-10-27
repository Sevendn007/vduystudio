// Dữ liệu CPU dựng MỘT LẦN cho "Particle Nebula Monogram".
// - Monogram VD: vẽ bằng ĐƯỜNG (path) lên canvas 2D — V là dấu tích ✓ (thương hiệu = xác minh),
//   D bo bụng bezier, cả hai nghiêng 11° cho đà chuyển động. Không dùng font → không phụ thuộc asset.
// - Sample pixel sáng → toạ độ đích. Hạt chia 2 lớp: "vỏ" (rim, băng 5px quanh viền, trải dọc trục z
//   thành tường phát sáng) và "khí" (interior, mật độ vón cục theo noise → nhìn như tinh vân chứ không
//   phải sương đều).
// - Vị trí xuất phát: đĩa thiên hà xoắn 3 cánh (toạ độ phẳng; shader sẽ xoay/nghiêng đĩa).

export type MonogramData = {
  target: Float32Array; // vec3 đích (local)
  start: Float32Array; // vec3 trên đĩa xoắn (phẳng, trước khi nghiêng)
  rand: Float32Array; // vec4: delay, size, seed, edge(0|1)
  width: number;
  height: number;
};

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash2(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function vnoise2(x: number, y: number): number {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const a = hash2(ix, iy), b = hash2(ix + 1, iy), c = hash2(ix, iy + 1), d = hash2(ix + 1, iy + 1);
  const t = a + (b - a) * ux, u = c + (d - c) * ux;
  return t + (u - t) * uy;
}
function fbm2(x: number, y: number): number {
  return vnoise2(x, y) * 0.62 + vnoise2(x * 2.1 + 7.3, y * 2.1 + 3.1) * 0.38;
}

// Vẽ monogram: V = dấu tích (tay ngắn trái xuống đỉnh, tay dài vươn lên phải), D bụng bezier.
function drawVD(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  // nghiêng 11° → cảm giác lao tới
  ctx.setTransform(1, 0, -0.11, 1, 78, 0);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "#fff";

  // V — dấu tích
  ctx.lineWidth = 138;
  ctx.beginPath();
  ctx.moveTo(205, 320);
  ctx.lineTo(410, 555);
  ctx.lineTo(715, 118);
  ctx.stroke();

  // D — thân + bụng, bo góc bằng nét viền tròn
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.moveTo(842, 128);
  ctx.lineTo(990, 128);
  ctx.bezierCurveTo(1360, 128, 1360, 572, 990, 572);
  ctx.lineTo(842, 572);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // lỗ của D
  ctx.fillStyle = "#000";
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(976, 250);
  ctx.lineTo(990, 250);
  ctx.bezierCurveTo(1192, 250, 1192, 450, 990, 450);
  ctx.lineTo(976, 450);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

export function buildMonogram(count: number, edgeShare: number, seed = 7): MonogramData {
  const W = 1400, H = 700;
  const UNIT = 5.6 / W; // world units / px → monogram rộng ~4.6 đơn vị
  const rng = mulberry32(seed);
  const gauss = () => rng() + rng() + rng() - 1.5;

  const edge: number[] = [];
  const inner: number[] = [];
  let minX = W, maxX = 0, minY = H, maxY = 0;

  if (typeof document !== "undefined") {
    const cv = document.createElement("canvas");
    cv.width = W;
    cv.height = H;
    const ctx = cv.getContext("2d", { willReadFrequently: true });
    if (ctx) {
      drawVD(ctx, W, H);
      const img = ctx.getImageData(0, 0, W, H).data;
      const mask = new Uint8Array(W * H);
      for (let i = 0; i < W * H; i++) mask[i] = img[i * 4] > 127 ? 1 : 0;
      const B = 5; // bề dày băng viền (px canvas)
      for (let y = B; y < H - B; y++) {
        for (let x = B; x < W - B; x++) {
          const i = y * W + x;
          if (!mask[i]) continue;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          const isEdge = !mask[i - B] || !mask[i + B] || !mask[i - B * W] || !mask[i + B * W];
          (isEdge ? edge : inner).push(i);
        }
      }
    }
  }
  // Dự phòng (không có canvas 2D): một dải elip để không trống màn
  if (inner.length === 0 || edge.length === 0) {
    minX = 200; maxX = 1200; minY = 150; maxY = 550;
    for (let k = 0; k < 20000; k++) {
      const a = rng() * Math.PI * 2, r = 0.6 + rng() * 0.4;
      const x = Math.round(700 + Math.cos(a) * 500 * r), y = Math.round(350 + Math.sin(a) * 200 * r);
      (r > 0.95 ? edge : inner).push(y * W + x);
    }
  }

  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  const target = new Float32Array(count * 3);
  const start = new Float32Array(count * 3);
  const rand = new Float32Array(count * 4);
  const nEdge = Math.floor(count * edgeShare);

  for (let i = 0; i < count; i++) {
    const isEdge = i < nEdge;
    let px = 0, py = 0;
    if (isEdge) {
      const idx = edge[(rng() * edge.length) | 0];
      px = idx % W; py = (idx / W) | 0;
    } else {
      // khí vón cục: chấp nhận theo noise → chỗ dày chỗ mỏng như tinh vân
      for (let tries = 0; tries < 8; tries++) {
        const idx = inner[(rng() * inner.length) | 0];
        px = idx % W; py = (idx / W) | 0;
        const n = fbm2(px * 0.012, py * 0.012);
        if (rng() < 0.15 + 0.85 * n) break;
      }
    }
    const x = (px + rng() - 0.5 - cx) * UNIT;
    const y = -(py + rng() - 0.5 - cy) * UNIT;
    // vỏ: trải đều theo z thành "tường" phát sáng; khí: dày ở giữa (phân bố tam giác)
    const z = isEdge ? (rng() * 2 - 1) * 0.3 : (rng() + rng() - 1) * 0.3;
    target[i * 3] = x; target[i * 3 + 1] = y; target[i * 3 + 2] = z;

    // đĩa thiên hà 3 cánh (phẳng)
    const r = 0.5 + Math.pow(rng(), 0.55) * 7.5;
    const arm = i % 3;
    const th = arm * (Math.PI * 2 / 3) + r * 0.7 + gauss() * 0.32;
    start[i * 3] = Math.cos(th) * r;
    start[i * 3 + 1] = Math.sin(th) * r;
    start[i * 3 + 2] = gauss() * 0.15 * (1.5 - r / 8);

    rand[i * 4] = rng();
    rand[i * 4 + 1] = rng();
    rand[i * 4 + 2] = rng();
    rand[i * 4 + 3] = isEdge ? 1 : 0;
  }

  return { target, start, rand, width: (maxX - minX) * UNIT, height: (maxY - minY) * UNIT };
}

export type StarData = { position: Float32Array; size: Float32Array; seed: Float32Array };

export function buildStars(count: number, seed = 11): StarData {
  const rng = mulberry32(seed);
  const position = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const sd = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    position[i * 3] = (rng() * 2 - 1) * 24;
    position[i * 3 + 1] = (rng() * 2 - 1) * 15;
    position[i * 3 + 2] = -6 - rng() * 20;
    const s = rng();
    size[i] = 0.35 + s * s * 1.4;
    sd[i] = rng();
  }
  return { position, size, seed: sd };
}
