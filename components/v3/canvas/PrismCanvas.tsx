"use client";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { backdropFrag, backdropVert } from "./prism/shaders";
import { buildMonogramGeometry, createTypeTexture, detectQuality, displayFontFamily, TYPE_ROWS, type Quality } from "./prism/utils";
import { scrollStore, type Chapter } from "@/lib/v3/scrollStore";

// =============================================================================
// GLASS PRISM — canvas nền CỐ ĐỊNH xuyên suốt /v3 (hướng chủ site chọn).
// Monogram VD = một nét kính liên tục ✓→D (MeshTransmissionMaterial tán sắc) khúc xạ
// backdrop chữ khổng lồ. Khối kính là "nhân vật": theo từng chương (section) nó đổi
// vị trí / cỡ / góc, chữ nền đổi theo chương. Reveal 0–3s tính theo thời gian trong
// useFrame (không phụ thuộc gsap/rAF của overlay) → luôn hoàn tất.
// =============================================================================

const CREAM = "#f3efe6";
const COBALT = "#1a4bff";

type Pointer = { x: number; y: number };
type GlassMat = THREE.MeshPhysicalMaterial & { chromaticAberration: number; distortion: number; time: number };
type Shared = { q: Quality; font: string; pointer: MutableRefObject<Pointer>; t0: MutableRefObject<number> };

const WORDS: Record<Chapter, string[]> = {
  hero: ["VERIFIED", "VDUYSTUDIO", "IDENTITY", "VDUYSTUDIO", "VERIFIED"],
  services: ["DỊCH VỤ", "BẢNG GIÁ", "TÍCH XANH", "MỞ KHÓA", "BÁO CHÍ"],
  trust: ["ĐỒNG HÀNH", "UY TÍN", "MINH BẠCH", "ĐỐI TÁC", "TIN CẬY"],
  projects: ["KẾT QUẢ THẬT", "TÍCH XANH THẬT", "1.200+", "VERIFIED", "KẾT QUẢ THẬT"],
  process: ["QUY TRÌNH", "4 BƯỚC", "TƯ VẤN", "CAM KẾT", "BÀN GIAO"],
  feedback: ["FEEDBACK", "4.9/5", "KHÁCH HÀNG", "98%", "FEEDBACK"],
  contact: ["BỨT PHÁ", "ZALO", "VDUYSTUDIO", "LIÊN HỆ", "BỨT PHÁ"],
};

// easing
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const expoOut = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
const cubicOut = (x: number) => 1 - Math.pow(1 - x, 3);
const smooth = (x: number) => x * x * (3 - 2 * x);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Mục tiêu khối kính theo chương (hệ số theo bề rộng viewport W, chiều cao H ở z=0)
function chapterTarget(ch: Chapter, W: number, H: number, mobile: boolean) {
  if (mobile) {
    switch (ch) {
      case "hero": return { x: 0, y: H * 0.22, s: 0.62, ry: 0 };
      case "services": return { x: W * 0.28, y: H * 0.34, s: 0.3, ry: 0.5 };
      case "trust": return { x: -W * 0.26, y: H * 0.32, s: 0.26, ry: -0.4 };
      case "projects": return { x: W * 0.3, y: -H * 0.1, s: 0.34, ry: 0.6 };
      case "process": return { x: -W * 0.28, y: -H * 0.3, s: 0.26, ry: -0.5 };
      case "feedback": return { x: W * 0.28, y: H * 0.3, s: 0.28, ry: 0.3 };
      default: return { x: 0, y: H * 0.12, s: 0.5, ry: 0 };
    }
  }
  switch (ch) {
    case "hero": return { x: W * 0.21, y: H * 0.12, s: 0.84, ry: 0 };
    case "services": return { x: -W * 0.3, y: H * 0.26, s: 0.42, ry: 0.65 };
    case "trust": return { x: 0, y: H * 0.3, s: 0.34, ry: -0.45 };
    case "projects": return { x: W * 0.33, y: -H * 0.06, s: 0.56, ry: 0.55 };
    case "process": return { x: -W * 0.32, y: -H * 0.12, s: 0.4, ry: -0.6 };
    case "feedback": return { x: W * 0.32, y: H * 0.22, s: 0.4, ry: 0.35 };
    default: return { x: 0, y: H * 0.08, s: 0.92, ry: 0 };
  }
}

