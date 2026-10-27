"use client";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";

// Logo V-D (ý tưởng: chữ V CHÍNH LÀ dấu tích xanh — thương hiệu = xác minh).
// - V: dấu ✓ bo tròn, xanh verified bóng (clearcoat), nét ngắn trái / nét dài vươn lên phải.
// - D: chữ D bo góc, chrome bạc SÁNG phản chiếu studio tự dựng (không đen).
// Không dùng ảnh render của v2. Môi trường phản chiếu = Lightformer (không tải HDR).

type P = [number, number];
const sub = (a: P, b: P): P => [a[0] - b[0], a[1] - b[1]];
const add = (a: P, b: P): P => [a[0] + b[0], a[1] + b[1]];
const mul = (a: P, k: number): P => [a[0] * k, a[1] * k];
const len = (a: P) => Math.hypot(a[0], a[1]);
const norm = (a: P): P => mul(a, 1 / len(a));
const perp = (a: P): P => [-a[1], a[0]];
// giao điểm 2 đường (p + t·d)
function isect(p1: P, d1: P, p2: P, d2: P): P {
  const den = d1[0] * d2[1] - d1[1] * d2[0];
  if (Math.abs(den) < 1e-9) return p1;
  const t = ((p2[0] - p1[0]) * d2[1] - (p2[1] - p1[1]) * d2[0]) / den;
  return add(p1, mul(d1, t));
}
// đa giác bo góc bằng quadratic curve
function roundedShape(pts: P[], r: number | number[]): THREE.Shape {
  const s = new THREE.Shape();
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const p = pts[i], prev = pts[(i - 1 + n) % n], next = pts[(i + 1) % n];
    const v1 = sub(prev, p), v2 = sub(next, p);
    const rr = Math.min(Array.isArray(r) ? r[i] : r, len(v1) / 2, len(v2) / 2);
    const a = add(p, mul(norm(v1), rr));
    const b = add(p, mul(norm(v2), rr));
    if (i === 0) s.moveTo(a[0], a[1]); else s.lineTo(a[0], a[1]);
    s.quadraticCurveTo(p[0], p[1], b[0], b[1]);
  }
  s.closePath();
  return s;
}
// viền ngoài của nét gấp P0→P1→P2 với bề dày w (mitre ở đỉnh)
function strokeOutline(P0: P, P1: P, P2: P, w: number): P[] {
  const h = w / 2;
  const dA = norm(sub(P1, P0)), dB = norm(sub(P2, P1));
  const nA = perp(dA), nB = perp(dB);
  const mPlus = isect(add(P0, mul(nA, h)), dA, add(P1, mul(nB, h)), dB);
  const mMinus = isect(add(P0, mul(nA, -h)), dA, add(P1, mul(nB, -h)), dB);
  return [add(P0, mul(nA, h)), mPlus, add(P2, mul(nB, h)), add(P2, mul(nB, -h)), mMinus, add(P0, mul(nA, -h))];
}

function shapeCheckV(): THREE.Shape {
  // đường tâm dấu tích: tay ngắn trái xuống đỉnh, tay dài vươn lên phải
  const pts = strokeOutline([-1.08, 0.12], [-0.3, -0.9], [1.0, 1.05], 0.54);
  // bo: 2 đầu tay bo tròn nhiều, góc ngoài đỉnh bo vừa, góc trong đỉnh bo ít
  return roundedShape(pts, [0.2, 0.18, 0.2, 0.2, 0.08, 0.2]);
}

function shapeD(): THREE.Shape {
  const r = 0.14, t = 0.5;
  const s = new THREE.Shape();
  s.moveTo(-0.92, 1 - r);
  s.quadraticCurveTo(-0.92, 1, -0.92 + r, 1);
  s.lineTo(0.02, 1);
  s.bezierCurveTo(1.22, 1, 1.22, -1, 0.02, -1);
  s.lineTo(-0.92 + r, -1);
  s.quadraticCurveTo(-0.92, -1, -0.92, -1 + r);
  s.closePath();
  const h = new THREE.Path();
  const ir = 0.08;
  h.moveTo(-0.92 + t, 1 - t - ir);
  h.quadraticCurveTo(-0.92 + t, 1 - t, -0.92 + t + ir, 1 - t);
  h.lineTo(0.0, 1 - t);
  h.bezierCurveTo(0.62, 1 - t, 0.62, -1 + t, 0.0, -1 + t);
  h.lineTo(-0.92 + t + ir, -1 + t);
  h.quadraticCurveTo(-0.92 + t, -1 + t, -0.92 + t, -1 + t + ir);
  h.closePath();
  s.holes.push(h);
  return s;
}

const EXTRUDE: THREE.ExtrudeGeometryOptions = {
  depth: 0.36, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.06, bevelSegments: 6, curveSegments: 32,
};

export default function LogoVD({ pose = false }: { pose?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const geo = useMemo(() => {
    const v = new THREE.ExtrudeGeometry(shapeCheckV(), EXTRUDE); v.center();
    const d = new THREE.ExtrudeGeometry(shapeD(), EXTRUDE); d.center();
    return { v, d };
  }, []);

  const blue = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#1456ff", metalness: 0.05, roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.15, envMapIntensity: 0.5,
  }), []);
  const chrome = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#eef1f5", metalness: 0.95, roughness: 0.12, envMapIntensity: 1.2,
  }), []);

  useEffect(() => {
    if (pose) return;
    const on = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, [pose]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    if (pose) { g.rotation.set(0.1, -0.38, 0); return; }
    const t = state.clock.elapsedTime;
    const ty = Math.sin(t * 0.45) * 0.34 + pointer.current.x * 0.26;
    const tx = 0.08 + Math.sin(t * 0.7) * 0.04 + pointer.current.y * 0.1;
    g.rotation.y += (ty - g.rotation.y) * 0.06;
    g.rotation.x += (tx - g.rotation.x) * 0.06;
    g.position.y = 0.05 + Math.sin(t * 1.1) * 0.05;
  });

  return (
    <>
      {/* Studio sáng tự dựng → chrome bạc sáng + highlight xanh nhẹ, không tải HDR */}
      <Environment resolution={256} frames={1}>
        {/* nền xám trung tính + dải sáng trên / dải tối dưới → chrome bạc có tương phản, không đen */}
        <color attach="background" args={["#8b909a"]} />
        <Lightformer intensity={3} position={[0, 4.5, 0]} rotation-x={Math.PI / 2} scale={[10, 3, 1]} color="#ffffff" />
        <Lightformer intensity={1.6} position={[-5, 1.5, 2]} rotation-y={Math.PI / 2} scale={[6, 1.4, 1]} color="#ffffff" />
        <Lightformer intensity={1.4} position={[5, 1.5, 2]} rotation-y={-Math.PI / 2} scale={[6, 1.4, 1]} color="#dbe7ff" />
        <Lightformer intensity={0.9} position={[0, 0.2, -5]} scale={[10, 1.2, 1]} color="#ffffff" />
        <Lightformer intensity={0.35} position={[0, -3.5, 3]} rotation-x={-Math.PI / 2} scale={[8, 2.5, 1]} color="#1f232a" />
      </Environment>
      <group ref={group} scale={0.64}>
        <mesh geometry={geo.v} material={blue} position={[-0.86, -0.02, 0.16]} />
        <mesh geometry={geo.d} material={chrome} position={[0.58, 0, 0]} />
      </group>
    </>
  );
}
