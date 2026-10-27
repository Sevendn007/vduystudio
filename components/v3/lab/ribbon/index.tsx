"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, MeshReflectorMaterial, Sparkles } from "@react-three/drei";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import gsap from "gsap";
import { buildRibbon, makeCurve } from "./geometry";
import {
  BG_FRAG, BG_VERT, GLOW_FRAG, GLOW_VERT,
  RIBBON_NORMAL_INJECT, RIBBON_POSITION_INJECT, RIBBON_VERT_HEAD,
} from "./shaders";

// LAB "ribbon" — LIQUID CHROME RIBBON
// Monogram VD = MỘT dải ruy-băng chrome lỏng liên tục: dấu tích ✓ (V) có tay dài trở thành sống
// chữ D nghiêng, bụng D vòng ra phía người xem rồi chui về sau đỉnh tích. Dải "chảy" từ đầu tới
// cuối khi reveal (uniform progress), idle gợn sóng + cuộn xoắn + nhịp phồng (vertex shader),
// chuột khuấy/đẩy dải. Nền deep ink + vignette ấm/cobalt, sàn phản chiếu mờ, bloom nhẹ (desktop).

type Tier = { mobile: boolean; rm: boolean };

const CAM_Z = 9.2;
const CAM_Y = 1.2;
const FOV = 32;
const RIBBON_W = 4.92; // bề rộng monogram (đơn vị thế giới) ở scale 1
const INK = "#080b13";
const CAMERA = { fov: FOV, position: [0, CAM_Y, CAM_Z + 3.2] as [number, number, number], near: 0.1, far: 60 };

