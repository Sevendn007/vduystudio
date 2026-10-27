// GLSL cho "Particle Nebula Monogram". Mọi chuyển động chạy trong vertex shader bằng uniform
// (uProgress / uTime / uMouse) — KHÔNG cập nhật attribute mỗi frame.
// Các shader kết thúc bằng tonemapping/colorspace chunk của three → nhìn giống nhau dù render thẳng
// ra màn (mobile) hay qua EffectComposer HalfFloat + OutputPass (desktop).

export const SIMPLEX3 = /* glsl */ `
vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

export const PARTICLE_VERT = /* glsl */ `
attribute vec3 aStart;
attribute vec4 aRand; // x: delay, y: size, z: seed, w: edge (1 = vỏ, 0 = khí)
uniform float uTime;
uniform float uProgress;
uniform float uPixelRatio;
uniform float uBaseSize;
uniform float uAlphaMul;
uniform float uMotion;
uniform float uFlash;
uniform float uMouseStrength;
uniform vec3 uMouse;      // local space của nhóm hạt
uniform mat3 uDiscTilt;   // nghiêng đĩa thiên hà
uniform vec3 uDiscOffset;
uniform vec3 uCobalt;
uniform vec3 uWhite;
uniform vec3 uGold;
varying vec3 vColor;
varying float vAlpha;

${SIMPLEX3}

mat2 rot2(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

void main(){
  float edge = aRand.w;
  float delay = aRand.x * 0.5;
  float e = clamp((uProgress - delay) / (1.0 - delay), 0.0, 1.0);
  float ee = e * e * (3.0 - 2.0 * e);

  // 1) Đĩa thiên hà: quay chậm, khi hạt rời đĩa thì xoáy hút vào tâm
  vec3 s = aStart;
  float swirl = (1.0 - ee) * 2.8 + uTime * 0.08;
  s.xy = rot2(swirl) * s.xy;
  s = uDiscTilt * s + uDiscOffset;

  // 2) Nội suy đĩa → đích, cung bay vồng ra phía camera
  vec3 pos = mix(s, position, ee);
  float arc = sin(ee * 3.14159265);
  pos.z += arc * (0.6 + aRand.z * 1.6);
  pos.xy += arc * vec2(aRand.y - 0.5, aRand.x - 0.5) * 1.4;

  // 3) Nhiễu simplex: lúc bay thì cuộn mạnh, idle thì "thở" nhẹ (khí thở nhiều hơn vỏ)
  vec3 np = position * 1.3 + vec3(0.0, 0.0, uTime * 0.15) + aRand.z * 5.0;
  vec3 n = vec3(snoise(np), snoise(np + vec3(31.4, 7.7, 12.1)), snoise(np + vec3(-9.3, 21.6, 4.4)));
  float idleAmp = (0.022 + 0.06 * (1.0 - edge)) * uMotion;
  pos += n * (idleAmp * ee + 0.35 * (1.0 - ee));
  pos.xy *= 1.0 + 0.01 * uMotion * ee * sin(uTime * 0.8 + aRand.z * 6.2831);

  // 4) Chuột: đẩy + xoáy quanh con trỏ; nhả chuột → uMouseStrength về 0 → hạt trôi về chỗ cũ
  vec2 d = pos.xy - uMouse.xy;
  float dist = length(d);
  float infl = smoothstep(1.35, 0.0, dist) * uMouseStrength;
  infl *= infl;
  vec2 dir = d / max(dist, 1e-4);
  vec2 tang = vec2(-dir.y, dir.x);
  pos.xy += (dir * 0.6 + tang * 0.45) * infl * (0.5 + 0.5 * aRand.y);
  pos.z += infl * 0.7 * (aRand.z - 0.5);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  float sz = (0.6 + 0.9 * aRand.y) * (0.75 + 0.7 * edge) * (1.0 + 2.2 * (1.0 - ee)) * (1.0 + infl * 0.9);
  gl_PointSize = clamp(sz * uBaseSize * uPixelRatio / -mv.z, 1.0, 30.0);
  gl_Position = projectionMatrix * mv;

  // 5) Màu: cobalt (V = dấu tích xanh) → trắng → vàng ấm (D); nóng hơn khi đang bay
  float g = clamp(position.x * 0.2 + position.y * 0.12 + 0.5 + (aRand.z - 0.5) * 0.2, 0.0, 1.0);
  vec3 c = mix(uCobalt, uWhite, smoothstep(0.08, 0.52, g));
  c = mix(c, uGold, smoothstep(0.56, 1.0, g));
  vec3 hot = mix(uCobalt * 1.8, uWhite * 1.4, aRand.z);
  c = mix(hot, c, ee);
  float twinkle = 0.78 + 0.22 * sin(uTime * (1.5 + aRand.z * 3.0) + aRand.z * 50.0);
  float bright = mix(0.6, 1.3, edge) * twinkle * (1.0 + uFlash * 1.6) * (1.0 + infl * 1.5);
  vColor = c * bright;
  vAlpha = mix(0.4, 0.16, edge) * (0.75 + 0.25 * ee) * uAlphaMul;
}
`;

export const PARTICLE_FRAG = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float r2 = dot(c, c);
  if (r2 > 0.25) discard;
  float a = 1.0 - r2 * 4.0;
  a *= a;
  float core = exp(-r2 * 60.0);
  gl_FragColor = vec4(vColor * (a + core), vAlpha * a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export const STAR_VERT = /* glsl */ `
attribute float aSize;
attribute float aSeed;
uniform float uTime;
uniform float uPixelRatio;
varying float vTw;
varying float vSeed;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = clamp(aSize * uPixelRatio * 60.0 / -mv.z, 1.0, 6.0);
  gl_Position = projectionMatrix * mv;
  vTw = 0.55 + 0.45 * sin(uTime * (0.8 + aSeed * 2.0) + aSeed * 40.0);
  vSeed = aSeed;
}
`;

export const STAR_FRAG = /* glsl */ `
uniform vec3 uTintA;
uniform vec3 uTintB;
varying float vTw;
varying float vSeed;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float r2 = dot(c, c);
  if (r2 > 0.25) discard;
  float a = 1.0 - r2 * 4.0;
  a *= a;
  vec3 col = mix(uTintA, uTintB, vSeed);
  gl_FragColor = vec4(col * vTw, a * 0.9);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export const NEBULA_VERT = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// OCTAVES được đặt qua material.defines (3 desktop / 2 mobile)