function Studio({ q }: { q: Quality }) {
  const sweep = useRef<THREE.SpotLight>(null);
  useFrame(({ clock }) => {
    const l = sweep.current;
    if (!l) return;
    const t = clock.elapsedTime * (q.reduced ? 0.3 : 1);
    l.position.set(Math.cos(t * 0.33) * 5.5, 3.2 + Math.sin(t * 0.5) * 0.8, 4.5 + Math.sin(t * 0.33) * 2.0);
  });
  return (
    <>
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#b9b3a8"]} />
        <Lightformer form="rect" intensity={3.2} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[12, 4, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2.2} position={[0, 2.6, 6]} rotation-x={0.35} scale={[8, 1.4, 1]} color="#fff6e8" />
        <Lightformer form="rect" intensity={2.0} position={[-6, 0.6, 1]} rotation-y={Math.PI / 2} scale={[6, 1.3, 1]} color="#8fb0ff" />
        <Lightformer form="rect" intensity={2.0} position={[6, 0.6, 1]} rotation-y={-Math.PI / 2} scale={[6, 1.3, 1]} color="#ffc9a0" />
        <Lightformer form="rect" intensity={1} position={[-4, -1.5, -3]} rotation-y={Math.PI / 3} scale={[5, 3, 1]} color="#1c2235" />
        <Lightformer form="rect" intensity={1} position={[4, -1.5, -3]} rotation-y={-Math.PI / 3} scale={[5, 3, 1]} color="#2a2420" />
        <Lightformer form="rect" intensity={0.6} position={[0, -4, 0]} rotation-x={-Math.PI / 2} scale={[12, 6, 1]} color="#4a4340" />
        <Lightformer form="ring" intensity={2.6} position={[0, 1, -6]} scale={[3, 3, 1]} color="#ffffff" />
      </Environment>
      <hemisphereLight args={["#fffaf0", "#cfc6b4", 0.6]} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} color="#ffffff" />
      <directionalLight position={[-5, 2, -3]} intensity={0.5} color="#dfe8ff" />
      <spotLight ref={sweep} intensity={q.mobile ? 70 : 110} angle={0.55} penumbra={0.9} distance={40} decay={2} color="#fff4e4" />
    </>
  );
}

function Backdrop({ q, font, pointer, t0 }: Shared) {
  const gl = useThree((s) => s.gl);
  const mesh = useRef<THREE.Mesh>(null);
  const eased = useRef<Pointer>({ x: 0, y: 0 });
  const chapter = useRef<Chapter>("hero");
  const type = useMemo(() => createTypeTexture(!q.mobile, font), [q.mobile, font]);

  useEffect(() => {
    const { texture, redraw } = type;
    texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    texture.needsUpdate = true;
    let alive = true;
    try { document.fonts.ready.then(() => { if (alive) redraw(); }).catch(() => {}); } catch { /* no FontFaceSet */ }
    return () => { alive = false; texture.dispose(); };
  }, [type, gl]);

  const material = useMemo(
    () => new THREE.ShaderMaterial({
      vertexShader: backdropVert, fragmentShader: backdropFrag, depthWrite: false,
      uniforms: {
        uTex: { value: type.texture }, uTime: { value: 0 }, uReveal: { value: 0 },
        uMotion: { value: q.reduced ? 0.35 : 1 }, uRows: { value: TYPE_ROWS }, uInk: { value: 1 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uCream: { value: new THREE.Color(CREAM) }, uGlow: { value: new THREE.Color("#fff8ec") },
        uShade: { value: new THREE.Color("#e6dfd2") }, uCobalt: { value: new THREE.Color("#2255ff") },
        uViolet: { value: new THREE.Color("#8a5cff") }, uOrange: { value: new THREE.Color("#ff8a4a") },
      },
    }),
    [type, q.reduced],
  );
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const dt = Math.min(delta, 0.05);
    const f = 1 - Math.exp(-dt * 2.6);
    const e = eased.current;
    e.x += (pointer.current.x - e.x) * f;
    e.y += (pointer.current.y - e.y) * f;
    const hero = t0.current < 0 ? 0 : state.clock.elapsedTime - t0.current;
    const u = material.uniforms;
    u.uTime.value = hero;
    u.uReveal.value = cubicOut(clamp01((hero - 0.2) / 1.3));
    (u.uMouse.value as THREE.Vector2).set(e.x, e.y);
    m.position.x = -e.x * 0.22;
    m.position.y = -e.y * 0.14 - scrollStore.pageP * 0.6; // nền trôi nhẹ theo cuộn
    if (scrollStore.chapter !== chapter.current) {
      chapter.current = scrollStore.chapter;
      type.redraw(WORDS[chapter.current]);
    }
  });

  return (
    <mesh ref={mesh} material={material} position={[0, 0, -2.8]} scale={q.mobile ? 0.6 : 1}>
      <planeGeometry args={[20, 10]} />
    </mesh>
  );
}

