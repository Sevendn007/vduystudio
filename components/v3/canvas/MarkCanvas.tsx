"use client";
import { useEffect, useMemo, useRef, type MutableRefObject, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { LOGO_CHECK, LOGO_CHECK_W, LOGO_D_W, logoDPoints } from "@/lib/v3/logo";
import { downgradeToStatic } from "@/lib/v3/quality";

// =============================================================================
// Logo 3D cho hero /v3 — dựng ĐÚNG từ hình logo phẳng (lib/v3/logo.ts):
//   ✓ = cobalt bóng, D = sơn mài đen. Extrude nét + bevel, không ống chrome.
// Canvas nằm GỌN trong ô .v3-art (không fixed, không phủ nội dung), không
// postprocessing, không transmission (bỏ GPU stall ReadPixels). Dừng render khi
// hero ra khỏi viewport (frameloop="never").
// =============================================================================

const UNIT = 0.034; // 1 đơn vị SVG → world
const toV = ([x, y]: [number, number]) => new THREE.Vector2((x - 51) * UNIT, -(y - 50) * UNIT);

/** Polyline → outline nét (đầu tròn, góc ngoài bo tròn, góc trong miter) dưới dạng THREE.Shape. */
function strokeShape(pts: THREE.Vector2[], w: number): THREE.Shape {
  const h = w / 2;
  const n = pts.length;
  const dirs: THREE.Vector2[] = [];
  for (let i = 0; i < n - 1; i++) dirs.push(pts[i + 1].clone().sub(pts[i]).normalize());
  const nrm = (d: THREE.Vector2) => new THREE.Vector2(-d.y, d.x);
  const at = (p: THREE.Vector2, v: THREE.Vector2, s: number) => p.clone().add(v.clone().multiplyScalar(s));
  const left: THREE.Vector2[] = [at(pts[0], nrm(dirs[0]), h)];
  const right: THREE.Vector2[] = [at(pts[0], nrm(dirs[0]), -h)];

  const arc = (c: THREE.Vector2, from: THREE.Vector2, to: THREE.Vector2) => {
    const a1 = Math.atan2(from.y, from.x);
    let da = Math.atan2(to.y, to.x) - a1;
    while (da > Math.PI) da -= Math.PI * 2;
    while (da < -Math.PI) da += Math.PI * 2;
    const steps = Math.max(1, Math.ceil(Math.abs(da) / (Math.PI / 14)));
    const out: THREE.Vector2[] = [];
    for (let k = 0; k <= steps; k++) {
      const a = a1 + (da * k) / steps;
      out.push(new THREE.Vector2(c.x + Math.cos(a) * h, c.y + Math.sin(a) * h));
    }
    return out;
  };

  for (let i = 1; i < n - 1; i++) {
    const p = pts[i], d1 = dirs[i - 1], d2 = dirs[i];
    const n1 = nrm(d1), n2 = nrm(d2);
    const ang = Math.acos(THREE.MathUtils.clamp(d1.dot(d2), -1, 1));
    if (ang < 0.03) { left.push(at(p, n1, h)); right.push(at(p, n1, -h)); continue; }
    const mid = n1.clone().add(n2).normalize();
    const miter = Math.min(h / Math.cos(ang / 2), h * 4);
    const cross = d1.x * d2.y - d1.y * d2.x; // > 0: rẽ trái → bên trái là góc trong
    if (cross > 0) {
      left.push(at(p, mid, miter));
      right.push(...arc(p, n1.clone().negate(), n2.clone().negate()));
    } else {
      left.push(...arc(p, n1, n2));
      right.push(at(p, mid, -miter));
    }
  }
  const pe = pts[n - 1], de = dirs[n - 2], ne = nrm(de);
  left.push(at(pe, ne, h));
  right.push(at(pe, ne, -h));

  const shape = new THREE.Shape();
  shape.moveTo(left[0].x, left[0].y);
  for (let i = 1; i < left.length; i++) shape.lineTo(left[i].x, left[i].y);
  const cap = (c: THREE.Vector2, from: THREE.Vector2) => {
    const a0 = Math.atan2(from.y, from.x);
    for (let k = 1; k < 16; k++) {
      const a = a0 - (Math.PI * k) / 16;
      shape.lineTo(c.x + Math.cos(a) * h, c.y + Math.sin(a) * h);
    }
  };
  cap(pe, ne); // đầu cuối: quay từ pháp tuyến trái → phải qua hướng tiến
  for (let i = right.length - 1; i >= 0; i--) shape.lineTo(right[i].x, right[i].y);
  cap(pts[0], nrm(dirs[0]).negate()); // đầu đầu
  shape.closePath();
  return shape;
}

function extrude(pts: [number, number][], w: number, depth: number): THREE.ExtrudeGeometry {
  const g = new THREE.ExtrudeGeometry(strokeShape(pts.map(toV), w * UNIT), {
    depth, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.045, bevelSegments: 6, curveSegments: 8, steps: 1,
  });
  g.translate(0, 0, -depth / 2);
  g.computeVertexNormals();
  return g;
}

type Pointer = { x: number; y: number };
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const expoOut = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));

