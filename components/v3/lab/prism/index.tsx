"use client";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import { gsap } from "gsap";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { backdropFrag, backdropVert } from "./shaders";
import { buildMonogramGeometry, createTypeTexture, detectQuality, displayFontFamily, TYPE_ROWS, type Quality } from "./utils";

// =============================================================================
// GLASS PRISM DISPERSION — hero WebGL (lab/prism)
// Monogram VD = một nét kính dày liên tục (dấu tích ✓ → sống D → bụng D), vật liệu
// MeshTransmissionMaterial tán sắc, khúc xạ backdrop chữ khổng lồ đang cuộn.
// Nền kem bóng, quầng sáng ấm, bóng mềm, vệ tinh bi bóng quay quanh.
// 1 canvas, 1 mesh kính, uniform-driven, bloom chỉ desktop.
// =============================================================================

const CREAM = "#f3efe6";
const INK = "#15130f";
const COBALT = "#1a4bff";

type Pointer = { x: number; y: number };
type Reveal = {
  scale: number;
  rotY: number;
  rotZ: number;
  posY: number;
  ior: number;
  rough: number;
  chroma: number;
  distort: number;
  typo: number;
};
type GlassMat = THREE.MeshPhysicalMaterial & {
  chromaticAberration: number;
  distortion: number;
  anisotropicBlur: number;
  time: number;
};
type Shared = {
  q: Quality;
  font: string; // font-family đã tính từ overlay (dùng cho canvas chữ backdrop)
  pointer: MutableRefObject<Pointer>;
  rev: MutableRefObject<Reveal>;
  t0: MutableRefObject<number>; // thời điểm (clock) scene sẵn sàng; <0 = chưa
};

// -----------------------------------------------------------------------------
// Studio ánh sáng: môi trường phản chiếu dựng bằng Lightformer (không HDR ngoài).
// Softbox trắng trên đỉnh, 2 dải màu (cobalt trái / cam ấm phải) cho highlight có sắc,
// 2 "cờ đen" navy/nâu ở góc để cạnh kính có rim tối (kỹ thuật chụp thuỷ tinh trên nền sáng).
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// Backdrop: plane 20x10 ở z=-2.8, ShaderMaterial (chữ cuộn + dải sáng), parallax theo chuột.
// -----------------------------------------------------------------------------
function Backdrop({ q, font, pointer, rev, t0 }: Shared) {
  const gl = useThree((s) => s.gl);
  const mesh = useRef<THREE.Mesh>(null);
  const eased = useRef<Pointer>({ x: 0, y: 0 });

  const type = useMemo(() => createTypeTexture(!q.mobile, font), [q.mobile, font]);
  useEffect(() => {
    const { texture, redraw } = type;
    texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    texture.needsUpdate = true;
    let alive = true;
    // Font display (next/font) có thể nạp xong sau khi vẽ lần đầu → vẽ lại.
    try {
      document.fonts.ready.then(() => { if (alive) redraw(); }).catch(() => {});
    } catch {
      /* no FontFaceSet */
    }
    return () => { alive = false; texture.dispose(); };
  }, [type, gl]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: backdropVert,
        fragmentShader: backdropFrag,
        depthWrite: false,
        uniforms: {
          uTex: { value: type.texture },
          uTime: { value: 0 },
          uReveal: { value: 0 },
          uMotion: { value: q.reduced ? 0.35 : 1 },
          uRows: { value: TYPE_ROWS },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uCream: { value: new THREE.Color(CREAM) },
          uGlow: { value: new THREE.Color("#fff8ec") },
          uShade: { value: new THREE.Color("#e6dfd2") },
          uCobalt: { value: new THREE.Color("#2255ff") },
          uViolet: { value: new THREE.Color("#8a5cff") },
          uOrange: { value: new THREE.Color("#ff8a4a") },
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
    const u = material.uniforms;
    const hero = t0.current < 0 ? 0 : state.clock.elapsedTime - t0.current;
    u.uTime.value = hero;
    u.uReveal.value = rev.current.typo;
    (u.uMouse.value as THREE.Vector2).set(e.x, e.y);
    m.position.x = -e.x * 0.22;
    m.position.y = -e.y * 0.14;
  });

  return (
    <mesh ref={mesh} material={material} position={[0, 0, -2.8]} scale={q.mobile ? 0.6 : 1}>
      <planeGeometry args={[20, 10]} />
    </mesh>
  );
}