function Monogram({ q, pointer, t0 }: Shared) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const eased = useRef<Pointer>({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0, s: 1, ry: 0 });
  const viewport = useThree((s) => s.viewport);
  const geo = useMemo(() => buildMonogramGeometry(!q.mobile), [q.mobile]);
  useEffect(() => () => geo.dispose(), [geo]);

  useFrame((state, delta) => {
    const g = group.current, m = mesh.current;
    if (!g || !m) return;
    const t = state.clock.elapsedTime;
    const h = t0.current < 0 ? 0 : t - t0.current; // thời gian từ lúc sẵn sàng
    const dt = Math.min(delta, 0.05);
    const k = q.reduced ? 0.3 : 1;
    const f = 1 - Math.exp(-dt * 3.2);
    const e = eased.current;
    e.x += (pointer.current.x - e.x) * f;
    e.y += (pointer.current.y - e.y) * f;

    // --- reveal theo thời gian (deterministic)
    const rs = q.reduced ? 0.55 : 1;
    const scale0 = lerp(q.reduced ? 0.6 : 0.25, 1, expoOut(clamp01((h - 0.25) / (1.8 * rs))));
    const rotY0 = lerp(q.reduced ? -0.5 : -2.4, 0, cubicOut(clamp01((h - 0.25) / (2.1 * rs))));
    const rotZ0 = lerp(q.reduced ? 0.15 : 0.55, 0, cubicOut(clamp01((h - 0.25) / (2.1 * rs))));
    const posY0 = lerp(-0.7, 0, cubicOut(clamp01((h - 0.25) / (1.7 * rs))));
    const ior = lerp(1.0, 1.5, smooth(clamp01((h - 0.45) / (1.9 * rs))));
    const rough = lerp(0.6, 0.05, smooth(clamp01((h - 0.6) / (1.6 * rs))));
    const chroma = lerp(1.2, 0.22, cubicOut(clamp01((h - 0.55) / (2.6 * rs))));
    const distort = lerp(0.6, 0.05, cubicOut(clamp01((h - 0.55) / (2.6 * rs))));

    // --- mục tiêu theo chương, lerp mượt
    const W = viewport.width, H = viewport.height;
    const base = THREE.MathUtils.clamp(W / 4.6, 0.42, 1);
    const tg = chapterTarget(scrollStore.chapter, W, H, q.mobile);
    const fc = 1 - Math.exp(-dt * 2.2);
    const c = cur.current;
    c.x += (tg.x - c.x) * fc; c.y += (tg.y - c.y) * fc; c.s += (tg.s - c.s) * fc; c.ry += (tg.ry - c.ry) * fc;

    g.position.set(c.x, c.y + posY0 + Math.sin(t * 0.85) * 0.07 * k, 0);
    g.scale.setScalar(base * c.s * scale0);
    g.rotation.y = c.ry + rotY0 + Math.sin(t * 0.33) * 0.26 * k + e.x * 0.45 + scrollStore.pageP * 1.2;
    g.rotation.x = 0.05 + Math.sin(t * 0.47 + 1.2) * 0.07 * k - e.y * 0.3;
    g.rotation.z = rotZ0 + Math.sin(t * 0.27 + 0.6) * 0.035 * k;

    const mat = m.material as GlassMat;
    if (mat && "chromaticAberration" in mat) {
      mat.roughness = rough; mat.ior = ior; mat.chromaticAberration = chroma; mat.distortion = distort; mat.time = t;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={mesh} geometry={geo}>
        <MeshTransmissionMaterial
          samples={q.mobile ? 3 : 6} resolution={q.mobile ? 256 : 1024}
          backside={!q.mobile} backsideResolution={512} backsideThickness={0.35}
          thickness={0.7} transmission={1} roughness={0.05} ior={1.5}
          chromaticAberration={0.22} anisotropicBlur={0.05}
          distortion={0.05} distortionScale={0.6} temporalDistortion={0.06}
          color="#ffffff" attenuationColor="#dfe9ff" attenuationDistance={1.4}
          clearcoat={1} clearcoatRoughness={0.04} envMapIntensity={1.1}
        />
      </mesh>
      <Satellites q={q} />
      <ContactShadows position={[0.1, -1.65, 0]} scale={[7.5, 3.2]} far={3.4} blur={2.4} opacity={0.38} color="#3b2f24" resolution={q.mobile ? 256 : 512} frames={Infinity} />
    </group>
  );
}

const BEADS = [
  { rx: 2.55, ry: 0.95, rz: 1.25, speed: 0.21, phase: 0.0, size: 0.15, kind: "cobalt" },
  { rx: 2.25, ry: 1.3, rz: 1.0, speed: -0.17, phase: 2.1, size: 0.1, kind: "chrome" },
  { rx: 2.85, ry: 0.7, rz: 1.4, speed: 0.13, phase: 4.0, size: 0.12, kind: "orange" },
  { rx: 2.05, ry: 1.1, rz: 0.9, speed: -0.26, phase: 1.1, size: 0.075, kind: "pearl" },
] as const;

function Satellites({ q }: { q: Quality }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const mats = useMemo(() => ({
    cobalt: new THREE.MeshPhysicalMaterial({ color: COBALT, roughness: 0.18, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.2 }),
    chrome: new THREE.MeshStandardMaterial({ color: "#ffffff", metalness: 1, roughness: 0.06, envMapIntensity: 1.4 }),
    orange: new THREE.MeshPhysicalMaterial({ color: "#ff7a3d", roughness: 0.2, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 1.2 }),
    pearl: new THREE.MeshPhysicalMaterial({ color: "#fdfaf4", roughness: 0.25, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.15, envMapIntensity: 1.0 }),
  }), []);
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  const geo = useMemo(() => new THREE.SphereGeometry(1, q.mobile ? 20 : 32, q.mobile ? 14 : 20), [q.mobile]);
  useEffect(() => () => geo.dispose(), [geo]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * (q.reduced ? 0.3 : 1);
    for (let i = 0; i < BEADS.length; i++) {
      const b = BEADS[i], m = refs.current[i];
      if (!m) continue;
      const a = t * b.speed + b.phase;
      m.position.set(Math.cos(a) * b.rx, Math.sin(a + 0.8) * b.ry * 0.5 + Math.sin(t * 0.6 + i) * 0.08, Math.sin(a) * b.rz);
    }
  });
  return (
    <group>
      {BEADS.map((b, i) => (
        <mesh key={b.kind} ref={(el) => { refs.current[i] = el; }} geometry={geo} material={mats[b.kind]} scale={b.size} />
      ))}
    </group>
  );
}