function Mark({ pointer, t0 }: { pointer: MutableRefObject<Pointer>; t0: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const eased = useRef<Pointer>({ x: 0, y: 0 });
  const { check, d, checkMat, dMat } = useMemo(() => ({
    check: extrude(LOGO_CHECK, LOGO_CHECK_W, 0.42),
    d: extrude(logoDPoints(24), LOGO_D_W, 0.3),
    checkMat: new THREE.MeshPhysicalMaterial({ color: "#1d4ed8", roughness: 0.22, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 1 }),
    dMat: new THREE.MeshPhysicalMaterial({ color: "#0d0d0d", roughness: 0.3, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.2 }),
  }), []);
  useEffect(() => () => { check.dispose(); d.dispose(); checkMat.dispose(); dMat.dispose(); }, [check, d, checkMat, dMat]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const h = t0.current < 0 ? 0 : t - t0.current;
    const f = 1 - Math.exp(-Math.min(delta, 0.05) * 3);
    const e = eased.current;
    e.x += (pointer.current.x - e.x) * f;
    e.y += (pointer.current.y - e.y) * f;
    const intro = expoOut(clamp01(h / 1.8));
    g.scale.setScalar(0.82 + 0.18 * intro);
    g.rotation.y = (1 - intro) * -1.1 + Math.sin(t * 0.45) * 0.3 + e.x * 0.35;
    g.rotation.x = -0.05 + Math.sin(t * 0.6 + 1) * 0.05 + e.y * 0.16;
    g.rotation.z = Math.sin(t * 0.3) * 0.02;
    g.position.y = 0.12 + Math.sin(t * 0.9) * 0.06;
  });

  return (
    <group ref={group}>
      <mesh geometry={d} material={dMat} />
      <mesh geometry={check} material={checkMat} />
    </group>
  );
}

function Studio() {
  return (
    <>
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#141414"]} />
        <Lightformer form="rect" intensity={3} position={[0, 5, 1]} rotation-x={Math.PI / 2} scale={[10, 3, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2.4} position={[-5, 1, 3]} rotation-y={Math.PI / 2.6} scale={[5, 1.2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.6} position={[5, 0.5, 2]} rotation-y={-Math.PI / 2.6} scale={[5, 1, 1]} color="#fff3e2" />
        <Lightformer form="ring" intensity={2} position={[2, 2, -5]} scale={[3, 3, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={0.5} position={[0, -4, 0]} rotation-x={-Math.PI / 2} scale={[10, 5, 1]} color="#6b6258" />
      </Environment>
      <hemisphereLight args={["#fffaf0", "#cfc6b4", 0.35]} />
      <directionalLight position={[3, 5, 6]} intensity={1.1} />
    </>
  );
}

// Bám đúng kích thước ô chứa (ResizeObserver của R3F có lúc không bắn lần đầu).
function Fit({ box }: { box: RefObject<HTMLDivElement> }) {
  const size = useThree((s) => s.size);
  const setSize = useThree((s) => s.setSize);
  useFrame(() => {
    const el = box.current;
    if (!el) return;
    const w = el.clientWidth, h = el.clientHeight;
    if (w > 0 && h > 0 && (Math.abs(size.width - w) > 1 || Math.abs(size.height - h) > 1)) setSize(w, h);
  });
  return null;
}

function Ready({ t0, onReady }: { t0: MutableRefObject<number>; onReady: () => void }) {
  const n = useRef(0);
  useFrame(({ clock }) => {
    if (t0.current >= 0) return;
    if (++n.current < 3) return;
    t0.current = clock.elapsedTime;
    onReady();
  });
  return null;
}

export default function MarkCanvas({ active, onReady, onLost }: { active: boolean; onReady: () => void; onLost: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0 });
  const t0 = useRef(-1);

  useEffect(() => {
    const on = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", on, { passive: true });
    const kick = window.setTimeout(() => window.dispatchEvent(new Event("resize")), 300);
    return () => { window.removeEventListener("pointermove", on); window.clearTimeout(kick); };
  }, []);

  return (
    <div ref={box} style={{ position: "absolute", inset: 0 }}>
      <Canvas
        dpr={[1, 1.5]} flat frameloop={active ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance", stencil: false }}
        camera={{ fov: 30, position: [0, 0.4, 9.2], near: 0.5, far: 30 }}
        style={{ position: "absolute", inset: 0 }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor(0x000000, 0);
          camera.lookAt(0, 0.05, 0);
          gl.domElement.addEventListener("webglcontextlost", (ev) => { ev.preventDefault(); downgradeToStatic(); onLost(); }, { once: true });
        }}
      >
        <Fit box={box} />
        <Studio />
        <Mark pointer={pointer} t0={t0} />
        <ContactShadows position={[0, -1.45, 0]} scale={[6, 2.4]} far={2.6} blur={2.6} opacity={0.3} color="#2b241d" resolution={384} frames={Infinity} />
        <Ready t0={t0} onReady={onReady} />
      </Canvas>
    </div>
  );
}