// -----------------------------------------------------------------------------
// Monogram kính: 1 mesh + MeshTransmissionMaterial. Reveal/idle/chuột ghi vào rev (gsap)
// và đọc trong useFrame; material uniforms (ior/roughness/chroma/distortion) đổi theo rev.
// -----------------------------------------------------------------------------
function Monogram({ q, pointer, rev }: Shared) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const eased = useRef<Pointer>({ x: 0, y: 0 });
  const geo = useMemo(() => buildMonogramGeometry(!q.mobile), [q.mobile]);
  useEffect(() => () => geo.dispose(), [geo]);

  useFrame((state, delta) => {
    const g = group.current;
    const m = mesh.current;
    if (!g || !m) return;
    const r = rev.current;
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const k = q.reduced ? 0.3 : 1;
    const f = 1 - Math.exp(-dt * 3.2);
    const e = eased.current;
    e.x += (pointer.current.x - e.x) * f;
    e.y += (pointer.current.y - e.y) * f;

    g.rotation.y = r.rotY + Math.sin(t * 0.33) * 0.26 * k + e.x * 0.45;
    g.rotation.x = 0.05 + Math.sin(t * 0.47 + 1.2) * 0.07 * k - e.y * 0.3;
    g.rotation.z = r.rotZ + Math.sin(t * 0.27 + 0.6) * 0.035 * k;
    g.position.y = r.posY + Math.sin(t * 0.85) * 0.07 * k;
    g.scale.setScalar(r.scale);

    const mat = m.material as GlassMat;
    if (mat && "chromaticAberration" in mat) {
      mat.roughness = r.rough;
      mat.ior = r.ior;
      mat.chromaticAberration = r.chroma;
      mat.distortion = r.distort;
      mat.time = t;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={mesh} geometry={geo}>
        <MeshTransmissionMaterial
          samples={q.mobile ? 3 : 6}
          resolution={q.mobile ? 256 : 1024}
          backside={!q.mobile}
          backsideResolution={512}
          backsideThickness={0.35}
          thickness={0.7}
          transmission={1}
          roughness={0.06}
          ior={1.5}
          chromaticAberration={0.14}
          anisotropicBlur={0.12}
          distortion={0.08}
          distortionScale={0.6}
          temporalDistortion={0.08}
          color="#ffffff"
          attenuationColor="#e6eeff"
          attenuationDistance={1.6}
          clearcoat={1}
          clearcoatRoughness={0.04}
          envMapIntensity={1.1}
        />
      </mesh>
    </group>
  );
}

// -----------------------------------------------------------------------------
// Vệ tinh: 4 viên bi bóng (cobalt / chrome / cam / ngọc trai) quay quanh monogram,
// đi qua phía sau sẽ bị kính khúc xạ. Vật liệu thường → rẻ.
// -----------------------------------------------------------------------------
const BEADS = [
  { rx: 2.55, ry: 0.95, rz: 1.25, speed: 0.21, phase: 0.0, size: 0.15, kind: "cobalt" },
  { rx: 2.25, ry: 1.3, rz: 1.0, speed: -0.17, phase: 2.1, size: 0.1, kind: "chrome" },
  { rx: 2.85, ry: 0.7, rz: 1.4, speed: 0.13, phase: 4.0, size: 0.12, kind: "orange" },
  { rx: 2.05, ry: 1.1, rz: 0.9, speed: -0.26, phase: 1.1, size: 0.075, kind: "pearl" },
] as const;

function Satellites({ q }: { q: Quality }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const mats = useMemo(
    () => ({
      cobalt: new THREE.MeshPhysicalMaterial({ color: COBALT, roughness: 0.18, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.2 }),
      chrome: new THREE.MeshStandardMaterial({ color: "#ffffff", metalness: 1, roughness: 0.06, envMapIntensity: 1.4 }),
      orange: new THREE.MeshPhysicalMaterial({ color: "#ff7a3d", roughness: 0.2, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 1.2 }),
      pearl: new THREE.MeshPhysicalMaterial({ color: "#fdfaf4", roughness: 0.25, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.15, envMapIntensity: 1.0 }),
    }),
    [],
  );
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  const geo = useMemo(() => new THREE.SphereGeometry(1, q.mobile ? 20 : 32, q.mobile ? 14 : 20), [q.mobile]);
  useEffect(() => () => geo.dispose(), [geo]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * (q.reduced ? 0.3 : 1);
    for (let i = 0; i < BEADS.length; i++) {
      const b = BEADS[i];
      const m = refs.current[i];
      if (!m) continue;
      const a = t * b.speed + b.phase;
      m.position.set(Math.cos(a) * b.rx, Math.sin(a * 1.0 + 0.8) * b.ry * 0.5 + Math.sin(t * 0.6 + i) * 0.08, Math.sin(a) * b.rz);
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

// -----------------------------------------------------------------------------
// Post-processing (desktop): EffectComposer + RenderPass + UnrealBloom (chỉ highlight >1)
// + OutputPass (sRGB). Render target MSAA 4x HalfFloat để cạnh kính không răng cưa.
// -----------------------------------------------------------------------------
function Effects() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  const composer = useMemo(() => {
    const dpr = gl.getPixelRatio();
    const rt = new THREE.WebGLRenderTarget(Math.max(1, Math.floor(size.width * dpr)), Math.max(1, Math.floor(size.height * dpr)), {
      type: THREE.HalfFloatType,
      samples: 4,
    });
    const c = new EffectComposer(gl, rt);
    c.addPass(new RenderPass(scene, camera));
    c.addPass(new UnrealBloomPass(new THREE.Vector2(size.width, size.height), 0.42, 0.55, 1.0));
    c.addPass(new OutputPass());
    return c;
    // size chỉ dùng cho kích thước khởi tạo; resize xử lý ở effect dưới
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, scene, camera]);

  useEffect(() => {
    composer.setPixelRatio(gl.getPixelRatio());
    composer.setSize(size.width, size.height);
  }, [composer, gl, size]);
  useEffect(() => () => composer.dispose(), [composer]);

  useFrame(() => {
    composer.render();
  }, 1);
  return null;
}

// Đánh dấu scene đã render frame đầu (shader đã compile) → bắt đầu timeline reveal.
function Ready({ t0, onReady }: { t0: MutableRefObject<number>; onReady: () => void }) {
  const count = useRef(0);
  const fired = useRef(false);
  useFrame(({ clock }) => {
    if (fired.current) return;
    count.current += 1;
    if (count.current < 2) return; // frame 1 compile shader; frame 2 mới ổn định
    fired.current = true;
    t0.current = clock.elapsedTime;
    onReady();
  });
  return null;
}

// -----------------------------------------------------------------------------
// Bố cục scene theo viewport (đơn vị thế giới ở z=0): desktop monogram lệch phải/lên
// để headline góc dưới-trái; mobile thu nhỏ, đẩy lên trên.
// -----------------------------------------------------------------------------
function Scene({ shared, onReady }: { shared: Shared; onReady: () => void }) {
  const viewport = useThree((s) => s.viewport);
  const { q } = shared;
  const wide = viewport.width > 5.2;
  const base = THREE.MathUtils.clamp(viewport.width / 4.6, 0.42, 1);
  const gx = wide ? viewport.width * 0.075 : 0;
  const gy = wide ? 0.3 : 0.75;
  const floorY = -1.55 - 0.12 / base;

  return (
    <>
      <Studio q={q} />
      <Backdrop {...shared} />
      <group position={[gx, gy, 0]} scale={base}>
        <Monogram {...shared} />
        <Satellites q={q} />
        <ContactShadows
          position={[0.1, floorY, 0]}
          scale={[7.5, 3.2]}
          far={3.4}
          blur={2.4}
          opacity={0.42}
          color="#3b2f24"
          resolution={q.mobile ? 256 : 512}
          frames={Infinity}
        />
      </group>
      {!q.mobile && <Effects />}
      <Ready t0={shared.t0} onReady={onReady} />
    </>
  );
}

// =============================================================================
// Component gốc: fixed full-screen, 1 Canvas + overlay HTML tối giản.
// =============================================================================
export default function PrismHero() {
  const [q, setQ] = useState<Quality | null>(null);
  const [font, setFont] = useState("");
  const [ready, setReady] = useState(false);
  const pointer = useRef<Pointer>({ x: 0, y: 0 });
  const t0 = useRef(-1);
  const rev = useRef<Reveal>({ scale: 0.25, rotY: -2.4, rotZ: 0.55, posY: -0.7, ior: 1.0, rough: 0.6, chroma: 1.2, distort: 0.6, typo: 0 });
  const kicker = useRef<HTMLDivElement>(null);
  const line1 = useRef<HTMLSpanElement>(null);
  const line2 = useRef<HTMLSpanElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const shared = useMemo<Shared | null>(() => (q ? { q, font, pointer, rev, t0 } : null), [q, font]);

  useEffect(() => {
    const quality = detectQuality();
    if (quality.reduced) {
      // Giảm chuyển động: không xoay vào từ xa, không nổ tán sắc mạnh.
      rev.current = { ...rev.current, scale: 0.6, rotY: -0.5, rotZ: 0.15, chroma: 0.5, distort: 0.3 };
    }
    setFont(displayFontFamily(overlay.current));
    setQ(quality);
    // Phòng hờ: nếu WebGL không lên được, vẫn hiện chữ overlay sau 2.5s.
    const id = window.setTimeout(() => setReady(true), 2500);
    return () => window.clearTimeout(id);
  }, []);

  // Chuột: parallax/xoay (toàn cục, không cần pointer-events trên canvas).
  useEffect(() => {
    const on = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const leave = () => { pointer.current.x = 0; pointer.current.y = 0; };
    window.addEventListener("pointermove", on, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", on);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  // Overlay parallax nhẹ ngược hướng kính (hoà vào không gian 3D).
  useEffect(() => {
    if (!q || q.mobile) return;
    let raf = 0;
    const cur = { x: 0, y: 0 };
    const tick = () => {
      cur.x += (pointer.current.x - cur.x) * 0.06;
      cur.y += (pointer.current.y - cur.y) * 0.06;
      const el = overlay.current;
      if (el) el.style.transform = `translate3d(${(-cur.x * 10).toFixed(2)}px, ${(-cur.y * 6).toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [q]);

  // Reveal timeline: chạy khi scene đã render frame đầu (shader compile xong).
  useEffect(() => {
    if (!q || !ready) return;
    const r = rev.current;
    const m = q.reduced ? 0.6 : 1;
    const tl = gsap.timeline({ defaults: { overwrite: "auto" } });
    tl.to(r, { typo: 1, duration: 1.3 * m, ease: "power2.out" }, 0.2)
      .to(r, { scale: 1, duration: 1.8 * m, ease: "expo.out" }, 0.25)
      .to(r, { rotY: 0, rotZ: 0, duration: 2.1 * m, ease: "power3.out" }, 0.25)
      .to(r, { posY: 0, duration: 1.7 * m, ease: "power3.out" }, 0.25)
      .to(r, { ior: 1.5, duration: 1.9 * m, ease: "power2.inOut" }, 0.45)
      .to(r, { rough: 0.06, duration: 1.6 * m, ease: "power2.inOut" }, 0.6)
      .to(r, { chroma: 0.14, distort: 0.08, duration: 2.6 * m, ease: "power3.out" }, 0.55);
    if (kicker.current) {
      tl.fromTo(kicker.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.9 * m, ease: "power2.out" }, 0.9);
    }
    [line1, line2].forEach((ref, i) => {
      if (!ref.current) return;
      tl.fromTo(ref.current, { yPercent: 115, rotate: 2.5 }, { yPercent: 0, rotate: 0, duration: 1.15 * m, ease: "expo.out" }, 1.1 + i * 0.14);
    });
    return () => { tl.kill(); };
  }, [q, ready]);

  return (
    <div style={{ position: "fixed", inset: 0, background: CREAM, overflow: "hidden" }}>
      {shared && (
        <Canvas
          dpr={shared.q.dpr}
          flat
          frameloop="always"
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance", stencil: false }}
          camera={{ fov: 30, position: [0, 0.55, 7.4], near: 0.5, far: 50 }}
          style={{ position: "absolute", inset: 0 }}
          onCreated={({ gl, camera }) => {
            gl.setClearColor(new THREE.Color(CREAM), 1);
            camera.lookAt(0, 0.1, 0);
          }}
        >
          <Scene shared={shared} onReady={() => setReady(true)} />
        </Canvas>
      )}

      {/* Overlay HTML tối giản — kicker góc trên-trái, headline góc dưới-trái */}
      <div
        ref={overlay}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2,
          fontFamily: "var(--ff-display), 'Archivo', system-ui, sans-serif",
          color: INK,
          willChange: "transform",
        }}
      >
        <div
          ref={kicker}
          style={{
            position: "absolute",
            top: "max(22px, 3vh)",
            left: "max(22px, 3vw)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            opacity: 0,
          }}
        >
          <span style={{ width: 9, height: 9, borderRadius: 999, background: COBALT, boxShadow: "0 0 0 5px rgba(26,75,255,0.14)" }} />
          <span>VDuyStudio — Verified Identity Studio</span>
        </div>

        <h1
          style={{
            position: "absolute",
            left: "max(22px, 3vw)",
            bottom: "max(26px, 4.5vh)",
            margin: 0,
            fontWeight: 600,
            fontSize: "clamp(30px, 3.7vw, 64px)",
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ display: "block", overflow: "hidden", paddingBottom: "0.1em" }}>
            <span ref={line1} style={{ display: "block", transform: "translateY(115%)", transformOrigin: "0 100%" }}>
              Uy tín số, bắt đầu từ
            </span>
          </span>
          <span style={{ display: "block", overflow: "hidden", paddingBottom: "0.12em" }}>
            <span ref={line2} style={{ display: "block", transform: "translateY(115%)", transformOrigin: "0 100%", color: COBALT }}>
              dấu tích xanh.
            </span>
          </span>
        </h1>
      </div>
    </div>
  );
}
