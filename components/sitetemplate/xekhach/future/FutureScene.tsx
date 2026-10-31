"use client";
// Sân khấu 3D của bản 2100: một canvas phủ toàn màn hình, camera bay theo tiến
// độ cuộn qua các chương. Chữ tiếng Việt nằm ở lớp overlay HTML, không vẽ trong
// WebGL (font 3D không có đủ dấu).
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, advance, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Stars, PerformanceMonitor } from "@react-three/drei";
import Particles from "./scene/Particles";
import RouteFlow from "./scene/RouteFlow";
import Effects from "./scene/Effects";
import KimLyMark3D from "../shared/three/KimLyMark3D";
import { useResizeKick } from "../shared/three/useResizeKick";
import { CHAPTERS, chapterPresence, sampleJourney } from "./scene/journey";
import { isCapture, isDebug, type Tier } from "@/lib/sitetemplate/xekhach/quality";

export type SceneRefs = {
  progress: React.MutableRefObject<number>;
  assemble: React.MutableRefObject<number>;
  /** 1→0 trong màn mở đầu: camera lùi ra xa rồi đẩy về đúng mốc chương 1. */
  intro: React.MutableRefObject<number>;
};

function Rig({ progress, assemble, intro, tier }: SceneRefs & { tier: Tier }) {
  const camera = useThree((s) => s.camera);
  const scene = useThree((s) => s.scene);
  const gl = useThree((s) => s.gl);
  const busGroup = useRef<THREE.Group>(null);
  const markGroup = useRef<THREE.Group>(null);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const cur = useMemo(() => new THREE.Vector3(16.5, 4.2, 15.5), []);
  const curT = useMemo(() => new THREE.Vector3(-4.6, 2.8, -1.2), []);
  const capture = isCapture();

  // các giá trị đưa xuống từng thành phần con
  // ?debug=1: mở cửa sổ kiểm tra cảnh từ console (không ảnh hưởng bản chạy thật)
  useEffect(() => {
    if (!isDebug()) return;
    const w = window as unknown as { __kl?: unknown };
    w.__kl = {
      setProgress: (v: number) => (progress.current = v),
      setAssemble: (v: number) => (assemble.current = v),
      scene,
      camera,
      // chạy tay n khung hình: môi trường xem trước có thể tiết lưu
      // requestAnimationFrame tới mức cảnh đứng im, tick() cho ảnh tất định
      tick: (n = 60, step = 16) => {
        let t = performance.now();
        for (let i = 0; i < n; i++) {
          t += step;
          advance(t);
        }
        return n;
      },
      info: () => ({
        cam: camera.position.toArray().map((n) => +n.toFixed(2)),
        children: scene.children.map((c) => `${c.type}/${c.name || "-"}:${c.children.length}`),
        visible: scene.children.filter((c) => c.visible).length,
        drawCalls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
        progress: progress.current,
        assemble: assemble.current,
      }),
    };
    return () => {
      delete (window as unknown as { __kl?: unknown }).__kl;
    };
  }, [camera, scene, gl, progress, assemble, intro]);

  const busFade = useRef(1);
  const mapReveal = useRef(0);
  const northReveal = useRef(0);
  const partFade = useRef(1);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const p = progress.current;

    sampleJourney(p, pos, target);
    // màn mở đầu: camera bắt đầu ở xa rồi đẩy vào
    const io = intro.current;
    if (io > 0.001) {
      pos.z += io * 15;
      pos.y += io * 5;
      pos.x += io * 3;
    }
    // lệch nhẹ theo con trỏ cho có chiều sâu (bỏ qua khi chụp ảnh)
    if (!capture && tier >= 2) {
      pos.x += state.pointer.x * 1.4;
      pos.y += state.pointer.y * 0.8;
    }
    const lerp = capture ? 1 : 1 - Math.exp(-4.5 * d);
    cur.lerp(pos, lerp);
    curT.lerp(target, lerp);
    camera.position.copy(cur);
    camera.lookAt(curT);

    // chiếc xe: rõ ở 2 chương đầu, mờ dần khi camera lên bản đồ
    const busOn = Math.max(
      chapterPresence(p, CHAPTERS[0].from, CHAPTERS[0].to, 0.06),
      chapterPresence(p, CHAPTERS[1].from, CHAPTERS[1].to, 0.06)
    );
    busFade.current = busOn;
    partFade.current = Math.max(busOn, 1 - p * 6);
    if (busGroup.current) {
      busGroup.current.visible = busOn > 0.02 || assemble.current < 1;
      busGroup.current.scale.setScalar(0.7 + busOn * 0.3);
    }

    // bản đồ hiện từ chương "route" tới hết
    mapReveal.current = THREE.MathUtils.clamp((p - 0.24) / 0.14, 0, 1);
    northReveal.current = THREE.MathUtils.clamp((p - 0.82) / 0.08, 0, 1);

    if (markGroup.current) {
      const on = chapterPresence(p, CHAPTERS[5].from, CHAPTERS[5].to, 0.06);
      markGroup.current.visible = on > 0.02;
      markGroup.current.scale.setScalar(0.3 + on * 1.4);
      markGroup.current.rotation.y += d * 0.5;
    }
  });

  return (
    <>
      {/* Chiếc xe chỉ còn là đám hạt sáng — khối 3D đặc trước đây trông thô. */}
      <group ref={busGroup} position={[3.0, 0.2, -1.4]}>
        <Particles tier={tier} dpr={1.25} assembleRef={assemble} fadeRef={partFade} />
      </group>

      <RouteFlow revealRef={mapReveal} northRef={northReveal} dpr={1.25} tier={tier} />

      <group ref={markGroup} position={[0, 7.5, -6]} visible={false}>
        <KimLyMark3D />
      </group>
    </>
  );
}

