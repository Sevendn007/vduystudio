import * as THREE from "three";

// Đường tâm của dải ruy-băng: MỘT nét liên tục đọc ra "V" (dấu tích ✓) nối sang "D".
// Tay ngắn trái → đỉnh tích → tay dài vươn lên = sống chữ D (nghiêng) → bụng D vòng ra
// phía camera (z dương) → chui về sau đỉnh tích (z âm) → kết thúc.
export const RIBBON_POINTS: [number, number, number][] = [
  [-2.62, 0.62, 0.34], // đầu tay ngắn (mũi nhọn)
  [-2.08, -0.32, 0.2],
  [-1.5, -1.4, 0.0], // đỉnh dấu tích
  [-1.28, -1.5, -0.02], // điểm phụ: siết góc đỉnh
  [-0.86, -0.52, -0.1],
  [-0.26, 1.06, -0.14],
  [-0.02, 1.54, -0.06], // đỉnh tay dài = đỉnh sống D
  [0.78, 1.58, 0.26], // bụng D bắt đầu
  [1.78, 1.06, 0.58],
  [2.3, 0.04, 0.66],
  [1.84, -0.98, 0.5],
  [0.86, -1.54, 0.18],
  [-0.34, -1.58, -0.16],
  [-1.14, -1.3, -0.42], // kết: chui ra sau đỉnh tích
];

export function makeCurve(): THREE.CatmullRomCurve3 {
  const pts = RIBBON_POINTS.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
  const c = new THREE.CatmullRomCurve3(pts, false, "centripetal", 0.5);
  c.arcLengthDivisions = 600;
  return c;
}

export type RibbonBuild = { geometry: THREE.BufferGeometry; length: number };

/**
 * Dựng ribbon tiết diện "stadium" (dẹt, hai mép bo tròn) dọc theo curve.
 * Mỗi đỉnh lưu: tâm C, khung (N, B) đã căn cho mặt rộng hướng về camera (+z), toạ độ tiết diện local
 * và pháp tuyến local → vertex shader dựng lại vị trí hoàn toàn bằng uniform (twist/sóng/reveal/chuột).
 */
export function buildRibbon(
  curve: THREE.CatmullRomCurve3,
  segments: number,
  width: number,
  thick: number,
  edgeDiv = 6,
  capDiv = 8,
): RibbonBuild {
  const length = curve.getLength();
  const centers = curve.getSpacedPoints(segments); // segments + 1 điểm, cách đều theo độ dài cung
  const frames = curve.computeFrenetFrames(segments, false); // tangents theo tham số cung u = i/segments

  // tiết diện stadium: cạnh trên → mũ phải → cạnh dưới → mũ trái (chiều kim đồng hồ trong (N,B))
  const r = thick / 2;
  const hw = Math.max(width / 2 - r, 0.0001);
  const ring: { x: number; y: number; nx: number; ny: number }[] = [];
  for (let i = 0; i < edgeDiv; i++) {
    const s = i / edgeDiv;
    ring.push({ x: -hw + 2 * hw * s, y: r, nx: 0, ny: 1 });
  }
  for (let i = 0; i < capDiv; i++) {
    const a = Math.PI / 2 - (Math.PI * i) / capDiv;
    ring.push({ x: hw + r * Math.cos(a), y: r * Math.sin(a), nx: Math.cos(a), ny: Math.sin(a) });
  }
  for (let i = 0; i < edgeDiv; i++) {
    const s = i / edgeDiv;
    ring.push({ x: hw - 2 * hw * s, y: -r, nx: 0, ny: -1 });
  }
  for (let i = 0; i < capDiv; i++) {
    const a = -Math.PI / 2 - (Math.PI * i) / capDiv;
    ring.push({ x: -hw + r * Math.cos(a), y: r * Math.sin(a), nx: Math.cos(a), ny: Math.sin(a) });
  }
  const around = ring.length;
  const rings = segments + 1;
  const vCount = rings * around;

  const position = new Float32Array(vCount * 3);
  const normal = new Float32Array(vCount * 3);
  const aC = new Float32Array(vCount * 3);
  const aN = new Float32Array(vCount * 3);
  const aB = new Float32Array(vCount * 3);
  const aLoc = new Float32Array(vCount * 2);
  const aLocN = new Float32Array(vCount * 2);
  const aT = new Float32Array(vCount);

  const Z = new THREE.Vector3(0, 0, 1);
  const T = new THREE.Vector3();
  const N = new THREE.Vector3();
  const B = new THREE.Vector3();
  const tmp = new THREE.Vector3();

  for (let i = 0; i < rings; i++) {
    const C = centers[i];
    T.copy(frames.tangents[i]).normalize();
    // khung căn camera: B ≈ +z chiếu lên mặt phẳng vuông góc T → mặt rộng của dải hướng về người xem
    B.copy(Z).addScaledVector(T, -Z.dot(T));
    if (B.lengthSq() < 1e-6) B.copy(frames.binormals[i]);
    B.normalize();
    N.crossVectors(B, T).normalize(); // (N, B, T) thuận tay phải: N×B = T
    const u = i / segments;
    for (let j = 0; j < around; j++) {
      const k = i * around + j;
      const q = ring[j];
      tmp.copy(C).addScaledVector(N, q.x).addScaledVector(B, q.y);
      position[k * 3] = tmp.x; position[k * 3 + 1] = tmp.y; position[k * 3 + 2] = tmp.z;
      tmp.set(0, 0, 0).addScaledVector(N, q.nx).addScaledVector(B, q.ny);
      normal[k * 3] = tmp.x; normal[k * 3 + 1] = tmp.y; normal[k * 3 + 2] = tmp.z;
      aC[k * 3] = C.x; aC[k * 3 + 1] = C.y; aC[k * 3 + 2] = C.z;
      aN[k * 3] = N.x; aN[k * 3 + 1] = N.y; aN[k * 3 + 2] = N.z;
      aB[k * 3] = B.x; aB[k * 3 + 1] = B.y; aB[k * 3 + 2] = B.z;
      aLoc[k * 2] = q.x; aLoc[k * 2 + 1] = q.y;
      aLocN[k * 2] = q.nx; aLocN[k * 2 + 1] = q.ny;
      aT[k] = u;
    }
  }

  const index = new Uint32Array(segments * around * 6);
  let o = 0;
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < around; j++) {
      const j1 = (j + 1) % around;
      const a = i * around + j;
      const b = (i + 1) * around + j;
      const c = (i + 1) * around + j1;
      const d = i * around + j1;
      index[o++] = a; index[o++] = b; index[o++] = c;
      index[o++] = a; index[o++] = c; index[o++] = d;
    }
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(position, 3));
  g.setAttribute("normal", new THREE.BufferAttribute(normal, 3));
  g.setAttribute("aC", new THREE.BufferAttribute(aC, 3));
  g.setAttribute("aN", new THREE.BufferAttribute(aN, 3));
  g.setAttribute("aB", new THREE.BufferAttribute(aB, 3));
  g.setAttribute("aLoc", new THREE.BufferAttribute(aLoc, 2));
  g.setAttribute("aLocN", new THREE.BufferAttribute(aLocN, 2));
  g.setAttribute("aT", new THREE.BufferAttribute(aT, 1));
  g.setIndex(new THREE.BufferAttribute(index, 1));
  g.computeBoundingSphere();
  return { geometry: g, length };
}