// ------------------------------------------------------------------ nền
function Background() {
  const { size } = useThree();
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: BG_VERT,
        fragmentShader: BG_FRAG,
        uniforms: {
          uTime: { value: 0 },
          uRes: { value: new THREE.Vector2(1, 1) },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uInk: { value: new THREE.Color(INK) },
          uNavy: { value: new THREE.Color("#131b30") },
          uWarm: { value: new THREE.Color("#8a4a1e") },
          uCobalt: { value: new THREE.Color("#1e44c4") },
        },
        depthWrite: false,
        depthTest: false,
      }),
    [],
  );
  useEffect(() => {
    (mat.uniforms.uRes.value as THREE.Vector2).set(size.width, size.height);
  }, [size, mat]);
  useEffect(() => () => mat.dispose(), [mat]);
  useFrame((s) => {
    mat.uniforms.uTime.value = s.clock.elapsedTime;
    const m = mat.uniforms.uMouse.value as THREE.Vector2;
    m.x += (s.pointer.x - m.x) * 0.04;
    m.y += (s.pointer.y - m.y) * 0.04;
  });
  return (
    <mesh material={mat} renderOrder={-10} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

// ------------------------------------------------------------------ hậu kỳ (desktop)
function Post({ enabled }: { enabled: boolean }) {
  const { gl, scene, camera, size, viewport } = useThree();
  const composer = useMemo(() => {
    if (!enabled) return null;
    const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
    const c = new EffectComposer(gl, rt);
    c.addPass(new RenderPass(scene, camera));
    c.addPass(new UnrealBloomPass(new THREE.Vector2(size.width, size.height), 0.38, 0.62, 0.88));
    c.addPass(new OutputPass());
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, gl, scene, camera]);
  useEffect(() => {
    if (!composer) return;
    composer.setPixelRatio(viewport.dpr);
    composer.setSize(size.width, size.height);
  }, [composer, size, viewport.dpr]);
  useEffect(() => () => composer?.dispose(), [composer]);
  useFrame(() => {
    if (composer) composer.render();
  }, enabled ? 1 : 0);
  return null;
}

// ------------------------------------------------------------------ dải chrome
const ORBS: { p: [number, number, number]; r: number; kind: "chrome" | "cobalt"; d: number }[] = [
  { p: [-3.7, 1.7, -1.3], r: 0.24, kind: "chrome", d: 2.0 },
  { p: [3.55, 1.95, -0.7], r: 0.17, kind: "chrome", d: 2.25 },
  { p: [3.2, -1.25, 1.25], r: 0.31, kind: "chrome", d: 1.85 },
  { p: [-3.35, -1.45, 0.9], r: 0.14, kind: "cobalt", d: 2.4 },
  { p: [0.5, 2.45, -2.3], r: 0.12, kind: "chrome", d: 2.55 },
  { p: [2.7, 0.7, 2.25], r: 0.085, kind: "cobalt", d: 2.7 },
];

function RibbonScene({ tier }: { tier: Tier }) {
  const { mobile, rm } = tier;
  const { camera, size } = useThree();
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const orbRefs = useRef<(THREE.Group | null)[]>([]);

  // --- bố cục theo khung nhìn (tính từ vị trí camera cuối reveal)
  const layout = useMemo(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const visH = 2 * CAM_Z * Math.tan((FOV * Math.PI) / 360);
    const visW = visH * aspect;
    if (mobile) {
      return { scale: THREE.MathUtils.clamp((visW * 0.86) / RIBBON_W, 0.3, 0.8), x: 0, y: visH * 0.12 };
    }
    return { scale: THREE.MathUtils.clamp((visW * 0.52) / RIBBON_W, 0.55, 1.12), x: visW * 0.085, y: 0.22 };
  }, [size, mobile]);

  // --- geometry + curve (1 lần)
  const built = useMemo(() => {
    const curve = makeCurve();
    const seg = mobile ? 380 : 720;
    const { geometry, length } = buildRibbon(curve, seg, 0.64, 0.115, mobile ? 4 : 6, mobile ? 6 : 8);
    return { curve, geometry, length };
  }, [mobile]);
  useEffect(() => () => built.geometry.dispose(), [built]);

  // --- uniforms điều khiển (mutate .value, không re-render)
  const U = useMemo(() => {
    const start = built.curve.getPointAt(0);
    return {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uSettle: { value: 0 },
      uWave: { value: rm ? 0.06 : 0.15 },
      uWaveFreq: { value: 11.0 },
      uTwist: { value: rm ? 0.9 : 1.7 },
      uBreath: { value: 0.05 },
      uPush: { value: 0 },
      uLen: { value: built.length },
      uHead: { value: start.clone() },
      uMouse: { value: new THREE.Vector3(100, 100, 0) },
    };
  }, [built, rm]);

  const chrome = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      metalness: 1,
      roughness: 0.075,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      iridescence: 0.45,
      iridescenceIOR: 1.35,
      iridescenceThicknessRange: [120, 420],
      envMapIntensity: 1.55,
    });
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, U);
      shader.vertexShader =
        RIBBON_VERT_HEAD +
        shader.vertexShader
          .replace("#include <beginnormal_vertex>", RIBBON_NORMAL_INJECT)
          .replace("#include <begin_vertex>", RIBBON_POSITION_INJECT);
    };
    m.customProgramCacheKey = () => "vd-ribbon-v1";
    return m;
  }, [U]);
  useEffect(() => () => chrome.dispose(), [chrome]);

  const orbChrome = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: "#ffffff", metalness: 1, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 1.5 }),
    [],
  );
  const orbCobalt = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: "#1c3fff", metalness: 0.15, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.2, iridescence: 0.6, iridescenceIOR: 1.4 }),
    [],
  );
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(1, mobile ? 28 : 44, mobile ? 20 : 32), [mobile]);
  useEffect(() => () => { orbChrome.dispose(); orbCobalt.dispose(); sphereGeo.dispose(); }, [orbChrome, orbCobalt, sphereGeo]);

  // --- con trỏ: NDC + vận tốc (window) → object space của dải
  const ptr = useRef({ x: 0, y: 0, vel: 0, last: -1e9, has: false });
  useEffect(() => {
    const on = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      const p = ptr.current;
      if (p.has) p.vel += Math.hypot(nx - p.x, ny - p.y);
      p.x = nx; p.y = ny; p.has = true; p.last = performance.now();
    };
    const leave = () => { ptr.current.last = -1e9; };
    window.addEventListener("pointermove", on, { passive: true });
    window.addEventListener("pointerleave", leave);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", on);
      window.removeEventListener("pointerleave", leave);
      document.removeEventListener("mouseleave", leave);
    };
  }, []);

  // --- reveal timeline (gsap): dải chảy, camera dolly, xoay về tư thế, orbs nở ra
  const base = useRef({ rx: 0.42, ry: -1.15 });
  useEffect(() => {
    const k = rm ? 0.55 : 1;
    camera.position.set(0, CAM_Y, CAM_Z + 3.2);
    camera.lookAt(0, 0.05, 0);
    const tl = gsap.timeline();
    tl.to(U.uProgress, { value: 1, duration: 2.7 * k, ease: "power2.inOut" }, 0.12)
      .to(U.uWave, { value: rm ? 0.012 : 0.034, duration: 3.4 * k, ease: "power2.out" }, 0.5)
      .to(U.uTwist, { value: rm ? 0.45 : 0.72, duration: 3.6 * k, ease: "power3.out" }, 0.3)
      .to(U.uSettle, { value: 1, duration: 1.3 * k, ease: "power2.out" }, 2.5 * k)
      .to(camera.position, { z: CAM_Z, duration: 3.6 * k, ease: "power3.out" }, 0)
      .to(base.current, { rx: 0, ry: 0, duration: 3.4 * k, ease: "power3.out" }, 0);
    orbRefs.current.forEach((g, i) => {
      if (!g) return;
      g.scale.setScalar(0.0001);
      tl.to(g.scale, { x: 1, y: 1, z: 1, duration: 1.4 * k, ease: "elastic.out(1, 0.55)" }, ORBS[i].d * k);
    });
    return () => { tl.kill(); };
  }, [U, camera, rm]);

  // --- vòng lặp: thời gian, đầu dải, chuột, xoay idle/parallax
  const tmpV = useMemo(() => new THREE.Vector3(), []);
  const tmpDir = useMemo(() => new THREE.Vector3(), []);
  const tmpHit = useMemo(() => new THREE.Vector3(), []);
  useFrame((s, dt) => {
    const t = s.clock.elapsedTime;
    const d = Math.min(dt, 0.05);
    U.uTime.value = t;
    // điểm đầu dải tại progress hiện tại (tìm kiếm nhị phân trên bảng độ dài cung — rẻ)
    built.curve.getPointAt(THREE.MathUtils.clamp(U.uProgress.value, 0, 1), tmpV);
    U.uHead.value.copy(tmpV);

    const g = group.current, m = mesh.current;
    if (!g || !m) return;

    // chuột → giao điểm tia với mặt phẳng z = 0 (world) → object space của mesh
    const p = ptr.current;
    const active = performance.now() - p.last < 1800 && !rm;
    if (p.has) {
      tmpV.set(p.x, p.y, 0.5).unproject(s.camera);
      tmpDir.copy(tmpV).sub(s.camera.position).normalize();
      const k = Math.abs(tmpDir.z) > 1e-4 ? -s.camera.position.z / tmpDir.z : 0;
      tmpHit.copy(s.camera.position).addScaledVector(tmpDir, k);
      m.worldToLocal(tmpHit);
      const mu = U.uMouse.value as THREE.Vector3;
      mu.lerp(tmpHit, 1 - Math.exp(-d * 9));
    }
    const pushTarget = active ? 0.32 + Math.min(0.68, p.vel * 9) : 0;
    p.vel *= Math.exp(-d * 6);
    U.uPush.value += (pushTarget - U.uPush.value) * (1 - Math.exp(-d * (pushTarget > U.uPush.value ? 7 : 2.2)));

    // xoay: tư thế cơ bản (tween) + nhịp sống + parallax chuột
    const idle = rm ? 0.35 : 1;
    const px = p.has ? p.x : 0, py = p.has ? p.y : 0;
    const ty = base.current.ry + Math.sin(t * 0.3) * 0.2 * idle + px * 0.26;
    const tx = base.current.rx + Math.sin(t * 0.43) * 0.07 * idle - py * 0.13;
    const a = 1 - Math.exp(-d * 3.2);
    g.rotation.y += (ty - g.rotation.y) * a;
    g.rotation.x += (tx - g.rotation.x) * a;
    g.position.y = layout.y + Math.sin(t * 0.9) * 0.05 * idle;
  });

  return (
    <>
      <group ref={group} position={[layout.x, layout.y, 0]} scale={layout.scale}>
        <mesh ref={mesh} geometry={built.geometry} material={chrome} frustumCulled={false} />
      </group>
      {ORBS.slice(0, mobile ? 4 : ORBS.length).map((o, i) => (
        <Float key={i} speed={rm ? 0.5 : 1.3} rotationIntensity={0.25} floatIntensity={rm ? 0.3 : 0.9} floatingRange={[-0.18, 0.18]}>
          <group
            ref={(el) => { orbRefs.current[i] = el; }}
            position={[o.p[0] * (mobile ? 0.55 : 1) + (mobile ? 0 : layout.x * 0.5), o.p[1] * (mobile ? 0.7 : 1) + (mobile ? layout.y : 0), o.p[2]]}
          >
            <mesh geometry={sphereGeo} material={o.kind === "chrome" ? orbChrome : orbCobalt} scale={o.r} />
          </group>
        </Float>
      ))}
    </>
  );
}