function Sky({ tier }: { tier: Tier }) {
  return (
    <>
      <color attach="background" args={["#030611"]} />
      <fog attach="fog" args={["#030611", 26, 92]} />
      <Environment resolution={128} frames={1}>
        <color attach="background" args={["#0a1430"]} />
        <Lightformer form="rect" intensity={2.2} position={[0, 8, 2]} rotation-x={Math.PI / 2} scale={[16, 6, 1]} color="#39d0ff" />
        <Lightformer form="rect" intensity={1.6} position={[-8, 2, 4]} rotation-y={Math.PI / 2.2} scale={[9, 4, 1]} color="#2f6bff" />
        <Lightformer form="rect" intensity={1.2} position={[8, 2, -2]} rotation-y={-Math.PI / 2.2} scale={[9, 4, 1]} color="#ff3b4e" />
      </Environment>
      <hemisphereLight args={["#9fd8ff", "#06122a", 0.5]} />
      <directionalLight position={[6, 9, 5]} intensity={0.8} color="#bfe6ff" />
      {tier >= 2 && <Stars radius={90} depth={45} count={900} factor={3.2} saturation={0} fade speed={0.3} />}
    </>
  );
}

export default function FutureScene({
  progress,
  assemble,
  intro,
  tier,
  onContextLost,
}: SceneRefs & { tier: Tier; onContextLost?: () => void }) {
  useResizeKick();
  // dpr thích ứng: bắt đầu 1,25 trên desktop, máy yếu tự hạ về 1 rồi 0,8
  const [dpr, setDpr] = useState(tier >= 2 ? 1.25 : 1);
  return (
    <Canvas
      className="kl-f-canvas"
      dpr={dpr}
      gl={{ antialias: tier >= 2, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [16.5, 4.2, 15.5], fov: tier >= 2 ? 42 : 55, near: 0.1, far: 240 }}
      onCreated={({ gl }) => {
        // mất context (GPU reset, quá nhiều canvas): chuyển sang bản tĩnh cho
        // lần hiển thị này thôi, không ghi nhớ sang lần tải sau
        gl.domElement.addEventListener("webglcontextlost", () => onContextLost?.(), { once: true });
      }}
    >
      <PerformanceMonitor
        onDecline={() => setDpr((v) => Math.max(0.8, +(v - 0.25).toFixed(2)))}
        onIncline={() => setDpr((v) => Math.min(tier >= 2 ? 1.25 : 1, v + 0.25))}
        flipflops={2}
      />
      {/* không bọc Suspense: cảnh này không tải asset ngoài, mà một Suspense
          treo sẽ làm cả cảnh biến mất và canvas chỉ còn màu nền */}
      <Sky tier={tier} />
      <Rig progress={progress} assemble={assemble} intro={intro} tier={tier} />
      {tier >= 2 && <Effects />}
    </Canvas>
  );
}
