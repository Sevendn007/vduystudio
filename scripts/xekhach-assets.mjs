// Sinh ảnh cho demo /sitetemplate/xekhach.
//   node scripts/xekhach-assets.mjs
//   node scripts/xekhach-assets.mjs --ref     (cắt ảnh tham chiếu logo, không ship)
//
// Nguồn: scripts/src/xekhach/stock/*.jpg — ảnh lấy từ website hiện tại của chính
// nhà xe (xem NGUON.txt). Mỗi ảnh xuất 3 bản: ngang 16/10, vuông 4/3 cho thẻ, và
// một bản 28px nhoè làm nền chờ.
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "scripts/src/xekhach");
const STOCK = path.join(SRC, "stock");
const OUT = path.join(ROOT, "public/sitetemplate/xekhach/img");
const REF = path.join(SRC, "ref");

/** name: tên file xuất; wide: bề ngang bản 16/10; sq: bề ngang bản 4/3 (0 = bỏ) */
const PHOTOS = [
  { name: "fleet-night", wide: 2200, sq: 1100 },
  { name: "fleet-rose", wide: 2200, sq: 1100 },
  { name: "fleet-road", wide: 1680, sq: 1000 },
  { name: "cabin-amber", wide: 900, sq: 900 },
  { name: "cabin-bx2", wide: 900, sq: 900 },
  { name: "cabin-blue", wide: 900, sq: 900 },
  { name: "berth-night", wide: 900, sq: 900 },
  { name: "berth-aisle", wide: 900, sq: 900 },
  { name: "berth-wide", wide: 900, sq: 900 },
  { name: "office-1", wide: 1080, sq: 900 },
  { name: "office-2", wide: 1080, sq: 900 },
  { name: "office-3", wide: 1080, sq: 900 },
];

const REFS = [{ name: "logo", src: "banner.png", box: [484, 112, 84, 72], scale: 5 }];

async function variant(file, name, width, ratio, suffix) {
  const height = Math.round(width / ratio);
  await sharp(file)
    .resize(width, height, { fit: "cover", position: sharp.strategy.attention, kernel: "lanczos3" })
    .sharpen({ sigma: 0.6 })
    .webp({ quality: 82 })
    .toFile(path.join(OUT, `${name}${suffix}.webp`));
  return `${width}×${height}`;
}

async function photo({ name, wide, sq }) {
  const file = path.join(STOCK, `${name}.jpg`);
  const out = [await variant(file, name, wide, 16 / 10, "")];
  if (sq) out.push(await variant(file, `${name}-sq`, sq, 4 / 3, ""));
  // nền chờ: 28px nhoè, nhúng thẳng vào thẻ <Image placeholder="blur">
  await sharp(file)
    .resize(28, 18, { fit: "cover" })
    .blur(1.1)
    .webp({ quality: 40 })
    .toFile(path.join(OUT, `${name}-lq.webp`));
  return `${name}  ${out.join("  |  ")}`;
}

async function ref({ name, src, box, scale }) {
  const [l, t, w, h] = box;
  await sharp(path.join(SRC, src))
    .extract({ left: l, top: t, width: w, height: h })
    .resize(Math.round(w * scale), null, { kernel: "lanczos3" })
    .png()
    .toFile(path.join(REF, `${name}.png`));
  return `ref/${name}`;
}

await fs.mkdir(OUT, { recursive: true });
await fs.mkdir(REF, { recursive: true });

if (process.argv.includes("--ref")) {
  for (const r of REFS) console.log(await ref(r));
} else {
  // dọn ảnh của các đợt trước
  for (const f of await fs.readdir(OUT)) await fs.rm(path.join(OUT, f), { force: true });
  for (const p of PHOTOS) console.log(await photo(p));
}
console.log("→", OUT);
