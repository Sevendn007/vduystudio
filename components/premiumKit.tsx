"use client";

// Bộ component dùng chung cho style PREMIUM — nhúng được ở mọi trang
// (trang chủ, /du-an, /dich-vu/[slug]). Mỗi component tự mang CSS.
// - SpriteImg: sprite tách nền từ logo.png (mark / hành tinh)
// - Mark3D:   mark VJ + tích xanh xếp lớp có độ dày, xoay quanh trục dọc
// - Wordmark: chữ VDUY (teal) + STUDIO (bạc) với vệt sáng chạy qua lại
// - IPhone:   khung điện thoại viền titan + Dynamic Island, ảnh 9:19.5

import { useEffect, useState } from "react";
import { extractMark, extractPlanet } from "@/lib/logoSprites";
import type { DbProject } from "@/lib/data";

// Dự án showcase khi DB trống — dùng chung cho trang chủ & /du-an.
export const DEFAULT_PROJECTS: DbProject[] = [
  { id: "p1", platform: "tiktok", tag: "Verification", title: "Khuyến Dương", result: "TikTok · 1,7Tr Follower · 62,7Tr Thích", image_url: "/images/d1.png" },
  { id: "p2", platform: "tiktok", tag: "Verification", title: "Chí Khang", result: "TikTok · 2,7Tr Follower · 239,3Tr Thích", image_url: "/images/d2.png" },
  { id: "p3", platform: "tiktok", tag: "Verification", title: "Chuyện Ma Chú 3 Duy", result: "TikTok · 3,2Tr Follower · 148,5Tr Thích", image_url: "/images/d3.png" },
  { id: "p4", platform: "tiktok", tag: "Verification", title: "Mai Trí Thức", result: "TikTok · 2,2Tr Follower · 178,1Tr Thích", image_url: "/images/d4.png" },
];

export function SpriteImg({ kind, alt = "", className }: { kind: "mark" | "p1" | "p2"; alt?: string; className?: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    const p = kind === "mark" ? extractMark() : extractPlanet(kind);
    p.then((u) => mounted && setUrl(u)).catch(() => {});
    return () => { mounted = false; };
  }, [kind]);
  if (!url) return <span className={className} aria-hidden />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt={alt} className={className} draggable={false} />;
}

// Mark 3D: bước lớp 0.6px (<1px) nên khi quay nghiêng các lớp hoà thành
// cạnh liền khối, không lộ sọc.
export function Mark3D({ layers = 32, className, alt = "" }: { layers?: number; className?: string; alt?: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    extractMark().then((u) => mounted && setUrl(u)).catch(() => {});
    return () => { mounted = false; };
  }, []);
  return (
    <div className={`pm-mark-stack ${className ?? ""}`}>
      {url &&
        Array.from({ length: layers }, (_, i) => {
          const isFront = i === layers - 1;
          const isBack = i === 0;
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt={isFront ? alt : ""}
              aria-hidden={!isFront}
              draggable={false}
              className={isFront ? "front" : isBack ? "back" : "side"}
              style={{ transform: `translateZ(${(i - (layers - 1) / 2) * 0.6}px)` }}
            />
          );
        })}
      <style>{`
.pm-mark-stack{position:relative;width:100%;aspect-ratio:1.32;transform-style:preserve-3d;
 animation:pmSpinY 20s linear infinite;will-change:transform;}
.pm-mark-stack img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;will-change:transform;}
/* lớp hông: không dùng drop-shadow nặng — brightness + opacity nhẹ cho mượt FPS */
.pm-mark-stack img.side{filter:brightness(1.5);opacity:.18;}
.pm-mark-stack img.front,.pm-mark-stack img.back{filter:drop-shadow(0 22px 50px rgba(20,184,166,.35)) drop-shadow(0 0 40px rgba(45,212,191,.2));}
.pm-mark-stack.nav{animation-duration:14s;}
@keyframes pmSpinY{from{transform:rotateY(0deg)}to{transform:rotateY(360deg)}}
@media(prefers-reduced-motion:reduce){.pm-mark-stack{animation:none;}}
      `}</style>
    </div>
  );
}

