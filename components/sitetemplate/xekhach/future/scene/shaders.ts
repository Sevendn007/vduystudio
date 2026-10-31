// Shader cho bản 2100: hạt lắp thành xe, lưới bản đồ phát sáng.

export const particleVert = /* glsl */ `
uniform float uTime;
uniform float uAssemble;   // 0 = tán ra, 1 = đã lắp thành xe
uniform float uSize;
uniform float uPixelRatio;
attribute vec3 aTarget;    // vị trí trên thân xe
attribute float aSeed;
attribute float aW;        // độ đậm của nét ảnh tại điểm này (0→1)
varying float vGlow;
varying float vSeed;
varying float vW;

void main() {
  // bay theo quỹ đạo cong, mỗi hạt tới đích ở một nhịp hơi khác nhau
  float d = clamp((uAssemble - aSeed * 0.35) / 0.65, 0.0, 1.0);
  float e = d * d * (3.0 - 2.0 * d);

  vec3 scattered = position;
  // xoáy nhẹ khi còn tán
  float sw = (1.0 - e) * 0.6;
  float a = uTime * 0.12 + aSeed * 6.2831;
  scattered.x += sin(a) * sw;
  scattered.z += cos(a) * sw;
  scattered.y += sin(a * 1.7) * sw * 0.5;

  vec3 pos = mix(scattered, aTarget, e);
  // vồng lên một chút giữa đường cho giống "hút về"
  pos.y += sin(e * 3.14159) * (1.0 - aSeed) * 1.4 * (1.0 - e) * 2.0;

  // rung rất nhẹ sau khi đã lắp
  pos += vec3(
    sin(uTime * 1.3 + aSeed * 12.0),
    cos(uTime * 1.1 + aSeed * 9.0),
    sin(uTime * 0.9 + aSeed * 15.0)
  ) * 0.015 * e;

  vGlow = e;
  vSeed = aSeed;
  vW = aW;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (0.7 + aW * 1.3 + aSeed * 0.3) * (18.0 / -mv.z);
}
`;

export const particleFrag = /* glsl */ `
precision mediump float;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;
varying float vGlow;
varying float vSeed;
varying float vW;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float core = smoothstep(0.5, 0.0, d);
  // nét đậm → champagne sáng; nét mờ → gold trầm
  vec3 col = mix(uColorB, uColorA, vW);
  col = mix(col, vec3(1.0, 0.97, 0.9), vGlow * vW * 0.25);
  float alpha = core * uOpacity * (0.18 + vW * 0.55) * (0.35 + vGlow * 0.65);
  gl_FragColor = vec4(col * (0.55 + vW * 0.45 + vGlow * 0.2), alpha);
}
`;

export const fieldVert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Nền "sương cực quang": các dải màu mềm trôi chậm, không một đường kẻ nào.
// Thay cho lưới ô vuông cũ — lưới trông như giấy kẻ và cắt vụn chữ phía trên.
export const auroraFrag = /* glsl */ `
precision mediump float;
uniform float uTime;
uniform float uReveal;
uniform vec3 uCold;
uniform vec3 uWarm;
varying vec2 vUv;

// nhiễu giá trị trơn, đủ dùng cho dải sương
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float r = length(p * vec2(1.0, 1.25));

  float t = uTime * 0.05;
  vec2 q = vUv * 2.6;
  float n = fbm(q + vec2(t, -t * 0.6));
  float n2 = fbm(q * 1.7 + vec2(-t * 0.8, t * 0.4) + n);

  // hai dải sương chồng nhau, dải ấm mỏng hơn
  float cold = smoothstep(0.35, 0.95, n2);
  float warm = smoothstep(0.62, 1.0, n) * 0.6;

  vec3 col = uCold * cold + uWarm * warm;
  float edge = 1.0 - smoothstep(0.25, 1.05, r);
  float a = (cold * 0.5 + warm * 0.45) * edge * uReveal;

  gl_FragColor = vec4(col, a);
}
`;

// Dòng hạt chạy dọc tuyến: hạt đứng yên, chỉ có vệt sáng trôi qua.
export const streamVert = /* glsl */ `
uniform float uTime;
uniform float uReveal;
uniform float uSpeed;
uniform float uSize;
uniform float uPixelRatio;
attribute float aT;      // vị trí dọc tuyến 0→1
attribute float aSeed;
varying float vLit;

void main() {
  // cửa sổ sáng chạy vòng quanh tuyến
  float head = fract(uTime * uSpeed);
  float d = aT - head;
  d = d - floor(d + 0.5);          // khoảng cách vòng tròn tới đầu vệt
  float lit = smoothstep(0.16, 0.0, abs(d));

  // hạt chỉ hiện dần theo uReveal, từ đầu tuyến về cuối. step() chặn hạt ở
  // vị trí 0: smoothstep(-0.12, 0, 0) = 1 nên nó từng sáng lên dù tuyến chưa bật.
  float born = smoothstep(aT - 0.12, aT, uReveal) * step(0.01, uReveal);
  vLit = lit * born;

  vec3 pos = position;
  pos.y += sin(uTime * 0.8 + aSeed * 9.0) * 0.08;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (0.55 + vLit * 1.5 + aSeed * 0.4) * (26.0 / -mv.z);
}
`;

export const streamFrag = /* glsl */ `
precision mediump float;
uniform vec3 uColor;
uniform vec3 uHot;
varying float vLit;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float core = smoothstep(0.5, 0.0, d);
  vec3 col = mix(uColor, uHot, vLit);
  float a = core * (0.14 + vLit * 0.86);
  gl_FragColor = vec4(col * (0.7 + vLit), a);
}
`;