export const NEBULA_FRAG = /* glsl */ `
uniform float uTime;
uniform float uAspect;
uniform vec2 uMouse;
uniform vec3 uInk;
uniform vec3 uNavy;
uniform vec3 uCobalt;
uniform vec3 uGold;
varying vec2 vUv;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < OCTAVES; i++){ v += a * vnoise(p); p = m * p; a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = vUv - 0.5;
  uv.x *= uAspect;
  vec2 p = uv * 2.2 + uMouse * 0.08;
  float t = uTime * 0.03;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  float f = fbm(p + 1.6 * q + vec2(1.7, 9.2) + t * 0.5);

  vec3 col = mix(uInk, uNavy, smoothstep(0.2, 0.8, f));
  float streak = smoothstep(0.55, 0.95, f) * (0.6 + 0.4 * q.x);
  col += uCobalt * streak * 0.55;
  // vệt ấm góc dưới phải + quầng cobalt sau monogram
  float warm = exp(-length(uv - vec2(0.42, -0.3)) * 1.6) * 0.18;
  col += uGold * warm * (0.5 + f);
  float halo = exp(-dot(uv, uv) * 2.5) * 0.35;
  col += uCobalt * halo;
  // vignette ấm (không đen bẩn)
  float v = smoothstep(1.4, 0.3, length(uv));
  col = mix(col * 0.35 + uGold * 0.015, col, v);
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.012;

  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
