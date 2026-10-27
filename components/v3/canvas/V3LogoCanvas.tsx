"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import LogoVD from "./LogoVD";
import { tierDpr } from "@/lib/v3/quality";

// Canvas logo hero: nền trong suốt trên nền kem, bóng mềm (ContactShadows).
// Chỉ render liên tục khi stage trong viewport và tab đang hiện (tiết kiệm GPU).
// ?capture=1 → tư thế tĩnh + preserveDrawingBuffer để chụp PNG fallback cho mobile.
// DEV capture: sau ~40 frame (env + bóng đã ổn định) render rồi toDataURL NGAY trong frame → POST.
function AutoCapture() {
  const { gl, scene, camera } = useThree();
  const n = useRef(0);
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    n.current += 1;
    if (n.current < 40 || gl.domElement.width < 400) return;
    done.current = true;
    gl.render(scene, camera);
    const c = gl.domElement;
    const S = 900;
    const off = document.createElement("canvas"); off.width = S; off.height = S;
    const ctx = off.getContext("2d")!;
    ctx.drawImage(c, 0, 0, c.width, c.height, 0, 0, S, S);
    const dataUrl = off.toDataURL("image/png");
    fetch("/api/v3-capture", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ dataUrl }) })
      .then((r) => r.json()).then((j) => { (window as unknown as { __v3CaptureDone?: unknown }).__v3CaptureDone = { ...j, src: [c.width, c.height] }; })
      .catch((e) => { (window as unknown as { __v3CaptureDone?: unknown }).__v3CaptureDone = { error: String(e) }; });
  }, 1);
  return null;
}

export default function V3LogoCanvas() {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  // Tính đồng bộ (component ssr:false → có window) để preserveDrawingBuffer đúng từ lúc tạo renderer.
  const capture = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("capture") === "1";

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver((e) => setActive(e[0]?.isIntersecting ?? true), { threshold: 0.05 });
    io.observe(el);
    const vis = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", vis); };
  }, []);

  return (
    <div ref={wrap} className="v3-logo-canvas">
      <Canvas
        dpr={tierDpr(2)}
        frameloop={active || capture ? "always" : "demand"}
        camera={{ fov: 30, position: [0, 0, 5.6], near: 0.1, far: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: capture }}
        onCreated={(state) => {
          state.gl.setClearColor(0x000000, 0);
          // capture=1 (dev): cho script chụp gọi render + toDataURL trong cùng một lượt
          if (capture) (window as unknown as { __v3Logo?: unknown }).__v3Logo = state;
        }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 5, 4]} intensity={1.4} />
        <directionalLight position={[-4, 2, -2]} intensity={0.5} color="#dfe8ff" />
        <hemisphereLight args={["#ffffff", "#c9c2b4", 0.55]} />
        <LogoVD pose={capture} />
        {capture && <AutoCapture />}
        <ContactShadows position={[0, -1.3, 0]} opacity={0.4} scale={5.5} blur={2.6} far={2.2} color="#111111" frames={capture ? 1 : Infinity} />
      </Canvas>
    </div>
  );
}
