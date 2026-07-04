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

// Gán nhãn khối liên thông (4 hướng) rồi chỉ giữ: khối không chạm mép dưới
// (chạm = chữ wordmark bị cắt ngang), đủ lớn tuyệt đối (>= minSize) VÀ đủ
// lớn tương đối (>= 6% khối lớn nhất) — loại cả sao nền lẫn mảnh vệt rời.
function keepLargeComponents(mask: Uint8Array, w: number, h: number, minSize: number): Uint8Array {
  const n = w * h;
  const label = new Int32Array(n);
  const stack = new Int32Array(n);
  const sizes: number[] = [0];
  const touchesBottom: boolean[] = [false];
  const bottomRow = n - w;
  let next = 1;
  for (let i = 0; i < n; i++) {
    if (!mask[i] || label[i]) continue;
    let top = 0;
    let count = 0;
    let tb = false;
    stack[top++] = i;
    label[i] = next;
    while (top > 0) {
  const uf = new Int32Array(n);
  for (let i = 0; i < n; i++) uf[i] = i;
  function find(i: number) {
    let root = i;
    while (root !== uf[root]) root = uf[root];
    let curr = i;
    while (curr !== root) {
      const t = uf[curr];
      uf[curr] = root;
      curr = t;
    }
    return root;
  }
  function union(i: number, j: number) {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) {
      if (rootI < rootJ) uf[rootJ] = rootI;
      else uf[rootI] = rootJ;
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (mask[i]) {
        const top = y > 0 && mask[i - w];
        const left = x > 0 && mask[i - 1];
        if (top && left) {
          union(label[i - w], label[i - 1]);
          label[i] = find(label[i - w]);
        } else if (top) {
          label[i] = find(label[i - w]);
        } else if (left) {
          label[i] = find(label[i - 1]);
        } else {
          label[i] = next;
          uf[next] = next;
          next++;
        }
      }
    }
  }
  for (let i = 0; i < n; i++) {
    if (mask[i]) label[i] = find(label[i]);
  }
  const sizes = new Int32Array(next);
  for (let i = 0; i < n; i++) {
    if (mask[i]) sizes[label[i]]++;
  }
  let maxSize = 0;
  for (let l = 1; l < next; l++) {
    if (sizes[l] > maxSize) maxSize = sizes[l];
  }
  const keepLabel = new Uint8Array(next);
  for (let l = 1; l < next; l++) {
    // Không dùng touchesBottom để tránh xóa nhầm logo chính. Giữ lại mảnh > 0.5% diện tích lớn nhất.
    keepLabel[l] = sizes[l] >= 20 && sizes[l] >= maxSize * 0.005 ? 1 : 0;
  }
  const out = new Uint8Array(n);
  for (let i = 0; i < n; i++) if (keepLabel[label[i]]) out[i] = 1;
  return out;
}

// Đổi tông màu về xanh ngọc: remap dải hue xanh dương → tím → hồng (185–350°)
// sang teal → cyan (150–195°), giữ độ bão hòa/độ sáng nên chất 3D không đổi.
// excludeCircle: vùng badge tích xanh giữ nguyên màu xanh dương gốc.
function tealify(d: Uint8ClampedArray, w: number, h: number, excludeCircle?: { x: number; y: number; r: number }) {
  const r2 = excludeCircle ? excludeCircle.r * excludeCircle.r : 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (excludeCircle) {
        const dx = x - excludeCircle.x;
        const dy = y - excludeCircle.y;
        if (dx * dx + dy * dy < r2) continue;
      }
      const i = (y * w + x) * 4;
      const r = d[i], g = d[i + 1], b = d[i + 2];
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      const dlt = mx - mn;
      const s = mx === 0 ? 0 : dlt / mx;
      if (s < 0.12 || dlt === 0) continue; // xám/trắng/chrome giữ nguyên
      let hue: number;
      if (mx === r) hue = 60 * (((g - b) / dlt + 6) % 6);
      else if (mx === g) hue = 60 * ((b - r) / dlt + 2);
      else hue = 60 * ((r - g) / dlt + 4);
      if (hue < 185 || hue > 350) continue;
      const nh = (150 + ((hue - 185) / 165) * 45) / 60; // teal 150° → cyan 195°
      const c = dlt;
      const xx = c * (1 - Math.abs((nh % 2) - 1));
      const m = mx - c;
      let nr = 0, ng = 0, nb = 0;
      if (nh < 3) { ng = c; nb = xx; } // 120–180°: xanh lá → cyan
      else { ng = xx; nb = c; }        // 180–240°: cyan → xanh dương
      d[i] = nr + m;
      d[i + 1] = ng + m;
      d[i + 2] = nb + m;
    }
  }
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

// Box blur tách trục (bán kính 3, chạy 2 lượt) trên mask 0/1 → alpha 0..255.
// Trả lại blur mềm mại để khử răng cưa, kết hợp opacity bên CSS để tạo 3D mịn màng (không sọc).
function featherAlpha(keep: Uint8Array, w: number, h: number): Uint8Array {
  const n = w * h;
  let a = new Float32Array(n);
  for (let i = 0; i < n; i++) a[i] = keep[i] * 255;
  const R = 3;
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
      const x = i % sw;
      const y = Math.floor(i / sw);
      // Xóa 8 pixel dưới cùng để an toàn không dính chữ VDUYSTUDIO cũ.
      if (y > sh - 8) {
        mask[i] = 0;
        continue;
      }
      const j = i * 4;
      const L = 0.2126 * d[j] + 0.7152 * d[j + 1] + 0.0722 * d[j + 2];
      // Ngưỡng sáng L > 20 để ăn trọn vòng tròn mờ, kết hợp R=3 blur sẽ cho ra khối mượt nhất.
      if (L > 20) mask[i] = 1;
    }
    const keep = keepLargeComponents(mask, sw, sh, Math.max(600, (n * 0.0015) | 0));
    fillHoles(keep, sw, sh);
    const alpha = featherAlpha(keep, sw, sh);
    for (let i = 0; i < n; i++) d[i * 4 + 3] = alpha[i];
    // Đổi tông tím → xanh ngọc; giữ nguyên màu badge tích xanh (hình tròn
    // Disable tealify to keep original logo colors as requested.
    // tealify(d, sw, sh, { x: sw * 0.709, y: sh * 0.185, r: sw * 0.105 });
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
    // tealify(d, size, size);
    ctx.putImageData(id, 0, 0);
    return cv.toDataURL("image/png");
  });
}
