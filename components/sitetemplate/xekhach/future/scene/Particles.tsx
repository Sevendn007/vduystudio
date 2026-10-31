"use client";
// Chiếc xe hologram: đám hạt bay vào và xếp thành đúng đường nét của xe giường
// nằm thật. Điểm đã là KHỐI 3D (hông hai bên, đầu, đuôi — bung từ ảnh, xem
// scripts/xekhach-bus-points.mjs) nên xe xoay chậm quanh trục đứng như một mô
// hình thật, không còn là tấm phẳng quay theo camera.
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { scatterCloud } from "./journey";
import { particleFrag, particleVert } from "./shaders";

const BIN = "/sitetemplate/xekhach/bus-points.bin";

type Cloud = { target: Float32Array; weight: Float32Array; count: number };

async function loadCloud(): Promise<Cloud> {
  const res = await fetch(BIN);
  const buf = await res.arrayBuffer();
  const dv = new DataView(buf);
  const count = dv.getUint32(0, true);
  const target = new Float32Array(count * 3);
  const weight = new Float32Array(count);
  let o = 4;
  for (let i = 0; i < count; i++) {
    target[i * 3] = dv.getInt16(o, true) / 1000;
    target[i * 3 + 1] = dv.getInt16(o + 2, true) / 1000;
    target[i * 3 + 2] = dv.getInt16(o + 4, true) / 1000;
    weight[i] = dv.getUint8(o + 6) / 255;
    o += 8;
  }
  return { target, weight, count };
}

export default function Particles({
  dpr,
  assembleRef,
  fadeRef,
  tier,
}: {
  dpr: number;
  tier: number;
  /** 0→1 do màn mở đầu điều khiển */
  assembleRef: React.MutableRefObject<number>;
  /** 0→1 độ mờ chung (tắt dần khi camera rời chiếc xe) */
  fadeRef: React.MutableRefObject<number>;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const group = useRef<THREE.Group>(null);
  const [cloud, setCloud] = useState<Cloud | null>(null);

  useEffect(() => {
    let alive = true;
    loadCloud()
      .then((c) => alive && setCloud(c))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const geometry = useMemo(() => {
    if (!cloud) return null;
    // máy yếu: lấy cách điểm để nhẹ
    const stride = tier >= 2 ? 1 : 3;
    const n = Math.floor(cloud.count / stride);
    const target = new Float32Array(n * 3);
    const weight = new Float32Array(n);
    const seeds = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const j = i * stride;
      target[i * 3] = cloud.target[j * 3];
      target[i * 3 + 1] = cloud.target[j * 3 + 1];
      target[i * 3 + 2] = cloud.target[j * 3 + 2];
      weight[i] = cloud.weight[j];
      seeds[i] = ((i * 2654435761) % 1000) / 1000;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(scatterCloud(n), 3));
    g.setAttribute("aTarget", new THREE.BufferAttribute(target, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    g.setAttribute("aW", new THREE.BufferAttribute(weight, 1));
    g.computeBoundingSphere();
    return g;
  }, [cloud, tier]);

  useEffect(() => () => geometry?.dispose(), [geometry]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAssemble: { value: 0 },
      uSize: { value: 2.0 },
      uPixelRatio: { value: dpr },
      uOpacity: { value: 1 },
      // champagne → gold đậm; nét đậm ngả sáng
      uColorA: { value: new THREE.Color("#f3d58f") },
      uColorB: { value: new THREE.Color("#b8862e") },
    }),
    [dpr]
  );

  const spin = useRef(-0.55); // góc 3/4 ban đầu, đầu xe hướng về camera
  const tilt = useRef(0);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const u = mat.current?.uniforms;
    if (u) {
      u.uTime.value += d;
      u.uAssemble.value = assembleRef.current;
      u.uOpacity.value = fadeRef.current;
    }
    const g = group.current;
    if (!g) return;
    // xoay chậm liên tục + con trỏ kéo thêm một góc nhỏ (không cộng dồn)
    spin.current += d * 0.12;
    const targetTilt = -state.pointer.y * 0.08;
    tilt.current += (targetTilt - tilt.current) * (1 - Math.exp(-4 * d));
    g.rotation.set(tilt.current, spin.current + state.pointer.x * 0.25, 0);
  });

  if (!geometry) return null;

  return (
    <group ref={group}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={mat}
          uniforms={uniforms}
          vertexShader={particleVert}
          fragmentShader={particleFrag}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
