"use client";
// Logo Kim Lý dựng khối: vòng xoáy chấm cầu phát sáng + "hành tinh" ở tâm,
// đúng tạo hình của logo in nhưng ở dạng 3D cho bản 2100.
import { useMemo } from "react";
import * as THREE from "three";
import { Instance, Instances } from "@react-three/drei";

const DOTS = (() => {
  const out: { pos: [number, number, number]; r: number; t: number }[] = [];
  const N = 30;
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const th = 1.1 + t * 2.4 * Math.PI;
    const rad = 0.42 * Math.exp(0.26 * th) * 0.34;
    out.push({
      pos: [Math.cos(th) * rad, Math.sin(th) * rad, Math.sin(th * 1.3) * 0.12],
      r: 0.05 + t * 0.17,
      t,
    });
  }
  return out;
})();

export default function KimLyMark3D() {
  const colors = useMemo(() => DOTS.map((d) => new THREE.Color().lerpColors(new THREE.Color("#8ff0ff"), new THREE.Color("#2f6bff"), d.t)), []);

  return (
    <group rotation={[0.2, 0, -0.3]}>
      <Instances limit={DOTS.length} castShadow={false}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color="#8ff0ff"
          emissive={new THREE.Color("#39d0ff")}
          emissiveIntensity={1.6}
          roughness={0.25}
          metalness={0.4}
          toneMapped={false}
        />
        {DOTS.map((d, i) => (
          <Instance key={i} position={d.pos} scale={d.r} color={colors[i]} />
        ))}
      </Instances>

      {/* hành tinh ở tâm + vành nghiêng */}
      <mesh position={[0.5, 0.32, 0]}>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshStandardMaterial
          color="#27c3c7"
          emissive={new THREE.Color("#27c3c7")}
          emissiveIntensity={1.4}
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0.5, 0.32, 0]} rotation={[Math.PI / 2 - 0.38, 0, 0]}>
        <torusGeometry args={[0.56, 0.022, 10, 48]} />
        <meshStandardMaterial
          color="#ffb547"
          emissive={new THREE.Color("#ffb547")}
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
