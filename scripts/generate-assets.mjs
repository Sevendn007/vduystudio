// Sinh assets tĩnh một lần (npm run assets) — thay cho việc tách sprite
// bằng canvas ở runtime (lib/logoSprites.ts cũ, đã port y nguyên thuật toán):
// - sprites/mark.png     : mark VJ + tích xanh tách nền từ logo.png (hero)
// - sprites/mark-nav.png : bản thu nhỏ 128px cho nav
// - sprites/p1.png, p2.png: 2 hành tinh crop tròn mép feather
// - d1–d4.webp           : ảnh showcase iPhone resize 480w (render tối đa ~240px)
// Khi thay logo.png hoặc d*.png thì chạy lại script và commit output.

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMAGES = path.join(ROOT, "public", "images");
const SPRITES = path.join(IMAGES, "sprites");

// Vùng mark theo tỉ lệ ảnh (đo trên logo 16:9): x 32.2–77.2%, y 11.5–73%.
const MARK = { x: 0.322, y: 0.115, w: 0.45, h: 0.615 };

// Gán nhãn khối liên thông (4 hướng) rồi chỉ giữ: khối không chạm mép dưới,
// đủ lớn tuyệt đối (>= minSize) VÀ đủ lớn tương đối (>= 6% khối lớn nhất).
function keepLargeComponents(mask, w, h, minSize) {
  const n = w * h;
  const label = new Int32Array(n);
  const stack = new Int32Array(n);
  const sizes = [0];
  const touchesBottom = [false];
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
      const p = stack[--top];
      count++;
      if (p >= bottomRow) tb = true;
      const x = p % w;
      if (x > 0 && mask[p - 1] && !label[p - 1]) { label[p - 1] = next; stack[top++] = p - 1; }
      if (x < w - 1 && mask[p + 1] && !label[p + 1]) { label[p + 1] = next; stack[top++] = p + 1; }
      if (p >= w && mask[p - w] && !label[p - w]) { label[p - w] = next; stack[top++] = p - w; }
      if (p < n - w && mask[p + w] && !label[p + w]) { label[p + w] = next; stack[top++] = p + w; }
    }
    sizes[next] = count;
    touchesBottom[next] = tb;
    next++;
  }
  let maxSize = 0;
  for (let l = 1; l < next; l++) if (!touchesBottom[l] && sizes[l] > maxSize) maxSize = sizes[l];
  const keepLabel = new Uint8Array(next);
  for (let l = 1; l < next; l++) {
    keepLabel[l] = !touchesBottom[l] && sizes[l] >= minSize && sizes[l] >= maxSize * 0.06 ? 1 : 0;
  }
  const out = new Uint8Array(n);
  for (let i = 0; i < n; i++) if (keepLabel[label[i]]) out[i] = 1;
  return out;
}

