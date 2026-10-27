// Backdrop phía sau khối kính: nền kem bóng + quầng sáng ấm + chữ khổng lồ cuộn theo hàng
// + dải sáng cobalt→tím→cam quét chéo (1 lần nhanh lúc reveal, sau đó tuần hoàn chậm).
// Mọi chuyển động điều khiển bằng uniform (uTime/uMouse/uReveal) — không tạo geometry mỗi frame.

export const backdropVert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const backdropFrag = /* glsl */ `
uniform sampler2D uTex;
uniform float uTime;
uniform float uReveal;
uniform float uMotion;
uniform float uRows;
uniform vec2 uMouse;
uniform vec3 uCream;
uniform vec3 uGlow;
uniform vec3 uShade;
uniform vec3 uCobalt;
uniform vec3 uViolet;
uniform vec3 uOrange;
varying vec2 vUv;

void main() {
  // --- nền: kem + quầng sáng ấm lệch nhẹ lên trên + vignette rất mềm (plane 2:1 → toạ độ đẳng hướng)
  vec2 c = (vUv - 0.5) * vec2(2.0, 1.0);
  float r = length(c);
  vec3 col = uCream;
  col = mix(col, uGlow, smoothstep(0.95, 0.0, length(c - vec2(0.08, 0.12))) * 0.7);
  col = mix(col, uShade, smoothstep(0.55, 1.25, r) * 0.55);

  // --- hai mảng màu trôi rất nhạt (giữ trang vẫn kem, chỉ "thở" màu)
  float t = uTime * 0.07 * uMotion;
  vec2 p1 = vec2(-0.85 + sin(t) * 0.25, 0.32 + cos(t * 0.8) * 0.12);
  vec2 p2 = vec2( 0.85 + cos(t * 0.9) * 0.25, -0.30 + sin(t * 0.6) * 0.12);
  col = mix(col, uCobalt, smoothstep(0.75, 0.0, length(c - p1)) * 0.07);
  col = mix(col, uOrange, smoothstep(0.75, 0.0, length(c - p2)) * 0.10);

  // --- marquee typography: mỗi hàng cuộn ngược chiều nhau, lệch pha theo hàng
  vec2 uv = vUv + uMouse * vec2(0.010, 0.006);
  float row = floor(uv.y * uRows);
  float dirn = mod(row, 2.0) * 2.0 - 1.0;
  float ux = uv.x + dirn * uTime * 0.009 * uMotion + row * 0.173;
  float mask = texture2D(uTex, vec2(ux, uv.y)).a * uReveal;

  // --- dải sáng quét chéo: pass A nhanh (reveal), rồi pass B tuần hoàn
  float d = vUv.x + vUv.y * 0.45;
  float pA = clamp((uTime - 0.35) / 2.1, 0.0, 1.0);
  float sA = -0.35 + pA * 2.15;
  float pB = fract((uTime - 3.4) / 11.0);
  float sB = -0.35 + pB * 2.15;
  float s = uTime < 3.4 ? sA : sB;
  float band = smoothstep(0.30, 0.0, abs(d - s));
  float k = clamp((d - s) / 0.30 * 0.5 + 0.5, 0.0, 1.0);
  vec3 bc = mix(uCobalt, uViolet, smoothstep(0.0, 0.5, k));
  bc = mix(bc, uOrange, smoothstep(0.5, 1.0, k));

  // chữ dập nổi (ink hơi sẫm hơn nền) → khi dải sáng đi qua, chữ sáng lên thành cobalt/cam
  vec3 ink = col * vec3(0.885, 0.875, 0.855);
  col = mix(col, ink, mask);
  col = mix(col, bc, band * mask * 0.92);
  col = mix(col, bc, band * 0.045);

  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
