"use client";
import { useEffect, useRef, useState } from "react";

// "LIQUID COBALT" — chrome lỏng màu cobalt, raw WebGL 1 (không three.js, ~4KB).
// - Render ở độ phân giải thấp (scale 0.45–0.7) rồi CSS phóng to → nhẹ cả trên mobile.
// - Chỉ chạy khi nằm trong viewport + tab đang hiện. Reduced-motion: vẽ 1 khung tĩnh.
// - Không có WebGL / mất context → nền gradient CSS (.v3-liquid-fallback).
// - Chuột "đẩy" bề mặt lỏng (uMouse/uHover, có easing).

const VERT = `attribute vec2 a;varying vec2 vUv;void main(){vUv=a*0.5+0.5;gl_Position=vec4(a,0.,1.);}`;

const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uHover; uniform float uDim;
varying vec2 vUv;
float field(vec2 p, float t){
  vec2 d = p - uMouse; float k = exp(-dot(d,d)*1.6)*uHover;
  p += d*k*0.55;
  for(int i=1;i<7;i++){
    float fi=float(i);
    p.x += 0.55/fi*sin(fi*p.y*0.85 + t*0.32 + 0.37*fi);
    p.y += 0.48/fi*cos(fi*p.x*0.75 - t*0.27 + 0.61*fi);
  }
  return sin(p.x*1.05 + p.y*0.8 + t*0.12);
}
void main(){
  vec2 uv = vUv; float asp = uRes.x/uRes.y;
  vec2 p = (uv-0.5)*vec2(asp,1.0)*3.2;
  float t = uTime;
  float e = 0.012;
  float h = field(p,t), hx = field(p+vec2(e,0.),t), hy = field(p+vec2(0.,e),t);
  vec3 n = normalize(vec3(-(hx-h)/e*0.5, -(hy-h)/e*0.5, 1.0));
  vec3 l = normalize(vec3(-0.35,0.55,0.75));
  vec3 r = reflect(vec3(0.,0.,-1.), n);
  float diff = clamp(dot(n,l),0.,1.);
  float s1 = sin(r.y*7.0 + r.x*2.5 + 0.6);
  float s2 = sin(r.x*5.0 - r.y*3.0 + 2.1);
  float strips = smoothstep(0.55,0.97,s1) + 0.6*smoothstep(0.75,0.99,s2);
  float dark = smoothstep(0.2,-0.8,s1);
  float spec = pow(max(dot(r,l),0.0), 90.0);
  float fres = pow(1.0-n.z, 1.4);
  vec3 deep = vec3(0.006,0.016,0.11);
  vec3 cob  = vec3(0.07,0.23,0.86);
  vec3 lite = vec3(0.66,0.76,1.0);
  vec3 col = mix(deep, cob, smoothstep(0.0,0.9,diff));
  col = mix(col, deep, dark*0.7*fres);
  col = mix(col, lite, clamp(strips,0.,1.)*(0.3+0.6*fres));
  col += vec3(1.0)*spec*1.0;
  col += vec3(0.55,0.7,1.0)*fres*0.12;
  col += vec3(0.25,0.1,0.35)*smoothstep(0.6,1.0,fres)*0.12;
  float vig = smoothstep(1.35,0.25,length((uv-0.5)*vec2(asp*0.8,1.0)));
  col *= mix(0.5,1.0,vig);
  col *= uDim;
  float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233)))*43758.5453);
  col += (g-0.5)*0.025;
  gl_FragColor = vec4(col,1.0);
}`;

type Props = { className?: string; dim?: number; seed?: number };

export default function LiquidCanvas({ className, dim = 0.92, seed = 3 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance", preserveDrawingBuffer: false });
    if (!gl) { setFailed(true); return; }

    const mk = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = mk(gl.VERTEX_SHADER, VERT);
    const fs = mk(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) { setFailed(true); return; }
    const pr = gl.createProgram()!;
    gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { setFailed(true); return; }
    gl.useProgram(pr);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(pr, n);
    const uRes = U("uRes"), uTime = U("uTime"), uMouse = U("uMouse"), uHover = U("uHover"), uDim = U("uDim");
    gl.uniform1f(uDim, dim);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none)").matches || window.innerWidth < 760;
    const q = new URLSearchParams(window.location.search).get("lq");
    const scale = q ? Math.min(1, Math.max(0.2, Number(q))) : touch ? 0.42 : Math.min(window.devicePixelRatio || 1, 1.5) * 0.5;
    const frameMs = touch ? 1000 / 30 : 0;

    let w = 0, h = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(2, Math.round(r.width * scale));
      h = Math.max(2, Math.round(r.height * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
    };
    resize();
    const ro = new ResizeObserver(() => { resize(); if (!running) draw(lastT); });
    ro.observe(canvas);

    // chuột → toạ độ không gian shader
    const mouse = { x: 0.7, y: 0.25, tx: 0.7, ty: 0.25, hov: 0.35, thov: 0.35 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      const u = (e.clientX - r.left) / r.width, v = 1 - (e.clientY - r.top) / r.height;
      const asp = r.width / r.height;
      mouse.tx = (u - 0.5) * asp * 3.2;
      mouse.ty = (v - 0.5) * 3.2;
      mouse.thov = 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let lastT = seed;
    const draw = (t: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      mouse.thov += (0.35 - mouse.thov) * 0.01;
      mouse.hov += (mouse.thov - mouse.hov) * 0.05;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uHover, mouse.hov);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let raf = 0, running = false, visible = true, last = 0;
    const start = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (frameMs && now - last < frameMs) return;
      last = now;
      lastT = seed + (now - start) / 1000;
      draw(lastT);
    };
    const play = () => { if (running || reduced) return; running = true; raf = requestAnimationFrame(loop); };
    const pause = () => { running = false; cancelAnimationFrame(raf); };
    const sync = () => (visible && !document.hidden ? play() : pause());

    draw(seed);
    canvas.dataset.ready = "1";
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; sync(); }, { rootMargin: "80px" });
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    const onLost = (e: Event) => { e.preventDefault(); pause(); setFailed(true); };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      pause();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", sync);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteProgram(pr); gl.deleteShader(vs); gl.deleteShader(fs); gl.deleteBuffer(buf);
    };
  }, [dim, seed]);

  return (
    <div className={`v3-liquid${failed ? " v3-liquid-fallback" : ""}${className ? ` ${className}` : ""}`} aria-hidden>
      {!failed && <canvas ref={ref} />}
    </div>
  );
}
