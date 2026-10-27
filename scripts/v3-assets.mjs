// Sinh asset cho canvas WebGL của v3 (chạy 1 lần, commit kết quả vào
// public/brand/v3/). Dùng sharp (devDep). Nguồn: bộ render VD đã có.
//   node scripts/v3-assets.mjs
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SEQ0 = path.join(ROOT, "public/brand/sequence/desktop/turn_000.webp");
const LOGO = path.join(ROOT, "public/brand/logo/vduy-logo-3d-1024.webp");
const OUT = path.join(ROOT, "public/brand/v3");

async function ensureOut() { await fs.mkdir(OUT, { recursive: true }); }

// 1) logo-points.bin — ~12k điểm từ pixel sáng của frame 0 (Int16 x,y + Uint8 r,g,b).
async function points() {
  const img = sharp(SEQ0);
  const { width, height } = await img.metadata();
  const { data } = await img.raw().toBuffer({ resolveWithObject: true });
  const ch = data.length / (width * height); // 3 (RGB nền đen)
  const cand = [];
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      const i = (y * width + x) * ch;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;
      if (luma > 40) cand.push([x, y, r, g, b]);
    }
  }
  const TARGET = 12000;
  const step = Math.max(1, Math.floor(cand.length / TARGET));
  const picked = cand.filter((_, k) => k % step === 0).slice(0, TARGET);
  const buf = Buffer.alloc(picked.length * (2 + 2 + 3));
  let o = 0;
  for (const [x, y, r, g, b] of picked) {
    // chuẩn hoá về [-1,1] theo chiều rộng/cao, lưu Int16 *10000
    const nx = ((x / width) * 2 - 1);
    const ny = -((y / height) * 2 - 1);
    buf.writeInt16LE(Math.round(nx * 10000), o); o += 2;
    buf.writeInt16LE(Math.round(ny * 10000), o); o += 2;
    buf.writeUInt8(r, o++); buf.writeUInt8(g, o++); buf.writeUInt8(b, o++);
  }
  await fs.writeFile(path.join(OUT, "logo-points.bin"), buf);
  console.log("logo-points.bin", picked.length, "points", buf.length, "bytes");
}

// 2) glow (blur) + hi (highlight) từ frame 0.
async function glowHi() {
  await sharp(SEQ0).resize(512).blur(14).modulate({ brightness: 1.3 })
    .webp({ quality: 82 }).toFile(path.join(OUT, "logo-glow-512.webp"));
  await sharp(SEQ0).resize(512).linear(2.2, -180).webp({ quality: 82 })
    .toFile(path.join(OUT, "logo-hi-512.webp"));
  console.log("logo-glow-512.webp, logo-hi-512.webp");
}

// 3) matcap xanh tích 256² (radial + highlight).
async function matcap() {
  const s = 256;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">
    <defs><radialGradient id="g" cx="38%" cy="32%" r="75%">
      <stop offset="0%" stop-color="#eaf6ff"/><stop offset="30%" stop-color="#5ec6ff"/>
      <stop offset="70%" stop-color="#20a1ff"/><stop offset="100%" stop-color="#0a3f82"/>
    </radialGradient></defs>
    <circle cx="${s/2}" cy="${s/2}" r="${s/2}" fill="url(#g)"/>
    <ellipse cx="90" cy="72" rx="46" ry="26" fill="#ffffff" opacity="0.5"/></svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(OUT, "badge-matcap-256.png"));
  console.log("badge-matcap-256.png");
}

// 4) sprite sao / spark / ring-glow + planet crop.
async function sprites() {
  const radial = (s, inner, outer) => Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><defs><radialGradient id="r"><stop offset="0%" stop-color="${inner}"/><stop offset="100%" stop-color="${outer}"/></radialGradient></defs><rect width="${s}" height="${s}" fill="url(#r)"/></svg>`
  );
  await sharp(radial(32, "#ffffff", "rgba(255,255,255,0)")).png().toFile(path.join(OUT, "star-32.png"));
  await sharp(radial(64, "#bffcf6", "rgba(94,242,230,0)")).png().toFile(path.join(OUT, "spark-64.png"));
  await sharp(radial(256, "rgba(32,161,255,0.9)", "rgba(32,161,255,0)")).png().toFile(path.join(OUT, "ring-glow-256.png"));
  await sharp(LOGO).resize(256).webp({ quality: 82 }).toFile(path.join(OUT, "orbit-planet-256.webp"));
  console.log("star-32, spark-64, ring-glow-256, orbit-planet-256");
}

// 5) ảnh dự án mẫu cho lightbox (720w) từ d1–d4.
async function lightbox() {
  for (const n of [1, 2, 3, 4]) {
    const src = path.join(ROOT, `public/images/d${n}.png`);
    try {
      await sharp(src).resize({ width: 720 }).webp({ quality: 78 }).toFile(path.join(OUT, `d${n}-720.webp`));
    } catch { /* ảnh nguồn có thể không có — bỏ qua */ }
  }
  console.log("d1-4-720.webp");
}

await ensureOut();
await points();
await glowHi();
await matcap();
await sprites();
await lightbox();
console.log("v3 assets → public/brand/v3/");
