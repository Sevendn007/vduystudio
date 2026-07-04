"use client";

// Tách sprite từ public/images/logo.png bằng canvas (chạy 1 lần, cache):
// - extractMark(): phần mark VJ + tích xanh + vành đai, NỀN TRONG SUỐT.
//   Thuật toán: mask theo độ sáng → giữ các khối liên thông lớn (loại sao
//   nhỏ li ti của nền) → lấp lỗ tối bên trong chữ → feather mềm mép.
// - extractPlanet(): crop tròn 2 hành tinh trong logo, mép feather theo
//   khoảng cách tâm nên giữ được quầng sáng tự nhiên.
// Giữ nguyên pixel gốc của artwork — không vẽ lại, không scale.

const LOGO_SRC = "/images/logo.png";

// Vùng mark theo tỉ lệ ảnh (đo trên logo 16:9): x 32.2–77.2%, y 11.5–73%.
// Mép dưới nằm TRÊN wordmark "VDUYSTUDIO" của ảnh; khối nào chạm mép dưới
// (chữ bị cắt ngang) sẽ bị loại trong keepLargeComponents.
const MARK = { x: 0.322, y: 0.115, w: 0.45, h: 0.615 };

let logoPromise: Promise<HTMLImageElement> | null = null;
function loadLogo(): Promise<HTMLImageElement> {
  if (!logoPromise) {
    logoPromise = new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = () => rej(new Error("logo load failed"));
      img.src = LOGO_SRC;
    });
  }
  return logoPromise;
}

const cache = new Map<string, Promise<string>>();
function memo(key: string, fn: () => Promise<string>): Promise<string> {
  let p = cache.get(key);
  if (!p) {
    p = fn();
    cache.set(key, p);
  }
  return p;
}

// Giữ các khối liên thông (4 hướng) có diện tích >= minSize và KHÔNG chạm
// mép dưới vùng crop (khối chạm mép dưới = chữ wordmark bị cắt ngang → bỏ).
function keepLargeComponents(mask: Uint8Array, w: number, h: number, minSize: number): Uint8Array {
  const n = w * h;
  const out = new Uint8Array(n);
  const seen = new Uint8Array(n);
  const stack = new Int32Array(n);
  const comp = new Int32Array(n);
  const bottomRow = n - w;
  for (let i = 0; i < n; i++) {
    if (!mask[i] || seen[i]) continue;
    let top = 0;
    let count = 0;
    let touchesBottom = false;
    stack[top++] = i;
    seen[i] = 1;
    while (top > 0) {
      const p = stack[--top];
      comp[count++] = p;
      if (p >= bottomRow) touchesBottom = true;
      const x = p % w;
      if (x > 0 && mask[p - 1] && !seen[p - 1]) { seen[p - 1] = 1; stack[top++] = p - 1; }
      if (x < w - 1 && mask[p + 1] && !seen[p + 1]) { seen[p + 1] = 1; stack[top++] = p + 1; }
      if (p >= w && mask[p - w] && !seen[p - w]) { seen[p - w] = 1; stack[top++] = p - w; }
      if (p < n - w && mask[p + w] && !seen[p + w]) { seen[p + w] = 1; stack[top++] = p + w; }
    }
    if (count >= minSize && !touchesBottom) {
      for (let k = 0; k < count; k++) out[comp[k]] = 1;
    }
  }
  return out;
}

// Lấp các "lỗ" tối nằm hoàn toàn bên trong vùng giữ (không thông ra biên).
function fillHoles(keep: Uint8Array, w: number, h: number) {
  const n = w * h;
  const outside = new Uint8Array(n);
  const stack = new Int32Array(n);
  let top = 0;
  const push = (q: number) => {
    if (!keep[q] && !outside[q]) {
      outside[q] = 1;
      stack[top++] = q;
    }
  };
  for (let x = 0; x < w; x++) { push(x); push(n - w + x); }
  for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
  while (top > 0) {
    const p = stack[--top];
    const x = p % w;
    if (x > 0) push(p - 1);
    if (x < w - 1) push(p + 1);
    if (p >= w) push(p - w);
    if (p < n - w) push(p + w);
  }
  for (let i = 0; i < n; i++) if (!keep[i] && !outside[i]) keep[i] = 1;
}