// ------------------------------------------------------------------ sàn / bóng
function Floor({ tier }: { tier: Tier }) {
  if (tier.mobile) {
    return <MobileGlow />;
  }
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -1.85, -6]}>
      <planeGeometry args={[80, 60]} />
      <MeshReflectorMaterial
        mirror={0.7}
        resolution={640}
        blur={[340, 110]}
        mixBlur={1.1}
        mixStrength={2.4}
        mixContrast={1.0}
        roughness={0.82}
        metalness={0.6}
        color="#0a0f1e"
        depthScale={1.2}
        minDepthThreshold={0.35}
        maxDepthThreshold={1.6}
        depthToBlurRatioBias={0.3}
      />
    </mesh>
  );
}

function MobileGlow() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: GLOW_VERT,
        fragmentShader: GLOW_FRAG,
        uniforms: { uColor: { value: new THREE.Color("#2a4fd8") }, uOpacity: { value: 0.35 } },
        transparent: true,
        depthWrite: false,
      }),
    [],
  );
  useEffect(() => () => mat.dispose(), [mat]);
  return (
    <mesh material={mat} rotation-x={-Math.PI / 2} position={[0, -0.95, -0.5]} scale={[6, 3.2, 1]}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}

// ------------------------------------------------------------------ scene
function Scene({ tier }: { tier: Tier }) {
  const { mobile, rm } = tier;
  return (
    <>
      <fog attach="fog" args={[INK, 13, 34]} />
      <Background />
      {/* Studio phản chiếu tự dựng: dải trắng trên (key), cobalt trái, vàng ấm phải, vòng sáng trước, fill navy */}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#0d1322"]} />
        <Lightformer intensity={4.2} position={[0, 5, -1.5]} rotation-x={Math.PI / 2} scale={[14, 2.6, 1]} color="#ffffff" />
        <Lightformer intensity={1.6} position={[2.5, 3.5, -6]} rotation-z={0.55} scale={[11, 0.55, 1]} color="#fff4e6" />
        <Lightformer intensity={2.6} position={[-6, 0.4, 1]} rotation-y={Math.PI / 2} scale={[8, 3.2, 1]} color="#2f5bff" />
        <Lightformer intensity={2.3} position={[6, -0.8, 1]} rotation-y={-Math.PI / 2} scale={[8, 2.2, 1]} color="#ffb366" />
        <Lightformer form="ring" intensity={1.4} position={[0.5, 1.2, 6]} scale={[3.2, 3.2, 1]} color="#ffffff" />
        <Lightformer intensity={0.55} position={[0, -5, 0]} rotation-x={-Math.PI / 2} scale={[14, 14, 1]} color="#5a6a8f" />
      </Environment>
      <spotLight position={[6, 8, 6]} intensity={140} angle={0.55} penumbra={1} color="#ffe3c2" decay={1.6} />
      <pointLight position={[-6, 2, 4]} intensity={45} color="#4f7bff" decay={1.6} />
      <RibbonScene tier={tier} />
      <Floor tier={tier} />
      <Sparkles
        count={mobile ? 60 : 150}
        scale={[13, 7.5, 7]}
        position={[0, 0.4, -1]}
        size={mobile ? 2 : 3}
        speed={rm ? 0.08 : 0.28}
        opacity={0.5}
        color="#dfe8ff"
        noise={0.7}
      />
      <Post enabled={!mobile} />
    </>
  );
}

