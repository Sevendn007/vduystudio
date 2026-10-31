"use client";
// Nền của các chương từ "Tuyến đường" trở xuống.
// Thay cho lưới ô vuông + đường kẻ của bản trước (nhìn như giấy kẻ): ở đây chỉ
// có sương cực quang trôi chậm, một dòng hạt chạy dọc tuyến và những quả cầu
// sáng ở mỗi điểm đón.
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { NORTH_CURVE, ROUTE_CURVE, ROUTE_NODES } from "./journey";
import { auroraFrag, fieldVert, streamFrag, streamVert } from "./shaders";

/** Hạt rải dọc một đường cong, kèm lệch ngang nhẹ cho dòng hạt có bề dày. */
function streamGeometry(curve: THREE.Curve<THREE.Vector3>, count: number, spread: number, seed = 5) {
  const pos = new Float32Array(count * 3);
  const ts = new Float32Array(count);
  const seeds = new Float32Array(count);
  let s = seed;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  const p = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    curve.getPointAt(t, p);
    pos[i * 3] = p.x + (rnd() - 0.5) * spread;
    pos[i * 3 + 1] = p.y + (rnd() - 0.5) * spread * 0.5 + rnd() * 0.3;
    pos[i * 3 + 2] = p.z + (rnd() - 0.5) * spread;
    ts[i] = t;
    seeds[i] = rnd();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aT", new THREE.BufferAttribute(ts, 1));
  g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  g.computeBoundingSphere();
  return g;
}

function Stream({
  curve,
  count,
  color,
  hot,
  speed,
  dpr,
  revealRef,
}: {
  curve: THREE.Curve<THREE.Vector3>;
  count: number;
  color: string;
  hot: string;
  speed: number;
  dpr: number;
  revealRef: React.MutableRefObject<number>;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geo = useMemo(() => streamGeometry(curve, count, 0.55), [curve, count]);
  useEffect(() => () => geo.dispose(), [geo]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uSpeed: { value: speed },
      uSize: { value: 3.4 },
      uPixelRatio: { value: dpr },
      uColor: { value: new THREE.Color(color) },
      uHot: { value: new THREE.Color(hot) },
    }),
    [speed, dpr, color, hot]
  );

  useFrame((_, delta) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value += Math.min(delta, 0.05);
    u.uReveal.value = revealRef.current;
  });

  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={streamVert}
        fragmentShader={streamFrag}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Quả cầu sáng ở mỗi điểm đón: lõi đặc + hai lớp quầng mờ, không vòng không cột. */
function Orb({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  // ẩn từ đầu: useFrame mới quyết định lúc nào hiện (tránh loé 1 khung lúc mount)
  return (
    <group position={position} scale={scale} visible={false}>
      <mesh>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.95, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function RouteFlow({
  revealRef,
  northRef,
  dpr,
  tier,
}: {
  revealRef: React.MutableRefObject<number>;
  northRef: React.MutableRefObject<number>;
  dpr: number;
  tier: number;
}) {
  const aurora = useRef<THREE.ShaderMaterial>(null);
  const nodes = useRef<THREE.Group>(null);
  const north = useRef<THREE.Group>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uCold: { value: new THREE.Color("#2f6bff") },
      uWarm: { value: new THREE.Color("#ff7a4d") },
    }),
    []
  );

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const u = aurora.current?.uniforms;
    if (u) {
      u.uTime.value += d;
      u.uReveal.value = revealRef.current;
    }
    if (nodes.current) {
      nodes.current.children.forEach((c, i) => {
        const on = THREE.MathUtils.clamp(revealRef.current * (ROUTE_NODES.length + 1) - i, 0, 1);
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.6 + i * 0.8) * 0.07;
        // thu về 0,001 vẫn vẽ ra 1 điểm ảnh trắng, bloom phóng thành quả cầu → ẩn hẳn
        c.visible = on > 0.01;
        c.scale.setScalar(Math.max(on, 0.01) * pulse);
      });
    }
    if (north.current) north.current.visible = northRef.current > 0.01;
  });

  return (
    <group>
      {/* sương nền, nằm ngang dưới tuyến */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
        <planeGeometry args={[96, 96, 1, 1]} />
        <shaderMaterial
          ref={aurora}
          uniforms={uniforms}
          vertexShader={fieldVert}
          fragmentShader={auroraFrag}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <Stream
        curve={ROUTE_CURVE}
        count={tier >= 2 ? 1400 : 500}
        color="#2f6bff"
        hot="#bfe6ff"
        speed={0.075}
        dpr={dpr}
        revealRef={revealRef}
      />

      <group ref={nodes}>
        {ROUTE_NODES.map((n, i) => (
          <Orb
            key={n.name}
            position={n.pos}
            color={i === ROUTE_NODES.length - 1 ? "#ffb547" : "#39d0ff"}
            scale={i === 0 || i === ROUTE_NODES.length - 1 ? 1.25 : 1}
          />
        ))}
      </group>

      <group ref={north} visible={false}>
        <Stream
          curve={NORTH_CURVE}
          count={tier >= 2 ? 900 : 360}
          color="#ff9a3d"
          hot="#ffe6b8"
          speed={0.055}
          dpr={dpr}
          revealRef={northRef}
        />
      </group>
    </group>
  );
}