function Effects() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const composer = useMemo(() => {
    const dpr = gl.getPixelRatio();
    const rt = new THREE.WebGLRenderTarget(Math.max(1, Math.floor(size.width * dpr)), Math.max(1, Math.floor(size.height * dpr)), { type: THREE.HalfFloatType, samples: 4 });
    const c = new EffectComposer(gl, rt);
    c.addPass(new RenderPass(scene, camera));
    c.addPass(new UnrealBloomPass(new THREE.Vector2(size.width, size.height), 0.42, 0.55, 1.0));
    c.addPass(new OutputPass());
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, scene, camera]);
  useEffect(() => { composer.setPixelRatio(gl.getPixelRatio()); composer.setSize(size.width, size.height); }, [composer, gl, size]);
  useEffect(() => () => composer.dispose(), [composer]);
  useFrame(() => { composer.render(); }, 1);
  return null;
}

// Canvas phủ toàn viewport: mỗi frame so size của R3F với viewport, lệch thì setSize.
// (ResizeObserver của R3F từng không đo được container cho tới khi có sự kiện resize.)
function Fit() {
  const size = useThree((s) => s.size);
  const setSize = useThree((s) => s.setSize);
  useFrame(() => {
    const w = window.innerWidth, h = window.innerHeight;
    if (Math.abs(size.width - w) > 1 || Math.abs(size.height - h) > 1) setSize(w, h);
  });
  return null;
}

