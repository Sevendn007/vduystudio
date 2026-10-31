// Sinh đám mây điểm cho "xe hologram" của bản 3D TỪ ẢNH XE THẬT của nhà xe.
//   node scripts/xekhach-bus-points.mjs
// Hai lần dựng xe bằng hình khối đều không ra dáng xe giường nằm; lấy nét từ
// ảnh chụp thì mọi đường cong, kính lái, bánh, chữ trên thân đều đúng.
//
// Cách làm: cắt chiếc xe đầu tiên trong ảnh đội xe, che nền bằng một đa giác,
// tính biên (Sobel) + độ sáng, rồi lấy mẫu điểm theo trọng số đó.
// Sau đó "bung" tấm ảnh 2D thành KHỐI 3D: ảnh chụp góc 3/4 nên nửa trái là mặt
// hông, nửa phải là mặt đầu xe. Điểm ở mặt hông được trải dọc chiều dài xe,
// điểm ở mặt đầu được trải ngang bề rộng (mũi xe hơi cong). Rồi lấy đối xứng:
// hông → hông bên kia, đầu → đuôi (mờ hơn). Kết quả là một vỏ xe rỗng đủ bốn
// mặt, xoay được quanh mọi trục mà vẫn ra dáng xe thật.
// Kết quả: public/sitetemplate/xekhach/bus-points.bin
//   Uint32 count, rồi mỗi điểm: Int16 x, y, z (×1000, đơn vị cảnh), Uint8 w, Uint8 0
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "scripts/src/xekhach/stock/fleet-night.jpg");
const OUT = path.join(ROOT, "public/sitetemplate/xekhach/bus-points.bin");

// vùng chứa chiếc xe đầu tiên (ảnh gốc 2560×1097)
const CROP = { left: 0, top: 160, width: 1250, height: 800 };
const W = 1000; // làm việc ở 1000px ngang
const TARGET = 15000;

// đa giác che nền, toạ độ trên khung 1000×640 (theo chiều kim đồng hồ từ đuôi xe)
const MASK = [
  [14, 215], [120, 190], [250, 150], [400, 112], [520, 92], [640, 74], [720, 68], [800, 82],
  [850, 110], [875, 150], [895, 205], [935, 222], [988, 226], [992, 272], [930, 292],
  [910, 360], [908, 470], [905, 565], [880, 603], [820, 612], [700, 606], [620, 616],
  [560, 606], [440, 588], [370, 604], [300, 592], [150, 562], [40, 544], [12, 520], [10, 300],
];

function inside(x, y) {
  let ok = false;
  for (let i = 0, j = MASK.length - 1; i < MASK.length; j = i++) {
    const [xi, yi] = MASK[i];
    const [xj, yj] = MASK[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) ok = !ok;
  }
  return ok;
}

const { data, info } = await sharp(SRC)
  .extract(CROP)
  .resize(W)
  .greyscale()
  .raw()
  .toBuffer({ resolveWithObject: true });
const H = info.height;
const g = (x, y) => data[y * W + x];

// biên Sobel + độ sáng → trọng số
const weight = new Float32Array(W * H);
let maxW = 0;
for (let y = 1; y < H - 1; y++) {
  for (let x = 1; x < W - 1; x++) {
    if (!inside(x, y)) continue;
    const gx = -g(x - 1, y - 1) - 2 * g(x - 1, y) - g(x - 1, y + 1) + g(x + 1, y - 1) + 2 * g(x + 1, y) + g(x + 1, y + 1);
    const gy = -g(x - 1, y - 1) - 2 * g(x, y - 1) - g(x + 1, y - 1) + g(x - 1, y + 1) + 2 * g(x, y + 1) + g(x + 1, y + 1);
    const edge = Math.min(1, Math.hypot(gx, gy) / 600);
    const lum = g(x, y) / 255;
    // biên là chính, mảng sáng (dải đỏ, chữ, kính phản chiếu) thêm một ít
    const w = edge ** 1.1 * 0.9 + lum ** 2.6 * 0.14;
    weight[y * W + x] = w;
    if (w > maxW) maxW = w;
  }
}

