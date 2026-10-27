// GLSL tiêm vào MeshPhysicalMaterial (onBeforeCompile) + shader nền toàn màn hình.

export const RIBBON_VERT_HEAD = /* glsl */ `
uniform float uTime;
uniform float uProgress;   // 0→1: dải chảy dọc đường tâm
uniform float uSettle;     // 0→1: sau reveal (bỏ giọt đầu, đuôi gọn lại)
uniform float uWave;       // biên độ gợn sóng đường tâm
uniform float uWaveFreq;   // tần số gợn (theo t 0..1)
uniform float uTwist;      // biên độ xoắn dải (rad)
uniform float uBreath;     // nhịp phồng/xẹp bề rộng
uniform float uPush;       // lực chuột (0..1)
uniform float uLen;        // độ dài cung của curve (để sửa khung khi dịch chuyển)
uniform vec3 uHead;        // điểm đầu dải tại uProgress (object space)
uniform vec3 uMouse;       // con trỏ chiếu lên mặt z=0 (object space)
attribute vec3 aC;
attribute vec3 aN;
attribute vec3 aB;
attribute vec2 aLoc;
attribute vec2 aLocN;
attribute float aT;

mat2 rbRot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

void rbRibbon(out vec3 oPos, out vec3 oNrm) {
  float t = aT;
  vec3 C = aC;
  vec3 N = aN;
  vec3 B = aB;
  vec3 T = cross(N, B);

  // --- chuột: trường lực Gauss quanh con trỏ (trong mặt phẳng XY object)
  vec3 dM = C - uMouse; dM.z = 0.0;
  float dd = dot(dM, dM);
  float f = uPush * exp(-dd * 1.9);

  // --- xoắn: hồ sơ thiết kế (cuộn ở vài đoạn) + cuộn sống chậm + khuấy quanh chuột
  float th = uTwist * sin(t * 6.2831853 * 1.25 + 0.9)
           + 0.2 * sin(t * 9.0 - uTime * 0.9)
           + f * 1.5;
  mat2 R = rbRot(th);
  vec2 loc = R * aLoc;
  vec2 ln = R * aLocN;

  // --- reveal: đầu dải thon dần tới điểm uHead; giọt phồng ngay sau đầu khi đang chảy
  float headLen = mix(0.13, 0.035, uSettle);
  float head = 1.0 - smoothstep(uProgress - headLen, uProgress, t);
  float dh = (uProgress - 0.055 - t) * 26.0;
  float drop = 1.0 + (1.0 - uSettle) * 0.6 * exp(-dh * dh);
  float ends = smoothstep(0.0, 0.045, t);
  float breath = 1.0 + uBreath * sin(t * 15.0 - uTime * 1.7);
  float sc = head * drop * ends * breath;
  loc *= sc;

  // --- gợn sóng đường tâm (+ đạo hàm theo t để sửa khung → pháp tuyến đúng)
  float ph  = t * uWaveFreq - uTime * 1.5;
  float ph2 = t * uWaveFreq * 0.61 + uTime * 1.1;
  float w2 = uWave * 0.7;
  vec3 off  = N * (uWave * sin(ph)) + B * (w2 * cos(ph2));
  vec3 dOff = N * (uWave * uWaveFreq * cos(ph)) - B * (w2 * uWaveFreq * 0.61 * sin(ph2));

  // --- đẩy theo chuột: ra xa con trỏ + nhô về phía camera
  vec3 pushDir = normalize(dM + vec3(0.0, 0.0002, 0.0));
  off += pushDir * (f * 0.36) + vec3(0.0, 0.0, 0.55) * f;

  // --- khung sau biến dạng
  vec3 Tn = normalize(T * uLen + dOff);
  vec3 Nn = normalize(N - Tn * dot(N, Tn));
  vec3 Bn = cross(Tn, Nn);

  // --- phần chưa chảy tới: gom về điểm đầu
  float gone = step(uProgress, t);
  C = mix(C, uHead, gone);
  off *= (1.0 - gone);

  oPos = C + off + Nn * loc.x + Bn * loc.y;
  oNrm = normalize(Nn * ln.x + Bn * ln.y);
}
`;

export const RIBBON_NORMAL_INJECT = /* glsl */ `
vec3 rbP; vec3 rbN;
rbRibbon(rbP, rbN);
vec3 objectNormal = rbN;
`;

export const RIBBON_POSITION_INJECT = /* glsl */ `
vec3 transformed = rbP;
`;

// ---------- nền: gradient deep ink → navy, vignette ấm, hào quang cobalt, grain chống banding ----------
export const BG_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.9999, 1.0);
}
`;

export const BG_FRAG = /* glsl */ `
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;   // -1..1
uniform vec3 uInk;
uniform vec3 uNavy;
uniform vec3 uWarm;
uniform vec3 uCobalt;
varying vec2 vUv;

float rbHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  p.x *= uRes.x / max(uRes.y, 1.0);
  vec2 m = uMouse * 0.08;

  // gradient chéo: ink dưới-trái → navy trên-phải
  float g = smoothstep(-1.3, 1.25, vUv.y * 1.3 + vUv.x * 0.45 - 0.35);
  vec3 col = mix(uInk, uNavy, g);

  // hào quang ấm trên-phải (đèn studio)
  vec2 dw = p - (vec2(1.15, 0.85) + m);
  col += uWarm * exp(-dot(dw, dw) * 0.85) * 0.75;

  // hào quang cobalt dưới-trái, thở chậm
  vec2 dc = p - (vec2(-1.25, -0.7) - m);
  float breathe = 0.85 + 0.15 * sin(uTime * 0.35);
  col += uCobalt * exp(-dot(dc, dc) * 0.6) * 0.7 * breathe;

  // dải sáng mờ sau logo (để chrome có nền sáng hơn ở giữa, không "đen bẩn")
  float by = p.y - 0.15 + p.x * 0.12;
  float bx = p.x * 0.55;
  float band = exp(-by * by * 1.6) * exp(-bx * bx);
  col += mix(uNavy, uCobalt, 0.35) * band * 0.55;

  // vignette
  float v = smoothstep(2.1, 0.45, length(p * vec2(0.82, 1.0)));
  col *= mix(0.5, 1.0, v);

  // grain nhẹ chống banding
  col += (rbHash(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) * (2.0 / 255.0);

  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

// ---------- bóng mềm dưới logo cho mobile (thay sàn phản chiếu) ----------
export const GLOW_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const GLOW_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
varying vec2 vUv;
void main() {
  vec2 p = (vUv - 0.5) * vec2(2.0, 2.0);
  float a = exp(-dot(p, p) * 3.2) * uOpacity;
  gl_FragColor = vec4(uColor, a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
