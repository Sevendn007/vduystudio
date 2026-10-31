// Toạ độ của "chuyến đi 2100": đám mây điểm hình chiếc xe, đường tuyến trên bản
// đồ cao nguyên, và các mốc camera theo tiến độ cuộn.
import * as THREE from "three";

// --- kích thước xe, khớp với BusModel ---------------------------------------
const L = 11.6;
const H = 3.5;
const W = 2.6;
const GROUND = 0.52;

/** Vị trí tán của hạt trước khi lắp thành xe (một đám mây rộng quanh xe). */
export function scatterCloud(count: number, seed = 19): Float32Array {
  const out = new Float32Array(count * 3);
  let s = seed;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  for (let i = 0; i < count; i++) {
    const th = rnd() * Math.PI * 2;
    const ph = Math.acos(2 * rnd() - 1);
    const r = 9 + rnd() * 22;
    out[i * 3] = Math.sin(ph) * Math.cos(th) * r;
    out[i * 3 + 1] = Math.abs(Math.cos(ph)) * r * 0.5 + 0.4;
    out[i * 3 + 2] = Math.sin(ph) * Math.sin(th) * r;
  }
  return out;
}

// --- tuyến đường -------------------------------------------------------------
/** Các mốc trên tuyến Đắk Nông → Sài Gòn, toạ độ trên mặt phẳng bản đồ. */
export const ROUTE_NODES: { name: string; pos: [number, number, number] }[] = [
  { name: "Đắk Sin", pos: [-16, 0.1, -7.5] },
  { name: "Đạo Nghĩa", pos: [-11.5, 0.1, -4.2] },
  { name: "Nhân Đạo", pos: [-7.5, 0.1, -3.4] },
  { name: "Nhân Cơ", pos: [-3.2, 0.1, -0.6] },
  { name: "Kiến Đức", pos: [1.6, 0.1, 1.8] },
  { name: "Đồng Nai", pos: [8.4, 0.1, 4.6] },
  { name: "Sài Gòn", pos: [15.5, 0.1, 7.2] },
];

export const ROUTE_CURVE = new THREE.CatmullRomCurve3(
  ROUTE_NODES.map((n) => new THREE.Vector3(...n.pos)),
  false,
  "catmullrom",
  0.4
);

/** Tuyến Bắc Nam (chương cuối) — cung vòng lên phía bắc. */
export const NORTH_CURVE = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(-14, 0.1, -6),
    new THREE.Vector3(-9, 4.5, -14),
    new THREE.Vector3(0, 8.5, -20),
    new THREE.Vector3(10, 5.5, -16),
    new THREE.Vector3(17, 1.2, -8),
  ],
  false,
  "catmullrom",
  0.5
);

// --- hành trình camera -------------------------------------------------------
export type Key = { p: number; pos: [number, number, number]; target: [number, number, number] };

// p: tiến độ cuộn 0→1. Mỗi mốc ứng với giữa một chương (xem CHAPTERS bên dưới)
// nên chữ và cảnh luôn tới cùng lúc.
export const CAMERA_KEYS: Key[] = [
  { p: 0.0, pos: [16.5, 4.2, 15.5], target: [-4.6, 2.8, -1.2] }, // mở đầu: xe nằm nửa phải khung
  { p: 0.24, pos: [-12, 4.0, 13.5], target: [4.2, 2.2, -1] }, // khoang xe: vòng sang phía kia
  { p: 0.405, pos: [-2, 17, 20], target: [0, 0.5, 0] }, // tuyến: nhấc lên nhìn bản đồ
  { p: 0.57, pos: [1.5, 23, 15], target: [1.5, 0, 0] }, // bảng giờ: nhìn thẳng xuống
  { p: 0.735, pos: [12, 9, 17], target: [9, 1.2, 3] }, // đặt chỗ: hạ xuống cuối tuyến
  { p: 0.92, pos: [4, 20, 24], target: [0, 2, -4] }, // liên hệ: bay lên quỹ đạo
  { p: 1.0, pos: [0, 30, 30], target: [0, 3, -8] },
];

const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();

/** Nội suy mượt vị trí + điểm nhìn của camera tại tiến độ p. */
export function sampleJourney(p: number, outPos: THREE.Vector3, outTarget: THREE.Vector3): void {
  const t = THREE.MathUtils.clamp(p, 0, 1);
  let i = 0;
  while (i < CAMERA_KEYS.length - 2 && t > CAMERA_KEYS[i + 1].p) i++;
  const a = CAMERA_KEYS[i];
  const b = CAMERA_KEYS[i + 1];
  const k = THREE.MathUtils.clamp((t - a.p) / (b.p - a.p), 0, 1);
  const e = k * k * (3 - 2 * k); // smoothstep

  tmpA.set(...a.pos);
  tmpB.set(...b.pos);
  outPos.lerpVectors(tmpA, tmpB, e);

  tmpA.set(...a.target);
  tmpB.set(...b.target);
  outTarget.lerpVectors(tmpA, tmpB, e);
}

/** Khoảng tiến độ của từng chương. Các khoảng KHÔNG chạm nhau: giữa hai chương
    luôn có một quãng trống để chương trước tắt hẳn rồi chương sau mới hiện —
    nếu để gối nhau thì ở chỗ giao, hai khối chữ chồng lên nhau. */
export const CHAPTERS = [
  { id: "hero", from: 0.0, to: 0.135 },
  { id: "bus", from: 0.18, to: 0.3 },
  { id: "route", from: 0.345, to: 0.465 },
  { id: "board", from: 0.51, to: 0.63 },
  { id: "services", from: 0.675, to: 0.795 },
  { id: "contact", from: 0.84, to: 1.0 },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]["id"];

/** Quãng vào/ra của một chương — nhỏ hơn nửa khoảng trống giữa hai chương. */
export const CHAPTER_FADE = 0.02;

/** 0→1: mức "hiện diện" của một chương tại tiến độ p (vào/ra mềm ở hai mép). */
export function chapterPresence(p: number, from: number, to: number, fade = CHAPTER_FADE): number {
  if (p <= from - fade || p >= to + fade) return 0;
  if (p < from) return (p - (from - fade)) / fade;
  if (p > to) return 1 - (p - to) / fade;
  return 1;
}

/** -1→1: vị trí tương đối trong chương, dùng cho hiệu ứng trượt dọc của chữ. */
export function chapterDrift(p: number, from: number, to: number, fade = CHAPTER_FADE): number {
  const a = from - fade;
  const b = to + fade;
  if (p <= a || p >= b) return p <= a ? -1 : 1;
  return ((p - a) / (b - a)) * 2 - 1;
}