// Frame thứ 2 (shader đã compile) → t0 + báo overlay reveal (class trên <html>).
function Ready({ t0 }: { t0: MutableRefObject<number> }) {
  const n = useRef(0);
  useFrame(({ clock }) => {
    if (t0.current >= 0) return;
    n.current += 1;
    if (n.current < 2) return;
    t0.current = clock.elapsedTime;
    document.documentElement.classList.add("v3-ready");
  });
  return null;
}

function Scene({ shared }: { shared: Shared }) {
  const { q } = shared;
  return (
    <>
      <Fit />
      <Studio q={q} />
      <Backdrop {...shared} />
      <Monogram {...shared} />
      {!q.mobile && <Effects />}
      <Ready t0={shared.t0} />
    </>
  );
}

export default function PrismCanvas() {
  const [q, setQ] = useState<Quality | null>(null);
  const [font, setFont] = useState("");
  const pointer = useRef<Pointer>({ x: 0, y: 0 });
  const t0 = useRef(-1);
  const probe = useRef<HTMLDivElement>(null);
  const shared = useMemo<Shared | null>(() => (q ? { q, font, pointer, t0 } : null), [q, font]);

  useEffect(() => {
    setFont(displayFontFamily(probe.current));
    setQ(detectQuality());
    // Phòng hờ: WebGL không lên → vẫn hiện chữ overlay.
    const id = window.setTimeout(() => document.documentElement.classList.add("v3-ready"), 2500);
    // react-use-measure của R3F có lúc không nhận đo lần đầu (ResizeObserver không bắn) → root
    // không được tạo. Tự phát "resize" vài nhịp sau mount để nó đo lại (vô hại với Lenis/ScrollTrigger).
    const kicks = [100, 600, 1500, 3000].map((ms) => window.setTimeout(() => window.dispatchEvent(new Event("resize")), ms));
    const on = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const leave = () => { pointer.current.x = 0; pointer.current.y = 0; };
    window.addEventListener("pointermove", on, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.clearTimeout(id);
      kicks.forEach((k) => window.clearTimeout(k));
      window.removeEventListener("pointermove", on);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div className="v3-prism" aria-hidden>
      <div ref={probe} style={{ position: "absolute", fontFamily: "var(--ff-display)", visibility: "hidden" }}>VD</div>
      {shared && (
        <Canvas
          dpr={shared.q.dpr} flat frameloop="always"
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance", stencil: false }}
          camera={{ fov: 30, position: [0, 0.55, 7.4], near: 0.5, far: 50 }}
          style={{ position: "absolute", inset: 0 }}
          onCreated={({ gl, camera }) => { gl.setClearColor(new THREE.Color(CREAM), 1); camera.lookAt(0, 0.1, 0); }}
        >
          <Scene shared={shared} />
        </Canvas>
      )}
    </div>
  );
}