// lấy mẫu theo trọng số (rejection sampling), deterministic
let seed = 11;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};
const pts = [];
let tries = 0;
while (pts.length < TARGET && tries < TARGET * 200) {
  tries++;
  const x = Math.floor(rnd() * W);
  const y = Math.floor(rnd() * H);
  const w = weight[y * W + x] / maxW;
  if (w < 0.085) continue;
  if (rnd() > w ** 0.72) continue;
  pts.push([x + rnd(), y + rnd(), w]);
}

// ---- bung 2D → 3D -----------------------------------------------------------
// kích thước xe trong cảnh (khớp với journey.ts)
const L = 11.6, BH = 3.5, BW = 2.6, GROUND = 0.52;
// mốc trên ảnh (khung 1000×640): đuôi xe x≈12, trụ A (ranh giới hông/đầu) x≈575,
// góc đầu xe bên kia x≈905. Mép nóc và mép gầm đổi theo x vì phối cảnh.
const X_TAIL = 12, X_PILLAR = 575, X_NOSE_END = 905;
const sideTop = (x) => 215 - ((x - X_TAIL) / (X_PILLAR - X_TAIL)) * 120;
const sideBot = (x) => 560 + ((x - X_TAIL) / (X_PILLAR - X_TAIL)) * 52;
const frontTop = (u) => 95 + u * 15;
const frontBot = () => 612;

const pts3 = [];
const push = (x, y, z, w) => pts3.push([x, y, z, w]);

for (const [ix, iy, w] of pts) {
  if (ix < X_PILLAR) {
    // mặt hông: trải dọc chiều dài, bỏ nén phối cảnh ở đuôi bằng mũ 0.8
    const t = Math.min(1, Math.max(0, (ix - X_TAIL) / (X_PILLAR - X_TAIL))) ** 0.8;
    const v = (iy - sideTop(ix)) / (sideBot(ix) - sideTop(ix));
    const X = -L / 2 + t * (L - 1.0);
    const Y = GROUND + BH * Math.min(1.08, 1 - v);
    push(X, Y, BW / 2, w);
    push(X, Y, -BW / 2, w * 0.85); // hông bên kia
  } else {
    // mặt đầu: trải ngang bề rộng, mũi xe hơi lồi ở giữa
    const u = Math.min(1, (ix - X_PILLAR) / (X_NOSE_END - X_PILLAR));
    const v = (iy - frontTop(u)) / (frontBot() - frontTop(u));
    const bulge = 1 - (2 * u - 1) ** 2;
    const X = L / 2 - 0.45 + 0.45 * bulge;
    const Y = GROUND + BH * Math.min(1.08, 1 - v);
    const Z = BW / 2 - u * BW;
    push(X, Y, Z, w);
    push(-X, Y, Z, w * 0.55); // đuôi xe, mờ hơn
  }
}

const buf = Buffer.alloc(4 + pts3.length * 8);
buf.writeUInt32LE(pts3.length, 0);
let o = 4;
for (const [x, y, z, w] of pts3) {
  buf.writeInt16LE(Math.round(x * 1000), o); o += 2;
  buf.writeInt16LE(Math.round(y * 1000), o); o += 2;
  buf.writeInt16LE(Math.round(z * 1000), o); o += 2;
  buf.writeUInt8(Math.round(Math.min(1, w) * 255), o); o += 1;
  buf.writeUInt8(0, o); o += 1;
}
await fs.writeFile(OUT, buf);
console.log(`${pts.length} điểm ảnh → ${pts3.length} điểm 3D · ${(buf.length / 1024).toFixed(0)} KB → ${OUT}`);

// ảnh xem thử: chấm trắng trên nền đen để kiểm tra nét xe
const prev = Buffer.alloc(W * H, 0);
for (const [x, y, w] of pts) prev[Math.floor(y) * W + Math.floor(x)] = 80 + Math.round(w * 175);
await sharp(prev, { raw: { width: W, height: H, channels: 1 } }).png().toFile(path.join(ROOT, "scripts/src/xekhach/ref/bus-points-preview.png"));