// ------------------------------------------------------------------ component gốc
const LINES = ["Uy tín số,", "bắt đầu từ", "dấu tích xanh."];

export default function RibbonLab() {
  const [tier, setTier] = useState<Tier | null>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const eyebrow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mobile = window.innerWidth < 760;
    const rm = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    setTier({ mobile, rm });
  }, []);

  useEffect(() => {
    if (!tier) return;
    const k = tier.rm ? 0.55 : 1;
    const spans = lineRefs.current.filter((x): x is HTMLSpanElement => !!x);
    const tl = gsap.timeline();
    if (eyebrow.current) tl.fromTo(eyebrow.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 1.2 * k, ease: "power2.out" }, 1.0 * k);
    tl.fromTo(
      spans,
      { yPercent: 118, y: 0, rotate: 1.5 },
      { yPercent: 0, y: 0, rotate: 0, duration: 1.35 * k, ease: "expo.out", stagger: 0.1 * k },
      1.45 * k,
    );
    return () => { tl.kill(); };
  }, [tier]);

  const font = "var(--ff-display), 'Archivo', system-ui, -apple-system, sans-serif";
  const mobile = tier?.mobile ?? false;

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: INK, isolation: "isolate" }}>
      {tier && (
        <Canvas
          dpr={mobile ? 1 : [1, 1.5]}
          frameloop="always"
          camera={CAMERA}
          gl={{ antialias: true, alpha: false, stencil: false, powerPreference: "high-performance" }}
          onCreated={(s) => { s.gl.setClearColor(INK, 1); }}
          style={{ position: "absolute", inset: 0 }}
        >
          <Scene tier={tier} />
        </Canvas>
      )}

      {/* Overlay: chữ cực lớn, blend 'difference' → dải chrome cắt ngang chữ (desktop) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          fontFamily: font,
          color: "#ffffff",
          mixBlendMode: mobile ? "normal" : "difference",
          padding: mobile ? "22px 20px 28px" : "clamp(22px, 3.2vw, 44px) clamp(22px, 4.2vw, 64px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          ref={eyebrow}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: mobile ? 11 : 12,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontWeight: 500,
            opacity: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="7.2" fill="#2f6bff" />
            <path d="M4.6 8.3l2.2 2.2 4.6-4.9" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>VDuyStudio — Verified Identity Studio</span>
        </div>

        <h1
          style={{
            margin: 0,
            fontWeight: 500,
            fontSize: mobile ? "clamp(38px, 11.5vw, 56px)" : "clamp(44px, 7.4vw, 136px)",
            lineHeight: 0.95,
            letterSpacing: "-0.035em",
            maxWidth: mobile ? "100%" : "min(62vw, 14em)",
          }}
        >
          {LINES.map((ln, i) => (
            <span
              key={i}
              style={{ display: "block", overflow: "hidden", paddingTop: "0.16em", marginTop: "-0.16em", paddingBottom: "0.1em", marginBottom: "-0.1em" }}
            >
              <span
                ref={(el) => { lineRefs.current[i] = el; }}
                style={{ display: "block", transform: "translateY(118%)", willChange: "transform" }}
              >
                {ln}
              </span>
            </span>
          ))}
        </h1>
      </div>
    </div>
  );
}
