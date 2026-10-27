"use client";
// LAB "nebula" — Particle Nebula Monogram (thế giới 3D nhập vai, nền tối).
// Monogram VD = 180k hạt GPU (60k mobile) dựng từ silhouette: V là dấu tích ✓, D bụng bezier, nghiêng 11°.
// Reveal 0–3s: thiên hà xoắn 3 cánh cuộn vào và lắp thành VD, camera dolly, chớp sáng, vành chrome
// "verified orbit" bung ra. Idle: hạt thở (simplex), khối xoay rất chậm, vệ tinh vàng chạy quanh vành.
// Chuột: đẩy + xoáy hạt quanh con trỏ (raycast lên z=0), nhả → hạt trôi về. Bloom (desktop).
// Tự chứa: không import từ components/v3 khác, không context, không asset ngoài.
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import gsap from "gsap";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { NEBULA_FRAG, NEBULA_VERT, PARTICLE_FRAG, PARTICLE_VERT, STAR_FRAG, STAR_VERT } from "./shaders";
import { buildMonogram, buildStars, type MonogramData } from "./utils";

type Settings = {
  mobile: boolean;
  reduced: boolean;
  count: number;
  stars: number;
  dpr: number;
  bloom: boolean;
  octaves: number;
};

// Trạng thái dùng chung giữa gsap / DOM / useFrame — mutable, không qua React state.
type Shared = {
  anim: { progress: number; flash: number; ring: number; camZ: number };
  ptr: { x: number; y: number; active: boolean };
  mouseLocal: THREE.Vector3;
  mouseStrength: number;
};

const CAM_Z = 6.6;
const FOV = 38;
const INK = "#06091a";
const COBALT = "#1d4ed8";
const GOLD = "#ffc46b";
const FONT = "var(--ff-display), 'Archivo', system-ui, sans-serif";
const HEADLINE = ["Uy", "tín", "số,", "bắt", "đầu", "từ", "dấu", "tích", "xanh."];
const ACCENT_FROM = 6; // "dấu tích xanh." → gradient
const BREAK_AFTER = 2; // xuống dòng sau "số,"

const damp = (dt: number, k: number) => 1 - Math.exp(-dt * k);

/* ------------------------------------------------------------------ hạt */
function Particles({ s, shared, mono }: { s: Settings; shared: Shared; mono: MonogramData }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(mono.target, 3));
    g.setAttribute("aStart", new THREE.BufferAttribute(mono.start, 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(mono.rand, 4));
    return g;
  }, [mono]);

  const mat = useMemo(() => {
    const tilt = new THREE.Matrix4().makeRotationY(0.35).multiply(new THREE.Matrix4().makeRotationX(-1.05));
    return new THREE.ShaderMaterial({
      vertexShader: PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uPixelRatio: { value: 1 },
        uBaseSize: { value: s.mobile ? 18 : 14 },
        uAlphaMul: { value: s.mobile ? 1.5 : 1 },
        uMotion: { value: s.reduced ? 0.3 : 1 },
        uFlash: { value: 0 },
        uMouseStrength: { value: 0 },
        uMouse: { value: new THREE.Vector3(99, 99, 0) },
        uDiscTilt: { value: new THREE.Matrix3().setFromMatrix4(tilt) },
        uDiscOffset: { value: new THREE.Vector3(0.3, -0.5, -1.8) },
        uCobalt: { value: new THREE.Color(COBALT) },
        uWhite: { value: new THREE.Color("#f4f7ff") },
        uGold: { value: new THREE.Color(GOLD) },
      },
    });
  }, [s.mobile, s.reduced]);

  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);

  useFrame((state) => {
    const u = mat.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uProgress.value = shared.anim.progress;
    u.uFlash.value = shared.anim.flash;
    u.uPixelRatio.value = state.viewport.dpr;
    u.uMouseStrength.value = shared.mouseStrength;
    (u.uMouse.value as THREE.Vector3).copy(shared.mouseLocal);
  });

  return <points geometry={geo} material={mat} frustumCulled={false} />;
}