// Lấp các "lỗ" tối nằm hoàn toàn bên trong vùng giữ (không thông ra biên).
function fillHoles(keep, w, h) {
  const n = w * h;
  const outside = new Uint8Array(n);
  const stack = new Int32Array(n);
  let top = 0;
  const push = (q) => {
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
function featherAlpha(keep, w, h) {
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

async function loadLogoRaw() {
  const { data, info } = await sharp(path.join(IMAGES, "logo.png"))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { d: data, W: info.width, H: info.height };
}

async function generateMark(logo) {
  const { d: full, W, H } = logo;
  const sx = (MARK.x * W) | 0;
  const sy = (MARK.y * H) | 0;
  const sw = (MARK.w * W) | 0;
  const sh = (MARK.h * H) | 0;
  const n = sw * sh;
  const d = Buffer.alloc(n * 4);
  for (let y = 0; y < sh; y++) {
    full.copy(d, y * sw * 4, ((sy + y) * W + sx) * 4, ((sy + y) * W + sx + sw) * 4);
  }

  const mask = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const y = Math.floor(i / sw);
    const j = i * 4;
    const L = 0.2126 * d[j] + 0.7152 * d[j + 1] + 0.0722 * d[j + 2];
    // Cứu vòng tròn (ring) bằng ngưỡng thấp (26) ở nửa trên,
    // nhưng chặn dải sáng chạm đáy bằng ngưỡng cao (46) ở 20px cuối.
    const threshold = y > sh - 20 ? 46 : 26;
    if (L > threshold) mask[i] = 1;
  }
  const keep = keepLargeComponents(mask, sw, sh, Math.max(600, (n * 0.0015) | 0));
  fillHoles(keep, sw, sh);
  const alpha = featherAlpha(keep, sw, sh);
  for (let i = 0; i < n; i++) {
    d[i * 4 + 3] = alpha[i];
    // Pixel trong suốt hoàn toàn: xoá luôn RGB (nhiễu sao trời vô hình
    // nhưng làm PNG phình to gấp nhiều lần).
    if (alpha[i] === 0) { d[i * 4] = 0; d[i * 4 + 1] = 0; d[i * 4 + 2] = 0; }
  }

  const img = sharp(d, { raw: { width: sw, height: sh, channels: 4 } });
  await img.clone().png({ compressionLevel: 9 }).toFile(path.join(SPRITES, "mark.png"));
  await img
    .clone()
    .resize({ width: 128 })
    .png({ compressionLevel: 9 })
    .toFile(path.join(SPRITES, "mark-nav.png"));
  console.log(`mark.png ${sw}x${sh} + mark-nav.png 128w`);
}

// Hành tinh trong logo: p1 = mặt trăng nhỏ bên trái, p2 = hành tinh lớn bên phải.
const PLANETS = {
  p1: { fx: 0.2943, fy: 0.5098, fr: 0.0125 },
  p2: { fx: 0.8608, fy: 0.608, fr: 0.045 },
};

function zeroTransparent(d, count) {
  for (let i = 0; i < count; i++) {
    if (d[i * 4 + 3] === 0) { d[i * 4] = 0; d[i * 4 + 1] = 0; d[i * 4 + 2] = 0; }
  }
}

async function generatePlanet(logo, kind) {
  const cfg = PLANETS[kind];
  const { d: full, W, H } = logo;
  const r = cfg.fr * W;
  const R = r * 1.35 + 3;
  const size = Math.ceil(R * 2);
  const ox = Math.round(cfg.fx * W - R);
  const oy = Math.round(cfg.fy * H - R);
  const d = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const sx = ox + x;
      const sy = oy + y;
      if (sx < 0 || sy < 0 || sx >= W || sy >= H) continue;
      full.copy(d, (y * size + x) * 4, (sy * W + sx) * 4, (sy * W + sx) * 4 + 4);
    }
  }
  const c = size / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dist = Math.hypot(x - c, y - c);
      let a = (R - dist) / (R - r * 0.92);
      a = a < 0 ? 0 : a > 1 ? 1 : a;
      d[(y * size + x) * 4 + 3] = (a * a * 255) | 0;
    }
  }
  zeroTransparent(d, size * size);
  await sharp(d, { raw: { width: size, height: size, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(SPRITES, `${kind}.png`));
  console.log(`${kind}.png ${size}x${size}`);
}

async function generateShowcase() {
  for (const name of ["d1", "d2", "d3", "d4"]) {
    const out = path.join(IMAGES, `${name}.webp`);
    const info = await sharp(path.join(IMAGES, `${name}.png`))
      .resize({ width: 480 })
      .webp({ quality: 80 })
      .toFile(out);
    console.log(`${name}.webp ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}KB`);
  }
}

await mkdir(SPRITES, { recursive: true });
const logo = await loadLogoRaw();
await generateMark(logo);
await generatePlanet(logo, "p1");
await generatePlanet(logo, "p2");
await generateShowcase();
console.log("done");
