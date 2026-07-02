"use client";

import { useLang, LangToggle } from "@/lib/i18n";

export type Variant = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export const VARIANT_KEYS: Variant[] = ["A", "B", "C", "D", "E", "F", "G"];

const OPTIONS: { key: Variant; label: string; hintVi: string; hintEn: string }[] = [
  { key: "A", label: "Editorial", hintVi: "Dark / cinematic", hintEn: "Dark / cinematic" },
  { key: "B", label: "Bento", hintVi: "Sạch / chuyên nghiệp", hintEn: "Clean / professional" },
  { key: "C", label: "Gradient", hintVi: "Trẻ trung / mobile", hintEn: "Playful / mobile-first" },
  { key: "D", label: "Verified Hub", hintVi: "Trung tâm xác minh đa nền tảng", hintEn: "Multi-platform verification hub" },
  { key: "E", label: "Cinematic", hintVi: "3D vàng gold / futuristic", hintEn: "3D gold / futuristic" },
  { key: "F", label: "Glass", hintVi: "Glassmorphism / sáng-tối", hintEn: "Glassmorphism / light-dark" },
  { key: "G", label: "Galaxy", hintVi: "Không gian & thời gian — quỹ đạo uy tín", hintEn: "Space & time — the orbit of trust" },
];

export default function VariantSwitcher({
  value,
  onChange,
}: {
  value: Variant;
  onChange: (v: Variant) => void;
}) {
  const { lang } = useLang();
  return (
    <div className="vsw-root" role="tablist" aria-label={lang === "en" ? "Choose interface style" : "Chọn phong cách giao diện"}>
      <span className="vsw-title">{lang === "en" ? "Theme" : "Giao diện"}</span>
      <div className="vsw-track">
        {OPTIONS.map((opt) => (
          <button
            key={opt.key}
            role="tab"
            aria-selected={value === opt.key}
            className={`vsw-btn${value === opt.key ? " active" : ""}${opt.key === "G" ? " future" : ""}`}
            onClick={() => onChange(opt.key)}
            title={lang === "en" ? opt.hintEn : opt.hintVi}
          >
            <span className="vsw-key">{opt.key}</span>
            <span className="vsw-label">{opt.label}</span>
          </button>
        ))}
      </div>
      <span className="vsw-lang">
        <LangToggle compact />
      </span>

      <style>{`
        .vsw-root{
          position:fixed;left:50%;bottom:20px;transform:translateX(-50%);
          z-index:9999;display:flex;align-items:center;gap:12px;
          padding:8px 10px 8px 16px;border-radius:100px;
          background:rgba(15,17,21,.82);backdrop-filter:blur(14px);
          border:1px solid rgba(255,255,255,.12);
          box-shadow:0 12px 40px rgba(0,0,0,.35);
          font-family:var(--font-inter),system-ui,sans-serif;
          max-width:calc(100vw - 24px);
        }
        .vsw-title{color:#9aa0aa;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;white-space:nowrap;}
        .vsw-track{display:flex;gap:4px;background:rgba(255,255,255,.06);border-radius:100px;padding:4px;overflow-x:auto;scrollbar-width:none;max-width:100%;}
        .vsw-track::-webkit-scrollbar{display:none;}
        .vsw-btn{
          flex:0 0 auto;white-space:nowrap;
          display:flex;align-items:center;gap:8px;border:none;cursor:pointer;
          background:transparent;color:#cfd2d8;padding:8px 14px;border-radius:100px;
          font-size:13px;font-weight:600;transition:.2s;font-family:inherit;
        }
        .vsw-btn:hover{color:#fff;}
        .vsw-btn.active{background:#fff;color:#0f1115;box-shadow:0 2px 10px rgba(0,0,0,.25);}
        .vsw-btn.future .vsw-label{background:linear-gradient(90deg,#22d3ee,#a78bfa);-webkit-background-clip:text;background-clip:text;color:transparent;font-weight:800;}
        .vsw-btn.future.active .vsw-label{color:#0f1115;background:none;-webkit-background-clip:initial;}
        .vsw-key{
          display:inline-flex;align-items:center;justify-content:center;
          width:18px;height:18px;border-radius:50%;font-size:11px;font-weight:800;
          background:rgba(255,255,255,.14);color:inherit;flex-shrink:0;
        }
        .vsw-btn.active .vsw-key{background:#0f1115;color:#fff;}
        .vsw-lang{color:#fff;flex-shrink:0;}
        @media(max-width:760px){
          .vsw-title{display:none;}
          .vsw-label{display:none;}
          .vsw-btn{padding:8px 11px;}
        }
      `}</style>
    </div>
  );
}