/* ------------------------------------------------------------------ sao xa */
function Stars({ s, shared }: { s: Settings; shared: Shared }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const d = buildStars(s.stars);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(d.position, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(d.size, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(d.seed, 1));
    return g;
  }, [s.stars]);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: STAR_VERT,
        fragmentShader: STAR_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: 1 },
          uTintA: { value: new THREE.Color("#dfe8ff") },
          uTintB: { value: new THREE.Color("#ffe3b3") },
        },
      }),
    [],
  );
  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);
  useFrame((state, dt) => {
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uPixelRatio.value = state.viewport.dpr;
    const p = ref.current;
    if (!p) return;
    const k = damp(Math.min(dt, 0.05), 1.5);
    p.rotation.y += (shared.ptr.x * 0.04 - p.rotation.y) * k;
    p.rotation.x += (-shared.ptr.y * 0.03 - p.rotation.x) * k;
  });
  return <points ref={ref} geometry={geo} material={mat} frustumCulled={false} />;
}

/* ------------------------------------------------------------------ tinh vân nền */
function Nebula({ s, shared }: { s: Settings; shared: Shared }) {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: NEBULA_VERT,
        fragmentShader: NEBULA_FRAG,
        defines: { OCTAVES: s.octaves },
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uAspect: { value: 1 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uInk: { value: new THREE.Color("#070b1e") },
          uNavy: { value: new THREE.Color("#101a3f") },
          uCobalt: { value: new THREE.Color(COBALT) },
          uGold: { value: new THREE.Color(GOLD) },
        },
      }),
    [s.octaves],
  );
  useEffect(() => () => mat.dispose(), [mat]);
  useFrame((state, dt) => {
    const m = ref.current;
    if (!m) return;
    const cam = state.camera as THREE.PerspectiveCamera;
    const dist = cam.position.z - m.position.z;
    const h = 2 * dist * Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2) * 1.35;
    m.scale.set(h * cam.aspect, h, 1);
    mat.uniforms.uAspect.value = cam.aspect;
    mat.uniforms.uTime.value = state.clock.elapsedTime * (s.reduced ? 0.4 : 1);
    const mu = mat.uniforms.uMouse.value as THREE.Vector2;
    const k = damp(Math.min(dt, 0.05), 2);
    mu.x += (shared.ptr.x - mu.x) * k;
    mu.y += (shared.ptr.y - mu.y) * k;
  });
  return (
    <mesh ref={ref} position={[0, 0, -9]} material={mat}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ vành chrome "verified orbit" */
function Rings({ s, shared }: { s: Settings; shared: Shared }) {
  const grp = useRef<THREE.Group>(null);
  const sat = useRef<THREE.Mesh>(null);
  const ring1Rot = useMemo(() => new THREE.Euler(1.18, 0.2, -0.35), []);
  const mats = useMemo(
    () => ({
      chrome: new THREE.MeshPhysicalMaterial({ color: "#dfe6f5", metalness: 1, roughness: 0.14, envMapIntensity: 1.6 }),
      chrome2: new THREE.MeshPhysicalMaterial({
        color: "#9fb4e8", metalness: 1, roughness: 0.3, envMapIntensity: 1.1, transparent: true, opacity: 0.55,
      }),
      sat: new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 1.6, 0.7), toneMapped: false }),
    }),
    [],
  );
  useEffect(() => () => { mats.chrome.dispose(); mats.chrome2.dispose(); mats.sat.dispose(); }, [mats]);
  const motion = s.reduced ? 0.3 : 1;
  useFrame((state) => {
    const g = grp.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.scale.setScalar(Math.max(0.0001, shared.anim.ring));
    g.rotation.y = t * 0.06 * motion;
    if (sat.current) {
      const a = t * 0.5 * motion + 1;
      sat.current.position.set(Math.cos(a) * 3.05, Math.sin(a) * 3.05, 0).applyEuler(ring1Rot);
    }
  });
  return (
    <group ref={grp} scale={0.0001}>
      <mesh rotation={ring1Rot} material={mats.chrome}>
        <torusGeometry args={[3.05, 0.016, 12, 240]} />
      </mesh>
      <mesh rotation={[1.6, -0.35, 0.5]} material={mats.chrome2}>
        <torusGeometry args={[3.7, 0.008, 8, 240]} />
      </mesh>
      <mesh ref={sat} material={mats.sat}>
        <sphereGeometry args={[0.05, 12, 12]} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ bloom (desktop) */
function Post({ shared }: { shared: Shared }) {
  const gl = useThree((st) => st.gl);
  const scene = useThree((st) => st.scene);
  const camera = useThree((st) => st.camera);
  const size = useThree((st) => st.size);
  const dpr = useThree((st) => st.viewport.dpr);
  const fx = useMemo(() => {
    const rt = new THREE.WebGLRenderTarget(256, 256, { type: THREE.HalfFloatType, samples: 4 });
    const composer = new EffectComposer(gl, rt);
    const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.85, 0.65, 0.3);
    const out = new OutputPass();
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(bloom);
    composer.addPass(out);
    return { composer, bloom, out };
  }, [gl, scene, camera]);
  useEffect(() => {
    fx.composer.setPixelRatio(dpr);
    fx.composer.setSize(size.width, size.height);
  }, [fx, size, dpr]);
  useEffect(() => () => { fx.bloom.dispose(); fx.out.dispose(); fx.composer.dispose(); }, [fx]);
  // priority 1 → R3F không tự render; composer render thay
  useFrame(() => {
    fx.bloom.strength = 0.85 + shared.anim.flash * 0.6;
    fx.composer.render();
  }, 1);
  return null;
}