// Wordmark VDUYSTUDIO: màu đồng nhất mọi nơi (VDUY teal · STUDIO bạc chrome)
// + vệt sáng trắng chạy qua lại (alternate). part="vduy"/"studio" để render
// tách hai bên logo như hero.
export function Wordmark({ className, part = "full" }: { className?: string; part?: "vduy" | "studio" | "full" }) {
  const text = part === "vduy" ? "VDUY" : part === "studio" ? "STUDIO" : "VDUYSTUDIO";
  return (
    <span className={`pm-wm ${className ?? ""}`} aria-label={text}>
      <span className="pm-wm-base" aria-hidden>
        {part !== "studio" && <i>VDUY</i>}
        {part !== "vduy" && <em>STUDIO</em>}
      </span>
      <span className="pm-wm-shine" aria-hidden>{text}</span>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
.pm-wm{position:relative;display:inline-block;font-family:'Anton',sans-serif;font-weight:400;line-height:1;
 letter-spacing:.02em;text-transform:uppercase;white-space:nowrap;}
.pm-wm-base i{font-style:normal;background:linear-gradient(180deg,#a7f3d0 0%,#2dd4bf 45%,#0e7490 100%);
 -webkit-background-clip:text;background-clip:text;color:transparent;}
.pm-wm-base em{font-style:normal;background:linear-gradient(180deg,#ffffff 10%,#cfdae4 40%,#8fa3b8 55%,#eef4f9 78%,#aab9c9 100%);
 -webkit-background-clip:text;background-clip:text;color:transparent;}
.pm-wm-shine{position:absolute;inset:0;pointer-events:none;
 background:linear-gradient(110deg,transparent 42%,rgba(255,255,255,.9) 50%,transparent 58%);
 background-size:260% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;
 animation:pmShine 4.2s ease-in-out infinite alternate;}
@keyframes pmShine{from{background-position:130% 0}to{background-position:-130% 0}}
.pm-wm.nav{font-size:16px;letter-spacing:.08em;}
.pm-wm.foot{font-size:clamp(26px,4vw,42px);}
.pm-wm.hero{font-size:inherit;letter-spacing:inherit;line-height:inherit;}
@media(prefers-reduced-motion:reduce){.pm-wm-shine{animation:none;opacity:0;}}
      `}</style>
    </span>
  );
}

// Khung iPhone; ảnh DB lỗi/thiếu → rơi về fallback nên khung không bao giờ trống.
export function IPhone({ src, fallback, alt, size = "md", tilt }: { src: string | null; fallback?: string | null; alt: string; size?: "lg" | "md" | "sm"; tilt?: "l" | "r" }) {
  const chain = [src, fallback].filter(Boolean) as string[];
  const [idx, setIdx] = useState(0);
  const cur = chain[idx];
  return (
    <div className={`pm-phone ${size} ${tilt === "l" ? "tilt-l" : tilt === "r" ? "tilt-r" : ""}`}>
      <div className="pm-phone-screen">
        {cur ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cur} alt={alt} loading="lazy" onError={() => setIdx((i) => i + 1)} />
        ) : (
          <div className="pm-phone-empty">{alt}</div>
        )}
        <span className="pm-island" />
      </div>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600&display=swap');
.pm-phone{position:relative;flex-shrink:0;border-radius:46px;padding:7px;
 background:linear-gradient(160deg,#57616e 0%,#181e28 26%,#0a0f16 72%,#3b4450 100%);
 box-shadow:0 34px 74px rgba(0,0,0,.62),0 0 56px rgba(45,212,191,.13),inset 0 0 2px rgba(255,255,255,.4);}
.pm-phone::before{content:"";position:absolute;right:-2.5px;top:118px;width:3px;height:62px;border-radius:2px;background:#3b4450;}
.pm-phone::after{content:"";position:absolute;left:-2.5px;top:96px;width:3px;height:30px;border-radius:2px;background:#3b4450;box-shadow:0 44px 0 #3b4450;}
.pm-phone.lg{width:clamp(210px,22vw,252px);}
.pm-phone.md{width:clamp(190px,20vw,218px);}
.pm-phone.sm{width:180px;}
.pm-phone.tilt-l{transform:rotate(-6deg);}
.pm-phone.tilt-r{transform:rotate(6deg);}
.pm-phone-screen{position:relative;border-radius:39px;overflow:hidden;aspect-ratio:1320/2868;background:#000;}
.pm-phone-screen img{width:100%;height:100%;object-fit:cover;display:block;}
.pm-phone-screen::after{content:"";position:absolute;inset:0;pointer-events:none;
 background:linear-gradient(115deg,rgba(255,255,255,.10) 0%,rgba(255,255,255,.03) 26%,transparent 44%);}
.pm-island{position:absolute;top:13px;left:50%;transform:translateX(-50%);width:27%;height:21px;background:#000;
 border-radius:20px;z-index:5;box-shadow:inset 0 0 3px rgba(255,255,255,.18);}
.pm-phone-empty{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#3d6464;
 font-family:'Oswald',sans-serif;font-size:15px;letter-spacing:1px;text-transform:uppercase;text-align:center;padding:12px;}
@media(max-width:560px){
 .pm-phone.lg,.pm-phone.md,.pm-phone.sm{width:min(210px,58vw);}
 .pm-phone.tilt-l,.pm-phone.tilt-r{transform:none;}
}
      `}</style>
    </div>
  );
}
