"use client";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { BADGE_PATH } from "@/lib/v3/badgePath";

// Logo V-D dựng bằng hình học thật (không dùng ảnh render của v2):
// chữ V và D bo khối, chrome bạc phản chiếu RoomEnvironment; huy hiệu
// tích xanh cobalt extrude từ BADGE_PATH ở góc trên phải.

const EXTRUDE: THREE.ExtrudeGeometryOptions = {
  depth: 0.34, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 5, curveSegments: 28,
};

function shapeV(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-1.0, 1.0); s.lineTo(-0.52, 1.0); s.lineTo(0.0, -0.2); s.lineTo(0.52, 1.0); s.lineTo(1.0, 1.0);
  s.lineTo(0.3, -1.0); s.lineTo(-0.3, -1.0); s.closePath();
  return s;
}
function shapeD(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.95, 1.0); s.lineTo(0.05, 1.0);
  s.bezierCurveTo(1.15, 1.0, 1.15, -1.0, 0.05, -1.0);
  s.lineTo(-0.95, -1.0); s.closePath();
  const h = new THREE.Path();
  h.moveTo(-0.47, 0.52); h.lineTo(0.02, 0.52);
  h.bezierCurveTo(0.62, 0.52, 0.62, -0.52, 0.02, -0.52);
  h.lineTo(-0.47, -0.52); h.closePath();
  s.holes.push(h);
  return s;
}
function shapeBadge(): THREE.Shape[] {
  const loader = new SVGLoader();
  const data = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${BADGE_PATH}"/></svg>`);
  const shapes: THREE.Shape[] = [];
  for (const p of data.paths) shapes.push(...SVGLoader.createShapes(p));
  return shapes;
}

function useEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => { env.dispose(); pmrem.dispose(); scene.environment = null; };
  }, [gl, scene]);
}

export default function LogoVD({ pose = false }: { pose?: boolean }) {
  useEnvironment();
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const geo = useMemo(() => {
    const v = new THREE.ExtrudeGeometry(shapeV(), EXTRUDE);
    const d = new THREE.ExtrudeGeometry(shapeD(), EXTRUDE);
    const badge = new THREE.ExtrudeGeometry(shapeBadge(), { depth: 10, bevelEnabled: true, bevelThickness: 2, bevelSize: 2, bevelSegments: 3, curveSegments: 8 });
    badge.center();
    v.center(); d.center();
    return { v, d, badge };
  }, []);

  const chrome = useMemo(() => new THREE.MeshStandardMaterial({ color: "#f4f6f9", metalness: 1, roughness: 0.18, envMapIntensity: 1.35 }), []);
  const blue = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1d4ed8", metalness: 0.35, roughness: 0.32, envMapIntensity: 0.9 }), []);
  const white = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ffffff", metalness: 0, roughness: 0.6 }), []);

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
    if (pose) { g.rotation.set(0.08, -0.42, 0); return; }
    const t = state.clock.elapsedTime;
    const ty = Math.sin(t * 0.45) * 0.38 + pointer.current.x * 0.28;
    const tx = 0.06 + Math.sin(t * 0.7) * 0.04 + pointer.current.y * 0.12;
    g.rotation.y += (ty - g.rotation.y) * 0.06;
    g.rotation.x += (tx - g.rotation.x) * 0.06;
    g.position.y = Math.sin(t * 1.1) * 0.05;
  });

  return (
    <group ref={group} scale={0.66} position={[0, 0.08, 0]}>
      <mesh geometry={geo.v} material={chrome} position={[-0.72, 0, 0]} castShadow />
      <mesh geometry={geo.d} material={chrome} position={[0.62, 0, 0.1]} castShadow />
      <group position={[1.42, 1.02, 0.42]} scale={0.0078}>
        <mesh geometry={geo.badge} material={blue} />
        {/* dấu check: 2 thanh trắng */}
        <mesh material={white} position={[-9, -4, 8]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[18, 6, 4]} />
        </mesh>
        <mesh material={white} position={[7, 3, 8]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[32, 6, 4]} />
        </mesh>
      </group>
    </group>
  );
}