/* ------------------------------------------------------------------ scene */
function Scene({ s, shared }: { s: Settings; shared: Shared }) {
  const group = useRef<THREE.Group>(null);
  const camera = useThree((st) => st.camera);
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const v2 = useMemo(() => new THREE.Vector2(), []);
  const v3 = useMemo(() => new THREE.Vector3(), []);
  const mono = useMemo(() => buildMonogram(s.count, s.mobile ? 0.3 : 0.25), [s.count, s.mobile]);
  const motion = s.reduced ? 0.3 : 1;

  useFrame((state, dtRaw) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(dtRaw, 0.05);
    const cam = camera as THREE.PerspectiveCamera;
    const p = shared.ptr;

    // camera: dolly (gsap) + thở + parallax theo chuột
    const breathe = s.reduced ? 0 : Math.sin(t * 0.3) * 0.12;
    cam.position.z += (shared.anim.camZ + breathe - cam.position.z) * damp(dt, 3);
    cam.position.x += (p.x * 0.35 * motion - cam.position.x) * damp(dt, 2.5);
    cam.position.y += (p.y * 0.22 * motion - cam.position.y) * damp(dt, 2.5);
    cam.lookAt(0, 0.15, 0);

    const g = group.current;
    if (!g) return;
    // monogram luôn chiếm ~84% bề rộng khung nhìn (tại z=0, camera ở CAM_Z) nhưng không vượt scale 1
    const h = 2 * CAM_Z * Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2);
    const w = h * cam.aspect;
    g.scale.setScalar(Math.min(1, (w * 0.84) / mono.width));
    g.position.y = s.mobile ? 0.55 : 0.22;
    const ry = (Math.sin(t * 0.15) * 0.1 + p.x * 0.14) * motion;
    const rx = (Math.sin(t * 0.11) * 0.04 - p.y * 0.08) * motion;
    g.rotation.y += (ry - g.rotation.y) * damp(dt, 2);
    g.rotation.x += (rx - g.rotation.x) * damp(dt, 2);

    // chuột → mặt phẳng z=0 → local của nhóm hạt (uMouse)
    v2.set(p.x, p.y);
    ray.setFromCamera(v2, cam);
    if (ray.ray.intersectPlane(plane, v3)) {
      g.worldToLocal(v3);
      shared.mouseLocal.lerp(v3, damp(dt, 9));
    }
    const target = p.active ? (s.reduced ? 0.5 : 1) : 0;
    shared.mouseStrength += (target - shared.mouseStrength) * damp(dt, p.active ? 6 : 2.5);
  });

  return (
    <>
      <color attach="background" args={[INK]} />
      {/* Studio phản chiếu cho chrome: navy nền + dải trắng trên, cobalt trái, vàng ấm phải */}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#0b1020"]} />
        <Lightformer intensity={3} position={[0, 4.5, 0]} rotation-x={Math.PI / 2} scale={[10, 3, 1]} color="#ffffff" />
        <Lightformer intensity={1.8} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 1.6, 1]} color="#9db8ff" />
        <Lightformer intensity={1.6} position={[5, 0.5, 2]} rotation-y={-Math.PI / 2} scale={[6, 1.6, 1]} color="#ffd9a3" />
        <Lightformer intensity={0.6} position={[0, 0.2, -5]} scale={[10, 1.2, 1]} color="#ffffff" />
      </Environment>
      <Nebula s={s} shared={shared} />
      <Stars s={s} shared={shared} />
      <group ref={group}>
        <Particles s={s} shared={shared} mono={mono} />
        <Rings s={s} shared={shared} />
      </group>
      {s.bloom && <Post shared={shared} />}
    </>
  );
}