// Box blur tách trục (bán kính 2, chạy 2 lượt) trên mask 0/1 → alpha 0..255.
function featherAlpha(keep: Uint8Array, w: number, h: number): Uint8Array {
  const n = w * h;
  let a = new Float32Array(n);
  for (let i = 0; i < n; i++) a[i] = keep[i] * 255;
  const R = 2;
  const win = R * 2 + 1;
  for (let pass = 0; pass < 2; pass++) {
    const tmp = new Float32Array(n);
    for (let y = 0; y < h; y++) {
      const row = y * w;
      for (let x = 0; x < w; x++) {
        let s = 0;
        for (let k = -R; k <= R; k++) {
          const xx = Math.min(w - 1, Math.max(0, x + k));
          s += a[row + xx];
        }
        tmp[row + x] = s / win;
      }
    }
    const out = new Float32Array(n);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let s = 0;
        for (let k = -R; k <= R; k++) {
          const yy = Math.min(h - 1, Math.max(0, y + k));
          s += tmp[yy * w + x];
        }
        out[y * w + x] = s / win;
      }
    }
    a = out;
  }
  const res = new Uint8Array(n);
  for (let i = 0; i < n; i++) res[i] = a[i] > 255 ? 255 : a[i] < 0 ? 0 : a[i] | 0;
  return res;
}

export function extractMark(): Promise<string> {
  return memo("mark", async () => {
    const img = await loadLogo();
    const W = img.naturalWidth;
    const H = img.naturalHeight;
    const sx = (MARK.x * W) | 0;
    const sy = (MARK.y * H) | 0;
    const sw = (MARK.w * W) | 0;
    const sh = (MARK.h * H) | 0;
    const cv = document.createElement("canvas");
    cv.width = sw;
    cv.height = sh;
    const ctx = cv.getContext("2d");
    if (!ctx) throw new Error("no canvas 2d");
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    const id = ctx.getImageData(0, 0, sw, sh);
    const d = id.data;
    const n = sw * sh;

    const mask = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      const j = i * 4;
      const L = 0.2126 * d[j] + 0.7152 * d[j + 1] + 0.0722 * d[j + 2];
      if (L > 46) mask[i] = 1;
    }
    const keep = keepLargeComponents(mask, sw, sh, Math.max(600, (n * 0.0015) | 0));
    fillHoles(keep, sw, sh);
    const alpha = featherAlpha(keep, sw, sh);
    for (let i = 0; i < n; i++) d[i * 4 + 3] = alpha[i];
    ctx.putImageData(id, 0, 0);
    return cv.toDataURL("image/png");
  });
}

// Hành tinh trong logo: p1 = mặt trăng nhỏ bên trái, p2 = hành tinh lớn bên phải.
const PLANETS = {
  p1: { fx: 0.2943, fy: 0.5098, fr: 0.0125 },
  p2: { fx: 0.8608, fy: 0.608, fr: 0.045 },
} as const;

export function extractPlanet(kind: keyof typeof PLANETS): Promise<string> {
  const cfg = PLANETS[kind];
  return memo(kind, async () => {
    const img = await loadLogo();
    const W = img.naturalWidth;
    const H = img.naturalHeight;
    const r = cfg.fr * W;
    const R = r * 1.35 + 3;
    const size = Math.ceil(R * 2);
    const cv = document.createElement("canvas");
    cv.width = size;
    cv.height = size;
    const ctx = cv.getContext("2d");
    if (!ctx) throw new Error("no canvas 2d");
    ctx.drawImage(img, cfg.fx * W - R, cfg.fy * H - R, size, size, 0, 0, size, size);
    const id = ctx.getImageData(0, 0, size, size);
    const d = id.data;
    const c = size / 2;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dist = Math.hypot(x - c, y - c);
        let a = (R - dist) / (R - r * 0.92);
        a = a < 0 ? 0 : a > 1 ? 1 : a;
        d[(y * size + x) * 4 + 3] = (a * a * 255) | 0;
      }
    }
    ctx.putImageData(id, 0, 0);
    return cv.toDataURL("image/png");
  });
}