/* ------------------------------------------------------------------ component */
export default function NebulaHero() {
  const [s, setS] = useState<Settings | null>(null);
  const shared = useRef<Shared>({
    anim: { progress: 0, flash: 0, ring: 0, camZ: 9.2 },
    ptr: { x: 0, y: 0, active: false },
    mouseLocal: new THREE.Vector3(99, 99, 0),
    mouseStrength: 0,
  }).current;
  const veil = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLDivElement>(null);
  const words = useRef<HTMLSpanElement[]>([]);

  // Chỉ quyết định chất lượng ở client (tránh lệch SSR)
  useEffect(() => {
    const mobile = window.innerWidth < 760;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setS({
      mobile,
      reduced,
      count: mobile ? 60_000 : 180_000,
      stars: mobile ? 500 : 1600,
      dpr: mobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5),
      bloom: !mobile,
      octaves: mobile ? 2 : 3,
    });
  }, []);

  // Con trỏ (NDC) — overlay pointer-events:none nên canvas nhận sự kiện; theo dõi trên window cho chắc
  useEffect(() => {
    const p = shared.ptr;
    const move = (e: PointerEvent) => {
      p.x = (e.clientX / window.innerWidth) * 2 - 1;
      p.y = -(e.clientY / window.innerHeight) * 2 + 1;
      p.active = true;
    };
    const up = (e: PointerEvent) => { if (e.pointerType !== "mouse") p.active = false; };
    const out = (e: MouseEvent) => { if (!e.relatedTarget) p.active = false; };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", move, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    document.addEventListener("mouseout", out);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      document.removeEventListener("mouseout", out);
    };
  }, [shared]);

  // Timeline reveal (gsap tween object thuần → useFrame đọc)
  useEffect(() => {
    if (!s) return;
    const a = shared.anim;
    const r = s.reduced;
    a.progress = 0; a.flash = 0; a.ring = 0; a.camZ = r ? CAM_Z : 9.2;
    const tl = gsap.timeline();
    tl.to(a, { progress: 1, duration: r ? 1.6 : 3.0, ease: "power2.inOut" }, 0.1);
    if (!r) tl.to(a, { camZ: CAM_Z, duration: 3.6, ease: "power2.out" }, 0.1);
    tl.to(a, { ring: 1, duration: 1.3, ease: "back.out(1.6)" }, r ? 0.8 : 2.0);
    if (!r) {
      tl.to(a, { flash: 1, duration: 0.18, ease: "power2.in" }, 2.55);
      tl.to(a, { flash: 0, duration: 1.1, ease: "power3.out" }, 2.73);
    }
    if (veil.current) tl.to(veil.current, { opacity: 0, duration: 1.2, ease: "power2.out" }, 0.15);
    if (label.current) tl.fromTo(label.current, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, 0.7);
    const ws = words.current.filter(Boolean);
    if (ws.length) {
      tl.fromTo(
        ws,
        { yPercent: r ? 0 : 115, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: r ? 0.6 : 1.1, ease: "power4.out", stagger: r ? 0.02 : 0.07 },
        r ? 0.6 : 2.2,
      );
    }
    if (readout.current) tl.fromTo(readout.current, { opacity: 0 }, { opacity: 1, duration: 0.8 }, r ? 0.8 : 2.9);
    return () => { tl.kill(); };
  }, [s, shared]);

  const mobile = s?.mobile ?? false;
  const insetX = mobile ? "20px" : "clamp(24px, 5.5vw, 84px)";
  const accent: React.CSSProperties = {
    backgroundImage: "linear-gradient(92deg, #8ec5ff 0%, #ffffff 48%, #ffd58a 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "transparent",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: INK, overflow: "hidden" }}>
      {s && (
        <Canvas
          dpr={s.dpr}
          frameloop="always"
          camera={{ fov: FOV, position: [0, 0, s.reduced ? CAM_Z : 9.2], near: 0.1, far: 60 }}
          gl={{ antialias: !s.bloom, alpha: false, powerPreference: "high-performance", stencil: false }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.1;
          }}
          style={{ position: "absolute", inset: 0 }}
        >
          <Scene s={s} shared={shared} />
        </Canvas>
      )}

      {/* Overlay HUD — tối giản, không nav, không nút */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", fontFamily: FONT }}>
        <div
          ref={label}
          style={{
            position: "absolute",
            left: insetX,
            top: mobile ? "22px" : "clamp(22px, 4vh, 44px)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "rgba(226,232,255,0.74)",
            whiteSpace: "nowrap",
            opacity: 0,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: 999,
              background: "linear-gradient(135deg, #8ec5ff, #1d4ed8)",
              boxShadow: "0 0 12px 2px rgba(80,140,255,0.55)",
              animation: "vdn-pulse 2.4s ease-in-out infinite",
            }}
          />
          VDuyStudio — Verified Identity Studio
        </div>

        <h1
          style={{
            position: "absolute",
            left: insetX,
            bottom: mobile ? "32px" : "clamp(28px, 7vh, 76px)",
            margin: 0,
            fontFamily: FONT,
            fontWeight: 900,
            fontStretch: "125%",
            fontSize: mobile ? "clamp(30px, 9.4vw, 46px)" : "clamp(34px, 5.1vw, 84px)",
            lineHeight: 1.02,
            letterSpacing: "-0.028em",
            color: "#f3f5ff",
            maxWidth: "min(92vw, 880px)",
            textShadow: "0 2px 34px rgba(6,9,26,0.6)",
          }}
        >
          {HEADLINE.map((w, i) => (
            <span key={i}>
              <span
                ref={(el) => { if (el) words.current[i] = el; }}
                style={{ display: "inline-block", opacity: 0, willChange: "transform", ...(i >= ACCENT_FROM ? accent : null) }}
              >
                {w}
              </span>
              {i === BREAK_AFTER ? <br /> : " "}
            </span>
          ))}
        </h1>

        {s && !mobile && (
          <div
            ref={readout}
            style={{
              position: "absolute",
              right: insetX,
              bottom: "clamp(28px, 7vh, 76px)",
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(226,232,255,0.42)",
              textAlign: "right",
              lineHeight: 1.9,
              opacity: 0,
            }}
          >
            VD · {Math.round(s.count / 1000)}K hạt
            <br />
            verified orbit
          </div>
        )}
      </div>

      <div ref={veil} style={{ position: "absolute", inset: 0, background: INK, opacity: 1, pointerEvents: "none" }} />
      <style>{`@keyframes vdn-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.4);opacity:.65}}`}</style>
    </div>
  );
}
